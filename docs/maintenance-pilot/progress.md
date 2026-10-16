# Execution ledger
Plan approved. Existing dedicated clone/branch retained per user.
Tasks: isolation/schema, diagnostic/UI, billing, simulation, report/purge, QA/compatibility/PR.
Ruling: preserve existing Stripe SDK to avoid changing Pro integration.

Tasks 1–5 implemented and tested. Test-first failures captured locally; PGlite SQL + route + browser tests green before final review.
Ruling: PostgreSQL embedded via PGlite is a development-only dependency; no remote DB touched. No actual Storage bucket exists; upload refusal tested rather than claiming a private bucket verified.
Review fixed: case-wide Checkout reservation freezes campaign before network, and durable multi-kind signals preserve STOP/reply/appointment evidence.
Compatibility: initial cherry-pick conflicts in server/index.js, client/src/main.jsx, CI; adaptations preserve e41f138 logic and insert pilot guard before Stripe event claim.
Task 6: complete locally. Main check 40/40; e41f138 adapted check 125/125; builds PASS; pilot browser 4/4 on both; legacy navigation 2/2; compiled route flags 2/2 on both. Initial e41 compiled 404 reproduced and fixed in compatibility copy only. No external supplier calls accepted. Final review fixes covered by tests. GitHub publication pending.
