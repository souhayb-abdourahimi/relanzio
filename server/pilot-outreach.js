import { db } from './db.js';
import { sendEmail } from './email.js';
import {
  PILOT_SENDER,
  pilotDailyCap,
  pilotAllowlist,
  validatePilotProspect,
  validatePilotJ0
} from './pilot-outreach-policy.js';

const iso = () => new Date().toISOString();

function pilotError(code, message, status = 409) {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
}

async function must(resultPromise) {
  const result = await resultPromise;
  if (result.error) throw result.error;
  return result.data;
}

async function getProspect(prospectId) {
  const { data, error } = await db.from('prospects').select('*').eq('id', prospectId).maybeSingle();
  if (error) throw error;
  if (!data) throw pilotError('PILOT_PROSPECT_NOT_FOUND', 'Prospect introuvable.', 404);
  return data;
}

async function getPriorJ0Sent(prospectId) {
  const { data, error } = await db.from('outreach_events')
    .select('id,provider_message_id,subject,content,metadata,created_at')
    .eq('prospect_id', prospectId)
    .eq('type', 'sent')
    .order('created_at', { ascending:false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function getHeldJ0(prospectId) {
  const { data, error } = await db.from('outreach_queue').select('*')
    .eq('prospect_id', prospectId)
    .eq('sequence_step', 0)
    .eq('status', 'held')
    .order('created_at', { ascending:true })
    .limit(2);
  if (error) throw error;
  if (!data?.length) throw pilotError('PILOT_J0_NOT_HELD', 'Aucun J0 pilote en attente pour ce prospect.');
  if (data.length !== 1) throw pilotError('PILOT_J0_AMBIGUOUS', 'Plusieurs J0 pilotes en attente existent pour ce prospect.');
  return data[0];
}

async function getSuppression(email) {
  const { data, error } = await db.from('suppressions').select('email,reason,created_at').eq('email', email).maybeSingle();
  if (error) throw error;
  return data;
}

async function pilotSentLast24h() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await db.from('outreach_events')
    .select('*', { count:'exact', head:true })
    .eq('type', 'sent')
    .contains('metadata', { mode:'pilot_manual' })
    .gte('created_at', since);
  if (error) throw error;
  return count || 0;
}

export async function getBrevoPilotSenderStatus() {
  if (!process.env.BREVO_API_KEY) throw pilotError('PILOT_BREVO_NOT_CONFIGURED', 'Brevo n’est pas configuré.', 503);
  const response = await fetch('https://api.brevo.com/v3/senders', {
    method:'GET',
    headers:{ accept:'application/json', 'api-key':process.env.BREVO_API_KEY }
  });
  if (!response.ok) throw pilotError('PILOT_BREVO_SENDER_CHECK_FAILED', `Brevo sender check ${response.status}: ${await response.text()}`, 503);
  const payload = await response.json();
  const sender = (payload.senders || []).find(x => String(x.email || '').toLowerCase() === PILOT_SENDER.email);
  if (!sender) throw pilotError('PILOT_SENDER_NOT_REGISTERED', `${PILOT_SENDER.email} n’est pas enregistré comme expéditeur Brevo.`, 503);
  if (sender.active !== true) throw pilotError('PILOT_SENDER_NOT_ACTIVE', `${PILOT_SENDER.email} n’est pas actif dans Brevo.`, 503);
  return {
    accepted:true,
    id:sender.id ?? null,
    registered_name:sender.name || null,
    active:true,
    from:`${PILOT_SENDER.name} <${PILOT_SENDER.email}>`,
    reply_to:PILOT_SENDER.replyTo
  };
}

export async function inspectPilotOutreach(prospectId) {
  const prospect = await getProspect(prospectId);
  const allowlist = pilotAllowlist(process.env.PILOT_OUTREACH_ALLOWED_EMAILS);
  const prospectCheck = validatePilotProspect(prospect, allowlist);
  if (!prospectCheck.ok) throw pilotError('PILOT_PROSPECT_NOT_APPROVED', `Prospect non autorisé pour le pilote: ${prospectCheck.reasons.join(', ')}`);

  const suppressed = await getSuppression(prospect.email);
  if (suppressed || prospect.status === 'suppressed') throw pilotError('PILOT_RECIPIENT_SUPPRESSED', 'Adresse supprimée, bloquée ou opposée.');

  const prior = await getPriorJ0Sent(prospect.id);
  if (prior) throw pilotError('PILOT_J0_ALREADY_SENT', 'Un J0 a déjà été envoyé à ce prospect.');

  const queue = await getHeldJ0(prospect.id);
  const queueCheck = validatePilotJ0(queue);
  if (!queueCheck.ok) throw pilotError('PILOT_J0_NOT_APPROVED', `J0 non conforme: ${queueCheck.reasons.join(', ')}`);

  const cap = pilotDailyCap(process.env.PILOT_OUTREACH_DAILY_CAP);
  const sentLast24h = await pilotSentLast24h();
  if (sentLast24h >= cap) throw pilotError('PILOT_DAILY_CAP_REACHED', `Plafond pilote atteint (${cap}/24h).`, 429);

  const sender = await getBrevoPilotSenderStatus();
  return {
    ok:true,
    dry_run:true,
    prospect:{ id:prospect.id, company_name:prospect.company_name, email:prospect.email },
    queue:{ id:queue.id, subject:queue.subject, content:queue.content, scheduled_at:queue.scheduled_at, status:queue.status },
    sender,
    checks:{
      admin_route_required:true,
      in_allowlist:true,
      qualified:true,
      professional_source:true,
      suppressed:false,
      prior_j0_sent:false,
      exact_stored_j0:true,
      daily_cap:{ sent_last_24h:sentLast24h, cap }
    }
  };
}

export async function sendPilotOutreach({ prospectId, requestedBy, dryRun = false }) {
  if (dryRun) return inspectPilotOutreach(prospectId);

  const prior = await getPriorJ0Sent(prospectId);
  if (prior?.metadata?.mode === 'pilot_manual' && Number(prior.metadata?.sequence_step) === 0) {
    return {
      sent:true,
      idempotent:true,
      prospect_id:prospectId,
      provider_message_id:prior.provider_message_id || null,
      sent_at:prior.created_at,
      subject:prior.subject,
      content:prior.content
    };
  }
  if (prior) throw pilotError('PILOT_J0_ALREADY_SENT', 'Un J0 a déjà été envoyé à ce prospect.');

  const validation = await inspectPilotOutreach(prospectId);
  const queueId = validation.queue.id;
  const claimedAt = iso();
  const { data:claimed, error:claimError } = await db.from('outreach_queue')
    .update({ status:'pilot_sending', error:null, updated_at:claimedAt })
    .eq('id', queueId)
    .eq('status', 'held')
    .select('*')
    .maybeSingle();
  if (claimError) throw claimError;
  if (!claimed) throw pilotError('PILOT_J0_ALREADY_CLAIMED', 'Ce J0 a déjà été revendiqué par un autre envoi.');

  try {
    const prospect = await getProspect(prospectId);
    const suppressed = await getSuppression(prospect.email);
    if (suppressed || prospect.status === 'suppressed') {
      await must(db.from('outreach_queue').update({ status:'canceled', error:'suppressed_before_send', updated_at:iso() }).eq('id', queueId));
      throw pilotError('PILOT_RECIPIENT_SUPPRESSED', 'Adresse supprimée, bloquée ou opposée.');
    }

    const afterClaimPrior = await getPriorJ0Sent(prospectId);
    if (afterClaimPrior) {
      await must(db.from('outreach_queue').update({ status:'canceled', error:'j0_already_sent', updated_at:iso() }).eq('id', queueId));
      throw pilotError('PILOT_J0_ALREADY_SENT', 'Un J0 a déjà été envoyé à ce prospect.');
    }

    const cap = pilotDailyCap(process.env.PILOT_OUTREACH_DAILY_CAP);
    const sentLast24h = await pilotSentLast24h();
    if (sentLast24h >= cap) {
      await must(db.from('outreach_queue').update({ status:'held', error:'pilot_daily_cap', updated_at:iso() }).eq('id', queueId));
      throw pilotError('PILOT_DAILY_CAP_REACHED', `Plafond pilote atteint (${cap}/24h).`, 429);
    }

    await getBrevoPilotSenderStatus();

    const sent = await sendEmail({
      to:prospect.email,
      subject:claimed.subject,
      text:claimed.content,
      replyTo:PILOT_SENDER.replyTo,
      senderEmail:PILOT_SENDER.email,
      senderName:PILOT_SENDER.name,
      tags:['relanzio-pilot','sequence-0']
    });

    const sentAt = iso();
    const metadata = {
      mode:'pilot_manual',
      sequence_step:0,
      queue_id:queueId,
      requested_by:String(requestedBy || '').slice(0,200),
      sender:PILOT_SENDER.email,
      reply_to:PILOT_SENDER.replyTo,
      source_url:prospect.source_url || null
    };
    await must(db.from('outreach_events').insert({
      prospect_id:prospect.id,
      type:'sent',
      subject:claimed.subject,
      content:claimed.content,
      provider_message_id:sent?.messageId || null,
      metadata
    }));
    await must(db.from('outreach_queue').update({
      status:'sent',
      sent_at:sentAt,
      provider_message_id:sent?.messageId || null,
      error:null,
      updated_at:sentAt
    }).eq('id', queueId));
    await must(db.from('prospects').update({
      status:'contacted',
      last_contacted_at:sentAt,
      updated_at:sentAt
    }).eq('id', prospect.id));

    return {
      sent:true,
      idempotent:false,
      prospect_id:prospect.id,
      email:prospect.email,
      queue_id:queueId,
      provider_message_id:sent?.messageId || null,
      sent_at:sentAt,
      subject:claimed.subject,
      content:claimed.content,
      sender:`${PILOT_SENDER.name} <${PILOT_SENDER.email}>`,
      reply_to:PILOT_SENDER.replyTo
    };
  } catch (error) {
    const { data:row } = await db.from('outreach_queue').select('status').eq('id', queueId).maybeSingle();
    if (row?.status === 'pilot_sending') {
      await db.from('outreach_queue').update({
        status:'pilot_failed',
        error:String(error.message || error).slice(0,1000),
        updated_at:iso()
      }).eq('id', queueId);
    }
    throw error;
  }
}
