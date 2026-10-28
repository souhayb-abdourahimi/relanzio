import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFunnel, countEvents, FUNNEL_EVENTS } from '../server/funnel.js';

test('funnel counts each step once per account and computes step conversion',()=>{
  const profiles=[
    {id:'a',created_at:'2026-10-10T00:00:00Z',activated_at:'2026-10-10T01:00:00Z',plan:'pro',subscription_status:'active'},
    {id:'b',created_at:'2026-10-11T00:00:00Z',activated_at:'2026-10-11T01:00:00Z',plan:'free',subscription_status:'none'},
    {id:'c',created_at:'2026-10-12T00:00:00Z',plan:'free',subscription_status:'none'},
    {id:'old',created_at:'2026-01-01T00:00:00Z',activated_at:'2026-01-02T00:00:00Z',plan:'pro',subscription_status:'active'},
  ];
  const events=[...Array(10)].map((_,i)=>({event:'landing_view',created_at:'2026-10-0'+(i%9+1)+'T00:00:00Z'})).concat([{event:'first_quote_added',user_id:'b',created_at:'2026-10-11T01:00:00Z'}]);
  const followups=[{user_id:'a',status:'sent'},{user_id:'a',status:'delivered'},{user_id:'b',status:'failed'},{user_id:'old',status:'sent'}];
  const f=buildFunnel({events,profiles,followups,since:'2026-10-01T00:00:00Z'});
  assert.deepEqual(f.map(x=>x.count),[10,3,2,1,1]);
  assert.deepEqual(f.map(x=>x.rate),[null,30,66.7,50,100]);
  assert.equal(buildFunnel({events,profiles,followups})[1].count,4);
});

test('event counts and the tracked event list',()=>{
  assert.deepEqual(countEvents([{event:'snoozed',created_at:'2026-10-10T00:00:00Z'},{event:'snoozed',created_at:'2026-10-11T00:00:00Z'},{event:'quote_won',created_at:'2025-01-01T00:00:00Z'}],'2026-01-01'),{snoozed:2});
  assert.equal(FUNNEL_EVENTS.length,13);
});
