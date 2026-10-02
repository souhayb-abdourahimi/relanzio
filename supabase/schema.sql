-- Relanzio schema v0.3 — fresh Supabase project
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null, company_name text, role text,
  plan text not null default 'free' check (plan in ('free','pro')),
  subscription_status text not null default 'none' check (subscription_status in ('none','trialing','active','past_due','canceled','unpaid')),
  email_mode text not null default 'review' check (email_mode in ('review','automatic')),
  onboarding_completed boolean not null default false,
  marketing_opt_in boolean not null default false,
  activated_at timestamptz, stripe_customer_id text unique, stripe_subscription_id text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  client_name text not null, client_email text not null, title text not null,
  amount numeric(12,2) not null default 0 check (amount >= 0), sent_at date not null,
  status text not null default 'open' check (status in ('open','won','lost','paused')),
  auto_send boolean not null default false, followup_step integer not null default 0 check (followup_step between 0 and 3),
  next_followup_at timestamptz, send_claimed_at timestamptz, won_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.followups (
  id uuid primary key default gen_random_uuid(), quote_id uuid not null references public.quotes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, step integer not null, subject text not null, body text not null default '',
  status text not null check (status in ('sent','delivered','opened','clicked','bounced','failed','draft')),
  provider_message_id text, error text, sent_at timestamptz, created_at timestamptz not null default now()
);

create table if not exists public.product_events (
  id bigint generated always as identity primary key, user_id uuid references auth.users(id) on delete cascade,
  anonymous_id text, event text not null, path text, metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.system_events (
  id bigint generated always as identity primary key, level text not null default 'error', scope text not null,
  message text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create table if not exists public.lifecycle_messages (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  type text not null, status text not null default 'sent', sent_at timestamptz, created_at timestamptz not null default now(), unique(user_id,type)
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null default 'product', subject text not null, message text not null,
  status text not null default 'open' check (status in ('open','in_progress','resolved','closed')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(), company_name text not null, contact_name text,
  email text not null unique, role text, website text, source text, source_url text,
  lawful_basis text not null default 'professional_relevance', employee_count integer, estimated_quotes_per_month integer,
  uses_digital_tools boolean not null default false, is_service_business boolean not null default true,
  score integer not null default 0 check (score between 0 and 100), score_reasons jsonb not null default '[]'::jsonb,
  status text not null default 'new' check (status in ('new','qualified','contacted','replied','meeting','pilot','customer','not_now','not_interested','suppressed')),
  last_contacted_at timestamptz, next_contact_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index if not exists prospects_email_lower_unique on public.prospects(lower(email));

create table if not exists public.suppressions (
  email text primary key, reason text not null default 'opt_out', created_at timestamptz not null default now()
);
create table if not exists public.outreach_events (
  id uuid primary key default gen_random_uuid(), prospect_id uuid not null references public.prospects(id) on delete cascade,
  type text not null check (type in ('sent','delivered','opened','clicked','replied','bounced','opt_out','meeting','note')),
  provider_message_id text, subject text, content text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.feedback_insights (
  id uuid primary key default gen_random_uuid(), prospect_id uuid references public.prospects(id) on delete set null,
  source text not null default 'reply', category text not null, sentiment text, confidence numeric(4,3), summary text,
  objection text, requested_feature text, needs_human boolean not null default true, raw_text text, created_at timestamptz not null default now()
);

create index if not exists quotes_user_id_idx on public.quotes(user_id);
create index if not exists quotes_due_idx on public.quotes(status, auto_send, next_followup_at);
create index if not exists followups_quote_id_idx on public.followups(quote_id);
create unique index if not exists followups_quote_step_unique on public.followups(quote_id, step);
create index if not exists product_events_event_idx on public.product_events(event, created_at desc);
create index if not exists system_events_created_idx on public.system_events(created_at desc);
create index if not exists support_user_idx on public.support_tickets(user_id, created_at desc);
create index if not exists prospects_status_score_idx on public.prospects(status, score desc);
create index if not exists outreach_prospect_idx on public.outreach_events(prospect_id, created_at desc);
create index if not exists feedback_category_idx on public.feedback_insights(category, created_at desc);

alter table public.profiles enable row level security; alter table public.quotes enable row level security;
alter table public.followups enable row level security; alter table public.product_events enable row level security;
alter table public.support_tickets enable row level security; alter table public.system_events enable row level security; alter table public.lifecycle_messages enable row level security; alter table public.prospects enable row level security;
alter table public.suppressions enable row level security; alter table public.outreach_events enable row level security;
alter table public.feedback_insights enable row level security;

drop policy if exists "profiles own read" on public.profiles; create policy "profiles own read" on public.profiles for select using (auth.uid() = id);
drop policy if exists "quotes own read" on public.quotes; create policy "quotes own read" on public.quotes for select using (auth.uid() = user_id);
drop policy if exists "followups own read" on public.followups; create policy "followups own read" on public.followups for select using (auth.uid() = user_id);
drop policy if exists "tickets own read" on public.support_tickets; create policy "tickets own read" on public.support_tickets for select using (auth.uid() = user_id);
-- Founder CRM and analytics: no browser policies; service role/admin API only.

-- v0.4 pilot hardening: the browser uses Supabase only for Auth.
-- Keep Data API privileges minimal; server-side service_role retains full access and bypasses RLS.
revoke all on table public.profiles, public.quotes, public.followups, public.product_events,
  public.system_events, public.lifecycle_messages, public.support_tickets, public.prospects,
  public.suppressions, public.outreach_events, public.feedback_insights from anon, authenticated;

grant select on table public.profiles, public.quotes, public.followups, public.support_tickets to authenticated;

-- Policies are intentionally read-only. All mutations go through the authenticated Relanzio API,
-- which scopes user-owned resources by req.user.id. Founder/system tables have no browser grants.
