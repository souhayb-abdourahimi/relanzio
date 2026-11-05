import test from 'node:test';
import assert from 'node:assert/strict';
import { createCipheriv, randomBytes } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { buildArchive, checkArchive, containerFormat, decryptContainer, encryptArchive, parseKey, sha256 } from '../ops/backup/lib/crypto.mjs';

const KEY = Buffer.alloc(32, 7);
const OTHER = Buffer.alloc(32, 9);
const archive = () => buildArchive({ 'schema.sql': 'create table t(id int);', 'app-data.sql': 'insert into t values (1);' }, { created_at_utc: '2026-11-05T02:15:00.000Z' });

test('RZBK2 round trip: encrypt, decrypt, every file hash checked', () => {
  const blob = encryptArchive(archive(), KEY);
  assert.equal(blob.subarray(0, 5).toString(), 'RZBK2');
  assert.equal(containerFormat(blob), 2);
  const { version, payload } = decryptContainer(blob, KEY);
  assert.equal(version, 2);
  assert.ok(checkArchive(payload));
  assert.equal(payload.files['schema.sql'].content, 'create table t(id int);');
  assert.equal(payload.files['schema.sql'].sha256, sha256(Buffer.from('create table t(id int);')));
});

test('decryption is impossible with another key, and any altered byte is detected', () => {
  const blob = encryptArchive(archive(), KEY);
  assert.throws(() => decryptContainer(blob, OTHER), /BACKUP_DECRYPT_FAILED/);
  for (const pos of [6, 20, blob.length - 1, Math.floor(blob.length / 2)]) {
    const bad = Buffer.from(blob); bad[pos] ^= 0x01;
    assert.throws(() => decryptContainer(bad, KEY), /BACKUP_DECRYPT_FAILED/, `byte ${pos}`);
  }
  const relabeled = Buffer.from(blob); relabeled.write('RZBK1', 0); // header is authenticated (AAD)
  assert.throws(() => decryptContainer(relabeled, KEY), /BACKUP_DECRYPT_FAILED/);
  assert.throws(() => decryptContainer(Buffer.from('XXXXX' + 'a'.repeat(60)), KEY), /BACKUP_BAD_MAGIC/);
  assert.throws(() => decryptContainer(blob.subarray(0, 20), KEY), /BACKUP_TRUNCATED/);
});

test('an archive whose file content no longer matches its hash is rejected', () => {
  const a = archive();
  a.files['app-data.sql'].content = 'insert into t values (2);';
  assert.throws(() => checkArchive(a), /ARCHIVE_FILE_HASH_MISMATCH:app-data.sql/);
  assert.throws(() => checkArchive({ format: 'other' }), /ARCHIVE_UNKNOWN_FORMAT/);
});

test('legacy RZBK1 containers (current Railway job) can still be read', () => {
  const payload = { format: 'relanzio-application-backup-v1', data: { profiles: [] } };
  const iv = randomBytes(12), c = createCipheriv('aes-256-gcm', KEY, iv);
  const body = Buffer.concat([c.update(gzipSync(Buffer.from(JSON.stringify(payload)))), c.final()]);
  const blob = Buffer.concat([Buffer.from('RZBK1'), iv, c.getAuthTag(), body]);
  const r = decryptContainer(blob, KEY);
  assert.equal(r.version, 1);
  assert.deepEqual(r.payload, payload);
});

test('the key must be 32 bytes of base64', () => {
  assert.equal(parseKey(KEY.toString('base64')).length, 32);
  assert.throws(() => parseKey(''), /BACKUP_KEY_MISSING/);
  assert.throws(() => parseKey(Buffer.alloc(16).toString('base64')), /BACKUP_KEY_INVALID_LENGTH/);
});
