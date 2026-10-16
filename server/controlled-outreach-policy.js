import { sanitizeText } from './logic.js';

export const COMMERCIAL_STOP_LINE='Si vous préférez ne plus recevoir de message de ma part, dites simplement STOP.';
export const COMMERCIAL_SUBJECTS=Object.freeze(['Question sur vos devis','Suivi de vos devis','Vos devis sans réponse']);
const FORBIDDEN_CLAIMS=['garanti','+30 % de conversion','+30% de conversion','revenu récupéré','illimité','ia autonome'];

export function commercialDailyCap(raw=20){
  const n=Number(raw);
  if(!Number.isInteger(n)||n<1)return 20;
  return Math.min(20,n);
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
