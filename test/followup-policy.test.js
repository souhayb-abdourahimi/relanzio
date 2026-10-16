import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parisBusinessDate,addDaysToDateKey,nextRecommendedAfterAction,isAutomaticSendWindow,providerFailureDisposition,shouldArmInitialAutoSend
} from '../server/followup-policy.js';

test('recommended follow-up gaps restart from the real action',()=>{
  assert.equal(nextRecommendedAfterAction('2026-10-16T12:00:00.000Z',1),'2026-10-19T07:00:00.000Z');
  assert.equal(nextRecommendedAfterAction('2026-10-19T12:00:00.000Z',2),'2026-10-24T07:00:00.000Z');
  assert.equal(nextRecommendedAfterAction('2026-10-24T12:00:00.000Z',3),null);
});

test('Paris business date is stable around UTC midnight',()=>{
  assert.equal(parisBusinessDate('2026-10-16T21:59:00.000Z'),'2026-10-16');
  assert.equal(parisBusinessDate('2026-10-16T22:01:00.000Z'),'2026-10-17');
});

test('recommended scheduling handles the Europe Paris DST change',()=>{
  assert.equal(nextRecommendedAfterAction('2026-10-23T08:00:00.000Z',2),'2026-10-28T08:00:00.000Z');
  assert.equal(addDaysToDateKey('2026-10-24',5),'2026-10-29');
});

test('automatic sends are limited to weekdays 08:00-19:00 Europe Paris',()=>{
  assert.equal(isAutomaticSendWindow('2026-10-16T06:30:00.000Z'),true);
  assert.equal(isAutomaticSendWindow('2026-10-16T17:30:00.000Z'),false);
  assert.equal(isAutomaticSendWindow('2026-10-17T10:00:00.000Z'),false);
  assert.equal(isAutomaticSendWindow('2026-10-19T07:00:00.000Z'),true);
});

test('provider failures distinguish certain rejection from ambiguous delivery',()=>{
  assert.equal(providerFailureDisposition(new Error('EMAIL_PROVIDER_NOT_CONFIGURED')),'certain');
  assert.equal(providerFailureDisposition(new Error('Brevo 400: invalid recipient')),'certain');
  assert.equal(providerFailureDisposition(new Error('Brevo 503: upstream timeout')),'ambiguous');
  assert.equal(providerFailureDisposition(new Error('fetch failed')),'ambiguous');
});

test('an old overdue quote is never armed for automatic catch-up on creation',()=>{
  const now=new Date('2026-10-16T10:00:00.000Z');
  assert.equal(shouldArmInitialAutoSend(true,'2026-09-03T07:00:00.000Z',now),false);
  assert.equal(shouldArmInitialAutoSend(true,'2026-10-19T07:00:00.000Z',now),true);
  assert.equal(shouldArmInitialAutoSend(false,'2026-10-19T07:00:00.000Z',now),false);
});
