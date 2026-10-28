import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isTrialEligible, withEntitlements } from '../server/entitlements.js';
import { activeQuoteLimitFor, FREE_ACTIVE_QUOTES_LIMIT, TRIAL_DAYS } from '../shared/plans.js';

// Regression: the Railway pre-deploy QA (server/qa-auth-domain-final.mjs) assumed an account that had
// created its first quote was still Free. Since the first quote starts the 7-day Pro trial, its Free quota
// race returned [201,201] and blocked the deploy of aca77ec.
const qa=readFileSync(new URL('../server/qa-auth-domain-final.mjs',import.meta.url),'utf8');
const server=readFileSync(new URL('../server/index.js',import.meta.url),'utf8');
const DAY=24*3600000;

test('a fresh account is trial-eligible, so its first quote makes it Pro: it cannot be the Free quota account',()=>{
  assert.match(server,/currentProfile=await startTrialOnFirstQuote\(req\.user,profile\)/);
  const fresh=withEntitlements({plan:'free',subscription_status:'none'});
  assert.equal(isTrialEligible(fresh),true);
  assert.equal(fresh.pro_access,false);
});

test('the Free quota account is prepared as trial already used before its first quote',()=>{
  const prepare=qa.indexOf("const {error:freeSeedError}=await db.from('profiles').update(");
  const firstFreeQuote=qa.indexOf("api(userB.token,'/api/quotes',{method:'POST'");
  assert.ok(prepare>0&&firstFreeQuote>prepare,'userB must be prepared before it creates any quote');
  assert.match(qa,/update\(\{plan:'free',subscription_status:'none',trial_started_at:new Date\(Date\.now\(\)-8\*24\*3600000\)\.toISOString\(\),trial_ends_at:usedTrialEnd,trial_expired_at:usedTrialEnd\}\)\.eq\('id',userB\.id\)/);
  // Same shape as the QA seed: Free, no trial possible, 5 active quotes.
  const now=Date.now(),used=new Date(now-DAY).toISOString();
  const prepared=withEntitlements({plan:'free',subscription_status:'none',trial_started_at:new Date(now-8*DAY).toISOString(),trial_ends_at:used,trial_expired_at:used});
  assert.equal(isTrialEligible(prepared),false);
  assert.equal(prepared.pro_access,false);
  assert.equal(prepared.effective_plan,'free');
  assert.equal(activeQuoteLimitFor(prepared.pro_access),FREE_ACTIVE_QUOTES_LIMIT);
});

test('Free quota checks run on the prepared account and still prove the 5-quote limit',()=>{
  assert.match(qa,/assert\(freeProfile\.status===200&&fp\?\.effective_plan==='free'&&fp\?\.pro_access===false&&fp\?\.trial_active===false&&fp\?\.trial_eligible===false,'free_qa_user_prepared'/);
  assert.match(qa,/const concurrent=await Promise\.all\(\[0,1\]\.map\(i=>api\(userB\.token,'\/api\/quotes'/);
  assert.match(qa,/concurrentStatuses\[0\]===201&&concurrentStatuses\[1\]===403&&activeAfterRace===5,'atomic_free_quota_under_concurrent_create'/);
  assert.match(qa,/assert\(sixth\.status===403,'free_limit_counts_paused'/);
  assert.match(qa,/assert\(sixthOk\.status===201,'free_limit_releases_after_close'\)/);
  assert.doesNotMatch(qa,/api\(userA\.token,'\/api\/quotes',\{method:'POST',body:\{client_name:'Course/,'the trial account must not run the Free race');
});

test('trial checks follow the automatic first-quote trial, never the retired self-service start',()=>{
  assert.equal(TRIAL_DAYS,7);
  assert.doesNotMatch(server,/app\.post\('\/api\/trial\/start'/);
  assert.doesNotMatch(qa,/trial\.status===201|self_service_trial/);
  const before=qa.indexOf("'no_trial_before_first_quote'"),first=qa.indexOf("const created=await api(userA.token,'/api/quotes'"),started=qa.indexOf("'first_quote_starts_trial_exact_7d'");
  assert.ok(before>0&&before<first&&first<started,'no trial before the first quote, trial right after it');
  assert.match(qa,/t1-t0===7\*24\*3600000,'first_quote_starts_trial_exact_7d'/);
  for(const name of ['second_quote_keeps_same_trial','trial_one_time_only','trial_survives_refresh','trial_survives_logout_login','expired_trial_cannot_restart'])assert.ok(qa.includes(`'${name}'`),name);
  assert.match(qa,/trialAgain\.status!==201&&pr\?\.trial_started_at===trialStartedAt/);
});
