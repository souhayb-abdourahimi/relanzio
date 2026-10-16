-- Controlled commercial outreach safety: max 20 J0/day, import tombstones, reply linkage.
alter table public.prospects
  add column if not exists last_reply_at timestamptz,
  add column if not exists reply_category text;

alter table public.outreach_events
  add column if not exists dedupe_key text;

create unique index if not exists outreach_events_dedupe_key_unique
  on public.outreach_events(dedupe_key)
  where dedupe_key is not null;

alter table public.outreach_queue drop constraint if exists outreach_queue_status_check;
alter table public.outreach_queue add constraint outreach_queue_status_check
  check (status in ('queued','sending','sent','held','ready','skipped','failed','canceled'));

create table if not exists public.prospect_tombstones (
  email text primary key,
  email_domain text not null,
  reason text not null default 'deleted',
  deleted_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint prospect_tombstones_normalized_email_check check (email = lower(btrim(email)))
);
alter table public.prospect_tombstones enable row level security;
revoke all on table public.prospect_tombstones from anon, authenticated;

create table if not exists public.outreach_daily_slots (
  business_date date not null,
  slot smallint not null check (slot between 1 and 20),
  reservation_key text not null unique,
  queue_id uuid,
  status text not null default 'reserved' check (status in ('reserved','sent','unknown')),
  reserved_at timestamptz not null default now(),
  sent_at timestamptz,
  primary key (business_date, slot)
);
create index if not exists outreach_daily_slots_queue_idx on public.outreach_daily_slots(queue_id);
alter table public.outreach_daily_slots enable row level security;
revoke all on table public.outreach_daily_slots from anon, authenticated;

create or replace function public.claim_outreach_daily_slot(
  p_reservation_key text,
  p_queue_id uuid default null,
  p_cap integer default 20,
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
  v_cap := least(20, greatest(1, coalesce(p_cap,20)));
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

create or replace function public.finalize_outreach_daily_slot(
  p_reservation_key text,
  p_outcome text
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_row public.outreach_daily_slots%rowtype;
begin
  select * into v_row from public.outreach_daily_slots where reservation_key=p_reservation_key for update;
  if not found then return jsonb_build_object('ok',false,'reason','not_found'); end if;
  if p_outcome='sent' then
    update public.outreach_daily_slots set status='sent',sent_at=now() where reservation_key=p_reservation_key;
    return jsonb_build_object('ok',true,'status','sent');
  elsif p_outcome='definite_failure' then
    if v_row.status='reserved' then delete from public.outreach_daily_slots where reservation_key=p_reservation_key; end if;
    return jsonb_build_object('ok',true,'status','released');
  elsif p_outcome='unknown' then
    update public.outreach_daily_slots set status='unknown' where reservation_key=p_reservation_key;
    return jsonb_build_object('ok',true,'status','unknown');
  end if;
  raise exception 'INVALID_OUTREACH_SLOT_OUTCOME';
end $$;

create or replace function public.safe_import_qualified_prospect(p jsonb)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_email text := lower(btrim(coalesce(p->>'email','')));
  v_domain text;
  v_id uuid;
begin
  if v_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then return jsonb_build_object('imported',false,'reason','invalid_email'); end if;
  v_domain := split_part(v_email,'@',2);
  if coalesce(btrim(p->>'company_name'),'')='' then return jsonb_build_object('imported',false,'reason','missing_company'); end if;
  if coalesce((p->>'score')::int,0) < 55 then return jsonb_build_object('imported',false,'reason','score_below_55'); end if;
  if coalesce(p->>'lawful_basis','') <> 'professional_relevance' then return jsonb_build_object('imported',false,'reason','invalid_lawful_basis'); end if;
  if coalesce(p->>'status','') <> 'qualified' then return jsonb_build_object('imported',false,'reason','not_qualified'); end if;
  if coalesce(p->>'source_url','') !~ '^https?://' then return jsonb_build_object('imported',false,'reason','missing_public_source'); end if;

  if exists(select 1 from public.prospect_tombstones t where t.email=v_email) then return jsonb_build_object('imported',false,'reason','deleted_tombstone'); end if;
  if exists(select 1 from public.suppressions s where lower(s.email)=v_email) then return jsonb_build_object('imported',false,'reason','suppressed'); end if;
  select id into v_id from public.prospects where lower(email)=v_email limit 1;
  if found then return jsonb_build_object('imported',false,'reason','duplicate','id',v_id); end if;

  insert into public.prospects(
    company_name,contact_name,email,role,website,sector,source,source_url,lawful_basis,
    employee_count,estimated_quotes_per_month,uses_digital_tools,is_service_business,score,score_reasons,status
  ) values (
    left(p->>'company_name',160),left(coalesce(p->>'contact_name',''),120),v_email,left(coalesce(p->>'role',''),100),
    left(coalesce(p->>'website',''),240),left(coalesce(p->>'sector',''),160),left(coalesce(p->>'source',''),120),
    left(p->>'source_url',500),'professional_relevance',nullif(p->>'employee_count','')::int,
    nullif(p->>'estimated_quotes_per_month','')::int,coalesce((p->>'uses_digital_tools')::boolean,false),
    coalesce((p->>'is_service_business')::boolean,true),(p->>'score')::int,coalesce(p->'score_reasons','[]'::jsonb),'qualified'
  ) returning id into v_id;
  return jsonb_build_object('imported',true,'reason','imported','id',v_id,'email_domain',v_domain);
exception when unique_violation then return jsonb_build_object('imported',false,'reason','duplicate');
end $$;

create or replace function public.delete_prospect_with_tombstone(p_id uuid,p_reason text default 'deleted')
returns jsonb
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_email text; v_domain text;
begin
  select lower(btrim(email)) into v_email from public.prospects where id=p_id for update;
  if v_email is null then return jsonb_build_object('deleted',false,'reason','not_found'); end if;
  v_domain:=split_part(v_email,'@',2);
  insert into public.prospect_tombstones(email,email_domain,reason)
  values(v_email,v_domain,left(coalesce(nullif(btrim(p_reason),''),'deleted'),120))
  on conflict(email) do update set reason=excluded.reason,deleted_at=now();
  delete from public.prospects where id=p_id;
  return jsonb_build_object('deleted',true,'email',v_email);
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
  v_suppress boolean;
begin
  if p_category not in ('interested','neutral','not_now','pricing','feature_request','not_interested','opt_out','other') then
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

  v_suppress:=p_category in ('opt_out','not_interested');
  v_event_type:=case when p_category='opt_out' then 'opt_out' else 'replied' end;

  insert into public.outreach_events(prospect_id,type,content,dedupe_key,metadata)
  values(v_id,v_event_type,left(coalesce(p_content,''),5000),p_dedupe_key,
         coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object('category',p_category,'sentiment',coalesce(p_sentiment,'neutral'),'received_at',p_received_at));

  update public.prospects
  set status=case when v_suppress then 'suppressed' else 'replied' end,
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

  return jsonb_build_object('matched',true,'idempotent',false,'prospect_id',v_id,'category',p_category,'suppressed',v_suppress);
exception when unique_violation then return jsonb_build_object('matched',true,'idempotent',true,'reason','duplicate_event');
end $$;

revoke all on function public.claim_outreach_daily_slot(text,uuid,integer,timestamptz) from public, anon, authenticated;
revoke all on function public.finalize_outreach_daily_slot(text,text) from public, anon, authenticated;
revoke all on function public.safe_import_qualified_prospect(jsonb) from public, anon, authenticated;
revoke all on function public.delete_prospect_with_tombstone(uuid,text) from public, anon, authenticated;
revoke all on function public.apply_outreach_reply(text,text,text,text,timestamptz,text,text,jsonb) from public, anon, authenticated;

grant execute on function public.claim_outreach_daily_slot(text,uuid,integer,timestamptz) to service_role;
grant execute on function public.finalize_outreach_daily_slot(text,text) to service_role;
grant execute on function public.safe_import_qualified_prospect(jsonb) to service_role;
grant execute on function public.delete_prospect_with_tombstone(uuid,text) to service_role;
grant execute on function public.apply_outreach_reply(text,text,text,text,timestamptz,text,text,jsonb) to service_role;
