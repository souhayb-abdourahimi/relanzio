import{readFileSync,existsSync}from'node:fs';
function envFile(path='.env'){if(!existsSync(path))return{};return Object.fromEntries(readFileSync(path,'utf8').split(/\r?\n/).filter(x=>x&&!x.startsWith('#')&&x.includes('=')).map(x=>{const i=x.indexOf('=');return[x.slice(0,i).trim(),x.slice(i+1).trim()]}))}
const e={...envFile(),...process.env};
const required=['APP_URL','VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY','SUPABASE_URL','SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY','STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','STRIPE_PRO_PRICE_ID','BREVO_API_KEY','BREVO_WEBHOOK_SECRET','EMAIL_FROM_ADDRESS','CRON_SECRET','ADMIN_EMAILS'];
const missing=required.filter(k=>!e[k]);const bad=[];
if(e.APP_URL&&/localhost|YOUR_DOMAIN/i.test(e.APP_URL))bad.push('APP_URL');
if(e.CRON_SECRET&&e.CRON_SECRET.length<24)bad.push('CRON_SECRET (>=24 caractères)');
if(e.BREVO_WEBHOOK_SECRET&&e.BREVO_WEBHOOK_SECRET.length<24)bad.push('BREVO_WEBHOOK_SECRET (>=24 caractères)');
for(const k of ['FOLLOWUP_AUTOMATION_ENABLED','LIFECYCLE_EMAILS_ENABLED','ACQUISITION_ENABLED'])if(e[k]&&!['true','false'].includes(e[k]))bad.push(`${k} (true|false)`);
const production=e.RELEASE_STAGE==='production';const gates=[];
if(production){for(const k of ['VITE_SUPPORT_EMAIL','VITE_LEGAL_NAME','VITE_LEGAL_ADDRESS','VITE_LEGAL_EMAIL','VITE_LEGAL_REGISTRATION','VITE_HOST_NAME','VITE_DATA_RETENTION'])if(!e[k])gates.push(k);for(const k of ['LEGAL_PAGES_APPROVED','EXTERNAL_QA_APPROVED','MOBILE_QA_APPROVED'])if(e[k]!=='true')gates.push(k);if(e.ACQUISITION_ENABLED==='true')gates.push('ACQUISITION_ENABLED doit rester false pendant cette phase');}
console.log('Relanzio preflight');console.log('Required:',required.length-missing.length,'/',required.length);console.log('Stage:',e.RELEASE_STAGE||'staging');
if(missing.length)console.log('Missing:',missing.join(', '));if(bad.length)console.log('Unsafe/placeholders:',bad.join(', '));if(gates.length)console.log('Release gates not approved:',gates.join(', '));
if(missing.length||bad.length||gates.length)process.exitCode=1;else console.log('Configuration: OK. Exécuter ensuite les tests fournisseurs et smoke tests.');
