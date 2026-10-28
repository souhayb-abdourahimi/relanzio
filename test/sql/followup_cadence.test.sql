-- Next follow-up is computed from the day the previous one was done, with the account cadence.
insert into auth.users(id,email) values ('22222222-2222-4222-8222-222222222222','c@example.test');
insert into public.profiles(id,email,followup_offsets) values ('22222222-2222-4222-8222-222222222222','c@example.test','{3,7,14}');
insert into public.quotes(id,user_id,client_name,client_email,title,amount,sent_at,followup_step,followup_schedule_mode,next_followup_at)
values ('aaaaaaaa-0000-4000-8000-000000000001','22222222-2222-4222-8222-222222222222','Dupont','d@example.test','Toiture',4800,'2026-09-01',0,'recommended','2026-09-04 07:00+00');
do $$
declare r jsonb;
begin
  -- Relance 1 done on 28 Oct (late): relance 2 = 28 Oct + (7-3) days, 09:00 Paris — not 1 Sept + 7.
  r:=public.confirm_manual_followup('aaaaaaaa-0000-4000-8000-000000000001','22222222-2222-4222-8222-222222222222',1,'','','k1','2026-10-28 15:00+00');
  assert (r->>'ok')::boolean, r::text;
  assert (r->'quote'->>'next_followup_at')::timestamptz='2026-11-01 08:00+00', r->'quote'->>'next_followup_at';
  -- Same request key twice is idempotent and does not advance again.
  r:=public.confirm_manual_followup('aaaaaaaa-0000-4000-8000-000000000001','22222222-2222-4222-8222-222222222222',1,'','','k1','2026-10-28 15:05+00');
  assert (r->>'idempotent')::boolean and (r->'quote'->>'followup_step')::int=1, r::text;
  -- Relance 2 sent by Relanzio on 2 Nov: relance 3 = 2 Nov + (14-7).
  insert into public.followups(id,quote_id,user_id,step,subject,body,status,channel,business_date)
  values ('bbbbbbbb-0000-4000-8000-000000000002','aaaaaaaa-0000-4000-8000-000000000001','22222222-2222-4222-8222-222222222222',2,'s','b','draft','relanzio','2026-11-02');
  r:=public.finalize_relanzio_followup('bbbbbbbb-0000-4000-8000-000000000002','aaaaaaaa-0000-4000-8000-000000000001','22222222-2222-4222-8222-222222222222',1,'2026-11-02 09:30+00','msg-1');
  assert (r->>'ok')::boolean, r::text;
  assert (r->'quote'->>'next_followup_at')::timestamptz='2026-11-09 08:00+00', r->'quote'->>'next_followup_at';
  -- A second Relanzio email to the same quote on the same Paris day is refused by the database.
  begin
    insert into public.followups(quote_id,user_id,step,subject,body,status,channel,business_date)
    values ('aaaaaaaa-0000-4000-8000-000000000001','22222222-2222-4222-8222-222222222222',3,'s','b','draft','relanzio','2026-11-02');
    raise exception 'expected one-send-per-day unique violation';
  exception when unique_violation then null;
  end;
  -- Last relance: the sequence ends and asks for a decision (no next date).
  r:=public.confirm_manual_followup('aaaaaaaa-0000-4000-8000-000000000001','22222222-2222-4222-8222-222222222222',3,'','','k3','2026-11-09 10:00+00');
  assert (r->'quote'->>'followup_step')::int=3 and r->'quote'->>'next_followup_at' is null and r->'quote'->>'followup_schedule_mode'='none', r::text;
  -- Invalid cadences are rejected.
  begin
    update public.profiles set followup_offsets='{5,3,10}' where id='22222222-2222-4222-8222-222222222222';
    raise exception 'expected cadence check violation';
  exception when check_violation then null;
  end;
  -- Default cadence for accounts that never changed it: gaps 3 then 5.
  assert public.followup_gap_days('00000000-0000-4000-8000-00000000ffff',1)=3;
end $$;
