import { parisLocalDateTimeToIso } from './logic.js';

export const AUTOMATIC_SEND_START_HOUR = 8;
export const AUTOMATIC_SEND_END_HOUR = 19;
export const RECOMMENDED_FOLLOWUP_GAPS = Object.freeze({ 1:3, 2:5 });

function parisParts(value=new Date()){
  const d=value instanceof Date?value:new Date(value);
  if(Number.isNaN(d.getTime()))throw new Error('INVALID_DATE');
  return new Intl.DateTimeFormat('en-CA',{
    timeZone:'Europe/Paris',
    year:'numeric',month:'2-digit',day:'2-digit',
    hour:'2-digit',minute:'2-digit',weekday:'short',hourCycle:'h23'
  }).formatToParts(d).reduce((acc,p)=>{if(p.type!=='literal')acc[p.type]=p.value;return acc},{});
}

export function parisBusinessDate(value=new Date()){
  const p=parisParts(value);
  return `${p.year}-${p.month}-${p.day}`;
}

export function addDaysToDateKey(dateKey,days){
  const m=String(dateKey||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m)throw new Error('INVALID_DATE_KEY');
  const d=new Date(Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3])));
  d.setUTCDate(d.getUTCDate()+Number(days||0));
  return d.toISOString().slice(0,10);
}

export function nextRecommendedAfterAction(performedAt,nextStep){
  const step=Number(nextStep);
  if(step>=3)return null;
  const gap=RECOMMENDED_FOLLOWUP_GAPS[step];
  if(!gap)throw new Error('INVALID_NEXT_STEP');
  return parisLocalDateTimeToIso(addDaysToDateKey(parisBusinessDate(performedAt),gap),9,0);
}

export function isAutomaticSendWindow(value=new Date()){
  const p=parisParts(value);
  if(['Sat','Sun'].includes(p.weekday))return false;
  const hour=Number(p.hour);
  return hour>=AUTOMATIC_SEND_START_HOUR&&hour<AUTOMATIC_SEND_END_HOUR;
}

export function providerFailureDisposition(error){
  const message=String(error?.message||error||'');
  if(/^EMAIL_(PROVIDER_NOT_CONFIGURED|SUPPRESSION_CHECK_FAILED|RECIPIENT_SUPPRESSED)$/.test(message))return 'certain';
  const m=message.match(/^Brevo\s+(\d{3}):/i);
  if(m){
    const status=Number(m[1]);
    return status>=400&&status<500?'certain':'ambiguous';
  }
  return 'ambiguous';
}

export function shouldArmInitialAutoSend(wantsAuto,nextFollowupAt,now=new Date()){
  if(!wantsAuto||!nextFollowupAt)return false;
  const target=new Date(nextFollowupAt).getTime(),current=now instanceof Date?now.getTime():new Date(now).getTime();
  return Number.isFinite(target)&&Number.isFinite(current)&&target>current;
}
