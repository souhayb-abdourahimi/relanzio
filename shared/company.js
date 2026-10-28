// Publisher identity and processors, as provided by the publisher. Shown on public and legal pages.
// Do not edit these values without the publisher's confirmation.
export const COMPANY=Object.freeze({
  brand:'Relanzio',
  site:'https://relanzio.com',
  publisherName:'Souhayb Abdourahimi',
  firstName:'Souhayb',
  legalForm:'Entrepreneur individuel (micro-entreprise)',
  siren:'131 068 603',
  address:'81 rue Guillaume Janvier, 34070 Montpellier, France',
  city:'Montpellier',
  supportEmail:'support@relanzio.com',
  phone:'07 45 25 78 78',
  publicationDirector:'Souhayb Abdourahimi',
});

// Sub-processors actually used by Relanzio, with the hosting region the publisher declared.
export const SUBPROCESSORS=Object.freeze([
  {name:'Supabase',role:'Base de données et authentification',region:'Union européenne — Paris (AWS eu-west-3)',entity:'Supabase, Inc.'},
  {name:'Railway',role:'Hébergement de l’application (serveur web)',region:'États-Unis — région de production « sfo »',entity:'Railway Corporation, 548 Market St Suite 68956, San Francisco, CA 94104, États-Unis'},
  {name:'Stripe',role:'Paiement des abonnements et factures',region:'Union européenne (Stripe Payments Europe, Irlande) ; transferts possibles vers les États-Unis',entity:'Stripe Payments Europe, Ltd.'},
  {name:'Brevo',role:'Envoi des emails (compte, rappels, relances envoyées via Relanzio)',region:'Union européenne (France)',entity:'Sendinblue SAS (Brevo), Paris'},
  {name:'OpenAI',role:'Personnalisation facultative du texte des relances (sans conservation : store=false)',region:'États-Unis',entity:'OpenAI, L.L.C.',optional:true},
]);

// Displays a French phone number in pairs (0745257878 → 07 45 25 78 78); other formats are kept as given.
export function formatFrenchPhone(value){
  const digits=String(value||'').replace(/\D/g,'');
  return /^0\d{9}$/.test(digits)?digits.replace(/(\d{2})(?=\d)/g,'$1 '):String(value||'').trim();
}
export const telLink=phone=>`tel:${String(phone||'').replace(/[^\d+]/g,'')}`;
