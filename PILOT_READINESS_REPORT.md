# Relanzio v0.4 — Pilot Readiness Report

Date: 2026-10-02
Scope: release engineering / QA only. No acquisition and no new product features.

## Verdict

**NON PRÊT POUR PILOTES**

The local deterministic suite is green, but the release cannot be promoted until the external execution gates are proven on a real staging environment.

## Evidence obtained in this QA pass

### Runtime / repository
- Node: **v22.16.0** — PASS (`>=22.12`).
- npm: **10.9.2** — observed.
- Clean `npm install --no-audit --no-fund`: **BLOCKED BY ENVIRONMENT** after 240 s.
- `npm ping` to `https://registry.npmjs.org/`: **BLOCKED BY ENVIRONMENT** after 15 s; DNS lookup returned no registry address.
- `package-lock.json`: **ABSENT** because dependency resolution could not complete.
- `npm run check`: **PASS — 25/25 tests**.
- `npm run build`: **BLOCKED**, `vite: not found` because dependencies are not installed.
- `npm run smoke`: **NOT RUN**, because there is no built/deployed server to test.
- ZIP/release source contains no `.env` with secrets.
- Secret-pattern scan: **0 tracked provider secrets found**.

### Corrections made during this pass
1. **P0 — Vite/preflight environment split fixed.** Vite now uses the root `.env` through `envDir`, so the values validated by preflight are the same values compiled into the frontend.
2. **P0 — frontend Supabase variables added to preflight.** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are now mandatory.
3. **P0 — root `.env.example` completed.** It documents browser-safe Supabase variables plus all legal/public variables used by the production UI.
4. **Security hardening — Data API least privilege.** `anon` and `authenticated` lose default table privileges; authenticated browser access is read-only on the four user-owned tables, with RLS ownership policies. Founder/system tables have no browser grants.
5. Regression test added to prevent Vite/preflight environment drift.

### Local security evidence
- Service-role, Stripe secret, Brevo key, OpenAI key and webhook secrets are referenced only server-side.
- `.env` files are ignored.
- Stripe webhook verifies Stripe's signature before processing.
- Brevo webhook requires a timing-safe custom secret header.
- Cron endpoint requires a timing-safe secret.
- Global in-memory rate limit is enabled; sufficient only for a single pilot instance.
- Acquisition, lifecycle email and follow-up automation switches default to `false`.
- Backup/preflight/smoke scripts pass syntax checks.

## External gates — still red

### P0 — Build + staging
**Impact:** no proof that JSX/Vite compiles or that the production server boots.

Required proof:
1. `npm install` completes.
2. `package-lock.json` is generated and committed.
3. CI/Docker switch back to `npm ci`.
4. `npm run check` passes from the clean install.
5. `npm run build` passes.
6. staging deployment succeeds.
7. `SMOKE_BASE_URL=<staging> npm run smoke` passes.

### P0 — Supabase real isolation
**Impact:** local source inspection cannot prove hosted Auth/RLS behavior.

Required proof on staging:
- create Account A and B;
- sign up/sign in/reset password for both;
- create A quote and B quote;
- A cannot read/update/delete B via Data API;
- A cannot read/update/delete B through Relanzio API routes;
- delete A account;
- verify A's profile, quotes, followups, product events, lifecycle messages and support tickets cascade away;
- run Supabase Security Advisor and record result.

### P0 — Stripe sandbox
**Impact:** billing state and webhook ordering are not proven.

Required proof:
- Free -> Checkout -> active Pro;
- DB profile after each webhook;
- successful renewal using a Stripe test clock/simulation;
- failed renewal -> `past_due` and automation access blocked;
- recovery payment -> active;
- Customer Portal opens;
- cancellation -> canceled/free according to actual configured cancellation timing;
- replay a webhook and verify no harmful duplicate side effect.

### P0 — Brevo + DNS
**Impact:** sending, inbox placement and provider events are not proven.

Required proof:
- authenticate a domain owned by the business;
- verify DKIM and DMARC in Brevo; verify the SPF strategy for the actual sending setup;
- send to an independent external inbox;
- verify From and Reply-To;
- verify delivered event updates the matching followup;
- trigger a bounce and verify status;
- trigger unsubscribe and verify suppression;
- confirm a provider failure never records `sent`.

### P0 — Device/browser QA
**Impact:** responsive and browser behavior are unproven.

Required physical/browser matrix:
- iPhone Safari;
- Android Chrome;
- desktop Chrome;
- desktop Firefox;
- macOS Safari;
- optional tablet pass before public launch.

Run: home -> signup -> onboarding -> create/edit/delete quote -> status changes -> preview -> support -> settings -> billing.

### P1 — Backup/restore drill
**Impact:** a backup that has never been restored is not a proven recovery mechanism.

Required proof:
- create representative staging records;
- create Supabase backup/logical dump;
- restore into a disposable staging project/database using the documented Supabase restore flow;
- verify row counts and critical relationships;
- verify Auth/data implications separately because Supabase CLI logical dumps exclude managed schemas by default.

## Promotion rule

Relanzio may be marked **PRÊT POUR PREMIERS PILOTES** only after every P0 gate above has dated evidence attached. No acquisition should be enabled during this phase; `ACQUISITION_ENABLED=false` remains mandatory.
