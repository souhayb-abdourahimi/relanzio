import test from 'node:test';
import assert from 'node:assert/strict';
import { assertNoPersonalData, backupKeys, buildManifest, overallStatus, parisTime } from '../ops/backup/lib/manifest.mjs';
import { planRetention } from '../ops/backup/lib/retention.mjs';

const input = (over = {}) => ({
  at: '2026-11-06T01:15:00.123Z',
  source: { project_ref: 'uwgvnhnpvxoebabayqac', server_version: '17.6', server_version_num: 170006, system_identifier: '7400000000000000001' },
  blob: { key: 'v2/daily/relanzio-20261106T011500123Z.rzbk2', size: 120000, sha256: 'a'.repeat(64) },
  coverage: { ok: true, failures: [], warnings: [], excluded: [{ resource: 'auth.sessions', reason: 'never restored (security)', rows: 12 }] },
  migrations: { ok: true, history_entries: 14, repository_files: 21, recorded: 14, applied_without_history: ['20261029100000_quote_replies.sql'] },
  content: { tables: { 'public.profiles': { rows: 12, sha256: 'p' }, 'auth.users': { rows: 13, sha256: 'u' }, 'auth.identities': { rows: 13, sha256: 'i' } }, sequences: {} },
  catalog: { tables: ['public.profiles'], columns: {}, constraints: {}, indexes: {}, functions: {}, triggers: {}, policies: {}, sequences: [], views: {}, grants: [] },
  authCounts: { 'auth.users': 13, 'auth.sessions': 12 },
  integrity: { verified: true }, restore: { verified: true }, auth: { verified: true, problems: [] }, retentionDays: 30, tooling: { pg_dump: 'pg_dump (PostgreSQL) 17.6' },
  ...over
});

test('the manifest carries every required field', () => {
  const m = buildManifest(input());
  for (const k of ['created_at_utc', 'created_at_europe_paris', 'format_version', 'sha256', 'size_bytes', 'tables', 'migrations', 'auth', 'excluded', 'integrity', 'restore', 'retention_days'])
    assert.ok(k in m, k);
  assert.equal(m.source.postgres_version, '17.6');
  assert.equal(m.source.supabase_project_ref, 'uwgvnhnpvxoebabayqac');
  assert.match(m.created_at_europe_paris, /^2026-11-06 02:15:00 (CET|UTC\+1|GMT\+1)$/);
  assert.equal(m.tables['public.profiles'].rows, 12);
  assert.equal(m.auth.sessions_and_tokens_restored, false);
  assert.deepEqual(m.auth.covered_tables, ['auth.users', 'auth.identities']);
  assert.equal(m.status, 'COMPLETE_AND_RESTORE_VERIFIED');
});

test('a partial backup is never presented as complete', () => {
  assert.equal(buildManifest(input({ coverage: { ok: false, failures: ['x'], warnings: [], excluded: [] } })).status, 'INCOMPLETE');
  assert.equal(buildManifest(input({ restore: { verified: false } })).status, 'RESTORE_NOT_VERIFIED');
  assert.equal(buildManifest(input({ auth: { verified: false, problems: ['p'] } })).status, 'AUTH_RESTORE_NOT_VERIFIED');
  assert.equal(buildManifest(input({ integrity: { verified: false } })).status, 'CREATED_INTEGRITY_NOT_VERIFIED');
  assert.equal(overallStatus({ backup_created: false }), 'FAILED');
});

test('no email or secret can be written into a manifest', () => {
  assert.throws(() => buildManifest(input({ coverage: { ok: true, failures: [], warnings: ['client@example.test leaked'], excluded: [] } })), /MANIFEST_CONTAINS_EMAIL/);
  assert.throws(() => assertNoPersonalData({ e: 'postgresql://postgres:hunter2@db.x.supabase.co:5432/postgres' }), /MANIFEST_CONTAINS_SECRET/);
  assert.throws(() => assertNoPersonalData({ e: 'sk_live_abc' }), /MANIFEST_CONTAINS_SECRET/);
  assert.ok(assertNoPersonalData(buildManifest(input())));
});

test('object names and Paris time', () => {
  assert.deepEqual(backupKeys('2026-11-05T02:19:54.030Z'), { blob: 'v2/daily/relanzio-20261105T021954030Z.rzbk2', manifest: 'v2/daily/relanzio-20261105T021954030Z.manifest.json' });
  assert.match(parisTime('2026-07-01T00:00:00Z'), /^2026-07-01 02:00:00 (CEST|UTC\+2|GMT\+2)$/);
});

const day = d => `2026-${String(Math.floor(d / 31) + 9).padStart(2, '0')}-${String((d % 31) + 1).padStart(2, '0')}`;
const objectsFor = days => days.flatMap(d => {
  const s = day(d).replace(/-/g, '') + 'T021500000Z';
  return [{ key: `v2/daily/relanzio-${s}.rzbk2` }, { key: `v2/daily/relanzio-${s}.manifest.json` }];
});

test('retention: 30 days, but always 7 backups and always the last verified one', () => {
  const objects = [...objectsFor([0, 1, 2, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]), { key: 'daily/relanzio-20260901T021954030Z.rzbk' }];
  const now = new Date('2026-11-25T03:00:00Z');
  const del = planRetention({ objects, now, retentionDays: 30, verified: new Set(['20260902T021500000Z']) });
  assert.ok(!del.some(k => k.startsWith('daily/')), 'legacy objects are never touched');
  assert.ok(del.includes('v2/daily/relanzio-20260901T021500000Z.rzbk2'));
  assert.ok(!del.some(k => k.includes('20260902T021500000Z')), 'last verified backup kept even when old');
  assert.ok(del.length % 2 === 0, 'backup and manifest go together');
  // Old backups only, nothing recent: the 7 newest stay.
  const onlyOld = objectsFor([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const del2 = planRetention({ objects: onlyOld, now: new Date('2027-03-01T00:00:00Z'), retentionDays: 30 });
  assert.equal(del2.length, 3 * 2);
  assert.throws(() => planRetention({ objects: [], now, retentionDays: 1 }), /RETENTION_DAYS_TOO_LOW/);
});
