# Relanzio

Relanzio aide les artisans et petites entreprises de services à **relancer leurs devis au bon moment**, sans harceler leurs clients :
il planifie au plus 3 relances (jours ouvrés), prépare des messages sûrs, peut les envoyer pour l’artisan (Pro) et
**arrête tout dès que le client répond**. Site : https://relanzio.com

| Offre | Prix | Devis actifs |
|---|---|---|
| Free | 0 € | 5 |
| Pro | 29 € / mois (TVA non applicable, art. 293 B du CGI) | 100 |
| Essai Pro | 7 jours sans carte, au premier devis | — |

Source unique de ces valeurs : `shared/plans.js`.

## Stack

- **Front** : React 19 + Vite 7, pages publiques pré-rendues (lisibles sans JavaScript).
- **Serveur** : Node 22, Express 5, tâches planifiées `node-cron` dans le même processus.
- **Données / auth** : Supabase (Postgres, RLS sur toutes les tables, fonctions SQL atomiques).
- **Paiement** : Stripe (abonnement Pro, portail client, webhooks).
- **Emails** : Brevo (emails produit et prospection), boîtes IMAP en lecture seule pour les réponses.
- **Hébergement** : Railway (Docker), déploiement automatique de la branche `staging`.

## Structure

```
client/        front React (src/), fichiers publics (public/)
server/        API Express, webhooks, tâches planifiées, prospection, QA de pré-déploiement (qa-*.mjs)
shared/        code partagé front/serveur : offres, identité de l’éditeur, modèles de relance
supabase/      schema.sql, migrations/, rollbacks/
scripts/       build (prerender), smoke, préflight, sauvegarde, vérification lecture seule (sale-readiness-health)
test/          tests unitaires (*.test.js), SQL (test/sql), navigateur (test/e2e)
docs/          documentation ; docs/sale-readiness/ = dossier complet d’exploitation et de cession
```

## Installation locale

Prérequis : Node ≥ 22.12, un projet Supabase **de développement** (jamais la production).

```bash
cp .env.example .env      # renseigner les valeurs de développement (voir docs/sale-readiness/04-environment-variables.md)
npm ci
npm run dev               # API :3000 + front :5173
```

Les variables nécessaires sont décrites, **sans valeur**, dans [`docs/sale-readiness/04-environment-variables.md`](docs/sale-readiness/04-environment-variables.md).
Ne jamais versionner `.env` ni aucun secret.

## Tests

```bash
npm test                  # ~220 tests unitaires, aucun service réel contacté
npm run check             # syntaxe des modules serveur + tests unitaires (rejoué dans le build Docker)
npm run build             # Vite + pré-rendu des pages publiques
PGURL=postgres://postgres@localhost:5432/postgres npm run test:sql   # schéma, migrations, rollbacks, tests SQL (base jetable)
npm run test:e2e          # parcours navigateur sur faux backend (Playwright)
npm run test:nojs         # pages publiques sans JavaScript
```

La CI GitHub (`.github/workflows/ci.yml`) exécute l’ensemble à chaque push et pull request.

## Déploiement

1. Branche depuis **`staging`** (branche de production ; `main` est obsolète).
2. Pull request vers `staging`, CI verte, merge.
3. Railway construit l’image, exécute la QA de pré-déploiement contre la production (`node server/qa-predeploy-final.mjs`,
   configurée dans Railway) puis met en ligne. Une migration SQL s’applique **avant** le code qui en dépend.
4. Vérifier : `SMOKE_BASE_URL=https://relanzio.com npm run smoke` et, dans un shell Railway, `npm run sale:health`
   (lecture seule : aucun secret affiché, aucune écriture, aucun email).

Détail, rollback et migrations : [`docs/sale-readiness/05-deployment-runbook.md`](docs/sale-readiness/05-deployment-runbook.md).

## Interrupteurs de sécurité

Les automatisations sensibles sont désactivées par défaut et pilotées par variables Railway : relances automatiques
(`FOLLOWUP_AUTOMATION_ENABLED`), rappel du matin (`MORNING_DIGEST_ENABLED`), emails de facturation (`BILLING_EMAILS_ENABLED`),
promesse publique de détection des réponses (`VITE_REPLY_DETECTION_LIVE`), prospection (`COMMERCIAL_*`).
La prospection suit strictement **D0 → J+3 → fin** (aucun J+7), 1 email par tranche de 5 minutes, jours et heures ouvrés.

## Documentation

- Exploitation, architecture, sécurité, sauvegardes, prospection, transfert : [`docs/sale-readiness/`](docs/sale-readiness/00-README.md)
- Décisions produit : [`docs/DECISIONS_PRODUIT.md`](docs/DECISIONS_PRODUIT.md)
- Historique (versions 0.3 / 0.4) : [`docs/archive/`](docs/archive/README.md)

## Licence

Logiciel propriétaire, tous droits réservés. Les dépendances open source sont sous licences permissives
(voir [`docs/sale-readiness/15-ip-and-licenses.md`](docs/sale-readiness/15-ip-and-licenses.md)).
