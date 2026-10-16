import { db } from './db.js';
import { sendEmail } from './email.js';
import { normalizeEmail, isValidEmail, sanitizeText } from './logic.js';
import { analyzeReply, qualifyProspect } from './prospecting.js';
import { getBrevoPilotSenderStatus, PILOT_SENDER } from './pilot-outreach.js';
import { outreachHealth } from './outreach.js';

export const COMMERCIAL_STOP_LINE='Si vous préférez ne plus recevoir de message de ma part, dites simplement STOP.';
export const COMMERCIAL_SUBJECTS=Object.freeze(['Question sur vos devis','Suivi de vos devis','Vos devis sans réponse']);
const FORBIDDEN_CLAIMS=['garanti','+30 % de conversion','+30% de conversion','revenu récupéré','illimité','ia autonome'];
const iso=()=>new Date().toISOString();

function commercialError(code,message,status=409){
  const error=new Error(message); error.code=code; error.status=status; return error;
}

export function commercialDailyCap(raw=20){
  const n=Number(raw);
  if(!Number.isInteger(n)||n<1)return 20;
  return Math.min(20,n);
}

export function renderCommercialJ0(personalization){
  const first=sanitizeText(personalization,320);
  if(!first)throw commercialError('COMMERCIAL_PERSONALIZATION_REQUIRED','Personnalisation vérifiée requise.');
  return `Bonjour,

${first}

Je vous contacte car Relanzio aide les entreprises qui travaillent par devis à suivre ceux qui restent sans réponse et à savoir précisément quand relancer.

L’idée est simple : vous voyez les devis à suivre, vous choisissez votre prochaine date de relance, et vous gardez une vue claire jusqu’à la décision du client.

Relanzio propose un essai Pro de 7 jours, sans carte bancaire. Ensuite, la formule Pro est à 29 € / mois.

Si le suivi des devis est un sujet chez vous, je peux vous envoyer le lien.

Bonne journée,
Souhayb
Relanzio
relanzio.com

${COMMERCIAL_STOP_LINE}`;
}

export function validateCommercialJ0({subject,content,personalization}={}){
  const reasons=[];
  if(!COMMERCIAL_SUBJECTS.includes(String(subject||'')))reasons.push('unapproved_subject');
  if(!sanitizeText(personalization,320))reasons.push('missing_personalization');
  const body=String(content||'');
  if(!body.includes(COMMERCIAL_STOP_LINE))reasons.push('missing_stop_line');
  if(!body.includes('7 jours'))reasons.push('missing_trial');
  if(!body.includes('29 € / mois'))reasons.push('missing_price');
  const lower=body.toLowerCase();
  for(const term of FORBIDDEN_CLAIMS)if(lower.includes(term))reasons.push('forbidden_claim_'+term.replace(/\s+/g,'_'));
  return {ok:reasons.length===0,reasons};
}

export async function safeImportCommercialProspects(rows=[]){
  const results=[];
  for(const raw of rows.slice(0,1000)){
    const email=normalizeEmail(raw?.email);
    if(!raw?.company_name||!isValidEmail(email)){
      results.push({email:email||null,imported:false,reason:'invalid_input'}); continue;
    }
    const scored=qualifyProspect({...raw,email});
    const payload={
      company_name:sanitizeText(raw.company_name,160),
      contact_name:sanitizeText(raw.contact_name,120),
      email,
      role:sanitizeText(raw.role,100),
      website:sanitizeText(raw.website,240),
      sector:sanitizeText(raw.sector,160),
      source:sanitizeText(raw.source,120),
      source_url:sanitizeText(raw.source_url,500),
      lawful_basis:'professional_relevance',
      employee_count:Number(raw.employee_count)||null,
      estimated_quotes_per_month:Number(raw.estimated_quotes_per_month)||null,
      uses_digital_tools:Boolean(raw.uses_digital_tools),
      is_service_business:raw.is_service_business!==false,
      score:scored.score,
      score_reasons:scored.reasons,
      status:scored.score>=55?'qualified':'new'
    };
    if(payload.status!=='qualified'){
      results.push({email,imported:false,reason:'score_below_55',score:scored.score}); continue;
    }
    const {data,error}=await db.rpc('safe_import_qualified_prospect',{p:payload});
    if(error)throw error;
    results.push({email,score:scored.score,...data});
  }
  return {
    total:results.length,
    imported:results.filter(x=>x.imported===true).length,
    ignored_duplicate:results.filter(x=>x.reason==='duplicate').length,
    ignored_suppressed:results.filter(x=>x.reason==='suppressed').length,
    ignored_deleted:results.filter(x=>x.reason==='deleted_tombstone').length,
    rejected:results.filter(x=>x.imported!==true&&!['duplicate','suppressed','deleted_tombstone'].includes(x.reason)).length,
    results
  };
}

async function getProspect(prospectId){
  const {data,error}=await db.from('prospects').select('*').eq('id',prospectId).maybeSingle();
  if(error)throw error;
  if(!data)throw commercialError('COMMERCIAL_PROSPECT_NOT_FOUND','Prospect introuvable.',404);
  return data;
}

async function blockers(prospect){
  const [{data:suppressed,error:sError},{data:history,error:hError},{data:queue,error:qError}]=await Promise.all([
    db.from('suppressions').select('email,reason').eq('email',prospect.email).maybeSingle(),
    db.from('outreach_events').select('type,created_at').eq('prospect_id',prospect.id).in('type',['sent','replied','opt_out','meeting','bounced']).limit(20),
    db.from('outreach_queue').select('*').eq('prospect_id',prospect.id).eq('sequence_step',0).limit(2)
  ]);
  if(sError)throw sError;if(hError)throw hError;if(qError)throw qError;
  return {suppressed,history:history||[],queue:queue||[]};
}

export async function prepareCommercialProspect({prospectId,personalization,subject,scheduledAt}){
  const prospect=await getProspect(prospectId);
  if(prospect.status!=='qualified')throw commercialError('COMMERCIAL_NOT_QUALIFIED','Prospect non qualifié.');
  if(prospect.lawful_basis!=='professional_relevance')throw commercialError('COMMERCIAL_BASIS_INVALID','Base de prospection invalide.');
  if(Number(prospect.score||0)<55)throw commercialError('COMMERCIAL_SCORE_LOW','Score insuffisant.');
  if(!/^https?:\/\//i.test(String(prospect.source_url||'')))throw commercialError('COMMERCIAL_SOURCE_REQUIRED','Source professionnelle publique requise.');
  const state=await blockers(prospect);
  if(state.suppressed||prospect.status==='suppressed')throw commercialError('COMMERCIAL_SUPPRESSED','Adresse supprimée.');
  if(state.history.some(x=>x.type==='sent'))throw commercialError('COMMERCIAL_ALREADY_CONTACTED','Un J0 existe déjà.');
  if(state.history.some(x=>['replied','opt_out','meeting','bounced'].includes(x.type)))throw commercialError('COMMERCIAL_PRIOR_RESPONSE','Historique incompatible avec un nouveau J0.');
  if(state.queue.length>1)throw commercialError('COMMERCIAL_J0_AMBIGUOUS','Plusieurs J0 existent.');
  const content=renderCommercialJ0(personalization);
  const check=validateCommercialJ0({subject,content,personalization});
  if(!check.ok)throw commercialError('COMMERCIAL_J0_INVALID',check.reasons.join(', '));
  const when=new Date(scheduledAt||Date.now());
  if(Number.isNaN(when.getTime()))throw commercialError('COMMERCIAL_SCHEDULE_INVALID','Horaire invalide.');
  let queue;
  if(state.queue.length===1){
    if(state.queue[0].status==='sent')throw commercialError('COMMERCIAL_ALREADY_CONTACTED','J0 déjà envoyé.');
    const {data,error}=await db.from('outreach_queue').update({
      status:'ready',subject,content,scheduled_at:when.toISOString(),error:null,updated_at:iso()
    }).eq('id',state.queue[0].id).select('*').single();
    if(error)throw error; queue=data;
  }else{
    const {data,error}=await db.from('outreach_queue').insert({
      prospect_id:prospect.id,sequence_step:0,status:'ready',subject,content,scheduled_at:when.toISOString()
    }).select('*').single();
    if(error)throw error; queue=data;
  }
  return {prospect,queue,personalization};
}

export async function inspectCommercialOutreach(prospectId){
  const prospect=await getProspect(prospectId);
  const state=await blockers(prospect);
  if(prospect.status!=='qualified')throw commercialError('COMMERCIAL_NOT_QUALIFIED','Prospect non qualifié.');
  if(state.suppressed)throw commercialError('COMMERCIAL_SUPPRESSED','Adresse supprimée.');
  if(state.history.some(x=>x.type==='sent'))throw commercialError('COMMERCIAL_ALREADY_CONTACTED','J0 déjà envoyé.');
  if(state.history.some(x=>['replied','opt_out','meeting','bounced'].includes(x.type)))throw commercialError('COMMERCIAL_PRIOR_RESPONSE','Réponse ou bounce antérieur.');
  if(state.queue.length!==1||state.queue[0].status!=='ready')throw commercialError('COMMERCIAL_J0_NOT_READY','J0 non prêt.');
  const content=state.queue[0].content;
  const nonEmpty=content.split('\n').map(x=>x.trim()).filter(Boolean);
  const personalization=nonEmpty[1]||'';
  const validation=validateCommercialJ0({subject:state.queue[0].subject,content,personalization});
  if(!validation.ok)throw commercialError('COMMERCIAL_J0_INVALID',validation.reasons.join(', '));
  const [sender,health]=await Promise.all([getBrevoPilotSenderStatus(),outreachHealth()]);
  if(health.pause)throw commercialError('COMMERCIAL_DELIVERABILITY_PAUSE',health.reason||'deliverability_guard',503);
  const cap=commercialDailyCap(process.env.OUTREACH_DAILY_CAP);
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const get=t=>parts.find(x=>x.type===t)?.value;
  const parisDay=`${get('year')}-${get('month')}-${get('day')}`;
  const {count,error}=await db.from('outreach_daily_slots').select('*',{count:'exact',head:true}).eq('business_date',parisDay);
  if(error)throw error;
  return {
    ok:true,dry_run:true,
    prospect:{id:prospect.id,company_name:prospect.company_name,email:prospect.email,score:prospect.score,sector:prospect.sector,source_url:prospect.source_url},
    queue:{id:state.queue[0].id,status:state.queue[0].status,subject:state.queue[0].subject,scheduled_at:state.queue[0].scheduled_at},
    sender,health,
    checks:{qualified:true,suppressed:false,prior_j0:false,prior_reply:false,ready:true,daily_cap:{used:count||0,cap}}
  };
}

export async function sendCommercialJ0({prospectId,requestedBy}){
  if(process.env.COMMERCIAL_OUTREACH_SEND_ENABLED!=='true')throw commercialError('COMMERCIAL_SEND_DISABLED','Envoi commercial contrôlé désactivé.',423);
  const audit=await inspectCommercialOutreach(prospectId);
  const queueId=audit.queue.id;
  const reservationKey=`commercial-j0:${queueId}`;
  const cap=commercialDailyCap(process.env.OUTREACH_DAILY_CAP);
  const {data:slot,error:slotError}=await db.rpc('claim_outreach_daily_slot',{p_reservation_key:reservationKey,p_queue_id:queueId,p_cap:cap});
  if(slotError)throw slotError;
  if(!slot?.allowed)throw commercialError('COMMERCIAL_DAILY_CAP_REACHED',`Plafond quotidien atteint (${cap}).`,429);
  const {data:claimed,error:claimError}=await db.from('outreach_queue').update({status:'sending',updated_at:iso()})
    .eq('id',queueId).eq('status','ready').select('*').maybeSingle();
  if(claimError)throw claimError;
  if(!claimed)throw commercialError('COMMERCIAL_ALREADY_CLAIMED','J0 déjà revendiqué.');

  try{
    const prospect=await getProspect(prospectId);
    const latest=await blockers(prospect);
    if(latest.suppressed||prospect.status!=='qualified'||latest.history.some(x=>['sent','replied','opt_out','meeting','bounced'].includes(x.type))){
      await db.rpc('finalize_outreach_daily_slot',{p_reservation_key:reservationKey,p_outcome:'definite_failure'});
      await db.from('outreach_queue').update({status:'canceled',error:'blocked_before_send',updated_at:iso()}).eq('id',queueId);
      throw commercialError('COMMERCIAL_BLOCKED_BEFORE_SEND','Prospect bloqué avant envoi.');
    }
    const sent=await sendEmail({
      to:prospect.email,subject:claimed.subject,text:claimed.content,
      replyTo:PILOT_SENDER.replyTo,senderEmail:PILOT_SENDER.email,senderName:'Relanzio',
      tags:['relanzio-commercial','sequence-0']
    });
    const sentAt=iso();
    await db.from('outreach_events').insert({
      prospect_id:prospect.id,type:'sent',subject:claimed.subject,content:claimed.content,provider_message_id:sent?.messageId||null,
      metadata:{mode:'commercial_manual',sequence_step:0,queue_id:queueId,requested_by:String(requestedBy||'').slice(0,200),sender:PILOT_SENDER.email,reply_to:PILOT_SENDER.replyTo,source_url:prospect.source_url||null}
    });
    await db.from('outreach_queue').update({status:'sent',sent_at:sentAt,provider_message_id:sent?.messageId||null,error:null,updated_at:sentAt}).eq('id',queueId);
    await db.from('prospects').update({status:'contacted',last_contacted_at:sentAt,updated_at:sentAt}).eq('id',prospect.id);
    await db.rpc('finalize_outreach_daily_slot',{p_reservation_key:reservationKey,p_outcome:'sent'});
    return {sent:true,prospect_id:prospect.id,queue_id:queueId,provider_message_id:sent?.messageId||null,sent_at:sentAt};
  }catch(error){
    const explicitProviderFailure=/^Brevo\s+[45]\d\d:/.test(String(error?.message||''));
    await db.rpc('finalize_outreach_daily_slot',{p_reservation_key:reservationKey,p_outcome:explicitProviderFailure?'definite_failure':'unknown'});
    const {data:row}=await db.from('outreach_queue').select('status').eq('id',queueId).maybeSingle();
    if(row?.status==='sending')await db.from('outreach_queue').update({status:'failed',error:String(error.message||error).slice(0,1000),updated_at:iso()}).eq('id',queueId);
    throw error;
  }
}

export async function ingestBrevoInbound(payload={}){
  const items=Array.isArray(payload.items)?payload.items:[];
  const results=[];
  for(const item of items){
    const from=normalizeEmail(item?.From?.Address||'');
    const body=sanitizeText(item?.ExtractedMarkdownMessage||item?.RawTextBody||'',5000);
    if(!from||!body){results.push({matched:false,reason:'missing_from_or_body'});continue;}
    const analysis=await analyzeReply(body);
    const dedupeKey=item?.MessageId?`brevo-inbound:${String(item.MessageId).slice(0,500)}`:null;
    const receivedAt=item?.SentAtDate?new Date(item.SentAtDate):new Date();
    const {data,error}=await db.rpc('apply_outreach_reply',{
      p_from_email:from,
      p_category:analysis.category,
      p_sentiment:analysis.sentiment||'neutral',
      p_content:body,
      p_received_at:Number.isNaN(receivedAt.getTime())?iso():receivedAt.toISOString(),
      p_dedupe_key:dedupeKey,
      p_in_reply_to:item?.InReplyTo||null,
      p_metadata:{source:'brevo_inbound',message_id:item?.MessageId||null,subject:sanitizeText(item?.Subject,200),analysis}
    });
    if(error)throw error;
    results.push(data);
  }
  return {processed:items.length,results};
}
