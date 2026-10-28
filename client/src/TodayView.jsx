import React,{useEffect,useMemo,useRef,useState} from 'react';
import { buildTodayGroups, actionStageLabel, overdueLabel, lastFollowup, formatParisDay, parisDateKey, nextFollowupLine, senderLine, latestReply, REPLY_LABELS, REPLY_CHANNELS, telHref } from './today.js';

const money=n=>Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:2})+' €';
const channelLabel=f=>f.channel==='manual'?'faite par vous':'envoyée par Relanzio';
const VISIBLE=5;

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

// Secondary actions behind "⋯": keeps three visible buttons per card.
function MoreMenu({label,items,disabled}){
  const[open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    if(!open)return;
    const close=e=>{if(e.type==='keydown'?e.key==='Escape':!ref.current?.contains(e.target))setOpen(false);};
    document.addEventListener('mousedown',close);document.addEventListener('keydown',close);
    return()=>{document.removeEventListener('mousedown',close);document.removeEventListener('keydown',close);};
  },[open]);
  const shown=items.filter(Boolean);
  if(!shown.length)return null;
  return <div className="more-menu" ref={ref}>
    <button className="mini-btn more-btn" aria-haspopup="true" aria-expanded={open} aria-label={label} title={label} disabled={disabled} onClick={()=>setOpen(x=>!x)}>⋯</button>
    {open&&<div className="more-list" role="menu">{shown.map(item=><button key={item.label} role="menuitem" className={item.danger?'danger-text':''} onClick={()=>{setOpen(false);item.onClick();}}>{item.label}</button>)}</div>}
  </div>;
}

function QuoteActionCard({quote,profile,onPrepare,onPostpone,onStatus,onClientReplied,onResume,onEdit,busy}){
  const[postponing,setPostponing]=useState(false);
  const meta=quote.action_meta||{};
  const last=lastFollowup(quote),reply=latestReply(quote);
  const locked=Boolean(quote.locked);
  const tel=telHref(quote.client_phone);
  const timing=meta.daysOverdue>0?overdueLabel(meta.daysOverdue):meta.bucket==='today'?'aujourd’hui':'';
  const won={label:'Gagné',onClick:()=>onStatus?.(quote.id,'won')},lost={label:'Perdu',onClick:()=>onStatus?.(quote.id,'lost')};
  const replied={label:'Le client a répondu',onClick:()=>onClientReplied?.(quote)};
  const later={label:'Repousser',onClick:()=>setPostponing(x=>!x)};
  const pause=!locked&&quote.status==='open'&&{label:'Mettre en pause',onClick:()=>onStatus?.(quote.id,'paused')};
  const edit=onEdit&&!locked&&{label:'Modifier',onClick:()=>onEdit(quote)};
  const btn=(item,primary)=><button className={'mini-btn'+(primary?' primary-action':'')} disabled={busy} onClick={item.onClick}>{item.label}</button>;
  let main,more;
  if(locked){main=[btn(won),btn(lost)];more=[replied];}
  else if(meta.replied){main=[btn(won,true),btn(lost)];more=[{label:'Relancer plus tard',onClick:later.onClick},{label:'Reprendre les relances',onClick:()=>onResume?.(quote)},edit];}
  else if(meta.terminal){main=[tel?<a className="mini-btn primary-action" href={tel}>Appeler</a>:btn(won,true),btn(tel?won:lost)];more=[tel&&lost,later,replied,edit];}
  else{main=[btn({label:'Relancer',onClick:()=>onPrepare?.(quote)},meta.bucket!=='future'),btn(later)];more=[replied,won,lost,pause,edit];}
  const stage=meta.replied?`${reply?.source==='manual'?'Réponse signalée':'A répondu'} ${formatParisDay(quote.reply_received_at)}`:actionStageLabel(quote);
  return <article className={'today-card'+(meta.terminal?' terminal':'')+(meta.replied?' replied':'')+(meta.daysOverdue>0?' late':'')+(locked?' locked':'')} data-quote-id={quote.id} aria-busy={busy||undefined}>
    <div className="today-card-main">
      <div className="today-card-title"><b>{quote.client_name}</b><span>{money(quote.amount)}</span></div>
      <p className="today-card-subject" title={quote.title}>{quote.title}</p>
      <div className="today-card-meta"><strong>{stage}</strong>{meta.replied&&reply&&<span className="reply-tag">{REPLY_LABELS[reply.category]||'Réponse reçue'}{reply.source==='manual'&&REPLY_CHANNELS[reply.channel]?' · '+REPLY_CHANNELS[reply.channel]:''}</span>}{timing&&<span className={meta.daysOverdue>0?'is-late':''}>{timing}</span>}</div>
      {meta.replied&&reply?.excerpt&&<p className="today-card-reply clamp-2">« {reply.excerpt} »</p>}
      {meta.bucket==='future'&&<p className="today-card-next">{nextFollowupLine(quote)}</p>}
      {!meta.replied&&!meta.terminal&&!locked&&senderLine(quote,profile)&&<p className="today-card-sender">{senderLine(quote,profile)}</p>}
      {quote.note&&<p className="today-card-note clamp-2" title={quote.note}><span>Note</span>{quote.note}</p>}
      {last&&!meta.replied&&<p className="today-card-last">Dernière relance : {formatParisDay(last.sent_at||last.created_at)} · {channelLabel(last)}</p>}
      {locked&&<p className="today-card-lock">Lecture seule : au-delà des devis actifs de la formule gratuite.</p>}
    </div>
    <div className="today-card-actions">
      {main.map((el,i)=><React.Fragment key={i}>{el}</React.Fragment>)}
      <MoreMenu label={'Plus d’actions pour '+quote.client_name} items={more} disabled={busy}/>
    </div>
    {postponing&&<PostponeMenu quote={quote} onPostpone={onPostpone} onDone={()=>setPostponing(false)}/>}
  </article>;
}

const SECTIONS=[
  ['replied','RÉPONSES REÇUES','Les relances de ces devis sont arrêtées : à vous de conclure.'],
  ['overdue','EN RETARD',''],
  ['today','À RELANCER AUJOURD’HUI',''],
  ['call','À APPELER OU DÉCIDER','Trois relances sans réponse : un appel fait souvent la différence.'],
  ['future','PLUS TARD','']
];

export default function TodayView({quotes=[],profile={},onPrepare,onPostpone,onStatus,onClientReplied,onResume,onEdit,busyId=null,hideFuture=false,now=new Date()}){
  const groups=useMemo(()=>buildTodayGroups(quotes,now),[quotes,now instanceof Date?now.getTime():String(now)]);
  const attention=groups.replied.length+groups.overdue.length+groups.today.length+groups.call.length;
  const atStake=[...groups.overdue,...groups.today,...groups.call].reduce((s,q)=>s+Number(q.amount||0),0);
  const card=q=>({profile,onPrepare,onPostpone,onStatus,onClientReplied,onResume,onEdit,busy:busyId===q.id});
  const any=Object.values(groups).some(g=>g.length);
  const summary=[groups.replied.length&&`${groups.replied.length} réponse${groups.replied.length>1?'s':''} reçue${groups.replied.length>1?'s':''}`,atStake>0&&`${money(atStake)} à relancer`].filter(Boolean).join(' · ');
  return <section className="today-view" id="today" aria-labelledby="today-title">
    <div className="today-view-head">
      <div>
        <h2 id="today-title">{attention?`${attention} devis à traiter`:'Rien à traiter aujourd’hui'}</h2>
        {summary&&<p>{summary}</p>}
      </div>
    </div>
    {!any?<p className="today-empty-all">Aucune relance prévue pour l’instant. Chaque devis ajouté apparaît ici le jour où il faut le relancer.</p>:
      SECTIONS.filter(([key])=>groups[key].length&&!(hideFuture&&key==='future')).map(([key,title,hint])=><Group key={key} id={'today-'+key} title={title} hint={hint} quotes={groups[key]} limit={key==='future'?3:VISIBLE} card={card}/>)}
  </section>;
}

function Group({id,title,hint,quotes,limit,card}){
  const[all,setAll]=useState(false);
  const shown=all?quotes:quotes.slice(0,limit);
  const rest=quotes.length-shown.length;
  return <section className="today-group" id={id} aria-label={title}>
    <div className="today-group-head"><h3>{title}</h3><span>{quotes.length}</span></div>
    {hint&&<p className="today-group-hint">{hint}</p>}
    <div className="today-list">{shown.map(q=><QuoteActionCard key={q.id} quote={q} {...card(q)}/>)}</div>
    {rest>0&&<button className="today-more" onClick={()=>setAll(true)}>Voir {rest===1?'l’autre devis':`les ${rest} autres`}</button>}
    {all&&quotes.length>limit&&<button className="today-more" onClick={()=>setAll(false)}>Réduire</button>}
  </section>;
}
