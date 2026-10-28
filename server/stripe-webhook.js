import {
  billingTransition,
  normalizeSubscriptionStatus,
  planForSubscriptionStatus,
  shouldIgnoreBillingEvent,
} from './billing.js';
import { paymentFailedEmail } from './billing-emails.js';
import { pastDueGraceEndsAt } from './entitlements.js';

// Stripe webhook processing, isolated from Express so it can be exercised with signed test events.
// Guarantees: signature verified by the caller (constructEvent), each event id processed at most once
// (stripe_webhook_events claim, released on failure so Stripe can retry), stale/foreign events ignored.

const subscriptionIdFromObject=(obj,profile)=>{
  const direct=typeof obj?.subscription==='string'?obj.subscription:obj?.subscription?.id;
  const parent=typeof obj?.parent?.subscription_details?.subscription==='string'
    ?obj.parent.subscription_details.subscription
    :obj?.parent?.subscription_details?.subscription?.id;
  return direct||parent||profile?.stripe_subscription_id||null;
};
const customerIdOf=obj=>typeof obj?.customer==='string'?obj.customer:obj?.customer?.id||null;

// Period dates moved from the subscription to its items in recent Stripe API versions: read both.
// current_period_start anchors the past_due grace period (see entitlements.js).
export function subscriptionPeriod(sub={}){
  const start=sub.current_period_start??sub.items?.data?.[0]?.current_period_start??null;
  const end=sub.current_period_end??sub.items?.data?.[0]?.current_period_end??null;
  return {
    subscription_current_period_start:start?new Date(Number(start)*1000).toISOString():null,
    subscription_current_period_end:end?new Date(Number(end)*1000).toISOString():null,
    subscription_cancel_at_period_end:Boolean(sub.cancel_at_period_end||sub.cancel_at),
  };
}

export function createStripeWebhookProcessor({db,stripe,getProfile,reportError=async()=>{},sendEmail=null,now=()=>new Date(),env=process.env}){
  const nowIso=()=>now().toISOString();
  async function mustDb(promise){const result=await promise;if(result.error)throw result.error;return result.data;}
  async function profileByCustomer(customerId){
    if(!customerId)return null;
    const {data}=await db.from('profiles').select('*').eq('stripe_customer_id',customerId).maybeSingle();
    return data;
  }
  async function authoritativeState(eventType,obj,profile){
    const subscriptionId=['customer.subscription.updated','customer.subscription.deleted'].includes(eventType)?obj?.id:subscriptionIdFromObject(obj,profile);
    if(stripe&&subscriptionId){
      try{
        const current=await stripe.subscriptions.retrieve(subscriptionId);
        const status=normalizeSubscriptionStatus(current.status);
        return {transition:{plan:planForSubscriptionStatus(status),subscription_status:status,...subscriptionPeriod(current)},subscriptionId:current.id};
      }catch(e){
        if(eventType==='customer.subscription.deleted'&&(e?.code==='resource_missing'||e?.statusCode===404))
          return {transition:{plan:'free',subscription_status:'canceled',subscription_cancel_at_period_end:false},subscriptionId};
        throw e;
      }
    }
    const transition=billingTransition(eventType,obj,profile);
    if(eventType.startsWith('customer.subscription.'))Object.assign(transition,subscriptionPeriod(obj));
    return {transition,subscriptionId};
  }
  async function logEvent(userId,event,metadata={}){
    const {error}=await db.from('product_events').insert({user_id:userId,event,path:'/stripe',metadata});
    if(error)await reportError('product_events.insert',error,{event});
  }
  // Billing emails are service messages; each one is claimed once in lifecycle_messages(user_id,type).
  async function sendOnce(profile,type,message){
    if(env.BILLING_EMAILS_ENABLED!=='true'||!sendEmail||!profile?.email)return {skipped:true};
    const {error:claimError}=await db.from('lifecycle_messages').insert({user_id:profile.id,type,status:'sending'});
    if(claimError)return {skipped:true,duplicate:claimError.code==='23505'};
    try{
      await sendEmail({to:profile.email,subject:message.subject,text:message.text,replyTo:env.SUPPORT_EMAIL||'support@relanzio.com',tags:['relanzio-billing']});
      await db.from('lifecycle_messages').update({status:'sent',sent_at:nowIso()}).eq('user_id',profile.id).eq('type',type);
      return {sent:true};
    }catch(e){
      await db.from('lifecycle_messages').delete().eq('user_id',profile.id).eq('type',type);
      await reportError('billing.email',e,{type});
      return {error:String(e.message||e)};
    }
  }
  async function applyBillingEvent(profile,event,obj,extra={}){
    if(!profile||shouldIgnoreBillingEvent(profile,event.type,obj,event.created))return {applied:false,ignored:true};
    const state=await authoritativeState(event.type,obj,profile);
    const eventCreated=Number(event.created||0);
    const patch={...state.transition,...extra,updated_at:nowIso()};
    if(eventCreated)patch.stripe_state_event_created=eventCreated;
    const subscriptionId=state.subscriptionId||extra.stripe_subscription_id;
    if(subscriptionId!==undefined)patch.stripe_subscription_id=subscriptionId||null;
    let query=db.from('profiles').update(patch).eq('id',profile.id);
    if(eventCreated)query=query.lte('stripe_state_event_created',eventCreated);
    const {data,error}=await query.select('id').maybeSingle();
    if(error)throw error;
    if(!data)return {applied:false,ignored:true};
    const before=profile.subscription_status,after=patch.subscription_status;
    if(after==='active'&&before!=='active')await logEvent(profile.id,'subscription_active',{from:before||'none'});
    if(after==='past_due'&&before!=='past_due')await logEvent(profile.id,'payment_failed',{});
    const cancelRequested=patch.subscription_cancel_at_period_end===true&&!profile.subscription_cancel_at_period_end;
    if(cancelRequested||(after==='canceled'&&before!=='canceled'&&!profile.subscription_cancel_at_period_end))
      await logEvent(profile.id,'subscription_canceled',{at_period_end:cancelRequested});
    return {applied:true,patch};
  }

  async function processEvent(event){
    const {error:claimError}=await db.from('stripe_webhook_events').insert({event_id:event.id,event_type:event.type});
    if(claimError?.code==='23505')return {received:true,duplicate:true};
    if(claimError)throw claimError;
    try{
      const obj=event.data.object;
      let result=null;
      if(event.type==='checkout.session.completed'){
        const userId=obj.metadata?.user_id,customerId=customerIdOf(obj);
        if(userId){
          const profile=await getProfile({id:userId,email:obj.customer_details?.email||''});
          result=await applyBillingEvent(profile,event,obj,{stripe_customer_id:customerId||profile.stripe_customer_id||null});
        }
      }
      if(['customer.subscription.updated','customer.subscription.deleted'].includes(event.type)){
        const profile=await profileByCustomer(customerIdOf(obj));
        if(profile)result=await applyBillingEvent(profile,event,obj,{stripe_subscription_id:obj.id||profile.stripe_subscription_id});
      }
      if(['invoice.payment_failed','invoice.paid'].includes(event.type)){
        const profile=await profileByCustomer(customerIdOf(obj));
        if(profile){
          result=await applyBillingEvent(profile,event,obj,{});
          if(event.type==='invoice.payment_failed'&&result?.applied)
            await sendOnce(profile,`payment_failed:${obj.id||event.id}`,paymentFailedEmail({appUrl:env.APP_URL,graceEndsAt:pastDueGraceEndsAt({...profile,...result.patch})}));
        }
      }
      await mustDb(db.from('stripe_webhook_events').update({processed_at:nowIso()}).eq('event_id',event.id));
      return {received:true,result};
    }catch(e){
      await db.from('stripe_webhook_events').delete().eq('event_id',event.id);
      throw e;
    }
  }
  return {processEvent,sendOnce};
}
