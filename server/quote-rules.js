export const MAX_QUOTE_AMOUNT = 9_999_999_999.99;
export const ACTIVE_QUOTE_STATUSES = Object.freeze(['open','paused']);
export const FOLLOWUP_SCHEDULE_MODES = Object.freeze(['recommended','custom','none']);

export function isActiveQuoteStatus(status=''){
  return ACTIVE_QUOTE_STATUSES.includes(status);
}

export function activeQuoteLimit(proAccess=false){
  return proAccess ? 100 : 5;
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
