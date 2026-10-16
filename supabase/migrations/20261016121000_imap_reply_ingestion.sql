-- IMAP reply ingestion compatibility: explicit unknown category and source message reference.
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
  v_source_message_id text:=nullif(btrim(coalesce(p_metadata->>'message_id','')),'');
begin
  if p_category not in ('interested','neutral','not_now','pricing','feature_request','not_interested','opt_out','other','unknown') then
    return jsonb_build_object('matched',false,'reason','invalid_category');
  end if;
  if p_dedupe_key is not null and exists(select 1 from public.outreach_events where dedupe_key=p_dedupe_key) then
    return jsonb_build_object('matched',true,'idempotent',true,'reason','duplicate_event');
  end if;
  select id into v_by_email from public.prospects where lower(email)=v_email limit 1;
  if nullif(btrim(coalesce(p_in_reply_to,'')),'') is not null then
    select prospect_id into v_by_message from public.outreach_events where provider_message_id=p_in_reply_to and type='sent' order by created_at desc limit 1;
  end if;
  if v_by_email is not null and v_by_message is not null and v_by_email<>v_by_message then return jsonb_build_object('matched',false,'reason','identity_conflict'); end if;
  v_id:=coalesce(v_by_message,v_by_email);
  if v_id is null then return jsonb_build_object('matched',false,'reason','prospect_not_found'); end if;
  select lower(email) into v_prospect_email from public.prospects where id=v_id;
  if v_email<>v_prospect_email then return jsonb_build_object('matched',false,'reason','sender_mismatch'); end if;
  v_suppress:=p_category in ('opt_out','not_interested');
  v_event_type:=case when p_category='opt_out' then 'opt_out' else 'replied' end;
  insert into public.outreach_events(prospect_id,type,provider_message_id,content,dedupe_key,metadata)
  values(v_id,v_event_type,v_source_message_id,left(coalesce(p_content,''),5000),p_dedupe_key,coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object('category',p_category,'sentiment',coalesce(p_sentiment,'neutral'),'received_at',p_received_at));
  update public.prospects set status=case when v_suppress then 'suppressed' else 'replied' end,last_reply_at=p_received_at,reply_category=p_category,updated_at=now() where id=v_id;
  if v_suppress then
    insert into public.suppressions(email,reason) values(v_prospect_email,case when p_category='opt_out' then 'opt_out' else 'refusal' end) on conflict(email) do update set reason=excluded.reason;
  end if;
  update public.outreach_queue set status='canceled',error='reply_received',updated_at=now() where prospect_id=v_id and status in ('queued','held','ready');
  return jsonb_build_object('matched',true,'idempotent',false,'prospect_id',v_id,'category',p_category,'suppressed',v_suppress);
exception when unique_violation then return jsonb_build_object('matched',true,'idempotent',true,'reason','duplicate_event');
end $$;
revoke all on function public.apply_outreach_reply(text,text,text,text,timestamptz,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.apply_outreach_reply(text,text,text,text,timestamptz,text,text,jsonb) to service_role;
