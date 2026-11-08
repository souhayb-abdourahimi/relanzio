import {Router} from 'express';
import {verifyStripeConfiguration} from './stripe-boundary.js';

const CONFIG_CODES=new Set(['BILLING_MODE_NOT_CONFIGURED','BILLING_PRODUCTION_REQUIRES_LIVE','BILLING_KEY_MODE_MISMATCH','BILLING_ACCOUNT_NOT_CONFIGURED','BILLING_PRICE_NOT_CONFIGURED','BILLING_MODE_MISMATCH','BILLING_ACCOUNT_MISMATCH','BILLING_PRICE_MISMATCH','BILLING_PRICE_NOT_ACTIVE','BILLING_STRIPE_UNAVAILABLE','BILLING_WEBHOOK_NOT_CONFIGURED']);
const MESSAGES={pending:'Vérification de la facturation en cours.',ready:'Configuration Stripe vérifiée.',configuration_error:'Configuration Stripe incorrecte ou accès non autorisé. Intervention nécessaire.',temporarily_unavailable:'Stripe est temporairement inaccessible. Nouvelle vérification automatique.',verification_error:'La vérification Stripe a échoué. Diagnostic nécessaire.',stale:'La dernière vérification Stripe est trop ancienne.'};
function diagnosis(error){
 if(CONFIG_CODES.has(error?.code))return {state:'configuration_error',code:error.code};
 if([401,403,404].includes(error?.statusCode)||['StripeAuthenticationError','StripePermissionError'].includes(error?.type))return {state:'configuration_error',code:'BILLING_API_CONFIGURATION_ERROR'};
 if(error?.code==='BILLING_CHECK_TIMEOUT'||['StripeConnectionError','StripeAPIError','StripeRateLimitError'].includes(error?.type)||error?.statusCode===429||error?.statusCode>=500)return {state:'temporarily_unavailable',code:'BILLING_API_UNAVAILABLE'};
 return {state:'verification_error',code:'BILLING_VERIFICATION_FAILED'};
}

// GET-only monitor. No database, email, checkout creation or changes to Stripe.
export function createBillingReadiness({stripe,env=process.env,now=Date.now,onChange=()=>{},timeoutMs=5000,intervalMs=30000,maxAgeMs=60000}){
 let state={state:'pending',code:'BILLING_CHECK_PENDING',checkedAt:null},config=null,inFlight=null,interval=null;
 const snapshot=()=>{
  const current=state.state==='ready'&&now()-state.checkedAt>maxAgeMs?{...state,state:'stale',code:'BILLING_CHECK_STALE'}:state;
  return {...current,ready:current.state==='ready',message:MESSAGES[current.state]};
 };
 const check=()=>{
  if(inFlight)return inFlight;
  inFlight=(async()=>{
   let timer,next;
   try{
    const verification=async()=>{
     if(!env.STRIPE_WEBHOOK_SECRET)throw Object.assign(Error(),{code:'BILLING_WEBHOOK_NOT_CONFIGURED'});
     return verifyStripeConfiguration(stripe,env,undefined,{timeout:Math.max(1,Math.floor(timeoutMs/2)),maxNetworkRetries:0},true);
    };
    config=await Promise.race([verification(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Object.assign(Error(),{code:'BILLING_CHECK_TIMEOUT'})),timeoutMs);})]);
    next={state:'ready',code:'BILLING_CONFIGURATION_VERIFIED',checkedAt:now()};
   }catch(error){config=null;next={...diagnosis(error),checkedAt:now()};}
   finally{clearTimeout(timer);}
   const changed=next.state!==state.state||next.code!==state.code;state=next;
   if(changed){try{Promise.resolve(onChange(snapshot())).catch(()=>{});}catch{/* diagnostics must never affect availability */}}
   return snapshot();
  })().finally(()=>{inFlight=null;});
  return inFlight;
 };
 const requireReady=async()=>{
  const status=await check();
  if(!status.ready)throw Object.assign(new Error(status.message),{code:status.code,billingUnavailable:true});
  return config;
 };
 return {snapshot,check,requireReady,
  start(){if(!interval){interval=setInterval(()=>{void check();},intervalMs);interval.unref?.();}return check();},
  stop(){clearInterval(interval);interval=null;}
 };
}

// Liveness is deliberately independent from Stripe. Only readiness gates a new release.
export function createAvailabilityRouter({billing,dependenciesReady=()=>true}){
 const router=Router();
 router.get('/health',(_req,res)=>{res.set('Cache-Control','no-store').json({ok:true,service:'relanzio',version:'0.4.0'});});
 router.get('/readiness',(_req,res)=>{
  const ready=Boolean(dependenciesReady()&&billing.snapshot().ready);
  res.set('Cache-Control','no-store').status(ready?200:503).json({ready});
 });
 return router;
}
