#!/usr/bin/env node
// Extra webhook scenarios for the isolated lab, against the REAL server (exact commit under test), the local
// Supabase stack and the Stripe TEST sandbox. Run after scripts/lab/isolation-check.mjs stripe has passed.
// Complements scripts/stripe-test-validation.mjs (payment, renewal failure, grace, recovery, cancellation, free).
//
//  S1  event of the wrong mode (livemode=true, validly signed)  -> refused (non-2xx), nothing written
//  S2  the same real event delivered again                        -> acknowledged as duplicate, state unchanged
//  S3  database down while an event arrives                       -> 503 (Stripe will retry), nothing applied;
//      database back, same event delivered again                  -> applied once
//  S4  an OLDER event delivered after a newer one                 -> ignored, no regression of rights
//  S5  no email left the lab                                      -> no email provider configured, hosts sunk
//
// Required env: STRIPE_SECRET_KEY (sk_test_), STRIPE_WEBHOOK_SECRET (from stripe listen), STRIPE_PRO_PRICE_ID,
// SUPABASE_URL (127.0.0.1), SUPABASE_SERVICE_ROLE_KEY (local stack), LAB_SERVER_URL, LAB_USER_ID,
// LAB_REST_CONTAINER (docker name of the local PostgREST container, paused for S3).
import Stripe from 'stripe';
import { execFileSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { checkEnvironment } from './isolation-check.mjs';

const env = process.env;
const fail = m => { console.error(`LAB_SCENARIO_FAILED ${m}`); process.exit(1); };
const envProblems = checkEnvironment(env);
if (envProblems.length) fail(`isolation: ${envProblems.join('; ')}`);
for (const k of ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PRO_PRICE_ID', 'LAB_SERVER_URL', 'LAB_USER_ID', 'LAB_REST_CONTAINER']) if (!env[k]) fail(`${k} missing`);

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const userId = env.LAB_USER_ID;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = [];
const ok = (name, detail = '') => { results.push(name); console.log(`LAB_SCENARIO_OK ${name}${detail ? ` — ${detail}` : ''}`); };
const profile = async () => { const { data, error } = await db.from('profiles').select('*').eq('id', userId).single(); if (error) fail(`profile read: ${error.message}`); return data; };
const eventRow = async id => { const { data, error } = await db.from('stripe_webhook_events').select('event_id,processed_at').eq('event_id', id).maybeSingle(); if (error) fail(`event read: ${error.message}`); return data; };
const waitFor = async (label, pred, ms = 90000) => { const end = Date.now() + ms; while (Date.now() < end) { const p = await profile(); if (pred(p)) return p; await sleep(1500); } fail(`${label}: state not reached`); };
const deliver = async event => {
  const payload = JSON.stringify(event);
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret: env.STRIPE_WEBHOOK_SECRET });
  const res = await fetch(`${env.LAB_SERVER_URL}/api/stripe/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': header }, body: payload });
  let body = null; try { body = await res.json(); } catch { /* text body */ }
  return { status: res.status, body };
};
const docker = (...args) => execFileSync('docker', args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

// Set-up: a paying TEST subscription for the lab user (no test clock, so events are immediate).
const start = await profile();
if (start.stripe_subscription_id && ['active', 'trialing', 'past_due'].includes(start.subscription_status)) fail('the lab user already has a subscription');
const customer = await stripe.customers.create({ email: start.email, metadata: { user_id: userId } });
await stripe.paymentMethods.attach('pm_card_visa', { customer: customer.id });
await stripe.customers.update(customer.id, { invoice_settings: { default_payment_method: 'pm_card_visa' } }).catch(async () => {
  const pms = await stripe.paymentMethods.list({ customer: customer.id, type: 'card' });
  await stripe.customers.update(customer.id, { invoice_settings: { default_payment_method: pms.data[0].id } });
});
{ const { error } = await db.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', userId); if (error) fail(error.message); }
const sub = await stripe.subscriptions.create({ customer: customer.id, items: [{ price: env.STRIPE_PRO_PRICE_ID }], metadata: { user_id: userId } });
const active = await waitFor('subscription active', p => p.plan === 'pro' && p.subscription_status === 'active' && p.stripe_subscription_id === sub.id);
ok('set-up: TEST subscription → Pro active through stripe listen');

// S1. Wrong mode.
{
  const id = `evt_lab_wrong_mode_${Date.now()}`;
  const fake = { id, object: 'event', api_version: '2025-01-27.acacia', created: Math.floor(Date.now() / 1000), livemode: true, type: 'customer.subscription.deleted',
    data: { object: { ...sub, livemode: true, status: 'canceled' } }, pending_webhooks: 1, request: { id: null, idempotency_key: null } };
  const r = await deliver(fake);
  if (r.status < 400) fail(`S1: a livemode=true event was accepted (${r.status})`);
  if (await eventRow(id)) fail('S1: the wrong-mode event was recorded');
  const p = await profile();
  if (p.plan !== 'pro' || p.subscription_status !== 'active') fail('S1: rights changed');
  ok('S1 wrong mode refused before any write', `HTTP ${r.status}`);
}

// S2. Duplicate delivery of a real, already processed event.
{
  const events = await stripe.events.list({ type: 'customer.subscription.created', limit: 5 });
  const real = events.data.find(e => e.data.object.id === sub.id);
  if (!real) fail('S2: creation event not found');
  for (let i = 0; i < 20 && !(await eventRow(real.id))?.processed_at; i++) await sleep(1000);
  const r = await deliver(real);
  if (r.status !== 200 || r.body?.duplicate !== true) fail(`S2: expected a duplicate acknowledgement, got ${r.status} ${JSON.stringify(r.body)}`);
  const p = await profile();
  if (p.plan !== active.plan || p.subscription_status !== active.subscription_status || String(p.stripe_state_event_created) !== String(active.stripe_state_event_created)) fail('S2: state changed');
  ok('S2 duplicate acknowledged, state unchanged');
}

// S3. Database outage during delivery, then redelivery.
{
  await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
  let ev;
  for (let i = 0; i < 20 && !ev; i++) { ev = (await stripe.events.list({ type: 'customer.subscription.updated', limit: 10 })).data.find(e => e.data.object.id === sub.id && e.data.object.cancel_at_period_end === true); if (!ev) await sleep(1000); }
  if (!ev) fail('S3: update event not found');
  // stripe listen may already have delivered it: wait for that, then remove the row to replay the outage cleanly.
  await waitFor('S3 first delivery', p => p.subscription_cancel_at_period_end === true, 60000);
  { const { error } = await db.from('profiles').update({ subscription_cancel_at_period_end: false, stripe_state_event_created: 0 }).eq('id', userId); if (error) fail(error.message); }
  { const { error } = await db.from('stripe_webhook_events').delete().eq('event_id', ev.id); if (error) fail(error.message); }
  docker('pause', env.LAB_REST_CONTAINER);
  let during;
  try { during = await deliver(ev); } finally { docker('unpause', env.LAB_REST_CONTAINER); }
  if (during.status !== 503) fail(`S3: expected 503 while the database was down, got ${during.status}`);
  await sleep(2000);
  if ((await profile()).subscription_cancel_at_period_end !== false) fail('S3: applied although the database was down');
  if ((await eventRow(ev.id))?.processed_at) fail('S3: marked processed although it failed');
  const after = await deliver(ev);
  if (after.status !== 200 || after.body?.duplicate) fail(`S3: redelivery not applied (${after.status} ${JSON.stringify(after.body)})`);
  const p = await profile();
  if (p.subscription_cancel_at_period_end !== true || !(await eventRow(ev.id))?.processed_at) fail('S3: state not applied after redelivery');
  ok('S3 database down → 503 and nothing applied; redelivery → applied once');
}

// S4. Out-of-order: the older creation event (status active, no cancellation) after the newer update.
{
  const created = (await stripe.events.list({ type: 'customer.subscription.created', limit: 5 })).data.find(e => e.data.object.id === sub.id);
  { const { error } = await db.from('stripe_webhook_events').delete().eq('event_id', created.id); if (error) fail(error.message); }
  const r = await deliver(created);
  if (r.status !== 200) fail(`S4: unexpected status ${r.status}`);
  const p = await profile();
  if (p.subscription_cancel_at_period_end !== true) fail('S4: an older event overwrote a newer state');
  ok('S4 older event after a newer one: no regression');
}

// S5. No email.
{
  if (env.BREVO_API_KEY || env.OUTREACH_BREVO_API_KEY) fail('S5: an email provider key is set');
  ok('S5 no email provider configured in the lab; production email hosts unreachable (isolation-check network)');
}

// Clean-up in the sandbox.
await stripe.subscriptions.cancel(sub.id).catch(() => {});
console.log(`LAB_SCENARIOS_PASSED ${results.length}`);
