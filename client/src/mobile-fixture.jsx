import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import MobileAppMenu from './MobileAppMenu.jsx';
import PlansView from './PlansView.jsx';
import './styles.css';

function Fixture(){
  const qa=new URLSearchParams(location.search).get('qa')==='1';
  const[open,setOpen]=useState(qa);
  const[view,setView]=useState('dashboard');
  const profile={plan:'free',subscription_status:'none',pro_access:false,is_paid_subscription:false,trial_active:false};
  const navigate=action=>{setView(action==='billing'?'plans':action);document.body.dataset.lastAction=action;setOpen(false)};
  const logout=()=>{document.body.dataset.lastAction='logout';setOpen(false)};

  useEffect(()=>{
    if(!qa)return;
    const visible=el=>{if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
    const tapOk=el=>{const r=el?.getBoundingClientRect();return !!r&&r.width>=44&&r.height>=44};
    const later=(fn,ms=100)=>setTimeout(fn,ms);
    later(()=>{
      const toggle=document.querySelector('.mobile-menu-toggle');
      const billing=[...document.querySelectorAll('.mobile-drawer-nav button')].find(x=>x.textContent.trim()==='Formules / Abonnement');
      const logoutButton=[...document.querySelectorAll('.mobile-drawer-nav button')].find(x=>x.textContent.trim()==='Déconnexion');
      const noOverflow=document.documentElement.scrollWidth<=window.innerWidth+1;
      if(!visible(toggle)||!visible(billing)||!visible(logoutButton)||!tapOk(toggle)||!tapOk(billing)||!tapOk(logoutButton)||!noOverflow){document.body.dataset.mobileQa='fail-visible';return}
      billing.click();
      later(()=>{
        const planCards=document.querySelectorAll('.app-plan-card');
        if(document.body.dataset.lastAction!=='billing'||document.querySelector('[role="dialog"]')||planCards.length!==2){document.body.dataset.mobileQa='fail-billing';return}
        toggle.click();
        later(()=>{
          const logout2=[...document.querySelectorAll('.mobile-drawer-nav button')].find(x=>x.textContent.trim()==='Déconnexion');
          if(!visible(logout2)){document.body.dataset.mobileQa='fail-reopen';return}
          logout2.click();
          later(()=>{
            if(document.body.dataset.lastAction!=='logout'||document.querySelector('[role="dialog"]')){document.body.dataset.mobileQa='fail-logout';return}
            document.body.dataset.mobileQa='pass';
          });
        });
      });
    });
  },[qa]);

  return <div className="app-shell">
    <aside>
      <div className="desktop-sidebar-logo"><a className="logo" href="/">Relanz<span>io</span></a></div>
      <MobileAppMenu open={open} onToggle={()=>setOpen(x=>!x)} onClose={()=>setOpen(false)} onNavigate={navigate} onLogout={logout}/>
      <nav className="side-nav" aria-label="Navigation de l’application"><button>⌂ <span>Tableau de bord</span></button></nav>
      <div className="side-bottom"><button className="logout">Déconnexion</button></div>
    </aside>
    <main className="dash">{view==='plans'?<PlansView profile={profile} billingEnabled={false} onUpgrade={()=>{}} onPortal={()=>{}}/>:<h1>Fixture dashboard</h1>}</main>
  </div>;
}
createRoot(document.getElementById('root')).render(<Fixture/>);