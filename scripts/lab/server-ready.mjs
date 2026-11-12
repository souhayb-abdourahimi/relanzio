#!/usr/bin/env node
// Start-up check of the LAB server (real server of the commit under test, local Supabase, Stripe TEST sandbox).
//
// Why not /api/readiness: in production, /api/readiness answers 200 only when Supabase, Stripe AND Brevo are all
// configured (server/index.js). The lab has no Brevo on purpose (no email may leave), so /api/readiness always
// answers 503 there. That production rule is NOT changed. Instead, the lab reads the server's own detailed
// diagnosis (/api/admin/readiness, as a lab-only admin user) and requires:
//   - /api/health 200;
//   - Supabase configured;
//   - Stripe verified by the server's own monitor (billing.ready, code BILLING_CONFIGURATION_VERIFIED: TEST key,
//     expected account, exact 29 EUR monthly price, webhook secret present);
//   - Brevo ABSENT and every email switch off (the lab must never be able to send an email);
//   - /api/readiness NOT 200 (it would mean Brevo is configured).
// Usage: node scripts/lab/server-ready.mjs   (LAB_SERVER_URL, SUPABASE_URL, SUPABASE_ANON_KEY, LAB_ADMIN_EMAIL,
//        LAB_ADMIN_PASSWORD; waits up to LAB_READY_TIMEOUT_MS, default 60 s)
import { pathToFileURL } from 'node:url';

const EMAIL_SWITCHES = ['followups', 'lifecycle', 'acquisition', 'morningDigest', 'billingEmails', 'automaticSending'];

// Pure rule (unit-tested).
export function evaluateLabReadiness({ healthStatus, publicReadinessStatus, report }) {
  const problems = [];
  if (healthStatus !== 200) problems.push(`health ${healthStatus}`);
  if (!report) { problems.push('no detailed readiness report'); return { ready: false, problems }; }
  if (report.integrations?.supabase !== true) problems.push('Supabase not configured');
  const billing = report.billing || {};
  if (billing.ready !== true || billing.code !== 'BILLING_CONFIGURATION_VERIFIED' || report.integrations?.stripe !== true)
    problems.push(`Stripe not verified by the server (${billing.state || 'unknown'}: ${billing.code || 'no code'})`);
  if (report.integrations?.brevo !== false) problems.push('Brevo is configured: the lab must not be able to send emails');
  for (const k of EMAIL_SWITCHES) if (report.automation?.[k] === true) problems.push(`automation.${k} is on`);
  if (publicReadinessStatus === 200) problems.push('/api/readiness answered 200: Brevo must be configured, refused in the lab');
  return { ready: problems.length === 0, problems };
}

async function main() {
  const env = process.env;
  const fail = m => { console.log(`LAB_SERVER_NOT_READY ${m}`); process.exit(1); };
  for (const k of ['LAB_SERVER_URL', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'LAB_ADMIN_EMAIL', 'LAB_ADMIN_PASSWORD']) if (!env[k]) fail(`${k} missing`);
  if (!env.LAB_ADMIN_EMAIL.endsWith('@example.com')) fail('LAB_ADMIN_EMAIL must be an @example.com lab address');
  const timeout = Number(env.LAB_READY_TIMEOUT_MS || 60000);
  const end = Date.now() + timeout;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const status = async (url, init) => { try { return (await fetch(url, init)).status; } catch { return 0; } };
  let token = null, last = { ready: false, problems: ['not checked yet'] };
  while (Date.now() < end) {
    const healthStatus = await status(`${env.LAB_SERVER_URL}/api/health`);
    if (healthStatus === 200 && !token) {
      const auth = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: env.LAB_ADMIN_EMAIL, password: env.LAB_ADMIN_PASSWORD }) }).catch(() => null);
      token = auth?.ok ? (await auth.json()).access_token : null;
    }
    let report = null;
    if (token) {
      const r = await fetch(`${env.LAB_SERVER_URL}/api/admin/readiness`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null);
      if (r?.status === 200) report = await r.json();
      else if (r?.status === 403) fail('the lab admin is not an admin (ADMIN_EMAILS must list LAB_ADMIN_EMAIL)');
    }
    const publicReadinessStatus = await status(`${env.LAB_SERVER_URL}/api/readiness`);
    last = evaluateLabReadiness({ healthStatus, publicReadinessStatus, report });
    if (last.ready) {
      console.log(`LAB_SERVER_READY ${JSON.stringify({ health: healthStatus, supabase: true, stripe: report.billing.code, brevo: 'absent', public_readiness: publicReadinessStatus })}`);
      return;
    }
    // A Brevo configuration or an email switch never fixes itself: stop at once.
    if (last.problems.some(p => /Brevo|automation\./.test(p))) break;
    await sleep(1000);
  }
  fail(last.problems.join('; '));
}
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main().catch(e => { console.log(`LAB_SERVER_NOT_READY ${e.message}`); process.exit(1); });
