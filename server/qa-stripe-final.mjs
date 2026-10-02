import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
const APP='https://relanzio-production.up.railway.app', EMAIL=process.env.QA_EMAIL_RECIPIENT;
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const anon=process.env.SUPABASE_ANON_KEY, stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
const scope='qa.cert.stripe-final.v1', stamp=Date.now(), report={checks:{},details:{},errors:[]};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const set=(k,v,d)=>{report.checks[k]=!!v;if(d!==undefined)report.details[k]=d;console.log(JSON.stringify({check:k,ok:!!v,detail:d??null}))};
const fail=(s,e)=>{report.errors.push({scope:s,error:String(e?.message||e)});console.error(JSON.stringify(report.errors.at(-1)))};
async function api(p,t,i={}){const r=await fetch(APP+p,{...i,headers:{'content-type':'application/json',...(t?{authorization:'Bearer '+t}:{}),...(i.headers||{})}});const x=await r.text();let b;try{b=JSON.parse(x)}catch{b=x}return{status:r.status,body:b}}
async function user(){const email=`souhayb299+stripe-final-${stamp}@gmail.com`,password=`Relanzio!Stripe-${stamp}-Aa1`;const u=await db.auth.admin.createUser({email,password,email_confirm:true});if(u.error)throw u.error;const c=createClient(process.env.SUPABASE_URL,anon,{auth:{persistSession:false}});const l=await c.auth.signInWithPassword({email,password});if(l.error||!l.data.session)throw l.error||new Error('no session');return{id:u.data.user.id,email,token:l.data.session.access_token}}
async function waitProfile(id,pred,ms=60000){const end=Date.now()+ms;let row;while(Date.now()<end){row=(await db.from('profiles').select('*').eq('id',id).maybeSingle()).data;if(row&&pred(row))return row;await sleep(1000)}return row}
async function clockReady(id){for(let i=0;i<120;i++){const c=await stripe.testHelpers.testClocks.retrieve(id);if(c.status==='ready')return c;await sleep(1000)}throw new Error('clock timeout')}
async function advance(id,time){await stripe.testHelpers.testClocks.advance(id,{frozen_time:time});return clockReady(id)}
async function cycleEnd(subId){const s=await stripe.subscriptions.retrieve(subId);return s.items.data[0]?.current_period_end}
let u,clock,sub;
try{
 u=await user();await api('/api/profile',u.token);
 const checkout=await api('/api/billing/checkout',u.token,{method:'POST',body:'{}'});
 set('checkout_session_created',checkout.status===200&&String(checkout.body?.url||'').startsWith('https://checkout.stripe.com/'),checkout.status);
 const prof0=(await db.from('profiles').select('*').eq('id',u.id).single()).data;
 const sessions=await stripe.checkout.sessions.list({customer:prof0.stripe_customer_id,limit:3});
 set('checkout_object_open',sessions.data.some(x=>x.mode==='subscription'&&x.status==='open'),sessions.data.map(x=>({id:x.id,mode:x.mode,status:x.status,payment_status:x.payment_status})));
 clock=await stripe.testHelpers.testClocks.create({frozen_time:Math.floor(Date.now()/1000),name:'Relanzio final '+stamp});
 const customer=await stripe.customers.create({email:u.email,test_clock:clock.id,metadata:{user_id:u.id}});
 await db.from('profiles').update({stripe_customer_id:customer.id,stripe_subscription_id:null,plan:'free',subscription_status:'none'}).eq('id',u.id);
 const pm=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});
 await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:pm.id}});
 sub=await stripe.subscriptions.create({customer:customer.id,items:[{price:process.env.STRIPE_PRO_PRICE_ID}],default_payment_method:pm.id,metadata:{user_id:u.id}});
 report.details.ids={customer:customer.id,subscription:sub.id,clock:clock.id};
 const active=await waitProfile(u.id,x=>x.plan==='pro'&&x.subscription_status==='active');
 set('initial_webhook_db_active',active?.plan==='pro'&&active?.subscription_status==='active',active&&{plan:active.plan,status:active.subscription_status,sub:active.stripe_subscription_id});
 let end=await cycleEnd(sub.id); if(!end)throw new Error('missing period end 1');
 let c=await advance(clock.id,end+120); c=await advance(clock.id,c.frozen_time+3700); await sleep(5000);
 let invoices=await stripe.invoices.list({customer:customer.id,limit:10});
 const renewal=invoices.data.find(x=>x.subscription===sub.id&&x.billing_reason==='subscription_cycle');
 set('renewal_paid',renewal?.status==='paid',{id:renewal?.id,status:renewal?.status,attempted:renewal?.attempted});
 const activeAfterRenew=await waitProfile(u.id,x=>x.plan==='pro'&&x.subscription_status==='active',15000);
 set('renewal_db_active',activeAfterRenew?.subscription_status==='active',activeAfterRenew&&{plan:activeAfterRenew.plan,status:activeAfterRenew.subscription_status});
 const bad=await stripe.paymentMethods.attach('pm_card_chargeCustomerFail',{customer:customer.id});
 await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:bad.id}});
 await stripe.subscriptions.update(sub.id,{default_payment_method:bad.id});
 end=await cycleEnd(sub.id); if(!end)throw new Error('missing period end 2');
 c=await advance(clock.id,end+120); c=await advance(clock.id,c.frozen_time+3700); await sleep(5000);
 invoices=await stripe.invoices.list({customer:customer.id,limit:10});
 const failed=invoices.data.find(x=>x.subscription===sub.id&&x.status==='open'&&x.attempted);
 set('invoice_payment_failed',!!failed,failed&&{id:failed.id,status:failed.status,attempted:failed.attempted});
 const past=await waitProfile(u.id,x=>x.subscription_status==='past_due',30000);
 set('db_past_due',past?.subscription_status==='past_due',past&&{plan:past.plan,status:past.subscription_status});
 await api('/api/profile',u.token,{method:'PATCH',body:JSON.stringify({company_name:'QA',role:'QA',onboarding_completed:true,marketing_opt_in:false,email_mode:'automatic'})});
 const day=new Date(Date.now()-10*86400000).toISOString().slice(0,10);
 const q=await api('/api/quotes',u.token,{method:'POST',body:JSON.stringify({client_name:'Block',client_email:EMAIL,title:'Past due block '+stamp,amount:1,sent_at:day,auto_send:true})});
 set('past_due_auto_send_blocked',q.status===201&&q.body?.quote?.auto_send===false,q.status===201?{auto_send:q.body.quote.auto_send}:q);
 const send=await api('/api/quotes/'+q.body.quote.id+'/send-followup',u.token,{method:'POST',body:'{}'});
 set('past_due_manual_send_blocked',send.status===403,send.status);
 const cur=await stripe.subscriptions.retrieve(sub.id);
 set('subscription_not_canceled_before_recovery',cur.status!=='canceled',cur.status);
 if(cur.status==='canceled')throw new Error('subscription canceled by Stripe dunning before recovery');
 const good=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});
 await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:good.id}});
 await stripe.subscriptions.update(sub.id,{default_payment_method:good.id});
 if(failed)await stripe.invoices.pay(failed.id,{payment_method:good.id});
 const recovered=await waitProfile(u.id,x=>x.subscription_status==='active'&&x.plan==='pro',30000);
 set('payment_recovery_db_active',recovered?.subscription_status==='active'&&recovered?.plan==='pro',recovered&&{plan:recovered.plan,status:recovered.subscription_status});
 const portal=await api('/api/billing/portal',u.token,{method:'POST',body:'{}'});
 set('billing_portal',portal.status===200&&String(portal.body?.url||'').startsWith('https://billing.stripe.com/'),portal.status);
 const evs=await stripe.events.list({type:'invoice.paid',limit:30});
 const ev=evs.data.find(x=>x.data.object.customer===customer.id);
 if(!ev)throw new Error('invoice.paid event not found');
 const payload=JSON.stringify(ev),sig=Stripe.webhooks.generateTestHeaderString({payload,secret:process.env.STRIPE_WEBHOOK_SECRET});
 const before=(await db.from('profiles').select('plan,subscription_status,stripe_subscription_id').eq('id',u.id).single()).data;
 const r1=await fetch(APP+'/api/stripe/webhook',{method:'POST',headers:{'content-type':'application/json','stripe-signature':sig},body:payload});
 const r2=await fetch(APP+'/api/stripe/webhook',{method:'POST',headers:{'content-type':'application/json','stripe-signature':sig},body:payload});
 const after=(await db.from('profiles').select('plan,subscription_status,stripe_subscription_id').eq('id',u.id).single()).data;
 set('webhook_replay_no_double_effect',r1.ok&&r2.ok&&JSON.stringify(before)===JSON.stringify(after),{r1:r1.status,r2:r2.status,before,after});
 await stripe.subscriptions.cancel(sub.id);
 const canceled=await waitProfile(u.id,x=>x.subscription_status==='canceled'&&x.plan==='free',30000);
 set('cancel_returns_free',canceled?.subscription_status==='canceled'&&canceled?.plan==='free',canceled&&{plan:canceled.plan,status:canceled.subscription_status});
}catch(e){fail('stripe',e)}
finally{
 if(u?.id)try{await db.auth.admin.deleteUser(u.id,false)}catch{}
 if(clock?.id)try{await stripe.testHelpers.testClocks.del(clock.id)}catch{}
 report.finished_at=new Date().toISOString();report.ok=report.errors.length===0&&Object.values(report.checks).every(Boolean);
 await db.from('system_events').insert({level:report.ok?'info':'error',scope,message:report.ok?'Stripe final certification passed':'Stripe final certification failed',metadata:report});
 console.log('STRIPE_FINAL_REPORT='+JSON.stringify(report));
 setInterval(()=>{},3600000);
}