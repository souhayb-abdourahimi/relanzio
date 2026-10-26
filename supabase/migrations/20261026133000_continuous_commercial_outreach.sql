-- Continuous commercial outreach: provider-aware cap, verified candidate staging, positive lead follow-up.
alter table public.prospects drop constraint if exists prospects_status_check;
alter table public.prospects add constraint prospects_status_check
  check (status = any (array[
    'new'::text,'qualified'::text,'contacted'::text,'replied'::text,'interested'::text,
    'meeting'::text,'pilot'::text,'customer'::text,'not_now'::text,'not_interested'::text,'suppressed'::text
  ]));
alter table public.prospects add column if not exists verification_metadata jsonb not null default '{}'::jsonb;

alter table public.outreach_daily_slots drop constraint if exists outreach_daily_slots_slot_check;
alter table public.outreach_daily_slots add constraint outreach_daily_slots_slot_check check (slot between 1 and 1000);

create table if not exists public.outreach_candidates (
  id uuid primary key default gen_random_uuid(),
  batch_key text,
  company_name text not null,
  contact_name text,
  email text not null,
  role text,
  website text,
  sector text,
  source text,
  source_url text not null,
  workflow_url text,
  personalization text,
  employee_count integer,
  estimated_quotes_per_month integer,
  uses_digital_tools boolean not null default false,
  is_service_business boolean not null default true,
  score integer not null default 0 check (score between 0 and 100),
  verification_status text not null check (verification_status in ('pass','warn','fail')),
  warning_codes jsonb not null default '[]'::jsonb,
  verification_notes jsonb not null default '{}'::jsonb,
  public_email_confirmed boolean not null default false,
  workflow_verified boolean not null default false,
  verified_at timestamptz not null,
  status text not null default 'waiting' check (status in ('waiting','processing','imported','rejected','manual_review')),
  imported_prospect_id uuid references public.prospects(id) on delete set null,
  reject_reason text,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists outreach_candidates_email_lower_unique on public.outreach_candidates(lower(email));
create index if not exists outreach_candidates_feeder_idx
  on public.outreach_candidates(status,verification_status,score desc,verified_at desc);
create index if not exists outreach_candidates_imported_prospect_idx on public.outreach_candidates(imported_prospect_id);
alter table public.outreach_candidates enable row level security;
revoke all on table public.outreach_candidates from anon, authenticated;
grant select,insert,update,delete on table public.outreach_candidates to service_role;

create table if not exists public.sales_followups (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  reply_event_id uuid unique references public.outreach_events(id) on delete cascade,
  category text not null,
  summary text not null default '',
  status text not null default 'open' check (status in ('open','done','dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sales_followups_open_idx on public.sales_followups(status,created_at desc);
create index if not exists sales_followups_prospect_idx on public.sales_followups(prospect_id);
alter table public.sales_followups enable row level security;
revoke all on table public.sales_followups from anon, authenticated;
grant select,insert,update,delete on table public.sales_followups to service_role;

create or replace function public.claim_outreach_daily_slot(
  p_reservation_key text,
  p_queue_id uuid default null,
  p_cap integer default 300,
  p_now timestamptz default now()
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_day date;
  v_cap integer;
  v_count integer;
  v_slot integer;
  v_existing public.outreach_daily_slots%rowtype;
begin
  if nullif(btrim(p_reservation_key),'') is null then raise exception 'OUTREACH_RESERVATION_KEY_REQUIRED'; end if;
  v_cap := least(1000, greatest(1, coalesce(p_cap,300)));
  v_day := (p_now at time zone 'Europe/Paris')::date;
  perform pg_advisory_xact_lock(hashtextextended('relanzio-outreach-cap:' || v_day::text, 0));

  select * into v_existing from public.outreach_daily_slots where reservation_key=p_reservation_key;
  if found then
    return jsonb_build_object('allowed',true,'business_date',v_existing.business_date,'slot',v_existing.slot,'idempotent',true,'status',v_existing.status,'cap',v_cap);
  end if;

  select count(*) into v_count from public.outreach_daily_slots where business_date=v_day;
  if v_count >= v_cap then
    return jsonb_build_object('allowed',false,'business_date',v_day,'used',v_count,'cap',v_cap,'reason','daily_cap');
  end if;

  select g into v_slot
  from generate_series(1,v_cap) g
  where not exists (
    select 1 from public.outreach_daily_slots s where s.business_date=v_day and s.slot=g
  )
  order by g limit 1;

  insert into public.outreach_daily_slots(business_date,slot,reservation_key,queue_id)
  values(v_day,v_slot,p_reservation_key,p_queue_id);

  return jsonb_build_object('allowed',true,'business_date',v_day,'slot',v_slot,'idempotent',false,'status','reserved','cap',v_cap);
end $$;

create or replace function public.apply_outreach_reply(
  p_from_email text,
  p_category text,
  p_sentiment text default 'neutral',
  p_content text default '',
  p_received_at timestamptz default now(),
  p_dedupe_key text default null,
  p_in_reply_to text default null,
  p_metadata jsonb default '{}'::jsonb
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_email text:=lower(btrim(coalesce(p_from_email,'')));
  v_by_email uuid;
  v_by_message uuid;
  v_id uuid;
  v_prospect_email text;
  v_event_type text;
  v_event_id uuid;
  v_suppress boolean;
  v_positive boolean;
  v_summary text;
begin
  if p_category not in ('interested','auto_reply','neutral','not_now','pricing','feature_request','not_interested','opt_out','other') then
    return jsonb_build_object('matched',false,'reason','invalid_category');
  end if;
  if p_dedupe_key is not null and exists(select 1 from public.outreach_events where dedupe_key=p_dedupe_key) then
    return jsonb_build_object('matched',true,'idempotent',true,'reason','duplicate_event');
  end if;

  select id into v_by_email from public.prospects where lower(email)=v_email limit 1;
  if nullif(btrim(coalesce(p_in_reply_to,'')),'') is not null then
    select prospect_id into v_by_message
    from public.outreach_events
    where provider_message_id=p_in_reply_to and type='sent'
    order by created_at desc limit 1;
  end if;
  if v_by_email is not null and v_by_message is not null and v_by_email<>v_by_message then
    return jsonb_build_object('matched',false,'reason','identity_conflict');
  end if;
  v_id:=coalesce(v_by_message,v_by_email);
  if v_id is null then return jsonb_build_object('matched',false,'reason','prospect_not_found'); end if;

  select lower(email) into v_prospect_email from public.prospects where id=v_id;
  if v_email<>v_prospect_email then return jsonb_build_object('matched',false,'reason','sender_mismatch'); end if;

  if p_category='auto_reply' then
    insert into public.outreach_events(prospect_id,type,content,dedupe_key,metadata)
    values(v_id,'note',left(coalesce(p_content,''),5000),p_dedupe_key,
      coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object('category','auto_reply','sentiment',coalesce(p_sentiment,'neutral'),'received_at',p_received_at))
    returning id into v_event_id;
    return jsonb_build_object('matched',true,'idempotent',false,'prospect_id',v_id,'category','auto_reply','suppressed',false,'positive',false,'human',false,'event_id',v_event_id);
  end if;

  v_suppress:=p_category in ('opt_out','not_interested');
  v_positive:=p_category in ('interested','pricing','feature_request');
  v_event_type:=case when p_category='opt_out' then 'opt_out' else 'replied' end;
  v_summary:=left(coalesce(
    p_metadata#>>'{analysis,summary}',
    p_metadata#>>'{classification,summary}',
    nullif(btrim(p_content),''),
    ''
  ),500);

  insert into public.outreach_events(prospect_id,type,content,dedupe_key,metadata)
  values(v_id,v_event_type,left(coalesce(p_content,''),5000),p_dedupe_key,
         coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object('category',p_category,'sentiment',coalesce(p_sentiment,'neutral'),'received_at',p_received_at,'positive',v_positive))
  returning id into v_event_id;

  update public.prospects
  set status=case
        when v_suppress then 'suppressed'
        when v_positive then 'interested'
        when p_category='not_now' then 'not_now'
        else 'replied'
      end,
      last_reply_at=p_received_at,reply_category=p_category,updated_at=now()
  where id=v_id;

  if v_suppress then
    insert into public.suppressions(email,reason)
    values(v_prospect_email,case when p_category='opt_out' then 'opt_out' else 'refusal' end)
    on conflict(email) do update set reason=excluded.reason;
  end if;

  update public.outreach_queue
  set status='canceled',error='reply_received',updated_at=now()
  where prospect_id=v_id and status in ('queued','held','ready');

  if v_positive then
    insert into public.sales_followups(prospect_id,reply_event_id,category,summary,status)
    values(v_id,v_event_id,p_category,v_summary,'open')
    on conflict(reply_event_id) do nothing;
  end if;

  return jsonb_build_object('matched',true,'idempotent',false,'prospect_id',v_id,'category',p_category,'suppressed',v_suppress,'positive',v_positive,'human',true,'event_id',v_event_id);
exception when unique_violation then
  return jsonb_build_object('matched',true,'idempotent',true,'reason','duplicate_event');
end $$;

revoke all on function public.claim_outreach_daily_slot(text,uuid,integer,timestamptz) from public, anon, authenticated;
revoke all on function public.apply_outreach_reply(text,text,text,text,timestamptz,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.claim_outreach_daily_slot(text,uuid,integer,timestamptz) to service_role;
grant execute on function public.apply_outreach_reply(text,text,text,text,timestamptz,text,text,jsonb) to service_role;
