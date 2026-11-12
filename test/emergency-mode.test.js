// Emergency mode (SCHEDULER_ENABLED=false) of the production server, with the Stripe guards of PR #16:
// the server becomes ready with a valid (fictional, local) Live configuration, serves health and readiness,
// refuses the manual cron trigger, and its ONLY outbound requests are the read-only Stripe checks
// (account + price): no database request, no scheduled or start-up job, no email, no secret in the logs.
// Replaces the separate "no scheduler" fork (f6e0ab24) by a switch on the same code.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { once } from 'node:events';

test('emergency mode: ready, no scheduler, no database request, only read-only Stripe checks', async t => {
  const paths = [];
  const api = createServer((req, res) => {
    paths.push(`${req.method} ${req.url.split('?')[0]}`);
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/v1/account') return res.end(JSON.stringify({ id: 'acct_fake' }));
    if (req.url.startsWith('/v1/prices/price_fake')) return res.end(JSON.stringify({ id: 'price_fake', active: true, livemode: true, currency: 'eur', unit_amount: 2900, recurring: { interval: 'month', interval_count: 1 } }));
    res.statusCode = 500; res.end('{}');
  });
  api.listen(0, '127.0.0.1'); await once(api, 'listening'); t.after(() => api.close());
  const reserve = createServer(); reserve.listen(0, '127.0.0.1'); await once(reserve, 'listening'); const port = reserve.address().port; await new Promise(r => reserve.close(r));
  const env = {
    PATH: process.env.PATH, LAB_STRIPE_PORT: String(api.address().port), NODE_ENV: 'production', PORT: String(port), DOTENV_CONFIG_PATH: '/dev/null',
    SCHEDULER_ENABLED: 'false', SCHEDULER_START_DELAY_SECONDS: '0',
    SUPABASE_URL: `http://127.0.0.1:${api.address().port}`, SUPABASE_ANON_KEY: 'fake', SUPABASE_SERVICE_ROLE_KEY: 'fake',
    STRIPE_SECRET_KEY: 'sk_live_fictional', STRIPE_EXPECTED_MODE: 'live', STRIPE_EXPECTED_ACCOUNT_ID: 'acct_fake', STRIPE_WEBHOOK_SECRET: 'whsec_fictional',
    STRIPE_PRO_PRICE_ID: 'price_fake', BREVO_API_KEY: 'fake', BREVO_WEBHOOK_SECRET: 'fake', EMAIL_FROM_ADDRESS: 'fake@example.invalid', CRON_SECRET: 'cron-fictional'
  };
  const child = spawn(process.execPath, ['--import', './test/helpers/local-billing-network.js', 'server/index.js'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = ''; child.stdout.on('data', x => { logs += x; }); child.stderr.on('data', x => { logs += x; });
  t.after(async () => { if (child.exitCode === null) { child.kill(); await once(child, 'exit'); } });
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let i = 0; i < 200; i++) { try { ready = (await fetch(`${base}/api/readiness`)).ok; if (ready) break; } catch { /* starting */ } if (child.exitCode !== null) break; await new Promise(r => setTimeout(r, 25)); }
  assert.equal(ready, true, logs);
  assert.equal((await fetch(`${base}/api/health`)).status, 200);
  assert.equal((await fetch(`${base}/api/cron/run`, { method: 'POST', headers: { 'x-cron-secret': 'cron-fictional' } })).status, 503);
  await new Promise(r => setTimeout(r, 1500)); // start-up jobs would have fired by now (delay 0)
  assert.ok(paths.length >= 2);
  assert.ok(paths.every(p => p === 'GET /v1/account' || p === 'GET /v1/prices/price_fake'), JSON.stringify(paths));
  assert.doesNotMatch(logs, /sk_live|whsec|fake@example|cron-fictional/);
  assert.doesNotMatch(logs, /JOB_LEASE|JOB_SKIPPED/);
});
