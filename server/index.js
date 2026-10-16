import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cron from 'node-cron';
import Stripe from 'stripe';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { requireUser } from './auth.js';
import { db, getProfile } from './db.js';
import { nextDate, runDueFollowups, createFollowupPreview, sendQuoteFollowup } from './followups.js';
import { analyzeReply, qualifyProspect } from './prospecting.js';
import { isValidEmail, normalizeEmail, sanitizeText, quoteMetrics, mapBrevoEvent, prioritizeProductIdeas } from './logic.js';
import { rateLimit, safeEqual } from './security.js';
import { sendEmail } from './email.js';
import { answerSupport } from './support.js';
import { buildCeoMetrics, weeklyRecommendations } from './ceo.js';
import { runLifecycleEmails } from './lifecycle.js';
import { reportError } from './observability.js';
import { billingTransition, normalizeSubscriptionStatus, planForSubscriptionStatus, shouldIgnoreBillingEvent } from './billing.js';
import { hasProAccess, hasSubscriptionProAccess, isManagedTrialActive, withEntitlements } from './entitlements.js';
import { grantTrialToEmail, grantTrialToUser, expireTrials } from './trials.js';
import { processOutreachQueue, outreachHealth } from './outreach.js';
import { sendPilotOutreach, inspectPilotOutreach } from './pilot-outreach.js';
import { safeImportCommercialProspects, prepareCommercialProspect, inspectCommercialOutreach, sendCommercialJ0, ingestBrevoInbound } from './controlled-outreach.js';
import { runPilotAdminRunner } from './pilot-admin-runner.js';
import { pollImapReplies } from './imap-replies.js';
import { parseQuoteAmount, parseSentDate, activeQuoteLimit, isActiveQuoteStatus, normalizeFollowupScheduleMode, parseCustomFollowupAt } from './quote-rules.js';
import { checkoutConfigFingerprint, checkoutMetadata, isReusableCheckoutSession, checkoutIdempotencyKey } from './checkout-policy.js';
import { rowsToSemicolonCsv } from './export.js';

const app = express(); app.set('trust proxy', 1);
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const VAT_NOTICE='TVA non applicable, art. 293 B du CGI';
const PRO_PRICE_LABEL=`29 € / mois. ${VAT_NOTICE}`;
const __dirname = dirname(fileURLToPath(import.meta.url)); const dist = join(__dirname, '..', 'dist');
const admins = () => (process.env.ADMIN_EMAILS || '').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
const isAdmin = user => admins().includes((user?.email || '').toLowerCase());
const nowIso = () => new Date().toISOString();
const providerRank = {draft:0,sent:1,delivered:2,opened:3,clicked:4,failed:5,bounced:6};
const shouldApplyProviderStatus = (current,next) => {
  if (current === 'bounced') return next === 'bounced';
  if (next === 'bounced') return true;
  return (providerRank[next] ?? -1) >= (providerRank[current] ?? -1);
};
const subscriptionIdFromObject = (obj, profile) => {
  const direct = typeof obj?.subscription === 'string' ? obj.subscription : obj?.subscription?.id;
  const parent = typeof obj?.parent?.subscription_details?.subscription === 'string'
    ? obj.parent.subscription_details.subscription
    : obj?.parent?.subscription_details?.subscription?.id;
  return direct || parent || profile?.stripe_subscription_id || null;
};
async function authoritativeBillingTransition(eventType,obj,profile={plan:'free',subscription_status:'none'}) {
  const subscriptionId = ['customer.subscription.updated','customer.subscription.deleted'].includes(eventType)
    ? obj?.id
    : subscriptionIdFromObject(obj,profile);
  if (stripe && subscriptionId) {
    try {
      const current = await stripe.subscriptions.retrieve(subscriptionId);
      const status = normalizeSubscriptionStatus(current.status);
      return { transition:{plan:planForSubscriptionStatus(status),subscription_status:status}, subscriptionId:current.id };
    } catch (e) {
      if (eventType === 'customer.subscription.deleted' && (e?.code === 'resource_missing' || e?.statusCode === 404)) {
        return { transition:{plan:'free',subscription_status:'canceled'}, subscriptionId };
      }
      throw e;
    }
  }
  return { transition:billingTransition(eventType,obj,profile), subscriptionId };
}
async function mustDb(promise) {
  const result = await promise;
  if (result.error) throw result.error;
  return result.data;
}
async function applyStripeBillingEvent(profile,event,obj,extra={}) {
  if(!profile||shouldIgnoreBillingEvent(profile,event.type,obj,event.created))return {applied:false,ignored:true};
  const state=await authoritativeBillingTransition(event.type,obj,profile);
  const eventCreated=Number(event.created||0);
  const patch={...state.transition,...extra,updated_at:nowIso()};
  if(eventCreated)patch.stripe_state_event_created=eventCreated;
  const subscriptionId=state.subscriptionId||extra.stripe_subscription_id;
  if(subscriptionId!==undefined)patch.stripe_subscription_id=subscriptionId||null;
  let query=db.from('profiles').update(patch).eq('id',profile.id);
  if(eventCreated)query=query.lte('stripe_state_event_created',eventCreated);
  const {data,error}=await query.select('id').maybeSingle();
  if(error)throw error;
  return {applied:Boolean(data),ignored:!data};
}

app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? { directives:{ defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'","'unsafe-inline'"],imgSrc:["'self'",'data:'],connectSrc:["'self'",'https://*.supabase.co'],frameAncestors:["'none'"],baseUri:["'self'"],formAction:["'self'"] } } : false, crossOriginEmbedderPolicy:false }));
app.use(cors({ origin:process.env.NODE_ENV === 'production' ? process.env.APP_URL : true, credentials:false }));
app.use((req,res,next)=>{ req.requestId=crypto.randomUUID(); res.setHeader('X-Request-Id',req.requestId); next(); });
app.use(rateLimit({ windowMs:60_000, max:180 }));


async function profileByCustomer(customerId) {
  if (!customerId) return null;
  const { data } = await db.from('profiles').select('*').eq('stripe_customer_id', customerId).maybeSingle();
  return data;
}

// Raw body must come before express.json.
app.post('/api/stripe/webhook', express.raw({ type:'application/json' }), async (req,res)=>{
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).send('Stripe not configured');
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
    const { error:claimError } = await db.from('stripe_webhook_events').insert({event_id:event.id,event_type:event.type});
    if (claimError?.code === '23505') return res.json({received:true,duplicate:true});
    if (claimError) throw claimError;
    try {
      const obj = event.data.object;
      if (event.type === 'checkout.session.completed') {
        const userId=obj.metadata?.user_id, customerId=typeof obj.customer==='string'?obj.customer:obj.customer?.id;
        if(userId){
          const profile=await getProfile({id:userId,email:obj.customer_details?.email||''});
          await applyStripeBillingEvent(profile,event,obj,{stripe_customer_id:customerId||profile.stripe_customer_id||null});
        }
      }
      if (['customer.subscription.updated','customer.subscription.deleted'].includes(event.type)) {
        const customerId=typeof obj.customer==='string'?obj.customer:obj.customer?.id, profile=await profileByCustomer(customerId);
        if(profile)await applyStripeBillingEvent(profile,event,obj,{stripe_subscription_id:obj.id||profile.stripe_subscription_id});
      }
      if (['invoice.payment_failed','invoice.paid'].includes(event.type)) {
        const customerId=typeof obj.customer==='string'?obj.customer:obj.customer?.id, profile=await profileByCustomer(customerId);
        if(profile)await applyStripeBillingEvent(profile,event,obj,{});
      }
      await mustDb(db.from('stripe_webhook_events').update({processed_at:nowIso()}).eq('event_id',event.id));
      res.json({received:true});
    } catch(e) {
      await db.from('stripe_webhook_events').delete().eq('event_id',event.id);
      throw e;
    }
  } catch(e) {
    await reportError('stripe.webhook',e,{event_id:event?.id||null,event_type:event?.type||null,request_id:req.requestId});
    res.status(400).send('Webhook processing failed');
  }
});

app.use(express.json({limit:'256kb'}));
app.get('/api/health', (_req,res)=>res.json({ok:true,service:'relanzio',version:'0.4.0'}));
app.get('/api/readiness', (_req,res)=>{const integrations={supabase:Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_ANON_KEY&&process.env.SUPABASE_SERVICE_ROLE_KEY),stripe:Boolean(process.env.STRIPE_SECRET_KEY&&process.env.STRIPE_PRO_PRICE_ID&&process.env.STRIPE_WEBHOOK_SECRET),brevo:Boolean(process.env.BREVO_API_KEY&&process.env.BREVO_WEBHOOK_SECRET&&process.env.EMAIL_FROM_ADDRESS),openai:Boolean(process.env.OPENAI_API_KEY)};const ready=integrations.supabase&&integrations.stripe&&integrations.brevo;res.status(ready?200:503).json({ready,integrations,automation:{followups:process.env.FOLLOWUP_AUTOMATION_ENABLED==='true',lifecycle:process.env.LIFECYCLE_EMAILS_ENABLED==='true',acquisition:process.env.ACQUISITION_ENABLED==='true'}})});

// Privacy-friendly first-party product analytics. No ad tracker/cross-site identifier.
app.post('/api/events', rateLimit({windowMs:60_000,max:30}), async (req,res)=>{
  const allowed=['landing_view','signup_started','signup_completed','onboarding_completed','quote_created','checkout_started','support_opened'];
  const event=sanitizeText(req.body.event,60); if(!allowed.includes(event)) return res.status(400).json({error:'Événement invalide.'});
  await db.from('product_events').insert({event,path:sanitizeText(req.body.path,200),metadata:{}});
  res.status(202).json({ok:true});
});

app.post('/api/activity', requireUser, async(req,res)=>{try{await db.from('product_events').insert({user_id:req.user.id,event:'app_active',path:sanitizeText(req.body.path||'/app',200)});res.status(202).json({ok:true})}catch(e){res.status(202).json({ok:false})}});

app.get('/api/profile', requireUser, async(req,res)=>{ try{res.json({profile:await getProfile(req.user)})}catch(e){res.status(500).json({error:e.message})} });
app.post('/api/trial/start', requireUser, rateLimit({windowMs:60_000,max:5}), async(req,res)=>{
  try{
    const profile=await grantTrialToUser(req.user,'self_service');
    res.status(201).json({profile});
  }catch(e){
    const status=e.code==='PROFILE_NOT_FOUND'?404:e.code==='TRIAL_ALREADY_USED'||e.code==='ALREADY_PRO'?409:500;
    res.status(status).json({error:e.message,code:e.code||'TRIAL_START_FAILED'});
  }
});
app.patch('/api/profile', requireUser, async(req,res)=>{
  try{
    const profile=await getProfile(req.user), patch={updated_at:nowIso()};
    if ('company_name' in req.body) { const v=sanitizeText(req.body.company_name,120); if(!v)return res.status(400).json({error:'Entreprise requise.'}); patch.company_name=v; }
    if ('role' in req.body) patch.role=sanitizeText(req.body.role,80);
    if ('onboarding_completed' in req.body) patch.onboarding_completed=Boolean(req.body.onboarding_completed);
    if ('marketing_opt_in' in req.body) patch.marketing_opt_in=Boolean(req.body.marketing_opt_in);
    if(req.body.email_mode==='review')patch.email_mode='review';
    if(req.body.email_mode==='automatic'&&hasProAccess(profile))patch.email_mode='automatic';
    const {data,error}=await db.from('profiles').update(patch).eq('id',req.user.id).select('*').single(); if(error)throw error; res.json({profile:withEntitlements(data)});
  }catch(e){res.status(500).json({error:e.message})}
});

app.get('/api/quotes', requireUser, async(req,res)=>{
  try{ await getProfile(req.user); const {data:quotes,error}=await db.from('quotes').select('*').eq('user_id',req.user.id).order('created_at',{ascending:false}); if(error)throw error; res.json({quotes,metrics:quoteMetrics(quotes||[])}); }catch(e){res.status(500).json({error:e.message})}
});
app.post('/api/quotes', requireUser, async(req,res)=>{
  try{
    const profile=await getProfile(req.user);
    const {client_name,client_email,title,amount,sent_at,auto_send}=req.body, email=normalizeEmail(client_email);
    const parsedAmount=parseQuoteAmount(amount), parsedDate=parseSentDate(sent_at), requestKey=sanitizeText(req.get('Idempotency-Key'),100)||null;
    if(!sanitizeText(client_name,120)||!isValidEmail(email)||!sanitizeText(title,180)||parsedAmount===null||!parsedDate)return res.status(400).json({error:'Champs invalides.'});
    if(requestKey){const {data:prior,error:priorError}=await db.from('quotes').select('*').eq('user_id',req.user.id).eq('request_key',requestKey).maybeSingle();if(priorError)throw priorError;if(prior)return res.json({quote:prior,idempotent:true});}
    const limit=activeQuoteLimit(hasProAccess(profile));
    const requestedMode=('followup_schedule_mode' in req.body)?normalizeFollowupScheduleMode(req.body.followup_schedule_mode):(('next_followup_at' in req.body)?'custom':'recommended');
    if(!requestedMode)return res.status(400).json({error:'Mode de prochaine relance invalide.'});
    let nextFollowupAt=null;
    if(requestedMode==='recommended')nextFollowupAt=nextDate(parsedDate,0);
    if(requestedMode==='custom'){nextFollowupAt=parseCustomFollowupAt(req.body.next_followup_at);if(!nextFollowupAt)return res.status(400).json({error:'La prochaine relance personnalisée doit être une date future valide.'});}
    const {data:created,error:createError}=await db.rpc('create_quote_with_quota',{
      p_user_id:req.user.id,
      p_limit:limit,
      p_client_name:sanitizeText(client_name,120),
      p_client_email:email,
      p_title:sanitizeText(title,180),
      p_amount:parsedAmount,
      p_sent_at:parsedDate,
      p_request_key:requestKey,
      p_auto_send:requestedMode!=='none'&&hasProAccess(profile)&&profile.email_mode==='automatic'?Boolean(auto_send):false,
      p_followup_step:0,
      p_followup_schedule_mode:requestedMode,
      p_next_followup_at:nextFollowupAt
    });
    if(createError?.message?.startsWith('ACTIVE_QUOTE_LIMIT:'))return res.status(403).json({error:`Votre formule est limitée à ${limit} devis actifs (en attente ou en pause).`});
    if(createError)throw createError;
    const data=created?.quote;
    const idempotent=Boolean(created?.idempotent);
    if(!profile.activated_at&&!idempotent)await db.from('profiles').update({activated_at:nowIso(),updated_at:nowIso()}).eq('id',req.user.id);
    if(!idempotent)await db.from('product_events').insert({user_id:req.user.id,event:'quote_created',path:'/app'});
    res.status(idempotent?200:201).json({quote:data,idempotent});
  }catch(e){await reportError('quotes.create',e,{request_id:req.requestId});res.status(500).json({error:'Impossible de créer le devis.',request_id:req.requestId})}
});
app.patch('/api/quotes/:id', requireUser, async(req,res)=>{
  try {
    const [{ data:existing, error:findError },profile] = await Promise.all([
      db.from('quotes').select('*').eq('id',req.params.id).eq('user_id',req.user.id).maybeSingle(),
      getProfile(req.user)
    ]);
    if (findError) throw findError; if (!existing) return res.status(404).json({error:'Devis introuvable.'});
    const patch={updated_at:nowIso()};
    const claimTime=existing.send_claimed_at?new Date(existing.send_claimed_at).getTime():NaN;
    const claimFresh=Number.isFinite(claimTime)&&claimTime>Date.now()-5*60_000;
    const deliveryControlTouched=['status','followup_schedule_mode','next_followup_at','auto_send'].some(key=>key in req.body);
    if(claimFresh&&deliveryControlTouched)return res.status(409).json({error:'Une relance est déjà en cours d’envoi. Attendez son résultat avant de modifier le statut ou le planning.'});
    if(existing.send_claimed_at&&!claimFresh)patch.send_claimed_at=null;
    const allowedStatuses=['open','won','lost','paused'];
    const targetStatus='status' in req.body?String(req.body.status):existing.status;
    if(!allowedStatuses.includes(targetStatus))return res.status(400).json({error:'Statut invalide.'});

    if(isActiveQuoteStatus(targetStatus)&&!isActiveQuoteStatus(existing.status)){
      const limit=activeQuoteLimit(hasProAccess(profile));
      const {data:reopened,error:reopenError}=await db.rpc('reopen_quote_with_quota',{p_user_id:req.user.id,p_quote_id:existing.id,p_limit:limit,p_target_status:targetStatus});
      if(reopenError?.message?.startsWith('ACTIVE_QUOTE_LIMIT:'))return res.status(403).json({error:`Impossible de réactiver ce devis : votre formule est limitée à ${limit} devis actifs.`});
      if(reopenError)throw reopenError;
      if(!reopened?.found)return res.status(404).json({error:'Devis introuvable.'});
      existing.status=targetStatus;
      existing.won_at=null;
      existing.auto_send=false;
    }

    const sentDate='sent_at' in req.body?parseSentDate(req.body.sent_at):existing.sent_at;
    if(!sentDate)return res.status(400).json({error:"Date d’envoi invalide."});
    const scheduleTouched=('followup_schedule_mode' in req.body)||('next_followup_at' in req.body);
    const requestedMode=('followup_schedule_mode' in req.body)
      ? normalizeFollowupScheduleMode(req.body.followup_schedule_mode)
      : (('next_followup_at' in req.body)?'custom':(existing.followup_schedule_mode||'recommended'));
    if(!requestedMode)return res.status(400).json({error:'Mode de prochaine relance invalide.'});

    let nextFollowupAt=existing.next_followup_at;
    let effectiveMode=requestedMode;
    if(['won','lost'].includes(targetStatus)){
      nextFollowupAt=null; effectiveMode='none'; patch.auto_send=false;
    }else if(requestedMode==='none'){
      nextFollowupAt=null; patch.auto_send=false;
    }else if(requestedMode==='recommended'){
      nextFollowupAt=nextDate(sentDate,existing.followup_step);
    }else if(requestedMode==='custom'&&scheduleTouched){
      nextFollowupAt=parseCustomFollowupAt(req.body.next_followup_at||existing.next_followup_at);
      if(!nextFollowupAt)return res.status(400).json({error:'La prochaine relance personnalisée doit être une date future valide.'});
    }

    if ('status' in req.body) { patch.status=targetStatus; patch.won_at=targetStatus==='won'?nowIso():null; }
    if ('client_name' in req.body) { const v=sanitizeText(req.body.client_name,120); if(!v)return res.status(400).json({error:'Client invalide.'}); patch.client_name=v; }
    if ('client_email' in req.body) { const v=normalizeEmail(req.body.client_email); if(!isValidEmail(v))return res.status(400).json({error:'Email invalide.'}); patch.client_email=v; }
    if ('title' in req.body) { const v=sanitizeText(req.body.title,180); if(!v)return res.status(400).json({error:'Objet invalide.'}); patch.title=v; }
    if ('amount' in req.body) { const v=parseQuoteAmount(req.body.amount); if(v===null)return res.status(400).json({error:'Montant invalide.'}); patch.amount=v; }
    if ('sent_at' in req.body) patch.sent_at=sentDate;
    if ('followup_schedule_mode' in req.body || 'next_followup_at' in req.body || 'sent_at' in req.body || 'status' in req.body) {
      patch.followup_schedule_mode=effectiveMode;
      patch.next_followup_at=nextFollowupAt;
    }
    if ('auto_send' in req.body) patch.auto_send=effectiveMode!=='none'&&targetStatus==='open'&&hasProAccess(profile)&&profile.email_mode==='automatic'?Boolean(req.body.auto_send):false;
    if(targetStatus!=='open')patch.auto_send=false;

    const {data,error}=await db.from('quotes').update(patch).eq('id',req.params.id).eq('user_id',req.user.id).select('*').single();
    if(error)throw error; res.json({quote:data});
  } catch(e) { await reportError('quotes.update',e,{request_id:req.requestId}); res.status(500).json({error:'Impossible de modifier le devis.',request_id:req.requestId}); }
});
app.delete('/api/quotes/:id', requireUser, async(req,res)=>{
  try {
    const stale=new Date(Date.now()-5*60_000).toISOString();
    const {data,error}=await db.from('quotes').delete().eq('id',req.params.id).eq('user_id',req.user.id)
      .or(`send_claimed_at.is.null,send_claimed_at.lt.${stale}`).select('id').maybeSingle();
    if(error)throw error;
    if(!data){
      const {data:existing,error:findError}=await db.from('quotes').select('id,send_claimed_at').eq('id',req.params.id).eq('user_id',req.user.id).maybeSingle();
      if(findError)throw findError;
      if(existing)return res.status(409).json({error:'Suppression impossible pendant l’envoi d’une relance. Réessayez après son résultat.'});
      return res.status(404).json({error:'Devis introuvable.'});
    }
    res.json({deleted:true});
  } catch(e){await reportError('quotes.delete',e,{request_id:req.requestId});res.status(500).json({error:'Impossible de supprimer le devis.',request_id:req.requestId});}
});
app.get('/api/quotes/:id/followup-preview', requireUser, async(req,res)=>{
  try { const [{data:quote,error},profile]=await Promise.all([db.from('quotes').select('*').eq('id',req.params.id).eq('user_id',req.user.id).maybeSingle(),getProfile(req.user)]); if(error)throw error;if(!quote)return res.status(404).json({error:'Devis introuvable.'});if(quote.status!=='open')return res.status(409).json({error:'Ce devis n’est pas ouvert.'});res.json({preview:await createFollowupPreview(quote,profile)}); } catch(e){if(e.message==='SEQUENCE_COMPLETE')return res.status(409).json({error:'Séquence terminée.'});await reportError('followup.preview',e,{request_id:req.requestId});res.status(500).json({error:'Impossible de préparer la relance.',request_id:req.requestId});}
});
app.post('/api/quotes/:id/send-followup', requireUser, async(req,res)=>{
  try {
    const [{data:quote,error},profile]=await Promise.all([db.from('quotes').select('*').eq('id',req.params.id).eq('user_id',req.user.id).maybeSingle(),getProfile(req.user)]);
    if(error)throw error;if(!quote)return res.status(404).json({error:'Devis introuvable.'});if(quote.status!=='open')return res.status(409).json({error:'Ce devis n’est pas ouvert.'});
    if(!hasProAccess(profile))return res.status(403).json({error:'L’envoi depuis Relanzio nécessite des droits Pro actifs.'});
    const result=await sendQuoteFollowup(quote,profile,sanitizeText(req.get('Idempotency-Key'),100)||null);
    res.json({sent:true,result});
  } catch(e){
    if(['FOLLOWUP_ALREADY_IN_PROGRESS','FOLLOWUP_ALREADY_RECORDED','FOLLOWUP_REQUEST_ALREADY_FAILED','EMAIL_RECIPIENT_SUPPRESSED'].includes(e.message))return res.status(409).json({error:e.message==='EMAIL_RECIPIENT_SUPPRESSED'?'Cette adresse ne peut plus recevoir de relances.':'Cette relance est déjà en cours ou a déjà été traitée.'});
    await reportError('followup.manual_send',e,{request_id:req.requestId});
    res.status(500).json({error:'La relance n’a pas été envoyée. Aucun succès n’a été enregistré.',request_id:req.requestId});
  }
});

app.post('/api/billing/checkout', requireUser, rateLimit({windowMs:60_000,max:10}), async(req,res)=>{
  let claimedAt=null;
  try{
    if(process.env.BILLING_ENABLED!=='true')return res.status(423).json({error:'La souscription Pro n’est pas disponible pour le moment.'});
    if(!stripe||!process.env.STRIPE_PRO_PRICE_ID)return res.status(503).json({error:"Stripe n'est pas configuré."});
    const profile=await getProfile(req.user);
    if(hasSubscriptionProAccess(profile))return res.status(409).json({error:'Votre compte dispose déjà d’un abonnement Pro. Utilisez Gérer mon abonnement.'});
    let customer=profile.stripe_customer_id;
    if(!customer){
      const created=await stripe.customers.create({email:req.user.email,metadata:{user_id:req.user.id},invoice_settings:{footer:VAT_NOTICE}},{idempotencyKey:`relanzio-customer-${req.user.id}`});
      customer=created.id;
      await mustDb(db.from('profiles').update({stripe_customer_id:customer,updated_at:nowIso()}).eq('id',req.user.id));
    }

    await stripe.customers.update(customer,{invoice_settings:{footer:VAT_NOTICE}});

    const fingerprint=checkoutConfigFingerprint({priceId:process.env.STRIPE_PRO_PRICE_ID,appUrl:process.env.APP_URL});
    const openSessions=await stripe.checkout.sessions.list({customer,status:'open',limit:10});
    const reusable=(openSessions.data||[]).find(s=>isReusableCheckoutSession(s,fingerprint));
    if(reusable)return res.json({url:reusable.url,reused:true});

    claimedAt=nowIso();
    const stale=new Date(Date.now()-2*60_000).toISOString();
    const {data:claimed,error:claimError}=await db.from('profiles').update({checkout_claimed_at:claimedAt,updated_at:claimedAt})
      .eq('id',req.user.id).or(`checkout_claimed_at.is.null,checkout_claimed_at.lt.${stale}`).select('id').maybeSingle();
    if(claimError)throw claimError;
    if(!claimed)return res.status(409).json({error:'Une ouverture de paiement est déjà en cours. Réessayez dans quelques instants.'});

    const meta={user_id:req.user.id,...checkoutMetadata({priceId:process.env.STRIPE_PRO_PRICE_ID,appUrl:process.env.APP_URL})};
    const session=await stripe.checkout.sessions.create({
      mode:'subscription',customer,payment_method_types:['card'],locale:'fr',
      automatic_tax:{enabled:false},
      line_items:[{price:process.env.STRIPE_PRO_PRICE_ID,quantity:1}],
      allow_promotion_codes:true,client_reference_id:req.user.id,metadata:meta,
      custom_text:{submit:{message:PRO_PRICE_LABEL}},
      subscription_data:{description:`Relanzio Pro — ${PRO_PRICE_LABEL}`,metadata:{user_id:req.user.id}},
      success_url:`${process.env.APP_URL}?billing=success`,
      cancel_url:`${process.env.APP_URL}?billing=cancel`
    },{idempotencyKey:checkoutIdempotencyKey({userId:req.user.id,fingerprint,claimedAt})});
    await db.from('product_events').insert({user_id:req.user.id,event:'checkout_started',path:'/app'});
    res.json({url:session.url,reused:false});
  }catch(e){
    await reportError('billing.checkout',e,{request_id:req.requestId});
    res.status(500).json({error:'Impossible d’ouvrir le paiement pour le moment.',request_id:req.requestId});
  }finally{
    if(claimedAt)await db.from('profiles').update({checkout_claimed_at:null}).eq('id',req.user.id).eq('checkout_claimed_at',claimedAt);
  }
});
app.post('/api/billing/portal', requireUser, rateLimit({windowMs:60_000,max:10}), async(req,res)=>{
  try{
    if(process.env.BILLING_ENABLED!=='true')return res.status(423).json({error:'La gestion de l’abonnement n’est pas disponible pour le moment.'});
    if(!stripe)return res.status(503).json({error:'Stripe non configuré.'});
    const profile=await getProfile(req.user);
    if(!profile.stripe_customer_id)return res.status(400).json({error:'Aucun compte de facturation.'});
    const args={customer:profile.stripe_customer_id,return_url:process.env.APP_URL};
    if(process.env.STRIPE_PORTAL_CONFIGURATION_ID)args.configuration=process.env.STRIPE_PORTAL_CONFIGURATION_ID;
    const session=await stripe.billingPortal.sessions.create(args);
    res.json({url:session.url});
  }catch(e){await reportError('billing.portal',e,{request_id:req.requestId});res.status(500).json({error:'Impossible d’ouvrir la gestion de l’abonnement.',request_id:req.requestId})}
});

app.post('/api/support/ask', requireUser, async(req,res)=>{ try{res.json(await answerSupport(sanitizeText(req.body.question,2000)))}catch(e){res.status(500).json({error:e.message})} });
app.get('/api/support/tickets', requireUser, async(req,res)=>{ const {data,error}=await db.from('support_tickets').select('*').eq('user_id',req.user.id).order('created_at',{ascending:false}).limit(50); if(error)return res.status(500).json({error:error.message}); res.json({tickets:data}); });
app.post('/api/support/tickets', requireUser, async(req,res)=>{ const subject=sanitizeText(req.body.subject,160),message=sanitizeText(req.body.message,5000),topic=sanitizeText(req.body.topic,40)||'product'; if(!subject||!message)return res.status(400).json({error:'Sujet et message requis.'}); const priority=['billing','privacy','security'].includes(topic)?'high':'normal'; const {data,error}=await db.from('support_tickets').insert({user_id:req.user.id,topic,subject,message,priority}).select('*').single(); if(error)return res.status(500).json({error:error.message}); res.status(201).json({ticket:data}); });

app.get('/api/account/export', requireUser, async(req,res)=>{
  try{
    const [profileResult,quotesResult,followupsResult,ticketsResult]=await Promise.all([
      db.from('profiles').select('id,email,company_name,role,plan,subscription_status,email_mode,onboarding_completed,marketing_opt_in,activated_at,trial_started_at,trial_ends_at,trial_expired_at,created_at,updated_at').eq('id',req.user.id).single(),
      db.from('quotes').select('*').eq('user_id',req.user.id).order('created_at',{ascending:true}),
      db.from('followups').select('id,quote_id,step,subject,body,status,provider_message_id,sent_at,created_at').eq('user_id',req.user.id).order('created_at',{ascending:true}),
      db.from('support_tickets').select('id,topic,subject,message,status,priority,created_at,updated_at').eq('user_id',req.user.id).order('created_at',{ascending:true})
    ]);
    for(const result of [profileResult,quotesResult,followupsResult,ticketsResult])if(result.error)throw result.error;
    res.setHeader('Content-Disposition','attachment; filename="relanzio-export.json"');
    res.json({exported_at:nowIso(),profile:profileResult.data,quotes:quotesResult.data||[],followups:followupsResult.data||[],support_tickets:ticketsResult.data||[]});
  }catch(e){await reportError('account.export',e,{request_id:req.requestId});res.status(500).json({error:'Impossible de préparer l’export.',request_id:req.requestId})}
});
app.get('/api/quotes/export.csv', requireUser, async(req,res)=>{
  try{
    const {data,error}=await db.from('quotes').select('client_name,client_email,title,amount,sent_at,status,followup_step,followup_schedule_mode,next_followup_at,created_at,updated_at').eq('user_id',req.user.id).order('created_at',{ascending:true});
    if(error)throw error;
    const header=['client_name','client_email','title','amount','sent_at','status','followup_step','followup_schedule_mode','next_followup_at','created_at','updated_at'];
    const csv=rowsToSemicolonCsv(data||[],header);
    res.type('text/csv; charset=utf-8').setHeader('Content-Disposition','attachment; filename="relanzio-devis.csv"');
    res.send(csv);
  }catch(e){await reportError('quotes.export',e,{request_id:req.requestId});res.status(500).json({error:'Impossible d’exporter les devis.',request_id:req.requestId})}
});

app.delete('/api/account', requireUser, async(req,res)=>{
  try{ if(req.body.confirmation!=='SUPPRIMER')return res.status(400).json({error:'Confirmation invalide.'}); const profile=await getProfile(req.user); if(stripe&&profile.stripe_subscription_id&&['active','trialing','past_due'].includes(profile.subscription_status)){ await stripe.subscriptions.cancel(profile.stripe_subscription_id); } const {error}=await db.auth.admin.deleteUser(req.user.id,false); if(error)throw error; res.json({deleted:true}); }catch(e){res.status(500).json({error:`Suppression impossible: ${e.message}`})}
});

// Brevo transactional events. Configure a custom x-webhook-secret header in Brevo.
app.post('/api/brevo/webhook', async(req,res)=>{
  if(!safeEqual(String(req.headers['x-webhook-secret']||''),String(process.env.BREVO_WEBHOOK_SECRET||'')))return res.status(401).json({error:'Unauthorized'});
  try{
    const type=mapBrevoEvent(req.body.event); if(!type)return res.status(202).json({ignored:true});
    const messageId=String(req.body['message-id']||req.body.messageId||''), email=normalizeEmail(req.body.email||'');
    if(messageId){
      const followStatus=type==='bounced'?'bounced':type;
      if(['delivered','opened','clicked','bounced'].includes(followStatus)){
        const rows=await mustDb(db.from('followups').select('id,status').eq('provider_message_id',messageId));
        for(const row of rows||[])if(shouldApplyProviderStatus(row.status,followStatus))await mustDb(db.from('followups').update({status:followStatus}).eq('id',row.id));
      }
      const {data:pEvent,error:pEventError}=await db.from('outreach_events').select('prospect_id').eq('provider_message_id',messageId).order('created_at',{ascending:false}).limit(1).maybeSingle();if(pEventError)throw pEventError;
      if(pEvent)await mustDb(db.from('outreach_events').insert({prospect_id:pEvent.prospect_id,type,provider_message_id:messageId,metadata:req.body}));
    }
    if(type==='opt_out'&&email){await mustDb(db.from('suppressions').upsert({email,reason:'provider_unsubscribe'}));await mustDb(db.from('prospects').update({status:'suppressed',updated_at:nowIso()}).eq('email',email));const {data:prospect}=await db.from('prospects').select('id').eq('email',email).maybeSingle();if(prospect)await mustDb(db.from('outreach_queue').update({status:'canceled',error:'provider_unsubscribe',updated_at:nowIso()}).eq('prospect_id',prospect.id).in('status',['queued','held','ready']))}
    const rawEvent=String(req.body.event||'').toLowerCase().replace(/[_\s-]/g,'');
    if(email&&['hardbounce','invalid','spam','blocked'].includes(rawEvent)){
      await mustDb(db.from('suppressions').upsert({email,reason:`provider_${rawEvent}`}));
      await mustDb(db.from('prospects').update({status:'suppressed',updated_at:nowIso()}).eq('email',email));
      const {data:prospect}=await db.from('prospects').select('id').eq('email',email).maybeSingle();
      if(prospect)await mustDb(db.from('outreach_queue').update({status:'canceled',error:`provider_${rawEvent}`,updated_at:nowIso()}).eq('prospect_id',prospect.id).in('status',['queued','held','ready']));
    }
    res.json({ok:true});
  }catch(e){
    await reportError('brevo.webhook',e,{event_type:sanitizeText(req.body?.event,80)||null,request_id:req.requestId});
    res.status(500).json({error:'Webhook processing failed.'});
  }
});


// Brevo Inbound Parsing. This route is inert until an inbound domain/webhook is configured at Brevo.
app.post('/api/brevo/inbound', async(req,res)=>{
  if(!safeEqual(String(req.headers['x-webhook-secret']||''),String(process.env.BREVO_WEBHOOK_SECRET||'')))return res.status(401).json({error:'Unauthorized'});
  try{
    const result=await ingestBrevoInbound(req.body||{});
    res.json(result);
  }catch(e){
    await reportError('brevo.inbound',e,{request_id:req.requestId});
    res.status(500).json({error:'Inbound email processing failed.'});
  }
});

// Founder acquisition CRM — quality capped, human-approved, no scraping endpoint.
app.get('/api/admin/tickets', requireUser, async(req,res)=>{if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});const {data,error}=await db.from('support_tickets').select('*').order('created_at',{ascending:false}).limit(200);if(error)return res.status(500).json({error:error.message});res.json({tickets:data})});
app.patch('/api/admin/tickets/:id', requireUser, async(req,res)=>{if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});const status=sanitizeText(req.body.status,30);if(!['open','in_progress','resolved','closed'].includes(status))return res.status(400).json({error:'Statut invalide.'});const {data,error}=await db.from('support_tickets').update({status,updated_at:nowIso()}).eq('id',req.params.id).select('*').maybeSingle();if(error)return res.status(500).json({error:error.message});if(!data)return res.status(404).json({error:'Ticket introuvable.'});res.json({ticket:data})});

app.get('/api/admin/prospects', requireUser, async(req,res)=>{if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});const {data,error}=await db.from('prospects').select('*').order('score',{ascending:false}).limit(500);if(error)return res.status(500).json({error:error.message});res.json({prospects:data})});
app.get('/api/admin/outreach-health', requireUser, async(req,res)=>{if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});try{const health=await outreachHealth();const {data:queue,error}=await db.from('outreach_queue').select('id,prospect_id,sequence_step,scheduled_at,status,sent_at,error').order('scheduled_at',{ascending:true}).limit(200);if(error)throw error;res.json({health,queue:queue||[]})}catch(e){res.status(500).json({error:e.message})}});
app.post('/api/admin/outreach/send-pilot', requireUser, rateLimit({windowMs:60_000,max:20}), async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});
  try{
    const prospectId=sanitizeText(req.body.prospect_id,100);
    if(!prospectId)return res.status(400).json({error:'prospect_id requis.'});
    const dryRun=req.body.dry_run===true;
    const result=await sendPilotOutreach({prospectId,requestedBy:req.user.email||req.user.id,dryRun});
    res.json(result);
  }catch(e){
    const status=Number(e.status)||500;
    res.status(status).json({error:e.message,code:e.code||'PILOT_OUTREACH_FAILED'});
  }
});
app.post('/api/admin/trials/grant', requireUser, async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});
  try{
    const email=normalizeEmail(req.body.email);
    if(!isValidEmail(email))return res.status(400).json({error:'Email invalide.'});
    const profile=await grantTrialToEmail(email,req.user.email||req.user.id);
    res.status(201).json({trial:{user_id:profile.id,email:profile.email,trial_started_at:profile.trial_started_at,trial_ends_at:profile.trial_ends_at,trial_days_remaining:profile.trial_days_remaining,pro_access:profile.pro_access}});
  }catch(e){
    const status=e.code==='PROFILE_NOT_FOUND'?404:e.code==='TRIAL_ALREADY_USED'||e.code==='ALREADY_PRO'?409:500;
    res.status(status).json({error:e.message,code:e.code||'TRIAL_GRANT_FAILED'});
  }
});
app.post('/api/admin/prospects/import', requireUser, rateLimit({windowMs:60_000,max:5}), async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});
  try{
    const rows=Array.isArray(req.body.prospects)?req.body.prospects:[];
    res.json(await safeImportCommercialProspects(rows));
  }catch(e){await reportError('outreach.import',e,{request_id:req.requestId});res.status(500).json({error:'Import impossible.',request_id:req.requestId})}
});
app.delete('/api/admin/prospects/:id', requireUser, async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});
  try{
    const {data,error}=await db.rpc('delete_prospect_with_tombstone',{p_id:req.params.id,p_reason:sanitizeText(req.body?.reason||'deleted_by_admin',120)});
    if(error)throw error;
    res.json(data);
  }catch(e){res.status(500).json({error:'Suppression prospect impossible.'})}
});
app.post('/api/admin/prospects/:id/send', requireUser, async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});
  res.status(410).json({error:'Ancien chemin d’envoi désactivé. Utilisez le parcours commercial contrôlé.'});
});

app.post('/api/admin/outreach/prepare-commercial', requireUser, rateLimit({windowMs:60_000,max:30}), async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});
  try{
    const result=await prepareCommercialProspect({
      prospectId:sanitizeText(req.body.prospect_id,100),
      personalization:sanitizeText(req.body.personalization,320),
      subject:sanitizeText(req.body.subject,140),
      scheduledAt:req.body.scheduled_at||null
    });
    res.json({ready:true,prospect:{id:result.prospect.id,company_name:result.prospect.company_name,email:result.prospect.email},queue:{id:result.queue.id,status:result.queue.status,subject:result.queue.subject,scheduled_at:result.queue.scheduled_at}});
  }catch(e){res.status(Number(e.status)||409).json({error:e.message,code:e.code||'COMMERCIAL_PREPARE_FAILED'})}
});
app.post('/api/admin/outreach/dry-run-commercial', requireUser, rateLimit({windowMs:60_000,max:40}), async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});
  try{res.json(await inspectCommercialOutreach(sanitizeText(req.body.prospect_id,100)))}
  catch(e){res.status(Number(e.status)||409).json({error:e.message,code:e.code||'COMMERCIAL_DRY_RUN_FAILED'})}
});
app.post('/api/admin/outreach/send-commercial', requireUser, rateLimit({windowMs:60_000,max:5}), async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});
  try{res.json(await sendCommercialJ0({prospectId:sanitizeText(req.body.prospect_id,100),requestedBy:req.user.email||req.user.id}))}
  catch(e){res.status(Number(e.status)||500).json({error:e.message,code:e.code||'COMMERCIAL_SEND_FAILED'})}
});

app.post('/api/admin/prospects/:id/reply', requireUser, async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});try{const text=sanitizeText(req.body.text,5000);if(!text)return res.status(400).json({error:'Réponse vide.'});const {data:p,error}=await db.from('prospects').select('*').eq('id',req.params.id).single();if(error)throw error;const analysis=await analyzeReply(text);await db.from('outreach_events').insert({prospect_id:p.id,type:analysis.category==='opt_out'?'opt_out':'replied',content:text,metadata:analysis});await db.from('feedback_insights').insert({prospect_id:p.id,category:analysis.category,sentiment:analysis.sentiment,confidence:analysis.confidence,summary:analysis.summary,objection:analysis.objection||'',requested_feature:analysis.requested_feature||'',needs_human:analysis.needs_human!==false,raw_text:text});const status=analysis.category==='opt_out'?'suppressed':analysis.category==='not_interested'?'not_interested':analysis.category==='not_now'?'not_now':'replied';await db.from('prospects').update({status,updated_at:nowIso()}).eq('id',p.id);if(analysis.category==='opt_out')await db.from('suppressions').upsert({email:p.email,reason:'opt_out'});res.json({analysis});}catch(e){res.status(500).json({error:e.message})}
});
app.get('/api/admin/insights', requireUser, async(req,res)=>{if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});const {data,error}=await db.from('feedback_insights').select('*').order('created_at',{ascending:false}).limit(500);if(error)return res.status(500).json({error:error.message});const categories={};for(const x of data||[])categories[x.category]=(categories[x.category]||0)+1;res.json({total:data?.length||0,categories,requestedFeatures:prioritizeProductIdeas(data||[]).slice(0,20),recent:data?.slice(0,50)||[]})});

app.get('/api/admin/system', requireUser, async(req,res)=>{if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});try{const since=new Date(Date.now()-7*86400000).toISOString();const [{data:errors},{data:failed},{data:tickets},{data:pastDue}]=await Promise.all([db.from('system_events').select('*').gte('created_at',since).order('created_at',{ascending:false}).limit(100),db.from('followups').select('id,quote_id,error,created_at').eq('status','failed').gte('created_at',since).limit(100),db.from('support_tickets').select('id,subject,status,priority,created_at').in('priority',['high','urgent']).neq('status','closed').limit(100),db.from('profiles').select('id,email,subscription_status').in('subscription_status',['past_due','unpaid']).limit(100)]);res.json({window_days:7,errors:errors||[],failed_followups:failed||[],sensitive_tickets:tickets||[],billing_attention:pastDue||[]})}catch(e){await reportError('admin.system',e,{request_id:req.requestId});res.status(500).json({error:'Impossible de charger la santé système.',request_id:req.requestId})}});

app.get('/api/admin/ceo', requireUser, async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});try{const [{data:events},{data:profiles},{data:prospects},{data:outreach},{data:quotes},{data:insights},{data:followups},{data:systemEvents},{data:tickets}]=await Promise.all([db.from('product_events').select('anonymous_id,user_id,event,created_at').limit(10000),db.from('profiles').select('id,plan,subscription_status,activated_at,trial_started_at,trial_ends_at,trial_expired_at'),db.from('prospects').select('id,status'),db.from('outreach_events').select('type'),db.from('quotes').select('status'),db.from('feedback_insights').select('requested_feature,confidence'),db.from('followups').select('status,created_at').limit(10000),db.from('system_events').select('level,scope,created_at').gte('created_at',new Date(Date.now()-7*86400000).toISOString()).limit(1000),db.from('support_tickets').select('status,priority').neq('status','closed')]);const visitors=new Set((events||[]).filter(e=>e.event==='landing_view').map(e=>e.anonymous_id).filter(Boolean)).size;const signups=(profiles||[]).length,activated=(profiles||[]).filter(p=>p.activated_at).length,paying=(profiles||[]).filter(p=>p.plan==='pro'&&p.subscription_status==='active').length,trials=(profiles||[]).filter(p=>isManagedTrialActive(p)).length,canceled=(profiles||[]).filter(p=>p.subscription_status==='canceled').length;const outreachSent=(outreach||[]).filter(x=>x.type==='sent').length,replies=(outreach||[]).filter(x=>x.type==='replied').length,meetings=(outreach||[]).filter(x=>x.type==='meeting').length;const activeSince=Date.now()-30*86400000;const activeUsers=new Set((events||[]).filter(e=>e.user_id&&new Date(e.created_at).getTime()>=activeSince).map(e=>e.user_id)).size;const followupsSent=(followups||[]).filter(x=>['sent','delivered','opened','clicked'].includes(x.status)).length;const openProblems=(systemEvents||[]).length+(tickets||[]).filter(t=>['high','urgent'].includes(t.priority)&&t.status!=='resolved').length;const metrics={...buildCeoMetrics({visitors,signups,activated,paying,canceled,mrr:paying*29,prospects:(prospects||[]).length,outreachSent,replies,meetings,quotes:(quotes||[]).length,wonQuotes:(quotes||[]).filter(q=>q.status==='won').length}),trials,activeUsers,followupsSent,openProblems};res.json({metrics,recommendations:weeklyRecommendations(metrics,insights||[]),mrrNote:'MRR indicatif basé uniquement sur les abonnements Stripe actifs à 29 €; les essais ne sont pas comptés.'});}catch(e){res.status(500).json({error:e.message})}
});

app.post('/api/cron/run', async(req,res)=>{if(!safeEqual(String(req.headers['x-cron-secret']||''),String(process.env.CRON_SECRET||'')))return res.status(401).json({error:'Unauthorized'});try{res.json({results:await runDueFollowups()})}catch(e){res.status(500).json({error:e.message})}});
cron.schedule('*/15 * * * *',async()=>{try{await runDueFollowups()}catch(e){await reportError('cron.followups',e)}},{noOverlap:true});
cron.schedule('2,17,32,47 * * * *',async()=>{try{await expireTrials()}catch(e){await reportError('cron.trials',e)}},{noOverlap:true});
cron.schedule('*/10 * * * *',async()=>{try{const result=await processOutreachQueue();if(result?.error)await reportError('cron.outreach.result',new Error(result.error),{queue_id:result.queue_id})}catch(e){await reportError('cron.outreach',e)}},{noOverlap:true});
cron.schedule('*/10 * * * *',async()=>{try{await pollImapReplies()}catch(e){await reportError('cron.imap-replies',e,{code:e?.code||'IMAP_POLL_FAILED'})}},{noOverlap:true});
cron.schedule('15 8 * * *',async()=>{if(process.env.LIFECYCLE_EMAILS_ENABLED!=='true')return;try{await runLifecycleEmails()}catch(e){await reportError('cron.lifecycle',e)}},{noOverlap:true});

app.use((err,req,res,next)=>{
  if(err?.type==='entity.too.large'||err?.status===413)return res.status(413).json({error:'Requête trop volumineuse.'});
  if(err instanceof SyntaxError&&err?.status===400)return res.status(400).json({error:'JSON invalide.'});
  reportError('http.unhandled',err,{request_id:req.requestId,path:req.path}).finally(()=>{if(!res.headersSent)res.status(500).json({error:'Erreur interne.',request_id:req.requestId});});
});
process.on('unhandledRejection',e=>reportError('process.unhandledRejection',e));
process.on('uncaughtException',e=>{reportError('process.uncaughtException',e).finally(()=>process.exit(1));});

expireTrials().catch(e=>reportError('startup.trials',e));
pollImapReplies().catch(e=>reportError('startup.imap-replies',e,{code:e?.code||'IMAP_POLL_FAILED'}));

if(process.env.NODE_ENV==='production'){
  app.use(express.static(dist,{maxAge:'1h',etag:true}));
  const spaRoutes=new Set(['/','/pricing','/docs','/faq','/contact','/login','/signup','/reset-password','/legal','/privacy','/dpa','/terms','/logiciel-relance-devis','/relance-devis-agence','/modele-email-relance-devis']);
  app.get('*splat',(req,res)=>{
    if(spaRoutes.has(req.path))return res.sendFile(join(dist,'index.html'));
    res.status(404).type('text/plain').send('Not found');
  });
}
const port=Number(process.env.PORT||3000);if(process.env.NODE_ENV!=='test')app.listen(port,'0.0.0.0',()=>console.log(`Relanzio running on :${port}`));

async function runPilotStartupDryRun(){
  if(process.env.PILOT_OUTREACH_STARTUP_DRY_RUN!=='true')return;
  const ids=String(process.env.PILOT_OUTREACH_STARTUP_DRY_RUN_IDS||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,5);
  const results=[];
  for(const prospectId of ids){
    try{
      const check=await inspectPilotOutreach(prospectId);
      results.push({ok:true,prospect:check.prospect,sender:check.sender,checks:check.checks,queue:{id:check.queue.id,subject:check.queue.subject,status:check.queue.status}});
    }catch(e){
      results.push({ok:false,prospect_id:prospectId,code:e.code||'PILOT_DRY_RUN_FAILED',error:e.message,details:e.details||null});
    }
  }
  console.log('PILOT_STARTUP_DRY_RUN '+JSON.stringify(results));
}
runPilotStartupDryRun().catch(e=>console.error('PILOT_STARTUP_DRY_RUN_FAILED',e.message));
runPilotAdminRunner().catch(e=>console.error('PILOT_ADMIN_RUNNER_FAILED',e.message));

export default app;
