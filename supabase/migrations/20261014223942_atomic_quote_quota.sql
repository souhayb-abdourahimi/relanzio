create or replace function public.create_quote_with_quota(
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
  p_next_followup_at timestamptz
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
  insert into public.quotes(user_id,client_name,client_email,title,amount,sent_at,status,request_key,auto_send,followup_step,followup_schedule_mode,next_followup_at)
  values(p_user_id,p_client_name,p_client_email,p_title,p_amount,p_sent_at,'open',nullif(p_request_key,''),p_auto_send,p_followup_step,p_followup_schedule_mode,p_next_followup_at)
  returning * into created;
  return jsonb_build_object('quote',to_jsonb(created),'idempotent',false);
end;
$$;
revoke all on function public.create_quote_with_quota(uuid,integer,text,text,text,numeric,date,text,boolean,integer,text,timestamptz) from public,anon,authenticated;
grant execute on function public.create_quote_with_quota(uuid,integer,text,text,text,numeric,date,text,boolean,integer,text,timestamptz) to service_role;
