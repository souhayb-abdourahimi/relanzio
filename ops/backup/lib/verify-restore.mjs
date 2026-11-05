// Self-verifying restore: the DOWNLOADED and DECRYPTED backup is restored into an ephemeral PostgreSQL cluster
// (unix socket only, temp directory, destroyed afterwards), then fingerprinted and compared, object by object,
// with the fingerprint taken from the source inside the backup snapshot.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { compareFingerprints, isAuthDiff } from './fingerprint.mjs';
import { fingerprint } from './dump.mjs';
import { DETERMINISTIC_SETTINGS, PsqlSession, psqlFile, startEphemeralCluster } from './pg.mjs';

export const BOOTSTRAP_SQL = fileURLToPath(new URL('../sql/ephemeral-bootstrap.sql', import.meta.url));
export const RESTORE_ORDER = ['auth-schema.sql', 'schema.sql', 'auth-data.sql', 'app-data.sql'];

// RLS works after restore: as each sampled user, the quotes visible through the policies are exactly theirs.
async function rlsProbe(session) {
  const ok = (await session.query(`select to_regclass('public.quotes') is not null and to_regclass('public.profiles') is not null
    and has_table_privilege('authenticated', 'public.quotes', 'select') and has_table_privilege('anon', 'public.quotes', 'select')`)).trim();
  if (ok !== 't') return { checked: 0, problems: [], skipped: 'public.quotes not readable by authenticated/anon (grants are compared separately)' };
  const ids = (await session.query(`select q.user_id from public.quotes q group by q.user_id order by count(*) desc, q.user_id limit 3`)).split('\n').filter(Boolean);
  const problems = [];
  for (const id of ids) {
    const own = Number((await session.query(`select count(*) from public.quotes where user_id='${id}'`)).trim());
    await session.query('begin');
    await session.query(`set local role authenticated`);
    await session.query(`select set_config('request.jwt.claims', json_build_object('sub','${id}','role','authenticated')::text, true)`);
    const visible = Number((await session.query(`select count(*) from public.quotes`)).trim());
    await session.query('rollback');
    if (visible !== own) problems.push(`RLS probe: a user sees ${visible} quote(s) instead of ${own}`);
  }
  await session.query('begin; set local role anon');
  const anon = Number((await session.query(`select count(*) from public.quotes`)).trim());
  await session.query('rollback');
  if (anon !== 0) problems.push(`RLS probe: anonymous role sees ${anon} quote(s)`);
  return { checked: ids.length, problems };
}

export async function verifyByEphemeralRestore({ files, sourceFingerprint, pgBin, serverBin, log = () => {} }) {
  for (const f of RESTORE_ORDER) if (typeof files[f] !== 'string') throw new Error(`ARCHIVE_MISSING_FILE:${f}`);
  const cluster = await startEphemeralCluster({ pgBin, serverBin });
  const started = Date.now();
  try {
    await psqlFile({ conn: cluster.conn, pgBin, sql: await readFile(BOOTSTRAP_SQL, 'utf8') });
    for (const f of RESTORE_ORDER) {
      try { await psqlFile({ conn: cluster.conn, pgBin, sql: files[f] }); }
      catch (e) { throw new Error(`RESTORE_STEP_FAILED:${f}: ${e.message}`); }
      log(`restored ${f}`);
    }
    const session = new PsqlSession({ conn: cluster.conn, pgBin, label: 'restored' });
    let restored, rls, version;
    try {
      await session.query(DETERMINISTIC_SETTINGS);
      version = (await session.query('show server_version')).trim();
      restored = await fingerprint(session);
      rls = await rlsProbe(session);
    } finally { await session.close().catch(() => {}); }
    const cmp = compareFingerprints(sourceFingerprint, restored);
    const appDiffs = cmp.diffs.filter(d => !isAuthDiff(d));
    const authDiffs = cmp.diffs.filter(isAuthDiff);
    const authTables = Object.keys(sourceFingerprint.content.tables).filter(t => t.startsWith('auth.'));
    const authProblems = authDiffs.map(d => `${d.object}: ${d.problem}`);
    if (!authTables.includes('auth.users') || !authTables.includes('auth.identities')) authProblems.push('auth.users / auth.identities not in the backup');
    if (!sourceFingerprint.authLink) authProblems.push('profile <-> auth user link not checked');
    const appProblems = [...appDiffs.map(d => `${d.object}: ${d.problem}`), ...rls.problems];
    const rows = Object.fromEntries(Object.entries(restored.content.tables).map(([t, v]) => [t, v.rows]));
    return {
      restore: {
        verified: appProblems.length === 0,
        environment: 'ephemeral PostgreSQL cluster inside the job container (unix socket, no network listener), deleted after the check',
        server_version: version,
        restored_rows: rows,
        checks: ['row counts', 'row content fingerprints (SHA-256 of sorted row hashes)', 'columns', 'constraints (PK, FK, unique, check)', 'indexes', 'functions', 'triggers', 'RLS flags and policies', 'grants to anon/authenticated/service_role', 'views', 'enums', 'sequence values', 'orphan rows for every foreign key', 'RLS probe as authenticated and anon'],
        rls_probe_users: rls.checked,
        problems: appProblems,
        duration_ms: Date.now() - started
      },
      auth: {
        verified: authProblems.length === 0,
        users: restored.content.tables['auth.users']?.rows ?? 0,
        identities: restored.content.tables['auth.identities']?.rows ?? 0,
        link: restored.authLink,
        problems: authProblems
      }
    };
  } finally {
    await cluster.stop();
  }
}

