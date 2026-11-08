// Configuration and identity checks fail closed. Never derive the expected mode from an event.
const fail=code=>{throw Object.assign(new Error(code),{code});};
export function stripeBoundaryConfig(env=process.env){
  const mode=env.STRIPE_EXPECTED_MODE;
  if(!['live','test'].includes(mode))fail('BILLING_MODE_NOT_CONFIGURED');
  const production=env.NODE_ENV==='production'||String(env.SUPABASE_URL||'').includes('uwgvnhnpvxoebabayqac')||/^https:\/\/(www\.)?relanzio\.com(?:\/|$)/.test(env.APP_URL||'');
  if(production&&mode!=='live')fail('BILLING_PRODUCTION_REQUIRES_LIVE');
  const keyMode=/^(sk|rk)_live_/.test(env.STRIPE_SECRET_KEY||'')?'live':/^(sk|rk)_test_/.test(env.STRIPE_SECRET_KEY||'')?'test':null;
  if(keyMode!==mode)fail('BILLING_KEY_MODE_MISMATCH');
  if(!/^acct_[A-Za-z0-9]+$/.test(env.STRIPE_EXPECTED_ACCOUNT_ID||''))fail('BILLING_ACCOUNT_NOT_CONFIGURED');
  if(!/^price_[A-Za-z0-9_]+$/.test(env.STRIPE_PRO_PRICE_ID||''))fail('BILLING_PRICE_NOT_CONFIGURED');
  return {livemode:mode==='live',accountId:env.STRIPE_EXPECTED_ACCOUNT_ID,priceId:env.STRIPE_PRO_PRICE_ID};
}
function assertMode(object,config){if(object?.livemode!==config.livemode)fail('BILLING_MODE_MISMATCH');}
function assertPrice(price,config){
  assertMode(price,config);
  if(price?.id!==config.priceId||price.currency!=='eur'||price.unit_amount!==2900||price.recurring?.interval!=='month'||price.recurring?.interval_count!==1)
    fail('BILLING_PRICE_MISMATCH');
}
export async function verifyStripeConfiguration(stripe,env=process.env,event){
  const config=stripeBoundaryConfig(env);
  if(event){
    assertMode(event,config);
    if(event.data?.object?.livemode!==undefined)assertMode(event.data.object,config);
    if(event.account&&event.account!==config.accountId)fail('BILLING_ACCOUNT_MISMATCH');
    if(event.context&&event.context!==config.accountId)fail('BILLING_ACCOUNT_MISMATCH');
  }
  if(!stripe)fail('BILLING_STRIPE_UNAVAILABLE');
  // Read with the same SDK client/key as subscription retrieval. No cached success across failures.
  const account=await stripe.accounts.retrieve();
  if(account.id!==config.accountId)fail('BILLING_ACCOUNT_MISMATCH');
  assertPrice(await stripe.prices.retrieve(config.priceId),config);
  return config;
}
export async function verifyStripeCustomer(stripe,config,customerId,profile){
  const customer=await stripe.customers.retrieve(customerId);
  if(customer.deleted||customer.id!==customerId)fail('BILLING_CUSTOMER_MISMATCH');
  assertMode(customer,config);
  if(customer.metadata?.user_id!==profile.id)fail('BILLING_PROFILE_MISMATCH');
}
export async function verifyStripeSubscription(stripe,config,subscription,profile,customerId){
  assertMode(subscription,config);
  if(subscription.metadata?.user_id!==profile.id)fail('BILLING_PROFILE_MISMATCH');
  const items=subscription.items;
  if(items?.has_more||items?.data?.length!==1||items.data[0].quantity!==1)fail('BILLING_PRICE_MISMATCH');
  assertPrice(items.data[0].price,config);
  await verifyStripeCustomer(stripe,config,customerId,profile);
}
