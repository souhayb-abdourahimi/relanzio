import tls from 'node:tls';
import { db } from './db.js';
import { analyzeReply } from './prospecting.js';
import { log } from './observability.js';
import { deterministicReplyCategory, normalizeReplyCategory, parseImapReply, resolveProspectIdentity } from './imap-reply-parser.js';

const DEFAULT_MAILBOXES=['INBOX','Junk','Spam'];
const MAX_MESSAGE_BYTES=2*1024*1024;
const RECENT_DAYS=7;

function safeError(code,message){const e=new Error(message);e.code=code;return e;}
function imapQuote(value=''){return `"${String(value).replace(/\\/g,'\\\\').replace(/"/g,'\\"')}"`;}
function escapeRegex(value=''){return String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function imapDate(date){return `${String(date.getUTCDate()).padStart(2,'0')}-${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getUTCMonth()]}-${date.getUTCFullYear()}`;}
function extractLiteral(buffer){
  const ascii=buffer.toString('latin1');
  const m=/\{(\d+)\}\r\n/.exec(ascii);
  if(!m)return Buffer.alloc(0);
  const start=m.index+m[0].length, size=Number(m[1]);
  return buffer.subarray(start,start+size);
}
function parseSearchUids(buffer){
  const text=buffer.toString('latin1');
  const m=text.match(/(?:^|\r\n)\* SEARCH([^\r\n]*)/i);
  if(!m)return [];
  return m[1].trim().split(/\s+/).filter(x=>/^\d+$/.test(x)).slice(-250);
}
function parseMessageSize(buffer){const m=buffer.toString('latin1').match(/RFC822\.SIZE\s+(\d+)/i);return m?Number(m[1]):null;}
function parseUidValidity(buffer){const m=buffer.toString('latin1').match(/\[UIDVALIDITY\s+(\d+)\]/i);return m?m[1]:'unknown';}

class BufferReader{
  constructor(socket){
    this.socket=socket;this.buffer=Buffer.alloc(0);this.waiter=null;
    socket.on('data',chunk=>{this.buffer=Buffer.concat([this.buffer,chunk]);this.flush();});
    socket.on('error',err=>{if(this.waiter){const w=this.waiter;this.waiter=null;w.reject(err);}});
    socket.on('close',()=>{if(this.waiter){const w=this.waiter;this.waiter=null;w.reject(safeError('IMAP_CONNECTION_CLOSED','Connexion IMAP interrompue.'));}});
  }
  flush(){if(!this.waiter)return;const {matcher,resolve,timer}=this.waiter;const found=matcher(this.buffer);if(!found)return;clearTimeout(timer);this.waiter=null;const out=this.buffer.subarray(0,found);this.buffer=this.buffer.subarray(found);resolve(out);}
  read(matcher,timeoutMs){
    const found=matcher(this.buffer);if(found){const out=this.buffer.subarray(0,found);this.buffer=this.buffer.subarray(found);return Promise.resolve(out);}
    if(this.waiter)return Promise.reject(safeError('IMAP_PROTOCOL_ERROR','Lecture IMAP concurrente interdite.'));
    return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{this.waiter=null;reject(safeError('IMAP_TIMEOUT','Délai IMAP dépassé.'));},timeoutMs);this.waiter={matcher,resolve,reject,timer};});
  }
  line(timeoutMs){return this.read(buf=>{const i=buf.indexOf('\r\n');return i<0?0:i+2;},timeoutMs);}
  tagged(tag,timeoutMs){
    const re=new RegExp(`(?:^|\\r\\n)${escapeRegex(tag)} (?:OK|NO|BAD)[^\\r\\n]*\\r\\n`,'i');
    return this.read(buf=>{const s=buf.toString('latin1');const m=re.exec(s);return m?m.index+m[0].length:0;},timeoutMs);
  }
}

class ReadOnlyImapClient{
  constructor({host,port,user,password,timeoutMs=15000}){this.host=host;this.port=port;this.user=user;this.password=password;this.timeoutMs=timeoutMs;this.tag=0;this.socket=null;this.reader=null;}
  async connect(){
    this.socket=tls.connect({host:this.host,port:this.port,servername:this.host,rejectUnauthorized:true,minVersion:'TLSv1.2'});
    this.socket.setTimeout(this.timeoutMs,()=>this.socket.destroy(safeError('IMAP_TIMEOUT','Délai IMAP dépassé.')));
    await new Promise((resolve,reject)=>{const ok=()=>{cleanup();resolve();};const fail=()=>{cleanup();reject(safeError('IMAP_TLS_ERROR','Connexion TLS IMAP impossible.'));};const cleanup=()=>{this.socket.off('secureConnect',ok);this.socket.off('error',fail);};this.socket.once('secureConnect',ok);this.socket.once('error',fail);});
    if(!this.socket.authorized)throw safeError('IMAP_TLS_ERROR','Certificat TLS IMAP non autorisé.');
    this.reader=new BufferReader(this.socket);
    const greeting=(await this.reader.line(this.timeoutMs)).toString('latin1');
    if(!/^\* (OK|PREAUTH)\b/i.test(greeting))throw safeError('IMAP_PROTOCOL_ERROR','Salutation IMAP invalide.');
    if(!/^\* PREAUTH\b/i.test(greeting)){
      const auth=await this.command(`LOGIN ${imapQuote(this.user)} ${imapQuote(this.password)}`);
      if(auth.status!=='OK')throw safeError('IMAP_AUTH_FAILED','Authentification IMAP refusée.');
    }
  }
  async command(command){
    const tag=`A${String(++this.tag).padStart(4,'0')}`;
    this.socket.write(`${tag} ${command}\r\n`);
    let response;
    try{response=await this.reader.tagged(tag,this.timeoutMs);}catch(e){if(e?.code==='IMAP_TIMEOUT')throw e;throw safeError('IMAP_NETWORK_ERROR','Erreur réseau IMAP.');}
    const text=response.toString('latin1');
    const m=text.match(new RegExp(`(?:^|\\r\\n)${escapeRegex(tag)} (OK|NO|BAD)\\b`,'i'));
    return {status:(m?.[1]||'BAD').toUpperCase(),response};
  }
  async examine(mailbox){return this.command(`EXAMINE ${imapQuote(mailbox)}`);}
  async searchSince(date){return this.command(`UID SEARCH SINCE ${imapDate(date)}`);}
  async fetchHeaders(uid){return this.command(`UID FETCH ${uid} (RFC822.SIZE BODY.PEEK[HEADER.FIELDS (MESSAGE-ID IN-REPLY-TO REFERENCES FROM TO X-ORIGINAL-TO DELIVERED-TO SUBJECT DATE CONTENT-TYPE CONTENT-TRANSFER-ENCODING)])`);}
  async fetchRaw(uid){return this.command(`UID FETCH ${uid} (BODY.PEEK[])`);}
  async close(){
    if(!this.socket)return;
    try{if(!this.socket.destroyed)await this.command('LOGOUT');}catch{}
    this.socket.destroy();
  }
}

export function imapConfiguration(){
  const host=String(process.env.IMAP_HOST||'').trim();
  const port=Number(process.env.IMAP_PORT||993);
  const secure=String(process.env.IMAP_SECURE||'').toLowerCase()==='true';
  const user=String(process.env.IMAP_USER||'').trim();
  const password=String(process.env.IMAP_PASSWORD||'');
  return {host,port,secure,user,password,configured:Boolean(host&&port&&user&&password)};
}

async function recordManualReview({dedupeKey,mailbox,uid,messageId,reason}){
  const metadata={dedupe_key:dedupeKey,mailbox,uid:String(uid),message_id:messageId||null,reason};
  const {data}=await db.from('system_events').select('id').eq('scope','imap.reply').eq('message','MANUAL_REVIEW_REQUIRED').contains('metadata',{dedupe_key:dedupeKey}).limit(1).maybeSingle();
  if(data)return;
  await db.from('system_events').insert({level:'warn',scope:'imap.reply',message:'MANUAL_REVIEW_REQUIRED',metadata});
}

async function alreadyProcessed(dedupeKey){
  const {data,error}=await db.from('outreach_events').select('id').eq('dedupe_key',dedupeKey).limit(1).maybeSingle();
  if(error)throw error;
  return Boolean(data);
}

async function loadIdentityMaps(){
  const [{data:prospects,error:pError},{data:events,error:eError}]=await Promise.all([
    db.from('prospects').select('id,email'),
    db.from('outreach_events').select('prospect_id,provider_message_id').eq('type','sent').not('provider_message_id','is',null)
  ]);
  if(pError)throw pError;if(eError)throw eError;
  return {
    prospectByEmail:new Map((prospects||[]).map(p=>[String(p.email||'').trim().toLowerCase(),p.id])),
    providerToProspect:new Map((events||[]).filter(e=>e.provider_message_id).map(e=>[String(e.provider_message_id).trim(),e.prospect_id]))
  };
}

function replyAnalysis(text){
  const override=deterministicReplyCategory(text);
  if(override==='opt_out')return {category:'opt_out',sentiment:'negative',confidence:1,needs_human:false,summary:'Demande explicite de ne plus être contacté.',objection:'',requested_feature:''};
  if(override==='not_interested')return {category:'not_interested',sentiment:'negative',confidence:.99,needs_human:false,summary:'Refus commercial explicite.',objection:'no_need',requested_feature:''};
  return null;
}

export async function pollImapReplies({now=new Date()}={}){
  const cfg=imapConfiguration();
  if(!cfg.configured)return {configured:false,connected:false,processed:0,matched:0,manual_review:0,skipped:'imap_not_configured'};
  if(!cfg.secure||cfg.port!==993)throw safeError('IMAP_TLS_REQUIRED','IMAP doit utiliser TLS/SSL sur le port 993.');
  const maps=await loadIdentityMaps();
  const client=new ReadOnlyImapClient({host:cfg.host,port:cfg.port,user:cfg.user,password:cfg.password});
  const summary={configured:true,connected:false,processed:0,matched:0,idempotent:0,manual_review:0,unmatched:0,mailboxes:[]};
  const since=new Date(now.getTime()-RECENT_DAYS*86400000);
  try{
    await client.connect(); summary.connected=true;
    for(const mailbox of DEFAULT_MAILBOXES){
      const selected=await client.examine(mailbox);
      if(selected.status!=='OK')continue;
      const uidValidity=parseUidValidity(selected.response);
      const searched=await client.searchSince(since);
      if(searched.status!=='OK')continue;
      const uids=parseSearchUids(searched.response);
      summary.mailboxes.push({mailbox,candidates:uids.length});
      for(const uid of uids){
        const headerFetch=await client.fetchHeaders(uid);
        if(headerFetch.status!=='OK')continue;
        const size=parseMessageSize(headerFetch.response);
        const headerLiteral=extractLiteral(headerFetch.response);
        if(!headerLiteral.length)continue;
        const parsedHeader=parseImapReply(`${headerLiteral.toString('utf8')}\r\n`);
        const messageId=parsedHeader.messageId;
        const dedupeKey=messageId?`imap:${messageId}`:`imap:${mailbox}:${uidValidity}:${uid}`;
        if(await alreadyProcessed(dedupeKey)){summary.idempotent++;continue;}
        const identity=resolveProspectIdentity(parsedHeader,maps);
        if(identity.status==='MANUAL_REVIEW_REQUIRED'){
          summary.manual_review++;
          await recordManualReview({dedupeKey,mailbox,uid,messageId,reason:identity.reason});
          continue;
        }
        if(identity.status!=='matched'){summary.unmatched++;continue;}
        if(size!==null&&size>MAX_MESSAGE_BYTES){
          summary.manual_review++;
          await recordManualReview({dedupeKey,mailbox,uid,messageId,reason:'message_too_large'});
          continue;
        }
        const rawFetch=await client.fetchRaw(uid);
        if(rawFetch.status!=='OK')continue;
        const raw=extractLiteral(rawFetch.response);
        if(!raw.length)continue;
        const parsed=parseImapReply(raw.toString('utf8'));
        if(!parsed.text){
          summary.manual_review++;
          await recordManualReview({dedupeKey,mailbox,uid,messageId,reason:'empty_text'});
          continue;
        }
        const deterministic=replyAnalysis(parsed.text);
        const analysis=deterministic||await analyzeReply(parsed.text);
        const category=deterministic?.category||normalizeReplyCategory(analysis);
        const receivedAt=parsed.receivedAt||now.toISOString();
        const {data,error}=await db.rpc('apply_outreach_reply',{
          p_from_email:parsed.from,
          p_category:category,
          p_sentiment:analysis.sentiment||'neutral',
          p_content:parsed.text.slice(0,5000),
          p_received_at:receivedAt,
          p_dedupe_key:dedupeKey,
          p_in_reply_to:identity.inReplyTo,
          p_metadata:{source:'imap_ovh',mailbox,uid:String(uid),message_id:messageId||null,subject:String(parsed.subject||'').slice(0,200),matched_by:identity.matchedBy,classification:{category,confidence:analysis.confidence??null,needs_human:analysis.needs_human!==false,summary:String(analysis.summary||'').slice(0,500)}}
        });
        if(error)throw error;
        summary.processed++;
        if(data?.idempotent)summary.idempotent++;else if(data?.matched)summary.matched++;else{
          summary.manual_review++;
          await recordManualReview({dedupeKey,mailbox,uid,messageId,reason:data?.reason||'rpc_not_matched'});
        }
      }
    }
    log('info','imap.reply.poll','IMAP reply poll completed',{connected:true,processed:summary.processed,matched:summary.matched,idempotent:summary.idempotent,manual_review:summary.manual_review,unmatched:summary.unmatched,mailboxes:summary.mailboxes});
    return summary;
  }catch(error){
    const code=error?.code||(/auth/i.test(String(error?.message||''))?'IMAP_AUTH_FAILED':'IMAP_POLL_FAILED');
    if(code==='IMAP_AUTH_FAILED')throw safeError(code,'Authentification IMAP refusée.');
    if(code==='IMAP_TIMEOUT')throw safeError(code,'Délai IMAP dépassé.');
    if(code==='IMAP_TLS_ERROR'||code==='IMAP_TLS_REQUIRED')throw error;
    throw safeError(code,'Échec du polling IMAP.');
  }finally{await client.close();}
}
