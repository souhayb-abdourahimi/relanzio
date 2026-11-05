# 12 — Surveillance et incidents

## Ce qui existe

| Moyen | Détail |
|---|---|
| Healthcheck | `GET /api/health` (vivant), `GET /api/readiness` (`{ready}` public ; détail sur `/api/admin/readiness`) |
| Logs | JSON structurés sur la sortie standard (Railway → *Logs*), sans adresses email ni secrets (masquage dans `observability.js`) |
| Erreurs | `reportError()` écrit aussi dans la table `system_events` ; vue admin `GET /api/admin/system` (7 jours) |
| QA avant déploiement | Bloque tout déploiement défaillant (voir [05](05-deployment-runbook.md)) |
| Smoke | `.github/workflows/smoke.yml` horaire — **inactif tant que le secret GitHub `STAGING_URL` n’est pas défini** |
| Prospection | Pause automatique (IMAP, délivrabilité, Brevo, DNS), journal `Commercial sequence paused` ; `GET /api/admin/outreach-health` |
| Boîte réponses | Journal `reply.poll` toutes les 2 min (candidats, ingérés, erreurs) |
| Stripe | Tableau de bord Stripe (webhooks en échec, paiements) ; événements stockés dans `stripe_webhook_events` |
| Brevo | Tableau de bord Brevo (bounces, plaintes, réputation) ; événements dans `outreach_events` / `followups` |

## Ce qui manque (recommandé avant une vente)

- **Aucune alerte externe** : pas de service d’uptime, pas d’alerte email/SMS sur erreur (pas de Sentry ou équivalent).
  Recommandé : un moniteur d’uptime sur `/api/health` + définir `STAGING_URL` pour le smoke horaire.
- Pas d’alerte sur l’échec de sauvegarde (aucune sauvegarde automatisée hors Supabase, voir [06](06-backup-restore-runbook.md)).
- Pas de tableau de bord de métriques business (requêtes fournies dans [metrics/](metrics/README.md)).

## Procédure d’incident

1. **Constater** : `/api/health`, `/api/readiness`, logs Railway, statut du dernier déploiement (Railway / GitHub).
2. **Protéger les tiers d’abord** :
   - prospection : `COMMERCIAL_OUTREACH_SEND_ENABLED=false` ;
   - relances automatiques : `FOLLOWUP_AUTOMATION_ENABLED=false` (désactivé par défaut) ;
   - emails de service : `MORNING_DIGEST_ENABLED=false`, `BILLING_EMAILS_ENABLED=false`.
3. **Revenir en arrière** si un déploiement est en cause : Railway → redéployer la version précédente.
4. **Diagnostiquer** : `system_events` (admin), logs filtrés par `scope` (`followup.*`, `reply.*`, `cron.*`, `outreach.*`, `stripe.*`).
5. **Stripe** : rejouer les webhooks en échec depuis le tableau de bord Stripe (traitement idempotent).
6. **Brevo** : vérifier réputation, bounces, blocages ; la prospection reste en pause tant que la santé n’est pas revenue.
7. **Données** : en cas de corruption, restaurer selon [06](06-backup-restore-runbook.md), prospection coupée jusqu’au contrôle des suppressions.
8. **Communiquer** aux clients concernés (support@relanzio.com) ; consigner l’incident (date, cause, durée, correctif).

Historique des incidents : **À renseigner par le propriétaire** (aucun registre d’incidents dans le dépôt).
