-- Rollback of 20261028120000_subscription_period.sql.
drop index if exists public.product_events_user_event_idx;
alter table public.profiles drop column if exists subscription_cancel_at_period_end;
alter table public.profiles drop column if exists subscription_current_period_end;
