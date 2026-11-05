# Runbook QA externe — Relanzio v0.4

## 1. Installation et build
1. Installer Node 22 LTS récent (>=22.12).
2. `npm install --no-audit --no-fund`.
3. Vérifier `npm run check`.
4. Vérifier `npm run build`.
5. Générer/commiter le lockfile obtenu, puis convertir CI et Docker vers `npm ci`.

## 2. Supabase staging
- Créer un projet staging séparé de la production.
- Appliquer `supabase/schema.sql` sur un projet neuf ou la migration appropriée sur v0.3.
- Configurer Auth URL + redirect `/reset-password`.
- Pour la production, utiliser un SMTP personnalisé pour les emails Auth.
- Créer deux comptes et exécuter les tests d'isolation croisée.

## 3. Stripe Test
- Créer un prix mensuel Pro de test.
- Configurer le webhook vers `/api/stripe/webhook`.
- Souscrire avec une carte de test de succès puis tester un échec de paiement et une annulation.
- Vérifier la base après chaque événement, pas seulement l'interface Stripe.

## 4. Brevo
- Vérifier le domaine et l'adresse expéditrice.
- Publier/valider SPF, DKIM et DMARC.
- Créer le webhook transactionnel avec authentification vers `/api/brevo/webhook`.
- Tester delivered, bounce et unsubscribe.
- Vérifier que Reply-To correspond au compte utilisateur et que le nom expéditeur reste compréhensible (`Entreprise via Relanzio`).

## 5. Mobile
Exécuter le parcours complet sur appareils réels ou services de test navigateurs : accueil → signup → onboarding → création/modification/suppression devis → préparation relance → support → paramètres → facturation.

## 6. Sauvegarde
- Sur Supabase Pro, confirmer les sauvegardes quotidiennes dans le dashboard.
- En complément ou sur environnement adapté : `SUPABASE_DB_URL=... ./scripts/backup.sh`.
- Restaurer un backup dans un projet jetable au moins une fois avant la vente.

## 7. Smoke / charge
- `SMOKE_BASE_URL=https://staging... npm run smoke`
- `LOAD_BASE_URL=https://staging... LOAD_REQUESTS=500 LOAD_CONCURRENCY=20 npm run load`
- Le test de charge fourni vise d'abord la disponibilité HTTP. Les parcours authentifiés devront ensuite être testés avec un environnement dédié si le volume augmente.
