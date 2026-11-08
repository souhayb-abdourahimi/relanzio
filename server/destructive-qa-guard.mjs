// These legacy QA suites modify and delete data. They are never a deployment check.
// Explicit local opt-in is mandatory; a local tunnel is not proof of isolation.
function loopbackUrl(value){
 try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)&&['127.0.0.1','localhost','[::1]'].includes(url.hostname);}
 catch{return false;}
}
export function assertIsolatedDestructiveQa(env=process.env){
 if([env.RAILWAY_ENVIRONMENT_NAME,env.RAILWAY_ENVIRONMENT].some(value=>['production','prod'].includes(String(value||'').trim().toLowerCase()))||env.NODE_ENV!=='test'||env.ALLOW_LOCAL_DESTRUCTIVE_QA!=='true'||!loopbackUrl(env.SUPABASE_URL)||!loopbackUrl(env.APP_URL)||
    (env.VITE_SUPABASE_URL&&!loopbackUrl(env.VITE_SUPABASE_URL)))throw new Error('DESTRUCTIVE_QA_LOCAL_ONLY');
}
