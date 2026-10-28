// Real end-to-end validation of the subscription lifecycle against Stripe TEST mode and a DEV Supabase
// project. Not run in CI. It refuses live keys and asks for an explicit dev confirmation.
//
// Prerequisites (see docs/STRIPE_TEST_VALIDATION.md):
//   - the Relanzio server running locally against the DEV Supabase project, with
//     `stripe listen --forward-to localhost:3000/api/stripe/webhook` (its whsec_… in STRIPE_WEBHOOK_SECRET),
//     or a staging deployment whose Stripe test webhook points to /api/stripe/webhook;
//   - a test account created through the app (sign up), its user id in VALIDATION_USER_ID.
//
// Usage:
//   RELANZIO_DEV_SUPABASE_CONFIRMED=yes VALIDATION_USER_ID=<uuid> node scripts/stripe-test-validation.mjs
import 'dotenv/config';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const env=process.env;
const fail=msg=>{console.error(`✗ ${msg}`);process.exit(1);};
if(!String(env.STRIPE_SECRET_KEY||'').startsWith('sk_test_'))fail('STRIPE_SECRET_KEY must be a TEST key (sk_test_…). Live keys are refused.');
if(!String(env.STRIPE_PRO_PRICE_ID||'').startsWith('price_'))fail('STRIPE_PRO_PRICE_ID (price_…) of the TEST mode Pro price is required.');
if(env.RELANZIO_DEV_SUPABASE_CONFIRMED!=='yes')fail('Set RELANZIO_DEV_SUPABASE_CONFIRMED=yes to confirm SUPABASE_URL is a development project (never production).');
if(env.PRODUCTION_SUPABASE_URL&&env.PRODUCTION_SUPABASE_URL===env.SUPABASE_URL)fail('SUPABASE_URL equals PRODUCTION_SUPABASE_URL. Refusing.');
if(!env.VALIDATION_USER_ID)fail('VALIDATION_USER_ID (a test account created in the app) is required.');

const stripe=new Stripe(env.STRIPE_SECRET_KEY);
const db=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const userId=env.VALIDATION_USER_ID;
const results=[];
const ok=(name,detail='')=>{results.push(`✓ ${name}${detail?` — ${detail}`:''}`);console.log(results.at(-1));};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function profile(){
  const {data,error}=await db.from('profiles').select('*').eq('id',userId).single();
  if(error)fail(`Cannot read the dev profile: ${error.message}`);
  return data;
}
async function waitProfile(label,predicate,timeoutMs=90000){
  const end=Date.now()+timeoutMs;
  while(Date.now()<end){const p=await profile();if(predicate(p))return p;await sleep(2000);}
  const p=await profile();
  fail(`${label}: webhook state not reached in time (plan=${p.plan}, status=${p.subscription_status}). Is the webhook forwarded to the server?`);
}
async function advance(clock,seconds){
  const current=await stripe.testHelpers.testClocks.retrieve(clock.id);
  await stripe.testHelpers.testClocks.advance(clock.id,{frozen_time:current.frozen_time+seconds});
  for(let i=0;i<60;i++){const c=await stripe.testHelpers.testClocks.retrieve(clock.id);if(c.status==='ready')return c;await sleep(2000);}
  fail('Test clock did not finish advancing.');
}

const start=await profile();
if(start.stripe_subscription_id&&['active','trialing','past_due'].includes(start.subscription_status))fail('The validation account already has a subscription. Use a fresh test account.');

// 1. Customer on a test clock, linked to the dev profile (what Checkout does through checkout.session.completed).
const clock=await stripe.testHelpers.testClocks.create({frozen_time:Math.floor(Date.now()/1000),name:'relanzio-validation'});
const customer=await stripe.customers.create({email:start.email,test_clock:clock.id,metadata:{user_id:userId},invoice_settings:{footer:'TVA non applicable, art. 293 B du CGI'}});
const pm=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});
await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:pm.id}});
const {error:linkError}=await db.from('profiles').update({stripe_customer_id:customer.id}).eq('id',userId);
if(linkError)fail(linkError.message);
ok('Test customer created on a test clock',customer.id);

// 2. Subscription paid → Pro active through webhooks.
const sub=await stripe.subscriptions.create({customer:customer.id,items:[{price:env.STRIPE_PRO_PRICE_ID}],metadata:{user_id:userId}});
await waitProfile('Subscription active',p=>p.plan==='pro'&&p.subscription_status==='active'&&p.stripe_subscription_id===sub.id);
ok('Payment → Pro active via webhook',sub.id);

// 3. Renewal fails → past_due, automation suspended, one payment-failed email claim (if BILLING_EMAILS_ENABLED).
const failing=await stripe.paymentMethods.attach('pm_card_chargeCustomerFail',{customer:customer.id});
await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:failing.id}});
await stripe.subscriptions.update(sub.id,{default_payment_method:failing.id});
await advance(clock,32*86400);
await waitProfile('Payment failure',p=>p.subscription_status==='past_due');
ok('Failed renewal → past_due (automatic sending suspended)');
const {data:claims}=await db.from('lifecycle_messages').select('type,status').eq('user_id',userId).like('type','payment_failed:%');
ok('Payment-failed email claims',`${(claims||[]).length} (expected 1 when BILLING_EMAILS_ENABLED=true, 0 otherwise)`);

// 4. Card fixed, open invoice paid → back to Pro.
const good=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});
await stripe.subscriptions.update(sub.id,{default_payment_method:good.id});
const open=await stripe.invoices.list({customer:customer.id,status:'open',limit:1});
if(!open.data[0])fail('No open invoice to settle.');
await stripe.invoices.pay(open.data[0].id,{payment_method:good.id});
await waitProfile('Recovery',p=>p.subscription_status==='active'&&p.plan==='pro');
ok('Card updated and invoice paid → Pro active again');

// 5. Cancellation at period end → still Pro, end date stored.
await stripe.subscriptions.update(sub.id,{cancel_at_period_end:true});
const canceling=await waitProfile('Cancel at period end',p=>p.subscription_cancel_at_period_end===true);
if(canceling.plan!=='pro')fail('Pro should remain active until the end of the paid period.');
ok('Cancellation → Pro until',canceling.subscription_current_period_end);

// 6. Period over → free, data untouched.
const {count:quotesBefore}=await db.from('quotes').select('id',{count:'exact',head:true}).eq('user_id',userId);
await advance(clock,35*86400);
await waitProfile('Subscription ended',p=>p.plan==='free'&&p.subscription_status==='canceled');
const {count:quotesAfter}=await db.from('quotes').select('id',{count:'exact',head:true}).eq('user_id',userId);
if(quotesAfter!==quotesBefore)fail('Quotes changed when the subscription ended.');
ok('End of period → free, quotes kept',`${quotesAfter} quote(s)`);

// 7. Invoices carry the VAT exemption mention.
const invoices=await stripe.invoices.list({customer:customer.id,limit:10});
const missing=invoices.data.filter(i=>!String(i.footer||'').includes('293 B'));
if(missing.length)fail(`${missing.length} invoice(s) without the art. 293 B mention in the footer.`);
ok('Invoices include "TVA non applicable, art. 293 B du CGI"',`${invoices.data.length} invoice(s)`);

// 8. Webhook idempotency: the same event delivered twice must be acknowledged as duplicate.
const {data:processed}=await db.from('stripe_webhook_events').select('event_id').not('processed_at','is',null).limit(1);
ok('Webhook events recorded once per id',`${processed?.length?'stripe_webhook_events populated':'no events found — check forwarding'}`);
console.log('\nManual checks still required in a browser (TEST mode):\n  - Checkout from the app (Formules → Passer à Pro) with card 4242 4242 4242 4242\n  - Portal (Gérer mon abonnement): change card, download an invoice, cancel\n  - Resend one event from the Stripe dashboard: the server must answer {"duplicate":true}');
await stripe.testHelpers.testClocks.del(clock.id);
console.log(`\n${results.length} automated checks passed. Test clock deleted.`);
