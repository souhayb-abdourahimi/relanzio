import { TRIAL_DAYS, PAST_DUE_GRACE_DAYS } from '../shared/plans.js';
export { TRIAL_DAYS };
const DAY_MS = 24*60*60*1000;

const ms = value => {
  const n = value ? new Date(value).getTime() : NaN;
  return Number.isFinite(n) ? n : null;
};

// Payment grace period (past_due). Rule, computed from Stripe data only (no cron):
// a subscription that Stripe reports as past_due keeps Pro until
//   grace end = subscription_current_period_start + PAST_DUE_GRACE_DAYS
// i.e. 14 days after the start of the period whose renewal payment failed (the end of the paid period).
// While Stripe retries, the account stays Pro; after the grace end it is Free (5-active-quote rule)
// even if Stripe still says past_due. unpaid and canceled are Free immediately. invoice.paid → active → Pro.
// Without a known period start there is no grace. Automatic sending stays suspended during the grace period.
export { PAST_DUE_GRACE_DAYS };

export function pastDueGraceEndsAt(profile={}) {
  if(profile.subscription_status!=='past_due')return null;
  const start=ms(profile.subscription_current_period_start);
  return start?new Date(start+PAST_DUE_GRACE_DAYS*DAY_MS).toISOString():null;
}

export function isInPastDueGrace(profile={}, now=new Date()) {
  const end=ms(pastDueGraceEndsAt(profile)), current=now instanceof Date?now.getTime():new Date(now).getTime();
  return Boolean(profile.plan==='pro' && end && current<end);
}

export function hasSubscriptionProAccess(profile={}, now=new Date()) {
  if(profile.plan!=='pro')return false;
  return ['active','trialing'].includes(profile.subscription_status) || isInPastDueGrace(profile,now);
}

// Automatic follow-ups need Pro and a subscription in good standing: suspended while a payment is failing.
export function canAutoSend(profile={}, now=new Date()) {
  return hasProAccess(profile,now) && !['past_due','unpaid'].includes(profile.subscription_status);
}

export function isPaidSubscriber(profile={}) {
  return profile.plan === 'pro' && profile.subscription_status === 'active';
}

export function isManagedTrialActive(profile={}, now=new Date()) {
  const start=ms(profile.trial_started_at), end=ms(profile.trial_ends_at), current=now instanceof Date?now.getTime():new Date(now).getTime();
  return Boolean(start && end && !profile.trial_expired_at && end>current);
}

export function isManagedTrialExpired(profile={}, now=new Date()) {
  const end=ms(profile.trial_ends_at), current=now instanceof Date?now.getTime():new Date(now).getTime();
  return Boolean(profile.trial_started_at && end && !profile.trial_expired_at && end<=current);
}

export function hasProAccess(profile={}, now=new Date()) {
  return hasSubscriptionProAccess(profile,now) || isManagedTrialActive(profile,now);
}

export function trialDaysRemaining(profile={}, now=new Date()) {
  if(hasSubscriptionProAccess(profile,now)||!isManagedTrialActive(profile,now))return 0;
  const current=now instanceof Date?now.getTime():new Date(now).getTime();
  return Math.max(1,Math.ceil((new Date(profile.trial_ends_at).getTime()-current)/DAY_MS));
}

export function isTrialEligible(profile={}) {
  return Boolean(!profile.trial_started_at && !profile.stripe_subscription_id && normalizeTrialSubscriptionStatus(profile.subscription_status)==='none');
}

function normalizeTrialSubscriptionStatus(status=''){
  return ['none','trialing','active','past_due','unpaid','canceled'].includes(status)?status:'none';
}

export function withEntitlements(profile={}, now=new Date()) {
  const subscriptionPro=hasSubscriptionProAccess(profile,now);
  const trialActive=!subscriptionPro&&isManagedTrialActive(profile,now);
  const proAccess=subscriptionPro||trialActive;
  return {
    ...profile,
    pro_access:proAccess,
    effective_plan:proAccess?'pro':'free',
    trial_active:trialActive,
    trial_days_remaining:trialDaysRemaining(profile,now),
    trial_eligible:isTrialEligible(profile),
    is_paid_subscription:isPaidSubscriber(profile),
    payment_grace_ends_at:pastDueGraceEndsAt(profile),
    in_payment_grace:isInPastDueGrace(profile,now)
  };
}

export function trialWindow(now=new Date()) {
  const start=now instanceof Date?new Date(now):new Date(now);
  const end=new Date(start.getTime()+TRIAL_DAYS*DAY_MS);
  return {trial_started_at:start.toISOString(),trial_ends_at:end.toISOString()};
}
