-- Additive, local-tested only. No existing SaaS tables, buckets or jobs touched.
begin;
create table public.maintenance_pilot_cases (
 id uuid primary key default gen_random_uuid(), request_key uuid not null unique, payload_hash text not null,
 company text not null check(length(company)<=100), email text not null check(length(email)<=254),
 diagnostic jsonb, operator_id uuid, revision integer not null default 0 check(revision>=0),
 state jsonb not null default '{"version":0,"approved":false,"deliveries":[],"signals":{}}',
 created_at timestamptz not null default now()
);
create table public.maintenance_pilot_payments (
 case_id uuid not null references public.maintenance_pilot_cases on delete cascade,
 version integer not null, session_id text unique check(session_id like 'cs_test_%'),
 paid boolean not null default false, amount integer not null default 19000 check(amount=19000),
 currency text not null default 'eur' check(currency='eur'), primary key(case_id)
);
create table public.maintenance_pilot_events (
 id bigint generated always as identity primary key, case_id uuid not null references public.maintenance_pilot_cases on delete cascade,
 event_key text unique, kind text not null check(kind in ('state_changed','test_payment')),
 created_at timestamptz not null default now()
);
create table public.maintenance_pilot_deliveries (
 case_id uuid not null references public.maintenance_pilot_cases on delete cascade,
 address text not null check(address=lower(address) and address ~ '^[^[:space:]@]+@[^[:space:]@]+[.]invalid$'),
 step integer not null check(step in (1,2)), status text not null check(status in ('simulated','unknown_delivery')),
 sent_at timestamptz not null, primary key(case_id,address,step)
);
alter table public.maintenance_pilot_cases enable row level security;
alter table public.maintenance_pilot_payments enable row level security;
alter table public.maintenance_pilot_events enable row level security;
alter table public.maintenance_pilot_deliveries enable row level security;
revoke all on public.maintenance_pilot_cases,public.maintenance_pilot_payments,public.maintenance_pilot_events,public.maintenance_pilot_deliveries from public,anon,authenticated;
grant all on public.maintenance_pilot_cases,public.maintenance_pilot_payments,public.maintenance_pilot_events,public.maintenance_pilot_deliveries to service_role;
grant usage,select on sequence public.maintenance_pilot_events_id_seq to service_role;

-- Invoker rights only; service_role-only RPC. Serializes every state transition.
create function public.maintenance_pilot_update(p_id uuid,p_operator uuid,p_revision integer,p_state jsonb)
returns jsonb language plpgsql set search_path=public,pg_temp as $$
declare r public.maintenance_pilot_cases; d jsonb;
begin
 select * into r from public.maintenance_pilot_cases where id=p_id and operator_id=p_operator for update;
 if not found or r.revision<>p_revision then raise exception 'CASE_CONFLICT'; end if;
 if p_state->'campaign' is distinct from r.state->'campaign' and exists(select 1 from public.maintenance_pilot_payments where case_id=p_id) then raise exception 'CHECKOUT_FREEZES_CAMPAIGN';end if;
 if jsonb_array_length(coalesce(p_state->'deliveries','[]'))>1000 then raise exception 'CONTACT_LIMIT';end if;
 for d in select * from jsonb_array_elements(coalesce(p_state->'deliveries','[]')) loop
  insert into public.maintenance_pilot_deliveries(case_id,address,step,status,sent_at)
  values(p_id,d->>'address',(d->>'step')::integer,d->>'status',(d->>'at')::timestamptz)
  on conflict(case_id,address,step) do nothing;
 end loop;
 if (select count(distinct address) from public.maintenance_pilot_deliveries where case_id=p_id)>500 then raise exception 'CONTACT_LIMIT';end if;
 update public.maintenance_pilot_cases set state=p_state,revision=revision+1 where id=p_id returning * into r;
 insert into public.maintenance_pilot_events(case_id,kind) values(p_id,'state_changed');
 return to_jsonb(r);
end $$;
-- Reserve once per case before contacting Stripe; freezes the approved campaign.
create function public.maintenance_pilot_checkout(p_id uuid,p_operator uuid,p_revision integer)
returns jsonb language plpgsql set search_path=public,pg_temp as $$
declare r public.maintenance_pilot_cases; p public.maintenance_pilot_payments;
begin
 select * into r from public.maintenance_pilot_cases where id=p_id and operator_id=p_operator for update;
 if not found or r.revision<>p_revision or r.state->>'approved' is distinct from 'true' then raise exception 'CASE_CONFLICT';end if;
 insert into public.maintenance_pilot_payments(case_id,version) values(p_id,(r.state->>'version')::integer) on conflict(case_id) do nothing;
 select * into p from public.maintenance_pilot_payments where case_id=p_id;
 return to_jsonb(p);
end $$;
create function public.maintenance_pilot_paid(p_event text,p_session text,p_case uuid)
returns boolean language plpgsql set search_path=public,pg_temp as $$
begin
 perform 1 from public.maintenance_pilot_payments where case_id=p_case and session_id=p_session for update;
 if not found then raise exception 'UNKNOWN_SESSION';end if;
 insert into public.maintenance_pilot_events(case_id,event_key,kind) values(p_case,p_event,'test_payment') on conflict(event_key) do nothing;
 update public.maintenance_pilot_payments set paid=true where case_id=p_case and session_id=p_session;
 return true;
end $$;
-- This version stores TEST payments only: all operational records expire at 30d.
-- A future live payment implementation must separate legal accounting retention.
create function public.maintenance_pilot_purge()
returns jsonb language plpgsql set search_path=public,pg_temp as $$
declare details integer; cases integer;
begin
 update public.maintenance_pilot_cases set diagnostic=null where created_at<now()-interval '7 days' and diagnostic is not null;
 get diagnostics details=row_count;
 delete from public.maintenance_pilot_cases where created_at<now()-interval '30 days';
 get diagnostics cases=row_count;
 return jsonb_build_object('diagnostics_purged',details,'cases_purged',cases,'scope','database_only');
end $$;
revoke all on function public.maintenance_pilot_checkout(uuid,uuid,integer),public.maintenance_pilot_update(uuid,uuid,integer,jsonb),public.maintenance_pilot_paid(text,text,uuid),public.maintenance_pilot_purge() from public,anon,authenticated;
grant execute on function public.maintenance_pilot_checkout(uuid,uuid,integer),public.maintenance_pilot_update(uuid,uuid,integer,jsonb),public.maintenance_pilot_paid(text,text,uuid),public.maintenance_pilot_purge() to service_role;
commit;
