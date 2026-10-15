import test from 'node:test';
import assert from 'node:assert/strict';
import {activeQuoteLimit,isActiveQuoteStatus,parseQuoteAmount,parseSentDate,normalizeFollowupScheduleMode,parseCustomFollowupAt,parisTodayIso} from '../server/quote-rules.js';

test('active quote quota counts open and paused but not decided quotes',()=>{
  assert.equal(isActiveQuoteStatus('open'),true);
  assert.equal(isActiveQuoteStatus('paused'),true);
  assert.equal(isActiveQuoteStatus('won'),false);
  assert.equal(isActiveQuoteStatus('lost'),false);
  assert.equal(activeQuoteLimit(false),5);
  assert.equal(activeQuoteLimit(true),100);
});

test('quote amounts accept French comma and reject invalid or oversized values',()=>{
  assert.equal(parseQuoteAmount('0'),0);
  assert.equal(parseQuoteAmount('0,01'),0.01);
  assert.equal(parseQuoteAmount('29.00'),29);
  assert.equal(parseQuoteAmount('99 999,99'),99999.99);
  assert.equal(parseQuoteAmount('-1'),null);
  assert.equal(parseQuoteAmount('abc'),null);
  assert.equal(parseQuoteAmount('99999999999'),null);
  assert.equal(parseQuoteAmount(''),null);
});

test('sent date validates leap years and rejects future dates',()=>{
  assert.equal(parseSentDate('2024-02-29','2026-10-15'),'2024-02-29');
  assert.equal(parseSentDate('2025-02-29','2026-10-15'),null);
  assert.equal(parseSentDate('2026-10-16','2026-10-15'),null);
});

test('follow-up schedule accepts recommended custom none and future ISO values',()=>{
  assert.equal(normalizeFollowupScheduleMode('recommended'),'recommended');
  assert.equal(normalizeFollowupScheduleMode('custom'),'custom');
  assert.equal(normalizeFollowupScheduleMode('none'),'none');
  assert.equal(normalizeFollowupScheduleMode('later'),null);
  const now=new Date('2026-10-15T08:00:00Z');
  assert.equal(parseCustomFollowupAt('2026-10-16T09:30:00+02:00',now),'2026-10-16T07:30:00.000Z');
  assert.equal(parseCustomFollowupAt('2026-10-14T09:30:00+02:00',now),null);
});


test('sent date uses the Europe/Paris calendar across UTC midnight',()=>{
  assert.equal(parisTodayIso(new Date('2026-10-14T22:30:00.000Z')),'2026-10-15');
  assert.equal(parseSentDate('2026-10-15',parisTodayIso(new Date('2026-10-14T22:30:00.000Z'))),'2026-10-15');
  assert.equal(parseSentDate('2026-10-16',parisTodayIso(new Date('2026-10-14T22:30:00.000Z'))),null);
});
