import React from 'react';

export default function TrialStatus({profile,billingEnabled,onUpgrade}){
  if(!profile?.trial_active)return null;
  const days=Math.max(1,Number(profile.trial_days_remaining||1));
  const label=`Essai Pro — ${days} jour${days>1?'s':''} restant${days>1?'s':''}`;
  const end=profile.trial_ends_at?new Date(profile.trial_ends_at).toLocaleDateString('fr-FR'):'';
  return <section className="trial-banner" role="status" aria-label="Statut de l’essai Pro">
    <div>
      <strong>{label}</strong>
      {end&&<span>Fin prévue le {end}. Vos données restent conservées après l’essai.</span>}
    </div>
    <div className="trial-actions">
      <button type="button" className="btn small" disabled={!billingEnabled} onClick={onUpgrade}>Passer à Pro — 29 €/mois</button>
      {!billingEnabled&&<small>La conversion payante sera disponible lorsque la facturation publique sera activée.</small>}
    </div>
  </section>;
}
