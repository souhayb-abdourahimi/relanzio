-- Shared job leases: claim / renew / release semantics, expiry, fencing token, input checks, privileges.
do $$
declare t1 bigint; t2 bigint; t3 bigint;
begin
  t1 := public.claim_scheduled_job('test.job', 'owner-A-000000', 60);
  assert t1 = 1, 'first claim gets token 1';
  assert public.claim_scheduled_job('test.job', 'owner-B-000000', 60) is null, 'a live lease blocks another owner';
  assert public.claim_scheduled_job('test.job', 'owner-A-000000', 60) is null, 'a live lease is not re-entrant, even for its owner';
  assert public.renew_scheduled_job('test.job', 'owner-A-000000', t1, 60), 'owner renews';
  assert not public.renew_scheduled_job('test.job', 'owner-B-000000', t1, 60), 'another owner cannot renew';
  assert not public.release_scheduled_job('test.job', 'owner-B-000000', t1, 'ok'), 'another owner cannot release';
  assert public.release_scheduled_job('test.job', 'owner-A-000000', t1, 'ok'), 'owner releases';
  assert not public.release_scheduled_job('test.job', 'owner-A-000000', t1, 'ok'), 'release is not repeated';
  assert not public.renew_scheduled_job('test.job', 'owner-A-000000', t1, 60), 'a released lease cannot be renewed';
  t2 := public.claim_scheduled_job('test.job', 'owner-B-000000', 60);
  assert t2 = 2, 'claim after release: token increases';
  -- Expiry: simulate a crashed owner whose lease ran out.
  update public.scheduled_job_leases set lease_until = clock_timestamp() - interval '1 second' where job_name = 'test.job';
  t3 := public.claim_scheduled_job('test.job', 'owner-C-000000', 60);
  assert t3 = 3, 'an expired lease can be claimed by another process';
  assert not public.renew_scheduled_job('test.job', 'owner-B-000000', t2, 60), 'the previous owner lost its lease (fencing token changed)';
  assert not public.release_scheduled_job('test.job', 'owner-B-000000', t2, 'ok'), 'the previous owner cannot release the new lease';
  assert (select owner_id from public.scheduled_job_leases where job_name = 'test.job') = 'owner-C-000000';
end $$;

-- Minimum gap between two claims: the same cron tick is not run twice by two instances.
do $$
declare t bigint;
begin
  t := public.claim_scheduled_job('test.gap', 'owner-A-000000', 60, 300);
  assert t = 1;
  assert public.release_scheduled_job('test.gap', 'owner-A-000000', t, 'ok');
  assert public.claim_scheduled_job('test.gap', 'owner-B-000000', 60, 300) is null, 'released, but claimed less than 300 s ago: same tick, skipped';
  assert public.claim_scheduled_job('test.gap', 'owner-B-000000', 60, 0) = 2, 'gap 0 (manual run): allowed';
  assert public.release_scheduled_job('test.gap', 'owner-B-000000', 2, 'ok');
  update public.scheduled_job_leases set acquired_at = clock_timestamp() - interval '301 seconds' where job_name = 'test.gap';
  assert public.claim_scheduled_job('test.gap', 'owner-C-000000', 60, 300) = 3, 'next tick: allowed';
end $$;

-- Input checks.
do $$ begin
  begin perform public.claim_scheduled_job('Bad Name', 'owner-A-000000', 60); assert false; exception when raise_exception then null; end;
  begin perform public.claim_scheduled_job('test.ok', 'short', 60); assert false; exception when raise_exception then null; end;
  begin perform public.claim_scheduled_job('test.ok', 'owner-A-000000', 1); assert false; exception when raise_exception then null; end;
  begin perform public.claim_scheduled_job('test.ok', 'owner-A-000000', 999999); assert false; exception when raise_exception then null; end;
  begin perform public.claim_scheduled_job('test.ok', 'owner-A-000000', 60, -1); assert false; exception when raise_exception then null; end;
end $$;

-- Privileges: only service_role may use the leases.
do $$ begin
  assert not has_function_privilege('anon', 'public.claim_scheduled_job(text,text,integer,integer)', 'execute');
  assert not has_function_privilege('authenticated', 'public.claim_scheduled_job(text,text,integer,integer)', 'execute');
  assert not has_function_privilege('anon', 'public.release_scheduled_job(text,text,bigint,text)', 'execute');
  assert has_function_privilege('service_role', 'public.claim_scheduled_job(text,text,integer,integer)', 'execute');
  assert has_function_privilege('service_role', 'public.renew_scheduled_job(text,text,bigint,integer)', 'execute');
  assert not has_table_privilege('anon', 'public.scheduled_job_leases', 'select');
  assert not has_table_privilege('authenticated', 'public.scheduled_job_leases', 'select');
  assert (select relrowsecurity from pg_class where oid = 'public.scheduled_job_leases'::regclass);
end $$;
delete from public.scheduled_job_leases where job_name like 'test.%';
