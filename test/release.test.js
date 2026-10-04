import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { billingTransition, planForSubscriptionStatus } from '../server/billing.js';

test('billing access is conservative across renewal failure and cancellation',()=>{
  assert.equal(planForSubscriptionStatus('active'),'pro');
  assert.equal(planForSubscriptionStatus('trialing'),'pro');
  assert.equal(planForSubscriptionStatus('past_due'),'free');
  assert.deepEqual(billingTransition('customer.subscription.deleted',{}, {plan:'pro',subscription_status:'active'}),{plan:'free',subscription_status:'canceled'});
  assert.deepEqual(billingTransition('invoice.paid',{}, {plan:'free',subscription_status:'past_due'}),{plan:'pro',subscription_status:'active'});
  assert.deepEqual(billingTransition('invoice.payment_failed',{}, {plan:'pro',subscription_status:'active'}),{plan:'pro',subscription_status:'past_due'});
});

test('email layer never uses a fake development success',()=>{
  const email=readFileSync(new URL('../server/email.js',import.meta.url),'utf8');
  assert.match(email,/EMAIL_PROVIDER_NOT_CONFIGURED/);
  assert.doesNotMatch(email,/DEV EMAIL/);
  assert.match(email,/store:false/);
});

test('release source contains required self-service routes and safety gates',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  for(const route of ["app.patch('/api/quotes/:id'","app.delete('/api/quotes/:id'","/followup-preview'","/send-followup'","app.post('/api/billing/portal'","app.delete('/api/account'","app.post('/api/activity'"])assert.ok(server.includes(route),route);
  assert.match(server,/ACQUISITION_ENABLED!=='true'/);
  const client=readFileSync(new URL('../client/src/main.jsx',import.meta.url),'utf8');
  for(const path of ['/pricing','/docs','/faq','/contact','/reset-password'])assert.ok(client.includes(path),path);
  assert.match(client,/updateUser\(\{password:p1\}\)/);
});

test('database schema prevents duplicate follow-up step and enables RLS',()=>{
  const schema=readFileSync(new URL('../supabase/schema.sql',import.meta.url),'utf8');
  assert.match(schema,/followups_quote_step_unique/);
  assert.match(schema,/send_claimed_at/);
  assert.match(schema,/alter table public\.system_events enable row level security/);
  assert.match(schema,/revoke all on table public\.profiles[\s\S]*from anon, authenticated/);
  assert.match(schema,/grant select on table public\.profiles, public\.quotes, public\.followups, public\.support_tickets to authenticated/);
});


test('Vite and release preflight use the same root environment source',()=>{
  const vite=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
  const preflight=readFileSync(new URL('../scripts/preflight.mjs',import.meta.url),'utf8');
  const env=readFileSync(new URL('../.env.example',import.meta.url),'utf8');
  assert.match(vite,/envDir:\s*resolve\(process\.cwd\(\)\)/);
  for(const key of ['VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY']) {
    assert.ok(preflight.includes(`'${key}'`), `${key} must be a preflight requirement`);
    assert.ok(env.includes(`${key}=`), `${key} must be documented in root env`);
  }
  for(const key of ['VITE_SUPPORT_EMAIL','VITE_CONTACT_EMAIL','VITE_BILLING_ENABLED','VITE_LEGAL_ENTITY_TYPE','VITE_LEGAL_NAME','VITE_LEGAL_FORM','VITE_LEGAL_CAPITAL','VITE_LEGAL_ADDRESS','VITE_LEGAL_EMAIL','VITE_LEGAL_REGISTRATION','VITE_LEGAL_VAT','VITE_LEGAL_PHONE','VITE_PUBLICATION_DIRECTOR']) {
    assert.ok(env.includes(`${key}=`), `${key} must be documented in root env`);
  }
});


test('quote sent_at cannot be in the future',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  assert.match(server,/const today = new Date\(\)\.toISOString\(\)\.slice\(0,10\)/);
  assert.match(server,/v > today/);
  assert.doesNotMatch(server,/Date\.now\(\) \+ 86400000/);
});

test('billing checkout reuses an open session for the same customer',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  assert.match(server,/checkout\.sessions\.list\(\{customer,status:'open',limit:10\}\)/);
  assert.match(server,/if\(reusable\)return res\.json\(\{url:reusable\.url,reused:true\}\)/);
});


test('Stripe customer and checkout creation use stable idempotency keys',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  assert.match(server,/idempotencyKey:`relanzio-customer-\$\{req\.user\.id\}`/);
  assert.match(server,/idempotencyKey:`relanzio-checkout-\$\{req\.user\.id\}`/);
});


test('pilot launch keeps billing and acquisition disabled by explicit gates',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  const client=readFileSync(new URL('../client/src/main.jsx',import.meta.url),'utf8');
  assert.match(server,/BILLING_ENABLED!=='true'/);
  assert.match(server,/ACQUISITION_ENABLED!=='true'/);
  assert.match(server,/LEGAL_PAGES_APPROVED!=='true'/);
  assert.match(client,/VITE_BILLING_ENABLED==='true'/);
});

test('public site uses role-based Relanzio contact addresses and no persistent audience id',()=>{
  const client=readFileSync(new URL('../client/src/main.jsx',import.meta.url),'utf8');
  const lifecycle=readFileSync(new URL('../server/lifecycle.js',import.meta.url),'utf8');
  assert.match(client,/support@relanzio\.com/);
  assert.match(client,/contact@relanzio\.com/);
  assert.match(lifecycle,/support@relanzio\.com/);
  assert.doesNotMatch(client,/relanzio_aid/);
  assert.doesNotMatch(client,/localStorage\.getItem\('relanzio_aid'\)/);
});

test('SEO release files include canonical, legal page and protected auth routes',()=>{
  const html=readFileSync(new URL('../client/index.html',import.meta.url),'utf8');
  const renderer=readFileSync(new URL('../scripts/render-public-files.mjs',import.meta.url),'utf8');
  assert.ok(html.includes('<link rel="canonical" href="https://relanzio.com/" />'));
  assert.ok(html.includes('<meta property="og:url" content="https://relanzio.com/" />'));
  assert.match(renderer,/'\/legal'/);
  for(const path of ['/login','/signup','/reset-password'])assert.ok(renderer.includes(`Disallow: ${path}`));
});


test('privacy notice covers targeted B2B prospecting and retention',()=>{
  const client=readFileSync(new URL('../client/src/main.jsx',import.meta.url),'utf8');
  assert.match(client,/Prospects professionnels/);
  assert.match(client,/trois ans après leur collecte ou le dernier contact émanant du prospect/);
  assert.match(client,/liste repoussoir pendant au moins trois ans/);
});
