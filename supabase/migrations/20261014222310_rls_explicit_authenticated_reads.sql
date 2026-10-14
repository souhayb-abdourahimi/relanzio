drop policy if exists "profiles own read" on public.profiles;
create policy "profiles own read" on public.profiles for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "quotes own read" on public.quotes;
create policy "quotes own read" on public.quotes for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "followups own read" on public.followups;
create policy "followups own read" on public.followups for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "tickets own read" on public.support_tickets;
create policy "tickets own read" on public.support_tickets for select to authenticated using ((select auth.uid()) = user_id);
