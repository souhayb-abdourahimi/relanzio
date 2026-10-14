import { createClient } from '@supabase/supabase-js';
import { db } from './db.js';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function adminAccessToken() {
  const adminEmail = String(process.env.ADMIN_EMAILS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean)[0];
  if (!adminEmail) throw new Error('PILOT_RUNNER_ADMIN_EMAIL_MISSING');
  const { data:link, error:linkError } = await db.auth.admin.generateLink({ type:'magiclink', email:adminEmail });
  if (linkError) throw linkError;
  const tokenHash = link?.properties?.hashed_token;
  if (!tokenHash) throw new Error('PILOT_RUNNER_TOKEN_HASH_MISSING');
  const anon = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth:{ persistSession:false, autoRefreshToken:false }
  });
  const { data:verified, error:verifyError } = await anon.auth.verifyOtp({ token_hash:tokenHash, type:'magiclink' });
  if (verifyError) throw verifyError;
  const accessToken = verified?.session?.access_token;
  if (!accessToken) throw new Error('PILOT_RUNNER_ACCESS_TOKEN_MISSING');
  return { accessToken, adminEmail };
}

async function callPilotEndpoint({ accessToken, prospectId, dryRun }) {
  const port = Number(process.env.PORT || 3000);
  const response = await fetch(`http://127.0.0.1:${port}/api/admin/outreach/send-pilot`, {
    method:'POST',
    headers:{
      'content-type':'application/json',
      authorization:`Bearer ${accessToken}`
    },
    body:JSON.stringify({ prospect_id:prospectId, dry_run:dryRun })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || `Pilot endpoint HTTP ${response.status}`);
    error.code = payload.code || 'PILOT_ENDPOINT_FAILED';
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function scheduledAtFor(prospectId) {
  const { data, error } = await db.from('outreach_queue')
    .select('scheduled_at,status')
    .eq('prospect_id', prospectId)
    .eq('sequence_step', 0)
    .order('created_at', { ascending:true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data?.scheduled_at) throw new Error('PILOT_RUNNER_SCHEDULE_MISSING');
  return data;
}

export async function runPilotAdminRunner() {
  if (process.env.PILOT_ADMIN_RUNNER_ENABLED !== 'true') return;
  const ids = String(process.env.PILOT_ADMIN_RUNNER_IDS || '').split(',').map(x => x.trim()).filter(Boolean).slice(0,5);
  if (!ids.length) throw new Error('PILOT_RUNNER_IDS_MISSING');

  // Give the HTTP listener a moment to become reachable.
  await sleep(500);
  const { accessToken, adminEmail } = await adminAccessToken();

  const validations = [];
  for (const prospectId of ids) {
    try {
      const result = await callPilotEndpoint({ accessToken, prospectId, dryRun:true });
      validations.push({ ok:true, prospect:result.prospect, sender:result.sender, checks:result.checks, queue:{id:result.queue.id,status:result.queue.status,subject:result.queue.subject} });
    } catch (error) {
      validations.push({ ok:false, prospect_id:prospectId, code:error.code || 'PILOT_DRY_RUN_FAILED', error:error.message });
    }
  }
  console.log('PILOT_ENDPOINT_DRY_RUN '+JSON.stringify({admin:adminEmail,results:validations}));
  if (validations.some(x => !x.ok)) {
    console.log('PILOT_SEND_BATCH_ABORTED dry_run_failed');
    return;
  }
  if (process.env.PILOT_ADMIN_RUNNER_SEND !== 'true') return;

  for (const prospectId of ids) {
    const schedule = await scheduledAtFor(prospectId);
    const dueAt = new Date(schedule.scheduled_at).getTime();
    const delay = Math.max(0, dueAt - Date.now());
    setTimeout(async () => {
      try {
        const { accessToken:freshAccessToken } = await adminAccessToken();
        const result = await callPilotEndpoint({ accessToken:freshAccessToken, prospectId, dryRun:false });
        console.log('PILOT_ENDPOINT_SEND '+JSON.stringify({
          ok:true,
          prospect_id:prospectId,
          email:result.email,
          sent_at:result.sent_at,
          provider_message_id:result.provider_message_id,
          subject:result.subject,
          sender:result.sender,
          reply_to:result.reply_to,
          idempotent:result.idempotent
        }));
      } catch (error) {
        console.log('PILOT_ENDPOINT_SEND '+JSON.stringify({
          ok:false,
          prospect_id:prospectId,
          code:error.code || 'PILOT_SEND_FAILED',
          status:error.status || null,
          error:error.message
        }));
      }
    }, delay);
  }
  console.log('PILOT_SEND_BATCH_SCHEDULED '+JSON.stringify({count:ids.length}));
}
