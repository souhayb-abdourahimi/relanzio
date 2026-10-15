import test from 'node:test';
import assert from 'node:assert/strict';
import {parisLocalDateTimeToIso,isoToParisLocalDateTime,formatParisDateTime,PARIS_TIME_ZONE} from '../client/src/date-time.js';

test('Paris local datetime is converted independently of browser timezone',()=>{
  assert.equal(PARIS_TIME_ZONE,'Europe/Paris');
  assert.equal(parisLocalDateTimeToIso('2026-10-15T10:30'),'2026-10-15T08:30:00.000Z');
  assert.equal(isoToParisLocalDateTime('2026-10-15T08:30:00.000Z'),'2026-10-15T10:30');
  assert.match(formatParisDateTime('2026-10-15T08:30:00.000Z'),/10:30/);
});

test('Paris DST spring gap is rejected and autumn overlap stays round-trippable',()=>{
  assert.equal(parisLocalDateTimeToIso('2026-03-29T02:30'),null);
  const autumn=parisLocalDateTimeToIso('2026-10-25T02:30');
  assert.ok(autumn);
  assert.equal(isoToParisLocalDateTime(autumn),'2026-10-25T02:30');
});

test('invalid Paris datetime values are rejected safely',()=>{
  assert.equal(parisLocalDateTimeToIso(''),null);
  assert.equal(parisLocalDateTimeToIso('2026-13-01T10:00'),null);
  assert.equal(isoToParisLocalDateTime('not-a-date'),'');
  assert.equal(formatParisDateTime('not-a-date'),'');
});
