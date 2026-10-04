import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { analyzeReply } from './prospecting.js';
import { classifyReplyFallback } from './logic.js';
import { spawnSync } from 'node:child_process';

const APP=(process.env.APP_URL||'https://relanzio.com').replace(/\/$/,'');
const RECIPIENT=String(process.env.QA_EMAIL_RECIPIENT||'').trim().toLowerCase();
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const anon=process.env.SUPABASE_ANON_KEY;
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
const stamp=Date.now(), runId='destructive-'+stamp;
const tests=[], resources={users:[],customers:[],clocks:[],suppressions:[],ledger:[]};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function add(zone,name,result,evidence='',severity='P2'){tests.push({zone,name,result,evidence:String(evidence||'').slice(0,500),severity:result==='FAIL'?severity:''});console.log(JSON.stringify({zone,name,result,severity:result==='FAIL'?severity:undefined,evidence:String(evidence||'').slice(0,180)}))}
const pass=(z,n,e='')=>add(z,n,'PASS',e);
const fail=(z,n,e='',s='P2')=>add(z,n,'FAIL',e,s);
const nt=(z,n,e='')=>add(z,n,'NON_TESTABLE',e);
function alias(label){if(!RECIPIENT)return '';const [l,d]=RECIPIENT.split('@');return d==='gmail.com' ? l+'+relanzio-'+label+'-'+stamp+'@'+d : l+'+relanzio-'+label+'-'+stamp+'@'+d}
async function api(path,token,init={}){const r=await fetch(APP+'/api'+path,{...init,headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{}),...(init.headers||{})}});const raw=await r.text();let body;try{body=JSON.parse(raw)}catch{body=raw}return{status:r.status,body,headers:r.headers}}
async function pub(){return createClient(process.env.SUPABASE_URL,anon,{auth:{persistSession:false,autoRefreshToken:false}})}
async function makeUser(label,{confirmed=true}={}){const email=alias(label),password='Rz!'+stamp+'-'+label+'-Aa9';const c=await pub();const s=await c.auth.signUp({email,password});if(s.error||!s.data.user)throw s.error||new Error('signup failed');resources.users.push(s.data.user.id);if(confirmed){const u=await db.auth.admin.updateUserById(s.data.user.id,{email_confirm:true});if(u.error)throw u.error}const l=confirmed?await c.auth.signInWithPassword({email,password}):null;return{id:s.data.user.id,email,password,client:c,token:l?.data?.session?.access_token||null,loginError:l?.error||null}}
async function delUser(u){if(!u?.id)return;try{await db.auth.admin.deleteUser(u.id,false)}catch{}}
async function setProfile(id,patch){const {error}=await db.from('profiles').update(patch).eq('id',id);if(error)throw error}
async function count(table,filters={}){let q=db.from(table).select('*',{count:'exact',head:true});for(const[k,v]of Object.entries(filters))q=q.eq(k,v);const r=await q;if(r.error)throw r.error;return r.count||0}
async function waitRow(table,id,pred,ms=90000){const end=Date.now()+ms;let row;while(Date.now()<end){const r=await db.from(table).select('*').eq('id',id).maybeSingle();row=r.data;if(row&&pred(row))return row;await sleep(1000)}return row}
async function waitProfile(id,pred,ms=60000){return waitRow('profiles',id,pred,ms)}
async function waitClock(id){for(let i=0;i<120;i++){const c=await stripe.testHelpers.testClocks.retrieve(id);if(c.status==='ready')return c;await sleep(1000)}throw new Error('clock timeout')}
async function advanceClock(id,t){await stripe.testHelpers.testClocks.advance(id,{frozen_time:t});return waitClock(id)}
function validAnalysis(a){return !!a&&['interested','not_now','pricing','feature_request','not_interested','opt_out','other'].includes(a.category)&&['positive','neutral','negative'].includes(a.sentiment)&&typeof a.summary==='string'&&typeof a.needs_human==='boolean'}
async function rawPost(path,body,headers={}){const r=await fetch(APP+path,{method:'POST',headers:{'content-type':'application/json',...headers},body});return{status:r.status,text:await r.text()}}
async function signedStripe(event){const payload=JSON.stringify(event);const sig=Stripe.webhooks.generateTestHeaderString({payload,secret:process.env.STRIPE_WEBHOOK_SECRET});return rawPost('/api/stripe/webhook',payload,{'stripe-signature':sig})}
async function signedBrevo(body){return rawPost('/api/brevo/webhook',JSON.stringify(body),{'x-webhook-secret':process.env.BREVO_WEBHOOK_SECRET})}

async function authTests(){
  const bad=await pub();
  for(const [name,email,password] of [
    ['email invalide','not-an-email','GoodPass!123'],
    ['email vide','','GoodPass!123'],
    ['mot de passe vide',alias('empty-pass'),''],
    ['mot de passe trop court',alias('short-pass'),'a1!']
  ]){const r=await bad.auth.signUp({email,password});r.error?pass('Auth',name,'rejeté'):fail('Auth',name,'accepté','P1')}
  const unconfirmed=await makeUser('unconfirmed',{confirmed:false});
  const before=await unconfirmed.client.auth.signInWithPassword({email:unconfirmed.email,password:unconfirmed.password});
  before.error?pass('Auth','login avant confirmation','rejeté'):fail('Auth','login avant confirmation','accepté','P1');
  await db.auth.admin.updateUserById(unconfirmed.id,{email_confirm:true});
  const good=await unconfirmed.client.auth.signInWithPassword({email:unconfirmed.email,password:unconfirmed.password});
  good.data.session?pass('Auth','login valide après confirmation'):fail('Auth','login valide après confirmation',good.error?.message,'P1');
  const wrong=await unconfirmed.client.auth.signInWithPassword({email:unconfirmed.email,password:'Wrong!123'});
  wrong.error?pass('Auth','mauvais mot de passe','rejeté'):fail('Auth','mauvais mot de passe','accepté','P1');
  const none=await unconfirmed.client.auth.signInWithPassword({email:alias('does-not-exist'),password:'Wrong!123'});
  none.error?pass('Auth','compte inexistant','rejeté'):fail('Auth','compte inexistant','accepté','P1');
  const beforeCount=(await db.auth.admin.listUsers({page:1,perPage:1000})).data.users.filter(x=>x.email?.toLowerCase()===unconfirmed.email.toLowerCase()).length;
  await bad.auth.signUp({email:unconfirmed.email,password:'Another!123'});
  const afterCount=(await db.auth.admin.listUsers({page:1,perPage:1000})).data.users.filter(x=>x.email?.toLowerCase()===unconfirmed.email.toLowerCase()).length;
  afterCount===beforeCount?pass('Auth','signup doublon email','aucun doublon'):fail('Auth','signup doublon email','compte dupliqué','P0');
  const caseEmail=alias('case');
  const c1=await bad.auth.signUp({email:caseEmail.toUpperCase(),password:'CasePass!123'});if(c1.data?.user)resources.users.push(c1.data.user.id);
  const c2=await bad.auth.signUp({email:caseEmail.toLowerCase(),password:'CasePass!456'});if(c2.data?.user?.id&&c2.data.user.id!==c1.data?.user?.id)resources.users.push(c2.data.user.id);
  const users=(await db.auth.admin.listUsers({page:1,perPage:1000})).data.users.filter(x=>x.email?.toLowerCase()===caseEmail.toLowerCase());
  users.length===1?pass('Auth','email majuscules/minuscules','canonicalisé'):fail('Auth','email majuscules/minuscules','count='+users.length,'P0');
  const spaced='  '+alias('spaces')+'  ';const sp=await bad.auth.signUp({email:spaced,password:'Spaces!123'});
  const literal=(await db.auth.admin.listUsers({page:1,perPage:1000})).data.users.filter(x=>x.email===spaced);
  literal.length===0?pass('Auth','email espaces avant/après',sp.error?'rejeté':'normalisé'):fail('Auth','email espaces avant/après','espaces stockés','P2');
  const rec=await makeUser('recovery');
  const req=await rec.client.auth.resetPasswordForEmail(rec.email,{redirectTo:APP+'/reset-password'});
  !req.error?pass('Auth','demande reset password'):fail('Auth','demande reset password',req.error?.message,'P1');
  const gl=await db.auth.admin.generateLink({type:'recovery',email:rec.email});const hash=gl.data?.properties?.hashed_token;const rc=await pub();
  const v1=await rc.auth.verifyOtp({token_hash:hash,type:'recovery'});
  if(v1.data?.session){const up=await rc.auth.updateUser({password:rec.password+'-NEW'});!up.error?pass('Auth','changement mot de passe'):fail('Auth','changement mot de passe',up.error?.message,'P1')}else fail('Auth','lien reset initial',v1.error?.message,'P1');
  const rc2=await pub();const v2=await rc2.auth.verifyOtp({token_hash:hash,type:'recovery'});
  v2.error?pass('Auth','réutilisation lien reset','rejetée'):fail('Auth','réutilisation lien reset','ancien lien réutilisable','P1');
  const nl=await rec.client.auth.signInWithPassword({email:rec.email,password:rec.password+'-NEW'});nl.data.session?pass('Auth','reconnexion après changement'):fail('Auth','reconnexion après changement',nl.error?.message,'P1');
  const unauth=await api('/profile',null);unauth.status===401?pass('Security','route protégée sans session','401'):fail('Security','route protégée sans session','HTTP '+unauth.status,'P0');
  const invalid=await api('/profile','invalid.token.value');invalid.status===401?pass('Security','token invalide','401'):fail('Security','token invalide','HTTP '+invalid.status,'P0');
  nt('Auth','lien confirmation expiré','expiration temporelle non accélérable sans changer la config');
  await delUser(unconfirmed);await delUser(rec);
}

async function profileRaceAndOnboarding(){
  for(let n=1;n<=2;n++){
    const u=await makeUser('race'+n);
    const rs=await Promise.all(Array.from({length:6},(_,i)=>api(i%2?'/quotes':'/profile',u.token)));
    const bad=rs.filter(x=>x.status>=500);
    bad.length===0&&rs.every(x=>x.status===200)?pass('Concurrency','initialisation profil concurrente #'+n,rs.map(x=>x.status).join(',')):fail('Concurrency','initialisation profil concurrente #'+n,rs.map(x=>x.status).join(','),'P1');
    const pc=await count('profiles',{id:u.id});pc===1?pass('Database','profil unique après concurrence #'+n,'count=1'):fail('Database','profil unique après concurrence #'+n,'count='+pc,'P0');
    await delUser(u)
  }
  const u=await makeUser('onboard');await api('/profile',u.token);
  const normal=await api('/profile',u.token,{method:'PATCH',body:JSON.stringify({company_name:'Rupture QA 🧪',role:"Dirigeant d'essai",onboarding_completed:true,marketing_opt_in:true,email_mode:'review'})});
  normal.status===200?pass('Onboarding','onboarding normal'):fail('Onboarding','onboarding normal','HTTP '+normal.status,'P1');
  const partial=await api('/profile',u.token,{method:'PATCH',body:JSON.stringify({email_mode:'review'})});
  const p=partial.body?.profile;
  p?.company_name==='Rupture QA 🧪'&&p?.role==="Dirigeant d'essai"&&p?.onboarding_completed===true&&p?.marketing_opt_in===true?pass('Onboarding','PATCH partiel conserve les données'):fail('Onboarding','PATCH partiel conserve les données',JSON.stringify({company:p?.company_name,role:p?.role,onboarding:p?.onboarding_completed,marketing:p?.marketing_opt_in}),'P2');
  const blank=await api('/profile',u.token,{method:'PATCH',body:JSON.stringify({company_name:'',role:'',onboarding_completed:true})});
  blank.status===400?pass('Onboarding','entreprise vide refusée','400'):fail('Onboarding','entreprise vide refusée','HTTP '+blank.status,'P2');
  const long=await api('/profile',u.token,{method:'PATCH',body:JSON.stringify({company_name:'X'.repeat(500),role:'R'.repeat(500),onboarding_completed:true})});
  long.status===200&&long.body.profile.company_name.length<=120&&long.body.profile.role.length<=80?pass('Onboarding','valeurs très longues bornées'):fail('Onboarding','valeurs très longues bornées','HTTP '+long.status,'P2');
  const dbl=await Promise.all([api('/profile',u.token,{method:'PATCH',body:JSON.stringify({company_name:'Double',role:'QA',onboarding_completed:true})}),api('/profile',u.token,{method:'PATCH',body:JSON.stringify({company_name:'Double',role:'QA',onboarding_completed:true})})]);
  dbl.every(x=>x.status===200)&&(await count('profiles',{id:u.id}))===1?pass('Onboarding','double validation sans double profil'):fail('Onboarding','double validation sans double profil',dbl.map(x=>x.status).join(','),'P1');
  await delUser(u)
}

async function quoteTests(){
  const u=await makeUser('quotes');await api('/profile',u.token);await api('/profile',u.token,{method:'PATCH',body:JSON.stringify({company_name:'QA',role:'QA',onboarding_completed:true})});
  const day=new Date(Date.now()-86400000).toISOString().slice(0,10);
  const base={client_name:'Client QA',client_email:alias('client'),title:'Devis rupture',amount:123.45,sent_at:day};
  const create=body=>api('/quotes',u.token,{method:'POST',body:JSON.stringify({...base,...body})});
  for(const [name,body] of [
    ['client vide',{client_name:''}],['email vide',{client_email:''}],['email invalide',{client_email:'invalid'}],['montant négatif',{amount:-1}],['montant texte',{amount:'abc'}],['titre vide',{title:''}]
  ]){const r=await create(body);r.status===400?pass('Quotes',name,'400'):fail('Quotes',name,'HTTP '+r.status,'P2');if(r.body?.quote?.id)await api('/quotes/'+r.body.quote.id,u.token,{method:'DELETE'})}
  const emptyAmount=await create({amount:''});emptyAmount.status===400?pass('Quotes','montant vide refusé','400'):fail('Quotes','montant vide refusé','HTTP '+emptyAmount.status,'P2');if(emptyAmount.body?.quote?.id)await api('/quotes/'+emptyAmount.body.quote.id,u.token,{method:'DELETE'});
  const zero=await create({amount:0});zero.status===201&&zero.body.quote.amount==0?pass('Quotes','montant zéro cohérent','accepté sans NaN'):fail('Quotes','montant zéro cohérent','HTTP '+zero.status,'P2');if(zero.body?.quote?.id)await api('/quotes/'+zero.body.quote.id,u.token,{method:'DELETE'});
  const huge=await create({amount:1e20});huge.status===400?pass('Quotes','montant extrêmement grand refusé','400'):fail('Quotes','montant extrêmement grand refusé','HTTP '+huge.status,'P2');if(huge.body?.quote?.id)await api('/quotes/'+huge.body.quote.id,u.token,{method:'DELETE'});
  const comma=await create({amount:'12,34'});comma.status===400?pass('Quotes','montant avec virgule refusé','400'):fail('Quotes','montant avec virgule refusé','HTTP '+comma.status,'P2');if(comma.body?.quote?.id)await api('/quotes/'+comma.body.quote.id,u.token,{method:'DELETE'});
  const future=new Date(Date.now()+7*86400000).toISOString().slice(0,10);const fr=await create({sent_at:future});fr.status===400?pass('Quotes','date future refusée','400'):fail('Quotes','date future refusée','HTTP '+fr.status,'P2');if(fr.body?.quote?.id)await api('/quotes/'+fr.body.quote.id,u.token,{method:'DELETE'});
  const impossible=await create({sent_at:'2026-02-31'});impossible.status===400?pass('Quotes','date calendrier invalide refusée','400'):fail('Quotes','date calendrier invalide refusée','HTTP '+impossible.status,'P2');if(impossible.body?.quote?.id)await api('/quotes/'+impossible.body.quote.id,u.token,{method:'DELETE'});
  const ancient=await create({sent_at:'2000-01-01'});ancient.status===201?pass('Quotes','date très ancienne','acceptée'):fail('Quotes','date très ancienne','HTTP '+ancient.status,'P2');if(ancient.body?.quote?.id)await api('/quotes/'+ancient.body.quote.id,u.token,{method:'DELETE'});
  const long=await create({title:'L'.repeat(500)});long.status===201&&long.body.quote.title.length===180?pass('Quotes','titre long borné','180 chars'):fail('Quotes','titre long borné','HTTP '+long.status,'P2');if(long.body?.quote?.id)await api('/quotes/'+long.body.quote.id,u.token,{method:'DELETE'});
  const inj=await create({client_name:"<script>alert(1)</script>",title:"' OR 1=1 -- <b>QA</b>"});
  if(inj.status===201){const listed=await api('/quotes',u.token);const q=listed.body.quotes.find(x=>x.id===inj.body.quote.id);q&&q.client_name.includes('<script>')&&listed.status===200?pass('Security','HTML/SQL stockés comme texte sans casser API','API stable'):fail('Security','HTML/SQL stockés comme texte sans casser API','donnée altérée/erreur','P1');await api('/quotes/'+inj.body.quote.id,u.token,{method:'DELETE'})}else fail('Security','HTML/SQL stockés comme texte sans casser API','HTTP '+inj.status,'P2');
  const dblTitle='DOUBLE-'+stamp;const dbl=await Promise.all([create({title:dblTitle}),create({title:dblTitle})]);const rows=(await db.from('quotes').select('id').eq('user_id',u.id).eq('title',dblTitle)).data||[];
  rows.length===1?pass('Concurrency','double création devis sans duplication','count=1'):fail('Concurrency','double création devis sans duplication','count='+rows.length,'P1');for(const row of rows)await api('/quotes/'+row.id,u.token,{method:'DELETE'});
  const q=await create({title:'Patch QA'});if(q.status===201){
    const pf=await api('/quotes/'+q.body.quote.id,u.token,{method:'PATCH',body:JSON.stringify({sent_at:future})});pf.status===400?pass('Quotes','PATCH date future refusée'):fail('Quotes','PATCH date future refusée','HTTP '+pf.status,'P2');
    const pi=await api('/quotes/'+q.body.quote.id,u.token,{method:'PATCH',body:JSON.stringify({sent_at:'2026-02-31'})});pi.status===400?pass('Quotes','PATCH date invalide refusée'):fail('Quotes','PATCH date invalide refusée','HTTP '+pi.status,'P2');
    const saves=await Promise.all([api('/quotes/'+q.body.quote.id,u.token,{method:'PATCH',body:JSON.stringify({amount:10})}),api('/quotes/'+q.body.quote.id,u.token,{method:'PATCH',body:JSON.stringify({amount:20})})]);saves.every(x=>x.status===200)?pass('Concurrency','modification simultanée sans 500',saves.map(x=>x.status).join(',')):fail('Concurrency','modification simultanée sans 500',saves.map(x=>x.status).join(','),'P2');
    const d1=await api('/quotes/'+q.body.quote.id,u.token,{method:'DELETE'});const d2=await api('/quotes/'+q.body.quote.id,u.token,{method:'DELETE'});d1.status===200&&d2.status===404?pass('Quotes','double suppression idempotence visible','200 puis 404'):fail('Quotes','double suppression idempotence visible',d1.status+','+d2.status,'P2')
  }
  await delUser(u)
}

async function isolationTests(){
  const A=await makeUser('isoA'),B=await makeUser('isoB');await api('/profile',A.token);await api('/profile',B.token);
  const day=new Date(Date.now()-86400000).toISOString().slice(0,10),body={client_name:'B',client_email:alias('iso-client'),title:'B private',amount:10,sent_at:day};
  const qb=await api('/quotes',B.token,{method:'POST',body:JSON.stringify(body)});if(qb.status!==201){fail('Isolation','setup devis B','HTTP '+qb.status,'P0');return}
  const id=qb.body.quote.id;const list=await api('/quotes',A.token);const patch=await api('/quotes/'+id,A.token,{method:'PATCH',body:JSON.stringify({title:'STEAL'})});const del=await api('/quotes/'+id,A.token,{method:'DELETE'});const prev=await api('/quotes/'+id+'/followup-preview',A.token);const send=await api('/quotes/'+id+'/send-followup',A.token,{method:'POST',body:'{}'});
  !list.body.quotes?.some(x=>x.id===id)?pass('Isolation','A ne lit pas B'):fail('Isolation','A ne lit pas B','fuite liste','P0');
  for(const [n,r] of [['PATCH UUID B',patch],['DELETE UUID B',del],['preview UUID B',prev],['send UUID B',send]])r.status===404?pass('Isolation',n,'404'):fail('Isolation',n,'HTTP '+r.status,'P0');
  const ca=createClient(process.env.SUPABASE_URL,anon,{global:{headers:{Authorization:'Bearer '+A.token}},auth:{persistSession:false}});
  const direct=await ca.from('quotes').select('*').eq('id',id);!direct.error&&(direct.data||[]).length===0?pass('Isolation','RLS lecture directe B'):fail('Isolation','RLS lecture directe B',direct.error?.message||'rows visible','P0');
  const upd=await ca.from('quotes').update({title:'RLS-STEAL'}).eq('id',id).select('id');const intact=(await db.from('quotes').select('title').eq('id',id).single()).data;
  (upd.error||(upd.data||[]).length===0)&&intact.title==='B private'?pass('Isolation','RLS écriture directe B'):fail('Isolation','RLS écriture directe B','modification effective','P0');
  const admin=await api('/admin/ceo',A.token);admin.status===403?pass('Security','endpoint admin sans droits','403'):fail('Security','endpoint admin sans droits','HTTP '+admin.status,'P0');
  await delUser(A);await delUser(B)
}

async function followupBrevoTests(){
  if(!RECIPIENT){nt('Brevo','emails réels','QA_EMAIL_RECIPIENT absent');return}
  const u=await makeUser('follow');await api('/profile',u.token);await setProfile(u.id,{plan:'pro',subscription_status:'active',company_name:'Relanzio QA',email_mode:'automatic',onboarding_completed:true});
  const day=new Date(Date.now()-10*86400000).toISOString().slice(0,10);const mk=async(title,email=alias('brevo'))=>api('/quotes',u.token,{method:'POST',body:JSON.stringify({client_name:'Client',client_email:email,title,amount:10,sent_at:day})});
  const q=await mk('Follow concurrency '+stamp);const rr=await Promise.all([api('/quotes/'+q.body.quote.id+'/send-followup',u.token,{method:'POST',body:'{}'}),api('/quotes/'+q.body.quote.id+'/send-followup',u.token,{method:'POST',body:'{}'})]);const sent=rr.filter(x=>x.status===200).length,fu=(await db.from('followups').select('*').eq('quote_id',q.body.quote.id)).data||[];
  sent===1&&fu.filter(x=>['sent','delivered','opened','clicked'].includes(x.status)).length===1?pass('Followups','double clic concurrent sans double email','sent=1'):fail('Followups','double clic concurrent sans double email','HTTP '+rr.map(x=>x.status).join(',')+' rows='+fu.length,'P0');
  rr.some(x=>x.status===409)?pass('Followups','message concurrence explicite','409 conflict'):fail('Followups','message concurrence explicite','HTTP '+rr.map(x=>x.status).join(','),'P2');
  const messageId=fu.find(x=>x.provider_message_id)?.provider_message_id;
  if(messageId){const delivered=await waitRow('followups',fu[0].id,x=>['delivered','opened','clicked'].includes(x.status),90000);delivered&&['delivered','opened','clicked'].includes(delivered.status)?pass('Brevo','email réel delivered',delivered.status):fail('Brevo','email réel delivered',delivered?.status||'timeout','P1')}
  const qr=await mk('Replay guard '+stamp,alias('replay'));const first=await api('/quotes/'+qr.body.quote.id+'/send-followup',u.token,{method:'POST',body:'{}'});const replayEmail=alias('replay');await db.from('suppressions').upsert({email:replayEmail,reason:'qa_replay_guard'});resources.suppressions.push(replayEmail);const second=await api('/quotes/'+qr.body.quote.id+'/send-followup',u.token,{method:'POST',body:'{}'});const replayRows=(await db.from('followups').select('step,status').eq('quote_id',qr.body.quote.id).order('step')).data||[];
  first.status===200&&replayRows.length===1?pass('Followups','replay requête ne déclenche pas étape suivante','1 ligne'):fail('Followups','replay requête ne déclenche pas étape suivante','second HTTP '+second.status+' rows='+JSON.stringify(replayRows),'P0');
  const suppressed=alias('suppressed');await db.from('suppressions').upsert({email:suppressed,reason:'qa_opt_out'});resources.suppressions.push(suppressed);const qs=await mk('Suppressed '+stamp,suppressed);const ss=await api('/quotes/'+qs.body.quote.id+'/send-followup',u.token,{method:'POST',body:'{}'});const sr=(await db.from('followups').select('status').eq('quote_id',qs.body.quote.id)).data||[];!sr.some(x=>['sent','delivered','opened','clicked'].includes(x.status))?pass('Brevo','aucun envoi à destinataire supprimé','aucun sent'):fail('Brevo','aucun envoi à destinataire supprimé','sent présent','P0');
  ss.status<500?pass('Brevo','erreur suppression compréhensible','HTTP '+ss.status):fail('Brevo','erreur suppression compréhensible','HTTP '+ss.status,'P2');
  const synth='qa-'+stamp+'@message.invalid';const qsyn=await mk('Synthetic webhook '+stamp,alias('syn'));const {data:sf}=await db.from('followups').insert({quote_id:qsyn.body.quote.id,user_id:u.id,step:1,subject:'QA',body:'QA',status:'bounced',provider_message_id:synth}).select('*').single();
  const late=await signedBrevo({event:'delivered',email:alias('syn'),'message-id':synth});const aft=(await db.from('followups').select('status').eq('id',sf.id).single()).data;
  late.status===200&&aft.status==='bounced'?pass('Brevo','webhook hors ordre ne ressuscite pas bounce','bounced terminal'):fail('Brevo','webhook hors ordre ne ressuscite pas bounce','status='+aft?.status,'P0');
  const b1=await signedBrevo({event:'hardBounce',email:alias('syn'),'message-id':synth});const b2=await signedBrevo({event:'hardBounce',email:alias('syn'),'message-id':synth});b1.status===200&&b2.status===200&&(await db.from('followups').select('status').eq('id',sf.id).single()).data.status==='bounced'?pass('Brevo','double webhook bounce idempotent'):fail('Brevo','double webhook bounce idempotent',b1.status+','+b2.status,'P1');
  const nosec=await rawPost('/api/brevo/webhook',JSON.stringify({event:'delivered'}));const badsec=await rawPost('/api/brevo/webhook',JSON.stringify({event:'delivered'}),{'x-webhook-secret':'wrong'});
  nosec.status===401&&badsec.status===401?pass('Security','Brevo webhook secret requis','401/401'):fail('Security','Brevo webhook secret requis',nosec.status+'/'+badsec.status,'P0');
  const malformed=await fetch(APP+'/api/brevo/webhook',{method:'POST',headers:{'content-type':'application/json','x-webhook-secret':process.env.BREVO_WEBHOOK_SECRET},body:'{bad-json'});malformed.status===400?pass('Brevo','webhook JSON malformé','400'):fail('Brevo','webhook JSON malformé','HTTP '+malformed.status,'P2');
  const child=spawnSync(process.execPath,['--input-type=module','-e',"import('./server/email.js').then(async m=>{try{await m.sendEmail({to:'qa-provider-fail@example.com',subject:'QA',text:'QA'});console.log('UNEXPECTED_OK')}catch(e){console.log(e.message)}})"],{cwd:'/app',env:{...process.env,BREVO_API_KEY:'invalid-qa-key'},encoding:'utf8',timeout:30000});child.status===0&&!child.stdout.includes('UNEXPECTED_OK')?pass('Brevo','échec fournisseur ne devient pas succès','exception fournisseur'):fail('Brevo','échec fournisseur ne devient pas succès','child status='+child.status,'P0');
  await delUser(u)
}

async function stripeTests(){
  const u=await makeUser('stripeclick');await api('/profile',u.token);const t0=Math.floor(Date.now()/1000);const dbl=await Promise.all([api('/billing/checkout',u.token,{method:'POST',body:'{}'}),api('/billing/checkout',u.token,{method:'POST',body:'{}'})]);const p=(await db.from('profiles').select('*').eq('id',u.id).single()).data;const sessions=await stripe.checkout.sessions.list({customer:p.stripe_customer_id,limit:10});const opens=sessions.data.filter(x=>x.mode==='subscription'&&x.status==='open'&&x.created>=t0-2);
  opens.length<=1?pass('Stripe','double clic checkout sans double session','open='+opens.length):fail('Stripe','double clic checkout sans double session','open='+opens.length,'P1');
  p.plan==='free'&&p.subscription_status==='none'?pass('Stripe','checkout abandonné conserve Free','free/none'):fail('Stripe','checkout abandonné conserve Free',p.plan+'/'+p.subscription_status,'P0');
  for(const s of opens)try{await stripe.checkout.sessions.expire(s.id)}catch{}
  if(p.stripe_customer_id){resources.customers.push(p.stripe_customer_id)}
  await delUser(u);
  const S=await makeUser('stripecycle');await api('/profile',S.token);const clock=await stripe.testHelpers.testClocks.create({frozen_time:Math.floor(Date.now()/1000),name:'Rz destructive '+stamp});resources.clocks.push(clock.id);
  const customer=await stripe.customers.create({email:S.email,test_clock:clock.id,metadata:{user_id:S.id,qa:'destructive'}});resources.customers.push(customer.id);await setProfile(S.id,{stripe_customer_id:customer.id,plan:'free',subscription_status:'none'});
  const pm=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:pm.id}});
  let sub=await stripe.subscriptions.create({customer:customer.id,items:[{price:process.env.STRIPE_PRO_PRICE_ID}],default_payment_method:pm.id,metadata:{user_id:S.id}});
  let active=await waitProfile(S.id,x=>x.subscription_status==='active'&&x.plan==='pro',60000);active?pass('Stripe','abonnement actif synchronisé DB','active'):fail('Stripe','abonnement actif synchronisé DB',active?.subscription_status,'P0');
  let end=sub.items.data[0]?.current_period_end;let c=await advanceClock(clock.id,end+120);c=await advanceClock(clock.id,c.frozen_time+3700);await sleep(5000);const inv1=await stripe.invoices.list({customer:customer.id,limit:10});inv1.data.some(x=>x.billing_reason==='subscription_cycle'&&x.status==='paid')?pass('Stripe','renouvellement payé'):fail('Stripe','renouvellement payé','aucune invoice paid','P1');
  const bad=await stripe.paymentMethods.attach('pm_card_chargeCustomerFail',{customer:customer.id});await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:bad.id}});await stripe.subscriptions.update(sub.id,{default_payment_method:bad.id});sub=await stripe.subscriptions.retrieve(sub.id);end=sub.items.data[0]?.current_period_end;c=await advanceClock(clock.id,end+120);c=await advanceClock(clock.id,c.frozen_time+3700);await sleep(5000);const pd=await waitProfile(S.id,x=>x.subscription_status==='past_due',30000);pd?pass('Stripe','payment_failed -> past_due','past_due'):fail('Stripe','payment_failed -> past_due',pd?.subscription_status,'P0');
  const old={id:'evt_qa_old_'+stamp,object:'event',api_version:'2025-08-27.basil',created:1,type:'invoice.paid',data:{object:{id:'in_qa_old_'+stamp,object:'invoice',customer:customer.id,subscription:sub.id,status:'paid'}}};resources.ledger.push(old.id);const oldR=await signedStripe(old);const stateOld=(await db.from('profiles').select('plan,subscription_status').eq('id',S.id).single()).data;
  oldR.status===200&&stateOld.subscription_status==='past_due'?pass('Stripe','webhook ancien hors ordre ignoré','reste past_due'):fail('Stripe','webhook ancien hors ordre ignoré',stateOld.plan+'/'+stateOld.subscription_status,'P0');
  const good=await stripe.paymentMethods.attach('pm_card_visa',{customer:customer.id});await stripe.customers.update(customer.id,{invoice_settings:{default_payment_method:good.id}});await stripe.subscriptions.update(sub.id,{default_payment_method:good.id});const open=(await stripe.invoices.list({customer:customer.id,limit:10})).data.find(x=>x.status==='open'&&x.attempted);if(open)await stripe.invoices.pay(open.id,{payment_method:good.id});const recovered=await waitProfile(S.id,x=>x.subscription_status==='active'&&x.plan==='pro',30000);recovered?pass('Stripe','récupération paiement -> active'):fail('Stripe','récupération paiement -> active',recovered?.subscription_status,'P0');
  const portal=await api('/billing/portal',S.token,{method:'POST',body:'{}'});portal.status===200&&String(portal.body?.url||'').startsWith('https://billing.stripe.com/')?pass('Stripe','portail client'):fail('Stripe','portail client','HTTP '+portal.status,'P1');
  const evs=await stripe.events.list({type:'invoice.paid',limit:30});const ev=evs.data.find(x=>x.data?.object?.customer===customer.id);if(ev){const before=(await db.from('profiles').select('plan,subscription_status,stripe_subscription_id').eq('id',S.id).single()).data;const r1=await signedStripe(ev),r2=await signedStripe(ev);const after=(await db.from('profiles').select('plan,subscription_status,stripe_subscription_id').eq('id',S.id).single()).data;JSON.stringify(before)===JSON.stringify(after)&&r1.status===200&&r2.status===200?pass('Stripe','webhook dupliqué sans double effet'):fail('Stripe','webhook dupliqué sans double effet','state changed','P0')}else nt('Stripe','webhook dupliqué','event invoice.paid non trouvé');
  const invalid=await rawPost('/api/stripe/webhook','{}',{'stripe-signature':'invalid'});invalid.status===400?pass('Security','Stripe signature invalide','400'):fail('Security','Stripe signature invalide','HTTP '+invalid.status,'P0');
  try{await stripe.subscriptions.cancel(sub.id)}catch{}const canceled=await waitProfile(S.id,x=>x.subscription_status==='canceled'&&x.plan==='free',30000);canceled?pass('Stripe','annulation -> Free/canceled'):fail('Stripe','annulation -> Free/canceled',canceled?.plan+'/'+canceled?.subscription_status,'P0');
  await delUser(S);nt('Stripe','session Checkout déjà payée UI','Stripe Checkout hébergé ne permet pas ce scénario automatisé sans interaction navigateur')
}

async function openAiTests(){
  const cases=[
    ['réponse normale','Merci, je suis intéressé par une démo.'],
    ['réponse vide',''],
    ['réponse très longue / anglais',('Not now, budget is tight. '.repeat(300))],
    ['ambiguë + objections multiples',"Ça m'intéresse peut-être, mais c'est trop cher et pas maintenant. Ironique, non ? <>&"]
  ];
  for(const [name,input] of cases){try{const a=await analyzeReply(input);validAnalysis(a)?pass('OpenAI',name,a.category+'/'+a.sentiment):fail('OpenAI',name,'sortie invalide','P2')}catch(e){fail('OpenAI',name,'exception','P1')}}
  const fb=classifyReplyFallback('STOP, merci de ne plus me contacter.');fb.category==='opt_out'&&!fb.needs_human?pass('OpenAI','fallback déterministe opt-out'):fail('OpenAI','fallback déterministe opt-out',fb.category,'P1');
  const child=spawnSync(process.execPath,['--input-type=module','-e',"import('./server/prospecting.js').then(async m=>console.log(JSON.stringify(await m.analyzeReply('STOP, merci de ne plus me contacter.'))))"],{cwd:'/app',env:{...process.env,OPENAI_API_KEY:'sk-invalid-qa'},encoding:'utf8',timeout:30000});let obj;try{obj=JSON.parse((child.stdout||'').trim().split('\n').pop())}catch{}child.status===0&&obj?.category==='opt_out'?pass('OpenAI','panne API simulée -> fallback'):fail('OpenAI','panne API simulée -> fallback','child='+child.status,'P1');
  nt('OpenAI','timeout fournisseur forcé','pas de proxy/fault injection disponible sans changer infrastructure');
  nt('OpenAI','structured output JSON invalide forcé','API réelle ne permet pas d’injecter une réponse fournisseur corrompue');
}

async function protocolSecurity(){
  const malformed=await fetch(APP+'/api/events',{method:'POST',headers:{'content-type':'application/json'},body:'{broken'});malformed.status===400?pass('Security','JSON malformé -> 400'):fail('Security','JSON malformé -> 400','HTTP '+malformed.status,'P2');
  const huge=await fetch(APP+'/api/events',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({event:'landing_view',anonymous_id:'abcdefgh',path:'/'+('x'.repeat(300000))})});huge.status===413?pass('Security','payload >256KB -> 413'):fail('Security','payload >256KB -> 413','HTTP '+huge.status,'P2');
}

async function databaseChecks(){
  const r=await db.rpc ? null : null;
  const sqlChecks=await Promise.all([
    db.from('profiles').select('id'),
    db.from('quotes').select('id,user_id,status,amount'),
    db.from('followups').select('id,quote_id,user_id,step,status'),
    db.from('suppressions').select('email'),
    db.from('stripe_webhook_events').select('event_id,event_type,processed_at')
  ]);
  sqlChecks.every(x=>!x.error)?pass('Database','tables critiques lisibles'):fail('Database','tables critiques lisibles','erreur requête','P0');
  const orphans=await Promise.all([
    db.from('quotes').select('id,user_id'),
    db.from('profiles').select('id'),
    db.from('followups').select('id,quote_id,user_id'),
  ]);const qs=orphans[0].data||[],ps=new Set((orphans[1].data||[]).map(x=>x.id)),fs=orphans[2].data||[],qids=new Set(qs.map(x=>x.id));const oq=qs.filter(x=>!ps.has(x.user_id)).length,ofu=fs.filter(x=>!ps.has(x.user_id)).length,ofq=fs.filter(x=>!qids.has(x.quote_id)).length;
  oq===0&&ofu===0&&ofq===0?pass('Database','aucun orphelin','0/0/0'):fail('Database','aucun orphelin',oq+'/'+ofu+'/'+ofq,'P0');
  const impossible=qs.filter(x=>Number(x.amount)<0||!['open','won','lost','paused'].includes(x.status));impossible.length===0?pass('Database','aucun état devis impossible'):fail('Database','aucun état devis impossible','count='+impossible.length,'P0');
  const pending=(sqlChecks[4].data||[]).filter(x=>!x.processed_at);pending.length===0?pass('Database','ledger Stripe traité','pending=0'):fail('Database','ledger Stripe traité','pending='+pending.length,'P1')
}

async function cleanup(){
  for(const e of resources.suppressions)try{await db.from('suppressions').delete().eq('email',e)}catch{}
  for(const e of resources.ledger)try{await db.from('stripe_webhook_events').delete().eq('event_id',e)}catch{}
  for(const id of resources.users)try{await db.auth.admin.deleteUser(id,false)}catch{}
  for(const id of resources.clocks)try{await stripe.testHelpers.testClocks.del(id)}catch{}
  for(const id of resources.customers)try{await stripe.customers.del(id)}catch{}
}

async function main(){
  if(APP!=='https://relanzio.com')fail('Domain','APP_URL domaine final','APP_URL non officiel','P1');else pass('Domain','APP_URL domaine final','relanzio.com');
  try{await authTests()}catch(e){fail('Auth','runner auth','exception '+e.message,'P1')}
  try{await profileRaceAndOnboarding()}catch(e){fail('Onboarding','runner onboarding','exception '+e.message,'P1')}
  try{await quoteTests()}catch(e){fail('Quotes','runner devis','exception '+e.message,'P1')}
  try{await isolationTests()}catch(e){fail('Isolation','runner isolation','exception '+e.message,'P0')}
  try{await followupBrevoTests()}catch(e){fail('Brevo','runner relances/Brevo','exception '+e.message,'P0')}
  try{await stripeTests()}catch(e){fail('Stripe','runner Stripe','exception '+e.message,'P0')}
  try{await openAiTests()}catch(e){fail('OpenAI','runner OpenAI','exception '+e.message,'P1')}
  try{await protocolSecurity()}catch(e){fail('Security','runner protocole','exception '+e.message,'P1')}
  try{await databaseChecks()}catch(e){fail('Database','runner cohérence','exception '+e.message,'P0')}
  nt('Navigation','refresh/back/forward/multi-onglets UI','aucun navigateur distant automatisable connecté à ce runtime');
  nt('Mobile','viewports 320/375/390/412/tablette','aucun navigateur distant automatisable connecté à ce runtime');
  nt('Domain','certificat navigateur et alertes UI','pas de navigateur TLS automatisable depuis le runtime; domaine Railway custom est configuré');
  await cleanup();
  const summary={total:tests.length,pass:tests.filter(x=>x.result==='PASS').length,fail:tests.filter(x=>x.result==='FAIL').length,non_testable:tests.filter(x=>x.result==='NON_TESTABLE').length,p0:tests.filter(x=>x.result==='FAIL'&&x.severity==='P0').length,p1:tests.filter(x=>x.result==='FAIL'&&x.severity==='P1').length,p2:tests.filter(x=>x.result==='FAIL'&&x.severity==='P2').length};
  await db.from('system_events').insert({level:summary.fail?'error':'info',scope:'qa.destructive.2026-10-04.v1',message:summary.fail?'Destructive QA found failures':'Destructive QA passed',metadata:{run_id:runId,summary,tests}});
  console.log('DESTRUCTIVE_QA_SUMMARY='+JSON.stringify(summary));
  for(const x of tests.filter(x=>x.result==='FAIL'))console.error('QA_FAIL '+JSON.stringify(x));
  process.exit(summary.fail?1:0)
}
main().catch(async e=>{console.error('QA_RUNNER_FATAL '+String(e?.message||e));try{await cleanup()}catch{}process.exit(1)});
