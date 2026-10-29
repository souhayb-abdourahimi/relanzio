import React,{useState} from 'react';

export default function DigestSettings({profile,onSave}){
  const[busy,setBusy]=useState(false);
  const[err,setErr]=useState('');
  const enabled=profile.morning_digest_enabled!==false;
  async function toggle(){
    setBusy(true);setErr('');
    try{await onSave(!enabled);}catch(e){setErr(e.message);}finally{setBusy(false);}
  }
  return <section className="panel">
    <span className="overline">RAPPEL DU MATIN</span>
    <h2>Un email à 7 h 30, seulement s’il y a quelque chose à faire</h2>
    <p className="muted">Les jours ouvrés, la liste des relances du jour et le montant en jeu, avec un lien direct vers la vue Aujourd’hui. Rien n’est envoyé les jours sans action.</p>
    <label className="check switch-row"><input type="checkbox" role="switch" checked={enabled} disabled={busy} onChange={toggle}/> {enabled?'Rappel du matin activé':'Rappel du matin désactivé'}</label>
    {err&&<div className="error">{err}</div>}
  </section>;
}
