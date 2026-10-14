export const TRIAL_DAYS = 7;
const DAY_MS = 24*60*60*1000;

const ms = value => {
  const n = value ? new Date(value).getTime() : NaN;
  return Number.isFinite(n) ? n : null;
};

export function hasSubscriptionProAccess(profile={}) {
  return profile.plan === 'pro' && ['active','trialing'].includes(profile.subscription_status);
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
  return hasSubscriptionProAccess(profile) || isManagedTrialActive(profile,now);
}

export function trialDaysRemaining(profile={}, now=new Date()) {
  if(!isManagedTrialActive(profile,now))return 0;
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
  const trialActive=isManagedTrialActive(profile,now);
  const proAccess=hasProAccess(profile,now);
  return {
    ...profile,
    pro_access:proAccess,
    effective_plan:proAccess?'pro':'free',
    trial_active:trialActive,
    trial_days_remaining:trialDaysRemaining(profile,now),
    trial_eligible:isTrialEligible(profile),
    is_paid_subscription:isPaidSubscriber(profile)
  };
}

export function trialWindow(now=new Date()) {
  const start=now instanceof Date?new Date(now):new Date(now);
  const end=new Date(start.getTime()+TRIAL_DAYS*DAY_MS);
  return {trial_started_at:start.toISOString(),trial_ends_at:end.toISOString()};
}
