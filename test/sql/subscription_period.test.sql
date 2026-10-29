-- The past_due grace anchor (period start) and the cancellation fields exist and default safely.
insert into auth.users(id,email) values ('44444444-4444-4444-8444-444444444444','e@example.test');
insert into public.profiles(id,email,plan,subscription_status,subscription_current_period_start,subscription_current_period_end)
values ('44444444-4444-4444-8444-444444444444','e@example.test','pro','past_due','2026-12-01 00:00+00','2027-01-01 00:00+00');
do $$ begin
  assert (select subscription_current_period_start from public.profiles where id='44444444-4444-4444-8444-444444444444')='2026-12-01 00:00+00';
  assert (select subscription_cancel_at_period_end from public.profiles where id='44444444-4444-4444-8444-444444444444')=false;
end $$;
