import React from 'react';
import { accountBanner } from './trial-display.js';

export default function TrialStatus({profile,billingEnabled,onUpgrade,onPortal,lockedCount=0}){
  const banner=accountBanner(profile,lockedCount);
  if(!banner.kind)return null;
  const portal=banner.action==='portal';
  return <section className={`trial-banner banner-${banner.kind}`} role="status" aria-label="Statut de votre formule">
    <div>
      <strong>{banner.label}</strong>
      {banner.endText&&<span>{banner.endText}</span>}
    </div>
    <div className="trial-actions">
      <button type="button" className="btn small" disabled={!billingEnabled} onClick={portal?onPortal:onUpgrade}>{banner.actionLabel}</button>
      {!billingEnabled&&<small>La gestion de l’abonnement sera disponible lorsque la facturation sera activée.</small>}
    </div>
  </section>;
}
