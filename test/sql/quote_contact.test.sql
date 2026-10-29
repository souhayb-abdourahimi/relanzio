-- Phone-only quotes are accepted; quotes without any contact are rejected.
insert into auth.users(id,email) values ('11111111-1111-4111-8111-111111111111','a@example.test');
do $$
declare r jsonb;
begin
  r:=public.create_quote_with_quota('11111111-1111-4111-8111-111111111111',5,'Mme Leroy',null,'Gouttières',1850,current_date,'k1',false,0,'recommended',now()+interval '2 days','06 11 22 33 44','Attend l''accord du conjoint');
  assert r->'quote'->>'client_email' is null, 'email stays null';
  assert r->'quote'->>'client_phone'='06 11 22 33 44', 'phone stored';
  assert r->'quote'->>'note'='Attend l''accord du conjoint', 'note stored';
  r:=public.create_quote_with_quota('11111111-1111-4111-8111-111111111111',5,'Mme Leroy',null,'Gouttières',1850,current_date,'k1',false,0,'recommended',now(),'06',null);
  assert (r->>'idempotent')::boolean, 'request key stays idempotent';
  begin
    perform public.create_quote_with_quota('11111111-1111-4111-8111-111111111111',5,'Sans contact','  ','X',1,current_date,'k2',false,0,'recommended',now(),'',null);
    raise exception 'expected contact check violation';
  exception when check_violation then null;
  end;
  r:=public.create_quote_with_quota('11111111-1111-4111-8111-111111111111',5,'Legacy','x@example.test','Y',1,current_date,'k3',false,0,'recommended',now());
  assert r->'quote'->>'client_email'='x@example.test', 'legacy 12-arg call still works';
end $$;
