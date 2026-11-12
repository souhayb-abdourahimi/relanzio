#!/usr/bin/env node
// REAL Stripe TEST scenarios of the lab, against the real server of the commit under test, the local Supabase
// stack and the separate Stripe sandbox. Runs only in the gated "stripe" job (branch lab/stripe-run, approved
// commit, approval of the protected environment "stripe-lab").
//
// CERTIFICATION RULE: every scenario listed in REQUIRED below must be executed AND pass. A scenario that cannot
// run is reported "MANQUANT", never as a success, and the global result is then "NON CERTIFIÉ" (exit code 1).
// The very first action is the isolation proof (environment, production hosts, Stripe sandbox): if it fails,
// nothing else runs (no browser, no Stripe write, no webhook).
//
// How each webhook reached the server:
//   A  real Stripe TEST event, delivered by Stripe itself (stripe listen -> local relay -> server, Stripe's order);
//   B  real Stripe TEST event (payload fetched from the Stripe API), delivered by the lab script, in an order and
//      at a moment the script controls, signed with the lab webhook secret (exactly what `stripe listen` does);
//   C  synthetic event built by the lab script, signed with the lab webhook secret (never seen by Stripe);
//   R  real Stripe TEST action without a webhook delivery (Checkout page paid in a browser, API read, checks).
import Stripe from 'stripe';
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { checkEnvironment, checkNetwork, checkStripe } from './isolation-check.mjs';
import { payCheckout } from './checkout-browser.mjs';
import { billingEventSubscriptionId } from '../../server/billing.js';

const env = process.env;
const CAT = { A: 'Stripe Test réel, livré par Stripe', B: 'Stripe Test réel, relivré par le labo', C: 'synthétique signé par le labo', R: 'action ou contrôle Stripe Test réel' };
export const REQUIRED = [
  ['ISOLATION', 'R', 'Preuve d’isolation (variables, hôtes de production, bac à sable Stripe) avant toute action'],
  ['P1_CHECKOUT', 'R', 'Phase 1 : session Checkout créée par l’application et payée dans un navigateur'],
  ['P1_EVENTS', 'R', 'Phase 1 : événements réels lus dans le bac à sable'],
  ['P1_SUB_BEFORE', 'B', 'customer.subscription.created AVANT checkout.session.completed : 503 BILLING_SUBSCRIPTION_NOT_LINKED, rien écrit'],
  ['P1_INVOICE_BEFORE', 'B', 'invoice.paid AVANT checkout.session.completed : 503 BILLING_SUBSCRIPTION_NOT_LINKED, rien écrit'],
  ['P1_LINK', 'B', 'checkout.session.completed : profil rattaché à l’abonnement, Pro actif'],
  ['P1_SUB_AFTER', 'B', 'customer.subscription.created relivré APRÈS rattachement : accepté, droits corrects'],
  ['P1_INVOICE_AFTER', 'B', 'invoice.paid relivré APRÈS rattachement : accepté, droits corrects'],
  ['P1_WRONG_MODE', 'C', 'Événement livemode=true correctement signé : refusé avant toute écriture'],
  ['P1_DUPLICATE', 'B', 'checkout.session.completed livré une 2e fois : doublon reconnu, état inchangé'],
  ['P1_OUTAGE', 'B', 'Base indisponible pendant la livraison : 503, rien appliqué ni marqué traité'],
  ['P1_REDELIVERY', 'B', 'Même événement relivré après rétablissement : appliqué une fois'],
  ['P1_STALE', 'B', 'Événement plus ancien livré après un plus récent : ignoré, droits intacts'],
  ['P2_CHECKOUT', 'R', 'Phase 2 : vrai Checkout payé dans un navigateur (client sur horloge de simulation)'],
  ['P2_PRO_BY_STRIPE', 'A', 'Paiement → Pro actif par les webhooks livrés par Stripe (checkout.session.completed reçu de Stripe)'],
  ['P2_PAST_DUE', 'A', 'Renouvellement refusé → past_due, Pro conservé pendant le délai de grâce'],
  ['P2_RECOVERY', 'A', 'Carte corrigée, facture payée → Pro actif'],
  ['P2_CANCEL', 'A', 'Résiliation demandée → Pro jusqu’à la fin de la période payée'],
  ['P2_FREE', 'A', 'Fin de période → Free, devis conservés'],
  ['P2_VAT', 'R', 'Factures avec la mention « TVA non applicable, art. 293 B du CGI »'],
  ['EMAIL_CUSTOMERS', 'R', 'Tous les clients Stripe créés pendant le passage ont une adresse @example.com'],
  ['EMAIL_NONE', 'R', 'Aucun email réclamé ni envoyé par l’application (aucun fournisseur configuré)']
];
const REQ = new Map(REQUIRED.map(([id, cat, label]) => [id, { cat, label }]));
const passed = new Map();
const pass = (id, detail = '') => {
  if (!REQ.has(id)) throw new Error(`unknown scenario ${id}`);
  passed.set(id, detail);
  console.log(`LAB_STRIPE_OK [${REQ.get(id).cat}] ${id} ${REQ.get(id).label}${detail ? ` — ${detail}` : ''}`);
};
// Pure certification rule (unit-tested): certified only with no error and every required scenario passed.
export function certification(passedIds, error) {
  const done = new Set(passedIds);
  const missing = REQUIRED.filter(([id]) => !done.has(id)).map(([id]) => id);
  return { certified: !error && missing.length === 0, missing, passedCount: REQUIRED.length - missing.length };
}
function finish(error) {
  const { certified, missing } = certification([...passed.keys()], error);
  const lines = ['## Laboratoire Stripe Test', '', `Résultat global : **${certified ? 'CERTIFIÉ' : 'NON CERTIFIÉ'}** — ${passed.size}/${REQUIRED.length} scénarios obligatoires réussis`,
    ...(error ? ['', `Arrêt : ${error}`] : []), '', '| Scénario | Catégorie | Description | Statut | Détail |', '|---|---|---|---|---|',
    ...REQUIRED.map(([id, cat, label]) => `| ${id} | ${cat} — ${CAT[cat]} | ${label} | ${passed.has(id) ? 'RÉUSSI' : 'MANQUANT'} | ${passed.get(id) || ''} |`)];
  if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
  console.log(certified ? `LAB_STRIPE_CERTIFIED ${passed.size}/${REQUIRED.length}` : `LAB_STRIPE_NOT_CERTIFIED ${passed.size}/${REQUIRED.length} manquants=${missing.join(',')}${error ? ` arrêt=${error}` : ''}`);
  process.exit(certified ? 0 : 1);
}
const fail = m => { console.error(`LAB_STRIPE_FAILED ${m}`); finish(m); };

async function main() {
  // ---------------- Isolation proof: first, and blocking ----------------
  const problems = checkEnvironment(env);
  for (const k of ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PRO_PRICE_ID', 'LAB_SERVER_URL', 'APP_URL', 'SUPABASE_ANON_KEY', 'LAB_REST_CONTAINER',
    'LINKING_USER_ID', 'LINKING_USER_EMAIL', 'LINKING_USER_PASSWORD', 'LIFECYCLE_USER_ID', 'LIFECYCLE_USER_EMAIL', 'LIFECYCLE_USER_PASSWORD']) if (!env[k]) problems.push(`${k} missing`);
  if (env.BILLING_EMAILS_ENABLED === 'true' || env.LIFECYCLE_EMAILS_ENABLED === 'true') problems.push('an email switch is on');
  for (const k of ['LINKING_USER_EMAIL', 'LIFECYCLE_USER_EMAIL']) if (!String(env[k] || '').endsWith('@example.com')) problems.push(`${k} must be an @example.com address`);
  if (!problems.length) problems.push(...await checkNetwork());
  if (!problems.length) problems.push(...(await checkStripe(env)).problems);
  if (problems.length) fail(`isolation: ${problems.join('; ')}`);
  pass('ISOLATION');
  const runStart = Math.floor(Date.now() / 1000) - 60;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { maxNetworkRetries: 2 });
  const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const docker = (...args) => execFileSync('docker', args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
  const VAT = 'TVA non applicable, art. 293 B du CGI';

  // Local relay between `stripe listen` (forwarding to 127.0.0.1:3999) and the server. Phase 1: Stripe's own
  // deliveries are held back (answered 200, not forwarded) so that the script controls the order. Phase 2: every
  // delivery is forwarded unchanged (body and Stripe-Signature) and its type and the server's answer recorded.
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

  const profile = async id => { const { data, error } = await db.from('profiles').select('*').eq('id', id).single(); if (error) fail(`profile read: ${error.message}`); return data; };
  const eventRow = async id => { const { data, error } = await db.from('stripe_webhook_events').select('event_id,processed_at').eq('event_id', id).maybeSingle(); if (error) fail(`event read: ${error.message}`); return data; };
  const waitProfile = async (id, label, pred, ms = 120000) => { const end = Date.now() + ms; let p; while (Date.now() < end) { p = await profile(id); if (pred(p)) return p; await sleep(2000); } fail(`${label}: state not reached (plan=${p?.plan}, status=${p?.subscription_status})`); };
  const signIn = async (email, password) => {
    const res = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const body = await res.json(); if (!res.ok || !body.access_token) fail(`sign-in ${email}: ${res.status}`); return body.access_token;
  };
  const openCheckout = async token => {
    const res = await fetch(`${env.LAB_SERVER_URL}/api/billing/checkout`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}' });
    const body = await res.json().catch(() => ({})); if (res.status !== 200 || !body.url) fail(`app checkout route answered ${res.status} ${JSON.stringify(body)}`); return body.url;
  };
  const deliver = async event => {
    const payload = JSON.stringify(event);
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret: env.STRIPE_WEBHOOK_SECRET });
    const res = await fetch(`${env.LAB_SERVER_URL}/api/stripe/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': header }, body: payload });
    let body = null; try { body = await res.json(); } catch { /* text */ }
    return { status: res.status, body };
  };
  const findEvent = async (type, pred, ms = 90000) => {
    const end = Date.now() + ms;
    while (Date.now() < end) { const list = await stripe.events.list({ type, limit: 50 }); const e = list.data.find(pred); if (e) return e; await sleep(2000); }
    fail(`event ${type} not found in the sandbox`);
  };
  const refusalReason = async eventId => {
    for (let i = 0; i < 10; i++) {
      const { data } = await db.from('system_events').select('message,metadata').eq('scope', 'stripe.webhook').order('created_at', { ascending: false }).limit(20);
      const m = (data || []).find(r => r.metadata?.event_id === eventId)?.message; if (m) return m; await sleep(500);
    }
    return null;
  };
  const subOf = e => billingEventSubscriptionId(e.type, e.data.object);

  // ---------------- Phase 1: linking order, redelivery, wrong mode, outage, stale event (deliveries held) --------
  const L = env.LINKING_USER_ID;
  {
    const before = await profile(L);
    if (before.stripe_subscription_id || before.plan === 'pro') fail('linking user is not fresh');
    const url = await openCheckout(await signIn(env.LINKING_USER_EMAIL, env.LINKING_USER_PASSWORD));
    await payCheckout(url, { successPrefix: env.APP_URL, screenshotPath: 'lab-checkout-linking.png' });
    pass('P1_CHECKOUT', new URL(url).hostname);
  }
  const linking = await profile(L);
  if (!linking.stripe_customer_id) fail('the app did not store the Stripe customer');
  const session = (await stripe.checkout.sessions.list({ customer: linking.stripe_customer_id, limit: 5 })).data.find(s => s.status === 'complete' && s.subscription);
  if (!session) fail('no completed Checkout session');
  const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
  const evCheckout = await findEvent('checkout.session.completed', e => e.data.object.id === session.id);
  const evCreated = await findEvent('customer.subscription.created', e => e.data.object.id === subId);
  const evPaid = await findEvent('invoice.paid', e => subOf(e) === subId);
  pass('P1_EVENTS', 'checkout.session.completed, customer.subscription.created, invoice.paid');

  for (const [ev, id] of [[evCreated, 'P1_SUB_BEFORE'], [evPaid, 'P1_INVOICE_BEFORE']]) {
    const r = await deliver(ev);
    if (r.status !== 503) fail(`${ev.type} before linking: expected 503, got ${r.status} ${JSON.stringify(r.body)}`);
    const p = await profile(L);
    if (p.stripe_subscription_id || p.plan === 'pro') fail(`${ev.type} before linking changed the profile`);
    if ((await eventRow(ev.id))?.processed_at) fail(`${ev.type} before linking was marked processed`);
    const reason = await refusalReason(ev.id);
    if (!/BILLING_SUBSCRIPTION_NOT_LINKED/.test(reason || '')) fail(`${ev.type} before linking refused for another reason (${reason || 'none recorded'})`);
    pass(id, 'HTTP 503, BILLING_SUBSCRIPTION_NOT_LINKED');
  }
  {
    const r = await deliver(evCheckout);
    if (r.status !== 200 || r.body?.duplicate) fail(`checkout.session.completed: ${r.status} ${JSON.stringify(r.body)}`);
    const p = await profile(L);
    if (p.plan !== 'pro' || p.subscription_status !== 'active' || p.stripe_subscription_id !== subId) fail('checkout.session.completed did not link and grant Pro');
    pass('P1_LINK');
  }
  for (const [ev, id] of [[evCreated, 'P1_SUB_AFTER'], [evPaid, 'P1_INVOICE_AFTER']]) {
    const r = await deliver(ev);
    if (r.status !== 200 || r.body?.duplicate) fail(`${ev.type} after linking: ${r.status} ${JSON.stringify(r.body)}`);
    const p = await profile(L);
    if (p.plan !== 'pro' || p.subscription_status !== 'active' || p.stripe_subscription_id !== subId) fail(`${ev.type} after linking changed the rights`);
    if (!(await eventRow(ev.id))?.processed_at) fail(`${ev.type} after linking not recorded as processed`);
    pass(id, r.body?.result?.applied ? 'appliqué' : 'accepté, ignoré comme ancien');
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
    pass('P1_WRONG_MODE', `HTTP ${r.status}`);
  }
  {
    const r = await deliver(evCheckout);
    if (r.status !== 200 || r.body?.duplicate !== true) fail(`duplicate checkout.session.completed: ${r.status} ${JSON.stringify(r.body)}`);
    pass('P1_DUPLICATE');
  }
  {
    // Two real, strictly ordered updates: the OLDER one is kept aside (never delivered) for the stale-event test.
    await stripe.subscriptions.update(subId, { metadata: { user_id: L, lab_step: 'older' } });
    const evOlder = await findEvent('customer.subscription.updated', e => e.data.object.id === subId && e.data.object.metadata?.lab_step === 'older');
    await sleep(2100); // event.created has a one-second precision
    await stripe.subscriptions.update(subId, { cancel_at_period_end: true, metadata: { user_id: L, lab_step: 'newer' } });
    const evCancel = await findEvent('customer.subscription.updated', e => e.data.object.id === subId && e.data.object.metadata?.lab_step === 'newer' && e.data.object.cancel_at_period_end === true);
    if (!(evCancel.created > evOlder.created)) fail('the two updates are not strictly ordered in time');

    docker('pause', env.LAB_REST_CONTAINER);
    let during;
    try { during = await deliver(evCancel); } finally { docker('unpause', env.LAB_REST_CONTAINER); }
    if (during.status !== 503) fail(`database down: expected 503, got ${during.status}`);
    await sleep(1500);
    if ((await profile(L)).subscription_cancel_at_period_end === true) fail('applied while the database was down');
    if ((await eventRow(evCancel.id))?.processed_at) fail('marked processed while the database was down');
    pass('P1_OUTAGE');
    const after = await deliver(evCancel);
    if (after.status !== 200 || after.body?.duplicate) fail(`redelivery after outage: ${after.status} ${JSON.stringify(after.body)}`);
    const applied = await profile(L);
    if (applied.subscription_cancel_at_period_end !== true || !(await eventRow(evCancel.id))?.processed_at) fail('redelivery after outage not applied');
    pass('P1_REDELIVERY');

    if (await eventRow(evOlder.id)) fail('the older event was delivered before the test (it must have been held back)');
    const r = await deliver(evOlder);
    if (r.status !== 200 || r.body?.duplicate) fail(`older event: ${r.status} ${JSON.stringify(r.body)}`);
    if (r.body?.result?.applied === true) fail('the older event was applied over a newer state');
    const p = await profile(L);
    if (p.subscription_cancel_at_period_end !== true || String(p.stripe_state_event_created) !== String(applied.stripe_state_event_created)) fail('the older event changed the state');
    pass('P1_STALE', 'accepté (200) et ignoré');
  }

  // ---------------- Phase 2: real deliveries by Stripe, lifecycle on a test clock ----------------
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
    pass('P2_CHECKOUT');
    const pro = await waitProfile(U, 'Pro after real Checkout', p => p.plan === 'pro' && p.subscription_status === 'active' && p.stripe_subscription_id);
    if (!relayed.includes('checkout.session.completed:200')) fail(`Pro granted but checkout.session.completed was not accepted from Stripe (${relayed.join(', ')})`);
    pass('P2_PRO_BY_STRIPE', `ordre réel et réponses : ${relayed.slice(0, 10).join(', ')}`);
    const sub = pro.stripe_subscription_id;
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
    pass('P2_PAST_DUE');
    const good = await stripe.paymentMethods.attach('pm_card_visa', { customer: customer.id });
    await stripe.subscriptions.update(sub, { default_payment_method: good.id });
    const open = await stripe.invoices.list({ customer: customer.id, status: 'open', limit: 1 });
    if (!open.data[0]) fail('no open invoice to settle');
    await stripe.invoices.pay(open.data[0].id, { payment_method: good.id });
    await waitProfile(U, 'recovery', p => p.subscription_status === 'active' && p.plan === 'pro');
    pass('P2_RECOVERY');
    await stripe.subscriptions.update(sub, { cancel_at_period_end: true });
    const canceling = await waitProfile(U, 'cancel at period end', p => p.subscription_cancel_at_period_end === true);
    if (canceling.plan !== 'pro') fail('Pro must remain until the end of the paid period');
    pass('P2_CANCEL');
    const { count: before } = await db.from('quotes').select('id', { count: 'exact', head: true }).eq('user_id', U);
    await advance(35 * 86400);
    await waitProfile(U, 'end of period', p => p.plan === 'free' && p.subscription_status === 'canceled');
    const { count: after } = await db.from('quotes').select('id', { count: 'exact', head: true }).eq('user_id', U);
    if (after !== before) fail('quotes changed when the subscription ended');
    pass('P2_FREE');
    const invoices = await stripe.invoices.list({ customer: customer.id, limit: 10 });
    if (!invoices.data.length || invoices.data.some(i => !String(i.footer || '').includes('293 B'))) fail('an invoice lacks the art. 293 B mention');
    pass('P2_VAT', `${invoices.data.length} facture(s)`);
  } finally {
    await stripe.subscriptions.cancel(subId).catch(() => {});
    await stripe.testHelpers.testClocks.del(clock.id).catch(() => {});
    relay.close();
  }

  // ---------------- Emails ----------------
  const created = [];
  for await (const c of stripe.customers.list({ created: { gte: runStart }, limit: 100 })) created.push(c);
  if (created.length < 2) fail(`expected at least 2 customers created during the run, found ${created.length}`);
  const outside = created.filter(c => !String(c.email || '').toLowerCase().endsWith('@example.com'));
  if (outside.length) fail(`${outside.length} customer(s) created during the run without an @example.com address`);
  pass('EMAIL_CUSTOMERS', `${created.length} client(s), tous @example.com`);
  const { count: claims, error: claimsError } = await db.from('lifecycle_messages').select('user_id', { count: 'exact', head: true }).in('user_id', [L, U]);
  if (claimsError) fail(claimsError.message);
  if (claims !== 0) fail(`${claims} email(s) claimed by the app for the lab users`);
  pass('EMAIL_NONE', 'aucun envoi réclamé, aucune clé de fournisseur');
  finish();
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main().catch(e => fail(`unexpected error: ${String(e?.message || e).split('\n')[0]}`));
