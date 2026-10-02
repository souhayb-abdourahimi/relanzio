# Changelog v0.4 — hardening pré-pilotes

Cette version n'ajoute pas de stratégie d'acquisition. Elle réduit le risque opérationnel.

- CRUD devis complété (édition/suppression).
- Vrai mode Revue avec preview/copie et envoi explicite Pro.
- Reset password terminé.
- Faux succès Brevo supprimé.
- Anti-double-envoi + contrainte unique de séquence.
- Verrous de sécurité sur acquisition, lifecycle et automatisation.
- Billing transitions testables ; `past_due` bloque l'automatisation.
- Observabilité interne, request IDs, `system_events`, santé admin.
- Smoke/load/backup scripts.
- Pages publiques dédiées et SEO public généré depuis `APP_URL`.
- Pages légales alimentées par variables réelles et gate production.
- IA avec `store:false`, limites de sortie et fallback.
- Support sensible/juridique escaladé.
- Dépendances top-level épinglées et Node >=22.12.

## Pilot-readiness QA pass — 2026-10-02
- Unified Vite and server/preflight environment loading on the root `.env`.
- Added browser-safe Supabase variables to preflight requirements and root `.env.example`.
- Hardened Supabase Data API grants to least privilege for pilot staging.
- Added regression coverage for Vite/preflight environment drift.
- Local deterministic suite: 25/25 PASS.
- External gates remain unapproved; acquisition remains disabled.
