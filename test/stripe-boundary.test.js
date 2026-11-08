import test from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
import {createStripeWebhookProcessor,createStripeWebhookHandler} from '../server/stripe-webhook.js';
import {createFakeDb} from './helpers/fake-db.js';

// Entirely fictional Stripe responses and database. No external calls or emails.
function setup(){
  const env={NODE_ENV:'production',STRIPE_EXPECTED_MODE:'live',STRIPE_EXPECTED_ACCOUNT_ID:'acct_expected',STRIPE_PRO_PRICE_ID:'price_live',STRIPE_SECRET_KEY:'sk_live_fictional',BILLING_EMAILS_ENABLED:'false'};
  const profile={id:'user_1',plan:'free',subscription_status:'none',stripe_customer_id:'cus_1',stripe_subscription_id:'sub_1',stripe_state_event_created:0};
  const db=createFakeDb({profiles:[profile]}, {stripe_webhook_events:['event_id']});
  const account={id:'acct_expected'};
  const price={id:'price_live',livemode:true,currency:'eur',unit_amount:2900,recurring:{interval:'month',interval_count:1}};
  const customer={id:'cus_1',livemode:true,metadata:{user_id:'user_1'}};
  const sub={id:'sub_1',livemode:true,customer:'cus_1',status:'active',metadata:{user_id:'user_1'},items:{has_more:false,data:[{quantity:1,price}]}};
  const stripe={accounts:{retrieve:async()=>account},prices:{retrieve:async()=>price},customers:{retrieve:async()=>customer},subscriptions:{retrieve:async()=>sub}};
  const event={id:'evt_1',type:'invoice.paid',livemode:true,created:100,data:{object:{livemode:true,id:'in_1',customer:'cus_1',subscription:'sub_1'}}};
  const processor=createStripeWebhookProcessor({db,stripe,env,sendEmail:async()=>assert.fail('email forbidden')});
  return {env,db,account,price,customer,sub,stripe,event,processor};
}

test('valid signed Test notification cannot grant Pro in production or reserve its id',async()=>{
  const h=setup();h.event.livemode=false;h.event.data.object.livemode=false;
  const sdk=new Stripe('sk_test_fictional'),secret='whsec_fictional';
  const body=JSON.stringify(h.event),signature=sdk.webhooks.generateTestHeaderString({payload:body,secret});
  const res={statusCode:200,status(n){this.statusCode=n;return this;},send(x){this.body=x;},json(x){this.body=x;}};
  await createStripeWebhookHandler({stripe:sdk,secret,processEvent:h.processor.processEvent})({body:Buffer.from(body),headers:{'stripe-signature':signature}},res);
  assert.notEqual(res.statusCode,200);assert.equal(h.db.tables.profiles[0].plan,'free');
  assert.equal(h.db.tables.stripe_webhook_events?.length??0,0);
});

const invalid=[
  ['missing event mode',h=>delete h.event.livemode],
  ['string event mode',h=>h.event.livemode='true'],
  ['wrong object mode',h=>h.event.data.object.livemode=false],
  ['missing expected mode',h=>delete h.env.STRIPE_EXPECTED_MODE],
  ['Test configuration in production',h=>{h.env.STRIPE_EXPECTED_MODE='test';h.env.STRIPE_SECRET_KEY='sk_test_fictional';h.event.livemode=false;}],
  ['Test configuration against production Supabase',h=>{h.env.NODE_ENV='test';h.env.SUPABASE_URL='https://uwgvnhnpvxoebabayqac.supabase.co';h.env.STRIPE_EXPECTED_MODE='test';h.env.STRIPE_SECRET_KEY='sk_test_fictional';h.event.livemode=false;}],
  ['wrong key mode',h=>h.env.STRIPE_SECRET_KEY='sk_test_fictional'],
  ['missing expected account',h=>delete h.env.STRIPE_EXPECTED_ACCOUNT_ID],
  ['missing configured price',h=>delete h.env.STRIPE_PRO_PRICE_ID],
  ['unexpected event context',h=>h.event.context='acct_other'],
  ['missing customer ownership',h=>delete h.customer.metadata.user_id],
  ['missing subscription ownership',h=>delete h.sub.metadata.user_id],
  ['incomplete subscription items',h=>h.sub.items.has_more=true],
  ['wrong API account',h=>h.account.id='acct_other'],
  ['unexpected connected account',h=>h.event.account='acct_other'],
  ['wrong configured price mode',h=>h.price.livemode=false],
  ['wrong configured price identity',h=>h.price.id='price_other'],
  ['wrong amount',h=>h.price.unit_amount=1900],
  ['wrong interval',h=>h.price.recurring.interval='year'],
  ['wrong currency',h=>h.price.currency='usd'],
  ['wrong subscription mode',h=>h.sub.livemode=false],
  ['wrong subscription price',h=>h.sub.items.data[0].price={...h.price,id:'price_test'}],
  ['ambiguous subscription items',h=>h.sub.items.data.push({...h.sub.items.data[0]})],
  ['wrong quantity',h=>h.sub.items.data[0].quantity=2],
  ['wrong customer identity',h=>h.customer.id='cus_other'],
  ['wrong customer mode',h=>h.customer.livemode=false],
  ['deleted customer',h=>h.customer.deleted=true],
  ['customer belongs to another profile',h=>h.customer.metadata.user_id='user_other'],
  ['subscription belongs to another profile',h=>h.sub.metadata.user_id='user_other'],
  ['subscription points to another customer',h=>h.sub.customer='cus_other'],
];
for(const [name,mutate] of invalid)test(`${name}: no rights change or processed claim`,async()=>{
  const h=setup();mutate(h);const before=structuredClone(h.db.tables.profiles);
  await assert.rejects(h.processor.processEvent(h.event));
  assert.deepEqual(h.db.tables.profiles,before);assert.equal(h.db.tables.stripe_webhook_events?.length??0,0);
});

test('missing subscription on deletion is not proof of cancellation',async()=>{
  const h=setup();h.db.tables.profiles[0].plan='pro';h.db.tables.profiles[0].subscription_status='active';
  h.event.type='customer.subscription.deleted';h.event.data.object={id:'sub_1',customer:'cus_1',livemode:true};
  h.stripe.subscriptions.retrieve=async()=>{throw Object.assign(Error('not found'),{code:'resource_missing',statusCode:404});};
  await assert.rejects(h.processor.processEvent(h.event));assert.equal(h.db.tables.profiles[0].plan,'pro');
});

test('valid Live notification grants Pro once and stays idempotent',async()=>{
  const h=setup();await h.processor.processEvent(h.event);assert.equal(h.db.tables.profiles[0].plan,'pro');
  const before=structuredClone(h.db.tables);assert.equal((await h.processor.processEvent(h.event)).duplicate,true);assert.deepEqual(h.db.tables,before);
});

test('isolated Test mode works but rejects Live notifications',async()=>{
  const h=setup();Object.assign(h.env,{NODE_ENV:'test',STRIPE_EXPECTED_MODE:'test',STRIPE_SECRET_KEY:'sk_test_fictional'});
  await assert.rejects(h.processor.processEvent(h.event));
  for(const x of [h.event,h.event.data.object,h.price,h.customer,h.sub])x.livemode=false;
  await h.processor.processEvent(h.event);assert.equal(h.db.tables.profiles[0].plan,'pro');
});

test('wrong mode cannot bypass validation through a completed duplicate',async()=>{
  const h=setup();await h.processor.processEvent(h.event);h.event.livemode=false;
  await assert.rejects(h.processor.processEvent(h.event));
});

test('account lookup failure is retryable without a processed event',async()=>{
  const h=setup(),retrieve=h.stripe.accounts.retrieve;h.stripe.accounts.retrieve=async()=>{throw Error('temporary');};
  await assert.rejects(h.processor.processEvent(h.event));assert.equal(h.db.tables.stripe_webhook_events?.length??0,0);
  h.stripe.accounts.retrieve=retrieve;await h.processor.processEvent(h.event);assert.equal(h.db.tables.profiles[0].plan,'pro');
});

for(const type of ['checkout.session.completed','customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','invoice.paid','invoice.payment_failed'])test(`${type}: Test event rejected before DB access in production`,async()=>{
  const h=setup();h.event.type=type;h.event.livemode=false;
  h.db.from=()=>assert.fail('wrong mode must never reach database');
  await assert.rejects(h.processor.processEvent(h.event),{code:'BILLING_MODE_MISMATCH'});
});
test('checkout cannot link a conflicting client_reference_id',async()=>{
  const h=setup();h.event.type='checkout.session.completed';
  Object.assign(h.event.data.object,{mode:'subscription',metadata:{user_id:'user_1'},client_reference_id:'user_other'});
  await assert.rejects(h.processor.processEvent(h.event),{code:'BILLING_PROFILE_MISMATCH'});
  assert.equal(h.db.tables.profiles[0].plan,'free');assert.equal(h.db.tables.stripe_webhook_events.length,0);
});
