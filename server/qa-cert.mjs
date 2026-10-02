import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { analyzeReply } from './prospecting.js';
import { classifyReplyFallback } from './logic.js';
import { spawnSync } from 'node:child_process';

const APP=(process.env.QA_APP_URL||'https://relanzio-production.up.railway.app').replace(/\/$/,'');
const RECIPIENT=process.env.QA_EMAIL_RECIPIENT||'';
const supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const anonKey=process.env.SUPABASE_ANON_KEY;
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
const report={started_at:new Date().toISOString(),checks:{},details:{},errors:[]};
const stamp=Date.now();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const set=(k,v,d)=>{report.checks[k]=Boolean(v);if(d!==undefined)report.details[k]=d;console.log(JSON.stringify({check:k,ok:Boolean(v),detail:d??null}));};
const err=(scope,e)=>{const x={scope,error:String(e?.message||e)};report.errors.push(x);console.error(JSON.stringify(x));};
async function api(path,token,init={}){const r=await fetch(APP+path,{...init,headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{}),...(init.headers||{})}});const t=await r.text();let b;try{b=JSON.parse(t)}catch{b=t}return{status:r.status,body:b,headers:Object.fromEntries(r.headers.entries())}}
async function createUser(label){
 const email=`souhayb299+relanzio-${label}-${stamp}@gmail.com`, password=`Relanzio!${label}-${stamp}-Aa1`;
 const c=createClient(process.env.SUPABASE_URL,anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const s=await c.auth.signUp({email,password}); if(s.error||!s.data.user)throw new Error(label+' signup '+s.error?.message);
 await supabase.auth.admin.updateUserById(s.data.user.id,{email_confirm:true});
 const l=await c.auth.signInWithPassword({email,password});if(l.error||!l.data.session)throw new Error(label+' login '+l.error?.message);
 return {email,password,id:s.data.user.id,client:c,token:l.data.session.access_token};
}
async function waitProfile(id,pred,ms=60000){const end=Date.now()+ms;let row=null;while(Date.now()<end){const q=await supabase.from('profiles').select('*').eq('id',id).maybeSingle();row=q.data;if(row&&pred(row))return row;await sleep(1000)}return row}
async function waitFollowup(id,pred,ms=90000){const end=Date.now()+ms;let row=null;while(Date.now()<end){const q=await supabase.from('followups').select('*').eq('id',id).maybeSingle();row=q.data;if(row&&pred(row))return row;await sleep(1500)}return row}
async function waitClock(id){for(let i=0;i<90;i++){const c=await stripe.testHelpers.testClocks.retrieve(id);if(c.status==='ready')return c;await sleep(1000)}throw new Error('clock timeout')}
async function runSupabase(){
 const A=await createUser('a'),B=await createUser('b');report.details.supabase_users={A:A.id,B:B.id};
 set('supabase_signup_login_A',true);set('supabase_signup_login_B',true);
 const resetReq=await A.client.auth.resetPasswordForEmail(A.email,{redirectTo:APP+'/reset-password'});set('supabase_reset_request_A',!resetReq.error,resetReq.error?.message);
 const g=await supabase.auth.admin.generateLink({type:'recovery',email:A.email});if(g.error)throw g.error;
 const hash=g.data?.properties?.hashed_token;if(!hash)throw new Error('missing recovery token');
 const rc=createClient(process.env.SUPABASE_URL,anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const vr=await rc.auth.verifyOtp({token_hash:hash,type:'recovery'});if(vr.error||!vr.data.session)throw new Error('recovery verify '+vr.error?.message);
 const newPass=A.password+'-NEW';const up=await rc.auth.updateUser({password:newPass});if(up.error)throw up.error;await rc.auth.signOut();
 const l2=await A.client.auth.signInWithPassword({email:A.email,password:newPass});if(l2.error||!l2.data.session)throw new Error('login after reset');
 A.token=l2.data.session.access_token;set('supabase_reset_complete_A',true);
 const pa=await api('/api/profile',A.token),pb=await api('/api/profile',B.token);set('supabase_profile_A',pa.status===200,pa.status);set('supabase_profile_B',pb.status===200,pb.status);
 const day=new Date(Date.now()-86400000).toISOString().slice(0,10);
 const qa=await api('/api/quotes',A.token,{method:'POST',body:JSON.stringify({client_name:'Client QA A',client_email:'client-a@example.com',title:'QA devis A',amount:1200,sent_at:day})});
 const qb=await api('/api/quotes',B.token,{method:'POST',body:JSON.stringify({client_name:'Client QA B',client_email:'client-b@example.com',title:'QA devis B',amount:2300,sent_at:day})});
 if(qa.status!==201||qb.status!==201)throw new Error('quote create '+JSON.stringify({qa,qb}));
 const idA=qa.body.quote.id,idB=qb.body.quote.id;report.details.supabase_quotes={A:idA,B:idB};set('supabase_create_quote_A',true);set('supabase_create_quote_B',true);
 const la=await api('/api/quotes',A.token),lb=await api('/api/quotes',B.token);
 set('api_A_cannot_read_B',la.status===200&&la.body.quotes.some(x=>x.id===idA)&&!la.body.quotes.some(x=>x.id===idB));
 set('api_B_cannot_read_A',lb.status===200&&lb.body.quotes.some(x=>x.id===idB)&&!lb.body.quotes.some(x=>x.id===idA));
 const ca1=await api('/api/quotes/'+idB,A.token,{method:'PATCH',body:JSON.stringify({title:'ILLEGAL-A'})});
 const ca2=await api('/api/quotes/'+idB,A.token,{method:'DELETE'});
 const cb1=await api('/api/quotes/'+idA,B.token,{method:'PATCH',body:JSON.stringify({title:'ILLEGAL-B'})});
 const cb2=await api('/api/quotes/'+idA,B.token,{method:'DELETE'});
 set('api_A_cannot_modify_B',ca1.status===404,ca1.status);set('api_A_cannot_delete_B',ca2.status===404,ca2.status);
 set('api_B_cannot_modify_A',cb1.status===404,cb1.status);set('api_B_cannot_delete_A',cb2.status===404,cb2.status);
 const ua=createClient(process.env.SUPABASE_URL,anonKey,{global:{headers:{Authorization:'Bearer '+A.token}},auth:{persistSession:false}});
 const ub=createClient(process.env.SUPABASE_URL,anonKey,{global:{headers:{Authorization:'Bearer '+B.token}},auth:{persistSession:false}});
 const ar=await ua.from('quotes').select('id').eq('id',idB),br=await ub.from('quotes').select('id').eq('id',idA);
 set('rls_A_cannot_read_B',!ar.error&&(ar.data||[]).length===0,ar.error?.message);set('rls_B_cannot_read_A',!br.error&&(br.data||[]).length===0,br.error?.message);
 const au=await ua.from('quotes').update({title:'RLS-ILLEGAL-A'}).eq('id',idB).select('id'),bu=await ub.from('quotes').update({title:'RLS-ILLEGAL-B'}).eq('id',idA).select('id');
 const ad=await ua.from('quotes').delete().eq('id',idB).select('id'),bd=await ub.from('quotes').delete().eq('id',idA).select('id');
 set('rls_A_cannot_modify_B',!au.error&&(au.data||[]).length===0,au.error?.message);set('rls_B_cannot_modify_A',!bu.error&&(bu.data||[]).length===0,bu.error?.message);
 set('rls_A_cannot_delete_B',!ad.error&&(ad.data||[]).length===0,ad.error?.message);set('rls_B_cannot_delete_A',!bd.error&&(bd.data||[]).length===0,bd.error?.message);
 const intact=await supabase.from('quotes').select('id,title').in('id',[idA,idB]);set('cross_attempts_no_effect',!intact.error&&intact.data?.length===2&&intact.data.every(x=>!x.title.startsWith('ILLEGAL')&&!x.title.startsWith('RLS-ILLEGAL')));
 const del=await api('/api/account',A.token,{method:'DELETE',body:JSON.stringify({confirmation:'SUPPRIMER'})});set('supabase_delete_account_A',del.status===200,del);
 await sleep(500);
 const [p,q,f]=await Promise.all([supabase.from('profiles').select('id',{count:'exact',head:true}).eq('id',A.id),supabase.from('quotes').select('id',{count:'exact',head:true}).eq('user_id',A.id),supabase.from('followups').select('id',{count:'exact',head:true}).eq('user_id',A.id)]);
 set('cascade_profile_A',(p.count||0)===0,p.count);set('cascade_quotes_A',(q.count||0)===0,q.count);set('cascade_followups_A',(f.count||0)===0,f.count);
 await supabase.auth.admin.deleteUser(B.id,false);
}
async function runOpenAI(){
 const text='Merci pour votre message. Le service semble utile mais 29 € par mois est trop cher pour nous pour le moment. Pouvez-vous me recontacter dans deux mois ?';
 const a=await analyzeReply(text);report.details.openai_real=a;
 set('openai_structured_real',!!a&&['interested','not_now','pricing','feature_request','not_interested','opt_out','other'].includes(a.category)&&typeof a.summary==='string'&&typeof a.needs_human==='boolean',a);
 const fb=classifyReplyFallback('STOP, merci de ne plus me contacter.');set('openai_fallback_logic',fb.category==='opt_out'&&fb.needs_human===false,fb);
 const child=spawnSync(process.execPath,['--input-type=module','-e',`import('./server/prospecting.js').then(async m=>console.log(JSON.stringify(await m.analyzeReply('STOP, merci de ne plus me contacter.'))))`],{cwd:'/app',env:{...process.env,OPENAI_API_KEY:'sk-invalid-qa'},encoding:'utf8',timeout:30000});
 let out=null;try{out=JSON.parse((child.stdout||'').trim().split('\n').pop())}catch{}
 set('openai_failure_fallback',child.status===0&&out?.category==='opt_out', {status:child.status,out,stderr:(child.stderr||'').slice(0,300)});
}
async function runSmokeLoad(){
 const h=await api('/api/health'),r=await api('/api/readiness');set('smoke_health',h.status===200&&h.body?.ok===true,h);set('smoke_readiness',r.status===200&&r.body?.ready===true,r);
 set('acquisition_disabled',r.body?.automation?.acquisition===false,r.body?.automation);
 const total=100,concurrency=10,times=[];let next=0,fail=0;async function w(){while(next<total){next++;const t=Date.now();try{const x=await fetch(APP+'/api/health');if(!x.ok)fail++}catch{fail++}times.push(Date.now()-t)}}await Promise.all(Array.from({length:concurrency},w));times.sort((a,b)=>a-b);const p95=times[Math.floor(times.length*.95)]||0;set('load_100x10',fail===0,{total,concurrency,fail,p95_ms:p95});report.details.load={total,concurrency,fail,p95_ms:p95};
}
async function runBrevo(){
 if(!RECIPIENT)throw new Error('QA_EMAIL_RECIPIENT missing');
 const U=await createUser('brevo');await api('/api/profile',U.token);
 await supabase.from('profiles').update({plan:'pro',subscription_status:'active',company_name:'Relanzio QA'}).eq('id',U.id);
 const day=new Date(Date.now()-86400000).toISOString().slice(0,10);
 const q=await api('/api/quotes',U.token,{method:'POST',body:JSON.stringify({client_name:'Souhayb QA',client_email:RECIPIENT,title:'Email transactionnel QA '+stamp,amount:999,sent_at:day})});if(q.status!==201)throw new Error('brevo quote '+JSON.stringify(q));
 const send=await api('/api/quotes/'+q.body.quote.id+'/send-followup',U.token,{method:'POST',body:'{}'});set('brevo_api_send',send.status===200&&send.body?.sent===true,send);if(send.status!==200)throw new Error('brevo send');
 const fid=(await supabase.from('followups').select('*').eq('quote_id',q.body.quote.id).order('created_at',{ascending:false}).limit(1).single()).data;report.details.brevo_followup=fid;
 set('brevo_sent_status',fid?.status==='sent'||['delivered','opened','clicked'].includes(fid?.status),fid);
 const delivered=await waitFollowup(fid.id,x=>['delivered','opened','clicked'].includes(x.status),90000);set('brevo_delivered_webhook',['delivered','opened','clicked'].includes(delivered?.status),delivered);
 const wh=await fetch('https://api.brevo.com/v3/webhooks?type=transactional',{headers:{'api-key':process.env.BREVO_API_KEY,accept:'application/json'}});const whj=await wh.json();const hook=(whj.webhooks||[]).find(x=>x.url===APP+'/api/brevo/webhook');set('brevo_webhook_configured',wh.ok&&!!hook&&hook.events?.some(e=>String(e).toLowerCase().includes('delivered')),{status:wh.status,hook:hook?{id:hook.id,events:hook.events,url:hook.url}:null});
 const qb=await api('/api/quotes',U.token,{method:'POST',body:JSON.stringify({client_name:'Bounce QA',client_email:`nobody-${stamp}@nonexistent-relanzio.invalid`,title:'Bounce QA '+stamp,amount:1,sent_at:day})});
 if(qb.status===201){const sb=await api('/api/quotes/'+qb.body.quote.id+'/send-followup',U.token,{method:'POST',body:'{}'});if(sb.status===200){const bf=(await supabase.from('followups').select('*').eq('quote_id',qb.body.quote.id).order('created_at',{ascending:false}).limit(1).single()).data;const bounced=await waitFollowup(bf.id,x=>x.status==='bounced',120000);set('brevo_bounce_webhook',bounced?.status==='bounced',bounced)}else set('brevo_bounce_webhook',false,sb)}else set('brevo_bounce_webhook',false,qb);
 const sim=await fetch(APP+'/api/brevo/webhook',{method:'POST',headers:{'content-type':'application/json','x-webhook-secret':process.env.BREVO_WEBHOOK_SECRET},body:JSON.stringify({event:'unsubscribed',email:U.email,'message-id':fid.provider_message_id})});const sj=await sim.json().catch(()=>null);const sup=await supabase.from('suppressions').select('*').eq('email',U.email).maybeSingle();set('brevo_unsubscribe_handler',sim.ok&&!!sup.data,{status:sim.status,body:sj,suppression:sup.data});
 report.details.brevo_subject='Suivi — Email transactionnel QA '+stamp;report.details.brevo_recipient=RECIPIENT;report.details.brevo_reply_to=U.email;
 await supabase.auth.admin.deleteUser(U.id,false);
}
async function runStripe(){
 const C=await createUser('stripe');await api('/api/profile',C.token);
 const co=await api('/api/billing/checkout',C.token,{method:'POST',body:'{}'});set('stripe_checkout_created',co.status===200&&/^https:\/\/checkout\.stripe\.com\//.test(co.body?.url||''),co.status);report.details.stripe_checkout_url=co.body?.url||null;
 const prof0=(await supabase.from('profiles').select('*').eq('id',C.id).single()).data;
 if(!prof0?.stripe_customer_id)throw new Error('checkout did not create customer');
 const sessions=await stripe.checkout.sessions.list({customer:prof0.stripe_customer_id,limit:5});const sess=sessions.data.find(x=>x.url===co.body.url)||sessions.data[0];set('stripe_checkout_object',!!sess&&sess.mode==='subscription'&&sess.status==='open',{id:sess?.id,status:sess?.status,payment_status:sess?.payment_status});
 report.details.stripe_checkout_id=sess?.id||null;
 const clock=await stripe.testHelpers.testClocks.create({frozen_time:Math.floor(Date.now()/1000),name:'Relanzio final QA '+stamp});
 const customer=await stripe.customers.create({email:C.email,test_clock:clock.id,metadata:{user_id:C.id,qa:'final-cert'}});
 await supabase.from('profiles').update({stripe_customer_id:customer.id,stripe_subscription_id:null,plan:'free',subscription_status:'none'}).eq('id',C.id);
 const pm=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:pm.id}});
 const sub=await stripe.subscriptions.create({customer:customer.id,items:[{price:process.env.STRIPE_PRO_PRICE_ID}],default_payment_method:pm.id,metadata:{user_id:C.id}});
 report.details.stripe={clock:clock.id,customer:customer.id,subscription:sub.id};
 const active=await waitProfile(C.id,x=>x.plan==='pro'&&x.subscription_status==='active',60000);set('stripe_initial_invoice_webhook',active?.plan==='pro'&&active?.subscription_status==='active',active);
 const firstEnd=sub.items.data[0].current_period_end;await stripe.testHelpers.testClocks.advance(clock.id,{frozen_time:firstEnd+60});await waitClock(clock.id);await sleep(5000);
 const invs1=await stripe.invoices.list({customer:customer.id,subscription:sub.id,limit:5});set('stripe_renewal_invoice_paid',invs1.data.some(x=>x.status==='paid'&&x.billing_reason==='subscription_cycle'),invs1.data.map(x=>({id:x.id,status:x.status,billing_reason:x.billing_reason})));
 const afterRenew=await waitProfile(C.id,x=>x.subscription_status==='active',30000);set('stripe_renewal_db_active',afterRenew?.subscription_status==='active',afterRenew);
 const failpm=await stripe.paymentMethods.attach('pm_card_chargeCustomerFail',{customer:customer.id});await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:failpm.id}});await stripe.subscriptions.update(sub.id,{default_payment_method:failpm.id});
 const sub2=await stripe.subscriptions.retrieve(sub.id);const end2=sub2.items.data[0].current_period_end;await stripe.testHelpers.testClocks.advance(clock.id,{frozen_time:end2+60});await waitClock(clock.id);await sleep(8000);
 const invs2=await stripe.invoices.list({customer:customer.id,subscription:sub.id,limit:5});set('stripe_payment_failed_invoice',invs2.data.some(x=>x.status==='open'&&x.attempted===true),invs2.data.map(x=>({id:x.id,status:x.status,attempted:x.attempted,paid:x.paid})));
 const past=await waitProfile(C.id,x=>x.subscription_status==='past_due',60000);set('stripe_db_past_due',past?.subscription_status==='past_due',past);
 const autoQuoteDay=new Date(Date.now()-10*86400000).toISOString().slice(0,10);const q=await api('/api/quotes',C.token,{method:'POST',body:JSON.stringify({client_name:'No send past due',client_email:RECIPIENT||'souhayb299@gmail.com',title:'Past due block',amount:10,sent_at:autoQuoteDay,auto_send:true})});if(q.status===201){const p=await api('/api/profile',C.token,{method:'PATCH',body:JSON.stringify({company_name:'QA',role:'QA',onboarding_completed:true,marketing_opt_in:false,email_mode:'automatic'})});const uq=await api('/api/quotes/'+q.body.quote.id,C.token,{method:'PATCH',body:JSON.stringify({auto_send:true})});set('stripe_past_due_blocks_automation',uq.status===200&&uq.body.quote.auto_send===false,uq.body)}else set('stripe_past_due_blocks_automation',false,q);
 const good2=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:good2.id}});await stripe.subscriptions.update(sub.id,{default_payment_method:good2.id});
 const latest=(await stripe.invoices.list({customer:customer.id,subscription:sub.id,limit:1})).data[0];if(latest?.status==='open')await stripe.invoices.pay(latest.id,{payment_method:good2.id});await sleep(5000);
 const rec=await waitProfile(C.id,x=>x.subscription_status==='active'&&x.plan==='pro',60000);set('stripe_recovery_db_active',rec?.subscription_status==='active'&&rec?.plan==='pro',rec);
 const portal=await api('/api/billing/portal',C.token,{method:'POST',body:'{}'});set('stripe_portal',portal.status===200&&/^https:\/\/billing\.stripe\.com\//.test(portal.body?.url||''),portal.status);
 const events=await stripe.events.list({type:'invoice.paid',limit:10});const ev=events.data.find(x=>x.data?.object?.customer===customer.id);if(ev&&process.env.STRIPE_WEBHOOK_SECRET){const payload=JSON.stringify(ev);const sig=Stripe.webhooks.generateTestHeaderString({payload,secret:process.env.STRIPE_WEBHOOK_SECRET});const r1=await fetch(APP+'/api/stripe/webhook',{method:'POST',headers:{'content-type':'application/json','stripe-signature':sig},body:payload});const r2=await fetch(APP+'/api/stripe/webhook',{method:'POST',headers:{'content-type':'application/json','stripe-signature':sig},body:payload});set('stripe_webhook_replay_idempotent',r1.ok&&r2.ok,{first:r1.status,second:r2.status})}else set('stripe_webhook_replay_idempotent',false,'invoice.paid event unavailable');
 await stripe.subscriptions.cancel(sub.id);const canceled=await waitProfile(C.id,x=>x.subscription_status==='canceled'&&x.plan==='free',60000);set('stripe_cancel_db_free',canceled?.subscription_status==='canceled'&&canceled?.plan==='free',canceled);
 await supabase.auth.admin.deleteUser(C.id,false);
}
try{await runSmokeLoad()}catch(e){err('smoke_load',e)}
try{await runSupabase()}catch(e){err('supabase',e)}
try{await runOpenAI()}catch(e){err('openai',e)}
try{await runBrevo()}catch(e){err('brevo',e)}
try{await runStripe()}catch(e){err('stripe',e)}
report.finished_at=new Date().toISOString();report.ok=report.errors.length===0&&Object.values(report.checks).every(Boolean);
try{await supabase.from('system_events').insert({level:report.ok?'info':'error',scope:'qa.cert.final',message:report.ok?'Final QA runner passed':'Final QA runner has failures',metadata:report})}catch(e){err('persist_report',e)}
console.log('FINAL_QA_REPORT='+JSON.stringify(report));
process.exit(report.ok?0:1);
