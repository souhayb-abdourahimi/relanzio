import { db } from './db.js';
import { followupMessage } from '../shared/followup-templates.js';

// Follow-up text is a fixed template (shared/followup-templates.js): instant, identical in preview and send, no AI.
export function generateFollowup(quote, step, companyName = '') {
  return followupMessage({clientName:quote.client_name,title:quote.title,companyName},step);
}

// stream 'outreach' = Relanzio's own prospection. It can use its own Brevo key (e.g. a sub-account with its own
// sending domain) so a prospection reputation problem never touches client follow-ups. Unset = shared key.
const apiKeyFor = stream => stream === 'outreach' ? (process.env.OUTREACH_BREVO_API_KEY || process.env.BREVO_API_KEY) : process.env.BREVO_API_KEY;
const redactEmails = text => String(text || '').replace(/[^\s"'<>@,;:]+@[^\s"'<>,;:]+/g, '[email]').slice(0, 500);

export async function sendEmail({ to, subject, text, replyTo, replyToName, senderName, senderEmail, tags = [], headers = null, attachments = null, stream = 'product' }) {
  const apiKey = apiKeyFor(stream);
  if (!apiKey || !process.env.EMAIL_FROM_ADDRESS) {
    throw new Error('EMAIL_PROVIDER_NOT_CONFIGURED');
  }
  const recipient = String(to || '').trim().toLowerCase();
  const { data:suppression, error:suppressionError } = await db.from('suppressions').select('email').eq('email',recipient).maybeSingle();
  if (suppressionError) throw new Error('EMAIL_SUPPRESSION_CHECK_FAILED');
  if (suppression) throw new Error('EMAIL_RECIPIENT_SUPPRESSED');
  const body = {
    sender: { name: senderName || process.env.EMAIL_FROM_NAME || "Relanzio", email: senderEmail || process.env.EMAIL_FROM_ADDRESS },
    to: [{ email: recipient }], subject, textContent: text
  };
  if (replyTo) body.replyTo = replyToName ? { email: replyTo, name: replyToName } : { email: replyTo };
  if (attachments?.length) body.attachment = attachments.map(a => ({ name: a.name, content: a.content }));
  if (tags.length) body.tags = tags.slice(0, 10);
  if (headers) body.headers = headers;
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`Brevo ${r.status}: ${redactEmails(await r.text())}`);
  return r.json();
}
