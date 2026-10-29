-- Rollback of 20261028130000_morning_digest.sql.
drop table if exists public.digest_sends;
alter table public.profiles drop column if exists morning_digest_enabled;
