import React from 'react';
import { accountBanner } from './trial-display.js';

export default function TrialStatus({profile,billingEnabled,onUpgrade,onPortal,lockedCount=0,activeCount=0}){
  const banner=accountBanner(profile,lockedCount,activeCount);
  if(!banner.kind)return null;
  const portal=banner.action==='portal';
  return <section className={`trial-banner banner-${banner.kind}${banner.compact?' compact':''}${banner.tone==='warn'?' tone-warn':''}`} role="status" aria-label="Statut de votre formule">
    <div>
      <strong>{banner.label}</strong>
      {banner.endText&&<span>{banner.endText}</span>}
    </div>
    <div className="trial-actions">
      {(billingEnabled||!banner.compact)&&<button type="button" className="btn small" disabled={!billingEnabled} onClick={portal?onPortal:onUpgrade}>{banner.actionLabel}</button>}
      {!billingEnabled&&!banner.compact&&<small>La gestion de l’abonnement sera disponible lorsque la facturation sera activée.</small>}
    </div>
  </section>;
}
