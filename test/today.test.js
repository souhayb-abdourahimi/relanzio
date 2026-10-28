import test from 'node:test';
import assert from 'node:assert/strict';
import { actionMeta,buildTodayGroups,actionStageLabel,addParisDaysIso,parisDateKey } from '../client/src/today.js';

const now=new Date('2026-10-16T10:00:00.000Z');
const q=(id,next,step=0,status='open')=>({id,status,followup_step:step,next_followup_at:next,client_name:id,title:id,amount:100});

test('Today groups overdue, today, future and terminal decisions',()=>{
  const groups=buildTodayGroups([
    q('late-2','2026-10-14T07:00:00.000Z'),
    q('late-1','2026-10-15T07:00:00.000Z'),
    q('today','2026-10-16T16:00:00.000Z',1),
    q('future','2026-10-20T07:00:00.000Z',2),
    q('terminal',null,3),
    q('terminal-later','2026-10-22T07:00:00.000Z',3),
    q('paused','2026-10-14T07:00:00.000Z',0,'paused')
  ],now);
  assert.deepEqual(groups.overdue.map(x=>x.id),['late-2','late-1']);
  assert.deepEqual(groups.today.map(x=>x.id),['today']);
  // Three follow-ups without answer and no new date: its own "À appeler ou décider" group, not mixed with today's relances.
  assert.deepEqual(groups.call.map(x=>x.id),['terminal']);
  assert.deepEqual(groups.future.map(x=>x.id),['future','terminal-later']);
  assert.equal(groups.overdue[0].action_meta.daysOverdue,2);
  assert.equal(actionStageLabel(groups.call[0]),'3 relances sans réponse : un appel, ou décidez gagné / perdu');
  assert.equal(actionStageLabel(groups.today[0]),'Relance 2/3');
});

test('Today classification uses Paris calendar before and after midnight',()=>{
  assert.equal(parisDateKey('2026-10-16T21:59:00.000Z'),'2026-10-16');
  assert.equal(parisDateKey('2026-10-16T22:01:00.000Z'),'2026-10-17');
  assert.equal(actionMeta(q('today','2026-10-16T21:00:00.000Z'),new Date('2026-10-16T20:00:00.000Z')).bucket,'today');
});

test('postpone creates a Paris-local 09:00 date across DST',()=>{
  assert.equal(addParisDaysIso(3,new Date('2026-10-23T10:00:00.000Z')),'2026-10-26T08:00:00.000Z');
});

test('100 active quotes group and sort without mutation',()=>{
  const source=Array.from({length:100},(_,i)=>q('q'+i,new Date(now.getTime()+(i-20)*86400000).toISOString(),i%3));
  const before=source.map(x=>x.id).join(',');
  const started=performance.now();
  const groups=buildTodayGroups(source,now);
  const elapsed=performance.now()-started;
  assert.equal(groups.overdue.length+groups.today.length+groups.future.length,100);
  assert.equal(source.map(x=>x.id).join(','),before);
  assert.ok(elapsed<1000);
});

test('Today labels, contact links and pipeline order',async()=>{
  const { overdueLabel,parisDateToFollowupIso,lastFollowup,mailtoHref,smsHref,telHref,sortPipeline }=await import('../client/src/today.js');
  assert.equal(overdueLabel(3),'en retard de 3 j');
  assert.equal(overdueLabel(0),'');
  assert.equal(parisDateToFollowupIso('2026-11-02'),'2026-11-02T08:00:00.000Z');
  assert.equal(parisDateToFollowupIso('02/11/2026'),null);
  assert.equal(lastFollowup({followups:[{id:'a',status:'sent',sent_at:'2026-10-01T08:00:00Z'},{id:'b',status:'sent',sent_at:'2026-10-05T08:00:00Z'},{id:'c',status:'failed',sent_at:'2026-10-09T08:00:00Z'}]}).id,'b');
  assert.equal(mailtoHref('a@b.fr','Suivi — Devis','Bonjour,\nOK'),'mailto:a@b.fr?subject=Suivi%20%E2%80%94%20Devis&body=Bonjour%2C%0AOK');
  assert.equal(smsHref('06 12 34 56 78','Bonjour'),'sms:0612345678?&body=Bonjour');
  assert.equal(telHref('+33 6 12 34 56 78'),'tel:+33612345678');
  assert.equal(telHref(''),'');
  const sorted=sortPipeline([{id:'won',status:'won'},{id:'later',status:'open',next_followup_at:'2026-10-30T08:00:00Z'},{id:'paused',status:'paused'},{id:'soon',status:'open',next_followup_at:'2026-10-20T08:00:00Z'}]);
  assert.deepEqual(sorted.map(x=>x.id),['soon','later','paused','won']);
});

test('a quote whose client answered is listed first, open or paused, newest reply first',async()=>{
  const {buildTodayGroups,nextFollowupLine,senderLine,formatParisWhen,latestReply}=await import('../client/src/today.js');
  const now=new Date('2026-10-29T09:00:00Z');
  const groups=buildTodayGroups([
    {id:'due',status:'open',followup_step:0,next_followup_at:'2026-10-29T08:00:00Z'},
    {id:'old',status:'open',followup_step:1,next_followup_at:null,reply_received_at:'2026-10-27T10:00:00Z'},
    {id:'new',status:'paused',followup_step:1,next_followup_at:null,reply_received_at:'2026-10-28T10:00:00Z'},
    {id:'won',status:'won',reply_received_at:'2026-10-28T10:00:00Z'}
  ],now);
  assert.deepEqual(groups.replied.map(x=>x.id),['new','old']);
  assert.deepEqual(groups.today.map(x=>x.id),['due']);
  assert.equal(formatParisWhen('2026-10-29T08:00:00Z'),'jeudi 29 oct. à 9 h');
  assert.equal(nextFollowupLine({status:'open',next_followup_at:'2026-11-02T08:00:00Z'}),'Prochaine relance : lundi 2 nov. à 9 h');
  assert.equal(nextFollowupLine({status:'open',reply_received_at:'x'}),'Relances arrêtées : le client a répondu');
  assert.equal(nextFollowupLine({status:'open',followup_step:3,next_followup_at:null}),'3 relances faites');
  const q={status:'open',next_followup_at:'2026-11-02T08:00:00Z',client_email:'a@b.fr',auto_send:true};
  assert.equal(senderLine(q,{pro_access:false}),'Vous relancez : email, SMS ou appel');
  assert.equal(senderLine(q,{pro_access:true}),'Vous validez, Relanzio envoie');
  assert.equal(senderLine(q,{pro_access:true,email_mode:'automatic',capabilities:{automatic_sending:false}}),'Vous validez, Relanzio envoie','never claims automatic when the server does not offer it');
  assert.equal(senderLine(q,{pro_access:true,email_mode:'automatic',capabilities:{automatic_sending:true}}),'Relanzio l’enverra pour vous');
  assert.equal(latestReply({replies:[{effect:'record',received_at:'2026-10-29'},{effect:'stop',received_at:'2026-10-28',id:'r'}]}).id,'r');
});
