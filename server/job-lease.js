// Shared leases for scheduled jobs (see supabase/migrations/20261112100000_scheduled_job_leases.sql and
// docs/SCHEDULED_JOBS.md).
//
// runExclusive(name, fn) runs fn only if THIS process obtains the job's lease in the database:
// - lease held by another process (old Railway instance during a deploy, second replica), or the same job
//   already claimed less than minGapSeconds ago (same cron tick fired by another instance) -> skipped;
// - lease service unavailable or returns an error -> skipped (fail closed: never run without the lease);
// - while fn runs, the lease is renewed every ttl/3; if a renewal is refused or fails, the run is marked
//   "lease lost" (fn receives an AbortSignal and can stop at a safe point; the existing jobs do not yet
//   check it, which is why the TTL is generous and renewal keeps it alive);
// - at the end the lease is released (owner + token checked in SQL), so the next tick can run at once.
// A crash stops the renewals: the lease expires after ttl seconds and another process can take the job.
import { hostname } from 'node:os';
import { randomUUID } from 'node:crypto';

export const JOB_NAME = /^[a-z0-9][a-z0-9._-]{0,63}$/;

export function processOwnerId(env = process.env) {
  const deployment = String(env.RAILWAY_DEPLOYMENT_ID || env.RAILWAY_REPLICA_ID || 'local').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 64) || 'local';
  return `${deployment}:${hostname().replace(/[^A-Za-z0-9_.-]/g, '').slice(0, 64)}:${process.pid}:${randomUUID().slice(0, 8)}`;
}

// rpc(name, args) must resolve to { data, error } (supabase-js db.rpc shape).
export function createJobLeases({ rpc, owner = processOwnerId(), log = () => {}, setTimer = setInterval, clearTimer = clearInterval }) {
  if (typeof rpc !== 'function') throw new Error('JOB_LEASE_RPC_REQUIRED');
  const call = async (fn, args) => {
    const { data, error } = await rpc(fn, args);
    if (error) throw Object.assign(new Error(error.message || String(error)), { code: error.code || 'JOB_LEASE_RPC_ERROR' });
    return data;
  };

  async function runExclusive(name, fn, { ttlSeconds = 600, minGapSeconds = 0 } = {}) {
    if (!JOB_NAME.test(name)) throw new Error('JOB_LEASE_BAD_NAME');
    if (!Number.isInteger(ttlSeconds) || ttlSeconds < 15 || ttlSeconds > 21600) throw new Error('JOB_LEASE_BAD_TTL');
    if (!Number.isInteger(minGapSeconds) || minGapSeconds < 0 || minGapSeconds > 86400) throw new Error('JOB_LEASE_BAD_GAP');
    let token;
    try { token = await call('claim_scheduled_job', { p_job: name, p_owner: owner, p_ttl_seconds: ttlSeconds, p_min_gap_seconds: minGapSeconds }); }
    catch (e) { log('JOB_LEASE_UNAVAILABLE', { job: name, code: e.code }); return { ran: false, reason: 'lease_unavailable' }; }
    if (token === null || token === undefined) { log('JOB_LEASE_HELD_ELSEWHERE', { job: name }); return { ran: false, reason: 'held_elsewhere' }; }

    const controller = new AbortController();
    let lost = false;
    const markLost = reason => { if (lost) return; lost = true; controller.abort(new Error(`JOB_LEASE_LOST:${reason}`)); log('JOB_LEASE_LOST', { job: name, token, reason }); };
    let renewing = false;
    const timer = setTimer(async () => {
      if (renewing || lost) return;
      renewing = true;
      try { if (!(await call('renew_scheduled_job', { p_job: name, p_owner: owner, p_token: token, p_ttl_seconds: ttlSeconds }))) markLost('renew_refused'); }
      catch (e) { markLost(`renew_failed:${e.code || 'error'}`); }
      finally { renewing = false; }
    }, Math.max(1000, Math.floor(ttlSeconds * 1000 / 3)));
    timer?.unref?.();

    let outcome = 'ok', result, failure;
    try { result = await fn({ token, signal: controller.signal }); }
    catch (e) { outcome = 'error'; failure = e; }
    finally {
      clearTimer(timer);
      if (lost) outcome = `${outcome}_lease_lost`;
      try { await call('release_scheduled_job', { p_job: name, p_owner: owner, p_token: token, p_outcome: outcome }); }
      catch (e) { log('JOB_LEASE_RELEASE_FAILED', { job: name, token, code: e.code }); } // expires after ttl anyway
    }
    if (failure) throw failure;
    return { ran: true, token, leaseLost: lost, result };
  }

  return { owner, runExclusive };
}

// Scheduler switch and start-up grace period, read once at start.
// SCHEDULER_ENABLED=false  -> no scheduled job, no start-up job, POST /api/cron/run answers 503 (emergency mode).
// SCHEDULER_START_DELAY_SECONDS (default 120) -> no job of any kind during the first seconds after start, so the
//   previous instance (which may not use leases yet) has been stopped by Railway before this one acts.
export function schedulerSettings(env = process.env) {
  const enabled = String(env.SCHEDULER_ENABLED ?? 'true').trim().toLowerCase() !== 'false';
  const raw = env.SCHEDULER_START_DELAY_SECONDS;
  const delay = raw === undefined || raw === '' ? 120 : Number(raw);
  if (!Number.isInteger(delay) || delay < 0 || delay > 3600) throw new Error('SCHEDULER_START_DELAY_SECONDS must be an integer between 0 and 3600');
  return { enabled, startDelaySeconds: delay };
}
