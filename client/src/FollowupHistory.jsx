import React from 'react';

function labelChannel(item){return item.channel==='manual'?'faite par vous':'envoyée par Relanzio'}
function labelDate(value){const d=new Date(value);return Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(d)}

export default function FollowupHistory({items=[]}){
  const rows=[...items].filter(x=>['sent','delivered','opened','clicked','bounced'].includes(x.status)).sort((a,b)=>new Date(b.sent_at||b.created_at)-new Date(a.sent_at||a.created_at));
  return <section className="followup-history" aria-label="Historique des relances">
    <h3>Historique</h3>
    {rows.length?rows.map(item=><div className="followup-history-row" key={item.id}><span>{labelDate(item.sent_at||item.created_at)}</span><b>Relance {item.step}/3</b><em>{labelChannel(item)}</em></div>):<p className="muted">Aucune relance enregistrée.</p>}
  </section>;
}
