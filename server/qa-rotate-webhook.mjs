import Stripe from 'stripe';
import { publicEncrypt } from 'node:crypto';
import { db } from './db.js';
const APP=process.env.QA_APP_URL, marker='relanzio-cert-v2-20261002';
if(APP!=='https://relanzio-production.up.railway.app'||!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'))throw Error('STAGING_ONLY');
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
const endpoints=(await stripe.webhookEndpoints.list({limit:100})).data.filter(x=>x.url===APP+'/api/stripe/webhook');
if(endpoints.some(x=>x.livemode))throw Error('LIVE_REJECTED');
if(process.argv[2]==='provision'){
 if(endpoints.some(x=>x.metadata?.rotation===marker)) {console.log('ROTATION_ALREADY_PROVISIONED');}
 else {
 const old=endpoints.find(x=>x.status==='enabled');if(!old)throw Error('NO_EXISTING_ENDPOINT');
 const ep=await stripe.webhookEndpoints.create({url:old.url,enabled_events:old.enabled_events,api_version:old.api_version||undefined,description:'Relanzio staging certified webhook',metadata:{rotation:marker}});
 const cipher=publicEncrypt({key:"-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0EDXZ4fVOodsEhGpu23B\nNR4AAcnuSX/F3q/XnqKLeFA8i3RnKeqn/fr1/kijYxtFyruNsLi7+UJ8OPvXdNWI\n5gnTvHMVMx5TaaDxMevcjcLbz9BW9nI/OyapKJEIFD8exTKm4ybvleG5rWh2l6PS\n6t0xAl+nt1pfZox2PAInkziQ/Je4xWXUVW4z0yKcPmV7kM9kIxZKx8X3fsstVQsy\nqA22ZPkt1RUDGjNJ/hi1NwdcIx3HXeorph1O427zFEvw8UluW2NK8CR+Dpr0LGhN\nM/PIwA3X2XIS4hSGQYfnT0/KsGDtKItpK1MvuKU57xmErxv0X+2X4yT1RqaBMWjf\nKQIDAQAB\n-----END PUBLIC KEY-----",oaepHash:'sha256'},Buffer.from(ep.secret)).toString('base64');
 console.log('ROTATION_ENCRYPTED='+JSON.stringify({endpoint_id:ep.id,previous:endpoints.map(x=>x.id),ciphertext:cipher}));
 }
}else if(process.argv[2]==='verify'){
 const ep=endpoints.find(x=>x.metadata?.rotation===marker);if(!ep)throw Error('NEW_ENDPOINT_MISSING');
 const uid='4c267116-89e1-4478-a2e1-2a249ba2d38e';
 const p=await db.from('profiles').select('id,email,plan,subscription_status,stripe_subscription_id').eq('id',uid).single();if(p.error||!p.data.email.includes('+'))throw Error('QA_PROFILE_GUARD');
 const sub=await stripe.subscriptions.retrieve(p.data.stripe_subscription_id);if(sub.livemode)throw Error('LIVE_REJECTED');
 await stripe.subscriptions.update(sub.id,{metadata:{qa_rotation_verification:marker}});
 let found;
 for(let i=0;i<12;i++){
 const events=await stripe.events.list({type:'customer.subscription.updated',limit:20});
 found=events.data.find(x=>x.data.object.id===sub.id&&x.data.object.metadata?.qa_rotation_verification===marker);
 if(found){const l=await db.from('stripe_webhook_events').select('*').eq('event_id',found.id).maybeSingle();if(l.data?.processed_at){found={event_id:found.id,livemode:found.livemode,ledger:l.data};break}else found=null}
 await new Promise(r=>setTimeout(r,2000));
 }
 if(!found?.ledger)throw Error('NEW_PROVIDER_EVENT_NOT_PROCESSED');
 const disabled=[];for(const old of endpoints.filter(x=>x.id!==ep.id)){await stripe.webhookEndpoints.update(old.id,{disabled:true});disabled.push(old.id)}
 const payload=JSON.stringify(await stripe.events.retrieve(found.event_id)),signature=stripe.webhooks.generateTestHeaderString({payload,secret:process.env.STRIPE_WEBHOOK_SECRET});
 const response=await fetch(APP+'/api/stripe/webhook',{method:'POST',headers:{'Content-Type':'application/json','stripe-signature':signature},body:payload});
 const body=await response.json();if(response.status!==200||!body.duplicate)throw Error('NEW_SECRET_REPLAY_FAILED');
 const after=await db.from('profiles').select('plan,subscription_status').eq('id',uid).single();
 console.log('ROTATION_VERIFIED='+JSON.stringify({endpoint_id:ep.id,disabled,event:found,replay:{status:response.status,body},qa_billing_unchanged:after.data.plan===p.data.plan&&after.data.subscription_status===p.data.subscription_status,finished_at:new Date().toISOString()}));
}else throw Error('EXPLICIT_MODE_REQUIRED');
setInterval(()=>{},3600000);
