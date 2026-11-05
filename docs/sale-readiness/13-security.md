# 13 — Sécurité

## Secrets

- Stockés **uniquement** dans les variables Railway (et localement dans `.env`, exclu de Git). Liste : [04](04-environment-variables.md).
- Recherche complète dans **tout l’historique Git** (469 commits, toutes branches) le 2026-11-05 : clés Stripe, `whsec_`, clés Brevo,
  JWT Supabase (dont `service_role`), clés privées, jetons GitHub/Railway/AWS/OpenAI, URL Postgres avec mot de passe, mots de passe
  en clair, fichiers `.env`. **Aucun secret réel trouvé.** Seuls résultats : valeurs factices dans les tests, une clé de test pour le
  faux serveur IMAP (`test/fixtures/imap-localhost.key`, documentée comme telle) et des faux positifs dans des URL de recherche.
- Les erreurs fournisseur sont journalisées sans adresses email ; les logs masquent les secrets connus.

## Authentification et accès

- Supabase Auth (email + mot de passe, réinitialisation par email). Le serveur vérifie le jeton à chaque requête.
- Administration : réservée aux adresses listées dans `ADMIN_EMAILS` (variable Railway). Aucun autre rôle.
- Webhooks : Stripe (signature), Brevo (`x-webhook-secret`), cron manuel (`x-cron-secret`) ; un secret vide est **refusé**
  (comparaison à temps constant, longueur > 0).

## Base de données

- RLS activée sur les 22 tables ; lecture limitée aux lignes de l’utilisateur ; aucune écriture directe depuis le navigateur
  (vérifié avant chaque déploiement : lecture croisée et écriture directe bloquées, IDOR sur l’API refusé).
- Opérations sensibles en fonctions SQL atomiques exécutables par `service_role` uniquement.

## Application

- `helmet` (CSP en production, `frame-ancestors 'none'`, `nosniff`), CORS limité à `APP_URL`, limitation de débit, taille de requête bornée.
- Liens de désinscription signés (`EMAIL_LINK_SECRET`).
- Pièces jointes transférées limitées (types autorisés, 8 Mo).
- Boîtes IMAP en lecture seule (EXAMINE, aucune écriture), TLS vérifié.

## Protections des destinataires

`suppressions` (bounces, plaintes, STOP, refus), `followup_optouts`, `prospect_tombstones` : contrôlées avant import et avant chaque envoi.

## Sauvegardes

Voir [06](06-backup-restore-runbook.md). Les dumps contiennent toutes les données personnelles : chiffrement obligatoire.

## Points ouverts

- Dépôt **public** : le code et l’historique (dont l’email de commit du fondateur et des documents de recherche personnels)
  sont visibles de tous. Recommandation : **passer en privé avant la mise en vente** (décision du propriétaire).
- Pas de double authentification imposée sur les comptes administrateurs des services (À confirmer pour GitHub, Railway, Supabase,
  Stripe, Brevo, OVH, Amelu).
- `server/qa-destructive-final.mjs` : script de QA destructif, non référencé ; **ne jamais l’exécuter contre la production**.

## Rotation des secrets lors d’une acquisition

Ordre recommandé, après bascule des comptes (voir [20](20-transition-plan.md)) :

1. Supabase : régénérer les clés (JWT secret / clés API) et le mot de passe de la base ; mettre à jour Railway ; redéployer.
2. Stripe : nouvelle clé secrète, nouveau secret de webhook (ou nouveau compte, voir [08](08-billing-stripe.md)).
3. Brevo : nouvelles clés API (principale et prospection), nouveau `BREVO_WEBHOOK_SECRET` (mettre à jour le webhook Brevo).
4. Boîtes mail : nouveaux mots de passe IMAP (`REPLY_IMAP_PASSWORD`, `IMAP_PASSWORD`).
5. `CRON_SECRET`, `OPENAI_API_KEY`, puis `EMAIL_LINK_SECRET` (en dernier, voir la note dans [04](04-environment-variables.md)).
6. `ADMIN_EMAILS` : remplacer l’adresse du fondateur.
7. Révoquer les accès du fondateur à chaque service ; activer la double authentification.
