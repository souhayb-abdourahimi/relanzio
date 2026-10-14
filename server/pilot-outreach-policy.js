export const PILOT_SENDER = Object.freeze({
  name: 'Relanzio',
  email: 'contact@relanzio.com',
  replyTo: 'contact@relanzio.com'
});

export const PILOT_STOP_LINE = 'Si vous préférez ne plus recevoir de message de ma part, répondez simplement STOP.';
export const PILOT_SIGNATURE = 'Souhayb — Relanzio — relanzio.com';

export function pilotDailyCap(raw = 5) {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return 5;
  return Math.min(5, n);
}

export function pilotAllowlist(raw = '') {
  return new Set(String(raw).split(',').map(x => x.trim().toLowerCase()).filter(Boolean));
}

export function validatePilotProspect(prospect, allowlist = new Set()) {
  const reasons = [];
  if (!prospect) return { ok:false, reasons:['prospect_not_found'] };
  const email = String(prospect.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) reasons.push('invalid_email');
  if (!allowlist.has(email)) reasons.push('not_in_pilot_allowlist');
  if (prospect.status !== 'qualified') reasons.push('prospect_not_qualified');
  if (prospect.lawful_basis !== 'professional_relevance') reasons.push('invalid_lawful_basis');
  if (Number(prospect.score || 0) < 55) reasons.push('score_below_55');
  if (!/^https?:\/\//i.test(String(prospect.source_url || ''))) reasons.push('missing_public_professional_source');
  return { ok:reasons.length === 0, reasons };
}

export function validatePilotJ0(queue) {
  const reasons = [];
  if (!queue) return { ok:false, reasons:['j0_not_found'] };
  if (Number(queue.sequence_step) !== 0) reasons.push('not_j0');
  if (queue.status !== 'held') reasons.push('j0_not_held');
  if (!String(queue.subject || '').trim()) reasons.push('missing_subject');
  const content = String(queue.content || '');
  if (!content.trim()) reasons.push('missing_content');
  if (!content.includes(PILOT_STOP_LINE)) reasons.push('missing_stop_line');
  if (!content.includes(PILOT_SIGNATURE)) reasons.push('missing_signature');
  return { ok:reasons.length === 0, reasons };
}
