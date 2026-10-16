import { problem } from './config.js';
export function isPilotEvent(event) { const m=event?.data?.object?.metadata; return m?.purpose==='maintenance_pilot'||Boolean(m?.pilot_case_id); }
export function checkoutRequest(record,key,origin) {
  if(!/^(sk|rk)_test_/.test(key))throw problem('LIVE_PAYMENTS_LOCKED',423);
  if(!record.approved||!record.campaign)throw problem('TEXT_APPROVAL_REQUIRED',409);
  const url=new URL('/rappel-entretien',origin);
  return {mode:'payment',line_items:[{quantity:1,price_data:{currency:'eur',unit_amount:19000,product_data:{name:'Campagne rappel entretien — pilote TEST'}}}],
    metadata:{purpose:'maintenance_pilot',pilot_case_id:record.id,pilot_version:String(record.version)},
    success_url:`${url}?payment=test-return`,cancel_url:`${url}?payment=canceled`};
}
// Signature verification belongs to the raw-body route, before this parser.
export function verifyPayment(event) {
  const s=event?.data?.object;
  if(event?.livemode!==false||s?.livemode!==false)throw problem('LIVE_PAYMENTS_LOCKED',423);
  if(!['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type))return null;
  if(!isPilotEvent(event)||s.mode!=='payment'||s.payment_status!=='paid'||s.amount_total!==19000||s.currency!=='eur'||!s.id?.startsWith('cs_test_')||!event.id?.startsWith('evt_')||!s.metadata?.pilot_case_id)throw problem('INVALID_PAYMENT');
  return {eventId:event.id,sessionId:s.id,caseId:s.metadata.pilot_case_id};
}
export async function prepareCheckout({record,key,origin,repo,stripe}) {
 const args=checkoutRequest({...record.state,id:record.id},key,origin);
 const existing=await repo.reserve(record);
 if(existing?.paid)throw problem('ALREADY_PAID',409);
 if(existing?.session_id){
  if(existing.paid)throw problem('ALREADY_PAID',409);
  const session=await stripe.checkout.sessions.retrieve(existing.session_id);
  if(session.livemode!==false||!session.id.startsWith('cs_test_'))throw problem('LIVE_PAYMENTS_LOCKED',423);
  if(session.status!=='open')throw problem('CHECKOUT_EXPIRED',409);
  return {url:session.url,testOnly:true};
 }
 const session=await stripe.checkout.sessions.create(args,{idempotencyKey:`maintenance-${record.id}-${record.state.version}`});
 if(session.livemode!==false||!session.id.startsWith('cs_test_'))throw problem('LIVE_PAYMENTS_LOCKED',423);
 await repo.saveSession(record.id,record.state.version,session.id);
 return {url:session.url,testOnly:true};
}
