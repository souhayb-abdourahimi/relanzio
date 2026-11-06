-- Synthetic source database for the backup/restore end-to-end test (test/backup-restore-e2e.test.js).
-- Built on top of: ops/backup/sql/ephemeral-bootstrap.sql + ops/backup/sql/auth-structure-reference.sql
-- + supabase/schema.sql + every supabase/migrations file. Fake people only (example.test), no real data.
create schema if not exists supabase_migrations;
create table if not exists supabase_migrations.schema_migrations (version text primary key, statements text[], name text);
insert into supabase_migrations.schema_migrations(version, name, statements) values
 ('20261001231145','relanzio_v04_staging_schema','{"-- test"}'), ('20261002141214','stripe_webhook_idempotency','{}'),
 ('20261004113109','request_idempotency_hardening','{}'), ('20261013223553','pro_trial_7d','{}'), ('20261013224205','outreach_queue','{}'),
 ('20261013224303','prospect_sector','{}'), ('20261014221647','quote_schedule_and_checkout_claim','{}'), ('20261014222310','rls_explicit_authenticated_reads','{}'),
 ('20261014223942','atomic_quote_quota','{}'), ('20261014224214','index_missing_foreign_keys','{}'), ('20261015083752','atomic_quote_reopen_quota','{}'),
 ('20261015085331','stripe_event_ordering','{}'), ('20261016081002','controlled_outreach_20_safety','{}'), ('20261016100553','imap_reply_ingestion','{}');

-- Supabase-like Storage and Vault (empty, as in production).
create schema if not exists storage;
create table if not exists storage.buckets (id text primary key, name text);
create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text);
create schema if not exists vault;
create table if not exists vault.secrets (id uuid primary key default gen_random_uuid(), name text);

-- A few Supabase-like Auth tables around the two that are backed up.
create table if not exists auth.sessions (id uuid primary key, user_id uuid references auth.users(id) on delete cascade, created_at timestamptz default now());
create table if not exists auth.refresh_tokens (id bigserial primary key, token varchar(255), user_id varchar(255), session_id uuid);
create table if not exists auth.mfa_factors (id uuid primary key, user_id uuid not null references auth.users(id) on delete cascade);
create table if not exists auth.audit_log_entries (id uuid primary key, payload json);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) values
 ('00000000-0000-4000-8000-000000000001','authenticated','authenticated','ana@example.test','$2a$10$abcdefghijklmnopqrstuuFakeHashOnlyForTests000000000001','2026-10-01 08:00:00+00','{"provider":"email"}','{}','2026-10-01 08:00:00+00','2026-10-02 08:00:00+00'),
 ('00000000-0000-4000-8000-000000000002','authenticated','authenticated','bob@example.test','$2a$10$abcdefghijklmnopqrstuuFakeHashOnlyForTests000000000002','2026-10-03 09:00:00+00','{"provider":"email"}','{"name":"Bob"}','2026-10-03 09:00:00+00','2026-10-03 09:00:00+00'),
 ('00000000-0000-4000-8000-000000000003','authenticated','authenticated','cy@example.test',null,null,'{"provider":"google"}','{}','2026-10-04 10:00:00+00','2026-10-04 10:00:00+00');
insert into auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at) values
 ('10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','{"sub":"00000000-0000-4000-8000-000000000001","email":"ana@example.test"}','email','2026-10-01 08:00:00+00','2026-10-01 08:00:00+00'),
 ('10000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000002','{"sub":"00000000-0000-4000-8000-000000000002","email":"bob@example.test"}','email','2026-10-03 09:00:00+00','2026-10-03 09:00:00+00'),
 ('10000000-0000-4000-8000-000000000003','g-123456','00000000-0000-4000-8000-000000000003','{"sub":"g-123456","email":"cy@example.test"}','google','2026-10-04 10:00:00+00','2026-10-04 10:00:00+00');
insert into auth.sessions (id, user_id) values ('20000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001');
insert into auth.refresh_tokens (token, user_id, session_id) values ('fake-refresh-token','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001');

insert into public.profiles (id, email, plan, company_name) values
 ('00000000-0000-4000-8000-000000000001','ana@example.test','pro','Ana Plomberie'),
 ('00000000-0000-4000-8000-000000000002','bob@example.test','free','Bob Peinture');
-- user 3 has no profile on purpose (the production database has one such account too).

insert into public.quotes (id, user_id, client_name, client_email, title, amount, sent_at, status) values
 ('30000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','Client Un','client1@example.test','Salle de bain',4200.50,'2026-10-10','open'),
 ('30000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Client Deux','client2@example.test','Cuisine',1800,'2026-10-12','won'),
 ('30000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000002','Client Trois','client3@example.test','Façade « été »',990,'2026-10-15','open');
insert into public.followups (quote_id, user_id, step, subject, status, channel) values
 ('30000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001',1,'Votre devis','sent','relanzio'),
 ('30000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000002',1,'Votre devis','sent','manual');
insert into public.quote_replies (quote_id, user_id, source, effect, dedupe_key, received_at, category, channel) values
 ('30000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','manual','stop','test-dedupe-1','2026-10-20 12:00:00+00','interested','phone');
insert into public.followup_optouts (user_id, email) values ('00000000-0000-4000-8000-000000000001','client9@example.test');
insert into public.digest_sends (user_id, business_date) values ('00000000-0000-4000-8000-000000000001','2026-10-21');
insert into public.prospects (id, company_name, email, score, status) values
 ('40000000-0000-4000-8000-000000000001','Prospect SARL','contact@prospect.example.test',72,'contacted'),
 ('40000000-0000-4000-8000-000000000002','Autre SAS','hello@autre.example.test',60,'qualified');
insert into public.outreach_queue (prospect_id, scheduled_at, subject, content, sequence_step, status) values
 ('40000000-0000-4000-8000-000000000001','2026-10-22 09:00:00+00','Relanzio','Bonjour',0,'sent'),
 ('40000000-0000-4000-8000-000000000001','2026-10-25 09:00:00+00','Relanzio','Bonjour (suite)',1,'queued');
insert into public.outreach_events (prospect_id, type) values ('40000000-0000-4000-8000-000000000001','sent');
insert into public.outreach_candidates (company_name, email, source_url, verification_status, verified_at) values
 ('Candidat EURL','info@candidat.example.test','https://candidat.example.test/contact','pass','2026-10-20 08:00:00+00');
insert into public.outreach_daily_slots (business_date, slot, reservation_key, status) values ('2026-10-22', 1, 'slot-test-1', 'sent');
insert into public.sales_followups (prospect_id, category) values ('40000000-0000-4000-8000-000000000001','interested');
insert into public.suppressions (email, reason) values ('stop@example.test','unsubscribe');
insert into public.prospect_tombstones (email, email_domain) values ('deleted@example.test','example.test');
insert into public.stripe_webhook_events (event_id, event_type) values ('evt_test_0001','invoice.paid');
insert into public.support_tickets (user_id, subject, message) values ('00000000-0000-4000-8000-000000000002','Aide','Comment relancer ?');
insert into public.lifecycle_messages (user_id, type) values ('00000000-0000-4000-8000-000000000002','welcome');
insert into public.feedback_insights (category) values ('pricing');
insert into public.trial_events (user_id, type) values ('00000000-0000-4000-8000-000000000001','activated');
insert into public.product_events (user_id, event, metadata) values
 ('00000000-0000-4000-8000-000000000001','quote_created','{"n":1}'), ('00000000-0000-4000-8000-000000000001','quote_created','{"n":2}'), (null,'landing_view','{}');
insert into public.system_events (scope, message) values ('test','backup fixture'), ('test','second event');
-- Burn a sequence value so that sequence positions are really checked.
select nextval('public.system_events_id_seq');

-- Production hardening (checked on 6 Nov 2026). The objects above were created under the Supabase default
-- privileges (ops/backup/sql/supabase-default-privileges.sql, applied before the schema), then production
-- revoked them: anon has no table privilege in public, authenticated only reads the tables its RLS policies
-- expose, service_role keeps everything. A restore must reproduce exactly this, not the defaults.
revoke all on all tables in schema public from anon, authenticated;
grant select on public.profiles, public.quotes, public.followups, public.quote_replies, public.support_tickets to authenticated;
