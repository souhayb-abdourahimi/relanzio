#!/usr/bin/env node
// Verifies an EXISTING backup without touching any database other than an ephemeral local cluster.
//   node ops/backup/verify.mjs <object key>
// v2 (.rzbk2): SHA-256 vs manifest, decryption, file hashes, full ephemeral restore compared with the source
//              fingerprint embedded in the backup (same checks as the nightly job).
// v1 (.rzbk, legacy job): SHA-256 vs manifest, decryption, then the JSON rows are loaded into an ephemeral cluster
//              built from the repository schema (reconciled with production, see migration-map.json), and every
//              row is compared field by field with what was stored. Reports precisely what a legacy backup lacks.
import { readdir, readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { checkArchive, containerFormat, decryptContainer, parseKey, sha256 } from './lib/crypto.mjs';
import { orphanSql, catalogSql, qualified } from './lib/fingerprint.mjs';
import { redact } from './lib/guards.mjs';
import { DETERMINISTIC_SETTINGS, PsqlSession, psqlFile, startEphemeralCluster } from './lib/pg.mjs';
import { s3Store } from './lib/store.mjs';
import { BOOTSTRAP_SQL, verifyByEphemeralRestore } from './lib/verify-restore.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../..');
export const AUTH_REFERENCE_SQL = path.join(HERE, 'sql/auth-structure-reference.sql');
export const legacyManifestKey = key => key.replace(/\.rzbk$/, '.manifest.json');

export async function repoSchemaFiles(repo = REPO) {
  const dir = path.join(repo, 'supabase/migrations');
  const files = [path.join(repo, 'supabase/schema.sql'), ...(await readdir(dir)).filter(f => f.endsWith('.sql')).sort().map(f => path.join(dir, f))];
  return Promise.all(files.map(async f => ({ name: path.relative(repo, f), sql: await readFile(f, 'utf8') })));
}

export async function verifyLegacyPayload({ payload, pgBin, serverBin, repo = REPO }) {
  if (payload?.format !== 'relanzio-application-backup-v1' || typeof payload.data !== 'object') throw new Error('LEGACY_PAYLOAD_UNKNOWN_FORMAT');
  const cluster = await startEphemeralCluster({ pgBin, serverBin });
  try {
    await psqlFile({ conn: cluster.conn, pgBin, sql: await readFile(BOOTSTRAP_SQL, 'utf8') });
    await psqlFile({ conn: cluster.conn, pgBin, sql: await readFile(AUTH_REFERENCE_SQL, 'utf8') });
    for (const f of await repoSchemaFiles(repo)) {
      try { await psqlFile({ conn: cluster.conn, pgBin, sql: f.sql }); } catch (e) { throw new Error(`SCHEMA_BUILD_FAILED:${f.name}: ${e.message}`); }
    }
    const s = new PsqlSession({ conn: cluster.conn, pgBin, label: 'legacy-restore' });
    try {
      await s.query(DETERMINISTIC_SETTINGS);
      const catalog = await s.json(catalogSql({ schemas: ['public'], extraTables: ['auth.users', 'auth.identities'] }));
      const appTables = catalog.tables.filter(t => t.startsWith('public.')).map(t => t.slice(7));
      const tables = {};
      await s.query('set session_replication_role = replica');
      for (const [t, rows] of Object.entries(payload.data)) {
        if (!appTables.includes(t)) { tables[t] = { stored: rows.length, error: 'table does not exist in the schema' }; continue; }
        const cols = await s.json(`select coalesce(jsonb_agg(attname), '[]')::text from pg_attribute where attrelid='public.${t.replace(/[^a-z0-9_]/g, '')}'::regclass and attnum>0 and not attisdropped`);
        const keys = new Set(rows.flatMap(r => Object.keys(r)));
        const dropped = [...keys].filter(k => !cols.includes(k));
        const tag = `rz${randomBytes(6).toString('hex')}`;
        const json = `$${tag}$${JSON.stringify(rows)}$${tag}$`;
        await s.query(`insert into ${qualified('public.' + t)} overriding system value select * from json_populate_recordset(null::${qualified('public.' + t)}, ${json}::json)`);
        const restored = Number((await s.query(`select count(*) from ${qualified('public.' + t)}`)).trim());
        const differing = Number((await s.query(`select count(*) from jsonb_array_elements(${json}::jsonb) e where not exists (select 1 from ${qualified('public.' + t)} x where to_jsonb(x) = e)`)).trim());
        tables[t] = { stored: rows.length, restored, rows_not_identical: differing, fields_without_column: dropped };
      }
      await s.query('set session_replication_role = origin');
      const orphans = await s.json(orphanSql(catalog.foreign_keys));
      const missingTables = appTables.filter(t => !(t in payload.data));
      const problems = [];
      for (const [t, v] of Object.entries(tables)) {
        if (v.error) problems.push(`${t}: ${v.error}`);
        else {
          if (v.restored !== v.stored) problems.push(`${t}: ${v.stored} stored, ${v.restored} restored`);
          if (v.rows_not_identical) problems.push(`${t}: ${v.rows_not_identical} row(s) not identical after restore`);
          if (v.fields_without_column.length) problems.push(`${t}: fields lost (${v.fields_without_column.join(', ')})`);
        }
      }
      const orphanList = Object.entries(orphans).filter(([, n]) => Number(n) > 0).map(([k, n]) => `${k}: ${n}`);
      return {
        format: 'RZBK1 (legacy)',
        tables, missing_tables: missingTables, auth_covered: Boolean(payload.auth?.covered), orphans: orphanList,
        data_restore_ok: problems.length === 0,
        complete: problems.length === 0 && !missingTables.length && Boolean(payload.auth?.covered) && !orphanList.length,
        problems
      };
    } finally { await s.close().catch(() => {}); }
  } finally { await cluster.stop(); }
}

export async function verifyStoredBackup({ store, key: objectKey, env = process.env, pgBin = env.BACKUP_PG_BIN || '', serverBin = env.BACKUP_PG_SERVER_BIN || pgBin, log = console.log, repo = REPO }) {
  const secrets = [env.BACKUP_ENCRYPTION_KEY_B64, ...(store.secrets || [])];
  const say = (marker, obj) => log(`${marker} ${redact(JSON.stringify(obj), secrets)}`);
  const key = parseKey(env.BACKUP_ENCRYPTION_KEY_B64);
  const blob = await store.get(objectKey);
  const version = containerFormat(blob);
  const manifest = JSON.parse((await store.get(version === 2 ? objectKey.replace(/\.rzbk2$/, '.manifest.json') : legacyManifestKey(objectKey))).toString('utf8'));
  const digest = sha256(blob);
  if (digest !== manifest.sha256 || (manifest.size_bytes && manifest.size_bytes !== blob.length)) {
    say('VERIFY_INTEGRITY_FAILED', { key: objectKey, sha256: digest, expected: manifest.sha256 }); return { ok: false, integrity: false };
  }
  const { payload } = decryptContainer(blob, key);
  say('BACKUP_INTEGRITY_VERIFIED', { key: objectKey, format: `RZBK${version}`, sha256: digest, size_bytes: blob.length, created_at_utc: manifest.created_at_utc });
  if (version === 2) {
    checkArchive(payload);
    const files = Object.fromEntries(Object.entries(payload.files).map(([n, f]) => [n, f.content]));
    const r = await verifyByEphemeralRestore({ files, sourceFingerprint: payload.meta.source_fingerprint, pgBin, serverBin });
    say(r.restore.verified ? 'RESTORE_VERIFIED' : 'RESTORE_FAILED', { key: objectKey, rows: r.restore.restored_rows, problems: r.restore.problems });
    say(r.auth.verified ? 'AUTH_RESTORE_VERIFIED' : 'AUTH_RESTORE_FAILED', { users: r.auth.users, identities: r.auth.identities, link: r.auth.link, problems: r.auth.problems });
    return { ok: r.restore.verified && r.auth.verified, integrity: true, ...r };
  }
  const legacy = await verifyLegacyPayload({ payload, pgBin, serverBin, repo });
  const counts = manifest.counts || {};
  for (const [t, n] of Object.entries(counts)) if (legacy.tables[t] && legacy.tables[t].stored !== n) legacy.problems.push(`${t}: manifest says ${n}, backup holds ${legacy.tables[t].stored}`);
  say(legacy.data_restore_ok ? 'LEGACY_DATA_RESTORE_VERIFIED' : 'LEGACY_DATA_RESTORE_FAILED', { key: objectKey, ...legacy });
  say('LEGACY_BACKUP_INCOMPLETE', { missing_tables: legacy.missing_tables, auth_covered: legacy.auth_covered, orphans: legacy.orphans });
  return { ok: false, integrity: true, legacy };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const objectKey = process.argv[2] || process.env.VERIFY_BACKUP_KEY;
  try {
    if (!objectKey) throw new Error('usage: node ops/backup/verify.mjs <object key>');
    const r = await verifyStoredBackup({ store: await s3Store(process.env), key: objectKey });
    process.exit(r.ok ? 0 : 2);
  } catch (e) {
    console.log(`VERIFY_FAILURE ${redact(JSON.stringify({ error: e.message }), [process.env.BACKUP_ENCRYPTION_KEY_B64, process.env.S3_SECRET_ACCESS_KEY])}`);
    process.exit(1);
  }
}
