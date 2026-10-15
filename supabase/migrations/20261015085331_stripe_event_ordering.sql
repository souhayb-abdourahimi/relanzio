alter table public.profiles add column if not exists stripe_state_event_created bigint not null default 0;
