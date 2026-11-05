import test from 'node:test';
import assert from 'node:assert/strict';
import { checkRestoreRequest, checkSourceUrl, checkTargetIsEmpty, parseDbUrl, pgEnv, redact, supabaseRefOf } from '../ops/backup/lib/guards.mjs';

const PROD = 'uwgvnhnpvxoebabayqac';
const NEW = 'abcdefghijklmnopqrst';
const ok = (over = {}) => ({
  RESTORE_TARGET_DB_URL: `postgresql://postgres.${NEW}:pw-target@aws-0-eu-west-3.pooler.supabase.com:5432/postgres`,
  RESTORE_TARGET_PROJECT_REF: NEW, RESTORE_CONFIRM: `restore-into:${NEW}`, ...over
});

test('restore is impossible by default, and RUN_RESTORE=true alone does nothing', () => {
  for (const env of [{}, { RUN_RESTORE: 'true' }, { RUN_RESTORE: 'true', RESTORE_DB_URL: 'postgresql://x:y@db.abcdefghijklmnopqrst.supabase.co:5432/postgres' }]) {
    const r = checkRestoreRequest(env);
    assert.equal(r.ok, false);
    assert.match(r.reasons.join('\n'), /RESTORE_TARGET_DB_URL missing/);
  }
});

test('a complete, explicit request for a new project passes the static checks', () => {
  const r = checkRestoreRequest(ok());
  assert.deepEqual(r.reasons, []);
  assert.equal(r.ok, true);
});

test('the confirmation must name the target exactly', () => {
  assert.equal(checkRestoreRequest(ok({ RESTORE_CONFIRM: 'yes' })).ok, false);
  assert.equal(checkRestoreRequest(ok({ RESTORE_CONFIRM: `restore-into:${PROD}` })).ok, false);
});

test('production is refused whatever the way it is named', () => {
  const cases = [
    ok({ RESTORE_TARGET_PROJECT_REF: PROD, RESTORE_CONFIRM: `restore-into:${PROD}` }),
    ok({ RESTORE_TARGET_DB_URL: `postgresql://postgres:pw@db.${PROD}.supabase.co:5432/postgres` }),
    ok({ RESTORE_TARGET_DB_URL: `postgresql://postgres.${PROD}:pw@aws-0-eu-west-3.pooler.supabase.com:5432/postgres` }),
    ok({ RESTORE_TARGET_DB_URL: `postgresql://postgres:pw@${PROD.toUpperCase()}.supabase.co:5432/postgres` }),
    ok({ RESTORE_TARGET_DB_URL: 'postgresql://postgres:pw@10.0.0.5:5432/postgres?application_name=uwgvnhnpvxoebabayqac', RESTORE_ALLOW_NON_SUPABASE_TARGET: '1' })
  ];
  for (const env of cases) {
    const r = checkRestoreRequest(env);
    assert.equal(r.ok, false, JSON.stringify(env));
    assert.match(r.reasons.join('\n'), /PRODUCTION/);
  }
});

test('the target cannot be the backup source, even under another name', () => {
  const src = 'postgresql://postgres.abcdefghijklmnopqrst:pw@aws-0-eu-west-3.pooler.supabase.com:5432/postgres';
  const r = checkRestoreRequest(ok({ BACKUP_SOURCE_DB_URL: src, RESTORE_TARGET_DB_URL: src.replace(':pw@', ':other@') }));
  assert.equal(r.ok, false);
  assert.match(r.reasons.join('\n'), /same database as BACKUP_SOURCE_DB_URL/);
});

test('declared ref and actual host must agree; plain Postgres needs an explicit flag', () => {
  const r = checkRestoreRequest(ok({ RESTORE_TARGET_DB_URL: 'postgresql://postgres.zzzzzzzzzzzzzzzzzzzz:pw@aws-0-eu-west-3.pooler.supabase.com:5432/postgres' }));
  assert.equal(r.ok, false); assert.match(r.reasons.join('\n'), /not the declared/);
  const plain = ok({ RESTORE_TARGET_DB_URL: 'postgresql://postgres:pw@localhost:5432/postgres' });
  assert.equal(checkRestoreRequest(plain).ok, false);
  assert.equal(checkRestoreRequest({ ...plain, RESTORE_ALLOW_NON_SUPABASE_TARGET: '1' }).ok, true);
});

test('live checks: a non-empty target, the source cluster itself or a non-Supabase target are refused', () => {
  const manifest = { source: { system_identifier: '7400000000000000001' } };
  assert.equal(checkTargetIsEmpty({ public_tables: 0, auth_users: 0, system_identifier: '7499', in_recovery: false }, manifest).ok, true);
  assert.match(checkTargetIsEmpty({ public_tables: 21, auth_users: 0 }, manifest).reasons.join(), /nothing is ever dropped/);
  assert.match(checkTargetIsEmpty({ public_tables: 0, auth_users: 13 }, manifest).reasons.join(), /auth user/);
  assert.match(checkTargetIsEmpty({ public_tables: 0, auth_users: null }, manifest).reasons.join(), /not a Supabase project/);
  assert.match(checkTargetIsEmpty({ public_tables: 0, auth_users: 0, system_identifier: '7400000000000000001' }, manifest).reasons.join(), /IS the source database/);
  assert.match(checkTargetIsEmpty({ public_tables: 0, auth_users: 0, in_recovery: true }, manifest).reasons.join(), /replica/);
});

test('connection parsing, refs, and the transaction pooler is rejected for backups', () => {
  const c = parseDbUrl('postgresql://postgres.abcdefghijklmnopqrst:p%40ss@aws-0-eu-west-3.pooler.supabase.com:5432/postgres?sslmode=require');
  assert.equal(c.password, 'p@ss'); assert.equal(c.sslmode, 'require');
  assert.equal(supabaseRefOf(c), 'abcdefghijklmnopqrst');
  assert.equal(supabaseRefOf(parseDbUrl(`postgresql://postgres:x@db.${PROD}.supabase.co:5432/postgres`)), PROD);
  assert.equal(parseDbUrl('postgresql://postgres@localhost/postgres?host=/tmp/sock').host, '/tmp/sock');
  assert.throws(() => checkSourceUrl('postgresql://u:p@aws-0-eu-west-3.pooler.supabase.com:6543/postgres'), /transaction pooler/);
  assert.throws(() => parseDbUrl('https://example.test'), /DB_URL_INVALID/);
  const env = pgEnv(c, { PATH: '/bin', DATABASE_URL: 'postgresql://secret', BACKUP_SOURCE_DB_URL: 'x' });
  assert.equal(env.PGPASSWORD, 'p@ss'); assert.equal(env.DATABASE_URL, undefined); assert.equal(env.BACKUP_SOURCE_DB_URL, undefined);
});

test('secrets never reach a log line', () => {
  const line = redact('could not connect postgresql://postgres.abc:SuperSecret1@host:5432/db password=hunter22 key eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZSJ9.abcdefghijkl', ['MyKeyValue']);
  assert.ok(!line.includes('SuperSecret1')); assert.ok(!line.includes('hunter22')); assert.ok(!line.includes('eyJhbGci'));
  assert.equal(redact('the MyKeyValue leaked', ['MyKeyValue']), 'the [redacted] leaked');
});

test('the backup job refuses a source connection that is not the declared project', async () => {
  const { runBackup } = await import('../ops/backup/backup.mjs');
  const key = Buffer.alloc(32, 1).toString('base64');
  const base = { BACKUP_ENCRYPTION_KEY_B64: key, BACKUP_SOURCE_PROJECT_REF: 'uwgvnhnpvxoebabayqac' };
  await assert.rejects(runBackup({ env: { ...base, BACKUP_SOURCE_DB_URL: 'postgresql://postgres.abcdefghijklmnopqrst:pw@aws-0-eu-west-3.pooler.supabase.com:5432/postgres' }, store: {} }), /points to project abcdefghijklmnopqrst/);
  await assert.rejects(runBackup({ env: { ...base, BACKUP_SOURCE_DB_URL: 'postgresql://postgres:pw@10.1.2.3:5432/postgres' }, store: {} }), /not a Supabase connection string/);
  await assert.rejects(runBackup({ env: { ...base, BACKUP_SOURCE_DB_URL: 'postgresql://postgres.uwgvnhnpvxoebabayqac:pw@aws-0-eu-west-3.pooler.supabase.com:6543/postgres' }, store: {} }), /transaction pooler/);
  await assert.rejects(runBackup({ env: { BACKUP_SOURCE_DB_URL: 'postgresql://x' }, store: {} }), /MISSING_ENV/);
});
