import test from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
import { createStripeWebhookProcessor, subscriptionPeriod } from '../server/stripe-webhook.js';
import { trialEndingEmail, paymentFailedEmail, isTrialEndingSoon, runTrialEndingReminders } from '../server/billing-emails.js';
import { hasProAccess, hasSubscriptionProAccess } from '../server/entitlements.js';
import { createFakeDb } from './helpers/fake-db.js';

// Signed with a local test secret through the official SDK: no network, no Stripe account involved.
const SECRET='whsec_local_unit_test_only';
const sdk=new Stripe('sk_test_unit_only_no_network');
const USER='00000000-0000-4000-8000-0000000000aa';
const PERIOD_END=1798761600; // 2027-01-01T00:00:00Z

function harness({profile={}}={}){
  const db=createFakeDb({profiles:[{id:USER,email:'artisan@example.test',company_name:'Toitures Martin',plan:'pro',subscription_status:'none',stripe_customer_id:null,stripe_subscription_id:null,stripe_state_event_created:0,trial_started_at:'2026-10-20T10:00:00Z',trial_ends_at:'2026-10-27T10:00:00Z',...profile}]},{stripe_webhook_events:['event_id'],lifecycle_messages:['user_id','type']});
  const subs={};
  const stripe={subscriptions:{retrieve:async id=>{if(!subs[id])throw Object.assign(new Error('missing'),{code:'resource_missing'});return subs[id];}}};
  const sent=[];
  const processor=createStripeWebhookProcessor({db,stripe,getProfile:async u=>({...db.tables.profiles.find(p=>p.id===u.id)}),sendEmail:async m=>{sent.push(m);return {messageId:'x'};},env:{BILLING_EMAILS_ENABLED:'true',APP_URL:'https://relanzio.test'}});
  let created=1_800_000_000;
  const deliver=async(type,object,id=`evt_${type}_${created}`)=>{
    const payload=JSON.stringify({id,object:'event',type,created:created++,data:{object}});
    const header=sdk.webhooks.generateTestHeaderString({payload,secret:SECRET});
    const event=sdk.webhooks.constructEvent(payload,header,SECRET); // the exact call made by server/index.js
    return processor.processEvent(event);
  };
  return {db,subs,sent,deliver,profile:()=>db.tables.profiles[0],events:()=>(db.tables.product_events||[]).map(e=>e.event)};
}

test('signature verification rejects tampered payloads and wrong secrets',()=>{
  const payload=JSON.stringify({id:'evt_1',object:'event',type:'invoice.paid',data:{object:{}}});
  const header=sdk.webhooks.generateTestHeaderString({payload,secret:SECRET});
  assert.throws(()=>sdk.webhooks.constructEvent(payload.replace('invoice.paid','invoice.payment_failed'),header,SECRET));
  assert.throws(()=>sdk.webhooks.constructEvent(payload,header,'whsec_other'));
  assert.equal(sdk.webhooks.constructEvent(payload,header,SECRET).id,'evt_1');
});

test('full subscription lifecycle: checkout, failure, recovery, cancellation at period end, end',async()=>{
  const h=harness();
  h.subs.sub_1={id:'sub_1',status:'active',cancel_at_period_end:false,items:{data:[{current_period_end:PERIOD_END}]}};

  await h.deliver('checkout.session.completed',{id:'cs_1',customer:'cus_1',subscription:'sub_1',payment_status:'paid',metadata:{user_id:USER}},'evt_checkout');
  assert.equal(h.profile().plan,'pro');
  assert.equal(h.profile().subscription_status,'active');
  assert.equal(h.profile().stripe_customer_id,'cus_1');
  assert.equal(h.profile().subscription_current_period_end,'2027-01-01T00:00:00.000Z');
  assert.equal(hasSubscriptionProAccess(h.profile()),true);

  // Same event delivered twice: acknowledged, nothing applied twice.
  const again=await h.deliver('checkout.session.completed',{id:'cs_1',customer:'cus_1',subscription:'sub_1',payment_status:'paid',metadata:{user_id:USER}},'evt_checkout');
  assert.equal(again.duplicate,true);
  assert.deepEqual(h.events(),['subscription_active']);

  // Payment failure: past_due, automation access removed, one email even if Stripe retries the invoice.
  h.subs.sub_1={...h.subs.sub_1,status:'past_due'};
  await h.deliver('invoice.payment_failed',{id:'in_1',customer:'cus_1',subscription:'sub_1'});
  await h.deliver('invoice.payment_failed',{id:'in_1',customer:'cus_1',subscription:'sub_1'});
  assert.equal(h.profile().subscription_status,'past_due');
  assert.equal(hasSubscriptionProAccess(h.profile()),false);
  assert.equal(h.sent.length,1);
  assert.match(h.sent[0].subject,/Paiement Relanzio refusé/);
  assert.match(h.sent[0].text,/https:\/\/relanzio\.test\/\?view=plans/);

  // Recovery.
  h.subs.sub_1={...h.subs.sub_1,status:'active'};
  await h.deliver('invoice.paid',{id:'in_1',customer:'cus_1',subscription:'sub_1'});
  assert.equal(h.profile().subscription_status,'active');
  assert.equal(h.profile().plan,'pro');

  // Cancellation from the portal: Pro until the end of the paid period.
  h.subs.sub_1={...h.subs.sub_1,cancel_at_period_end:true};
  await h.deliver('customer.subscription.updated',{id:'sub_1',customer:'cus_1',status:'active',cancel_at_period_end:true});
  assert.equal(h.profile().plan,'pro');
  assert.equal(h.profile().subscription_cancel_at_period_end,true);
  assert.equal(hasProAccess(h.profile()),true);

  // Period over: back to free, data untouched.
  delete h.subs.sub_1;
  await h.deliver('customer.subscription.deleted',{id:'sub_1',customer:'cus_1',status:'canceled'});
  assert.equal(h.profile().plan,'free');
  assert.equal(h.profile().subscription_status,'canceled');
  assert.deepEqual(h.events(),['subscription_active','payment_failed','subscription_active','subscription_canceled']);
});

test('stale events arriving late never overwrite a newer state',async()=>{
  const h=harness({profile:{stripe_customer_id:'cus_2',stripe_subscription_id:'sub_2',subscription_status:'canceled',plan:'free',stripe_state_event_created:1_900_000_000}});
  await h.deliver('customer.subscription.updated',{id:'sub_2',customer:'cus_2',status:'active'});
  assert.equal(h.profile().subscription_status,'canceled');
});

test('a processing failure releases the event so Stripe can retry it',async()=>{
  const h=harness();
  const db=h.db,original=db.from;
  let fail=true;
  db.from=t=>{if(t==='profiles'&&fail){fail=false;throw new Error('db down');}return original(t);};
  await assert.rejects(h.deliver('checkout.session.completed',{id:'cs_9',customer:'cus_9',subscription:null,payment_status:'paid',metadata:{user_id:USER}},'evt_retry'));
  assert.equal((db.tables.stripe_webhook_events||[]).length,0);
  db.from=original;
  const ok=await h.deliver('checkout.session.completed',{id:'cs_9',customer:'cus_9',subscription:null,payment_status:'paid',metadata:{user_id:USER}},'evt_retry');
  assert.equal(ok.received,true);
  assert.equal(h.profile().subscription_status,'active');
});

test('billing emails stay off unless BILLING_EMAILS_ENABLED=true',async()=>{
  const db=createFakeDb({profiles:[]});
  const r=await runTrialEndingReminders({db,sendOnce:async()=>({sent:true}),env:{}});
  assert.deepEqual(r,[{skipped:'billing_emails_disabled'}]);
});

test('J-2 trial email targets trials ending in 24–48 h, once per account',async()=>{
  const now=new Date('2026-10-25T09:00:00Z');
  const ending={id:'u1',email:'a@example.test',trial_started_at:'2026-10-20T10:00:00Z',trial_ends_at:'2026-10-27T08:00:00Z',trial_expired_at:null,subscription_status:'none'};
  assert.equal(isTrialEndingSoon(ending,now),true);
  assert.equal(isTrialEndingSoon({...ending,trial_ends_at:'2026-10-25T20:00:00Z'},now),false);
  assert.equal(isTrialEndingSoon({...ending,stripe_subscription_id:'sub_x'},now),false);
  const sent=[];
  const db=createFakeDb({profiles:[ending]},{lifecycle_messages:['user_id','type']});
  const processor=createStripeWebhookProcessor({db,stripe:null,getProfile:async()=>null,sendEmail:async m=>{sent.push(m);},env:{BILLING_EMAILS_ENABLED:'true'}});
  await runTrialEndingReminders({db,sendOnce:processor.sendOnce,env:{BILLING_EMAILS_ENABLED:'true',APP_URL:'https://relanzio.test'},now});
  await runTrialEndingReminders({db,sendOnce:processor.sendOnce,env:{BILLING_EMAILS_ENABLED:'true',APP_URL:'https://relanzio.test'},now});
  assert.equal(sent.length,1);
  assert.match(sent[0].text,/https:\/\/relanzio\.test\/\?view=plans/);
  assert.match(sent[0].text,/Aucune donnée n’est supprimée/);
});

test('email copy and period helpers',()=>{
  assert.match(trialEndingEmail({appUrl:'https://relanzio.com',trialEndsAt:'2026-10-27T08:00:00Z'}).subject,/2 jours/);
  assert.match(paymentFailedEmail({appUrl:'https://relanzio.com'}).text,/envoi automatique des relances est suspendu/);
  assert.deepEqual(subscriptionPeriod({current_period_end:PERIOD_END,cancel_at_period_end:false}),{subscription_current_period_end:'2027-01-01T00:00:00.000Z',subscription_cancel_at_period_end:false});
});
