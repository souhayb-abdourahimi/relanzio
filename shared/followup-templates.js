// Follow-up messages: three fixed templates, rendered instantly on the server and in the browser.
// No AI: the artisan reads exactly what will be sent.

const CIVILITY={m:'Monsieur','m.':'Monsieur',mr:'Monsieur','mr.':'Monsieur',monsieur:'Monsieur',
  mme:'Madame','mme.':'Madame',madame:'Madame',mlle:'Madame','mlle.':'Madame',mademoiselle:'Madame',
  dr:'Docteur','dr.':'Docteur',docteur:'Docteur',me:'Maître','me.':'Maître','maître':'Maître',maitre:'Maître'};
const COUPLE=/^(m\.?|mr\.?|monsieur)\s+(et|&)\s+(mme\.?|madame)\b|^(mme\.?|madame)\s+(et|&)\s+(m\.?|mr\.?|monsieur)\b/i;
const COMPANY=/(?<!\p{L})(sarl|sas|sasu|eurl|sa|sci|snc|selarl|ei|eirl|scop|gaec|earl|entreprise|société|societe|cabinet|agence|studio|groupe|atelier|ets|établissements|etablissements|syndic|copropriété|copropriete|mairie|association|famille|holding|services?|et fils|toitures?|couverture|charpente|électricité|electricite|plomberie|chauffage|climatisation|menuiserie|peinture|maçonnerie|maconnerie|carrelage|rénovation|renovation|bâtiment|batiment|construction|travaux|paysages?|jardins?|piscines?|nettoyage|immobilier|transports?|garage|automobiles?|boulangerie|restaurant|hôtel|hotel|boutique|conseil|solutions|design|architecture|énergies?|energies?|habitat|isolation|serrurerie|vitrerie|fenêtres|fenetres|cuisines?|bains?|dépannage|depannage)(?!\p{L})|&/iu;

const PARTICLES=new Set(['de','du','des','la','le','d’',"d'",'van','von','da','di','del']);
function tidyWord(word){
  // DUPONT → Dupont, jean-paul → Jean-Paul; particles stay lower case; mixed case (McDonald) is kept as typed.
  const lower=word.toLowerCase();
  if(PARTICLES.has(lower))return lower;
  if(word!==lower&&word!==word.toUpperCase())return word;
  return lower.replace(/(^|[-'’])(\p{L})/gu,(_,s,c)=>s+c.toUpperCase());
}

// "Bonjour Monsieur Durand," / "Bonjour Jean Moreau," / "Bonjour Madame, Monsieur," / "Bonjour,"
// Never "Bonjour M.,": a civility without a name, a company, a single word or anything unusual falls back to "Bonjour,".
export function salutation(clientName){
  const name=String(clientName??'').normalize('NFC').replace(/[\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim();
  if(!name||name.length>60||/[@\d<>{}[\]|/\\]/.test(name))return 'Bonjour,';
  if(COUPLE.test(name))return 'Bonjour Madame, Monsieur,';
  if(COMPANY.test(name))return 'Bonjour,';
  const words=name.split(' ').filter(w=>/\p{L}/u.test(w));
  if(!words.length)return 'Bonjour,';
  const civility=CIVILITY[words[0].toLowerCase()];
  if(civility){
    const rest=words.slice(1).filter(w=>!CIVILITY[w.toLowerCase()]);
    return rest.length?`Bonjour ${civility} ${rest.map(tidyWord).join(' ')},`:'Bonjour,';
  }
  if(words.length<2)return 'Bonjour,';
  return `Bonjour ${words.map(tidyWord).join(' ')},`;
}

function cleanTitle(title){
  return String(title??'').replace(/\s+/g,' ').trim().slice(0,120)||'votre projet';
}

const BODIES=[
  t=>`Je reviens vers vous au sujet du devis « ${t} » que je vous ai envoyé. Avez-vous pu le consulter ?\n\nSi un point mérite d’être précisé ou ajusté, je suis à votre disposition.`,
  t=>`Je me permets un petit suivi concernant le devis « ${t} ». Le projet est-il toujours d’actualité de votre côté ?\n\nUne réponse rapide me suffit, même pour me dire que ce n’est pas le bon moment.`,
  t=>`C’est mon dernier message au sujet du devis « ${t} » : je ne veux pas vous solliciter inutilement.\n\nPouvez-vous simplement me dire où vous en êtes : « oui », « plus tard » ou « non » ? Je m’adapterai.`
];
const SUBJECTS=[
  t=>`Votre devis « ${t} »`,
  t=>`Devis « ${t} » : toujours d’actualité ?`,
  t=>`Devis « ${t} » : dernier suivi`
];

// stepIndex: 0, 1 or 2 (the follow-up about to be sent is stepIndex+1 of 3).
export function followupMessage({clientName,title,companyName},stepIndex){
  const i=Math.min(Math.max(Number(stepIndex)||0,0),2),t=cleanTitle(title);
  const signature=String(companyName??'').trim();
  const body=`${salutation(clientName)}\n\n${BODIES[i](t)}\n\nBien cordialement,${signature?`\n${signature}`:''}`;
  return {step:i+1,subject:SUBJECTS[i](t).slice(0,200),body};
}
