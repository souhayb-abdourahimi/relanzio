import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Exercise the actual sendEmail implementation with isolated I/O. No email is sent.
async function subject(result) {
  const source = (await readFile(new URL('../server/email.js', import.meta.url), 'utf8'))
    .replace(/^import .*;\s*$/gm, '');
  let calls = 0;
  const db = { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => result }) }) }) };
  const fetch = async () => { calls++; return { ok:true, json:async () => ({messageId:'unit-test-only'}) }; };
  const create = new Function('db','fetch','process','OpenAI', source.replace(/export /g,'') + '\nreturn sendEmail;');
  const send = create(db,fetch,{env:{BREVO_API_KEY:'unit-only',EMAIL_FROM_ADDRESS:'qa@example.invalid'}},class {});
  return { send, calls:() => calls };
}
test('suppressed recipient is rejected before contacting provider', async () => {
  const s = await subject({data:{email:'qa@example.invalid'},error:null});
  await assert.rejects(s.send({to:'QA@example.invalid',subject:'QA',text:'QA'}), /EMAIL_RECIPIENT_SUPPRESSED/);
  assert.equal(s.calls(),0);
});
test('suppression database failure blocks provider send', async () => {
  const s = await subject({data:null,error:{message:'database unavailable'}});
  await assert.rejects(s.send({to:'qa@example.invalid',subject:'QA',text:'QA'}), /EMAIL_SUPPRESSION_CHECK_FAILED/);
  assert.equal(s.calls(),0);
});
test('unsuppressed recipient reaches provider', async () => {
  const s = await subject({data:null,error:null});
  assert.equal((await s.send({to:'qa@example.invalid',subject:'QA',text:'QA'})).messageId,'unit-test-only');
  assert.equal(s.calls(),1);
});
