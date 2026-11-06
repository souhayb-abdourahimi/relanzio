// Grant reconciliation after a restore into a real Supabase project.
//
// pg_dump writes GRANT statements relative to PostgreSQL's built-in defaults, never the REVOKEs needed to
// undo a project's DEFAULT PRIVILEGES. A Supabase project grants ALL on every new table, sequence and
// function of schema public to anon, authenticated and service_role. So after schema.sql, every restored
// object also carries those grants, even where production had revoked them (found on the first real
// restore, 6 Nov 2026: anon could have executed SECURITY DEFINER functions of the restored copy).
//
// The backup holds the exact source grants (catalog fingerprint). This module turns the grants present in the
// restored database but absent from the source into REVOKE statements, only for anon / authenticated /
// service_role / PUBLIC, only outside the auth schema (owned by Supabase). It only ever REMOVES privileges:
// a grant missing after restore is not added back here, it stays a reported difference (pg_dump always
// writes the source grants, so a missing one means something went wrong and must be seen, not patched).

const ident = s => `"${String(s).replace(/"/g, '""')}"`;
const GRANTEES = new Set(['anon', 'authenticated', 'service_role', 'PUBLIC']);
const PRIVILEGE = /^[A-Z]{3,12}$/; // a privilege name as aclexplode() reports it (SELECT, EXECUTE, MAINTAIN...)

// "public.quotes:anon:SELECT" or "public.f(p_a text, p_b uuid):authenticated:EXECUTE"
export function parseGrant(g) {
  const p2 = g.lastIndexOf(':'), p1 = g.lastIndexOf(':', p2 - 1);
  if (p1 <= 0 || p2 <= p1) throw new Error(`GRANT_UNPARSABLE:${g}`);
  return { object: g.slice(0, p1), grantee: g.slice(p1 + 1, p2), privilege: g.slice(p2 + 1) };
}

function target(object, catalog) {
  const paren = object.indexOf('(');
  const name = paren === -1 ? object : object.slice(0, paren);
  const dot = name.indexOf('.');
  const schema = name.slice(0, dot), rel = name.slice(dot + 1);
  if (dot <= 0 || !rel) throw new Error(`GRANT_UNPARSABLE_OBJECT:${object}`);
  const q = `${ident(schema)}.${ident(rel)}`;
  if (paren !== -1) {
    if (!(object in (catalog.functions || {}))) return null;
    return { schema, sql: `FUNCTION ${q}${object.slice(paren)}` };
  }
  if ((catalog.sequences || []).includes(object)) return { schema, sql: `SEQUENCE ${q}` };
  if ((catalog.tables || []).includes(object) || object in (catalog.views || {}) || object in (catalog.columns || {})) return { schema, sql: `TABLE ${q}` };
  return null;
}

// Returns { sql, revoke: n, skipped: [...] }. Empty sql when nothing extra was granted.
export function grantReconcileSql(sourceCatalog, restoredCatalog) {
  const src = new Set(sourceCatalog.grants || []);
  const lines = [], skipped = [];
  for (const g of [...(restoredCatalog.grants || [])].sort()) {
    if (src.has(g)) continue;
    const { object, grantee, privilege } = parseGrant(g);
    const t = target(object, restoredCatalog);
    if (!t || t.schema === 'auth' || !GRANTEES.has(grantee) || !PRIVILEGE.test(privilege)) { skipped.push(g); continue; }
    lines.push(`REVOKE ${privilege} ON ${t.sql} FROM ${grantee === 'PUBLIC' ? 'PUBLIC' : ident(grantee)};`);
  }
  return { sql: lines.join('\n'), revoke: lines.length, skipped };
}
