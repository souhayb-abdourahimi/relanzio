// Client replies to follow-ups sent by Relanzio.
// Each follow-up gets a Reply-To like reponses+<token>@domain. The product reply mailbox (separate from the
// prospection mailbox) is polled; a reply carrying a known token stops the quote's sequence, is stored in
// quote_replies and is forwarded to the artisan, who answers the client directly from that email.
// Without REPLY_INBOUND_ADDRESS + REPLY_IMAP_*, nothing changes: Reply-To stays the artisan's address.
import { randomBytes, createHash } from 'node:crypto';
import { classifyReply, stripQuotedReply } from './reply-classifier.js';
import { parseImapReply, extractAttachments } from './imap-reply-parser.js';

// Database, provider and IMAP modules are loaded on first use so the pure parts stay testable without Supabase.
const runtime=async()=>{
  const [{db},{sendEmail},{log,reportError},imap]=await Promise.all([import('./db.js'),import('./email.js'),import('./observability.js'),import('./imap-replies.js')]);
  return {db,sendEmail,log,reportError,imap};
};

const TOKEN_RE=/^[a-z2-7]{20}$/;
const B32='abcdefghijklmnopqrstuvwxyz234567';
const MAX_RAW_BYTES=15*1024*1024;
const MAX_FORWARD_BYTES=8*1024*1024;
const FORWARDABLE=/\.(pdf|jpe?g|png|gif|docx?|xlsx?|odt|ods|txt|csv|rtf|pptx?|zip)$/i;

export function replyConfiguration(env=process.env){
  const address=String(env.REPLY_INBOUND_ADDRESS||'').trim().toLowerCase();
  const m=address.match(/^([a-z0-9._-]+)@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/);
  const imap={host:String(env.REPLY_IMAP_HOST||'').trim(),port:Number(env.REPLY_IMAP_PORT||993),user:String(env.REPLY_IMAP_USER||'').trim(),password:String(env.REPLY_IMAP_PASSWORD||'')};
  const imapConfigured=Boolean(imap.host&&imap.user&&imap.password&&imap.port===993);
  return {configured:Boolean(m)&&imapConfigured,local:m?.[1]||'',domain:m?.[2]||'',imap};
}

export function newReplyToken(){
  return [...randomBytes(20)].map(b=>B32[b&31]).join('');
}

export function replyAddress(token,cfg=replyConfiguration()){
  if(!cfg.configured||!TOKEN_RE.test(token))return null;
  return `${cfg.local}+${token}@${cfg.domain}`;
}

// First recipient of the form local+<token>@domain (case-insensitive: some servers upper-case local parts).
export function tokenFromRecipients(recipients=[],cfg=replyConfiguration()){
  if(!cfg.local)return null;
  const prefix=`${cfg.local}+`,suffix=`@${cfg.domain}`;
  for(const raw of recipients){
    const a=String(raw||'').trim().toLowerCase();
    if(!a.startsWith(prefix)||!a.endsWith(suffix))continue;
    const token=a.slice(prefix.length,a.length-suffix.length);
    if(TOKEN_RE.test(token))return token;
  }
  return null;
}

function dedupeKeyFor(parsed,token){
  if(parsed.messageId)return `email:${parsed.messageId}`.slice(0,300);
  return 'email:'+createHash('sha256').update([token,parsed.from,parsed.receivedAt,parsed.subject,parsed.text].join('\n')).digest('hex');
}

function forwardBody({quote,parsed,attachmentsNote}){
  const who=quote.client_name||parsed.from||'Votre client';
  return [
    `${who} a répondu à votre relance pour le devis « ${quote.title} ».`,
    'Relanzio a arrêté les relances de ce devis.',
    '',
    `Pour lui répondre, répondez simplement à cet email : votre réponse partira à ${parsed.from}.`,
    attachmentsNote,
    '',
    '— Son message —',
    '',
    String(parsed.text||'(message vide)').slice(0,20000),
    '',
    '—',
    `Voir le devis dans Relanzio : ${String(process.env.APP_URL||'').replace(/\/$/,'')}/`
  ].filter(x=>x!==null).join('\n');
}

function forwardableAttachments(list=[]){
  const kept=[],skipped=[];let total=0;
  for(const a of list){
    if(FORWARDABLE.test(a.filename)&&total+a.size<=MAX_FORWARD_BYTES){kept.push({name:a.filename.slice(0,120),content:a.content});total+=a.size;}
    else skipped.push(a.filename);
  }
  return {kept,skipped};
}

// Core: one parsed email → stop + record + notify. Returns a status string, never the content.
export async function ingestQuoteReply(parsed,{db,sendEmail,reportError,cfg=replyConfiguration(),attachments=[],now=new Date()}={}){
  if(!db||!sendEmail||!reportError){const r=await runtime();db=db||r.db;sendEmail=sendEmail||r.sendEmail;reportError=reportError||r.reportError;}
  const token=tokenFromRecipients(parsed.to,cfg);
  if(!token)return {status:'unmatched'};
  const {data:followup,error:fError}=await db.from('followups').select('id,quote_id,user_id').eq('reply_token',token).maybeSingle();
  if(fError)throw fError;
  if(!followup)return {status:'unknown_token'};
  const [{data:quote,error:qError},{data:profile,error:pError}]=await Promise.all([
    db.from('quotes').select('id,user_id,client_name,client_email,title,status').eq('id',followup.quote_id).eq('user_id',followup.user_id).maybeSingle(),
    db.from('profiles').select('id,email,company_name').eq('id',followup.user_id).maybeSingle()
  ]);
  if(qError)throw qError;if(pError)throw pError;
  if(!quote||!profile)return {status:'quote_missing'};

  const {category,effect}=classifyReply(parsed);
  const own=stripQuotedReply(parsed.text)||String(parsed.text||'');
  const {data:applied,error:aError}=await db.rpc('apply_quote_reply',{
    p_quote_id:quote.id,p_user_id:quote.user_id,p_followup_id:followup.id,p_source:'email',p_channel:'email',
    p_category:category,p_effect:effect,p_from_email:parsed.from||null,p_excerpt:own.slice(0,2000)||null,
    p_dedupe_key:dedupeKeyFor(parsed,token),p_received_at:parsed.receivedAt||now.toISOString()
  });
  if(aError)throw aError;
  if(!applied?.ok)return {status:String(applied?.code||'not_applied').toLowerCase()};
  if(applied.duplicate)return {status:'duplicate'};

  if(category==='opt_out'&&quote.client_email){
    const email=String(quote.client_email).toLowerCase();
    await db.from('followup_optouts').upsert({user_id:quote.user_id,email,source:'reply_stop'});
    await db.from('quotes').update({auto_send:false}).eq('user_id',quote.user_id).eq('client_email',email);
  }
  await db.from('product_events').insert({user_id:quote.user_id,event:'client_reply_received',path:'/app',metadata:{source:'email',category,stopped:Boolean(applied.stopped)}});

  if(effect!=='stop')return {status:'recorded',category};
  const {kept,skipped}=forwardableAttachments(attachments);
  const attachmentsNote=skipped.length?`${skipped.length} pièce(s) jointe(s) non transmise(s) (format ou taille) : demandez-lui de vous les renvoyer directement.`:(kept.length?`${kept.length} pièce(s) jointe(s) transmise(s) avec cet email.`:null);
  try{
    await sendEmail({
      to:profile.email,
      subject:`${quote.client_name||'Votre client'} a répondu — ${quote.title}`.slice(0,200),
      text:forwardBody({quote,parsed,attachmentsNote}),
      replyTo:parsed.from||undefined,replyToName:quote.client_name||undefined,
      senderName:'Relanzio',tags:['relanzio-client-reply'],attachments:kept
    });
    await db.from('quote_replies').update({notified_at:new Date().toISOString()}).eq('id',applied.reply.id);
  }catch(error){
    // The reply is stored and visible in the app; only the forward failed. No message content in the report.
    await reportError('reply.forward',error,{quote_id:quote.id,user_id:quote.user_id,category});
    return {status:'stopped_forward_failed',category};
  }
  return {status:'stopped',category};
}

// IMAP adapter for the product reply mailbox. Read-only (EXAMINE, BODY.PEEK); already-ingested messages are skipped.
export async function pollQuoteReplies({cfg=replyConfiguration(),now=new Date(),...deps}={}){
  if(!cfg.configured)return {configured:false};
  const r={...await runtime(),...deps};
  const {db,sendEmail,log,reportError}=r;
  const {ReadOnlyImapClient:Client,extractLiteral,parseSearchUids,parseMessageSize}={...r.imap,...(deps.Client?{ReadOnlyImapClient:deps.Client}:{})};
  const client=new Client({host:cfg.imap.host,port:cfg.imap.port,user:cfg.imap.user,password:cfg.imap.password});
  const summary={configured:true,candidates:0,ingested:0,duplicate:0,unmatched:0,too_large:0,errors:0};
  const since=new Date(now.getTime()-7*86400000);
  try{
    await client.connect();
    for(const mailbox of ['INBOX','Junk','Spam']){
      if((await client.examine(mailbox)).status!=='OK')continue;
      const searched=await client.searchSince(since);
      if(searched.status!=='OK')continue;
      for(const uid of parseSearchUids(searched.response)){
        summary.candidates++;
        const head=await client.fetchHeaders(uid);
        if(head.status!=='OK')continue;
        const headers=parseImapReply(`${extractLiteral(head.response).toString('utf8')}\r\n`);
        const token=tokenFromRecipients(headers.to,cfg);
        if(!token){summary.unmatched++;continue;}
        if(headers.messageId){
          const {data:seen}=await db.from('quote_replies').select('id').eq('dedupe_key',`email:${headers.messageId}`.slice(0,300)).maybeSingle();
          if(seen){summary.duplicate++;continue;}
        }
        const size=parseMessageSize(head.response);
        if(size!==null&&size>MAX_RAW_BYTES){summary.too_large++;await reportError('reply.too_large',new Error('REPLY_TOO_LARGE'),{size});continue;}
        const rawFetch=await client.fetchRaw(uid);
        if(rawFetch.status!=='OK')continue;
        const raw=extractLiteral(rawFetch.response).toString('utf8');
        try{
          const result=await ingestQuoteReply(parseImapReply(raw),{db,sendEmail,reportError,cfg,attachments:extractAttachments(raw),now});
          if(result.status==='duplicate')summary.duplicate++;else if(['unmatched','unknown_token'].includes(result.status))summary.unmatched++;else summary.ingested++;
        }catch(error){summary.errors++;await reportError('reply.ingest',error,{mailbox});}
      }
    }
  }finally{await client.close();}
  log('info','reply.poll','Product reply poll completed',summary);
  return summary;
}

// "Le client a répondu" pressed by the artisan (phone, SMS, in person…): same stop, recorded as manual.
export async function recordManualReply({quote,channel,requestKey,db,now=new Date()}){
  db=db||(await runtime()).db;
  const allowed=['phone','sms','whatsapp','in_person','email','other'];
  const {data,error}=await db.rpc('apply_quote_reply',{
    p_quote_id:quote.id,p_user_id:quote.user_id,p_followup_id:null,p_source:'manual',p_channel:allowed.includes(channel)?channel:'other',
    p_category:'received',p_effect:'stop',p_from_email:null,p_excerpt:null,
    p_dedupe_key:`manual:${quote.id}:${String(requestKey||now.toISOString()).slice(0,100)}`,p_received_at:now.toISOString()
  });
  if(error)throw error;
  if(!data?.ok)throw Object.assign(new Error(data?.code||'REPLY_NOT_RECORDED'),{code:data?.code});
  if(!data.duplicate)await db.from('product_events').insert({user_id:quote.user_id,event:'client_reply_received',path:'/app',metadata:{source:'manual',channel,stopped:Boolean(data.stopped)}});
  return data;
}
