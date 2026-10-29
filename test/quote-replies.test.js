import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { replyConfiguration, newReplyToken, replyAddress, tokenFromRecipients, tokensFromRecipients, dedupeKeyFor, MAX_FORWARD_ATTEMPTS, resetReplyPollCache, ingestQuoteReply, pollQuoteReplies, recordManualReply } from '../server/quote-replies.js';
import { classifyReply, stripQuotedReply } from '../server/reply-classifier.js';
import { parseImapReply, extractAttachments, parseHeaders } from '../server/imap-reply-parser.js';
import { createFakeDb } from './helpers/fake-db.js';

// The IMAP helpers live next to the prospection poller, which loads db.js: give it inert placeholders
// (all database access in these tests goes through fake-db).
process.env.SUPABASE_URL||='http://127.0.0.1:9';process.env.SUPABASE_SERVICE_ROLE_KEY||='test-placeholder';process.env.SUPABASE_ANON_KEY||='test-placeholder';
const ENV={REPLY_INBOUND_ADDRESS:'reponses@relanzio.test',REPLY_IMAP_HOST:'imap.relanzio.test',REPLY_IMAP_PORT:'993',REPLY_IMAP_USER:'reponses@relanzio.test',REPLY_IMAP_PASSWORD:'x'};
const CFG=replyConfiguration(ENV);
const A='00000000-0000-4000-8000-0000000000a1',B='00000000-0000-4000-8000-0000000000b2';
const TOKEN_A='abcdefghijklmnopqrst',TOKEN_B='bcdefghijklmnopqrstu';

// Mirrors the SQL RPC (covered for real by test/sql/quote_replies.test.sql): dedupe, then effect on open/paused quotes;
// a stop on a won/lost quote only marks it as answered.
function harness({forwardFails=false}={}){
  const db=createFakeDb({
    profiles:[{id:A,email:'artisan-a@example.test',company_name:'Toitures A'},{id:B,email:'artisan-b@example.test',company_name:'Plomberie B'}],
    quotes:[
      {id:'qa',user_id:A,client_name:'M. Durand',client_email:'durand@example.test',title:'Toiture',status:'open',auto_send:true,next_followup_at:'2026-11-02T08:00:00Z',reply_received_at:null},
      {id:'qb',user_id:B,client_name:'Mme Benali',client_email:'benali@example.test',title:'Cuisine',status:'open',auto_send:true,next_followup_at:'2026-11-02T08:00:00Z',reply_received_at:null}
    ],
    followups:[{id:'fa',quote_id:'qa',user_id:A,reply_token:TOKEN_A},{id:'fb',quote_id:'qb',user_id:B,reply_token:TOKEN_B}]
  },{followup_optouts:['user_id','email']});
  const rpcCalls=[];
  db.rpc=async(name,args)=>{
    rpcCalls.push({name,args});
    const quote=db.tables.quotes.find(q=>q.id===args.p_quote_id&&q.user_id===args.p_user_id);
    if(!quote)return {data:{ok:false,code:'QUOTE_NOT_FOUND'},error:null};
    const replies=db.tables.quote_replies||(db.tables.quote_replies=[]);
    if(replies.some(r=>r.dedupe_key===args.p_dedupe_key))return {data:{ok:true,duplicate:true,stopped:false,quote},error:null};
    const reply={id:`r${replies.length+1}`,quote_id:quote.id,user_id:quote.user_id,dedupe_key:args.p_dedupe_key,category:args.p_category,effect:args.p_effect,excerpt:args.p_excerpt,source:args.p_source,notified_at:null,forward_attempts:0};
    replies.push(reply);
    let stopped=false;
    if(['open','paused'].includes(quote.status)&&args.p_effect==='stop'){Object.assign(quote,{reply_received_at:args.p_received_at,auto_send:false,next_followup_at:null});stopped=true;}
    if(['open','paused'].includes(quote.status)&&args.p_effect==='disable_auto')quote.auto_send=false;
    if(['won','lost'].includes(quote.status)&&args.p_effect==='stop')quote.reply_received_at=quote.reply_received_at||args.p_received_at;
    return {data:{ok:true,duplicate:false,stopped,quote:{...quote},reply},error:null};
  };
  const sent=[],errors=[];
  const state={forwardFails};
  const sendEmail=async m=>{if(state.forwardFails)throw new Error('Brevo 500: upstream');sent.push(m);return {messageId:'<fwd@brevo>'};};
  const reportError=async(scope,error,metadata)=>{errors.push({scope,message:String(error.message),metadata});};
  return {db,rpcCalls,sent,errors,state,deps:{db,sendEmail,reportError,cfg:CFG}};
}
const email=(over={})=>({messageId:'<reply-1@client.test>',from:'durand@example.test',to:[`reponses+${TOKEN_A}@relanzio.test`],subject:'Re: Votre devis « Toiture »',receivedAt:'2026-10-30T10:00:00.000Z',headers:new Map(),contentType:'text/plain',text:'Bonjour, c’est d’accord pour moi. Quand pouvez-vous commencer ?\n\nLe 29 oct. 2026, Toitures A a écrit :\n> Je reviens vers vous…',...over});

test('reply detection is off until the reply address and its own IMAP mailbox are configured',()=>{
  assert.equal(replyConfiguration({}).configured,false);
  assert.equal(replyConfiguration({...ENV,REPLY_IMAP_PASSWORD:''}).configured,false);
  assert.equal(replyConfiguration({...ENV,REPLY_IMAP_PORT:'143'}).configured,false,'TLS port 993 only');
  assert.equal(replyConfiguration({...ENV,REPLY_INBOUND_ADDRESS:'not an address'}).configured,false);
  assert.equal(CFG.configured,true);
  // The product mailbox is separate from the prospection one.
  assert.equal(replyConfiguration({IMAP_HOST:'h',IMAP_USER:'u',IMAP_PASSWORD:'p',REPLY_INBOUND_ADDRESS:'reponses@relanzio.test'}).configured,false);
});

test('reply tokens are random, unguessable and carry no quote id',()=>{
  const tokens=new Set(Array.from({length:500},newReplyToken));
  assert.equal(tokens.size,500);
  for(const t of tokens)assert.match(t,/^[a-z2-7]{20}$/);
  assert.equal(replyAddress(TOKEN_A,CFG),`reponses+${TOKEN_A}@relanzio.test`);
  assert.equal(replyAddress('qa',CFG),null);
  assert.equal(replyAddress(TOKEN_A,replyConfiguration({})),null);
});

test('only well-formed tokens on the configured address are recognised',()=>{
  assert.equal(tokenFromRecipients([`REPONSES+${TOKEN_A.toUpperCase()}@RELANZIO.TEST`],CFG),TOKEN_A);
  assert.equal(tokenFromRecipients([`contact@relanzio.test`,`reponses+${TOKEN_A}@relanzio.test`],CFG),TOKEN_A);
  assert.equal(tokenFromRecipients([`reponses+${TOKEN_A}@evil.test`],CFG),null);
  assert.equal(tokenFromRecipients([`reponses+short@relanzio.test`],CFG),null);
  assert.equal(tokenFromRecipients([`reponses+${TOKEN_A}1@relanzio.test`],CFG),null);
  assert.equal(tokenFromRecipients([`autre+${TOKEN_A}@relanzio.test`],CFG),null);
});

test('deterministic classification: what the client wrote, not the quoted email',()=>{
  const c=(text,extra={})=>classifyReply({text,...extra});
  assert.deepEqual(c('Bonjour, c’est bon pour nous, on signe.'),{category:'interested',effect:'stop'});
  assert.equal(c('Pouvez-vous préciser le délai de livraison des tuiles ?').category,'question');
  assert.equal(c('Votre prix est un peu au-dessus de notre budget.').category,'price');
  assert.equal(c('Nous reviendrons vers vous après les vacances.').category,'delay');
  assert.equal(c('Merci, mais nous avons choisi une autre entreprise.').category,'refusal');
  assert.deepEqual(c('STOP'),{category:'opt_out',effect:'stop'});
  assert.deepEqual(c('Merci pour votre message.'),{category:'other',effect:'stop'});
  assert.equal(c('Bien reçu\n\n> Pouvez-vous me dire où vous en êtes : « oui », « plus tard » ou « non » ?').category,'other','quoted question ignored');
  assert.deepEqual(c('Je suis absent jusqu’au 5 novembre.',{headers:parseHeaders('Auto-Submitted: auto-replied')}),{category:'auto_reply',effect:'record'});
  assert.equal(c('',{subject:'Réponse automatique : absence'}).effect,'record');
  // Regression: words of the quote title (which Relanzio puts in the subject) never turn a real answer into an auto-reply.
  assert.deepEqual(c('Oui, c’est d’accord pour moi.',{subject:'Re: Devis « Travaux pendant les congés » : dernier suivi',title:'Travaux pendant les congés'}),{category:'interested',effect:'stop'});
  assert.equal(c('Merci, je regarde.',{subject:'RE: Votre devis Réparation absence de gouttière',title:'Réparation absence de gouttière'}).effect,'stop');
  assert.equal(c('Merci',{subject:'Re: Devis « Remise en état après absence »'}).effect,'stop','title in « » ignored even without the title');
  assert.equal(c('Je suis absent.',{subject:'Absence du bureau : Re: Devis « Toiture »',title:'Toiture'}).effect,'record','a real auto-reply subject still counts');
  assert.deepEqual(c('550 user unknown',{from:'mailer-daemon@mx.example.test',subject:'Undelivered Mail'}),{category:'bounce',effect:'disable_auto'});
  assert.equal(stripQuotedReply('Oui merci\nOn Tue, Oct 28, 2026 at 9:00 AM Toitures A <x@y.z> wrote:\n> old'),'Oui merci');
});

test('a reply stops the quote, is recorded once and is forwarded to the artisan who answers the client directly',async()=>{
  const h=harness();
  const r=await ingestQuoteReply(email(),h.deps);
  assert.deepEqual(r,{status:'stopped',category:'interested'});
  const q=h.db.tables.quotes.find(x=>x.id==='qa');
  assert.ok(q.reply_received_at);assert.equal(q.auto_send,false);assert.equal(q.next_followup_at,null);
  assert.equal(h.rpcCalls[0].args.p_user_id,A);
  assert.equal(h.rpcCalls[0].args.p_excerpt,'Bonjour, c’est d’accord pour moi. Quand pouvez-vous commencer ?','quoted part not stored');
  assert.equal(h.sent.length,1);
  const fwd=h.sent[0];
  assert.equal(fwd.to,'artisan-a@example.test');
  assert.equal(fwd.replyTo,'durand@example.test');
  assert.match(fwd.subject,/M\. Durand a répondu — Toiture/);
  assert.match(fwd.text,/Relanzio a arrêté les relances de ce devis/);
  assert.match(fwd.text,/c’est d’accord pour moi/);
  assert.ok(h.db.tables.quote_replies[0]);
  assert.ok(h.db.tables.product_events.some(e=>e.event==='client_reply_received'&&e.metadata.source==='email'));
  // IMAP re-poll of the same message: no second forward.
  assert.deepEqual(await ingestQuoteReply(email(),h.deps),{status:'duplicate'});
  assert.equal(h.sent.length,1);
});

test('unknown or missing tokens touch nothing and log no content',async()=>{
  const h=harness();
  assert.deepEqual(await ingestQuoteReply(email({to:['reponses+zzzzzzzzzzzzzzzzzzzz@relanzio.test']}),h.deps),{status:'unknown_token'});
  assert.deepEqual(await ingestQuoteReply(email({to:['contact@relanzio.test']}),h.deps),{status:'unmatched'});
  assert.equal(h.rpcCalls.length,0);assert.equal(h.sent.length,0);
  assert.ok(h.db.tables.quotes.every(q=>q.reply_received_at===null));
});

test('a token only ever reaches its own quote: two artisans stay isolated',async()=>{
  const h=harness();
  await ingestQuoteReply(email({to:[`reponses+${TOKEN_B}@relanzio.test`],from:'benali@example.test',messageId:'<b@x>'}),h.deps);
  assert.equal(h.db.tables.quotes.find(q=>q.id==='qa').reply_received_at,null);
  assert.ok(h.db.tables.quotes.find(q=>q.id==='qb').reply_received_at);
  assert.equal(h.sent[0].to,'artisan-b@example.test');
});

test('STOP in a reply opts the client out for that artisan; out-of-office only records but is still shown to the artisan',async()=>{
  const h=harness();
  await ingestQuoteReply(email({text:'STOP merci'}),h.deps);
  assert.deepEqual(h.db.tables.followup_optouts.map(o=>[o.user_id,o.email,o.source]),[[A,'durand@example.test','reply_stop']]);
  const h2=harness();
  const r=await ingestQuoteReply(email({subject:'Réponse automatique : absent',text:'Absent jusqu’au 5/11'}),h2.deps);
  assert.deepEqual(r,{status:'recorded',category:'auto_reply'});
  assert.equal(h2.db.tables.quotes.find(q=>q.id==='qa').reply_received_at,null,'sequence continues');
  // Forwarded as information, so a misclassified real answer is never silent.
  assert.equal(h2.sent.length,1);
  assert.match(h2.sent[0].subject,/Réponse automatique de M\. Durand/);
  assert.match(h2.sent[0].text,/Les relances continuent\. Si c’est en fait une vraie réponse, indiquez « Le client a répondu »/);
  assert.doesNotMatch(h2.sent[0].text,/a arrêté les relances/);
});

test('a bounce disables automatic sending and tells the artisan, without forwarding the server message',async()=>{
  const h=harness();
  const r=await ingestQuoteReply(email({from:'mailer-daemon@mx.example.test',subject:'Undelivered Mail Returned to Sender',text:'550 5.1.1 user unknown'}),h.deps);
  assert.deepEqual(r,{status:'recorded',category:'bounce'});
  const q=h.db.tables.quotes.find(x=>x.id==='qa');
  assert.equal(q.auto_send,false);assert.equal(q.reply_received_at,null);
  assert.equal(h.sent.length,1);assert.equal(h.sent[0].replyTo,undefined);
  assert.match(h.sent[0].text,/n’a pas pu être remis à durand@example\.test/);
  assert.doesNotMatch(h.sent[0].text,/550/);
});

test('an opt-out that cannot be stored is an error, never silently ignored',async()=>{
  const h=harness();const from=h.db.from.bind(h.db);
  h.db.from=t=>t==='followup_optouts'?{upsert:async()=>({data:null,error:{message:'db down'}})}:from(t);
  await assert.rejects(ingestQuoteReply(email({text:'STOP'}),h.deps),{message:'db down'});
});

test('a reply on a won quote is remembered without changing its status',async()=>{
  const h=harness();
  Object.assign(h.db.tables.quotes.find(q=>q.id==='qa'),{status:'won',auto_send:false,next_followup_at:null});
  const r=await ingestQuoteReply(email(),h.deps);
  assert.equal(r.status,'recorded');
  const q=h.db.tables.quotes.find(x=>x.id==='qa');
  assert.equal(q.status,'won');assert.ok(q.reply_received_at);
});

test('one email answering two follow-ups reaches both quotes, each once',async()=>{
  const h=harness();
  h.db.tables.followups.push({id:'fa2',quote_id:'qa2',user_id:A,reply_token:'cdefghijklmnopqrstuv'});
  h.db.tables.quotes.push({id:'qa2',user_id:A,client_name:'M. Durand',client_email:'durand@example.test',title:'Gouttières',status:'open',auto_send:true,next_followup_at:'2026-11-02T08:00:00Z',reply_received_at:null});
  const to=[`reponses+${TOKEN_A}@relanzio.test`,'reponses+cdefghijklmnopqrstuv@relanzio.test'];
  assert.deepEqual(tokensFromRecipients([...to,to[0].toUpperCase()],CFG),[TOKEN_A,'cdefghijklmnopqrstuv']);
  assert.notEqual(dedupeKeyFor({messageId:'<m@x>'},TOKEN_A),dedupeKeyFor({messageId:'<m@x>'},'cdefghijklmnopqrstuv'));
  for(const token of tokensFromRecipients(to,CFG))assert.equal((await ingestQuoteReply(email({to}),{...h.deps,token})).status,'stopped');
  assert.ok(h.db.tables.quotes.filter(q=>q.user_id===A).every(q=>q.reply_received_at));
  assert.equal(h.db.tables.quote_replies.length,2);
});

test('if the forward fails the stop still holds and the error report contains no message content',async()=>{
  const h=harness({forwardFails:true});
  const r=await ingestQuoteReply(email(),h.deps);
  assert.equal(r.status,'stopped_forward_failed');
  assert.ok(h.db.tables.quotes.find(q=>q.id==='qa').reply_received_at);
  assert.equal(h.errors.length,1);
  const dump=JSON.stringify(h.errors[0].metadata);
  assert.doesNotMatch(dump,/accord|durand@|Toiture/);
});

test('a failed forward is retried on the next poll, a bounded number of times, and never sent twice',async()=>{
  const h=harness({forwardFails:true});
  assert.equal((await ingestQuoteReply(email(),h.deps)).status,'stopped_forward_failed');
  assert.equal(h.db.tables.quote_replies[0].forward_attempts,1);
  h.state.forwardFails=false;
  assert.deepEqual(await ingestQuoteReply(email(),h.deps),{status:'forward_retried',category:'interested'});
  assert.equal(h.sent.length,1);assert.ok(h.db.tables.quote_replies[0].notified_at);
  assert.deepEqual(await ingestQuoteReply(email(),h.deps),{status:'duplicate'});
  assert.equal(h.sent.length,1);
  assert.equal(h.rpcCalls.filter(c=>c.args.p_effect==='stop').length,3,'the stop is idempotent in the database');
  // Provider down for good: gives up after MAX_FORWARD_ATTEMPTS (the reply stays visible in the app).
  const h2=harness({forwardFails:true});
  for(let i=0;i<MAX_FORWARD_ATTEMPTS+3;i++)await ingestQuoteReply(email(),h2.deps);
  assert.equal(h2.errors.filter(e=>e.scope==='reply.forward').length,MAX_FORWARD_ATTEMPTS);
});

test('attachments: allowed files forwarded, others announced, never silently dropped',async()=>{
  const raw=['Message-ID: <att@x>','From: durand@example.test',`To: reponses+${TOKEN_A}@relanzio.test`,'Subject: devis signé','Content-Type: multipart/mixed; boundary="b1"','','--b1','Content-Type: text/plain; charset=utf-8','','Voici le devis signé.','--b1','Content-Type: application/pdf; name="devis-signe.pdf"','Content-Disposition: attachment; filename="devis-signe.pdf"','Content-Transfer-Encoding: base64','',Buffer.from('%PDF-1.4 test').toString('base64'),'--b1','Content-Type: application/x-msdownload','Content-Disposition: attachment; filename="setup.exe"','Content-Transfer-Encoding: base64','',Buffer.from('MZ').toString('base64'),'--b1--',''].join('\r\n');
  const files=extractAttachments(raw);
  assert.deepEqual(files.map(f=>f.filename),['devis-signe.pdf','setup.exe']);
  assert.equal(Buffer.from(files[0].content,'base64').toString(),'%PDF-1.4 test');
  const h=harness();
  await ingestQuoteReply(parseImapReply(raw),{...h.deps,attachments:files});
  assert.deepEqual(h.sent[0].attachments.map(a=>a.name),['devis-signe.pdf']);
  assert.match(h.sent[0].text,/1 pièce\(s\) jointe\(s\) non transmise\(s\)/);
  assert.match(h.sent[0].text,/Voici le devis signé/);
});

test('the reply mailbox poll is read-only, skips other mail and already ingested replies',async()=>{
  resetReplyPollCache();
  const h=harness();
  h.db.tables.quote_replies=[{id:'old',dedupe_key:`email:${TOKEN_A}:<seen@x>`,notified_at:'2026-10-29T10:00:00Z',forward_attempts:1}];
  const lit=s=>Buffer.from(`* 1 FETCH (RFC822.SIZE ${s.length} BODY[] {${Buffer.byteLength(s)}}\r\n${s})\r\nA OK\r\n`);
  const mails={
    1:`Message-ID: <seen@x>\r\nTo: reponses+${TOKEN_A}@relanzio.test\r\nFrom: durand@example.test\r\n\r\nDéjà vu`,
    2:`Message-ID: <other@x>\r\nTo: contact@relanzio.test\r\nFrom: prospect@example.test\r\n\r\nProspection`,
    3:`Message-ID: <new@x>\r\nTo: reponses+${TOKEN_A}@relanzio.test\r\nFrom: durand@example.test\r\nSubject: Re: devis\r\n\r\nOui, on y va.`
  };
  const commands=[];
  class FakeImap{
    constructor(opts){assert.equal(opts.host,'imap.relanzio.test');}
    async connect(){}
    async examine(box){commands.push('EXAMINE '+box);return {status:box==='INBOX'?'OK':'NO',response:Buffer.from('')};}
    async searchSince(){return {status:'OK',response:Buffer.from('* SEARCH 1 2 3\r\n')};}
    async fetchHeaders(uid){commands.push('HEAD '+uid);return {status:'OK',response:lit(mails[uid])};}
    async fetchRaw(uid){commands.push('RAW '+uid);return {status:'OK',response:lit(mails[uid])};}
    async close(){commands.push('CLOSE');}
  }
  const summary=await pollQuoteReplies({...h.deps,Client:FakeImap,log:()=>{}});
  assert.deepEqual({c:summary.candidates,i:summary.ingested,d:summary.duplicate,u:summary.unmatched},{c:3,i:1,d:1,u:1});
  assert.deepEqual(commands.filter(c=>c.startsWith('RAW')),['RAW 3'],'full message fetched only for new product replies');
  assert.ok(commands.includes('CLOSE'));
  assert.ok(!commands.some(c=>/STORE|EXPUNGE|DELETE|SELECT /.test(c)));
  assert.ok(h.db.tables.quotes.find(q=>q.id==='qa').reply_received_at);
  // Second poll (every 2 min): messages already handled or irrelevant are not fetched again.
  commands.length=0;
  const again=await pollQuoteReplies({...h.deps,Client:FakeImap,log:()=>{}});
  assert.deepEqual({i:again.ingested,s:again.skipped},{i:0,s:3});
  assert.deepEqual(commands.filter(c=>/^(HEAD|RAW)/.test(c)),[],'no fetch at all');
  assert.equal(h.sent.length,1);
});

test('the poll fetches a message again only while its forward still has to be retried',async()=>{
  resetReplyPollCache();
  const h=harness({forwardFails:true});
  const lit=s=>Buffer.from(`* 1 FETCH (RFC822.SIZE ${s.length} BODY[] {${Buffer.byteLength(s)}}\r\n${s})\r\nA OK\r\n`);
  const mail=`Message-ID: <retry@x>\r\nTo: reponses+${TOKEN_A}@relanzio.test\r\nFrom: durand@example.test\r\nSubject: Re: devis\r\n\r\nOui, on y va.`;
  const commands=[];
  class FakeImap{
    async connect(){}
    async examine(box){return {status:box==='INBOX'?'OK':'NO',response:Buffer.from('* OK [UIDVALIDITY 42]\r\n')};}
    async searchSince(){return {status:'OK',response:Buffer.from('* SEARCH 7\r\n')};}
    async fetchHeaders(uid){commands.push('HEAD '+uid);return {status:'OK',response:lit(mail)};}
    async fetchRaw(uid){commands.push('RAW '+uid);return {status:'OK',response:lit(mail)};}
    async close(){}
  }
  const poll=()=>pollQuoteReplies({...h.deps,Client:FakeImap,log:()=>{}});
  assert.equal((await poll()).ingested,1);assert.equal(h.sent.length,0);
  h.state.forwardFails=false;
  assert.equal((await poll()).retried,1);assert.equal(h.sent.length,1);
  commands.length=0;
  assert.equal((await poll()).skipped,1);assert.deepEqual(commands,[]);
  assert.equal(h.sent.length,1,'forwarded exactly once');
});

test('"Le client a répondu" (phone, SMS…) stops the quote through the same database rule',async()=>{
  const h=harness();
  const r=await recordManualReply({quote:{id:'qa',user_id:A},channel:'phone',requestKey:'k1',db:h.db});
  assert.ok(r.stopped);
  assert.equal(h.rpcCalls[0].args.p_source,'manual');assert.equal(h.rpcCalls[0].args.p_channel,'phone');
  const again=await recordManualReply({quote:{id:'qa',user_id:A},channel:'phone',requestKey:'k1',db:h.db});
  assert.ok(again.duplicate,'double tap is idempotent');
  await assert.rejects(recordManualReply({quote:{id:'qa',user_id:B},channel:'phone',requestKey:'k2',db:h.db}),/QUOTE_NOT_FOUND/);
});

test('no send path can go out after a reply',()=>{
  const src=readFileSync(new URL('../server/followups.js',import.meta.url),'utf8');
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  assert.match(src,/if \(quote\.reply_received_at\) throw new Error\('QUOTE_REPLIED'\)/,'preview');
  assert.match(src,/if\(quote\.reply_received_at\)throw new Error\('QUOTE_REPLIED'\);\n  if\(!quote\.client_email\)/,'send');
  assert.match(src,/\.eq\('followup_step',quote\.followup_step\)\.is\('reply_received_at',null\)/,'atomic claim');
  assert.match(src,/\.lt\('followup_step',3\)\.is\('reply_received_at',null\)/,'cron query');
  assert.match(src,/if \(!replyConfiguration\(\)\.configured\) return \[\{ skipped:'reply_detection_not_configured' \}\]/,'no automatic send without reply detection');
  assert.match(src,/reply_token:replyToken/);assert.match(src,/replyTo:\(replyToken&&replyAddress\(replyToken\)\)\|\|profile\.email/);
  assert.match(server,/if\(quote\.reply_received_at\)return res\.status\(409\)\.json\(\{error:REPLIED_MESSAGE,code:'QUOTE_REPLIED'\}\);if\(await isQuoteLocked/,'preview route');
  assert.match(server,/app\.post\('\/api\/quotes\/:id\/client-replied'/);
  const sql=readFileSync(new URL('../supabase/migrations/20261029100000_quote_replies.sql',import.meta.url),'utf8');
  assert.match(sql,/if v_quote\.reply_received_at is not null then return jsonb_build_object\('ok',false,'code','QUOTE_REPLIED'\)/);
  assert.match(sql,/if v_next_step>=3 or v_quote\.reply_received_at is not null then/);
});
