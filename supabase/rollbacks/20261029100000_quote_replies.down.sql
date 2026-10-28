-- Rollback of 20261029100000_quote_replies.sql: restores the 20261028110000 follow-up RPCs, then removes reply tracking.
create or replace function public.confirm_manual_followup(
  p_quote_id uuid,
  p_user_id uuid,
  p_expected_step integer,
  p_subject text,
  p_body text,
  p_request_key text,
  p_confirmed_at timestamptz
) returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_quote public.quotes%rowtype;
  v_followup public.followups%rowtype;
  v_step integer;
  v_gap integer;
  v_action_date date;
  v_next_at timestamptz;
  v_next_mode text;
begin
  if p_request_key is null or length(trim(p_request_key))=0 then
    return jsonb_build_object('ok',false,'code','REQUEST_KEY_REQUIRED');
  end if;

  select * into v_followup
  from public.followups
  where user_id=p_user_id and request_key=p_request_key
  limit 1;

  if found then
    if v_followup.quote_id<>p_quote_id then
      return jsonb_build_object('ok',false,'code','REQUEST_KEY_CONFLICT');
    end if;
    select * into v_quote from public.quotes where id=v_followup.quote_id and user_id=p_user_id;
    return jsonb_build_object('ok',true,'idempotent',true,'quote',to_jsonb(v_quote),'followup',to_jsonb(v_followup));
  end if;

  select * into v_quote
  from public.quotes
  where id=p_quote_id and user_id=p_user_id
  for update;

  if not found then return jsonb_build_object('ok',false,'code','QUOTE_NOT_FOUND'); end if;
  if v_quote.status<>'open' then return jsonb_build_object('ok',false,'code','QUOTE_NOT_OPEN'); end if;
  if v_quote.followup_step>=3 then return jsonb_build_object('ok',false,'code','SEQUENCE_COMPLETE'); end if;

  v_step:=v_quote.followup_step+1;
  if p_expected_step is null or p_expected_step<>v_step then
    select * into v_followup from public.followups where quote_id=p_quote_id and step=p_expected_step limit 1;
    if found then
      return jsonb_build_object('ok',false,'code','FOLLOWUP_ALREADY_RECORDED','followup',to_jsonb(v_followup));
    end if;
    return jsonb_build_object('ok',false,'code','FOLLOWUP_STEP_STALE');
  end if;

  insert into public.followups(quote_id,user_id,step,subject,body,status,provider_message_id,sent_at,request_key,channel,business_date)
  values(p_quote_id,p_user_id,v_step,coalesce(p_subject,''),coalesce(p_body,''),'sent',null,p_confirmed_at,p_request_key,'manual',(p_confirmed_at at time zone 'Europe/Paris')::date)
  returning * into v_followup;

  if v_step>=3 then
    v_next_at:=null; v_next_mode:='none';
  elsif v_quote.followup_schedule_mode='none' then
    v_next_at:=null; v_next_mode:='none';
  else
    v_gap:=public.followup_gap_days(p_user_id,v_step);
    v_action_date:=(p_confirmed_at at time zone 'Europe/Paris')::date;
    v_next_at:=(((v_action_date+v_gap)::date::timestamp + time '09:00') at time zone 'Europe/Paris');
    v_next_mode:='recommended';
  end if;

  update public.quotes
  set followup_step=v_step,
      followup_schedule_mode=v_next_mode,
      next_followup_at=v_next_at,
      send_claimed_at=null,
      updated_at=p_confirmed_at
  where id=p_quote_id and user_id=p_user_id
  returning * into v_quote;

  return jsonb_build_object('ok',true,'idempotent',false,'quote',to_jsonb(v_quote),'followup',to_jsonb(v_followup));
exception
  when unique_violation then
    select * into v_followup from public.followups where quote_id=p_quote_id and step=p_expected_step limit 1;
    return jsonb_build_object('ok',false,'code','FOLLOWUP_ALREADY_RECORDED','followup',to_jsonb(v_followup));
end;
$$;

create or replace function public.finalize_relanzio_followup(
  p_followup_id uuid,
  p_quote_id uuid,
  p_user_id uuid,
  p_expected_previous_step integer,
  p_sent_at timestamptz,
  p_provider_message_id text
) returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_quote public.quotes%rowtype;
  v_followup public.followups%rowtype;
  v_next_step integer;
  v_gap integer;
  v_action_date date;
  v_next_at timestamptz;
  v_next_mode text;
begin
  select * into v_quote
  from public.quotes
  where id=p_quote_id and user_id=p_user_id
  for update;
  if not found then return jsonb_build_object('ok',false,'code','QUOTE_NOT_FOUND'); end if;

  select * into v_followup
  from public.followups
  where id=p_followup_id and quote_id=p_quote_id and user_id=p_user_id
  for update;
  if not found then return jsonb_build_object('ok',false,'code','FOLLOWUP_NOT_FOUND'); end if;

  if v_followup.status in ('sent','delivered','opened','clicked','bounced') then
    return jsonb_build_object('ok',true,'idempotent',true,'quote',to_jsonb(v_quote),'followup',to_jsonb(v_followup));
  end if;
  if v_followup.status<>'draft' then return jsonb_build_object('ok',false,'code','FOLLOWUP_NOT_FINALIZABLE'); end if;
  if v_quote.status<>'open' then return jsonb_build_object('ok',false,'code','QUOTE_NOT_OPEN'); end if;
  if v_quote.followup_step<>p_expected_previous_step then return jsonb_build_object('ok',false,'code','FOLLOWUP_STEP_STALE'); end if;
  if v_followup.step<>p_expected_previous_step+1 then return jsonb_build_object('ok',false,'code','FOLLOWUP_STEP_MISMATCH'); end if;

  update public.followups
  set status='sent',sent_at=p_sent_at,provider_message_id=p_provider_message_id,error=null,
      business_date=(p_sent_at at time zone 'Europe/Paris')::date
  where id=p_followup_id
  returning * into v_followup;

  v_next_step:=p_expected_previous_step+1;
  if v_next_step>=3 then
    v_next_at:=null; v_next_mode:='none';
  elsif v_quote.followup_schedule_mode='none' then
    v_next_at:=null; v_next_mode:='none';
  else
    v_gap:=public.followup_gap_days(p_user_id,v_next_step);
    v_action_date:=(p_sent_at at time zone 'Europe/Paris')::date;
    v_next_at:=(((v_action_date+v_gap)::date::timestamp + time '09:00') at time zone 'Europe/Paris');
    v_next_mode:='recommended';
  end if;

  update public.quotes
  set followup_step=v_next_step,
      followup_schedule_mode=v_next_mode,
      next_followup_at=v_next_at,
      send_claimed_at=null,
      updated_at=p_sent_at
  where id=p_quote_id and user_id=p_user_id
  returning * into v_quote;

  return jsonb_build_object('ok',true,'idempotent',false,'quote',to_jsonb(v_quote),'followup',to_jsonb(v_followup));
end;
$$;

drop function if exists public.apply_quote_reply(uuid,uuid,uuid,text,text,text,text,text,text,text,timestamptz);
drop function if exists public.skip_weekend(date);
drop table if exists public.quote_replies;
drop index if exists public.followups_reply_token_key;
alter table public.followups drop column if exists reply_token;
alter table public.quotes drop column if exists reply_received_at;
