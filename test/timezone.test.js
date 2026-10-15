import test from 'node:test';
import assert from 'node:assert/strict';
import {parisLocalDateTimeToIso,isoToParisLocalDateTime} from '../client/src/date-time.js';
import {nextFollowupDate,parisLocalDateTimeToIso as serverParis} from '../server/logic.js';

test('Paris custom datetime respects summer and winter offsets',()=>{
  assert.equal(parisLocalDateTimeToIso('2026-10-20T10:30'),'2026-10-20T08:30:00.000Z');
  assert.equal(parisLocalDateTimeToIso('2026-10-26T10:30'),'2026-10-26T09:30:00.000Z');
  assert.equal(isoToParisLocalDateTime('2026-10-20T08:30:00.000Z'),'2026-10-20T10:30');
  assert.equal(isoToParisLocalDateTime('2026-10-26T09:30:00.000Z'),'2026-10-26T10:30');
});

test('Paris conversion rejects nonexistent spring-forward local time',()=>{
  assert.equal(parisLocalDateTimeToIso('2026-03-29T02:30'),null);
});

test('recommended schedule is 09:00 Paris across DST',()=>{
  assert.equal(serverParis('2026-10-20',9,0),'2026-10-20T07:00:00.000Z');
  assert.equal(serverParis('2026-10-26',9,0),'2026-10-26T08:00:00.000Z');
  assert.equal(nextFollowupDate('2026-10-18',2),'2026-10-28T08:00:00.000Z');
});
