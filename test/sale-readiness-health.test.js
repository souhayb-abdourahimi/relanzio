import test from 'node:test';
import assert from 'node:assert/strict';
import { runHealth, EXPECTED_SCHEMA, scrub } from '../scripts/sale-readiness-health.mjs';

// Fake values shaped like real ones: the report must never contain any of them.
const SECRETS={
  SUPABASE_SERVICE_ROLE_KEY:'test-service-role-NOT-A-REAL-KEY-0123456789',
  STRIPE_SECRET_KEY:'sk_live_TEST-not-a-real-key-0123',
  STRIPE_WEBHOOK_SECRET:'whsec_TEST-not-a-real-secret-0123',
  BREVO_API_KEY:'xkeysib-TEST-not-a-real-key-0123456789',
  BREVO_WEBHOOK_SECRET:'fake-brevo-webhook-secret-0123456789',
  EMAIL_LINK_SECRET:'fake-email-link-secret-0123456789abcdef',
  REPLY_IMAP_PASSWORD:'fake-reply-imap-password-0123',
  IMAP_PASSWORD:'fake-commercial-imap-password-0123',
  SUPABASE_ACCESS_TOKEN:'sbp_TEST-not-a-real-token-0123456789'
};
const ENV={
  ...SECRETS,APP_URL:'https://relanzio.test',RAILWAY_GIT_COMMIT_SHA:'1cc431e3dfd39551db8b3ba78705cfd1af46407c',
  SUPABASE_URL:'https://abcdefghijklmnop.supabase.co',BILLING_ENABLED:'true',STRIPE_PRO_PRICE_ID:'price_FAKE123',
  EMAIL_FROM_ADDRESS:'notifications@relanzio.com',
  REPLY_INBOUND_ADDRESS:'reponses@reply.relanzio.com',REPLY_IMAP_HOST:'imap.reply.test',REPLY_IMAP_PORT:'993',REPLY_IMAP_USER:'reponses@reply.relanzio.com',
  IMAP_HOST:'imap.commercial.test',IMAP_PORT:'993',IMAP_USER:'contact@relanzio.com',
  COMMERCIAL_FEEDER_ENABLED:'true',COMMERCIAL_SEQUENCE_ENABLED:'true',COMMERCIAL_OUTREACH_SEND_ENABLED:'true',LEGAL_PAGES_APPROVED:'true',IMAP_E2E_CERTIFIED:'true'
};

function fakeWorld(over={}){
  const calls=[];
  const json=(body,status=200,headers={})=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json',...headers}});
  const fetchImpl=async(url,init={})=>{
    const u=String(url);calls.push({method:init.method||'GET',url:u});
    if(over.throwOn&&u.includes(over.throwOn))throw new Error(`connect failed with key ${SECRETS.STRIPE_SECRET_KEY}`);
    if(u==='https://relanzio.test/api/health')return json({ok:true});
    if(u==='https://relanzio.test/api/readiness')return json({ready:true});
    if(u.includes('/rest/v1/outreach_queue?select=id&sequence_step=gte.2'))return json([],200,{'content-range':`0-0/${over.j7??0}`});
    if(u.includes('/rest/v1/outreach_queue?select=id&sequence_step=eq.0'))return json([],200,{'content-range':'0-0/4'});
    if(u.includes('/rest/v1/')){const t=u.split('/rest/v1/')[1].split('?')[0];return over.missingTable===t?json({code:'42703',message:'column does not exist'},400):json([]);}
    if(u.startsWith('https://api.stripe.com/v1/prices/'))return json({active:true,unit_amount:over.price??2900,currency:'eur',recurring:{interval:'month'}});
    if(u.startsWith('https://api.stripe.com/v1/webhook_endpoints'))return json({data:[{url:'https://relanzio.com/api/stripe/webhook',status:'enabled',enabled_events:['checkout.session.completed','customer.subscription.updated','customer.subscription.deleted','invoice.paid','invoice.payment_failed']}]});
    if(u==='https://api.brevo.com/v3/account')return json({plan:[{type:'free',creditsType:'sendLimit',credits:300}]});
    if(u==='https://api.brevo.com/v3/senders')return json({senders:[{email:'notifications@relanzio.com',active:true},{email:'contact@relanzio.com',active:true}]});
    if(u.startsWith('https://api.brevo.com/v3/webhooks'))return json({webhooks:[{url:'https://relanzio.com/api/brevo/webhook'}]});
    if(u.startsWith('https://api.supabase.com/v1/projects/abcdefghijklmnop/database/backups'))return json({pitr_enabled:false,backups:[{inserted_at:new Date(Date.now()-5*3600000).toISOString()}]});
    return json({error:'unexpected'},404);
  };
  const imapLogins=[];
  const imapProbe=async cfg=>{imapLogins.push({host:cfg.host,port:cfg.port});return true;};
  return {calls,fetchImpl,imapProbe,imapLogins};
}

const noSecretIn=report=>{for(const [name,value] of Object.entries(SECRETS))assert.ok(!report.includes(value),`${name} leaked`);};

test('healthy production: every section passes, with the expected summary',async()=>{
  const w=fakeWorld();
  const r=await runHealth({env:ENV,fetchImpl:w.fetchImpl,imapProbe:w.imapProbe});
  assert.deepEqual(r.status,{APP:'PASS',DB:'PASS',BILLING:'PASS',EMAIL:'PASS',BACKUPS:'PASS',OUTREACH:'PASS',SECRETS:'CONFIGURED'},r.report);
  assert.ok(r.ok);
  assert.match(r.report,/^SALE_READINESS_HEALTH\nAPP: PASS\nDB: PASS\nBILLING: PASS\nEMAIL: PASS\nBACKUPS: PASS\nOUTREACH: PASS\nSECRETS: CONFIGURED\n/);
  assert.match(r.report,/deployed commit: 1cc431e/);assert.match(r.report,/stripe mode: live/);assert.match(r.report,/pending third step \(J\+7\): 0/);
  assert.deepEqual(w.imapLogins.map(x=>x.host),['imap.reply.test','imap.commercial.test']);
  noSecretIn(r.report);
});

test('read-only: only GET requests, and only to the app, Supabase REST/management, Stripe and Brevo',async()=>{
  const w=fakeWorld();
  await runHealth({env:ENV,fetchImpl:w.fetchImpl,imapProbe:w.imapProbe});
  assert.ok(w.calls.length>=Object.keys(EXPECTED_SCHEMA).length+8);
  for(const c of w.calls){
    assert.equal(c.method,'GET',c.url);
    assert.match(c.url,/^https:\/\/(relanzio\.test\/api\/(health|readiness)|abcdefghijklmnop\.supabase\.co\/rest\/v1\/|api\.stripe\.com\/v1\/(prices|webhook_endpoints)|api\.brevo\.com\/v3\/(account|senders|webhooks)|api\.supabase\.com\/v1\/projects\/abcdefghijklmnop\/database\/backups)/,c.url);
  }
  // No write endpoint of any provider, no email sending endpoint.
  assert.ok(!w.calls.some(c=>/\/smtp\/|\/rpc\/|checkout|portal/.test(c.url)));
});

test('real problems are reported: missing column, wrong price, pending J+7, missing backups token',async()=>{
  let w=fakeWorld({missingTable:'quote_replies'});
  let r=await runHealth({env:ENV,fetchImpl:w.fetchImpl,imapProbe:w.imapProbe});
  assert.equal(r.status.DB,'FAIL');assert.match(r.report,/quote_replies: missing table or column/);assert.equal(r.ok,false);
  w=fakeWorld({price:1900});
  r=await runHealth({env:ENV,fetchImpl:w.fetchImpl,imapProbe:w.imapProbe});
  assert.equal(r.status.BILLING,'FAIL');
  w=fakeWorld({j7:2});
  r=await runHealth({env:ENV,fetchImpl:w.fetchImpl,imapProbe:w.imapProbe});
  assert.equal(r.status.OUTREACH,'FAIL');assert.match(r.report,/pending third step \(J\+7\): 2/);
  w=fakeWorld();
  r=await runHealth({env:{...ENV,SUPABASE_ACCESS_TOKEN:''},fetchImpl:w.fetchImpl,imapProbe:w.imapProbe});
  assert.equal(r.status.BACKUPS,'WARNING');
  r=await runHealth({env:{...ENV,LEGAL_PAGES_APPROVED:'false'},fetchImpl:w.fetchImpl,imapProbe:w.imapProbe});
  assert.equal(r.status.OUTREACH,'WARNING');
});

test('provider errors never leak a secret, and an empty environment contacts nothing',async()=>{
  const w=fakeWorld({throwOn:'api.stripe.com'});
  const r=await runHealth({env:ENV,fetchImpl:w.fetchImpl,imapProbe:async()=>{throw new Error(`LOGIN failed for ${SECRETS.IMAP_PASSWORD}`)}});
  assert.equal(r.status.BILLING,'FAIL');assert.equal(r.status.EMAIL,'FAIL');
  noSecretIn(r.report);
  assert.equal(scrub('token sk_live_TEST-not-a-real-key-0123 rejected'),'token [redacted] rejected');
  const empty=fakeWorld();
  const e=await runHealth({env:{},fetchImpl:empty.fetchImpl,imapProbe:empty.imapProbe});
  assert.equal(empty.calls.length,0,'no network call without configuration');assert.equal(empty.imapLogins.length,0);
  assert.equal(e.status.SECRETS,'MISSING');assert.equal(e.ok,false);
});
