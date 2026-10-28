export function normalizeSubscriptionStatus(status='') {
  return ['active','trialing','past_due','unpaid','canceled'].includes(status) ? status : 'none';
}
export function planForSubscriptionStatus(status='none') {
  // past_due keeps plan 'pro': the grace period (entitlements.js) decides whether Pro is still usable.
  return ['active','trialing','past_due'].includes(normalizeSubscriptionStatus(status)) ? 'pro' : 'free';
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


export function billingEventSubscriptionId(eventType,object={}){
  if(['customer.subscription.updated','customer.subscription.deleted'].includes(eventType))return object?.id||null;
  const direct=typeof object?.subscription==='string'?object.subscription:object?.subscription?.id;
  const parent=typeof object?.parent?.subscription_details?.subscription==='string'
    ?object.parent.subscription_details.subscription
    :object?.parent?.subscription_details?.subscription?.id;
  return direct||parent||null;
}

export function shouldIgnoreBillingEvent(profile={},eventType='',object={},eventCreated=0){
  const created=Number(eventCreated||0),last=Number(profile.stripe_state_event_created||0);
  if(created&&last&&created<last)return true;
  const eventSub=billingEventSubscriptionId(eventType,object);
  const currentSub=profile.stripe_subscription_id||null;
  if(currentSub&&eventSub&&currentSub!==eventSub){
    if(['customer.subscription.updated','customer.subscription.deleted','invoice.paid','invoice.payment_failed'].includes(eventType))return true;
    if(eventType==='checkout.session.completed'&&last&&created<=last)return true;
  }
  return false;
}
