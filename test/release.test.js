import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { billingTransition, planForSubscriptionStatus, shouldIgnoreBillingEvent } from '../server/billing.js';

test('billing access is conservative across renewal failure and cancellation',()=>{
  assert.equal(planForSubscriptionStatus('active'),'pro');
  assert.equal(planForSubscriptionStatus('trialing'),'pro');
  assert.equal(planForSubscriptionStatus('past_due'),'free');
  assert.deepEqual(billingTransition('customer.subscription.deleted',{}, {plan:'pro',subscription_status:'active'}),{plan:'free',subscription_status:'canceled'});
  assert.deepEqual(billingTransition('invoice.paid',{}, {plan:'free',subscription_status:'past_due'}),{plan:'pro',subscription_status:'active'});
  assert.deepEqual(billingTransition('invoice.payment_failed',{}, {plan:'pro',subscription_status:'active'}),{plan:'pro',subscription_status:'past_due'});
});


test('Stripe billing event ordering ignores stale or foreign subscription events',()=>{
  const profile={stripe_subscription_id:'sub_new',stripe_state_event_created:200,plan:'pro',subscription_status:'active'};
  assert.equal(shouldIgnoreBillingEvent(profile,'customer.subscription.deleted',{id:'sub_old'},250),true);
  assert.equal(shouldIgnoreBillingEvent(profile,'customer.subscription.updated',{id:'sub_new'},199),true);
  assert.equal(shouldIgnoreBillingEvent(profile,'customer.subscription.updated',{id:'sub_new'},201),false);
  assert.equal(shouldIgnoreBillingEvent(profile,'invoice.payment_failed',{subscription:'sub_old'},250),true);
  assert.equal(shouldIgnoreBillingEvent(profile,'checkout.session.completed',{subscription:'sub_old'},200),true);
});

test('Stripe webhook idempotency and ordering guards are present in release source',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  assert.match(server,/stripe_webhook_events'\)\.insert\(\{event_id:event\.id,event_type:event\.type\}\)/);
  assert.match(server,/claimError\?\.code === '23505'/);
  assert.match(server,/shouldIgnoreBillingEvent/);
  assert.match(server,/stripe_state_event_created/);
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


test('quote sent_at validation is centralized and rejects future dates',()=>{
  const rules=readFileSync(new URL('../server/quote-rules.js',import.meta.url),'utf8');
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  assert.match(rules,/parseSentDate/);
  assert.match(rules,/v>today/);
  assert.match(server,/parseSentDate\(sent_at\)/);
});

test('billing checkout reuses only an open session matching the current configuration',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  const policy=readFileSync(new URL('../server/checkout-policy.js',import.meta.url),'utf8');
  assert.match(server,/checkout\.sessions\.list\(\{customer,status:'open',limit:10\}\)/);
  assert.match(server,/isReusableCheckoutSession\(s,fingerprint\)/);
  assert.match(policy,/session\?\.metadata\?\.checkout_config===fingerprint/);
});

test('Stripe customer is stable while checkout idempotency is versioned per claimed attempt',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  const policy=readFileSync(new URL('../server/checkout-policy.js',import.meta.url),'utf8');
  assert.match(server,/idempotencyKey:`relanzio-customer-\$\{req\.user\.id\}`/);
  assert.match(server,/checkout_claimed_at/);
  assert.match(server,/checkoutIdempotencyKey\(\{userId:req\.user\.id,fingerprint,claimedAt\}\)/);
  assert.match(policy,/CHECKOUT_CONFIG_VERSION='pro-card-v4-vat293b'/);
});


test('pricing and Stripe checkout stay aligned with VAT-exempt micro-enterprise configuration',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  const client=readFileSync(new URL('../client/src/main.jsx',import.meta.url),'utf8');
  const plans=readFileSync(new URL('../client/src/PlansView.jsx',import.meta.url),'utf8');
  const subscription=readFileSync(new URL('../client/src/subscription-display.js',import.meta.url),'utf8');
  const legal=readFileSync(new URL('../client/src/LegalPage.jsx',import.meta.url),'utf8');
  assert.match(server,/VAT non applicable, art\. 293 B du CGI/);
  assert.match(server,/automatic_tax:\{enabled:false\}/);
  assert.match(server,/invoice_settings:\{footer:VAT_NOTICE\}/);
  assert.match(server,/custom_text:\{submit:\{message:PRO_PRICE_LABEL\}\}/);
  assert.match(client,/TVA non applicable, art\. 293 B du CGI/);
  assert.match(subscription,/vatNote:'TVA non applicable, art\. 293 B du CGI'/);
  assert.match(plans,/PRO_PLAN\.vatNote/);
  assert.match(legal,/29 € \/ mois, sans engagement de durée minimale/);
  assert.match(legal,/Escompte pour paiement anticipé : néant/);
  assert.match(legal,/indemnité forfaitaire de 40 €/);
  assert.doesNotMatch([client,plans,subscription,legal].join('\n'),/29 € \+ TVA|TVA à 20 %|TVA 20 %/i);
});

test('production capabilities remain independently gated',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  const client=readFileSync(new URL('../client/src/main.jsx',import.meta.url),'utf8');
  assert.match(server,/BILLING_ENABLED!=='true'/);
  assert.match(server,/ACQUISITION_ENABLED!=='true'/);
  assert.match(server,/LEGAL_PAGES_APPROVED!=='true'/);
  assert.match(client,/VITE_BILLING_ENABLED==='true'/);
  assert.match(server,/FOLLOWUP_AUTOMATION_ENABLED==='true'/);
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
  const legal=readFileSync(new URL('../client/src/LegalPage.jsx',import.meta.url),'utf8');
  assert.match(legal,/Prospects professionnels/);
  assert.match(legal,/trois ans après leur collecte ou le dernier contact émanant du prospect/);
  assert.match(legal,/liste repoussoir/);
});


test('Docker build exposes every public launch variable used by Vite',()=>{
  const docker=readFileSync(new URL('../Dockerfile',import.meta.url),'utf8');
  for(const key of ['VITE_SUPPORT_EMAIL','VITE_CONTACT_EMAIL','VITE_BILLING_ENABLED','VITE_LEGAL_ENTITY_TYPE','VITE_LEGAL_NAME','VITE_LEGAL_FORM','VITE_LEGAL_CAPITAL','VITE_LEGAL_ADDRESS','VITE_LEGAL_EMAIL','VITE_LEGAL_REGISTRATION','VITE_LEGAL_VAT','VITE_LEGAL_PHONE','VITE_PUBLICATION_DIRECTOR']){
    assert.ok(docker.includes(`ARG ${key}`), `${key} build ARG missing`);
    assert.ok(docker.includes(`ENV ${key}=$${key}`), `${key} build ENV missing`);
  }
});


test('prepared B2B outreach uses commercial identity, source, privacy and opt-out',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  const email=readFileSync(new URL('../server/email.js',import.meta.url),'utf8');
  assert.match(email,/senderEmail \|\| process\.env\.EMAIL_FROM_ADDRESS/);
  assert.match(server,/senderEmail:commercialEmail/);
  assert.match(server,/replyTo:commercialEmail/);
  assert.match(server,/Source : \$\{source\}/);
  assert.match(server,/https:\/\/relanzio\.com\/privacy/);
  assert.match(server,/répondez STOP ou écrivez à/);
});


test('launch build uses lockfile installs in CI and Docker',()=>{
  const ci=readFileSync(new URL('../.github/workflows/ci.yml',import.meta.url),'utf8');
  const docker=readFileSync(new URL('../Dockerfile',import.meta.url),'utf8');
  assert.match(ci,/npm ci --no-audit --no-fund/);
  assert.doesNotMatch(ci,/npm install --no-audit --no-fund/);
  assert.match(docker,/npm ci --no-audit --no-fund/);
  assert.match(docker,/npm ci --omit=dev --no-audit --no-fund/);
  assert.doesNotMatch(docker,/npm install --no-audit --no-fund/);
});

test('public launch copy uses explicit account and trial CTAs without inventing payment',()=>{
  const client=readFileSync(new URL('../client/src/main.jsx',import.meta.url),'utf8');
  const plans=readFileSync(new URL('../client/src/PlansView.jsx',import.meta.url),'utf8');
  assert.match(client,/Créer un compte gratuit/);
  assert.match(plans,/Essayer Pro gratuitement pendant 7 jours/);
  assert.match(plans,/Sans carte bancaire et sans débit automatique/);
  assert.match(client,/Compte, données et facturation/);
  assert.match(client,/mailto:\$\{support\}/);
});

test('privacy copy includes direct B2B opposition right',()=>{
  const legal=readFileSync(new URL('../client/src/LegalPage.jsx',import.meta.url),'utf8');
  assert.match(legal,/droit d’opposition/);
  assert.match(legal,/opposition est simple, gratuite et peut être exercée à tout moment/);
});


test('compact mobile navigation remains accessible',()=>{
  const client=readFileSync(new URL('../client/src/main.jsx',import.meta.url),'utf8');
  const css=readFileSync(new URL('../client/src/styles.css',import.meta.url),'utf8');
  assert.match(client,/aria-label="Navigation de l’application"/);
  assert.match(client,/aria-label="Tableau de bord"/);
  assert.match(client,/aria-label="Aide et support"/);
  assert.match(client,/aria-label="Paramètres"/);
  assert.match(css,/min-width:44px;min-height:44px/);
  assert.match(css,/button:focus-visible,a:focus-visible/);
  assert.match(css,/hero-copy h1\{font-size:clamp\(40px,13vw,49px\)/);
});


test('seven-day Pro trial is wired through schema, access and admin controls',()=>{
  const schema=readFileSync(new URL('../supabase/schema.sql',import.meta.url),'utf8');
  const migration=readFileSync(new URL('../supabase/migrations/006_pro_trial_7d.sql',import.meta.url),'utf8');
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  const followups=readFileSync(new URL('../server/followups.js',import.meta.url),'utf8');
  const client=readFileSync(new URL('../client/src/main.jsx',import.meta.url),'utf8');
  const trialUi=readFileSync(new URL('../client/src/TrialStatus.jsx',import.meta.url),'utf8');
  const trialDisplay=readFileSync(new URL('../client/src/trial-display.js',import.meta.url),'utf8');
  for(const field of ['trial_started_at','trial_ends_at','trial_expired_at']){
    assert.ok(schema.includes(field),field);
    assert.ok(migration.includes(field),field);
  }
  assert.match(schema,/create table if not exists public\.trial_events/);
  assert.match(server,/app\.post\('\/api\/trial\/start'/);
  assert.match(server,/app\.post\('\/api\/admin\/trials\/grant'/);
  assert.match(server,/expireTrials\(\)/);
  assert.match(server,/hasProAccess\(profile\)/);
  assert.match(followups,/hasProAccess\(profile\)/);
  assert.match(client,/profile\.pro_access/);
  assert.match(trialUi,/trialDisplay\(profile\)/);
  assert.match(trialDisplay,/Essai Pro —/);
  assert.match(trialDisplay,/Passer à Pro — 29 €\/mois/);
  const plans=readFileSync(new URL('../client/src/PlansView.jsx',import.meta.url),'utf8');
  assert.match(plans,/Essayer Pro gratuitement pendant 7 jours/);
});

test('trial accounts are excluded from paid MRR metrics',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  assert.match(server,/p\.plan==='pro'&&p\.subscription_status==='active'/);
  assert.doesNotMatch(server,/paying=.*\['active','trialing'\]/);
  assert.match(server,/les essais ne sont pas comptés/);
});


test('prospect import preserves sector and deduplicates by normalized email',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  assert.match(server,/sector:sanitizeText\(p\.sector,160\)/);
  assert.match(server,/const email=normalizeEmail\(p\.email\)/);
  assert.match(server,/upsert\(accepted,\{onConflict:'email',ignoreDuplicates:false\}\)/);
});


test('production SPA fallback serves only known routes and 404s scanner paths',()=>{
  const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
  assert.match(server,/const spaRoutes=new Set\(\[/);
  assert.doesNotMatch(server,/\/wp-admin/);
  assert.match(server,/res\.status\(404\)\.type\('text\/plain'\)\.send\('Not found'\)/);
  assert.match(server,/spaRoutes\.has\(req\.path\)/);
});


test('signup pins confirmation redirect and records acceptance metadata',()=>{
  const client=readFileSync(new URL('../client/src/main.jsx',import.meta.url),'utf8');
  assert.match(client,/emailRedirectTo:location\.origin\+'\/'/);
  assert.match(client,/terms_accepted_at:new Date\(\)\.toISOString\(\)/);
  assert.match(client,/terms_version:'2026-10-15'/);
  assert.match(client,/privacy_acknowledged_at:new Date\(\)\.toISOString\(\)/);
});
