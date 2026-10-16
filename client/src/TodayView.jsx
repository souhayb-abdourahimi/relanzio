import React,{useMemo,useState} from 'react';
import { buildTodayGroups, actionStageLabel } from './today.js';
import { formatParisDateTime } from './date-time.js';

const money=n=>Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:2})+' €';

function QuoteActionCard({quote,onPrepare,onPostpone,onStatus,onEdit}){
  const[postponeOpen,setPostponeOpen]=useState(false);
  const meta=quote.action_meta||{};
  const timing=meta.terminal
    ?'Décision à prendre'
    :meta.daysOverdue>0
      ?`${meta.daysOverdue} jour${meta.daysOverdue>1?'s':''} de retard`
      :formatParisDateTime(quote.next_followup_at);
  return <article className={"today-card"+(meta.terminal?' terminal':'')}>
    <div className="today-card-main">
      <div className="today-card-title"><b>{quote.client_name}</b><span>{money(quote.amount)}</span></div>
      <p>{quote.title}</p>
      <div className="today-card-meta"><strong>{actionStageLabel(quote)}</strong><span>{timing}</span><span>{quote.status==='open'?'En attente':quote.status}</span></div>
    </div>
    <div className="today-card-actions">
      {!meta.terminal&&<button className="mini-btn primary-action" onClick={()=>onPrepare?.(quote)}>Relancer</button>}
      <button className="mini-btn" aria-expanded={postponeOpen} onClick={()=>setPostponeOpen(x=>!x)}>{meta.terminal?'Nouvelle date':'Repousser'}</button>
      <button className="mini-btn" onClick={()=>onStatus?.(quote.id,'won')}>Gagné</button>
      <button className="mini-btn" onClick={()=>onStatus?.(quote.id,'lost')}>Perdu</button>
      <button className="mini-btn" onClick={()=>onStatus?.(quote.id,'paused')}>Pause</button>
    </div>
    {postponeOpen&&<div className="postpone-menu" role="group" aria-label={"Repousser "+quote.title}>
      {!meta.terminal&&<>
        <button className="mini-btn" onClick={()=>{onPostpone?.(quote,1);setPostponeOpen(false)}}>+1 jour</button>
        <button className="mini-btn" onClick={()=>{onPostpone?.(quote,3);setPostponeOpen(false)}}>+3 jours</button>
        <button className="mini-btn" onClick={()=>{onPostpone?.(quote,7);setPostponeOpen(false)}}>+1 semaine</button>
      </>}
      <button className="mini-btn" onClick={()=>{onEdit?.(quote);setPostponeOpen(false)}}>Choisir une date</button>
      {!meta.terminal&&<button className="mini-btn" onClick={()=>{onPostpone?.(quote,null);setPostponeOpen(false)}}>Aucune relance</button>}
    </div>}
  </article>;
}

function Group({title,quotes,empty,onPrepare,onPostpone,onStatus,onEdit,limit}){
  const shown=limit?quotes.slice(0,limit):quotes;
  return <section className="today-group">
    <div className="today-group-head"><h3>{title}</h3><span>{quotes.length}</span></div>
    {shown.length?<div className="today-list">{shown.map(q=><QuoteActionCard key={q.id} quote={q} onPrepare={onPrepare} onPostpone={onPostpone} onStatus={onStatus} onEdit={onEdit}/>)}</div>:<p className="today-empty">{empty}</p>}
    {limit&&quotes.length>shown.length&&<p className="today-more">+ {quotes.length-shown.length} autre{quotes.length-shown.length>1?'s':''} à venir dans le pipeline.</p>}
  </section>;
}

export default function TodayView({quotes=[],onPrepare,onPostpone,onStatus,onEdit,now=new Date()}){
  const groups=useMemo(()=>buildTodayGroups(quotes,now),[quotes,now instanceof Date?now.getTime():String(now)]);
  const actionCount=groups.overdue.length+groups.today.length;
  return <section className="today-view" id="today" aria-labelledby="today-title">
    <div className="today-view-head"><div><span className="overline">LISTE DE DÉCISIONS DU JOUR</span><h2 id="today-title">Aujourd’hui · {actionCount} action{actionCount>1?'s':''}</h2></div><p>Ouvrez, agissez, passez au dossier suivant.</p></div>
    <Group title="EN RETARD" quotes={groups.overdue} empty="Aucun retard." onPrepare={onPrepare} onPostpone={onPostpone} onStatus={onStatus} onEdit={onEdit}/>
    <Group title="AUJOURD’HUI" quotes={groups.today} empty="Rien d’autre à traiter aujourd’hui." onPrepare={onPrepare} onPostpone={onPostpone} onStatus={onStatus} onEdit={onEdit}/>
    <Group title="À VENIR" quotes={groups.future} limit={8} empty="Aucune prochaine relance planifiée." onPrepare={onPrepare} onPostpone={onPostpone} onStatus={onStatus} onEdit={onEdit}/>
  </section>;
}
