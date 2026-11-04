import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// db.js needs placeholders; every query below goes to the in-memory fake.
process.env.SUPABASE_URL||='http://127.0.0.1:9';process.env.SUPABASE_SERVICE_ROLE_KEY||='test-placeholder';process.env.SUPABASE_ANON_KEY||='test-placeholder';
const { robustResolve } = await import('../server/dns-resolve.js');
const { db } = await import('../server/db.js');
const { reverificationClass, reverifyManualReviewCandidates, commercialBacklogReport, __setFeederNetworkForTests } = await import('../server/commercial-feeder.js');
const { processOutreachQueue } = await import('../server/outreach.js');
const { createFakeDb } = await import('./helpers/fake-db.js');

const err=code=>Object.assign(new Error(code),{code});
const attempt=(via,result)=>({via,run:async()=>{if(result instanceof Error)throw result;return result;}});

test('DNS: a resolver failure is never read as "no MX"; public resolvers take over',async()=>{
  const MX=[{exchange:'mx.example.fr',priority:10}];
  assert.deepEqual(await robustResolve('resolveMx','a.fr',{attempts:[attempt('system',MX),attempt('public',err('ENOTFOUND'))]}),{status:'ok',records:MX,via:'system'});
  assert.equal((await robustResolve('resolveMx','a.fr',{attempts:[attempt('system',err('ECONNREFUSED')),attempt('public',MX)]})).via,'public','container resolver down, public answers');
  assert.equal((await robustResolve('resolveMx','a.fr',{attempts:[attempt('system',err('ESERVFAIL')),attempt('public',MX)]})).status,'ok');
  assert.equal((await robustResolve('resolveMx','a.fr',{attempts:[attempt('system',err('ENODATA')),attempt('public',MX)]})).status,'ok','a wrong "no data" from one resolver is overridden by records');
  assert.equal((await robustResolve('resolveMx','a.fr',{attempts:[attempt('system',err('ENOTFOUND')),attempt('public',err('ENOTFOUND'))]})).status,'none');
  assert.equal((await robustResolve('resolveMx','a.fr',{attempts:[attempt('system',[]),attempt('public',[])]})).status,'none','empty answer = no MX');
  const down=await robustResolve('resolveMx','a.fr',{attempts:[attempt('system',err('ETIMEOUT')),attempt('public',err('ECONNREFUSED'))]});
  assert.deepEqual(down,{status:'unavailable',errors:['system:ETIMEOUT','public:ECONNREFUSED']});
});

test('which manual_review reasons are re-checked automatically, and which stay with a human',()=>{
  for(const r of [null,'','verification_evidence_incomplete','verification_not_eligible','verification_stale'])assert.equal(reverificationClass(r)?.kind,'evidence',String(r));
  for(const r of ['mx_dns_unavailable','source_http_503','source_http_429','fetch failed','queryMx ETIMEOUT alpha.fr','getaddrinfo EAI_AGAIN x.fr','This operation was aborted'])assert.equal(reverificationClass(r)?.kind,'transient',r);
  for(const r of ['public_email_not_found','quote_workflow_not_confirmed','source_http_404','source_url_not_public'])assert.equal(reverificationClass(r)?.kind,'content',r);
  for(const r of ['duplicate_email','duplicate_business_domain','prior_reply','free_mailbox_needs_human_review','company_already_known','duplicate_candidate_domain','suppressed','anything_else'])assert.equal(reverificationClass(r),null,r);
});

// A small public web: pages by URL, MX by domain.
function installNetwork({pages={},mx={}}){
  __setFeederNetworkForTests({
    lookup:async()=>[{address:'93.184.216.34',family:4}],
    fetch:async url=>{const body=pages[String(url)];return body==null?new Response('not found',{status:404}):new Response(body,{status:200,headers:{'content-type':'text/html'}});},
    resolveMx:async domain=>mx[domain]||{status:'unavailable',errors:['test:ETIMEOUT']}
  });
}
const OK_MX={status:'ok',records:[{exchange:'mx1.mail.test',priority:10}]};
const candidate=(id,over={})=>({id,company_name:`Société ${id}`,email:`contact@${id}.test`,website:`https://${id}.test`,source_url:`https://${id}.test/contact`,workflow_url:null,
  sector:'couverture',employee_count:4,estimated_quotes_per_month:12,is_service_business:true,uses_digital_tools:false,
  verification_status:'pass',public_email_confirmed:false,workflow_verified:false,verified_at:'2026-09-01T00:00:00Z',warning_codes:[],verification_notes:{},
  status:'manual_review',reject_reason:'verification_evidence_incomplete',last_checked_at:null,...over});
const page=(email,extra='Demandez votre devis gratuit en ligne.')=>`<html><body><p>Contact : ${email.replace('@','&#64;')}</p><p>${extra}</p></body></html>`;

test('re-verification: only a candidate passing every existing check goes back to waiting; definitive causes reject; doubt stays',async()=>{
  const now=Date.parse('2026-11-05T10:00:00Z');
  const fake=createFakeDb({
    outreach_candidates:[
      candidate('alpha'),                                                     // all good → waiting
      candidate('suppr'),                                                     // suppressed → rejected
      candidate('gmailco',{email:'artisan.durand@gmail.com'}),                 // free mailbox → human
      candidate('nomx'),                                                      // no MX → rejected
      candidate('dnsdown'),                                                   // DNS unavailable → stays
      candidate('nomail'),                                                    // email not on the page → stays
      candidate('noquote'),                                                   // no quote workflow → stays
      candidate('known'),                                                     // company already a prospect → human
      candidate('lowscore',{employee_count:80,estimated_quotes_per_month:0,is_service_business:false,website:null}), // score < 55 → rejected
      candidate('dupe',{reject_reason:'duplicate_email'}),                    // human case: not touched
      candidate('recent',{reject_reason:'mx_dns_unavailable',last_checked_at:new Date(now-3600e3).toISOString()}), // cooldown
      candidate('waitingalready',{status:'waiting',reject_reason:null})       // not manual_review: not touched
    ],
    suppressions:[{email:'contact@suppr.test',reason:'opt_out'}],prospect_tombstones:[],
    prospects:[{id:'p1',company_name:'Société known',email:'devis@other-domain.test',website:'https://other.test'}]
  });
  db.from=fake.from;
  installNetwork({
    pages:{
      'https://alpha.test/contact':page('contact@alpha.test'),
      'https://suppr.test/contact':page('contact@suppr.test'),
      'https://nomx.test/contact':page('contact@nomx.test'),
      'https://dnsdown.test/contact':page('contact@dnsdown.test'),
      'https://nomail.test/contact':page('autre@nomail.test'),'https://nomail.test/':page('autre@nomail.test'),
      'https://noquote.test/contact':page('contact@noquote.test','Nos horaires d’ouverture.'),
      'https://known.test/contact':page('contact@known.test'),
      'https://lowscore.test/contact':page('contact@lowscore.test')
    },
    mx:{'alpha.test':OK_MX,'suppr.test':OK_MX,'nomail.test':OK_MX,'noquote.test':OK_MX,'known.test':OK_MX,'lowscore.test':OK_MX,'nomx.test':{status:'none',code:'ENOTFOUND'}}
  });
  const summary=await reverifyManualReviewCandidates(25,now);
  const row=id=>fake.tables.outreach_candidates.find(c=>c.id===id);
  const a=row('alpha');
  assert.equal(a.status,'waiting');assert.equal(a.reject_reason,null);
  assert.equal(a.public_email_confirmed,true);assert.equal(a.workflow_verified,true);assert.equal(a.verification_status,'pass');
  assert.ok(Date.parse(a.verified_at)>Date.parse('2026-10-01'),'fresh verification date');
  assert.equal(a.verification_notes.auto_reverification.email_source_url,'https://alpha.test/contact');
  assert.deepEqual(a.verification_notes.auto_reverification.mx_hosts,['mx1.mail.test']);
  assert.equal(a.verification_notes.auto_reverification.previous_reason,'verification_evidence_incomplete');
  assert.deepEqual([row('suppr').status,row('suppr').reject_reason],['rejected','suppressed']);
  assert.deepEqual([row('nomx').status,row('nomx').reject_reason],['rejected','mx_missing']);
  assert.deepEqual([row('lowscore').status,row('lowscore').reject_reason],['rejected','score_below_55']);
  assert.deepEqual([row('gmailco').status,row('gmailco').reject_reason],['manual_review','free_mailbox_needs_human_review']);
  assert.deepEqual([row('dnsdown').status,row('dnsdown').reject_reason],['manual_review','mx_dns_unavailable'],'a DNS outage never rejects');
  assert.deepEqual([row('nomail').status,row('nomail').reject_reason],['manual_review','public_email_not_found']);
  assert.deepEqual([row('noquote').status,row('noquote').reject_reason],['manual_review','quote_workflow_not_confirmed']);
  assert.deepEqual([row('known').status,row('known').reject_reason],['manual_review','company_already_known']);
  assert.equal(row('dupe').last_checked_at,null,'human-review reason not re-checked');
  assert.equal(row('recent').reject_reason,'mx_dns_unavailable');assert.equal(row('recent').status,'manual_review');
  assert.equal(row('waitingalready').status,'waiting');
  assert.deepEqual({checked:summary.checked,promoted:summary.promoted,rejected:summary.rejected,kept:summary.kept},{checked:9,promoted:1,rejected:3,kept:5});
  // Nothing doubtful ever became sendable.
  assert.deepEqual(fake.tables.outreach_candidates.filter(c=>c.status==='waiting').map(c=>c.id).sort(),['alpha','waitingalready']);
});

test('re-verification is bounded per run and a second company on the same domain waits for a human',async()=>{
  const fake=createFakeDb({
    outreach_candidates:[candidate('one'),candidate('two',{email:'devis@one.test',website:'https://one-bis.test',source_url:'https://one-bis.test/c'}),candidate('three'),candidate('four')],
    suppressions:[],prospect_tombstones:[],prospects:[]
  });
  db.from=fake.from;
  installNetwork({pages:{'https://one.test/contact':page('contact@one.test'),'https://one-bis.test/c':page('devis@one.test'),'https://three.test/contact':page('contact@three.test'),'https://four.test/contact':page('contact@four.test')},
    mx:{'one.test':OK_MX,'three.test':OK_MX,'four.test':OK_MX}});
  const first=await reverifyManualReviewCandidates(2,Date.parse('2026-11-05T10:00:00Z'));
  assert.equal(first.checked,2);
  await reverifyManualReviewCandidates(10,Date.parse('2026-11-05T10:10:00Z'));
  const st=Object.fromEntries(fake.tables.outreach_candidates.map(c=>[c.id,[c.status,c.reject_reason]]));
  assert.deepEqual(st.one,['waiting',null]);
  assert.deepEqual(st.two,['manual_review','duplicate_candidate_domain']);
  assert.deepEqual(st.three,['waiting',null]);assert.deepEqual(st.four,['waiting',null]);
  assert.equal(await reverifyManualReviewCandidates(0).then(s=>s.checked),0,'batch 0 = off');
});

test('backlog report gives counts only, no address or company',async()=>{
  const fake=createFakeDb({
    outreach_candidates:[candidate('x1'),candidate('x2',{status:'rejected',reject_reason:'suppressed'}),candidate('x3',{status:'waiting',reject_reason:null}),candidate('x4',{reject_reason:'mx_dns_unavailable'})],
    outreach_queue:[{sequence_step:0,status:'sent'},{sequence_step:0,status:'ready'},{sequence_step:1,status:'held'},{sequence_step:2,status:'canceled'}]
  });
  db.from=fake.from;
  const r=await commercialBacklogReport();
  assert.deepEqual(r,{
    candidates:{total:4,by_status:{manual_review:2,rejected:1,waiting:1},manual_review_reasons:{verification_evidence_incomplete:1,mx_dns_unavailable:1},rejected_reasons:{suppressed:1}},
    queue:{step_0:{sent:1,ready:1},step_1:{held:1},step_2:{canceled:1}}
  });
  assert.doesNotMatch(JSON.stringify(r),/@|Société/);
});

test('no J+7: the legacy queue cancels a pending third step and never sends it',async()=>{
  const sent=[];const realFetch=globalThis.fetch;
  globalThis.fetch=async(url,init)=>{sent.push({url,body:JSON.parse(init.body)});return new Response(JSON.stringify({messageId:'<x@brevo>'}),{status:201});};
  const env={...process.env};
  Object.assign(process.env,{ACQUISITION_ENABLED:'true',LEGAL_PAGES_APPROVED:'true',BREVO_API_KEY:'test',EMAIL_FROM_ADDRESS:'contact@relanzio.com'});
  try{
    const past='2026-11-01T08:00:00.000Z';
    const fake=createFakeDb({
      prospects:[{id:'p7',email:'contact@j7.test',status:'contacted',score:80}],
      outreach_queue:[{id:'q7',prospect_id:'p7',sequence_step:2,status:'queued',scheduled_at:past,subject:'Relance J+7',content:'...'},
                      {id:'q7b',prospect_id:'p7',sequence_step:3,status:'held',scheduled_at:past,subject:'x',content:'x'}],
      outreach_events:[],suppressions:[]
    });
    db.from=fake.from;
    const r=await processOutreachQueue();
    assert.equal(sent.length,0,'nothing sent');
    assert.deepEqual(fake.tables.outreach_queue.map(q=>[q.id,q.status,q.error]),[['q7','canceled','sequence_simplified_no_j7'],['q7b','canceled','sequence_simplified_no_j7']]);
    assert.equal(r.skipped,'nothing_due');
  }finally{globalThis.fetch=realFetch;for(const k of ['ACQUISITION_ENABLED','LEGAL_PAGES_APPROVED','BREVO_API_KEY','EMAIL_FROM_ADDRESS'])if(env[k]===undefined)delete process.env[k];else process.env[k]=env[k];}
});

test('no J+7 anywhere: the commercial tick cancels every pending third step; only steps 0 and 1 are ever selected',()=>{
  const co=readFileSync(new URL('../server/controlled-outreach.js',import.meta.url),'utf8');
  const legacy=readFileSync(new URL('../server/outreach.js',import.meta.url),'utf8');
  assert.match(co,/if\(!isCommercialBusinessWindow\(\)\)return \{skipped:'outside_french_business_hours'\};\n  await cancelAllLegacyJ7\(\);/);
  assert.match(co,/\.in\('sequence_step',\[0,1\]\)\.in\('status',\['held','ready'\]\)/);
  assert.match(legacy,/\.eq\('status','queued'\)\.lt\('sequence_step',2\)/);
  assert.doesNotMatch(co+legacy,/7\s*\*\s*86400000|sequence_step:2/);
});

test('DNS and provider-side guards: no MX cancels, DNS outage pauses; a send that never reached Brevo releases its slot',()=>{
  const co=readFileSync(new URL('../server/controlled-outreach.js',import.meta.url),'utf8');
  assert.match(co,/if\(mx\.status==='none'\)throw commercialError\('COMMERCIAL_MX_INVALID'/);
  assert.match(co,/throw commercialError\('COMMERCIAL_MX_DNS_UNAVAILABLE'/);
  const permanent=co.slice(co.indexOf('function permanentSequenceError'),co.indexOf('async function pauseCommercialSequence'));
  assert.match(permanent,/'COMMERCIAL_MX_INVALID'/);assert.doesNotMatch(permanent,/COMMERCIAL_MX_DNS_UNAVAILABLE/,'a DNS outage never cancels a prospect');
  assert.equal((co.match(/providerCalled=true;\n    const sent=await sendEmail\(\{/g)||[]).length,2,'flag set right before each provider call');
  assert.equal((co.match(/p_outcome:noEmailLeft\?'definite_failure':'unknown'/g)||[]).length,2);
  // Brevo sender gate still requires SPF, DKIM, DMARC, the delivery webhook and credits before any commercial email.
  const pilot=readFileSync(new URL('../server/pilot-outreach.js',import.meta.url),'utf8');
  assert.match(pilot,/if \(!domainAuth\.verified \|\| !domainAuth\.authenticated \|\| !spfOk \|\| !dkimOk \|\| !dmarcOk\)/);
  assert.match(pilot,/if \(!transactionalWebhook\)/);assert.match(pilot,/if \(!providerAvailableCredits\)/);
});
