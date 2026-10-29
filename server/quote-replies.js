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

// Every distinct token among the recipients (case-insensitive: some servers upper-case local parts).
export function tokensFromRecipients(recipients=[],cfg=replyConfiguration()){
  if(!cfg.local)return [];
  const prefix=`${cfg.local}+`,suffix=`@${cfg.domain}`,found=[];
  for(const raw of recipients){
    const a=String(raw||'').trim().toLowerCase();
    if(!a.startsWith(prefix)||!a.endsWith(suffix))continue;
    const token=a.slice(prefix.length,a.length-suffix.length);
    if(TOKEN_RE.test(token)&&!found.includes(token))found.push(token);
  }
  return found;
}

export function tokenFromRecipients(recipients=[],cfg=replyConfiguration()){
  return tokensFromRecipients(recipients,cfg)[0]||null;
}

// One row per (follow-up token, message): the same email sent to two follow-ups reaches both quotes.
export function dedupeKeyFor(parsed,token){
  if(parsed.messageId)return `email:${token}:${parsed.messageId}`.slice(0,300);
  return 'email:'+createHash('sha256').update([token,parsed.from,parsed.receivedAt,parsed.subject,parsed.text].join('\n')).digest('hex');
}

export const MAX_FORWARD_ATTEMPTS=5;

function forwardBody({quote,parsed,effect,attachmentsNote}){
  const who=quote.client_name||parsed.from||'Votre client';
  const app=`Voir le devis dans Relanzio : ${String(process.env.APP_URL||'').replace(/\/$/,'')}/`;
  if(effect==='disable_auto')return [
    `L’email de relance pour le devis « ${quote.title} » n’a pas pu être remis à ${quote.client_email||who}.`,
    'Relanzio a désactivé l’envoi automatique de ce devis. Vérifiez l’adresse email du client, ou appelez-le.',
    '','—',app
  ].join('\n');
  const head=effect==='record'
    ?[`Réponse automatique reçue de ${who} (absence, accusé de réception…) pour le devis « ${quote.title} ».`,
      'Les relances continuent. Si c’est en fait une vraie réponse, indiquez « Le client a répondu » dans Relanzio.']
    :[`${who} a répondu à votre relance pour le devis « ${quote.title} ».`,['won','lost'].includes(quote.status)?'Ce devis est déjà marqué gagné ou perdu : rien ne change dans Relanzio.':'Relanzio a arrêté les relances de ce devis.'];
  return [
    ...head,
    '',
    `Pour lui répondre, répondez simplement à cet email : votre réponse partira à ${parsed.from}.`,
    attachmentsNote,
    '',
    '— Son message —',
    '',
    String(parsed.text||'(message vide)').slice(0,20000),
    '',
    '—',
    app
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

// Tells the artisan (every category: a misclassified real answer is never silent). Counts attempts so the poll
// can retry a failed forward a bounded number of times. Returns true when the email left.
async function notifyArtisan({db,sendEmail,reportError,reply,quote,profile,parsed,attachments}){
  const effect=reply.effect,category=reply.category;
  const {kept,skipped}=effect==='disable_auto'?{kept:[],skipped:[]}:forwardableAttachments(attachments);
  const attachmentsNote=skipped.length?`${skipped.length} pièce(s) jointe(s) non transmise(s) (format ou taille) : demandez-lui de vous les renvoyer directement.`:(kept.length?`${kept.length} pièce(s) jointe(s) transmise(s) avec cet email.`:null);
  const who=quote.client_name||'Votre client';
  const subject=effect==='disable_auto'?`Relance non remise — ${quote.title}`:effect==='record'?`Réponse automatique de ${who} — ${quote.title}`:`${who} a répondu — ${quote.title}`;
  const attempts=Number(reply.forward_attempts||0)+1;
  try{
    await sendEmail({
      to:profile.email,
      subject:subject.slice(0,200),
      text:forwardBody({quote,parsed,effect,attachmentsNote}),
      replyTo:effect==='disable_auto'?undefined:(parsed.from||undefined),replyToName:effect==='disable_auto'?undefined:(quote.client_name||undefined),
      senderName:'Relanzio',tags:['relanzio-client-reply'],attachments:kept
    });
  }catch(error){
    // The reply is stored and visible in the app; only the forward failed. No message content in the report.
    await db.from('quote_replies').update({forward_attempts:attempts}).eq('id',reply.id);
    await reportError('reply.forward',error,{quote_id:quote.id,user_id:quote.user_id,category,attempt:attempts});
    return false;
  }
  const {error}=await db.from('quote_replies').update({notified_at:new Date().toISOString(),forward_attempts:attempts}).eq('id',reply.id);
  if(error)await reportError('reply.notified_mark',error,{quote_id:quote.id});
  return true;
}

// Core: one parsed email, one follow-up token → stop + record + notify. Returns a status string, never the content.
export async function ingestQuoteReply(parsed,{db,sendEmail,reportError,cfg=replyConfiguration(),attachments=[],now=new Date(),token=null}={}){
  if(!db||!sendEmail||!reportError){const r=await runtime();db=db||r.db;sendEmail=sendEmail||r.sendEmail;reportError=reportError||r.reportError;}
  token=token||tokenFromRecipients(parsed.to,cfg);
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

  const dedupeKey=dedupeKeyFor(parsed,token);
  const {category,effect}=classifyReply({...parsed,title:quote.title});
  const own=stripQuotedReply(parsed.text)||String(parsed.text||'');
  const {data:applied,error:aError}=await db.rpc('apply_quote_reply',{
    p_quote_id:quote.id,p_user_id:quote.user_id,p_followup_id:followup.id,p_source:'email',p_channel:'email',
    p_category:category,p_effect:effect,p_from_email:parsed.from||null,p_excerpt:own.slice(0,2000)||null,
    p_dedupe_key:dedupeKey,p_received_at:parsed.receivedAt||now.toISOString()
  });
  if(aError)throw aError;
  if(!applied?.ok)return {status:String(applied?.code||'not_applied').toLowerCase()};
  if(applied.duplicate){
    // Already stored: only a forward that failed earlier is retried, a bounded number of times.
    const {data:prev,error:rError}=await db.from('quote_replies').select('id,category,effect,notified_at,forward_attempts').eq('dedupe_key',dedupeKey).maybeSingle();
    if(rError)throw rError;
    if(!prev||prev.notified_at||Number(prev.forward_attempts||0)>=MAX_FORWARD_ATTEMPTS)return {status:'duplicate'};
    const ok=await notifyArtisan({db,sendEmail,reportError,reply:prev,quote,profile,parsed,attachments});
    return {status:ok?'forward_retried':'forward_failed',category:prev.category};
  }

  if(category==='opt_out'&&quote.client_email){
    const email=String(quote.client_email).toLowerCase();
    const {error:oError}=await db.from('followup_optouts').upsert({user_id:quote.user_id,email,source:'reply_stop'});
    if(oError)throw oError;
    const {error:uError}=await db.from('quotes').update({auto_send:false}).eq('user_id',quote.user_id).eq('client_email',email);
    if(uError)throw uError;
  }
  await db.from('product_events').insert({user_id:quote.user_id,event:'client_reply_received',path:'/app',metadata:{source:'email',category,stopped:Boolean(applied.stopped)}});

  const ok=await notifyArtisan({db,sendEmail,reportError,reply:applied.reply,quote,profile,parsed,attachments});
  const base=applied.stopped?'stopped':'recorded';
  return {status:ok?base:`${base}_forward_failed`,category};
}

// Messages already judged irrelevant (no token, unknown token, too large) are not fetched again by this process.
// Keyed by mailbox + UIDVALIDITY + UID, so a mailbox rebuild never hides a new message.
const skippedUids=new Set();
const MAX_SKIPPED=5000;
function rememberSkip(key){if(skippedUids.size>=MAX_SKIPPED)skippedUids.clear();skippedUids.add(key);}
export function resetReplyPollCache(){skippedUids.clear();}

// IMAP adapter for the product reply mailbox. Read-only (EXAMINE, BODY.PEEK); already-ingested messages are skipped.
export async function pollQuoteReplies({cfg=replyConfiguration(),now=new Date(),...deps}={}){
  if(!cfg.configured)return {configured:false};
  const r={...await runtime(),...deps};
  const {db,sendEmail,log,reportError}=r;
  const {ReadOnlyImapClient:Client,extractLiteral,parseSearchUids,parseMessageSize,parseUidValidity}={...r.imap,...(deps.Client?{ReadOnlyImapClient:deps.Client}:{})};
  const client=new Client({host:cfg.imap.host,port:cfg.imap.port,user:cfg.imap.user,password:cfg.imap.password});
  const summary={configured:true,candidates:0,ingested:0,duplicate:0,unmatched:0,too_large:0,retried:0,skipped:0,errors:0};
  const since=new Date(now.getTime()-7*86400000);
  try{
    await client.connect();
    for(const mailbox of ['INBOX','Junk','Spam']){
      const selected=await client.examine(mailbox);
      if(selected.status!=='OK')continue;
      const validity=parseUidValidity?parseUidValidity(selected.response||Buffer.from('')):'unknown';
      const searched=await client.searchSince(since);
      if(searched.status!=='OK')continue;
      for(const uid of parseSearchUids(searched.response)){
        summary.candidates++;
        const skipKey=`${cfg.imap.user}:${mailbox}:${validity}:${uid}`;
        if(skippedUids.has(skipKey)){summary.skipped++;continue;}
        const head=await client.fetchHeaders(uid);
        if(head.status!=='OK')continue;
        const headers=parseImapReply(`${extractLiteral(head.response).toString('utf8')}\r\n`);
        let tokens=tokensFromRecipients(headers.to,cfg);
        if(!tokens.length){summary.unmatched++;rememberSkip(skipKey);continue;}
        if(headers.messageId){
          // Skip tokens already stored and notified (or out of retries); keep the others.
          const pending=[];
          for(const token of tokens){
            const {data:seen,error}=await db.from('quote_replies').select('id,notified_at,forward_attempts').eq('dedupe_key',dedupeKeyFor(headers,token)).maybeSingle();
            if(error){summary.errors++;pending.push(token);continue;} // ingest dedupes in the database anyway
            if(!seen||(!seen.notified_at&&Number(seen.forward_attempts||0)<MAX_FORWARD_ATTEMPTS))pending.push(token);
          }
          if(!pending.length){summary.duplicate++;rememberSkip(skipKey);continue;}
          tokens=pending;
        }
        const size=parseMessageSize(head.response);
        if(size!==null&&size>MAX_RAW_BYTES){summary.too_large++;rememberSkip(skipKey);await reportError('reply.too_large',new Error('REPLY_TOO_LARGE'),{size});continue;}
        const rawFetch=await client.fetchRaw(uid);
        if(rawFetch.status!=='OK')continue;
        const raw=extractLiteral(rawFetch.response).toString('utf8');
        const parsed=parseImapReply(raw),attachments=extractAttachments(raw);
        // Fetched again on the next poll only while a forward still has to be retried (or an error occurred).
        let keep=false;
        for(const token of tokens){
          try{
            const result=await ingestQuoteReply(parsed,{db,sendEmail,reportError,cfg,attachments,now,token});
            if(result.status==='duplicate')summary.duplicate++;
            else if(['unmatched','unknown_token','quote_missing'].includes(result.status))summary.unmatched++;
            else if(['forward_retried','forward_failed'].includes(result.status))summary.retried++;
            else summary.ingested++;
            if(/forward_failed$/.test(result.status))keep=true;
          }catch(error){summary.errors++;keep=true;await reportError('reply.ingest',error,{mailbox});}
        }
        if(!keep)rememberSkip(skipKey);
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
