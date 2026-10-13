alter table public.profiles
  add column if not exists trial_started_at timestamptz,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists trial_expired_at timestamptz;

create table if not exists public.trial_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('activated','expired')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists trial_events_user_created_idx
  on public.trial_events(user_id, created_at desc);

alter table public.trial_events enable row level security;
revoke all on table public.trial_events from anon, authenticated;
