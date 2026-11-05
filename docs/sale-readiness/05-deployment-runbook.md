# 05 — Déploiement

## Branches

- **Production : `staging`.** Railway déploie automatiquement chaque commit poussé sur `staging`.
- `main` est **obsolète** (dernière mise à jour 2026-10-02) mais reste la branche par défaut de GitHub. Ne pas déployer depuis `main`.
- Toute modification passe par une branche dédiée → Pull Request vers `staging` → CI verte → merge.

## Intégration continue (`.github/workflows/ci.yml`)

À chaque push et PR : `npm ci` → `npm run check` (syntaxe + tests unitaires) → `npm run build` → tests SQL sur Postgres jetable
(migrations, rollbacks, ré-application) → tests navigateur (navigation mobile, E2E sur faux backend 1366 / 390 px) →
pages publiques lisibles sans JavaScript.

`.github/workflows/smoke.yml` : smoke test horaire et manuel de l’URL de production. **Il échoue tant que le secret GitHub
`STAGING_URL` n’est pas défini** (à ajouter : `https://relanzio.com`).

## Build (Dockerfile)

1. Étape `build` (Node 22 Alpine) : `npm ci`, Chromium (contrôle mobile), `npm run check` (**tous les tests unitaires sont
   rejoués dans le build**), `npm run build` (Vite + pré-rendu), contrôle DOM mobile.
2. Étape finale : dépendances de production uniquement, `node server/index.js`.

Les variables `VITE_*` et `APP_URL` sont des **arguments de build** : les modifier impose un redéploiement.

## QA avant déploiement (Railway « Pre-deploy command »)

Configurée **dans le tableau de bord Railway** (pas dans le dépôt) : `node server/qa-predeploy-final.mjs`.
Elle s’exécute avec les variables de production et **bloque le déploiement** en cas d’échec. Elle enchaîne :

1. `qa-outreach-safety.mjs` : quotas d’envoi concurrents, plafond 300, jour calendaire de Paris, import idempotent, tombstones,
   suppressions, réponses positive / absence / refus / STOP, aucun second D0 (données de test isolées, nettoyées).
2. `qa-outreach-provider.mjs` : état Brevo et DNS **journalisé** (non bloquant).
3. `qa-auth-domain-final.mjs` : deux comptes de test temporaires (supprimés ensuite) → inscription, essai 7 jours, quotas Free 5 /
   Pro 100, RLS, relances, réponse client, export, suppression de compte, schéma attendu des réponses, sécurité.

> Pour un acheteur : noter cette commande avant tout transfert de projet Railway. Sans elle, les déploiements ne sont plus contrôlés.

## Healthchecks

- `GET /api/health` → `{ok:true}` (processus vivant).
- `GET /api/readiness` → `{ready:true|false}` (Supabase, Stripe, Brevo configurés). Détail admin : `GET /api/admin/readiness`.

## Migrations

- Fichiers : `supabase/schema.sql` (socle) puis `supabase/migrations/*` dans l’ordre des noms. Rollbacks des migrations récentes : `supabase/rollbacks/*.down.sql`.
- **Application manuelle** dans l’éditeur SQL Supabase, **avant** le déploiement du code qui en dépend. Pas d’outil de suivi
  automatique : la liste des migrations appliquées n’est pas tracée en base (voir [audit-findings.md](audit-findings.md)).
- Test local complet : `PGURL=postgres://… npm run test:sql` (schéma + migrations + rollback + ré-application + tests SQL).

## Procédure de mise en production

1. Branche depuis `staging`, changements + tests (`npm test`, `npm run build`, `npm run test:sql`, `npm run test:e2e`).
2. Si migration : l’appliquer en production d’abord (elles sont additives et rétrocompatibles).
3. PR vers `staging`, CI verte, merge.
4. Suivre le déploiement Railway (build → QA pré-déploiement → mise en ligne) ; GitHub affiche aussi un statut de déploiement.
5. Smoke : `SMOKE_BASE_URL=https://relanzio.com npm run smoke` (santé, readiness, pages publiques, invariants de prix).

## Rollback

- **Code** : Railway → *Deployments* → redéployer la version précédente (« Redeploy »), ou `git revert` du merge sur `staging`.
- **Base** : appliquer le `.down.sql` correspondant **après** le retour du code (jamais avant), seulement si la migration pose problème.

## Vérification lecture seule

`npm run sale:health` (avec les variables de production chargées, par exemple dans un shell Railway) affiche :

```
SALE_READINESS_HEALTH
APP: PASS
DB: PASS
BILLING: PASS
EMAIL: PASS
BACKUPS: WARNING
OUTREACH: PASS
SECRETS: CONFIGURED
```

Il ne révèle aucun secret, ne modifie aucune donnée, n’envoie aucun email et n’active aucun flag
(détail des contrôles en tête de `scripts/sale-readiness-health.mjs`).

## Développement local

```bash
cp .env.example .env   # renseigner un projet Supabase de développement, jamais la production
npm ci
npm run dev            # API sur :3000, front sur :5173
npm test               # tests unitaires (aucun service réel contacté)
```
