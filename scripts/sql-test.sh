#!/usr/bin/env bash
# Applies schema + every migration (and optional SQL test files) to a throwaway local Postgres.
# Usage: PGURL=postgres://postgres@localhost:54329/postgres scripts/sql-test.sh [test/sql/*.test.sql]
# Never point PGURL at a real Supabase project.
set -euo pipefail
export PGOPTIONS='-c client_min_messages=warning'
: "${PGURL:?set PGURL to a disposable local Postgres}"
case "$PGURL" in *supabase.co*|*supabase.com*) echo "Refusing to run against Supabase" >&2; exit 2;; esac
DB="relanzio_sqltest_$$"
psql "$PGURL" -v ON_ERROR_STOP=1 -q -c "create database $DB" >/dev/null
trap 'psql "$PGURL" -q -c "drop database if exists $DB" >/dev/null' EXIT
URL="${PGURL%/*}/$DB"
run(){ psql "$URL" -v ON_ERROR_STOP=1 -q -X -f "$1" >/dev/null; }
run test/sql/supabase-stubs.sql
run supabase/schema.sql
for f in $(ls supabase/migrations/*.sql | grep -v '\.down\.sql$' | sort); do run "$f"; done
echo "schema + migrations: OK"
# Reversibility: every rollback must apply cleanly, then its migration must re-apply.
for r in $(ls supabase/rollbacks/*.down.sql 2>/dev/null | sort -r); do
  m="supabase/migrations/$(basename "$r" .down.sql).sql"
  run "$r"; run "$m"; echo "rollback + reapply OK: $(basename "$m")"
done
for t in "$@"; do psql "$URL" -v ON_ERROR_STOP=1 -q -X -f "$t"; echo "$t: OK"; done
