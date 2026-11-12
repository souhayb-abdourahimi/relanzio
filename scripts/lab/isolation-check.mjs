#!/usr/bin/env node
// Isolation guard of the Stripe integration lab. Runs BEFORE the Relanzio server starts and refuses (exit 1)
// unless every check passes. Prints a JSON report that never contains a secret value.
//
//   node scripts/lab/isolation-check.mjs env        environment variables only (no network)
//   node scripts/lab/isolation-check.mjs network    + production hosts unreachable (DNS sinkhole, TCP refused)
//   node scripts/lab/isolation-check.mjs stripe     + Stripe: TEST key, dedicated sandbox account (not the
//                                                   production account), and NO webhook endpoint in it
//
// Why the last point matters: the production Stripe account also has a Test mode whose webhook endpoint still
// points to the production server. The lab must use a SEPARATE sandbox (its own acct_ id) whose events can only
// reach the lab through `stripe listen`.
import { pathToFileURL } from 'node:url';
import { lookup } from 'node:dns/promises';
import net from 'node:net';

// Hosts the lab must never reach. A production identifier in any variable value is refused.
export const PRODUCTION_HOSTS = ['relanzio.com', 'www.relanzio.com', 'relanzio-production.up.railway.app', 'uwgvnhnpvxoebabayqac.supabase.co',
  'api.brevo.com', 'smtp-relay.brevo.com', 'ssl0.ovh.net', 'imap.mail.ovh.net', 'smtp.mail.ovh.net', 'api.openai.com'];
export const PRODUCTION_MARKERS = ['relanzio.com', 'up.railway.app', 'uwgvnhnpvxoebabayqac', '.supabase.co', 'brevo.com', 'ovh.net', 'sk_live_', 'rk_live_', 'pk_live_'];
// Variables that would let the server talk to a real external service. They must be absent or empty.
export const FORBIDDEN_VARIABLES = ['BREVO_API_KEY', 'OUTREACH_BREVO_API_KEY', 'BREVO_WEBHOOK_SECRET', 'SMTP_HOST', 'SMTP_PASS', 'SMTP_PASSWORD', 'IMAP_HOST', 'IMAP_PASSWORD',
  'OPENAI_API_KEY', 'SUPABASE_ACCESS_TOKEN', 'RAILWAY_TOKEN', 'RAILWAY_API_TOKEN', 'PRODUCTION_SUPABASE_URL', 'BACKUP_SOURCE_DB_URL', 'RESTORE_TARGET_DB_URL', 'DATABASE_URL'];
const LOCAL = /^(127\.0\.0\.1|localhost|\[::1\])$/;

export function checkEnvironment(env) {
  const problems = [];
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined || v === '') continue;
    const value = String(v).toLowerCase();
    for (const m of PRODUCTION_MARKERS) if (value.includes(m)) problems.push(`${k}: contains a production identifier (${m})`);
  }
  for (const k of FORBIDDEN_VARIABLES) if (env[k]) problems.push(`${k}: must not be set in the lab`);
  let supabaseHost = null;
  try { supabaseHost = new URL(env.SUPABASE_URL || '').hostname; } catch { /* reported below */ }
  if (!supabaseHost || !LOCAL.test(supabaseHost)) problems.push('SUPABASE_URL: must be the local stack (127.0.0.1)');
  try { if (env.APP_URL && !LOCAL.test(new URL(env.APP_URL).hostname)) problems.push('APP_URL: must be local'); } catch { problems.push('APP_URL: invalid'); }
  if (env.NODE_ENV === 'production') problems.push('NODE_ENV: must not be production in the lab');
  if (env.STRIPE_EXPECTED_MODE !== 'test') problems.push('STRIPE_EXPECTED_MODE: must be test');
  if (env.STRIPE_SECRET_KEY && !/^(sk|rk)_test_/.test(env.STRIPE_SECRET_KEY)) problems.push('STRIPE_SECRET_KEY: must be a TEST key');
  if (env.STRIPE_SECRET_KEY) {
    if (!/^acct_[A-Za-z0-9]+$/.test(env.STRIPE_EXPECTED_ACCOUNT_ID || '')) problems.push('STRIPE_EXPECTED_ACCOUNT_ID: the lab sandbox account id is required');
    if (!/^acct_[A-Za-z0-9]+$/.test(env.PRODUCTION_STRIPE_ACCOUNT_ID || '')) problems.push('PRODUCTION_STRIPE_ACCOUNT_ID: required, to prove the lab is NOT the production account');
    else if (env.PRODUCTION_STRIPE_ACCOUNT_ID === env.STRIPE_EXPECTED_ACCOUNT_ID) problems.push('STRIPE_EXPECTED_ACCOUNT_ID: equals the production account (its Test mode still has a webhook to production). Use the separate sandbox.');
  }
  return problems;
}

export async function checkNetwork(hosts = PRODUCTION_HOSTS) {
  const problems = [];
  for (const host of hosts) {
    let addresses = [];
    try { addresses = (await lookup(host, { all: true })).map(a => a.address); } catch { continue; } // not resolvable: fine
    if (addresses.some(a => !['0.0.0.0', '::', '127.0.0.1', '::1'].includes(a))) { problems.push(`${host}: resolves to a routable address`); continue; }
    const reached = await new Promise(resolve => {
      const s = net.connect({ host, port: 443, timeout: 3000 }, () => { s.destroy(); resolve(true); });
      s.on('error', () => resolve(false)); s.on('timeout', () => { s.destroy(); resolve(false); });
    });
    if (reached) problems.push(`${host}: a TCP connection on 443 succeeded`);
  }
  return problems;
}

export async function checkStripe(env) {
  const problems = [];
  if (!env.STRIPE_SECRET_KEY) return { problems: ['STRIPE_SECRET_KEY: missing (lab secret not configured)'], skipped: true };
  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { maxNetworkRetries: 1, timeout: 15000 });
  const account = await stripe.accounts.retrieve();
  if (account.id !== env.STRIPE_EXPECTED_ACCOUNT_ID) problems.push('Stripe: the key does not belong to the declared lab account');
  if (account.id === env.PRODUCTION_STRIPE_ACCOUNT_ID) problems.push('Stripe: the key belongs to the production account');
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
  if (endpoints.data.length) problems.push(`Stripe: the lab sandbox has ${endpoints.data.length} webhook endpoint(s); it must have none (events reach the lab only through stripe listen)`);
  const price = await stripe.prices.retrieve(env.STRIPE_PRO_PRICE_ID);
  if (price.livemode !== false || price.unit_amount !== 2900 || price.currency !== 'eur' || price.recurring?.interval !== 'month' || price.recurring?.interval_count !== 1)
    problems.push('Stripe: the lab Pro price must be a TEST price of 29.00 EUR per month');
  return { problems, account: account.id.slice(0, 9) + '…', webhook_endpoints: endpoints.data.length };
}

async function main() {
  const level = process.argv[2] || 'env';
  const report = { level, checks: [] };
  const problems = checkEnvironment(process.env);
  report.checks.push('environment');
  if (level === 'network' || level === 'stripe') { problems.push(...await checkNetwork()); report.checks.push('network'); }
  if (level === 'stripe') { const s = await checkStripe(process.env); problems.push(...s.problems); report.checks.push('stripe'); report.stripe = { account: s.account, webhook_endpoints: s.webhook_endpoints, skipped: !!s.skipped }; }
  report.ok = problems.length === 0; report.problems = problems;
  console.log(`LAB_ISOLATION ${JSON.stringify(report)}`);
  process.exit(report.ok ? 0 : 1);
}
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main().catch(e => { console.log(`LAB_ISOLATION ${JSON.stringify({ ok: false, error: e.type || e.code || 'error' })}`); process.exit(1); });
