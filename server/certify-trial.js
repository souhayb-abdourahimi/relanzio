import crypto from 'node:crypto';
import { db, getProfile, settleExpiredTrial } from './db.js';
import { grantTrialToEmail } from './trials.js';
import { withEntitlements } from './entitlements.js';
import { trialDisplay } from '../client/src/trial-display.js';

const email=String(process.env.TRIAL_CERTIFICATION_EMAIL||'trial-cert-20261014@relanzio.invalid').trim().toLowerCase();

const assert=(condition,message)=>{if(!condition)throw new Error('CERT_ASSERT: '+message)};
const findUser=async()=>{
  for(let page=1;page<=20;page++){
    const {data,error}=await db.auth.admin.listUsers({page,perPage:100});
    if(error)throw error;
    const found=data.users.find(u=>(u.email||'').toLowerCase()===email);
    if(found)return found;
    if(data.users.length<100)break;
  }
  return null;
};

let existing=await findUser();
if(existing){
  const {error}=await db.auth.admin.deleteUser(existing.id);
  if(error)throw error;
}

const password=crypto.randomBytes(24).toString('base64url');
const {data:created,error:createError}=await db.auth.admin.createUser({
  email,
  password,
  email_confirm:true,
  user_metadata:{purpose:'relanzio_trial_certification'}
});
if(createError)throw createError;
const user=created.user;
assert(user?.id,'test auth user created');

let profile=await getProfile({id:user.id,email});
const {data:prepared,error:prepareError}=await db.from('profiles').update({
  company_name:'TRIAL CERTIFICATION TEST',
  onboarding_completed:true,
  plan:'free',
  subscription_status:'none',
  email_mode:'review',
  stripe_customer_id:null,
  stripe_subscription_id:null,
  trial_started_at:null,
  trial_ends_at:null,
  trial_expired_at:null,
  updated_at:new Date().toISOString()
}).eq('id',user.id).select('*').single();
if(prepareError)throw prepareError;
profile=prepared;

const requestKey='trial-cert-'+user.id;
const {data:quote,error:quoteError}=await db.from('quotes').insert({
  user_id:user.id,
  client_name:'Client certification',
  client_email:'client-cert@example.invalid',
  title:'Devis certification essai',
  amount:1234,
  sent_at:new Date().toISOString().slice(0,10),
  status:'open',
  auto_send:true,
  request_key:requestKey
}).select('*').single();
if(quoteError)throw quoteError;

const active=await grantTrialToEmail(email,'production-certification');
assert(active.pro_access===true,'trial grants Pro access');
assert(active.effective_plan==='pro','effective plan is Pro');
assert(active.trial_active===true,'trial active flag true');
assert(active.trial_days_remaining===7,'seven days remaining at activation');
assert(active.is_paid_subscription===false,'trial is not paid subscription');
assert(active.subscription_status==='none','Stripe subscription remains absent');
const duration=new Date(active.trial_ends_at).getTime()-new Date(active.trial_started_at).getTime();
assert(duration===7*24*60*60*1000,'trial window exactly seven days');

const display=trialDisplay(active);
assert(display.visible===true,'trial UI visible');
assert(display.label==='Essai Pro : 7 jours restants','trial UI label');
assert(display.endText.includes(new Date(active.trial_ends_at).toLocaleDateString('fr-FR')),'trial UI contains end date');
assert(display.upgradeLabel==='Passer à Pro — 29 € / mois','upgrade CTA label');

const simulatedNow=new Date(new Date(active.trial_ends_at).getTime()+1000);
const expiredRaw=await settleExpiredTrial(active,simulatedNow);
const expired=withEntitlements(expiredRaw,simulatedNow);
assert(expired.plan==='free','expired trial returns to free');
assert(expired.pro_access===false,'expired trial loses Pro access');
assert(expired.trial_active===false,'expired trial flag false');
assert(Boolean(expired.trial_expired_at),'expiration timestamp stored');
assert(expired.email_mode==='review','automatic mode disabled on downgrade');

const {data:quoteAfter,error:quoteAfterError}=await db.from('quotes').select('*').eq('id',quote.id).single();
if(quoteAfterError)throw quoteAfterError;
assert(quoteAfter.amount===quote.amount,'quote amount preserved');
assert(quoteAfter.title===quote.title,'quote title preserved');
assert(quoteAfter.auto_send===false,'auto-send disabled without deleting quote');

let secondTrialCode='';
try{
  await grantTrialToEmail(email,'production-certification-retry');
}catch(e){
  secondTrialCode=e.code||'';
}
assert(secondTrialCode==='TRIAL_ALREADY_USED','second trial refused');

const {data:events,error:eventsError}=await db.from('trial_events').select('type,created_at').eq('user_id',user.id).order('created_at',{ascending:true});
if(eventsError)throw eventsError;
assert(events.filter(e=>e.type==='activated').length===1,'one activation event logged');
assert(events.filter(e=>e.type==='expired').length===1,'one expiration event logged');

console.log('TRIAL_CERTIFICATION_PASS '+JSON.stringify({
  email,
  user_id:user.id,
  trial_started_at:active.trial_started_at,
  trial_ends_at:active.trial_ends_at,
  pro_access_during_trial:active.pro_access,
  paid_subscription_during_trial:active.is_paid_subscription,
  ui_label:display.label,
  ui_end_text:display.endText,
  after_expiry_plan:expired.plan,
  after_expiry_pro_access:expired.pro_access,
  data_preserved:Boolean(quoteAfter?.id),
  auto_send_after_expiry:quoteAfter.auto_send,
  second_trial:secondTrialCode,
  events:events.map(e=>e.type)
}));
