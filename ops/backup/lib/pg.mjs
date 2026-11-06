// Thin wrappers around the PostgreSQL client tools (psql, pg_dump) and an ephemeral local cluster.
// No npm dependency: the job image ships the official PostgreSQL 17 binaries.
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pgEnv, redact } from './guards.mjs';

const bin = (pgBin, name) => (pgBin ? path.join(pgBin, name) : name);

// Session settings that make value-to-text conversions identical on source and restored databases.
export const DETERMINISTIC_SETTINGS = "set timezone='UTC'; set datestyle='ISO, YMD'; set intervalstyle='postgres'; set extra_float_digits=1; set bytea_output='hex'; set statement_timeout=0;";

export function run(cmd, args, { env, input, secrets = [] } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
    const out = [], err = [];
    p.stdout.on('data', d => out.push(d));
    p.stderr.on('data', d => err.push(d));
    p.on('error', e => reject(new Error(`${path.basename(cmd)}: ${e.code || e.message}`)));
    p.on('close', code => {
      const stdout = Buffer.concat(out).toString('utf8'), stderr = Buffer.concat(err).toString('utf8');
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${path.basename(cmd)} exited ${code}: ${redact(stderr, secrets).trim().slice(-1500)}`));
    });
    if (input !== undefined) p.stdin.end(input); else p.stdin.end();
  });
}

// One long-lived psql process = one database session. Needed to hold the exporting transaction of a snapshot.
export class PsqlSession {
  constructor({ conn, pgBin, label = 'db' }) {
    this.secrets = [conn.password].filter(Boolean);
    this.label = label;
    this.proc = spawn(bin(pgBin, 'psql'), ['-X', '-q', '-A', '-t', '-v', 'ON_ERROR_STOP=1'], { env: pgEnv(conn), stdio: ['pipe', 'pipe', 'pipe'] });
    this.buf = ''; this.err = ''; this.waiters = []; this.closed = false; this.seq = 0;
    this.proc.stdout.on('data', d => { this.buf += d.toString('utf8'); this.#drain(); });
    this.proc.stderr.on('data', d => { this.err += d.toString('utf8'); });
    this.proc.on('error', e => this.#fail(new Error(`psql: ${e.code || e.message}`)));
    this.proc.on('close', code => { this.closed = true; this.#fail(new Error(`${label} session ended (${code}): ${redact(this.err, this.secrets).trim().slice(-1500)}`)); });
  }
  #fail(e) { const w = this.waiters; this.waiters = []; for (const x of w) x.reject(e); }
  #drain() {
    while (this.waiters.length) {
      const w = this.waiters[0];
      const i = this.buf.indexOf(w.marker + '\n');
      if (i < 0) return;
      const out = this.buf.slice(0, i); this.buf = this.buf.slice(i + w.marker.length + 1);
      this.waiters.shift(); w.resolve(out.replace(/\n$/, ''));
    }
  }
  // Runs SQL; returns raw text output (unaligned, tuples only).
  query(sql) {
    if (this.closed) return Promise.reject(new Error(`${this.label} session closed`));
    const marker = `__RZ_END_${++this.seq}_${process.pid}__`;
    return new Promise((resolve, reject) => {
      this.waiters.push({ marker, resolve, reject });
      this.proc.stdin.write(`${sql.trim().replace(/;?$/, ';')}\n\\echo ${marker}\n`);
    });
  }
  // SQL must return a single jsonb value (jsonb text output has no newline).
  async json(sql) { const t = await this.query(sql); return JSON.parse(t.trim().split('\n').pop()); }
  async close() {
    if (this.closed) return;
    const done = new Promise(r => this.proc.once('close', r));
    this.proc.stdin.end('\\q\n');
    await done;
  }
}

export async function pgDump({ conn, pgBin, args }) {
  const { stdout } = await run(bin(pgBin, 'pg_dump'), args, { env: pgEnv(conn), secrets: [conn.password] });
  return stdout;
}

export async function psqlFile({ conn, pgBin, sql, singleTransaction = true }) {
  const args = ['-X', '-q', '-v', 'ON_ERROR_STOP=1'];
  if (singleTransaction) args.push('--single-transaction');
  return run(bin(pgBin, 'psql'), args, { env: pgEnv(conn), input: sql, secrets: [conn.password] });
}

// Ephemeral PostgreSQL cluster: a fresh data directory, a unix socket in that directory, NO TCP listener.
// By construction it cannot be (or reach) production. Destroyed (data and socket) by stop().
export async function startEphemeralCluster({ pgBin, serverBin = pgBin }) {
  const dir = await mkdtemp(path.join(tmpdir(), 'rz-restore-'));
  const data = path.join(dir, 'data');
  const env = { ...process.env, LC_ALL: 'C' };
  for (const k of Object.keys(env)) if (k.startsWith('PG')) delete env[k];
  await run(bin(serverBin, 'initdb'), ['-D', data, '-U', 'postgres', '-A', 'trust', '-E', 'UTF8', '--locale=C', '--no-sync'], { env });
  const opts = `-c listen_addresses='' -c unix_socket_directories='${dir}' -c fsync=off -c full_page_writes=off -c max_connections=20 -c timezone=UTC`;
  await run(bin(serverBin, 'pg_ctl'), ['-D', data, '-o', opts, '-w', '-t', '60', '-l', path.join(dir, 'log'), 'start'], { env });
  const conn = { host: dir, port: 5432, user: 'postgres', password: '', database: 'postgres', sslmode: '' };
  return {
    conn, dir,
    async stop() {
      try { await run(bin(serverBin, 'pg_ctl'), ['-D', data, '-m', 'immediate', '-w', 'stop'], { env }); } catch { /* already stopped */ }
      await rm(dir, { recursive: true, force: true });
    }
  };
}
