import React,{useEffect,useState} from 'react';
import TodayView from './TodayView.jsx';
import FollowupModal from './FollowupModal.jsx';
import PricingCards from './PricingCards.jsx';
import LegalPage from './LegalPage.jsx';
import { routeMeta, track } from './public-meta.js';
import { PRO_PRICE_LABEL, TRIAL_DAYS, FREE_LIMIT_TEXT } from '../../shared/plans.js';
import { COMPANY, telLink } from '../../shared/company.js';
import { followupMessage } from '../../shared/followup-templates.js';
import { REPLY_STOP_LIVE } from './claims.js';
import Testimonials from './Testimonials.jsx';

// Public site (landing, pricing, docs, FAQ, contact, resources, legal). Rendered in the browser and
// prerendered to static HTML at build time (scripts/prerender.mjs), so it must not touch window/document
// outside effects and must not depend on the current date.
export const SUPPORT_EMAIL=import.meta.env.VITE_SUPPORT_EMAIL||COMPANY.supportEmail;
export const CONTACT_EMAIL=import.meta.env.VITE_CONTACT_EMAIL||'contact@relanzio.com';
const goSignup=()=>{location.href='/signup';};

export function Logo(){return <a className="logo" href="/" aria-label="Relanzio accueil">Relanz<span>io</span></a>}

export function Header({onStart=goSignup}){
  return <header className="nav container"><Logo/><nav><a href="/#demo">Démo</a><a href="/pricing">Tarifs</a><a href="/faq">FAQ</a><a href="/login">Connexion</a><button className="btn small" onClick={onStart}><span className="cta-long">Créer un compte gratuit</span><span className="cta-short">S’inscrire</span></button></nav></header>;
}

export function Footer(){
  return <footer className="footer container">
    <div><Logo/><p>La relance de devis, sans harceler vos clients.</p><p className="footer-id">Édité par {COMPANY.publisherName}, {COMPANY.legalForm.toLowerCase()} · SIREN {COMPANY.siren} · {COMPANY.city}</p></div>
    <div className="footer-links"><a href="/pricing">Tarifs</a><a href="/faq">FAQ</a><a href="/docs">Documentation</a><a href="/contact">Contact</a><a href={`mailto:${SUPPORT_EMAIL}`}>Support</a><a href="/legal">Mentions légales</a><a href="/privacy">Confidentialité</a><a href="/dpa">DPA</a><a href="/terms">CGU/CGV</a></div>
  </footer>;
}

// Demo without an account: the real Today view with sample data. Dates are fixed so the static
// prerender and the live page show the same thing. Messages come from the real templates.
const DEMO_NOW=new Date('2026-11-03T08:00:00.000Z');
const DEMO_QUOTES=[
  {id:'d0',client_name:'Mme Benali',client_email:'contact@exemple.fr',title:'Salle de bain complète',amount:9400,status:'open',followup_step:1,next_followup_at:null,followup_schedule_mode:'none',reply_received_at:'2026-11-03T07:10:00.000Z',replies:[{id:'r0',source:'email',channel:'email',category:'interested',effect:'stop',excerpt:'Bonjour, c’est d’accord pour nous. Quand pourriez-vous commencer ?',received_at:'2026-11-03T07:10:00.000Z'}],followups:[{id:'f0',step:1,status:'sent',channel:'relanzio',sent_at:'2026-10-30T08:00:00.000Z'}]},
  {id:'d1',client_name:'M. et Mme Garnier',client_phone:'06 00 00 00 01',title:'Réfection toiture garage',amount:4800,status:'open',followup_step:1,next_followup_at:'2026-10-30T08:00:00.000Z',note:'Attend l’accord du conjoint',followups:[{id:'f1',step:1,status:'sent',channel:'manual',sent_at:'2026-10-27T09:00:00.000Z'}]},
  {id:'d2',client_name:'Cabinet Rivière',client_email:'contact@exemple.fr',title:'Mise aux normes tableau électrique',amount:2100,status:'open',followup_step:0,next_followup_at:'2026-11-03T08:00:00.000Z',followups:[]},
  {id:'d3',client_name:'SARL Bâti Sud',client_phone:'06 00 00 00 03',title:'Extension 30 m²',amount:38500,status:'open',followup_step:3,next_followup_at:null,followups:[]},
];
const demoPreview=q=>({quote:q,...followupMessage({clientName:q.client_name,title:q.title,companyName:'Toitures Martin'},q.followup_step)});

export function Demo(){
  const[quotes,setQuotes]=useState(DEMO_QUOTES);
  const[preview,setPreview]=useState(null);
  const[note,setNote]=useState('');
  const update=(id,patch,msg)=>{setQuotes(list=>list.map(x=>x.id===id?{...x,...patch}:x));setPreview(null);setNote(msg);};
  const done=q=>update(q.id,{followup_step:q.followup_step+1,next_followup_at:'2026-11-09T08:00:00.000Z'},'Relance enregistrée. La suivante est planifiée lundi 9 nov. à 9 h.');
  const replied=q=>update(q.id,{reply_received_at:'2026-11-03T08:00:00.000Z',next_followup_at:null,replies:[{id:'m'+q.id,source:'manual',channel:'phone',category:'received',effect:'stop',received_at:'2026-11-03T08:00:00.000Z'}]},'Le client a répondu : plus aucune relance pour ce devis.');
  const decide=(id,status)=>update(id,{status},status==='won'?'Devis marqué gagné.':status==='lost'?'Devis marqué perdu.':'Devis mis en pause.');
  return <div className="demo-phone" id="demo">
    <div className="demo-phone-bar"><b>Aujourd’hui</b><em>DÉMO · DONNÉES D’EXEMPLE</em></div>
    <div className="demo-phone-screen">
      <TodayView quotes={quotes} now={DEMO_NOW} hideFuture profile={{pro_access:false}}
        onPrepare={q=>setPreview(demoPreview(q))}
        onPostpone={q=>update(q.id,{next_followup_at:'2026-11-06T08:00:00.000Z',reply_received_at:null},'Devis repoussé à vendredi.')}
        onClientReplied={replied}
        onResume={q=>update(q.id,{reply_received_at:null,next_followup_at:'2026-11-05T08:00:00.000Z'},'Relances reprises.')}
        onStatus={decide}/>
      <p className="demo-note" aria-live="polite">{note||'Essayez : Relancer, Repousser, ou « ⋯ » → Le client a répondu. Rien n’est envoyé.'}{quotes!==DEMO_QUOTES&&<> <button type="button" className="linklike" onClick={()=>{setQuotes(DEMO_QUOTES);setNote('');}}>Recommencer</button></>}</p>
    </div>
    {preview&&<FollowupModal preview={preview} onChange={patch=>setPreview(p=>({...p,...patch}))} onCopy={()=>setNote('Message copié (démo).')} onMarkDone={()=>done(preview.quote)} onClientReplied={replied} onClose={()=>setPreview(null)}/>}
  </div>;
}

export const FAQ_ITEMS=[
  ['Mes clients verront-ils Relanzio ?','Si vous relancez vous-même, non : le message part de votre téléphone ou de votre messagerie. Si Relanzio envoie pour vous (Pro), l’email porte le nom de votre entreprise « via Relanzio » et contient un lien pour ne plus être relancé.'],
  ['Et si mon client a déjà répondu ?',REPLY_STOP_LIVE?'Si la relance a été envoyée par Relanzio, sa réponse arrête automatiquement la suite et vous est transmise par email. S’il vous a répondu autrement (téléphone, SMS, en personne), touchez « Le client a répondu » : plus aucune relance ne part pour ce devis.':'Touchez « Le client a répondu » : plus aucune relance n’est proposée ni envoyée pour ce devis. Le devis reste dans votre liste pour le marquer gagné ou perdu. Quand Relanzio envoie pour vous, le client vous répond directement dans votre boîte mail.'],
  ['Puis-je relire avant l’envoi ?','Oui, toujours. Chaque relance s’ouvre avec son message, que vous pouvez modifier avant de l’envoyer ou de le copier. Rien ne part sans votre accord.'],
  ['Relanzio risque-t-il de harceler mes clients ?','Non. Trois relances au maximum par devis, espacées (par défaut 2, 5 puis 10 jours après l’envoi) et seulement les jours ouvrés. Tout s’arrête dès que le devis est gagné, perdu, en pause, ou que le client a répondu. Après la troisième relance sans réponse, Relanzio vous propose d’appeler plutôt que d’insister.'],
  ['Je n’ai que le téléphone de mon client.','Ça suffit : l’email est facultatif. Relanzio vous propose le SMS prêt à envoyer depuis votre téléphone, ou le bouton Appeler.'],
  ['Puis-je arrêter une séquence ?','À tout moment, en un geste : Gagné, Perdu, Pause, Repousser ou « Le client a répondu ».'],
  ['Dois-je changer de logiciel de devis ?','Non. Vous faites vos devis comme d’habitude, puis vous ajoutez le devis envoyé dans Relanzio (client, objet, montant, date) en 30 secondes. Relanzio ne crée pas de devis et ne fait pas de facturation.'],
  ['Dois-je connecter Gmail ou ma boîte mail ?','Non. Relanzio n’accède pas à votre boîte mail. Vous relancez depuis votre propre messagerie, ou Relanzio envoie l’email en votre nom (Pro).'],
  ['Où sont stockées mes données ?','Votre compte et vos devis sont stockés dans une base Supabase située dans l’Union européenne (Paris). L’application est servie par Railway (États-Unis) ; Stripe gère le paiement et Brevo l’envoi des emails. La liste complète est dans la politique de confidentialité. Vous pouvez exporter ou supprimer vos données depuis Paramètres.'],
  ['Puis-je résilier quand je veux ?','Oui. Pro est un abonnement mensuel sans engagement : vous résiliez depuis le portail de paiement (Formules → Gérer mon abonnement). Pro reste actif jusqu’à la fin du mois payé, puis le compte repasse en gratuit, sans perte de données.'],
  ['Que se passe-t-il à la fin de l’essai ?',`L’essai Pro de ${TRIAL_DAYS} jours démarre à l’ajout de votre premier devis, sans carte bancaire. À la fin, sans abonnement, le compte repasse en formule gratuite (${FREE_LIMIT_TEXT}) : rien n’est supprimé, les devis au-delà passent en lecture seule et restent consultables.`],
  ['Qui êtes-vous ?',`Relanzio est édité par ${COMPANY.publisherName}, ${COMPANY.legalForm.toLowerCase()} à ${COMPANY.city} (SIREN ${COMPANY.siren}). Vous écrivez à ${COMPANY.supportEmail} ou appelez le ${COMPANY.phone} : c’est moi qui réponds.`],
];
export function Faq({open=false}){return <div className="faq">{FAQ_ITEMS.map(([q,a],i)=><details key={q} open={open&&i===0}><summary>{q}</summary><p>{a}</p></details>)}</div>;}

export function WhoIsBehind(){
  return <section className="section container who" id="qui">
    <div className="section-head"><span>QUI EST DERRIÈRE</span><h2>Un éditeur identifiable, joignable directement.</h2></div>
    <div className="who-card">
      <p><b>{COMPANY.firstName}</b>, à {COMPANY.city}. Relanzio est édité par {COMPANY.publisherName}, {COMPANY.legalForm.toLowerCase()}, SIREN {COMPANY.siren}.</p>
      <p>Une question, un doute avant de commencer : <a href={`mailto:${COMPANY.supportEmail}`}>{COMPANY.supportEmail}</a> ou <a href={telLink(COMPANY.phone)}>{COMPANY.phone}</a>.</p>
    </div>
  </section>;
}

// The three real follow-up messages, rendered from the product templates (not a mock-up).
const EXAMPLE=[0,1,2].map(i=>({...followupMessage({clientName:'M. Durand',title:'Réfection de la toiture',companyName:'Toitures Martin'},i),when:['2 jours après l’envoi','3 jours plus tard','5 jours plus tard'][i]}));

export function Marketing({onStart=goSignup}){
  useEffect(()=>{routeMeta('/');track('landing_view');},[]);
  return <><Header onStart={onStart}/><main>
    <section className="hero container">
      <div className="hero-copy">
        <span className="eyebrow">RELANCE DE DEVIS · ARTISANS</span>
        {REPLY_STOP_LIVE
          ?<h1>Vos devis relancés à votre place. <i>Tout s’arrête dès que le client répond.</i></h1>
          :<h1>Vos devis relancés au bon moment. <i>Sans harceler vos clients.</i></h1>}
        <p>Ajoutez un devis déjà envoyé : Relanzio vous dit quand relancer, prépare le message et peut l’envoyer pour vous. Sans changer de logiciel de devis.</p>
        <div className="hero-actions"><button className="btn big" onClick={onStart}>Relancer mon premier devis <span>→</span></button><a className="btn ghost big" href="#demo">Voir la démo</a></div>
        <div className="trust-line"><span>✓ Essai Pro {TRIAL_DAYS} jours, sans carte</span><span>✓ Rien ne part sans votre accord</span><span>✓ 3 relances au maximum</span></div>
      </div>
      <Demo/>
    </section>
    <section className="section container" id="probleme">
      <div className="section-head"><span>LE PROBLÈME</span><h2>Un devis sans réponse n’est pas un non.</h2><p>C’est souvent un client occupé, et un artisan qui n’a pas eu le temps de rappeler.</p></div>
      <div className="feature-grid benefits">
        <article className="feature"><span>01</span><h3>On oublie de relancer</h3><p>Entre deux chantiers, le devis envoyé il y a dix jours disparaît de la tête. Le client, lui, a parfois reçu trois autres devis.</p></article>
        <article className="feature"><span>02</span><h3>On a peur de déranger</h3><p>Relancer trop tôt, trop souvent, ou après que le client a répondu : personne ne veut passer pour l’insistant.</p></article>
        <article className="feature"><span>03</span><h3>On ne sait pas quand arrêter</h3><p>Sans suivi, on relance au hasard. Avec Relanzio, chaque devis a sa prochaine étape, et une fin.</p></article>
      </div>
    </section>
    <section className="section soft" id="comment"><div className="container"><div className="section-head"><span>COMMENT ÇA MARCHE</span><h2>Vous ajoutez le devis. Relanzio s’occupe du reste.</h2></div><div className="steps">
      <article><b>1</b><h3>Ajoutez le devis envoyé</h3><p>Client, email ou téléphone, objet, montant, date d’envoi. 30 secondes, depuis le téléphone.</p></article>
      <article><b>2</b><h3>Relanzio planifie les relances</h3><p>Trois au maximum, les jours ouvrés à 9 h. Chaque matin, la vue Aujourd’hui vous montre quoi faire.</p></article>
      <article><b>3</b><h3>Un geste par relance</h3><p>Relanzio l’envoie en votre nom (Pro), ou vous l’envoyez par email, SMS ou appel avec le message prêt.</p></article>
      <article><b>4</b><h3>{REPLY_STOP_LIVE?'Le client répond : tout s’arrête':'Le client répond : un geste, tout s’arrête'}</h3><p>{REPLY_STOP_LIVE?'Quand le client répond à une relance envoyée par Relanzio, la séquence s’arrête et sa réponse vous est transmise. Ailleurs (téléphone, SMS), un geste suffit.':'Touchez « Le client a répondu » : plus aucune relance pour ce devis. Puis gagné, perdu, ou relancer plus tard.'}</p></article>
    </div></div></section>
    <section className="section container" id="partage">
      <div className="section-head"><span>QUI FAIT QUOI</span><h2>Relanzio fait le suivi. Vous gardez la décision.</h2></div>
      <div className="split-grid">
        <article className="split-card"><h3>Relanzio</h3><ul><li>Se souvient de chaque devis envoyé</li><li>Vous dit qui relancer aujourd’hui</li><li>Prépare un message court et poli</li><li>Envoie en votre nom si vous le demandez (Pro)</li><li>Arrête la séquence au bon moment</li><li>Remonte les gros devis à appeler</li></ul></article>
        <article className="split-card yours"><h3>Vous</h3><ul><li>Ajoutez le devis, une fois</li><li>Relisez le message, si vous voulez</li><li>Validez l’envoi en un geste</li><li>Décidez : gagné, perdu, plus tard</li></ul></article>
      </div>
    </section>
    <section className="section dark" id="garde-fous"><div className="container"><div className="section-head"><span>GARDE-FOUS</span><h2>Relancer sans harceler.</h2></div>
      <ul className="guard-grid">
        <li><b>3 relances au maximum</b><span>Ensuite, Relanzio vous propose d’appeler ou de trancher.</span></li>
        <li><b>Jours ouvrés, à une heure raisonnable</b><span>Aucune relance planifiée le week-end ; 9 h par défaut.</span></li>
        <li><b>{REPLY_STOP_LIVE?'Arrêt dès que le client répond':'Arrêt en un geste quand le client répond'}</b><span>{REPLY_STOP_LIVE?'Détecté automatiquement pour les emails envoyés par Relanzio ; un bouton pour le reste.':'« Le client a répondu » coupe toutes les relances de ce devis.'}</span></li>
        <li><b>Arrêt dès que vous décidez</b><span>Gagné, perdu ou pause : plus rien ne part.</span></li>
        <li><b>Vous gardez la main</b><span>Chaque message est relu et validé avant l’envoi.</span></li>
        <li><b>Désinscription respectée</b><span>Chaque email envoyé par Relanzio contient un lien pour ne plus être relancé.</span></li>
      </ul>
    </div></section>
    <section className="section container" id="exemple"><div className="section-head"><span>EXEMPLE RÉEL</span><h2>Les messages, tels qu’ils partent.</h2><p>Courts, polis, sans fausse urgence. Vous pouvez les modifier à chaque fois.</p></div>
      <div className="example-grid">{EXAMPLE.map(m=><article key={m.step} className="example-mail"><small>Relance {m.step}/3 · {m.when}</small><b>{m.subject}</b><pre>{m.body}</pre></article>)}</div>
    </section>
    <section className="section soft" id="tarifs"><div className="container"><div className="section-head"><span>TARIFS</span><h2>Gratuit : vous relancez. Pro : Relanzio relance pour vous.</h2></div><PricingCards onStart={onStart}/></div></section>
    <Testimonials/>
    <section className="section container" id="faq"><div className="section-head"><span>FAQ</span><h2>Les questions qu’on nous pose avant de commencer.</h2></div><Faq/></section>
    <WhoIsBehind/>
    <section className="cta"><div className="container"><span>COMMENCEZ PAR UN DEVIS</span><h2>Ajoutez un devis qui attend une réponse. Relanzio vous dit quoi faire demain matin.</h2><p>Gratuit pour commencer, essai Pro de {TRIAL_DAYS} jours sans carte.</p><button className="btn light big" onClick={onStart}>Relancer mon premier devis →</button></div></section>
  </main><Footer/></>;
}

export const SEO={
  '/logiciel-relance-devis':{h1:'Comment organiser la relance de vos devis sans construire un CRM',intro:'Une méthode simple pour savoir quoi relancer, quand, et quand arrêter.',sections:[['Le problème','Un devis envoyé mais non suivi devient vite invisible dans une boîte mail. Le premier objectif est donc un registre clair des dossiers ouverts.'],['Une séquence simple','J+2, J+5 et J+10 est une base de travail, à adapter à votre cycle commercial. Le statut gagné, perdu ou pause doit stopper les rappels.'],['Automatiser progressivement','Commencez par faire relire les messages. Automatisez uniquement quand le ton et le timing sont validés sur votre activité.']]},
  '/relance-devis-agence':{h1:'Suivre les propositions commerciales d’une petite agence',intro:'Pour les agences web, design et marketing qui ne veulent pas déployer un CRM lourd.',sections:[['Centraliser','Regroupez client, montant, date et prochaine action au même endroit.'],['Protéger la relation','Une relance courte et contextualisée vaut mieux qu’une séquence agressive.'],['Mesurer','Suivez les décisions et la valeur ouverte. Ne confondez pas ouverture d’email et intention d’achat.']]},
  '/modele-email-relance-devis':{h1:'Trois relances de devis sobres et professionnelles',intro:'Des structures courtes à adapter à votre contexte, sans fausse urgence.',sections:[['J+2','Bonjour [Prénom], je reviens vers vous concernant le devis [objet]. Avez-vous eu le temps d’en prendre connaissance ?'],['J+5','Bonjour [Prénom], petit suivi concernant [objet]. Est-ce toujours d’actualité de votre côté ?'],['Dernier suivi','Bonjour [Prénom], dernier message de ma part au sujet de [objet]. Vous pouvez simplement me répondre : oui, plus tard ou non.']]},
};

export function SeoPage({path,onStart=goSignup}){
  const data=SEO[path];
  useEffect(()=>{routeMeta(path);},[path]);
  return <><Header onStart={onStart}/><main className="seo-page container"><span className="eyebrow">RESSOURCE RELANZIO</span><h1>{data.h1}</h1><p className="lead">{data.intro}</p>{data.sections.map(([h,p])=><section key={h}><h2>{h}</h2><p>{p}</p></section>)}<div className="seo-cta"><h2>Vous voulez appliquer ce workflow à vos vrais devis ?</h2><button className="btn" onClick={onStart}>Créer un compte gratuit</button></div></main><Footer/></>;
}

export function PublicPage({kind,onStart=goSignup}){
  const support=SUPPORT_EMAIL,contact=CONTACT_EMAIL;
  const pages={
    pricing:{title:'Gratuit, vous relancez. Pro, Relanzio relance pour vous.',lead:`Pro : ${PRO_PRICE_LABEL}. Abonnement mensuel récurrent, sans engagement de durée minimale.`,body:<PricingCards onStart={onStart}/>},
    docs:{title:'Documentation',lead:'Le workflow essentiel de Relanzio, sans jargon.',body:<div className="doc-grid">
      <article><h2>1. Ajouter un devis</h2><p>Client, téléphone ou email, objet, montant et date d’envoi. La première relance est proposée J+2 après l’envoi (réglable dans Paramètres) ; un devis ancien est proposé aujourd’hui, sans rattrapage.</p></article>
      <article><h2>2. La vue Aujourd’hui</h2><p>Les réponses reçues d’abord, puis les devis en retard, ceux du jour et ceux à appeler. Pour chacun : Relancer (message prêt, email, SMS ou appel, ou envoi par Relanzio en Pro), Repousser, et dans « ⋯ » : Le client a répondu, Gagné, Perdu, Pause.</p></article>
      <article><h2>3. La séquence</h2><p>Trois relances au maximum, les jours ouvrés à 9 h. Chaque relance suivante est calculée à partir du jour où la précédente a été faite. Après la troisième sans réponse, Relanzio vous propose d’appeler ou de décider.</p></article>
      <article><h2>4. Quand le client répond</h2><p>{REPLY_STOP_LIVE?'Si la relance a été envoyée par Relanzio, sa réponse arrête la séquence et vous est transmise par email. Pour une réponse par téléphone, SMS ou en personne, touchez « Le client a répondu ».':'Touchez « Le client a répondu » : plus aucune relance pour ce devis. Reprenez-les plus tard si besoin, ou marquez le devis gagné ou perdu.'}</p></article>
      <article><h2>5. Facturation</h2><p>Pro coûte {PRO_PRICE_LABEL}. Le portail Stripe permet de consulter les factures, changer de carte et résilier.</p></article>
      <article><h2>6. Besoin d’aide</h2><p>Écrivez à <a href={`mailto:${support}`}>{support}</a>, ou utilisez le support intégré depuis l’application.</p></article></div>},
    faq:{title:'Questions fréquentes',lead:'Les réponses importantes avant de confier vos relances à Relanzio.',body:<Faq open/>},
    contact:{title:'Contact',lead:'Une question avant d’utiliser Relanzio ?',body:<div className="doc-grid">
      <article><h2>Contact général</h2><p>Écrivez à <a href={`mailto:${contact}`}>{contact}</a> pour une question commerciale ou générale.</p></article>
      <article><h2>Support</h2><p>Écrivez à <a href={`mailto:${support}`}>{support}</a> pour une question produit ou un problème de compte.</p></article>
      <article><h2>Téléphone</h2><p><a href={telLink(COMPANY.phone)}>{COMPANY.phone}</a> ({COMPANY.publisherName}, {COMPANY.city}).</p></article>
      <article><h2>Compte, données et facturation</h2><p>Les demandes liées au compte, aux données ou à la facturation sont traitées avec intervention humaine. Écrivez à <a href={`mailto:${support}`}>{support}</a>.</p></article></div>},
  };
  const x=pages[kind];
  useEffect(()=>{routeMeta('/'+kind);},[kind]);
  return <><Header onStart={onStart}/><main className="seo-page container"><span className="eyebrow">RELANZIO</span><h1>{x.title}</h1><p className="lead">{x.lead}</p>{x.body}</main><Footer/></>;
}

export function LegalShell({page}){
  return <><Header/><LegalPage page={page} contactEmail={CONTACT_EMAIL} supportEmail={SUPPORT_EMAIL}/><Footer/></>;
}

// The public page for a path, or null when the path belongs to the app (login, signup, dashboard…).
export function publicPageFor(path){
  if(['/legal','/privacy','/dpa','/terms'].includes(path))return <LegalShell page={path.slice(1)}/>;
  if(['/pricing','/docs','/faq','/contact'].includes(path))return <PublicPage kind={path.slice(1)}/>;
  if(SEO[path])return <SeoPage path={path}/>;
  if(path==='/')return <Marketing/>;
  return null;
}
