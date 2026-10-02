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
import { billingTransition } from './billing.js';

const app = express(); app.set('trust proxy', 1);
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const __dirname = dirname(fileURLToPath(import.meta.url)); const dist = join(__dirname, '..', 'dist');
const admins = () => (process.env.ADMIN_EMAILS || '').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
const isAdmin = user => admins().includes((user?.email || '').toLowerCase());
const nowIso = () => new Date().toISOString();

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
  try {
    const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
    const obj = event.data.object;
    if (event.type === 'checkout.session.completed') {
      const userId = obj.metadata?.user_id; const customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id; const transition=billingTransition(event.type,obj);
      if (userId) await db.from('profiles').update({ ...transition, stripe_customer_id:customerId||null, stripe_subscription_id:typeof obj.subscription==='string'?obj.subscription:null, updated_at:nowIso() }).eq('id',userId);
    }
    if (['customer.subscription.updated','customer.subscription.deleted'].includes(event.type)) {
      const customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id; const profile = await profileByCustomer(customerId);
      if (profile) { const transition=billingTransition(event.type,obj,profile); await db.from('profiles').update({ ...transition, stripe_subscription_id:obj.id, updated_at:nowIso() }).eq('id',profile.id); }
    }
    if (['invoice.payment_failed','invoice.paid'].includes(event.type)) {
      const customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id; const profile = await profileByCustomer(customerId);
      if (profile) await db.from('profiles').update({ ...billingTransition(event.type,obj,profile), updated_at:nowIso() }).eq('id',profile.id);
    }
    res.json({received:true});
  } catch(e) { res.status(400).send(`Webhook error: ${e.message}`); }
});

app.use(express.json({limit:'256kb'}));
app.get('/api/health', (_req,res)=>res.json({ok:true,service:'relanzio',version:'0.4.0'}));
app.get('/api/readiness', (_req,res)=>{const integrations={supabase:Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_ANON_KEY&&process.env.SUPABASE_SERVICE_ROLE_KEY),stripe:Boolean(process.env.STRIPE_SECRET_KEY&&process.env.STRIPE_PRO_PRICE_ID&&process.env.STRIPE_WEBHOOK_SECRET),brevo:Boolean(process.env.BREVO_API_KEY&&process.env.BREVO_WEBHOOK_SECRET&&process.env.EMAIL_FROM_ADDRESS),openai:Boolean(process.env.OPENAI_API_KEY)};const ready=integrations.supabase&&integrations.stripe&&integrations.brevo;res.status(ready?200:503).json({ready,integrations,automation:{followups:process.env.FOLLOWUP_AUTOMATION_ENABLED==='true',lifecycle:process.env.LIFECYCLE_EMAILS_ENABLED==='true',acquisition:process.env.ACQUISITION_ENABLED==='true'}})});

// Privacy-friendly first-party product analytics. No ad tracker/cross-site identifier.
app.post('/api/events', rateLimit({windowMs:60_000,max:30}), async (req,res)=>{
  const allowed=['landing_view','signup_started','signup_completed','onboarding_completed','quote_created','checkout_started','support_opened'];
  const event=sanitizeText(req.body.event,60); if(!allowed.includes(event)) return res.status(400).json({error:'Événement invalide.'});
  const anonymous_id=sanitizeText(req.body.anonymous_id,80); if(!/^[a-zA-Z0-9_-]{8,80}$/.test(anonymous_id)) return res.status(400).json({error:'Identifiant anonyme requis.'});
  await db.from('product_events').insert({anonymous_id,event,path:sanitizeText(req.body.path,200),metadata:{}});
  res.status(202).json({ok:true});
});

app.post('/api/activity', requireUser, async(req,res)=>{try{await db.from('product_events').insert({user_id:req.user.id,event:'app_active',path:sanitizeText(req.body.path||'/app',200)});res.status(202).json({ok:true})}catch(e){res.status(202).json({ok:false})}});

app.get('/api/profile', requireUser, async(req,res)=>{ try{res.json({profile:await getProfile(req.user)})}catch(e){res.status(500).json({error:e.message})} });
app.patch('/api/profile', requireUser, async(req,res)=>{
  try{ const profile=await getProfile(req.user); const patch={company_name:sanitizeText(req.body.company_name,120),role:sanitizeText(req.body.role,80),onboarding_completed:Boolean(req.body.onboarding_completed),marketing_opt_in:Boolean(req.body.marketing_opt_in),updated_at:nowIso()}; if(req.body.email_mode==='review')patch.email_mode='review'; if(req.body.email_mode==='automatic'&&profile.plan==='pro')patch.email_mode='automatic'; const {data,error}=await db.from('profiles').update(patch).eq('id',req.user.id).select('*').single(); if(error)throw error; res.json({profile:data}); }catch(e){res.status(500).json({error:e.message})}
});

app.get('/api/quotes', requireUser, async(req,res)=>{
  try{ await getProfile(req.user); const {data:quotes,error}=await db.from('quotes').select('*').eq('user_id',req.user.id).order('created_at',{ascending:false}); if(error)throw error; res.json({quotes,metrics:quoteMetrics(quotes||[])}); }catch(e){res.status(500).json({error:e.message})}
});
app.post('/api/quotes', requireUser, async(req,res)=>{
  try{ const profile=await getProfile(req.user); const {client_name,client_email,title,amount,sent_at,auto_send}=req.body; const email=normalizeEmail(client_email); if(!sanitizeText(client_name,120)||!isValidEmail(email)||!sanitizeText(title,180)||!/^\d{4}-\d{2}-\d{2}$/.test(sent_at||'')||!Number.isFinite(Number(amount))||Number(amount)<0)return res.status(400).json({error:'Champs invalides.'}); const sentDate=new Date(`${sent_at}T00:00:00Z`); if(Number.isNaN(sentDate.getTime())||sentDate>Date.now()+86400000)return res.status(400).json({error:"La date d’envoi est invalide."}); const {count}=await db.from('quotes').select('*',{count:'exact',head:true}).eq('user_id',req.user.id).eq('status','open'); if(profile.plan!=='pro'&&count>=5)return res.status(403).json({error:'La formule gratuite est limitée à 5 devis actifs.'}); if(profile.plan==='pro'&&count>=100)return res.status(403).json({error:'Limite de 100 devis actifs atteinte. Contactez le support.'}); const row={user_id:req.user.id,client_name:sanitizeText(client_name,120),client_email:email,title:sanitizeText(title,180),amount:Number(amount),sent_at,status:'open',auto_send:profile.plan==='pro'&&profile.email_mode==='automatic'?Boolean(auto_send):false,followup_step:0,next_followup_at:nextDate(sent_at,0)}; const {data,error}=await db.from('quotes').insert(row).select('*').single(); if(error)throw error; if(!profile.activated_at)await db.from('profiles').update({activated_at:nowIso(),updated_at:nowIso()}).eq('id',req.user.id); await db.from('product_events').insert({user_id:req.user.id,event:'quote_created',path:'/app'}); res.status(201).json({quote:data}); }catch(e){res.status(500).json({error:e.message})}
});
app.patch('/api/quotes/:id', requireUser, async(req,res)=>{
  try {
    const { data:existing, error:findError } = await db.from('quotes').select('*').eq('id',req.params.id).eq('user_id',req.user.id).maybeSingle();
    if (findError) throw findError; if (!existing) return res.status(404).json({error:'Devis introuvable.'});
    const patch={updated_at:nowIso()};
    if ('status' in req.body) { const allowed=['open','won','lost','paused']; if(!allowed.includes(req.body.status))return res.status(400).json({error:'Statut invalide.'}); patch.status=req.body.status; patch.won_at=req.body.status==='won'?nowIso():null; patch.next_followup_at=req.body.status==='open'?(existing.next_followup_at || nextDate(existing.sent_at,existing.followup_step)):null; }
    if ('client_name' in req.body) { const v=sanitizeText(req.body.client_name,120); if(!v)return res.status(400).json({error:'Client invalide.'}); patch.client_name=v; }
    if ('client_email' in req.body) { const v=normalizeEmail(req.body.client_email); if(!isValidEmail(v))return res.status(400).json({error:'Email invalide.'}); patch.client_email=v; }
    if ('title' in req.body) { const v=sanitizeText(req.body.title,180); if(!v)return res.status(400).json({error:'Objet invalide.'}); patch.title=v; }
    if ('amount' in req.body) { const v=Number(req.body.amount); if(!Number.isFinite(v)||v<0)return res.status(400).json({error:'Montant invalide.'}); patch.amount=v; }
    if ('sent_at' in req.body) { const v=String(req.body.sent_at||''); if(!/^\d{4}-\d{2}-\d{2}$/.test(v)||Number.isNaN(new Date(`${v}T00:00:00Z`).getTime()))return res.status(400).json({error:"Date d’envoi invalide."}); patch.sent_at=v; if((patch.status||existing.status)==='open')patch.next_followup_at=nextDate(v,existing.followup_step); }
    if ('auto_send' in req.body) { const profile=await getProfile(req.user); patch.auto_send=profile.plan==='pro'&&profile.email_mode==='automatic'&&['active','trialing'].includes(profile.subscription_status)?Boolean(req.body.auto_send):false; }
    const {data,error}=await db.from('quotes').update(patch).eq('id',req.params.id).eq('user_id',req.user.id).select('*').single(); if(error)throw error; res.json({quote:data});
  } catch(e) { await reportError('quotes.update',e,{request_id:req.requestId}); res.status(500).json({error:'Impossible de modifier le devis.',request_id:req.requestId}); }
});
app.delete('/api/quotes/:id', requireUser, async(req,res)=>{
  try { const {data,error}=await db.from('quotes').delete().eq('id',req.params.id).eq('user_id',req.user.id).select('id').maybeSingle(); if(error)throw error; if(!data)return res.status(404).json({error:'Devis introuvable.'}); res.json({deleted:true}); } catch(e){await reportError('quotes.delete',e,{request_id:req.requestId});res.status(500).json({error:'Impossible de supprimer le devis.',request_id:req.requestId});}
});
app.get('/api/quotes/:id/followup-preview', requireUser, async(req,res)=>{
  try { const [{data:quote,error},profile]=await Promise.all([db.from('quotes').select('*').eq('id',req.params.id).eq('user_id',req.user.id).maybeSingle(),getProfile(req.user)]); if(error)throw error;if(!quote)return res.status(404).json({error:'Devis introuvable.'});if(quote.status!=='open')return res.status(409).json({error:'Ce devis n’est pas ouvert.'});res.json({preview:await createFollowupPreview(quote,profile)}); } catch(e){if(e.message==='SEQUENCE_COMPLETE')return res.status(409).json({error:'Séquence terminée.'});await reportError('followup.preview',e,{request_id:req.requestId});res.status(500).json({error:'Impossible de préparer la relance.',request_id:req.requestId});}
});
app.post('/api/quotes/:id/send-followup', requireUser, async(req,res)=>{
  try { const [{data:quote,error},profile]=await Promise.all([db.from('quotes').select('*').eq('id',req.params.id).eq('user_id',req.user.id).maybeSingle(),getProfile(req.user)]);if(error)throw error;if(!quote)return res.status(404).json({error:'Devis introuvable.'});if(quote.status!=='open')return res.status(409).json({error:'Ce devis n’est pas ouvert.'});if(profile.plan!=='pro'||!['active','trialing'].includes(profile.subscription_status))return res.status(403).json({error:'L’envoi depuis Relanzio nécessite un abonnement Pro actif.'});const result=await sendQuoteFollowup(quote,profile);res.json({sent:true,result}); } catch(e){await reportError('followup.manual_send',e,{request_id:req.requestId});res.status(500).json({error:'La relance n’a pas été envoyée. Aucun succès n’a été enregistré.',request_id:req.requestId});}
});

app.post('/api/billing/checkout', requireUser, async(req,res)=>{
  try{ if(!stripe||!process.env.STRIPE_PRO_PRICE_ID)return res.status(503).json({error:"Stripe n'est pas configuré."}); const profile=await getProfile(req.user); if(profile.plan==='pro')return res.status(409).json({error:'Votre compte est déjà Pro. Utilisez Gérer mon abonnement.'}); let customer=profile.stripe_customer_id; if(!customer){const c=await stripe.customers.create({email:req.user.email,metadata:{user_id:req.user.id}});customer=c.id;await db.from('profiles').update({stripe_customer_id:customer}).eq('id',req.user.id)} const session=await stripe.checkout.sessions.create({mode:'subscription',customer,line_items:[{price:process.env.STRIPE_PRO_PRICE_ID,quantity:1}],allow_promotion_codes:true,client_reference_id:req.user.id,metadata:{user_id:req.user.id},subscription_data:{metadata:{user_id:req.user.id}},success_url:`${process.env.APP_URL}?billing=success`,cancel_url:`${process.env.APP_URL}?billing=cancel`}); await db.from('product_events').insert({user_id:req.user.id,event:'checkout_started',path:'/app'}); res.json({url:session.url}); }catch(e){res.status(500).json({error:e.message})}
});
app.post('/api/billing/portal', requireUser, async(req,res)=>{
  try{ if(!stripe)return res.status(503).json({error:'Stripe non configuré.'}); const profile=await getProfile(req.user); if(!profile.stripe_customer_id)return res.status(400).json({error:'Aucun compte de facturation.'}); const session=await stripe.billingPortal.sessions.create({customer:profile.stripe_customer_id,return_url:process.env.APP_URL}); res.json({url:session.url}); }catch(e){res.status(500).json({error:e.message})}
});

app.post('/api/support/ask', requireUser, async(req,res)=>{ try{res.json(await answerSupport(sanitizeText(req.body.question,2000)))}catch(e){res.status(500).json({error:e.message})} });
app.get('/api/support/tickets', requireUser, async(req,res)=>{ const {data,error}=await db.from('support_tickets').select('*').eq('user_id',req.user.id).order('created_at',{ascending:false}).limit(50); if(error)return res.status(500).json({error:error.message}); res.json({tickets:data}); });
app.post('/api/support/tickets', requireUser, async(req,res)=>{ const subject=sanitizeText(req.body.subject,160),message=sanitizeText(req.body.message,5000),topic=sanitizeText(req.body.topic,40)||'product'; if(!subject||!message)return res.status(400).json({error:'Sujet et message requis.'}); const priority=['billing','privacy','security'].includes(topic)?'high':'normal'; const {data,error}=await db.from('support_tickets').insert({user_id:req.user.id,topic,subject,message,priority}).select('*').single(); if(error)return res.status(500).json({error:error.message}); res.status(201).json({ticket:data}); });

app.delete('/api/account', requireUser, async(req,res)=>{
  try{ if(req.body.confirmation!=='SUPPRIMER')return res.status(400).json({error:'Confirmation invalide.'}); const profile=await getProfile(req.user); if(stripe&&profile.stripe_subscription_id&&['active','trialing','past_due'].includes(profile.subscription_status)){ await stripe.subscriptions.cancel(profile.stripe_subscription_id); } const {error}=await db.auth.admin.deleteUser(req.user.id,false); if(error)throw error; res.json({deleted:true}); }catch(e){res.status(500).json({error:`Suppression impossible: ${e.message}`})}
});

// Brevo transactional events. Configure a custom x-webhook-secret header in Brevo.
app.post('/api/brevo/webhook', async(req,res)=>{
  if(!safeEqual(String(req.headers['x-webhook-secret']||''),String(process.env.BREVO_WEBHOOK_SECRET||'')))return res.status(401).json({error:'Unauthorized'});
  try{ const type=mapBrevoEvent(req.body.event); if(!type)return res.status(202).json({ignored:true}); const messageId=String(req.body['message-id']||req.body.messageId||''); const email=normalizeEmail(req.body.email||''); if(messageId){ const followStatus=type==='bounced'?'bounced':type; if(['delivered','opened','clicked','bounced'].includes(followStatus))await db.from('followups').update({status:followStatus}).eq('provider_message_id',messageId); const {data:pEvent}=await db.from('outreach_events').select('prospect_id').eq('provider_message_id',messageId).order('created_at',{ascending:false}).limit(1).maybeSingle(); if(pEvent)await db.from('outreach_events').insert({prospect_id:pEvent.prospect_id,type,provider_message_id:messageId,metadata:req.body}); }
    if(type==='opt_out'&&email){await db.from('suppressions').upsert({email,reason:'provider_unsubscribe'});await db.from('prospects').update({status:'suppressed',updated_at:nowIso()}).eq('email',email)} res.json({ok:true}); }catch(e){res.status(500).json({error:e.message})}
});

// Founder acquisition CRM — quality capped, human-approved, no scraping endpoint.
app.get('/api/admin/tickets', requireUser, async(req,res)=>{if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});const {data,error}=await db.from('support_tickets').select('*').order('created_at',{ascending:false}).limit(200);if(error)return res.status(500).json({error:error.message});res.json({tickets:data})});
app.patch('/api/admin/tickets/:id', requireUser, async(req,res)=>{if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});const status=sanitizeText(req.body.status,30);if(!['open','in_progress','resolved','closed'].includes(status))return res.status(400).json({error:'Statut invalide.'});const {data,error}=await db.from('support_tickets').update({status,updated_at:nowIso()}).eq('id',req.params.id).select('*').maybeSingle();if(error)return res.status(500).json({error:error.message});if(!data)return res.status(404).json({error:'Ticket introuvable.'});res.json({ticket:data})});

app.get('/api/admin/prospects', requireUser, async(req,res)=>{if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});const {data,error}=await db.from('prospects').select('*').order('score',{ascending:false}).limit(500);if(error)return res.status(500).json({error:error.message});res.json({prospects:data})});
app.post('/api/admin/prospects/import', requireUser, async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'}); const rows=Array.isArray(req.body.prospects)?req.body.prospects.slice(0,200):[]; const accepted=[];
  for(const p of rows){const email=normalizeEmail(p.email);if(!p.company_name||!isValidEmail(email))continue;const {data:suppressed}=await db.from('suppressions').select('email').eq('email',email).maybeSingle();if(suppressed)continue;const generic=/^(contact|hello|bonjour|info|commercial|sales)@/i.test(email);if(!generic&&(!p.source||!p.source_url))continue;const q=qualifyProspect({...p,email});accepted.push({company_name:sanitizeText(p.company_name,160),contact_name:sanitizeText(p.contact_name,120),email,role:sanitizeText(p.role,100),website:sanitizeText(p.website,240),source:sanitizeText(p.source,120),source_url:sanitizeText(p.source_url,500),lawful_basis:'professional_relevance',employee_count:Number(p.employee_count)||null,estimated_quotes_per_month:Number(p.estimated_quotes_per_month)||null,uses_digital_tools:Boolean(p.uses_digital_tools),is_service_business:p.is_service_business!==false,score:q.score,score_reasons:q.reasons,status:q.score>=55?'qualified':'new'});}
  if(!accepted.length)return res.json({imported:0});const {data,error}=await db.from('prospects').upsert(accepted,{onConflict:'email',ignoreDuplicates:false}).select('id');if(error)return res.status(500).json({error:error.message});res.json({imported:data.length});
});
app.post('/api/admin/prospects/:id/send', requireUser, async(req,res)=>{
  if(process.env.ACQUISITION_ENABLED!=='true')return res.status(423).json({error:'Acquisition désactivée avant GO LIVE.'});
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});try{const {data:p,error}=await db.from('prospects').select('*').eq('id',req.params.id).single();if(error)throw error;if(p.score<55)return res.status(409).json({error:'Prospect insuffisamment qualifié.'});const {data:suppressed}=await db.from('suppressions').select('email').eq('email',p.email).maybeSingle();if(suppressed)return res.status(409).json({error:'Adresse sur la liste d’opposition.'});if(p.last_contacted_at&&Date.now()-new Date(p.last_contacted_at).getTime()<7*86400000)return res.status(429).json({error:'Délai minimum de 7 jours entre deux sollicitations.'});const since=new Date(Date.now()-86400000).toISOString();const {count}=await db.from('outreach_events').select('*',{count:'exact',head:true}).eq('type','sent').gte('created_at',since);const cap=Number(process.env.OUTREACH_DAILY_CAP||20);if(count>=cap)return res.status(429).json({error:`Plafond quotidien de ${cap} emails atteint.`});const subject=sanitizeText(req.body.subject||'Suivi de vos devis',140),content=sanitizeText(req.body.content,5000);if(!content)return res.status(400).json({error:'Message vide.'});const footer=`\n\n— Relanzio\nPourquoi ce message : votre activité professionnelle semble correspondre au problème étudié. Pour ne plus être contacté, répondez STOP.`;const sent=await sendEmail({to:p.email,subject,text:content+footer});await db.from('outreach_events').insert({prospect_id:p.id,type:'sent',subject,content,provider_message_id:sent?.messageId||null});await db.from('prospects').update({status:'contacted',last_contacted_at:nowIso(),updated_at:nowIso()}).eq('id',p.id);res.json({sent:true});}catch(e){res.status(500).json({error:e.message})}
});
app.post('/api/admin/prospects/:id/reply', requireUser, async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});try{const text=sanitizeText(req.body.text,5000);if(!text)return res.status(400).json({error:'Réponse vide.'});const {data:p,error}=await db.from('prospects').select('*').eq('id',req.params.id).single();if(error)throw error;const analysis=await analyzeReply(text);await db.from('outreach_events').insert({prospect_id:p.id,type:analysis.category==='opt_out'?'opt_out':'replied',content:text,metadata:analysis});await db.from('feedback_insights').insert({prospect_id:p.id,category:analysis.category,sentiment:analysis.sentiment,confidence:analysis.confidence,summary:analysis.summary,objection:analysis.objection||'',requested_feature:analysis.requested_feature||'',needs_human:analysis.needs_human!==false,raw_text:text});const status=analysis.category==='opt_out'?'suppressed':analysis.category==='not_interested'?'not_interested':analysis.category==='not_now'?'not_now':'replied';await db.from('prospects').update({status,updated_at:nowIso()}).eq('id',p.id);if(analysis.category==='opt_out')await db.from('suppressions').upsert({email:p.email,reason:'opt_out'});res.json({analysis});}catch(e){res.status(500).json({error:e.message})}
});
app.get('/api/admin/insights', requireUser, async(req,res)=>{if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});const {data,error}=await db.from('feedback_insights').select('*').order('created_at',{ascending:false}).limit(500);if(error)return res.status(500).json({error:error.message});const categories={};for(const x of data||[])categories[x.category]=(categories[x.category]||0)+1;res.json({total:data?.length||0,categories,requestedFeatures:prioritizeProductIdeas(data||[]).slice(0,20),recent:data?.slice(0,50)||[]})});

app.get('/api/admin/system', requireUser, async(req,res)=>{if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});try{const since=new Date(Date.now()-7*86400000).toISOString();const [{data:errors},{data:failed},{data:tickets},{data:pastDue}]=await Promise.all([db.from('system_events').select('*').gte('created_at',since).order('created_at',{ascending:false}).limit(100),db.from('followups').select('id,quote_id,error,created_at').eq('status','failed').gte('created_at',since).limit(100),db.from('support_tickets').select('id,subject,status,priority,created_at').in('priority',['high','urgent']).neq('status','closed').limit(100),db.from('profiles').select('id,email,subscription_status').in('subscription_status',['past_due','unpaid']).limit(100)]);res.json({window_days:7,errors:errors||[],failed_followups:failed||[],sensitive_tickets:tickets||[],billing_attention:pastDue||[]})}catch(e){await reportError('admin.system',e,{request_id:req.requestId});res.status(500).json({error:'Impossible de charger la santé système.',request_id:req.requestId})}});

app.get('/api/admin/ceo', requireUser, async(req,res)=>{
  if(!isAdmin(req.user))return res.status(403).json({error:'Forbidden'});try{const [{data:events},{data:profiles},{data:prospects},{data:outreach},{data:quotes},{data:insights},{data:followups},{data:systemEvents},{data:tickets}]=await Promise.all([db.from('product_events').select('anonymous_id,user_id,event,created_at').limit(10000),db.from('profiles').select('id,plan,subscription_status,activated_at'),db.from('prospects').select('id,status'),db.from('outreach_events').select('type'),db.from('quotes').select('status'),db.from('feedback_insights').select('requested_feature,confidence'),db.from('followups').select('status,created_at').limit(10000),db.from('system_events').select('level,scope,created_at').gte('created_at',new Date(Date.now()-7*86400000).toISOString()).limit(1000),db.from('support_tickets').select('status,priority').neq('status','closed')]);const visitors=new Set((events||[]).filter(e=>e.event==='landing_view').map(e=>e.anonymous_id).filter(Boolean)).size;const signups=(profiles||[]).length,activated=(profiles||[]).filter(p=>p.activated_at).length,paying=(profiles||[]).filter(p=>p.plan==='pro'&&['active','trialing'].includes(p.subscription_status)).length,canceled=(profiles||[]).filter(p=>p.subscription_status==='canceled').length;const outreachSent=(outreach||[]).filter(x=>x.type==='sent').length,replies=(outreach||[]).filter(x=>x.type==='replied').length,meetings=(outreach||[]).filter(x=>x.type==='meeting').length;const activeSince=Date.now()-30*86400000;const activeUsers=new Set((events||[]).filter(e=>e.user_id&&new Date(e.created_at).getTime()>=activeSince).map(e=>e.user_id)).size;const followupsSent=(followups||[]).filter(x=>['sent','delivered','opened','clicked'].includes(x.status)).length;const openProblems=(systemEvents||[]).length+(tickets||[]).filter(t=>['high','urgent'].includes(t.priority)&&t.status!=='resolved').length;const metrics={...buildCeoMetrics({visitors,signups,activated,paying,canceled,mrr:paying*29,prospects:(prospects||[]).length,outreachSent,replies,meetings,quotes:(quotes||[]).length,wonQuotes:(quotes||[]).filter(q=>q.status==='won').length}),activeUsers,followupsSent,openProblems};res.json({metrics,recommendations:weeklyRecommendations(metrics,insights||[]),mrrNote:'MRR indicatif basé sur 29 € par compte Pro actif; rapprocher Stripe pour la comptabilité.'});}catch(e){res.status(500).json({error:e.message})}
});

app.post('/api/cron/run', async(req,res)=>{if(!safeEqual(String(req.headers['x-cron-secret']||''),String(process.env.CRON_SECRET||'')))return res.status(401).json({error:'Unauthorized'});try{res.json({results:await runDueFollowups()})}catch(e){res.status(500).json({error:e.message})}});
cron.schedule('*/15 * * * *',async()=>{try{await runDueFollowups()}catch(e){await reportError('cron.followups',e)}},{noOverlap:true});
cron.schedule('15 8 * * *',async()=>{if(process.env.LIFECYCLE_EMAILS_ENABLED!=='true')return;try{await runLifecycleEmails()}catch(e){await reportError('cron.lifecycle',e)}},{noOverlap:true});

app.use((err,req,res,next)=>{reportError('http.unhandled',err,{request_id:req.requestId,path:req.path}).finally(()=>{if(!res.headersSent)res.status(500).json({error:'Erreur interne.',request_id:req.requestId});});});
process.on('unhandledRejection',e=>reportError('process.unhandledRejection',e));
process.on('uncaughtException',e=>{reportError('process.uncaughtException',e).finally(()=>process.exit(1));});

if(process.env.NODE_ENV==='production'){app.use(express.static(dist,{maxAge:'1h',etag:true}));app.get('*splat',(_req,res)=>res.sendFile(join(dist,'index.html')))}
const port=Number(process.env.PORT||3000);if(process.env.NODE_ENV!=='test')app.listen(port,'0.0.0.0',()=>console.log(`Relanzio running on :${port}`));
export default app;
