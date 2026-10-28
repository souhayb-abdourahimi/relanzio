import React,{useEffect,useState} from 'react';
import TodayView from './TodayView.jsx';
import FollowupModal from './FollowupModal.jsx';
import PricingCards from './PricingCards.jsx';
import LegalPage from './LegalPage.jsx';
import { routeMeta, track } from './public-meta.js';
import { PRO_PRICE_LABEL, PRO_PRICE_TEXT, VAT_NOTICE, TRIAL_DAYS, FREE_LIMIT_TEXT } from '../../shared/plans.js';
import { COMPANY, telLink } from '../../shared/company.js';

// Public site (landing, pricing, docs, FAQ, contact, resources, legal). Rendered in the browser and
// prerendered to static HTML at build time (scripts/prerender.mjs), so it must not touch window/document
// outside effects and must not depend on the current date.
export const SUPPORT_EMAIL=import.meta.env.VITE_SUPPORT_EMAIL||COMPANY.supportEmail;
export const CONTACT_EMAIL=import.meta.env.VITE_CONTACT_EMAIL||'contact@relanzio.com';
const money=n=>Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:2})+' €';
const goSignup=()=>{location.href='/signup';};

export function Logo(){return <a className="logo" href="/" aria-label="Relanzio accueil">Relanz<span>io</span></a>}

export function Header({onStart=goSignup}){
  return <header className="nav container"><Logo/><nav><a href="/#demo">Démo</a><a href="/pricing">Tarifs</a><a href="/faq">FAQ</a><a href="/login">Connexion</a><button className="btn small" onClick={onStart}><span className="cta-long">Créer un compte gratuit</span><span className="cta-short">S’inscrire</span></button></nav></header>;
}

export function Footer(){
  return <footer className="footer container">
    <div><Logo/><p>Le suivi des devis envoyés, chaque matin.</p><p className="footer-id">Édité par {COMPANY.publisherName}, {COMPANY.legalForm.toLowerCase()} · SIREN {COMPANY.siren} · {COMPANY.city}</p></div>
    <div className="footer-links"><a href="/pricing">Tarifs</a><a href="/faq">FAQ</a><a href="/docs">Documentation</a><a href="/contact">Contact</a><a href={`mailto:${SUPPORT_EMAIL}`}>Support</a><a href="/legal">Mentions légales</a><a href="/privacy">Confidentialité</a><a href="/dpa">DPA</a><a href="/terms">CGU/CGV</a></div>
  </footer>;
}

// Demo without an account: the real Today view with sample data. Dates are fixed so the static
// prerender and the live page show the same thing.
const DEMO_NOW=new Date('2026-11-03T08:00:00.000Z');
const DEMO_QUOTES=[
  {id:'d1',client_name:'M. et Mme Garnier',client_phone:'06 00 00 00 01',title:'Réfection toiture garage',amount:4800,status:'open',followup_step:1,next_followup_at:'2026-10-31T08:00:00.000Z',note:'Attend l’accord du conjoint',followups:[{id:'f1',step:1,status:'sent',channel:'manual',sent_at:'2026-10-28T09:00:00.000Z'}]},
  {id:'d2',client_name:'Cabinet Rivière',client_email:'contact@exemple.fr',title:'Mise aux normes tableau électrique',amount:2100,status:'open',followup_step:0,next_followup_at:'2026-11-02T08:00:00.000Z',followups:[]},
  {id:'d3',client_name:'Studio Nova',client_email:'hello@exemple.fr',title:'Site vitrine',amount:2500,status:'open',followup_step:3,next_followup_at:null,followups:[]},
];
const DEMO_MESSAGE=q=>`Bonjour,\n\nJe reviens vers vous au sujet du devis « ${q.title} ». Avez-vous pu le regarder ?\n\nJe reste disponible pour en parler.\n\nBien cordialement`;

export function Demo(){
  const[quotes,setQuotes]=useState(DEMO_QUOTES);
  const[preview,setPreview]=useState(null);
  const[note,setNote]=useState('');
  const done=(q,msg)=>{setQuotes(list=>list.map(x=>x.id===q.id?{...x,followup_step:x.followup_step+1,next_followup_at:'2026-11-08T08:00:00.000Z'}:x));setPreview(null);setNote(msg);};
  const decide=(id,status)=>{setQuotes(list=>list.map(x=>x.id===id?{...x,status}:x));setNote(status==='won'?'Devis marqué gagné.':status==='lost'?'Devis marqué perdu.':'Devis mis en pause.');};
  return <div className="demo-phone" id="demo">
    <div className="demo-phone-bar"><b>Aujourd’hui</b><em>DÉMO · DONNÉES D’EXEMPLE</em></div>
    <div className="demo-phone-screen">
      <TodayView quotes={quotes} now={DEMO_NOW} hideFuture
        onPrepare={q=>setPreview({quote:q,step:q.followup_step+1,subject:`Suivi — ${q.title}`,body:DEMO_MESSAGE(q)})}
        onMarkDone={q=>done(q,'Relance marquée comme faite. La suivante est programmée.')}
        onPostpone={q=>{setQuotes(list=>list.map(x=>x.id===q.id?{...x,next_followup_at:'2026-11-06T08:00:00.000Z'}:x));setNote('Devis repoussé.');}}
        onStatus={decide}/>
      <p className="demo-note" aria-live="polite">{note||'Essayez : Relancer, Repousser, Résultat. Rien n’est envoyé.'}{quotes!==DEMO_QUOTES&&<> <button type="button" className="linklike" onClick={()=>{setQuotes(DEMO_QUOTES);setNote('');}}>Recommencer</button></>}</p>
    </div>
    {preview&&<FollowupModal preview={preview} onChange={patch=>setPreview(p=>({...p,...patch}))} onCopy={()=>setNote('Message copié (démo).')} onMarkDone={()=>done(preview.quote,'Relance marquée comme faite. La suivante est programmée.')} onClose={()=>setPreview(null)}/>}
  </div>;
}

export function ValueCalculator(){
  const[avg,setAvg]=useState(1500),[monthly,setMonthly]=useState(12);
  return <div className="value-box"><div><span className="overline">CALCULATEUR DE VALEUR</span><h2>Combien représente un seul devis récupéré ?</h2><p>Pas de promesse de conversion. Utilisez vos propres chiffres pour juger si le suivi mérite {PRO_PRICE_TEXT}.</p><label>Panier moyen du devis <input type="range" min="200" max="10000" step="100" value={avg} onChange={e=>setAvg(+e.target.value)}/><b>{money(avg)}</b></label><label>Devis envoyés par mois <input type="range" min="1" max="100" value={monthly} onChange={e=>setMonthly(+e.target.value)}/><b>{monthly}</b></label></div><div className="value-result"><small>SCÉNARIO, PAS UNE GARANTIE</small><strong>{money(avg)}</strong><p>Si votre suivi permet de récupérer <b>un seul devis supplémentaire</b> de votre panier moyen.</p><div><span>Abonnement Pro</span><b>{PRO_PRICE_TEXT}</b></div><small>{VAT_NOTICE}</small><div><span>Devis suivis</span><b>{monthly}/mois</b></div></div></div>;
}

export const FAQ_ITEMS=[
  ['J’ai déjà un logiciel de devis (Obat, Tolteck…)','Gardez-le. Relanzio commence après l’envoi : vous ajoutez le devis envoyé (client, montant, date) en 30 secondes, sans import ni changement d’outil. Relanzio ne crée pas de devis et ne fait pas de facturation.'],
  ['Je relance par téléphone','Très bien : Relanzio vous dit qui appeler aujourd’hui, le bouton « Appeler » compose le numéro, et « Relance faite » programme la suivante. Le téléphone suffit, l’email du client est facultatif.'],
  ['Mes clients reçoivent-ils un email de Relanzio ?','Non, par défaut. En mode revue, c’est vous qui relancez, depuis votre messagerie, par SMS ou par téléphone ; Relanzio prépare le message. Avec Pro, vous pouvez aussi envoyer depuis Relanzio : l’email porte le nom de votre entreprise « via Relanzio », les réponses arrivent dans votre boîte et chaque message contient un lien de désinscription.'],
  ['Où sont mes données ?','Votre compte et vos devis sont stockés dans une base Supabase située dans l’Union européenne (Paris). L’application est servie par Railway (États-Unis) ; Stripe gère le paiement et Brevo l’envoi des emails. La liste complète est dans la politique de confidentialité.'],
  ['Puis-je exporter mes données ?','Oui, à tout moment, depuis Paramètres : export CSV de vos devis et export complet de votre compte. Vous pouvez aussi supprimer votre compte vous-même.'],
  ['Qui êtes-vous ?',`Relanzio est édité par ${COMPANY.publisherName}, ${COMPANY.legalForm.toLowerCase()} à ${COMPANY.city} (SIREN ${COMPANY.siren}). Vous écrivez à ${COMPANY.supportEmail} ou appelez le ${COMPANY.phone} : c’est moi qui réponds.`],
  ['Un email peut-il partir sans mon accord ?','Non. Le compte démarre en mode revue : rien ne part sans vous. L’envoi automatique exige Pro, une activation dans Paramètres puis une autorisation devis par devis, et ne part qu’en jours ouvrés, entre 8 h et 19 h, une fois par jour au plus.'],
  ['Que se passe-t-il à la fin de l’essai ?',`L’essai Pro de ${TRIAL_DAYS} jours démarre à l’ajout de votre premier devis, sans carte bancaire. À la fin, sans abonnement, le compte repasse en formule gratuite (${FREE_LIMIT_TEXT}) : rien n’est supprimé, les devis au-delà passent en lecture seule.`],
  ['Comment mesurez-vous le chiffre « gagné » ?','C’est le montant des devis que vous marquez vous-même comme gagnés. Relanzio ne prétend pas que chaque vente est due à une relance.'],
  ['Pourquoi aucun témoignage client ici ?','Parce que nous n’affichons pas de témoignage inventé. Les retours clients seront publiés uniquement avec leur accord.'],
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

export function Marketing({onStart=goSignup}){
  useEffect(()=>{routeMeta('/');track('landing_view');},[]);
  return <><Header onStart={onStart}/><main>
    <section className="hero container">
      <div className="hero-copy">
        <span className="eyebrow">SUIVI DES DEVIS ENVOYÉS · ARTISANS, TPE, INDÉPENDANTS</span>
        <h1>Chaque matin, les devis à relancer. <i>Sur votre téléphone.</i></h1>
        <p>Ajoutez vos devis envoyés en 30 secondes. Relanzio vous dit qui relancer aujourd’hui et prépare le message. Votre logiciel de devis ne change pas.</p>
        <div className="hero-actions"><button className="btn big" onClick={onStart}>Suivre mon premier devis <span>→</span></button><a className="btn ghost big" href="#demo">Essayer la démo</a></div>
        <div className="trust-line"><span>✓ Essai Pro {TRIAL_DAYS} jours, sans carte</span><span>✓ Rien ne part sans vous</span><span>✓ Email, SMS ou appel</span></div>
      </div>
      <Demo/>
    </section>
    <section className="proof-strip"><div className="container"><b>Le travail commence après « devis envoyé »</b><span>Devis envoyé</span><i>→</i><span>Relance du jour</span><i>→</i><span>Réponse</span><i>→</i><span>Gagné / perdu / pause</span></div></section>
    <section className="section container" id="produit">
      <div className="section-head"><span>CE QUE ÇA CHANGE</span><h2>Trois choses, chaque jour.</h2><p>Pas de migration. Pas de CRM à paramétrer.</p></div>
      <div className="feature-grid benefits">
        <article className="feature large"><span>01</span><h3>Plus aucun devis oublié</h3><p>Chaque devis envoyé a sa prochaine relance. Les retards remontent en premier, avec le montant en jeu. En fin de séquence, Relanzio vous demande de trancher : gagné, perdu ou repousser.</p><div className="mini-ui"><b>Aujourd’hui</b><div>Garnier · 4 800 € <span>en retard de 3 j</span></div><div>Cabinet Rivière · 2 100 € <span>Relance 1/3</span></div></div></article>
        <article className="feature"><span>02</span><h3>2 minutes par jour, depuis le téléphone</h3><p>Un rappel le matin, une liste courte. Relancer, repousser ou décider : un geste par devis, des boutons faits pour le pouce.</p></article>
        <article className="feature"><span>03</span><h3>Rien ne part sans vous</h3><p>Relanzio prépare le message ; vous l’envoyez par email, SMS ou vous appelez. L’envoi automatique reste optionnel, devis par devis.</p></article>
      </div>
    </section>
    <section className="section dark" id="valeur"><div className="container"><ValueCalculator/></div></section>
    <section className="section container"><div className="section-head"><span>EN 3 ÉTAPES</span><h2>Assez simple pour tous les jours.</h2></div><div className="steps"><article><b>1</b><h3>Ajoutez le devis envoyé</h3><p>Client, téléphone ou email, montant, date d’envoi. 30 secondes.</p></article><article><b>2</b><h3>Relancez quand Relanzio le dit</h3><p>J+2, J+5, J+10 par défaut, réglable. Message prêt à copier, à envoyer par email ou SMS.</p></article><article><b>3</b><h3>Fermez la boucle</h3><p>Gagné, perdu ou pause : la séquence s’arrête et vos chiffres restent justes.</p></article></div></section>
    <section className="section soft" id="tarifs"><div className="container"><div className="section-head"><span>TARIFS</span><h2>Gratuit pour commencer. Pro quand ça vous sert.</h2></div><PricingCards onStart={onStart}/></div></section>
    <section className="section container" id="faq"><div className="section-head"><span>FAQ</span><h2>Avant de confier vos relances à un logiciel.</h2></div><Faq/></section>
    <WhoIsBehind/>
    <section className="cta"><div className="container"><span>COMMENCEZ PETIT</span><h2>Ajoutez un vrai devis. Voyez si le workflow vous fait gagner du temps.</h2><p>Si ce n’est pas utile dans votre quotidien, nous préférons le savoir avant de vous vendre quoi que ce soit.</p><button className="btn light big" onClick={onStart}>Créer mon espace gratuit →</button></div></section>
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
    pricing:{title:'Tarifs simples',lead:`Pro : ${PRO_PRICE_LABEL}. Abonnement mensuel récurrent, sans engagement de durée minimale.`,body:<PricingCards onStart={onStart}/>},
    docs:{title:'Documentation',lead:'Le workflow essentiel de Relanzio, sans jargon.',body:<div className="doc-grid">
      <article><h2>1. Ajouter un devis</h2><p>Client, téléphone ou email, objet, montant et date d’envoi. La première relance est proposée J+2 après l’envoi (réglable dans Paramètres) ; un devis ancien est proposé aujourd’hui, sans rattrapage.</p></article>
      <article><h2>2. La vue Aujourd’hui</h2><p>Les devis en retard d’abord, puis ceux du jour. Pour chacun : Relancer (message prêt, email, SMS ou appel), Relance faite, Repousser, Gagné, Perdu ou Pause.</p></article>
      <article><h2>3. La séquence</h2><p>Chaque relance suivante est calculée à partir du jour où la précédente a été faite. Après la dernière, Relanzio vous demande de décider.</p></article>
      <article><h2>4. Mode automatique</h2><p>Réservé à Pro : activez-le dans Paramètres puis autorisez l’envoi devis par devis. Jours ouvrés, 8 h – 19 h, une relance par devis et par jour au plus.</p></article>
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
