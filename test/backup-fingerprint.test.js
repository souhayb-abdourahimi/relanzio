import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogSql, compareFingerprints, contentSql, orphanSql } from '../ops/backup/lib/fingerprint.mjs';

const base = () => ({
  catalog: {
    tables: ['auth.users', 'public.profiles', 'public.quotes'], sequences: ['public.system_events_id_seq'],
    columns: { 'public.quotes': 'id uuid not null, user_id uuid not null' },
    constraints: { 'public.quotes:quotes_pkey': 'PRIMARY KEY (id)', 'public.quotes:quotes_user_id_fkey': 'FOREIGN KEY (user_id) REFERENCES profiles(id)' },
    indexes: { 'public.quotes_user_id_idx': 'CREATE INDEX quotes_user_id_idx ON public.quotes USING btree (user_id)' },
    functions: { 'public.create_quote_with_quota(p jsonb)': 'aaa' },
    triggers: { 'public.quotes:t_touch': 'CREATE TRIGGER t_touch ...' },
    policies: { 'public.quotes:quotes_owner': 'PERMISSIVE | SELECT | authenticated | (auth.uid() = user_id)' },
    rls: { 'public.quotes': 'enabled' }, views: {}, enums: {},
    grants: ['public.quotes:authenticated:SELECT']
  },
  content: { tables: { 'auth.users': { rows: 3, sha256: 'u1' }, 'public.profiles': { rows: 2, sha256: 'p1' }, 'public.quotes': { rows: 3, sha256: 'q1' } },
    sequences: { 'public.system_events_id_seq': { last_value: '3', is_called: true } } },
  orphans: { 'public.quotes:quotes_user_id_fkey': 0 },
  authLink: { auth_users_without_profile: 1, profiles_without_auth_user: 0, identities_without_user: 0, auth_user_ids_sha256: 'ids' }
});
const clone = x => JSON.parse(JSON.stringify(x));

test('identical fingerprints: restore verified', () => {
  assert.deepEqual(compareFingerprints(base(), base()), { ok: true, diffs: [] });
});

test('every kind of loss or corruption is named', () => {
  const cases = [
    [r => { r.catalog.tables = r.catalog.tables.filter(t => t !== 'public.quotes'); delete r.content.tables['public.quotes']; }, /public.quotes: missing table/],
    [r => { r.content.tables['public.quotes'].rows = 2; }, /missing rows: 3 in backup source, 2 restored/],
    [r => { r.content.tables['public.quotes'].rows = 4; }, /extra rows: 3 in backup source, 4 restored/],
    [r => { r.content.tables['public.quotes'].sha256 = 'other'; }, /same row count but content fingerprint differs/],
    [r => { r.catalog.indexes = {}; }, /missing index/],
    [r => { r.catalog.functions = {}; }, /missing function/],
    [r => { r.catalog.functions['public.create_quote_with_quota(p jsonb)'] = 'bbb'; }, /function differs/],
    [r => { delete r.catalog.constraints['public.quotes:quotes_user_id_fkey']; }, /missing constraint/],
    [r => { r.catalog.triggers = {}; }, /missing trigger/],
    [r => { r.catalog.policies = {}; }, /missing policy/],
    [r => { r.catalog.rls['public.quotes'] = 'disabled'; }, /RLS setting differs/],
    [r => { r.catalog.grants = []; }, /missing grant/],
    [r => { r.catalog.grants.push('public.quotes:anon:DELETE'); }, /unexpected grant/],
    [r => { r.content.sequences['public.system_events_id_seq'].last_value = '1'; }, /sequence value differs/],
    [r => { r.orphans['public.quotes:quotes_user_id_fkey'] = 2; }, /2 orphan row/],
    [r => { r.authLink.auth_user_ids_sha256 = 'other'; }, /auth_user_ids_sha256/],
    [r => { r.authLink.profiles_without_auth_user = 1; }, /profiles without a matching auth user/],
    [r => { r.content.tables['auth.users'].rows = 0; }, /auth.users: missing rows/]
  ];
  for (const [mutate, expected] of cases) {
    const restored = clone(base()); mutate(restored);
    const r = compareFingerprints(base(), restored);
    assert.equal(r.ok, false, String(expected));
    assert.match(r.diffs.map(d => `${d.object}: ${d.problem}`).join('\n'), expected);
  }
});

test('generated SQL quotes identifiers and covers sequences and every foreign key', () => {
  const sql = contentSql(['public.quotes', 'auth.users'], ['public.system_events_id_seq']);
  assert.match(sql, /from "public"."quotes" x/); assert.match(sql, /from "auth"."users" x/); assert.match(sql, /last_value::text/);
  assert.match(sql, /order by md5\(x::text\)/);
  const o = orphanSql([{ name: 'public.quotes:fk', child: 'public.quotes', child_cols: ['user_id'], parent: 'public.profiles', parent_cols: ['id'] }]);
  assert.match(o, /c\."user_id" is not null and not exists \(select 1 from "public"."profiles" p where p\."id" = c\."user_id"\)/);
  assert.match(catalogSql({ schemas: ['public'], extraTables: ["auth.users"] }), /array\['auth.users'\]::text\[\]/);
  assert.match(catalogSql({ schemas: ["pub'lic"], extraTables: [] }), /'pub''lic'/);
});
