import React from 'react';
import { FREE_PLAN,PRO_PLAN,subscriptionDisplay } from './subscription-display.js';

function PlanFeatures({items}){return <ul className="app-plan-features">{items.map(item=><li key={item}>{item}</li>)}</ul>}

export default function PlansView({profile,billingEnabled,checkoutBusy=false,onUpgrade,onPortal}){
  const state=subscriptionDisplay(profile,billingEnabled,checkoutBusy);
  const freeCurrent=state.currentPlan==='free';
  const proCurrent=state.currentPlan==='pro';

  return <section className="plans-view" aria-labelledby="plans-title">
    <header className="plans-head">
      <span className="overline">FORMULES / ABONNEMENT</span>
      <h1 id="plans-title">Choisissez la formule adaptée à votre suivi de devis.</h1>
      <p>Deux formules simples, avec des limites explicites et adaptées au volume de suivi.</p>
    </header>

    {state.trial.visible&&<section className="plan-trial-status" aria-label="Statut de l’essai Pro">
      <div>
        <span className="overline">ESSAI PRO ACTIF</span>
        <h2>{state.trial.label}</h2>
        {state.trial.endText&&<p>{state.trial.endText}</p>}
      </div>
      <div className="plan-trial-action">
        <button type="button" className="btn" disabled={state.upgradeDisabled} onClick={onUpgrade}>{state.upgradeLabel}</button>
        {state.upgradeHint&&<small>{state.upgradeHint}</small>}
      </div>
    </section>}

    <div className="app-plans-grid">
      <article className={"app-plan-card"+(freeCurrent?' current':'')} data-plan="free">
        <div className="app-plan-top">
          <div>
            <span className="overline">DÉCOUVERTE</span>
            <h2>{FREE_PLAN.name}</h2>
          </div>
          {freeCurrent&&<span className="current-plan-badge">Formule actuelle</span>}
        </div>
        <div className="app-plan-price"><strong>{FREE_PLAN.price}</strong></div>
        <p className="app-plan-summary">Pour valider le workflow et suivre un petit volume de devis en mode revue.</p>
        <PlanFeatures items={FREE_PLAN.features}/>
        {freeCurrent&&<div className="app-plan-current-note" role="status">Vous utilisez actuellement la formule gratuite.</div>}
      </article>

      <article className={"app-plan-card pro"+(proCurrent?' current':'')} data-plan="pro">
        <div className="app-plan-top">
          <div>
            <span className="overline">PRO</span>
            <h2>{PRO_PLAN.name}</h2>
          </div>
          {proCurrent&&<span className="current-plan-badge">{state.trial.visible?'Essai Pro actif':'Formule actuelle'}</span>}
        </div>
        <div className="app-plan-price"><strong>{PRO_PLAN.price}</strong><span>{PRO_PLAN.period}</span></div>
        <p className="app-plan-summary">Pour envoyer depuis Relanzio et automatiser progressivement le suivi, avec contrôle devis par devis.</p>
        <PlanFeatures items={PRO_PLAN.features}/>
        <div className="app-plan-actions">
          {state.upgradeVisible&&<button type="button" className="btn full app-upgrade-btn" disabled={state.upgradeDisabled} onClick={onUpgrade}>{checkoutBusy?'Ouverture…':state.upgradeLabel}</button>}
          {state.paid&&billingEnabled&&state.stripeManaged&&<button type="button" className="btn ghost full" onClick={onPortal}>Gérer mon abonnement</button>}
          {state.upgradeHint&&state.upgradeVisible&&<p className="app-plan-help">{state.upgradeHint}</p>}
          {state.paid&&<p className="app-plan-help">Votre abonnement Pro est actif.</p>}
        </div>
      </article>
    </div>
  </section>;
}
