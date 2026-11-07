-- Run only via the throwaway SQL test harness. No production data or service credentials.
begin;
insert into auth.users(id,email) values ('77777777-7777-4777-8777-777777777777','stripe-retry@example.test');
insert into public.profiles(id,email,plan,subscription_status,stripe_customer_id,stripe_subscription_id,stripe_state_event_created)
values ('77777777-7777-4777-8777-777777777777','stripe-retry@example.test','free','none','cus_retry_test','sub_retry_test',0);
insert into public.stripe_webhook_events(event_id,event_type,created_at)
values ('evt_retry_sql','invoice.paid','2026-11-07T10:00:00.000Z');
do $$
declare affected integer;
begin
  begin
    insert into public.stripe_webhook_events(event_id,event_type) values ('evt_retry_sql','invoice.paid');
    raise exception 'duplicate event was accepted';
  exception when unique_violation then null;
  end;
  assert (select processed_at is null from public.stripe_webhook_events where event_id='evt_retry_sql');
  -- Reclaim an interrupted attempt; ISO timestamps must compare correctly with timestamptz.
  update public.stripe_webhook_events set created_at='2026-11-07T10:06:00.000Z'
    where event_id='evt_retry_sql' and created_at='2026-11-07T10:00:00.000Z' and processed_at is null;
  get diagnostics affected = row_count;
  assert affected=1;
  -- The previous owner cannot complete or delete the replacement's claim.
  update public.stripe_webhook_events set processed_at=now()
    where event_id='evt_retry_sql' and created_at='2026-11-07T10:00:00.000Z' and processed_at is null;
  get diagnostics affected = row_count;
  assert affected=0;
  delete from public.stripe_webhook_events
    where event_id='evt_retry_sql' and created_at='2026-11-07T10:00:00.000Z' and processed_at is null;
  get diagnostics affected = row_count;
  assert affected=0;
  -- A cancellation written by a competing worker invalidates an earlier profile snapshot,
  -- even when both Stripe events have exactly the same timestamp.
  update public.profiles set subscription_status='canceled',stripe_state_event_created=100
    where id='77777777-7777-4777-8777-777777777777';
  update public.profiles set plan='pro',subscription_status='active',stripe_state_event_created=100
    where id='77777777-7777-4777-8777-777777777777' and subscription_status='none' and stripe_state_event_created=0;
  get diagnostics affected = row_count;
  assert affected=0;
  assert (select plan='free' from public.profiles where id='77777777-7777-4777-8777-777777777777');
  update public.stripe_webhook_events set processed_at=now()
    where event_id='evt_retry_sql' and created_at='2026-11-07T10:06:00.000Z' and processed_at is null;
  get diagnostics affected = row_count;
  assert affected=1;
  -- Lost completion response: cleanup must preserve durable success.
  delete from public.stripe_webhook_events
    where event_id='evt_retry_sql' and created_at='2026-11-07T10:06:00.000Z' and processed_at is null;
  get diagnostics affected = row_count;
  assert affected=0;
end $$;
rollback;
