import React,{useState} from 'react';
import { effectiveOffsets, normalizeFollowupOffsets, cadenceLabel, DEFAULT_FOLLOWUP_OFFSETS } from '../../shared/followup-cadence.js';

export default function CadenceSettings({profile,onSave}){
  const[values,setValues]=useState(()=>effectiveOffsets(profile).map(String));
  const[msg,setMsg]=useState('');
  const[busy,setBusy]=useState(false);
  const parsed=normalizeFollowupOffsets(values);
  async function submit(e){
    e.preventDefault();
    if(!parsed)return setMsg('Trois délais croissants, par exemple 2, 5 et 10 jours.');
    setBusy(true);setMsg('');
    try{await onSave(parsed);setMsg(`Cadence enregistrée : ${cadenceLabel(parsed)}.`);}catch(err){setMsg(err.message);}finally{setBusy(false);}
  }
  return <section className="panel">
    <span className="overline">CADENCE</span>
    <h2>Quand relancer</h2>
    <p className="muted">Nombre de jours après l’envoi du devis. Chaque relance suivante est calculée à partir du jour où la précédente a été faite.</p>
    <form className="cadence-form" onSubmit={submit}>
      {[0,1,2].map(i=><label key={i}>Relance {i+1}<span className="cadence-input">J+<input inputMode="numeric" pattern="[0-9]*" maxLength="3" value={values[i]} onChange={e=>setValues(v=>v.map((x,j)=>j===i?e.target.value.replace(/\D/g,''):x))}/></span></label>)}
      <button className="btn ghost" disabled={busy||!parsed}>{busy?'Enregistrement…':'Enregistrer'}</button>
    </form>
    <p className="muted" aria-live="polite">{msg||`Par défaut : ${cadenceLabel(DEFAULT_FOLLOWUP_OFFSETS)}.`}</p>
  </section>;
}
