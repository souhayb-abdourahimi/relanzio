# 07 — Base de données (Supabase)

Postgres + Supabase Auth. Région déclarée : Union européenne (Paris). Toutes les tables sont dans le schéma `public`
avec **RLS activée (22/22)**. Le serveur utilise la clé `service_role` ; le navigateur ne lit que ce que la RLS autorise
(ses propres lignes) et n’écrit aucune table métier directement (écritures via l’API).

## Tables

### Produit (données des artisans et de leurs clients)

| Table | Contenu | Personnelles ? |
|---|---|---|
| `profiles` | Compte artisan : email, entreprise, offre (`plan`), état d’abonnement Stripe, essai, préférences, cadence | Oui (artisan) |
| `quotes` | Devis suivis : nom du client, email/téléphone du client, objet, montant, dates, état, prochaine relance, `reply_received_at` | **Oui (clients des artisans)** |
| `followups` | Relances (brouillon, envoyée, livrée…), sujet, texte, `reply_token` | Oui |
| `quote_replies` | Réponses des clients (email détecté ou signalé), catégorie, extrait ≤ 2 000 caractères, transfert | **Oui** |
| `followup_optouts` | Clients désinscrits des relances d’un artisan (STOP, lien) | Oui |
| `digest_sends`, `lifecycle_messages` | Envois de rappels et emails de cycle de vie (idempotence) | Oui |
| `trial_events` | Historique des essais | Oui |
| `support_tickets` | Demandes de support | Oui |
| `product_events` | Événements d’usage (création de devis, relance envoyée, réponse, gagné…) | Pseudonymes (user_id) |
| `feedback_insights` | Retours produit | Possible |

### Facturation et exploitation

| Table | Contenu |
|---|---|
| `stripe_webhook_events` | Événements Stripe reçus (idempotence, ordre) |
| `system_events` | Erreurs et événements techniques (`reportError`) |
| `suppressions` | Adresses à **ne jamais** contacter (bounces, plaintes, désinscriptions, refus, STOP) — produit et prospection |

### Prospection de l’éditeur (données de prospects professionnels)

| Table | Contenu |
|---|---|
| `outreach_candidates` | Candidats avant import : entreprise, email public, source publique, score, statut (`waiting`, `manual_review`, `rejected`, `imported`…) |
| `prospects` | Prospects importés : entreprise, email, secteur, score, statut, dernière réponse |
| `prospect_tombstones` | Prospects supprimés : empêche toute réimportation |
| `outreach_queue` | File de la séquence (étape 0 = D0, 1 = J+3 ; toute étape ≥ 2 est annulée) |
| `outreach_events` | Envoyé / livré / répondu / bounce / opt-out… avec message ID Brevo |
| `outreach_daily_slots` | Réservation atomique du quota quotidien (jour calendaire de Paris) |
| `sales_followups` | Suivi humain créé pour une réponse positive |

## Fonctions SQL (atomiques)

`create_quote_with_quota`, `reopen_quote_with_quota` (quotas Free 5 / Pro 100 sans course), `confirm_manual_followup`,
`finalize_relanzio_followup`, `followup_gap_days`, `skip_weekend`, `apply_quote_reply` (arrêt sur réponse),
`claim_outreach_daily_slot` / `finalize_outreach_daily_slot` (quota commercial), `safe_import_qualified_prospect`,
`delete_prospect_with_tombstone`, `apply_outreach_reply`. Les fonctions sensibles ne sont exécutables que par `service_role`.

## Migrations

- `supabase/schema.sql` puis `supabase/migrations/` (de `003_release.sql` à `20261029100000_quote_replies.sql`).
- Rollbacks pour les 5 migrations les plus récentes (`supabase/rollbacks/`), testés en CI (rollback puis ré-application).
- Application **manuelle** en production (éditeur SQL). Aucune table de suivi des migrations appliquées : le contrôle
  `DB` de `npm run sale:health` vérifie la présence des tables et colonnes attendues.

## Données utilisateurs et droits

- Export par l’utilisateur : `GET /api/account/export` (JSON, inclut devis, relances, réponses) et `GET /api/quotes/export.csv`.
- Suppression du compte : `DELETE /api/account` (cascade sur toutes les données de l’utilisateur ; vérifié avant chaque déploiement).
- Suppressions d’emails conservées volontairement (sinon une personne désinscrite pourrait être recontactée).

## Sauvegardes

Voir [06-backup-restore-runbook.md](06-backup-restore-runbook.md). **À confirmer : offre Supabase et sauvegardes effectives.**

## Requêtes utiles

Métriques en lecture seule : [metrics/](metrics/README.md). Aucune donnée réelle n’est reproduite dans ce dossier.
