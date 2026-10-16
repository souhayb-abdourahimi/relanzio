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
    q('paused','2026-10-14T07:00:00.000Z',0,'paused')
  ],now);
  assert.deepEqual(groups.overdue.map(x=>x.id),['late-2','late-1']);
  assert.deepEqual(groups.today.map(x=>x.id),['terminal','today']);
  assert.deepEqual(groups.future.map(x=>x.id),['future']);
  assert.equal(groups.overdue[0].action_meta.daysOverdue,2);
  assert.equal(actionStageLabel(groups.today[0]),'Séquence terminée — décision requise');
  assert.equal(actionStageLabel(groups.today[1]),'Relance 2/3');
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
