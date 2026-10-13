import { db } from './db.js';
import { sendEmail } from './email.js';
import { reportError } from './observability.js';
import { shouldPauseOutreach } from './outreach-health.js';

const iso=()=>new Date().toISOString();

export async function outreachHealth(){
  const since=new Date(Date.now()-24*60*60*1000).toISOString();
  const [{count:sent,error:sentError},{data:bounces,error:bounceError}]=await Promise.all([
    db.from('outreach_events').select('*',{count:'exact',head:true}).eq('type','sent').gte('created_at',since),
    db.from('outreach_events').select('metadata').eq('type','bounced').gte('created_at',since).limit(200)
  ]);
  if(sentError)throw sentError;if(bounceError)throw bounceError;
  const events=(bounces||[]).map(x=>String(x.metadata?.event||'').toLowerCase());
  const spam=events.filter(x=>x==='spam').length;
  const blocked=events.filter(x=>x==='blocked').length;
  const health=shouldPauseOutreach({sent:sent||0,bounced:(bounces||[]).length,spam,blocked});
  return {...health,sent:sent||0,bounced:(bounces||[]).length,spam,blocked};
}

async function skipQueue(row,reason,status='skipped'){
  await db.from('outreach_queue').update({status,error:reason,updated_at:iso()}).eq('id',row.id);
  return {id:row.id,skipped:reason};
}

export async function processOutreachQueue(){
  if(process.env.ACQUISITION_ENABLED!=='true')return {skipped:'acquisition_disabled'};
  if(process.env.LEGAL_PAGES_APPROVED!=='true')return {skipped:'legal_gate'};
  const health=await outreachHealth();
  if(health.pause)return {skipped:'deliverability_guard',health};

  const cap=Math.min(10,Math.max(1,Number(process.env.OUTREACH_DAILY_CAP||10)));
  if(health.sent>=cap)return {skipped:'daily_cap',health};

  const now=iso();
  const {data:due,error:dueError}=await db.from('outreach_queue').select('*')
    .eq('status','queued').lte('scheduled_at',now).order('scheduled_at',{ascending:true}).limit(1).maybeSingle();
  if(dueError)throw dueError;if(!due)return {skipped:'nothing_due',health};

  const {data:claimed,error:claimError}=await db.from('outreach_queue').update({status:'sending',updated_at:now})
    .eq('id',due.id).eq('status','queued').select('*').maybeSingle();
  if(claimError)throw claimError;if(!claimed)return {skipped:'already_claimed'};

  try{
    const {data:p,error:pError}=await db.from('prospects').select('*').eq('id',claimed.prospect_id).single();
    if(pError)throw pError;
    const {data:suppressed,error:sError}=await db.from('suppressions').select('email').eq('email',p.email).maybeSingle();
    if(sError)throw sError;
    if(suppressed||p.status==='suppressed')return await skipQueue(claimed,'suppressed','canceled');
    if(p.score<55)return await skipQueue(claimed,'score_below_55');
    if(claimed.sequence_step===0){
      const {count,error}=await db.from('outreach_events').select('*',{count:'exact',head:true}).eq('prospect_id',p.id).eq('type','sent');
      if(error)throw error;if((count||0)>0)return await skipQueue(claimed,'duplicate_initial','canceled');
      if(!['qualified','new'].includes(p.status))return await skipQueue(claimed,`initial_status_${p.status}`,'canceled');
    }else{
      const {data:stopEvents,error:stopError}=await db.from('outreach_events').select('type').eq('prospect_id',p.id).in('type',['replied','opt_out','meeting']).limit(1);
      if(stopError)throw stopError;
      if((stopEvents||[]).length||p.status!=='contacted')return await skipQueue(claimed,'followup_stopped','canceled');
    }

    const commercial=process.env.CONTACT_EMAIL||'contact@relanzio.com';
    const sent=await sendEmail({
      to:p.email,
      subject:claimed.subject,
      text:claimed.content,
      replyTo:commercial,
      senderEmail:commercial,
      senderName:'Relanzio',
      tags:['relanzio-outreach',`sequence-${claimed.sequence_step}`]
    });
    const sentAt=iso();
    await db.from('outreach_events').insert({
      prospect_id:p.id,type:'sent',subject:claimed.subject,content:claimed.content,
      provider_message_id:sent?.messageId||null,
      metadata:{queue_id:claimed.id,sequence_step:claimed.sequence_step,source_url:p.source_url||null}
    });
    await db.from('outreach_queue').update({status:'sent',sent_at:sentAt,provider_message_id:sent?.messageId||null,error:null,updated_at:sentAt}).eq('id',claimed.id);
    await db.from('prospects').update({status:'contacted',last_contacted_at:sentAt,updated_at:sentAt}).eq('id',p.id);
    return {sent:true,prospect_id:p.id,email:p.email,queue_id:claimed.id,sequence_step:claimed.sequence_step,health};
  }catch(e){
    await db.from('outreach_queue').update({status:'failed',error:String(e.message||e).slice(0,1000),updated_at:iso()}).eq('id',claimed.id);
    await reportError('outreach.queue',e,{queue_id:claimed.id,prospect_id:claimed.prospect_id});
    return {sent:false,error:String(e.message||e),queue_id:claimed.id};
  }
}
