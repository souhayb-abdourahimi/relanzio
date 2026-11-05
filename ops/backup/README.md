# ops/backup — sauvegarde et restauration de la base Relanzio

Job planifié (service Railway « cron ») qui sauvegarde la base Supabase de production, vérifie la copie stockée
et prouve chaque nuit qu’elle se restaure. Procédure complète, limites et incidents :
[docs/sale-readiness/06-backup-restore-runbook.md](../../docs/sale-readiness/06-backup-restore-runbook.md).
Inventaire : [docs/sale-readiness/backup-inventory.md](../../docs/sale-readiness/backup-inventory.md).

## Fichiers

| Fichier | Rôle |
|---|---|
| `backup.mjs` | Job quotidien : capture (lecture seule), chiffrement, envoi, relecture, restauration de contrôle, manifeste, rétention |
| `verify.mjs` | Vérifie une sauvegarde existante (v2 complète, ou ancienne RZBK1) dans une base jetable |
| `restore.mjs` | Restauration **protégée** vers un **nouveau** projet Supabase **vide** (désactivée par défaut) |
| `lib/dump.mjs` | Instantané cohérent + `pg_dump` (méthode du CLI Supabase) |
| `lib/coverage.mjs` | Ce qui est couvert / exclu (avec raison) et contrôle automatique de couverture |
| `lib/fingerprint.mjs` | Empreintes déterministes du catalogue et du contenu, comparaison objet par objet |
| `lib/verify-restore.mjs` | Restauration dans un cluster PostgreSQL éphémère (socket local, sans réseau) puis comparaison |
| `lib/guards.mjs` | Garde-fous : production interdite comme cible, cible vide obligatoire, secrets masqués |
| `lib/crypto.mjs` | Conteneur RZBK2 (AES-256-GCM) ; lecture des anciens RZBK1 |
| `lib/manifest.mjs`, `lib/retention.mjs`, `lib/store.mjs` | Manifeste public (sans donnée personnelle), rétention 30 jours, stockage S3 |
| `migration-map.json` | Rapprochement fichiers `supabase/migrations` ↔ historique Supabase |
| `sql/ephemeral-bootstrap.sql` | Rôles et fonctions `auth.*` recréés **uniquement** dans le cluster éphémère |
| `sql/auth-structure-reference.sql` | Structure `auth.users`/`auth.identities` pour vérifier les anciennes sauvegardes |
| `legacy/railway-function-v1.js` | Archive fidèle de l’ancien job Railway (non exécutée, défauts documentés) |
| `Dockerfile`, `railway.json` | Image (PostgreSQL 17 officiel + Node 22) et configuration du service Railway |

## Marqueurs de log

| Marqueur | Signification |
|---|---|
| `BACKUP_CREATED` | Sauvegarde chiffrée envoyée dans le bucket |
| `BACKUP_INTEGRITY_VERIFIED` | Objet relu depuis le bucket : SHA-256 identique, déchiffré, chaque fichier intact |
| `RESTORE_VERIFIED` | Cette copie relue a été restaurée dans une base jetable et est identique à la source (schéma + lignes) |
| `AUTH_RESTORE_VERIFIED` | Comptes et identités restaurés avec les mêmes UUID, liés à leurs profils |
| `BACKUP_RESULT` | Statut final ; code de sortie 0 **uniquement** si `COMPLETE_AND_RESTORE_VERIFIED` |
| `*_FAILED`, `BACKUP_FAILURE` | L’étape a échoué ; le statut du manifeste dit pourquoi |

Statuts possibles : `COMPLETE_AND_RESTORE_VERIFIED`, `AUTH_RESTORE_NOT_VERIFIED`, `RESTORE_NOT_VERIFIED`, `INCOMPLETE`,
`CREATED_INTEGRITY_NOT_VERIFIED`, `FAILED`. Une sauvegarde partielle n’est jamais présentée comme complète.

## Variables (Railway, jamais dans Git)

| Variable | Usage |
|---|---|
| `BACKUP_SOURCE_DB_URL` | Connexion Postgres à la production (pooler **session**, port 5432 ; le port 6543 est refusé). Lecture seule de fait : transaction `READ ONLY` |
| `BACKUP_SOURCE_PROJECT_REF` | `uwgvnhnpvxoebabayqac` (le job refuse toute autre valeur) |
| `BACKUP_ENCRYPTION_KEY_B64` | Clé AES-256 (32 octets base64) — la même que l’ancien job |
| `S3_ENDPOINT`, `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_URL_STYLE` | Bucket Railway `relanzio-backups` |
| `RETENTION_DAYS` | 30 par défaut (minimum 7) |

`RUN_RESTORE` et `RESTORE_DB_URL` (ancien job) sont **ignorés** par ce code.

## Commandes

```bash
node --test test/backup-*.test.js                                   # tests unitaires (aucune base)
BACKUP_E2E_PG_BIN=/usr/lib/postgresql/17/bin node --test test/backup-restore-e2e.test.js   # bout en bout, utilisateur non root
docker build -f ops/backup/Dockerfile -t relanzio-backup .          # image du job
node ops/backup/verify.mjs v2/daily/relanzio-<horodatage>.rzbk2     # dans le service Railway : revérifier une sauvegarde
```
