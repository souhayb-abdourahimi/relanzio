#!/usr/bin/env node
// Gate of the real Stripe job. Runs BEFORE any step that receives the lab key. Uses only Node built-ins.
//
//   node scripts/lab/gate-check.mjs enforce   (job "stripe": any failed check stops the job, fail closed)
//   node scripts/lab/gate-check.mjs report    (job "infra": prints the same checks, never blocks)
//
// Checks:
//  1. COMMIT    the commit being run is exactly the one the owner approved (environment variable
//               LAB_APPROVED_COMMIT, full 40-character SHA, set by the owner after reviewing it);
//  2. APP_CODE  every application file is byte-identical to the PR #16 commit under test: only lab tooling may differ;
//  3. ENV_GATE  the GitHub environment "stripe-lab" really requires a reviewer and is restricted to the branch
//               lab/stripe-run (read through the GitHub API with the job's read-only token).
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const PR16_COMMIT = '76a803bb163238088ffc2cf7a23035946be302b7';
export const LAB_PATHS = ['lab', 'scripts/lab', '.github/workflows/stripe-integration-lab.yml', '.github/actions/lab-setup', 'test/lab-isolation.test.js', 'test/lab-workflow-guard.test.js'];
export const RUN_BRANCH = 'lab/stripe-run';

export function changedAppFiles(base = PR16_COMMIT, head = 'HEAD') {
  const out = execFileSync('git', ['diff', '--name-only', base, head, '--', '.', ...LAB_PATHS.map(p => `:(exclude)${p}`)], { encoding: 'utf8' });
  return out.split('\n').filter(Boolean);
}

export function evaluateEnvironment(environment, branchPolicies) {
  const problems = [];
  const reviewers = (environment?.protection_rules || []).filter(r => r.type === 'required_reviewers').flatMap(r => r.reviewers || []);
  if (!reviewers.length) problems.push('no required reviewer on environment stripe-lab');
  const policy = environment?.deployment_branch_policy;
  if (!policy || policy.custom_branch_policies !== true) problems.push('environment stripe-lab is not restricted to selected branches');
  const names = (branchPolicies?.branch_policies || []).map(p => `${p.type || 'branch'}:${p.name}`);
  if (names.length !== 1 || names[0] !== `branch:${RUN_BRANCH}`) problems.push(`environment stripe-lab branch rule must be exactly "${RUN_BRANCH}" (found: ${names.join(', ') || 'none'})`);
  return { problems, reviewers: reviewers.length };
}

async function github(path) {
  const res = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}${path}`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
  });
  if (!res.ok) throw Object.assign(new Error(`GitHub API ${path}: HTTP ${res.status}`), { status: res.status });
  return res.json();
}

async function main() {
  const mode = process.argv[2] === 'enforce' ? 'enforce' : 'report';
  const results = {};
  const sha = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const approved = String(process.env.LAB_APPROVED_COMMIT || '').trim();
  results.COMMIT = mode === 'report'
    ? { ok: true, info: `commit ${sha} (to approve: set LAB_APPROVED_COMMIT=${sha} in environment stripe-lab)` }
    : /^[0-9a-f]{40}$/.test(approved) && approved === sha
      ? { ok: true, info: `commit ${sha} = LAB_APPROVED_COMMIT` }
      : { ok: false, info: `running ${sha}, approved ${approved || '(LAB_APPROVED_COMMIT not set)'}` };
  try {
    const changed = changedAppFiles();
    results.APP_CODE = changed.length ? { ok: false, info: `application files differ from ${PR16_COMMIT.slice(0, 8)}: ${changed.slice(0, 10).join(', ')}` }
      : { ok: true, info: `application code identical to ${PR16_COMMIT.slice(0, 8)} (only lab tooling differs)` };
  } catch (e) { results.APP_CODE = { ok: false, info: `cannot compare with ${PR16_COMMIT.slice(0, 8)}: ${e.message.split('\n')[0]}` }; }
  try {
    const environment = await github('/environments/stripe-lab');
    const policies = await github('/environments/stripe-lab/deployment-branch-policies');
    const r = evaluateEnvironment(environment, policies);
    results.ENV_GATE = r.problems.length ? { ok: false, info: r.problems.join('; ') } : { ok: true, info: `${r.reviewers} required reviewer(s), branch ${RUN_BRANCH} only` };
  } catch (e) { results.ENV_GATE = { ok: false, info: `not verifiable: ${e.message}` }; }

  for (const [k, v] of Object.entries(results)) console.log(`LAB_GATE_${v.ok ? 'OK' : (mode === 'enforce' ? 'FAILED' : 'NOT_MET')} ${k} ${v.info}`);
  const ok = Object.values(results).every(v => v.ok);
  if (mode === 'enforce' && !ok) { console.log('LAB_GATE_STOP the Stripe key is not used'); process.exit(1); }
  console.log(mode === 'enforce' ? 'LAB_GATE_PASSED' : `LAB_GATE_REPORT ${ok ? 'all conditions met' : 'conditions not met yet (expected before the owner configures stripe-lab)'}`);
}
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main().catch(e => { console.log(`LAB_GATE_FAILED ${e.message}`); process.exit(process.argv[2] === 'enforce' ? 1 : 0); });
