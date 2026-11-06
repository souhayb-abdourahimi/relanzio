#!/usr/bin/env node
// Relanzio daily backup (v2). Read-only on the source. Steps, each with its own log marker:
//   BACKUP_CREATED            encrypted backup uploaded
//   BACKUP_INTEGRITY_VERIFIED re-downloaded, SHA-256 identical, decrypted, every file hash intact
//   RESTORE_VERIFIED          that downloaded copy restored into an ephemeral cluster and identical to the source
//   AUTH_RESTORE_VERIFIED     Auth accounts/identities restored with the same UUIDs and linked to their profiles
//   BACKUP_RESULT             final status (COMPLETE_AND_RESTORE_VERIFIED, or why not) — exit code 0 only if complete
// A missing marker means that step did NOT succeed. There is no restore-to-a-real-database code path here.
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildArchive, checkArchive, decryptContainer, encryptArchive, parseKey, sha256 } from './lib/crypto.mjs';
import { evaluateCoverage, evaluateMigrations } from './lib/coverage.mjs';
import { captureSource } from './lib/dump.mjs';
import { PRODUCTION_PROJECT_REFS, checkSourceUrl, redact, supabaseRefOf } from './lib/guards.mjs';
import { PREFIX, backupKeys, buildManifest } from './lib/manifest.mjs';
import { planRetention, stampOf } from './lib/retention.mjs';
import { s3Store } from './lib/store.mjs';
import { verifyByEphemeralRestore } from './lib/verify-restore.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO_MIGRATIONS_DIR = path.resolve(HERE, '../../supabase/migrations');
export const MIGRATION_MAP = path.join(HERE, 'migration-map.json');

export async function runBackup({ env = process.env, store, now = () => new Date(), log = console.log, pgBin = env.BACKUP_PG_BIN || '', serverBin = env.BACKUP_PG_SERVER_BIN || pgBin, migrationsDir = REPO_MIGRATIONS_DIR } = {}) {
  const secrets = [env.BACKUP_ENCRYPTION_KEY_B64, ...(store?.secrets || [])];
  const say = (marker, obj) => log(`${marker} ${redact(JSON.stringify(obj), secrets)}`);
  const missing = ['BACKUP_SOURCE_DB_URL', 'BACKUP_ENCRYPTION_KEY_B64', 'BACKUP_SOURCE_PROJECT_REF'].filter(k => !env[k]);
  if (missing.length) throw new Error(`MISSING_ENV:${missing.join(',')}`);
  const conn = checkSourceUrl(env.BACKUP_SOURCE_DB_URL);
  secrets.push(conn.password);
  const key = parseKey(env.BACKUP_ENCRYPTION_KEY_B64);
  const projectRef = env.BACKUP_SOURCE_PROJECT_REF.trim();
  if (!/^[a-z0-9]{20}$/.test(projectRef) && !env.BACKUP_ALLOW_TEST_SOURCE) throw new Error('BACKUP_SOURCE_PROJECT_REF_INVALID');
  const urlRef = supabaseRefOf(conn);
  if (urlRef && urlRef !== projectRef) throw new Error(`BACKUP_SOURCE_DB_URL points to project ${urlRef}, not ${projectRef}`);
  if (!urlRef && !env.BACKUP_ALLOW_TEST_SOURCE) throw new Error('BACKUP_SOURCE_DB_URL is not a Supabase connection string');
  const retentionDays = Number(env.RETENTION_DAYS || 30);
  const at = now().toISOString();
  const keys = backupKeys(at);

  // 1. Capture (read-only snapshot).
  const cap = await captureSource({ conn, pgBin });
  const appTables = cap.fingerprint.catalog.tables.filter(t => t.startsWith('public.'));
  const coverage = evaluateCoverage({ inventory: cap.inventory, authCounts: cap.authCounts, appTables });
  const map = JSON.parse(await readFile(MIGRATION_MAP, 'utf8'));
  const repoFiles = (await readdir(migrationsDir)).filter(f => f.endsWith('.sql')).sort();
  const migrations = evaluateMigrations({ history: cap.inventory.migration_history, repoFiles, map });
  if (!migrations.ok) coverage.failures.push(...migrations.failures.map(f => `migrations: ${f}`));
  coverage.warnings.push(...migrations.warnings.map(w => `migrations: ${w}`));
  coverage.ok = coverage.failures.length === 0;
  const migrationFiles = {};
  for (const f of repoFiles) migrationFiles[`repository-migrations/${f}`] = await readFile(path.join(migrationsDir, f), 'utf8');
  const source = { project_ref: projectRef, server_version: cap.inventory.server_version, server_version_num: cap.inventory.server_version_num, system_identifier: cap.inventory.system_identifier };
  const tooling = { pg_dump: (await pgDumpVersion(pgBin)).trim(), node: process.version };

  // 2. Encrypt and upload.
  const archive = buildArchive({ ...cap.files, ...migrationFiles }, { created_at_utc: at, source, source_fingerprint: cap.fingerprint, coverage, migrations, tooling });
  const blob = encryptArchive(archive, key);
  const digest = sha256(blob);
  await store.put(keys.blob, blob, 'application/octet-stream');
  const created = { key: keys.blob, size: blob.length, sha256: digest };
  say('BACKUP_CREATED', { ...created, tables: appTables.length, auth_tables: archiveAuthTables(cap) });

  // 3. Integrity of the stored object (not of the in-memory copy).
  let integrity = { verified: false };
  let stored;
  try {
    const got = await store.get(keys.blob);
    if (got.length !== blob.length) throw new Error('STORED_SIZE_MISMATCH');
    if (sha256(got) !== digest) throw new Error('STORED_SHA256_MISMATCH');
    const { version, payload } = decryptContainer(got, key);
    if (version !== 2) throw new Error('STORED_FORMAT_MISMATCH');
    checkArchive(payload);
    stored = payload;
    integrity = { verified: true, sha256: digest, size_bytes: got.length, decrypted: true, files: Object.keys(payload.files).length, checked_at_utc: now().toISOString() };
    say('BACKUP_INTEGRITY_VERIFIED', { key: keys.blob, sha256: digest, files: integrity.files });
  } catch (e) {
    integrity = { verified: false, error: redact(e.message, secrets) };
    say('BACKUP_INTEGRITY_FAILED', integrity);
  }

  // 4. Restore the stored copy into an ephemeral cluster and compare with the source snapshot.
  let restore = { verified: false, error: 'not run: integrity not verified' }, auth = { verified: false, problems: ['not run'] };
  if (stored) {
    try {
      const files = Object.fromEntries(Object.entries(stored.files).map(([n, f]) => [n, f.content]));
      const r = await verifyByEphemeralRestore({ files, sourceFingerprint: stored.meta.source_fingerprint, pgBin, serverBin, log: m => log(`restore: ${m}`) });
      restore = r.restore; auth = r.auth;
    } catch (e) {
      restore = { verified: false, error: redact(e.message, secrets) };
      auth = { verified: false, problems: ['restore failed before Auth could be checked'] };
    }
    say(restore.verified ? 'RESTORE_VERIFIED' : 'RESTORE_FAILED', { key: keys.blob, rows: restore.restored_rows, problems: restore.problems, error: restore.error, environment: restore.environment, server_version: restore.server_version });
    say(auth.verified ? 'AUTH_RESTORE_VERIFIED' : 'AUTH_RESTORE_FAILED', { users: auth.users, identities: auth.identities, link: auth.link, problems: auth.problems });
  }

  // 5. Manifest (public, no personal data) and retention.
  const manifest = buildManifest({ at, source, blob: created, coverage, migrations, content: cap.fingerprint.content, catalog: cap.fingerprint.catalog,
    authCounts: cap.authCounts, integrity, restore, auth, retentionDays, tooling });
  await store.put(keys.manifest, Buffer.from(JSON.stringify(manifest, null, 2)), 'application/json');

  let pruned = [];
  if (manifest.status === 'COMPLETE_AND_RESTORE_VERIFIED') {
    try { pruned = await prune({ store, now: now(), retentionDays }); }
    catch (e) { coverage.warnings.push(`retention skipped: ${redact(e.message, secrets)}`); }
  }
  say('BACKUP_RESULT', { status: manifest.status, key: keys.blob, manifest: keys.manifest, sha256: digest, size_bytes: blob.length,
    coverage_failures: coverage.failures, warnings: coverage.warnings, pruned: pruned.length });
  return { manifest, pruned, keys };
}

const archiveAuthTables = cap => cap.fingerprint.catalog.tables.filter(t => t.startsWith('auth.'));

async function pgDumpVersion(pgBin) {
  const { run } = await import('./lib/pg.mjs');
  return (await run(pgBin ? path.join(pgBin, 'pg_dump') : 'pg_dump', ['--version'])).stdout;
}

export async function prune({ store, now, retentionDays }) {
  const objects = await store.list(PREFIX);
  const verified = new Set();
  const manifests = objects.filter(o => o.key.endsWith('.manifest.json')).sort((a, b) => b.key.localeCompare(a.key));
  for (const o of manifests) {
    try {
      const m = JSON.parse((await store.get(o.key)).toString('utf8'));
      if (m.status === 'COMPLETE_AND_RESTORE_VERIFIED') { verified.add(stampOf(o.key)); break; }
    } catch { /* unreadable manifest: never counts as verified */ }
  }
  const del = planRetention({ objects, now, retentionDays, verified });
  for (const k of del) await store.del(k);
  return del;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const env = process.env;
  const secretsOf = () => [env.BACKUP_ENCRYPTION_KEY_B64, env.S3_SECRET_ACCESS_KEY, env.BACKUP_SOURCE_DB_URL];
  if (env.BACKUP_SOURCE_PROJECT_REF && !PRODUCTION_PROJECT_REFS.includes(env.BACKUP_SOURCE_PROJECT_REF) && !env.BACKUP_ALLOW_TEST_SOURCE) {
    console.log(`BACKUP_FAILURE ${JSON.stringify({ error: 'BACKUP_SOURCE_PROJECT_REF is not the production project' })}`);
    process.exit(1);
  }
  try {
    const store = await s3Store(env);
    const { manifest } = await runBackup({ env, store });
    process.exit(manifest.status === 'COMPLETE_AND_RESTORE_VERIFIED' ? 0 : 2);
  } catch (e) {
    console.log(`BACKUP_FAILURE ${redact(JSON.stringify({ error: e.message }), secretsOf())}`);
    process.exit(1);
  }
}
