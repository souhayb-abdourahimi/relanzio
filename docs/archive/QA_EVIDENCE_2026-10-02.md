# QA Evidence — 2026-10-02

| Gate | Command / observation | Result |
|---|---|---|
| Node | `node -v` | PASS — v22.16.0 |
| npm | `npm -v` | 10.9.2 |
| Clean install | `rm -rf node_modules package-lock.json && npm install --no-audit --no-fund` | BLOCKED — timeout 240 s |
| Registry | `timeout 15s npm ping` | BLOCKED — exit 124 |
| Offline lock | `npm install --package-lock-only --offline` | BLOCKED — package metadata not cached |
| Check/tests | `npm run check` | PASS — 25/25 |
| Build | `npm run build` | BLOCKED — Vite unavailable because install failed |
| Staging preflight | full non-secret dummy staging env + `node scripts/preflight.mjs` | PASS — 14/14 required values |
| Production gate | production env without legal/external/mobile approvals | PASS AS SAFETY CONTROL — exits 1 |
| Script syntax | `sh -n scripts/backup.sh` + `node --check` scripts | PASS |
| Secret scan | provider-secret patterns across repository | PASS — 0 tracked secrets |
| Automation safety | `.env.example` switches | PASS — all false |
| Supabase hosted | real project | NOT EXECUTED — account connection required |
| Stripe sandbox | real sandbox | NOT EXECUTED — account connection required |
| Brevo | real account/domain | NOT EXECUTED — account/domain access required |
| Real devices | physical/browser matrix | NOT EXECUTED |
| Backup restore | disposable hosted restore | NOT EXECUTED |

## QA correction evidence

After environment-source and DB-grant hardening, `npm run check` remained green at **25/25**.
