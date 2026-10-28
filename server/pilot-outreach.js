import { resolveCname, resolveTxt } from 'node:dns/promises';
import { evaluateBrevoDomainAuth } from './brevo-domain-auth.js';
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

function dnsName(host,domain='relanzio.com'){
  const raw=String(host||'').trim().replace(/\.$/,'');
  if(!raw)return '';
  if(raw===domain||raw.endsWith('.'+domain))return raw;
  return `${raw}.${domain}`;
}

function normalizeDnsTarget(value=''){
  return String(value||'').trim().replace(/\.$/,'').toLowerCase();
}

async function verifyPublicDkim(record,domain='relanzio.com'){
  const host=dnsName(record?.host_name,domain);
  if(!host)return false;
  const type=String(record?.type||'TXT').toUpperCase();
  try{
    if(type==='CNAME'){
      const rows=await resolveCname(host);
      if(!Array.isArray(rows)||!rows.length)return false;
      const expected=normalizeDnsTarget(record?.value);
      if(!expected)return true;
      return rows.map(normalizeDnsTarget).includes(expected);
    }
    const rows=await resolveTxt(host);
    const values=rows.map(parts=>parts.join('').replace(/\s+/g,'')).filter(Boolean);
    const expected=String(record?.value||'').replace(/\s+/g,'');
    if(expected)return values.some(v=>v===expected||v.includes(expected)||expected.includes(v));
    return values.some(v=>/p=[A-Za-z0-9+/=]+/i.test(v)||/^v=DKIM1;/i.test(v));
  }catch{return false}
}

export async function getBrevoPilotSenderStatus() {
  if (!process.env.BREVO_API_KEY) throw pilotError('PILOT_BREVO_NOT_CONFIGURED', 'Brevo n’est pas configuré.', 503);
  const headers = { accept:'application/json', 'api-key':process.env.BREVO_API_KEY };
  const [sendersResponse, domainResponse, accountResponse, webhooksResponse, spfRows, dmarcRows] = await Promise.all([
    fetch('https://api.brevo.com/v3/senders', { method:'GET', headers }),
    fetch('https://api.brevo.com/v3/senders/domains/relanzio.com', { method:'GET', headers }),
    fetch('https://api.brevo.com/v3/account', { method:'GET', headers }),
    fetch('https://api.brevo.com/v3/webhooks?type=transactional&sort=desc', { method:'GET', headers }),
    resolveTxt('relanzio.com').catch(()=>[]),
    resolveTxt('_dmarc.relanzio.com').catch(()=>[])
  ]);
  if (!sendersResponse.ok) throw pilotError('PILOT_BREVO_SENDER_CHECK_FAILED', `Brevo sender check ${sendersResponse.status}: ${await sendersResponse.text()}`, 503);
  if (!domainResponse.ok) throw pilotError('PILOT_BREVO_DOMAIN_CHECK_FAILED', `Brevo domain check ${domainResponse.status}: ${await domainResponse.text()}`, 503);
  if (!accountResponse.ok) throw pilotError('PILOT_BREVO_ACCOUNT_CHECK_FAILED', `Brevo account check ${accountResponse.status}: ${await accountResponse.text()}`, 503);
  if (!webhooksResponse.ok) throw pilotError('PILOT_BREVO_WEBHOOK_CHECK_FAILED', `Brevo webhook check ${webhooksResponse.status}: ${await webhooksResponse.text()}`, 503);

  const payload = await sendersResponse.json();
  const account = await accountResponse.json();
  const domainPayload = await domainResponse.json();
  const webhookPayload = await webhooksResponse.json();
  const senders = payload.senders || [];
  const sender = senders.find(x => String(x.email || '').toLowerCase() === PILOT_SENDER.email);
  const domainAuth=evaluateBrevoDomainAuth(domainPayload);
  const spf=spfRows.map(parts=>parts.join('')).find(x=>/^v=spf1\b/i.test(x))||null;
  const dmarc=dmarcRows.map(parts=>parts.join('')).find(x=>/^v=DMARC1\b/i.test(x))||null;
  const spfOk=Boolean(spf&&/(brevo|sendinblue)/i.test(spf));
  const dkimDnsChecks=await Promise.all(domainAuth.dkim_records.map(async record=>({
    key:record.key,
    status:record.status,
    type:record.type,
    host_name:record.host_name,
    dns_ok:await verifyPublicDkim(record,'relanzio.com')
  })));
  const dkimOk=domainAuth.dkim_ok&&dkimDnsChecks.length>0&&dkimDnsChecks.every(x=>x.dns_ok===true);
  const dmarcOk=Boolean(dmarc)&&domainAuth.dmarc_ok;
  const webhooks=webhookPayload?.webhooks||[];
  const transactionalWebhook=webhooks.find(w=>{
    const events=(w.events||[]).map(x=>String(x).toLowerCase());
    return String(w.type||'').toLowerCase()==='transactional'
      &&/\/api\/brevo\/webhook\/?$/i.test(String(w.url||''))
      &&['hardbounce','softbounce','delivered','unsubscribed'].every(x=>events.includes(x.toLowerCase()));
  });

  const sendCreditPlans=(account.plan||[])
    .filter(x=>String(x?.creditsType||'').toLowerCase()==='sendlimit'&&String(x?.type||'').toLowerCase()!=='sms')
    .map(x=>({type:String(x?.type||''),credits:Number(x?.credits)}))
    .filter(x=>Number.isFinite(x.credits)&&x.credits>0);
  const providerAvailableCredits=sendCreditPlans.length?Math.max(...sendCreditPlans.map(x=>x.credits)):0;
  const details = {
    sender_found:Boolean(sender),
    sender_active:sender?.active === true,
    domain_verified:domainAuth.verified,
    domain_authenticated:domainAuth.authenticated,
    spf_ok:spfOk,
    dkim_ok:dkimOk,
    dkim_records:dkimDnsChecks,
    brevo_code_ok:domainAuth.brevo_code_ok,
    dmarc_ok:dmarcOk,
    webhook_ok:Boolean(transactionalWebhook),
    provider_available_credits:providerAvailableCredits,
    provider_plan_types:sendCreditPlans.map(x=>x.type),
    relay_enabled:account?.relay?.enabled===true,
    active_relanzio_senders:senders
      .filter(x => x.active === true && String(x.email || '').toLowerCase().endsWith('@relanzio.com'))
      .map(x => String(x.email || '').toLowerCase())
  };
  if (!sender) {
    const error = pilotError('PILOT_SENDER_NOT_REGISTERED', `${PILOT_SENDER.email} n’est pas enregistré comme expéditeur Brevo.`, 503);
    error.details = details; throw error;
  }
  if (sender.active !== true) {
    const error = pilotError('PILOT_SENDER_NOT_ACTIVE', `${PILOT_SENDER.email} n’est pas actif dans Brevo.`, 503);
    error.details = details; throw error;
  }
  if (!domainAuth.verified || !domainAuth.authenticated || !spfOk || !dkimOk || !dmarcOk) {
    const error = pilotError('PILOT_DOMAIN_NOT_AUTHENTICATED', 'SPF, DKIM, DMARC ou authentification Brevo invalide.', 503);
    error.details = details; throw error;
  }
  if (!transactionalWebhook) {
    const error=pilotError('PILOT_BREVO_WEBHOOK_NOT_READY','Webhook Brevo transactionnel incomplet ou indisponible.',503);
    error.details=details; throw error;
  }
  if (!providerAvailableCredits) {
    const error = pilotError('PILOT_BREVO_NO_SEND_CAPACITY', 'Aucun crédit d’envoi Brevo disponible ou lisible.', 429);
    error.details = details; throw error;
  }
  return {
    accepted:true,
    id:sender.id ?? null,
    registered_name:sender.name || null,
    active:true,
    domain_verified:true,
    domain_authenticated:true,
    spf_ok:true,
    dkim_ok:true,
    dkim_records:dkimDnsChecks,
    brevo_code_ok:domainAuth.brevo_code_ok,
    dmarc_ok:true,
    webhook_ok:true,
    provider_available_credits:providerAvailableCredits,
    provider_plan_types:details.provider_plan_types,
    relay_enabled:details.relay_enabled,
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
    .update({ status:'sending', error:null, updated_at:claimedAt })
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
      tags:['relanzio-pilot','sequence-0'],
      stream:'outreach'
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
    if (row?.status === 'sending') {
      await db.from('outreach_queue').update({
        status:'failed',
        error:String(error.message || error).slice(0,1000),
        updated_at:iso()
      }).eq('id', queueId);
    }
    throw error;
  }
}
