export const FOLLOWUP_DAYS = [2, 5, 10];

export function nextFollowupDate(sentAt, step = 0) {
  if (step < 0 || step >= FOLLOWUP_DAYS.length) return null;
  const d = new Date(`${sentAt}T09:00:00.000Z`);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid sent_at date');
  d.setUTCDate(d.getUTCDate() + FOLLOWUP_DAYS[step]);
  return d.toISOString();
}

export function normalizeEmail(value = '') { return String(value).trim().toLowerCase(); }
export function isValidEmail(value = '') { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value)); }
// Kept as an alias for backward compatibility. Domain type is not inferred from syntax alone.
export const isBusinessEmail = isValidEmail;
export function sanitizeText(value, max = 500) { return String(value ?? '').trim().slice(0, max); }

export function scoreProspect(p = {}) {
  let score = 0;
  const reasons = [];
  const employees = Number(p.employee_count || 0);
  const quotes = Number(p.estimated_quotes_per_month || 0);
  const digital = Boolean(p.uses_digital_tools);
  const service = Boolean(p.is_service_business);
  const generic = /^(contact|hello|bonjour|info|commercial|sales)@/i.test(p.email || '');
  if (service) { score += 25; reasons.push('activité de service'); }
  if (employees >= 1 && employees <= 10) { score += 20; reasons.push('taille ICP 1–10'); }
  else if (employees <= 20 && employees > 10) { score += 10; reasons.push('petite équipe'); }
  if (quotes >= 10) { score += 30; reasons.push('volume de devis élevé'); }
  else if (quotes >= 5) { score += 18; reasons.push('volume de devis moyen'); }
  if (digital) { score += 15; reasons.push('outils numériques déjà utilisés'); }
  if (p.website) { score += 5; reasons.push('présence web'); }
  if (generic) { score += 3; reasons.push('adresse générique professionnelle'); }
  if (p.role && /fondateur|gérant|dirigeant|commercial|sales|business|owner|founder|président/i.test(p.role)) { score += 10; reasons.push('décideur accessible'); }
  return { score: Math.min(score, 100), reasons };
}

export function classifyReplyFallback(text = '') {
  const t = String(text).toLowerCase();
  if (/(désinscri|ne me contactez plus|stop|retirez-moi|retirer de votre liste|unsubscribe|supprimez mon email)/i.test(t)) return { category:'opt_out', sentiment:'negative', confidence:.99, needs_human:false, summary:'Demande de ne plus être contacté.', objection:'', requested_feature:'' };
  if (/(plus tard|pas maintenant|dans quelques mois|recontactez|recontacte)/i.test(t)) return { category:'not_now', sentiment:'neutral', confidence:.88, needs_human:true, summary:'Prospect intéressé potentiellement plus tard.', objection:'timing', requested_feature:'' };
  if (/(trop cher|prix|tarif|combien|coût|cout|budget)/i.test(t)) return { category:'pricing', sentiment:'neutral', confidence:.86, needs_human:true, summary:'Question ou objection sur le prix.', objection:'pricing', requested_feature:'' };
  if (/(fonction|intégr|gmail|outlook|sms|whatsapp|api|csv|logiciel|connect)/i.test(t)) return { category:'feature_request', sentiment:'neutral', confidence:.80, needs_human:true, summary:'Question ou demande fonctionnelle.', objection:'', requested_feature:'à préciser manuellement' };
  if (/(pas intéress|non merci|inutile|déjà équipé|déjà un outil|aucun besoin)/i.test(t)) return { category:'not_interested', sentiment:'negative', confidence:.92, needs_human:false, summary:'Prospect non intéressé ou déjà équipé.', objection:'no_need', requested_feature:'' };
  if (/(démo|demo|rendez-vous|rdv|appel|disponible|intéress|interesse|essay|tester)/i.test(t)) return { category:'interested', sentiment:'positive', confidence:.89, needs_human:true, summary:'Intérêt commercial ou demande de rendez-vous.', objection:'', requested_feature:'' };
  return { category:'other', sentiment:'neutral', confidence:.45, needs_human:true, summary:'Réponse à examiner manuellement.', objection:'', requested_feature:'' };
}

export function canAutoReply(analysis = {}) { return analysis.category === 'opt_out' && Number(analysis.confidence) >= .95; }

export function quoteMetrics(quotes = []) {
  const open = quotes.filter(q => q.status === 'open');
  const won = quotes.filter(q => q.status === 'won');
  const lost = quotes.filter(q => q.status === 'lost');
  const decided = won.length + lost.length;
  const today = new Date().toISOString().slice(0, 10);
  return {
    openAmount: open.reduce((s,q)=>s+Number(q.amount||0),0),
    wonAmount: won.reduce((s,q)=>s+Number(q.amount||0),0),
    dueToday: open.filter(q => q.next_followup_at && q.next_followup_at.slice(0,10) <= today).length,
    activeQuotes: open.length,
    decidedQuotes: decided,
    winRate: decided ? Math.round((won.length / decided) * 100) : null
  };
}

export function safePercentage(num, den) { return den > 0 ? Math.round((num / den) * 1000) / 10 : 0; }

export function prioritizeProductIdeas(insights = []) {
  const map = new Map();
  for (const i of insights) {
    const key = sanitizeText(i.requested_feature, 120).toLowerCase();
    if (!key) continue;
    const current = map.get(key) || { feature:key, requests:0, weighted:0 };
    current.requests += 1;
    current.weighted += Number(i.confidence || .5);
    map.set(key, current);
  }
  return [...map.values()].sort((a,b)=>b.requests-a.requests || b.weighted-a.weighted);
}

export function mapBrevoEvent(event = '') {
  const e = String(event).toLowerCase().replace(/[_\s-]/g, '');
  if (['delivered'].includes(e)) return 'delivered';
  if (['opened','uniqueopened','proxyopen','loadedbyproxy'].includes(e)) return 'opened';
  if (['click','clicked'].includes(e)) return 'clicked';
  if (['hardbounce','softbounce','invalid','blocked','error','spam'].includes(e)) return 'bounced';
  if (['unsubscribed','unsubscribe'].includes(e)) return 'opt_out';
  if (['sent','request'].includes(e)) return 'sent';
  return null;
}

export function supportRoute(question = '') {
  const q = String(question).toLowerCase();
  if (/(paiement|facture|carte|stripe|rembours|prélèvement|abonnement)/i.test(q)) return { needs_human:true, topic:'billing' };
  if (/(supprim|effac|rgpd|donnée|donnee|export)/i.test(q)) return { needs_human:true, topic:'privacy' };
  if (/(pirat|sécur|secur|incident|fuite|compromis)/i.test(q)) return { needs_human:true, topic:'security' };
  if (/(juridique|légal|legal|avocat|responsabilit|litige)/i.test(q)) return { needs_human:true, topic:'legal' };
  return { needs_human:false, topic:'product' };
}
