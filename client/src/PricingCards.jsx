import React from 'react';
import { FREE_PLAN,PRO_PLAN } from './subscription-display.js';
import { TRIAL_TEXT, VAT_NOTICE } from '../../shared/plans.js';

// Public pricing cards (landing + /pricing). Same plan data as the in-app Formules view.
export default function PricingCards({onStart}){
  return <div className="pricing">
    <article className="price-card"><p>{FREE_PLAN.name}</p><h3>{FREE_PLAN.price}</h3><strong className="price-headline">{FREE_PLAN.headline}</strong><small>sans carte bancaire</small><ul>{FREE_PLAN.features.map(x=><li key={x}>{x}</li>)}</ul><button className="btn ghost full" onClick={onStart}>Commencer gratuitement</button></article>
    <article className="price-card featured"><span className="tag">PRO</span><p>{PRO_PLAN.name}</p><h3>{PRO_PLAN.price}<em> {PRO_PLAN.period}</em></h3><strong className="price-headline">{PRO_PLAN.headline}</strong><small>{VAT_NOTICE}</small><small>abonnement mensuel · sans engagement · résiliation depuis le portail de paiement</small><ul><li>{TRIAL_TEXT}, démarré au premier devis ajouté</li>{PRO_PLAN.features.map(x=><li key={x}>{x}</li>)}</ul><button className="btn full" onClick={onStart}>Relancer mon premier devis</button></article>
  </div>;
}
