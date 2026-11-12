-- Shared leases for scheduled jobs: at most ONE Relanzio process runs a given job at a time, across processes
-- and instances (during a Railway deploy the old and the new instance run side by side; node-cron's noOverlap
-- only protects one process).
--
-- A lease has an owner (one process), an expiry and a fencing token that increases on every new claim.
-- - claim:   succeeds only if the job is free or its lease has expired, AND the previous claim is at least
--            p_min_gap_seconds old (two instances fire the same cron minute: without the gap the second one
--            would re-run the same tick right after the first released it); returns the new token, else NULL.
-- - renew:   extends the lease only for the same owner AND token (nobody claimed it since).
-- - release: frees it only for the same owner AND token.
-- A crashed process simply stops renewing: its lease expires and another process may claim the job.
-- Limits (documented in docs/SCHEDULED_JOBS.md): a lease does not make an external side effect exactly-once
-- (an email accepted by the provider just before a crash may be sent again by the next run, unless the job
-- itself records it idempotently), and a process frozen longer than the TTL can overlap with the next owner.

create table if not exists public.scheduled_job_leases (
  job_name text primary key check (job_name ~ '^[a-z0-9][a-z0-9._-]{0,63}$'),
  owner_id text,
  fencing_token bigint not null default 0,
  lease_until timestamptz,
  acquired_at timestamptz,
  renewed_at timestamptz,
  released_at timestamptz,
  last_outcome text,
  updated_at timestamptz not null default now()
);

alter table public.scheduled_job_leases enable row level security;
revoke all on table public.scheduled_job_leases from public, anon, authenticated;
grant select, insert, update on table public.scheduled_job_leases to service_role;

create or replace function public.claim_scheduled_job(p_job text, p_owner text, p_ttl_seconds integer, p_min_gap_seconds integer default 0)
returns bigint
language plpgsql
security invoker
set search_path = public
as $$
declare v_token bigint;
begin
  if p_job is null or p_job !~ '^[a-z0-9][a-z0-9._-]{0,63}$' then raise exception 'JOB_LEASE_BAD_NAME'; end if;
  if p_owner is null or length(p_owner) not between 8 and 200 then raise exception 'JOB_LEASE_BAD_OWNER'; end if;
  if p_ttl_seconds is null or p_ttl_seconds not between 5 and 21600 then raise exception 'JOB_LEASE_BAD_TTL'; end if;
  if p_min_gap_seconds is null or p_min_gap_seconds not between 0 and 86400 then raise exception 'JOB_LEASE_BAD_GAP'; end if;
  insert into public.scheduled_job_leases as l (job_name, owner_id, fencing_token, lease_until, acquired_at, renewed_at, released_at, updated_at)
  values (p_job, p_owner, 1, clock_timestamp() + make_interval(secs => p_ttl_seconds), clock_timestamp(), clock_timestamp(), null, clock_timestamp())
  on conflict (job_name) do update
    set owner_id = excluded.owner_id,
        fencing_token = l.fencing_token + 1,
        lease_until = excluded.lease_until,
        acquired_at = excluded.acquired_at,
        renewed_at = excluded.renewed_at,
        released_at = null,
        updated_at = excluded.updated_at
    where (l.lease_until is null or l.lease_until <= clock_timestamp())
      and (l.acquired_at is null or l.acquired_at <= clock_timestamp() - make_interval(secs => p_min_gap_seconds))
  returning l.fencing_token into v_token;
  return v_token; -- NULL: another process holds a live lease
end $$;

create or replace function public.renew_scheduled_job(p_job text, p_owner text, p_token bigint, p_ttl_seconds integer)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare v_ok boolean;
begin
  if p_ttl_seconds is null or p_ttl_seconds not between 5 and 21600 then raise exception 'JOB_LEASE_BAD_TTL'; end if;
  update public.scheduled_job_leases
     set lease_until = clock_timestamp() + make_interval(secs => p_ttl_seconds), renewed_at = clock_timestamp(), updated_at = clock_timestamp()
   where job_name = p_job and owner_id = p_owner and fencing_token = p_token and released_at is null
  returning true into v_ok;
  return coalesce(v_ok, false);
end $$;

create or replace function public.release_scheduled_job(p_job text, p_owner text, p_token bigint, p_outcome text)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare v_ok boolean;
begin
  update public.scheduled_job_leases
     set lease_until = null, released_at = clock_timestamp(), last_outcome = left(coalesce(p_outcome, 'unknown'), 40), updated_at = clock_timestamp()
   where job_name = p_job and owner_id = p_owner and fencing_token = p_token and released_at is null
  returning true into v_ok;
  return coalesce(v_ok, false);
end $$;

revoke all on function public.claim_scheduled_job(text, text, integer, integer) from public, anon, authenticated;
revoke all on function public.renew_scheduled_job(text, text, bigint, integer) from public, anon, authenticated;
revoke all on function public.release_scheduled_job(text, text, bigint, text) from public, anon, authenticated;
grant execute on function public.claim_scheduled_job(text, text, integer, integer) to service_role;
grant execute on function public.renew_scheduled_job(text, text, bigint, integer) to service_role;
grant execute on function public.release_scheduled_job(text, text, bigint, text) to service_role;
