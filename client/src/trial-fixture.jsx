import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import TrialStatus from './TrialStatus.jsx';
import './styles.css';

function Fixture(){
  const[upgraded,setUpgraded]=useState(false);
  const profile={trial_active:true,trial_days_remaining:7,trial_ends_at:'2026-10-21T00:00:00.000Z'};
  useEffect(()=>{
    const qa=new URLSearchParams(location.search).get('qa')==='1';
    if(!qa)return;
    setTimeout(()=>{
      const banner=document.querySelector('.trial-banner');
      const button=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Passer à Pro');
      const text=banner?.textContent||'';
      const r=button?.getBoundingClientRect();
      const mobile=window.innerWidth<=760;
      const touchOk=!mobile||(r&&r.height>=44);
      const noOverflow=document.documentElement.scrollWidth<=window.innerWidth+1;
      if(!banner||!button||!text.includes('Essai Pro · 7 jours restants')||!text.includes('Fin prévue le 21/10/2026')||!touchOk||!noOverflow){document.body.dataset.trialQa='fail';return}
      button.click();
      setTimeout(()=>{document.body.dataset.trialQa=document.body.dataset.upgraded==='yes'?'pass':'fail-click'},50);
    },80);
  },[]);
  useEffect(()=>{if(upgraded)document.body.dataset.upgraded='yes'},[upgraded]);
  return <main className="dash"><TrialStatus profile={profile} billingEnabled={true} onUpgrade={()=>setUpgraded(true)}/></main>;
}
createRoot(document.getElementById('root')).render(<Fixture/>);