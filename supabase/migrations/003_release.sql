-- Upgrade v0.2 -> v0.3. Back up the database before running.
alter table public.profiles add column if not exists subscription_status text not null default 'none';
alter table public.profiles add column if not exists marketing_opt_in boolean not null default false;
alter table public.profiles add column if not exists activated_at timestamptz;
alter table public.followups add column if not exists provider_message_id text;
alter table public.prospects add column if not exists source_url text;
alter table public.prospects add column if not exists lawful_basis text not null default 'professional_relevance';
-- Emails are normalized by the API. Remove duplicates manually if this fails.
create unique index if not exists prospects_email_plain_unique on public.prospects(email);

create table if not exists public.product_events (id bigint generated always as identity primary key,user_id uuid references auth.users(id) on delete cascade,anonymous_id text,event text not null,path text,metadata jsonb not null default '{}'::jsonb,created_at timestamptz not null default now());
create table if not exists public.support_tickets (id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,topic text not null default 'product',subject text not null,message text not null,status text not null default 'open',priority text not null default 'normal',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
alter table public.product_events enable row level security; alter table public.support_tickets enable row level security;
drop policy if exists "tickets own read" on public.support_tickets; create policy "tickets own read" on public.support_tickets for select using (auth.uid()=user_id);

create table if not exists public.lifecycle_messages (id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,type text not null,status text not null default 'sent',sent_at timestamptz,created_at timestamptz not null default now(),unique(user_id,type));
alter table public.lifecycle_messages enable row level security;

create table if not exists public.system_events (id bigint generated always as identity primary key,level text not null default 'error',scope text not null,message text not null,metadata jsonb not null default '{}'::jsonb,created_at timestamptz not null default now());
alter table public.system_events enable row level security;
create index if not exists system_events_created_idx on public.system_events(created_at desc);

alter table public.quotes add column if not exists send_claimed_at timestamptz;

create unique index if not exists followups_quote_step_unique on public.followups(quote_id,step);
