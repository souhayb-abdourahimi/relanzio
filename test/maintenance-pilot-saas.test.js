import test from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
// Clear all inherited provider credentials before importing the real application.
for(const key of Object.keys(process.env))if(/SUPABASE|STRIPE|BREVO|OPENAI|AUTOMATION|LIFECYCLE|ACQUISITION|MAINTENANCE|IMAP|OUTREACH|COMMERCIAL/.test(key))delete process.env[key];
Object.assign(process.env,{NODE_ENV:'test',SUPABASE_URL:'https://fixture.invalid',SUPABASE_ANON_KEY:'fixture',SUPABASE_SERVICE_ROLE_KEY:'fixture',STRIPE_SECRET_KEY:'sk_test_fixture',STRIPE_WEBHOOK_SECRET:'whsec_fixture'});
const original=globalThis.fetch;let external=0;
globalThis.fetch=(url,...args)=>{if(!String(url).startsWith('http://127.0.0.1:')){external++;throw Error('EXTERNAL_NETWORK_FORBIDDEN')}return original(url,...args)};
const {default:app}=await import('../server/index.js');
const {default:cron}=await import('node-cron');
for(const task of cron.getTasks().values())task.destroy();
// e41f138 runs existing trial maintenance at import. All attempts are blocked.
// Let its failure/logging settle; this test measures requests caused by HTTP routes.
await new Promise(r=>setTimeout(r,50));
const startupAttempts=external;
test('real SaaS routes ignore pilot payment without changing Pro or accessing DB; disabled pilot routes need no migration',async()=>{
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port;
 try{
 const health=await fetch(base+'/api/health');assert.equal(health.status,200);
 assert.equal((await fetch(base+'/api/maintenance-pilot/config')).status,404);
 const payload=JSON.stringify({id:'evt_pilot',livemode:false,type:'checkout.session.completed',data:{object:{id:'cs_test_fixture',mode:'payment',payment_status:'paid',metadata:{purpose:'maintenance_pilot',pilot_case_id:'fixture',user_id:'must-not-change-pro'}}}});
 const sig=Stripe.webhooks.generateTestHeaderString({payload,secret:'whsec_fixture'});
 const r=await fetch(base+'/api/stripe/webhook',{method:'POST',headers:{'content-type':'application/json','stripe-signature':sig},body:payload});assert.equal(r.status,200);assert.equal((await r.json()).ignored,'maintenance_pilot');assert.equal(external,startupAttempts);
 }finally{await new Promise(r=>server.close(r));for(const task of cron.getTasks().values())task.destroy();globalThis.fetch=original;}
});
