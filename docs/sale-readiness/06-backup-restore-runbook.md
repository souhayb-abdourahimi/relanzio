# 06 — Sauvegarde et restauration

Procédure de référence pour sauvegarder la base Relanzio, prouver qu’elle se restaure, et la reconstruire après une panne grave.
Code : [`ops/backup/`](../../ops/backup/README.md). Inventaire détaillé : [backup-inventory.md](backup-inventory.md).

## 1. État au 6 novembre 2026 (à lire en premier)

| Élément | État | Preuve |
|---|---|---|
| Job en production | **Job v2** (`relanzio-backup-v2`, cron `15 2 * * *`), en parallèle de l’ancien job (`relanzio-backup-job`, archivé dans `ops/backup/legacy/`) jusqu’à 7 nuits vertes | Logs Railway |
| Couverture de l’ancien job | **Incomplète** : 14 tables sur 21, aucun compte Auth, schéma reconstruit depuis GitHub au lieu du schéma déployé | Audit du 5 novembre ; `auth_users_covered=false`, `restore_verified=false` |
| Nouveau job (v2) | **Déployé le 6 novembre 2026**, testé en CI sur PostgreSQL 17 | `ops/backup/`, job CI `backup-restore` |
| Restauration testée sur des données de production réelles | **Oui, le 6 novembre 2026 à 10:29 UTC** : `COMPLETE_AND_RESTORE_VERIFIED`, 21 tables + `auth.users` (13) + `auth.identities` (13) + historique des migrations (14), restaurés dans un PostgreSQL 17 isolé et identiques à la source, aucun écart | Manifeste `v2/daily/relanzio-20261106T102857965Z.manifest.json` (SHA-256 `de8e1854…26d48bf`) |
| Connexion réelle via Supabase Auth après restauration | **Pas encore** : demande une restauration dans un projet Supabase jetable (section 8) | — |
| Restauration testée sur des données synthétiques | **Oui**, à chaque CI : sauvegarde → relecture → restauration → comparaison objet par objet, plus tous les cas d’échec | `test/backup-restore-e2e.test.js` |

On peut dire à un acheteur que les sauvegardes sont automatisées, chiffrées, contrôlées, et que la restauration des données, du
schéma et des comptes est vérifiée chaque nuit dans un environnement isolé. Tant que la connexion réelle via Supabase Auth n’a pas
été testée dans un projet Supabase restauré, ne pas affirmer que « tout le service » a été restauré et utilisé.

## 2. Architecture

```
Supabase (Postgres 17, eu-west-3)                Railway (projet outstanding-prosperity)
  public (21 tables) ─┐                          service cron « backup v2 » (image ops/backup/Dockerfile)
  auth.users          ├─ pg_dump, instantané ──▶   1. capture en lecture seule (un seul instantané)
  auth.identities     │   unique, lecture seule    2. chiffrement AES-256-GCM (RZBK2)
  supabase_migrations ┘                            3. envoi ──▶ bucket « relanzio-backups » (Amsterdam)
                                                   4. relecture du bucket : SHA-256, déchiffrement, fichiers
                                                   5. restauration dans un PostgreSQL 17 jetable (dans le conteneur)
                                                   6. comparaison avec la source → manifeste public + rétention
```

- **Méthode** : celle du CLI Supabase (`supabase db dump`) — `pg_dump --schema-only` du schéma déployé, `pg_dump --data-only`
  des données (chargées avec `session_replication_role = replica`), données `auth.users` / `auth.identities`. Aucun format maison.
- **Cohérence** : une transaction `REPEATABLE READ READ ONLY` exporte un instantané ; les quatre `pg_dump` et toutes les empreintes
  utilisent ce même instantané. La sauvegarde ne peut rien écrire en production.
- **Contrôle automatique de couverture** : toute table de `public`, y compris une table créée demain, est sauvegardée sans
  modifier le code. Le job passe en `INCOMPLETE` (et échoue) si une table apparaît dans un nouveau schéma, si une table Auth inconnue
  contient des lignes, si Storage, Vault ou pg_cron contiennent quelque chose, ou si un rôle personnalisé existe.

## 3. Ce qui est sauvegardé, et ce qui ne l’est pas

Détail et justification : [backup-inventory.md](backup-inventory.md).

- **Couvert** : les 21 tables applicatives (données, UUID, clés, contraintes, index, fonctions, triggers, RLS et politiques, droits,
  séquences), `auth.users` et `auth.identities` (mêmes UUID, empreintes de mot de passe), l’historique `supabase_migrations`, et
  une copie des fichiers `supabase/migrations` du dépôt.
- **Exclu volontairement** : sessions, refresh tokens et autres jetons temporaires Auth (sécurité), journal d’audit Auth, état
  Realtime, Storage et Vault (vides, vérifiés à chaque exécution), Edge Functions (code hors base, non utilisé par l’application),
  configuration du tableau de bord Supabase et clés API (jamais sauvegardées).

## 4. Chiffrement, stockage, calendrier, rétention

| Sujet | Règle |
|---|---|
| Chiffrement | AES-256-GCM, clé de 32 octets dans la variable Railway `BACKUP_ENCRYPTION_KEY_B64`. L’en-tête est authentifié : un octet modifié rend le fichier illisible |
| Format | `RZBK2` = en-tête + archive JSON compressée de fichiers SQL, chacun avec son SHA-256 |
| Manifeste | `…manifest.json` à côté de chaque sauvegarde : dates UTC et Paris, version, SHA-256, taille, version PostgreSQL, projet, tables et lignes, migrations, Auth, exclusions, intégrité, restauration. **Aucune adresse email, donnée personnelle ou secret** (vérifié avant chaque envoi) |
| Stockage | Bucket Railway `relanzio-backups` (région Amsterdam), préfixe `v2/daily/`. Les anciennes sauvegardes `daily/` ne sont jamais touchées par le nouveau job |
| Calendrier | Tous les jours à 02:15 UTC (`15 2 * * *`), soit 03:15 l’hiver et 04:15 l’été à Paris |
| Rétention | 30 jours. Garde-fous : jamais de suppression si la sauvegarde du jour n’est pas entièrement vérifiée ; toujours au moins les 7 plus récentes ; toujours la dernière sauvegarde vérifiée |
| Contrôle SHA-256 | Calculé sur l’objet chiffré, écrit dans le manifeste, recalculé sur l’objet **relu depuis le bucket** |

## 5. Stratégie Auth (comptes utilisateurs)

- Méthode officielle Supabase : les comptes sont des lignes de `auth.users` et `auth.identities`, copiées avec leurs UUID, leurs
  empreintes de mot de passe (bcrypt) et leurs métadonnées. Dans un nouveau projet, le schéma `auth` est déjà créé par Supabase :
  on n’y charge que les **données**, jamais une structure maison.
- Les **sessions et refresh tokens ne sont pas sauvegardés** : après une restauration, tout le monde se reconnecte. Le nouveau projet
  a de toute façon un autre secret JWT, ce qui invalide les anciens jetons.
- Le contrôle nocturne vérifie : nombre de comptes et d’identités, empreinte des UUID, identités sans compte, profils sans compte,
  comptes sans profil (1 aujourd’hui, attendu : un compte créé sans profil).
- **Limite** : la vérification nocturne se fait au niveau de la base, dans la vraie structure `auth.users` / `auth.identities`
  copiée depuis Supabase. La connexion réelle via Supabase Auth n’est prouvée que par une restauration dans un projet Supabase
  (section 7, étape 8). MFA, passkeys et SSO ne sont pas utilisés ; s’ils l’étaient, le job passerait en `INCOMPLETE`.

## 6. Ce que vérifie chaque nuit la restauration de contrôle

Sur la copie **relue depuis le bucket et déchiffrée**, restaurée dans un PostgreSQL 17 jetable (socket local dans un dossier
temporaire, aucune écoute réseau, supprimé à la fin) :

- nombre de lignes par table et **empreinte du contenu** (SHA-256 des empreintes de lignes triées), donc lignes manquantes,
  en trop ou modifiées ;
- colonnes, contraintes (PK, FK, unicité, check), index, fonctions (définition complète), triggers, RLS et politiques, droits
  `anon` / `authenticated` / `service_role`, vues, types, valeurs des séquences ;
- lignes orphelines pour chaque clé étrangère ;
- RLS en pratique : chaque utilisateur testé ne voit que ses devis, le rôle anonyme n’en voit aucun ;
- comptes Auth (section 5).

Un seul écart donne `RESTORE_FAILED` ou `AUTH_RESTORE_FAILED`, un statut non vérifié dans le manifeste et un code de sortie non nul.

## 7. Restaurer après une panne grave (base perdue)

Personne ne restaure jamais **sur** la base de production. On restaure **dans un nouveau projet Supabase vide**, puis on y bascule
l’application.

1. **Couper la prospection et les automatisations** dans Railway (`COMMERCIAL_OUTREACH_SEND_ENABLED=false`,
   `FOLLOWUP_AUTOMATION_ENABLED=false`) pour qu’aucun email ne parte pendant l’opération.
2. **Créer un nouveau projet Supabase** (région `eu-west-3`, même offre). Noter sa référence (les 20 lettres de son adresse).
3. **Choisir la sauvegarde** : le dernier manifeste `v2/daily/…manifest.json` dont `status` vaut `COMPLETE_AND_RESTORE_VERIFIED`.
4. Dans Railway, sur le service de sauvegarde, **ajouter** les variables (jamais dans un chat ni dans Git) :
   `RESTORE_TARGET_DB_URL` (chaîne de connexion du **nouveau** projet), `RESTORE_TARGET_PROJECT_REF`,
   `RESTORE_CONFIRM=restore-into:<référence>`, `RESTORE_BACKUP_KEY=v2/daily/relanzio-<horodatage>.rzbk2`.
5. **Essai à blanc** : lancer `node ops/backup/restore.mjs`. Le script vérifie la sauvegarde (SHA-256, déchiffrement), inspecte
   la cible en lecture seule et affiche `RESTORE_DRY_RUN` avec le plan, **sans rien écrire**. Il refuse (`RESTORE_REFUSED`)
   si la cible est la production (référence, hôte, utilisateur du pooler, même URL que la source, même identifiant de cluster),
   si elle n’est pas vide, ou si la confirmation ne nomme pas exactement la cible.
6. **Restauration** : relancer avec `RESTORE_MODE=apply`. Ordre : schéma, comptes Auth, données. Aucune suppression,
   aucun `DROP`, aucun `TRUNCATE`. Le script compare ensuite la cible à la sauvegarde (`TARGET_RESTORE_VERIFIED`).
7. **Supprimer les variables `RESTORE_*`** du service.
8. **Basculer l’application** : `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_*` dans
   Railway ; dans Supabase → *Authentication* : URL du site `https://relanzio.com`, URL de redirection, SMTP. Redéployer,
   puis **se connecter avec un vrai compte** (preuve de la restauration Auth).
9. **Contrôles** : `/api/health`, `/api/readiness`, `npm run sale:health` (`DB: PASS`), présence des tables d’opposition
   (`suppressions`, `prospect_tombstones`, `followup_optouts` — sans elles, des personnes désinscrites pourraient être recontactées).
10. **Réactiver** les automatisations une par une. Prévenir les utilisateurs qu’ils doivent se reconnecter.

## 8. Test de restauration (preuve à fournir à un acheteur)

- **Chaque nuit, automatiquement** : la restauration de contrôle de la section 6. Le manifeste de la nuit est la preuve
  (`status`, `integrity`, `restore`, `auth`).
- **Sur demande** : `node ops/backup/verify.mjs v2/daily/relanzio-<horodatage>.rzbk2` dans le service Railway refait les mêmes
  contrôles sur n’importe quelle sauvegarde conservée.
- **Une fois par trimestre (recommandé)** : la procédure complète de la section 7 vers un projet Supabase jetable, connexion
  d’un compte de test, puis suppression du projet jetable (coût : celui d’un projet Supabase pendant quelques heures).
- **En CI, à chaque modification** : `test/backup-restore-e2e.test.js` sur PostgreSQL 17, avec les cas d’échec : table oubliée,
  migration absente ou inattendue, déchiffrement impossible, objet altéré, lignes manquantes ou en trop, relation cassée, fonction,
  index ou contrainte manquants, cible non vide ou égale à la source, Auth incomplet, Storage non vide.

## 9. Mise en service du job v2 (une seule fois)

Voir aussi le rapport de mission. Rien ne change pour l’application ; l’ancien job continue jusqu’à la validation du nouveau.

1. Créer dans Railway un service « relanzio-backup-v2 » depuis le dépôt GitHub, branche `staging`, avec ces réglages
   (*Settings* du service ; Railway n’applique plus les fichiers `railway.json`) : Dockerfile `ops/backup/Dockerfile`,
   commande `node ops/backup/backup.mjs`, cron `15 2 * * *`, redémarrage « Never », chemins surveillés `ops/backup/**`,
   `supabase/migrations/**`, `supabase/schema.sql`.
2. Variables : `BACKUP_SOURCE_DB_URL` (Supabase → *Connect* → *Session pooler*, mot de passe de la base — saisi directement
   dans Railway), `BACKUP_SOURCE_PROJECT_REF=uwgvnhnpvxoebabayqac`, et des **références** vers les variables existantes de
   l’ancien service pour `BACKUP_ENCRYPTION_KEY_B64` et `S3_*` (aucune valeur à recopier).
3. Lancer une exécution manuelle et lire `BACKUP_RESULT` : il doit valoir `COMPLETE_AND_RESTORE_VERIFIED`.
4. Lancer `node ops/backup/verify.mjs daily/relanzio-20261105T021954030Z.rzbk` : vérifie l’ancienne sauvegarde de référence et
   liste ce qu’elle ne contient pas.
5. Après 7 nuits vertes : désactiver le cron de l’ancien service (le conserver arrêté, avec ses variables, pour lire les anciennes
   sauvegardes), puis supprimer de l’ancien service les variables `RUN_RESTORE` et `RESTORE_DB_URL`.

## 10. Rotation des secrets

| Secret | Rotation | Effet sur les sauvegardes |
|---|---|---|
| Mot de passe de la base Supabase | Supabase → *Database* → *Reset password*, puis mettre à jour `BACKUP_SOURCE_DB_URL` | Aucun |
| Clé de chiffrement | Générer 32 octets aléatoires, **conserver l’ancienne clé** dans un coffre tant que des sauvegardes chiffrées avec elle existent (30 jours) | Les nouvelles sauvegardes utilisent la nouvelle clé |
| Clés du bucket | Railway → bucket → *Credentials* → régénérer, puis mettre à jour `S3_*` | Aucun |

La clé de chiffrement doit aussi être conservée **hors de Railway** (gestionnaire de mots de passe du propriétaire) : sans elle,
les sauvegardes sont illisibles, et si Railway est perdu, la clé l’est aussi.

## 11. Incident

| Symptôme | Action |
|---|---|
| `BACKUP_FAILURE` / pas de `BACKUP_CREATED` | Lire l’erreur (connexion, variable manquante). Les sauvegardes précédentes restent intactes |
| `BACKUP_RESULT` = `INCOMPLETE` | Lire `coverage.failures` : nouvelle ressource à classer dans `ops/backup/lib/coverage.mjs` |
| `RESTORE_FAILED` / `AUTH_RESTORE_FAILED` | Lire `problems` ; ne pas considérer la sauvegarde de la nuit comme fiable ; la rétention est suspendue automatiquement |
| `BACKUP_INTEGRITY_FAILED` | Le bucket a renvoyé un objet différent : relancer, puis contacter Railway si ça se répète |
| Base de production perdue | Section 7 |

## 12. Transfert à un acheteur

1. Montrer les manifestes des 30 derniers jours (aucune donnée personnelle) et le dernier `COMPLETE_AND_RESTORE_VERIFIED`.
2. Faire devant lui une restauration complète (section 7) vers un projet Supabase lui appartenant.
3. Lui remettre la clé de chiffrement par un canal chiffré, puis faire une **rotation** : nouvelle clé, nouveau bucket ou nouvelles
   clés de bucket à son nom, nouveau mot de passe de base.
4. Après la cession, supprimer les copies conservées par le vendeur, conformément à l’accord de cession
   (LEGAL REVIEW REQUIRED, voir [21](21-legal-review-checklist.md)).

## Annexe — sauvegarde manuelle ponctuelle

`scripts/backup.sh` (Supabase CLI, dossier local `backups/`, non chiffré) reste utilisable pour une copie manuelle. Chiffrer le
résultat avant tout stockage et ne jamais le versionner.
