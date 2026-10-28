-- Client replies stop the follow-up sequence of a quote. Additive and backward compatible.
-- Rollback: supabase/rollbacks/20261029100000_quote_replies.down.sql
--
-- quotes.reply_received_at set  = the client answered (email detected or reported by the user): no follow-up can be
--                                  prepared, confirmed or sent until the user explicitly resumes (column cleared).
-- followups.reply_token          = random token in the Reply-To address of a follow-up sent by Relanzio.
-- quote_replies                  = history of replies (detected or reported). Never deleted with a resume.
-- Follow-up dates computed here never fall on a Saturday or Sunday (moved to Monday 09:00 Paris).
alter table public.quotes add column if not exists reply_received_at timestamptz;
alter table public.followups add column if not exists reply_token text;
create unique index if not exists followups_reply_token_key on public.followups(reply_token) where reply_token is not null;

create table if not exists public.quote_replies (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  followup_id uuid references public.followups(id) on delete set null,
  source text not null check (source in ('email','manual')),
  channel text not null default 'email' check (channel in ('email','phone','sms','whatsapp','in_person','other')),
  category text not null default 'received' check (category in ('received','interested','question','price','delay','refusal','opt_out','auto_reply','bounce','other')),
  effect text not null check (effect in ('stop','disable_auto','record')),
  from_email text,
  excerpt text check (excerpt is null or length(excerpt)<=2000),
  dedupe_key text not null unique,
  received_at timestamptz not null,
  notified_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists quote_replies_quote_idx on public.quote_replies(quote_id,received_at desc);
create index if not exists quote_replies_user_idx on public.quote_replies(user_id,received_at desc);
alter table public.quote_replies enable row level security;
revoke all on table public.quote_replies from anon, authenticated;
grant select on table public.quote_replies to authenticated;
drop policy if exists "quote replies own read" on public.quote_replies;
create policy "quote replies own read" on public.quote_replies for select to authenticated using ((select auth.uid())=user_id);

create or replace function public.skip_weekend(p_day date)
returns date language sql immutable set search_path=public as $$
  select case extract(isodow from p_day)::int when 6 then p_day+2 when 7 then p_day+1 else p_day end
$$;

-- Records a reply once (dedupe_key) and applies its effect under the quote row lock:
--   stop          open/paused quote: reply_received_at set, auto_send off, no next follow-up
--   disable_auto  auto_send off only (e.g. delivery failure notice)
--   record        history only (e.g. out-of-office auto-reply)
-- A won or lost quote keeps its status: the reply is only recorded.
create or replace function public.apply_quote_reply(
  p_quote_id uuid,
  p_user_id uuid,
  p_followup_id uuid,
  p_source text,
  p_channel text,
  p_category text,
  p_effect text,
  p_from_email text,
  p_excerpt text,
  p_dedupe_key text,
  p_received_at timestamptz
) returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_quote public.quotes%rowtype;
  v_reply public.quote_replies%rowtype;
  v_stopped boolean:=false;
begin
  select * into v_quote from public.quotes where id=p_quote_id and user_id=p_user_id for update;
  if not found then return jsonb_build_object('ok',false,'code','QUOTE_NOT_FOUND'); end if;

  insert into public.quote_replies(quote_id,user_id,followup_id,source,channel,category,effect,from_email,excerpt,dedupe_key,received_at)
  values(p_quote_id,p_user_id,p_followup_id,p_source,coalesce(p_channel,'email'),coalesce(p_category,'received'),p_effect,
         nullif(lower(trim(coalesce(p_from_email,''))),''),left(p_excerpt,2000),p_dedupe_key,coalesce(p_received_at,now()))
  on conflict (dedupe_key) do nothing
  returning * into v_reply;
  if not found then
    return jsonb_build_object('ok',true,'duplicate',true,'stopped',false,'quote',to_jsonb(v_quote));
  end if;

  if v_quote.status in ('open','paused') then
    if p_effect='stop' then
      update public.quotes
      set reply_received_at=greatest(coalesce(reply_received_at,v_reply.received_at),v_reply.received_at),
          auto_send=false,next_followup_at=null,followup_schedule_mode='none',updated_at=now()
      where id=p_quote_id returning * into v_quote;
      v_stopped:=true;
    elsif p_effect='disable_auto' then
      update public.quotes set auto_send=false,updated_at=now() where id=p_quote_id returning * into v_quote;
    end if;
  end if;

  return jsonb_build_object('ok',true,'duplicate',false,'stopped',v_stopped,'quote',to_jsonb(v_quote),'reply',to_jsonb(v_reply));
end;
$$;
revoke all on function public.apply_quote_reply(uuid,uuid,uuid,text,text,text,text,text,text,text,timestamptz) from public,anon,authenticated;
grant execute on function public.apply_quote_reply(uuid,uuid,uuid,text,text,text,text,text,text,text,timestamptz) to service_role;

-- Same as 20261028110000, plus: refused once the client replied; next date skips the weekend.
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
  if v_quote.reply_received_at is not null then return jsonb_build_object('ok',false,'code','QUOTE_REPLIED'); end if;
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
    v_next_at:=((public.skip_weekend(v_action_date+v_gap)::timestamp + time '09:00') at time zone 'Europe/Paris');
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

-- Same as 20261028110000, plus: if the client replied while this email was being sent, the email is recorded
-- as sent (it left) but nothing is scheduled after it; next date skips the weekend.
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
  if v_next_step>=3 or v_quote.reply_received_at is not null then
    v_next_at:=null; v_next_mode:='none';
  elsif v_quote.followup_schedule_mode='none' then
    v_next_at:=null; v_next_mode:='none';
  else
    v_gap:=public.followup_gap_days(p_user_id,v_next_step);
    v_action_date:=(p_sent_at at time zone 'Europe/Paris')::date;
    v_next_at:=((public.skip_weekend(v_action_date+v_gap)::timestamp + time '09:00') at time zone 'Europe/Paris');
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
