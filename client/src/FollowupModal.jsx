import React from 'react';
import FollowupHistory from './FollowupHistory.jsx';
import { mailtoHref, smsHref, telHref } from './today.js';
import { useDialogKeys } from './use-dialog-keys.js';

// Follow-up window: editable message, then the user's own channel (email app, SMS, call)
// and "Relance faite" to record it. Sending through Relanzio stays a separate, Pro-only action.
export default function FollowupModal({preview,canSendViaRelanzio=false,busy=false,onChange,onCopy,onMarkDone,onSend,onClose}){
  const ref=useDialogKeys(onClose);
  const q=preview.quote||{};
  const message=preview.body||'';
  const mail=mailtoHref(q.client_email,preview.subject,message);
  const sms=smsHref(q.client_phone,message);
  const tel=telHref(q.client_phone);
  return <div className="modal-bg" onMouseDown={onClose}>
    <div ref={ref} className="modal preview-modal" role="dialog" aria-modal="true" aria-labelledby="followup-title" onMouseDown={e=>e.stopPropagation()}>
      <button className="close" onClick={onClose} aria-label="Fermer">×</button>
      <span className="step-chip">RELANCE {preview.step}/3</span>
      <h2 id="followup-title">Relancer {q.client_name}</h2>
      <p className="followup-contact">{[q.client_email,q.client_phone].filter(Boolean).join(' · ')}</p>
      {q.note&&<p className="today-card-note"><span>Note</span>{q.note}</p>}
      {q.client_email&&<label>Objet<input maxLength="200" value={preview.subject} onChange={e=>onChange({subject:e.target.value})}/></label>}
      <label>Message<textarea data-autofocus className="preview-text" maxLength="10000" value={message} onChange={e=>onChange({body:e.target.value})}/></label>
      <div className="channel-actions">
        <button type="button" className="btn ghost" onClick={onCopy}>Copier</button>
        {mail&&<a className="btn ghost" href={mail}>Ouvrir dans mon email</a>}
        {sms&&<a className="btn ghost" href={sms}>SMS</a>}
        {tel&&<a className="btn ghost" href={tel}>Appeler</a>}
      </div>
      <div className="modal-actions">
        <button type="button" className="btn" disabled={busy} onClick={onMarkDone}>{busy?'Enregistrement…':'Relance faite'}</button>
        {canSendViaRelanzio&&q.client_email&&<button type="button" className="btn ghost" disabled={busy} onClick={onSend}>Envoyer via Relanzio</button>}
      </div>
      <p className="muted">Copier ou ouvrir votre messagerie ne change rien au suivi. Après votre email, SMS ou appel, touchez « Relance faite » : la prochaine relance est calculée à partir d’aujourd’hui.</p>
      <FollowupHistory items={q.followups||[]}/>
    </div>
  </div>;
}
