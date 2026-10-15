import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hasSubscriptionProAccess,
  isPaidSubscriber,
  isManagedTrialActive,
  isManagedTrialExpired,
  hasProAccess,
  trialDaysRemaining,
  trialWindow,
  withEntitlements
} from '../server/entitlements.js';
import { trialDisplay } from '../client/src/trial-display.js';

const NOW=new Date('2026-10-14T00:00:00.000Z');

test('managed trial grants Pro access without becoming paid revenue',()=>{
  const profile={plan:'pro',subscription_status:'none',trial_started_at:'2026-10-14T00:00:00.000Z',trial_ends_at:'2026-10-21T00:00:00.000Z',trial_expired_at:null};
  assert.equal(isManagedTrialActive(profile,NOW),true);
  assert.equal(hasProAccess(profile,NOW),true);
  assert.equal(hasSubscriptionProAccess(profile),false);
  assert.equal(isPaidSubscriber(profile),false);
  assert.equal(trialDaysRemaining(profile,NOW),7);
  assert.deepEqual(withEntitlements(profile,NOW).effective_plan,'pro');
});

test('expired managed trial loses Pro rights and reports zero days',()=>{
  const profile={plan:'pro',subscription_status:'none',trial_started_at:'2026-10-01T00:00:00.000Z',trial_ends_at:'2026-10-08T00:00:00.000Z',trial_expired_at:null};
  assert.equal(isManagedTrialActive(profile,NOW),false);
  assert.equal(isManagedTrialExpired(profile,NOW),true);
  assert.equal(hasProAccess(profile,NOW),false);
  assert.equal(trialDaysRemaining(profile,NOW),0);
});

test('Stripe subscription access remains independent from managed trial',()=>{
  const active={plan:'pro',subscription_status:'active',trial_started_at:'2026-10-01T00:00:00.000Z',trial_ends_at:'2026-10-08T00:00:00.000Z',trial_expired_at:'2026-10-08T00:00:00.000Z'};
  const stripeTrial={...active,subscription_status:'trialing'};
  assert.equal(hasProAccess(active,NOW),true);
  assert.equal(isPaidSubscriber(active),true);
  assert.equal(hasProAccess(stripeTrial,NOW),true);
  assert.equal(isPaidSubscriber(stripeTrial),false);
});

test('trial window is exactly seven days',()=>{
  const w=trialWindow(NOW);
  assert.equal(w.trial_started_at,'2026-10-14T00:00:00.000Z');
  assert.equal(w.trial_ends_at,'2026-10-21T00:00:00.000Z');
});


test('trial display exposes exact active state and end date',()=>{
  const profile=withEntitlements({
    plan:'pro',
    subscription_status:'none',
    trial_started_at:'2026-10-14T00:00:00.000Z',
    trial_ends_at:'2026-10-21T00:00:00.000Z',
    trial_expired_at:null
  },NOW);
  const display=trialDisplay(profile);
  assert.equal(display.visible,true);
  assert.equal(display.label,'Essai Pro — 7 jours restants');
  assert.match(display.endText,/21\/10\/2026/);
  assert.equal(display.upgradeLabel,'Passer à Pro — 29 €/mois');
});


test('active Stripe Pro takes display precedence over an overlapping managed trial',()=>{
  const profile=withEntitlements({
    plan:'pro',subscription_status:'active',
    trial_started_at:'2026-10-14T00:00:00.000Z',trial_ends_at:'2026-10-21T00:00:00.000Z',trial_expired_at:null
  },NOW);
  assert.equal(profile.pro_access,true);
  assert.equal(profile.is_paid_subscription,true);
  assert.equal(profile.trial_active,false);
  assert.equal(profile.trial_days_remaining,0);
  assert.equal(trialDisplay(profile).visible,false);
});
