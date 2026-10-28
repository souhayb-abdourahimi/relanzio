import { db } from './db.js';
import { generateFollowup, sendEmail } from './email.js';
import { nextFollowupDate } from './logic.js';
import { reportError } from './observability.js';
import { hasProAccess, canAutoSend } from './entitlements.js';
import { isAutomaticSendWindow, parisBusinessDate, providerFailureDisposition } from './followup-policy.js';
import { signEmailLink, emailLinkUrl, followupFooter } from './email-links.js';
import { replyConfiguration, newReplyToken, replyAddress } from './quote-replies.js';

export async function isFollowupOptedOut(userId,email){
  if(!email)return false;
  const {data,error}=await db.from('followup_optouts').select('email').eq('user_id',userId).eq('email',String(email).toLowerCase()).maybeSingle();
  if(error)throw error;
  return Boolean(data);
}

export const nextDate = nextFollowupDate;

export function createFollowupPreview(quote, profile) {
  if (quote.reply_received_at) throw new Error('QUOTE_REPLIED');
  const step = Number(quote.followup_step || 0);
  if (step >= 3) throw new Error('SEQUENCE_COMPLETE');
  return generateFollowup(quote, step, profile.company_name || '');
}

async function claimQuote(quote) {
  const stale = new Date(Date.now()-5*60_000).toISOString();
  const claimedAt=new Date().toISOString();
  const { data, error } = await db.from('quotes').update({ send_claimed_at:claimedAt, updated_at:claimedAt })
    .eq('id',quote.id).eq('user_id',quote.user_id).eq('status','open').eq('followup_step',quote.followup_step).is('reply_received_at',null)
    .or(`send_claimed_at.is.null,send_claimed_at.lt.${stale}`).select('*').maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('FOLLOWUP_ALREADY_IN_PROGRESS');
  return data;
}

function successfulStatus(status){return ['sent','delivered','opened','clicked','bounced'].includes(status)}

export async function confirmManualFollowup({quoteId,userId,expectedStep,subject,body,requestKey,confirmedAt=new Date().toISOString()}){
  const {data,error}=await db.rpc('confirm_manual_followup',{
    p_quote_id:quoteId,
    p_user_id:userId,
    p_expected_step:Number(expectedStep),
    p_subject:String(subject||'').slice(0,200),
    p_body:String(body||'').slice(0,10000),
    p_request_key:String(requestKey||'').slice(0,100),
    p_confirmed_at:confirmedAt
  });
  if(error)throw error;
  if(!data?.ok){
    const e=new Error(data?.code||'MANUAL_FOLLOWUP_FAILED');
    e.code=data?.code||'MANUAL_FOLLOWUP_FAILED';
    throw e;
  }
  return data;
}

async function finalizeRelanzioFollowup({followupId,claimed,sentAt,providerMessageId}){
  const {data,error}=await db.rpc('finalize_relanzio_followup',{
    p_followup_id:followupId,
    p_quote_id:claimed.id,
    p_user_id:claimed.user_id,
    p_expected_previous_step:Number(claimed.followup_step||0),
    p_sent_at:sentAt,
    p_provider_message_id:providerMessageId||null
  });
  if(error)throw error;
  if(!data?.ok)throw new Error(data?.code||'FOLLOWUP_FINALIZE_FAILED');
  return data;
}

export async function sendQuoteFollowup(quote, profile, requestKey=null, options={}) {
  if (!hasProAccess(profile)) throw new Error('PRO_ACCESS_REQUIRED');
  const automatic=options.automatic===true;
  if(automatic&&!isAutomaticSendWindow())throw new Error('AUTO_SEND_OUTSIDE_WINDOW');
  if(automatic&&!canAutoSend(profile))throw new Error('AUTO_SEND_PAYMENT_FAILING');

  if (requestKey) {
    const {data:prior,error:priorError}=await db.from('followups').select('*').eq('user_id',quote.user_id).eq('request_key',requestKey).maybeSingle();
    if(priorError)throw priorError;
    if(prior){
      if(successfulStatus(prior.status)){
        const {data:current}=await db.from('quotes').select('next_followup_at,followup_step').eq('id',quote.id).eq('user_id',quote.user_id).maybeSingle();
        return {step:prior.step,subject:prior.subject,body:prior.body,provider_message_id:prior.provider_message_id,next_followup_at:current?.next_followup_at||null,idempotent:true};
      }
      throw new Error('FOLLOWUP_REQUEST_ALREADY_FAILED');
    }
  }

  if(quote.reply_received_at)throw new Error('QUOTE_REPLIED');
  if(!quote.client_email)throw new Error('EMAIL_RECIPIENT_MISSING');
  if(await isFollowupOptedOut(quote.user_id,quote.client_email))throw new Error('EMAIL_RECIPIENT_OPTED_OUT');
  // Built before any claim or provider call: a missing EMAIL_LINK_SECRET blocks the send cleanly.
  const unsubscribeUrl=emailLinkUrl(signEmailLink('followup_optout',{u:quote.user_id,e:String(quote.client_email).toLowerCase()}));

  const claimed = await claimQuote(quote);
  const sendStartedAt=new Date().toISOString();
  const businessDate=parisBusinessDate(sendStartedAt);
  let followupId = null;
  let providerAttempted=false;
  try {
    if(automatic){
      const {data:today,error:todayError}=await db.from('followups').select('id,status').eq('quote_id',claimed.id).eq('channel','relanzio').eq('business_date',businessDate).limit(1).maybeSingle();
      if(todayError)throw todayError;
      if(today)throw new Error('FOLLOWUP_DAILY_LIMIT');
    }

    const generated = createFollowupPreview(claimed, profile);
    // Replies to this email carry a one-time token so Relanzio can stop the sequence (null when not configured).
    const replyToken=replyConfiguration().configured?newReplyToken():null;
    const preview={
      ...generated,
      subject:String(options.subject||generated.subject).slice(0,200),
      body:String(options.body||generated.body).slice(0,10000)
    };
    const {data:draft,error:draftError}=await db.from('followups').insert({
      quote_id:claimed.id,user_id:claimed.user_id,step:preview.step,subject:preview.subject,body:preview.body,
      status:'draft',request_key:requestKey,channel:'relanzio',business_date:businessDate,reply_token:replyToken
    }).select('id').single();
    if(draftError){
      await db.from('quotes').update({send_claimed_at:null}).eq('id',claimed.id).eq('user_id',claimed.user_id);
      if(String(draftError.code)==='23505'){
        if(requestKey){
          const {data:prior}=await db.from('followups').select('*').eq('user_id',claimed.user_id).eq('request_key',requestKey).maybeSingle();
          if(prior&&successfulStatus(prior.status))return {step:prior.step,subject:prior.subject,body:prior.body,provider_message_id:prior.provider_message_id,next_followup_at:claimed.next_followup_at,idempotent:true};
        }
        const {data:sameDay}=await db.from('followups').select('id').eq('quote_id',claimed.id).eq('channel','relanzio').eq('business_date',businessDate).limit(1).maybeSingle();
        if(sameDay)throw new Error('FOLLOWUP_DAILY_LIMIT');
        throw new Error('FOLLOWUP_ALREADY_RECORDED');
      }
      throw draftError;
    }
    followupId=draft.id;
    providerAttempted=true;
    const sent = await sendEmail({
      to:claimed.client_email, subject:preview.subject,
      text:preview.body+followupFooter({companyName:profile.company_name,quoteTitle:claimed.title,unsubscribeUrl}),
      headers:{'List-Unsubscribe':`<${unsubscribeUrl}>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'},
      replyTo:(replyToken&&replyAddress(replyToken))||profile.email, senderName:`${profile.company_name || 'Votre entreprise'} via Relanzio`, tags:['relanzio-followup']
    });
    const sentAt=new Date().toISOString();
    const finalized=await finalizeRelanzioFollowup({followupId,claimed,sentAt,providerMessageId:sent?.messageId||null});
    await db.from('product_events').insert({user_id:claimed.user_id,event:'followup_sent',path:'/app',metadata:{channel:'relanzio',automatic,step:preview.step,reply_tracking:Boolean(replyToken)}});
    return {...preview,provider_message_id:sent?.messageId||null,next_followup_at:finalized.quote?.next_followup_at||null};
  } catch (e) {
    await db.from('quotes').update({send_claimed_at:null}).eq('id',claimed.id).eq('user_id',claimed.user_id);
    if(followupId){
      const disposition=providerAttempted?providerFailureDisposition(e):'certain';
      if(disposition==='certain'){
        await db.from('followups').delete().eq('id',followupId).eq('status','draft');
      }else{
        await db.from('followups').update({status:'failed',error:`AMBIGUOUS_PROVIDER_RESULT: ${String(e.message||e).slice(0,900)}`}).eq('id',followupId).eq('status','draft');
        await db.from('quotes').update({auto_send:false}).eq('id',claimed.id).eq('user_id',claimed.user_id);
      }
    }
    throw e;
  }
}

// Automatic sending needs the global switch AND reply detection: never send by itself to a client
// whose answer Relanzio could not see.
export function automaticSendingAvailable(env=process.env){
  return env.FOLLOWUP_AUTOMATION_ENABLED==='true'&&replyConfiguration(env).configured;
}

export async function runDueFollowups(now=new Date()) {
  if (process.env.FOLLOWUP_AUTOMATION_ENABLED !== 'true') return [{ skipped:'automation_disabled' }];
  if (!replyConfiguration().configured) return [{ skipped:'reply_detection_not_configured' }];
  if(!isAutomaticSendWindow(now))return [{skipped:'outside_business_window'}];
  const nowIso=now.toISOString();
  const { data: quotes, error } = await db.from('quotes').select('*').eq('status','open').eq('auto_send',true).lte('next_followup_at',nowIso).lt('followup_step',3).is('reply_received_at',null).not('client_email','is',null).order('next_followup_at',{ascending:true}).limit(100);
  if (error) throw error;
  const results = [];
  for (const quote of quotes || []) {
    try {
      const {data:profile,error:profileError}=await db.from('profiles').select('*').eq('id',quote.user_id).maybeSingle();
      if(profileError)throw profileError;if(!profile)throw new Error('PROFILE_NOT_FOUND');
      if (['past_due','unpaid'].includes(profile.subscription_status)) { results.push({ id:quote.id, skipped:'payment_failing' }); continue; }
      if (!canAutoSend(profile) || profile.email_mode !== 'automatic') {
        results.push({ id:quote.id, skipped:'approval_or_subscription_required' }); continue;
      }
      const result = await sendQuoteFollowup(quote, profile, null, {automatic:true});
      results.push({ id:quote.id, sent:true, provider_message_id:result.provider_message_id });
    } catch (e) {
      if (e.message==='QUOTE_REPLIED') { results.push({id:quote.id,skipped:'client_replied'}); continue; }
      if (['FOLLOWUP_ALREADY_IN_PROGRESS','FOLLOWUP_DAILY_LIMIT'].includes(e.message)) { results.push({id:quote.id,skipped:e.message==='FOLLOWUP_DAILY_LIMIT'?'daily_limit':'already_claimed'}); continue; }
      if (['EMAIL_RECIPIENT_OPTED_OUT','EMAIL_RECIPIENT_MISSING'].includes(e.message)) { await db.from('quotes').update({auto_send:false}).eq('id',quote.id).eq('user_id',quote.user_id); results.push({id:quote.id,skipped:e.message==='EMAIL_RECIPIENT_OPTED_OUT'?'recipient_opted_out':'no_email'}); continue; }
      await db.from('quotes').update({auto_send:false,send_claimed_at:null}).eq('id',quote.id).eq('user_id',quote.user_id);
      await reportError('followup.send', e, { quote_id:quote.id, user_id:quote.user_id });
      results.push({ id:quote.id, error:String(e.message || e) });
    }
  }
  return results;
}
