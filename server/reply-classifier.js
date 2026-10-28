// Deterministic classification of a client's reply to a follow-up. No AI, never blocks the stop:
// the essential fact is "the client answered"; the category only helps the artisan read the list.
import { deterministicReplyCategory } from './imap-reply-parser.js';

const QUOTE_HEADER=/^(le .{3,160} a écrit\s*:|on .{3,160} wrote\s*:|-{2,}\s*(message d['’]origine|original message|message transféré|forwarded message)\s*-{2,}|de\s*:\s.+@|from\s*:\s.+@|envoyé\s*:|sent\s*:)/i;

// The client's own words: stops at the first quoted block or "Le … a écrit :" line.
export function stripQuotedReply(text=''){
  const out=[];
  for(const line of String(text).replace(/\r\n/g,'\n').split('\n')){
    const t=line.trim();
    if(t.startsWith('>')||QUOTE_HEADER.test(t))break;
    out.push(line);
  }
  return out.join('\n').replace(/\n{3,}/g,'\n\n').trim();
}

const RULES=[
  ['refusal',/pas (donner )?suite|ne (pas )?donnerons pas suite|pas retenu|retenu (une autre|un autre)|choisi (une autre|un autre)|autre (entreprise|artisan|prestataire|devis)|ne (sommes|suis) plus intéress|pas intéress|non merci|abandonn|annul(er|é|ons)|on laisse tomber|projet (est )?(arrêté|abandonné)/i],
  ['price',/\b(prix|tarifs?|remise|réduction|rabais|moins cher|trop cher|budget|négoci|geste commercial|baisser)/i],
  ['delay',/plus tard|pas (encore|tout de suite)|pas le bon moment|en ce moment|dans (quelques|\d+|deux|trois) (jours|semaines|mois)|après (les vacances|l['’]été|noël|les fêtes)|\breport|on attend|j['’]attends|nous attendons|repasser vers|recontacter/i],
  ['interested',/d['’]accord|ok pour|bon pour accord|on (valide|accepte|signe)|je (valide|accepte|signe)|nous (validons|acceptons|signons)|c['’]est (bon|validé|ok)|on y va|allons-y|quand (pouvez|pourriez|pourrez)-vous|vos disponibilités|date de début|ci-joint (le )?devis signé|devis signé/i]
];

// headers: Map of lower-cased header name → values (from parseHeaders).
export function classifyReply({text='',subject='',from='',headers=new Map(),contentType=''}={}){
  const h=name=>(headers.get?.(name)||[]).join(' ').toLowerCase();
  const f=String(from).toLowerCase(),s=String(subject);
  if(/^(mailer-daemon|postmaster)@/.test(f)||/multipart\/report|delivery-status/i.test(contentType)||/undeliver|non remis|delivery status notification|échec de (la )?(remise|distribution)|mail delivery failed|returned mail|adresse introuvable/i.test(s))
    return {category:'bounce',effect:'disable_auto'};
  const auto=h('auto-submitted');
  if((auto&&auto!=='no')||h('x-autoreply')||h('x-autorespond')||/auto_reply|bulk|junk/.test(h('precedence'))||/réponse automatique|automatic reply|auto[- ]?reply|out of office|absence|absent(e)? du|congés/i.test(s))
    return {category:'auto_reply',effect:'record'};
  const own=stripQuotedReply(text);
  if(deterministicReplyCategory(own)==='opt_out')return {category:'opt_out',effect:'stop'};
  for(const [category,re] of RULES)if(re.test(own))return {category,effect:'stop'};
  if(own.includes('?'))return {category:'question',effect:'stop'};
  return {category:own?'other':'received',effect:'stop'};
}

