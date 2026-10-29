import { randomBytes } from 'node:crypto';
import { lockedQuoteIds } from '../shared/quota.js';

const stamp=Date.now(),results=[];
let userA,userB,server,local,app,db,createClient;
const publicApp=(process.env.APP_URL||'https://relanzio.com').replace(/\/$/,'');
const supabaseUrl=String(process.env.SUPABASE_URL||'').replace(/\/$/,'');
const serviceKey=String(process.env.SUPABASE_SERVICE_ROLE_KEY||'');

async function rawQaEvent(level,message,metadata={}){
  if(!supabaseUrl||!serviceKey)return false;
  try{
    const r=await fetch(supabaseUrl+'/rest/v1/system_events',{
      method:'POST',
      headers:{apikey:serviceKey,authorization:'Bearer '+serviceKey,'content-type':'application/json',prefer:'return=minimal'},
      body:JSON.stringify({level,scope:'certification_predeploy',message,metadata:{stamp,...metadata}})
    });
    return r.ok;
  }catch{return false}
}
async function qaEvent(level,message,metadata={}){
  if(db){try{await db.from('system_events').insert({level,scope:'certification_predeploy',message,metadata:{stamp,...metadata}});return true}catch{}}
  return rawQaEvent(level,message,metadata);
}

await rawQaEvent('info','AUTH_DOMAIN_QA_NATIVE_START',{
  app_url:publicApp,node_env_before:process.env.NODE_ENV||null,has_url:Boolean(supabaseUrl),has_service_key:Boolean(serviceKey),
  flags:{
    billing:process.env.BILLING_ENABLED==='true',
    vite_billing:process.env.VITE_BILLING_ENABLED==='true',
    followup_automation:process.env.FOLLOWUP_AUTOMATION_ENABLED==='true',
    lifecycle_emails:process.env.LIFECYCLE_EMAILS_ENABLED==='true',
    acquisition:process.env.ACQUISITION_ENABLED==='true',
    pilot_runner:process.env.PILOT_ADMIN_RUNNER_ENABLED==='true',
    pilot_send:process.env.PILOT_ADMIN_RUNNER_SEND==='true',
    legal_pages_approved:process.env.LEGAL_PAGES_APPROVED==='true',
    legal_identity_complete:Boolean(
      ['individual','company'].includes(process.env.VITE_LEGAL_ENTITY_TYPE||'') &&
      process.env.VITE_LEGAL_NAME && process.env.VITE_LEGAL_ADDRESS && process.env.VITE_LEGAL_REGISTRATION &&
      process.env.VITE_LEGAL_PHONE && process.env.VITE_PUBLICATION_DIRECTOR &&
      (process.env.VITE_LEGAL_ENTITY_TYPE!=='company'||(process.env.VITE_LEGAL_FORM&&process.env.VITE_LEGAL_CAPITAL))
    )
  }
});
process.env.NODE_ENV='test';
try{
  ({createClient}=await import('@supabase/supabase-js'));
  db=createClient(supabaseUrl,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  await qaEvent('info','AUTH_DOMAIN_QA_CLIENT_OK');
  ({default:app}=await import('./index.js'));
  await qaEvent('info','AUTH_DOMAIN_QA_IMPORT_OK');
  server=app.listen(0,'127.0.0.1');
  await new Promise((resolve,reject)=>{server.once('listening',resolve);server.once('error',reject)});
  local='http://127.0.0.1:'+server.address().port;
  await qaEvent('info','AUTH_DOMAIN_QA_SERVER_OK');
}catch(error){
  await qaEvent('error','AUTH_DOMAIN_QA_BOOT_FAIL',{error:String(error?.message||error).slice(0,240)});
  throw error;
}

function pass(name,detail){results.push({name,ok:true,detail:detail||null})}
function assert(condition,name,detail){if(!condition)throw new Error(name+(detail?' '+detail:''));pass(name,detail)}
function safeLocation(value){try{const u=new URL(value);return{origin:u.origin,path:u.pathname}}catch{return{origin:'',path:''}}}
async function api(token,path,{method='GET',body,headers={}}={}){
  const r=await fetch(local+path,{method,headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{}),...headers},body:body===undefined?undefined:(typeof body==='string'?body:JSON.stringify(body)),redirect:'manual'});
  const raw=await r.text();let data;try{data=raw?JSON.parse(raw):{}}catch{data=raw}
  return{status:r.status,data,headers:r.headers};
}
async function timedRequest(token,path,options={}){
  const start=performance.now(),result=await api(token,path,options);
  return {...result,ms:Math.round((performance.now()-start)*10)/10};
}
async function localHealthLoad(total,ip){
  const times=[],statuses=await Promise.all(Array.from({length:total},async()=>{
    const start=performance.now();
    const r=await fetch(local+'/api/health',{headers:{'x-forwarded-for':ip}});
    times.push(performance.now()-start);
    return r.status;
  }));
  times.sort((a,b)=>a-b);
  const p95=Math.round((times[Math.min(times.length-1,Math.floor(times.length*.95))]||0)*10)/10;
  return{total,p95,errors:statuses.filter(x=>x!==200).length};
}
async function makeUser(label){
  const email='relanzio-cert-'+label+'-'+stamp+'@example.com';
  const password='Qa!'+randomBytes(18).toString('base64url');
  const created=await db.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{certification:true}});
  if(created.error||!created.data.user)throw created.error||new Error('create user');
  const client=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
  const signed=await client.auth.signInWithPassword({email,password});
  if(signed.error||!signed.data.session)throw signed.error||new Error('sign in');
  return{id:created.data.user.id,email,password,client,token:signed.data.session.access_token};
}
async function cleanup(u){if(u?.id)try{await db.auth.admin.deleteUser(u.id,false)}catch{}}
async function cleanupStaleQaUsers(){
  const cutoff=new Date(Date.now()-60*60*1000).toISOString();
  const {data,error}=await db.from('profiles').select('id,email,created_at').like('email','relanzio-cert-%@example.com').lt('created_at',cutoff).limit(200);
  if(error)throw error;
  let removed=0;
  for(const row of data||[]){
    const result=await db.auth.admin.deleteUser(row.id,false);
    if(!result.error)removed++;
  }
  pass('stale_qa_users_cleaned','removed='+removed);
}
async function checkRedirects(){
  const email='relanzio-cert-link-'+stamp+'@example.com',password='Qa!'+randomBytes(16).toString('base64url'),newPassword='Qa!'+randomBytes(18).toString('base64url');
  let id;
  try{
    const signup=await db.auth.admin.generateLink({type:'signup',email,password,options:{redirectTo:publicApp+'/'}});
    if(signup.error)throw signup.error;id=signup.data?.user?.id;
    const redirect=new URL(signup.data.properties.action_link).searchParams.get('redirect_to')||'';
    const loc=safeLocation(redirect);
    assert(loc.origin===publicApp&&loc.path==='/', 'auth_signup_redirect_final_domain');
    const signupClient=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
    const confirmed=await signupClient.auth.verifyOtp({token_hash:signup.data.properties.hashed_token,type:'signup'});
    assert(!confirmed.error&&Boolean(confirmed.data.session),'auth_confirmation_link_works');

    const loginAfterConfirm=await signupClient.auth.signInWithPassword({email,password});
    assert(!loginAfterConfirm.error&&Boolean(loginAfterConfirm.data.session),'auth_login_after_confirmation');

    const recovery=await db.auth.admin.generateLink({type:'recovery',email,options:{redirectTo:publicApp+'/reset-password'}});
    if(recovery.error)throw recovery.error;
    const rloc=safeLocation(new URL(recovery.data.properties.action_link).searchParams.get('redirect_to')||'');
    assert(rloc.origin===publicApp&&rloc.path==='/reset-password','auth_recovery_redirect_final_domain');
    const recoveryClient=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
    const recovered=await recoveryClient.auth.verifyOtp({token_hash:recovery.data.properties.hashed_token,type:'recovery'});
    assert(!recovered.error&&Boolean(recovered.data.session),'auth_recovery_link_works');
    const changed=await recoveryClient.auth.updateUser({password:newPassword});
    assert(!changed.error,'auth_password_reset_updates_password');
    await recoveryClient.auth.signOut();

    const oldLogin=await recoveryClient.auth.signInWithPassword({email,password});
    assert(Boolean(oldLogin.error),'auth_old_password_rejected_after_reset');
    const newLogin=await recoveryClient.auth.signInWithPassword({email,password:newPassword});
    assert(!newLogin.error&&Boolean(newLogin.data.session),'auth_new_password_accepted_after_reset');

    const reused=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
    const reuseResult=await reused.auth.verifyOtp({token_hash:recovery.data.properties.hashed_token,type:'recovery'});
    assert(Boolean(reuseResult.error),'auth_recovery_link_single_use');
    const invalidResult=await reused.auth.verifyOtp({token_hash:'0'.repeat(64),type:'recovery'});
    assert(Boolean(invalidResult.error),'auth_invalid_or_expired_recovery_rejected');
  }finally{if(id)try{await db.auth.admin.deleteUser(id,false)}catch{}}
}

try{
  assert(publicApp==='https://relanzio.com','app_url_final');
  await cleanupStaleQaUsers();
  await checkRedirects();

  userA=await makeUser('a');userB=await makeUser('b');
  pass('auth_two_confirmed_users');
  const bad=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
  const wrong=await bad.auth.signInWithPassword({email:userA.email,password:'Wrong-Password!123'});
  assert(Boolean(wrong.error),'auth_wrong_password_rejected');

  for(const u of [userA,userB]){
    const p=await api(u.token,'/api/profile',{method:'PATCH',body:{company_name:'Certification Relanzio',role:'QA',onboarding_completed:true,marketing_opt_in:false,email_mode:'review'}});
    assert(p.status===200,'onboarding_'+(u===userA?'a':'b'),'HTTP '+p.status);
  }

  // Product rule: the 7-day Pro trial starts automatically with the account's first quote.
  // userA is the trial account; userB is prepared below as a Free account whose trial is already used.
  const beforeFirstQuote=await api(userA.token,'/api/profile');
  const fresh=beforeFirstQuote.data?.profile;
  assert(beforeFirstQuote.status===200&&!fresh?.trial_started_at&&fresh?.trial_active===false&&fresh?.pro_access===false&&fresh?.trial_eligible===true,'no_trial_before_first_quote',JSON.stringify({status:beforeFirstQuote.status,trial_started_at:fresh?.trial_started_at||null,pro_access:fresh?.pro_access}));

  const sentAt=new Date().toISOString().slice(0,10);
  const customAt=new Date(Date.now()+48*3600000).toISOString();
  const idem='cert-a-'+stamp;
  const quotePayload={client_name:"Élodie d’Azur",client_email:'elodie+qa@example.com',title:'Fenêtres — devis QA 🪟',amount:'0,01',sent_at:sentAt,followup_schedule_mode:'custom',next_followup_at:customAt};
  const created=await api(userA.token,'/api/quotes',{method:'POST',body:quotePayload,headers:{'Idempotency-Key':idem}});
  assert(created.status===201&&created.data.quote?.followup_schedule_mode==='custom','custom_followup_created','HTTP '+created.status);
  const q=created.data.quote;
  const trialProfile=created.data.profile||{};
  const trialStartedAt=trialProfile.trial_started_at,trialEndsAt=trialProfile.trial_ends_at;
  const t0=new Date(trialStartedAt||0).getTime(),t1=new Date(trialEndsAt||0).getTime();
  assert(Boolean(trialStartedAt)&&trialProfile.trial_active===true&&trialProfile.pro_access===true&&t1-t0===7*24*3600000,'first_quote_starts_trial_exact_7d',JSON.stringify({pro_access:trialProfile.pro_access,trial_started_at:trialStartedAt||null,trial_ends_at:trialEndsAt||null,span_ms:t1-t0}));
  const duplicate=await api(userA.token,'/api/quotes',{method:'POST',body:quotePayload,headers:{'Idempotency-Key':idem}});
  assert(duplicate.status===200&&duplicate.data.idempotent===true&&duplicate.data.quote?.id===q.id,'quote_idempotency');

  const unrelated=await api(userA.token,'/api/quotes/'+q.id,{method:'PATCH',body:{title:'Objet modifié sans toucher au planning'}});
  assert(unrelated.status===200&&unrelated.data.quote.next_followup_at===q.next_followup_at&&unrelated.data.quote.followup_schedule_mode==='custom','custom_date_survives_unrelated_edit');

  const paused=await api(userA.token,'/api/quotes/'+q.id,{method:'PATCH',body:{status:'paused'}});
  assert(paused.status===200&&paused.data.quote.next_followup_at===q.next_followup_at&&paused.data.quote.auto_send===false,'pause_preserves_date_and_stops_auto');
  const previewPaused=await api(userA.token,'/api/quotes/'+q.id+'/followup-preview');
  assert(previewPaused.status===409,'pause_blocks_followup_preview');
  const resumed=await api(userA.token,'/api/quotes/'+q.id,{method:'PATCH',body:{status:'open'}});
  assert(resumed.status===200&&resumed.data.quote.next_followup_at===q.next_followup_at,'resume_preserves_custom_date');
  const none=await api(userA.token,'/api/quotes/'+q.id,{method:'PATCH',body:{followup_schedule_mode:'none'}});
  assert(none.status===200&&none.data.quote.next_followup_at===null,'none_schedule_clears_next');
  const recommended=await api(userA.token,'/api/quotes/'+q.id,{method:'PATCH',body:{followup_schedule_mode:'recommended'}});
  assert(recommended.status===200&&Boolean(recommended.data.quote.next_followup_at),'resume_recommended_schedule');

  // Free quota account: a real post-trial state (trial used and expired, never subscribed), prepared before
  // its first quote so the automatic first-quote trial does not apply. Auto-trial stays enabled in production.
  const usedTrialEnd=new Date(Date.now()-24*3600000).toISOString();
  const {error:freeSeedError}=await db.from('profiles').update({plan:'free',subscription_status:'none',trial_started_at:new Date(Date.now()-8*24*3600000).toISOString(),trial_ends_at:usedTrialEnd,trial_expired_at:usedTrialEnd}).eq('id',userB.id);
  if(freeSeedError)throw freeSeedError;
  const freeProfile=await api(userB.token,'/api/profile');
  const fp=freeProfile.data?.profile;
  assert(freeProfile.status===200&&fp?.effective_plan==='free'&&fp?.pro_access===false&&fp?.trial_active===false&&fp?.trial_eligible===false,'free_qa_user_prepared',JSON.stringify({status:freeProfile.status,effective_plan:fp?.effective_plan,trial_eligible:fp?.trial_eligible}));

  const seeded=[];
  for(let i=0;i<4;i++){
    const r=await api(userB.token,'/api/quotes',{method:'POST',body:{client_name:'Client '+i,client_email:'client+'+i+'@example.com',title:'Quota '+i,amount:i===0?'0':'29',sent_at:sentAt,followup_schedule_mode:i%2?'none':'recommended'},headers:{'Idempotency-Key':'cert-b-'+stamp+'-'+i}});
    assert(r.status===201&&r.data.profile?.pro_access===false,'free_quota_seed_'+i,'HTTP '+r.status+' pro_access='+r.data.profile?.pro_access);seeded.push(r.data.quote);
  }
  const concurrent=await Promise.all([0,1].map(i=>api(userB.token,'/api/quotes',{method:'POST',body:{client_name:'Course '+i,client_email:'race-final+'+i+'@example.com',title:'Création concurrente '+i,amount:'29',sent_at:sentAt,followup_schedule_mode:'none'},headers:{'Idempotency-Key':'cert-race-final-'+stamp+'-'+i}})));
  const concurrentStatuses=concurrent.map(x=>x.status).sort();
  const {count:activeAfterRace,error:activeAfterRaceError}=await db.from('quotes').select('*',{count:'exact',head:true}).eq('user_id',userB.id).in('status',['open','paused']);
  if(activeAfterRaceError)throw activeAfterRaceError;
  assert(concurrentStatuses[0]===201&&concurrentStatuses[1]===403&&activeAfterRace===5,'atomic_free_quota_under_concurrent_create',JSON.stringify({statuses:concurrentStatuses,active:activeAfterRace}));

  const pauseB=await api(userB.token,'/api/quotes/'+seeded[0].id,{method:'PATCH',body:{status:'paused'}});
  assert(pauseB.status===200,'free_pause_seed');
  const sixth=await api(userB.token,'/api/quotes',{method:'POST',body:{client_name:'Sixième',client_email:'six@example.com',title:'Doit être bloqué',amount:'999',sent_at:sentAt,followup_schedule_mode:'recommended'},headers:{'Idempotency-Key':'cert-b-six-'+stamp}});
  assert(sixth.status===403,'free_limit_counts_paused','HTTP '+sixth.status);
  const won=await api(userB.token,'/api/quotes/'+seeded[0].id,{method:'PATCH',body:{status:'won'}});
  assert(won.status===200&&won.data.quote.next_followup_at===null,'won_stops_followup');
  const sixthOk=await api(userB.token,'/api/quotes',{method:'POST',body:{client_name:'Sixième autorisé',client_email:'six-ok@example.com',title:'Autorisé',amount:'999',sent_at:sentAt,followup_schedule_mode:'none'},headers:{'Idempotency-Key':'cert-b-six-ok-'+stamp}});
  assert(sixthOk.status===201,'free_limit_releases_after_close');

  // One trial per account: later quotes and the retired self-service endpoint never start a second one.
  const laterQuote=await api(userA.token,'/api/quotes',{method:'POST',body:{client_name:'Deuxième devis',client_email:'second@example.com',title:'Pendant l’essai',amount:'29',sent_at:sentAt,followup_schedule_mode:'none'},headers:{'Idempotency-Key':'cert-a-second-'+stamp}});
  assert(laterQuote.status===201&&laterQuote.data.profile?.trial_started_at===trialStartedAt&&laterQuote.data.profile?.trial_ends_at===trialEndsAt,'second_quote_keeps_same_trial');
  const trialAgain=await api(userA.token,'/api/trial/start',{method:'POST',body:{}});
  const profileRefresh=await api(userA.token,'/api/profile');
  const pr=profileRefresh.data?.profile;
  assert(trialAgain.status!==201&&pr?.trial_started_at===trialStartedAt&&pr?.trial_ends_at===trialEndsAt&&pr?.trial_eligible===false,'trial_one_time_only',JSON.stringify({trial_start_status:trialAgain.status}));
  assert(profileRefresh.status===200&&pr?.trial_active===true&&pr?.pro_access===true&&pr?.trial_days_remaining===7,'trial_survives_refresh');

  const oldSessionToken=userA.token;
  const signOut=await userA.client.auth.signOut();
  assert(!signOut.error,'client_logout');
  const emptySession=await userA.client.auth.getSession();
  assert(!emptySession.data.session,'client_session_cleared_after_logout');
  const signBack=await userA.client.auth.signInWithPassword({email:userA.email,password:userA.password});
  assert(!signBack.error&&Boolean(signBack.data.session),'client_login_after_logout');
  userA.token=signBack.data.session.access_token;
  const profileAfterLogin=await api(userA.token,'/api/profile');
  assert(profileAfterLogin.status===200&&profileAfterLogin.data.profile?.trial_active===true&&profileAfterLogin.data.profile?.trial_started_at===trialStartedAt,'trial_survives_logout_login');
  const quotesAfterLogin=await api(userA.token,'/api/quotes');
  const persistedQuote=quotesAfterLogin.data?.quotes?.find(x=>x.id===q.id);
  assert(quotesAfterLogin.status===200&&persistedQuote&&persistedQuote.followup_schedule_mode==='recommended'&&Boolean(persistedQuote.next_followup_at),'quote_persists_refresh_logout_login');

  const beforeTerminal=await api(userA.token,'/api/quotes');
  const expendable=(beforeTerminal.data?.quotes||[]).find(x=>x.id!==q.id&&x.status==='open');
  if(expendable){
    const freed=await api(userA.token,'/api/quotes/'+expendable.id,{method:'PATCH',body:{status:'won'}});
    assert(freed.status===200,'terminal_test_frees_one_active_slot');
  }
  const terminalSeed=await api(userA.token,'/api/quotes',{method:'POST',body:{client_name:'Statut terminal',client_email:'terminal@example.com',title:'Test perdu',amount:'29,50',sent_at:sentAt,followup_schedule_mode:'recommended'},headers:{'Idempotency-Key':'cert-terminal-'+stamp}});
  assert(terminalSeed.status===201,'terminal_seed_created','HTTP '+terminalSeed.status);
  const lost=await api(userA.token,'/api/quotes/'+terminalSeed.data.quote.id,{method:'PATCH',body:{status:'lost'}});
  assert(lost.status===200&&lost.data.quote.next_followup_at===null&&lost.data.quote.auto_send===false,'lost_stops_followup');
  const lostPreview=await api(userA.token,'/api/quotes/'+terminalSeed.data.quote.id+'/followup-preview');
  assert(lostPreview.status===409,'lost_blocks_followup_preview');
  const deletedTerminal=await api(userA.token,'/api/quotes/'+terminalSeed.data.quote.id,{method:'DELETE'});
  assert(deletedTerminal.status===200,'quote_delete');
  const afterDelete=await api(userA.token,'/api/quotes');
  assert(afterDelete.status===200&&!afterDelete.data.quotes.some(x=>x.id===terminalSeed.data.quote.id),'quote_delete_persists');

  const {count:activeBeforeProSeed,error:activeBeforeError}=await db.from('quotes').select('*',{count:'exact',head:true}).eq('user_id',userA.id).in('status',['open','paused']);
  if(activeBeforeError)throw activeBeforeError;
  const toSeed=Math.max(0,99-(activeBeforeProSeed||0));
  if(toSeed){
    const bulk=Array.from({length:toSeed},(_,i)=>({
      user_id:userA.id,client_name:'Pro QA '+i,client_email:'proqa+'+i+'@example.com',title:'Quota Pro '+i,amount:29,
      sent_at:sentAt,status:'open',auto_send:false,followup_step:0,followup_schedule_mode:'none',next_followup_at:null
    }));
    const {error:bulkError}=await db.from('quotes').insert(bulk);
    if(bulkError)throw bulkError;
  }
  const hundredth=await api(userA.token,'/api/quotes',{method:'POST',body:{client_name:'Centième',client_email:'pro100@example.com',title:'100e devis actif',amount:'29',sent_at:sentAt,followup_schedule_mode:'none'},headers:{'Idempotency-Key':'cert-pro-100-'+stamp}});
  assert(hundredth.status===201,'pro_quota_allows_100th','HTTP '+hundredth.status);
  const hundredFirst=await api(userA.token,'/api/quotes',{method:'POST',body:{client_name:'Cent unième',client_email:'pro101@example.com',title:'101e devis actif',amount:'29',sent_at:sentAt,followup_schedule_mode:'none'},headers:{'Idempotency-Key':'cert-pro-101-'+stamp}});
  assert(hundredFirst.status===403,'pro_quota_blocks_101st','HTTP '+hundredFirst.status);

  const {error:expireSeedError}=await db.from('profiles').update({trial_ends_at:new Date(Date.now()-60_000).toISOString(),trial_expired_at:null,plan:'pro'}).eq('id',userA.id);
  if(expireSeedError)throw expireSeedError;
  const expiredProfile=await api(userA.token,'/api/profile');
  assert(expiredProfile.status===200&&expiredProfile.data.profile?.effective_plan==='free'&&expiredProfile.data.profile?.trial_active===false&&expiredProfile.data.profile?.trial_days_remaining===0,'trial_expiration_returns_free');
  const {count:quotesAfterExpiry,error:quotesAfterExpiryError}=await db.from('quotes').select('*',{count:'exact',head:true}).eq('user_id',userA.id);
  if(quotesAfterExpiryError)throw quotesAfterExpiryError;
  assert((quotesAfterExpiry||0)>=100,'trial_expiry_keeps_quote_data','count='+quotesAfterExpiry);
  const blockedAfterDowngrade=await api(userA.token,'/api/quotes',{method:'POST',body:{client_name:'Après downgrade',client_email:'blocked@example.com',title:'Doit être bloqué',amount:'29',sent_at:sentAt,followup_schedule_mode:'none'},headers:{'Idempotency-Key':'cert-downgrade-block-'+stamp}});
  assert(blockedAfterDowngrade.status===403,'downgrade_over_free_quota_blocks_new_create');
  const closeAfterDowngrade=await api(userA.token,'/api/quotes/'+hundredth.data.quote.id,{method:'PATCH',body:{status:'lost'}});
  assert(closeAfterDowngrade.status===200,'downgrade_allows_close');
  const deleteAfterDowngrade=await api(userA.token,'/api/quotes/'+q.id,{method:'DELETE'});
  assert(deleteAfterDowngrade.status===200,'downgrade_allows_delete');
  const reopenAfterDowngrade=await api(userA.token,'/api/quotes/'+hundredth.data.quote.id,{method:'PATCH',body:{status:'open'}});
  assert(reopenAfterDowngrade.status===403,'downgrade_blocks_reopen_over_free_quota');
  const thirdTrial=await api(userA.token,'/api/trial/start',{method:'POST',body:{}});
  const afterExpiry=(await api(userA.token,'/api/profile')).data?.profile;
  assert(thirdTrial.status!==201&&afterExpiry?.trial_eligible===false&&afterExpiry?.pro_access===false&&afterExpiry?.trial_started_at===trialStartedAt,'expired_trial_cannot_restart',JSON.stringify({trial_start_status:thirdTrial.status}));

  // userA is Free again with 99 active quotes: only the 5 most recent stay editable (shared/quota.js), the
  // others answer 423 (read-only). The in-flight send guard is checked on an editable quote.
  const {data:activeA,error:activeAError}=await db.from('quotes').select('id,status,created_at').eq('user_id',userA.id).in('status',['open','paused']);
  if(activeAError)throw activeAError;
  const lockedA=lockedQuoteIds(activeA||[],false);
  const editableId=(activeA||[]).find(x=>x.status==='open'&&!lockedA.has(x.id))?.id;
  const claimedQuote=editableId?(await db.from('quotes').select('*').eq('id',editableId).single()).data:null;
  if(!claimedQuote)throw new Error('claimed quote missing');
  const {error:claimSeedError}=await db.from('quotes').update({send_claimed_at:new Date().toISOString()}).eq('id',claimedQuote.id);
  if(claimSeedError)throw claimSeedError;
  const pauseDuringSend=await api(userA.token,'/api/quotes/'+claimedQuote.id,{method:'PATCH',body:{status:'paused'}});
  const deleteDuringSend=await api(userA.token,'/api/quotes/'+claimedQuote.id,{method:'DELETE'});
  assert(pauseDuringSend.status===409&&deleteDuringSend.status===409,'inflight_followup_blocks_pause_and_delete');
  await db.from('quotes').update({send_claimed_at:null}).eq('id',claimedQuote.id);

  const own=await userA.client.from('quotes').select('id').eq('id',claimedQuote.id);
  assert(!own.error&&own.data?.length===1,'rls_owner_reads_own_quote');
  const cross=await userB.client.from('quotes').select('id').eq('id',claimedQuote.id);
  assert(!cross.error&&cross.data?.length===0,'rls_cross_user_quote_read_blocked');
  const crossProfile=await userB.client.from('profiles').select('id').eq('id',userA.id);
  assert(!crossProfile.error&&crossProfile.data?.length===0,'rls_cross_user_profile_read_blocked');
  const directWrite=await userA.client.from('quotes').update({title:'Direct browser write'}).eq('id',claimedQuote.id).select('id');
  assert(Boolean(directWrite.error)||(directWrite.data||[]).length===0,'browser_direct_quote_write_blocked');
  const adminRead=await userA.client.from('prospects').select('id').limit(1);
  assert(Boolean(adminRead.error)||(adminRead.data||[]).length===0,'browser_admin_table_read_blocked');

  const idorPatch=await api(userB.token,'/api/quotes/'+claimedQuote.id,{method:'PATCH',body:{title:'Cross user'}});
  const idorDelete=await api(userB.token,'/api/quotes/'+claimedQuote.id,{method:'DELETE'});
  assert(idorPatch.status===404&&idorDelete.status===404,'api_idor_update_delete_blocked');

  const adminRoute=await api(userA.token,'/api/admin/prospects');
  assert(adminRoute.status===403,'non_admin_admin_route_blocked');

  const supportEmpty=await api(userA.token,'/api/support/tickets',{method:'POST',body:{subject:'',message:''}});
  const supportOk=await api(userA.token,'/api/support/tickets',{method:'POST',body:{subject:'Question QA éè',message:'Message de certification avec caractères spéciaux.',topic:'product'}});
  assert(supportEmpty.status===400&&supportOk.status===201,'support_validation_and_create');
  const crossTicket=await userB.client.from('support_tickets').select('id').eq('id',supportOk.data.ticket.id);
  assert(!crossTicket.error&&crossTicket.data?.length===0,'rls_cross_user_ticket_read_blocked');
  const directTicketWrite=await userB.client.from('support_tickets').update({subject:'forbidden'}).eq('id',supportOk.data.ticket.id).select('id');
  assert(Boolean(directTicketWrite.error)||(directTicketWrite.data||[]).length===0,'browser_cross_user_ticket_write_blocked');

  const exp=await api(userA.token,'/api/account/export');
  const csv=await api(userA.token,'/api/quotes/export.csv');
  assert(exp.status===200&&Array.isArray(exp.data.quotes)&&csv.status===200,'data_exports_work');

  const large=await api(userA.token,'/api/support/tickets',{method:'POST',body:JSON.stringify({subject:'Large',message:'x'.repeat(300000)})});
  assert(large.status===413,'oversized_json_rejected');
  const wrongMethod=await api(userA.token,'/api/quotes',{method:'PUT',body:{}});
  assert(wrongMethod.status===404,'unexpected_http_method_rejected');

  const health=await api(null,'/api/health');
  const readiness=await api(null,'/api/readiness');
  assert(health.status===200&&health.data.ok===true,'health_live');
  assert(readiness.status===200&&readiness.data.ready===true,'readiness_live');
  const frameHeader=health.headers.get('x-frame-options');
  assert(health.headers.get('x-content-type-options')==='nosniff'&&['SAMEORIGIN','DENY'].includes(frameHeader),'security_headers_present_in_test_server',JSON.stringify({x_frame_options:frameHeader,x_content_type_options:health.headers.get('x-content-type-options')}));
  const serverSource=(await import('node:fs/promises')).readFile;
  const securitySource=await serverSource(new URL('./index.js',import.meta.url),'utf8');
  assert(securitySource.includes("frameAncestors:[\"'none'\"]")&&securitySource.includes("contentSecurityPolicy: process.env.NODE_ENV === 'production'"),'production_csp_configured');
  assert(securitySource.includes("cors({ origin:process.env.NODE_ENV === 'production' ? process.env.APP_URL : true"),'production_cors_restricted_to_app_url');

  for(const path of ['/api/profile','/api/quotes']){
    const perf=await timedRequest(userA.token,path,{headers:{'x-forwarded-for':'198.51.100.11'}});
    assert(perf.status===200&&perf.ms<3000,'performance_'+path.split('/').pop(),JSON.stringify({status:perf.status,ms:perf.ms}));
  }
  for(const [total,ip] of [[10,'198.51.100.20'],[50,'198.51.100.21'],[100,'198.51.100.22']]){
    const load=await localHealthLoad(total,ip);
    assert(load.errors===0&&load.p95<2000,'local_load_'+total,JSON.stringify(load));
  }

  const deleted=await api(userB.token,'/api/account',{method:'DELETE',body:{confirmation:'SUPPRIMER'}});
  assert(deleted.status===200&&deleted.data.deleted===true,'account_delete');
  const oldToken=await api(userB.token,'/api/profile');
  assert(oldToken.status===401,'deleted_account_old_token_rejected');
  const residue={};
  for(const table of ['profiles','quotes','followups','product_events','support_tickets','trial_events','lifecycle_messages']){
    const column=table==='profiles'?'id':'user_id';
    const {count,error}=await db.from(table).select('*',{count:'exact',head:true}).eq(column,userB.id);
    if(error)throw error; residue[table]=count||0;
  }
  assert(Object.values(residue).every(v=>v===0),'account_delete_cascades_user_data',JSON.stringify(residue));

  const summary={ok:true,count:results.length,results};
  console.log('AUTH_DOMAIN_QA='+JSON.stringify(summary));
  await qaEvent('info','AUTH_DOMAIN_QA_PASS',summary);
}catch(error){
  const summary={ok:false,error:String(error?.message||error).slice(0,240),count:results.length,results};
  console.error('AUTH_DOMAIN_QA='+JSON.stringify(summary));
  await qaEvent('error','AUTH_DOMAIN_QA_FAIL',summary);
  process.exitCode=1;
}finally{
  await cleanup(userA);await cleanup(userB);
  if(server?.listening)await new Promise(resolve=>server.close(resolve));
  process.exit(process.exitCode||0);
}
