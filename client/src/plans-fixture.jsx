import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import PlansView from './PlansView.jsx';
import './styles.css';

function Fixture(){
  const params=new URLSearchParams(location.search);
  const qa=params.get('qa')==='1';
  const trial=params.get('trial')==='1';
  const billing=params.get('billing')==='1';
  const eligible=params.get('eligible')==='1';
  const[upgradeClicks,setUpgradeClicks]=useState(0);
  const[trialClicks,setTrialClicks]=useState(0);
  const profile=trial
    ?{plan:'pro',subscription_status:'none',pro_access:true,is_paid_subscription:false,trial_active:true,trial_days_remaining:4,trial_ends_at:'2026-10-18T00:00:00.000Z'}
    :{plan:'free',subscription_status:'none',pro_access:false,is_paid_subscription:false,trial_active:false,trial_eligible:eligible};

  useEffect(()=>{
    if(!qa)return;
    setTimeout(()=>{
      const cards=[...document.querySelectorAll('.app-plan-card')];
      const free=document.querySelector('[data-plan="free"]');
      const pro=document.querySelector('[data-plan="pro"]');
      const button=document.querySelector('.app-upgrade-btn');
      const text=document.querySelector('.plans-view')?.textContent||'';
      const noOverflow=document.documentElement.scrollWidth<=window.innerWidth+1;
      const touchOk=window.innerWidth>760||((button?.getBoundingClientRect().height||0)>=44);
      const fr=free?.getBoundingClientRect(),pr=pro?.getBoundingClientRect();
      const oneColumn=window.innerWidth>760||Boolean(fr&&pr&&pr.top>=fr.bottom-1&&Math.abs(fr.width-pr.width)<2);
      const twoColumns=window.innerWidth<=760||Boolean(fr&&pr&&Math.abs(fr.top-pr.top)<5&&pr.left>fr.left);
      const copyOk=text.includes('Découverte / Gratuit')&&text.includes('0 €')&&text.includes('Pro')&&text.includes('29 €')&&text.includes('5 devis actifs')&&text.includes('100 devis actifs')&&!text.toLowerCase().includes('illimité');
      const billingStateOk=billing?!button?.disabled:button?.disabled;
      const trialOk=!trial||(text.includes('Essai Pro · 4 jours restants')&&text.includes('Fin prévue le 18/10/2026'));
      const eligibleOk=!eligible||(!document.querySelector('.app-trial-btn')&&text.includes('démarre automatiquement à l’ajout de votre premier devis'));
      document.body.dataset.plansQa=cards.length===2&&copyOk&&noOverflow&&touchOk&&oneColumn&&twoColumns&&billingStateOk&&trialOk&&eligibleOk?'pass':'fail';
    },100);
  },[qa,billing,trial]);

  useEffect(()=>{document.body.dataset.upgradeClicks=String(upgradeClicks);document.body.dataset.trialClicks=String(trialClicks)},[upgradeClicks,trialClicks]);
  return <main className="dash"><PlansView profile={profile} billingEnabled={billing} checkoutBusy={false} onUpgrade={()=>setUpgradeClicks(x=>x+1)} onPortal={()=>{}}/></main>;
}
createRoot(document.getElementById('root')).render(<Fixture/>);