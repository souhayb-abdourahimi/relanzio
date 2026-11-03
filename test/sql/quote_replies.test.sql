-- A client reply stops the sequence: no confirm, no schedule after an in-flight send, idempotent, per user.
insert into auth.users(id,email) values
  ('57575757-5757-4757-8757-575757575757','r@example.test'),
  ('68686868-6868-4868-8868-686868686868','other@example.test');
insert into public.profiles(id,email) values
  ('57575757-5757-4757-8757-575757575757','r@example.test'),
  ('68686868-6868-4868-8868-686868686868','other@example.test');
insert into public.quotes(id,user_id,client_name,client_email,title,amount,sent_at,status,followup_step,followup_schedule_mode,next_followup_at,auto_send)
values
  ('c7c7c7c7-0000-4000-8000-000000000001','57575757-5757-4757-8757-575757575757','Durand','d@example.test','Toiture',4800,'2026-10-20','open',1,'recommended','2026-10-30 08:00+00',true),
  ('c7c7c7c7-0000-4000-8000-000000000002','57575757-5757-4757-8757-575757575757','Benali','b@example.test','Cuisine',9000,'2026-10-20','won',1,'none',null,false),
  ('c7c7c7c7-0000-4000-8000-000000000003','57575757-5757-4757-8757-575757575757','Martin','m@example.test','Peinture',1200,'2026-10-20','paused',0,'recommended','2026-10-30 08:00+00',false),
  ('c7c7c7c7-0000-4000-8000-000000000004','57575757-5757-4757-8757-575757575757','Robert','r2@example.test','Fenêtres',3000,'2026-10-20','open',0,'recommended','2026-10-30 08:00+00',true),
  ('c7c7c7c7-0000-4000-8000-000000000005','57575757-5757-4757-8757-575757575757','Garnier','g@example.test','Tableau',900,'2026-10-20','open',0,'recommended','2026-10-30 08:00+00',true);
do $$
declare r jsonb; n int;
begin
  -- 1. Reply on an open quote: stops everything and is recorded once.
  r:=public.apply_quote_reply('c7c7c7c7-0000-4000-8000-000000000001','57575757-5757-4757-8757-575757575757',null,'email','email','interested','stop','D@Example.test','Oui c''est d''accord','email:<m1@x>','2026-10-29 10:00+00');
  assert (r->>'ok')::boolean and (r->>'stopped')::boolean and not (r->>'duplicate')::boolean, r::text;
  assert r->'quote'->>'reply_received_at' is not null and r->'quote'->>'next_followup_at' is null
     and r->'quote'->>'followup_schedule_mode'='none' and not (r->'quote'->>'auto_send')::boolean, r::text;
  assert r->'reply'->>'from_email'='d@example.test', r::text;
  -- 2. Same message again (IMAP re-poll): duplicate, nothing changes.
  r:=public.apply_quote_reply('c7c7c7c7-0000-4000-8000-000000000001','57575757-5757-4757-8757-575757575757',null,'email','email','interested','stop','d@example.test','Oui','email:<m1@x>','2026-10-29 10:00+00');
  assert (r->>'duplicate')::boolean and not (r->>'stopped')::boolean, r::text;
  select count(*) into n from public.quote_replies where quote_id='c7c7c7c7-0000-4000-8000-000000000001';
  assert n=1, 'one reply row expected, got '||n;
  -- 3. After a reply, marking a follow-up as done is refused.
  r:=public.confirm_manual_followup('c7c7c7c7-0000-4000-8000-000000000001','57575757-5757-4757-8757-575757575757',2,'','','k-after-reply','2026-10-29 11:00+00');
  assert not (r->>'ok')::boolean and r->>'code'='QUOTE_REPLIED', r::text;
  -- 4. Reply on a won quote: remembered as answered (reopening cannot follow up), status, step and dates untouched.
  r:=public.apply_quote_reply('c7c7c7c7-0000-4000-8000-000000000002','57575757-5757-4757-8757-575757575757',null,'email','email','received','stop','b@example.test','Merci','email:<m2@x>','2026-10-29 10:00+00');
  assert (r->>'ok')::boolean and not (r->>'stopped')::boolean and r->'quote'->>'status'='won' and r->'quote'->>'reply_received_at' is not null
    and r->'quote'->>'followup_step'='1' and r->'quote'->>'next_followup_at' is null and (r->'quote'->>'sent_at')::date='2026-10-20', r::text;
  assert (r->'reply'->>'forward_attempts')::int=0 and r->'reply'->>'notified_at' is null, r::text;
  -- 5. Reply on a paused quote: stops it too (resuming later cannot send to a client who answered).
  r:=public.apply_quote_reply('c7c7c7c7-0000-4000-8000-000000000003','57575757-5757-4757-8757-575757575757',null,'manual','phone','received','stop',null,null,'manual:k5','2026-10-29 10:00+00');
  assert (r->>'stopped')::boolean and r->'quote'->>'status'='paused' and r->'quote'->>'next_followup_at' is null, r::text;
  -- 6. Out-of-office: recorded only. Delivery failure: automatic sending off, schedule kept.
  r:=public.apply_quote_reply('c7c7c7c7-0000-4000-8000-000000000004','57575757-5757-4757-8757-575757575757',null,'email','email','auto_reply','record','r2@example.test','Absent','email:<m4@x>','2026-10-29 10:00+00');
  assert not (r->>'stopped')::boolean and r->'quote'->>'reply_received_at' is null and (r->'quote'->>'auto_send')::boolean, r::text;
  r:=public.apply_quote_reply('c7c7c7c7-0000-4000-8000-000000000004','57575757-5757-4757-8757-575757575757',null,'email','email','bounce','disable_auto',null,null,'email:<m5@x>','2026-10-29 10:05+00');
  assert not (r->'quote'->>'auto_send')::boolean and r->'quote'->>'next_followup_at' is not null and r->'quote'->>'reply_received_at' is null, r::text;
  -- 7. Another user cannot touch this quote.
  r:=public.apply_quote_reply('c7c7c7c7-0000-4000-8000-000000000005','68686868-6868-4868-8868-686868686868',null,'manual','phone','received','stop',null,null,'manual:x','2026-10-29 10:00+00');
  assert not (r->>'ok')::boolean and r->>'code'='QUOTE_NOT_FOUND', r::text;
  -- 8. Reply arrives while a Relanzio email is being sent: the email is recorded as sent, nothing is scheduled after it.
  insert into public.followups(id,quote_id,user_id,step,subject,body,status,channel,business_date,reply_token)
  values ('d7d7d7d7-0000-4000-8000-000000000005','c7c7c7c7-0000-4000-8000-000000000005','57575757-5757-4757-8757-575757575757',1,'s','b','draft','relanzio','2026-10-30','tok5');
  update public.quotes set send_claimed_at='2026-10-30 08:00+00' where id='c7c7c7c7-0000-4000-8000-000000000005';
  r:=public.apply_quote_reply('c7c7c7c7-0000-4000-8000-000000000005','57575757-5757-4757-8757-575757575757',null,'email','email','question','stop','g@example.test','Une question','email:<m6@x>','2026-10-30 08:00:30+00');
  assert (r->>'stopped')::boolean, r::text;
  r:=public.finalize_relanzio_followup('d7d7d7d7-0000-4000-8000-000000000005','c7c7c7c7-0000-4000-8000-000000000005','57575757-5757-4757-8757-575757575757',0,'2026-10-30 08:01+00','msg-5');
  assert (r->>'ok')::boolean and r->'followup'->>'status'='sent', r::text;
  assert r->'quote'->>'next_followup_at' is null and r->'quote'->>'followup_schedule_mode'='none' and r->'quote'->>'reply_received_at' is not null, r::text;
  -- 9. Reply tokens are unique.
  begin
    insert into public.followups(quote_id,user_id,step,subject,body,status,channel,business_date,reply_token)
    values ('c7c7c7c7-0000-4000-8000-000000000004','57575757-5757-4757-8757-575757575757',1,'s','b','draft','relanzio','2026-10-31','tok5');
    raise exception 'expected unique reply token';
  exception when unique_violation then null;
  end;
  -- 10. Weekend skip.
  assert public.skip_weekend('2026-10-31')='2026-11-02' and public.skip_weekend('2026-11-01')='2026-11-02' and public.skip_weekend('2026-11-03')='2026-11-03';
end $$;
