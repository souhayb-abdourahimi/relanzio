// Two (or more) INDEPENDENT Node processes compete for the same job lease in a real PostgreSQL database.
// Opt-in locally (JOB_LEASE_PG_URL=postgresql://postgres@127.0.0.1:<port>/postgres, a throwaway server),
// required in CI (JOB_LEASE_REQUIRED=1). Never point it at Supabase: the URL must be local.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const BASE = process.env.JOB_LEASE_PG_URL || '';
const skip = !BASE && !process.env.JOB_LEASE_REQUIRED ? 'JOB_LEASE_PG_URL not set' : false;
const ROOT = new URL('..', import.meta.url).pathname;
const sleep = ms => new Promise(r => setTimeout(r, ms));

test('JOB_LEASE_PG_URL is set when required', { skip: !process.env.JOB_LEASE_REQUIRED }, () => assert.ok(BASE));

test('shared job lease across independent processes', { skip, timeout: 240000 }, async t => {
  assert.match(BASE, /^postgres(ql)?:\/\/[^@]*@(127\.0\.0\.1|localhost)(:\d+)?\/[a-z_]+$/, 'local database only');
  const db = `relanzio_lease_${process.pid}`;
  const psql = (url, sql) => execFileSync('psql', [url, '-X', '-A', '-t', '-q', '-v', 'ON_ERROR_STOP=1'], { input: sql, encoding: 'utf8' }).trim();
  psql(BASE, `create database ${db};`);
  const URL_ = BASE.replace(/\/[a-z_]+$/, `/${db}`);
  t.after(() => { try { psql(BASE, `drop database if exists ${db} with (force);`); } catch { /* ignore */ } });
  psql(URL_, readFileSync(`${ROOT}test/sql/supabase-stubs.sql`, 'utf8'));
  psql(URL_, readFileSync(`${ROOT}supabase/migrations/20261112100000_scheduled_job_leases.sql`, 'utf8'));
  psql(URL_, `create table public.lease_probe(id bigserial primary key, job text, owner_tag text, token bigint, phase text, at timestamptz default clock_timestamp());`);

  const workers = [];
  t.after(() => { for (const w of workers) if (w.exitCode === null) { try { w.kill('SIGKILL'); } catch { /* gone */ } } });
  function worker(cfg) {
    const p = spawn(process.execPath, ['test/helpers/lease-worker.mjs', JSON.stringify(cfg)], { cwd: ROOT, env: { PATH: process.env.PATH, PGURL: URL_ }, stdio: ['ignore', 'pipe', 'pipe'] });
    p.events = []; let buf = ''; p.stderrText = '';
    p.stdout.on('data', d => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { const line = buf.slice(0, i); buf = buf.slice(i + 1); if (line) p.events.push(JSON.parse(line)); } });
    p.stderr.on('data', d => { p.stderrText += d; });
    p.done = new Promise(r => p.on('exit', code => r(code)));
    workers.push(p);
    return p;
  }
  const until = async (pred, ms, what) => { const end = Date.now() + ms; while (Date.now() < end) { if (pred()) return; await sleep(50); } assert.fail(`timeout: ${what}`); };
  const runs = job => {
    const rows = psql(URL_, `select owner_tag||'|'||token||'|'||phase||'|'||extract(epoch from at) from public.lease_probe where job='${job}' order by at, id;`).split('\n').filter(Boolean).map(l => { const [tag, token, phase, at] = l.split('|'); return { tag, token: Number(token), phase, at: Number(at) }; });
    const byToken = new Map();
    for (const r of rows) { const x = byToken.get(r.token) || { tag: r.tag, token: r.token }; x[r.phase] = r.at; byToken.set(r.token, x); }
    return [...byToken.values()].sort((a, b) => a.start - b.start);
  };
  const assertNoOverlap = list => { for (let i = 1; i < list.length; i++) assert.ok(list[i].start >= list[i - 1].end, `runs ${list[i - 1].token} and ${list[i].token} overlap`); };

  await t.test('mutual exclusion: two processes, 8 attempts each, never two runs at once', async () => {
    const a = worker({ tag: 'A', job: 'test.mutex', ttl: 30, gap: 0, holdMs: 150, attempts: 8, pauseMs: 20 });
    const b = worker({ tag: 'B', job: 'test.mutex', ttl: 30, gap: 0, holdMs: 150, attempts: 8, pauseMs: 20 });
    assert.equal(await a.done, 0, a.stderrText); assert.equal(await b.done, 0, b.stderrText);
    const list = runs('test.mutex');
    assert.ok(list.length >= 4, `some runs happened (${list.length})`);
    assert.ok(list.every(r => r.end), 'every run finished');
    assertNoOverlap(list);
    assert.deepEqual(list.map(r => r.token), [...list.map(r => r.token)].sort((x, y) => x - y), 'fencing token increases with every run');
    const skipped = [...a.events, ...b.events].filter(e => e.event === 'ATTEMPT' && !e.ran);
    assert.ok(skipped.length > 0 && skipped.every(e => e.reason === 'held_elsewhere'), 'the loser skips, it does not wait or run');
  });

  await t.test('same cron tick fired by two processes at once (gap 60 s): exactly one runs', async () => {
    const a = worker({ tag: 'A', job: 'test.tick', ttl: 30, gap: 60, holdMs: 50, attempts: 1 });
    const b = worker({ tag: 'B', job: 'test.tick', ttl: 30, gap: 60, holdMs: 50, attempts: 1 });
    const c = worker({ tag: 'C', job: 'test.tick', ttl: 30, gap: 60, holdMs: 50, attempts: 1 });
    for (const w of [a, b, c]) assert.equal(await w.done, 0, w.stderrText);
    assert.equal(runs('test.tick').length, 1);
  });

  await t.test('long run: renewal keeps the lease past its TTL; the other process never gets in', async () => {
    const a = worker({ tag: 'A', job: 'test.long', ttl: 15, gap: 0, holdMs: 22000, attempts: 1 });
    await until(() => a.events.some(e => e.event === 'RUN_START'), 10000, 'A starts');
    const b = worker({ tag: 'B', job: 'test.long', ttl: 15, gap: 0, holdMs: 10, attempts: 40, pauseMs: 500 });
    assert.equal(await a.done, 0, a.stderrText);
    assert.equal(await b.done, 0, b.stderrText);
    const list = runs('test.long');
    assertNoOverlap(list);
    assert.equal(list[0].tag, 'A'); assert.ok(list[0].end - list[0].start >= 21, 'A ran longer than its 15 s TTL');
    assert.ok(list.slice(1).every(r => r.tag === 'B' && r.start >= list[0].end), 'B only ran after A released');
    assert.ok(!a.events.some(e => e.event === 'JOB_LEASE_LOST'));
  });

  await t.test('crash (SIGKILL) while holding the lease: blocked until expiry, then another process resumes', async () => {
    const a = worker({ tag: 'A', job: 'test.crash', ttl: 15, gap: 0, holdMs: 120000, attempts: 1 });
    await until(() => a.events.some(e => e.event === 'RUN_START'), 10000, 'A starts');
    const killedAt = Date.now() / 1000;
    a.kill('SIGKILL'); await a.done;
    const b = worker({ tag: 'B', job: 'test.crash', ttl: 15, gap: 0, holdMs: 10, attempts: 60, pauseMs: 500 });
    await until(() => b.events.some(e => e.event === 'RUN_END'), 40000, 'B resumes after expiry');
    b.kill('SIGKILL'); await b.done;
    const list = runs('test.crash');
    assert.equal(list[0].tag, 'A'); assert.equal(list[0].end, undefined, 'A never finished (crashed)');
    const firstB = list.find(r => r.tag === 'B');
    assert.ok(firstB.start - killedAt >= 5, 'B was blocked while the crashed lease was still valid');
    assert.ok(firstB.start - list[0].start >= 14, 'B started only once the 15 s lease had expired');
    assert.ok(b.events.filter(e => e.event === 'ATTEMPT' && !e.ran).every(e => e.reason === 'held_elsewhere'));
  });

  await t.test('frozen process (SIGSTOP longer than TTL): the lease passes to another process; on wake-up the old owner learns it lost it and cannot release the new lease', async () => {
    const a = worker({ tag: 'A', job: 'test.freeze', ttl: 15, gap: 0, holdMs: 30000, attempts: 1 });
    await until(() => a.events.some(e => e.event === 'RUN_START'), 10000, 'A starts');
    a.kill('SIGSTOP');
    const b = worker({ tag: 'B', job: 'test.freeze', ttl: 60, gap: 0, holdMs: 15000, attempts: 40, pauseMs: 500 });
    await until(() => b.events.some(e => e.event === 'RUN_START'), 40000, 'B takes over the expired lease');
    a.kill('SIGCONT');
    await until(() => a.events.some(e => e.event === 'JOB_LEASE_LOST'), 15000, 'A detects the loss at its next renewal');
    assert.equal(await a.done, 0, a.stderrText);
    const aAttempt = a.events.find(e => e.event === 'ATTEMPT');
    assert.equal(aAttempt.lost, true);
    const owner = psql(URL_, `select owner_id from public.scheduled_job_leases where job_name='test.freeze';`);
    assert.match(owner, /^worker-B-/, 'A\'s release did not free B\'s lease');
    b.kill('SIGKILL'); await b.done;
  });
});
