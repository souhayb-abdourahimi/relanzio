import test from 'node:test';
import assert from 'node:assert/strict';
import { FREE_PLAN,PRO_PLAN,subscriptionDisplay } from '../client/src/subscription-display.js';

test('subscription plans expose the real product limits and never unlimited',()=>{
  assert.equal(FREE_PLAN.limit,5);
  assert.equal(PRO_PLAN.limit,100);
  assert.equal(PRO_PLAN.price,'29 €');
  assert.equal(PRO_PLAN.period,'/ mois');
  assert.equal(PRO_PLAN.vatNote,'TVA non applicable, art. 293 B du CGI');
  const all=[...FREE_PLAN.features,...PRO_PLAN.features].join(' ').toLowerCase();
  assert.match(all,/5 devis actifs/);
  assert.match(all,/100 devis actifs/);
  assert.equal(all.includes('illimit'),false);
});

test('free user gets a disabled Pro conversion when billing is off',()=>{
  const state=subscriptionDisplay({plan:'free',subscription_status:'none',pro_access:false},false,false);
  assert.equal(state.currentPlan,'free');
  assert.equal(state.upgradeVisible,true);
  assert.equal(state.upgradeDisabled,true);
  assert.equal(state.upgradeLabel,'Passer à Pro — 29 € / mois');
  assert.match(state.upgradeHint,/n’est pas disponible/);
});

test('free user can open Pro checkout when billing is enabled',()=>{
  const state=subscriptionDisplay({plan:'free',subscription_status:'none',pro_access:false},true,false);
  assert.equal(state.upgradeDisabled,false);
  assert.equal(state.upgradeHint,'');
});

test('managed seven-day trial is shown only when the certified trial is active',()=>{
  const active=subscriptionDisplay({pro_access:true,trial_active:true,trial_days_remaining:4,trial_ends_at:'2026-10-18T00:00:00.000Z'},true,false);
  assert.equal(active.currentPlan,'pro');
  assert.equal(active.trial.visible,true);
  assert.match(active.trial.label,/4 jours restants/);
  const inactive=subscriptionDisplay({pro_access:false,trial_active:false},true,false);
  assert.equal(inactive.trial.visible,false);
});

test('paid Pro user is current and does not get an upgrade CTA',()=>{
  const state=subscriptionDisplay({plan:'pro',subscription_status:'active',pro_access:true,is_paid_subscription:true,stripe_customer_id:'cus_test'},true,false);
  assert.equal(state.currentPlan,'pro');
  assert.equal(state.paid,true);
  assert.equal(state.upgradeVisible,false);
});

test('past_due accounts get the portal, not a second checkout',async()=>{
  const { accountBanner }=await import('../client/src/trial-display.js');
  const state=subscriptionDisplay({plan:'free',subscription_status:'past_due',pro_access:false,stripe_customer_id:'cus_1'},true,false);
  assert.equal(state.pastDue,true);
  assert.equal(state.upgradeVisible,false);
  assert.equal(state.portalVisible,true);
  const banner=accountBanner({subscription_status:'past_due'});
  assert.equal(banner.action,'portal');
  assert.match(banner.label,/Paiement refusé/);
});

test('cancellation keeps Pro until the end of the paid period and says so',async()=>{
  const { accountBanner }=await import('../client/src/trial-display.js');
  const profile={plan:'pro',subscription_status:'active',pro_access:true,is_paid_subscription:true,stripe_customer_id:'cus_1',subscription_cancel_at_period_end:true,subscription_current_period_end:'2026-11-27T10:00:00.000Z'};
  const state=subscriptionDisplay(profile,true,false);
  assert.equal(state.canceling,true);
  assert.equal(state.portalVisible,true);
  assert.match(accountBanner(profile).label,/Pro jusqu’au 27\/11\/2026/);
});

test('free accounts above the limit see how many quotes are read-only',async()=>{
  const { accountBanner }=await import('../client/src/trial-display.js');
  const b=accountBanner({plan:'free',subscription_status:'none'},3);
  assert.equal(b.kind,'locked');
  assert.match(b.label,/3 devis en lecture seule/);
  assert.equal(accountBanner({plan:'free',subscription_status:'none'},0).kind,null);
});
