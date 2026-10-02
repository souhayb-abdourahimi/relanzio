import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const APP=(process.env.QA_APP_URL||'https://relanzio-production.up.railway.app').replace(/\/$/,'');
const RECIPIENT=process.env.QA_EMAIL_RECIPIENT||'';
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const anon=process.env.SUPABASE_ANON_KEY;
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
const scope='qa.cert.cont.v1';
const report={started_at:new Date().toISOString(),checks:{},details:{},errors:[]};
const stamp=Date.now();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const set=(k,v,d)=>{report.checks[k]=!!v;if(d!==undefined)report.details[k]=d;console.log(JSON.stringify({check:k,ok:!!v,detail:d??null}));};
const fail=(s,e)=>{const x={scope:s,error:String(e?.message||e)};report.errors.push(x);console.error(JSON.stringify(x));};
async function api(path,token,init={}){const r=await fetch(APP+path,{...init,headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{}),...(init.headers||{})}});const t=await r.text();let b;try{b=JSON.parse(t)}catch{b=t}return{status:r.status,body:b};}
async function adminUser(label){
 const email=`souhayb299+relanzio-${label}-${stamp}@gmail.com`,password=`Relanzio!${label}-${stamp}-Aa1`;
 const c=await db.auth.admin.createUser({email,password,email_confirm:true});if(c.error||!c.data.user)throw new Error(label+' admin create '+c.error?.message);
 const pub=createClient(process.env.SUPABASE_URL,anon,{auth:{persistSession:false,autoRefreshToken:false}});
 const l=await pub.auth.signInWithPassword({email,password});if(l.error||!l.data.session)throw new Error(label+' login '+l.error?.message);
 return{id:c.data.user.id,email,password,client:pub,token:l.data.session.access_token};
}
async function cleanup(u){if(u?.id)try{await db.auth.admin.deleteUser(u.id,false)}catch{}}
async function waitRow(table,id,pred,ms=90000){const end=Date.now()+ms;let row=null;while(Date.now()<end){const q=await db.from(table).select('*').eq('id',id).maybeSingle();row=q.data;if(row&&pred(row))return row;await sleep(1500)}return row}
async function waitProfile(id,pred,ms=90000){return waitRow('profiles',id,pred,ms)}
async function runIsolation(){
 let A,B;try{
 A=await adminUser('iso-a');B=await adminUser('iso-b');set('supabase_login_A',true);set('supabase_login_B',true);
 const g=await db.auth.admin.generateLink({type:'recovery',email:A.email});if(g.error)throw g.error;
 const hash=g.data?.properties?.hashed_token;const rc=createClient(process.env.SUPABASE_URL,anon,{auth:{persistSession:false,autoRefreshToken:false}});
 const vr=await rc.auth.verifyOtp({token_hash:hash,type:'recovery'});if(vr.error||!vr.data.session)throw new Error('recovery verify '+vr.error?.message);
 const np=A.password+'-R';const up=await rc.auth.updateUser({password:np});if(up.error)throw up.error;await rc.auth.signOut();
 const relog=await A.client.auth.signInWithPassword({email:A.email,password:np});if(relog.error||!relog.data.session)throw new Error('relogin reset');A.token=relog.data.session.access_token;set('supabase_recovery_token_password_change',true);
 const pa=await api('/api/profile',A.token),pb=await api('/api/profile',B.token);set('supabase_profile_A',pa.status===200,pa.status);set('supabase_profile_B',pb.status===200,pb.status);
 const day=new Date(Date.now()-86400000).toISOString().slice(0,10);
 const qa=await api('/api/quotes',A.token,{method:'POST',body:JSON.stringify({client_name:'Client A',client_email:'client-a@example.com',title:'Isolation A',amount:1111,sent_at:day})});
 const qb=await api('/api/quotes',B.token,{method:'POST',body:JSON.stringify({client_name:'Client B',client_email:'client-b@example.com',title:'Isolation B',amount:2222,sent_at:day})});
 if(qa.status!==201||qb.status!==201)throw new Error('quote create '+JSON.stringify({qa,qb}));
 const a=qa.body.quote.id,b=qb.body.quote.id;report.details.isolation={userA:A.id,userB:B.id,quoteA:a,quoteB:b};set('supabase_quote_A',true);set('supabase_quote_B',true);
 const la=await api('/api/quotes',A.token),lb=await api('/api/quotes',B.token);
 set('api_A_not_read_B',la.status===200&&la.body.quotes.some(x=>x.id===a)&&!la.body.quotes.some(x=>x.id===b));
 set('api_B_not_read_A',lb.status===200&&lb.body.quotes.some(x=>x.id===b)&&!lb.body.quotes.some(x=>x.id===a));
 for(const [name,user,target] of [['A',A,b],['B',B,a]]){
   const p=await api('/api/quotes/'+target,user.token,{method:'PATCH',body:JSON.stringify({title:'ILLEGAL-'+name})});
   const d=await api('/api/quotes/'+target,user.token,{method:'DELETE'});
   set('api_'+name+'_not_modify_other',p.status===404,p.status);set('api_'+name+'_not_delete_other',d.status===404,d.status);
 }
 const ca=createClient(process.env.SUPABASE_URL,anon,{global:{headers:{Authorization:'Bearer '+A.token}},auth:{persistSession:false}});
 const cb=createClient(process.env.SUPABASE_URL,anon,{global:{headers:{Authorization:'Bearer '+B.token}},auth:{persistSession:false}});
 for(const [name,c,target] of [['A',ca,b],['B',cb,a]]){
   const r=await c.from('quotes').select('id').eq('id',target);
   const u=await c.from('quotes').update({title:'RLS-ILLEGAL-'+name}).eq('id',target).select('id');
   const d=await c.from('quotes').delete().eq('id',target).select('id');
   set('rls_'+name+'_not_read_other',!r.error&&(r.data||[]).length===0,r.error?.message);
   set('rls_'+name+'_not_modify_other',!u.error&&(u.data||[]).length===0,u.error?.message);
   set('rls_'+name+'_not_delete_other',!d.error&&(d.data||[]).length===0,d.error?.message);
 }
 const intact=await db.from('quotes').select('id,title').in('id',[a,b]);set('isolation_attempts_no_effect',!intact.error&&intact.data?.length===2&&intact.data.every(x=>!x.title.includes('ILLEGAL')),intact.data);
 const del=await api('/api/account',A.token,{method:'DELETE',body:JSON.stringify({confirmation:'SUPPRIMER'})});set('delete_account_A',del.status===200&&del.body?.deleted===true,del);
 await sleep(1000);
 const [p,q,f]=await Promise.all([db.from('profiles').select('id',{count:'exact',head:true}).eq('id',A.id),db.from('quotes').select('id',{count:'exact',head:true}).eq('user_id',A.id),db.from('followups').select('id',{count:'exact',head:true}).eq('user_id',A.id)]);
 set('cascade_profile_A',(p.count||0)===0,p.count);set('cascade_quotes_A',(q.count||0)===0,q.count);set('cascade_followups_A',(f.count||0)===0,f.count);
 A=null;
 }finally{await cleanup(A);await cleanup(B)}
}
async function runBrevo(){
 let U;try{
 U=await adminUser('brevo');await api('/api/profile',U.token);await db.from('profiles').update({plan:'pro',subscription_status:'active',company_name:'Relanzio QA'}).eq('id',U.id);
 const day=new Date(Date.now()-86400000).toISOString().slice(0,10);
 const title='Brevo E2E '+stamp;
 const q=await api('/api/quotes',U.token,{method:'POST',body:JSON.stringify({client_name:'Souhayb QA',client_email:RECIPIENT,title,amount:999,sent_at:day})});if(q.status!==201)throw new Error('quote '+JSON.stringify(q));
 const send=await api('/api/quotes/'+q.body.quote.id+'/send-followup',U.token,{method:'POST',body:'{}'});set('brevo_send_via_relanzio',send.status===200&&send.body?.sent===true,send);if(send.status!==200)throw new Error('send '+JSON.stringify(send));
 const fq=await db.from('followups').select('*').eq('quote_id',q.body.quote.id).order('created_at',{ascending:false}).limit(1).single();const f=fq.data;report.details.brevo={followup_id:f?.id,message_id:f?.provider_message_id,subject:'Suivi — '+title,recipient:RECIPIENT,reply_to:U.email};
 set('brevo_status_sent',f?.status==='sent'||['delivered','opened','clicked'].includes(f?.status),f);
 const delivered=await waitRow('followups',f.id,x=>['delivered','opened','clicked'].includes(x.status),120000);set('brevo_delivered_webhook',['delivered','opened','clicked'].includes(delivered?.status),delivered);
 const wr=await fetch('https://api.brevo.com/v3/webhooks?type=transactional',{headers:{accept:'application/json','api-key':process.env.BREVO_API_KEY}});const wj=await wr.json();const hook=(wj.webhooks||[]).find(x=>x.url===APP+'/api/brevo/webhook');set('brevo_provider_webhook_active',wr.ok&&!!hook,{http:wr.status,hook:hook?{id:hook.id,url:hook.url,events:hook.events}:null});
 const bounceEmail=`relanzio.qa.bounce.${stamp}@gmail.com`;const qb=await api('/api/quotes',U.token,{method:'POST',body:JSON.stringify({client_name:'Bounce QA',client_email:bounceEmail,title:'Bounce E2E '+stamp,amount:1,sent_at:day})});
 if(qb.status!==201){set('brevo_bounce',false,qb)}else{const sb=await api('/api/quotes/'+qb.body.quote.id+'/send-followup',U.token,{method:'POST',body:'{}'});if(sb.status!==200){set('brevo_bounce',false,sb)}else{const bf=(await db.from('followups').select('*').eq('quote_id',qb.body.quote.id).order('created_at',{ascending:false}).limit(1).single()).data;const bounced=await waitRow('followups',bf.id,x=>x.status==='bounced',150000);set('brevo_bounce',bounced?.status==='bounced',bounced)}}
 const synthetic=await fetch(APP+'/api/brevo/webhook',{method:'POST',headers:{'content-type':'application/json','x-webhook-secret':process.env.BREVO_WEBHOOK_SECRET},body:JSON.stringify({event:'unsubscribed',email:U.email,'message-id':f.provider_message_id})});
 const sup=await db.from('suppressions').select('*').eq('email',U.email).maybeSingle();set('brevo_unsubscribe_handler_signed',synthetic.ok&&!!sup.data,{http:synthetic.status,suppression:!!sup.data});
 }finally{await cleanup(U)}
}
async function waitClock(id){for(let i=0;i<120;i++){const c=await stripe.testHelpers.testClocks.retrieve(id);if(c.status==='ready')return c;await sleep(1000)}throw new Error('clock timeout')}
async function runStripe(){
 let U,clock,sub;try{
 U=await adminUser('stripe');await api('/api/profile',U.token);
 const checkout=await api('/api/billing/checkout',U.token,{method:'POST',body:'{}'});set('stripe_checkout_real_created',checkout.status===200&&String(checkout.body?.url||'').startsWith('https://checkout.stripe.com/'),checkout.status);
 const p0=(await db.from('profiles').select('*').eq('id',U.id).single()).data;const ss=await stripe.checkout.sessions.list({customer:p0.stripe_customer_id,limit:5});const sess=ss.data.find(x=>x.url===checkout.body?.url)||ss.data[0];set('stripe_checkout_object_open',sess?.mode==='subscription'&&sess?.status==='open'&&sess?.payment_status==='unpaid',{id:sess?.id,status:sess?.status,payment_status:sess?.payment_status});report.details.checkout={id:sess?.id,url:checkout.body?.url};
 clock=await stripe.testHelpers.testClocks.create({frozen_time:Math.floor(Date.now()/1000),name:'Relanzio final cert '+stamp});
 const customer=await stripe.customers.create({email:U.email,test_clock:clock.id,metadata:{user_id:U.id,qa:'final'}});
 await db.from('profiles').update({stripe_customer_id:customer.id,stripe_subscription_id:null,plan:'free',subscription_status:'none'}).eq('id',U.id);
 const pm=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:pm.id}});
 sub=await stripe.subscriptions.create({customer:customer.id,items:[{price:process.env.STRIPE_PRO_PRICE_ID}],default_payment_method:pm.id,metadata:{user_id:U.id}});
 report.details.stripe_cycle={clock:clock.id,customer:customer.id,subscription:sub.id};
 const act=await waitProfile(U.id,x=>x.plan==='pro'&&x.subscription_status==='active',90000);set('stripe_webhook_initial_active',act?.plan==='pro'&&act?.subscription_status==='active',act);
 let s=await stripe.subscriptions.retrieve(sub.id);let end=s.items.data[0]?.current_period_end;if(!end)throw new Error('period end missing');
 await stripe.testHelpers.testClocks.advance(clock.id,{frozen_time:end+120});await waitClock(clock.id);await sleep(6000);
 const i1=await stripe.invoices.list({customer:customer.id,limit:10});set('stripe_renewal_paid',i1.data.some(x=>x.subscription===sub.id&&x.billing_reason==='subscription_cycle'&&x.status==='paid'),i1.data.map(x=>({id:x.id,status:x.status,billing_reason:x.billing_reason,subscription:x.subscription})));
 const ra=await waitProfile(U.id,x=>x.subscription_status==='active'&&x.plan==='pro',30000);set('stripe_db_after_renewal_active',ra?.subscription_status==='active'&&ra?.plan==='pro',ra);
 const bad=await stripe.paymentMethods.attach('pm_card_chargeCustomerFail',{customer:customer.id});await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:bad.id}});await stripe.subscriptions.update(sub.id,{default_payment_method:bad.id});
 s=await stripe.subscriptions.retrieve(sub.id);end=s.items.data[0]?.current_period_end;await stripe.testHelpers.testClocks.advance(clock.id,{frozen_time:end+120});await waitClock(clock.id);await sleep(10000);
 const i2=await stripe.invoices.list({customer:customer.id,limit:10});const failed=i2.data.find(x=>x.subscription===sub.id&&x.status==='open'&&x.attempted);set('stripe_invoice_payment_failed_real',!!failed,i2.data.map(x=>({id:x.id,status:x.status,attempted:x.attempted,subscription:x.subscription})));
 const pd=await waitProfile(U.id,x=>x.subscription_status==='past_due',90000);set('stripe_db_past_due',pd?.subscription_status==='past_due',pd);
 const day=new Date(Date.now()-10*86400000).toISOString().slice(0,10);await api('/api/profile',U.token,{method:'PATCH',body:JSON.stringify({company_name:'QA',role:'QA',onboarding_completed:true,marketing_opt_in:false,email_mode:'automatic'})});
 const aq=await api('/api/quotes',U.token,{method:'POST',body:JSON.stringify({client_name:'Automation block',client_email:RECIPIENT,title:'Past due block',amount:10,sent_at:day,auto_send:true})});set('stripe_past_due_blocks_automation',aq.status===201&&aq.body?.quote?.auto_send===false,aq);
 const good=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:good.id}});await stripe.subscriptions.update(sub.id,{default_payment_method:good.id});
 if(failed)await stripe.invoices.pay(failed.id,{payment_method:good.id});await sleep(6000);
 const recovered=await waitProfile(U.id,x=>x.subscription_status==='active'&&x.plan==='pro',90000);set('stripe_recovery_active',recovered?.subscription_status==='active'&&recovered?.plan==='pro',recovered);
 const portal=await api('/api/billing/portal',U.token,{method:'POST',body:'{}'});set('stripe_portal_real',portal.status===200&&String(portal.body?.url||'').startsWith('https://billing.stripe.com/'),portal.status);
 const evs=await stripe.events.list({type:'invoice.paid',limit:20});const ev=evs.data.find(x=>x.data?.object?.customer===customer.id);if(ev){const payload=JSON.stringify(ev);const sig=Stripe.webhooks.generateTestHeaderString({payload,secret:process.env.STRIPE_WEBHOOK_SECRET});const before=(await db.from('profiles').select('plan,subscription_status').eq('id',U.id).single()).data;const a=await fetch(APP+'/api/stripe/webhook',{method:'POST',headers:{'content-type':'application/json','stripe-signature':sig},body:payload});const b=await fetch(APP+'/api/stripe/webhook',{method:'POST',headers:{'content-type':'application/json','stripe-signature':sig},body:payload});const after=(await db.from('profiles').select('plan,subscription_status').eq('id',U.id).single()).data;set('stripe_webhook_replay_no_double_effect',a.ok&&b.ok&&before.plan===after.plan&&before.subscription_status===after.subscription_status,{first:a.status,second:b.status,before,after})}else set('stripe_webhook_replay_no_double_effect',false,'event unavailable');
 await stripe.subscriptions.cancel(sub.id);const can=await waitProfile(U.id,x=>x.subscription_status==='canceled'&&x.plan==='free',90000);set('stripe_cancel_returns_free',can?.subscription_status==='canceled'&&can?.plan==='free',can);
 }finally{await cleanup(U);if(clock?.id)try{await stripe.testHelpers.testClocks.del(clock.id)}catch{}}
}
const prior=await db.from('system_events').select('id').eq('scope',scope).limit(1);if((prior.data||[]).length){console.log('CONT_QA_ALREADY_DONE');setInterval(()=>{},3600000)}
try{await runIsolation()}catch(e){fail('supabase_isolation',e)}
try{await runBrevo()}catch(e){fail('brevo',e)}
try{await runStripe()}catch(e){fail('stripe',e)}
report.finished_at=new Date().toISOString();report.ok=report.errors.length===0&&Object.values(report.checks).every(Boolean);
await db.from('system_events').insert({level:report.ok?'info':'error',scope,message:report.ok?'Continuation QA passed':'Continuation QA has failures',metadata:report});
console.log('CONT_QA_REPORT='+JSON.stringify(report));
setInterval(()=>{},3600000);
