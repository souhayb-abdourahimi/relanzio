#!/usr/bin/env node
// Guarded restore of a v2 backup into a NEW, EMPTY Supabase project (disaster recovery or buyer hand-over).
//
// Disabled by default. It needs ALL of:
//   RESTORE_BACKUP_KEY          object key of the backup, e.g. v2/daily/relanzio-20261106T021500000Z.rzbk2
//   RESTORE_TARGET_DB_URL       connection string of the NEW project (session pooler or direct), set in Railway, never pasted in a chat
//   RESTORE_TARGET_PROJECT_REF  ref of the NEW project (the 20 letters in its URL)
//   RESTORE_CONFIRM             exactly "restore-into:<that ref>"
//   RESTORE_MODE=apply          otherwise it only inspects and prints the plan (dry run)
// It refuses, before writing anything, if the target is the production project (ref, hostname, pooler user,
// same URL as BACKUP_SOURCE_DB_URL, same cluster system identifier) or is not empty. It never drops, truncates
// or replaces anything. RUN_RESTORE is ignored. Sessions and refresh tokens are never restored.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { checkArchive, decryptContainer, parseKey, sha256 } from './lib/crypto.mjs';
import { compareFingerprints } from './lib/fingerprint.mjs';
import { fingerprint } from './lib/dump.mjs';
import { grantReconcileSql } from './lib/grants.mjs';
import { checkRestoreRequest, checkTargetIsEmpty, redact } from './lib/guards.mjs';
import { DETERMINISTIC_SETTINGS, PsqlSession, psqlFile } from './lib/pg.mjs';
import { s3Store } from './lib/store.mjs';

export const TARGET_RESTORE_ORDER = ['schema.sql', 'auth-data.sql', 'app-data.sql']; // auth-schema.sql: never (Supabase owns auth)

export const PROBE_SQL = `select jsonb_build_object(
  'public_tables', (select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind in ('r','p')),
  'auth_users', case when to_regclass('auth.users') is null then null else (xpath('/row/n/text()', query_to_xml('select count(*) n from auth.users', false, true, '')))[1]::text::int end,
  'system_identifier', (select system_identifier::text from pg_control_system()),
  'in_recovery', pg_is_in_recovery(),
  'server_version', current_setting('server_version')
)::text`;

async function probeTarget({ conn, pgBin }) {
  const s = new PsqlSession({ conn, pgBin, label: 'target' });
  try {
    await s.query('begin read only');
    const p = await s.json(PROBE_SQL);
    await s.query('rollback');
    return p;
  } finally { await s.close().catch(() => {}); }
}

export async function runRestore({ env = process.env, store, log = console.log, pgBin = env.BACKUP_PG_BIN || '' }) {
  const secrets = [env.BACKUP_ENCRYPTION_KEY_B64, ...(store?.secrets || [])];
  const say = (marker, obj) => log(`${marker} ${redact(JSON.stringify(obj), secrets)}`);
  if (env.RUN_RESTORE) say('RESTORE_NOTICE', { message: 'RUN_RESTORE is ignored by this tool' });

  const req = checkRestoreRequest(env);
  if (req.conn) secrets.push(req.conn.password);
  if (!req.ok) { say('RESTORE_REFUSED', { stage: 'request', reasons: req.reasons }); return { ok: false, refused: true, reasons: req.reasons }; }
  if (!env.RESTORE_BACKUP_KEY || !/^v2\/daily\/relanzio-\d{8}T\d{9}Z\.rzbk2$/.test(env.RESTORE_BACKUP_KEY)) {
    const reasons = ['RESTORE_BACKUP_KEY must name a v2 backup (v2/daily/relanzio-<stamp>.rzbk2)'];
    say('RESTORE_REFUSED', { stage: 'request', reasons }); return { ok: false, refused: true, reasons };
  }

  // Backup: stored manifest SHA-256 must match the object, which must decrypt and whose files must be intact.
  const key = parseKey(env.BACKUP_ENCRYPTION_KEY_B64);
  const blob = await store.get(env.RESTORE_BACKUP_KEY);
  const manifest = JSON.parse((await store.get(env.RESTORE_BACKUP_KEY.replace(/\.rzbk2$/, '.manifest.json'))).toString('utf8'));
  if (manifest.sha256 !== sha256(blob)) { const reasons = ['backup SHA-256 does not match its manifest']; say('RESTORE_REFUSED', { stage: 'backup', reasons }); return { ok: false, refused: true, reasons }; }
  const { payload } = decryptContainer(blob, key);
  checkArchive(payload);
  say('RESTORE_BACKUP_VERIFIED', { key: env.RESTORE_BACKUP_KEY, sha256: manifest.sha256, status_at_backup_time: manifest.status });

  // Target: inspected read-only, must be empty and must not be the source cluster.
  const probe = await probeTarget({ conn: req.conn, pgBin });
  const empty = checkTargetIsEmpty(probe, manifest);
  if (!empty.ok) { say('RESTORE_REFUSED', { stage: 'target', reasons: empty.reasons }); return { ok: false, refused: true, reasons: empty.reasons }; }
  const plan = { target_project_ref: env.RESTORE_TARGET_PROJECT_REF, target_server_version: probe.server_version, steps: [...TARGET_RESTORE_ORDER, 'grants: revoke what Supabase default privileges added but the source did not have'],
    rows: Object.fromEntries(Object.entries(manifest.tables).map(([t, v]) => [t, v.rows])), sessions_and_tokens: 'not restored: every user signs in again' };
  if (env.RESTORE_MODE !== 'apply') { say('RESTORE_DRY_RUN', plan); return { ok: true, dryRun: true, plan }; }

  for (const f of TARGET_RESTORE_ORDER) {
    try { await psqlFile({ conn: req.conn, pgBin, sql: payload.files[f].content }); }
    catch (e) { say('RESTORE_FAILED', { step: f, error: redact(e.message, secrets) }); return { ok: false, step: f }; }
    say('RESTORE_STEP_DONE', { step: f });
  }

  // Grants: a Supabase project's default privileges give anon/authenticated/service_role ALL on every new
  // object of schema public; pg_dump never writes the REVOKEs that undo them. Remove exactly the grants the
  // source did not have (see lib/grants.mjs), then verify the real target: application schema and rows
  // identical; Auth by ids, counts and links (the target's Supabase Auth may be a newer version with extra
  // columns, reported as warnings).
  const s = new PsqlSession({ conn: req.conn, pgBin, label: 'target' });
  let restored;
  try {
    await s.query(DETERMINISTIC_SETTINGS);
    restored = await fingerprint(s);
    const grants = grantReconcileSql(payload.meta.source_fingerprint.catalog, restored.catalog);
    if (grants.sql) {
      try { await psqlFile({ conn: req.conn, pgBin, sql: grants.sql }); }
      catch (e) { say('RESTORE_FAILED', { step: 'grants', error: redact(e.message, secrets) }); return { ok: false, step: 'grants' }; }
      restored = await fingerprint(s);
    }
    say('RESTORE_STEP_DONE', { step: 'grants', revoked: grants.revoke });
  } finally { await s.close().catch(() => {}); }
  const cmp = compareFingerprints(payload.meta.source_fingerprint, restored);
  const authStructure = d => /^auth\./.test(d.object) && ['columns', 'constraints', 'indexes', 'triggers', 'policies', 'rls', 'grants', 'content'].includes(d.kind);
  const problems = cmp.diffs.filter(d => !authStructure(d));
  const warnings = cmp.diffs.filter(authStructure);
  const result = { ok: problems.length === 0, problems, warnings, auth_link: restored.authLink, next: 'set the new project URL/keys in Railway, configure Auth (site URL, SMTP), then sign in with a real account to prove login' };
  say(result.ok ? 'TARGET_RESTORE_VERIFIED' : 'TARGET_RESTORE_MISMATCH', result);
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const r = await runRestore({ store: await s3Store(process.env) });
    process.exit(r.ok ? 0 : 1);
  } catch (e) {
    console.log(`RESTORE_FAILURE ${redact(JSON.stringify({ error: e.message }), [process.env.BACKUP_ENCRYPTION_KEY_B64, process.env.RESTORE_TARGET_DB_URL, process.env.S3_SECRET_ACCESS_KEY])}`);
    process.exit(1);
  }
}
