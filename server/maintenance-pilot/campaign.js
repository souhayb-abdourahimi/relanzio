import { createHash } from 'node:crypto';
import { validateCampaign, synthetic } from './validation.js';
import { problem } from './config.js';
const fingerprint=c=>createHash('sha256').update(JSON.stringify(validateCampaign(c))).digest('hex');
export function approveCampaign(state) { return {...state,campaign:validateCampaign(state.campaign),approved:true,approvalHash:fingerprint(state.campaign),repliesCheckedAt:null}; }
export function recordSignal(state,address,kind) {
  if(!['stop','reply','bounce','complaint','appointment'].includes(kind))throw problem('INVALID_SIGNAL');
  const key=synthetic(address), previous=state.signals?.[key];
  const history=Array.isArray(previous)?previous:previous?[previous]:[];
  return {...state,signals:{...state.signals,[key]:[...new Set([...history,kind])]},repliesCheckedAt:null};
}
export function simulate(state,addresses,step,at,outcome='simulated') {
  if(!state.approved||state.approvalHash!==fingerprint(state.campaign))throw problem('CAMPAIGN_APPROVAL_REQUIRED',409);
  if(![1,2].includes(step)||!['simulated','unknown_delivery'].includes(outcome))throw problem('INVALID_STEP');
  if(!Array.isArray(addresses)||addresses.length>500||!addresses.length)throw problem('INVALID_RECIPIENTS');
  const unique=[...new Set(addresses.map(synthetic))];
  const deliveries=[...(state.deliveries||[])]; const now=Date.parse(at);
  if(!Number.isFinite(now)||now<Date.parse(state.campaign.startsAt))throw problem('NOT_DUE',409);
  if(new Set([...deliveries.map(d=>d.address),...unique]).size>500)throw problem('CONTACT_LIMIT');
  for(const address of unique){
    if(state.signals?.[address]||deliveries.some(d=>d.address===address&&d.step===step))continue;
    if(deliveries.some(d=>d.address===address&&d.status==='unknown_delivery'))continue;
    if(step===2){
      const first=deliveries.find(d=>d.address===address&&d.step===1&&d.status==='simulated');
      if(!first||now-Date.parse(first.at)<10*86400000)throw problem('NOT_DUE',409);
      const reviewed=Date.parse(state.repliesCheckedAt);
      if(!Number.isFinite(reviewed)||reviewed>now||now-reviewed>86400000)throw problem('REPLY_REVIEW_REQUIRED',409);
    }
    deliveries.push({address,step,at:new Date(now).toISOString(),status:outcome});
  }
  return {...state,deliveries};
}
