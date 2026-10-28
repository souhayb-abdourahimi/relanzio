import test from 'node:test';
import assert from 'node:assert/strict';
import { digestItems, buildDigest, runMorningDigest, isDigestDay } from '../server/morning-digest.js';
import { verifyEmailLink } from '../server/email-links.js';
import { createFakeDb } from './helpers/fake-db.js';

const NOW=new Date('2026-10-28T06:30:00.000Z'); // Wednesday 07:30 Paris
const ENV={MORNING_DIGEST_ENABLED:'true',EMAIL_LINK_SECRET:'s'.repeat(32),APP_URL:'https://relanzio.test'};
const q=(id,next,extra={})=>({id,client_name:`Client ${id}`,title:`Devis ${id}`,amount:1000,status:'open',followup_step:0,next_followup_at:next,created_at:'2026-10-01T08:00:00Z',...extra});

test('digest only lists usable open quotes due today or earlier, late first',()=>{
  const items=digestItems([
    q('today','2026-10-28T08:00:00Z',{amount:2100}),
    q('late','2026-10-25T08:00:00Z',{amount:4800,followup_step:1}),
    q('tomorrow','2026-10-29T08:00:00Z'),
    q('terminal',null,{followup_step:3,amount:9400}),
    q('paused','2026-10-20T08:00:00Z',{status:'paused'}),
  ],NOW);
  assert.deepEqual(items.map(x=>x.quote.id),['late','terminal','today']);
  assert.equal(items[0].lateDays,3);
});

test('digest subject and body follow the expected format',()=>{
  const items=digestItems([q('a','2026-10-28T08:00:00Z',{amount:4800}),q('b','2026-10-27T08:00:00Z',{amount:2100,followup_step:1}),q('c',null,{amount:2500,followup_step:3})],NOW);
  const d=buildDigest({profile:{company_name:'Toitures Martin'},items,appUrl:'https://relanzio.test',unsubscribeUrl:'https://relanzio.test/api/email/unsubscribe?t=x'});
  assert.equal(d.subject,'3 relances aujourd’hui · 9 400 € en jeu');
  assert.match(d.text,/• Client b — Devis b \(2 100 €\) · relance 2\/3 · en retard de 1 j/);
  assert.match(d.text,/https:\/\/relanzio\.test\/\?from=digest/);
  assert.match(d.text,/Ne plus le recevoir : https:\/\/relanzio\.test\/api\/email\/unsubscribe\?t=x/);
});

test('weekends get no digest',()=>{
  assert.equal(isDigestDay(new Date('2026-10-31T06:30:00Z')),false);
  assert.equal(isDigestDay(NOW),true);
});

function setup(quotes,profile={}){
  const db=createFakeDb({
    profiles:[{id:'u1',email:'artisan@example.test',company_name:'Toitures Martin',morning_digest_enabled:true,onboarding_completed:true,plan:'free',subscription_status:'none',...profile}],
    quotes:quotes.map(x=>({...x,user_id:'u1'}))
  },{digest_sends:['user_id','business_date']});
  const sent=[];
  return {db,sent,run:(env=ENV,now=NOW)=>runMorningDigest({db,sendEmail:async m=>{sent.push(m);},env,now})};
}

test('sent once per day, only when there is an action, with a working unsubscribe link',async()=>{
  const s=setup([q('a','2026-10-28T08:00:00Z')]);
  await s.run();await s.run();
  assert.equal(s.sent.length,1);
  assert.equal(s.db.tables.digest_sends[0].status,'sent');
  const token=decodeURIComponent(s.sent[0].text.match(/unsubscribe\?t=([^\s]+)/)[1]);
  assert.deepEqual(verifyEmailLink(token,'digest_optout',ENV.EMAIL_LINK_SECRET),{p:'digest_optout',u:'u1',e:'artisan@example.test'});
  assert.match(s.sent[0].headers['List-Unsubscribe'],/^<https:\/\/relanzio\.test\/api\/email\/unsubscribe\?t=/);
});

test('no email when nothing is due, when disabled globally or by the user',async()=>{
  let s=setup([q('a','2026-10-30T08:00:00Z')]);await s.run();assert.equal(s.sent.length,0);
  s=setup([q('a','2026-10-28T08:00:00Z')]);assert.deepEqual(await s.run({...ENV,MORNING_DIGEST_ENABLED:'false'}),[{skipped:'morning_digest_disabled'}]);assert.equal(s.sent.length,0);
  s=setup([q('a','2026-10-28T08:00:00Z')],{morning_digest_enabled:false});await s.run();assert.equal(s.sent.length,0);
});

test('a failed send releases the claim so the next run can retry',async()=>{
  const s=setup([q('a','2026-10-28T08:00:00Z')]);
  const r=await runMorningDigest({db:s.db,sendEmail:async()=>{throw new Error('Brevo 503: down')},env:ENV,now:NOW});
  assert.match(r[0].error,/Brevo 503/);
  assert.equal((s.db.tables.digest_sends||[]).length,0);
  await s.run();
  assert.equal(s.sent.length,1);
});
