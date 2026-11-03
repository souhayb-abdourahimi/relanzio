const base=(process.env.SMOKE_BASE_URL||'').replace(/\/$/,'');if(!base)throw new Error('SMOKE_BASE_URL required');
async function check(path,expected=200){const t=Date.now();const r=await fetch(base+path,{redirect:'manual'});if(r.status!==expected)throw new Error(`${path}: expected ${expected}, got ${r.status}`);return {path,status:r.status,ms:Date.now()-t}}
const results=[];results.push(await check('/api/health'));const ready=await fetch(base+'/api/readiness');const body=await ready.json();if(ready.status!==200||!body.ready)throw new Error(`/api/readiness not ready: ${JSON.stringify(body)}`);results.push({path:'/api/readiness',status:ready.status,ready:body.ready});console.log(JSON.stringify({ok:true,results},null,2));
// Public pages (prerendered HTML, no JS needed): commercial invariants and the reply promise switch.
async function page(path){const r=await fetch(base+path);if(r.status!==200)throw new Error(`${path}: expected 200, got ${r.status}`);return r.text();}
const must=(html,path,text)=>{if(!html.includes(text))throw new Error(`${path}: missing "${text}"`)};
const mustNot=(html,path,text)=>{if(html.includes(text))throw new Error(`${path}: unexpected "${text}"`)};
const PROMISE='Tout s’arrête dès que le client répond';
const promiseLive=process.env.SMOKE_EXPECT_REPLY_LIVE==='true';
const landing=await page('/');must(landing,'/','Vos devis relancés');(promiseLive?must:mustNot)(landing,'/',PROMISE);
const pricing=await page('/pricing');
for(const text of ['29 € / mois','TVA non applicable, art. 293 B du CGI','Jusqu’à 5 devis actifs','Jusqu’à 100 devis actifs','essai 7 jours'])must(pricing,'/pricing',text);
(promiseLive?()=>{}:mustNot)(pricing,'/pricing',PROMISE);
for(const [path,html] of [['/',landing],['/pricing',pricing]]){mustNot(html,path,'Bonjour M.,');mustNot(html,path,'J+7');}
await page('/faq');await page('/login');
console.log(JSON.stringify({ok:true,public_pages:['/','/pricing','/faq','/login'],reply_promise:promiseLive?'shown':'hidden'}));
