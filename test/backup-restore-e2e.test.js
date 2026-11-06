// End-to-end backup / restore test against REAL PostgreSQL servers (throwaway clusters, unix sockets only).
// Needs the PostgreSQL client and server binaries:  BACKUP_E2E_PG_BIN=/usr/lib/postgresql/17/bin
// Skipped when absent, except in CI where BACKUP_E2E_REQUIRED=1 turns the absence into a failure.
// Must run as a non-root user (initdb refuses root).
import test from 'node:test';
import assert from 'node:assert/strict';
import { createCipheriv, randomBytes } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { runBackup } from '../ops/backup/backup.mjs';
import { runRestore } from '../ops/backup/restore.mjs';
import { verifyStoredBackup } from '../ops/backup/verify.mjs';
import { decryptContainer, sha256 } from '../ops/backup/lib/crypto.mjs';
import { PsqlSession, psqlFile, startEphemeralCluster } from '../ops/backup/lib/pg.mjs';
import { dirStore } from '../ops/backup/lib/store.mjs';
import { verifyByEphemeralRestore } from '../ops/backup/lib/verify-restore.mjs';

const PG = process.env.BACKUP_E2E_PG_BIN || '';
const SERVER = process.env.BACKUP_E2E_PG_SERVER_BIN || PG;
const ROOT = new URL('..', import.meta.url).pathname;
const KEY_B64 = Buffer.alloc(32, 7).toString('base64');
const skip = !PG && !process.env.BACKUP_E2E_REQUIRED ? 'BACKUP_E2E_PG_BIN not set' : false;

test('PostgreSQL binaries are available when required', { skip: !process.env.BACKUP_E2E_REQUIRED }, () => {
  assert.ok(PG, 'BACKUP_E2E_PG_BIN must point to the PostgreSQL 17 bin directory');
});

const urlOf = c => `postgresql://postgres@localhost/postgres?host=${encodeURIComponent(c.dir)}`;
const files = async () => [
  'ops/backup/sql/ephemeral-bootstrap.sql', 'ops/backup/sql/supabase-default-privileges.sql', 'ops/backup/sql/auth-structure-reference.sql', 'supabase/schema.sql',
  ...(await readdir(path.join(ROOT, 'supabase/migrations'))).filter(f => f.endsWith('.sql')).sort().map(f => `supabase/migrations/${f}`),
  'test/fixtures/backup-source-fixture.sql'
];
async function buildSource() {
  const c = await startEphemeralCluster({ pgBin: PG, serverBin: SERVER });
  for (const f of await files()) await psqlFile({ conn: c.conn, pgBin: PG, sql: await readFile(path.join(ROOT, f), 'utf8') });
  return c;
}
const sql = async (c, q) => { const s = new PsqlSession({ conn: c.conn, pgBin: PG }); try { return await s.query(q); } finally { await s.close(); } };
const envFor = c => ({ BACKUP_SOURCE_DB_URL: urlOf(c), BACKUP_ENCRYPTION_KEY_B64: KEY_B64, BACKUP_SOURCE_PROJECT_REF: 'testsourcetestsource', BACKUP_ALLOW_TEST_SOURCE: '1' });
const backup = async (c, store, extra = {}) => {
  const lines = [];
  const r = await runBackup({ env: envFor(c), store, pgBin: PG, serverBin: SERVER, log: l => lines.push(l), ...extra });
  return { ...r, lines, markers: lines.map(l => l.split(' ')[0]) };
};

test('backup and restore, end to end, with every failure mode', { skip, timeout: 600000 }, async t => {
  const work = await mkdtemp(path.join(tmpdir(), 'rz-e2e-'));
  const store = dirStore(path.join(work, 'store'));
  const source = await buildSource();
  try {
    let good;
    await t.test('a complete backup is created, re-read, restored and identical', async () => {
      good = await backup(source, store);
      assert.deepEqual(good.markers.filter(m => /^[A-Z_]+$/.test(m)), ['BACKUP_CREATED', 'BACKUP_INTEGRITY_VERIFIED', 'RESTORE_VERIFIED', 'AUTH_RESTORE_VERIFIED', 'BACKUP_RESULT']);
      const m = good.manifest;
      assert.equal(m.status, 'COMPLETE_AND_RESTORE_VERIFIED', JSON.stringify({ c: m.coverage, r: m.restore.problems, a: m.auth.problems, e: m.restore.error }));
      assert.equal(Object.keys(m.tables).filter(t => t.startsWith('public.')).length, 21);
      assert.equal(m.tables['public.quotes'].rows, 3);
      assert.equal(m.tables['auth.users'].rows, 3);
      assert.equal(m.tables['auth.identities'].rows, 3);
      assert.equal(m.tables['supabase_migrations.schema_migrations'].rows, 14);
      assert.equal(m.migrations.applied_without_history.length, 7);
      assert.equal(m.restore.restored_rows['public.profiles'], 2);
      assert.ok(m.restore.grants_revoked_after_restore > 0, 'the nightly check reproduces the Supabase default privileges and undoes them');
      assert.equal(m.auth.counts['auth.sessions'], 1);
      assert.ok(m.excluded.some(e => e.resource === 'Supabase Storage' && /0 bucket/.test(e.reason)), 'empty Storage checked');
      const stored = await readFile(path.join(work, 'store', good.keys.manifest), 'utf8');
      assert.ok(!/@example\.test/.test(stored), 'no email in the manifest');
      const { payload } = decryptContainer(await store.get(good.keys.blob), Buffer.from(KEY_B64, 'base64'));
      const all = Object.values(payload.files).map(f => f.content).join('\n');
      assert.ok(!all.includes('fake-refresh-token'), 'refresh tokens are not backed up');
      assert.ok(!/"auth"\."sessions"/.test(all), 'sessions are not backed up');
      assert.ok(all.includes('00000000-0000-4000-8000-000000000003'), 'auth users keep their UUID');
      assert.ok(!(await readFile(path.join(work, 'store', good.keys.blob))).includes('ana@example.test'), 'stored object is encrypted');
    });

    const archive = async () => {
      const { payload } = decryptContainer(await store.get(good.keys.blob), Buffer.from(KEY_B64, 'base64'));
      return { files: Object.fromEntries(Object.entries(payload.files).map(([n, f]) => [n, f.content])), fp: payload.meta.source_fingerprint };
    };
    const dropLine = (text, re) => { const l = text.split('\n'); const i = l.findIndex(x => re.test(x)); assert.ok(i >= 0, String(re)); l.splice(i, 1); return l.join('\n'); };
    const tampered = async (mutate) => {
      const a = await archive(); mutate(a.files);
      return verifyByEphemeralRestore({ files: a.files, sourceFingerprint: a.fp, pgBin: PG, serverBin: SERVER });
    };
    const problems = r => [...(r.restore.problems || []), ...(r.auth.problems || [])].join('\n');

    await t.test('missing rows, extra rows and broken relations are detected', async () => {
      let r = await tampered(f => { f['app-data.sql'] = dropLine(f['app-data.sql'], /^30000000-0000-4000-8000-000000000003\t/); });
      assert.equal(r.restore.verified, false); assert.match(problems(r), /public.quotes: missing rows: 3 in backup source, 2 restored/);
      assert.match(problems(r), /quote_id_fkey: 1 orphan row|orphan row/);
      r = await tampered(f => { f['app-data.sql'] += `\nINSERT INTO public.feedback_insights (category) VALUES ('extra');\n`; });
      assert.match(problems(r), /public.feedback_insights: extra rows: 1 in backup source, 2 restored/);
      r = await tampered(f => { f['app-data.sql'] = f['app-data.sql'].replace('Salle de bain', 'Salle de bains'); });
      assert.match(problems(r), /public.quotes: same row count but content fingerprint differs/);
    });

    await t.test('a missing function, index or constraint is detected', async () => {
      const r = await tampered(f => {
        f['schema.sql'] += `\nDO $x$ begin execute (select 'drop function '||oid::regprocedure from pg_proc where proname='skip_weekend'); end $x$;
          drop index public.quotes_user_id_idx; alter table public.followups drop constraint followups_status_check;\n`;
      });
      const p = problems(r);
      assert.match(p, /public.skip_weekend\(.*\): missing function/);
      assert.match(p, /public.quotes_user_id_idx: missing index/);
      assert.match(p, /public.followups:followups_status_check: missing constraint/);
    });

    await t.test('incomplete Auth is detected separately from application data', async () => {
      let r = await tampered(f => { f['auth-data.sql'] = dropLine(f['auth-data.sql'], /^g-123456\t/); });
      assert.equal(r.auth.verified, false); assert.match(problems(r), /auth.identities: missing rows/);
      r = await tampered(f => { f['auth-data.sql'] = dropLine(f['auth-data.sql'], /^\\N\t00000000-0000-4000-8000-000000000002\t/); });
      assert.equal(r.auth.verified, false); assert.match(problems(r), /profiles without a matching auth user|auth_user_ids_sha256/);
    });

    await t.test('a corrupted stored object is caught before any restore', async () => {
      const bad = { ...store, get: async k => { const b = Buffer.from(await store.get(k)); if (k.endsWith('.rzbk2')) b[40] ^= 1; return b; } };
      const r = await backup(source, bad);
      assert.equal(r.manifest.status, 'CREATED_INTEGRITY_NOT_VERIFIED');
      assert.ok(r.markers.includes('BACKUP_INTEGRITY_FAILED'));
      assert.ok(!r.markers.includes('RESTORE_VERIFIED'));
      assert.match(JSON.stringify(r.manifest.integrity), /STORED_SHA256_MISMATCH/);
    });

    await t.test('restore: refused on a non-empty target or the source itself, works on an empty Supabase-like project', async () => {
      const base = { BACKUP_ENCRYPTION_KEY_B64: KEY_B64, RESTORE_BACKUP_KEY: good.keys.blob, RESTORE_ALLOW_NON_SUPABASE_TARGET: '1', RESTORE_TARGET_PROJECT_REF: 'testtargettesttarget', RESTORE_CONFIRM: 'restore-into:testtargettesttarget' };
      const quiet = () => {};
      let r = await runRestore({ env: { ...base, RUN_RESTORE: 'true' }, store, pgBin: PG, log: quiet });
      assert.equal(r.ok, false); assert.match(r.reasons.join(), /RESTORE_TARGET_DB_URL missing/);
      r = await runRestore({ env: { ...base, RESTORE_TARGET_DB_URL: urlOf(source), RESTORE_MODE: 'apply' }, store, pgBin: PG, log: quiet });
      assert.equal(r.ok, false); assert.match(r.reasons.join('\n'), /already has 21 table/); assert.match(r.reasons.join('\n'), /IS the source database/);
      assert.equal((await sql(source, 'select count(*) from public.quotes')).trim(), '3', 'source untouched');
      const target = await startEphemeralCluster({ pgBin: PG, serverBin: SERVER });
      try {
        for (const f of ['ops/backup/sql/ephemeral-bootstrap.sql', 'ops/backup/sql/supabase-default-privileges.sql', 'ops/backup/sql/auth-structure-reference.sql']) await psqlFile({ conn: target.conn, pgBin: PG, sql: await readFile(path.join(ROOT, f), 'utf8') });
        const env = { ...base, RESTORE_TARGET_DB_URL: urlOf(target) };
        r = await runRestore({ env, store, pgBin: PG, log: quiet });
        assert.equal(r.dryRun, true, JSON.stringify(r)); assert.equal((await sql(target, `select count(*) from pg_tables where schemaname='public'`)).trim(), '0', 'dry run writes nothing');
        const logged = [];
        r = await runRestore({ env: { ...env, RESTORE_MODE: 'apply' }, store, pgBin: PG, log: l => logged.push(l) });
        assert.equal(r.ok, true, JSON.stringify(r.problems));
        // Supabase default privileges were undone: same grants as the source, nothing more for anon.
        assert.match(logged.join('\n'), /RESTORE_SCHEMA_SEALED/);
        assert.match(logged.join('\n'), /RESTORE_SCHEMA_REOPENED/);
        assert.equal((await sql(target, "select has_schema_privilege('anon','public','USAGE')")).trim(), 't',
          'original schema USAGE restored only after a verified restore');
        assert.match(logged.join('\n'), /RESTORE_STEP_DONE \{"step":"grants","revoked":[1-9]\d*\}/);
        assert.equal((await sql(target, `select has_table_privilege('anon','public.quotes','select')::text || has_function_privilege('anon','public.create_quote_with_quota(uuid,integer,text,text,text,numeric,date,text,boolean,integer,text,timestamptz,text,text)','execute')::text`)).trim(), 'falsefalse');
        assert.equal((await sql(target, `select has_table_privilege('authenticated','public.quotes','select')::text || has_table_privilege('authenticated','public.quotes','delete')::text`)).trim(), 'truefalse');
        assert.equal((await sql(target, `select count(*) from auth.users u join public.profiles p on p.id=u.id`)).trim(), '2');
        assert.equal((await sql(target, `select count(*) from auth.users`)).trim(), '3');
        r = await runRestore({ env: { ...env, RESTORE_MODE: 'apply' }, store, pgBin: PG, log: quiet });
        assert.equal(r.ok, false, 'a second restore into the same target is refused'); assert.match(r.reasons.join(), /nothing is ever dropped/);
      } finally { await target.stop(); }
    });

    await t.test('legacy RZBK1 backup: decrypted, loaded and compared, and its gaps reported', async () => {
      const LEGACY = ['profiles', 'prospects', 'quotes', 'followups', 'product_events', 'system_events', 'lifecycle_messages', 'support_tickets', 'trial_events', 'suppressions', 'outreach_events', 'outreach_queue', 'feedback_insights', 'stripe_webhook_events'];
      const data = {};
      for (const tbl of LEGACY) data[tbl] = JSON.parse((await sql(source, `set timezone='UTC'; select coalesce(jsonb_agg(to_jsonb(x)), '[]')::text from public.${tbl} x`)).trim().split('\n').pop());
      const payload = { format: 'relanzio-application-backup-v1', auth: { covered: false }, data };
      const key = Buffer.from(KEY_B64, 'base64'), iv = randomBytes(12), c = createCipheriv('aes-256-gcm', key, iv);
      const body = Buffer.concat([c.update(gzipSync(Buffer.from(JSON.stringify(payload)))), c.final()]);
      const blob = Buffer.concat([Buffer.from('RZBK1'), iv, c.getAuthTag(), body]);
      await store.put('daily/relanzio-20261105T021954030Z.rzbk', blob);
      await store.put('daily/relanzio-20261105T021954030Z.manifest.json', Buffer.from(JSON.stringify({ sha256: sha256(blob), size_bytes: blob.length, counts: Object.fromEntries(LEGACY.map(x => [x, data[x].length])) })));
      const r = await verifyStoredBackup({ store, key: 'daily/relanzio-20261105T021954030Z.rzbk', env: { BACKUP_ENCRYPTION_KEY_B64: KEY_B64 }, pgBin: PG, serverBin: SERVER, log: () => {}, repo: ROOT });
      assert.equal(r.integrity, true); assert.equal(r.ok, false);
      assert.equal(r.legacy.data_restore_ok, true, r.legacy.problems.join('\n'));
      assert.equal(r.legacy.tables.quotes.restored, 3); assert.equal(r.legacy.tables.quotes.rows_not_identical, 0);
      assert.deepEqual(r.legacy.missing_tables.sort(), ['digest_sends', 'followup_optouts', 'outreach_candidates', 'outreach_daily_slots', 'prospect_tombstones', 'quote_replies', 'sales_followups']);
      assert.equal(r.legacy.auth_covered, false);
      assert.ok(r.legacy.orphans.some(o => /profiles_id_fkey/.test(o)), 'profiles point to auth users absent from a legacy backup');
      const wrongKey = await verifyStoredBackup({ store, key: 'daily/relanzio-20261105T021954030Z.rzbk', env: { BACKUP_ENCRYPTION_KEY_B64: Buffer.alloc(32, 1).toString('base64') }, pgBin: PG, log: () => {} }).catch(e => e);
      assert.match(String(wrongKey), /BACKUP_DECRYPT_FAILED/);
    });

    await t.test('coverage: a table in a new schema or durable Auth data makes the backup INCOMPLETE', async () => {
      await sql(source, `create schema crm; create table crm.notes(id int primary key); insert into crm.notes values (1); insert into auth.mfa_factors values (gen_random_uuid(), '00000000-0000-4000-8000-000000000001');
        insert into storage.buckets values ('invoices', 'invoices'); insert into storage.objects (bucket_id, name) values ('invoices', 'a.pdf')`);
      const r = await backup(source, store);
      assert.equal(r.manifest.status, 'INCOMPLETE');
      assert.match(r.manifest.coverage.failures.join('\n'), /schema "crm" has 1 table/);
      assert.match(r.manifest.coverage.failures.join('\n'), /auth.mfa_factors holds 1 row/);
      assert.match(r.manifest.coverage.failures.join('\n'), /Storage holds 1 bucket\(s\) \/ 1 object/);
      assert.equal(r.pruned.length, 0, 'no retention after an incomplete backup');
    });
  } finally {
    await source.stop();
    await rm(work, { recursive: true, force: true });
  }
});
