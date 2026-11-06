// What the backup covers, what it deliberately excludes (with the reason), and the automatic coverage check
// that makes a forgotten table, a new schema, Storage objects or an unclassified Auth table fail loudly.

// Application schemas dumped in full (schema + data). Every table in them is covered automatically,
// including tables created after this file was written.
export const APP_SCHEMAS = Object.freeze(['public']);

// Supabase Auth: the official migration method (Supabase CLI `db dump --data-only`) carries auth data as plain
// rows. We keep only what a user needs to sign in again with the same UUID.
export const AUTH_INCLUDED = Object.freeze(['auth.users', 'auth.identities']);

// Excluded on purpose. `durable: true` = would be lost data if it held rows -> the backup FAILS if it is not empty.
export const AUTH_EXCLUDED = Object.freeze({
  'auth.sessions': { durable: false, reason: 'active sessions: never restored (security); users sign in again' },
  'auth.refresh_tokens': { durable: false, reason: 'refresh tokens: never restored (security); invalid with a new JWT secret anyway' },
  'auth.mfa_amr_claims': { durable: false, reason: 'per-session authentication claims, tied to sessions' },
  'auth.one_time_tokens': { durable: false, reason: 'short-lived confirmation / recovery tokens' },
  'auth.flow_state': { durable: false, reason: 'short-lived PKCE / OAuth flow state' },
  'auth.mfa_challenges': { durable: false, reason: 'short-lived MFA challenges' },
  'auth.saml_relay_states': { durable: false, reason: 'short-lived SAML relay states' },
  'auth.webauthn_challenges': { durable: false, reason: 'short-lived WebAuthn challenges' },
  'auth.oauth_authorizations': { durable: false, reason: 'short-lived OAuth authorization codes' },
  'auth.oauth_client_states': { durable: false, reason: 'short-lived OAuth client states' },
  'auth.audit_log_entries': { durable: false, reason: 'Auth audit log: history only, not needed to restore accounts' },
  'auth.schema_migrations': { durable: false, reason: 'managed by Supabase Auth itself (excluded by the official Supabase CLI dump too)' },
  'auth.instances': { durable: false, reason: 'legacy GoTrue table, unused by Supabase' },
  'auth.mfa_factors': { durable: true, reason: 'MFA is not offered by Relanzio: must stay empty' },
  'auth.mfa_recovery_code_sets': { durable: true, reason: 'MFA is not offered by Relanzio: must stay empty' },
  'auth.mfa_recovery_codes': { durable: true, reason: 'MFA is not offered by Relanzio: must stay empty' },
  'auth.webauthn_credentials': { durable: true, reason: 'passkeys are not offered by Relanzio: must stay empty' },
  'auth.sso_providers': { durable: true, reason: 'SSO is not used: must stay empty' },
  'auth.sso_domains': { durable: true, reason: 'SSO is not used: must stay empty' },
  'auth.saml_providers': { durable: true, reason: 'SAML is not used: must stay empty' },
  'auth.oauth_clients': { durable: true, reason: 'Supabase as OAuth server is not used: must stay empty' },
  'auth.oauth_consents': { durable: true, reason: 'Supabase as OAuth server is not used: must stay empty' },
  'auth.custom_oauth_providers': { durable: true, reason: 'custom OAuth providers are not used: must stay empty' },
  'auth.scim_tokens': { durable: true, reason: 'SCIM is not used: must stay empty' },
  'auth.scim_users': { durable: true, reason: 'SCIM is not used: must stay empty' }
});

// Platform-managed schemas, recreated by Supabase in any new project.
export const MANAGED_SCHEMAS = Object.freeze(['auth', 'storage', 'realtime', 'extensions', 'graphql', 'graphql_public', 'pgbouncer',
  'vault', 'pgsodium', 'pgsodium_masks', 'net', 'supabase_functions', 'cron', '_realtime', '_analytics', 'supabase_migrations',
  'information_schema', 'pgtle', 'pgmq', 'topology', 'tiger', 'tiger_data']);

export const MIGRATION_HISTORY_TABLE = 'supabase_migrations.schema_migrations';

// Read-only inventory of the source, run inside the backup snapshot.
export const INVENTORY_SQL = `select jsonb_build_object(
  'server_version', current_setting('server_version'),
  'server_version_num', current_setting('server_version_num')::int,
  'database', current_database(),
  'system_identifier', (select system_identifier::text from pg_control_system()),
  'schemas', (select coalesce(jsonb_object_agg(n.nspname, (select count(*) from pg_class c where c.relnamespace=n.oid and c.relkind in ('r','p'))), '{}')
              from pg_namespace n where n.nspname !~ '^pg_' and n.nspname <> 'information_schema'),
  'auth_tables', (select coalesce(jsonb_object_agg('auth.'||c.relname, c.reltuples), '{}') from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='auth' and c.relkind in ('r','p')),
  'extensions', (select coalesce(jsonb_object_agg(extname, extversion), '{}') from pg_extension),
  'storage_buckets', (select case when to_regclass('storage.buckets') is null then null else (xpath('/row/n/text()', query_to_xml('select count(*) n from storage.buckets', false, true, '')))[1]::text::int end),
  'storage_objects', (select case when to_regclass('storage.objects') is null then null else (xpath('/row/n/text()', query_to_xml('select count(*) n from storage.objects', false, true, '')))[1]::text::int end),
  'vault_secrets', (select case when to_regclass('vault.secrets') is null then null else (xpath('/row/n/text()', query_to_xml('select count(*) n from vault.secrets', false, true, '')))[1]::text::int end),
  'cron_jobs', (select case when to_regclass('cron.job') is null then null else (xpath('/row/n/text()', query_to_xml('select count(*) n from cron.job', false, true, '')))[1]::text::int end),
  'realtime_publication_tables', (select coalesce(jsonb_agg(schemaname||'.'||tablename order by schemaname, tablename), '[]') from pg_publication_tables where pubname='supabase_realtime'),
  'migration_history', (select case when to_regclass('supabase_migrations.schema_migrations') is null then '[]'::jsonb else
      (select coalesce(jsonb_agg(jsonb_build_object('version', v, 'name', nm) order by v), '[]') from
        (select (xpath('/row/version/text()', x))[1]::text v, (xpath('/row/name/text()', x))[1]::text nm
         from unnest(xpath('/table/row', query_to_xml('select version, name from supabase_migrations.schema_migrations', false, false, ''))) x) h) end),
  'roles', (select coalesce(jsonb_agg(rolname order by rolname), '[]') from pg_roles where rolname !~ '^pg_')
)::text`;

// Roles that exist in every Supabase project. Any other role is application-specific and must be reviewed.
export const SUPABASE_ROLES = Object.freeze(['anon', 'authenticated', 'authenticator', 'cli_login_postgres', 'dashboard_user', 'pgbouncer', 'postgres',
  'service_role', 'supabase_admin', 'supabase_auth_admin', 'supabase_etl_admin', 'supabase_functions_admin', 'supabase_privileged_role',
  'supabase_read_only_user', 'supabase_realtime_admin', 'supabase_replication_admin', 'supabase_storage_admin']);

// Exact row counts for Auth tables (reltuples is only an estimate).
export function authCountSql(tables) {
  if (!tables.length) return `select '{}'::jsonb::text`;
  return `select coalesce(jsonb_object_agg(k, n), '{}')::text from (${tables.map(t => `select '${t}' k, count(*) n from "auth"."${t.slice(5)}"`).join(' union all ')}) z`;
}

// Decides coverage. Inputs are counts and names only. Never throws: returns failures and warnings.
export function evaluateCoverage({ inventory, authCounts, appTables }) {
  const failures = [], warnings = [], excluded = [];
  for (const [schema, n] of Object.entries(inventory.schemas || {})) {
    if (APP_SCHEMAS.includes(schema) || MANAGED_SCHEMAS.includes(schema)) continue;
    if (n > 0) failures.push(`schema "${schema}" has ${n} table(s) and is not covered: add it to APP_SCHEMAS or classify it`);
  }
  for (const s of APP_SCHEMAS) if (!(s in (inventory.schemas || {}))) failures.push(`application schema "${s}" not found`);
  if (!appTables.length) failures.push('no application table found');
  for (const t of AUTH_INCLUDED) if (!(t in (inventory.auth_tables || {}))) failures.push(`${t} not found: Auth cannot be covered`);
  for (const t of Object.keys(inventory.auth_tables || {})) {
    if (AUTH_INCLUDED.includes(t)) continue;
    const rule = AUTH_EXCLUDED[t];
    const n = Number(authCounts[t] ?? 0);
    if (!rule) {
      if (n > 0) failures.push(`${t} is a new Auth table holding ${n} row(s): classify it in ops/backup/lib/coverage.mjs`);
      else warnings.push(`${t} is a new, empty Auth table: classify it in ops/backup/lib/coverage.mjs`);
      excluded.push({ resource: t, reason: 'unclassified (empty)', rows: n });
      continue;
    }
    if (rule.durable && n > 0) failures.push(`${t} holds ${n} row(s) that this backup does not carry (${rule.reason})`);
    excluded.push({ resource: t, reason: rule.reason, rows: n });
  }
  if (Number(inventory.storage_objects) > 0 || Number(inventory.storage_buckets) > 0) {
    failures.push(`Supabase Storage holds ${inventory.storage_buckets} bucket(s) / ${inventory.storage_objects} object(s): files are not covered by this backup`);
  } else excluded.push({ resource: 'Supabase Storage', reason: 'unused (0 bucket, 0 object at backup time; checked on every run)' });
  if (Number(inventory.vault_secrets) > 0) failures.push(`Supabase Vault holds ${inventory.vault_secrets} secret(s): not covered`);
  else excluded.push({ resource: 'Supabase Vault', reason: 'unused (0 secret at backup time; checked on every run)' });
  if (Number(inventory.cron_jobs) > 0) failures.push(`pg_cron holds ${inventory.cron_jobs} job(s): not covered`);
  const unknownRoles = (inventory.roles || []).filter(r => !SUPABASE_ROLES.includes(r));
  if (unknownRoles.length) failures.push(`custom database role(s) not covered: ${unknownRoles.join(', ')}`);
  if ((inventory.realtime_publication_tables || []).length) warnings.push(`Realtime publication includes ${inventory.realtime_publication_tables.join(', ')}: re-add after restore`);
  excluded.push({ resource: 'realtime.*', reason: 'Realtime runtime state (messages, subscriptions), recreated by Supabase' });
  excluded.push({ resource: 'Edge Functions', reason: 'code deployed outside the database; Relanzio does not call any (see backup-inventory.md)' });
  excluded.push({ resource: 'project settings (Auth providers, SMTP, URL config, API keys, JWT secret)', reason: 'Supabase dashboard configuration, documented in the runbook; secrets are never backed up' });
  return { ok: failures.length === 0, failures, warnings, excluded };
}

// Migration reconciliation: history recorded in Supabase vs. the repository files, through migration-map.json.
export function evaluateMigrations({ history, repoFiles, map }) {
  const failures = [], warnings = [];
  const byFile = new Map(map.files.map(f => [f.file, f]));
  const versions = new Set(history.map(h => h.version));
  for (const f of repoFiles) if (!byFile.has(f)) failures.push(`repository migration ${f} is not reconciled in ops/backup/migration-map.json`);
  for (const f of map.files) if (!repoFiles.includes(f.file)) failures.push(`migration-map.json lists ${f.file}, absent from supabase/migrations`);
  const mappedVersions = new Set(map.files.map(f => f.history_version).filter(Boolean));
  for (const h of history) if (!mappedVersions.has(h.version)) warnings.push(`unexpected migration in Supabase history: ${h.version} ${h.name} (no repository file)`);
  for (const f of map.files) {
    if (f.history_version && !versions.has(f.history_version)) failures.push(`${f.file}: expected history version ${f.history_version} is missing from Supabase history`);
  }
  const recorded = map.files.filter(f => f.history_version && versions.has(f.history_version)).length;
  const unrecorded = map.files.filter(f => !f.history_version).map(f => f.file);
  return { ok: failures.length === 0, failures, warnings, history_entries: history.length, repository_files: repoFiles.length, recorded, applied_without_history: unrecorded };
}
