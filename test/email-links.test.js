import test from 'node:test';
import assert from 'node:assert/strict';
import { signEmailLink, verifyEmailLink, emailLinkUrl, followupFooter } from '../server/email-links.js';
import { DEFAULT_FOLLOWUP_OFFSETS, normalizeFollowupOffsets, gapAfterStep, cadenceLabel } from '../shared/followup-cadence.js';
import { nextRecommendedAfterAction, initialRecommendedFollowupAt } from '../server/followup-policy.js';

const SECRET='s'.repeat(32);

test('email links are signed, purpose-bound and tamper-proof',()=>{
  const t=signEmailLink('followup_optout',{u:'user-1',e:'client@example.test'},SECRET);
  assert.deepEqual(verifyEmailLink(t,'followup_optout',SECRET),{p:'followup_optout',u:'user-1',e:'client@example.test'});
  assert.equal(verifyEmailLink(t,'digest_optout',SECRET),null);
  assert.equal(verifyEmailLink(t,'followup_optout','x'.repeat(32)),null);
  const [body,sig]=t.split('.');
  const forged=Buffer.from(JSON.stringify({p:'followup_optout',u:'user-2',e:'client@example.test'})).toString('base64url');
  assert.equal(verifyEmailLink(`${forged}.${sig}`,'followup_optout',SECRET),null);
  assert.equal(verifyEmailLink('garbage','followup_optout',SECRET),null);
  assert.throws(()=>signEmailLink('followup_optout',{},'short'),/EMAIL_LINK_SECRET_MISSING/);
  assert.equal(emailLinkUrl('a.b','https://relanzio.com/'),'https://relanzio.com/api/email/unsubscribe?t=a.b');
});

test('every follow-up email identifies the sender and carries an unsubscribe link',()=>{
  const f=followupFooter({companyName:'Toitures Martin',quoteTitle:'Réfection toiture',unsubscribeUrl:'https://relanzio.com/api/email/unsubscribe?t=x'});
  assert.match(f,/Message envoyé par Toitures Martin via Relanzio, au sujet du devis « Réfection toiture »/);
  assert.match(f,/Ne plus recevoir de relances de Toitures Martin : https:\/\/relanzio\.com\/api\/email\/unsubscribe\?t=x/);
});

test('cadence is configurable per account and validated',()=>{
  assert.deepEqual(DEFAULT_FOLLOWUP_OFFSETS,[2,5,10]);
  assert.deepEqual(normalizeFollowupOffsets(['3','7','14']),[3,7,14]);
  assert.equal(normalizeFollowupOffsets([5,3,10]),null);
  assert.equal(normalizeFollowupOffsets([0,3,10]),null);
  assert.equal(normalizeFollowupOffsets([2,5]),null);
  assert.equal(gapAfterStep([3,7,14],1),4);
  assert.equal(gapAfterStep([3,7,14],2),7);
  assert.equal(gapAfterStep(null,1),3);
  assert.equal(cadenceLabel([3,7,14]),'J+3 / J+7 / J+14');
});

test('next follow-up is computed from the day the previous one was done',()=>{
  // Relance 1 done late (28 Oct), custom cadence J+3/J+7/J+14 → relance 2 four days later, 09:00 Paris.
  // Four days later is Sunday 1 Nov: follow-ups are planned on working days, so Monday 2 Nov.
  assert.equal(nextRecommendedAfterAction('2026-10-28T15:00:00.000Z',1,[3,7,14]),'2026-11-02T08:00:00.000Z');
  assert.equal(nextRecommendedAfterAction('2026-10-28T15:00:00.000Z',2,[3,7,14]),'2026-11-04T08:00:00.000Z');
  assert.equal(nextRecommendedAfterAction('2026-10-28T15:00:00.000Z',3,[3,7,14]),null);
  assert.equal(initialRecommendedFollowupAt('2026-10-27',new Date('2026-10-27T10:00:00Z'),3).at,'2026-10-30T08:00:00.000Z');
});

test('Relanzio sends check opt-out and sign the unsubscribe link before claiming the quote',async()=>{
  const { readFileSync }=await import('node:fs');
  const src=readFileSync(new URL('../server/followups.js',import.meta.url),'utf8');
  const optOut=src.indexOf("throw new Error('EMAIL_RECIPIENT_OPTED_OUT')"),sign=src.indexOf("signEmailLink('followup_optout'"),claim=src.indexOf('const claimed = await claimQuote(quote);');
  assert.ok(optOut>0&&sign>optOut&&claim>sign,'opt-out → signed link → claim');
  assert.match(src,/followupFooter\(\{companyName:profile\.company_name,quoteTitle:claimed\.title,unsubscribeUrl\}\)/);
  assert.match(src,/'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'/);
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  assert.match(server,/app\.get\('\/api\/email\/unsubscribe'/);
  assert.match(server,/app\.post\('\/api\/email\/unsubscribe'/);
});
