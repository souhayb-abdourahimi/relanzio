import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';

const read = p => readFile(new URL(`../${p}`, import.meta.url), 'utf8');

test('the archived legacy job is the exact decoded Railway source (header excluded)', async () => {
  const text = await read('ops/backup/legacy/railway-function-v1.js');
  const body = text.split('\n').slice(10).join('\n');
  const expected = text.match(/SHA-256 du source décodé \(sans cet en-tête\) : ([0-9a-f]{64})/)[1];
  assert.equal(createHash('sha256').update(body).digest('hex'), expected);
});

test('nothing in the repository runs the legacy job', async () => {
  const files = ['package.json', 'Dockerfile', 'ops/backup/Dockerfile', 'ops/backup/railway.json', 'ops/backup/package.json', '.github/workflows/ci.yml'];
  for (const f of files) {
    let t = ''; try { t = await read(f); } catch { continue; }
    assert.ok(!t.includes('railway-function-v1'), `${f} references the legacy job`);
  }
});

test('backup and restore code never drops, truncates or replaces a schema, and ignores RUN_RESTORE', async () => {
  const files = ['ops/backup/backup.mjs', 'ops/backup/restore.mjs', 'ops/backup/verify.mjs', ...(await readdir(new URL('../ops/backup/lib/', import.meta.url))).map(f => `ops/backup/lib/${f}`)];
  for (const f of files) {
    const code = (await read(f)).replace(/^\s*\/\/.*$/gm, '');
    assert.ok(!/\bdrop\s+(schema|table|database)\b/i.test(code), `${f}: DROP`);
    assert.ok(!/\btruncate\b/i.test(code), `${f}: TRUNCATE`);
    assert.ok(!/\bdelete\s+from\b/i.test(code), `${f}: DELETE`);
    assert.ok(!/E\.RUN_RESTORE|env\.RUN_RESTORE\s*===/.test(code), `${f}: RUN_RESTORE used as a switch`);
  }
  for (const f of ['ops/backup/sql/ephemeral-bootstrap.sql', 'ops/backup/sql/auth-structure-reference.sql']) {
    assert.ok(!/\b(drop|truncate)\b/i.test((await read(f)).replace(/^--.*$/gm, '')), f);
  }
});
