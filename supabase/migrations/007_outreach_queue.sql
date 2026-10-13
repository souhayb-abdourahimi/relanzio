create table if not exists public.outreach_queue (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  sequence_step integer not null default 0 check (sequence_step between 0 and 2),
  scheduled_at timestamptz not null,
  status text not null default 'queued' check (status in ('queued','sending','sent','held','skipped','failed','canceled')),
  subject text not null,
  content text not null,
  provider_message_id text,
  sent_at timestamptz,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (prospect_id, sequence_step)
);

create index if not exists outreach_queue_due_idx on public.outreach_queue(status, scheduled_at);
create index if not exists outreach_queue_prospect_idx on public.outreach_queue(prospect_id, sequence_step);

alter table public.outreach_queue enable row level security;
revoke all on table public.outreach_queue from anon, authenticated;