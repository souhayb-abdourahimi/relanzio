const PARIS_TZ='Europe/Paris';

function offsetMs(utcDate,timeZone=PARIS_TZ){
  const parts=new Intl.DateTimeFormat('en-CA',{
    timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'
  }).formatToParts(utcDate).reduce((acc,p)=>{if(p.type!=='literal')acc[p.type]=p.value;return acc},{});
  const represented=Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day),Number(parts.hour),Number(parts.minute),Number(parts.second));
  return represented-utcDate.getTime();
}

export function parisLocalDateTimeToIso(value){
  const m=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if(!m)return null;
  const [,ys,mos,ds,hs,mis]=m;
  const year=Number(ys),month=Number(mos),day=Number(ds),hour=Number(hs),minute=Number(mis);
  const base=Date.UTC(year,month-1,day,hour,minute,0,0);
  let guess=new Date(base),off=offsetMs(guess),utc=new Date(base-off);
  const second=offsetMs(utc);
  if(second!==off)utc=new Date(base-second);
  const roundtrip=isoToParisLocalDateTime(utc.toISOString());
  return roundtrip===value?utc.toISOString():null;
}

export function isoToParisLocalDateTime(value){
  const d=new Date(value);
  if(Number.isNaN(d.getTime()))return '';
  const parts=new Intl.DateTimeFormat('en-CA',{
    timeZone:PARIS_TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'
  }).formatToParts(d).reduce((acc,p)=>{if(p.type!=='literal')acc[p.type]=p.value;return acc},{});
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export const PARIS_TIME_ZONE=PARIS_TZ;
