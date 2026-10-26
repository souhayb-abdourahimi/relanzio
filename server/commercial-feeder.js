import { lookup, resolveMx } from 'node:dns/promises';
import { isIP } from 'node:net';
import { db } from './db.js';
import { normalizeEmail, isValidEmail, sanitizeText } from './logic.js';
import { qualifyProspect } from './prospecting.js';
import { prepareCommercialProspect, safeImportCommercialProspects } from './controlled-outreach.js';
import { log } from './observability.js';

const FREE_MAIL_DOMAINS=new Set([
  'gmail.com','googlemail.com','orange.fr','wanadoo.fr','outlook.com','hotmail.com','hotmail.fr',
  'live.com','live.fr','yahoo.com','yahoo.fr','icloud.com','me.com','free.fr','laposte.net','sfr.fr'
]);
const QUOTE_WORKFLOW_RE=/\b(devis|demande\s+de\s+(?:prix|devis)|obtenir\s+un\s+devis|estimation|quote\s+request|request\s+a\s+quote)\b/i;
const EMAIL_SOURCE_MAX_BYTES=2*1024*1024;
const FETCH_TIMEOUT_MS=10_000;
const iso=()=>new Date().toISOString();

function feederInt(name,fallback,min,max){
  const n=Number(process.env[name]);
  return Number.isInteger(n)?Math.min(max,Math.max(min,n)):fallback;
}

export function commercialFeederConfig(){
  const threshold=feederInt('COMMERCIAL_D0_STOCK_THRESHOLD',8,1,100);
  const target=Math.max(threshold,feederInt('COMMERCIAL_D0_STOCK_TARGET',18,1,120));
  return {
    enabled:process.env.COMMERCIAL_FEEDER_ENABLED==='true',
    threshold,target,
    batchMax:feederInt('COMMERCIAL_FEEDER_BATCH_MAX',10,1,25),
    maxVerificationAgeDays:feederInt('COMMERCIAL_VERIFICATION_MAX_AGE_DAYS',45,1,180)
  };
}

export function emailDomain(email=''){
  return normalizeEmail(email).split('@')[1]||'';
}

export function isFreeMailboxDomain(domain=''){
  return FREE_MAIL_DOMAINS.has(String(domain||'').toLowerCase());
}

function isPrivateAddress(address=''){
  const a=String(address||'').toLowerCase();
  if(!isIP(a))return true;
  if(a==='::1'||a==='::'||a.startsWith('fe80:')||a.startsWith('fc')||a.startsWith('fd'))return true;
  if(a.includes(':'))return false;
  const parts=a.split('.').map(Number);
  if(parts.length!==4||parts.some(x=>!Number.isInteger(x)||x<0||x>255))return true;
  if(parts[0]===10||parts[0]===127||parts[0]===0)return true;
  if(parts[0]===169&&parts[1]===254)return true;
  if(parts[0]===172&&parts[1]>=16&&parts[1]<=31)return true;
  if(parts[0]===192&&parts[1]===168)return true;
  if(parts[0]===100&&parts[1]>=64&&parts[1]<=127)return true;
  if(parts[0]===198&&(parts[1]===18||parts[1]===19))return true;
  if(parts[0]>=224)return true;
  return false;
}

async function assertPublicHttpUrl(raw){
  let url;
  try{url=new URL(String(raw||''));}catch{throw new Error('source_url_invalid')}
  if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw new Error('source_url_invalid');
  const addresses=await lookup(url.hostname,{all:true,verbatim:true});
  if(!addresses?.length||addresses.some(x=>isPrivateAddress(x.address)))throw new Error('source_url_not_public');
  return url;
}

async function readLimitedText(response){
  const len=Number(response.headers.get('content-length')||0);
  if(len>EMAIL_SOURCE_MAX_BYTES)throw new Error('source_too_large');
  if(!response.body)return '';
  const reader=response.body.getReader();
  const chunks=[];
  let total=0;
  while(true){
    const {done,value}=await reader.read();
    if(done)break;
    total+=value.byteLength;
    if(total>EMAIL_SOURCE_MAX_BYTES){try{await reader.cancel()}catch{};throw new Error('source_too_large')}
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function safeFetchText(raw){
  let current=String(raw||'');
  for(let redirects=0;redirects<4;redirects++){
    const url=await assertPublicHttpUrl(current);
    const response=await fetch(url,{
      method:'GET',redirect:'manual',signal:AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers:{'user-agent':'RelanzioProspectVerifier/1.0 (+https://relanzio.com)','accept':'text/html,text/plain;q=0.9,*/*;q=0.1'}
    });
    if(response.status>=300&&response.status<400&&response.headers.get('location')){
      current=new URL(response.headers.get('location'),url).toString();
      continue;
    }
    if(!response.ok)throw new Error('source_http_'+response.status);
    return {url:url.toString(),status:response.status,text:await readLimitedText(response)};
  }
  throw new Error('source_redirect_loop');
}

function normalizedPageText(text=''){
  return String(text||'').replace(/&#0*64;|&#x0*40;|&commat;/gi,'@').replace(/&nbsp;/gi,' ').toLowerCase();
}

export function candidatePersonalization(candidate={}){
  const sector=sanitizeText(candidate.sector||'votre activité de service',120);
  return `Votre site présente un parcours de demande de devis pour vos prestations de ${sector}.`;
}

async function verifyMx(email){
  const domain=emailDomain(email);
  if(!domain)throw new Error('invalid_email_domain');
  const rows=await resolveMx(domain);
  if(!Array.isArray(rows)||!rows.length)throw new Error('mx_missing');
  return rows;
}

async function verifyPublishedEvidence(candidate){
  const email=normalizeEmail(candidate.email);
  const emailSource=candidate.source_url;
  const workflowSource=candidate.workflow_url||candidate.source_url||candidate.website;
  const emailPage=await safeFetchText(emailSource);
  const emailText=normalizedPageText(emailPage.text);
  if(!emailText.includes(email))throw new Error('public_email_not_found');

  let workflowPage=emailPage;
  if(workflowSource&&String(workflowSource)!==String(emailSource))workflowPage=await safeFetchText(workflowSource);
  const workflowText=normalizedPageText(workflowPage.text);
  if(!QUOTE_WORKFLOW_RE.test(workflowText))throw new Error('quote_workflow_not_confirmed');
  return {
    email_source_url:emailPage.url,
    workflow_url:workflowPage.url,
    email_http_status:emailPage.status,
    workflow_http_status:workflowPage.status,
    checked_at:iso()
  };
}

async function duplicateProfessionalDomain(email,{excludeProspectId=null}={}){
  const domain=emailDomain(email);
  if(!domain||isFreeMailboxDomain(domain))return null;
  const {data,error}=await db.from('prospects').select('id,company_name,email').ilike('email',`%@${domain}`).limit(10);
  if(error)throw error;
  const matches=(data||[]).filter(x=>x.id!==excludeProspectId);
  return matches[0]||null;
}

async function exactProtections(email,{excludeProspectId=null}={}){
  const [{data:suppression,error:sError},{data:tombstone,error:tError},{data:dupes,error:dError}]=await Promise.all([
    db.from('suppressions').select('email,reason').eq('email',email).maybeSingle(),
    db.from('prospect_tombstones').select('email,reason').eq('email',email).maybeSingle(),
    db.from('prospects').select('id,email,status,last_reply_at,reply_category').ilike('email',email).limit(5)
  ]);
  if(sError)throw sError;if(tError)throw tError;if(dError)throw dError;
  const other=(dupes||[]).filter(x=>x.id!==excludeProspectId);
  return {suppression,tombstone,duplicate:other[0]||null};
}

function candidateStateFromInput(raw,score){
  const verification=String(raw?.verification_status||raw?.verification||'').trim().toLowerCase();
  if(!['pass','warn','fail'].includes(verification))return {ok:false,reason:'verification_status_required'};
  const verifiedAt=new Date(raw?.verified_at||raw?.verification_date||'');
  if(Number.isNaN(verifiedAt.getTime()))return {ok:false,reason:'verified_at_required'};
  const publicEmailConfirmed=raw?.public_email_confirmed===true||raw?.email_public===true;
  const workflowVerified=raw?.workflow_verified===true||raw?.quote_workflow_verified===true;
  let status='waiting',rejectReason=null;
  if(verification==='fail'){status='rejected';rejectReason='verification_fail'}
  else if(!publicEmailConfirmed||!workflowVerified){status='manual_review';rejectReason='verification_evidence_incomplete'}
  else if(score<55){status='rejected';rejectReason='score_below_55'}
  return {ok:true,verification,verifiedAt:verifiedAt.toISOString(),publicEmailConfirmed,workflowVerified,status,rejectReason};
}

export async function stageCommercialCandidates(rows=[]){
  const results=[];
  for(const raw of rows.slice(0,1000)){
    const email=normalizeEmail(raw?.email);
    const companyName=sanitizeText(raw?.company_name,160);
    if(!companyName||!isValidEmail(email)){results.push({email:email||null,staged:false,reason:'invalid_input'});continue;}
    const scored=qualifyProspect({...raw,email});
    const state=candidateStateFromInput(raw,scored.score);
    if(!state.ok){results.push({email,staged:false,reason:state.reason});continue;}
    const payload={
      batch_key:sanitizeText(raw?.batch_key||raw?.batch||'',160)||null,
      company_name:companyName,
      contact_name:sanitizeText(raw?.contact_name,120)||null,
      email,
      role:sanitizeText(raw?.role,100)||null,
      website:sanitizeText(raw?.website,500)||null,
      sector:sanitizeText(raw?.sector,160)||null,
      source:sanitizeText(raw?.source,160)||null,
      source_url:sanitizeText(raw?.source_url||raw?.email_source_url,1000),
      workflow_url:sanitizeText(raw?.workflow_url||raw?.quote_url||raw?.source_url,1000)||null,
      personalization:sanitizeText(raw?.personalization,320)||null,
      employee_count:Number(raw?.employee_count)||null,
      estimated_quotes_per_month:Number(raw?.estimated_quotes_per_month)||null,
      uses_digital_tools:Boolean(raw?.uses_digital_tools),
      is_service_business:raw?.is_service_business!==false,
      score:scored.score,
      verification_status:state.verification,
      warning_codes:Array.isArray(raw?.warning_codes)?raw.warning_codes.slice(0,50):[],
      verification_notes:raw?.verification_notes&&typeof raw.verification_notes==='object'?raw.verification_notes:{},
      public_email_confirmed:state.publicEmailConfirmed,
      workflow_verified:state.workflowVerified,
      verified_at:state.verifiedAt,
      status:state.status,
      reject_reason:state.rejectReason,
      updated_at:iso()
    };
    if(!/^https?:\/\//i.test(payload.source_url)){results.push({email,staged:false,reason:'public_source_required'});continue;}
    const {data:existing,error:eError}=await db.from('outreach_candidates').select('id,status').ilike('email',email).limit(1).maybeSingle();
    if(eError)throw eError;
    if(existing?.status==='imported'){results.push({email,staged:false,reason:'already_imported'});continue;}
    let row,error;
    if(existing){
      ({data:row,error}=await db.from('outreach_candidates').update(payload).eq('id',existing.id).select('id,status,verification_status,score').single());
    }else{
      ({data:row,error}=await db.from('outreach_candidates').insert(payload).select('id,status,verification_status,score').single());
    }
    if(error)throw error;
    results.push({email,staged:true,id:row.id,status:row.status,verification_status:row.verification_status,score:row.score});
  }
  return {
    total:results.length,
    staged:results.filter(x=>x.staged).length,
    waiting:results.filter(x=>x.staged&&x.status==='waiting').length,
    manual_review:results.filter(x=>x.staged&&x.status==='manual_review').length,
    rejected:results.filter(x=>!x.staged||x.status==='rejected').length,
    results
  };
}

async function activeD0Stock(){
  const {count,error}=await db.from('outreach_queue').select('*',{count:'exact',head:true})
    .eq('sequence_step',0).in('status',['held','ready','queued','sending']);
  if(error)throw error;
  return count||0;
}

async function queueExists(prospectId){
  const {count,error}=await db.from('outreach_queue').select('*',{count:'exact',head:true}).eq('prospect_id',prospectId).eq('sequence_step',0);
  if(error)throw error;
  return (count||0)>0;
}

async function prepareExistingQualified(limit){
  const {data,error}=await db.from('prospects').select('*').eq('status','qualified').is('last_contacted_at',null)
    .order('score',{ascending:false}).limit(Math.max(limit*4,20));
  if(error)throw error;
  const prepared=[],blocked=[];
  for(const prospect of data||[]){
    if(prepared.length>=limit)break;
    if(await queueExists(prospect.id))continue;
    try{
      const protections=await exactProtections(prospect.email,{excludeProspectId:prospect.id});
      if(protections.suppression)throw new Error('suppressed');
      if(protections.tombstone)throw new Error('tombstoned');
      if(protections.duplicate)throw new Error('duplicate_email');
      if(prospect.last_reply_at||prospect.reply_category)throw new Error('prior_reply');
      const domainDup=await duplicateProfessionalDomain(prospect.email,{excludeProspectId:prospect.id});
      if(domainDup)throw new Error('duplicate_business_domain');
      await verifyMx(prospect.email);
      const evidence=await verifyPublishedEvidence({
        ...prospect,
        workflow_url:prospect.verification_metadata?.workflow_url||prospect.source_url
      });
      const personalization=candidatePersonalization(prospect);
      const result=await prepareCommercialProspect({
        prospectId:prospect.id,personalization,subject:'Question sur vos devis',scheduledAt:iso()
      });
      const verificationMetadata={...(prospect.verification_metadata||{}),auto_feeder_status:'pass',auto_feeder_checked_at:iso(),...evidence};
      await db.from('prospects').update({verification_metadata:verificationMetadata,updated_at:iso()}).eq('id',prospect.id);
      prepared.push({prospect_id:prospect.id,company_name:prospect.company_name,email:prospect.email,queue_id:result.queue.id,source:'existing_qualified'});
    }catch(error){
      const verificationMetadata={...(prospect.verification_metadata||{}),auto_feeder_status:'manual_review',auto_feeder_reason:String(error?.message||error).slice(0,160),auto_feeder_checked_at:iso()};
      await db.from('prospects').update({verification_metadata:verificationMetadata,updated_at:iso()}).eq('id',prospect.id);
      blocked.push({prospect_id:prospect.id,email:prospect.email,reason:String(error?.message||error).slice(0,160)});
    }
  }
  return {prepared,blocked};
}

async function rejectCandidate(id,status,reason,evidence=null){
  const patch={status,reject_reason:String(reason||'candidate_blocked').slice(0,240),last_checked_at:iso(),updated_at:iso()};
  if(evidence)patch.verification_notes=evidence;
  await db.from('outreach_candidates').update(patch).eq('id',id);
}

async function processCandidate(candidate){
  const now=Date.now();
  const cfg=commercialFeederConfig();
  const verifiedAt=new Date(candidate.verified_at).getTime();
  if(!Number.isFinite(verifiedAt)||now-verifiedAt>cfg.maxVerificationAgeDays*86400000){
    await rejectCandidate(candidate.id,'manual_review','verification_stale');
    return {prepared:false,reason:'verification_stale'};
  }
  if(!['pass','warn'].includes(candidate.verification_status)||!candidate.public_email_confirmed||!candidate.workflow_verified){
    await rejectCandidate(candidate.id,'manual_review','verification_not_eligible');
    return {prepared:false,reason:'verification_not_eligible'};
  }

  const email=normalizeEmail(candidate.email);
  const protections=await exactProtections(email);
  if(protections.suppression){await rejectCandidate(candidate.id,'rejected','suppressed');return {prepared:false,reason:'suppressed'}}
  if(protections.tombstone){await rejectCandidate(candidate.id,'rejected','tombstoned');return {prepared:false,reason:'tombstoned'}}
  if(protections.duplicate){await rejectCandidate(candidate.id,'manual_review','duplicate_email');return {prepared:false,reason:'duplicate_email'}}

  const domainDup=await duplicateProfessionalDomain(email);
  if(domainDup){await rejectCandidate(candidate.id,'manual_review','duplicate_business_domain');return {prepared:false,reason:'duplicate_business_domain'}}

  try{
    await verifyMx(email);
  }catch(error){
    await rejectCandidate(candidate.id,'rejected',String(error.message||error));
    return {prepared:false,reason:String(error.message||error)};
  }

  let evidence;
  try{evidence=await verifyPublishedEvidence(candidate)}
  catch(error){
    await rejectCandidate(candidate.id,'manual_review',String(error.message||error));
    return {prepared:false,reason:String(error.message||error)};
  }

  const imported=await safeImportCommercialProspects([{
    company_name:candidate.company_name,contact_name:candidate.contact_name,email,role:candidate.role,
    website:candidate.website,sector:candidate.sector,source:candidate.source,source_url:candidate.source_url,
    employee_count:candidate.employee_count,estimated_quotes_per_month:candidate.estimated_quotes_per_month,
    uses_digital_tools:candidate.uses_digital_tools,is_service_business:candidate.is_service_business
  }]);
  const item=imported.results?.[0];
  if(!item?.imported){
    const permanent=['suppressed','deleted_tombstone','score_below_55','invalid_input','invalid_email'];
    const status=permanent.includes(item?.reason)?'rejected':'manual_review';
    await rejectCandidate(candidate.id,status,item?.reason||'safe_import_rejected');
    return {prepared:false,reason:item?.reason||'safe_import_rejected'};
  }

  const prospectId=item.id;
  const personalization=candidate.personalization||candidatePersonalization(candidate);
  try{
    const prepared=await prepareCommercialProspect({
      prospectId,personalization,subject:'Question sur vos devis',scheduledAt:iso()
    });
    await db.from('prospects').update({
      verification_metadata:{
        candidate_id:candidate.id,batch_key:candidate.batch_key||null,verification_status:candidate.verification_status,
        warning_codes:candidate.warning_codes||[],verified_at:candidate.verified_at,...evidence
      },updated_at:iso()
    }).eq('id',prospectId);
    await db.from('outreach_candidates').update({
      status:'imported',imported_prospect_id:prospectId,reject_reason:null,last_checked_at:iso(),updated_at:iso(),
      verification_notes:{...(candidate.verification_notes||{}),runtime_revalidation:evidence}
    }).eq('id',candidate.id);
    return {prepared:true,prospect_id:prospectId,company_name:candidate.company_name,email,queue_id:prepared.queue.id,source:'candidate'};
  }catch(error){
    await db.from('outreach_candidates').update({
      status:'manual_review',imported_prospect_id:prospectId,reject_reason:String(error.message||error).slice(0,240),last_checked_at:iso(),updated_at:iso()
    }).eq('id',candidate.id);
    return {prepared:false,reason:String(error.message||error),prospect_id:prospectId};
  }
}

async function prepareCandidates(limit){
  const {data,error}=await db.from('outreach_candidates').select('*')
    .eq('status','waiting').in('verification_status',['pass','warn'])
    .order('score',{ascending:false}).order('verified_at',{ascending:false}).limit(Math.max(limit*5,50));
  if(error)throw error;
  const ordered=[...(data||[])].sort((a,b)=>{
    const aFree=isFreeMailboxDomain(emailDomain(a.email))?1:0;
    const bFree=isFreeMailboxDomain(emailDomain(b.email))?1:0;
    return aFree-bFree || Number(b.score||0)-Number(a.score||0) || Number(b.estimated_quotes_per_month||0)-Number(a.estimated_quotes_per_month||0);
  });
  const prepared=[],blocked=[];
  for(const candidate of ordered){
    if(prepared.length>=limit)break;
    const {data:claimed,error:claimError}=await db.from('outreach_candidates').update({status:'processing',last_checked_at:iso(),updated_at:iso()})
      .eq('id',candidate.id).eq('status','waiting').select('*').maybeSingle();
    if(claimError)throw claimError;
    if(!claimed)continue;
    try{
      const result=await processCandidate(claimed);
      if(result.prepared)prepared.push(result);else blocked.push({candidate_id:candidate.id,email:candidate.email,reason:result.reason});
    }catch(error){
      await rejectCandidate(candidate.id,'manual_review',String(error.message||error));
      blocked.push({candidate_id:candidate.id,email:candidate.email,reason:String(error.message||error)});
    }
  }
  return {prepared,blocked};
}

export async function runCommercialQueueFeeder(){
  const cfg=commercialFeederConfig();
  if(!cfg.enabled)return {skipped:'feeder_disabled'};
  const before=await activeD0Stock();
  if(before>=cfg.threshold)return {skipped:'stock_above_threshold',stock:before,threshold:cfg.threshold,target:cfg.target};
  let remaining=Math.min(cfg.batchMax,Math.max(0,cfg.target-before));
  const prepared=[],blocked=[];

  if(remaining>0){
    const existing=await prepareExistingQualified(remaining);
    prepared.push(...existing.prepared);blocked.push(...existing.blocked);
    remaining=Math.max(0,remaining-existing.prepared.length);
  }
  if(remaining>0){
    const candidates=await prepareCandidates(remaining);
    prepared.push(...candidates.prepared);blocked.push(...candidates.blocked);
  }
  const after=await activeD0Stock();
  log('info','outreach.commercial-feeder','Commercial feeder completed',{
    stock_before:before,stock_after:after,target:cfg.target,threshold:cfg.threshold,
    prepared:prepared.length,blocked:blocked.length
  });
  return {stock_before:before,stock_after:after,target:cfg.target,threshold:cfg.threshold,prepared,blocked};
}
