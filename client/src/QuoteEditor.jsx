import React from 'react';

export function QuoteEditor({form,setForm,editing=false,profile={},saving=false,onSubmit}){
  const set=(key,value)=>setForm(current=>({...current,[key]:value}));
  return <form onSubmit={onSubmit} className="quote-editor-form">
    <label>Client<input required maxLength="120" value={form.client_name} onChange={e=>set('client_name',e.target.value)}/></label>
    <label>Email<input type="email" required value={form.client_email} onChange={e=>set('client_email',e.target.value)}/></label>
    <label>Objet<input required maxLength="180" value={form.title} onChange={e=>set('title',e.target.value)}/></label>
    <div className="two">
      <label>Montant (€)<input inputMode="decimal" required value={form.amount} onChange={e=>set('amount',e.target.value)} placeholder="1500,00"/></label>
      <label>Date d’envoi<input type="date" required value={form.sent_at} onChange={e=>set('sent_at',e.target.value)}/></label>
    </div>
    {editing&&<label>Statut<select value={form.status} onChange={e=>set('status',e.target.value)}><option value="open">En attente</option><option value="paused">Pause</option><option value="won">Gagné</option><option value="lost">Perdu</option></select></label>}
    <fieldset className="schedule-field">
      <legend>Prochaine relance</legend>
      <label>Planning<select value={form.followup_schedule_mode} onChange={e=>setForm(current=>({...current,followup_schedule_mode:e.target.value,auto_send:e.target.value==='none'?false:current.auto_send}))}><option value="recommended">Planning recommandé J+2 / J+5 / J+10</option><option value="custom">Choisir une date et une heure</option><option value="none">Aucune relance prévue</option></select></label>
      {form.followup_schedule_mode==='custom'&&<label>Date et heure<input type="datetime-local" required value={form.next_followup_at} onChange={e=>set('next_followup_at',e.target.value)}/></label>}
      <small>{form.followup_schedule_mode==='recommended'?'Relanzio propose les prochaines échéances à partir de la date d’envoi.':form.followup_schedule_mode==='custom'?'Cette date (heure de Paris) reste prioritaire jusqu’à la prochaine relance envoyée.':'Aucune relance automatique ne pourra partir tant que vous ne reprogrammez pas ce devis.'}</small>
    </fieldset>
    {profile.email_mode==='automatic'&&form.status==='open'&&form.followup_schedule_mode!=='none'&&<label className="check"><input type="checkbox" checked={form.auto_send} onChange={e=>set('auto_send',e.target.checked)}/> Autoriser l’envoi automatique pour ce devis</label>}
    <button className="btn full" disabled={saving}>{saving?'Enregistrement…':editing?'Enregistrer':'Créer le suivi'}</button>
  </form>;
}
