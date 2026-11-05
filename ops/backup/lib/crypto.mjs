// Backup container encryption. Pure Node, no dependency.
//
// RZBK2 (current):  "RZBK2" | iv (12) | tag (16) | AES-256-GCM(gzip(JSON archive)), AAD = "RZBK2"
// RZBK1 (legacy, read-only): "RZBK1" | iv (12) | tag (16) | AES-256-GCM(gzip(JSON)), no AAD
//
// The key is 32 random bytes, base64 encoded, held only in the Railway variable BACKUP_ENCRYPTION_KEY_B64.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';

export const MAGIC_V2 = 'RZBK2';
export const MAGIC_V1 = 'RZBK1';
const HEADER = 5 + 12 + 16;

export const sha256 = buf => createHash('sha256').update(buf).digest('hex');

export function parseKey(b64) {
  if (typeof b64 !== 'string' || !b64.trim()) throw new Error('BACKUP_KEY_MISSING');
  const key = Buffer.from(b64.trim(), 'base64');
  if (key.length !== 32) throw new Error('BACKUP_KEY_INVALID_LENGTH');
  return key;
}

export function encryptArchive(archive, key) {
  const plain = gzipSync(Buffer.from(JSON.stringify(archive)), { level: 9 });
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key, iv);
  c.setAAD(Buffer.from(MAGIC_V2));
  const body = Buffer.concat([c.update(plain), c.final()]);
  return Buffer.concat([Buffer.from(MAGIC_V2), iv, c.getAuthTag(), body]);
}

export function containerFormat(blob) {
  const b = Buffer.from(blob);
  if (b.length <= HEADER) throw new Error('BACKUP_TRUNCATED');
  const magic = b.subarray(0, 5).toString('latin1');
  if (magic === MAGIC_V2) return 2;
  if (magic === MAGIC_V1) return 1;
  throw new Error('BACKUP_BAD_MAGIC');
}

// Returns the parsed JSON payload. Throws BACKUP_DECRYPT_FAILED on a wrong key or any altered byte.
export function decryptContainer(blob, key) {
  const b = Buffer.from(blob);
  const version = containerFormat(b);
  const d = createDecipheriv('aes-256-gcm', key, b.subarray(5, 17));
  if (version === 2) d.setAAD(Buffer.from(MAGIC_V2));
  d.setAuthTag(b.subarray(17, 33));
  let plain;
  try { plain = Buffer.concat([d.update(b.subarray(HEADER)), d.final()]); }
  catch { throw new Error('BACKUP_DECRYPT_FAILED'); }
  let json;
  try { json = JSON.parse(gunzipSync(plain).toString('utf8')); }
  catch { throw new Error('BACKUP_PAYLOAD_CORRUPT'); }
  return { version, payload: json };
}

// Archive = named SQL files, each with its own SHA-256, so a restore can prove every file is intact.
export function buildArchive(files, meta) {
  const out = {};
  for (const [name, content] of Object.entries(files)) {
    if (typeof content !== 'string') throw new Error(`ARCHIVE_FILE_NOT_TEXT:${name}`);
    out[name] = { sha256: sha256(Buffer.from(content, 'utf8')), bytes: Buffer.byteLength(content), content };
  }
  return { format: 'relanzio-backup-archive', format_version: 2, meta, files: out };
}

export function checkArchive(archive) {
  if (archive?.format !== 'relanzio-backup-archive' || archive.format_version !== 2) throw new Error('ARCHIVE_UNKNOWN_FORMAT');
  for (const [name, f] of Object.entries(archive.files || {})) {
    if (sha256(Buffer.from(f.content, 'utf8')) !== f.sha256) throw new Error(`ARCHIVE_FILE_HASH_MISMATCH:${name}`);
  }
  return true;
}
