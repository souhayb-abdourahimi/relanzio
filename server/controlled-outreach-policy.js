import { sanitizeText } from './logic.js';

export const COMMERCIAL_STOP_LINE='Si vous préférez ne plus recevoir de message de ma part, dites simplement STOP.';
export const COMMERCIAL_SUBJECTS=Object.freeze(['Question sur vos devis','Suivi de vos devis','Vos devis sans réponse']);
const FORBIDDEN_CLAIMS=['garanti','+30 % de conversion','+30% de conversion','revenu récupéré','illimité','ia autonome'];

export function commercialDailyCap(raw, providerCap=300){
  const provider=Number(providerCap);
  const safeProvider=Number.isInteger(provider)&&provider>0?provider:300;
  const configured=Number(raw);
  if(!Number.isInteger(configured)||configured<1||configured===20)return safeProvider;
  return Math.min(configured,safeProvider);
}

export function isCommercialBusinessWindow(now=new Date()){
  const parts=new Intl.DateTimeFormat('en-GB',{
    timeZone:'Europe/Paris',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'
  }).formatToParts(now);
  const get=t=>parts.find(x=>x.type===t)?.value||'';
  const weekday=get('weekday');
  if(!['Mon','Tue','Wed','Thu','Fri'].includes(weekday))return false;
  const minutes=Number(get('hour'))*60+Number(get('minute'));
  return minutes>=8*60+30&&minutes<18*60;
}

export function renderCommercialJ0(personalization){
  const first=sanitizeText(personalization,320);
  if(!first)throw new Error('COMMERCIAL_PERSONALIZATION_REQUIRED');
  return `Bonjour,

${first}

Je vous contacte car Relanzio aide les entreprises qui travaillent par devis à suivre ceux qui restent sans réponse et à savoir précisément quand relancer.

L’idée est simple : vous voyez les devis à suivre, vous choisissez votre prochaine date de relance, et vous gardez une vue claire jusqu’à la décision du client.

Relanzio propose un essai Pro de 7 jours, sans carte bancaire. Ensuite, la formule Pro est à 29 € / mois.

Si le suivi des devis est un sujet chez vous, je peux vous envoyer le lien.

Bonne journée,
Souhayb
Relanzio
relanzio.com

${COMMERCIAL_STOP_LINE}`;
}

export function renderCommercialJ3({companyName,sector}={}){
  const company=sanitizeText(companyName,160);
  const activity=sanitizeText(sector,160);
  if(!company||!activity)throw new Error('COMMERCIAL_J3_CONTEXT_REQUIRED');
  return `Bonjour,

Je me permets un court suivi de mon message au sujet de ${company} et du suivi des devis dans votre activité de ${activity}.

L’idée de Relanzio est volontairement limitée : rendre visibles les devis en attente et la prochaine relance, sans remplacer votre logiciel actuel.

Je peux toujours vous ouvrir Relanzio Pro gratuitement pendant 7 jours, sans engagement.

Si cela peut vous être utile, je peux simplement vous envoyer l’accès.

Souhayb
Relanzio
relanzio.com

Si vous ne souhaitez plus recevoir de message de ma part, répondez simplement STOP.`;
}

export function validateCommercialJ0({subject,content,personalization}={}){
  const reasons=[];
  if(!COMMERCIAL_SUBJECTS.includes(String(subject||'')))reasons.push('unapproved_subject');
  if(!sanitizeText(personalization,320))reasons.push('missing_personalization');
  const body=String(content||'');
  if(!body.includes(COMMERCIAL_STOP_LINE))reasons.push('missing_stop_line');
  if(!body.includes('7 jours'))reasons.push('missing_trial');
  if(!body.includes('29 € / mois'))reasons.push('missing_price');
  const lower=body.toLowerCase();
  for(const term of FORBIDDEN_CLAIMS)if(lower.includes(term))reasons.push('forbidden_claim_'+term.replace(/\s+/g,'_'));
  return {ok:reasons.length===0,reasons};
}

export function validateCommercialJ3({subject,content,companyName,sector}={}){
  const reasons=[];
  const body=String(content||'');
  if(!String(subject||'').startsWith('Re: '))reasons.push('invalid_followup_subject');
  if(!sanitizeText(companyName,160)||!body.toLowerCase().includes(String(companyName||'').trim().toLowerCase()))reasons.push('missing_company');
  if(!sanitizeText(sector,160)||!body.toLowerCase().includes(String(sector||'').trim().toLowerCase()))reasons.push('missing_sector');
  if(!/\bSTOP\b/i.test(body))reasons.push('missing_stop_line');
  if(!body.includes('7 jours'))reasons.push('missing_trial');
  const lower=body.toLowerCase();
  for(const term of FORBIDDEN_CLAIMS)if(lower.includes(term))reasons.push('forbidden_claim_'+term.replace(/\s+/g,'_'));
  return {ok:reasons.length===0,reasons};
}
