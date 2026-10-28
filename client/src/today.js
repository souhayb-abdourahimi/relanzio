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

// Where a quote stands today. A quote whose client answered goes first ("replied"), whatever its date;
// a quote with its 3 follow-ups done and no answer becomes a call to make ("call").
export function actionMeta(quote,now=new Date()){
  if(!quote||!['open','paused'].includes(quote.status))return null;
  const step=Number(quote.followup_step||0),terminal=step>=3;
  if(quote.reply_received_at)return {bucket:'replied',replied:true,terminal:false,step,daysOverdue:0,sortTime:-new Date(quote.reply_received_at).getTime()};
  if(quote.status!=='open')return null;
  if(!quote.next_followup_at){
    return terminal?{bucket:'call',terminal:true,step,daysOverdue:0,sortTime:-Number(quote.amount||0)}:null;
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
  const groups={replied:[],overdue:[],today:[],call:[],future:[]};
  for(const quote of quotes){
    const meta=actionMeta(quote,now);
    if(meta)groups[meta.bucket].push({...quote,action_meta:meta});
  }
  for(const list of Object.values(groups))list.sort((a,b)=>a.action_meta.sortTime-b.action_meta.sortTime);
  return groups;
}

export const TERMINAL_LABEL='3 relances sans réponse : un appel, ou décidez gagné / perdu';

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

// "jeudi 30 oct. à 9 h" — what the artisan reads instead of "J+3".
export function formatParisWhen(value){
  const d=new Date(value);
  if(Number.isNaN(d.getTime()))return '';
  const p=new Intl.DateTimeFormat('fr-FR',{timeZone:TZ,weekday:'long',day:'numeric',month:'short',hour:'numeric',minute:'2-digit',hourCycle:'h23'}).formatToParts(d).reduce((a,x)=>{a[x.type]=x.value;return a},{});
  return `${p.weekday} ${p.day} ${p.month} à ${Number(p.hour)} h${p.minute!=='00'?' '+p.minute:''}`;
}

export const REPLY_LABELS={received:'Réponse reçue',interested:'Intéressé',question:'Question',price:'Prix',delay:'Délai',refusal:'Refus',opt_out:'Ne veut plus de relance',auto_reply:'Réponse automatique',bounce:'Email non distribué',other:'Réponse reçue'};
export const REPLY_CHANNELS={email:'par email',phone:'par téléphone',sms:'par SMS',whatsapp:'par WhatsApp',in_person:'en personne',other:''};

// Latest answer that stopped the sequence (detected by email or reported by the artisan).
export function latestReply(quote){
  const list=(quote?.replies||[]).filter(r=>r.effect==='stop');
  return list.sort((a,b)=>new Date(b.received_at)-new Date(a.received_at))[0]||null;
}

// State of the next follow-up, in the artisan's words.
export function nextFollowupLine(quote){
  if(!quote)return '';
  if(quote.reply_received_at)return 'Relances arrêtées : le client a répondu';
  if(['won','lost'].includes(quote.status))return '';
  if(quote.status==='paused')return 'En pause : aucune relance';
  if(quote.next_followup_at)return `Prochaine relance : ${formatParisWhen(quote.next_followup_at)}`;
  return Number(quote.followup_step||0)>=3?'3 relances faites':'Aucune relance prévue';
}

// Who sends the next follow-up. Automatic only when the server really offers it.
export function senderLine(quote,profile={}){
  if(!quote||quote.reply_received_at||quote.status!=='open'||!quote.next_followup_at)return '';
  if(quote.auto_send&&profile.email_mode==='automatic'&&profile.capabilities?.automatic_sending&&profile.pro_access)return 'Relanzio l’enverra pour vous';
  if(profile.pro_access&&quote.client_email)return 'Vous validez, Relanzio envoie';
  return quote.client_email?'Vous relancez : email, SMS ou appel':'Vous relancez : SMS ou appel';
}
