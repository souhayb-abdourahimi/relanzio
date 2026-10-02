// Targeted staging certification. No customer/profile mutation, no outbound email.
import Stripe from 'stripe';
import { db } from './db.js';
import { sendEmail } from './email.js';
const app=process.env.QA_APP_URL;
const report={started_at:new Date().toISOString(),checks:{},details:{},errors:[]};
async function check(name,fn){try{report.details[name]=await fn()}catch(e){report.errors.push({scope:name,message:String(e.message).slice(0,300)})}}
async function query(q){const r=await q;if(r.error)throw r.error;return r.data}
const uid='387dd02b-2c94-4fea-b95d-6fac6360c3e1';
const eventId='evt_1UM7XsKCFRBUYZk88zcy6eEK';
if(app!=='https://relanzio-production.up.railway.app'||process.env.SUPABASE_URL!=='https://uwgvnhnpvxoebabayqac.supabase.co'||!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'))throw Error('QA_STAGING_GUARD');
await check('stripe',async()=>{
 const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
 const event=await stripe.events.retrieve(eventId);
 if(event.livemode)throw Error('LIVE_EVENT_REJECTED');
 const session=await stripe.checkout.sessions.retrieve(event.data.object.id);
 const subscription=await stripe.subscriptions.retrieve(session.subscription);
 const customer=await stripe.customers.retrieve(session.customer);
 const profile=await query(db.from('profiles').select('id,plan,subscription_status,stripe_customer_id,stripe_subscription_id,updated_at').eq('id',uid).single());
 const ledger=await query(db.from('stripe_webhook_events').select('*').eq('event_id',eventId));
 report.checks.checkout_complete=session.status==='complete'&&session.payment_status==='paid'&&!session.livemode;
 report.checks.stripe_consistency=session.metadata.user_id===uid&&subscription.customer===customer.id&&session.customer===customer.id&&profile.stripe_customer_id===customer.id&&profile.stripe_subscription_id===subscription.id&&profile.plan==='pro'&&profile.subscription_status==='active'&&subscription.status==='active';
 report.checks.webhook_processed=ledger.length===1&&ledger[0].event_type==='checkout.session.completed'&&Boolean(ledger[0].processed_at);
 const payload=JSON.stringify(event);
 const responses=[];
 for(let i=0;i<2;i++){const signature=stripe.webhooks.generateTestHeaderString({payload,secret:process.env.STRIPE_WEBHOOK_SECRET});const r=await fetch(app+'/api/stripe/webhook',{method:'POST',headers:{'Content-Type':'application/json','stripe-signature':signature},body:payload});responses.push({status:r.status,body:await r.json()})}
 const after=await query(db.from('profiles').select('id,plan,subscription_status,stripe_customer_id,stripe_subscription_id,updated_at').eq('id',uid).single());
 const ledgerAfter=await query(db.from('stripe_webhook_events').select('*').eq('event_id',eventId));
 report.checks.webhook_replay_idempotent=responses.every(r=>r.status===200&&r.body.duplicate===true)&&JSON.stringify(after)===JSON.stringify(profile)&&JSON.stringify(ledgerAfter)===JSON.stringify(ledger);
 return {event:{id:event.id,type:event.type,created:event.created,livemode:event.livemode,pending_webhooks:event.pending_webhooks},session:{id:session.id,status:session.status,payment_status:session.payment_status,customer:session.customer,subscription:session.subscription,client_reference_id:session.client_reference_id,user_id:session.metadata.user_id},subscription:{id:subscription.id,status:subscription.status,customer:subscription.customer,livemode:subscription.livemode,user_id:subscription.metadata.user_id},customer:{id:customer.id,livemode:customer.livemode,user_id:customer.metadata?.user_id},profile,ledger,replay:responses};
});
await check('brevo',async()=>{
 const email=process.env.QA_EMAIL_RECIPIENT;
 const suppression=await query(db.from('suppressions').select('reason,created_at').eq('email',email.toLowerCase()).maybeSingle());
 if(suppression?.reason!=='provider_unsubscribe')throw Error('REAL_OPT_OUT_MISSING_NO_SEND_ATTEMPTED');
 const url=new URL('https://api.brevo.com/v3/smtp/statistics/events');url.searchParams.set('messageId','<202610021407.29002124349@smtp-relay.mailin.fr>');url.searchParams.set('limit','100');
 const r=await fetch(url,{headers:{'api-key':process.env.BREVO_API_KEY}});if(!r.ok)throw Error('BREVO_READ_'+r.status);const data=await r.json();
 const events=(data.events||[]).map(({event,date,messageId})=>({event,date,messageId}));
 report.checks.brevo_provider_unsubscribe=events.some(x=>x.event==='unsubscribed');
 const nativeFetch=globalThis.fetch;let emailSendAttempts=0,blocked;
 globalThis.fetch=(url,opts)=>{if(String(url)==='https://api.brevo.com/v3/smtp/email'){emailSendAttempts++;throw Error('QA_NETWORK_SEND_INTERCEPTED')}return nativeFetch(url,opts)};
 try{await sendEmail({to:email,subject:'QA suppression guard - must not send',text:'QA'});blocked=false}catch(e){blocked=e.message==='EMAIL_RECIPIENT_SUPPRESSED'}finally{globalThis.fetch=nativeFetch}
 report.checks.suppressed_send_blocked=blocked&&emailSendAttempts===0;
 const unauthorized=await fetch(app+'/api/brevo/webhook',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
 report.checks.brevo_unsigned_rejected=unauthorized.status===401;
 return {provider_status:r.status,events,suppression,send_blocked:blocked,provider_send_attempts:emailSendAttempts,unsigned_status:unauthorized.status};
});
await check('auth_redirects',async()=>{
 const qa=await query(db.from('profiles').select('email').eq('id','4c267116-89e1-4478-a2e1-2a249ba2d38e').single());
 if(!qa.email.includes('+'))throw Error('NOT_A_QA_EMAIL');
 const results={};
 for(const [name,options] of [['default',{}],['reset',{redirectTo:app+'/reset-password'}]]){const r=await db.auth.admin.generateLink({type:'recovery',email:qa.email,options});if(r.error)throw r.error;const url=new URL(r.data.properties.action_link);results[name]={host:url.host,type:url.searchParams.get('type'),redirect_to:url.searchParams.get('redirect_to')};}
 report.checks.auth_default_redirect=results.default.redirect_to===app||results.default.redirect_to===app+'/';
 report.checks.auth_reset_redirect=results.reset.redirect_to===app+'/reset-password';
 return results;
});
await check('health',async()=>{const r=await fetch(app+'/api/health');const body=await r.json();report.checks.health=r.status===200&&body.ok===true;return{status:r.status,body}});
await check('readiness',async()=>{const r=await fetch(app+'/api/readiness');const body=await r.json();report.checks.readiness=r.status===200&&body.ready;report.checks.automations_disabled=Object.values(body.automation).every(x=>x===false);return{status:r.status,body}});
report.finished_at=new Date().toISOString();
console.log('RELANZIO_CERT_V2='+JSON.stringify(report));
setInterval(()=>{},3600000);
