#!/usr/bin/env bash
# Builds the production image (repository Dockerfile) and verifies EMERGENCY MODE (SCHEDULER_ENABLED=false) in an
# internal Docker network WITHOUT Internet access: only a fake database recorder and a probe can be reached.
# Fictional values only. Usage: scripts/rescue/verify-image.sh [image-tag]
set -euo pipefail
IMAGE="${1:-relanzio-rescue:verify}"
NET="rz-rescue-net-$$"
cleanup(){ docker rm -f rz-app rz-fake >/dev/null 2>&1 || true; docker network rm "$NET" >/dev/null 2>&1 || true; }
trap cleanup EXIT
docker build -t "$IMAGE" .
docker network create --internal "$NET" >/dev/null
docker run -d --name rz-fake --network "$NET" -v "$PWD/scripts/rescue/fake-supabase.mjs:/fake.mjs:ro" node:22-alpine node /fake.mjs >/dev/null
docker run -d --name rz-app --network "$NET" \
  -e SCHEDULER_ENABLED=false -e SCHEDULER_START_DELAY_SECONDS=0 \
  -e SUPABASE_URL=http://rz-fake:8080 -e SUPABASE_ANON_KEY=fictional -e SUPABASE_SERVICE_ROLE_KEY=fictional \
  -e STRIPE_SECRET_KEY=sk_live_fictional -e STRIPE_EXPECTED_MODE=live -e STRIPE_EXPECTED_ACCOUNT_ID=acct_fictional \
  -e STRIPE_PRO_PRICE_ID=price_fictional -e STRIPE_WEBHOOK_SECRET=whsec_fictional -e CRON_SECRET=cron-fictional \
  "$IMAGE" >/dev/null
docker run --rm --network "$NET" -v "$PWD/scripts/rescue/probe.mjs:/probe.mjs:ro" node:22-alpine node /probe.mjs
logs=$(docker logs rz-app 2>&1)
echo "$logs" | tail -n 20
if echo "$logs" | grep -Eq 'sk_live_fictional|whsec_fictional|cron-fictional'; then echo "RESCUE_VERIFY_FAILED secret printed in logs"; exit 1; fi
if echo "$logs" | grep -Eq 'JOB_LEASE|JOB_SKIPPED'; then echo "RESCUE_VERIFY_FAILED a job was attempted"; exit 1; fi
echo "RESCUE_VERIFY_OK image=$IMAGE digest=$(docker image inspect --format '{{.Id}}' "$IMAGE")"
