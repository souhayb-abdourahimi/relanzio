import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import MobileAppMenu from './MobileAppMenu.jsx';
import './styles.css';

function Fixture(){
  const qa=new URLSearchParams(location.search).get('qa')==='1';
  const[open,setOpen]=useState(qa);
  const mark=action=>{document.body.dataset.lastAction=action;setOpen(false)};

  useEffect(()=>{
    if(!qa)return;
    const visible=el=>{if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
    const tapOk=el=>{const r=el?.getBoundingClientRect();return !!r&&r.width>=44&&r.height>=44};
    const later=(fn,ms=80)=>setTimeout(fn,ms);
    later(()=>{
      const toggle=document.querySelector('.mobile-menu-toggle');
      const billing=[...document.querySelectorAll('.mobile-drawer-nav button')].find(x=>x.textContent.trim()==='Formules / Abonnement');
      const logout=[...document.querySelectorAll('.mobile-drawer-nav button')].find(x=>x.textContent.trim()==='Déconnexion');
      const noOverflow=document.documentElement.scrollWidth<=window.innerWidth+1;
      if(!visible(toggle)||!visible(billing)||!visible(logout)||!tapOk(toggle)||!tapOk(billing)||!tapOk(logout)||!noOverflow){document.body.dataset.mobileQa='fail-visible';return}
      billing.click();
      later(()=>{
        if(document.body.dataset.lastAction!=='billing'||document.querySelector('[role="dialog"]')){document.body.dataset.mobileQa='fail-billing';return}
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
      <MobileAppMenu open={open} onToggle={()=>setOpen(x=>!x)} onClose={()=>setOpen(false)} onNavigate={mark} onLogout={()=>mark('logout')}/>
      <nav className="side-nav" aria-label="Navigation de l’application"><button>⌂ <span>Tableau de bord</span></button></nav>
      <div className="side-bottom"><button className="logout">Déconnexion</button></div>
    </aside>
    <main className="dash"><h1>Fixture dashboard</h1></main>
  </div>;
}
createRoot(document.getElementById('root')).render(<Fixture/>);