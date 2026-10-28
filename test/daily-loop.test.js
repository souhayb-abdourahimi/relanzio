import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone, sanitizeNote, parseQuoteContact, MAX_NOTE_LENGTH } from '../server/quote-rules.js';
import { initialRecommendedFollowupAt } from '../server/followup-policy.js';
import { isValidEmail } from '../server/logic.js';

test('phone numbers keep their formatting and need 6 to 15 digits',()=>{
  assert.equal(normalizePhone(' 06 12  34 56 78 '),'06 12 34 56 78');
  assert.equal(normalizePhone('+33 (0)6.12.34.56.78'),'+33 (0)6.12.34.56.78');
  assert.equal(normalizePhone(''),'');
  assert.equal(normalizePhone('12345'),null);
  assert.equal(normalizePhone('06 12 34 ab'),null);
  assert.equal(normalizePhone('1'.repeat(16)),null);
});

test('a quote needs an email or a phone, and an email must be valid when present',()=>{
  assert.deepEqual(parseQuoteContact({email:'',phone:'0612345678'},isValidEmail),{email:null,phone:'0612345678'});
  assert.deepEqual(parseQuoteContact({email:' A@B.fr ',phone:''},isValidEmail),{email:'a@b.fr',phone:null});
  assert.match(parseQuoteContact({email:'',phone:''},isValidEmail).error,/email ou un téléphone/);
  assert.match(parseQuoteContact({email:'pas-un-email',phone:'0612345678'},isValidEmail).error,/Email invalide/);
  assert.match(parseQuoteContact({email:'a@b.fr',phone:'abc'},isValidEmail).error,/Téléphone invalide/);
});

test('notes are trimmed, capped and empty notes are stored as null',()=>{
  assert.equal(sanitizeNote('  Attend l’accord du conjoint  '),'Attend l’accord du conjoint');
  assert.equal(sanitizeNote('   '),null);
  assert.equal(sanitizeNote('x'.repeat(5000)).length,MAX_NOTE_LENGTH);
});

test('a recent quote gets its first follow-up at sent date + 2 days, 09:00 Paris',()=>{
  const r=initialRecommendedFollowupAt('2026-10-27',new Date('2026-10-27T15:00:00.000Z'));
  assert.equal(r.at,'2026-10-29T08:00:00.000Z');
  assert.equal(r.catchUp,false);
});

test('an old quote is proposed for today instead of catching up the sequence',()=>{
  const r=initialRecommendedFollowupAt('2026-09-01',new Date('2026-10-28T13:00:00.000Z'));
  assert.equal(r.at,'2026-10-28T08:00:00.000Z');
  assert.equal(r.catchUp,true);
});
