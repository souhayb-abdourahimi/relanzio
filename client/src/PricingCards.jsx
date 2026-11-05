import React from 'react';
import { FREE_PLAN,PRO_PLAN } from './subscription-display.js';
import { FREE_LIMIT_TEXT, PRO_LIMIT_TEXT, PRO_PRICE_TEXT, TRIAL_DAYS, TRIAL_TEXT, VAT_NOTICE } from '../../shared/plans.js';
import { REPLY_STOP_LIVE } from './claims.js';

export const TRIAL_END_NOTE=`À la fin de l’essai, sans abonnement, le compte repasse en ${FREE_PLAN.name} (${FREE_LIMIT_TEXT}) : rien n’est supprimé.`;

// Public pricing cards (landing + /pricing). Same plan data as the in-app Formules view.
export default function PricingCards({onStart}){
  return <>
    <div className="pricing">
      <article className="price-card"><p>{FREE_PLAN.name}</p><h3>{FREE_PLAN.price}</h3><strong className="price-headline">{FREE_PLAN.headline}</strong><small>sans carte bancaire</small><ul>{FREE_PLAN.features.map(x=><li key={x}>{x}</li>)}</ul><button className="btn ghost full" onClick={onStart}>Commencer gratuitement</button></article>
      <article className="price-card featured"><span className="tag">PRO</span><p>{PRO_PLAN.name}</p><h3>{PRO_PLAN.price}<em> {PRO_PLAN.period}</em></h3><strong className="price-headline">{PRO_PLAN.headline}</strong><small>{VAT_NOTICE}</small><small>abonnement mensuel · sans engagement · résiliation depuis le portail de paiement</small><ul><li>{TRIAL_TEXT}, démarré au premier devis ajouté</li>{PRO_PLAN.features.map(x=><li key={x}>{x}</li>)}</ul><button className="btn full" onClick={onStart}>Relancer mon premier devis</button></article>
    </div>
    <p className="pricing-note">{TRIAL_END_NOTE}</p>
  </>;
}

// Detailed comparison for /pricing. true = included, false = not included, string = value.
export const COMPARISON_ROWS=[
  ['Prix',FREE_PLAN.price,`${PRO_PRICE_TEXT}`],
  ['Devis actifs',`Jusqu’à ${FREE_LIMIT_TEXT}`,`Jusqu’à ${PRO_LIMIT_TEXT}`],
  ['Engagement','Aucun','Mensuel, sans engagement'],
  ['Carte bancaire','Non demandée',`Essai ${TRIAL_DAYS} jours sans carte`],
  ['Ajout d’un devis déjà envoyé en 30 secondes',true,true],
  ['Vue « Aujourd’hui » : qui relancer, et quand',true,true],
  ['3 relances au maximum par devis, jamais le week-end',true,true],
  ['Messages prêts, relus avant l’envoi',true,true],
  ['Email, SMS ou appel en un geste',true,true],
  ['« Le client a répondu » arrête toutes les relances du devis',true,true],
  ...(REPLY_STOP_LIVE?[['Arrêt automatique quand le client répond à un email envoyé par Relanzio',false,true]]:[]),
  ['Historique des relances et des réponses',true,true],
  ['Relanzio envoie la relance en votre nom',false,true],
  ['Lien de désinscription dans chaque email envoyé par Relanzio',false,true],
  ['Données dans l’Union européenne, export et suppression',true,true],
];

function Cell({value}){
  if(value===true)return <span className="cmp-yes">✓<span className="sr-only">Inclus</span></span>;
  if(value===false)return <span className="cmp-no"><span aria-hidden="true">—</span><span className="sr-only">Non inclus</span></span>;
  return <b>{value}</b>;
}

export function PlanComparison(){
  return <div className="plan-compare">
    <div className="table-scroll"><table>
      <caption className="sr-only">Comparatif des formules {FREE_PLAN.name} et {PRO_PLAN.name}</caption>
      <thead><tr><th scope="col">Fonctionnalité</th><th scope="col">{FREE_PLAN.name}</th><th scope="col" className="cmp-pro">{PRO_PLAN.name}</th></tr></thead>
      <tbody>{COMPARISON_ROWS.map(([label,free,pro])=><tr key={label}><th scope="row">{label}</th><td><Cell value={free}/></td><td className="cmp-pro"><Cell value={pro}/></td></tr>)}</tbody>
    </table></div>
    <p className="pricing-note">{PRO_PLAN.name} : {VAT_NOTICE}.</p>
  </div>;
}
