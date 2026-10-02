# Relanzio v0.4 — hardening pré-pilotes

Relanzio suit les devis après leur envoi et organise les relances J+2, J+5 et J+10. Cette release est centrée sur la fiabilité avant tout pilote.

## Statut

**NON PRÊT POUR PILOTES** tant que les gates externes ne sont pas vertes. Les tests locaux passent, mais le build Vite, Supabase réel, Stripe Test, Brevo/délivrabilité, mobile et informations légales doivent encore être validés.

Lire dans cet ordre :
1. `FINAL_AUDIT_V0.4.md`
2. `GO_LIVE_CHECKLIST_V0.4.md`
3. `EXTERNAL_QA_RUNBOOK.md`
4. `CHANGELOG_V0.4.md`

## Local

```bash
cp .env.example .env
# Renseigner .env : il est la source unique pour le serveur, le préflight et Vite.
npm install
npm run check
npm run build
npm run dev
```

Node >= 22.12. L'installation doit générer un `package-lock.json`; après validation, CI/Docker devront repasser de `npm install` à `npm ci`.

## Safety switches

```text
FOLLOWUP_AUTOMATION_ENABLED=false
LIFECYCLE_EMAILS_ENABLED=false
ACQUISITION_ENABLED=false
```

Ne passer les deux premiers à `true` qu'après QA correspondante. L'acquisition reste `false` pendant toute la phase pré-pilotes.

## Production gates

`RELEASE_STAGE=production npm run preflight` refuse le GO LIVE tant que légal, QA externe et QA mobile ne sont pas explicitement approuvés et que les informations publiques obligatoires ne sont pas configurées.
