-- Subscription period from Stripe: "Pro jusqu'au …" after a cancellation, and the anchor of the past_due
-- grace period (Pro kept until current_period_start + 14 days, see server/entitlements.js).
-- Rollback: supabase/rollbacks/20261028120000_subscription_period.down.sql
alter table public.profiles add column if not exists subscription_current_period_start timestamptz;
alter table public.profiles add column if not exists subscription_current_period_end timestamptz;
alter table public.profiles add column if not exists subscription_cancel_at_period_end boolean not null default false;
-- Billing emails reuse lifecycle_messages(user_id,type) as a send-once claim; 'sending' marks an in-flight claim.
create index if not exists product_events_user_event_idx on public.product_events(user_id,event,created_at desc);
