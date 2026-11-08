import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createBillingReadiness,createAvailabilityRouter} from '../server/billing-readiness.js';
const load=()=>import('../server/predeploy-check.js').catch(e=>{if(e.code==='ERR_MODULE_NOT_FOUND')return {};throw e;});
function fixture(){
 const env={NODE_ENV:'production',APP_URL:'https://relanzio.com',SUPABASE_URL:'http://127.0.0.1:54321',SUPABASE_ANON_KEY:'anon_fictional',SUPABASE_SERVICE_ROLE_KEY:'role_fictional',STRIPE_SECRET_KEY:'sk_live_fictional',STRIPE_EXPECTED_MODE:'live',STRIPE_EXPECTED_ACCOUNT_ID:'acct_fake',STRIPE_WEBHOOK_SECRET:'whsec_fictional',STRIPE_PRO_PRICE_ID:'price_fake',BREVO_API_KEY:'brevo_fictional',BREVO_WEBHOOK_SECRET:'brevo_secret_fictional',EMAIL_FROM_ADDRESS:'private@example.invalid'};
 const calls=[];let failure=null;
 const stripe={accounts:{retrieve:async()=>{calls.push('GET account');if(failure)throw failure;return{id:'acct_fake'};}},prices:{retrieve:async()=>{calls.push('GET price');return{id:'price_fake',active:true,livemode:true,currency:'eur',unit_amount:2900,recurring:{interval:'month',interval_count:1}};}}};
 return{env,calls,stripe,fail:e=>failure=e};
}
async function run(h){const mod=await load();assert.equal(typeof mod.runPredeployCheck,'function','safe predeploy check must exist');return mod.runPredeployCheck({env:h.env,stripe:h.stripe});}
test('predeploy only reads Stripe and never calls database, auth, email or app',async()=>{
 const h=fixture(),result=await run(h);assert.equal(result.ok,true);assert.deepEqual(h.calls,['GET account','GET price']);
 assert.doesNotMatch(JSON.stringify(result),/sk_live|whsec|role_fictional|private@|brevo_fictional/);
});
for(const [name,change] of [['missing mode',h=>delete h.env.STRIPE_EXPECTED_MODE],['missing account',h=>delete h.env.STRIPE_EXPECTED_ACCOUNT_ID],['missing database key',h=>delete h.env.SUPABASE_SERVICE_ROLE_KEY],['missing app URL',h=>delete h.env.APP_URL],['invalid database URL',h=>h.env.SUPABASE_URL='not-a-url'],['missing webhook secret',h=>delete h.env.STRIPE_WEBHOOK_SECRET],['Test mode in production',h=>{h.env.STRIPE_EXPECTED_MODE='test';h.env.STRIPE_SECRET_KEY='sk_test_fake';}]])test(`${name} blocks predeploy without leaking credentials`,async()=>{
 const h=fixture();change(h);const result=await run(h);assert.equal(result.ok,false);assert.doesNotMatch(JSON.stringify(result),/sk_live|sk_test|whsec|role_fictional|private@/);
});
test('temporary Stripe outage rejects predeploy and recovery succeeds',async()=>{
 const h=fixture();h.fail(Object.assign(Error('sk_live_fictional private@example.invalid'),{type:'StripeConnectionError'}));let r=await run(h);assert.equal(r.ok,false);assert.equal(r.state,'temporarily_unavailable');assert.doesNotMatch(JSON.stringify(r),/sk_live|private@/);
 h.fail(null);r=await run(h);assert.equal(r.ok,true);
});
test('HTTP 503 remains a failed readiness gate even when predeploy configuration passed',async()=>{
 const h=fixture();assert.equal((await run(h)).ok,true);h.fail({type:'StripeConnectionError'});
 const billing=createBillingReadiness({stripe:h.stripe,env:h.env});await billing.check();
 const router=createAvailabilityRouter({billing,dependenciesReady:()=>true});const layer=router.stack.find(x=>x.route?.path==='/readiness');let status=200,body;
 const response={set(){return this;},status(x){status=x;return this;},json(x){body=x;return this;}};
 layer.route.stack[0].handle({},response);assert.equal(status,503);assert.deepEqual(body,{ready:false});
});
for(const file of ['server/qa-outreach-safety.mjs','server/qa-auth-domain-final.mjs'])test(`${file} refuses direct production execution before external access`,()=>{
 const env={PATH:process.env.PATH,NODE_ENV:'test',DOTENV_CONFIG_PATH:'/dev/null',ALLOW_LOCAL_DESTRUCTIVE_QA:'true',SUPABASE_URL:'https://uwgvnhnpvxoebabayqac.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'role_fictional',APP_URL:'http://127.0.0.1:1234'};
 const r=spawnSync(process.execPath,['--import','./test/helpers/local-billing-network.js',file],{env,encoding:'utf8',timeout:3000});
 assert.notEqual(r.status,0);assert.match(r.stderr,/DESTRUCTIVE_QA_LOCAL_ONLY/);assert.doesNotMatch(r.stderr,/role_fictional/);
});

test('local destructive QA guard refuses Railway production even with loopback URLs',async()=>{
 const {assertIsolatedDestructiveQa}=await import('../server/destructive-qa-guard.mjs');
 const env={NODE_ENV:'test',ALLOW_LOCAL_DESTRUCTIVE_QA:'true',APP_URL:'http://127.0.0.1:3000',SUPABASE_URL:'http://127.0.0.1:54321',RAILWAY_ENVIRONMENT_NAME:'production'};
 assert.throws(()=>assertIsolatedDestructiveQa(env),/DESTRUCTIVE_QA_LOCAL_ONLY/);
 delete env.RAILWAY_ENVIRONMENT_NAME;assert.doesNotThrow(()=>assertIsolatedDestructiveQa(env));
 for(const url of ['https://uwgvnhnpvxoebabayqac.supabase.co','https://relanzio.com','http://localhost.example.com']){
  assert.throws(()=>assertIsolatedDestructiveQa({...env,SUPABASE_URL:url}),/DESTRUCTIVE_QA_LOCAL_ONLY/);
 }
});

test('actual predeploy entry point uses real Stripe SDK with in-memory network denial',async()=>{
 const h=fixture(),original={...process.env},exitCode=process.exitCode;
 const http=(await import('node:http')).default,https=(await import('node:https')).default;
 const Stripe=(await import('stripe')).default,proto=Object.getPrototypeOf(Stripe.createNodeHttpClient());
 const saved={http:http.request,https:https.request,fetch:globalThis.fetch,makeRequest:proto.makeRequest};
 try{
  Object.assign(process.env,h.env,{LAB_STRIPE_FAILURE:'false'});
  await import('./helpers/predeploy-fake-transport.js');
  process.exitCode=0;await import('../server/qa-predeploy-final.mjs?test=valid');assert.equal(process.exitCode,0);
  process.env.LAB_STRIPE_FAILURE='true';process.exitCode=0;
  await import('../server/qa-predeploy-final.mjs?test=outage');assert.equal(process.exitCode,1);
 }finally{
  http.request=saved.http;https.request=saved.https;globalThis.fetch=saved.fetch;proto.makeRequest=saved.makeRequest;
  for(const k of Object.keys(process.env))if(!(k in original))delete process.env[k];
  Object.assign(process.env,original);process.exitCode=exitCode;
 }
});

test('wrong Stripe account and inactive price each block predeploy',async()=>{
 const account=fixture();account.stripe.accounts.retrieve=async()=>({id:'acct_wrong'});
 let result=await run(account);assert.equal(result.ok,false);assert.equal(result.state,'configuration_error');
 const price=fixture();price.stripe.prices.retrieve=async()=>({id:'price_fake',active:false,livemode:true,currency:'eur',unit_amount:2900,recurring:{interval:'month',interval_count:1}});
 result=await run(price);assert.equal(result.ok,false);assert.equal(result.state,'configuration_error');
});
