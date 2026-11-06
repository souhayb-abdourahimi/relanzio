// Consistent, read-only capture of the source database.
// One psql session opens a REPEATABLE READ READ ONLY transaction and exports its snapshot; every pg_dump and
// every fingerprint query runs on that same snapshot, so dumps and fingerprints describe exactly the same data.
import { APP_SCHEMAS, AUTH_INCLUDED, INVENTORY_SQL, MIGRATION_HISTORY_TABLE, authCountSql } from './coverage.mjs';
import { AUTH_LINK_SQL, catalogSql, contentSql, indexContent, orphanSql } from './fingerprint.mjs';
import { DETERMINISTIC_SETTINGS, PsqlSession, pgDump } from './pg.mjs';

export const DUMP_SCHEMAS = [...APP_SCHEMAS, MIGRATION_HISTORY_TABLE.split('.')[0]];
export const fingerprintScope = () => ({ schemas: DUMP_SCHEMAS, extraTables: [...AUTH_INCLUDED] });

// Same transformations as the Supabase CLI dump scripts (supabase/cli db dump), reduced to what applies here.
export function sanitizeSchemaDump(sql) {
  return sql
    .replace(/^\\(un)?restrict .*$/gm, '-- $&')
    .replace(/^CREATE SCHEMA "/gm, 'CREATE SCHEMA IF NOT EXISTS "')
    .replace(/^ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin"/gm, '-- $&')
    .replace(/^COMMENT ON EXTENSION (.+)/gm, '-- $&')
    .replace(/^SET transaction_timeout = 0;/gm, '-- $&');
}
export const sanitizeDataDump = sql => `SET session_replication_role = replica;\n\n${sql.replace(/^\\(un)?restrict .*$/gm, '-- $&')}\nRESET ALL;\n`;

// Fingerprint of whatever the session currently sees (source snapshot or restored copy).
export async function fingerprint(session, { withAuthLink = true } = {}) {
  const catalog = await session.json(catalogSql(fingerprintScope()));
  const content = indexContent(await session.json(contentSql(catalog.tables, catalog.sequences)));
  const orphans = await session.json(orphanSql(catalog.foreign_keys));
  const hasLink = withAuthLink && catalog.tables.includes('public.profiles') && catalog.tables.includes('auth.users') && catalog.tables.includes('auth.identities');
  const authLink = hasLink ? await session.json(AUTH_LINK_SQL) : null;
  return { catalog, content, orphans, authLink };
}

export async function captureSource({ conn, pgBin }) {
  const session = new PsqlSession({ conn, pgBin, label: 'source' });
  try {
    await session.query(DETERMINISTIC_SETTINGS);
    await session.query('begin isolation level repeatable read read only');
    const snapshot = (await session.query('select pg_export_snapshot()')).trim();
    if (!/^[0-9A-F-]+$/i.test(snapshot)) throw new Error('SNAPSHOT_EXPORT_FAILED');
    const inventory = await session.json(INVENTORY_SQL);
    const authCounts = await session.json(authCountSql(Object.keys(inventory.auth_tables || {})));
    const fp = await fingerprint(session);
    const common = ['--quote-all-identifiers', `--snapshot=${snapshot}`, '--no-sync'];
    const schemaArgs = DUMP_SCHEMAS.flatMap(s => ['--schema', s]);
    const authArgs = AUTH_INCLUDED.flatMap(t => ['--table', t]);
    const [schema, authSchema, authData, appData] = await Promise.all([
      pgDump({ conn, pgBin, args: ['--schema-only', '--no-owner', ...common, ...schemaArgs] }),
      pgDump({ conn, pgBin, args: ['--schema-only', '--no-owner', ...common, ...authArgs] }),
      pgDump({ conn, pgBin, args: ['--data-only', ...common, ...authArgs] }),
      pgDump({ conn, pgBin, args: ['--data-only', ...common, ...schemaArgs] })
    ]);
    await session.query('commit');
    return {
      inventory, authCounts, fingerprint: fp,
      files: {
        'schema.sql': sanitizeSchemaDump(schema),
        'auth-schema.sql': sanitizeSchemaDump(authSchema),
        'auth-data.sql': sanitizeDataDump(authData),
        'app-data.sql': sanitizeDataDump(appData)
      }
    };
  } finally {
    await session.close().catch(() => {});
  }
}
