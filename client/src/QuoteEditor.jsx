import React from 'react';
import { effectiveOffsets, cadenceLabel } from '../../shared/followup-cadence.js';
import { parisDateKey } from './today.js';

const daysAgo=n=>parisDateKey(new Date(Date.now()-n*86400000));

export function QuoteEditor({form,setForm,editing=false,profile={},saving=false,error='',onSubmit}){
  const set=(key,value)=>setForm(current=>({...current,[key]:value}));
  const catchUpDays=!editing&&/^\d{4}-\d{2}-\d{2}$/.test(form.sent_at||'')?Math.floor((Date.now()-new Date(form.sent_at+'T12:00:00Z').getTime())/86400000):0;
  return <form onSubmit={onSubmit} className="quote-editor-form">
    <label>Client<input required maxLength="120" value={form.client_name} onChange={e=>set('client_name',e.target.value)}/></label>
    <div className="two">
      <label>Email<input type="email" autoComplete="off" inputMode="email" maxLength="254" value={form.client_email||''} onChange={e=>set('client_email',e.target.value)}/></label>
      <label>Téléphone<input type="tel" autoComplete="off" inputMode="tel" maxLength="40" value={form.client_phone||''} onChange={e=>set('client_phone',e.target.value)} placeholder="06 12 34 56 78"/></label>
    </div>
    <small className="field-hint">Email ou téléphone : au moins l’un des deux.</small>
    <label>Objet<input required maxLength="180" value={form.title} onChange={e=>set('title',e.target.value)}/></label>
    <div className="two">
      <label>Montant (€)<input inputMode="decimal" required value={form.amount} onChange={e=>set('amount',e.target.value)} placeholder="1500,00"/></label>
      <label>Date d’envoi<input type="date" required max={parisDateKey(new Date())} value={form.sent_at} onChange={e=>set('sent_at',e.target.value)}/></label>
    </div>
    {!editing&&<div className="date-chips" role="group" aria-label="Date d’envoi rapide">{[['Aujourd’hui',0],['Hier',1],['Il y a une semaine',7]].map(([label,n])=><button type="button" key={label} className={'chip'+(form.sent_at===daysAgo(n)?' selected':'')} aria-pressed={form.sent_at===daysAgo(n)} onClick={()=>set('sent_at',daysAgo(n))}>{label}</button>)}</div>}
    {catchUpDays>effectiveOffsets(profile)[0]&&form.followup_schedule_mode==='recommended'&&<p className="field-hint catch-up">Envoyé il y a {catchUpDays} jours : la première relance vous est proposée aujourd’hui, sans rattrapage des étapes.</p>}
    <label>Note <span className="optional">(facultatif)</span><textarea className="note-input" maxLength="1000" rows="2" value={form.note||''} onChange={e=>set('note',e.target.value)} placeholder="Ex. attend l’accord du conjoint"/></label>
    {editing&&<label>Statut<select value={form.status} onChange={e=>set('status',e.target.value)}><option value="open">En attente</option><option value="paused">Pause</option><option value="won">Gagné</option><option value="lost">Perdu</option></select></label>}
    <fieldset className="schedule-field">
      <legend>Prochaine relance</legend>
      <label>Planning<select value={form.followup_schedule_mode} onChange={e=>setForm(current=>({...current,followup_schedule_mode:e.target.value,auto_send:e.target.value==='none'?false:current.auto_send}))}><option value="recommended">Planning recommandé {cadenceLabel(profile.followup_offsets)}</option><option value="custom">Choisir une date et une heure</option><option value="none">Aucune relance prévue</option></select></label>
      {form.followup_schedule_mode==='custom'&&<label>Date et heure<input type="datetime-local" required value={form.next_followup_at} onChange={e=>set('next_followup_at',e.target.value)}/></label>}
      <small>{form.followup_schedule_mode==='recommended'?`Première relance ${effectiveOffsets(profile)[0]} jours après l’envoi, puis chaque relance est calculée à partir de la précédente.`:form.followup_schedule_mode==='custom'?'Cette date (heure de Paris) reste prioritaire jusqu’à la prochaine relance envoyée.':'Aucune relance ne sera proposée tant que vous ne reprogrammez pas ce devis.'}</small>
    </fieldset>
    {profile.capabilities?.automatic_sending&&profile.email_mode==='automatic'&&form.status==='open'&&form.followup_schedule_mode!=='none'&&Boolean(form.client_email)&&<label className="check"><input type="checkbox" checked={form.auto_send} onChange={e=>set('auto_send',e.target.checked)}/> Relanzio envoie les relances de ce devis automatiquement</label>}
    {error&&<div className="error" role="alert">{error}</div>}
    <button className="btn full" disabled={saving}>{saving?'Enregistrement…':editing?'Enregistrer':'Créer le suivi'}</button>
  </form>;
}
