import React from 'react';
import { followupMessage } from '../../shared/followup-templates.js';
import { TRIAL_DAYS } from '../../shared/plans.js';
import { formatParisWhen, parisDateKey } from './today.js';

// Shown right after the first quote is added: when, how, who — and the exact message. "Je peux arrêter d'y penser."
export default function TrackedConfirmation({quote,profile={},onAddAnother,onClose}){
  const next=quote.next_followup_at;
  const isToday=next&&parisDateKey(next)<=parisDateKey(new Date());
  const channel=quote.client_email?(quote.client_phone?'Email (ou SMS / appel)':'Email'):'SMS ou appel';
  const relanzioSends=profile.pro_access&&quote.client_email;
  const who=relanzioSends?'Vous relisez, Relanzio envoie en un geste':'Vous, avec le message prêt à copier';
  const msg=followupMessage({clientName:quote.client_name,title:quote.title,companyName:profile.company_name},Number(quote.followup_step||0));
  const trialJustStarted=profile.trial_active&&Number(profile.trial_days_remaining)>=TRIAL_DAYS;
  return <div className="tracked" aria-live="polite">
    <span className="step-chip ok-chip">C’EST SUIVI</span>
    <h2>{quote.client_name} : c’est noté. Vous pouvez arrêter d’y penser.</h2>
    <dl className="tracked-facts">
      <div><dt>Première relance</dt><dd>{next?(isToday?'Aujourd’hui — le devis attend depuis un moment':formatParisWhen(next)):'Aucune relance planifiée'}</dd></div>
      <div><dt>Canal</dt><dd>{channel}</dd></div>
      <div><dt>Qui envoie</dt><dd>{who}</dd></div>
    </dl>
    {next&&<details className="tracked-preview"><summary>Voir le message prévu</summary><p className="tracked-subject">{quote.client_email?msg.subject:'SMS'}</p><pre>{msg.body}</pre><small>Vous pourrez le modifier avant chaque relance.</small></details>}
    {profile.capabilities?.reply_detection&&relanzioSends&&<p className="muted">Si votre client répond à une relance envoyée par Relanzio, les relances s’arrêtent et sa réponse vous est transmise.</p>}
    {trialJustStarted&&<p className="muted">Votre essai Pro de {TRIAL_DAYS} jours vient de démarrer, sans carte bancaire.</p>}
    <div className="tracked-actions"><button type="button" className="btn" onClick={onAddAnother}>Ajouter un autre devis</button><button type="button" className="btn ghost" onClick={onClose}>Voir ma journée</button></div>
  </div>;
}
