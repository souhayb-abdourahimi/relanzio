-- Subscription period shown in the app ("Pro jusqu'au …" after a cancellation, renewal date).
-- Rollback: supabase/rollbacks/20261028120000_subscription_period.down.sql
alter table public.profiles add column if not exists subscription_current_period_end timestamptz;
alter table public.profiles add column if not exists subscription_cancel_at_period_end boolean not null default false;
-- Billing emails reuse lifecycle_messages(user_id,type) as a send-once claim; 'sending' marks an in-flight claim.
create index if not exists product_events_user_event_idx on public.product_events(user_id,event,created_at desc);
