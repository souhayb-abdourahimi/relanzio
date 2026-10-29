-- Morning digest: service email at 07:30 Paris on business days, only when there is something to do.
-- Rollback: supabase/rollbacks/20261028130000_morning_digest.down.sql
alter table public.profiles add column if not exists morning_digest_enabled boolean not null default true;

-- One digest per account and per Paris business day, enforced by the primary key (claimed before sending).
create table if not exists public.digest_sends (
  user_id uuid not null references auth.users(id) on delete cascade,
  business_date date not null,
  status text not null default 'sending' check (status in ('sending','sent')),
  action_count integer not null default 0,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  primary key (user_id,business_date)
);
alter table public.digest_sends enable row level security;
revoke all on table public.digest_sends from anon, authenticated;
