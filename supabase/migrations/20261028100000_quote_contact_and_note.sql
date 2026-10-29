-- Daily loop: client phone, email optional when a phone is given, free note per quote.
-- Rollback: supabase/rollbacks/20261028100000_quote_contact_and_note.down.sql
alter table public.quotes add column if not exists client_phone text;
alter table public.quotes add column if not exists note text;
alter table public.quotes alter column client_email drop not null;

alter table public.quotes drop constraint if exists quotes_contact_required;
alter table public.quotes add constraint quotes_contact_required
  check (nullif(btrim(coalesce(client_email,'')),'') is not null or nullif(btrim(coalesce(client_phone,'')),'') is not null);
alter table public.quotes drop constraint if exists quotes_client_phone_length;
alter table public.quotes add constraint quotes_client_phone_length check (client_phone is null or char_length(client_phone)<=40);
alter table public.quotes drop constraint if exists quotes_note_length;
alter table public.quotes add constraint quotes_note_length check (note is null or char_length(note)<=1000);

drop function if exists public.create_quote_with_quota(uuid,integer,text,text,text,numeric,date,text,boolean,integer,text,timestamptz);
create function public.create_quote_with_quota(
  p_user_id uuid,
  p_limit integer,
  p_client_name text,
  p_client_email text,
  p_title text,
  p_amount numeric,
  p_sent_at date,
  p_request_key text,
  p_auto_send boolean,
  p_followup_step integer,
  p_followup_schedule_mode text,
  p_next_followup_at timestamptz,
  p_client_phone text default null,
  p_note text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  existing public.quotes%rowtype;
  created public.quotes%rowtype;
  active_count integer;
begin
  if p_limit not in (5,100) then raise exception 'INVALID_QUOTE_LIMIT' using errcode='22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text,0));
  if nullif(p_request_key,'') is not null then
    select * into existing from public.quotes where user_id=p_user_id and request_key=p_request_key limit 1;
    if found then return jsonb_build_object('quote',to_jsonb(existing),'idempotent',true); end if;
  end if;
  select count(*) into active_count from public.quotes where user_id=p_user_id and status in ('open','paused');
  if active_count >= p_limit then raise exception 'ACTIVE_QUOTE_LIMIT:%',p_limit using errcode='P0001'; end if;
  insert into public.quotes(user_id,client_name,client_email,client_phone,note,title,amount,sent_at,status,request_key,auto_send,followup_step,followup_schedule_mode,next_followup_at)
  values(p_user_id,p_client_name,nullif(btrim(coalesce(p_client_email,'')),''),nullif(btrim(coalesce(p_client_phone,'')),''),nullif(btrim(coalesce(p_note,'')),''),p_title,p_amount,p_sent_at,'open',nullif(p_request_key,''),p_auto_send,p_followup_step,p_followup_schedule_mode,p_next_followup_at)
  returning * into created;
  return jsonb_build_object('quote',to_jsonb(created),'idempotent',false);
end;
$$;
revoke all on function public.create_quote_with_quota(uuid,integer,text,text,text,numeric,date,text,boolean,integer,text,timestamptz,text,text) from public,anon,authenticated;
grant execute on function public.create_quote_with_quota(uuid,integer,text,text,text,numeric,date,text,boolean,integer,text,timestamptz,text,text) to service_role;
