import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Stripe from 'stripe';
import { createStripeWebhookProcessor } from '../server/stripe-webhook.js';
import { hasProAccess, canAutoSend, isTrialEligible, withEntitlements } from '../server/entitlements.js';
import { createFakeDb } from './helpers/fake-db.js';

// Compatibility of feat/saas-ready with the Stripe flow already live in production.
// Payloads follow the API version pinned by the SDK (2025-08-27.basil): invoices reference their
// subscription through parent.subscription_details, period dates live on subscription items.
// Profiles start in the shape the current production code writes (no subscription_current_period_*).
// No network, no Stripe account: events are signed locally with the official SDK.
const SECRET='whsec_local_compat_only';
const sdk=new Stripe('sk_test_compat_no_network');
const USER='00000000-0000-4000-8000-0000000000bb';
const T=s=>Math.floor(new Date(s).getTime()/1000);

function liveHarness(profile,{billingEmails='false'}={}){
  const db=createFakeDb({profiles:[{id:USER,email:'client.live@example.test',company_name:'Plomberie Live',plan:'free',subscription_status:'none',stripe_customer_id:null,stripe_subscription_id:null,stripe_state_event_created:0,trial_started_at:null,trial_ends_at:null,trial_expired_at:null,...profile}]},{stripe_webhook_events:['event_id'],lifecycle_messages:['user_id','type']});
  const subs={},sent=[];
  const stripe={subscriptions:{retrieve:async id=>{if(!subs[id])throw Object.assign(new Error('No such subscription'),{code:'resource_missing',statusCode:404});return subs[id];}}};
  const processor=createStripeWebhookProcessor({db,stripe,getProfile:async u=>({...db.tables.profiles.find(p=>p.id===u.id)}),sendEmail:async m=>{sent.push(m);},env:{BILLING_EMAILS_ENABLED:billingEmails,APP_URL:'https://relanzio.com'}});
  let created=1_900_000_000;
  const deliver=async(type,object,id=`evt_${created}`)=>{
    const payload=JSON.stringify({id,object:'event',api_version:'2025-08-27.basil',type,created:created++,livemode:false,data:{object}});
    const header=sdk.webhooks.generateTestHeaderString({payload,secret:SECRET});
    return processor.processEvent(sdk.webhooks.constructEvent(payload,header,SECRET));
  };
  return {db,subs,sent,deliver,profile:()=>db.tables.profiles[0]};
}
const basilSub=(id,status,start,end,extra={})=>({id,object:'subscription',customer:'cus_live',status,cancel_at_period_end:false,cancel_at:null,items:{object:'list',data:[{id:'si_1',object:'subscription_item',current_period_start:T(start),current_period_end:T(end),price:{id:'price_pro_live'}}]},...extra});
const basilInvoice=(id,subscription,extra={})=>({id,object:'invoice',customer:'cus_live',billing_reason:'subscription_cycle',parent:{type:'subscription_details',subscription_details:{subscription,metadata:{user_id:USER}}},footer:'TVA non applicable, art. 293 B du CGI',...extra});

test('Live checkout (basil checkout.session.completed) still upgrades a free account to Pro',async()=>{
  const h=liveHarness({});
  h.subs.sub_live=basilSub('sub_live','active','2026-11-01T10:00:00Z','2026-12-01T10:00:00Z');
  await h.deliver('checkout.session.completed',{id:'cs_live',object:'checkout.session',mode:'subscription',status:'complete',payment_status:'paid',customer:'cus_live',subscription:'sub_live',client_reference_id:USER,metadata:{user_id:USER,checkout_config:'pro-card-v4-vat293b'}});
  const p=h.profile();
  assert.deepEqual([p.plan,p.subscription_status,p.stripe_customer_id,p.stripe_subscription_id],['pro','active','cus_live','sub_live']);
  assert.equal(p.subscription_current_period_start,'2026-11-01T10:00:00.000Z');
  assert.equal(hasProAccess(p,new Date('2026-11-15T00:00:00Z')),true);
});

test('an existing paying Live customer (row written by the current code) renews normally',async()=>{
  const h=liveHarness({plan:'pro',subscription_status:'active',stripe_customer_id:'cus_live',stripe_subscription_id:'sub_live',stripe_state_event_created:1_800_000_000});
  h.subs.sub_live=basilSub('sub_live','active','2026-12-01T10:00:00Z','2027-01-01T10:00:00Z');
  await h.deliver('invoice.paid',basilInvoice('in_renew','sub_live'));
  const p=h.profile();
  assert.deepEqual([p.plan,p.subscription_status],['pro','active']);
  assert.equal(p.subscription_current_period_end,'2027-01-01T10:00:00.000Z');
  assert.equal(isTrialEligible(p),false,'paying customers never get the automatic trial');
  assert.equal(withEntitlements(p,new Date('2026-12-10T00:00:00Z')).trial_active,false);
});

test('a Live renewal failure (basil invoice.payment_failed) enters the 14-day grace, no email unless enabled',async()=>{
  const h=liveHarness({plan:'pro',subscription_status:'active',stripe_customer_id:'cus_live',stripe_subscription_id:'sub_live',stripe_state_event_created:1_800_000_000});
  h.subs.sub_live=basilSub('sub_live','past_due','2026-12-01T10:00:00Z','2027-01-01T10:00:00Z');
  await h.deliver('invoice.payment_failed',basilInvoice('in_fail','sub_live',{attempt_count:1}));
  const p=h.profile();
  assert.deepEqual([p.plan,p.subscription_status],['pro','past_due']);
  assert.equal(hasProAccess(p,new Date('2026-12-08T00:00:00Z')),true);
  assert.equal(canAutoSend(p,new Date('2026-12-08T00:00:00Z')),false);
  assert.equal(hasProAccess(p,new Date('2026-12-16T00:00:00Z')),false);
  assert.equal(h.sent.length,0,'BILLING_EMAILS_ENABLED=false: no payment email');
  // Stripe's retry succeeds.
  h.subs.sub_live={...h.subs.sub_live,status:'active'};
  await h.deliver('invoice.paid',basilInvoice('in_fail','sub_live',{attempt_count:2}));
  assert.deepEqual([h.profile().plan,h.profile().subscription_status],['pro','active']);
});

test('Stripe giving up (unpaid, then deleted) moves the account to Free',async()=>{
  const h=liveHarness({plan:'pro',subscription_status:'past_due',stripe_customer_id:'cus_live',stripe_subscription_id:'sub_live',stripe_state_event_created:1_800_000_000});
  h.subs.sub_live=basilSub('sub_live','unpaid','2026-12-01T10:00:00Z','2027-01-01T10:00:00Z');
  await h.deliver('customer.subscription.updated',h.subs.sub_live);
  assert.deepEqual([h.profile().plan,h.profile().subscription_status],['free','unpaid']);
  assert.equal(hasProAccess(h.profile(),new Date('2026-12-03T00:00:00Z')),false);
  delete h.subs.sub_live;
  await h.deliver('customer.subscription.deleted',basilSub('sub_live','canceled','2026-12-01T10:00:00Z','2027-01-01T10:00:00Z'));
  assert.deepEqual([h.profile().plan,h.profile().subscription_status],['free','canceled']);
});

test('a customer already past_due before the deploy (no period stored) gets no grace until Stripe sends an event',async()=>{
  const h=liveHarness({plan:'free',subscription_status:'past_due',stripe_customer_id:'cus_live',stripe_subscription_id:'sub_live',stripe_state_event_created:1_800_000_000});
  assert.equal(hasProAccess(h.profile(),new Date('2026-12-03T00:00:00Z')),false,'same as today in production');
  h.subs.sub_live=basilSub('sub_live','past_due','2026-12-01T10:00:00Z','2027-01-01T10:00:00Z');
  await h.deliver('customer.subscription.updated',h.subs.sub_live);
  assert.equal(hasProAccess(h.profile(),new Date('2026-12-03T00:00:00Z')),true,'grace once the period start is known');
});

test('cancellation from the portal keeps Pro until the paid period ends (basil cancel_at)',async()=>{
  const h=liveHarness({plan:'pro',subscription_status:'active',stripe_customer_id:'cus_live',stripe_subscription_id:'sub_live',stripe_state_event_created:1_800_000_000});
  h.subs.sub_live=basilSub('sub_live','active','2026-12-01T10:00:00Z','2027-01-01T10:00:00Z',{cancel_at_period_end:false,cancel_at:T('2027-01-01T10:00:00Z')});
  await h.deliver('customer.subscription.updated',h.subs.sub_live);
  const p=h.profile();
  assert.equal(p.subscription_cancel_at_period_end,true);
  assert.equal(hasProAccess(p,new Date('2026-12-20T00:00:00Z')),true);
});

test('the Live checkout configuration is unchanged, so open Live sessions stay reusable',()=>{
  const policy=readFileSync(new URL('../server/checkout-policy.js',import.meta.url),'utf8');
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  assert.match(policy,/CHECKOUT_CONFIG_VERSION='pro-card-v4-vat293b'/);
  assert.match(server,/line_items:\[\{price:process\.env\.STRIPE_PRO_PRICE_ID,quantity:1\}\]/);
  assert.match(server,/invoice_settings:\{footer:VAT_NOTICE\}/);
  assert.match(server,/\['past_due','unpaid'\]\.includes\(profile\.subscription_status\)\)return res\.status\(409\)/);
});

test('automatic trial then Live checkout: paid Pro continues after the trial end date',async()=>{
  const h=liveHarness({plan:'pro',trial_started_at:'2026-11-01T09:00:00Z',trial_ends_at:'2026-11-08T09:00:00Z',stripe_customer_id:'cus_live'});
  assert.equal(isTrialEligible(h.profile()),false,'trial already used');
  h.subs.sub_live=basilSub('sub_live','active','2026-11-05T10:00:00Z','2026-12-05T10:00:00Z');
  await h.deliver('checkout.session.completed',{id:'cs_trial',object:'checkout.session',mode:'subscription',status:'complete',payment_status:'paid',customer:'cus_live',subscription:'sub_live',client_reference_id:USER,metadata:{user_id:USER}});
  const after=withEntitlements(h.profile(),new Date('2026-11-20T00:00:00Z'));
  assert.equal(after.pro_access,true);
  assert.equal(after.trial_active,false);
  assert.equal(after.is_paid_subscription,true);
});
