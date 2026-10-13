import React from 'react';

export default function MobileAppMenu({open,onToggle,onClose,onNavigate,onLogout}){
  return <>
    <div className="mobile-app-header">
      <a className="logo" href="/" aria-label="Relanzio accueil">Relanz<span>io</span></a>
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label={open?'Fermer le menu':'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls="mobile-app-menu"
        onClick={onToggle}
      >
        <span aria-hidden="true">{open?'×':'☰'}</span>
      </button>
    </div>
    {open&&<div className="mobile-drawer-backdrop" onMouseDown={onClose}>
      <section
        id="mobile-app-menu"
        className="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de l’application"
        onMouseDown={e=>e.stopPropagation()}
      >
        <div className="mobile-drawer-head">
          <b>Menu</b>
          <button type="button" className="mobile-drawer-close" aria-label="Fermer le menu" onClick={onClose}>×</button>
        </div>
        <nav className="mobile-drawer-nav" aria-label="Navigation mobile">
          <button type="button" onClick={()=>onNavigate('dashboard')}>Tableau de bord</button>
          <button type="button" onClick={()=>onNavigate('quotes')}>Devis</button>
          <button type="button" onClick={()=>onNavigate('billing')}>Formules / Abonnement</button>
          <button type="button" onClick={()=>onNavigate('support')}>Support</button>
          <button type="button" onClick={()=>onNavigate('settings')}>Paramètres</button>
          <button type="button" className="mobile-logout" onClick={onLogout}>Déconnexion</button>
        </nav>
      </section>
    </div>}
  </>;
}
