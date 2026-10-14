import React from 'react';
import { trialDisplay } from './trial-display.js';

export default function TrialStatus({profile,billingEnabled,onUpgrade}){
  const display=trialDisplay(profile);
  if(!display.visible)return null;
  return <section className="trial-banner" role="status" aria-label="Statut de l’essai Pro">
    <div>
      <strong>{display.label}</strong>
      {display.endText&&<span>{display.endText}</span>}
    </div>
    <div className="trial-actions">
      <button type="button" className="btn small" disabled={!billingEnabled} onClick={onUpgrade}>{display.upgradeLabel}</button>
      {!billingEnabled&&<small>La conversion payante sera disponible lorsque la facturation publique sera activée.</small>}
    </div>
  </section>;
}
