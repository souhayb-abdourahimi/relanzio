import { db, settleExpiredTrial } from './db.js';
import { hasSubscriptionProAccess, isTrialEligible, trialWindow, withEntitlements } from './entitlements.js';

const trialError=(code,message)=>Object.assign(new Error(message),{code});

async function grantTrialProfile(raw,grantedBy='admin') {
  const profile=await settleExpiredTrial(raw);
  if(profile.trial_started_at)throw trialError('TRIAL_ALREADY_USED','Ce compte a déjà utilisé son essai Pro.');
  if(hasSubscriptionProAccess(profile)||!isTrialEligible(profile))throw trialError('ALREADY_PRO','Ce compte a déjà eu un abonnement ou dispose de droits Pro via Stripe.');

  const window=trialWindow();
  const {data,error:updateError}=await db.from('profiles').update({
    plan:'pro',
    trial_started_at:window.trial_started_at,
    trial_ends_at:window.trial_ends_at,
    trial_expired_at:null,
    updated_at:window.trial_started_at
  }).eq('id',profile.id).is('trial_started_at',null).select('*').maybeSingle();
  if(updateError)throw updateError;
  if(!data)throw trialError('TRIAL_ALREADY_USED','Ce compte a déjà utilisé son essai Pro.');

  const {error:eventError}=await db.from('trial_events').insert({
    user_id:data.id,
    type:'activated',
    metadata:{granted_by:String(grantedBy||'admin').slice(0,120)}
  });
  if(eventError)throw eventError;
  return withEntitlements(data);
}

export async function grantTrialToUser(user,grantedBy='self') {
  const {data:raw,error}=await db.from('profiles').select('*').eq('id',user.id).maybeSingle();
  if(error)throw error;
  if(!raw)throw trialError('PROFILE_NOT_FOUND','Compte introuvable.');
  return grantTrialProfile(raw,grantedBy);
}

export async function grantTrialToEmail(email,grantedBy='admin') {
  const normalized=String(email||'').trim().toLowerCase();
  const {data:raw,error}=await db.from('profiles').select('*').eq('email',normalized).maybeSingle();
  if(error)throw error;
  if(!raw)throw trialError('PROFILE_NOT_FOUND','Compte introuvable. Le prospect doit d’abord créer son compte Relanzio.');
  return grantTrialProfile(raw,grantedBy);
}

export async function expireTrials(now=new Date()) {
  const iso=(now instanceof Date?now:new Date(now)).toISOString();
  const {data,error}=await db.from('profiles').select('*')
    .not('trial_started_at','is',null)
    .not('trial_ends_at','is',null)
    .is('trial_expired_at',null)
    .lte('trial_ends_at',iso)
    .limit(500);
  if(error)throw error;
  const results=[];
  for(const profile of data||[]){
    const settled=await settleExpiredTrial(profile,now);
    results.push({id:settled.id,plan:settled.plan,trial_expired_at:settled.trial_expired_at});
  }
  return results;
}
