import OpenAI from 'openai';
import { classifyReplyFallback, scoreProspect } from './logic.js';
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
export function qualifyProspect(prospect) { return scoreProspect(prospect); }

const schema = {
  type:'object', additionalProperties:false,
  properties:{
    category:{type:'string',enum:['interested','not_now','pricing','feature_request','not_interested','opt_out','other']},
    sentiment:{type:'string',enum:['positive','neutral','negative']},
    confidence:{type:'number',minimum:0,maximum:1}, needs_human:{type:'boolean'},
    summary:{type:'string'}, objection:{type:'string'}, requested_feature:{type:'string'}
  },
  required:['category','sentiment','confidence','needs_human','summary','objection','requested_feature']
};

export async function analyzeReply(text) {
  const fallback = classifyReplyFallback(text);
  if (!openai) return fallback;
  try {
    const response = await openai.responses.create({
      model:process.env.OPENAI_MODEL || 'gpt-5.6-luna', reasoning:{effort:'none'}, max_output_tokens:300, store:false,
      input:`Analyse cette réponse à une prospection B2B pour Relanzio. N'infère rien qui n'est pas dans le texte. Une demande d'arrêt est toujours opt_out. Texte: ${String(text).slice(0,4000)}`,
      text:{ format:{ type:'json_schema', name:'reply_analysis', strict:true, schema } }
    });
    const parsed = JSON.parse(response.output_text);
    return { ...parsed, summary:String(parsed.summary).slice(0,160), objection:String(parsed.objection||'').slice(0,160), requested_feature:String(parsed.requested_feature||'').slice(0,160) };
  } catch { return fallback; }
}
