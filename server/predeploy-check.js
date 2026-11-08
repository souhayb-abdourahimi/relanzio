import Stripe from 'stripe';
import {createBillingReadiness} from './billing-readiness.js';

// Only checks configuration and reads Stripe account/price. Never import the app,
// database client, auth, migrations, schedulers, QA scripts or email modules here.
export async function runPredeployCheck({env=process.env,stripe}={}){
 const required=['APP_URL','SUPABASE_URL','SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY','BREVO_API_KEY','BREVO_WEBHOOK_SECRET','EMAIL_FROM_ADDRESS'];
 if(required.some(name=>!String(env[name]||'').trim()))return {ok:false,state:'configuration_error',code:'PREDEPLOY_REQUIRED_CONFIG_MISSING'};
 try{for(const name of ['APP_URL','SUPABASE_URL'])if(!['https:','http:'].includes(new URL(env[name]).protocol))throw Error();}
 catch{return {ok:false,state:'configuration_error',code:'PREDEPLOY_URL_INVALID'};}
 try{
  const client=stripe===undefined?(env.STRIPE_SECRET_KEY?new Stripe(env.STRIPE_SECRET_KEY):null):stripe;
  const monitor=createBillingReadiness({stripe:client,env});
  const status=await monitor.check();
  return {ok:status.ready,state:status.state,code:status.code};
 }catch{
  // Never expose SDK errors, environment values, URLs, or request payloads.
  return {ok:false,state:'verification_error',code:'PREDEPLOY_CHECK_FAILED'};
 }
}
