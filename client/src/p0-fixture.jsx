import React,{useEffect,useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import TodayView from './TodayView.jsx';
import FollowupModal from './FollowupModal.jsx';
import'./styles.css';

const fixedNow=new Date('2026-10-16T10:00:00.000Z');
function makeQuotes(count){
  const base=[
    {id:'late',client_name:'Dupont',client_email:'dupont@example.test',client_phone:'06 12 34 56 78',note:'Attend l’accord du conjoint',title:'Réfection toiture garage',amount:4800,status:'open',followup_step:1,next_followup_at:'2026-10-14T07:00:00.000Z',followups:[{id:'f1',step:1,status:'sent',channel:'manual',sent_at:'2026-10-11T08:00:00.000Z'}]},
    {id:'today',client_name:'Martin',client_email:'martin@example.test',title:'Remplacement chauffe-eau',amount:2100,status:'open',followup_step:0,next_followup_at:'2026-10-16T15:00:00.000Z'},
    {id:'future',client_name:'Durand',title:'Chauffage',amount:3500,status:'open',followup_step:2,next_followup_at:'2026-10-20T07:00:00.000Z'},
    {id:'terminal',client_name:'Bernard',title:'Rénovation',amount:6200,status:'open',followup_step:3,next_followup_at:null}
  ];
  for(let i=base.length;i<count;i++)base.push({id:'q'+i,client_name:'Client '+i,title:'Devis '+i,amount:1000+i,status:'open',followup_step:i%3,next_followup_at:new Date(fixedNow.getTime()+(i+2)*86400000).toISOString()});
  return base.slice(0,count);
}

// Worst realistic data for break-ui (dev fixture only): schema limits are client_name 120, title 180,
// note 1000, phone 40, amount 9 999 999 999,99; email has no length limit.
const WORST=[
  {id:'w1',client_name:'SCI Les Jardins de la Méditerranée — Résidence Saint-Jean-de-Védas Bâtiment C (syndic Foncia)',client_email:'bartholomew.fitzgerald@northwind-industries-holdings.example.com',client_phone:'+33 (0)6 12 34 56 78',title:'Réfection complète de la toiture-terrasse, reprise des relevés d’étanchéité, remplacement des évacuations EP et mise en sécurité des accès techniques (lot 3)',amount:9999999999.99,status:'open',followup_step:1,next_followup_at:'2026-09-16T07:00:00.000Z',note:'Le gérant attend la validation de l’assemblée générale prévue en novembre ; rappeler après le 15. Interlocuteur : Mme Wiśniewska-Kowalczyk (comptabilité), joignable le matin uniquement, ne pas appeler le vendredi. Devis comparé avec deux autres entreprises.',followups:[{id:'wf',step:1,status:'sent',channel:'relanzio',sent_at:'2026-09-10T08:00:00.000Z'}]},
  {id:'w2',client_name:'Jo',client_phone:'06 00 00 00 00',title:'Haie',amount:0,status:'open',followup_step:0,next_followup_at:'2026-10-16T08:00:00.000Z'},
  {id:'w3',client_name:'Nguyễn Thị Ánh Tuyết',client_email:'anh.tuyet@example.vn',title:'Pose de 12 m² de carrelage 🧱 salle d’eau',amount:1234567.89,status:'open',followup_step:3,next_followup_at:null},
  {id:'w4',client_name:'Établissements Dupont-Moretti & Fils',client_email:'x@y.fr',title:'Devis n° 2026-10-0001234-RENOVATION-CUISINE-ET-SALLE-DE-BAIN-ETAGE',amount:15,status:'open',followup_step:2,next_followup_at:'2026-10-20T07:00:00.000Z'},
];

function Fixture(){
  const params=new URLSearchParams(location.search),qa=params.get('qa')==='1',count=Math.max(3,Math.min(100,Number(params.get('count')||15)));
  const data=params.get('data')||'demo';
  const[quotes,setQuotes]=useState(()=>data==='worst'?WORST:data==='empty'?[]:data==='one'?makeQuotes(3).slice(0,1):makeQuotes(count));
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
      const terminalOk=count<4||text.includes('Séquence terminée — décidez : gagné, perdu ou repousser');if(!text.includes('EN RETARD')||!text.includes('AUJOURD’HUI')||!text.includes('À VENIR')||!text.includes('en retard de 2 j')||!text.includes('Attend l’accord du conjoint')||!terminalOk||!cards.length||!noOverflow||!touch){document.body.dataset.p0Qa='fail-layout';return}
      const relancer=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Relancer');relancer?.click();
      later(()=>{
        const modal=document.querySelector('.preview-modal'),ta=modal?.querySelector('textarea'),copy=[...modal?.querySelectorAll('button')||[]].find(x=>x.textContent.trim()==='Copier');
        const confirm=[...modal?.querySelectorAll('button')||[]].find(x=>x.textContent.trim()==='Relance faite');
        const channels=['mailto:','sms:','tel:'].every(p=>modal?.querySelector(`a[href^="${p}"]`));
        if(!modal||!ta||!copy||!confirm||!channels){document.body.dataset.p0Qa='fail-modal';return}
        setInput(ta,'Message modifié');
        copy.click();
        document.body.dataset.copyOnly='yes';
        if(document.body.dataset.manualConfirmed){document.body.dataset.p0Qa='fail-copy-business';return}
        confirm.click();
        later(()=>{
          const rep=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Repousser');rep?.click();
          later(()=>{
            const plus3=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='+3 j');plus3?.click();
            later(()=>{const result=[...document.querySelectorAll('button')].filter(visible).find(x=>x.textContent.trim()==='Résultat');result?.click();},40);
            later(()=>{const won=[...document.querySelectorAll('button')].filter(visible).find(x=>x.textContent.trim()==='Gagné');won?.click();},80);
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

  const toggle=<nav className="dev-data-toggle" aria-label="Jeu de données (dev)">{['demo','worst','empty','one'].map(x=><a key={x} href={`?data=${x}`} aria-current={data===x?'page':undefined}>{{demo:'Demo data',worst:'Worst case',empty:'Empty',one:'One'}[x]}</a>)}<a href="?count=100" aria-current={data==='demo'&&count===100?'page':undefined}>100 rows</a></nav>;
  return <main className="dash p0-fixture">{!qa&&toggle}<TodayView quotes={quotes} now={fixedNow} onPrepare={prepare} onPostpone={postpone} onStatus={status} onEdit={edit}/>
    {preview&&<FollowupModal preview={preview} onChange={patch=>setPreview(p=>({...p,...patch}))} onCopy={()=>{document.body.dataset.copyOnly='yes'}} onMarkDone={()=>{document.body.dataset.manualConfirmed='yes';setPreview(null)}} onClose={()=>setPreview(null)}/>}
  </main>
}
createRoot(document.getElementById('root')).render(<Fixture/>);
