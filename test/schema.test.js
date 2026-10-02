import test from 'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';
const sql=readFileSync(new URL('../supabase/schema.sql',import.meta.url),'utf8');const api=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
test('schema contains critical v0.3 tables and RLS',()=>{for(const t of ['profiles','quotes','followups','product_events','support_tickets','prospects','suppressions','outreach_events','feedback_insights'])assert.match(sql,new RegExp(`create table if not exists public\\.${t}`));assert.match(sql,/enable row level security/g)});
test('prospect upsert has a compatible unique email constraint',()=>{assert.match(sql,/email text not null unique/);assert.match(api,/onConflict:'email'/)});
test('critical account, billing, support and provider routes exist',()=>{for(const route of ['/api/account','/api/billing/portal','/api/support/ask','/api/support/tickets','/api/brevo/webhook','/api/admin/ceo'])assert.ok(api.includes(route),route)});
test('destructive account deletion requires explicit confirmation',()=>{assert.match(api,/confirmation!=='SUPPRIMER'/);assert.match(api,/auth\.admin\.deleteUser/)});
test('outreach is capped and suppressed contacts are checked',()=>{assert.match(api,/OUTREACH_DAILY_CAP/);assert.match(api,/liste d’opposition/);assert.match(api,/7 jours/)});
