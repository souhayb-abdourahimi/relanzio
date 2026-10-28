import { FREE_LIMIT_TEXT,PRO_LIMIT_TEXT,PRO_PRICE_TEXT,TRIAL_DAYS,VAT_NOTICE } from '../shared/plans.js';
import OpenAI from 'openai';
import { sanitizeText, supportRoute } from './logic.js';
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const KB = `Relanzio suit les devis après leur envoi. Séquence standard: J+2, J+5, J+10. Le mode revue n'envoie rien automatiquement. Le mode automatique est réservé à Pro et doit être activé. Free: ${FREE_LIMIT_TEXT}. Pro: ${PRO_PRICE_TEXT}, jusqu'à ${PRO_LIMIT_TEXT}. Essai Pro de ${TRIAL_DAYS} jours sans carte bancaire, démarré au premier devis ajouté. ${VAT_NOTICE}. L'abonnement Pro est mensuel récurrent, sans engagement de durée minimale, avec résiliation via le portail client. Relanzio ne remplace pas un logiciel de facturation. Pour paiement, suppression de données, sécurité ou litige, un humain doit prendre le relais.`;

function fallback(question) {
  const route = supportRoute(question);
  if (route.needs_human) return { answer:'Ce sujet nécessite une vérification humaine. Créez un ticket ci-dessous et nous vous répondrons avec le contexte nécessaire.', needs_human:true, topic:route.topic };
  const q = question.toLowerCase();
  if (/automati/.test(q)) return { answer:'Par défaut, Relanzio fonctionne en mode revue. En Pro, vous pouvez activer le mode automatique puis l’autoriser devis par devis.', needs_human:false, topic:'product' };
  if (/quand|j\+|relance/.test(q)) return { answer:'La séquence standard est J+2, J+5 puis J+10 après la date d’envoi du devis. Elle s’arrête si le devis passe en gagné, perdu ou pause.', needs_human:false, topic:'product' };
  if (/prix|pro|gratuit|tva/.test(q)) return { answer:`La formule gratuite permet de valider le workflow avec ${FREE_LIMIT_TEXT}. La formule Pro est à ${PRO_PRICE_TEXT} et permet jusqu’à ${PRO_LIMIT_TEXT}. ${VAT_NOTICE}. L’abonnement est mensuel récurrent, sans engagement de durée minimale, et résiliable depuis le portail client.`, needs_human:false, topic:'product' };
  return { answer:'Je peux aider sur les relances, les statuts, le mode revue/automatique et l’utilisation du tableau de bord. Pour un cas spécifique, créez un ticket.', needs_human:false, topic:'product' };
}

export async function answerSupport(question) {
  const clean = sanitizeText(question, 2000);
  const route = supportRoute(clean);
  if (!clean || route.needs_human || !openai) return fallback(clean);
  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
      reasoning: { effort:'none' },
      max_output_tokens:300, store:false,
      input: `Tu es le support Relanzio. Réponds en français en 90 mots maximum uniquement à partir de cette base. Si l'information manque, demande de créer un ticket. Ne donne jamais de conseil juridique. Base: ${KB}\nQuestion: ${clean}`
    });
    return { answer:response.output_text?.trim() || fallback(clean).answer, needs_human:false, topic:'product' };
  } catch { return fallback(clean); }
}
