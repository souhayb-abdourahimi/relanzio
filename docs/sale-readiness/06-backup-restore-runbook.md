# 06 — Sauvegarde et restauration

## Ce qui existe

| Élément | État |
|---|---|
| Données | Toutes dans Supabase (Postgres + Auth). Railway est sans état. |
| Sauvegardes automatiques Supabase | **À confirmer** : elles dépendent de l’offre Supabase souscrite (sauvegardes quotidiennes et rétention selon l’offre ; PITR en option). Vérifier dans Supabase → *Database* → *Backups*. |
| Sauvegarde par script | `scripts/backup.sh` (manuel) : `supabase db dump` des rôles, du schéma et des données, dans `backups/<horodatage>/`, droits 600. **Non planifié, non chiffré par le script, stocké en local.** |
| Stockage hors site | **Aucun dans le code. À confirmer** auprès du propriétaire. |
| Chiffrement | Supabase chiffre au repos (selon le fournisseur). Les dumps du script ne sont **pas** chiffrés : à chiffrer avant stockage. |
| Test de restauration | **Aucun test de restauration documenté à ce jour.** |
| Code | GitHub (historique complet). Le dossier `backups/` est exclu de Git. |

**Constat pour la cession : la stratégie de sauvegarde doit être confirmée et une restauration doit être testée avant la mise en vente**
(voir [18-founder-action-list.md](18-founder-action-list.md)).

## Faire une sauvegarde (script)

Prérequis : Supabase CLI, variable `SUPABASE_DB_URL` (chaîne de connexion **secrète**, jamais dans Git).

```bash
SUPABASE_DB_URL='…' sh scripts/backup.sh
# puis chiffrer, par exemple :
tar czf - backups/<horodatage> | gpg --symmetric --cipher-algo AES256 -o relanzio-<horodatage>.tgz.gpg
# stocker le fichier chiffré hors site ; supprimer la copie en clair
```

Fréquence recommandée : quotidienne (automatique Supabase) + mensuelle hors site (script). Rétention conseillée : 30 jours
minimum, 12 mois pour une copie mensuelle — **à décider par le propriétaire** (RGPD : ne pas conserver plus que nécessaire).

## Restaurer (vers un projet Supabase vide)

1. Créer un projet Supabase vierge (même région de préférence).
2. Déchiffrer la sauvegarde.
3. `psql "$NOUVELLE_DB_URL" -f roles.sql` puis `-f schema.sql` puis `-f data.sql`.
4. Vérifier que le schéma correspond au code : `npm run test:sql` ne s’applique qu’à une base jetable ; en production, comparer la
   liste des tables avec [07-database.md](07-database.md) et lancer `npm run sale:health` (contrôle **DB**).
5. Mettre à jour `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_*` dans Railway, redéployer.
6. Mettre à jour les URL de redirection de Supabase Auth (site `https://relanzio.com`).

Alternative : restauration depuis le tableau de bord Supabase (sauvegarde automatique ou PITR) si l’offre le permet.

## Tests après restauration

- `GET /api/health` et `/api/readiness` → `ok` / `ready`.
- Connexion d’un compte de test, liste des devis, aperçu d’une relance.
- `npm run sale:health` → `DB: PASS`.
- Nombre de lignes par table cohérent avec la source (requêtes de [metrics/](metrics/README.md)).
- Les suppressions (`suppressions`, `prospect_tombstones`, `followup_optouts`) sont bien présentes : **sans elles, des personnes
  désinscrites pourraient être recontactées.**
- Laisser la prospection **coupée** (`COMMERCIAL_OUTREACH_SEND_ENABLED=false`) jusqu’à ce contrôle.
