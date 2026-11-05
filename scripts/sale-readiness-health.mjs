// SALE_READINESS_HEALTH — read-only check of a running Relanzio, for the owner or an authorised buyer.
// Run where the production variables are loaded (e.g. a Railway shell): `npm run sale:health`.
//
// Guarantees (tested in test/sale-readiness-health.test.js):
//   • never prints a secret: only booleans, counts, the Stripe mode (live/test), the deployed commit and variable NAMES;
//   • never writes: every HTTP call is a GET (Supabase REST, Stripe, Brevo, the app itself); IMAP only logs in and out;
//   • never sends an email, never changes a flag.
//
// Sections: APP (health, readiness, deployed commit) · DB (expected tables and columns) · BILLING (Stripe price and webhook)
// · EMAIL (Brevo account, sender, webhook, mailboxes) · BACKUPS (Supabase backups, if SUPABASE_ACCESS_TOKEN is given for this run)
// · OUTREACH (flags coherence, no pending J+7) · SECRETS (required names present).

import { PILOT_SENDER } from '../server/pilot-outreach-policy.js';

// Tables and columns the code relies on (latest migration included).
export const EXPECTED_SCHEMA={
  profiles:['id','email','plan','subscription_status','trial_started_at','trial_ends_at','subscription_current_period_start','followup_offsets','morning_digest_enabled'],
  quotes:['id','user_id','status','followup_step','next_followup_at','reply_received_at','client_phone','note'],
  followups:['id','quote_id','status','channel','reply_token','business_date'],
  quote_replies:['id','quote_id','category','effect','dedupe_key','notified_at','forward_attempts'],
  followup_optouts:['user_id','email'],
  suppressions:['email','reason'],
  stripe_webhook_events:['event_id','event_type'],
  prospects:['id','status','score','last_contacted_at'],
  prospect_tombstones:['email'],
  outreach_candidates:['id','status','reject_reason','verification_status'],
  outreach_queue:['id','prospect_id','sequence_step','status','scheduled_at'],
  outreach_events:['id','type','provider_message_id'],
  outreach_daily_slots:['business_date'],
  sales_followups:['prospect_id','status'],
  system_events:['id']
};

export const REQUIRED_SECRETS=['SUPABASE_SERVICE_ROLE_KEY','STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','BREVO_API_KEY','BREVO_WEBHOOK_SECRET','EMAIL_LINK_SECRET'];
export const OPTIONAL_SECRETS=['OUTREACH_BREVO_API_KEY','REPLY_IMAP_PASSWORD','IMAP_PASSWORD','CRON_SECRET','OPENAI_API_KEY'];
const STRIPE_EVENTS=['checkout.session.completed','customer.subscription.updated','customer.subscription.deleted','invoice.paid','invoice.payment_failed'];

const yes=v=>String(v||'').trim()==='true';
const has=v=>String(v||'').trim().length>0;
// Error text from providers can echo request details: drop anything that looks like a key or token.
export const scrub=s=>String(s||'').replace(/[A-Za-z0-9_\-.]{20,}/g,'[redacted]').replace(/\s+/g,' ').slice(0,140);

async function getJson(fetchImpl,url,headers={}){
  const r=await fetchImpl(url,{method:'GET',headers:{accept:'application/json',...headers},signal:AbortSignal.timeout?.(15000)});
  let body=null;try{body=await r.json()}catch{}
  return {ok:r.ok,status:r.status,body,headers:r.headers};
}

const worst=items=>items.some(i=>i.level==='FAIL')?'FAIL':items.some(i=>i.level==='WARNING')?'WARNING':items.some(i=>i.level==='PASS')?'PASS':'NOT_CONFIGURED';

async function checkApp(env,fetchImpl){
  const items=[];
  const base=String(env.APP_URL||'').replace(/\/$/,'');
  const sha=String(env.RAILWAY_GIT_COMMIT_SHA||env.GIT_COMMIT||'').slice(0,7);
  items.push({level:'INFO',text:`deployed commit: ${sha||'unknown'}`});
  if(!/^https?:\/\//.test(base))return [...items,{level:'FAIL',text:'APP_URL missing'}];
  try{const h=await getJson(fetchImpl,base+'/api/health');items.push({level:h.ok&&h.body?.ok===true?'PASS':'FAIL',text:`/api/health HTTP ${h.status}`});}
  catch(e){items.push({level:'FAIL',text:`/api/health unreachable (${scrub(e.code||e.message)})`});}
  try{const r=await getJson(fetchImpl,base+'/api/readiness');items.push({level:r.ok&&r.body?.ready===true?'PASS':'FAIL',text:`/api/readiness ready=${r.body?.ready===true}`});}
  catch(e){items.push({level:'FAIL',text:`/api/readiness unreachable (${scrub(e.code||e.message)})`});}
  return items;
}

function supabaseHeaders(env){return {apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`};}

async function checkDb(env,fetchImpl){
  if(!has(env.SUPABASE_URL)||!has(env.SUPABASE_SERVICE_ROLE_KEY))return [{level:'FAIL',text:'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing'}];
  const base=String(env.SUPABASE_URL).replace(/\/$/,'');
  const items=[];
  for(const [table,cols] of Object.entries(EXPECTED_SCHEMA)){
    try{
      const r=await getJson(fetchImpl,`${base}/rest/v1/${table}?select=${cols.join(',')}&limit=0`,supabaseHeaders(env));
      if(!r.ok)items.push({level:'FAIL',text:`${table}: missing table or column (HTTP ${r.status}${r.body?.code?' '+scrub(r.body.code):''})`});
    }catch(e){items.push({level:'FAIL',text:`${table}: unreachable (${scrub(e.code||e.message)})`});}
  }
  if(!items.length)items.push({level:'PASS',text:`${Object.keys(EXPECTED_SCHEMA).length} tables with expected columns (latest migration: quote_replies.forward_attempts)`});
  return items;
}

async function countRows(env,fetchImpl,path){
  const base=String(env.SUPABASE_URL).replace(/\/$/,'');
  const r=await fetchImpl(`${base}/rest/v1/${path}`,{method:'GET',headers:{...supabaseHeaders(env),prefer:'count=exact',range:'0-0',accept:'application/json'}});
  const m=String(r.headers.get('content-range')||'').match(/\/(\d+)$/);
  if(!r.ok&&r.status!==206)throw Object.assign(new Error('count_failed'),{code:`HTTP_${r.status}`});
  return m?Number(m[1]):0;
}

async function checkBilling(env,fetchImpl){
  if(!yes(env.BILLING_ENABLED))return [{level:'WARNING',text:'BILLING_ENABLED is not true (subscriptions closed)'}];
  if(!has(env.STRIPE_SECRET_KEY)||!has(env.STRIPE_PRO_PRICE_ID))return [{level:'FAIL',text:'STRIPE_SECRET_KEY / STRIPE_PRO_PRICE_ID missing'}];
  const key=String(env.STRIPE_SECRET_KEY);
  const mode=key.startsWith('sk_live_')||key.startsWith('rk_live_')?'live':key.startsWith('sk_test_')||key.startsWith('rk_test_')?'test':'unknown';
  const items=[{level:mode==='live'?'INFO':'WARNING',text:`stripe mode: ${mode}`}];
  const auth={authorization:`Bearer ${key}`};
  try{
    const p=await getJson(fetchImpl,`https://api.stripe.com/v1/prices/${encodeURIComponent(env.STRIPE_PRO_PRICE_ID)}`,auth);
    const ok=p.ok&&p.body?.active===true&&p.body?.unit_amount===2900&&String(p.body?.currency).toLowerCase()==='eur'&&p.body?.recurring?.interval==='month';
    items.push({level:ok?'PASS':'FAIL',text:`Pro price ${ok?'29 EUR / month, active':`unexpected (HTTP ${p.status})`}`});
  }catch(e){items.push({level:'FAIL',text:`Stripe price unreachable (${scrub(e.code||e.message)})`});}
  try{
    const w=await getJson(fetchImpl,'https://api.stripe.com/v1/webhook_endpoints?limit=100',auth);
    const hook=(w.body?.data||[]).find(x=>/\/api\/stripe\/webhook\/?$/.test(String(x.url||''))&&x.status==='enabled');
    const events=hook?.enabled_events||[];
    const ok=Boolean(hook)&&(events.includes('*')||STRIPE_EVENTS.every(e=>events.includes(e)));
    items.push({level:ok?'PASS':'FAIL',text:`webhook /api/stripe/webhook ${ok?'enabled with the 5 events':'missing or incomplete'}`});
  }catch(e){items.push({level:'FAIL',text:`Stripe webhooks unreachable (${scrub(e.code||e.message)})`});}
  if(!has(env.STRIPE_WEBHOOK_SECRET))items.push({level:'FAIL',text:'STRIPE_WEBHOOK_SECRET missing'});
  return items;
}

async function imapLogin(cfg,imapProbe){
  if(imapProbe)return imapProbe(cfg);
  const { ReadOnlyImapClient }=await import('../server/imap-replies.js');
  const client=new ReadOnlyImapClient({...cfg,timeoutMs:10000});
  try{await client.connect();return true;}finally{await client.close();}
}

async function checkEmail(env,fetchImpl,imapProbe){
  const items=[];
  if(!has(env.BREVO_API_KEY))return [{level:'FAIL',text:'BREVO_API_KEY missing'}];
  const auth={'api-key':env.BREVO_API_KEY};
  try{
    const a=await getJson(fetchImpl,'https://api.brevo.com/v3/account',auth);
    const plans=(a.body?.plan||[]).filter(x=>String(x?.creditsType||'').toLowerCase()==='sendlimit').map(x=>`${x.type}:${Number(x.credits)||0}`);
    items.push({level:a.ok?'PASS':'FAIL',text:`Brevo account ${a.ok?'reachable':'HTTP '+a.status}${plans.length?` (credits ${plans.join(', ')})`:''}`});
  }catch(e){items.push({level:'FAIL',text:`Brevo unreachable (${scrub(e.code||e.message)})`});}
  try{
    const s=await getJson(fetchImpl,'https://api.brevo.com/v3/senders',auth);
    const active=(s.body?.senders||[]).filter(x=>x.active===true).map(x=>String(x.email||'').toLowerCase());
    const needed=[String(env.EMAIL_FROM_ADDRESS||'').toLowerCase(),PILOT_SENDER.email].filter(Boolean);
    const missing=needed.filter(x=>!active.includes(x));
    items.push({level:missing.length?'WARNING':'PASS',text:missing.length?`sender(s) not active in Brevo: ${missing.join(', ')}`:'senders active (product + prospection)'});
  }catch(e){items.push({level:'FAIL',text:`Brevo senders unreachable (${scrub(e.code||e.message)})`});}
  try{
    const w=await getJson(fetchImpl,'https://api.brevo.com/v3/webhooks?type=transactional',auth);
    const hook=(w.body?.webhooks||[]).find(x=>/\/api\/brevo\/webhook\/?$/.test(String(x.url||'')));
    items.push({level:hook?'PASS':'FAIL',text:`Brevo delivery webhook ${hook?'present':'missing'}`});
  }catch(e){items.push({level:'FAIL',text:`Brevo webhooks unreachable (${scrub(e.code||e.message)})`});}
  if(!has(env.BREVO_WEBHOOK_SECRET))items.push({level:'FAIL',text:'BREVO_WEBHOOK_SECRET missing'});
  if(!has(env.EMAIL_LINK_SECRET))items.push({level:'FAIL',text:'EMAIL_LINK_SECRET missing (unsubscribe links)'});
  for(const [label,prefix,addressVar] of [['reply mailbox','REPLY_IMAP_','REPLY_INBOUND_ADDRESS'],['commercial mailbox','IMAP_',null]]){
    const cfg={host:env[prefix+'HOST'],port:Number(env[prefix+'PORT']||993),user:env[prefix+'USER'],password:env[prefix+'PASSWORD']};
    if(!has(cfg.host)||!has(cfg.user)||!has(cfg.password)||(addressVar&&!has(env[addressVar]))){items.push({level:'WARNING',text:`${label}: not configured`});continue;}
    try{await imapLogin(cfg,imapProbe);items.push({level:'PASS',text:`${label}: IMAP login OK (TLS ${cfg.port})`});}
    catch(e){items.push({level:'FAIL',text:`${label}: IMAP login failed (${scrub(e.code||e.message)})`});}
  }
  return items;
}

async function checkBackups(env,fetchImpl){
  const ref=String(env.SUPABASE_URL||'').match(/^https:\/\/([a-z0-9]+)\.supabase\.co/i)?.[1];
  if(!has(env.SUPABASE_ACCESS_TOKEN)||!ref)return [{level:'WARNING',text:'not verifiable here: check Supabase → Database → Backups, or run with SUPABASE_ACCESS_TOKEN (read-only management token) for this check'}];
  try{
    const r=await getJson(fetchImpl,`https://api.supabase.com/v1/projects/${ref}/database/backups`,{authorization:`Bearer ${env.SUPABASE_ACCESS_TOKEN}`});
    const list=r.body?.backups||[];
    const latest=list.map(b=>Date.parse(b.inserted_at||'')).filter(Number.isFinite).sort((a,b)=>b-a)[0];
    const ageH=latest?Math.round((Date.now()-latest)/3600000):null;
    if(!r.ok)return [{level:'WARNING',text:`backups endpoint HTTP ${r.status}`}];
    return [{level:latest&&ageH<=48?'PASS':'WARNING',text:`${list.length} backup(s); latest ${ageH==null?'none':ageH+' h ago'}; PITR ${r.body?.pitr_enabled===true?'on':'off'}`}];
  }catch(e){return [{level:'WARNING',text:`backups unreachable (${scrub(e.code||e.message)})`}];}
}

async function checkOutreach(env,fetchImpl){
  const flags={
    COMMERCIAL_FEEDER_ENABLED:yes(env.COMMERCIAL_FEEDER_ENABLED),COMMERCIAL_SEQUENCE_ENABLED:yes(env.COMMERCIAL_SEQUENCE_ENABLED),
    COMMERCIAL_OUTREACH_SEND_ENABLED:yes(env.COMMERCIAL_OUTREACH_SEND_ENABLED),LEGAL_PAGES_APPROVED:yes(env.LEGAL_PAGES_APPROVED),
    IMAP_E2E_CERTIFIED:yes(env.IMAP_E2E_CERTIFIED),ACQUISITION_ENABLED:yes(env.ACQUISITION_ENABLED)
  };
  const items=[{level:'INFO',text:'flags '+Object.entries(flags).map(([k,v])=>`${k}=${v}`).join(' ')}];
  const sending=flags.COMMERCIAL_SEQUENCE_ENABLED&&flags.COMMERCIAL_OUTREACH_SEND_ENABLED;
  if(sending&&(!flags.LEGAL_PAGES_APPROVED||!flags.IMAP_E2E_CERTIFIED))items.push({level:'WARNING',text:'sending enabled but LEGAL_PAGES_APPROVED / IMAP_E2E_CERTIFIED not true: the engine will stay paused'});
  if(flags.ACQUISITION_ENABLED)items.push({level:'WARNING',text:'ACQUISITION_ENABLED=true: legacy queue active (recommended: false)'});
  if(has(env.SUPABASE_URL)&&has(env.SUPABASE_SERVICE_ROLE_KEY)){
    try{
      const j7=await countRows(env,fetchImpl,'outreach_queue?select=id&sequence_step=gte.2&status=in.(held,ready,queued,sending)');
      items.push({level:j7===0?'PASS':'FAIL',text:`pending third step (J+7): ${j7}`});
      const ready=await countRows(env,fetchImpl,'outreach_queue?select=id&sequence_step=eq.0&status=in.(held,ready,queued)');
      items.push({level:'INFO',text:`D0 waiting in queue: ${ready}`});
    }catch(e){items.push({level:'FAIL',text:`queue unreadable (${scrub(e.code||e.message)})`});}
  }
  if(!items.some(i=>i.level==='PASS'||i.level==='FAIL'||i.level==='WARNING'))items.push({level:'PASS',text:'no inconsistency'});
  return items;
}

function checkSecrets(env){
  const missing=REQUIRED_SECRETS.filter(n=>!has(env[n]));
  const optional=OPTIONAL_SECRETS.filter(n=>!has(env[n]));
  return [{level:missing.length?'FAIL':'PASS',text:missing.length?`missing: ${missing.join(', ')}`:`${REQUIRED_SECRETS.length} required present`},
    ...(optional.length?[{level:'INFO',text:`optional not set: ${optional.join(', ')}`}]:[])];
}

export async function runHealth({env=process.env,fetchImpl=globalThis.fetch,imapProbe=null}={}){
  const sections={
    APP:await checkApp(env,fetchImpl),
    DB:await checkDb(env,fetchImpl),
    BILLING:await checkBilling(env,fetchImpl),
    EMAIL:await checkEmail(env,fetchImpl,imapProbe),
    BACKUPS:await checkBackups(env,fetchImpl),
    OUTREACH:await checkOutreach(env,fetchImpl),
    SECRETS:checkSecrets(env)
  };
  const status=Object.fromEntries(Object.entries(sections).map(([k,v])=>[k,k==='SECRETS'?(worst(v)==='PASS'?'CONFIGURED':'MISSING'):worst(v)]));
  const lines=['SALE_READINESS_HEALTH',...Object.keys(sections).map(k=>`${k}: ${status[k]}`),''];
  for(const [k,v] of Object.entries(sections))for(const i of v)lines.push(`  [${k}] ${i.level.padEnd(7)} ${i.text}`);
  return {status,sections,report:lines.join('\n'),ok:!Object.values(status).some(s=>s==='FAIL'||s==='MISSING')};
}

if(import.meta.url===`file://${process.argv[1]}`){
  await import('dotenv/config');
  const {report,ok}=await runHealth();
  console.log(report);
  process.exit(ok?0:1);
}
