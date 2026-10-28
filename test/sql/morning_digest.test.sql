-- The digest can be claimed only once per account and per day.
insert into auth.users(id,email) values ('33333333-3333-4333-8333-333333333333','d@example.test');
insert into public.profiles(id,email) values ('33333333-3333-4333-8333-333333333333','d@example.test');
do $$ begin
  assert (select morning_digest_enabled from public.profiles where id='33333333-3333-4333-8333-333333333333'), 'enabled by default';
  insert into public.digest_sends(user_id,business_date,action_count) values ('33333333-3333-4333-8333-333333333333','2026-10-28',3);
  begin
    insert into public.digest_sends(user_id,business_date,action_count) values ('33333333-3333-4333-8333-333333333333','2026-10-28',3);
    raise exception 'expected duplicate digest to be rejected';
  exception when unique_violation then null;
  end;
end $$;
