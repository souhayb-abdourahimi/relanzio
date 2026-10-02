import { db } from './db.js';
import { generateFollowup, sendEmail } from './email.js';
import { nextFollowupDate } from './logic.js';
import { reportError } from './observability.js';

export const nextDate = nextFollowupDate;

export async function createFollowupPreview(quote, profile) {
  const step = Number(quote.followup_step || 0);
  if (step >= 3) throw new Error('SEQUENCE_COMPLETE');
  const body = await generateFollowup(quote, step, profile.company_name || 'Votre entreprise');
  return { step:step + 1, subject:`Suivi — ${quote.title}`, body };
}

async function claimQuote(quote) {
  const stale = new Date(Date.now()-5*60_000).toISOString();
  const { data, error } = await db.from('quotes').update({ send_claimed_at:new Date().toISOString(), updated_at:new Date().toISOString() })
    .eq('id',quote.id).eq('user_id',quote.user_id).eq('status','open').eq('followup_step',quote.followup_step)
    .or(`send_claimed_at.is.null,send_claimed_at.lt.${stale}`).select('*').maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('FOLLOWUP_ALREADY_IN_PROGRESS');
  return data;
}

export async function sendQuoteFollowup(quote, profile) {
  if (!['active','trialing'].includes(profile.subscription_status) || profile.plan !== 'pro') throw new Error('PRO_SUBSCRIPTION_REQUIRED');
  const claimed = await claimQuote(quote);
  let followupId = null;
  try {
    const preview = await createFollowupPreview(claimed, profile);
    const {data:draft,error:draftError}=await db.from('followups').insert({quote_id:claimed.id,user_id:claimed.user_id,step:preview.step,subject:preview.subject,body:preview.body,status:'draft'}).select('id').single();
    if(draftError){if(String(draftError.code)==='23505')throw new Error('FOLLOWUP_ALREADY_RECORDED');throw draftError} followupId=draft.id;
    const sent = await sendEmail({
      to:claimed.client_email, subject:preview.subject, text:preview.body,
      replyTo:profile.email, senderName:`${profile.company_name || 'Votre entreprise'} via Relanzio`, tags:['relanzio-followup']
    });
    const sentAt=new Date().toISOString();
    const {error:followupError}=await db.from('followups').update({status:'sent',sent_at:sentAt,provider_message_id:sent?.messageId||null,error:null}).eq('id',followupId);
    if(followupError)throw followupError;
    const nextStep = Number(claimed.followup_step || 0) + 1;
    const nextAt = nextStep < 3 ? nextFollowupDate(claimed.sent_at, nextStep) : null;
    const { error:updateError } = await db.from('quotes').update({ followup_step:nextStep, next_followup_at:nextAt, send_claimed_at:null, updated_at:sentAt }).eq('id',claimed.id).eq('user_id',claimed.user_id).eq('followup_step',claimed.followup_step);
    if (updateError) throw updateError;
    return { ...preview, provider_message_id:sent?.messageId || null, next_followup_at:nextAt };
  } catch (e) {
    await db.from('quotes').update({send_claimed_at:null}).eq('id',claimed.id).eq('user_id',claimed.user_id);
    if(followupId)await db.from('followups').update({status:'failed',error:String(e.message||e).slice(0,1000)}).eq('id',followupId).eq('status','draft');
    throw e;
  }
}

export async function runDueFollowups() {
  if (process.env.FOLLOWUP_AUTOMATION_ENABLED !== 'true') return [{ skipped:'automation_disabled' }];
  const now = new Date().toISOString();
  const { data: quotes, error } = await db.from('quotes').select('*').eq('status','open').eq('auto_send',true).lte('next_followup_at',now).lt('followup_step',3).limit(100);
  if (error) throw error;
  const results = [];
  for (const quote of quotes || []) {
    try {
      const {data:profile,error:profileError}=await db.from('profiles').select('*').eq('id',quote.user_id).maybeSingle();
      if(profileError)throw profileError;if(!profile)throw new Error('PROFILE_NOT_FOUND');
      if (profile.plan !== 'pro' || profile.email_mode !== 'automatic' || !['active','trialing'].includes(profile.subscription_status)) {
        results.push({ id:quote.id, skipped:'approval_or_subscription_required' }); continue;
      }
      const result = await sendQuoteFollowup(quote, profile);
      results.push({ id:quote.id, sent:true, provider_message_id:result.provider_message_id });
    } catch (e) {
      if (e.message === 'FOLLOWUP_ALREADY_IN_PROGRESS') { results.push({id:quote.id,skipped:'already_claimed'}); continue; }
      await db.from('quotes').update({auto_send:false,send_claimed_at:null}).eq('id',quote.id).eq('user_id',quote.user_id);
      await reportError('followup.send', e, { quote_id:quote.id, user_id:quote.user_id });
      results.push({ id:quote.id, error:String(e.message || e) });
    }
  }
  return results;
}
