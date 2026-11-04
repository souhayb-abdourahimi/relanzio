import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Runs test/e2e/reply-mailbox.mjs in a child process: the local test IMAP server's certificate is trusted through
// NODE_EXTRA_CA_CERTS (read only at startup), so the real IMAP client keeps full TLS verification.
// Placeholder values only: no real mailbox, database or provider is contacted (fetch is intercepted in the script).
test('reply mailbox end to end: tokenised Reply-To, IMAP over TLS, stop on a real answer, never a relance after it',()=>{
  const script=fileURLToPath(new URL('./e2e/reply-mailbox.mjs',import.meta.url));
  const env={
    PATH:process.env.PATH,HOME:process.env.HOME||'/tmp',TZ:'UTC',
    NODE_EXTRA_CA_CERTS:fileURLToPath(new URL('./fixtures/imap-localhost.crt',import.meta.url)),
    SUPABASE_URL:'http://127.0.0.1:9',SUPABASE_SERVICE_ROLE_KEY:'test-placeholder',SUPABASE_ANON_KEY:'test-placeholder',
    BREVO_API_KEY:'test-placeholder',EMAIL_FROM_ADDRESS:'relances@relanzio.com',EMAIL_LINK_SECRET:'test-link-secret-0123456789abcdef',APP_URL:'https://relanzio.com',
    REPLY_INBOUND_ADDRESS:'reponses@reply.relanzio.com',REPLY_IMAP_HOST:'imap.test.invalid',REPLY_IMAP_PORT:'993',
    REPLY_IMAP_USER:'reponses@reply.relanzio.com',REPLY_IMAP_PASSWORD:'test-placeholder',FOLLOWUP_AUTOMATION_ENABLED:'false'
  };
  const run=spawnSync(process.execPath,[script],{env,encoding:'utf8',timeout:60000});
  const out=`${run.stdout}\n${run.stderr}`;
  assert.equal(run.status,0,out.slice(-4000));
  assert.match(run.stdout,/REPLY_MAILBOX_E2E=\{"ok":true/,out.slice(-2000));
  assert.ok((run.stdout.match(/^PASS /gm)||[]).length>=14,run.stdout);
});
