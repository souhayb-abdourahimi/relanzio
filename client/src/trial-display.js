import { UPGRADE_LABEL, FREE_ACTIVE_QUOTES_LIMIT } from '../../shared/plans.js';

const day=v=>new Date(v).toLocaleDateString('fr-FR',{timeZone:'Europe/Paris'});

export function trialDisplay(profile={}){
  if(!profile?.trial_active)return {visible:false,label:'',endText:'',upgradeLabel:UPGRADE_LABEL};
  const days=Math.max(1,Number(profile.trial_days_remaining||1));
  const label=`Essai Pro · ${days} jour${days>1?'s':''} restant${days>1?'s':''}`;
  const end=profile.trial_ends_at?day(profile.trial_ends_at):'';
  return {
    visible:true,
    label,
    endText:end?`Fin prévue le ${end}. Vos données restent conservées après l’essai.`:'',
    upgradeLabel:UPGRADE_LABEL
  };
}

// One discreet banner at the top of the app, most urgent state first.
export function accountBanner(profile={},lockedCount=0,activeCount=0){
  const status=profile?.subscription_status;
  if(status==='past_due'&&profile?.in_payment_grace)return {
    kind:'past_due',tone:'warn',
    label:`Paiement refusé : mettez à jour votre carte avant le ${day(profile.payment_grace_ends_at)}.`,
    endText:'Pro reste actif jusque-là ; seul l’envoi automatique est suspendu. Vos devis restent intacts.',
    action:'portal',actionLabel:'Mettre à jour ma carte'
  };
  if(['past_due','unpaid'].includes(status))return {
    kind:'past_due',tone:'warn',
    label:'Paiement non régularisé : votre compte est repassé en formule gratuite.',
    endText:'Mettez à jour votre carte pour retrouver Pro immédiatement. Aucune donnée n’a été supprimée.',
    action:'portal',actionLabel:'Mettre à jour ma carte'
  };
  if(status==='active'&&profile?.subscription_cancel_at_period_end&&profile?.subscription_current_period_end)return {
    kind:'canceling',tone:'info',
    label:`Abonnement résilié : Pro jusqu’au ${day(profile.subscription_current_period_end)}.`,
    endText:'Ensuite, votre compte repasse en formule gratuite, sans perte de données.',
    action:'portal',actionLabel:'Gérer mon abonnement'
  };
  const trial=trialDisplay(profile);
  if(trial.visible){
    // Before the trial ends, say plainly what will become read-only — never a surprise on day 8.
    const over=activeCount-FREE_ACTIVE_QUOTES_LIMIT;
    const endText=over>0&&Number(profile.trial_days_remaining)<=2
      ?`À la fin de l’essai, vos ${FREE_ACTIVE_QUOTES_LIMIT} devis les plus récents restent modifiables ; les ${over} autres passent en lecture seule (gagné, perdu et « le client a répondu » restent possibles).`
      :trial.endText;
    return {kind:'trial',tone:over>0&&Number(profile.trial_days_remaining)<=2?'warn':'info',label:trial.label,endText,action:'upgrade',actionLabel:'Passer à Pro',compact:over<=0||Number(profile.trial_days_remaining)>2};
  }
  if(lockedCount>0)return {
    kind:'locked',tone:'info',
    label:`${lockedCount} devis en lecture seule`,
    endText:`La formule gratuite suit ${FREE_ACTIVE_QUOTES_LIMIT} devis actifs : les plus récents restent modifiables. Marquez un devis gagné ou perdu pour libérer une place, ou passez à Pro.`,
    action:'upgrade',actionLabel:UPGRADE_LABEL
  };
  return {kind:null};
}
