create or replace function public.reopen_quote_with_quota(
  p_user_id uuid,
  p_quote_id uuid,
  p_limit integer,
  p_target_status text
) returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  q public.quotes%rowtype;
  active_count integer;
begin
  if p_limit not in (5,100) then raise exception 'INVALID_QUOTE_LIMIT' using errcode='22023'; end if;
  if p_target_status not in ('open','paused') then raise exception 'INVALID_ACTIVE_STATUS' using errcode='22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text,0));
  select * into q from public.quotes where id=p_quote_id and user_id=p_user_id for update;
  if not found then return jsonb_build_object('found',false); end if;
  if q.status in ('open','paused') then return jsonb_build_object('found',true,'already_active',true,'quote',to_jsonb(q)); end if;
  select count(*) into active_count from public.quotes where user_id=p_user_id and status in ('open','paused');
  if active_count >= p_limit then raise exception 'ACTIVE_QUOTE_LIMIT:%',p_limit using errcode='P0001'; end if;
  update public.quotes set status=p_target_status,won_at=null,auto_send=false,updated_at=now()
  where id=p_quote_id and user_id=p_user_id returning * into q;
  return jsonb_build_object('found',true,'already_active',false,'quote',to_jsonb(q));
end;
$$;
revoke all on function public.reopen_quote_with_quota(uuid,uuid,integer,text) from public,anon,authenticated;
grant execute on function public.reopen_quote_with_quota(uuid,uuid,integer,text) to service_role;
