import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import{QuoteEditor}from'./QuoteEditor.jsx';
import{QuoteCards}from'./QuoteCards.jsx';
import{parisLocalDateTimeToIso,isoToParisLocalDateTime}from'./date-time.js';
import'./styles.css';

const initial={
  client_name:"Élodie d’Azur — Menuiserie & Rénovation",
  client_email:"elodie+devis@example.fr",
  title:"Rénovation complète — fenêtres, volets & porte d’entrée 🪟",
  amount:"99999,99",
  sent_at:"2026-10-14",
  status:"open",
  followup_schedule_mode:"recommended",
  next_followup_at:"",
  auto_send:false
};
const quotes=[{
  id:"q1",client_name:initial.client_name,client_email:initial.client_email,title:initial.title,
  amount:99999.99,status:"open",followup_step:0,followup_schedule_mode:"custom",
  next_followup_at:"2026-10-20T08:30:00.000Z"
}];

function Fixture(){
  const qa=new URLSearchParams(location.search).get('qa')==='1';
  const[form,setForm]=useState(initial);
  const[saves,setSaves]=useState(0);
  useEffect(()=>{
    if(!qa)return;
    const later=(fn,ms=120)=>setTimeout(fn,ms);
    later(()=>{
      const root=document.querySelector('.quote-qa-root');
      const modal=document.querySelector('.modal');
      const card=document.querySelector('.quote-mobile-card');
      const schedule=[...document.querySelectorAll('select')].find(x=>x.parentElement?.textContent?.includes('Planning'));
      const touch=[...document.querySelectorAll('button')].every(b=>window.innerWidth>760||b.getBoundingClientRect().height>=44);
      const noOverflow=document.documentElement.scrollWidth<=window.innerWidth+1;
      const mobileCardOk=window.innerWidth>760||Boolean(card&&getComputedStyle(card.parentElement).display!=='none');
      const timezoneOk=parisLocalDateTimeToIso('2026-10-20T10:30')==='2026-10-20T08:30:00.000Z'&&isoToParisLocalDateTime('2026-10-26T09:30:00.000Z')==='2026-10-26T10:30';
      const modalFits=modal&&modal.getBoundingClientRect().width<=window.innerWidth&&modal.getBoundingClientRect().height<=window.innerHeight;
      if(!root||!schedule||!touch||!noOverflow||!mobileCardOk||!modalFits||!timezoneOk){document.body.dataset.quoteQa='fail-layout';return}
      schedule.value='custom';schedule.dispatchEvent(new Event('change',{bubbles:true}));
      later(()=>{
        const dt=document.querySelector('input[type="datetime-local"]');
        if(!dt){document.body.dataset.quoteQa='fail-custom';return}
        dt.value='2026-10-20T10:30';dt.dispatchEvent(new Event('input',{bubbles:true}));dt.dispatchEvent(new Event('change',{bubbles:true}));
        schedule.value='none';schedule.dispatchEvent(new Event('change',{bubbles:true}));
        later(()=>{
          const text=modal.textContent||'';
          const noneOk=!document.querySelector('input[type="datetime-local"]')&&text.includes('Aucune relance automatique');
          const inputs=[...modal.querySelectorAll('input,select')];
          const widthsOk=inputs.every(x=>x.getBoundingClientRect().right<=window.innerWidth+1);
          document.body.dataset.quoteQa=noneOk&&widthsOk&&document.documentElement.scrollWidth<=window.innerWidth+1?'pass':'fail-none';
        });
      });
    });
  },[qa]);
  return <div className="app-shell quote-qa-root"><aside><div className="desktop-sidebar-logo"><a className="logo" href="/">Relanz<span>io</span></a></div></aside><main className="dash">
    <section className="table-card"><div className="table-title"><h2>Pipeline de devis</h2><span>1 au total</span></div><QuoteCards quotes={quotes} onStatus={()=>{}} onPrepare={()=>{}} onEdit={()=>{}} onRemove={()=>{}}/></section>
    <div className="modal-bg"><div className="modal" role="dialog" aria-label="Modifier le devis"><span className="step-chip">MODIFIER</span><h2>Modifier le devis</h2><p>Choisissez librement la prochaine relance.</p><QuoteEditor form={form} setForm={setForm} editing profile={{email_mode:'automatic',pro_access:true}} saving={false} onSubmit={e=>{e.preventDefault();setSaves(x=>x+1)}}/></div></div>
    <output hidden>{saves}</output>
  </main></div>;
}
createRoot(document.getElementById('root')).render(<Fixture/>);