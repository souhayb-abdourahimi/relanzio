# Relanzio v0.4 — External gates evidence — 2026-10-02

## Verdict

**NON PRÊT POUR PREMIERS PILOTES** — external gates are not all green.

## Build / staging

- Node: v22.16.0 — PASS (requirement >=22.12).
- npm: 10.9.2 — PASS.
- `npm run check`: PASS, 25/25 tests.
- clean `npm install --no-audit --no-fund`: FAIL/TIMEOUT after 5 minutes in the execution runtime.
- offline lock-only attempt: FAIL `ENOTCACHED` for `@supabase/supabase-js`.
- `package-lock.json`: NOT GENERATED.
- `npm run build`: NOT PROVABLE because Vite dependencies cannot be installed in this runtime.
- Railway connection: connected, but zero Railway projects and no accessible Relanzio GitHub repository/source to deploy.
- `/api/health`, `/api/readiness`, smoke on hosted staging: BLOCKED until deployment exists.

## Supabase staging

Created dedicated project `relanzio-staging` (project ref `uwgvnhnpvxoebabayqac`) in `eu-west-3` after Supabase reported project cost = 0/month.

Applied migration `relanzio_v04_staging_schema` successfully.

Evidence after migration:
- 11 Relanzio public tables exist.
- RLS enabled on all 11 tables.
- Security Advisor: no WARN/ERROR returned; INFO only for 7 service-role-only tables intentionally having no browser policies.
- Existing unrelated project `project-you` was not modified.

Still blocked:
- Real Auth signup/login/password-reset for A/B cannot be invoked through the available Supabase connector, and the execution runtime cannot resolve the Supabase project hostname.
- Therefore real JWT A/B isolation and account-deletion cascade have NOT been certified yet.

## Stripe test

Account: `environnement de test relanzio`, `livemode=false`.

Created real sandbox objects:
- Product: `prod_VMcMY01iToEDFo` — Relanzio Pro QA staging.
- Monthly price: `price_1ULt7pKD0KZTvh9gpK1p4QqA` — EUR 29.00/month.
- Test Clock: `clock_1ULt9dKD0KZTvh9gVRcW08LO`, status `ready`.
- QA customer: `cus_VMcOFgrPDmtOzt`, attached to the Test Clock.
- Checkout Session: `cs_test_a1S0b17PlyDfJgDk5jkdaREbWw4QEtxLClWc06eWcTPSRLqUriPhmDaxVr`, mode `subscription`, total EUR 29.00, status `open`, payment_status `unpaid`.

Not certified:
- Checkout completion.
- webhook -> Relanzio DB transition.
- renewal -> DB.
- failed payment / past_due -> DB and automation block.
- recovery -> DB.
- portal cancellation -> DB/free.
- webhook replay/idempotency against deployed endpoint.

Reason: these require the deployed Relanzio webhook and a completed browser Checkout. Neither exists yet.

## Brevo / domain

NOT TESTED. No Brevo account/domain management connection or credentials are available to this QA runtime. No commercial email was sent.

Required proof remains SPF, DKIM, DMARC, external inbox receipt, From, Reply-To, delivered, bounce, unsubscribe and provider-failure-not-sent behavior.

## Browser / mobile

NOT TESTED on physical/remote iPhone Safari, Android Chrome, desktop Chrome/Firefox/Safari. There is no deployed staging URL yet and no real-device browser-testing connection available.

## Backup / restore

NOT CERTIFIED. A real backup followed by restore into a disposable environment and verification of users/quotes/followups/relationships has not been executed.

## Final gate table

| Gate | Result | Evidence |
|---|---|---|
| Build | ❌ | Node/npm OK; 25/25 check PASS; clean npm install times out; no lockfile; Vite build not executed |
| Staging | ❌ | Railway connected but no project/source repo; no hosted URL/health/readiness/smoke |
| Supabase | ❌ | Dedicated staging + migration + 11/11 RLS + advisor obtained; real A/B Auth/JWT/cascade still blocked |
| Stripe | ❌ | Real sandbox product/price/test clock/customer/open Checkout created; end-to-end webhook/DB lifecycle still blocked by missing deployed app/browser completion |
| Brevo | ❌ | No authenticated Brevo/domain environment available; no email sent |
| Mobile | ❌ | No deployed staging URL and no real-device test environment |
| Backup | ❌ | No real backup/restore verification performed |

## Precise release blockers

1. **P0 — Build reproducibility:** no clean install, lockfile, or Vite build proof.
2. **P0 — Deployability:** no accessible Relanzio source repository connected to Railway, hence no staging server.
3. **P0 — Auth/data isolation:** A/B signup/login/reset/JWT isolation/cascade not yet exercised end-to-end.
4. **P0 — Billing consistency:** Stripe lifecycle has not traversed deployed webhook -> Supabase after each event.
5. **P0 — Email deliverability:** domain authentication and real transactional delivery events not certified.
6. **P0 — Client compatibility:** required browsers/devices not exercised.
7. **P0 — Disaster recovery:** backup restore not executed.

No acquisition was performed. No prospect was created. No commercial email was sent.
