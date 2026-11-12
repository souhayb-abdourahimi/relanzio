// Probe of the emergency-mode container, from inside the isolated Docker network.
const app = process.env.APP || 'http://rz-app:3000', fake = process.env.FAKE || 'http://rz-fake:8080';
const fail = m => { console.error(`RESCUE_PROBE_FAILED ${m}`); process.exit(1); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
let up = false;
for (let i = 0; i < 120 && !up; i++) { try { up = (await fetch(`${app}/api/health`)).status === 200; } catch { /* starting */ } if (!up) await sleep(500); }
if (!up) fail('health never answered 200');
const landing = await fetch(`${app}/`); if (landing.status !== 200) fail(`landing ${landing.status}`);
const pricing = await fetch(`${app}/pricing`); if (pricing.status !== 200) fail(`pricing ${pricing.status}`);
const cron = await fetch(`${app}/api/cron/run`, { method: 'POST', headers: { 'x-cron-secret': 'cron-fictional' } }); if (cron.status !== 503) fail(`cron trigger ${cron.status}, expected 503`);
const readiness = await fetch(`${app}/api/readiness`); const rbody = await readiness.text();
if (readiness.status === 200) fail('readiness 200 although Stripe is unreachable in this network');
await sleep(5000);
const requests = await (await fetch(`${fake}/__requests`)).json();
if (requests.length) fail(`the emergency container contacted the database: ${JSON.stringify(requests)}`);
console.log(`RESCUE_PROBE_OK ${JSON.stringify({ health: 200, landing: 200, pricing: 200, cron_trigger: 503, readiness: readiness.status, readiness_body: rbody.slice(0, 200), database_requests: 0 })}`);
