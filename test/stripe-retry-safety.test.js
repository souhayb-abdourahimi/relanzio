import {fixtureStripe,testBillingEnv} from './helpers/stripe-fixture.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createStripeWebhookProcessor, createStripeWebhookHandler } from '../server/stripe-webhook.js';
import { hasSubscriptionProAccess } from '../server/entitlements.js';
import { createFakeDb } from './helpers/fake-db.js';

// Isolated in-memory database and synthetic Stripe responses; no service clients or emails.
const BASE={id:'u1',email:'artisan@example.test',plan:'free',subscription_status:'none',stripe_customer_id:'cus_1',stripe_subscription_id:'sub_1',stripe_state_event_created:0,updated_at:'2026-11-01T00:00:00.000Z'};
function harness({profiles=[BASE]}={}){
  const db=createFakeDb({profiles}, {stripe_webhook_events:['event_id']});
  let clock=new Date('2026-11-07T10:00:00.000Z');
  const subs={sub_1:{id:'sub_1',customer:'cus_1',livemode:false,metadata:{user_id:'u1'},items:{has_more:false,data:[{quantity:1,price:{id:'price_fixture',livemode:false,currency:'eur',unit_amount:2900,recurring:{interval:'month',interval_count:1}}}]},status:'active',cancel_at_period_end:false,current_period_start:1793520000,current_period_end:1796112000}};
  const stripe={subscriptions:{retrieve:async id=>{if(!subs[id])throw Object.assign(new Error('missing'),{code:'resource_missing'});return structuredClone(subs[id]);}}};
  fixtureStripe(stripe,'u1');
  const processor=createStripeWebhookProcessor({db,stripe,now:()=>clock,env:{...testBillingEnv,BILLING_EMAILS_ENABLED:'false'},sendEmail:async()=>assert.fail('email forbidden')});
  return {db,stripe,subs,process:processor.processEvent,profile:()=>db.tables.profiles[0],advance:()=>{clock=new Date(clock.getTime()+6*60_000);}};
}
function event(type='invoice.paid',id='evt_1',created=100){
  const object=type.startsWith('customer.subscription.')?{id:'sub_1',customer:'cus_1',status:'active'}:
    type==='checkout.session.completed'?{id:'cs_1',mode:'subscription',customer:'cus_1',subscription:'sub_1',payment_status:'paid',metadata:{user_id:'u1'}}:
    {id:'in_1',customer:'cus_1',parent:{subscription_details:{subscription:'sub_1'}}};
  return {id,type,created,livemode:false,data:{object}};
}
// Inject realistic Supabase {data:null,error} results at the query boundary, not thrown exceptions only.
function failNext(db,table,operation,{code='08006',message='temporary database failure'}={}){
  const from=db.from;
  let armed=true;
  db.from=name=>{
    const q=from(name);let op='select';
    const proxy=new Proxy(q,{get(target,key){
      if(key==='then')return (resolve,reject)=>{
        if(armed&&name===table&&op===operation){armed=false;return Promise.resolve({data:null,error:{code,message}}).then(resolve,reject);}
        return target.then(resolve,reject);
      };
      if(typeof target[key]!=='function')return target[key];
      return (...args)=>{if(['insert','update','delete'].includes(key))op=key;target[key](...args);return proxy;};
    }});return proxy;
  };
}
const TYPES=['checkout.session.completed','customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','invoice.paid','invoice.payment_failed'];
for(const type of TYPES)test(`${type}: database lookup failure stays retryable, recovery then duplicate`,async()=>{
  const h=harness();
  if(type.endsWith('.deleted'))h.subs.sub_1.status='canceled';
  if(type==='invoice.payment_failed')h.subs.sub_1.status='past_due';
  const e=event(type);failNext(h.db,'profiles','select');
  await assert.rejects(h.process(e),{code:'BILLING_DB_ERROR'});
  assert.equal(h.profile().subscription_status,'none');
  assert.equal(h.db.tables.stripe_webhook_events.length,0);
  const r=await h.process(e);assert.equal(r.result.applied,true);
  assert.equal(h.profile().subscription_status,h.subs.sub_1.status);
  const before=structuredClone(h.db.tables);
  assert.equal((await h.process(e)).duplicate,true);
  assert.deepEqual(h.db.tables,before);
});

test('missing profile is explicit and retryable until the account mapping exists',async()=>{
  const h=harness({profiles:[]});
  await assert.rejects(h.process(event()),{code:'BILLING_PROFILE_NOT_FOUND'});
  assert.equal(h.db.tables.stripe_webhook_events.length,0);
  h.db.tables.profiles.push({...BASE});
  assert.equal((await h.process(event())).result.applied,true);
});

test('created subscription before Checkout is not allowed to grant Pro without a linked subscription',async()=>{
  const h=harness({profiles:[{...BASE,stripe_subscription_id:null}]});
  const created=event('customer.subscription.created','evt_created',99);
  await assert.rejects(h.process(created),{code:'BILLING_SUBSCRIPTION_NOT_LINKED'});
  assert.equal(h.profile().plan,'free');
  await h.process(event('checkout.session.completed','evt_checkout',100));
  const retry=await h.process(created);
  assert.equal(retry.result.ignored,true);
  assert.equal(h.profile().stripe_subscription_id,'sub_1');
});

test('unknown events, standalone invoices and non-subscription Checkouts are explicit ignores',async()=>{
  for(const e of [event('charge.succeeded'),{...event(),data:{object:{id:'in_oneoff',customer:'cus_1'}}},{...event('checkout.session.completed'),data:{object:{mode:'payment'}}}]){
    const h=harness();const r=await h.process(e);
    assert.equal(r.result.ignored,true);assert.ok(r.result.reason);
    assert.equal(h.profile().plan,'free');
  }
});

test('profile update and completion failures are retried without granting rights twice',async()=>{
  for(const table of ['profiles','stripe_webhook_events']){
    const h=harness();failNext(h.db,table,'update');
    await assert.rejects(h.process(event()),{code:'BILLING_DB_ERROR'});
    assert.equal(h.db.tables.stripe_webhook_events.length,0);
    await h.process(event());
    assert.equal(h.profile().subscription_status,'active');
    assert.equal(h.db.tables.product_events.filter(e=>e.event==='subscription_active').length,1);
  }
});

test('failed cleanup does not turn an unfinished event into an acknowledged duplicate',async()=>{
  const h=harness();failNext(h.db,'profiles','select');failNext(h.db,'stripe_webhook_events','delete');
  await assert.rejects(h.process(event()));
  assert.equal(h.db.tables.stripe_webhook_events.length,1);
  assert.equal(h.db.tables.stripe_webhook_events[0].processed_at??null,null);
  await assert.rejects(h.process(event()),{code:'BILLING_EVENT_IN_PROGRESS'});
  h.advance();
  assert.equal((await h.process(event())).result.applied,true);
  assert.equal((await h.process(event())).duplicate,true);
});

test('concurrent duplicate is retryable while the first delivery is running',async()=>{
  const h=harness();let release,entered;
  const started=new Promise(r=>entered=r),gate=new Promise(r=>release=r);
  h.stripe.subscriptions.retrieve=async()=>{entered();await gate;return structuredClone(h.subs.sub_1);};
  const first=h.process(event());await started;
  await assert.rejects(h.process(event()),{code:'BILLING_EVENT_IN_PROGRESS'});
  release();await first;
  assert.equal((await h.process(event())).duplicate,true);
  assert.equal(h.db.tables.product_events.length,1);
});

test('out-of-order or foreign subscription events never reactivate a canceled account',async()=>{
  const h=harness();h.subs.sub_1.status='canceled';
  await h.process(event('customer.subscription.deleted','evt_cancel',200));
  h.subs.sub_1.status='active';
  assert.equal((await h.process(event('invoice.paid','evt_old',100))).result.ignored,true);
  const foreign=event('customer.subscription.created','evt_foreign',300);foreign.data.object.id='sub_other';
  assert.equal((await h.process(foreign)).result.ignored,true);
  assert.equal(hasSubscriptionProAccess(h.profile()),false);
  assert.equal(h.profile().stripe_subscription_id,'sub_1');
});

test('equal-second notifications use the current Stripe state, not the event payload',async()=>{
  const h=harness();await h.process(event());
  h.subs.sub_1.status='canceled';
  await h.process(event('invoice.paid','evt_same_second',100));
  assert.equal(hasSubscriptionProAccess(h.profile()),false);
});

test('a concurrent newer state prevents a stale Stripe read from granting Pro',async()=>{
  const h=harness();let release,entered;
  const started=new Promise(r=>entered=r),gate=new Promise(r=>release=r);
  let first=true;
  h.stripe.subscriptions.retrieve=async()=>{const s=structuredClone(h.subs.sub_1);if(first){first=false;entered();await gate;}return s;};
  const old=h.process(event('invoice.paid','evt_slow',100));await started;
  h.subs.sub_1.status='canceled';
  await h.process(event('customer.subscription.deleted','evt_fast',100));
  release();await assert.rejects(old,{code:'BILLING_STATE_CHANGED'});
  assert.equal(hasSubscriptionProAccess(h.profile()),false);
  await h.process(event('invoice.paid','evt_slow',100));
  assert.equal(hasSubscriptionProAccess(h.profile()),false);
});

test('a Stripe retrieval outage never falls back to a paid payload',async()=>{
  const h=harness();h.stripe.subscriptions.retrieve=async()=>{throw new Error('Stripe unavailable');};
  await assert.rejects(h.process(event()));
  assert.equal(h.profile().plan,'free');assert.equal(h.db.tables.stripe_webhook_events.length,0);
});

test('customer mismatch and incomplete Checkout cannot grant Pro',async()=>{
  const h=harness();h.subs.sub_1.customer='cus_someone_else';
  await assert.rejects(h.process(event()),{code:'BILLING_CUSTOMER_MISMATCH'});
  assert.equal(h.profile().plan,'free');
  const e=event('checkout.session.completed');e.data.object.subscription=null;
  await assert.rejects(h.process(e),{code:'BILLING_SUBSCRIPTION_MISSING'});
  assert.equal(h.profile().plan,'free');
});


test('a worker whose claim expired cannot overwrite its replacement or delete its completion',async()=>{
  const h=harness();let release,entered,first=true;
  const started=new Promise(r=>entered=r),gate=new Promise(r=>release=r);
  h.stripe.subscriptions.retrieve=async()=>{const s=structuredClone(h.subs.sub_1);if(first){first=false;entered();await gate;}return s;};
  const old=h.process(event());await started;h.advance();h.subs.sub_1.status='canceled';
  await h.process(event());release();await assert.rejects(old,{code:'BILLING_EVENT_IN_PROGRESS'});
  assert.equal(hasSubscriptionProAccess(h.profile()),false);
  assert.equal((await h.process(event())).duplicate,true);
});

test('claim insert and duplicate lookup database failures are not acknowledged',async()=>{
  const h=harness();failNext(h.db,'stripe_webhook_events','insert');
  await assert.rejects(h.process(event()),{code:'BILLING_DB_ERROR'});
  await h.process(event());failNext(h.db,'stripe_webhook_events','select');
  await assert.rejects(h.process(event()),{code:'BILLING_DB_ERROR'});
  assert.equal((await h.process(event())).duplicate,true);
});

test('HTTP returns 503 on processing failure, 400 on invalid signature and 200 only on success',async()=>{
  const req={body:'fictional',headers:{'stripe-signature':'local'},requestId:'req_test'};
  const response=()=>({statusCode:200,status(n){this.statusCode=n;return this;},send(body){this.body=body;return this;},json(body){this.body=body;return this;}});
  const stripe={webhooks:{constructEvent:()=>event()}};
  for(const code of ['BILLING_DB_ERROR','BILLING_PROFILE_NOT_FOUND','BILLING_EVENT_IN_PROGRESS']){
    const res=response();await createStripeWebhookHandler({stripe,secret:'local',processEvent:async()=>{throw Object.assign(new Error(code),{code});},reportError:async()=>{throw new Error('logger down');}})(req,res);
    assert.equal(res.statusCode,503);assert.equal(res.body,'Webhook processing failed');
  }
  const ok=response();await createStripeWebhookHandler({stripe,secret:'local',processEvent:async()=>({received:true,duplicate:true})})(req,ok);assert.equal(ok.statusCode,200);
  stripe.webhooks.constructEvent=()=>{throw new Error('bad signature');};
  const bad=response();await createStripeWebhookHandler({stripe,secret:'local',processEvent:async()=>assert.fail('must not process')})(req,bad);assert.equal(bad.statusCode,400);
});

test('lost database responses after commit preserve completed claims and converge rights on retry',async()=>{
  for(const table of ['profiles','stripe_webhook_events']){
    const h=harness(),from=h.db.from;let armed=true;
    h.db.from=name=>{
      const q=from(name);let updating=false;
      const proxy=new Proxy(q,{get(target,key){
        if(key==='then')return async(resolve,reject)=>{
          try{
            const result=await target;
            if(armed&&name===table&&updating){armed=false;return resolve({data:null,error:{code:'08006',message:'response lost after commit'}});}
            return resolve(result);
          }catch(e){return reject(e);}
        };
        if(typeof target[key]!=='function')return target[key];
        return (...args)=>{if(key==='update')updating=true;target[key](...args);return proxy;};
      }});return proxy;
    };
    await assert.rejects(h.process(event()),{code:'BILLING_DB_ERROR'});
    const retry=await h.process(event());
    assert.equal(h.profile().subscription_status,'active');
    assert.equal(h.db.tables.stripe_webhook_events.length,1);
    assert.ok(h.db.tables.stripe_webhook_events[0].processed_at);
    if(table==='stripe_webhook_events')assert.equal(retry.duplicate,true);
    else assert.equal(retry.result.applied,true);
  }
});
