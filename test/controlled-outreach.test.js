import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMMERCIAL_STOP_LINE,
  COMMERCIAL_SUBJECTS,
  commercialDailyCap,
  isCommercialBusinessWindow,
  renderCommercialJ0,
  renderCommercialJ3,
  validateCommercialJ0,
  validateCommercialJ3
} from '../server/controlled-outreach-policy.js';

test('commercial daily cap follows provider capacity and ignores legacy 20 sentinel',()=>{
  assert.equal(commercialDailyCap(20,300),300);
  assert.equal(commercialDailyCap(99,300),99);
  assert.equal(commercialDailyCap(999,300),300);
  assert.equal(commercialDailyCap('bad',250),250);
});

test('commercial business window uses French weekdays and daytime',()=>{
  assert.equal(isCommercialBusinessWindow(new Date('2026-10-26T11:00:00Z')),true);
  assert.equal(isCommercialBusinessWindow(new Date('2026-10-26T06:00:00Z')),false);
  assert.equal(isCommercialBusinessWindow(new Date('2026-10-25T11:00:00Z')),false);
});

test('commercial J0 contains required trial price and opt-out with no forbidden claims',()=>{
  const content=renderCommercialJ0('Vous proposez des travaux de rénovation avec demande de devis depuis votre site.');
  const result=validateCommercialJ0({subject:COMMERCIAL_SUBJECTS[0],content,personalization:'Vous proposez des travaux de rénovation avec demande de devis depuis votre site.'});
  assert.deepEqual(result,{ok:true,reasons:[]});
  assert.match(content,/7 jours/);
  assert.match(content,/29 € \/ mois/);
  assert.ok(content.includes(COMMERCIAL_STOP_LINE));
});

test('commercial J3 is the only follow-up and retains STOP',()=>{
  const content=renderCommercialJ3({companyName:'Entreprise Test',sector:'Rénovation'});
  const result=validateCommercialJ3({subject:'Re: Question sur vos devis',content,companyName:'Entreprise Test',sector:'Rénovation'});
  assert.deepEqual(result,{ok:true,reasons:[]});
  assert.match(content,/7 jours/);
  assert.match(content,/STOP/);
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
