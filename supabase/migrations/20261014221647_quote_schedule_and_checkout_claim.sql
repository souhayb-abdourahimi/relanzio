alter table public.quotes
  add column if not exists followup_schedule_mode text not null default 'recommended';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname='quotes_followup_schedule_mode_check'
      and conrelid='public.quotes'::regclass
  ) then
    alter table public.quotes
      add constraint quotes_followup_schedule_mode_check
      check (followup_schedule_mode in ('recommended','custom','none'));
  end if;
end $$;

alter table public.profiles
  add column if not exists checkout_claimed_at timestamptz;
