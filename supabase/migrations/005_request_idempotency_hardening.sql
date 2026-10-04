alter table public.quotes add column if not exists request_key text;
create unique index if not exists quotes_user_request_key_unique
  on public.quotes(user_id, request_key) where request_key is not null;

alter table public.followups add column if not exists request_key text;
create unique index if not exists followups_user_request_key_unique
  on public.followups(user_id, request_key) where request_key is not null;
