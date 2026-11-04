// End-to-end check of the product reply mailbox, launched by test/reply-mailbox-e2e.test.js in a child process
// (NODE_EXTRA_CA_CERTS must be set before Node starts so the real IMAP client verifies the local test certificate).
//
// Real: the send path (server/followups.js), the provider payload (server/email.js, fetch intercepted at the Brevo URL),
// the IMAP client over TLS (server/imap-replies.js), parsing, classification, ingestion and forwarding
// (server/quote-replies.js). Simulated: the database (test/helpers/fake-db.js) and the two SQL functions below,
// mirrored from supabase/migrations/20261029100000_quote_replies.sql (covered for real by test/sql/quote_replies.test.sql).
import assert from 'node:assert/strict';
import { db } from '../../server/db.js';
import { sendQuoteFollowup, runDueFollowups } from '../../server/followups.js';
import { pollQuoteReplies, replyConfiguration, resetReplyPollCache, recordManualReply } from '../../server/quote-replies.js';
import { hasProAccess } from '../../server/entitlements.js';
import { followupMessage } from '../../shared/followup-templates.js';
import { createFakeDb } from '../helpers/fake-db.js';
import { startFakeImap } from '../helpers/fake-imap-server.mjs';

const ADDRESS='reponses@reply.relanzio.com';
const TOKEN_ADDRESS=/^reponses\+([a-z2-7]{20})@reply\.relanzio\.com$/;
const A='00000000-0000-4000-8000-0000000000a1',B='00000000-0000-4000-8000-0000000000b2';
const PAST='2026-11-02T08:00:00.000Z';
const report=[];
const pass=name=>{report.push('PASS '+name);};

// Provider: every Brevo call is captured; no other network access is allowed.
const brevo=[];
globalThis.fetch=async(url,init={})=>{
  if(String(url)!=='https://api.brevo.com/v3/smtp/email')throw new Error('unexpected network call: '+url);
  const body=JSON.parse(init.body);brevo.push(body);
  return new Response(JSON.stringify({messageId:`<brevo-${brevo.length}@smtp-relay.test>`}),{status:201,headers:{'content-type':'application/json'}});
};

let fake;
function mirrorRpc(name,a){
  const T=fake.tables;
  if(name==='apply_quote_reply'){
    const quote=T.quotes.find(q=>q.id===a.p_quote_id&&q.user_id===a.p_user_id);
    if(!quote)return {ok:false,code:'QUOTE_NOT_FOUND'};
    const replies=T.quote_replies||(T.quote_replies=[]);
    if(replies.some(r=>r.dedupe_key===a.p_dedupe_key))return {ok:true,duplicate:true,stopped:false,quote:{...quote}};
    const reply={id:`r${replies.length+1}`,quote_id:quote.id,user_id:quote.user_id,followup_id:a.p_followup_id,source:a.p_source,channel:a.p_channel,
      category:a.p_category,effect:a.p_effect,from_email:a.p_from_email,excerpt:a.p_excerpt,dedupe_key:a.p_dedupe_key,received_at:a.p_received_at,notified_at:null,forward_attempts:0};
    replies.push(reply);let stopped=false;
    if(['open','paused'].includes(quote.status)){
      if(a.p_effect==='stop'){Object.assign(quote,{reply_received_at:quote.reply_received_at&&quote.reply_received_at>a.p_received_at?quote.reply_received_at:a.p_received_at,auto_send:false,next_followup_at:null,followup_schedule_mode:'none'});stopped=true;}
      else if(a.p_effect==='disable_auto')quote.auto_send=false;
    }else if(a.p_effect==='stop')quote.reply_received_at=quote.reply_received_at||a.p_received_at;
    return {ok:true,duplicate:false,stopped,quote:{...quote},reply:{...reply}};
  }
  if(name==='finalize_relanzio_followup'){
    const quote=T.quotes.find(q=>q.id===a.p_quote_id&&q.user_id===a.p_user_id);
    const f=T.followups.find(x=>x.id===a.p_followup_id);
    if(!quote||!f)return {ok:false,code:'NOT_FOUND'};
    if(f.status!=='draft')return {ok:true,idempotent:true,quote:{...quote},followup:{...f}};
    if(quote.followup_step!==a.p_expected_previous_step)return {ok:false,code:'FOLLOWUP_STEP_STALE'};
    Object.assign(f,{status:'sent',sent_at:a.p_sent_at,provider_message_id:a.p_provider_message_id});
    const next=a.p_expected_previous_step+1;
    const stop=next>=3||quote.reply_received_at;
    Object.assign(quote,{followup_step:next,followup_schedule_mode:stop?'none':'recommended',next_followup_at:stop?null:new Date(Date.parse(a.p_sent_at)+3*86400000).toISOString(),send_claimed_at:null});
    return {ok:true,idempotent:false,quote:{...quote},followup:{...f}};
  }
  throw new Error('unexpected rpc '+name);
}
let beforeRecheck=null; // test hook: runs when the send path re-reads the reply state just before the provider call
function installDb(seed){
  fake=createFakeDb(seed,{followup_optouts:['user_id','email']});
  let n=0;
  db.from=table=>{
    const q=fake.from(table);
    if(table==='followups'){const insert=q.insert;q.insert=v=>insert(Array.isArray(v)?v:{id:`f${++n}`,...v});}
    if(table==='quotes'&&beforeRecheck){const select=q.select;q.select=(cols,...r)=>{if(cols==='reply_received_at'&&beforeRecheck){const h=beforeRecheck;beforeRecheck=null;h();}return select(cols,...r);};}
    return q;
  };
  db.rpc=async(name,args)=>({data:mirrorRpc(name,args),error:null});
  return fake;
}

const profileA={id:A,email:'artisan@toitures-martin.test',company_name:'Toitures Martin',plan:'pro',subscription_status:'active',email_mode:'review'};
const profileB={id:B,email:'contact@plomberie-b.test',company_name:'Plomberie B',plan:'pro',subscription_status:'active',email_mode:'review'};
const quote=(id,over={})=>({id,user_id:A,client_name:'M. Durand',client_email:'durand@client.test',title:'Réfection toiture',amount:4800,status:'open',
  followup_step:0,next_followup_at:PAST,followup_schedule_mode:'recommended',auto_send:false,reply_received_at:null,send_claimed_at:null,sent_at:'2026-10-28',...over});
const row=(table,id)=>fake.tables[table].find(x=>x.id===id);

const cfg=port=>{const c=replyConfiguration();return {...c,imap:{...c.imap,host:'localhost',port}};};
function mail({token,from='"Jean Durand" <durand@client.test>',to,subject='Re: Votre devis « Réfection toiture »',text,headers=[],id}){
  const rcpt=to||`"Toitures Martin via Relanzio" <reponses+${token}@reply.relanzio.com>`;
  return [`Message-ID: <${id}@client.test>`,`From: ${from}`,`To: ${rcpt}`,...(token?[`Delivered-To: reponses+${token}@reply.relanzio.com`]:[]),
    `Subject: ${subject}`,'Date: Wed, 04 Nov 2026 10:00:00 +0100','MIME-Version: 1.0',...headers,
    ...(headers.some(h=>/^content-type/i.test(h))?[]:['Content-Type: text/plain; charset=utf-8']),'',text,''].join('\r\n');
}
async function sendR(q,profile=profileA,key){
  const before=brevo.length;
  await sendQuoteFollowup(row('quotes',q),profile,key||`k-${q}-${Date.now()}-${Math.random()}`);
  assert.equal(brevo.length,before+1,'exactly one provider call');
  const sent=brevo.at(-1);const token=sent.replyTo?.email.match(TOKEN_ADDRESS)?.[1];
  return {sent,token};
}

const imap=await startFakeImap({user:ADDRESS,password:process.env.REPLY_IMAP_PASSWORD,mailboxes:{INBOX:[],Junk:[]}});
const poll=()=>pollQuoteReplies({cfg:cfg(imap.port),log:()=>{}});
try{
  assert.equal(replyConfiguration().configured,true);assert.equal(replyConfiguration().local,'reponses');assert.equal(replyConfiguration().domain,'reply.relanzio.com');
  assert.ok(hasProAccess(profileA));

  // 1. Relance 1 leaves with a tokenised Reply-To, recorded on the follow-up.
  installDb({profiles:[profileA,profileB],quotes:[quote('q1'),quote('q-other-artisan',{user_id:B})],followups:[],quote_replies:[]});
  const r1=await sendR('q1');
  assert.match(r1.sent.replyTo.email,TOKEN_ADDRESS);
  assert.equal(r1.sent.replyTo.email,r1.sent.replyTo.email.toLowerCase());
  const f1=fake.tables.followups.find(f=>f.quote_id==='q1');
  assert.equal(f1.reply_token,r1.token);assert.equal(f1.status,'sent');assert.equal(f1.step,1);
  const t1=followupMessage({clientName:'M. Durand',title:'Réfection toiture',companyName:'Toitures Martin'},0);
  assert.equal(r1.sent.subject,t1.subject);assert.ok(r1.sent.textContent.startsWith(t1.body),'relance 1 template');
  assert.equal(r1.sent.to[0].email,'durand@client.test');assert.equal(r1.sent.sender.name,'Toitures Martin via Relanzio');
  assert.match(r1.sent.headers['List-Unsubscribe'],/^<https:\/\/relanzio\.com\//);
  assert.equal(row('quotes','q1').followup_step,1);assert.ok(row('quotes','q1').next_followup_at);
  pass('relance 1 sent with Reply-To reponses+<20-char token>@reply.relanzio.com, token stored in followups.reply_token');

  // 2. A real reply to that address, read over TLS from the product mailbox, stops everything and reaches the artisan.
  imap.deliver(mail({token:r1.token,id:'reply-q1',text:'Bonjour, c’est d’accord pour nous. Quand pourriez-vous commencer ?\r\n\r\nLe 4 nov. 2026 à 09:00, Toitures Martin via Relanzio a écrit :\r\n> Bonjour Monsieur Durand,\r\n> Je reviens vers vous au sujet du devis'}));
  const s1=await poll();
  assert.deepEqual({i:s1.ingested,e:s1.errors},{i:1,e:0},JSON.stringify(s1));
  const q1=row('quotes','q1');
  assert.ok(q1.reply_received_at);assert.equal(q1.next_followup_at,null);assert.equal(q1.auto_send,false);assert.equal(q1.followup_schedule_mode,'none');
  const rep=fake.tables.quote_replies[0];
  assert.deepEqual([rep.category,rep.effect,rep.source,rep.from_email,rep.followup_id],['interested','stop','email','durand@client.test',f1.id]);
  assert.equal(rep.excerpt,'Bonjour, c’est d’accord pour nous. Quand pourriez-vous commencer ?','quoted relance not stored');
  const fwd=brevo.at(-1);
  assert.equal(fwd.to[0].email,'artisan@toitures-martin.test');assert.deepEqual(fwd.replyTo,{email:'durand@client.test',name:'M. Durand'});
  assert.equal(fwd.subject,'M. Durand a répondu — Réfection toiture');
  assert.match(fwd.textContent,/Relanzio a arrêté les relances de ce devis/);assert.match(fwd.textContent,/c’est d’accord pour nous/);
  assert.ok(rep.notified_at);assert.equal(rep.forward_attempts,1);
  assert.ok(imap.commands.some(c=>c.startsWith('EXAMINE')));
  assert.ok(!imap.commands.some(c=>/^(STORE|COPY|MOVE|EXPUNGE|SELECT|APPEND|DELETE|UID (STORE|COPY|MOVE|EXPUNGE))\b/.test(c)),'read-only: '+imap.commands.join(' | '));
  pass('real reply read over TLS (certificate verified): quote stopped, reply stored once, forwarded to the artisan with Reply-To = client, mailbox untouched');

  // 3. Relance 2 can never leave after that, even if it was already planned.
  const before=brevo.length;
  await assert.rejects(sendQuoteFollowup(row('quotes','q1'),profileA,'k-r2'),/QUOTE_REPLIED/);
  await assert.rejects(sendQuoteFollowup({...row('quotes','q1'),reply_received_at:null,next_followup_at:PAST},profileA,'k-r2-stale'),/FOLLOWUP_ALREADY_IN_PROGRESS|QUOTE_REPLIED/,'stale in-memory copy planned before the reply');
  Object.assign(row('quotes','q1'),{auto_send:true,next_followup_at:PAST}); // a stale automatic plan
  // Control: a due quote without any reply, so the cron pass below is proven to send when it should.
  fake.tables.quotes.push(quote('q-cron-control',{client_email:'control@client.test',auto_send:true}));
  row('profiles',A).email_mode='automatic';
  process.env.FOLLOWUP_AUTOMATION_ENABLED='true';
  const cron=await runDueFollowups(new Date('2026-11-04T09:30:00.000Z')); // Wednesday 10:30 Paris
  process.env.FOLLOWUP_AUTOMATION_ENABLED='false';row('profiles',A).email_mode='review';
  assert.deepEqual(cron.map(r=>[r.id,Boolean(r.sent)]),[['q-cron-control',true]],JSON.stringify(cron));
  assert.equal(brevo.length,before+1);assert.equal(brevo.at(-1).to[0].email,'control@client.test');
  assert.equal(fake.tables.quotes.filter(q=>q.client_email==='durand@client.test'&&q.user_id===A).length,1);
  assert.ok(!brevo.slice(before).some(b=>b.to[0].email==='durand@client.test'),'no provider call for the replied quote');
  assert.equal(fake.tables.followups.filter(f=>f.quote_id==='q1').length,1,'no draft left behind');
  pass('after a real reply: no relance 2 (manual send, stale planned copy, automatic cron — which does send a due quote without reply)');

  // 4. Race: the reply lands between the claim and the provider call.
  fake.tables.quotes.push(quote('q-race',{client_email:'race@client.test'}));
  beforeRecheck=()=>{const q=row('quotes','q-race');q.reply_received_at=new Date().toISOString();q.next_followup_at=null;};
  const b2=brevo.length;
  await assert.rejects(sendQuoteFollowup(row('quotes','q-race'),profileA,'k-race'),/QUOTE_REPLIED/);
  assert.equal(brevo.length,b2,'nothing left');
  assert.equal(fake.tables.followups.filter(f=>f.quote_id==='q-race').length,0,'draft removed');
  assert.equal(row('quotes','q-race').send_claimed_at,null,'claim released');
  pass('race: a reply recorded between the claim and the provider call aborts the send (draft removed, claim released)');

  // 5. Same message on the next polls: no second forward, no second row, not fetched again.
  const b3=brevo.length;imap.commands.length=0;
  const s2=await poll();
  assert.equal(s2.ingested,0);assert.equal(brevo.length,b3);assert.equal(fake.tables.quote_replies.length,1);
  assert.ok(!imap.commands.some(c=>c.startsWith('UID FETCH')),'already handled: not fetched again');
  pass('re-poll: no duplicate forward or row, message not fetched again');

  // 6. Every real-answer category stops; STOP also opts the client out for that artisan only.
  resetReplyPollCache();
  const cases=[
    ['question','Est-ce que la garantie décennale est incluse ?'],
    ['price','Votre prix est au-dessus de notre budget, une remise est-elle possible ?'],
    ['delay','Nous reviendrons vers vous après les vacances.'],
    ['refusal','Merci, mais nous avons choisi une autre entreprise.'],
    ['other','Merci pour votre message.'],
    ['opt_out','STOP']
  ];
  for(const [category,text] of cases){
    const id='q-'+category,email=`${category}@client.test`;
    fake.tables.quotes.push(quote(id,{client_email:email}));
    const {token}=await sendR(id);
    imap.deliver(mail({token,id:'reply-'+id,from:`<${email}>`,text}));
    const s=await poll();assert.equal(s.errors,0);
    const q=row('quotes',id),r=fake.tables.quote_replies.find(x=>x.quote_id===id);
    assert.deepEqual([r.category,r.effect],[category,'stop'],id);
    assert.ok(q.reply_received_at,id);assert.equal(q.next_followup_at,null,id);
    await assert.rejects(sendQuoteFollowup(row('quotes',id),profileA,'k-after-'+id),/QUOTE_REPLIED/,id);
  }
  pass('interested, question, price, delay, refusal, other, STOP: each stops the sequence; no further relance');
  // STOP: another open quote of the same client for this artisan can no longer be emailed; another artisan is unaffected.
  fake.tables.quotes.push(quote('q-opt-2',{client_email:'opt_out@client.test',auto_send:true}),quote('q-opt-b',{user_id:B,client_email:'opt_out@client.test'}));
  assert.deepEqual(fake.tables.followup_optouts.map(o=>[o.user_id,o.email,o.source]),[[A,'opt_out@client.test','reply_stop']]);
  const b4=brevo.length;
  await assert.rejects(sendQuoteFollowup(row('quotes','q-opt-2'),profileA,'k-opt-2'),/EMAIL_RECIPIENT_OPTED_OUT/);
  assert.equal(brevo.length,b4);
  await sendR('q-opt-b',profileB);
  pass('STOP: client opted out for this artisan (no email on his other quotes), other artisans unaffected');

  // 7. Out-of-office: recorded, shown to the artisan, the sequence continues with the next step's message; no date invented.
  fake.tables.quotes.push(quote('q-ooo',{client_email:'ooo@client.test',client_name:'Mme Benali'}));
  const o1=await sendR('q-ooo');
  const plannedBefore=row('quotes','q-ooo').next_followup_at;
  imap.deliver(mail({token:o1.token,id:'reply-ooo',from:'<ooo@client.test>',subject:'Réponse automatique : Absente jusqu’au 12 novembre',headers:['Auto-Submitted: auto-replied'],text:'Je suis absente jusqu’au 12 novembre. Je vous répondrai à mon retour.'}));
  const b5=brevo.length;
  await poll();
  const ooo=fake.tables.quote_replies.find(x=>x.quote_id==='q-ooo');
  assert.deepEqual([ooo.category,ooo.effect],['auto_reply','record']);
  assert.equal(row('quotes','q-ooo').reply_received_at,null);assert.equal(row('quotes','q-ooo').next_followup_at,plannedBefore,'no return date inferred');
  assert.equal(brevo.length,b5+1);assert.match(brevo.at(-1).textContent,/Les relances continuent/);assert.match(brevo.at(-1).subject,/^Réponse automatique de Mme Benali/);
  const o2=await sendR('q-ooo');
  const t2=followupMessage({clientName:'Mme Benali',title:'Réfection toiture',companyName:'Toitures Martin'},1);
  assert.equal(o2.sent.subject,t2.subject);assert.ok(o2.sent.textContent.startsWith(t2.body));assert.notEqual(o2.token,o1.token);
  pass('auto-reply: recorded and shown to the artisan, not a stop; relance 2 leaves with its own template and a new token');
  // A real answer after the out-of-office still stops.
  imap.deliver(mail({token:o2.token,id:'reply-ooo-real',from:'<ooo@client.test>',subject:'Re: '+t2.subject,text:'De retour : oui, toujours d’actualité, appelez-moi.'}));
  await poll();
  assert.ok(row('quotes','q-ooo').reply_received_at);
  pass('a real answer after an out-of-office stops the sequence');

  // 8. Bounce: automatic sending off, sequence not stopped, artisan told.
  fake.tables.quotes.push(quote('q-bounce',{client_email:'bounce@client.test',auto_send:true}));
  const bo=await sendR('q-bounce');
  imap.deliver(mail({token:bo.token,id:'bounce-1',from:'Mail Delivery System <MAILER-DAEMON@mx.client.test>',subject:'Undelivered Mail Returned to Sender',
    headers:['Content-Type: multipart/report; report-type=delivery-status; boundary="b"'],text:'--b\r\nContent-Type: text/plain\r\n\r\n550 5.1.1 user unknown\r\n--b--'}));
  await poll();
  const qb=row('quotes','q-bounce'),rb=fake.tables.quote_replies.find(x=>x.quote_id==='q-bounce');
  assert.deepEqual([rb.category,rb.effect],['bounce','disable_auto']);assert.equal(qb.auto_send,false);assert.equal(qb.reply_received_at,null);
  assert.match(brevo.at(-1).textContent,/n’a pas pu être remis à bounce@client\.test/);assert.equal(brevo.at(-1).replyTo,undefined);
  pass('bounce: automatic sending disabled, not counted as an answer, artisan told (server message not forwarded)');

  // 9. Addresses that are not a known token touch nothing (same as the production test with reponses+test@).
  const b6=brevo.length,nReplies=fake.tables.quote_replies.length;
  imap.deliver(mail({to:'<reponses+test@reply.relanzio.com>',id:'plus-test',text:'test'}));
  imap.deliver(mail({to:'<reponses+zzzzzzzzzzzzzzzzzzzz@reply.relanzio.com>',id:'unknown-token',text:'Oui'}));
  imap.deliver(mail({to:`<reponses+${r1.token}@evil.test>`,id:'other-domain',text:'Oui'}));
  const s9=await poll();
  assert.equal(s9.errors,0);assert.ok(s9.unmatched>=3,JSON.stringify(s9));
  assert.equal(brevo.length,b6);assert.equal(fake.tables.quote_replies.length,nReplies);
  pass('reponses+test@, unknown token, other domain: unmatched, nothing stored or sent');

  // 10. Upper-case address, message filed in Junk: still matched.
  fake.tables.quotes.push(quote('q-junk',{client_email:'junk@client.test'}));
  const j=await sendR('q-junk');
  imap.deliver(mail({to:`<REPONSES+${j.token.toUpperCase()}@REPLY.RELANZIO.COM>`,id:'junk-1',from:'<junk@client.test>',text:'Oui pour moi.'}),'Junk');
  await poll();
  assert.ok(row('quotes','q-junk').reply_received_at);
  pass('upper-case address and a reply filed in Junk are still matched');

  // 11. Relance 3 is the last one: explicit wording, then nothing more.
  fake.tables.quotes.push(quote('q-three',{client_email:'three@client.test'}));
  const subjects=[];
  for(let i=0;i<3;i++)subjects.push((await sendR('q-three')).sent.subject);
  assert.deepEqual(subjects,[0,1,2].map(i=>followupMessage({clientName:'M. Durand',title:'Réfection toiture',companyName:'T'},i).subject));
  assert.match(brevo.at(-1).textContent,/Ce sera mon dernier message/);
  assert.equal(row('quotes','q-three').next_followup_at,null);
  await assert.rejects(sendQuoteFollowup(row('quotes','q-three'),profileA,'k-4'),/SEQUENCE_COMPLETE/);
  pass('relances 1, 2, 3 leave with their own subject; nothing after the third');

  // 12. Manual "Le client a répondu" after an email reply is idempotent per request and keeps the stop.
  const m=await recordManualReply({quote:{id:'q1',user_id:A},channel:'phone',requestKey:'m1',db});
  assert.equal(m.ok,true);assert.ok(row('quotes','q1').reply_received_at);
  pass('manual "Le client a répondu" on top of an email reply keeps the stop');
}finally{await imap.close();}
console.log(report.join('\n'));
console.log(`REPLY_MAILBOX_E2E=${JSON.stringify({ok:true,checks:report.length,provider_calls:brevo.length})}`);
process.exit(0);
