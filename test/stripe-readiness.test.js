import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import {once} from 'node:events';
import {createBillingReadiness,createAvailabilityRouter} from '../server/billing-readiness.js';

function fixture(options={}){
 const env={NODE_ENV:'production',STRIPE_EXPECTED_MODE:'live',STRIPE_EXPECTED_ACCOUNT_ID:'acct_fictional',STRIPE_SECRET_KEY:'sk_live_fictional',STRIPE_WEBHOOK_SECRET:'whsec_fictional',STRIPE_PRO_PRICE_ID:'price_fictional'};
 const account={id:'acct_fictional'},price={id:'price_fictional',active:true,livemode:true,currency:'eur',unit_amount:2900,recurring:{interval:'month',interval_count:1}};
 const stripe={accounts:{retrieve:async()=>account},prices:{retrieve:async()=>price}};
 const transitions=[];let time=1000;
 const monitor=createBillingReadiness({stripe,env,now:()=>time,onChange:s=>transitions.push(s),...options});
 return {env,account,price,stripe,monitor,transitions,advance:n=>time+=n};
}

test('startup is not ready before account and price are actually verified',async()=>{
 const h=fixture();assert.equal(h.monitor.snapshot().ready,false);
 await h.monitor.check();assert.equal(h.monitor.snapshot().ready,true);
 assert.equal((await h.monitor.requireReady()).accountId,'acct_fictional');
});
for(const [name,change] of [
 ['expected mode',h=>delete h.env.STRIPE_EXPECTED_MODE],
 ['expected account',h=>delete h.env.STRIPE_EXPECTED_ACCOUNT_ID],
 ['webhook secret',h=>delete h.env.STRIPE_WEBHOOK_SECRET],
 ['secret key',h=>delete h.env.STRIPE_SECRET_KEY],
 ['price',h=>delete h.env.STRIPE_PRO_PRICE_ID],
 ['production Test mode',h=>h.env.STRIPE_EXPECTED_MODE='test'],
 ['wrong account',h=>h.account.id='acct_other'],
 ['Test price',h=>h.price.livemode=false],
 ['archived price',h=>h.price.active=false],
 ['unknown price activation',h=>delete h.price.active],
 ['wrong amount',h=>h.price.unit_amount=1900],
 ['yearly price',h=>h.price.recurring.interval='year'],
])test(`${name}: configuration error never declares billing ready`,async()=>{
 const h=fixture();change(h);const s=await h.monitor.check();
 assert.equal(s.ready,false);assert.equal(s.state,'configuration_error');
 await assert.rejects(h.monitor.requireReady(),e=>e.billingUnavailable===true);
});
for(const [name,error,state] of [
 ['invalid key',{type:'StripeAuthenticationError',statusCode:401},'configuration_error'],
 ['insufficient permissions',{type:'StripePermissionError',statusCode:403},'configuration_error'],
 ['price not found',{code:'resource_missing',statusCode:404},'configuration_error'],
 ['network failure',{type:'StripeConnectionError'},'temporarily_unavailable'],
 ['rate limiting',{type:'StripeRateLimitError',statusCode:429},'temporarily_unavailable'],
 ['Stripe server failure',{type:'StripeAPIError',statusCode:503},'temporarily_unavailable'],
 ['unrecognized exception',{},'verification_error'],
])test(`${name}: safe diagnosis and no old green result`,async()=>{
 const h=fixture();await h.monitor.check();
 h.stripe.accounts.retrieve=async()=>{throw Object.assign(Error('sk_live_secret user@example.com 4242424242424242'),error);};
 const s=await h.monitor.check();assert.equal(s.ready,false);assert.equal(s.state,state);
 assert.doesNotMatch(JSON.stringify([s,h.transitions]),/sk_live|user@|424242/);
});
test('API recovery restores readiness without restart or profile mutation',async()=>{
 const h=fixture(),retrieve=h.stripe.accounts.retrieve;
 h.stripe.accounts.retrieve=async()=>{throw {type:'StripeConnectionError'};};
 await h.monitor.check();assert.equal(h.monitor.snapshot().ready,false);
 h.stripe.accounts.retrieve=retrieve;await h.monitor.check();assert.equal(h.monitor.snapshot().ready,true);
});
test('expired verification fails closed even if periodic scheduling stops',async()=>{
 const h=fixture({maxAgeMs:100});await h.monitor.check();h.advance(101);
 assert.equal(h.monitor.snapshot().ready,false);assert.equal(h.monitor.snapshot().state,'stale');
});
test('hanging API times out; late success cannot restore an obsolete green result',async()=>{
 const h=fixture({timeoutMs:15});let finish;
 h.stripe.accounts.retrieve=()=>new Promise(resolve=>finish=resolve);
 const s=await h.monitor.check();assert.equal(s.state,'temporarily_unavailable');
 finish(h.account);await new Promise(resolve=>setImmediate(resolve));
 assert.equal(h.monitor.snapshot().ready,false);
});
test('concurrent checks share one verification and logging failure cannot change outcome',async()=>{
 const h=fixture({onChange:()=>{throw Error('logger unavailable');}});let finish,calls=0;
 h.stripe.accounts.retrieve=()=>{calls++;return new Promise(resolve=>finish=resolve);};
 const a=h.monitor.check(),b=h.monitor.check();await Promise.resolve();finish(h.account);
 await Promise.all([a,b]);assert.equal(calls,1);assert.equal(h.monitor.snapshot().ready,true);
});
test('periodic startup check retries a temporary failure automatically',async t=>{
 const h=fixture({intervalMs:10});let calls=0;
 h.stripe.accounts.retrieve=async()=>{if(calls++===0)throw {type:'StripeConnectionError'};return h.account;};
 t.after(()=>h.monitor.stop());await h.monitor.start();assert.equal(h.monitor.snapshot().ready,false);
 for(let i=0;i<30&&!h.monitor.snapshot().ready;i++)await new Promise(r=>setTimeout(r,10));
 assert.equal(h.monitor.snapshot().ready,true);
});
test('Railway readiness refuses broken billing while public pages and liveness stay available',async t=>{
 const h=fixture(),app=express();app.use('/api',createAvailabilityRouter({billing:h.monitor,dependenciesReady:()=>true}));
 app.get('/',(_req,res)=>res.send('Relanzio public'));
 const server=app.listen(0,'127.0.0.1');await once(server,'listening');t.after(()=>server.close());
 const url=`http://127.0.0.1:${server.address().port}`;
 assert.equal((await fetch(url+'/api/readiness')).status,503);
 await h.monitor.check();assert.equal((await fetch(url+'/api/readiness')).status,200);
 h.stripe.accounts.retrieve=async()=>{throw {type:'StripeConnectionError'};};await h.monitor.check();
 assert.equal((await fetch(url+'/api/readiness')).status,503);
 assert.equal((await fetch(url+'/api/health')).status,200);assert.equal((await fetch(url)).status,200);
 assert.deepEqual(await (await fetch(url+'/api/readiness')).json(),{ready:false});
});

test('real Stripe SDK uses only local GET endpoints and honors bounded verification',async t=>{
 const {default:Stripe}=await import('stripe');const {createServer}=await import('node:http');
 const h=fixture();let fail=false;const requests=[];
 const server=createServer((req,res)=>{
  requests.push([req.method,req.url]);res.setHeader('Content-Type','application/json');
  if(fail){res.statusCode=503;return res.end(JSON.stringify({error:{type:'api_error',message:'sensitive provider detail'}}));}
  res.end(JSON.stringify(req.url==='/v1/account'?h.account:h.price));
 });server.listen(0,'127.0.0.1');await once(server,'listening');t.after(()=>server.close());
 const stripe=new Stripe('sk_live_fictional',{host:'127.0.0.1',port:server.address().port,protocol:'http',maxNetworkRetries:0});
 const monitor=createBillingReadiness({stripe,env:h.env,timeoutMs:1000});
 assert.equal((await monitor.check()).ready,true);
 assert.deepEqual(requests,[['GET','/v1/account'],['GET','/v1/prices/price_fictional']]);
 fail=true;assert.equal((await monitor.check()).state,'temporarily_unavailable');
 assert.doesNotMatch(JSON.stringify(monitor.snapshot()),/sensitive provider/);
});

test('a hung diagnostic sink cannot hang billing verification',async()=>{
 const h=fixture({onChange:()=>new Promise(()=>{})});
 const result=await Promise.race([h.monitor.check(),new Promise(r=>setTimeout(()=>r('blocked'),50))]);
 assert.notEqual(result,'blocked');assert.equal(result.ready,true);
});
