-- Applied ONLY to ephemeral clusters (nightly verification and tests), after ephemeral-bootstrap.sql.
-- Reproduces the DEFAULT PRIVILEGES of a real Supabase project (identical in production and in a new
-- project, checked on 6 Nov 2026): every new table, sequence and function of schema public is granted to
-- anon, authenticated and service_role. Without this, the ephemeral check would not see what a real
-- restore produces (pg_dump never writes the REVOKEs that undo these defaults).
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
