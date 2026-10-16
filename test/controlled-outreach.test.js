import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMMERCIAL_STOP_LINE,
  COMMERCIAL_SUBJECTS,
  commercialDailyCap,
  renderCommercialJ0,
  validateCommercialJ0
} from '../server/controlled-outreach-policy.js';

test('commercial daily cap is hard-clamped to twenty',()=>{
  assert.equal(commercialDailyCap(20),20);
  assert.equal(commercialDailyCap(99),20);
  assert.equal(commercialDailyCap(7),7);
  assert.equal(commercialDailyCap('bad'),20);
});

test('commercial J0 contains required trial price and opt-out with no forbidden claims',()=>{
  const content=renderCommercialJ0('Vous proposez des travaux de rénovation avec demande de devis depuis votre site.');
  const result=validateCommercialJ0({subject:COMMERCIAL_SUBJECTS[0],content,personalization:'Vous proposez des travaux de rénovation avec demande de devis depuis votre site.'});
  assert.deepEqual(result,{ok:true,reasons:[]});
  assert.match(content,/7 jours/);
  assert.match(content,/29 € \/ mois/);
  assert.ok(content.includes(COMMERCIAL_STOP_LINE));
});

test('commercial J0 rejects unsupported subject and stale sales claims',()=>{
  const personalization='Votre site propose une demande de devis.';
  const base=renderCommercialJ0(personalization);
  assert.ok(validateCommercialJ0({subject:'URGENT',content:base,personalization}).reasons.includes('unapproved_subject'));
  const bad=base+'\nRésultats garantis et illimité.';
  const result=validateCommercialJ0({subject:COMMERCIAL_SUBJECTS[1],content:bad,personalization});
  assert.equal(result.ok,false);
  assert.ok(result.reasons.some(x=>x.startsWith('forbidden_claim_')));
});
