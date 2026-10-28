import test from 'node:test';
import assert from 'node:assert/strict';
import { PAST_DUE_GRACE_DAYS, pastDueGraceEndsAt, isInPastDueGrace, hasSubscriptionProAccess, hasProAccess, canAutoSend, withEntitlements } from '../server/entitlements.js';
import { lockedQuoteIds } from '../shared/quota.js';

// Rule: Stripe past_due keeps Pro until subscription_current_period_start + 14 days.
const base={plan:'pro',subscription_status:'past_due',subscription_current_period_start:'2026-12-01T00:00:00.000Z',subscription_current_period_end:'2027-01-01T00:00:00.000Z'};
const at=s=>new Date(s);

test('grace period is 14 days from the start of the unpaid period',()=>{
  assert.equal(PAST_DUE_GRACE_DAYS,14);
  assert.equal(pastDueGraceEndsAt(base),'2026-12-15T00:00:00.000Z');
});

test('active is Pro; first past_due keeps Pro features, but not automatic sending',()=>{
  assert.equal(hasSubscriptionProAccess({...base,subscription_status:'active'},at('2026-12-20T00:00:00Z')),true);
  const day1=at('2026-12-02T09:00:00Z');
  assert.equal(isInPastDueGrace(base,day1),true);
  assert.equal(hasProAccess(base,day1),true);
  assert.equal(canAutoSend(base,day1),false);
  assert.equal(canAutoSend({...base,subscription_status:'active'},day1),true);
  const view=withEntitlements(base,day1);
  assert.equal(view.pro_access,true);
  assert.equal(view.in_payment_grace,true);
  assert.equal(view.payment_grace_ends_at,'2026-12-15T00:00:00.000Z');
  assert.equal(view.is_paid_subscription,false,'not counted as paying while past_due');
});

test('grace ends exactly at period start + 14 days, then Free',()=>{
  assert.equal(hasProAccess(base,at('2026-12-14T23:59:59Z')),true);
  assert.equal(hasProAccess(base,at('2026-12-15T00:00:00Z')),false);
  assert.equal(withEntitlements(base,at('2026-12-16T00:00:00Z')).pro_access,false);
});

test('unpaid and canceled are Free immediately; payment confirmed is Pro again',()=>{
  const now=at('2026-12-02T00:00:00Z');
  assert.equal(hasProAccess({...base,plan:'free',subscription_status:'unpaid'},now),false);
  assert.equal(hasProAccess({...base,plan:'pro',subscription_status:'unpaid'},now),false);
  assert.equal(hasProAccess({...base,plan:'free',subscription_status:'canceled'},now),false);
  assert.equal(hasProAccess({...base,subscription_status:'active'},now),true);
});

test('no Stripe period start known → no grace (conservative)',()=>{
  const p={...base,subscription_current_period_start:null};
  assert.equal(pastDueGraceEndsAt(p),null);
  assert.equal(hasProAccess(p,at('2026-12-02T00:00:00Z')),false);
});

test('after the grace period the 5-active-quote rule applies',()=>{
  const quotes=Array.from({length:7},(_,i)=>({id:`q${i}`,status:'open',created_at:new Date(Date.UTC(2026,10,1+i)).toISOString()}));
  assert.equal(lockedQuoteIds(quotes,hasProAccess(base,at('2026-12-05T00:00:00Z'))).size,0,'during grace: nothing locked');
  assert.deepEqual([...lockedQuoteIds(quotes,hasProAccess(base,at('2026-12-20T00:00:00Z')))].sort(),['q0','q1'],'after grace: 2 oldest locked');
});
