# Relanzio backup job — Railway cron service (build context: repository root).
#   docker build -f ops/backup/Dockerfile .
# PostgreSQL 17 client AND server binaries come from the official postgres image (same major as Supabase),
# Node.js from the official node image of the same Debian release. No secret is baked in: every value comes
# from Railway variables at run time (see ops/backup/README.md).
FROM node:22.22.0-bookworm-slim AS deps
WORKDIR /app/ops/backup
COPY ops/backup/package.json ops/backup/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

FROM postgres:17.6-bookworm
COPY --from=deps /usr/local/bin/node /usr/local/bin/node
WORKDIR /app
COPY ops/backup ops/backup
COPY --from=deps /app/ops/backup/node_modules ops/backup/node_modules
COPY supabase/migrations supabase/migrations
COPY supabase/schema.sql supabase/schema.sql
ENV BACKUP_PG_BIN=/usr/lib/postgresql/17/bin NODE_ENV=production
# initdb refuses root; the ephemeral verification cluster runs as the image's postgres user.
USER postgres
RUN node --version && /usr/lib/postgresql/17/bin/pg_dump --version && node --check ops/backup/backup.mjs
ENTRYPOINT []
CMD ["node", "ops/backup/backup.mjs"]
