import { FREE_LIMIT_TEXT, PRO_PRICE_TEXT, TRIAL_DAYS } from '../../shared/plans.js';

// SEO metadata for every public route: used in the browser (pageMeta) and by the build-time prerender.
export const SITE_URL='https://relanzio.com';
export const OG_IMAGE='/og-image.png';

export const ROUTE_META=Object.freeze({
  '/':{title:'Relanzio — Chaque matin, les devis à relancer',description:'Ajoutez vos devis envoyés en 30 secondes. Relanzio vous dit qui relancer aujourd’hui et prépare le message. Votre logiciel de devis ne change pas.'},
  '/pricing':{title:'Tarifs — Relanzio',description:`Gratuit jusqu’à ${FREE_LIMIT_TEXT}. Pro à ${PRO_PRICE_TEXT}, essai ${TRIAL_DAYS} jours sans carte bancaire, sans engagement.`},
  '/docs':{title:'Documentation — Relanzio',description:'Le fonctionnement de Relanzio en quelques étapes : ajouter un devis, relancer, repousser, décider.'},
  '/faq':{title:'Questions fréquentes — Relanzio',description:'Logiciel de devis, relances par téléphone, emails, données, export : les réponses avant de commencer.'},
  '/contact':{title:'Contact — Relanzio',description:'Écrire à l’équipe Relanzio pour une question produit, compte ou facturation.'},
  '/legal':{title:'Mentions légales — Relanzio',description:'Éditeur, hébergeurs et contact de Relanzio.'},
  '/privacy':{title:'Politique de confidentialité — Relanzio',description:'Données personnelles traitées par Relanzio, sous-traitants et droits.'},
  '/dpa':{title:'Accord de traitement des données (DPA) — Relanzio',description:'Conditions de sous-traitance des données des clients des utilisateurs de Relanzio.'},
  '/terms':{title:'Conditions générales — Relanzio',description:'Conditions générales d’utilisation et de vente B2B de Relanzio.'},
  '/logiciel-relance-devis':{title:'Logiciel de relance de devis : méthode et outils — Relanzio',description:'Une méthode simple pour savoir quoi relancer, quand, et quand arrêter.'},
  '/relance-devis-agence':{title:'Relance de devis pour agences — Relanzio',description:'Pour les agences web, design et marketing qui ne veulent pas déployer un CRM lourd.'},
  '/modele-email-relance-devis':{title:'Modèles d’email de relance de devis — Relanzio',description:'Des structures courtes à adapter à votre contexte, sans fausse urgence.'},
});
export const PRERENDER_ROUTES=Object.freeze(Object.keys(ROUTE_META));

// Keeps <head> in sync on client-side navigation. Never called during prerender (effects only).
export function pageMeta(title,description,path=location.pathname,robots='index,follow'){
  document.title=title;
  const set=(selector,attr,value,make)=>{let el=document.querySelector(selector);if(!el){el=make();document.head.appendChild(el);}el.setAttribute(attr,value);};
  const meta=(key,value,prop=false)=>set(`meta[${prop?'property':'name'}="${key}"]`,'content',value,()=>{const m=document.createElement('meta');m.setAttribute(prop?'property':'name',key);return m;});
  meta('description',description);meta('robots',robots);
  meta('og:title',title,true);meta('og:description',description,true);meta('og:url',SITE_URL+path,true);
  set('link[rel="canonical"]','href',SITE_URL+path,()=>{const l=document.createElement('link');l.rel='canonical';return l;});
}
export function routeMeta(path){
  const m=ROUTE_META[path]||ROUTE_META['/'];
  pageMeta(m.title,m.description,ROUTE_META[path]?path:'/');
}
export async function track(event,path=location.pathname){try{await fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,path})});}catch{}}
