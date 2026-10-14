import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PILOT_STOP_LINE,
  PILOT_SIGNATURE,
  pilotDailyCap,
  pilotAllowlist,
  validatePilotProspect,
  validatePilotJ0
} from '../server/pilot-outreach-policy.js';

test('pilot daily cap is hard-clamped to five', () => {
  assert.equal(pilotDailyCap(5), 5);
  assert.equal(pilotDailyCap(99), 5);
  assert.equal(pilotDailyCap(3), 3);
  assert.equal(pilotDailyCap('bad'), 5);
});

test('pilot prospect requires explicit allowlist and professional validation', () => {
  const allow = pilotAllowlist('contact@example.com');
  const prospect = {
    email:'contact@example.com',
    status:'qualified',
    lawful_basis:'professional_relevance',
    score:90,
    source_url:'https://example.com/contact'
  };
  assert.deepEqual(validatePilotProspect(prospect, allow), { ok:true, reasons:[] });
  assert.ok(validatePilotProspect({ ...prospect, email:'other@example.com' }, allow).reasons.includes('not_in_pilot_allowlist'));
  assert.ok(validatePilotProspect({ ...prospect, source_url:'' }, allow).reasons.includes('missing_public_professional_source'));
});

test('pilot J0 must be held step zero and contain the approved STOP line and signature', () => {
  const queue = {
    sequence_step:0,
    status:'held',
    subject:'Petite question sur vos devis',
    content:`Bonjour\n\n${PILOT_STOP_LINE}\n\n${PILOT_SIGNATURE}`
  };
  assert.deepEqual(validatePilotJ0(queue), { ok:true, reasons:[] });
  assert.ok(validatePilotJ0({ ...queue, sequence_step:1 }).reasons.includes('not_j0'));
  assert.ok(validatePilotJ0({ ...queue, content:'Bonjour' }).reasons.includes('missing_stop_line'));
});
