// Public manifest stored next to each encrypted backup. Counts, hashes and names only: no row value,
// no email address, no secret. assertNoPersonalData() is applied before every upload.
export const MANIFEST_FORMAT = 'relanzio-backup-manifest';
export const MANIFEST_VERSION = 2;
export const PREFIX = 'v2/daily/';

export const parisTime = iso => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' }).format(new Date(iso));

export function backupKeys(iso) {
  const stamp = iso.replace(/[-:.]/g, '');
  return { blob: `${PREFIX}relanzio-${stamp}.rzbk2`, manifest: `${PREFIX}relanzio-${stamp}.manifest.json` };
}

// Status ladder: each step needs the previous ones.
export function overallStatus(m) {
  if (!m.backup_created) return 'FAILED';
  if (!m.integrity.verified) return 'CREATED_INTEGRITY_NOT_VERIFIED';
  if (!m.coverage.complete) return 'INCOMPLETE';
  if (!m.restore.verified) return 'RESTORE_NOT_VERIFIED';
  if (!m.auth.restore_verified) return 'AUTH_RESTORE_NOT_VERIFIED';
  return 'COMPLETE_AND_RESTORE_VERIFIED';
}

export function buildManifest({ at, source, blob, coverage, migrations, content, catalog, authCounts, integrity, restore, auth, retentionDays, tooling }) {
  const tables = Object.fromEntries(Object.entries(content.tables).map(([t, v]) => [t, { rows: v.rows, sha256: v.sha256 }]));
  const m = {
    format: MANIFEST_FORMAT,
    format_version: MANIFEST_VERSION,
    container: 'RZBK2 (AES-256-GCM, key BACKUP_ENCRYPTION_KEY_B64, gzip JSON archive of SQL files)',
    created_at_utc: at,
    created_at_europe_paris: parisTime(at),
    backup_created: Boolean(blob),
    object_key: blob?.key ?? null,
    size_bytes: blob?.size ?? null,
    sha256: blob?.sha256 ?? null,
    source: {
      supabase_project_ref: source.project_ref,
      postgres_version: source.server_version,
      postgres_version_num: source.server_version_num,
      system_identifier: source.system_identifier,
      consistency: 'single exported snapshot (REPEATABLE READ, read only) shared by every dump and fingerprint'
    },
    method: 'pg_dump (official Supabase CLI approach): schema-only public + supabase_migrations; data-only public + supabase_migrations; auth.users + auth.identities data; auth.users/identities structure for verification only',
    tooling,
    tables,
    table_count: Object.keys(tables).length,
    catalog: {
      tables: catalog.tables.length, columns: Object.keys(catalog.columns).length, constraints: Object.keys(catalog.constraints).length,
      indexes: Object.keys(catalog.indexes).length, functions: Object.keys(catalog.functions).length, triggers: Object.keys(catalog.triggers).length,
      policies: Object.keys(catalog.policies).length, sequences: catalog.sequences.length, views: Object.keys(catalog.views).length, grants: catalog.grants.length
    },
    sequences: content.sequences,
    migrations,
    auth: {
      covered_tables: Object.keys(tables).filter(t => t.startsWith('auth.')),
      counts: authCounts,
      sessions_and_tokens_restored: false,
      restore_verified: Boolean(auth?.verified),
      restore_scope: 'database level: same UUIDs, password hashes, identities and profile links, in the real Supabase auth.users/identities structure. Sign-in through Supabase Auth is proven only by a restore into a Supabase project (ops/backup/restore.mjs).',
      problems: auth?.problems ?? []
    },
    coverage: { complete: coverage.ok, failures: coverage.failures, warnings: coverage.warnings },
    excluded: coverage.excluded,
    integrity: integrity ?? { verified: false },
    restore: restore ?? { verified: false },
    retention_days: retentionDays
  };
  m.status = overallStatus(m);
  assertNoPersonalData(m);
  return m;
}

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const SECRET = /(postgres(ql)?:\/\/[^\s"]*:[^\s"@]+@|eyJ[A-Za-z0-9_-]{10,}\.|sk_(live|test)_|whsec_|xkeysib-|sbp_[a-z0-9]{10,}|-----BEGIN)/i;

export function assertNoPersonalData(obj) {
  const text = JSON.stringify(obj);
  if (SECRET.test(text)) throw new Error('MANIFEST_CONTAINS_SECRET');
  if (EMAIL.test(text)) throw new Error('MANIFEST_CONTAINS_EMAIL');
  return true;
}
