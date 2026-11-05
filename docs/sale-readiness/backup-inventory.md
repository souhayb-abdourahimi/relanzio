# Inventaire des sauvegardes

Ce que contient une sauvegarde Relanzio, ce qui en est exclu, et le niveau de preuve atteint. Inventaire établi le 5 novembre 2026
en lecture seule sur la production (Supabase `uwgvnhnpvxoebabayqac`, PostgreSQL 17.11). Procédures : [06](06-backup-restore-runbook.md).

Légende des preuves :
- **CI** : vérifié automatiquement à chaque modification du code, sur des données synthétiques, avec PostgreSQL 17 ;
- **Nuit** : vérifié par le job v2 à chaque sauvegarde, sur les vraies données (une fois le job déployé) ;
- **À faire** : pas encore prouvé sur les données réelles.

## Base de données — tables applicatives (schéma `public`)

Nombre de lignes en production le 5 novembre 2026, vers 18 h UTC (lecture seule). La colonne « Ancien job » indique si la
sauvegarde actuellement en production contient la table.

| Table | Lignes | Ancien job | Job v2 | Preuve |
|---|---:|:---:|:---:|---|
| profiles | 12 | oui | oui | CI ; Nuit (À faire) |
| quotes | 9 | oui | oui | CI ; Nuit (À faire) |
| followups | 4 | oui | oui | CI ; Nuit (À faire) |
| quote_replies | 4 | **non** | oui | CI ; Nuit (À faire) |
| followup_optouts | 1 | **non** | oui | CI ; Nuit (À faire) |
| digest_sends | 0 | **non** | oui | CI ; Nuit (À faire) |
| prospects | 35 | oui | oui | CI ; Nuit (À faire) |
| prospect_tombstones | 0 | **non** | oui | CI ; Nuit (À faire) |
| suppressions | 7 | oui | oui | CI ; Nuit (À faire) |
| outreach_candidates | 249 | **non** | oui | CI ; Nuit (À faire) |
| outreach_queue | 64 | oui | oui | CI ; Nuit (À faire) |
| outreach_events | 106 | oui | oui | CI ; Nuit (À faire) |
| outreach_daily_slots | 29 | **non** | oui | CI ; Nuit (À faire) |
| sales_followups | 0 | **non** | oui | CI ; Nuit (À faire) |
| feedback_insights | 0 | oui | oui | CI ; Nuit (À faire) |
| lifecycle_messages | 0 | oui | oui | CI ; Nuit (À faire) |
| support_tickets | 0 | oui | oui | CI ; Nuit (À faire) |
| trial_events | 8 | oui | oui | CI ; Nuit (À faire) |
| product_events | 454 | oui | oui | CI ; Nuit (À faire) |
| system_events | 833 | oui | oui | CI ; Nuit (À faire) |
| stripe_webhook_events | 131 | oui | oui | CI ; Nuit (À faire) |
| **Total** | **1 946** | 14/21 | 21/21 | |

Une table ajoutée plus tard dans `public` est sauvegardée automatiquement (pas de liste à maintenir).

## Base de données — structure et métadonnées

| Ressource | Production | Ancien job | Job v2 | Preuve |
|---|---|:---:|:---:|---|
| Colonnes, types, valeurs par défaut | 230 colonnes | reconstruit depuis GitHub | schéma déployé (`pg_dump`) | CI ; Nuit (À faire) |
| Contraintes (PK, FK, unicité, check) | 82 | idem | oui | CI |
| Index | 58 | idem (1 index de trop dans le dépôt) | oui | CI |
| Fonctions SQL | 12 | idem | oui (définition complète) | CI |
| Triggers | 0 | — | oui (contrôlés s’il en apparaît) | CI |
| RLS (21/21 tables) et politiques | 6 politiques | idem | oui | CI, y compris test de lecture par rôle |
| Droits `anon` / `authenticated` / `service_role` | 152 sur les tables | non | oui | CI |
| Séquences | 3 | non | oui (valeur courante) | CI |
| Historique des migrations (`supabase_migrations`) | 14 entrées | liste figée de 12 | oui (table complète) | CI |
| Fichiers `supabase/migrations` du dépôt | 21 fichiers | 12 | oui (copie dans l’archive) | CI |

**Rapprochement des migrations** ([`ops/backup/migration-map.json`](../../ops/backup/migration-map.json)) :
- les 14 entrées de l’historique correspondent chacune à un fichier du dépôt ;
- `imap_reply_ingestion` y est enregistrée sous un autre horodatage que le nom du fichier ;
- 7 fichiers ont été appliqués à la main sans être enregistrés : leurs tables, colonnes et fonctions sont bien présentes en production ;
- l’index `prospects_email_plain_unique` de `003_release.sql` n’existe pas en production, où l’unicité est déjà assurée par la contrainte `prospects_email_key`.

L’historique n’a pas été modifié ; la sauvegarde porte le schéma **réellement déployé**.

## Supabase Auth

| Table | Lignes | Job v2 | Raison |
|---|---:|:---:|---|
| auth.users | 13 | **oui** (mêmes UUID, empreintes de mot de passe) | Comptes clients |
| auth.identities | 13 | **oui** | Lien compte ↔ méthode de connexion |
| auth.sessions | 12 | non | Sécurité : jamais restaurées, chacun se reconnecte |
| auth.refresh_tokens | 14 | non | Sécurité ; invalides avec le nouveau secret JWT |
| auth.mfa_amr_claims | 12 | non | Liées aux sessions |
| auth.one_time_tokens | 1 | non | Jetons temporaires (confirmation, récupération) |
| auth.flow_state, mfa_challenges, saml_relay_states, webauthn_challenges, oauth_authorizations, oauth_client_states | 0 | non | Temporaires |
| auth.audit_log_entries | 0 | non | Journal, non nécessaire pour restaurer les comptes |
| auth.mfa_factors, mfa_recovery_*, webauthn_credentials, sso_*, saml_providers, oauth_clients, oauth_consents, custom_oauth_providers, scim_* | 0 | non | Fonctions non utilisées : **le job échoue (`INCOMPLETE`) si l’une d’elles contient une ligne** |
| auth.schema_migrations, auth.instances | — | non | Gérées par Supabase Auth |

12 profils pour 13 comptes : un compte n’a pas de profil (contrôlé à chaque restauration, la valeur doit rester identique).
Preuve Auth : CI (base de données) ; Nuit (À faire) ; connexion réelle via Supabase Auth : **À faire** lors d’une restauration dans
un projet Supabase ([06 §7](06-backup-restore-runbook.md)).

## Autres ressources Supabase

| Ressource | État en production | Traitement |
|---|---|---|
| Storage | 0 bucket, 0 fichier | Non sauvegardé ; contrôlé à chaque exécution (`INCOMPLETE` si non vide) |
| Vault | 0 secret | Idem |
| pg_cron | Non installé | Idem s’il apparaît |
| Realtime | Aucune table publiée | État d’exécution, recréé par Supabase |
| Edge Functions | `qa-once`, `relanzio-trial-cert` (vestiges de QA, non appelés par l’application) | Non sauvegardées (code hors base) ; à supprimer ou à versionner (décision du propriétaire) |
| Extensions | pgcrypto, uuid-ossp, pg_stat_statements, supabase_vault | Présentes dans tout projet Supabase |
| Rôles | Uniquement les rôles standard Supabase | Contrôlé à chaque exécution (`INCOMPLETE` si rôle personnalisé) |
| Configuration Auth (URL du site, redirections, SMTP, fournisseurs) | Tableau de bord Supabase | Non sauvegardée ; à reconfigurer ([06 §7](06-backup-restore-runbook.md), étape 8) |
| Clés API, secret JWT, mot de passe de la base | — | **Jamais** sauvegardés |

## Hors base de données

| Ressource | Où | Sauvegarde |
|---|---|---|
| Code | GitHub (historique complet) | Git |
| Variables Railway (secrets) | Railway | Non sauvegardées par le job ; liste sans valeur : [04](04-environment-variables.md) |
| Clé de chiffrement des sauvegardes | Railway | **À conserver aussi hors de Railway** par le propriétaire |
| Stripe, Brevo | Comptes fournisseurs | Données chez le fournisseur ; non concernées |

## Sauvegarde de référence (ancien job)

`daily/relanzio-20261105T021954030Z.rzbk` :
- créée le 5 novembre 2026 à 03:19:54, heure de Paris ;
- 92 291 octets, SHA-256 `2ce10977…c06162f` ;
- format RZBK1, 14 tables, sans Auth ;
- vérification complète prévue dans Railway avec `ops/backup/verify.mjs`, qui fait les contrôles suivants :
  - déchiffrement et SHA-256 ;
  - chargement dans une base jetable ;
  - comparaison champ par champ ;
  - liste des 7 tables et des comptes absents.

**Statut : À faire.**
