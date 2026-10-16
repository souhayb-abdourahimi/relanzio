import { problem } from './config.js';
export function exact(input, keys) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(k=>!keys.includes(k))) throw problem('INVALID_FIELDS');
}
export function text(value, max=200) {
  if (typeof value !== 'string' || !value.trim() || value.length>max || /[\x00-\x1f<>]/.test(value)) throw problem('INVALID_TEXT');
  return value.trim();
}
export function email(value) {
  const v=text(value,254).toLowerCase();
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(v)) throw problem('INVALID_EMAIL');
  return v;
}
export function synthetic(value) { const v=email(value); if (!v.endsWith('.invalid')) throw problem('REAL_DATA_LOCKED',423); return v; }
export function validateDiagnostic(input) {
  exact(input,['company','email','team','tool','total','contract','review','unknown','excluded']);
  const out={company:text(input.company,100),email:email(input.email),team:input.team,tool:input.tool};
  if(!Number.isInteger(out.team)||out.team<1||out.team>5||!['none','existing'].includes(out.tool))throw problem('INVALID_PROFILE');
  for(const k of ['total','contract','review','unknown','excluded']){if(!Number.isInteger(input[k])||input[k]<0||input[k]>100000)throw problem('INVALID_COUNTS');out[k]=input[k];}
  if(out.total!==out.contract+out.review+out.unknown+out.excluded)throw problem('INCONSISTENT_COUNTS');
  return out;
}
export function diagnose(d) { return {contract_declared:d.contract,pending_legal_validation:d.review,insufficient:d.unknown,excluded:d.excluded,sendable:0}; }
export function validateCampaign(c) {
  exact(c,['senderName','senderEmail','replyTo','subject','body','followup','startsAt','segment']);
  const result={senderName:text(c.senderName,120),senderEmail:synthetic(c.senderEmail),replyTo:synthetic(c.replyTo),subject:text(c.subject,150),body:text(c.body,2000),followup:text(c.followup,2000),startsAt:c.startsAt,segment:c.segment};
  if(c.segment!=='contract_only'||typeof c.startsAt!=='string'||!Number.isFinite(Date.parse(c.startsAt)))throw problem('INVALID_CAMPAIGN');
  return result;
}
