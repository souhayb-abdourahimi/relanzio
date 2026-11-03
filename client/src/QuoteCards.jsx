import React from 'react';
import { nextFollowupLine } from './today.js';

const euro=n=>Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:2})+' €';

export function QuoteCards({quotes=[],onStatus,onPrepare,onEdit,onRemove}){
  return <div className="quote-mobile-list">{quotes.map(q=><article className="quote-mobile-card" key={q.id}>
    <div className="quote-mobile-head"><div><b>{q.client_name}</b><small>{q.client_email||q.client_phone}</small></div><strong>{euro(q.amount)}</strong></div>
    <p className="quote-mobile-title">{q.title}</p>
    <div className="quote-mobile-meta">
      <label>Statut<select aria-label={`Statut ${q.title}`} value={q.status} onChange={e=>onStatus?.(q.id,e.target.value)}><option value="open">En attente</option><option value="paused">Pause</option><option value="won">Gagné</option><option value="lost">Perdu</option></select></label>
      <div><small>Suivi</small><b>{nextFollowupLine(q).replace(/^Prochaine relance : /,'')||'—'}</b></div>
    </div>
    <div className="quote-mobile-actions">{q.locked&&<span className="lock-badge">Lecture seule</span>}{q.status==='open'&&q.followup_step<3&&!q.locked&&!q.reply_received_at&&<button className="mini-btn" onClick={()=>onPrepare?.(q)}>Relancer</button>}{!q.locked&&<button className="mini-btn" onClick={()=>onEdit?.(q)}>Modifier</button>}<button className="mini-btn danger-text" onClick={()=>onRemove?.(q)}>Supprimer</button></div>
  </article>)}</div>;
}
