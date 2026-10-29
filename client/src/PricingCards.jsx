import React from 'react';
import { FREE_PLAN,PRO_PLAN } from './subscription-display.js';
import { TRIAL_TEXT } from '../../shared/plans.js';

// Public pricing cards (landing + /pricing). Same plan data as the in-app Formules view.
export default function PricingCards({onStart}){
  return <div className="pricing">
    <article className="price-card"><p>Découverte</p><h3>{FREE_PLAN.price}</h3><small>sans carte bancaire</small><ul>{FREE_PLAN.features.map(x=><li key={x}>{x}</li>)}</ul><button className="btn ghost full" onClick={onStart}>Commencer</button></article>
    <article className="price-card featured"><span className="tag">PRO</span><p>Automatisation</p><h3>{PRO_PLAN.price}<em> {PRO_PLAN.period}</em></h3><small>{PRO_PLAN.vatNote}</small><small>abonnement mensuel récurrent · sans engagement de durée minimale · résiliation depuis le portail client</small><ul><li>{TRIAL_TEXT}, démarré au premier devis ajouté</li>{PRO_PLAN.features.map(x=><li key={x}>{x}</li>)}</ul><button className="btn full" onClick={onStart}>Créer mon compte</button></article>
  </div>;
}
