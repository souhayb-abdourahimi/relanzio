import React,{useMemo,useState} from 'react';
import { buildTodayGroups, actionStageLabel, overdueLabel, lastFollowup, formatParisDay, parisDateKey } from './today.js';
import { formatParisDateTime } from './date-time.js';

const money=n=>Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:2})+' €';
const channelLabel=f=>f.channel==='manual'?'faite par vous':'envoyée par Relanzio';

function PostponeMenu({quote,onPostpone,onDone}){
  const[date,setDate]=useState('');
  const go=value=>{onPostpone?.(quote,value);onDone();};
  return <div className="postpone-menu" role="group" aria-label={'Repousser '+quote.title}>
    <button className="mini-btn" onClick={()=>go(1)}>Demain</button>
    <button className="mini-btn" onClick={()=>go(3)}>+3 j</button>
    <button className="mini-btn" onClick={()=>go(7)}>+1 semaine</button>
    <form className="postpone-date" onSubmit={e=>{e.preventDefault();if(date)go(date);}}>
      <label><span className="sr-only">Nouvelle date</span><input type="date" required min={parisDateKey(new Date())} value={date} onChange={e=>setDate(e.target.value)}/></label>
      <button className="mini-btn" disabled={!date}>OK</button>
    </form>
  </div>;
}

function QuoteActionCard({quote,onPrepare,onMarkDone,onPostpone,onStatus,busy}){
  const[open,setOpen]=useState(null);
  const meta=quote.action_meta||{};
  const last=lastFollowup(quote);
  const locked=Boolean(quote.locked);
  const toggle=name=>setOpen(x=>x===name?null:name);
  const timing=meta.daysOverdue>0?overdueLabel(meta.daysOverdue):quote.next_followup_at?formatParisDateTime(quote.next_followup_at):'';
  return <article className={'today-card'+(meta.terminal?' terminal':'')+(meta.daysOverdue>0?' late':'')+(locked?' locked':'')} data-quote-id={quote.id}>
    <div className="today-card-main">
      <div className="today-card-title"><b>{quote.client_name}</b><span>{money(quote.amount)}</span></div>
      <p>{quote.title}</p>
      <div className="today-card-meta"><strong>{actionStageLabel(quote)}</strong>{timing&&<span className={meta.daysOverdue>0?'is-late':''}>{timing}</span>}</div>
      {quote.note&&<p className="today-card-note"><span>Note</span>{quote.note}</p>}
      {last&&<p className="today-card-last">Dernière relance : {formatParisDay(last.sent_at||last.created_at)} · {channelLabel(last)}</p>}
      {locked&&<p className="today-card-lock">Lecture seule : au-delà des devis actifs de la formule gratuite.</p>}
    </div>
    <div className="today-card-actions">
      {!meta.terminal&&!locked&&<button className="mini-btn primary-action" disabled={busy} onClick={()=>onPrepare?.(quote)}>Relancer</button>}
      {!meta.terminal&&!locked&&<button className="mini-btn desk-only" disabled={busy} onClick={()=>onMarkDone?.(quote)}>Relance faite</button>}
      {!locked&&<button className="mini-btn" aria-expanded={open==='postpone'} disabled={busy} onClick={()=>toggle('postpone')}>Repousser</button>}
      <button className="mini-btn mobile-only" aria-expanded={open==='result'} disabled={busy} onClick={()=>toggle('result')}>Résultat</button>
      <span className="desk-only result-buttons">
        <button className="mini-btn" disabled={busy} onClick={()=>onStatus?.(quote.id,'won')}>Gagné</button>
        <button className="mini-btn" disabled={busy} onClick={()=>onStatus?.(quote.id,'lost')}>Perdu</button>
        {!locked&&<button className="mini-btn" disabled={busy} onClick={()=>onStatus?.(quote.id,'paused')}>Pause</button>}
      </span>
    </div>
    {open==='postpone'&&<PostponeMenu quote={quote} onPostpone={onPostpone} onDone={()=>setOpen(null)}/>}
    {open==='result'&&<div className="postpone-menu mobile-only" role="group" aria-label={'Résultat '+quote.title}>
      <button className="mini-btn" onClick={()=>{onStatus?.(quote.id,'won');setOpen(null);}}>Gagné</button>
      <button className="mini-btn" onClick={()=>{onStatus?.(quote.id,'lost');setOpen(null);}}>Perdu</button>
      {!locked&&<button className="mini-btn" onClick={()=>{onStatus?.(quote.id,'paused');setOpen(null);}}>Pause</button>}
    </div>}
  </article>;
}

export default function TodayView({quotes=[],onPrepare,onMarkDone,onPostpone,onStatus,busyId=null,dueOnly=false,onShowAll,now=new Date()}){
  const groups=useMemo(()=>buildTodayGroups(quotes,now),[quotes,now instanceof Date?now.getTime():String(now)]);
  const actionCount=groups.overdue.length+groups.today.length;
  const atStake=[...groups.overdue,...groups.today].reduce((s,q)=>s+Number(q.amount||0),0);
  const actions={onPrepare,onMarkDone,onPostpone,onStatus};
  const card=q=>({...actions,busy:busyId===q.id});
  return <section className="today-view" id="today" aria-labelledby="today-title">
    <div className="today-view-head">
      <div>
        <h2 id="today-title">{actionCount?`${actionCount} relance${actionCount>1?'s':''} aujourd’hui`:'Rien à relancer aujourd’hui'}</h2>
        {actionCount>0&&<p>{money(atStake)} en jeu · en retard d’abord</p>}
      </div>
      {dueOnly&&<button className="filter-chip" onClick={onShowAll}>Filtre : à relancer · <u>Tout afficher</u></button>}
    </div>
    <Group title="EN RETARD" quotes={groups.overdue} empty="Aucun retard." card={card}/>
    <Group title="AUJOURD’HUI" quotes={groups.today} empty="Rien d’autre à traiter aujourd’hui." card={card}/>
    {!dueOnly&&<Group title="À VENIR" quotes={groups.future} limit={8} empty="Aucune prochaine relance planifiée." card={card}/>}
  </section>;
}

function Group({title,quotes,empty,limit,card}){
  const shown=limit?quotes.slice(0,limit):quotes;
  return <section className="today-group">
    <div className="today-group-head"><h3>{title}</h3><span>{quotes.length}</span></div>
    {shown.length?<div className="today-list">{shown.map(q=><QuoteActionCard key={q.id} quote={q} {...card(q)}/>)}</div>:<p className="today-empty">{empty}</p>}
    {limit&&quotes.length>shown.length&&<p className="today-more">+ {quotes.length-shown.length} autre{quotes.length-shown.length>1?'s':''} à venir dans la liste des devis.</p>}
  </section>;
}
