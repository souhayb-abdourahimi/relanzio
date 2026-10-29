import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read=f=>readFileSync(new URL('../server/'+f,import.meta.url),'utf8');
const calls=src=>[...src.matchAll(/sendEmail\(\{([\s\S]*?)\}\);/g)].map(m=>m[1]);

test('every prospection email goes through the outreach stream; no client email does',()=>{
  for(const f of ['controlled-outreach.js','outreach.js','pilot-outreach.js']){
    const list=calls(read(f));
    assert.ok(list.length>0,f);
    for(const c of list)assert.match(c,/stream:'outreach'/,f);
  }
  for(const f of ['followups.js','quote-replies.js','morning-digest.js','lifecycle.js','stripe-webhook.js'])
    for(const c of calls(read(f)))assert.doesNotMatch(c,/stream:'outreach'/,f);
});

test('the outreach stream can use its own Brevo key, product keeps the main one; provider errors hide addresses',()=>{
  const email=read('email.js');
  assert.match(email,/stream === 'outreach' \? \(process\.env\.OUTREACH_BREVO_API_KEY \|\| process\.env\.BREVO_API_KEY\) : process\.env\.BREVO_API_KEY/);
  assert.match(email,/"api-key": apiKey/);
  assert.match(email,/throw new Error\(`Brevo \$\{r\.status\}: \$\{redactEmails\(await r\.text\(\)\)\}`\)/);
  assert.match(read('pilot-outreach.js'),/const apiKey = process\.env\.OUTREACH_BREVO_API_KEY \|\| process\.env\.BREVO_API_KEY;/,'pilot preflight checks the outreach account');
  const redact=eval(email.match(/^const redactEmails = (.+);$/m)[1]);
  assert.equal(redact('{"message":"invalid email jean.dupont@example.fr"}'),'{"message":"invalid email [email]"}');
});

test('client follow-ups have their own per-account daily ceiling',()=>{
  assert.match(read('followups.js'),/if\(Number\(sentToday\|\|0\)>=cap\)throw new Error\('FOLLOWUP_ACCOUNT_DAILY_CAP'\)/);
});

test('prospection sequence is still D0 → J+3 → END (no J+7)',()=>{
  const src=read('controlled-outreach.js');
  assert.match(src,/sequence_simplified_no_j7/);
  assert.doesNotMatch(src,/7\*86400000|7 \* 86400000/);
});
