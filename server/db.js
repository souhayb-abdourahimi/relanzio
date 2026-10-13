import { createClient } from "@supabase/supabase-js";
import { hasSubscriptionProAccess, isManagedTrialExpired, withEntitlements } from './entitlements.js';

export const db = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export async function settleExpiredTrial(profile,now=new Date()) {
  if(!profile || !isManagedTrialExpired(profile,now))return profile;
  const expiredAt=(now instanceof Date?now:new Date(now)).toISOString();
  const paidAccess=hasSubscriptionProAccess(profile);
  const patch={trial_expired_at:expiredAt,updated_at:expiredAt};
  if(!paidAccess){patch.plan='free';patch.email_mode='review';}

  const {data,error}=await db.from('profiles').update(patch)
    .eq('id',profile.id)
    .is('trial_expired_at',null)
    .select('*')
    .maybeSingle();
  if(error)throw error;
  if(!data){
    const {data:current,error:currentError}=await db.from('profiles').select('*').eq('id',profile.id).single();
    if(currentError)throw currentError;
    return current;
  }

  if(!paidAccess){
    const {error:quotesError}=await db.from('quotes').update({auto_send:false,updated_at:expiredAt}).eq('user_id',profile.id).eq('auto_send',true);
    if(quotesError)throw quotesError;
  }
  const {error:eventError}=await db.from('trial_events').insert({user_id:profile.id,type:'expired',metadata:{kept_paid_access:paidAccess}});
  if(eventError)throw eventError;
  return data;
}

export async function getProfile(user) {
  const { data, error } = await db.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error) throw error;
  if (data) return withEntitlements(await settleExpiredTrial(data));
  const { data: created, error: createError } = await db.from("profiles")
    .insert({ id: user.id, email: user.email, plan: "free" }).select("*").single();
  if (createError?.code === "23505") {
    const { data: concurrent, error: concurrentError } = await db.from("profiles").select("*").eq("id", user.id).single();
    if (concurrentError) throw concurrentError;
    return withEntitlements(await settleExpiredTrial(concurrent));
  }
  if (createError) throw createError;
  return withEntitlements(created);
}
