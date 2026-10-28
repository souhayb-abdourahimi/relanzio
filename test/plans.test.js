import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as plans from '../shared/plans.js';
import { activeQuoteLimit } from '../server/quote-rules.js';
import { TRIAL_DAYS as SERVER_TRIAL_DAYS } from '../server/entitlements.js';
import { FREE_PLAN,PRO_PLAN,subscriptionDisplay } from '../client/src/subscription-display.js';
import { trialDisplay } from '../client/src/trial-display.js';

test('commercial offer values are centralized',()=>{
  assert.equal(plans.FREE_ACTIVE_QUOTES_LIMIT,5);
  assert.equal(plans.PRO_ACTIVE_QUOTES_LIMIT,100);
  assert.equal(plans.PRO_MONTHLY_PRICE,29);
  assert.equal(plans.TRIAL_DAYS,7);
  assert.equal(plans.PRO_PRICE_TEXT,'29 € / mois');
  assert.equal(plans.UPGRADE_LABEL,'Passer à Pro — 29 € / mois');
  assert.equal(plans.monthlyRecurringRevenue(3),87);
});

test('server, app and public pricing read the same source',()=>{
  assert.equal(activeQuoteLimit(false),plans.FREE_ACTIVE_QUOTES_LIMIT);
  assert.equal(activeQuoteLimit(true),plans.PRO_ACTIVE_QUOTES_LIMIT);
  assert.equal(SERVER_TRIAL_DAYS,plans.TRIAL_DAYS);
  assert.equal(FREE_PLAN.limit,plans.FREE_ACTIVE_QUOTES_LIMIT);
  assert.equal(PRO_PLAN.limit,plans.PRO_ACTIVE_QUOTES_LIMIT);
  assert.equal(subscriptionDisplay({}).upgradeLabel,plans.UPGRADE_LABEL);
  assert.equal(trialDisplay({}).upgradeLabel,plans.UPGRADE_LABEL);
});

test('no hard-coded price, limit or trial length outside the shared config',()=>{
  const files=['client/src/main.jsx','client/src/PricingCards.jsx','client/src/PlansView.jsx','client/src/subscription-display.js','client/src/trial-display.js','client/src/LegalPage.jsx','server/index.js','server/support.js','server/quote-rules.js','server/entitlements.js'];
  for(const f of files){
    const src=readFileSync(new URL('../'+f,import.meta.url),'utf8');
    assert.doesNotMatch(src,/\b29 ?€|\b(5|100) devis actifs|293 B du CGI|\bpendant 7 jours|Essai Pro 7 jours/,f);
  }
});
