// Deterministic fingerprints of a database: catalog (schema objects) and content (rows), computed with the
// same SQL on the source (inside the backup snapshot) and on the restored copy, then compared object by object.
// Fingerprints are hashes and counts only: no row value, email or secret ever leaves the database through them.

const lit = s => `'${String(s).replace(/'/g, "''")}'`;
const ident = s => `"${String(s).replace(/"/g, '""')}"`;
export const qualified = name => { const [s, ...r] = name.split('.'); return `${ident(s)}.${ident(r.join('.'))}`; };

// scope: { schemas: ['public', ...], extraTables: ['auth.users', ...] }
export function catalogSql({ schemas, extraTables }) {
  const sch = `array[${schemas.map(lit).join(',')}]::text[]`;
  const extra = `array[${extraTables.map(lit).join(',')}]::text[]`;
  return `
with t as (
  select c.oid, n.nspname s, c.relname r, c.relkind k, n.nspname||'.'||c.relname q, c.relowner
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where c.relkind in ('r','p','v','m','S','f')
    and ((n.nspname = any(${sch}) and not exists(select 1 from pg_depend d where d.objid=c.oid and d.deptype='e'))
         or n.nspname||'.'||c.relname = any(${extra}))
), f as (
  select p.oid, n.nspname||'.'||p.proname||'('||pg_get_function_identity_arguments(p.oid)||')' q, p.proacl, p.proowner, p.prokind
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname = any(${sch}) and not exists(select 1 from pg_depend d where d.objid=p.oid and d.deptype='e')
), g as (
  select t.q||':'||coalesce(nullif(a.grantee::regrole::text,'-'),'PUBLIC')||':'||a.privilege_type x
  from t cross join lateral aclexplode(coalesce((select relacl from pg_class where oid=t.oid), acldefault((case when t.k='S' then 's' else 'r' end)::"char", t.relowner))) a
  where a.grantee=0 or a.grantee::regrole::text in ('anon','authenticated','service_role')
  union all
  select f.q||':'||coalesce(nullif(a.grantee::regrole::text,'-'),'PUBLIC')||':'||a.privilege_type
  from f cross join lateral aclexplode(coalesce(f.proacl, acldefault('f'::"char", f.proowner))) a
  where a.grantee=0 or a.grantee::regrole::text in ('anon','authenticated','service_role')
)
select jsonb_build_object(
  'tables', coalesce((select jsonb_agg(q order by q) from t where k in ('r','p')), '[]'),
  'sequences', coalesce((select jsonb_agg(q order by q) from t where k='S'), '[]'),
  'columns', coalesce((select jsonb_object_agg(q, cols) from (
      select t.q, string_agg(a.attname||' '||format_type(a.atttypid,a.atttypmod)
        ||case when a.attnotnull then ' not null' else '' end
        ||coalesce(' default '||pg_get_expr(d.adbin,d.adrelid),'')
        ||case when a.attgenerated<>'' then ' generated' else '' end
        ||case when a.attidentity<>'' then ' identity '||a.attidentity::text else '' end, ', ' order by a.attnum) cols
      from t join pg_attribute a on a.attrelid=t.oid and a.attnum>0 and not a.attisdropped
      left join pg_attrdef d on d.adrelid=t.oid and d.adnum=a.attnum
      where t.k in ('r','p','v','m','f') group by t.q) x), '{}'),
  'constraints', coalesce((select jsonb_object_agg(t.q||':'||c.conname, pg_get_constraintdef(c.oid)) from pg_constraint c join t on t.oid=c.conrelid), '{}'),
  'foreign_keys', coalesce((select jsonb_agg(jsonb_build_object('name', t.q||':'||c.conname, 'child', t.q,
        'child_cols', (select jsonb_agg(a.attname order by k.ord) from unnest(c.conkey) with ordinality k(n,ord) join pg_attribute a on a.attrelid=c.conrelid and a.attnum=k.n),
        'parent', (select n.nspname||'.'||pc.relname from pg_class pc join pg_namespace n on n.oid=pc.relnamespace where pc.oid=c.confrelid),
        'parent_cols', (select jsonb_agg(a.attname order by k.ord) from unnest(c.confkey) with ordinality k(n,ord) join pg_attribute a on a.attrelid=c.confrelid and a.attnum=k.n))
        order by t.q, c.conname)
      from pg_constraint c join t on t.oid=c.conrelid where c.contype='f'), '[]'),
  'indexes', coalesce((select jsonb_object_agg(i.schemaname||'.'||i.indexname, i.indexdef) from pg_indexes i join t on t.s=i.schemaname and t.r=i.tablename), '{}'),
  'functions', coalesce((select jsonb_object_agg(f.q, md5(case when f.prokind='a' then f.q else pg_get_functiondef(f.oid) end)) from f), '{}'),
  'triggers', coalesce((select jsonb_object_agg(t.q||':'||tg.tgname, pg_get_triggerdef(tg.oid)) from pg_trigger tg join t on t.oid=tg.tgrelid where not tg.tgisinternal), '{}'),
  'policies', coalesce((select jsonb_object_agg(p.schemaname||'.'||p.tablename||':'||p.policyname,
        concat_ws(' | ', p.permissive, p.cmd, array_to_string(p.roles, ','), p.qual, p.with_check))
      from pg_policies p join t on t.s=p.schemaname and t.r=p.tablename), '{}'),
  'rls', coalesce((select jsonb_object_agg(t.q, case when c.relforcerowsecurity then 'forced' when c.relrowsecurity then 'enabled' else 'disabled' end)
      from t join pg_class c on c.oid=t.oid where t.k in ('r','p')), '{}'),
  'views', coalesce((select jsonb_object_agg(t.q, md5(pg_get_viewdef(t.oid))) from t where t.k in ('v','m')), '{}'),
  'enums', coalesce((select jsonb_object_agg(n.nspname||'.'||ty.typname, (select string_agg(e.enumlabel, ',' order by e.enumsortorder) from pg_enum e where e.enumtypid=ty.oid))
      from pg_type ty join pg_namespace n on n.oid=ty.typnamespace where ty.typtype='e' and n.nspname = any(${sch})), '{}'),
  'grants', coalesce((select jsonb_agg(x order by x) from g), '[]')
)::text`;
}

// Row content: per table, row count and SHA-256 over the sorted md5 of every row's text form.
// Sorting by the row hash makes it independent of physical order and of the presence of a primary key.
export function contentSql(tables, sequences = []) {
  const parts = tables.map(q => `select jsonb_build_object('t', ${lit(q)}, 'n', count(*), 'h', encode(sha256(convert_to(coalesce(string_agg(md5(x::text), '' order by md5(x::text)), ''), 'UTF8')), 'hex')) j from ${qualified(q)} x`);
  for (const s of sequences) parts.push(`select jsonb_build_object('s', ${lit(s)}, 'last', last_value::text, 'called', is_called) j from ${qualified(s)}`);
  if (!parts.length) return `select '[]'::jsonb::text`;
  return `select coalesce(jsonb_agg(j), '[]')::text from (${parts.join('\nunion all\n')}) z`;
}

// Orphans: rows whose (non-null) foreign key has no parent. MATCH SIMPLE semantics, like PostgreSQL.
export function orphanSql(fks) {
  if (!fks.length) return `select '{}'::jsonb::text`;
  const parts = fks.map(fk => {
    const notNull = fk.child_cols.map(c => `c.${ident(c)} is not null`).join(' and ');
    const join = fk.child_cols.map((c, i) => `p.${ident(fk.parent_cols[i])} = c.${ident(c)}`).join(' and ');
    return `select ${lit(fk.name)} k, count(*) n from ${qualified(fk.child)} c where ${notNull} and not exists (select 1 from ${qualified(fk.parent)} p where ${join})`;
  });
  return `select coalesce(jsonb_object_agg(k, n), '{}')::text from (${parts.join('\nunion all\n')}) z`;
}

// Accounts without a profile and profiles without an account (the application expects profiles.id = auth.users.id).
export const AUTH_LINK_SQL = `select jsonb_build_object(
  'auth_users_without_profile', (select count(*) from auth.users u where not exists (select 1 from public.profiles p where p.id=u.id)),
  'profiles_without_auth_user', (select count(*) from public.profiles p where not exists (select 1 from auth.users u where u.id=p.id)),
  'identities_without_user', (select count(*) from auth.identities i where not exists (select 1 from auth.users u where u.id=i.user_id)),
  'auth_user_ids_sha256', (select encode(sha256(convert_to(coalesce(string_agg(id::text, ',' order by id), ''), 'UTF8')), 'hex') from auth.users),
  'identity_keys_sha256', (select encode(sha256(convert_to(coalesce(string_agg(id::text||'/'||user_id::text||'/'||provider, ',' order by id), ''), 'UTF8')), 'hex') from auth.identities),
  'profile_ids_sha256', (select encode(sha256(convert_to(coalesce(string_agg(id::text, ',' order by id), ''), 'UTF8')), 'hex') from public.profiles)
)::text`;

export function indexContent(rows) {
  const tables = {}, sequences = {};
  for (const r of rows) {
    if (r.t) tables[r.t] = { rows: Number(r.n), sha256: r.h };
    else if (r.s) sequences[r.s] = { last_value: r.last, is_called: r.called };
  }
  return { tables, sequences };
}

const CATALOG_KINDS = { columns: 'column list', constraints: 'constraint', indexes: 'index', functions: 'function', triggers: 'trigger', policies: 'policy', rls: 'RLS setting', views: 'view', enums: 'enum' };

// Object-by-object comparison. Every difference is a named, human-readable reason.
export function compareFingerprints(source, restored) {
  const diffs = [];
  const sTables = new Set(source.catalog.tables), rTables = new Set(restored.catalog.tables);
  for (const t of sTables) if (!rTables.has(t)) diffs.push({ kind: 'table', object: t, problem: 'missing table' });
  for (const t of rTables) if (!sTables.has(t)) diffs.push({ kind: 'table', object: t, problem: 'unexpected table' });
  for (const [kind, label] of Object.entries(CATALOG_KINDS)) {
    const a = source.catalog[kind] || {}, b = restored.catalog[kind] || {};
    for (const k of Object.keys(a)) {
      if (!(k in b)) diffs.push({ kind, object: k, problem: `missing ${label}` });
      else if (a[k] !== b[k]) diffs.push({ kind, object: k, problem: `${label} differs` });
    }
    for (const k of Object.keys(b)) if (!(k in a)) diffs.push({ kind, object: k, problem: `unexpected ${label}` });
  }
  const sg = new Set(source.catalog.grants || []), rg = new Set(restored.catalog.grants || []);
  for (const g of sg) if (!rg.has(g)) diffs.push({ kind: 'grants', object: g, problem: 'missing grant' });
  for (const g of rg) if (!sg.has(g)) diffs.push({ kind: 'grants', object: g, problem: 'unexpected grant' });
  for (const [t, s] of Object.entries(source.content.tables)) {
    const r = restored.content.tables[t];
    if (!r) { diffs.push({ kind: 'rows', object: t, problem: 'table content not restored' }); continue; }
    if (r.rows < s.rows) diffs.push({ kind: 'rows', object: t, problem: `missing rows: ${s.rows} in backup source, ${r.rows} restored` });
    else if (r.rows > s.rows) diffs.push({ kind: 'rows', object: t, problem: `extra rows: ${s.rows} in backup source, ${r.rows} restored` });
    else if (r.sha256 !== s.sha256) diffs.push({ kind: 'content', object: t, problem: 'same row count but content fingerprint differs' });
  }
  for (const [q, s] of Object.entries(source.content.sequences || {})) {
    const r = (restored.content.sequences || {})[q];
    if (!r) diffs.push({ kind: 'sequences', object: q, problem: 'missing sequence' });
    else if (r.last_value !== s.last_value || r.is_called !== s.is_called) diffs.push({ kind: 'sequences', object: q, problem: `sequence value differs (${s.last_value} vs ${r.last_value})` });
  }
  for (const [k, n] of Object.entries(restored.orphans || {})) {
    if (Number(n) > 0) diffs.push({ kind: 'relations', object: k, problem: `${n} orphan row(s) after restore` });
  }
  if (source.authLink && restored.authLink) {
    for (const k of Object.keys(source.authLink)) {
      if (String(source.authLink[k]) !== String(restored.authLink[k])) diffs.push({ kind: 'auth', object: k, problem: `${k}: ${source.authLink[k]} in source, ${restored.authLink[k]} restored` });
    }
    if (Number(restored.authLink.profiles_without_auth_user) > 0) diffs.push({ kind: 'auth', object: 'profiles', problem: 'profiles without a matching auth user' });
  }
  return { ok: diffs.length === 0, diffs };
}

export const isAuthDiff = d => d.kind === 'auth' || /^auth\./.test(d.object);
