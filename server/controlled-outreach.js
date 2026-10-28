import { resolveMx } from 'node:dns/promises';
import { db } from './db.js';
import { sendEmail } from './email.js';
import { normalizeEmail, isValidEmail, sanitizeText } from './logic.js';
import { COMMERCIAL_STOP_LINE, COMMERCIAL_SUBJECTS, commercialDailyCap, isCommercialBusinessWindow, renderCommercialJ0, renderCommercialJ3, validateCommercialJ0, validateCommercialJ3 } from './controlled-outreach-policy.js';
import { analyzeReply, qualifyProspect } from './prospecting.js';
import { getBrevoPilotSenderStatus } from './pilot-outreach.js';
import { PILOT_SENDER } from './pilot-outreach-policy.js';
import { outreachHealth } from './outreach.js';
import { imapConfiguration, pollImapReplies } from './imap-replies.js';
import { log } from './observability.js';

export { COMMERCIAL_STOP_LINE, COMMERCIAL_SUBJECTS, commercialDailyCap, isCommercialBusinessWindow, renderCommercialJ0, renderCommercialJ3, validateCommercialJ0, validateCommercialJ3 } from './controlled-outreach-policy.js';

const iso=()=>new Date().toISOString();
function commercialError(code,message,status=409){
  const error=new Error(message);
  error.code=code;
  error.status=status;
  return error;
}

async function getImapInboundReadiness(){
  const cfg=imapConfiguration();
  const certified=process.env.IMAP_E2E_CERTIFIED==='true';
  return {
    ready:Boolean(cfg.configured&&cfg.secure&&cfg.port===993&&certified),
    reason:!cfg.configured?'imap_not_configured':!cfg.secure||cfg.port!==993?'imap_tls_required':!certified?'imap_e2e_not_certified':null,
    transport:'imap_ovh',
    tls:Boolean(cfg.secure&&cfg.port===993),
    certified
  };
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
  const [{data:suppressed,error:sError},{data:tombstone,error:tError},{data:history,error:hError},{data:queue,error:qError},{count:emailDupes,error:dError}]=await Promise.all([
    db.from('suppressions').select('email,reason').eq('email',prospect.email).maybeSingle(),
    db.from('prospect_tombstones').select('email,reason').eq('email',prospect.email).maybeSingle(),
    db.from('outreach_events').select('type,created_at,provider_message_id,metadata').eq('prospect_id',prospect.id)
      .in('type',['sent','delivered','replied','opt_out','meeting','bounced']).order('created_at',{ascending:true}).limit(100),
    db.from('outreach_queue').select('*').eq('prospect_id',prospect.id).eq('sequence_step',0).limit(2),
    db.from('prospects').select('*',{count:'exact',head:true}).ilike('email',prospect.email)
  ]);
  if(sError)throw sError;if(tError)throw tError;if(hError)throw hError;if(qError)throw qError;if(dError)throw dError;
  return {suppressed,tombstone,history:history||[],queue:queue||[],emailDupes:emailDupes||0};
}

async function ensureMx(email){
  const domain=String(email||'').split('@')[1]?.toLowerCase();
  if(!domain)throw commercialError('COMMERCIAL_EMAIL_INVALID','Adresse email invalide.');
  try{
    const mx=await resolveMx(domain);
    if(!Array.isArray(mx)||!mx.length)throw new Error('no_mx');
    return mx;
  }catch{
    throw commercialError('COMMERCIAL_MX_INVALID','Aucun MX valide pour le domaine destinataire.',409);
  }
}

function providerCapacity(sender,used=0){
  const credits=Math.max(0,Math.floor(Number(sender?.provider_available_credits)||0));
  if(!credits)throw commercialError('COMMERCIAL_PROVIDER_CAPACITY_UNKNOWN','Capacité Brevo indisponible.',503);
  const free=Array.isArray(sender?.provider_plan_types)&&sender.provider_plan_types.some(x=>String(x).toLowerCase()==='free');
  const providerRemaining=free?Math.min(credits,Math.max(0,300-used)):credits;
  const providerCap=used+providerRemaining;
  const cap=commercialDailyCap(process.env.OUTREACH_DAILY_CAP,providerCap);
  return {used,cap,remaining:Math.max(0,cap-used),provider_remaining:providerRemaining,plan:free?'free':'paid_or_prepaid'};
}

async function dailySlotUsage(){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const get=t=>parts.find(x=>x.type===t)?.value;
  const parisDay=`${get('year')}-${get('month')}-${get('day')}`;
  const {count,error}=await db.from('outreach_daily_slots').select('*',{count:'exact',head:true}).eq('business_date',parisDay);
  if(error)throw error;
  return count||0;
}

async function getJ3Queue(prospectId){
  const {data,error}=await db.from('outreach_queue').select('*').eq('prospect_id',prospectId).eq('sequence_step',1).limit(2);
  if(error)throw error;
  return data||[];
}

async function cancelLegacyJ7(prospectId){
  const {error}=await db.from('outreach_queue').update({
    status:'canceled',error:'sequence_simplified_no_j7',updated_at:iso()
  }).eq('prospect_id',prospectId).gte('sequence_step',2).in('status',['held','ready','queued']);
  if(error)throw error;
}

async function ensureCommercialJ3(prospect,d0Subject,sentAt){
  await cancelLegacyJ7(prospect.id);
  const existing=await getJ3Queue(prospect.id);
  if(existing.length>1)throw commercialError('COMMERCIAL_J3_AMBIGUOUS','Plusieurs J+3 existent.');
  if(existing.length===1)return existing[0];
  const subject=`Re: ${String(d0Subject||'').slice(0,130)}`;
  const content=renderCommercialJ3({companyName:prospect.company_name,sector:prospect.sector});
  const validation=validateCommercialJ3({subject,content,companyName:prospect.company_name,sector:prospect.sector});
  if(!validation.ok)throw commercialError('COMMERCIAL_J3_INVALID',validation.reasons.join(', '));
  const scheduledAt=new Date(new Date(sentAt).getTime()+3*86400000).toISOString();
  const {data,error}=await db.from('outreach_queue').insert({
    prospect_id:prospect.id,sequence_step:1,status:'held',subject,content,scheduled_at:scheduledAt,error:'awaiting_j3_due'
  }).select('*').single();
  if(error)throw error;
  return data;
}

export async function prepareCommercialProspect({prospectId,personalization,subject,scheduledAt}){
  const prospect=await getProspect(prospectId);
  if(prospect.last_contacted_at)throw commercialError('COMMERCIAL_ALREADY_CONTACTED','Ce prospect a déjà été contacté.');
  if(prospect.status!=='qualified')throw commercialError('COMMERCIAL_NOT_QUALIFIED','Prospect non qualifié.');
  if(prospect.lawful_basis!=='professional_relevance')throw commercialError('COMMERCIAL_BASIS_INVALID','Base de prospection invalide.');
  if(Number(prospect.score||0)<55)throw commercialError('COMMERCIAL_SCORE_LOW','Score insuffisant.');
  if(!/^https?:\/\//i.test(String(prospect.source_url||'')))throw commercialError('COMMERCIAL_SOURCE_REQUIRED','Source professionnelle publique requise.');
  const state=await blockers(prospect);
  if(state.suppressed||prospect.status==='suppressed')throw commercialError('COMMERCIAL_SUPPRESSED','Adresse supprimée.');
  if(state.tombstone)throw commercialError('COMMERCIAL_TOMBSTONED','Prospect supprimé définitivement.');
  if(state.emailDupes!==1)throw commercialError('COMMERCIAL_DUPLICATE_EMAIL','Adresse email dupliquée.');
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
  if(prospect.last_contacted_at)throw commercialError('COMMERCIAL_ALREADY_CONTACTED','Ce prospect a déjà été contacté.');
  if(prospect.status!=='qualified')throw commercialError('COMMERCIAL_NOT_QUALIFIED','Prospect non qualifié.');
  if(state.suppressed||prospect.status==='suppressed')throw commercialError('COMMERCIAL_SUPPRESSED','Adresse supprimée.');
  if(state.tombstone)throw commercialError('COMMERCIAL_TOMBSTONED','Prospect supprimé définitivement.');
  if(state.emailDupes!==1)throw commercialError('COMMERCIAL_DUPLICATE_EMAIL','Adresse email dupliquée.');
  if(state.history.some(x=>x.type==='sent'))throw commercialError('COMMERCIAL_ALREADY_CONTACTED','J0 déjà envoyé.');
  if(state.history.some(x=>['replied','opt_out','meeting','bounced'].includes(x.type)))throw commercialError('COMMERCIAL_PRIOR_RESPONSE','Réponse ou bounce antérieur.');
  if(state.queue.length!==1||!['held','ready'].includes(state.queue[0].status))throw commercialError('COMMERCIAL_J0_NOT_READY','J0 non prêt.');
  const content=state.queue[0].content;
  const nonEmpty=content.split('\n').map(x=>x.trim()).filter(Boolean);
  const personalization=nonEmpty[1]||'';
  const validation=validateCommercialJ0({subject:state.queue[0].subject,content,personalization});
  if(!validation.ok)throw commercialError('COMMERCIAL_J0_INVALID',validation.reasons.join(', '));
  await ensureMx(prospect.email);
  const [sender,health,inbound,used]=await Promise.all([getBrevoPilotSenderStatus(),outreachHealth(),getImapInboundReadiness(),dailySlotUsage()]);
  if(sender.active!==true||sender.domain_verified!==true||sender.domain_authenticated!==true)throw commercialError('COMMERCIAL_DOMAIN_NOT_AUTHENTICATED','Domaine Brevo ou sender non opérationnel.',503);
  if(sender.reply_to!==PILOT_SENDER.replyTo)throw commercialError('COMMERCIAL_REPLY_TO_INVALID','Reply-To commercial inattendu.',503);
  if(!inbound.ready)throw commercialError('COMMERCIAL_INBOUND_NOT_READY','Ingestion des réponses entrantes non certifiée.',503);
  if(health.pause)throw commercialError('COMMERCIAL_DELIVERABILITY_PAUSE',health.reason||'deliverability_guard',503);
  const capacity=providerCapacity(sender,used);
  if(capacity.remaining<1)throw commercialError('COMMERCIAL_DAILY_CAP_REACHED',`Capacité d’envoi épuisée (${capacity.cap}).`,429);
  return {
    ok:true,dry_run:true,
    prospect:{id:prospect.id,company_name:prospect.company_name,email:prospect.email,score:prospect.score,sector:prospect.sector,source_url:prospect.source_url},
    queue:{id:state.queue[0].id,status:state.queue[0].status,subject:state.queue[0].subject,scheduled_at:state.queue[0].scheduled_at},
    sender,health,inbound,
    checks:{qualified:true,suppressed:false,tombstoned:false,duplicate_email:false,prior_j0:false,prior_reply:false,mx:true,ready:true,daily_cap:capacity}
  };
}

export async function sendCommercialJ0({prospectId,requestedBy}){
  if(process.env.LEGAL_PAGES_APPROVED!=='true')throw commercialError('COMMERCIAL_LEGAL_GATE','Pages légales non approuvées.',423);
  if(process.env.COMMERCIAL_OUTREACH_SEND_ENABLED!=='true')throw commercialError('COMMERCIAL_SEND_DISABLED','Envoi commercial contrôlé désactivé.',423);
  const audit=await inspectCommercialOutreach(prospectId);
  const queueId=audit.queue.id;
  const reservationKey=`commercial-j0:${queueId}`;
  const cap=audit.checks.daily_cap.cap;
  const {data:slot,error:slotError}=await db.rpc('claim_outreach_daily_slot',{p_reservation_key:reservationKey,p_queue_id:queueId,p_cap:cap});
  if(slotError)throw slotError;
  if(!slot?.allowed)throw commercialError('COMMERCIAL_DAILY_CAP_REACHED',`Capacité quotidienne atteinte (${cap}).`,429);
  const {data:claimed,error:claimError}=await db.from('outreach_queue').update({status:'sending',error:null,updated_at:iso()})
    .eq('id',queueId).in('status',['held','ready']).select('*').maybeSingle();
  if(claimError)throw claimError;
  if(!claimed)throw commercialError('COMMERCIAL_ALREADY_CLAIMED','J0 déjà revendiqué.');

  try{
    const prospect=await getProspect(prospectId);
    const latest=await blockers(prospect);
    if(latest.suppressed||latest.tombstone||latest.emailDupes!==1||prospect.status!=='qualified'||latest.history.some(x=>['sent','replied','opt_out','meeting','bounced'].includes(x.type))){
      await db.rpc('finalize_outreach_daily_slot',{p_reservation_key:reservationKey,p_outcome:'definite_failure'});
      await db.from('outreach_queue').update({status:'canceled',error:'blocked_before_send',updated_at:iso()}).eq('id',queueId);
      throw commercialError('COMMERCIAL_BLOCKED_BEFORE_SEND','Prospect bloqué avant envoi.');
    }
    await ensureMx(prospect.email);
    const sent=await sendEmail({
      to:prospect.email,subject:claimed.subject,text:claimed.content,
      replyTo:PILOT_SENDER.replyTo,senderEmail:PILOT_SENDER.email,senderName:'Relanzio',
      tags:['relanzio-commercial','sequence-0'],stream:'outreach'
    });
    const sentAt=iso();
    await db.from('outreach_events').insert({
      prospect_id:prospect.id,type:'sent',subject:claimed.subject,content:claimed.content,provider_message_id:sent?.messageId||null,
      metadata:{mode:'commercial_controlled',sequence_step:0,queue_id:queueId,requested_by:String(requestedBy||'').slice(0,200),sender:PILOT_SENDER.email,reply_to:PILOT_SENDER.replyTo,source_url:prospect.source_url||null}
    });
    await db.from('outreach_queue').update({status:'sent',sent_at:sentAt,provider_message_id:sent?.messageId||null,error:null,updated_at:sentAt}).eq('id',queueId);
    await db.from('prospects').update({status:'contacted',last_contacted_at:sentAt,updated_at:sentAt}).eq('id',prospect.id);
    await db.rpc('finalize_outreach_daily_slot',{p_reservation_key:reservationKey,p_outcome:'sent'});
    try{await ensureCommercialJ3({...prospect,status:'contacted'},claimed.subject,sentAt)}
    catch(j3Error){log('error','outreach.commercial-sequence','J+3 scheduling failed after confirmed D0',{prospect_id:prospect.id,queue_id:queueId,code:j3Error?.code||'J3_SCHEDULE_FAILED'});}
    return {sent:true,prospect_id:prospect.id,queue_id:queueId,provider_message_id:sent?.messageId||null,sent_at:sentAt,sequence_step:0};
  }catch(error){
    const explicitProviderFailure=/^Brevo\s+[45]\d\d:/.test(String(error?.message||''));
    await db.rpc('finalize_outreach_daily_slot',{p_reservation_key:reservationKey,p_outcome:explicitProviderFailure?'definite_failure':'unknown'});
    const {data:row}=await db.from('outreach_queue').select('status').eq('id',queueId).maybeSingle();
    if(row?.status==='sending')await db.from('outreach_queue').update({status:'failed',error:String(error.message||error).slice(0,1000),updated_at:iso()}).eq('id',queueId);
    throw error;
  }
}

export async function inspectCommercialJ3(prospectId){
  const prospect=await getProspect(prospectId);
  const state=await blockers(prospect);
  const j3=await getJ3Queue(prospectId);
  if(state.suppressed||prospect.status==='suppressed')throw commercialError('COMMERCIAL_SUPPRESSED','Adresse supprimée.');
  if(state.tombstone)throw commercialError('COMMERCIAL_TOMBSTONED','Prospect supprimé définitivement.');
  if(state.emailDupes!==1)throw commercialError('COMMERCIAL_DUPLICATE_EMAIL','Adresse email dupliquée.');
  if(prospect.status!=='contacted')throw commercialError('COMMERCIAL_J3_STATUS_INVALID','Le prospect n’est pas en état contacted.');
  if(prospect.last_reply_at||prospect.reply_category)throw commercialError('COMMERCIAL_PRIOR_RESPONSE','Une réponse humaine existe déjà.');
  const stop=state.history.some(x=>['replied','opt_out','meeting','bounced'].includes(x.type));
  if(stop)throw commercialError('COMMERCIAL_PRIOR_RESPONSE','Réponse, opposition ou bounce antérieur.');
  const d0=state.history.find(x=>x.type==='sent'&&Number(x.metadata?.sequence_step||0)===0);
  if(!d0)throw commercialError('COMMERCIAL_J3_NO_D0','Aucun D0 réellement envoyé.');
  const delivered=state.history.some(x=>x.type==='delivered'&&(!d0.provider_message_id||x.provider_message_id===d0.provider_message_id));
  if(!delivered)throw commercialError('COMMERCIAL_J3_D0_NOT_DELIVERED','Le D0 n’a pas de confirmation de livraison.');
  if(state.history.some(x=>x.type==='sent'&&Number(x.metadata?.sequence_step)===1))throw commercialError('COMMERCIAL_J3_ALREADY_SENT','J+3 déjà envoyée.');
  if(j3.length!==1||!['held','ready'].includes(j3[0].status))throw commercialError('COMMERCIAL_J3_NOT_READY','J+3 non prête.');
  if(new Date(j3[0].scheduled_at).getTime()>Date.now())throw commercialError('COMMERCIAL_J3_NOT_DUE','J+3 pas encore due.');
  const validation=validateCommercialJ3({subject:j3[0].subject,content:j3[0].content,companyName:prospect.company_name,sector:prospect.sector});
  if(!validation.ok)throw commercialError('COMMERCIAL_J3_INVALID',validation.reasons.join(', '));
  await ensureMx(prospect.email);
  const [sender,health,inbound,used]=await Promise.all([getBrevoPilotSenderStatus(),outreachHealth(),getImapInboundReadiness(),dailySlotUsage()]);
  if(sender.active!==true||sender.domain_verified!==true||sender.domain_authenticated!==true)throw commercialError('COMMERCIAL_DOMAIN_NOT_AUTHENTICATED','Domaine Brevo ou sender non opérationnel.',503);
  if(sender.reply_to!==PILOT_SENDER.replyTo)throw commercialError('COMMERCIAL_REPLY_TO_INVALID','Reply-To commercial inattendu.',503);
  if(!inbound.ready)throw commercialError('COMMERCIAL_INBOUND_NOT_READY','Ingestion des réponses entrantes non certifiée.',503);
  if(health.pause)throw commercialError('COMMERCIAL_DELIVERABILITY_PAUSE',health.reason||'deliverability_guard',503);
  const capacity=providerCapacity(sender,used);
  if(capacity.remaining<1)throw commercialError('COMMERCIAL_DAILY_CAP_REACHED',`Capacité d’envoi épuisée (${capacity.cap}).`,429);
  return {
    ok:true,dry_run:true,
    prospect:{id:prospect.id,company_name:prospect.company_name,email:prospect.email,score:prospect.score,sector:prospect.sector},
    queue:{id:j3[0].id,status:j3[0].status,subject:j3[0].subject,scheduled_at:j3[0].scheduled_at},
    sender,health,inbound,
    checks:{d0_sent:true,d0_delivered:true,no_response:true,suppressed:false,tombstoned:false,duplicate_email:false,mx:true,daily_cap:capacity}
  };
}

export async function sendCommercialJ3({prospectId,requestedBy}){
  if(process.env.LEGAL_PAGES_APPROVED!=='true')throw commercialError('COMMERCIAL_LEGAL_GATE','Pages légales non approuvées.',423);
  if(process.env.COMMERCIAL_OUTREACH_SEND_ENABLED!=='true')throw commercialError('COMMERCIAL_SEND_DISABLED','Envoi commercial contrôlé désactivé.',423);
  const audit=await inspectCommercialJ3(prospectId);
  const queueId=audit.queue.id;
  const reservationKey=`commercial-j3:${queueId}`;
  const cap=audit.checks.daily_cap.cap;
  const {data:slot,error:slotError}=await db.rpc('claim_outreach_daily_slot',{p_reservation_key:reservationKey,p_queue_id:queueId,p_cap:cap});
  if(slotError)throw slotError;
  if(!slot?.allowed)throw commercialError('COMMERCIAL_DAILY_CAP_REACHED',`Capacité quotidienne atteinte (${cap}).`,429);
  const {data:claimed,error:claimError}=await db.from('outreach_queue').update({status:'sending',error:null,updated_at:iso()})
    .eq('id',queueId).in('status',['held','ready']).select('*').maybeSingle();
  if(claimError)throw claimError;
  if(!claimed)throw commercialError('COMMERCIAL_ALREADY_CLAIMED','J+3 déjà revendiquée.');
  try{
    const prospect=await getProspect(prospectId);
    const state=await blockers(prospect);
    if(state.suppressed||state.tombstone||state.emailDupes!==1||prospect.status!=='contacted'||prospect.last_reply_at||prospect.reply_category||
      state.history.some(x=>['replied','opt_out','meeting','bounced'].includes(x.type))||
      state.history.some(x=>x.type==='sent'&&Number(x.metadata?.sequence_step)===1)){
      await db.rpc('finalize_outreach_daily_slot',{p_reservation_key:reservationKey,p_outcome:'definite_failure'});
      await db.from('outreach_queue').update({status:'canceled',error:'blocked_before_j3_send',updated_at:iso()}).eq('id',queueId);
      throw commercialError('COMMERCIAL_BLOCKED_BEFORE_SEND','J+3 bloquée avant envoi.');
    }
    await ensureMx(prospect.email);
    const sent=await sendEmail({
      to:prospect.email,subject:claimed.subject,text:claimed.content,
      replyTo:PILOT_SENDER.replyTo,senderEmail:PILOT_SENDER.email,senderName:'Relanzio',
      tags:['relanzio-commercial','sequence-1'],stream:'outreach'
    });
    const sentAt=iso();
    await db.from('outreach_events').insert({
      prospect_id:prospect.id,type:'sent',subject:claimed.subject,content:claimed.content,provider_message_id:sent?.messageId||null,
      metadata:{mode:'commercial_controlled',sequence_step:1,queue_id:queueId,requested_by:String(requestedBy||'').slice(0,200),sender:PILOT_SENDER.email,reply_to:PILOT_SENDER.replyTo,source_url:prospect.source_url||null}
    });
    await db.from('outreach_queue').update({status:'sent',sent_at:sentAt,provider_message_id:sent?.messageId||null,error:null,updated_at:sentAt}).eq('id',queueId);
    await db.from('prospects').update({last_contacted_at:sentAt,updated_at:sentAt}).eq('id',prospect.id);
    await cancelLegacyJ7(prospect.id);
    await db.rpc('finalize_outreach_daily_slot',{p_reservation_key:reservationKey,p_outcome:'sent'});
    return {sent:true,prospect_id:prospect.id,queue_id:queueId,provider_message_id:sent?.messageId||null,sent_at:sentAt,sequence_step:1};
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


function permanentSequenceError(error){
  return new Set([
    'COMMERCIAL_PROSPECT_NOT_FOUND','COMMERCIAL_NOT_QUALIFIED','COMMERCIAL_SUPPRESSED','COMMERCIAL_TOMBSTONED',
    'COMMERCIAL_DUPLICATE_EMAIL','COMMERCIAL_PRIOR_RESPONSE','COMMERCIAL_ALREADY_CONTACTED','COMMERCIAL_J0_INVALID',
    'COMMERCIAL_J3_STATUS_INVALID','COMMERCIAL_J3_NO_D0','COMMERCIAL_J3_D0_NOT_DELIVERED','COMMERCIAL_J3_ALREADY_SENT',
    'COMMERCIAL_J3_INVALID','COMMERCIAL_MX_INVALID','COMMERCIAL_BLOCKED_BEFORE_SEND'
  ]).has(String(error?.code||''));
}

async function pauseCommercialSequence(reason){
  log('warn','outreach.commercial-sequence','Commercial sequence paused',{reason:String(reason||'sequence_paused').slice(0,200)});
  return {paused:true,reason};
}

export async function runCommercialSequenceTick(){
  if(process.env.COMMERCIAL_SEQUENCE_ENABLED!=='true')return {skipped:'sequence_disabled'};
  if(process.env.COMMERCIAL_OUTREACH_SEND_ENABLED!=='true')return {skipped:'commercial_send_disabled'};
  if(!isCommercialBusinessWindow())return {skipped:'outside_french_business_hours'};

  try{
    const imap=await pollImapReplies();
    if(imap?.connected!==true)return await pauseCommercialSequence('imap_not_operational');
  }catch(error){
    return await pauseCommercialSequence(`imap_error:${error?.code||'IMAP_POLL_FAILED'}`);
  }

  const health=await outreachHealth();
  if(health.pause)return await pauseCommercialSequence(`deliverability:${health.reason||'guard'}`);

  const {data:due,error:dueError}=await db.from('outreach_queue').select('id,prospect_id,sequence_step,scheduled_at,status')
    .in('sequence_step',[0,1]).in('status',['held','ready']).lte('scheduled_at',iso())
    .order('sequence_step',{ascending:false}).order('scheduled_at',{ascending:true}).limit(12);
  if(dueError)throw dueError;
  if(!due?.length)return {skipped:'nothing_due'};

  for(const item of due){
    try{
      const result=item.sequence_step===1
        ? await sendCommercialJ3({prospectId:item.prospect_id,requestedBy:'commercial_sequence_d0_j3'})
        : await sendCommercialJ0({prospectId:item.prospect_id,requestedBy:'commercial_sequence_d0_j3'});
      log('info','outreach.commercial-sequence',item.sequence_step===1?'Commercial J+3 sent':'Commercial D0 sent',{
        queue_id:item.id,prospect_id:item.prospect_id,sequence_step:item.sequence_step,sent_at:result.sent_at,provider_message_id:result.provider_message_id
      });
      return result;
    }catch(error){
      if(permanentSequenceError(error)){
        await db.from('outreach_queue').update({
          status:'canceled',error:String(error.code||error.message||'sequence_invalid').slice(0,1000),updated_at:iso()
        }).eq('id',item.id).in('status',['held','ready','failed']);
        log('warn','outreach.commercial-sequence','Commercial queue item canceled after validation',{
          queue_id:item.id,prospect_id:item.prospect_id,sequence_step:item.sequence_step,code:error?.code||'VALIDATION_FAILED'
        });
        continue;
      }
      return await pauseCommercialSequence(`send_error:${error?.code||'COMMERCIAL_SEND_FAILED'}`);
    }
  }
  return {skipped:'no_eligible_due_item'};
}

