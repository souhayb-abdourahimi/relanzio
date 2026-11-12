#!/usr/bin/env node
// Prepares the lab's LOCAL Supabase stack: applies supabase/schema.sql + every migration, creates two lab users
// (one for scripts/stripe-test-validation.mjs, one for scripts/lab/scenarios.mjs, so test-clock timestamps of the
// first never shadow the second), and exports the local connection settings to $GITHUB_ENV.
// Usage: supabase status --workdir lab -o json > status.json && node scripts/lab/prepare-lab.mjs status.json
import { readFileSync, readdirSync, appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const status = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const pick = (...names) => { for (const n of names) if (status[n]) return status[n]; throw new Error(`supabase status: none of ${names.join('/')} found`); };
const API_URL = pick('API_URL');
const DB_URL = pick('DB_URL');
const SERVICE_KEY = pick('SERVICE_ROLE_KEY', 'SECRET_KEY');
const ANON_KEY = pick('ANON_KEY', 'PUBLISHABLE_KEY');
for (const [n, v] of [['API_URL', API_URL], ['DB_URL', DB_URL]]) if (!/^(https?|postgres(ql)?):\/\/([^@]*@)?(127\.0\.0\.1|localhost)[:/]/.test(v)) throw new Error(`${n} is not local`);

const psql = file => execFileSync('psql', [DB_URL, '-X', '-q', '-v', 'ON_ERROR_STOP=1', '-f', file], { stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, PGOPTIONS: '-c client_min_messages=warning' } });
psql('supabase/schema.sql');
const migrations = readdirSync('supabase/migrations').filter(f => f.endsWith('.sql') && !f.endsWith('.down.sql')).sort();
for (const f of migrations) psql(`supabase/migrations/${f}`);
console.log(`LAB_DB schema + ${migrations.length} migrations applied`);

async function createUser(email) {
  const res = await fetch(`${API_URL}/auth/v1/admin/users`, { method: 'POST', headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, email_confirm: true }) });
  const body = await res.json();
  if (!res.ok || !body.id) throw new Error(`create user ${email}: ${res.status}`);
  execFileSync('psql', [DB_URL, '-X', '-q', '-v', 'ON_ERROR_STOP=1', '-v', `id=${body.id}`, '-v', `email=${email}`], { input: `insert into public.profiles(id, email) values (:'id', :'email');`, stdio: ['pipe', 'ignore', 'inherit'] });
  return body.id;
}
const user1 = await createUser('lab-validation@example.com');
const user2 = await createUser('lab-scenarios@example.com');
console.log('LAB_USERS 2 created (example.com addresses, local stack only)');

const out = process.env.GITHUB_ENV;
const lines = [`SUPABASE_URL=${API_URL}`, `SUPABASE_SERVICE_ROLE_KEY=${SERVICE_KEY}`, `SUPABASE_ANON_KEY=${ANON_KEY}`, `LAB_DB_URL=${DB_URL}`, `VALIDATION_USER_ID=${user1}`, `LAB_USER_ID=${user2}`];
if (out) appendFileSync(out, lines.join('\n') + '\n'); else console.log('(no GITHUB_ENV: not exported)');
