import { trialDisplay } from './trial-display.js';
import { REPLY_STOP_LIVE } from './claims.js';
import { FREE_ACTIVE_QUOTES_LIMIT,PRO_ACTIVE_QUOTES_LIMIT,PRO_MONTHLY_PRICE,VAT_NOTICE,FREE_LIMIT_TEXT,PRO_LIMIT_TEXT,UPGRADE_LABEL } from '../../shared/plans.js';

// Free and Pro are sold on who does the work, not on the quota.
export const FREE_PLAN = Object.freeze({
  id:'free',
  name:'Gratuit',
  headline:'Vous gardez la main',
  price:'0 €',
  limit:FREE_ACTIVE_QUOTES_LIMIT,
  features:[
    `Jusqu’à ${FREE_LIMIT_TEXT}`,
    'Relanzio vous dit qui relancer, et quand',
    'Messages prêts à copier',
    'Email, SMS ou appel en un geste',
    '« Le client a répondu » arrête tout',
    'Historique des relances et des réponses'
  ]
});

export const PRO_PLAN = Object.freeze({
  id:'pro',
  name:'Pro',
  headline:'Relanzio relance pour vous',
  price:`${PRO_MONTHLY_PRICE} €`,
  period:'/ mois',
  vatNote:VAT_NOTICE,
  limit:PRO_ACTIVE_QUOTES_LIMIT,
  features:[
    'Relanzio envoie la relance en votre nom, en un geste',
    'Séquence de 3 relances au maximum, en jours ouvrés',
    ...(REPLY_STOP_LIVE?['Arrêt automatique dès que le client répond, et sa réponse vous est transmise']:[]),
    'Vous relisez chaque message avant l’envoi',
    'Lien de désinscription dans chaque email',
    `Jusqu’à ${PRO_LIMIT_TEXT}`,
    'Support direct par email ou téléphone'
  ]
});

export function subscriptionDisplay(profile={}, billingEnabled=false, checkoutBusy=false){
  const trial=trialDisplay(profile);
  const currentPlan=profile?.pro_access?'pro':'free';
  const paid=Boolean(profile?.is_paid_subscription || (profile?.plan==='pro' && profile?.subscription_status==='active'));
  const stripeManaged=Boolean(profile?.stripe_customer_id);
  const trialEligible=Boolean(profile?.trial_eligible && !trial.visible && !paid);
  const status=profile?.subscription_status||'none';
  const pastDue=['past_due','unpaid'].includes(status);
  const canceling=status==='active'&&Boolean(profile?.subscription_cancel_at_period_end);
  // Card update, invoices and cancellation live in the Stripe portal, also while a payment is failing.
  const portalVisible=stripeManaged&&['active','past_due','unpaid','canceled'].includes(status);
  const upgradeVisible=!pastDue&&(currentPlan==='free' || trial.visible);
  const upgradeDisabled=!billingEnabled || checkoutBusy || paid;
  let upgradeHint='';
  if(!billingEnabled)upgradeHint='La souscription Pro n’est pas disponible pour le moment. Votre formule actuelle reste active.';
  else if(checkoutBusy)upgradeHint='Ouverture sécurisée du paiement…';
  return {
    currentPlan,
    paid,
    stripeManaged,
    trial,
    trialEligible,
    pastDue,
    canceling,
    portalVisible,
    upgradeVisible,
    upgradeDisabled,
    upgradeHint,
    upgradeLabel:UPGRADE_LABEL
  };
}
