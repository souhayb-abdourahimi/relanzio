import { PRO_PRICE_LABEL, TRIAL_DAYS } from '../shared/plans.js';

// Service emails about the account's own subscription. Not marketing: no opt-in required,
// but every send is gated by BILLING_EMAILS_ENABLED and claimed once per (user, type).
const appLink=(appUrl,query='')=>`${String(appUrl||'https://relanzio.com').replace(/\/$/,'')}/${query}`;
const signature='\n\n— Relanzio\nUne question ? Répondez simplement à cet email.';

export function trialEndingEmail({appUrl,trialEndsAt}){
  const end=new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',weekday:'long',day:'numeric',month:'long'}).format(new Date(trialEndsAt));
  return {
    subject:'Votre essai Pro se termine dans 2 jours',
    text:`Bonjour,\n\nVotre essai Pro de ${TRIAL_DAYS} jours se termine ${end}.\n\nPour garder Pro (jusqu’à 100 devis actifs, envoi via Relanzio, mode automatique) : ${appLink(appUrl,'?view=plans')}\nPro : ${PRO_PRICE_LABEL}. Sans engagement, résiliable à tout moment.\n\nSans paiement, votre compte repasse simplement en formule gratuite. Aucune donnée n’est supprimée.${signature}`,
  };
}

export function paymentFailedEmail({appUrl}){
  return {
    subject:'Paiement Relanzio refusé : mettez à jour votre carte',
    text:`Bonjour,\n\nLe dernier paiement de votre abonnement Relanzio Pro n’a pas abouti.\n\nPendant ce temps, l’envoi automatique des relances est suspendu. Vos devis et votre historique restent intacts.\n\nMettez à jour votre moyen de paiement depuis Relanzio (Formules / Abonnement → Gérer mon abonnement) : ${appLink(appUrl,'?view=plans')}\n\nDès que le paiement passe, Pro est rétabli automatiquement.${signature}`,
  };
}

// Profiles whose managed trial ends between 24 h and 48 h from now (the "J-2" email), with no Stripe subscription.
export function isTrialEndingSoon(profile,now=new Date()){
  if(!profile?.trial_ends_at||profile.trial_expired_at||profile.stripe_subscription_id)return false;
  if(['active','trialing','past_due'].includes(profile.subscription_status))return false;
  const left=new Date(profile.trial_ends_at).getTime()-now.getTime();
  return left>24*3600e3&&left<=48*3600e3;
}

export async function runTrialEndingReminders({db,sendOnce,env=process.env,now=new Date()}){
  if(env.BILLING_EMAILS_ENABLED!=='true')return [{skipped:'billing_emails_disabled'}];
  const from=new Date(now.getTime()+24*3600e3).toISOString(),to=new Date(now.getTime()+48*3600e3).toISOString();
  const {data,error}=await db.from('profiles').select('*').is('trial_expired_at',null).gt('trial_ends_at',from).lte('trial_ends_at',to).limit(500);
  if(error)throw error;
  const results=[];
  for(const p of data||[]){
    if(!isTrialEndingSoon(p,now))continue;
    results.push({user:p.id,...await sendOnce(p,'trial_ending_j2',trialEndingEmail({appUrl:env.APP_URL,trialEndsAt:p.trial_ends_at}))});
  }
  return results;
}
