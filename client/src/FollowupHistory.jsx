import React from 'react';
import { REPLY_LABELS, REPLY_CHANNELS } from './today.js';

function labelChannel(item){return item.channel==='manual'?'faite par vous':'envoyée par Relanzio'}
function labelDate(value){const d=new Date(value);return Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(d)}

// Follow-ups done and client answers, newest first.
export default function FollowupHistory({items=[],replies=[]}){
  const rows=[
    ...items.filter(x=>['sent','delivered','opened','clicked','bounced'].includes(x.status)).map(x=>({key:'f'+x.id,at:x.sent_at||x.created_at,label:`Relance ${x.step}/3`,detail:labelChannel(x)})),
    ...replies.map(r=>({key:'r'+r.id,at:r.received_at,label:REPLY_LABELS[r.category]||'Réponse reçue',detail:r.source==='manual'?`signalée par vous ${REPLY_CHANNELS[r.channel]||''}`.trim():'réponse du client',reply:true,excerpt:r.excerpt}))
  ].sort((a,b)=>new Date(b.at)-new Date(a.at));
  return <section className="followup-history" aria-label="Historique des relances">
    <h3>Historique</h3>
    {rows.length?rows.map(row=><div className={'followup-history-row'+(row.reply?' is-reply':'')} key={row.key}><span>{labelDate(row.at)}</span><b>{row.label}</b><em>{row.detail}</em>{row.excerpt&&<p className="history-excerpt">« {row.excerpt} »</p>}</div>):<p className="muted">Aucune relance enregistrée.</p>}
  </section>;
}
