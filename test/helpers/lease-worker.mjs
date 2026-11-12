// Test-only worker process: uses the real server/job-lease.js against a throwaway PostgreSQL through psql.
// Usage: node test/helpers/lease-worker.mjs '<json config>'   (PGURL in the environment, local database only)
// Config: { tag, job, ttl, gap, holdMs, attempts, pauseMs }
// Prints one JSON line per event on stdout. Records each run's start/end in public.lease_probe.
import { spawn } from 'node:child_process';
import { createJobLeases } from '../../server/job-lease.js';

const url = process.env.PGURL || '';
if (!/^postgres(ql)?:\/\/[^@]*@(127\.0\.0\.1|localhost)(:\d+)?\//.test(url)) { console.error('lease-worker: PGURL must be a local database'); process.exit(2); }
const cfg = JSON.parse(process.argv[2]);
const out = o => process.stdout.write(JSON.stringify({ t: Date.now(), tag: cfg.tag, ...o }) + '\n');

function psql(sql, vars) {
  return new Promise((resolve, reject) => {
    const args = [url, '-X', '-A', '-t', '-q', '-v', 'ON_ERROR_STOP=1'];
    for (const [k, v] of Object.entries(vars)) args.push('-v', `${k}=${v}`);
    const p = spawn('psql', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let so = '', se = '';
    p.stdout.on('data', d => { so += d; }); p.stderr.on('data', d => { se += d; });
    p.on('close', code => code === 0 ? resolve(so.trim()) : reject(new Error(se.trim() || `psql exit ${code}`)));
    p.stdin.end(sql);
  });
}
const SQL = {
  claim_scheduled_job: [`select public.claim_scheduled_job(:'p_job', :'p_owner', :p_ttl_seconds, :p_min_gap_seconds);`, v => v === '' ? null : Number(v)],
  renew_scheduled_job: [`select public.renew_scheduled_job(:'p_job', :'p_owner', :p_token, :p_ttl_seconds);`, v => v === 't'],
  release_scheduled_job: [`select public.release_scheduled_job(:'p_job', :'p_owner', :p_token, :'p_outcome');`, v => v === 't']
};
const rpc = async (fn, args) => {
  try { const [sql, parse] = SQL[fn]; return { data: parse(await psql(sql, args)), error: null }; }
  catch (e) { return { data: null, error: { message: e.message } }; }
};

const leases = createJobLeases({ rpc, owner: `worker-${cfg.tag}-${process.pid}`, log: (event, details) => out({ event, ...details }) });
const sleep = ms => new Promise(r => setTimeout(r, ms));
out({ event: 'READY' });
for (let i = 0; i < cfg.attempts; i++) {
  const r = await leases.runExclusive(cfg.job, async ({ token }) => {
    await psql(`insert into public.lease_probe(job, owner_tag, token, phase) values (:'job', :'tag', :token, 'start');`, { job: cfg.job, tag: cfg.tag, token });
    out({ event: 'RUN_START', token });
    await sleep(cfg.holdMs);
    await psql(`insert into public.lease_probe(job, owner_tag, token, phase) values (:'job', :'tag', :token, 'end');`, { job: cfg.job, tag: cfg.tag, token });
    out({ event: 'RUN_END', token });
  }, { ttlSeconds: cfg.ttl, minGapSeconds: cfg.gap });
  out({ event: 'ATTEMPT', ran: r.ran, reason: r.reason || null, lost: r.leaseLost || false });
  if (cfg.pauseMs) await sleep(cfg.pauseMs);
}
out({ event: 'DONE' });
