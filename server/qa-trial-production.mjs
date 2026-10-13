import assert from 'node:assert/strict';
import { db, getProfile } from './db.js';
import { grantTrialToEmail, expireTrials } from './trials.js';

const email=`trial-qa-${crypto.randomUUID()}@example.com`;
const password=`Qa!${crypto.randomUUID()}aA9`;
let userId=null;

try{
  const {data:createData,error:createError}=await db.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{purpose:'relanzio-trial-qa'}});
  if(createError)throw createError;
  userId=createData.user.id;
  const user={id:userId,email};
  const initial=await getProfile(user);
  assert.equal(initial.plan,'free');
  assert.equal(initial.pro_access,false);

  const activated=await grantTrialToEmail(email,'production-qa');
  assert.equal(activated.plan,'pro');
  assert.equal(activated.subscription_status,'none');
  assert.equal(activated.pro_access,true);
  assert.equal(activated.trial_active,true);
  assert.equal(activated.trial_days_remaining,7);
  assert.equal(activated.is_paid_subscription,false);
  const duration=new Date(activated.trial_ends_at).getTime()-new Date(activated.trial_started_at).getTime();
  assert.equal(duration,7*24*60*60*1000);
  console.log('QA_TRIAL_ACTIVATED',JSON.stringify({pro_access:activated.pro_access,paid:activated.is_paid_subscription,days:activated.trial_days_remaining,started_at:activated.trial_started_at,ends_at:activated.trial_ends_at}));

  let secondCode='';
  try{await grantTrialToEmail(email,'production-qa-repeat')}catch(e){secondCode=e.code}
  assert.equal(secondCode,'TRIAL_ALREADY_USED');
  console.log('QA_TRIAL_REPEAT_BLOCKED',secondCode);

  const sentAt=new Date().toISOString().slice(0,10);
  const {data:quote,error:quoteError}=await db.from('quotes').insert({user_id:userId,client_name:'QA Client',client_email:'qa-client@example.com',title:'QA conservation essai',amount:1000,sent_at:sentAt,status:'open',auto_send:false,followup_step:0}).select('id').single();
  if(quoteError)throw quoteError;

  const forcedEnd=new Date(Date.now()-60_000).toISOString();
  const {error:forceError}=await db.from('profiles').update({trial_ends_at:forcedEnd,trial_expired_at:null}).eq('id',userId);
  if(forceError)throw forceError;
  await expireTrials(new Date());

  const expired=await getProfile(user);
  assert.equal(expired.plan,'free');
  assert.equal(expired.pro_access,false);
  assert.equal(expired.trial_active,false);
  assert.ok(expired.trial_expired_at);

  const {count:quoteCount,error:countError}=await db.from('quotes').select('*',{count:'exact',head:true}).eq('user_id',userId).eq('id',quote.id);
  if(countError)throw countError;
  assert.equal(quoteCount,1);

  const {data:events,error:eventsError}=await db.from('trial_events').select('type').eq('user_id',userId).order('created_at',{ascending:true});
  if(eventsError)throw eventsError;
  assert.deepEqual((events||[]).map(x=>x.type),['activated','expired']);

  console.log('QA_TRIAL_EXPIRED',JSON.stringify({plan:expired.plan,pro_access:expired.pro_access,trial_expired_at:expired.trial_expired_at,quote_preserved:quoteCount===1,events:(events||[]).map(x=>x.type)}));
  console.log('QA_TRIAL_PRODUCTION_PASS');
}finally{
  if(userId){
    const {error}=await db.auth.admin.deleteUser(userId,false);
    if(error)console.error('QA_CLEANUP_ERROR',error.message);
    else console.log('QA_TRIAL_ACCOUNT_CLEANED');
  }
}
