import { createClient } from '@supabase/supabase-js';
const APP='https://relanzio-production.up.railway.app';
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const report={checks:{},details:{},errors:[]};
async function get(path){const t=Date.now();try{const r=await fetch(APP+path);let b;try{b=await r.json()}catch{b=null}return{status:r.status,body:b,ms:Date.now()-t}}catch(e){return{status:0,error:e.message,ms:Date.now()-t}}}
const h=await get('/api/health');report.checks.health=h.status===200&&h.body?.ok===true;report.details.health=h;
const rd=await get('/api/readiness');report.checks.readiness=rd.status===200&&rd.body?.ready===true;report.details.readiness=rd;
let next=0,fail=0;const times=[],statuses={};async function worker(){while(next<100){next++;const r=await get('/api/health');times.push(r.ms);statuses[r.status]=(statuses[r.status]||0)+1;if(r.status!==200)fail++}}
await Promise.all(Array.from({length:10},worker));times.sort((a,b)=>a-b);const p95=times[Math.floor(times.length*.95)]||0;
report.details.load={total:100,concurrency:10,fail,statuses,p95_ms:p95,min_ms:times[0],max_ms:times.at(-1)};
report.checks.load_100x10=fail===0;
report.ok=Object.values(report.checks).every(Boolean);
report.finished_at=new Date().toISOString();
await db.from('system_events').insert({level:report.ok?'info':'error',scope:'qa.cert.smoke-load.v1',message:report.ok?'Smoke/load passed':'Smoke/load failed',metadata:report});
console.log('SMOKE_LOAD_REPORT='+JSON.stringify(report));
setInterval(()=>{},3600000);