import OpenAI from "openai";
import { db } from './db.js';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const fallback = (quote, step, companyName) => {
  const first = String(quote.client_name || 'Bonjour').trim().split(/\s+/)[0];
  const templates = [
    `Bonjour ${first},\n\nJe me permets de revenir vers vous concernant notre devis « ${quote.title} » envoyé récemment. Avez-vous eu le temps d'en prendre connaissance ?\n\nJe reste disponible si vous avez une question ou souhaitez ajuster un point.\n\nBien cordialement,\n${companyName}`,
    `Bonjour ${first},\n\nPetit suivi concernant le devis « ${quote.title} ». Est-ce toujours d'actualité de votre côté ?\n\nS'il vous manque une information pour avancer, dites-moi simplement laquelle et je vous répondrai rapidement.\n\nBien cordialement,\n${companyName}`,
    `Bonjour ${first},\n\nDernier message de ma part au sujet du devis « ${quote.title} ». Je préfère vérifier avec vous plutôt que de laisser le dossier ouvert inutilement.\n\nVous pouvez simplement me répondre : « oui », « plus tard » ou « non ».\n\nBien cordialement,\n${companyName}`
  ];
  return templates[Math.min(Math.max(Number(step) || 0, 0), templates.length - 1)];
};

export async function generateFollowup(quote, step, companyName = "Votre entreprise") {
  if (!openai) return fallback(quote, step, companyName);
  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      reasoning: { effort: "none" },
      max_output_tokens:500, store:false,
      input: `Rédige uniquement le corps d'un email B2B de relance de devis en français.\nTon: humain, bref, poli, non pressant. Pas de fausse urgence, pas de remise inventée.\nÉtape de relance: ${step + 1}/3.\nClient: ${quote.client_name}\nObjet du devis: ${quote.title}\nMontant: ${quote.amount} EUR\nEntreprise expéditrice: ${companyName}\nLe message doit permettre une réponse simple et ne doit jamais prétendre savoir si le client a ouvert le devis.`
    });
    return response.output_text?.trim() || fallback(quote, step, companyName);
  } catch {
    return fallback(quote, step, companyName);
  }
}

export async function sendEmail({ to, subject, text, replyTo, senderName, senderEmail, tags = [] }) {
  if (!process.env.BREVO_API_KEY || !process.env.EMAIL_FROM_ADDRESS) {
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
  if (replyTo) body.replyTo = { email: replyTo };
  if (tags.length) body.tags = tags.slice(0, 10);
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": process.env.BREVO_API_KEY },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`Brevo ${r.status}: ${await r.text()}`);
  return r.json();
}
