import { createClient } from '@supabase/supabase-js';
import { prepareCommercialProspect } from './controlled-outreach.js';

const url=process.env.SUPABASE_URL;
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key)throw new Error('OUTREACH_QA_SUPABASE_MISSING');
const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const stamp=Date.now();
const qaDomain='example.invalid';
const prefix='qa.outreach.safety.'+stamp;
const baseFuture=new Date(Date.UTC(2100,0,1+(stamp%20000)));
const day=n=>new Date(baseFuture.getTime()+n*86400000).toISOString().slice(0,10);
const concurrencyDate=day(0);
const failureDate=day(1);
const parisBoundaryDate=day(2);
const assert=(v,m)=>{if(!v)throw new Error(m)};

async function cleanup(){
  await db.from('outreach_daily_slots').delete().in('business_date',[concurrencyDate,failureDate,parisBoundaryDate,day(3)]);
  const {data:prospects}=await db.from('prospects').select('id,email').like('email','qa.outreach.safety.%@'+qaDomain);
  const ids=(prospects||[]).map(x=>x.id);
  if(ids.length){
    await db.from('outreach_queue').delete().in('prospect_id',ids);
    await db.from('outreach_events').delete().in('prospect_id',ids);
    await db.from('prospects').delete().in('id',ids);
  }
  await db.from('suppressions').delete().like('email','qa.outreach.safety.%@'+qaDomain);
  await db.from('prospect_tombstones').delete().like('email','qa.outreach.safety.%@'+qaDomain);
}

try{
  await cleanup();

  // True concurrent RPC calls against the production database, using an isolated future business date.
  const claims=await Promise.all(Array.from({length:50},(_,i)=>
    db.rpc('claim_outreach_daily_slot',{
      p_reservation_key:`qa-concurrency-${stamp}-${i}`,
      p_queue_id:null,p_cap:20,p_now:concurrencyDate+'T12:00:00+01:00'
    })
  ));
  const errors=claims.filter(x=>x.error);
  assert(errors.length===0,'concurrency_rpc_errors');
  const allowed=claims.filter(x=>x.data?.allowed===true);
  const denied=claims.filter(x=>x.data?.allowed===false);
  assert(allowed.length===20,'concurrency_allowed_'+allowed.length);
  assert(denied.length===30,'concurrency_denied_'+denied.length);
  const slots=new Set(allowed.map(x=>x.data.slot));
  assert(slots.size===20,'concurrency_duplicate_slots');

  const twentyOne=await db.rpc('claim_outreach_daily_slot',{
    p_reservation_key:`qa-concurrency-${stamp}-21-check`,
    p_queue_id:null,p_cap:20,p_now:concurrencyDate+'T12:00:00+01:00'
  });
  assert(!twentyOne.error&&twentyOne.data?.allowed===false&&twentyOne.data?.reason==='daily_cap','twenty_first_not_blocked');

  // Paris calendar boundary, not rolling 24 hours.
  const before=await db.rpc('claim_outreach_daily_slot',{p_reservation_key:`qa-paris-before-${stamp}`,p_queue_id:null,p_cap:20,p_now:parisBoundaryDate+'T22:59:00+00:00'});
  const after=await db.rpc('claim_outreach_daily_slot',{p_reservation_key:`qa-paris-after-${stamp}`,p_queue_id:null,p_cap:20,p_now:parisBoundaryDate+'T23:01:00+00:00'});
  assert(!before.error&&!after.error&&before.data.business_date!==after.data.business_date,'paris_day_boundary_failed');

  // Definite provider failure releases the reservation; ambiguous failure stays conservative.
  const failClaim=await db.rpc('claim_outreach_daily_slot',{p_reservation_key:`qa-provider-fail-${stamp}`,p_queue_id:null,p_cap:20,p_now:failureDate+'T12:00:00+01:00'});
  assert(failClaim.data?.allowed===true,'failure_claim_failed');
  const released=await db.rpc('finalize_outreach_daily_slot',{p_reservation_key:`qa-provider-fail-${stamp}`,p_outcome:'definite_failure'});
  assert(released.data?.status==='released','definite_failure_not_released');
  const unknownClaim=await db.rpc('claim_outreach_daily_slot',{p_reservation_key:`qa-provider-unknown-${stamp}`,p_queue_id:null,p_cap:20,p_now:failureDate+'T12:00:00+01:00'});
  await db.rpc('finalize_outreach_daily_slot',{p_reservation_key:`qa-provider-unknown-${stamp}`,p_outcome:'unknown'});
  const {count:unknownCount}=await db.from('outreach_daily_slots').select('*',{count:'exact',head:true}).eq('business_date',failureDate);
  assert(unknownClaim.data?.allowed===true&&unknownCount===1,'unknown_failure_should_count');

  // Idempotent import + tombstone + suppression.
  const base={
    company_name:'QA Outreach Safety',email:`${prefix}.import@${qaDomain}`,score:95,
    lawful_basis:'professional_relevance',status:'qualified',source:'QA public source',
    source_url:'https://example.invalid/qa',sector:'QA',score_reasons:[]
  };
  const first=await db.rpc('safe_import_qualified_prospect',{p:base});
  const second=await db.rpc('safe_import_qualified_prospect',{p:base});
  assert(first.data?.imported===true&&second.data?.reason==='duplicate','import_idempotency_failed');
  const importedId=first.data.id;
  const del=await db.rpc('delete_prospect_with_tombstone',{p_id:importedId,p_reason:'qa_deleted'});
  const third=await db.rpc('safe_import_qualified_prospect',{p:base});
  assert(del.data?.deleted===true&&third.data?.reason==='deleted_tombstone','deleted_reimport_failed');

  const suppressedEmail=`${prefix}.suppressed@${qaDomain}`;
  await db.from('suppressions').upsert({email:suppressedEmail,reason:'qa'});
  const suppressed=await db.rpc('safe_import_qualified_prospect',{p:{...base,email:suppressedEmail}});
  assert(suppressed.data?.reason==='suppressed','suppression_import_failed');

  // Reply/refusal/STOP linkage: exact sender + In-Reply-To must resolve to the same prospect.
  async function seedReply(kind){
    const email=`${prefix}.${kind}@${qaDomain}`;
    const imp=await db.rpc('safe_import_qualified_prospect',{p:{...base,email,company_name:'QA '+kind}});
    assert(imp.data?.imported===true,'reply_seed_import_'+kind);
    const id=imp.data.id;
    const messageId=`<qa-${kind}-${stamp}@relanzio.com>`;
    await db.from('outreach_events').insert({prospect_id:id,type:'sent',provider_message_id:messageId,subject:'QA',content:'QA'});
    await db.from('outreach_queue').insert({prospect_id:id,sequence_step:1,scheduled_at:new Date(Date.now()+86400000).toISOString(),status:'held',subject:'QA followup',content:'QA followup'});
    return {id,email,messageId};
  }
  const positive=await seedReply('positive');
  const rp=await db.rpc('apply_outreach_reply',{
    p_from_email:positive.email,p_category:'interested',p_sentiment:'positive',p_content:'Oui, envoyez-moi le lien.',
    p_received_at:new Date().toISOString(),p_dedupe_key:`qa-reply-positive-${stamp}`,p_in_reply_to:positive.messageId,p_metadata:{qa:true}
  });
  assert(rp.data?.matched===true&&rp.data?.prospect_id===positive.id&&!rp.data?.suppressed,'positive_reply_link_failed');
  const {data:positiveRow}=await db.from('prospects').select('status,last_reply_at,reply_category').eq('id',positive.id).single();
  const {data:positiveQueue}=await db.from('outreach_queue').select('status').eq('prospect_id',positive.id).eq('sequence_step',1).single();
  assert(positiveRow.status==='replied'&&positiveRow.reply_category==='interested'&&positiveQueue.status==='canceled','positive_reply_state_failed');

  const refusal=await seedReply('refusal');
  const rr=await db.rpc('apply_outreach_reply',{
    p_from_email:refusal.email,p_category:'not_interested',p_sentiment:'negative',p_content:'Non merci.',
    p_received_at:new Date().toISOString(),p_dedupe_key:`qa-reply-refusal-${stamp}`,p_in_reply_to:refusal.messageId,p_metadata:{qa:true}
  });
  const {data:refusalSupp}=await db.from('suppressions').select('reason').eq('email',refusal.email).maybeSingle();
  assert(rr.data?.matched===true&&rr.data?.suppressed===true&&refusalSupp?.reason==='refusal','refusal_suppression_failed');

  const stop=await seedReply('stop');
  const rs=await db.rpc('apply_outreach_reply',{
    p_from_email:stop.email,p_category:'opt_out',p_sentiment:'negative',p_content:'STOP',
    p_received_at:new Date().toISOString(),p_dedupe_key:`qa-reply-stop-${stamp}`,p_in_reply_to:stop.messageId,p_metadata:{qa:true}
  });
  const {data:stopSupp}=await db.from('suppressions').select('reason').eq('email',stop.email).maybeSingle();
  assert(rs.data?.matched===true&&rs.data?.suppressed===true&&stopSupp?.reason==='opt_out','stop_suppression_failed');
  const duplicate=await db.rpc('apply_outreach_reply',{
    p_from_email:stop.email,p_category:'opt_out',p_sentiment:'negative',p_content:'STOP',
    p_received_at:new Date().toISOString(),p_dedupe_key:`qa-reply-stop-${stamp}`,p_in_reply_to:stop.messageId,p_metadata:{qa:true}
  });
  assert(duplicate.data?.idempotent===true,'reply_dedupe_failed');

  // A contacted prospect is never prepared for another J0.
  const contactedEmail=`${prefix}.contacted@${qaDomain}`;
  const ci=await db.rpc('safe_import_qualified_prospect',{p:{...base,email:contactedEmail,company_name:'QA contacted'}});
  const contactedUpdate=await db.from('prospects').update({status:'contacted',last_contacted_at:new Date().toISOString()}).eq('id',ci.data.id).select('id,last_contacted_at').single();
  assert(!contactedUpdate.error&&Boolean(contactedUpdate.data?.last_contacted_at),'contacted_seed_update_failed');
  let contactedBlocked=false;
  try{await prepareCommercialProspect({prospectId:ci.data.id,personalization:'Votre site propose des demandes de devis.',subject:'Question sur vos devis'});}
  catch(e){contactedBlocked=e.code==='COMMERCIAL_NOT_QUALIFIED'||e.code==='COMMERCIAL_ALREADY_CONTACTED';}
  assert(contactedBlocked,'contacted_j0_not_blocked');

  console.log('OUTREACH_SAFETY_QA_PASS '+JSON.stringify({
    import_idempotent:true,deleted_never_reimported:true,suppression_priority:true,
    cap:{value:20,concurrent_allowed:allowed.length,concurrent_denied:denied.length,twenty_first_blocked:true,paris_calendar_day:true},
    replies:{positive:true,refusal:true,stop:true,dedupe:true,followup_canceled:true},
    provider_failure:{definite_released:true,unknown_counts:true},commercial_emails_sent:0
  }));
}finally{
  await cleanup();
}
