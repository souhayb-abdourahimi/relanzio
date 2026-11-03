import React,{useState} from 'react';
import FollowupHistory from './FollowupHistory.jsx';
import { mailtoHref, smsHref, telHref } from './today.js';
import { useDialogKeys } from './use-dialog-keys.js';

// One follow-up, two ways: Relanzio sends it (Pro, client email known, one confirmed gesture), or the artisan
// does it from their own phone/email and records it. "Le client a répondu" stops the sequence from here too.
export default function FollowupModal({preview,profile={},canSendViaRelanzio=false,busy=false,onChange,onCopy,onMarkDone,onSend,onClientReplied,onClose}){
  const ref=useDialogKeys(onClose);
  const[confirming,setConfirming]=useState(false);
  const q=preview.quote||{};
  const message=preview.body||'';
  const mail=mailtoHref(q.client_email,preview.subject,message);
  const sms=smsHref(q.client_phone,message);
  const tel=telHref(q.client_phone);
  const canSend=canSendViaRelanzio&&Boolean(q.client_email);
  const company=profile.company_name||'votre entreprise';
  return <div className="modal-bg" onMouseDown={onClose}>
    <div ref={ref} className="modal preview-modal" role="dialog" aria-modal="true" aria-labelledby="followup-title" onMouseDown={e=>e.stopPropagation()}>
      <button className="close" onClick={onClose} aria-label="Fermer">×</button>
      <span className="step-chip">RELANCE {preview.step}/3</span>
      <h2 id="followup-title">Relancer {q.client_name}</h2>
      <p className="followup-contact">{[q.client_email,q.client_phone].filter(Boolean).join(' · ')}</p>
      {q.note&&<p className="today-card-note"><span>Note</span>{q.note}</p>}
      {q.client_email&&<label>Objet<input maxLength="200" value={preview.subject} onChange={e=>onChange({subject:e.target.value})}/></label>}
      <label>Message<textarea data-autofocus className="preview-text" maxLength="10000" value={message} onChange={e=>onChange({body:e.target.value})}/></label>
      {canSend&&<div className="send-block">
        {confirming
          ?<div className="send-confirm" role="group" aria-label="Confirmer l’envoi">
            <p>Envoyer ce message à <b>{q.client_email}</b> ?</p>
            <div className="send-confirm-actions"><button type="button" className="btn" disabled={busy} onClick={onSend}>{busy?'Envoi…':'Confirmer l’envoi'}</button><button type="button" className="btn ghost" disabled={busy} onClick={()=>setConfirming(false)}>Annuler</button></div>
          </div>
          :<button type="button" className="btn full" disabled={busy} onClick={()=>setConfirming(true)}>Envoyer via Relanzio</button>}
        <p className="muted send-hint">Envoyé au nom de « {company} » via Relanzio. {profile.capabilities?.reply_detection?'Si votre client répond, les relances s’arrêtent et sa réponse vous est transmise par email.':`Votre client vous répond directement${profile.email?` à ${profile.email}`:''}.`}</p>
      </div>}
      <p className="channel-title">{canSend?'Ou relancez vous-même':'Relancez avec votre téléphone ou votre messagerie'}</p>
      <div className="channel-actions">
        <button type="button" className="btn ghost" onClick={onCopy}>Copier</button>
        {mail&&<a className="btn ghost" href={mail}>Ouvrir dans mon email</a>}
        {sms&&<a className="btn ghost" href={sms}>SMS</a>}
        {tel&&<a className="btn ghost" href={tel}>Appeler</a>}
      </div>
      <div className="modal-actions">
        <button type="button" className={canSend?'btn ghost':'btn'} disabled={busy} onClick={onMarkDone}>{busy&&!canSend?'Enregistrement…':'J’ai relancé moi-même'}</button>
      </div>
      <p className="muted">Copier ou ouvrir votre messagerie n’enregistre rien. Une fois votre email, SMS ou appel fait, touchez « J’ai relancé moi-même » : la relance suivante est planifiée à partir d’aujourd’hui.</p>
      {!canSendViaRelanzio&&q.client_email&&<p className="pro-hint">Avec Pro, Relanzio envoie cette relance pour vous, en un geste.</p>}
      {onClientReplied&&<button type="button" className="link-btn replied-link" disabled={busy} onClick={()=>onClientReplied(q)}>Le client a déjà répondu ? Arrêter les relances de ce devis</button>}
      <FollowupHistory items={q.followups||[]} replies={q.replies||[]}/>
    </div>
  </div>;
}
