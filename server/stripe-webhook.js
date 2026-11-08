import {
  billingEventSubscriptionId,
  normalizeSubscriptionStatus,
  planForSubscriptionStatus,
  shouldIgnoreBillingEvent,
} from './billing.js';
import { paymentFailedEmail } from './billing-emails.js';
import { pastDueGraceEndsAt } from './entitlements.js';
import { verifyStripeConfiguration, verifyStripeSubscription } from './stripe-boundary.js';

// Event completion is durable; unfinished claims expire so interrupted workers can be retried.
const CLAIM_TTL_MS=5*60_000;
const billingError=code=>Object.assign(new Error(code),{code});
const ignored=reason=>({applied:false,ignored:true,reason});
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

export function createStripeWebhookProcessor({db,stripe,reportError=async()=>{},sendEmail=null,now=()=>new Date(),env=process.env}){
  const nowIso=()=>now().toISOString();
  async function mustDb(promise){
    try{const result=await promise;if(result.error)throw result.error;return result.data;}
    catch(cause){throw Object.assign(billingError('BILLING_DB_ERROR'),{cause});}
  }
  async function profileByCustomer(customerId){
    if(!customerId)throw billingError('BILLING_CUSTOMER_MISSING');
    return mustDb(db.from('profiles').select('*').eq('stripe_customer_id',customerId).maybeSingle());
  }
  async function authoritativeState(eventType,obj,profile,config){
    const subscriptionId=billingEventSubscriptionId(eventType,obj);
    if(!subscriptionId)throw billingError('BILLING_SUBSCRIPTION_MISSING');
    if(!stripe)throw billingError('BILLING_STRIPE_UNAVAILABLE');
    const current=await stripe.subscriptions.retrieve(subscriptionId);
    if(current.id!==subscriptionId||!customerIdOf(obj)||customerIdOf(current)!==customerIdOf(obj))
      throw billingError('BILLING_CUSTOMER_MISMATCH');
    await verifyStripeSubscription(stripe,config,current,profile,customerIdOf(obj));
    const status=normalizeSubscriptionStatus(current.status);
    return {transition:{plan:planForSubscriptionStatus(status),subscription_status:status,...subscriptionPeriod(current)},subscriptionId};
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
  async function applyBillingEvent(profile,event,obj,extra={},verifyClaim=async()=>{},config){
    if(shouldIgnoreBillingEvent(profile,event.type,obj,event.created))return ignored('stale_or_foreign_subscription');
    const state=await authoritativeState(event.type,obj,profile,config);
    await verifyClaim();
    const eventCreated=Number(event.created||0);
    const patch={...state.transition,...extra,updated_at:nowIso()};
    if(eventCreated)patch.stripe_state_event_created=eventCreated;
    const subscriptionId=state.subscriptionId||extra.stripe_subscription_id;
    if(subscriptionId!==undefined)patch.stripe_subscription_id=subscriptionId||null;
    let query=db.from('profiles').update(patch).eq('id',profile.id);
    // Compare the snapshot, including status: event.created has only second precision.
    // A competing handler must trigger a fresh Stripe read, never overwrite newer rights.
    for(const key of ['stripe_state_event_created','stripe_customer_id','stripe_subscription_id','subscription_status','plan','updated_at','subscription_current_period_start','subscription_current_period_end','subscription_cancel_at_period_end'])
      query=profile[key]==null?query.is(key,null):query.eq(key,profile[key]);
    const data=await mustDb(query.select('id').maybeSingle());
    if(!data)throw billingError('BILLING_STATE_CHANGED');
    const before=profile.subscription_status,after=patch.subscription_status;
    if(after==='active'&&before!=='active')await logEvent(profile.id,'subscription_active',{from:before||'none'});
    if(after==='past_due'&&before!=='past_due')await logEvent(profile.id,'payment_failed',{});
    const cancelRequested=patch.subscription_cancel_at_period_end===true&&!profile.subscription_cancel_at_period_end;
    if(cancelRequested||(after==='canceled'&&before!=='canceled'&&!profile.subscription_cancel_at_period_end))
      await logEvent(profile.id,'subscription_canceled',{at_period_end:cancelRequested});
    return {applied:true,patch};
  }

  async function claimEvent(event){
    const lease=nowIso();
    const {error}=await db.from('stripe_webhook_events').insert({event_id:event.id,event_type:event.type,created_at:lease,processed_at:null});
    if(!error)return lease;
    if(error.code!=='23505')throw Object.assign(billingError('BILLING_DB_ERROR'),{cause:error});
    const existing=await mustDb(db.from('stripe_webhook_events').select('*').eq('event_id',event.id).maybeSingle());
    if(existing?.processed_at)return null;
    if(!existing||new Date(existing.created_at).getTime()>now().getTime()-CLAIM_TTL_MS)
      throw billingError('BILLING_EVENT_IN_PROGRESS');
    const reclaimed=await mustDb(db.from('stripe_webhook_events').update({created_at:lease})
      .eq('event_id',event.id).eq('created_at',existing.created_at).is('processed_at',null).select('event_id').maybeSingle());
    if(!reclaimed)throw billingError('BILLING_EVENT_IN_PROGRESS');
    return lease;
  }
  async function processEvent(event){
    // Even completed duplicates must pass the mode/account boundary before any DB access.
    const config=await verifyStripeConfiguration(stripe,env,event);
    const lease=await claimEvent(event);
    if(lease===null)return {received:true,duplicate:true};
    const owned=()=>db.from('stripe_webhook_events');
    const verifyClaim=async()=>{
      const row=await mustDb(owned().select('event_id').eq('event_id',event.id).eq('created_at',lease).is('processed_at',null).maybeSingle());
      if(!row||now().getTime()-new Date(lease).getTime()>=CLAIM_TTL_MS)throw billingError('BILLING_EVENT_IN_PROGRESS');
    };
    try{
      const obj=event.data.object;
      const checkout=event.type==='checkout.session.completed';
      const supported=['checkout.session.completed','customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','invoice.payment_failed','invoice.paid'].includes(event.type);
      let result;
      if(!supported)result=ignored('unsupported_event');
      else if(checkout&&obj.mode&&obj.mode!=='subscription')result=ignored('non_subscription_checkout');
      else if(event.type.startsWith('invoice.')&&!billingEventSubscriptionId(event.type,obj))result=ignored('non_subscription_invoice');
      else{
        if(!billingEventSubscriptionId(event.type,obj))throw billingError('BILLING_SUBSCRIPTION_MISSING');
        const profile=checkout
          ?(obj.metadata?.user_id?await mustDb(db.from('profiles').select('*').eq('id',obj.metadata.user_id).maybeSingle()):null)
          :await profileByCustomer(customerIdOf(obj));
        if(!profile)throw billingError('BILLING_PROFILE_NOT_FOUND');
        if(checkout&&obj.client_reference_id&&obj.client_reference_id!==profile.id)throw billingError('BILLING_PROFILE_MISMATCH');
        if(checkout&&profile.stripe_customer_id&&profile.stripe_customer_id!==customerIdOf(obj))throw billingError('BILLING_CUSTOMER_MISMATCH');
        if(!checkout&&!profile.stripe_subscription_id)throw billingError('BILLING_SUBSCRIPTION_NOT_LINKED');
        result=await applyBillingEvent(profile,event,obj,checkout?{stripe_customer_id:customerIdOf(obj)}:{},verifyClaim,config);
        if(event.type==='invoice.payment_failed'&&result.applied&&result.patch.subscription_status==='past_due')
          await sendOnce(profile,`payment_failed:${obj.id||event.id}`,paymentFailedEmail({appUrl:env.APP_URL,graceEndsAt:pastDueGraceEndsAt({...profile,...result.patch})}));
      }
      const completed=await mustDb(owned().update({processed_at:nowIso()}).eq('event_id',event.id).eq('created_at',lease).is('processed_at',null).select('event_id').maybeSingle());
      if(!completed)throw billingError('BILLING_EVENT_IN_PROGRESS');
      return {received:true,result};
    }catch(e){
      // Never delete another worker's claim, or a completion whose response was lost.
      try{await mustDb(owned().delete().eq('event_id',event.id).eq('created_at',lease).is('processed_at',null));}
      catch{try{await reportError('stripe.claim_cleanup',billingError('BILLING_DB_ERROR'),{event_id:event.id});}catch{}}
      throw e;
    }
  }
  return {processEvent,sendOnce};
}

// Keep transport failures distinct from signature rejection; never acknowledge failed processing.
export function createStripeWebhookHandler({stripe,secret,processEvent,reportError=async()=>{}}){
  return async(req,res)=>{
    if(!stripe||!secret)return res.status(503).send('Stripe not configured');
    let event;
    try{event=stripe.webhooks.constructEvent(req.body,req.headers['stripe-signature'],secret);}
    catch{return res.status(400).send('Invalid webhook signature');}
    try{return res.json(await processEvent(event));}
    catch(error){
      try{await reportError('stripe.webhook',error,{event_id:event.id,event_type:event.type,request_id:req.requestId});}catch{}
      return res.status(503).send('Webhook processing failed');
    }
  };
}
