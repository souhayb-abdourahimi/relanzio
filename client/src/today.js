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
  const step=Number(quote.followup_step||0);
  if(step>=3)return {bucket:'today',terminal:true,step,daysOverdue:0,sortTime:-Infinity};
  if(!quote.next_followup_at)return null;
  const targetKey=parisDateKey(quote.next_followup_at),todayKey=parisDateKey(now);
  const diff=Math.round((dateNumber(targetKey)-dateNumber(todayKey))/86400000);
  return {
    bucket:diff<0?'overdue':diff===0?'today':'future',
    terminal:false,
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

export function actionStageLabel(quote){
  const step=Number(quote?.followup_step||0);
  return step>=3?'Séquence terminée — décision requise':`Relance ${step+1}/3`;
}
