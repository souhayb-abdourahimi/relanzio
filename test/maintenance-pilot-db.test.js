import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync,readdirSync } from 'node:fs';
const migration=readFileSync(new URL('../supabase/migrations/'+readdirSync(new URL('../supabase/migrations/',import.meta.url)).find(n=>n.endsWith('_maintenance_pilot.sql')),import.meta.url),'utf8');
const op='11111111-1111-4111-8111-111111111111',other='22222222-2222-4222-8222-222222222222';
test('pilot database: ACL, CAS ownership, atomic payment replay, retention',async()=>{
 const db=new PGlite();
 try{
 await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
 await db.exec(migration);
 const insert=await db.query("insert into maintenance_pilot_cases(request_key,payload_hash,company,email,diagnostic) values('33333333-3333-4333-8333-333333333333','hash','Fixture','artisan@example.invalid','{}') returning id");const id=insert.rows[0].id;
 for(const role of ['anon','authenticated']){
 await db.exec(`set role ${role}`);
 await assert.rejects(db.query('select * from maintenance_pilot_cases'),/permission denied/);
 await assert.rejects(db.query("select maintenance_pilot_update($1,$2,0,'{}')",[id,op]),/permission denied/);
 await db.exec('reset role');}
 await db.query('update maintenance_pilot_cases set operator_id=$1 where id=$2',[op,id]);
 await assert.rejects(db.query("select maintenance_pilot_update($1,$2,0,'{}')",[id,other]),/CASE_CONFLICT/);
 await db.query("select maintenance_pilot_update($1,$2,0,'{}')",[id,op]);
 await assert.rejects(db.query("select maintenance_pilot_update($1,$2,0,'{}')",[id,op]),/CASE_CONFLICT/);
 // Two concurrent callers using the same revision: only one state transition wins.
 const races=await Promise.allSettled([db.query("select maintenance_pilot_update($1,$2,1,'{}')",[id,op]),db.query("select maintenance_pilot_update($1,$2,1,'{}')",[id,op])]);
 assert.equal(races.filter(x=>x.status==='fulfilled').length,1);
 assert.equal(races.filter(x=>x.status==='rejected').length,1);
 await assert.rejects(db.query("select maintenance_pilot_update($1,$2,2,$3)",[id,op,JSON.stringify({deliveries:[{address:'real@example.com',step:1,status:'simulated',at:'2026-11-01'}]})]),/check constraint/);
 assert.equal((await db.query('select revision from maintenance_pilot_cases where id=$1',[id])).rows[0].revision,2);
 await db.query("select maintenance_pilot_update($1,$2,2,$3)",[id,op,JSON.stringify({approved:true,version:1,campaign:{subject:'Fixture'}})]);
 const reservations=await Promise.all([db.query('select maintenance_pilot_checkout($1,$2,3)',[id,op]),db.query('select maintenance_pilot_checkout($1,$2,3)',[id,op])]);
 assert.equal((await db.query('select count(*)::int n from maintenance_pilot_payments')).rows[0].n,1);
 await assert.rejects(db.query("select maintenance_pilot_update($1,$2,3,$3)",[id,op,JSON.stringify({approved:true,version:2,campaign:{subject:'Changed'}})]),/CHECKOUT_FREEZES_CAMPAIGN/);
 await db.query("update maintenance_pilot_payments set session_id='cs_test_fixture' where case_id=$1",[id]);
 await assert.rejects(db.query("select maintenance_pilot_paid('evt_wrong','cs_test_unknown',$1)",[id]),/UNKNOWN_SESSION/);
 await db.query("select maintenance_pilot_paid('evt_fixture','cs_test_fixture',$1)",[id]);
 await db.query("select maintenance_pilot_paid('evt_fixture','cs_test_fixture',$1)",[id]);
 assert.equal((await db.query('select count(*)::int n from maintenance_pilot_events where event_key=$1',['evt_fixture'])).rows[0].n,1);
 assert.equal((await db.query('select paid from maintenance_pilot_payments')).rows[0].paid,true);
 await assert.rejects(db.query("insert into maintenance_pilot_deliveries(case_id,address,step,status,sent_at) values($1,'real@example.com',1,'simulated',now())",[id]),/check constraint/);
 await db.query("update maintenance_pilot_cases set created_at=now()-interval '8 days',diagnostic='{\"total\":5}' where id=$1",[id]);
 await db.query('select maintenance_pilot_purge()');
 assert.equal((await db.query('select diagnostic from maintenance_pilot_cases where id=$1',[id])).rows[0].diagnostic,null);
 await db.query("update maintenance_pilot_cases set created_at=now()-interval '31 days' where id=$1",[id]);
 await db.query('select maintenance_pilot_purge()');
 assert.equal((await db.query('select count(*)::int n from maintenance_pilot_cases')).rows[0].n,0);
 }finally{await db.close()}
});
