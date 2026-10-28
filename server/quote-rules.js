import { activeQuoteLimitFor } from '../shared/plans.js';
export const MAX_QUOTE_AMOUNT = 9_999_999_999.99;
export const ACTIVE_QUOTE_STATUSES = Object.freeze(['open','paused']);
export const FOLLOWUP_SCHEDULE_MODES = Object.freeze(['recommended','custom','none']);

export function isActiveQuoteStatus(status=''){
  return ACTIVE_QUOTE_STATUSES.includes(status);
}

export function activeQuoteLimit(proAccess=false){
  return activeQuoteLimitFor(proAccess);
}

export function parseQuoteAmount(value){
  if(value===''||value===null||value===undefined)return null;
  const raw=String(value).trim().replace(/[\s\u00a0]/g,'');
  if(!/^\d+(?:[.,]\d{1,2})?$/.test(raw))return null;
  const n=Number(raw.replace(',','.'));
  return Number.isFinite(n)&&n>=0&&n<=MAX_QUOTE_AMOUNT?n:null;
}

export function parisTodayIso(now=new Date()){
  const d=now instanceof Date?now:new Date(now);
  if(Number.isNaN(d.getTime()))return null;
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);
  const get=type=>parts.find(x=>x.type===type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function parseSentDate(value,today=parisTodayIso()){
  const v=String(value||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return null;
  const d=new Date(v+'T00:00:00Z');
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==v||v>today)return null;
  return v;
}

export function normalizeFollowupScheduleMode(value){
  const v=String(value||'').trim().toLowerCase();
  return FOLLOWUP_SCHEDULE_MODES.includes(v)?v:null;
}

export function parseCustomFollowupAt(value,now=new Date()){
  const d=new Date(value);
  const current=now instanceof Date?now:new Date(now);
  if(Number.isNaN(d.getTime())||Number.isNaN(current.getTime()))return null;
  if(d.getTime()<current.getTime()-60_000)return null;
  return d.toISOString();
}

export const MAX_NOTE_LENGTH = 1000;

// French and international numbers: keep the user's formatting, require 6 to 15 digits.
export function normalizePhone(value){
  const v=String(value??'').trim().replace(/\s+/g,' ');
  if(!v)return '';
  if(v.length>40||!/^\+?[\d\s.()\-]+$/.test(v))return null;
  const digits=v.replace(/\D/g,'').length;
  return digits>=6&&digits<=15?v:null;
}

export function sanitizeNote(value){
  const v=String(value??'').replace(/\r\n/g,'\n').trim();
  return v?v.slice(0,MAX_NOTE_LENGTH):null;
}

// A quote needs at least one way to reach the client: a valid email or a valid phone.
export function parseQuoteContact({email,phone},isValidEmail){
  const e=String(email??'').trim().toLowerCase(),p=normalizePhone(phone);
  if(e&&!isValidEmail(e))return {error:'Email invalide.'};
  if(p===null)return {error:'Téléphone invalide.'};
  if(!e&&!p)return {error:'Renseignez un email ou un téléphone client.'};
  return {email:e||null,phone:p||null};
}
