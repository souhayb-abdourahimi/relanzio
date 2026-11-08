// Complete fictional Stripe API boundary for the existing lifecycle/retry tests.
export const testBillingEnv={NODE_ENV:'test',STRIPE_EXPECTED_MODE:'test',STRIPE_EXPECTED_ACCOUNT_ID:'acct_fixture',STRIPE_SECRET_KEY:'sk_test_fixture',STRIPE_PRO_PRICE_ID:'price_fixture'};
export function fixtureStripe(stripe,userId,{live=false,customerId='cus_1',priceId='price_fixture'}={}){
  const price={id:priceId,livemode:live,currency:'eur',unit_amount:2900,recurring:{interval:'month',interval_count:1}};
  stripe.accounts={retrieve:async()=>({id:'acct_fixture'})};
  stripe.prices={retrieve:async()=>({...price})};
  stripe.customers={retrieve:async id=>({id,livemode:live,metadata:{user_id:userId}})};
  const retrieve=stripe.subscriptions.retrieve;
  stripe.subscriptions.retrieve=async id=>{
    const s=structuredClone(await retrieve(id));
    return {customer:customerId,livemode:live,metadata:{user_id:userId},...s,items:{has_more:false,...s.items,data:s.items?.data?.map(i=>({quantity:1,...i,price:{...price,...i.price}}))??[{quantity:1,price}]}};
  };
  return stripe;
}
