create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

alter table public.stripe_webhook_events enable row level security;
revoke all on table public.stripe_webhook_events from anon, authenticated;
