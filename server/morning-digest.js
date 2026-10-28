import { parisBusinessDate } from './followup-policy.js';
import { signEmailLink, emailLinkUrl } from './email-links.js';
import { lockedQuoteIds } from '../shared/quota.js';
import { hasProAccess } from './entitlements.js';

// Morning digest: a service email (not marketing) sent on Paris business days around 07:30, only to
// accounts that have at least one follow-up or decision due today, at most once per account and day.
const money=n=>Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:0}).replace(/ /g,' ')+' €';
const DAY=86400000;

function parisWeekday(now){
  return new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',weekday:'short'}).format(now);
}
export function isDigestDay(now=new Date()){return !['Sat','Sun'].includes(parisWeekday(now));}

// What needs the artisan today: client replies first (last 7 days), then usable open quotes due today or
// earlier, then quotes whose 3 follow-ups got no answer (a call is advised).
export function digestItems(quotes=[],now=new Date(),proAccess=false){
  const today=parisBusinessDate(now),locked=lockedQuoteIds(quotes,proAccess);
  return quotes.filter(q=>['open','paused'].includes(q.status)).map(q=>{
    if(q.reply_received_at)return now.getTime()-Date.parse(q.reply_received_at)<=7*DAY?{quote:q,kind:'reply',lateDays:0}:null;
    if(q.status!=='open'||locked.has(q.id))return null;
    const step=Number(q.followup_step||0);
    if(!q.next_followup_at)return step>=3?{quote:q,kind:'call',lateDays:0,terminal:true}:null;
    const due=parisBusinessDate(q.next_followup_at);
    if(due>today)return null;
    const lateDays=Math.round((Date.parse(today+'T00:00:00Z')-Date.parse(due+'T00:00:00Z'))/DAY);
    return {quote:q,kind:step>=3?'call':'followup',lateDays,terminal:step>=3};
  }).filter(Boolean).sort((a,b)=>KIND_ORDER[a.kind]-KIND_ORDER[b.kind]||b.lateDays-a.lateDays||Number(b.quote.amount||0)-Number(a.quote.amount||0));
}
const KIND_ORDER={reply:0,followup:1,call:2};
const plural=(n,one,many)=>`${n} ${n>1?many:one}`;

// Very short: the three counts, one link, then the list.
export function buildDigest({profile,items,appUrl,unsubscribeUrl}){
  const by=k=>items.filter(x=>x.kind===k);
  const replies=by('reply'),followups=by('followup'),calls=by('call');
  const atStake=followups.reduce((s,x)=>s+Number(x.quote.amount||0),0);
  const parts=[replies.length&&plural(replies.length,'réponse reçue','réponses reçues'),followups.length&&plural(followups.length,'devis à relancer','devis à relancer'),calls.length&&plural(calls.length,'appel conseillé','appels conseillés')].filter(Boolean);
  const subject=`Aujourd’hui : ${parts.join(' · ')}`;
  const line=({quote,lateDays,kind})=>`• ${quote.client_name} — ${quote.title} (${money(quote.amount)})${kind==='followup'?` · relance ${Number(quote.followup_step||0)+1}/3${lateDays>0?` · en retard de ${lateDays} j`:''}`:''}`;
  const section=(title,list)=>list.length?`${title}\n${list.slice(0,8).map(line).join('\n')}${list.length>8?`\n• … et ${list.length-8} autre${list.length-8>1?'s':''}`:''}`:'';
  const link=`${String(appUrl||'https://relanzio.com').replace(/\/$/,'')}/?from=digest`;
  const text=[`Bonjour${profile.company_name?' '+profile.company_name:''},`,'',`Aujourd’hui :`,...parts.map(p=>`• ${p}`),'',`Voir ma journée : ${link}`,'',
    [section('Réponses reçues',replies),section(`À relancer${atStake?` (${money(atStake)} en jeu)`:''}`,followups),section('À appeler',calls)].filter(Boolean).join('\n\n'),
    '','—','Rappel du matin Relanzio, envoyé les jours ouvrés seulement s’il y a quelque chose à faire.',`Ne plus le recevoir : ${unsubscribeUrl}`,'Vous pouvez aussi le désactiver dans Paramètres.'].join('\n');
  return {subject,text,count:items.length,atStake};
}

export async function runMorningDigest({db,sendEmail,reportError=async()=>{},env=process.env,now=new Date()}){
  if(env.MORNING_DIGEST_ENABLED!=='true')return [{skipped:'morning_digest_disabled'}];
  if(!isDigestDay(now))return [{skipped:'not_a_business_day'}];
  const businessDate=parisBusinessDate(now);
  const {data:profiles,error}=await db.from('profiles').select('*').eq('morning_digest_enabled',true).eq('onboarding_completed',true).limit(2000);
  if(error)throw error;
  const results=[];
  for(const profile of profiles||[]){
    try{
      const {data:quotes,error:qError}=await db.from('quotes').select('id,client_name,title,amount,status,followup_step,next_followup_at,reply_received_at,created_at').eq('user_id',profile.id).in('status',['open','paused']);
      if(qError)throw qError;
      const items=digestItems(quotes||[],now,hasProAccess(profile,now));
      if(!items.length){results.push({user:profile.id,skipped:'nothing_due'});continue;}
      const {error:claimError}=await db.from('digest_sends').insert({user_id:profile.id,business_date:businessDate,action_count:items.length});
      if(claimError){results.push({user:profile.id,skipped:claimError.code==='23505'?'already_sent_today':'claim_failed'});continue;}
      const unsubscribeUrl=emailLinkUrl(signEmailLink('digest_optout',{u:profile.id,e:profile.email},env.EMAIL_LINK_SECRET),env.APP_URL);
      const digest=buildDigest({profile,items,appUrl:env.APP_URL,unsubscribeUrl});
      try{
        await sendEmail({to:profile.email,subject:digest.subject,text:digest.text,tags:['relanzio-digest'],headers:{'List-Unsubscribe':`<${unsubscribeUrl}>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'}});
      }catch(e){
        await db.from('digest_sends').delete().eq('user_id',profile.id).eq('business_date',businessDate);
        throw e;
      }
      await db.from('digest_sends').update({status:'sent',sent_at:new Date().toISOString()}).eq('user_id',profile.id).eq('business_date',businessDate);
      results.push({user:profile.id,sent:true,count:digest.count});
    }catch(e){
      await reportError('digest.send',e,{user_id:profile.id});
      results.push({user:profile.id,error:String(e.message||e)});
    }
  }
  return results;
}
