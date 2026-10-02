import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
const APP='https://relanzio-production.up.railway.app';
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const scope='qa.fix.integrations.v1';
const prior=await db.from('system_events').select('id').eq('scope',scope).limit(1);
if((prior.data||[]).length){console.log('QA_FIX_ALREADY_DONE');setInterval(()=>{},3600000)}
const out={};
try{
 const acct=await stripe.accounts.retrieve();out.stripe_account=acct.id;
 let price=null;
 try{price=await stripe.prices.retrieve(process.env.STRIPE_PRO_PRICE_ID)}catch{}
 if(!price?.id){
  const product=await stripe.products.create({name:'Relanzio Pro — staging',description:'Relanzio staging QA'});
  price=await stripe.prices.create({currency:'eur',unit_amount:2900,recurring:{interval:'month'},product:product.id,nickname:'Relanzio Pro 29 EUR/mois'});
 }
 out.stripe_price=price.id;
 const eps=await stripe.webhookEndpoints.list({limit:20});
 for(const ep of eps.data.filter(x=>x.url===APP+'/api/stripe/webhook')){try{await stripe.webhookEndpoints.del(ep.id)}catch{}}
 const ep=await stripe.webhookEndpoints.create({
  url:APP+'/api/stripe/webhook',
  enabled_events:['checkout.session.completed','customer.subscription.updated','customer.subscription.deleted','invoice.payment_failed','invoice.paid'],
  description:'Relanzio staging'
 });
 out.stripe_webhook=ep.id;
 console.log('QA_STRIPE_WEBHOOK_SECRET='+ep.secret);
 console.log('QA_STRIPE_PRICE_ID='+price.id);
 const wr=await fetch('https://api.brevo.com/v3/webhooks?type=transactional',{headers:{accept:'application/json','api-key':process.env.BREVO_API_KEY}});
 const wj=await wr.json();const hook=(wj.webhooks||[]).find(x=>x.url===APP+'/api/brevo/webhook');
 if(!hook)throw new Error('Brevo webhook not found');
 const ur=await fetch('https://api.brevo.com/v3/webhooks/'+hook.id,{method:'PUT',headers:{accept:'application/json','content-type':'application/json','api-key':process.env.BREVO_API_KEY},body:JSON.stringify({
   url:hook.url,description:hook.description||'Relanzio staging',events:hook.events,type:'transactional',
   headers:[{key:'x-webhook-secret',value:process.env.BREVO_WEBHOOK_SECRET}]
 })});
 out.brevo_webhook={id:hook.id,update_status:ur.status,events:hook.events};if(!ur.ok)throw new Error('Brevo webhook update '+ur.status+' '+await ur.text());
 await db.from('system_events').insert({level:'info',scope,message:'Integration configuration fixed',metadata:out});
 console.log('QA_FIX_REPORT='+JSON.stringify(out));
}catch(e){out.error=String(e?.message||e);await db.from('system_events').insert({level:'error',scope,message:'Integration configuration fix failed',metadata:out});console.error('QA_FIX_REPORT='+JSON.stringify(out))}
setInterval(()=>{},3600000);
