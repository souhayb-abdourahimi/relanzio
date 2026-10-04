import { createClient } from '@supabase/supabase-js';

const APP=(process.env.APP_URL||'').replace(/\/$/,'');
const recipient=String(process.env.QA_EMAIL_RECIPIENT||'').trim().toLowerCase();
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const stamp=Date.now();
const email=recipient.includes('@') ? recipient.replace('@',`+auth-domain-${stamp}@`) : `qa-auth-domain-${stamp}@example.invalid`;
const password=`Rz!AuthDomain-${stamp}-Aa9`;
let userId=null;
const result={signup_redirect:false,recovery_redirect:false,app:APP};

function safeLocation(value){
  try{const u=new URL(value);return {origin:u.origin,path:u.pathname}}catch{return {origin:'',path:''}}
}
function safeRedirectParam(actionLink){
  try{return safeLocation(new URL(actionLink).searchParams.get('redirect_to')||'')}catch{return {origin:'',path:''}}
}
async function checkActionLink(actionLink,expectedPath){
  const r=await fetch(actionLink,{redirect:'manual'});
  const loc=safeLocation(r.headers.get('location')||'');
  return {ok:r.status>=300&&r.status<400&&loc.origin===APP&&loc.path===expectedPath,status:r.status,origin:loc.origin,path:loc.path};
}
try{
  if(APP!=='https://relanzio.com')throw new Error('APP_URL_NOT_FINAL');
  const signup=await db.auth.admin.generateLink({type:'signup',email,password,redirectTo:APP+'/'});
  if(signup.error)throw signup.error;
  userId=signup.data?.user?.id||null;
  const signupAction=signup.data?.properties?.action_link||'';
  const signupRequested=safeRedirectParam(signupAction);
  const s=await checkActionLink(signupAction, '/');
  result.signup_redirect=s.ok;result.signup={status:s.status,origin:s.origin,path:s.path,requested_origin:signupRequested.origin,requested_path:signupRequested.path};
  if(userId)await db.auth.admin.updateUserById(userId,{email_confirm:true});
  const recovery=await db.auth.admin.generateLink({type:'recovery',email,redirectTo:APP+'/reset-password'});
  if(recovery.error)throw recovery.error;
  const recoveryAction=recovery.data?.properties?.action_link||'';
  const recoveryRequested=safeRedirectParam(recoveryAction);
  const rec=await checkActionLink(recoveryAction, '/reset-password');
  result.recovery_redirect=rec.ok;result.recovery={status:rec.status,origin:rec.origin,path:rec.path,requested_origin:recoveryRequested.origin,requested_path:recoveryRequested.path};
  result.ok=result.signup_redirect&&result.recovery_redirect;
}catch(e){
  result.ok=false;result.error=String(e?.message||e).slice(0,120);
}finally{
  if(userId)try{await db.auth.admin.deleteUser(userId,false)}catch{}
}
console.log('AUTH_DOMAIN_QA='+JSON.stringify(result));
process.exit(result.ok?0:1);
