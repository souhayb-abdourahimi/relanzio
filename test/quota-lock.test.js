import test from 'node:test';
import assert from 'node:assert/strict';
import { lockedQuoteIds, withLocks, isAllowedLockedPatch, rankActiveQuotes } from '../shared/quota.js';

const at=i=>new Date(Date.UTC(2026,9,1+i)).toISOString();
const quotes=[
  ...Array.from({length:8},(_,i)=>({id:`q${i}`,status:i===3?'paused':'open',created_at:at(i)})),
  {id:'won',status:'won',created_at:at(20)},
  {id:'lost',status:'lost',created_at:at(21)}
];

test('free accounts keep the 5 most recently added active quotes usable and lock the rest',()=>{
  assert.deepEqual([...lockedQuoteIds(quotes,false)].sort(),['q0','q1','q2']);
  const shown=withLocks(quotes,false);
  assert.equal(shown.find(q=>q.id==='q7').locked,false);
  assert.equal(shown.find(q=>q.id==='won').locked,false,'decided quotes are never locked');
  assert.equal(shown.length,quotes.length,'nothing is removed');
});

test('Pro accounts are not locked below 100 active quotes',()=>{
  assert.equal(lockedQuoteIds(quotes,true).size,0);
});

test('closing a usable quote frees a place for the next most recent locked one',()=>{
  const after=quotes.map(q=>q.id==='q7'?{...q,status:'won'}:q);
  assert.deepEqual([...lockedQuoteIds(after,false)].sort(),['q0','q1']);
});

test('ranking is deterministic when creation dates are equal',()=>{
  const same=[{id:'a',status:'open',created_at:at(1)},{id:'c',status:'open',created_at:at(1)},{id:'b',status:'open',created_at:at(1)}];
  assert.deepEqual(rankActiveQuotes(same).map(q=>q.id),['c','b','a']);
});

test('locked quotes only accept won or lost',()=>{
  assert.equal(isAllowedLockedPatch({status:'won'}),true);
  assert.equal(isAllowedLockedPatch({status:'lost'}),true);
  assert.equal(isAllowedLockedPatch({status:'paused'}),false);
  assert.equal(isAllowedLockedPatch({status:'won',title:'x'}),false);
  assert.equal(isAllowedLockedPatch({note:'x'}),false);
});
