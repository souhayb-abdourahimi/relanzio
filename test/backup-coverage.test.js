import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { AUTH_EXCLUDED, AUTH_INCLUDED, evaluateCoverage, evaluateMigrations } from '../ops/backup/lib/coverage.mjs';

// Shape of the production inventory on 2026-11-05 (counts only).
const AUTH_TABLES = ['audit_log_entries', 'custom_oauth_providers', 'flow_state', 'identities', 'instances', 'mfa_amr_claims', 'mfa_challenges', 'mfa_factors',
  'mfa_recovery_code_sets', 'mfa_recovery_codes', 'oauth_authorizations', 'oauth_client_states', 'oauth_clients', 'oauth_consents', 'one_time_tokens',
  'refresh_tokens', 'saml_providers', 'saml_relay_states', 'schema_migrations', 'scim_tokens', 'scim_users', 'sessions', 'sso_domains', 'sso_providers',
  'users', 'webauthn_challenges', 'webauthn_credentials'].map(t => `auth.${t}`);
const PUBLIC = ['digest_sends', 'feedback_insights', 'followup_optouts', 'followups', 'lifecycle_messages', 'outreach_candidates', 'outreach_daily_slots',
  'outreach_events', 'outreach_queue', 'product_events', 'profiles', 'prospect_tombstones', 'prospects', 'quote_replies', 'quotes', 'sales_followups',
  'stripe_webhook_events', 'support_tickets', 'suppressions', 'system_events', 'trial_events'].map(t => `public.${t}`);
const prodInventory = () => ({
  schemas: { auth: 27, extensions: 0, graphql: 0, graphql_public: 0, pgbouncer: 0, public: 21, realtime: 3, storage: 8, supabase_migrations: 1, vault: 1 },
  auth_tables: Object.fromEntries(AUTH_TABLES.map(t => [t, 0])),
  storage_buckets: 0, storage_objects: 0, vault_secrets: 0, cron_jobs: null, realtime_publication_tables: [],
  roles: ['anon', 'authenticated', 'authenticator', 'dashboard_user', 'pgbouncer', 'postgres', 'service_role', 'supabase_admin', 'supabase_auth_admin']
});
const prodAuthCounts = () => ({ ...Object.fromEntries(AUTH_TABLES.map(t => [t, 0])), 'auth.users': 13, 'auth.identities': 13, 'auth.sessions': 12, 'auth.refresh_tokens': 14, 'auth.mfa_amr_claims': 12, 'auth.one_time_tokens': 1, 'auth.schema_migrations': 82 });

test('production as observed: complete coverage, sessions and tokens excluded with a reason', () => {
  const r = evaluateCoverage({ inventory: prodInventory(), authCounts: prodAuthCounts(), appTables: PUBLIC });
  assert.deepEqual(r.failures, []);
  assert.equal(r.ok, true);
  for (const t of ['auth.sessions', 'auth.refresh_tokens']) assert.ok(r.excluded.find(e => e.resource === t && /never restored/.test(e.reason)), t);
  assert.ok(r.excluded.find(e => e.resource === 'Supabase Storage'));
  assert.deepEqual(AUTH_INCLUDED, ['auth.users', 'auth.identities']);
  for (const t of AUTH_TABLES) assert.ok(AUTH_INCLUDED.includes(t) || AUTH_EXCLUDED[t], `${t} is classified`);
});

test('a table in a new schema, Storage files, Vault secrets or a custom role make the backup incomplete', () => {
  const cases = [
    [i => { i.schemas.crm = 2; }, /schema "crm" has 2 table/],
    [i => { i.storage_buckets = 1; i.storage_objects = 40; }, /Storage holds 1 bucket/],
    [i => { i.vault_secrets = 2; }, /Vault holds 2 secret/],
    [i => { i.roles.push('reporting_reader'); }, /custom database role.*reporting_reader/],
    [i => { i.cron_jobs = 3; }, /pg_cron holds 3 job/],
    [i => { delete i.auth_tables['auth.identities']; }, /auth.identities not found/]
  ];
  for (const [mutate, expected] of cases) {
    const inv = prodInventory(); mutate(inv);
    const r = evaluateCoverage({ inventory: inv, authCounts: prodAuthCounts(), appTables: PUBLIC });
    assert.equal(r.ok, false, String(expected));
    assert.match(r.failures.join('\n'), expected);
  }
});

test('Auth: durable excluded data or an unclassified Auth table with rows is never silently skipped', () => {
  const counts = { ...prodAuthCounts(), 'auth.mfa_factors': 2 };
  let r = evaluateCoverage({ inventory: prodInventory(), authCounts: counts, appTables: PUBLIC });
  assert.equal(r.ok, false); assert.match(r.failures.join(), /auth.mfa_factors holds 2/);
  const inv = prodInventory(); inv.auth_tables['auth.passkeys_v2'] = 0;
  r = evaluateCoverage({ inventory: inv, authCounts: { ...prodAuthCounts(), 'auth.passkeys_v2': 5 }, appTables: PUBLIC });
  assert.equal(r.ok, false); assert.match(r.failures.join(), /new Auth table holding 5/);
  r = evaluateCoverage({ inventory: inv, authCounts: prodAuthCounts(), appTables: PUBLIC });
  assert.equal(r.ok, true); assert.match(r.warnings.join(), /new, empty Auth table/);
});

const HISTORY = [['20261001231145', 'relanzio_v04_staging_schema'], ['20261002141214', 'stripe_webhook_idempotency'], ['20261004113109', 'request_idempotency_hardening'],
  ['20261013223553', 'pro_trial_7d'], ['20261013224205', 'outreach_queue'], ['20261013224303', 'prospect_sector'], ['20261014221647', 'quote_schedule_and_checkout_claim'],
  ['20261014222310', 'rls_explicit_authenticated_reads'], ['20261014223942', 'atomic_quote_quota'], ['20261014224214', 'index_missing_foreign_keys'],
  ['20261015083752', 'atomic_quote_reopen_quota'], ['20261015085331', 'stripe_event_ordering'], ['20261016081002', 'controlled_outreach_20_safety'],
  ['20261016100553', 'imap_reply_ingestion']].map(([version, name]) => ({ version, name }));
const load = async () => ({
  map: JSON.parse(await readFile(new URL('../ops/backup/migration-map.json', import.meta.url), 'utf8')),
  repoFiles: (await readdir(new URL('../supabase/migrations/', import.meta.url))).filter(f => f.endsWith('.sql')).sort()
});

test('migrations: every repository file is reconciled with the real 14-entry production history', async () => {
  const { map, repoFiles } = await load();
  const r = evaluateMigrations({ history: HISTORY, repoFiles, map });
  assert.deepEqual(r.failures, []); assert.deepEqual(r.warnings, []);
  assert.equal(r.history_entries, 14); assert.equal(r.recorded, 14);
  assert.equal(r.applied_without_history.length, 7);
  assert.deepEqual(r.pending_deployment, ['20261112100000_scheduled_job_leases.sql']);
  assert.equal(repoFiles.length, map.files.length);
});

test('migrations: a forgotten (new, unreconciled) file, a missing history entry or an unexpected one are reported', async () => {
  const { map, repoFiles } = await load();
  let r = evaluateMigrations({ history: HISTORY, repoFiles: [...repoFiles, '20261201000000_new_feature.sql'], map });
  assert.equal(r.ok, false); assert.match(r.failures.join(), /20261201000000_new_feature.sql is not reconciled/);
  r = evaluateMigrations({ history: HISTORY.filter(h => h.version !== '20261015085331'), repoFiles, map });
  assert.equal(r.ok, false); assert.match(r.failures.join(), /20261015085331 is missing from Supabase history/);
  r = evaluateMigrations({ history: [...HISTORY, { version: '20261120000000', name: 'hotfix_from_dashboard' }], repoFiles, map });
  assert.equal(r.ok, true); assert.match(r.warnings.join(), /unexpected migration in Supabase history: 20261120000000/);
  r = evaluateMigrations({ history: HISTORY, repoFiles: repoFiles.filter(f => f !== '008_prospect_sector.sql'), map });
  assert.equal(r.ok, false); assert.match(r.failures.join(), /lists 008_prospect_sector.sql, absent/);
});
