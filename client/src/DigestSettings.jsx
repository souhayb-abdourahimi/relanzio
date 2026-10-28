import React,{useState} from 'react';

// Three honest states: available + on, available + off, not available on this server (never shown as "activé").
export default function DigestSettings({profile,onSave}){
  const[busy,setBusy]=useState(false);
  const[err,setErr]=useState('');
  const available=Boolean(profile.capabilities?.morning_digest);
  const enabled=profile.morning_digest_enabled!==false;
  async function toggle(){
    setBusy(true);setErr('');
    try{await onSave(!enabled);}catch(e){setErr(e.message);}finally{setBusy(false);}
  }
  return <section className="panel">
    <span className="overline">RAPPEL DU MATIN</span>
    <h2>Un email à 7 h 30, seulement s’il y a quelque chose à faire</h2>
    {available?<>
      <p className="muted">Les jours ouvrés : les réponses reçues, les devis à relancer et les appels conseillés, avec un lien vers votre journée. Rien n’est envoyé les jours sans action.</p>
      <label className="check switch-row"><input type="checkbox" role="switch" checked={enabled} disabled={busy} onChange={toggle}/> {enabled?'Rappel du matin activé':'Rappel du matin désactivé'}</label>
    </>:<p className="muted unavailable-note">Pas encore disponible : aucun rappel n’est envoyé pour le moment. Votre journée reste visible ici, dans « Aujourd’hui ».</p>}
    {err&&<div className="error">{err}</div>}
  </section>;
}
