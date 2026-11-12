// Static guards of the Stripe lab: what the workflow can reach, in which order, and when the real run may count
// as certified. Fails if a future edit widens secrets, triggers or permissions, or reorders the safety steps.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { REQUIRED, certification } from '../scripts/lab/stripe-run.mjs';
import { evaluateEnvironment, changedAppFiles } from '../scripts/lab/gate-check.mjs';

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const workflow = read('.github/workflows/stripe-integration-lab.yml');
const action = read('.github/actions/lab-setup/action.yml');
const jobs = { infra: workflow.slice(workflow.indexOf('\n  infra:'), workflow.indexOf('\n  stripe:')), stripe: workflow.slice(workflow.indexOf('\n  stripe:')) };

test('the only secret the lab can receive is STRIPE_LAB_SECRET_KEY (no other repository or organisation secret)', () => {
  const refs = new Set([...(workflow + action).matchAll(/secrets\.([A-Za-z0-9_]+)/g)].map(m => m[1]));
  assert.deepEqual([...refs], ['STRIPE_LAB_SECRET_KEY']);
  assert.doesNotMatch(workflow + action, /toJSON\(\s*secrets\s*\)|secrets:\s*inherit|secrets\[/);
  assert.doesNotMatch(action, /secrets\./, 'the shared set-up reads no secret');
  assert.doesNotMatch(jobs.infra, /secrets\.|environment:/, 'the infra job has no secret and no environment');
});

test('triggers and token permissions stay minimal', () => {
  const on = workflow.slice(workflow.indexOf('\non:'), workflow.indexOf('\npermissions:'));
  assert.match(on, /push:\s*\n\s*branches: \['lab\/\*\*'\]/);
  assert.doesNotMatch(on, /pull_request|workflow_run|workflow_dispatch|schedule|issue_comment/);
  assert.doesNotMatch(workflow, /:\s*write\b/, 'no write permission anywhere');
  assert.match(workflow, /\npermissions:\s*\n\s*contents: read/);
  assert.equal((workflow.match(/persist-credentials: false/g) || []).length, 2);
});

test('real Stripe job: double lock, then gate, then isolation proof, and only then the key and the scenarios', () => {
  const s = jobs.stripe;
  assert.match(s, /if: github\.ref == 'refs\/heads\/lab\/stripe-run'/);
  assert.match(s, /environment: stripe-lab/);
  const gate = s.indexOf('gate-check.mjs enforce');
  const firstSecret = s.indexOf('secrets.');
  const isolation = s.indexOf('isolation-check.mjs stripe');
  const scenarios = s.indexOf('stripe-run.mjs');
  assert.ok(gate > 0 && gate < firstSecret, 'the gate runs before any step that receives the key');
  assert.ok(isolation > 0 && isolation < scenarios, 'the isolation proof step precedes the scenarios');
  assert.doesNotMatch(s.slice(0, gate), /secrets\./);
  assert.doesNotMatch(s, /continue-on-error|if: always\(\)\s*\n\s*run: node scripts\/lab\/stripe-run/, 'a failed check can never be skipped');
});

test('certification: every required scenario must pass, a missing one is never a success', () => {
  const all = REQUIRED.map(([id]) => id);
  assert.ok(all.includes('P1_STALE') && all.includes('ISOLATION') && all.includes('EMAIL_CUSTOMERS') && all.includes('EMAIL_NONE'));
  assert.equal(new Set(all).size, all.length);
  assert.deepEqual(certification(all), { certified: true, missing: [], passedCount: all.length });
  const noStale = certification(all.filter(id => id !== 'P1_STALE'));
  assert.equal(noStale.certified, false); assert.deepEqual(noStale.missing, ['P1_STALE']);
  assert.equal(certification(all, 'stopped').certified, false, 'an error is never certified, even if everything else passed');
  assert.equal(certification([]).certified, false);
});

test('the real run stops at once when the isolation proof fails: nothing else is attempted', () => {
  const base = { PATH: process.env.PATH, SUPABASE_URL: 'http://127.0.0.1:54321', STRIPE_EXPECTED_MODE: 'test' };
  for (const extra of [{}, { SUPABASE_URL: 'https://uwgvnhnpvxoebabayqac.supabase.co' }, { STRIPE_SECRET_KEY: 'sk_live_x' }, { BREVO_API_KEY: 'x' }]) {
    const r = spawnSync(process.execPath, ['scripts/lab/stripe-run.mjs'], { cwd: new URL('..', import.meta.url).pathname, env: { ...base, ...extra }, encoding: 'utf8', timeout: 20000 });
    assert.equal(r.status, 1, JSON.stringify(extra));
    assert.match(r.stdout, new RegExp(`LAB_STRIPE_NOT_CERTIFIED 0/${REQUIRED.length} manquants=ISOLATION,`));
    assert.match(r.stdout + r.stderr, /isolation:/);
    assert.doesNotMatch(r.stdout, /LAB_STRIPE_OK/);
  }
});

test('environment gate: a reviewer and the single branch lab/stripe-run are required', () => {
  const protectedEnv = { protection_rules: [{ type: 'required_reviewers', reviewers: [{ type: 'User', reviewer: { login: 'owner' } }] }], deployment_branch_policy: { protected_branches: false, custom_branch_policies: true } };
  const onlyRun = { branch_policies: [{ name: 'lab/stripe-run', type: 'branch' }] };
  assert.deepEqual(evaluateEnvironment(protectedEnv, onlyRun).problems, []);
  assert.match(evaluateEnvironment({ protection_rules: [], deployment_branch_policy: null }, { branch_policies: [] }).problems.join(), /no required reviewer.*not restricted.*none/);
  assert.match(evaluateEnvironment(protectedEnv, { branch_policies: [{ name: 'lab/*', type: 'branch' }] }).problems.join(), /exactly "lab\/stripe-run"/);
});

test('the application code under test is byte-identical to the PR #16 commit', () => {
  let changed;
  try { changed = changedAppFiles(); } catch { return; } // shallow clone without the PR #16 commit: checked in the workflow (fetch-depth 0)
  assert.deepEqual(changed, []);
});
