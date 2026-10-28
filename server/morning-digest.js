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

// Quotes needing an action today: open, usable (not read-only), and either due today or earlier,
// or at the end of their sequence without a new date (a decision is expected).
export function digestItems(quotes=[],now=new Date(),proAccess=false){
  const today=parisBusinessDate(now),locked=lockedQuoteIds(quotes,proAccess);
  return quotes.filter(q=>q.status==='open'&&!locked.has(q.id)).map(q=>{
    const step=Number(q.followup_step||0);
    if(!q.next_followup_at)return step>=3?{quote:q,lateDays:0,terminal:true}:null;
    const due=parisBusinessDate(q.next_followup_at);
    if(due>today)return null;
    const lateDays=Math.round((Date.parse(today+'T00:00:00Z')-Date.parse(due+'T00:00:00Z'))/DAY);
    return {quote:q,lateDays,terminal:step>=3};
  }).filter(Boolean).sort((a,b)=>b.lateDays-a.lateDays||Number(b.quote.amount||0)-Number(a.quote.amount||0));
}

export function buildDigest({profile,items,appUrl,unsubscribeUrl}){
  const count=items.length,atStake=items.reduce((s,x)=>s+Number(x.quote.amount||0),0);
  const subject=`${count} relance${count>1?'s':''} aujourd’hui · ${money(atStake)} en jeu`;
  const lines=items.slice(0,15).map(({quote,lateDays,terminal})=>{
    const stage=terminal?'séquence terminée, à décider':`relance ${Number(quote.followup_step||0)+1}/3`;
    return `• ${quote.client_name} — ${quote.title} (${money(quote.amount)}) · ${stage}${lateDays>0?` · en retard de ${lateDays} j`:''}`;
  });
  if(items.length>15)lines.push(`• … et ${items.length-15} autre${items.length-15>1?'s':''}`);
  const link=`${String(appUrl||'https://relanzio.com').replace(/\/$/,'')}/?from=digest`;
  const text=`Bonjour${profile.company_name?' '+profile.company_name:''},\n\nAujourd’hui : ${subject}.\n\n${lines.join('\n')}\n\nOuvrir la vue Aujourd’hui : ${link}\n\nRelanzio prépare chaque message ; rien ne part sans vous en mode revue.\n\n—\nRappel du matin Relanzio, envoyé les jours ouvrés lorsqu’au moins une action est prévue.\nNe plus le recevoir : ${unsubscribeUrl}\nVous pouvez aussi le désactiver dans Paramètres.`;
  return {subject,text,count,atStake};
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
      const {data:quotes,error:qError}=await db.from('quotes').select('id,client_name,title,amount,status,followup_step,next_followup_at,created_at').eq('user_id',profile.id).in('status',['open','paused']);
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
