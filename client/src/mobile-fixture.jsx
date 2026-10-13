import React,{useState}from'react';
import{createRoot}from'react-dom/client';
import MobileAppMenu from './MobileAppMenu.jsx';
import './styles.css';

function Fixture(){
  const[open,setOpen]=useState(false);
  const mark=action=>{document.body.dataset.lastAction=action;setOpen(false)};
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