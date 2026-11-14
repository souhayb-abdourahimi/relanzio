// Static guards of the Stripe lab: what the workflow can reach, in which order, and when the real run may count
// as certified. Fails if a future edit widens secrets, triggers or permissions, or reorders the safety steps.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { REQUIRED, certification } from '../scripts/lab/stripe-run.mjs';
import { evaluateEnvironment, changedAppFiles } from '../scripts/lab/gate-check.mjs';

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const workflow = read('.github/workflows/stripe-integration-lab.yml');
const action = read('.github/actions/lab-setup/action.yml');
const jobs = { infra: workflow.slice(workflow.indexOf('\n  infra:'), workflow.indexOf('\n  stripe:')), stripe: workflow.slice(workflow.indexOf('\n  stripe:')) };

test('the only secret the lab can receive is STRIPE_LAB_SECRET_KEY (no other repository or organisation secret)', () => {
  const refs = new Set([...(workflow + action).matchAll(/secrets\.([A-Za-z0-9_]+)/g)].map(m => m[1]));
  assert.deepEqual([...refs], ['STRIPE_LAB_SECRET_KEY']);
  assert.doesNotMatch(workflow + action, /toJSON\(\s*secrets\s*\)|secrets:\s*inherit|secrets\[/);
  assert.doesNotMatch(action, /secrets\./, 'the shared set-up reads no secret');
  assert.doesNotMatch(jobs.infra, /secrets\.|environment:/, 'the infra job has no secret and no environment');
});

test('triggers and token permissions stay minimal', () => {
  const on = workflow.slice(workflow.indexOf('\non:'), workflow.indexOf('\npermissions:'));
  assert.match(on, /push:\s*\n\s*branches: \['lab\/\*\*'\]/);
  assert.doesNotMatch(on, /pull_request|workflow_run|workflow_dispatch|schedule|issue_comment/);
  assert.doesNotMatch(workflow, /:\s*write\b/, 'no write permission anywhere');
  assert.match(workflow, /\npermissions:\s*\n\s*contents: read/);
  assert.equal((workflow.match(/persist-credentials: false/g) || []).length, 2);
});

test('real Stripe job: double lock, then gate, then isolation proof, and only then the key and the scenarios', () => {
  const s = jobs.stripe;
  assert.match(s, /if: github\.ref == 'refs\/heads\/lab\/stripe-run'/);
  assert.match(s, /environment: stripe-lab/);
  const gate = s.indexOf('gate-check.mjs enforce');
  const firstSecret = s.indexOf('secrets.');
  const isolation = s.indexOf('isolation-check.mjs stripe');
  const scenarios = s.indexOf('stripe-run.mjs');
  assert.ok(gate > 0 && gate < firstSecret, 'the gate runs before any step that receives the key');
  assert.ok(isolation > 0 && isolation < scenarios, 'the isolation proof step precedes the scenarios');
  assert.doesNotMatch(s.slice(0, gate), /secrets\./);
  assert.doesNotMatch(s, /continue-on-error|if: always\(\)\s*\n\s*run: node scripts\/lab\/stripe-run/, 'a failed check can never be skipped');
});

test('certification: every required scenario must pass, a missing one is never a success', () => {
  const all = REQUIRED.map(([id]) => id);
  assert.ok(all.includes('P1_STALE') && all.includes('ISOLATION') && all.includes('EMAIL_CUSTOMERS') && all.includes('EMAIL_NONE'));
  assert.equal(new Set(all).size, all.length);
  assert.deepEqual(certification(all), { certified: true, missing: [], passedCount: all.length });
  const noStale = certification(all.filter(id => id !== 'P1_STALE'));
  assert.equal(noStale.certified, false); assert.deepEqual(noStale.missing, ['P1_STALE']);
  assert.equal(certification(all, 'stopped').certified, false, 'an error is never certified, even if everything else passed');
  assert.equal(certification([]).certified, false);
});

test('the real run stops at once when the isolation proof fails: nothing else is attempted', () => {
  const base = { PATH: process.env.PATH, SUPABASE_URL: 'http://127.0.0.1:54321', STRIPE_EXPECTED_MODE: 'test' };
  for (const extra of [{}, { SUPABASE_URL: 'https://uwgvnhnpvxoebabayqac.supabase.co' }, { STRIPE_SECRET_KEY: 'sk_live_x' }, { BREVO_API_KEY: 'x' }]) {
    const r = spawnSync(process.execPath, ['scripts/lab/stripe-run.mjs'], { cwd: new URL('..', import.meta.url).pathname, env: { ...base, ...extra }, encoding: 'utf8', timeout: 20000 });
    assert.equal(r.status, 1, JSON.stringify(extra));
    assert.match(r.stdout, new RegExp(`LAB_STRIPE_NOT_CERTIFIED 0/${REQUIRED.length} manquants=ISOLATION,`));
    assert.match(r.stdout + r.stderr, /isolation:/);
    assert.doesNotMatch(r.stdout, /LAB_STRIPE_OK/);
  }
});

test('environment gate: a reviewer and the single branch lab/stripe-run are required', () => {
  const protectedEnv = { protection_rules: [{ type: 'required_reviewers', reviewers: [{ type: 'User', reviewer: { login: 'owner' } }] }], deployment_branch_policy: { protected_branches: false, custom_branch_policies: true } };
  const onlyRun = { branch_policies: [{ name: 'lab/stripe-run', type: 'branch' }] };
  assert.deepEqual(evaluateEnvironment(protectedEnv, onlyRun).problems, []);
  assert.match(evaluateEnvironment({ protection_rules: [], deployment_branch_policy: null }, { branch_policies: [] }).problems.join(), /no required reviewer.*not restricted.*none/);
  assert.match(evaluateEnvironment(protectedEnv, { branch_policies: [{ name: 'lab/*', type: 'branch' }] }).problems.join(), /exactly "lab\/stripe-run"/);
});

test('the application code under test is byte-identical to the PR #16 commit', () => {
  let changed;
  try { changed = changedAppFiles(); } catch { return; } // shallow clone without the PR #16 commit: checked in the workflow (fetch-depth 0)
  assert.deepEqual(changed, []);
});

// ---------------------------------------------------------------------------------------------------------------
// Lab start-up readiness (scripts/lab/server-ready.mjs): the lab starts with Brevo ABSENT but only once Stripe is
// verified by the server itself; production /api/readiness is unchanged (still requires Brevo).
import { evaluateLabReadiness } from '../scripts/lab/server-ready.mjs';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { once } from 'node:events';

const verified = { supabase: true, stripe: true, brevo: false };
const okReport = { integrations: verified, billing: { ready: true, state: 'ready', code: 'BILLING_CONFIGURATION_VERIFIED' }, automation: {} };

test('lab readiness rule: Brevo absent + Stripe verified is ready; anything less is refused', () => {
  assert.deepEqual(evaluateLabReadiness({ healthStatus: 200, publicReadinessStatus: 503, report: okReport }), { ready: true, problems: [] });
  const notVerified = { ...okReport, integrations: { ...verified, stripe: false }, billing: { ready: false, state: 'configuration_error', code: 'BILLING_PRICE_MISMATCH' } };
  assert.match(evaluateLabReadiness({ healthStatus: 200, publicReadinessStatus: 503, report: notVerified }).problems.join(), /Stripe not verified.*BILLING_PRICE_MISMATCH/);
  assert.match(evaluateLabReadiness({ healthStatus: 200, publicReadinessStatus: 200, report: { ...okReport, integrations: { ...verified, brevo: true } } }).problems.join(), /Brevo is configured.*answered 200/);
  assert.match(evaluateLabReadiness({ healthStatus: 200, publicReadinessStatus: 503, report: { ...okReport, integrations: { ...verified, supabase: false } } }).problems.join(), /Supabase/);
  assert.match(evaluateLabReadiness({ healthStatus: 200, publicReadinessStatus: 503, report: { ...okReport, automation: { billingEmails: true } } }).problems.join(), /automation\.billingEmails/);
  assert.equal(evaluateLabReadiness({ healthStatus: 0, publicReadinessStatus: 0, report: null }).ready, false);
});

async function freePort() { const s = createServer(); s.listen(0, '127.0.0.1'); await once(s, 'listening'); const p = s.address().port; await new Promise(r => s.close(r)); return p; }
async function labServer(t, { unitAmount = 2900, extraEnv = {} } = {}) {
  const fake = createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const path = req.url.split('?')[0];
    if (path === '/v1/account') return res.end(JSON.stringify({ id: 'acct_lab' }));
    if (path === '/v1/prices/price_lab') return res.end(JSON.stringify({ id: 'price_lab', active: true, livemode: false, currency: 'eur', unit_amount: unitAmount, recurring: { interval: 'month', interval_count: 1 } }));
    if (path === '/auth/v1/token') return res.end(JSON.stringify({ access_token: 'lab-token', token_type: 'bearer', expires_in: 3600, user: { id: '00000000-0000-4000-8000-0000000000aa', email: 'lab-admin@example.com' } }));
    if (path === '/auth/v1/user') return res.end(JSON.stringify({ id: '00000000-0000-4000-8000-0000000000aa', aud: 'authenticated', role: 'authenticated', email: 'lab-admin@example.com' }));
    if (path.startsWith('/v1/')) { res.statusCode = 404; return res.end('{"error":{"message":"not in fake"}}'); }
    res.end('[]');
  });
  fake.listen(0, '127.0.0.1'); await once(fake, 'listening'); t.after(() => fake.close());
  const port = await freePort();
  const fakeUrl = `http://127.0.0.1:${fake.address().port}`;
  const env = { PATH: process.env.PATH, NODE_ENV: 'development', PORT: String(port), DOTENV_CONFIG_PATH: '/dev/null', LAB_STRIPE_PORT: String(fake.address().port),
    SUPABASE_URL: fakeUrl, SUPABASE_ANON_KEY: 'fake-anon', SUPABASE_SERVICE_ROLE_KEY: 'fake-service',
    STRIPE_SECRET_KEY: 'sk_test_fictional', STRIPE_EXPECTED_MODE: 'test', STRIPE_EXPECTED_ACCOUNT_ID: 'acct_lab', STRIPE_PRO_PRICE_ID: 'price_lab', STRIPE_WEBHOOK_SECRET: 'whsec_fictional',
    ADMIN_EMAILS: 'lab-admin@example.com', ...extraEnv };
  const child = spawn(process.execPath, ['--import', './test/helpers/local-billing-network.js', 'server/index.js'], { cwd: new URL('..', import.meta.url).pathname, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = ''; child.stdout.on('data', d => { logs += d; }); child.stderr.on('data', d => { logs += d; });
  t.after(async () => { if (child.exitCode === null) { child.kill(); await once(child, 'exit'); } });
  const base = `http://127.0.0.1:${port}`;
  return { base, fakeUrl, logs: () => logs };
}
async function runReady(s, timeoutMs = 15000) {
  const p = spawn(process.execPath, ['scripts/lab/server-ready.mjs'], { cwd: new URL('..', import.meta.url).pathname, stdio: ['ignore', 'pipe', 'pipe'],
    env: { PATH: process.env.PATH, LAB_SERVER_URL: s.base, SUPABASE_URL: s.fakeUrl, SUPABASE_ANON_KEY: 'fake-anon', LAB_ADMIN_EMAIL: 'lab-admin@example.com', LAB_ADMIN_PASSWORD: 'lab-only', LAB_READY_TIMEOUT_MS: String(timeoutMs) } });
  let out = ''; p.stdout.on('data', d => { out += d; }); p.stderr.on('data', d => { out += d; });
  const [code] = await once(p, 'exit');
  return { code, out };
}

test('lab start-up: real server, Brevo ABSENT, valid Stripe TEST config -> ready; production /api/readiness still 503 without Brevo', { timeout: 60000 }, async t => {
  const s = await labServer(t);
  const r = await runReady(s);
  assert.equal(r.code, 0, r.out + s.logs());
  assert.match(r.out, /LAB_SERVER_READY .*"stripe":"BILLING_CONFIGURATION_VERIFIED".*"brevo":"absent".*"public_readiness":503/);
  assert.equal((await fetch(`${s.base}/api/readiness`)).status, 503, 'the production rule (Brevo required) is unchanged');
});

test('lab start-up: invalid Stripe configuration (wrong price) is NOT ready', { timeout: 60000 }, async t => {
  const s = await labServer(t, { unitAmount: 1900 });
  const r = await runReady(s, 6000);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /LAB_SERVER_NOT_READY .*Stripe not verified by the server/);
});

test('lab start-up: Brevo configured is refused by the lab, while production /api/readiness answers 200 as before', { timeout: 60000 }, async t => {
  const s = await labServer(t, { extraEnv: { BREVO_API_KEY: 'fake-brevo', BREVO_WEBHOOK_SECRET: 'fake', EMAIL_FROM_ADDRESS: 'lab@example.com' } });
  const r = await runReady(s);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /LAB_SERVER_NOT_READY .*Brevo is configured/);
  let status = 0;
  for (let i = 0; i < 100 && status !== 200; i++) { status = (await fetch(`${s.base}/api/readiness`)).status; if (status !== 200) await new Promise(r2 => setTimeout(r2, 100)); }
  assert.equal(status, 200, 'with Brevo, Supabase and a verified Stripe, production readiness is 200 (behaviour unchanged)');
});

test('the Stripe job waits on the lab readiness check (Brevo-free), never on production /api/readiness', () => {
  const s = jobs.stripe;
  assert.doesNotMatch(s, /curl[^\n]*\/api\/readiness/, 'production readiness requires Brevo, absent from the lab by design');
  const ready = s.indexOf('node scripts/lab/server-ready.mjs');
  assert.ok(ready > 0 && ready < s.indexOf('scripts/lab/stripe-run.mjs'), 'server readiness is checked before the scenarios');
  assert.match(workflow, /ADMIN_EMAILS: lab-admin@example\.com/);
});

// ---------------------------------------------------------------------------------------------------------------
// Checkout URL acceptance (scripts/lab/checkout-browser.mjs): only the exact URL Stripe issued for a verified
// cs_test_ session of the lab user with the lab TEST price, on checkout.stripe.com. Nothing sensitive is logged.
import { verifyCheckoutSession, describeCheckoutUrl, payCheckout } from '../scripts/lab/checkout-browser.mjs';

const ID = 'cs_test_a1B2c3D4e5F6g7H8';
const URL_C = `https://checkout.stripe.com/c/pay/${ID}#fidSECRETFRAGMENT`;
const expected = { customerId: 'cus_lab', userId: 'user-lab', priceId: 'price_lab' };
const labPrice = { id: 'price_lab', livemode: false, currency: 'eur', unit_amount: 2900, recurring: { interval: 'month', interval_count: 1 } };
const items = { has_more: false, data: [{ quantity: 1, price: labPrice }] };
const session = (url, over = {}) => ({ object: 'checkout.session', id: ID, livemode: false, url, status: 'open', mode: 'subscription', customer: 'cus_lab', client_reference_id: 'user-lab', metadata: { user_id: 'user-lab' }, ...over });

test('checkout: legitimate Stripe Test formats are accepted only when verified through the API', () => {
  for (const url of [URL_C, `https://checkout.stripe.com/c/pay/${ID}`, `https://checkout.stripe.com/g/pay/${ID}#frag`, `https://checkout.stripe.com/pay/${ID}?x=1`, 'https://checkout.stripe.com/c/pay/opaqueTokenWithoutTheId#frag']) {
    const v = verifyCheckoutSession(url, session(url), items, expected);
    assert.deepEqual(v.problems, [], url.replace(/#.*/, ''));
    assert.equal(v.ok, true); assert.equal(v.url, url);
  }
});

test('checkout: live sessions, unknown domains, unverified or mismatching sessions and wrong prices are refused', () => {
  const refuse = (url, s, it = items, exp = expected) => { const v = verifyCheckoutSession(url, s, it, exp); assert.equal(v.ok, false, `${url} ${JSON.stringify(s && { id: s.id, livemode: s.livemode })}`); return v.problems.join(' | '); };
  const LIVE = 'https://checkout.stripe.com/c/pay/cs_live_a1B2c3D4';
  assert.match(refuse(LIVE, session(LIVE, { id: 'cs_live_a1B2c3D4', livemode: true })), /live session id in the URL.*not cs_test_.*livemode is not false/);
  assert.match(refuse(URL_C, session(URL_C, { livemode: true })), /livemode is not false/);
  for (const host of ['checkout.stripe.com.evil.example', 'evil.example', 'buy.stripe.com', 'checkout.stripe.co', 'pay.stripe.com']) {
    const url = `https://${host}/c/pay/${ID}`;
    assert.match(refuse(url, session(url)), /unknown domain/);
  }
  assert.match(refuse(`http://checkout.stripe.com/c/pay/${ID}`, session(`http://checkout.stripe.com/c/pay/${ID}`)), /not https/);
  assert.match(refuse(`https://checkout.stripe.com:8443/c/pay/${ID}`, session(`https://checkout.stripe.com:8443/c/pay/${ID}`)), /port or credentials/);
  assert.match(refuse(`https://u:p@checkout.stripe.com/c/pay/${ID}`, session(`https://u:p@checkout.stripe.com/c/pay/${ID}`)), /port or credentials/);
  assert.match(refuse(URL_C, null), /session not found/);
  assert.match(refuse(URL_C, session('https://checkout.stripe.com/c/pay/cs_test_other')), /not the one Stripe issued/);
  const other = `https://checkout.stripe.com/c/pay/cs_test_zzzzzz`;
  assert.match(refuse(other, session(other)), /differs from the verified session/);
  assert.match(refuse(URL_C, session(URL_C, { status: 'complete' })), /status complete/);
  assert.match(refuse(URL_C, session(URL_C, { mode: 'payment' })), /mode payment/);
  assert.match(refuse(URL_C, session(URL_C, { customer: 'cus_other' })), /customer/);
  assert.match(refuse(URL_C, session(URL_C, { client_reference_id: 'someone-else' })), /not for the lab user/);
  assert.match(refuse(URL_C, session(URL_C), { has_more: false, data: [{ quantity: 1, price: { ...labPrice, unit_amount: 1900 } }] }), /29\.00 EUR/);
  assert.match(refuse(URL_C, session(URL_C), { has_more: false, data: [{ quantity: 1, price: { ...labPrice, livemode: true } }] }), /29\.00 EUR/);
  assert.match(refuse(URL_C, session(URL_C), { has_more: false, data: [{ quantity: 2, price: labPrice }] }), /exactly one line item/);
  assert.match(refuse(URL_C, session(URL_C), null), /exactly one line item/);
  assert.match(refuse('not a url', session('not a url')), /URL invalid/);
});

test('checkout: the browser is never opened without a positive verification of that exact URL', async () => {
  const ok = verifyCheckoutSession(URL_C, session(URL_C), items, expected);
  await assert.rejects(payCheckout(URL_C, { successPrefix: 'http://127.0.0.1:3000' }), /CHECKOUT_NOT_VERIFIED/);
  await assert.rejects(payCheckout(URL_C, { successPrefix: 'http://127.0.0.1:3000', verified: { ok: false, url: URL_C } }), /CHECKOUT_NOT_VERIFIED/);
  await assert.rejects(payCheckout(`https://checkout.stripe.com/c/pay/cs_test_other`, { successPrefix: 'http://127.0.0.1:3000', verified: ok }), /CHECKOUT_NOT_VERIFIED/);
  await assert.rejects(payCheckout(URL_C, { verified: ok }), /CHECKOUT_SUCCESS_PREFIX_REQUIRED/);
});

test('checkout: the logged description keeps only the host and the path structure (no id, token, query or fragment)', () => {
  const d = describeCheckoutUrl(`${URL_C.replace('#', '?client_secret=SECRETVALUE#')}`);
  assert.deepEqual(d, { valid_url: true, scheme: 'https', host: 'checkout.stripe.com', port: null, path: '/c/pay/<cs_test_id>', has_query: true, has_fragment: true });
  const text = JSON.stringify(d);
  for (const secret of [ID, 'a1B2c3D4', 'SECRETVALUE', 'SECRETFRAGMENT', 'fid']) assert.ok(!text.includes(secret), secret);
  assert.equal(describeCheckoutUrl('https://checkout.stripe.com/c/pay/opaqueTokenXYZ123').path, '/c/pay/<token>');
  assert.equal(describeCheckoutUrl('https://checkout.stripe.com/c/pay/cs_live_abc').path, '/c/pay/<cs_live_id>');
  assert.deepEqual(describeCheckoutUrl('nope'), { valid_url: false });
});

test('the scenario script verifies every Checkout through the API before paying it', () => {
  const run = read('scripts/lab/stripe-run.mjs');
  const pays = [...run.matchAll(/payCheckout\(url, \{[^}]*\}/g)].map(m => m[0]);
  assert.equal(pays.length, 2);
  for (const p of pays) assert.match(p, /verified/);
  assert.equal((run.match(/const verified = await verifiedCheckout\(url, /g) || []).length, 2);
  assert.doesNotMatch(run, /console\.log\([^)]*\burl\b(?!_)[^)]*\)/, 'the raw URL is never logged');
});

// Checkout page automation (real DOM of lab run 4): pure rules here; the browser behaviour is tested against a local
// fixture by scripts/lab/checkout-fixture.test.mjs in the lab set-up (a fixture certifies nothing about Stripe).
import { parseAmount, currencyDecision, redactControl, visibleAmounts, FIELD_SELECTORS, TEST_CARD, CAPTCHA_HOSTS } from '../scripts/lab/checkout-browser.mjs';

test('checkout page: amounts are read as Stripe formats them; "29 € / mois" (no decimals) is not an amount', () => {
  assert.deepEqual(parseAmount('29,00 €'), { currency: 'EUR', cents: 2900 });
  assert.deepEqual(parseAmount('€29.00'), { currency: 'EUR', cents: 2900 });
  assert.deepEqual(parseAmount('33,25 $US'), { currency: 'USD', cents: 3325 });
  assert.deepEqual(parseAmount('US$1,029.00'), { currency: 'USD', cents: 102900 });
  assert.equal(parseAmount('29 €'), null);
  assert.deepEqual(visibleAmounts('33,25 $US par mois Relanzio Pro 33,25 $US 29 € / mois. TVA non applicable Total dû 33,25 $US carte 4242 4242'), ['33,25 $US', '33,25 $US', '33,25 $US']);
  assert.deepEqual(visibleAmounts('129,00 € 29,001 € €290.00'), ['129,00 €', '€290.00']);
});

test('checkout page: EUR must be the only checked currency radio AND every summary amount 29,00 €', () => {
  const usd = [{ key: 'usd', checked: true }, { key: 'eur', checked: false }];
  const eur = [{ key: 'usd', checked: false }, { key: 'eur', checked: true }];
  const run4 = ['33,25 $US', '33,25 $US', '33,25 $US', '33,25 $US'];
  const euros = ['29,00 €', '29,00 €', '29,00 €', '29,00 €'];
  assert.equal(currencyDecision({ radios: usd, amounts: run4 }).ok, false, 'the state of run 4 is refused');
  assert.equal(currencyDecision({ radios: usd, amounts: euros }).reason, 'EUR radio not checked');
  assert.equal(currencyDecision({ radios: eur, amounts: run4 }).reason, 'an amount is not in EUR', 'radio switched but summary still in dollars');
  assert.equal(currencyDecision({ radios: eur, amounts: ['29,00 €', '33,25 $US'] }).ok, false);
  assert.equal(currencyDecision({ radios: eur, amounts: ['29,00 €', '0,00 €'] }).reason, 'an amount differs from 29,00 €');
  assert.equal(currencyDecision({ radios: eur, amounts: [] }).reason, 'no payable amount shown', 'the description alone never suffices');
  assert.equal(currencyDecision({ radios: [{ key: 'usd', checked: null }, { key: 'eur', checked: true }], amounts: euros }).ok, false, 'unknown state of the other radio');
  assert.equal(currencyDecision({ radios: [{ key: 'usd', checked: false }], amounts: euros }).ok, false, 'radios without an EUR option');
  assert.equal(currencyDecision({ radios: eur, amounts: euros }).ok, true);
  assert.equal(currencyDecision({ radios: [], amounts: euros }).ok, true, 'no currency choice offered, summary in EUR');
  assert.equal(currencyDecision({ radios: [], amounts: run4 }).ok, false);
});

test('checkout page: diagnostics keep attributes only (no value, email or long digit run) and amounts only', () => {
  const r = redactControl({ tag: 'input', type: 'text', id: 'payment-linkMobilePhoneInput', name: 'linkMobilePhone', autocomplete: 'billing tel', aria: 'lab-linking@example.com', placeholder: '(201) 555-0123 4242424242424242', value: 'secret', checked: undefined, visible: true });
  assert.equal('value' in r, false);
  assert.equal(r.aria, '<email>');
  assert.doesNotMatch(JSON.stringify(r), /4242|lab-linking|secret/);
});

test('checkout page: real selectors, test data only, normal interactions, phone never typed, CAPTCHA never answered', () => {
  const src = read('scripts/lab/checkout-browser.mjs');
  const code = src.replace(/\/\/.*$/gm, '');
  assert.equal(FIELD_SELECTORS.cardNumber[0], 'input[autocomplete="cc-number"]');
  assert.ok(FIELD_SELECTORS.currency.includes('input[type="radio"][id^="currency-"]'));
  assert.equal(FIELD_SELECTORS.linkSave[0], '#payment-linkOptInInput');
  assert.equal(FIELD_SELECTORS.linkPhone[0], '#payment-linkMobilePhoneInput');
  assert.match(code, /page\.frames\(\)/);
  assert.equal(TEST_CARD.number, '4242424242424242');
  assert.ok(Object.isFrozen(TEST_CARD) && Object.isFrozen(FIELD_SELECTORS));
  assert.doesNotMatch(JSON.stringify(TEST_CARD), /@|\+33|\b0[67]\d{8}\b/);
  assert.doesNotMatch(code, /force:\s*true/, 'no forced interaction');
  assert.doesNotMatch(code, /\.checked\s*=(?!=)|dispatchEvent|setAttribute\(\s*['"]checked/, 'no state set by script');
  assert.doesNotMatch(code, /linkPhone[^\n]*\.(fill|type|pressSequentially)|phone[^\n]*\.(fill|type|pressSequentially)/i, 'the phone field is only read, never typed into');
  assert.ok(CAPTCHA_HOSTS.test('newassets.hcaptcha.com') && CAPTCHA_HOSTS.test('www.recaptcha.net') && !CAPTCHA_HOSTS.test('js.stripe.com'));
  assert.match(code, /CHECKOUT_CAPTCHA_REQUIRED/);
  assert.match(action, /node --test test\/lab-isolation\.test\.js test\/lab-workflow-guard\.test\.js scripts\/lab\/checkout-fixture\.test\.mjs/, 'the lab set-up runs the fixture browser test');
});
