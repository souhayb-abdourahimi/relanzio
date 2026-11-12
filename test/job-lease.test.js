import test from 'node:test';
import assert from 'node:assert/strict';
import { createJobLeases, processOwnerId, schedulerSettings } from '../server/job-lease.js';

// Fake lease service: records calls, answers from a script.
function fakeRpc(answers = {}) {
  const calls = [];
  const rpc = async (fn, args) => {
    calls.push({ fn, args });
    const a = answers[fn];
    const v = typeof a === 'function' ? a(args, calls) : a;
    if (v instanceof Error) return { data: null, error: { message: v.message, code: 'XX' } };
    return { data: v === undefined ? null : v, error: null };
  };
  return { rpc, calls };
}
// Manual timer so renewals are driven by the test.
function manualTimer() {
  const timers = [];
  return { timers, setTimer: (fn, ms) => { const t = { fn, ms, cleared: false }; timers.push(t); return t; }, clearTimer: t => { if (t) t.cleared = true; } };
}

test('runs the job only with the lease, then releases it with the same owner and token', async () => {
  const { rpc, calls } = fakeRpc({ claim_scheduled_job: 7, release_scheduled_job: true });
  const leases = createJobLeases({ rpc, owner: 'owner-test-1234' });
  let ran = 0;
  const r = await leases.runExclusive('followups', async ({ token }) => { ran++; assert.equal(token, 7); return 'done'; }, { ttlSeconds: 840, minGapSeconds: 300 });
  assert.deepEqual(r, { ran: true, token: 7, leaseLost: false, result: 'done' });
  assert.equal(ran, 1);
  assert.deepEqual(calls[0], { fn: 'claim_scheduled_job', args: { p_job: 'followups', p_owner: 'owner-test-1234', p_ttl_seconds: 840, p_min_gap_seconds: 300 } });
  assert.deepEqual(calls.at(-1), { fn: 'release_scheduled_job', args: { p_job: 'followups', p_owner: 'owner-test-1234', p_token: 7, p_outcome: 'ok' } });
});

test('lease held elsewhere: the job does not run', async () => {
  const { rpc, calls } = fakeRpc({ claim_scheduled_job: null });
  const events = [];
  const leases = createJobLeases({ rpc, owner: 'owner-test-1234', log: e => events.push(e) });
  let ran = false;
  const r = await leases.runExclusive('trials', async () => { ran = true; });
  assert.deepEqual(r, { ran: false, reason: 'held_elsewhere' });
  assert.equal(ran, false); assert.deepEqual(events, ['JOB_LEASE_HELD_ELSEWHERE']);
  assert.equal(calls.length, 1, 'nothing to release');
});

test('lease service unavailable: fail closed, the job does not run', async () => {
  const { rpc } = fakeRpc({ claim_scheduled_job: new Error('relation "scheduled_job_leases" does not exist') });
  const events = [];
  const leases = createJobLeases({ rpc, owner: 'owner-test-1234', log: e => events.push(e) });
  let ran = false;
  const r = await leases.runExclusive('outreach', async () => { ran = true; });
  assert.deepEqual(r, { ran: false, reason: 'lease_unavailable' });
  assert.equal(ran, false); assert.deepEqual(events, ['JOB_LEASE_UNAVAILABLE']);
  const thrown = createJobLeases({ rpc: async () => { throw new Error('network down'); }, owner: 'owner-test-1234' });
  assert.deepEqual(await thrown.runExclusive('outreach', async () => { ran = true; }), { ran: false, reason: 'lease_unavailable' });
  assert.equal(ran, false);
});

test('a failing job still releases its lease (outcome "error") and the error propagates', async () => {
  const { rpc, calls } = fakeRpc({ claim_scheduled_job: 3, release_scheduled_job: true });
  const leases = createJobLeases({ rpc, owner: 'owner-test-1234' });
  await assert.rejects(leases.runExclusive('lifecycle', async () => { throw new Error('boom'); }), /boom/);
  assert.equal(calls.at(-1).fn, 'release_scheduled_job'); assert.equal(calls.at(-1).args.p_outcome, 'error');
});

test('renewal every ttl/3; a refused renewal marks the lease lost and aborts the signal', async () => {
  let renewOk = true;
  const { rpc, calls } = fakeRpc({ claim_scheduled_job: 11, renew_scheduled_job: () => renewOk, release_scheduled_job: false });
  const t = manualTimer();
  const events = [];
  const leases = createJobLeases({ rpc, owner: 'owner-test-1234', log: (e, d) => events.push([e, d.reason]), ...t });
  let release;
  const gate = new Promise(r => { release = r; });
  let signalSeen;
  const run = leases.runExclusive('imap-replies', async ({ signal }) => { signalSeen = signal; await gate; return 1; }, { ttlSeconds: 540 });
  await new Promise(r => setImmediate(r));
  assert.equal(t.timers.length, 1); assert.equal(t.timers[0].ms, 180000, 'renewed every ttl/3');
  await t.timers[0].fn();
  assert.equal(calls.filter(c => c.fn === 'renew_scheduled_job').length, 1);
  assert.equal(signalSeen.aborted, false);
  renewOk = false;
  await t.timers[0].fn();
  assert.equal(signalSeen.aborted, true);
  assert.deepEqual(events, [['JOB_LEASE_LOST', 'renew_refused']]);
  release();
  const r = await run;
  assert.equal(r.ran, true); assert.equal(r.leaseLost, true);
  assert.equal(calls.at(-1).args.p_outcome, 'ok_lease_lost');
  assert.equal(t.timers[0].cleared, true, 'renewal stops with the job');
});

test('a renewal error also counts as lost; a release error is only logged (the lease expires by itself)', async () => {
  const { rpc } = fakeRpc({ claim_scheduled_job: 5, renew_scheduled_job: new Error('timeout'), release_scheduled_job: new Error('timeout') });
  const t = manualTimer();
  const events = [];
  const leases = createJobLeases({ rpc, owner: 'owner-test-1234', log: e => events.push(e), ...t });
  let release; const gate = new Promise(r => { release = r; });
  const run = leases.runExclusive('trials', async () => gate);
  await new Promise(r => setImmediate(r));
  await t.timers[0].fn();
  release();
  const r = await run;
  assert.equal(r.leaseLost, true);
  assert.deepEqual(events, ['JOB_LEASE_LOST', 'JOB_LEASE_RELEASE_FAILED']);
});

test('input checks: job name, ttl, gap, rpc', async () => {
  const { rpc } = fakeRpc({ claim_scheduled_job: 1, release_scheduled_job: true });
  const leases = createJobLeases({ rpc, owner: 'owner-test-1234' });
  await assert.rejects(leases.runExclusive('Bad Name', async () => {}), /JOB_LEASE_BAD_NAME/);
  await assert.rejects(leases.runExclusive('ok', async () => {}, { ttlSeconds: 5 }), /JOB_LEASE_BAD_TTL/);
  await assert.rejects(leases.runExclusive('ok', async () => {}, { ttlSeconds: 60, minGapSeconds: -1 }), /JOB_LEASE_BAD_GAP/);
  assert.throws(() => createJobLeases({}), /JOB_LEASE_RPC_REQUIRED/);
});

test('owner id: unique per process start, no secret or odd character', () => {
  const a = processOwnerId({ RAILWAY_DEPLOYMENT_ID: 'dep-123' }), b = processOwnerId({ RAILWAY_DEPLOYMENT_ID: 'dep-123' });
  assert.notEqual(a, b);
  assert.match(a, /^dep-123:[A-Za-z0-9_.-]*:\d+:[0-9a-f]{8}$/);
  assert.match(processOwnerId({ RAILWAY_DEPLOYMENT_ID: 'x;drop table' }), /^xdroptable:/);
  assert.ok(a.length >= 8 && a.length <= 200);
});

test('scheduler settings: enabled by default with a 120 s start-up grace; explicit off switch; strict delay', () => {
  assert.deepEqual(schedulerSettings({}), { enabled: true, startDelaySeconds: 120 });
  assert.deepEqual(schedulerSettings({ SCHEDULER_ENABLED: 'false', SCHEDULER_START_DELAY_SECONDS: '0' }), { enabled: false, startDelaySeconds: 0 });
  assert.equal(schedulerSettings({ SCHEDULER_ENABLED: ' FALSE ' }).enabled, false);
  assert.equal(schedulerSettings({ SCHEDULER_ENABLED: 'true' }).enabled, true);
  assert.throws(() => schedulerSettings({ SCHEDULER_START_DELAY_SECONDS: 'soon' }), /SCHEDULER_START_DELAY_SECONDS/);
  assert.throws(() => schedulerSettings({ SCHEDULER_START_DELAY_SECONDS: '-5' }), /SCHEDULER_START_DELAY_SECONDS/);
});
