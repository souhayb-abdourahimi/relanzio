#!/usr/bin/env sh
set -eu
: "${SUPABASE_DB_URL:?SUPABASE_DB_URL is required}"
command -v supabase >/dev/null 2>&1 || { echo "Supabase CLI is required" >&2; exit 1; }
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
out="backups/$stamp"; mkdir -p "$out"; chmod 700 backups "$out"
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$out/roles.sql" --role-only
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$out/schema.sql"
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$out/data.sql" --data-only --use-copy
chmod 600 "$out"/*.sql
echo "Backup written to $out. Store it encrypted and off-site; never commit it."
