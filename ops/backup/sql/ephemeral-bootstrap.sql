-- Applied ONLY to the ephemeral verification cluster created by ops/backup/lib/pg.mjs (unix socket, no TCP,
-- deleted after the check). Never applied to a Supabase project: there, the roles, the extensions and the
-- whole auth schema already exist and belong to Supabase.
--
-- It recreates what a Supabase database provides before any application object: the platform roles,
-- the "extensions" schema and the auth helper functions used by RLS policies (same definitions as Supabase).
-- The auth TABLES are not defined here: they come from the backup itself (auth-schema.sql, dumped from the
-- real auth.users / auth.identities of the source), so the restored accounts land in the real structure.
do $$
declare r text;
begin
  foreach r in array array['anon','authenticated','service_role','authenticator','dashboard_user','pgbouncer','supabase_admin',
    'supabase_auth_admin','supabase_storage_admin','supabase_functions_admin','supabase_realtime_admin','supabase_replication_admin',
    'supabase_read_only_user','supabase_etl_admin','supabase_privileged_role'] loop
    if not exists (select 1 from pg_roles where rolname=r) then execute format('create role %I nologin', r); end if;
  end loop;
end $$;
alter role service_role bypassrls;
grant anon, authenticated, service_role to authenticator;

create schema if not exists extensions;
create schema if not exists auth;
create extension if not exists pgcrypto with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;
grant usage on schema extensions to anon, authenticated, service_role;
grant usage on schema auth to anon, authenticated, service_role;

create or replace function auth.uid() returns uuid language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''), (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'))::uuid
$$;
create or replace function auth.role() returns text language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claim.role', true), ''), (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'))::text
$$;
create or replace function auth.email() returns text language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claim.email', true), ''), (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email'))::text
$$;
create or replace function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claim', true), ''), nullif(current_setting('request.jwt.claims', true), ''))::jsonb
$$;
grant execute on function auth.uid(), auth.role(), auth.email(), auth.jwt() to anon, authenticated, service_role;
alter database postgres set search_path = "$user", public, extensions;
set search_path = "$user", public, extensions;
