#!/usr/bin/env node
// REAL Stripe TEST scenarios of the lab, against the real server of the commit under test, the local Supabase
// stack and the separate Stripe sandbox. Runs only in the gated "stripe" job (branch lab/stripe-run + approval
// of the protected environment "stripe-lab"), after scripts/lab/isolation-check.mjs stripe has passed.
//
// Every step is tagged with how its webhook reached the server:
//   A  real Stripe TEST event, delivered by Stripe itself (stripe listen -> local relay -> server, Stripe's order);
//   B  real Stripe TEST event (payload fetched from the Stripe API), delivered by the lab script, in an order and
//      at a moment the script controls, signed with the lab webhook secret (exactly what `stripe listen` does);
//   C  synthetic event built by the lab script, signed with the lab webhook secret (never seen by Stripe).
//   R  real Stripe TEST action without a webhook delivery (Checkout page paid in a browser, API read).
//
// Phase 1 (Stripe's deliveries held back by the local relay) - user "linking":
//   real Checkout through the app -> real events fetched, then delivered in a chosen order:
//   customer.subscription.created and invoice.paid BEFORE checkout.session.completed (must answer 503 and write
//   nothing: BILLING_SUBSCRIPTION_NOT_LINKED), then checkout.session.completed (links and grants Pro), then the
//   two early events again (now accepted), duplicate, wrong mode (synthetic), database outage, stale event.
// Phase 2 (Stripe's deliveries forwarded by the relay, order recorded) - user "lifecycle", on a Stripe test clock:
//   real Checkout through the app -> Pro, renewal refused -> past_due (grace), card fixed -> active,
//   cancellation at period end, end of period -> Free, quotes kept, invoices carry the VAT mention.
import Stripe from 'stripe';
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createClient } from '@supabase/supabase-js';
import { checkEnvironment } from './isolation-check.mjs';
import { payCheckout } from './checkout-browser.mjs';
import { billingEventSubscriptionId } from '../../server/billing.js';

const env = process.env;
const CAT = { A: 'Stripe Test réel, livré par Stripe', B: 'Stripe Test réel, relivré par le labo', C: 'synthétique signé par le labo', R: 'action Stripe Test réelle' };
const report = [];
const fail = m => { console.error(`LAB_STRIPE_FAILED ${m}`); writeSummary(false, m); process.exit(1); };
const ok = (cat, name, detail = '') => { report.push({ cat, name, detail }); console.log(`LAB_STRIPE_OK [${cat}] ${name}${detail ? ` — ${detail}` : ''}`); };
function writeSummary(passed, error) {
  const lines = ['## Laboratoire Stripe Test', '', `Résultat : **${passed ? 'réussi' : 'échec'}**${error ? ` — ${error}` : ''}`, '', '| Catégorie | Étape | Détail |', '|---|---|---|',
    ...report.map(r => `| ${r.cat} — ${CAT[r.cat]} | ${r.name} | ${r.detail} |`)];
  if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
}

const problems = checkEnvironment(env);
if (problems.length) fail(`isolation: ${problems.join('; ')}`);
for (const k of ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PRO_PRICE_ID', 'LAB_SERVER_URL', 'APP_URL', 'SUPABASE_ANON_KEY', 'LAB_REST_CONTAINER',
  'LINKING_USER_ID', 'LINKING_USER_EMAIL', 'LINKING_USER_PASSWORD', 'LIFECYCLE_USER_ID', 'LIFECYCLE_USER_EMAIL', 'LIFECYCLE_USER_PASSWORD']) if (!env[k]) fail(`${k} missing`);

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { maxNetworkRetries: 2 });
const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const docker = (...args) => execFileSync('docker', args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

// Local relay between `stripe listen` (started by the workflow, forwarding to 127.0.0.1:3999) and the server.
// Phase 1: Stripe's own deliveries are held back (answered 200, not forwarded) so that the script controls the
// order. Phase 2: every delivery is forwarded unchanged (body and Stripe-Signature) and its type and the server's
// answer are recorded: this is the real order Stripe used.
let relayForward = false;
const relayed = [];
const relay = createServer((req, res) => {
  const chunks = []; req.on('data', c => chunks.push(c));
  req.on('end', async () => {
    const body = Buffer.concat(chunks);
    if (!relayForward) { res.statusCode = 200; return res.end('{"held_by_lab":true}'); }
    let type = 'unknown'; try { type = JSON.parse(body).type; } catch { /* keep unknown */ }
    try {
      const r = await fetch(`${env.LAB_SERVER_URL}/api/stripe/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': req.headers['stripe-signature'] || '' }, body });
      relayed.push(`${type}:${r.status}`); res.statusCode = r.status; res.end(await r.text());
    } catch { relayed.push(`${type}:unreachable`); res.statusCode = 502; res.end(); }
  });
});
await new Promise(r => relay.listen(3999, '127.0.0.1', r));
const VAT = 'TVA non applicable, art. 293 B du CGI';

const profile = async id => { const { data, error } = await db.from('profiles').select('*').eq('id', id).single(); if (error) fail(`profile read: ${error.message}`); return data; };
const eventRow = async id => { const { data, error } = await db.from('stripe_webhook_events').select('event_id,processed_at').eq('event_id', id).maybeSingle(); if (error) fail(`event read: ${error.message}`); return data; };
const waitProfile = async (id, label, pred, ms = 120000) => { const end = Date.now() + ms; let p; while (Date.now() < end) { p = await profile(id); if (pred(p)) return p; await sleep(2000); } fail(`${label}: state not reached (plan=${p?.plan}, status=${p?.subscription_status})`); };
async function signIn(email, password) {
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  const body = await res.json(); if (!res.ok || !body.access_token) fail(`sign-in ${email}: ${res.status}`); return body.access_token;
}
async function openCheckout(token) {
  const res = await fetch(`${env.LAB_SERVER_URL}/api/billing/checkout`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}' });
  const body = await res.json().catch(() => ({})); if (res.status !== 200 || !body.url) fail(`app checkout route answered ${res.status} ${JSON.stringify(body)}`); return body.url;
}
async function deliver(event) {
  const payload = JSON.stringify(event);
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret: env.STRIPE_WEBHOOK_SECRET });
  const res = await fetch(`${env.LAB_SERVER_URL}/api/stripe/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': header }, body: payload });
  let body = null; try { body = await res.json(); } catch { /* text */ }
  return { status: res.status, body };
}
async function findEvent(type, pred, ms = 90000) {
  const end = Date.now() + ms;
  while (Date.now() < end) { const list = await stripe.events.list({ type, limit: 50 }); const e = list.data.find(pred); if (e) return e; await sleep(2000); }
  fail(`event ${type} not found in the sandbox`);
}
const subOf = e => billingEventSubscriptionId(e.type, e.data.object);
const emailsOk = async ids => { for (const id of ids) { const c = await stripe.customers.retrieve(id); if (!String(c.email || '').endsWith('@example.com')) fail(`customer ${id.slice(0, 8)}… has a non-example.com email`); } };

// ---------------- Phase 1: linking order, redelivery, wrong mode, outage, stale event (deliveries held) --------
const L = env.LINKING_USER_ID;
{
  const before = await profile(L);
  if (before.stripe_subscription_id || before.plan === 'pro') fail('linking user is not fresh');
  const url = await openCheckout(await signIn(env.LINKING_USER_EMAIL, env.LINKING_USER_PASSWORD));
  ok('R', 'Session Checkout créée par l’application (vraie route, vrai Stripe Test)', new URL(url).hostname);
  await payCheckout(url, { successPrefix: env.APP_URL, screenshotPath: 'lab-checkout-linking.png' });
  ok('R', 'Page Checkout Stripe Test payée dans un navigateur (carte de test 4242)');
}
const linking = await profile(L);
if (!linking.stripe_customer_id) fail('the app did not store the Stripe customer');
const sessions = await stripe.checkout.sessions.list({ customer: linking.stripe_customer_id, limit: 5 });
const session = sessions.data.find(s => s.status === 'complete' && s.subscription);
if (!session) fail('no completed Checkout session');
const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
const evCheckout = await findEvent('checkout.session.completed', e => e.data.object.id === session.id);
const evCreated = await findEvent('customer.subscription.created', e => e.data.object.id === subId);
const evPaid = await findEvent('invoice.paid', e => subOf(e) === subId);
ok('R', 'Événements réels lus dans le bac à sable', 'checkout.session.completed, customer.subscription.created, invoice.paid');

for (const [ev, label] of [[evCreated, 'customer.subscription.created'], [evPaid, 'invoice.paid']]) {
  const r = await deliver(ev);
  if (r.status !== 503) fail(`${label} before checkout.session.completed: expected 503, got ${r.status} ${JSON.stringify(r.body)}`);
  const p = await profile(L);
  if (p.stripe_subscription_id || p.plan === 'pro') fail(`${label} before linking changed the profile`);
  if ((await eventRow(ev.id))?.processed_at) fail(`${label} before linking was marked processed`);
  // The reason must be the missing link, not any other failure (the server records webhook errors in system_events).
  let reason = null;
  for (let i = 0; i < 10 && !reason; i++) {
    const { data } = await db.from('system_events').select('message,metadata').eq('scope', 'stripe.webhook').order('created_at', { ascending: false }).limit(20);
    reason = (data || []).find(r => r.metadata?.event_id === ev.id)?.message || null;
    if (!reason) await sleep(500);
  }
  if (!/BILLING_SUBSCRIPTION_NOT_LINKED/.test(reason || '')) fail(`${label} before linking: refused for another reason (${reason || 'none recorded'})`);
  ok('B', `${label} AVANT checkout.session.completed : refusé (503, BILLING_SUBSCRIPTION_NOT_LINKED), rien écrit, rejouable`);
}
{
  const r = await deliver(evCheckout);
  if (r.status !== 200 || r.body?.duplicate) fail(`checkout.session.completed: ${r.status} ${JSON.stringify(r.body)}`);
  const p = await profile(L);
  if (p.plan !== 'pro' || p.subscription_status !== 'active' || p.stripe_subscription_id !== subId) fail('checkout.session.completed did not link and grant Pro');
  ok('B', 'checkout.session.completed : profil rattaché à l’abonnement, Pro actif');
}
for (const [ev, label] of [[evCreated, 'customer.subscription.created'], [evPaid, 'invoice.paid']]) {
  const r = await deliver(ev);
  if (r.status !== 200 || r.body?.duplicate) fail(`${label} after linking: ${r.status} ${JSON.stringify(r.body)}`);
  const p = await profile(L);
  if (p.plan !== 'pro' || p.subscription_status !== 'active' || p.stripe_subscription_id !== subId) fail(`${label} after linking changed the rights`);
  if (!(await eventRow(ev.id))?.processed_at) fail(`${label} after linking not recorded as processed`);
  ok('B', `${label} relivré APRÈS rattachement : accepté (200), droits corrects`, r.body?.result?.applied ? 'appliqué' : 'ignoré comme ancien');
}
{
  const linked = await profile(L);
  const fake = { id: `evt_lab_wrong_mode_${Date.now()}`, object: 'event', api_version: evCreated.api_version, created: Math.floor(Date.now() / 1000), livemode: true,
    type: 'customer.subscription.deleted', data: { object: { ...evCreated.data.object, livemode: true, status: 'canceled' } }, pending_webhooks: 1, request: { id: null, idempotency_key: null } };
  const r = await deliver(fake);
  if (r.status < 400) fail(`wrong-mode event accepted (${r.status})`);
  if (await eventRow(fake.id)) fail('wrong-mode event recorded');
  const p = await profile(L);
  if (p.plan !== linked.plan || p.subscription_status !== linked.subscription_status) fail('wrong-mode event changed the rights');
  ok('C', 'Événement livemode=true correctement signé : refusé avant toute écriture', `HTTP ${r.status}`);
}
{
  const r = await deliver(evCheckout);
  if (r.status !== 200 || r.body?.duplicate !== true) fail(`duplicate checkout.session.completed: ${r.status} ${JSON.stringify(r.body)}`);
  ok('B', 'checkout.session.completed livré une 2e fois : doublon reconnu, état inchangé');
}
{
  await stripe.subscriptions.update(subId, { cancel_at_period_end: true });
  const evCancel = await findEvent('customer.subscription.updated', e => e.data.object.id === subId && e.data.object.cancel_at_period_end === true);
  docker('pause', env.LAB_REST_CONTAINER);
  let during;
  try { during = await deliver(evCancel); } finally { docker('unpause', env.LAB_REST_CONTAINER); }
  if (during.status !== 503) fail(`database down: expected 503, got ${during.status}`);
  await sleep(1500);
  if ((await profile(L)).subscription_cancel_at_period_end === true) fail('applied while the database was down');
  if ((await eventRow(evCancel.id))?.processed_at) fail('marked processed while the database was down');
  ok('B', 'Base indisponible pendant la livraison : 503, rien appliqué ni marqué traité');
  const after = await deliver(evCancel);
  if (after.status !== 200 || after.body?.duplicate) fail(`redelivery after outage: ${after.status} ${JSON.stringify(after.body)}`);
  if ((await profile(L)).subscription_cancel_at_period_end !== true || !(await eventRow(evCancel.id))?.processed_at) fail('redelivery after outage not applied');
  ok('B', 'Même événement relivré après rétablissement : appliqué une fois');
  const older = (await stripe.events.list({ type: 'customer.subscription.updated', limit: 50 })).data
    .find(e => e.data.object.id === subId && e.created < evCancel.created && e.data.object.cancel_at_period_end !== true);
  if (older && !(await eventRow(older.id))) {
    const r = await deliver(older);
    if (r.status !== 200) fail(`older event: ${r.status}`);
    if ((await profile(L)).subscription_cancel_at_period_end !== true) fail('an older event overwrote a newer state');
    ok('B', 'Événement plus ancien livré après un plus récent : sans effet sur les droits');
  } else ok('B', 'Événement plus ancien : aucun événement antérieur non livré disponible dans ce passage', 'non exécuté');
}

// ---------------- Phase 2: real deliveries by Stripe (listener), lifecycle on a test clock ----------------
relayForward = true;
const U = env.LIFECYCLE_USER_ID;
const clock = await stripe.testHelpers.testClocks.create({ frozen_time: Math.floor(Date.now() / 1000), name: 'relanzio-lab' });
try {
  const start = await profile(U);
  // Lab-only preparation: the customer must sit on a test clock to simulate months; the app reuses a customer
  // already stored on the profile and checks that its metadata names this user (exactly as in production).
  const customer = await stripe.customers.create({ email: start.email, test_clock: clock.id, metadata: { user_id: U }, invoice_settings: { footer: VAT } });
  { const { error } = await db.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', U); if (error) fail(error.message); }
  const url = await openCheckout(await signIn(env.LIFECYCLE_USER_EMAIL, env.LIFECYCLE_USER_PASSWORD));
  await payCheckout(url, { successPrefix: env.APP_URL, screenshotPath: 'lab-checkout-lifecycle.png' });
  ok('R', 'Checkout Stripe Test payé dans un navigateur (client sur horloge de simulation)');
  const pro = await waitProfile(U, 'Pro after real Checkout', p => p.plan === 'pro' && p.subscription_status === 'active' && p.stripe_subscription_id);
  const sub = pro.stripe_subscription_id;
  ok('A', 'Paiement → Pro actif, par les webhooks livrés par Stripe', `ordre réel et réponses : ${relayed.slice(0, 10).join(', ') || 'n/d'}`);
  const failing = await stripe.paymentMethods.attach('pm_card_chargeCustomerFail', { customer: customer.id });
  await stripe.customers.update(customer.id, { invoice_settings: { default_payment_method: failing.id } });
  await stripe.subscriptions.update(sub, { default_payment_method: failing.id });
  const advance = async seconds => {
    const c = await stripe.testHelpers.testClocks.retrieve(clock.id);
    await stripe.testHelpers.testClocks.advance(clock.id, { frozen_time: c.frozen_time + seconds });
    for (let i = 0; i < 90; i++) { if ((await stripe.testHelpers.testClocks.retrieve(clock.id)).status === 'ready') return; await sleep(2000); }
    fail('test clock did not finish advancing');
  };
  await advance(32 * 86400);
  const pastDue = await waitProfile(U, 'past_due', p => p.subscription_status === 'past_due');
  if (pastDue.plan !== 'pro' || !pastDue.subscription_current_period_start) fail('past_due must keep Pro during the grace period');
  ok('A', 'Renouvellement refusé → past_due, Pro conservé pendant le délai de grâce');
  const good = await stripe.paymentMethods.attach('pm_card_visa', { customer: customer.id });
  await stripe.subscriptions.update(sub, { default_payment_method: good.id });
  const open = await stripe.invoices.list({ customer: customer.id, status: 'open', limit: 1 });
  if (!open.data[0]) fail('no open invoice to settle');
  await stripe.invoices.pay(open.data[0].id, { payment_method: good.id });
  await waitProfile(U, 'recovery', p => p.subscription_status === 'active' && p.plan === 'pro');
  ok('A', 'Carte corrigée, facture payée → Pro actif');
  await stripe.subscriptions.update(sub, { cancel_at_period_end: true });
  const canceling = await waitProfile(U, 'cancel at period end', p => p.subscription_cancel_at_period_end === true);
  if (canceling.plan !== 'pro') fail('Pro must remain until the end of the paid period');
  ok('A', 'Résiliation demandée → Pro jusqu’à la fin de la période payée');
  const { count: before } = await db.from('quotes').select('id', { count: 'exact', head: true }).eq('user_id', U);
  await advance(35 * 86400);
  await waitProfile(U, 'end of period', p => p.plan === 'free' && p.subscription_status === 'canceled');
  const { count: after } = await db.from('quotes').select('id', { count: 'exact', head: true }).eq('user_id', U);
  if (after !== before) fail('quotes changed when the subscription ended');
  ok('A', 'Fin de période → Free, devis conservés');
  const invoices = await stripe.invoices.list({ customer: customer.id, limit: 10 });
  if (invoices.data.some(i => !String(i.footer || '').includes('293 B'))) fail('an invoice lacks the art. 293 B mention');
  ok('R', 'Factures avec la mention « TVA non applicable, art. 293 B du CGI »', `${invoices.data.length} facture(s)`);
  await emailsOk([customer.id, linking.stripe_customer_id]);
  ok('R', 'Tous les clients Stripe du passage ont une adresse @example.com (domaine sans boîte aux lettres)');
} finally {
  await stripe.subscriptions.cancel(subId).catch(() => {});
  await stripe.testHelpers.testClocks.del(clock.id).catch(() => {});
  relay.close();
}
writeSummary(true);
console.log(`LAB_STRIPE_PASSED ${report.length} étapes (A=${report.filter(r => r.cat === 'A').length}, B=${report.filter(r => r.cat === 'B').length}, C=${report.filter(r => r.cat === 'C').length}, R=${report.filter(r => r.cat === 'R').length})`);
