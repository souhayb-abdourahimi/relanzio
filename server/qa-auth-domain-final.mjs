import { randomBytes } from 'node:crypto';

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
    legal_pages_approved:process.env.LEGAL_PAGES_APPROVED==='true'
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
async function checkRedirects(){
  const email='relanzio-cert-link-'+stamp+'@example.com',password='Qa!'+randomBytes(16).toString('base64url');
  let id;
  try{
    const signup=await db.auth.admin.generateLink({type:'signup',email,password,options:{redirectTo:publicApp+'/'}});
    if(signup.error)throw signup.error;id=signup.data?.user?.id;
    const redirect=new URL(signup.data.properties.action_link).searchParams.get('redirect_to')||'';
    const loc=safeLocation(redirect);
    assert(loc.origin===publicApp&&loc.path==='/', 'auth_signup_redirect_final_domain');
    if(id)await db.auth.admin.updateUserById(id,{email_confirm:true});
    const recovery=await db.auth.admin.generateLink({type:'recovery',email,options:{redirectTo:publicApp+'/reset-password'}});
    if(recovery.error)throw recovery.error;
    const rloc=safeLocation(new URL(recovery.data.properties.action_link).searchParams.get('redirect_to')||'');
    assert(rloc.origin===publicApp&&rloc.path==='/reset-password','auth_recovery_redirect_final_domain');
  }finally{if(id)try{await db.auth.admin.deleteUser(id,false)}catch{}}
}

try{
  assert(publicApp==='https://relanzio.com','app_url_final');
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

  const sentAt=new Date().toISOString().slice(0,10);
  const customAt=new Date(Date.now()+48*3600000).toISOString();
  const idem='cert-a-'+stamp;
  const quotePayload={client_name:"Élodie d’Azur",client_email:'elodie+qa@example.com',title:'Fenêtres — devis QA 🪟',amount:'0,01',sent_at:sentAt,followup_schedule_mode:'custom',next_followup_at:customAt};
  const created=await api(userA.token,'/api/quotes',{method:'POST',body:quotePayload,headers:{'Idempotency-Key':idem}});
  assert(created.status===201&&created.data.quote?.followup_schedule_mode==='custom','custom_followup_created','HTTP '+created.status);
  const q=created.data.quote;
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

  for(let i=0;i<3;i++){
    const r=await api(userA.token,'/api/quotes',{method:'POST',body:{client_name:'Concurrence '+i,client_email:'race+'+i+'@example.com',title:'Préparation quota '+i,amount:'29',sent_at:sentAt,followup_schedule_mode:'none'},headers:{'Idempotency-Key':'cert-race-seed-'+stamp+'-'+i}});
    assert(r.status===201,'concurrency_seed_'+i,'HTTP '+r.status);
  }
  const concurrent=await Promise.all([0,1].map(i=>api(userA.token,'/api/quotes',{method:'POST',body:{client_name:'Course '+i,client_email:'race-final+'+i+'@example.com',title:'Création concurrente '+i,amount:'29',sent_at:sentAt,followup_schedule_mode:'none'},headers:{'Idempotency-Key':'cert-race-final-'+stamp+'-'+i}})));
  const concurrentStatuses=concurrent.map(x=>x.status).sort();
  assert(concurrentStatuses[0]===201&&concurrentStatuses[1]===403,'atomic_free_quota_under_concurrent_create',JSON.stringify(concurrentStatuses));

  const seeded=[];
  for(let i=0;i<5;i++){
    const r=await api(userB.token,'/api/quotes',{method:'POST',body:{client_name:'Client '+i,client_email:'client+'+i+'@example.com',title:'Quota '+i,amount:i===0?'0':'29',sent_at:sentAt,followup_schedule_mode:'recommended'},headers:{'Idempotency-Key':'cert-b-'+stamp+'-'+i}});
    assert(r.status===201,'free_quota_seed_'+i,'HTTP '+r.status);seeded.push(r.data.quote);
  }
  const pauseB=await api(userB.token,'/api/quotes/'+seeded[0].id,{method:'PATCH',body:{status:'paused'}});
  assert(pauseB.status===200,'free_pause_seed');
  const sixth=await api(userB.token,'/api/quotes',{method:'POST',body:{client_name:'Sixième',client_email:'six@example.com',title:'Doit être bloqué',amount:'999',sent_at:sentAt,followup_schedule_mode:'recommended'},headers:{'Idempotency-Key':'cert-b-six-'+stamp}});
  assert(sixth.status===403,'free_limit_counts_paused','HTTP '+sixth.status);
  const won=await api(userB.token,'/api/quotes/'+seeded[0].id,{method:'PATCH',body:{status:'won'}});
  assert(won.status===200&&won.data.quote.next_followup_at===null,'won_stops_followup');
  const sixthOk=await api(userB.token,'/api/quotes',{method:'POST',body:{client_name:'Sixième autorisé',client_email:'six-ok@example.com',title:'Autorisé',amount:'999',sent_at:sentAt,followup_schedule_mode:'none'},headers:{'Idempotency-Key':'cert-b-six-ok-'+stamp}});
  assert(sixthOk.status===201,'free_limit_releases_after_close');

  const trial=await api(userA.token,'/api/trial/start',{method:'POST',body:{}});
  const t0=new Date(trial.data?.profile?.trial_started_at||0).getTime(),t1=new Date(trial.data?.profile?.trial_ends_at||0).getTime();
  assert(trial.status===201&&trial.data.profile?.pro_access===true&&t1-t0===7*24*3600000,'self_service_trial_exact_7d',JSON.stringify({status:trial.status,pro_access:trial.data.profile?.pro_access,trial_started_at:trial.data.profile?.trial_started_at,trial_ends_at:trial.data.profile?.trial_ends_at,span_ms:t1-t0,body:trial.data?.error||null}));
  const trialAgain=await api(userA.token,'/api/trial/start',{method:'POST',body:{}});
  assert(trialAgain.status===409,'trial_one_time_only');

  const own=await userA.client.from('quotes').select('id').eq('id',q.id);
  assert(!own.error&&own.data?.length===1,'rls_owner_reads_own_quote');
  const cross=await userB.client.from('quotes').select('id').eq('id',q.id);
  assert(!cross.error&&cross.data?.length===0,'rls_cross_user_quote_read_blocked');
  const crossProfile=await userB.client.from('profiles').select('id').eq('id',userA.id);
  assert(!crossProfile.error&&crossProfile.data?.length===0,'rls_cross_user_profile_read_blocked');
  const directWrite=await userA.client.from('quotes').update({title:'Direct browser write'}).eq('id',q.id).select('id');
  assert(Boolean(directWrite.error)||(directWrite.data||[]).length===0,'browser_direct_quote_write_blocked');
  const adminRead=await userA.client.from('prospects').select('id').limit(1);
  assert(Boolean(adminRead.error)||(adminRead.data||[]).length===0,'browser_admin_table_read_blocked');

  const idorPatch=await api(userB.token,'/api/quotes/'+q.id,{method:'PATCH',body:{title:'Cross user'}});
  const idorDelete=await api(userB.token,'/api/quotes/'+q.id,{method:'DELETE'});
  assert(idorPatch.status===404&&idorDelete.status===404,'api_idor_update_delete_blocked');

  const adminRoute=await api(userA.token,'/api/admin/prospects');
  assert(adminRoute.status===403,'non_admin_admin_route_blocked');

  const supportEmpty=await api(userA.token,'/api/support/tickets',{method:'POST',body:{subject:'',message:''}});
  const supportOk=await api(userA.token,'/api/support/tickets',{method:'POST',body:{subject:'Question QA éè',message:'Message de certification avec caractères spéciaux.',topic:'product'}});
  assert(supportEmpty.status===400&&supportOk.status===201,'support_validation_and_create');

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
  assert(health.headers.get('x-content-type-options')==='nosniff'&&health.headers.get('x-frame-options')==='DENY','security_headers_present_in_test_server');
  const serverSource=(await import('node:fs/promises')).readFile;
  const securitySource=await serverSource(new URL('./index.js',import.meta.url),'utf8');
  assert(securitySource.includes("frameAncestors:[\"'none'\"]")&&securitySource.includes("contentSecurityPolicy: process.env.NODE_ENV === 'production'"),'production_csp_configured');
  const cors=await api(null,'/api/health',{method:'OPTIONS',headers:{origin:'https://evil.example','access-control-request-method':'GET'}});
  assert(cors.headers.get('access-control-allow-origin')!=='https://evil.example','cors_hostile_origin_not_allowed');

  const deleted=await api(userB.token,'/api/account',{method:'DELETE',body:{confirmation:'SUPPRIMER'}});
  assert(deleted.status===200&&deleted.data.deleted===true,'account_delete');
  const oldToken=await api(userB.token,'/api/profile');
  assert(oldToken.status===401,'deleted_account_old_token_rejected');

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
