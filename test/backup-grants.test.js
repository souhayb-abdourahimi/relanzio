import test from 'node:test';
import assert from 'node:assert/strict';
import { grantReconcileSql, parseGrant } from '../ops/backup/lib/grants.mjs';

const fn = 'public.create_quote(p_user_id uuid, p_title text)';
const catalog = grants => ({
  tables: ['public.quotes', 'auth.users'], sequences: ['public.events_id_seq'], views: { 'public.v_stats': 'x' },
  columns: { 'public.quotes': '', 'public.v_stats': '', 'auth.users': '' }, functions: { [fn]: 'md5' }, grants
});
const source = catalog(['public.quotes:authenticated:SELECT', 'public.quotes:service_role:SELECT', `${fn}:service_role:EXECUTE`, 'public.events_id_seq:anon:USAGE']);

test('parses table and function grants, including argument lists', () => {
  assert.deepEqual(parseGrant('public.quotes:anon:SELECT'), { object: 'public.quotes', grantee: 'anon', privilege: 'SELECT' });
  assert.deepEqual(parseGrant(`${fn}:PUBLIC:EXECUTE`), { object: fn, grantee: 'PUBLIC', privilege: 'EXECUTE' });
  assert.throws(() => parseGrant('nonsense'), /GRANT_UNPARSABLE/);
});

test('revokes exactly what Supabase default privileges added on top of the source grants', () => {
  const restored = catalog([...source.grants, 'public.quotes:anon:SELECT', 'public.quotes:authenticated:DELETE',
    `${fn}:anon:EXECUTE`, `${fn}:PUBLIC:EXECUTE`, 'public.events_id_seq:authenticated:UPDATE', 'public.v_stats:anon:SELECT']);
  const r = grantReconcileSql(source, restored);
  assert.equal(r.revoke, 6);
  assert.deepEqual(r.sql.split('\n'), [
    'REVOKE EXECUTE ON FUNCTION "public"."create_quote"(p_user_id uuid, p_title text) FROM PUBLIC;',
    'REVOKE EXECUTE ON FUNCTION "public"."create_quote"(p_user_id uuid, p_title text) FROM "anon";',
    'REVOKE UPDATE ON SEQUENCE "public"."events_id_seq" FROM "authenticated";',
    'REVOKE SELECT ON TABLE "public"."quotes" FROM "anon";',
    'REVOKE DELETE ON TABLE "public"."quotes" FROM "authenticated";',
    'REVOKE SELECT ON TABLE "public"."v_stats" FROM "anon";'
  ]);
});

test('never grants, never touches auth, unknown roles or unknown objects', () => {
  const restored = catalog(['public.quotes:service_role:SELECT', 'auth.users:anon:SELECT', 'public.quotes:postgres:SELECT',
    'public.gone:anon:SELECT', 'public.quotes:anon:SELECT; DROP']);
  const r = grantReconcileSql(source, restored);
  assert.equal(r.sql, '', 'missing source grants are not added back: they stay reported differences');
  assert.equal(r.revoke, 0);
  assert.deepEqual(r.skipped.sort(), ['auth.users:anon:SELECT', 'public.gone:anon:SELECT', 'public.quotes:anon:SELECT; DROP', 'public.quotes:postgres:SELECT']);
});

test('identical grants: nothing to do', () => {
  assert.deepEqual(grantReconcileSql(source, catalog([...source.grants])), { sql: '', revoke: 0, skipped: [] });
});

test('quoted identifiers cannot break out of the statement', () => {
  const evil = catalog(['public.a"b:anon:SELECT']); evil.tables.push('public.a"b');
  assert.equal(grantReconcileSql(catalog([]), evil).sql, 'REVOKE SELECT ON TABLE "public"."a""b" FROM "anon";');
});
