import { UPGRADE_LABEL } from '../../shared/plans.js';
export function trialDisplay(profile={}){
  if(!profile?.trial_active)return {visible:false,label:'',endText:'',upgradeLabel:UPGRADE_LABEL};
  const days=Math.max(1,Number(profile.trial_days_remaining||1));
  const label=`Essai Pro — ${days} jour${days>1?'s':''} restant${days>1?'s':''}`;
  const end=profile.trial_ends_at?new Date(profile.trial_ends_at).toLocaleDateString('fr-FR'):'';
  return {
    visible:true,
    label,
    endText:end?`Fin prévue le ${end}. Vos données restent conservées après l’essai.`:'',
    upgradeLabel:UPGRADE_LABEL
  };
}
