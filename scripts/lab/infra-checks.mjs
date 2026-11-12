#!/usr/bin/env node
// Infrastructure-only checks (no Stripe key at all): the real server runs on the local Supabase stack, a lab user
// signs in through the local Auth, the app's checkout route refuses while billing is not verified (fail closed,
// no Stripe call possible without a key), the webhook refuses, the profile is untouched, and the headless browser
// used for the real Checkout starts behind the egress firewall.
import { chromium } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const env = process.env;
const fail = m => { console.error(`LAB_INFRA_FAILED ${m}`); process.exit(1); };
const ok = m => console.log(`LAB_INFRA_OK ${m}`);
if (env.STRIPE_SECRET_KEY) fail('this check must run without any Stripe key');
const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const health = await fetch(`${env.LAB_SERVER_URL}/api/health`);
if (health.status !== 200) fail(`health ${health.status}`); ok('server health 200 on the local stack');
const readiness = await fetch(`${env.LAB_SERVER_URL}/api/readiness`);
if (readiness.status === 200) fail('readiness 200 without any Stripe configuration'); ok(`readiness ${readiness.status} (billing not verified, as expected)`);

const auth = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: env.LINKING_USER_EMAIL, password: env.LINKING_USER_PASSWORD }) });
const session = await auth.json();
if (!auth.ok || !session.access_token) fail(`local sign-in ${auth.status}`); ok('lab user signed in through the local Auth');

const checkout = await fetch(`${env.LAB_SERVER_URL}/api/billing/checkout`, { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' }, body: '{}' });
if (checkout.status !== 503) fail(`checkout route answered ${checkout.status}, expected 503 (billing not verified)`); ok('checkout route refuses with 503 while billing is not verified');
const webhook = await fetch(`${env.LAB_SERVER_URL}/api/stripe/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
if (webhook.status !== 503) fail(`webhook answered ${webhook.status}, expected 503`); ok('webhook refuses with 503 without Stripe configuration');

const { data: p, error } = await db.from('profiles').select('plan,subscription_status,stripe_customer_id,stripe_subscription_id,checkout_claimed_at').eq('id', env.LINKING_USER_ID).single();
if (error) fail(error.message);
if (p.plan !== 'free' || p.subscription_status !== 'none' || p.stripe_customer_id || p.stripe_subscription_id || p.checkout_claimed_at) fail(`profile changed: ${JSON.stringify(p)}`);
ok('profile untouched (free, no Stripe reference, no checkout claim)');

const browser = await chromium.launch();
try { const page = await browser.newPage(); const r = await page.goto(`${env.LAB_SERVER_URL}/api/health`); if (r.status() !== 200) fail(`browser got ${r.status()}`); }
finally { await browser.close(); }
ok('headless Chromium for the real Checkout starts and reaches the server behind the firewall');
