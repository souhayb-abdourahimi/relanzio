-- Rollback of 20261112100000_scheduled_job_leases.sql. Only run after the application no longer calls these
-- functions (otherwise every scheduled job is skipped: the code fails closed when the lease is unavailable).
drop function if exists public.release_scheduled_job(text, text, bigint, text);
drop function if exists public.renew_scheduled_job(text, text, bigint, integer);
drop function if exists public.claim_scheduled_job(text, text, integer, integer);
drop table if exists public.scheduled_job_leases;
