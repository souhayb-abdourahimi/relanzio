export function normalizeSubscriptionStatus(status='') {
  return ['active','trialing','past_due','unpaid','canceled'].includes(status) ? status : 'none';
}
export function planForSubscriptionStatus(status='none') {
  return ['active','trialing'].includes(normalizeSubscriptionStatus(status)) ? 'pro' : 'free';
}
export function billingTransition(eventType, object={}, current={plan:'free',subscription_status:'none'}) {
  if(eventType==='checkout.session.completed'){
    const paid=object.payment_status==='paid';return {plan:paid?'pro':'free',subscription_status:paid?'active':'none'};
  }
  if(eventType==='customer.subscription.deleted')return {plan:'free',subscription_status:'canceled'};
  if(eventType==='customer.subscription.updated'){const status=normalizeSubscriptionStatus(object.status);return {plan:planForSubscriptionStatus(status),subscription_status:status};}
  if(eventType==='invoice.payment_failed')return {plan:current.plan,subscription_status:'past_due'};
  if(eventType==='invoice.paid')return {plan:'pro',subscription_status:'active'};
  return {plan:current.plan,subscription_status:current.subscription_status};
}
