export function trialDisplay(profile={}){
  if(!profile?.trial_active)return {visible:false,label:'',endText:'',upgradeLabel:'Passer à Pro — 29 €/mois'};
  const days=Math.max(1,Number(profile.trial_days_remaining||1));
  const label=`Essai Pro — ${days} jour${days>1?'s':''} restant${days>1?'s':''}`;
  const end=profile.trial_ends_at?new Date(profile.trial_ends_at).toLocaleDateString('fr-FR'):'';
  return {
    visible:true,
    label,
    endText:end?`Fin prévue le ${end}. Vos données restent conservées après l’essai.`:'',
    upgradeLabel:'Passer à Pro — 29 €/mois'
  };
}
