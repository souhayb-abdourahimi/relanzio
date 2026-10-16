import React,{useEffect,useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import TodayView from './TodayView.jsx';
import'./styles.css';

const fixedNow=new Date('2026-10-16T10:00:00.000Z');
function makeQuotes(count){
  const base=[
    {id:'late',client_name:'Dupont',title:'PAC maison individuelle',amount:4800,status:'open',followup_step:1,next_followup_at:'2026-10-14T07:00:00.000Z'},
    {id:'today',client_name:'Martin',title:'Climatisation salon',amount:2100,status:'open',followup_step:0,next_followup_at:'2026-10-16T15:00:00.000Z'},
    {id:'future',client_name:'Durand',title:'Chauffage',amount:3500,status:'open',followup_step:2,next_followup_at:'2026-10-20T07:00:00.000Z'},
    {id:'terminal',client_name:'Bernard',title:'Rénovation',amount:6200,status:'open',followup_step:3,next_followup_at:null}
  ];
  for(let i=base.length;i<count;i++)base.push({id:'q'+i,client_name:'Client '+i,title:'Devis '+i,amount:1000+i,status:'open',followup_step:i%3,next_followup_at:new Date(fixedNow.getTime()+(i+2)*86400000).toISOString()});
  return base.slice(0,count);
}

function Fixture(){
  const params=new URLSearchParams(location.search),qa=params.get('qa')==='1',count=Math.max(3,Math.min(100,Number(params.get('count')||15)));
  const[quotes,setQuotes]=useState(()=>makeQuotes(count));
  const[preview,setPreview]=useState(null);
  const renderStarted=useMemo(()=>performance.now(),[]);
  const prepare=q=>{document.body.dataset.lastAction='prepare';setPreview({quote:q,step:q.followup_step+1,subject:'Suivi — '+q.title,body:'Message initial'})};
  const postpone=(q,days)=>{document.body.dataset.lastPostpone=String(days);setQuotes(current=>current.map(x=>x.id===q.id?{...x,next_followup_at:'2026-10-19T07:00:00.000Z'}:x))};
  const status=(id,value)=>{document.body.dataset.lastStatus=value;setQuotes(current=>current.map(x=>x.id===id?{...x,status:value}:x))};
  const edit=q=>{document.body.dataset.lastEdit=q.id};

  useEffect(()=>{
    if(!qa)return;
    const visible=el=>{if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
    const setInput=(el,value)=>{const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;setter.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))};
    const later=(fn,ms=120)=>setTimeout(fn,ms);
    later(()=>{
      const text=document.body.textContent||'',cards=[...document.querySelectorAll('.today-card')],noOverflow=document.documentElement.scrollWidth<=window.innerWidth+1;
      const touch=window.innerWidth>760||[...document.querySelectorAll('.today-view button')].filter(visible).every(b=>b.getBoundingClientRect().height>=44);
      const terminalOk=count<4||text.includes('Séquence terminée — décision requise');if(!text.includes('EN RETARD')||!text.includes('AUJOURD’HUI')||!text.includes('À VENIR')||!terminalOk||!cards.length||!noOverflow||!touch){document.body.dataset.p0Qa='fail-layout';return}
      const relancer=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Relancer');relancer?.click();
      later(()=>{
        const modal=document.querySelector('.preview-modal'),ta=modal?.querySelector('textarea'),copy=[...modal?.querySelectorAll('button')||[]].find(x=>x.textContent.trim()==='Copier');
        const confirm=[...modal?.querySelectorAll('button')||[]].find(x=>x.textContent.includes('J’ai envoyé'));
        if(!modal||!ta||!copy||!confirm){document.body.dataset.p0Qa='fail-modal';return}
        setInput(ta,'Message modifié');
        copy.click();
        document.body.dataset.copyOnly='yes';
        if(document.body.dataset.manualConfirmed){document.body.dataset.p0Qa='fail-copy-business';return}
        confirm.click();
        later(()=>{
          const rep=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Repousser');rep?.click();
          later(()=>{
            const plus3=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='+3 jours');plus3?.click();
            const won=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Gagné');won?.click();
            later(()=>{
              const renderMs=Math.round(performance.now()-renderStarted);document.body.dataset.renderMs=String(renderMs);
              const ok=document.body.dataset.copyOnly==='yes'&&document.body.dataset.manualConfirmed==='yes'&&document.body.dataset.lastPostpone==='3'&&document.body.dataset.lastStatus==='won'&&document.documentElement.scrollWidth<=window.innerWidth+1;
              document.body.dataset.p0Qa=ok?'pass':'fail-actions';
            });
          });
        });
      });
    });
  },[qa]);

  return <main className="dash p0-fixture"><TodayView quotes={quotes} now={fixedNow} onPrepare={prepare} onPostpone={postpone} onStatus={status} onEdit={edit}/>
    {preview&&<div className="modal-bg"><div className="modal preview-modal"><span className="step-chip">RELANCE {preview.step}/3</span><h2>Relire avant d’envoyer</h2><label>Objet<input value={preview.subject} onChange={e=>setPreview(p=>({...p,subject:e.target.value}))}/></label><label>Message<textarea className="preview-text" value={preview.body} onChange={e=>setPreview(p=>({...p,body:e.target.value}))}/></label><div className="modal-actions"><button className="btn ghost" onClick={()=>{document.body.dataset.copyOnly='yes'}}>Copier</button><button className="btn ghost" onClick={()=>{document.body.dataset.manualConfirmed='yes';setPreview(null)}}>J’ai envoyé cette relance</button></div></div></div>}
  </main>
}
createRoot(document.getElementById('root')).render(<Fixture/>);
