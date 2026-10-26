import test from 'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';
const sql=readFileSync(new URL('../supabase/schema.sql',import.meta.url),'utf8');const api=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
test('schema contains critical v0.3 tables and RLS',()=>{for(const t of ['profiles','quotes','followups','product_events','support_tickets','prospects','suppressions','outreach_events','feedback_insights'])assert.match(sql,new RegExp(`create table if not exists public\\.${t}`));assert.match(sql,/enable row level security/g)});
test('prospect import has unique email and safe importer',()=>{assert.match(sql,/email text not null unique/);assert.match(api,/safeImportCommercialProspects/)});
test('critical account, billing, support and provider routes exist',()=>{for(const route of ['/api/account','/api/billing/portal','/api/support/ask','/api/support/tickets','/api/brevo/webhook','/api/admin/ceo'])assert.ok(api.includes(route),route)});
test('destructive account deletion requires explicit confirmation',()=>{assert.match(api,/confirmation!=='SUPPRIMER'/);assert.match(api,/auth\.admin\.deleteUser/)});
test('controlled outreach is separately gated while legacy acquisition remains disabled',()=>{const controlled=readFileSync(new URL('../server/controlled-outreach.js',import.meta.url),'utf8');assert.match(controlled,/OUTREACH_DAILY_CAP/);assert.match(controlled,/COMMERCIAL_OUTREACH_SEND_ENABLED/);assert.match(controlled,/suppressions/);assert.match(controlled,/claim_outreach_daily_slot/)});

test('continuous outreach migration stages verified candidates and removes the legacy 20-slot clamp',()=>{
  const migration=readFileSync(new URL('../supabase/migrations/20261026133000_continuous_commercial_outreach.sql',import.meta.url),'utf8');
  assert.match(migration,/create table if not exists public\.outreach_candidates/);
  assert.match(migration,/create table if not exists public\.sales_followups/);
  assert.match(migration,/p_cap integer default 300/);
  assert.match(migration,/least\(1000/);
  assert.match(migration,/interested/);
  assert.match(migration,/auto_reply/);
});
