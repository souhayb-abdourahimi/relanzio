import { parisLocalDateTimeToIso } from './date-time.js';

const TZ='Europe/Paris';

export function parisDateKey(value=new Date()){
  const d=value instanceof Date?value:new Date(value);
  if(Number.isNaN(d.getTime()))return '';
  const p=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d)
    .reduce((a,x)=>{if(x.type!=='literal')a[x.type]=x.value;return a},{});
  return `${p.year}-${p.month}-${p.day}`;
}

function dateNumber(key){
  const m=String(key||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m?Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3])):NaN;
}

export function addParisDaysIso(days,now=new Date(),hour=9,minute=0){
  const key=parisDateKey(now),base=dateNumber(key);
  if(!Number.isFinite(base))return null;
  const d=new Date(base);d.setUTCDate(d.getUTCDate()+Number(days||0));
  return parisLocalDateTimeToIso(`${d.toISOString().slice(0,10)}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`);
}

export function actionMeta(quote,now=new Date()){
  if(!quote||quote.status!=='open')return null;
  const step=Number(quote.followup_step||0),terminal=step>=3;
  if(!quote.next_followup_at){
    return terminal?{bucket:'today',terminal:true,step,daysOverdue:0,sortTime:-Infinity}:null;
  }
  const targetKey=parisDateKey(quote.next_followup_at),todayKey=parisDateKey(now);
  const diff=Math.round((dateNumber(targetKey)-dateNumber(todayKey))/86400000);
  return {
    bucket:diff<0?'overdue':diff===0?'today':'future',
    terminal,
    step,
    daysOverdue:Math.max(0,-diff),
    sortTime:new Date(quote.next_followup_at).getTime()
  };
}

export function buildTodayGroups(quotes=[],now=new Date()){
  const groups={overdue:[],today:[],future:[]};
  for(const quote of quotes){
    const meta=actionMeta(quote,now);
    if(meta)groups[meta.bucket].push({...quote,action_meta:meta});
  }
  groups.overdue.sort((a,b)=>a.action_meta.sortTime-b.action_meta.sortTime);
  groups.today.sort((a,b)=>{
    if(a.action_meta.terminal!==b.action_meta.terminal)return a.action_meta.terminal?-1:1;
    return a.action_meta.sortTime-b.action_meta.sortTime;
  });
  groups.future.sort((a,b)=>a.action_meta.sortTime-b.action_meta.sortTime);
  return groups;
}

export const TERMINAL_LABEL='Séquence terminée — décidez : gagné, perdu ou repousser';

export function actionStageLabel(quote){
  const step=Number(quote?.followup_step||0);
  return step>=3?TERMINAL_LABEL:`Relance ${step+1}/3`;
}

export function overdueLabel(days){
  const d=Number(days||0);
  return d>0?`en retard de ${d} j`:'';
}

// Paris-local 09:00 on a chosen calendar day (YYYY-MM-DD), for "Repousser à une date".
export function parisDateToFollowupIso(dateKey,hour=9){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(dateKey||'')))return null;
  return parisLocalDateTimeToIso(`${dateKey}T${String(hour).padStart(2,'0')}:00`);
}

export function formatParisDay(value){
  const d=new Date(value);
  return Number.isNaN(d.getTime())?'':new Intl.DateTimeFormat('fr-FR',{timeZone:TZ,weekday:'short',day:'numeric',month:'short'}).format(d);
}

const DONE_STATUSES=['sent','delivered','opened','clicked','bounced'];
export function lastFollowup(quote){
  const items=(quote?.followups||[]).filter(x=>DONE_STATUSES.includes(x.status));
  return items.sort((a,b)=>new Date(b.sent_at||b.created_at)-new Date(a.sent_at||a.created_at))[0]||null;
}

const phoneDigits=phone=>String(phone||'').replace(/[^\d+]/g,'');
export function mailtoHref(email,subject='',body=''){
  if(!email)return '';
  const q=[subject&&`subject=${encodeURIComponent(subject)}`,body&&`body=${encodeURIComponent(body)}`].filter(Boolean).join('&');
  return `mailto:${encodeURIComponent(email).replace('%40','@')}${q?'?'+q:''}`;
}
// "?&body=" is understood by both iOS and Android messaging apps.
export function smsHref(phone,body=''){
  const n=phoneDigits(phone);
  return n?`sms:${n}${body?`?&body=${encodeURIComponent(body)}`:''}`:'';
}
export function telHref(phone){
  const n=phoneDigits(phone);
  return n?`tel:${n}`:'';
}

// Pipeline order: open quotes by urgency, then paused, then decided quotes (most recent first).
export function sortPipeline(quotes=[]){
  const rank={open:0,paused:1,won:2,lost:2};
  const next=q=>q.next_followup_at?new Date(q.next_followup_at).getTime():Number.MAX_SAFE_INTEGER;
  return [...quotes].sort((a,b)=>(rank[a.status]??3)-(rank[b.status]??3)||(a.status==='open'?next(a)-next(b):new Date(b.updated_at||b.created_at||0)-new Date(a.updated_at||a.created_at||0)));
}
