// The real server process, with a fake local Supabase that records every request:
// - SCHEDULER_ENABLED=false: no job of any kind, not even a lease request; the manual trigger answers 503;
// - enabled: nothing during the start-up grace period; afterwards each start-up job asks for its lease first,
//   and when the lease is held elsewhere the job does NOT touch the database at all.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { once } from 'node:events';

const ROOT = new URL('..', import.meta.url).pathname;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function freePort() { const s = createServer(); s.listen(0, '127.0.0.1'); await once(s, 'listening'); const p = s.address().port; await new Promise(r => s.close(r)); return p; }

async function startServer(t, extraEnv) {
  const requests = [];
  const fake = createServer((req, res) => {
    let body = ''; req.on('data', d => { body += d; });
    req.on('end', () => {
      requests.push({ method: req.method, path: req.url.split('?')[0], body });
      res.setHeader('Content-Type', 'application/json');
      if (req.url.startsWith('/rest/v1/rpc/claim_scheduled_job')) return res.end('null'); // held elsewhere
      res.end('[]');
    });
  });
  fake.listen(0, '127.0.0.1'); await once(fake, 'listening'); t.after(() => fake.close());
  const port = await freePort();
  const env = {
    PATH: process.env.PATH, NODE_ENV: 'development', PORT: String(port), DOTENV_CONFIG_PATH: '/dev/null',
    SUPABASE_URL: `http://127.0.0.1:${fake.address().port}`, SUPABASE_ANON_KEY: 'fake-anon', SUPABASE_SERVICE_ROLE_KEY: 'fake-service',
    STRIPE_SECRET_KEY: 'sk_test_fictional', CRON_SECRET: 'cron-secret-for-test', ...extraEnv
  };
  const child = spawn(process.execPath, ['server/index.js'], { cwd: ROOT, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = ''; child.stdout.on('data', d => { logs += d; }); child.stderr.on('data', d => { logs += d; });
  t.after(async () => { if (child.exitCode === null) { child.kill(); await once(child, 'exit'); } });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 200; i++) { try { if ((await fetch(`${base}/api/health`)).status < 500) break; } catch { /* starting */ } if (child.exitCode !== null) break; await sleep(25); }
  return { base, requests, logs: () => logs, child };
}
const cronRun = base => fetch(`${base}/api/cron/run`, { method: 'POST', headers: { 'x-cron-secret': 'cron-secret-for-test' } });
const rpcCalls = requests => requests.filter(r => r.path.startsWith('/rest/v1/rpc/'));

test('SCHEDULER_ENABLED=false: no scheduled or start-up job, no lease request, manual trigger refused (503)', async t => {
  const s = await startServer(t, { SCHEDULER_ENABLED: 'false', SCHEDULER_START_DELAY_SECONDS: '0' });
  await sleep(2500);
  assert.equal(s.child.exitCode, null, s.logs());
  assert.equal((await cronRun(s.base)).status, 503);
  assert.deepEqual(s.requests.filter(r => r.path.startsWith('/rest/v1/')), [], 'not a single database request');
});

test('enabled: silent during the start-up grace; then every start-up job asks for its lease and, held elsewhere, does nothing', async t => {
  const s = await startServer(t, { SCHEDULER_START_DELAY_SECONDS: '2' });
  await sleep(800);
  assert.deepEqual(rpcCalls(s.requests), [], 'no lease request during the grace period');
  const early = await cronRun(s.base);
  assert.equal(early.status, 409); assert.deepEqual(await early.json(), { skipped: 'startup_grace' });
  await sleep(3500);
  const claims = rpcCalls(s.requests).filter(r => r.path === '/rest/v1/rpc/claim_scheduled_job').map(r => JSON.parse(r.body).p_job).sort();
  assert.deepEqual(claims, ['commercial-feeder', 'imap-replies', 'pilot-admin-runner', 'pilot-startup-dry-run', 'trials']);
  assert.deepEqual(s.requests.filter(r => r.path.startsWith('/rest/v1/') && !r.path.startsWith('/rest/v1/rpc/claim_scheduled_job')), [],
    'no job touched the database without its lease');
  const late = await cronRun(s.base);
  assert.equal(late.status, 409); assert.deepEqual(await late.json(), { skipped: 'held_elsewhere' });
  assert.match(s.logs(), /JOB_LEASE_HELD_ELSEWHERE \{"job":"trials"\}/);
  assert.doesNotMatch(s.logs(), /fake-service|cron-secret-for-test/);
});
