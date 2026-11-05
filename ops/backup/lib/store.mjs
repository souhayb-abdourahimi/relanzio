// Object storage. Production: the Railway bucket "relanzio-backups" (S3-compatible), same variables as the
// legacy job. Tests: a local directory. Interface: put / get / list / del. Nothing here ever deletes outside
// the prefix it is given, and the backup job only deletes through retention.mjs.
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const S3_VARS = ['S3_ENDPOINT', 'S3_BUCKET', 'S3_REGION', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY'];

export async function s3Store(env) {
  const missing = S3_VARS.filter(k => !env[k]);
  if (missing.length) throw new Error(`MISSING_ENV:${missing.join(',')}`);
  const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = await import('@aws-sdk/client-s3');
  const client = new S3Client({
    endpoint: env.S3_ENDPOINT, region: env.S3_REGION, forcePathStyle: (env.S3_URL_STYLE || 'path') === 'path',
    credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY }
  });
  const Bucket = env.S3_BUCKET;
  return {
    secrets: [env.S3_SECRET_ACCESS_KEY, env.S3_ACCESS_KEY_ID],
    async put(key, body, contentType) { await client.send(new PutObjectCommand({ Bucket, Key: key, Body: body, ContentType: contentType })); },
    async get(key) {
      const r = await client.send(new GetObjectCommand({ Bucket, Key: key }));
      return Buffer.from(await r.Body.transformToByteArray());
    },
    async list(prefix) {
      const out = []; let token;
      do {
        const r = await client.send(new ListObjectsV2Command({ Bucket, Prefix: prefix, ContinuationToken: token }));
        for (const o of r.Contents || []) out.push({ key: o.Key, size: o.Size, lastModified: o.LastModified });
        token = r.IsTruncated ? r.NextContinuationToken : undefined;
      } while (token);
      return out;
    },
    async del(key) { await client.send(new DeleteObjectCommand({ Bucket, Key: key })); }
  };
}

export function dirStore(root) {
  const file = key => { const p = path.resolve(root, key); if (!p.startsWith(path.resolve(root) + path.sep)) throw new Error('BAD_KEY'); return p; };
  return {
    secrets: [],
    async put(key, body) { await mkdir(path.dirname(file(key)), { recursive: true }); await writeFile(file(key), body); },
    async get(key) { return readFile(file(key)); },
    async list(prefix) {
      const out = [];
      const walk = async dir => {
        let entries = [];
        try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
        for (const e of entries) {
          const p = path.join(dir, e.name);
          if (e.isDirectory()) await walk(p);
          else {
            const key = path.relative(root, p).split(path.sep).join('/');
            if (key.startsWith(prefix)) { const s = await stat(p); out.push({ key, size: s.size, lastModified: s.mtime }); }
          }
        }
      };
      await walk(root);
      return out.sort((a, b) => a.key.localeCompare(b.key));
    },
    async del(key) { await rm(file(key), { force: true }); }
  };
}
