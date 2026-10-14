import { trialDisplay } from './trial-display.js';

export const FREE_PLAN = Object.freeze({
  id:'free',
  name:'Découverte / Gratuit',
  price:'0 €',
  limit:5,
  features:[
    '5 devis actifs',
    'Tableau de bord',
    'Planning J+2 / J+5 / J+10',
    'Mode revue',
    'Préparation et copie des relances'
  ]
});

export const PRO_PLAN = Object.freeze({
  id:'pro',
  name:'Pro',
  price:'29 €',
  period:'/mois',
  limit:100,
  features:[
    '100 devis actifs',
    'Envoi via Relanzio',
    'Mode automatique opt-in devis par devis',
    'Personnalisation IA',
    'Suivi de délivrabilité',
    'Support intégré'
  ]
});

export function subscriptionDisplay(profile={}, billingEnabled=false, checkoutBusy=false){
  const trial=trialDisplay(profile);
  const currentPlan=profile?.pro_access?'pro':'free';
  const paid=Boolean(profile?.is_paid_subscription || (profile?.plan==='pro' && profile?.subscription_status==='active'));
  const stripeManaged=Boolean(profile?.stripe_customer_id);
  const trialEligible=Boolean(profile?.trial_eligible && !trial.visible && !paid);
  const upgradeVisible=currentPlan==='free' || trial.visible;
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
    upgradeVisible,
    upgradeDisabled,
    upgradeHint,
    upgradeLabel:'Passer à Pro — 29 €/mois'
  };
}
