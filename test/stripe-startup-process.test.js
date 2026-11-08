import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createServer} from 'node:http';

// Runs the real server with a fresh environment: no inherited service credentials or .env.
// The only permitted external dependency is a local fake Supabase Auth endpoint.
for(const [name,config] of [
 ['missing expected variables',{}],
 ['Test configuration in production',{STRIPE_EXPECTED_MODE:'test',STRIPE_EXPECTED_ACCOUNT_ID:'acct_fake'}],
])test(`real process: ${name} blocks billing but serves public health`,async t=>{
 const writes=[];
 const fake=createServer((req,res)=>{
  if(req.method!=='GET')writes.push(req.method+' '+req.url);
  res.setHeader('Content-Type','application/json');
  if(req.url==='/auth/v1/user')return res.end(JSON.stringify({id:'user_fake',email:'fake@example.invalid'}));
  if(req.method==='GET'&&req.url.startsWith('/rest/v1/profiles?'))return res.end('[]');
  res.statusCode=500;res.end('{}');
 });fake.listen(0,'127.0.0.1');await once(fake,'listening');t.after(()=>fake.close());
 const portReservation=createServer();portReservation.listen(0,'127.0.0.1');await once(portReservation,'listening');const port=portReservation.address().port;await new Promise(r=>portReservation.close(r));
 const child=spawn(process.execPath,['--import','./test/helpers/local-billing-network.js','server/index.js'],{cwd:process.cwd(),env:{PATH:process.env.PATH,LAB_STRIPE_PORT:String(fake.address().port),NODE_ENV:'production',PORT:String(port),DOTENV_CONFIG_PATH:'/dev/null',SUPABASE_URL:`http://127.0.0.1:${fake.address().port}`,SUPABASE_ANON_KEY:'fake',SUPABASE_SERVICE_ROLE_KEY:'fake',STRIPE_SECRET_KEY:'sk_test_fictional',STRIPE_WEBHOOK_SECRET:'whsec_fictional',STRIPE_PRO_PRICE_ID:'price_fake',BILLING_ENABLED:'true',BREVO_API_KEY:'fake',BREVO_WEBHOOK_SECRET:'fake',EMAIL_FROM_ADDRESS:'fake@example.invalid',...config},stdio:['ignore','pipe','pipe']});
 let logs='';child.stdout.on('data',c=>logs+=c);child.stderr.on('data',c=>logs+=c);
 t.after(async()=>{if(child.exitCode===null){child.kill();await once(child,'exit');}});
 const base=`http://127.0.0.1:${port}`;let running=false;
 for(let i=0;i<400;i++){try{running=(await fetch(base+'/api/health')).ok;if(running)break;}catch{}await new Promise(r=>setTimeout(r,25));}
 assert.equal(running,true,logs);
 assert.equal((await fetch(base+'/api/readiness')).status,503);
 for(const path of ['/api/billing/checkout','/api/billing/portal']){
  const response=await fetch(base+path,{method:'POST',headers:{Authorization:'Bearer fake-user-token'}});
  assert.equal(response.status,503);assert.doesNotMatch(await response.text(),/sk_test|whsec|acct_fake/);
 }
 assert.deepEqual(writes,[],'no database or payment write when config is invalid');
 assert.doesNotMatch(logs,/sk_test_fictional|whsec_fictional|fake@example/);
 assert.match(logs,/configuration_error/);
});

test('real process: verified Live startup, temporary API outage, then recovery without restart',async t=>{
 let outage=false;const writes=[];
 const fake=createServer((req,res)=>{
  res.setHeader('Content-Type','application/json');
  if(req.method!=='GET')writes.push(req.url);
  if(req.url==='/v1/account'){
   if(outage){res.statusCode=503;return res.end(JSON.stringify({error:{type:'api_error',message:'private provider data'}}));}
   return res.end(JSON.stringify({id:'acct_fake'}));
  }
  if(req.url==='/v1/prices/price_fake')return res.end(JSON.stringify({id:'price_fake',active:true,livemode:true,currency:'eur',unit_amount:2900,recurring:{interval:'month',interval_count:1}}));
  if(req.url==='/auth/v1/user')return res.end(JSON.stringify({id:'user_fake',email:'fake@example.invalid'}));
  if(req.method==='GET'&&req.url.startsWith('/rest/v1/profiles?')){
   const isUser=new URL(req.url,'http://localhost').searchParams.get('id')==='eq.user_fake';
   return res.end(JSON.stringify(isUser?[{id:'user_fake',plan:'pro',subscription_status:'active',stripe_customer_id:'cus_fake',stripe_subscription_id:'sub_fake'}]:[]));
  }
  res.statusCode=500;res.end('{}');
 });fake.listen(0,'127.0.0.1');await once(fake,'listening');t.after(()=>fake.close());
 const reserve=createServer();reserve.listen(0,'127.0.0.1');await once(reserve,'listening');const port=reserve.address().port;await new Promise(r=>reserve.close(r));
 const child=spawn(process.execPath,['--import','./test/helpers/local-billing-network.js','server/index.js'],{cwd:process.cwd(),env:{PATH:process.env.PATH,LAB_STRIPE_PORT:String(fake.address().port),NODE_ENV:'production',PORT:String(port),DOTENV_CONFIG_PATH:'/dev/null',SUPABASE_URL:`http://127.0.0.1:${fake.address().port}`,SUPABASE_ANON_KEY:'fake',SUPABASE_SERVICE_ROLE_KEY:'fake',STRIPE_SECRET_KEY:'sk_live_fictional',STRIPE_EXPECTED_MODE:'live',STRIPE_EXPECTED_ACCOUNT_ID:'acct_fake',STRIPE_WEBHOOK_SECRET:'whsec_fictional',STRIPE_PRO_PRICE_ID:'price_fake',BILLING_ENABLED:'true',BREVO_API_KEY:'fake',BREVO_WEBHOOK_SECRET:'fake',EMAIL_FROM_ADDRESS:'fake@example.invalid',ADMIN_EMAILS:'fake@example.invalid'},stdio:['ignore','pipe','pipe']});
 let logs='';child.stdout.on('data',c=>logs+=c);child.stderr.on('data',c=>logs+=c);
 t.after(async()=>{if(child.exitCode===null){child.kill();await once(child,'exit');}});
 const base=`http://127.0.0.1:${port}`;let ready=false;
 for(let i=0;i<400;i++){try{ready=(await fetch(base+'/api/readiness')).ok;if(ready)break;}catch{}await new Promise(r=>setTimeout(r,25));}
 assert.equal(ready,true,logs);
 const auth={Authorization:'Bearer fake-user-token'};
 outage=true;
 assert.equal((await fetch(base+'/api/billing/checkout',{method:'POST',headers:auth})).status,503);
 assert.equal((await fetch(base+'/api/readiness')).status,503);
 const diagnostic=await (await fetch(base+'/api/admin/readiness',{headers:auth})).json();
 assert.equal(diagnostic.billing.state,'temporarily_unavailable');
 assert.equal((await fetch(base+'/api/health')).status,200);
 outage=false;
 // An existing Pro user is denied a duplicate checkout, AFTER the API has recovered.
 assert.equal((await fetch(base+'/api/billing/checkout',{method:'POST',headers:auth})).status,409);
 assert.equal((await fetch(base+'/api/readiness')).status,200);
 assert.deepEqual(writes,[]);
 assert.doesNotMatch(logs,/sk_live_fictional|whsec_fictional|fake@example|private provider/);
});
