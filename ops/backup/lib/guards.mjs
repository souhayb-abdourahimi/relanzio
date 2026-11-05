// Safety guards. Pure functions, unit-tested (test/backup-guards.test.js).
//
// Restore principles (docs/sale-readiness/06-backup-restore-runbook.md):
//  - restore is impossible by default: it needs an explicit target AND a confirmation phrase naming that target;
//  - the production project can never be a target (ref, hostname, pooler user, or same URL as the backup source);
//  - the target must be EMPTY (no application table, no auth user): nothing is ever dropped, truncated or replaced;
//  - RUN_RESTORE has no effect at all in this code.

// The production Supabase project. Hard-coded on purpose: a missing or wrong variable can never "unlock" it.
export const PRODUCTION_PROJECT_REFS = Object.freeze(['uwgvnhnpvxoebabayqac']);

export function parseDbUrl(url) {
  let u;
  try { u = new URL(url); } catch { throw new Error('DB_URL_INVALID'); }
  if (!/^postgres(ql)?:$/.test(u.protocol)) throw new Error('DB_URL_INVALID');
  return {
    host: u.searchParams.get('host') || decodeURIComponent(u.hostname),
    port: Number(u.port || 5432),
    user: decodeURIComponent(u.username || ''),
    password: decodeURIComponent(u.password || ''),
    database: decodeURIComponent(u.pathname.replace(/^\//, '') || 'postgres'),
    sslmode: u.searchParams.get('sslmode') || ''
  };
}

// Environment for psql/pg_dump: the password travels in PGPASSWORD, never on a command line or in a log.
export function pgEnv(conn, base = process.env) {
  const env = { ...base, PGHOST: conn.host, PGPORT: String(conn.port), PGUSER: conn.user, PGDATABASE: conn.database };
  if (conn.password) env.PGPASSWORD = conn.password; else delete env.PGPASSWORD;
  if (conn.sslmode) env.PGSSLMODE = conn.sslmode;
  if (conn.host.startsWith('/')) delete env.PGSSLMODE;
  for (const k of ['DATABASE_URL', 'BACKUP_SOURCE_DB_URL', 'RESTORE_TARGET_DB_URL', 'RESTORE_DB_URL']) delete env[k];
  return env;
}

// Supabase project ref that a connection points to (direct host db.<ref>.supabase.co or pooler user postgres.<ref>).
export function supabaseRefOf(conn) {
  const host = conn.host.toLowerCase();
  const m = host.match(/^db\.([a-z0-9]{20})\.supabase\.(co|com|net)$/) || host.match(/^([a-z0-9]{20})\.supabase\.(co|com|net)$/);
  if (m) return m[1];
  const u = conn.user.toLowerCase().match(/^[a-z_]+\.([a-z0-9]{20})$/);
  if (u && /pooler\.supabase\.com$/.test(host)) return u[1];
  return null;
}

export function mentionsProduction(text) {
  const t = String(text || '').toLowerCase();
  return PRODUCTION_PROJECT_REFS.some(ref => t.includes(ref));
}

// Static checks, before any connection is opened. Returns {ok, reasons[]} — never throws on bad input.
export function checkRestoreRequest(env) {
  const reasons = [];
  const url = env.RESTORE_TARGET_DB_URL || '';
  const declared = String(env.RESTORE_TARGET_PROJECT_REF || '').trim();
  const confirm = String(env.RESTORE_CONFIRM || '').trim();
  if (!url) reasons.push('RESTORE_TARGET_DB_URL missing: restore is disabled by default');
  if (!declared) reasons.push('RESTORE_TARGET_PROJECT_REF missing: name the target project explicitly');
  if (url && declared && confirm !== `restore-into:${declared}`) reasons.push(`RESTORE_CONFIRM must be exactly "restore-into:${declared}"`);
  if (PRODUCTION_PROJECT_REFS.includes(declared.toLowerCase())) reasons.push('target project ref is the PRODUCTION project');
  if (mentionsProduction(url)) reasons.push('target connection string points to the PRODUCTION project');
  for (const prodVar of ['BACKUP_SOURCE_DB_URL', 'DATABASE_URL', 'SUPABASE_DB_URL']) {
    if (url && env[prodVar] && sameDatabase(env[prodVar], url)) reasons.push(`target is the same database as ${prodVar}`);
  }
  let conn = null;
  if (url) {
    try { conn = parseDbUrl(url); } catch { reasons.push('RESTORE_TARGET_DB_URL is not a valid postgres:// URL'); }
  }
  if (conn) {
    const ref = supabaseRefOf(conn);
    if (ref && PRODUCTION_PROJECT_REFS.includes(ref)) reasons.push('target host/user resolves to the PRODUCTION project');
    if (ref && declared && ref !== declared.toLowerCase()) reasons.push(`target host/user is project ${ref}, not the declared ${declared}`);
    if (!ref && !env.RESTORE_ALLOW_NON_SUPABASE_TARGET) reasons.push('target is not a Supabase project (set RESTORE_ALLOW_NON_SUPABASE_TARGET=1 only for a plain Postgres test target)');
  }
  return { ok: reasons.length === 0, reasons, conn };
}

function sameDatabase(a, b) {
  try {
    const x = parseDbUrl(a), y = parseDbUrl(b);
    return x.host.toLowerCase() === y.host.toLowerCase() && x.port === y.port && x.database === y.database && x.user.toLowerCase() === y.user.toLowerCase();
  } catch { return false; }
}

// Live checks on the target, from a read-only inspection (see restore.mjs). `probe` is what the target reports.
export function checkTargetIsEmpty(probe, manifest) {
  const reasons = [];
  if (probe.public_tables > 0) reasons.push(`target already has ${probe.public_tables} table(s) in schema public: refusing (nothing is ever dropped)`);
  if (probe.auth_users > 0) reasons.push(`target already has ${probe.auth_users} auth user(s): refusing`);
  if (probe.auth_users === null) reasons.push('target has no auth.users table: not a Supabase project (restore Auth data impossible)');
  if (manifest?.source?.system_identifier && probe.system_identifier && String(probe.system_identifier) === String(manifest.source.system_identifier)) {
    reasons.push('target cluster has the same system identifier as the backup source: it IS the source database');
  }
  if (probe.in_recovery) reasons.push('target is a read-only replica');
  return { ok: reasons.length === 0, reasons };
}

// Source connection for backups: transaction pooling (port 6543) breaks exported snapshots.
export function checkSourceUrl(url) {
  const conn = parseDbUrl(url);
  if (conn.port === 6543) throw new Error('BACKUP_SOURCE_DB_URL uses the transaction pooler (6543): use the session pooler (5432) or the direct host');
  return conn;
}

// Redact anything that looks like a credential before it reaches a log.
export function redact(text, secrets = []) {
  let s = String(text ?? '');
  for (const v of secrets) if (v && String(v).length >= 4) s = s.split(String(v)).join('[redacted]');
  return s
    .replace(/(postgres(?:ql)?:\/\/[^:\s/]+:)[^@\s]+@/gi, '$1[redacted]@')
    .replace(/(password|pwd|secret|token|apikey|api_key)=([^\s&]+)/gi, '$1=[redacted]')
    .replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/g, '[redacted-jwt]');
}
