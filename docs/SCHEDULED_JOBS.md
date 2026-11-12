# Tâches planifiées : verrou partagé, mode secours, mise en service

## Le problème

Le serveur lance dix tâches planifiées (`node-cron`) et cinq traitements au démarrage. L'option `noOverlap` empêche deux
exécutions simultanées **dans un même processus**, pas dans deux processus. Pendant un déploiement Railway, l'ancienne et la
nouvelle instance tournent en même temps : la même tâche (relances, séquences commerciales, lecture des réponses…) pouvait
donc s'exécuter deux fois en parallèle. Les traitements de démarrage s'exécutaient même immédiatement, au moment précis où
l'ancienne instance était encore active.

## La solution

Une réservation (« bail ») par tâche dans PostgreSQL : table `scheduled_job_leases`, fonctions `claim_scheduled_job`,
`renew_scheduled_job` et `release_scheduled_job` (migration `20261112100000_scheduled_job_leases.sql`), utilisées par
`server/job-lease.js`.

- Avant chaque exécution, le processus demande le bail. S'il est détenu par un autre processus, la tâche est **sautée**.
- Si la base ne répond pas, la tâche est **sautée** : jamais d'exécution sans bail.
- Pendant l'exécution, le bail est renouvelé tous les tiers de sa durée. Une tâche longue garde donc son bail.
- À la fin, le bail est libéré, après vérification en base du propriétaire et du numéro de bail.
- Un processus qui plante cesse de renouveler son bail. Celui-ci expire, puis un autre processus reprend la tâche.
- Chaque nouveau bail reçoit un numéro croissant. Un ancien propriétaire ne peut ni renouveler ni libérer le bail de son
  successeur.
- **Écart minimal entre deux exécutions.** Les deux instances déclenchent la même minute cron. Sans cet écart, la seconde
  rejouerait la même échéance juste après la libération du bail par la première.

| Tâche | Fréquence | Durée du bail | Écart minimal |
|---|---|---:|---:|
| `followups` (relances de devis) | 15 min | 840 s | 300 s |
| `trials` (fin des essais) | 15 min | 600 s | 300 s |
| `outreach` (file de prospection) | 10 min | 540 s | 240 s |
| `quote-replies` (réponses aux devis) | 2 min | 110 s | 60 s |
| `imap-replies` (boîte de réponses) | 10 min | 540 s | 240 s |
| `commercial-feeder` | 10 min | 540 s | 240 s |
| `commercial-sequence` | 5 min | 270 s | 120 s |
| `morning-digest`, `trial-ending`, `lifecycle` | 1 fois par jour | 1 800 s | 3 600 s |
| Traitements de démarrage `pilot-*` | au démarrage | 600 s | 0 |

Au démarrage, les traitements `trials`, `imap-replies` et `commercial-feeder` utilisent le même bail que leur tâche cron.

## Variables

| Variable | Défaut | Effet |
|---|---|---|
| `SCHEDULER_ENABLED` | `true` | `false` coupe toutes les tâches planifiées et tous les traitements de démarrage. `POST /api/cron/run` répond alors 503. C'est le **mode secours**. |
| `SCHEDULER_START_DELAY_SECONDS` | `120` | Aucune tâche pendant ce délai après le démarrage, le temps que Railway arrête l'ancienne instance. |

Le mode secours ne prolonge pas les essais : l'accès Pro est calculé à partir de la date de fin d'essai, et la régularisation
se fait aussi à la lecture du profil (`settleExpiredTrial`). En revanche, il suspend :
- les relances automatiques ;
- la lecture des réponses ;
- les séquences commerciales ;
- les emails de cycle de vie et le résumé du matin.

`POST /api/cron/run` (relances, déclenchement manuel) passe aussi par le bail. Il répond 409 `{ "skipped": … }` si la tâche
tourne ailleurs ou si l'instance est encore dans son délai de démarrage.

## Ordre de mise en service (chaque étape demande l'accord du propriétaire)

1. **Appliquer la migration** dans Supabase production. Elle ajoute une table et trois fonctions, sans toucher aux données
   existantes.
   - Sans elle, le nouveau code ne trouve pas les fonctions et saute **toutes** les tâches. C'est sûr, mais les relances
     s'arrêtent.
   - Mettre ensuite à jour `ops/backup/migration-map.json` : remplacer `pending_deployment` par la version enregistrée dans
     l'historique.
2. **Déployer.**
   - L'ancienne instance n'utilise pas encore de bail. Le délai de démarrage de 120 s laisse à Railway le temps de l'arrêter
     avant toute tâche de la nouvelle.
   - Une fois toutes les instances équipées, les déploiements suivants sont protégés par le bail lui-même.
3. **Contrôler les journaux.**
   - Attendu : `JOB_SKIPPED_STARTUP_GRACE` au démarrage, puis des `JOB_LEASE_HELD_ELSEWHERE` occasionnels si deux instances
     se chevauchent.
   - Anormal : aucun `JOB_LEASE_UNAVAILABLE` (base ou migration absente) ni `JOB_LEASE_LOST` ne doit apparaître.

Retour arrière : redéployer la version précédente, qui ignore la table. Ne supprimer la table qu'après
(`supabase/rollbacks/20261112100000_scheduled_job_leases.down.sql`).

## Sauvegarde

La table `scheduled_job_leases` fait partie du schéma `public` : la sauvegarde v2 la couvre automatiquement, ce qui fait
passer la base à 22 tables. Elle ne contient que l'état des baux, sans donnée client. Après une restauration, un bail
restauré expire au plus tard au bout de 30 minutes. Les tâches reprennent ensuite normalement.

## Ce que le verrou ne garantit pas

- **Exactement une fois pour les effets externes.** Si le fournisseur d'email accepte un envoi juste avant un plantage,
  l'exécution suivante peut renvoyer le message, sauf si la tâche l'a enregistré de façon idempotente. Les tâches d'envoi
  existantes ont déjà leurs propres protections (réservation des créneaux, `sendOnce`, statuts de file). Le verrou s'ajoute
  à ces protections, il ne les remplace pas.
- **Processus figé plus longtemps que le bail.** Exemple : machine suspendue. Le bail passe à un autre processus. Au réveil,
  l'ancien détecte la perte au renouvellement suivant (`JOB_LEASE_LOST`) et son signal d'arrêt est déclenché, mais les tâches
  existantes ne consultent pas encore ce signal. Elles terminent donc leur lot en cours.
- **Ancienne instance sans bail.** Elle n'est couverte que par le délai de démarrage lors du **premier** déploiement de ce code.

## Tests

- `test/sql/scheduled_job_leases.test.sql` : sémantique SQL, entrées invalides, droits (rien pour `anon` et
  `authenticated`), RLS.
- `test/job-lease.test.js` : module Node, avec base simulée.
- `test/job-lease-processes.test.js` : **processus Node indépendants** contre un vrai PostgreSQL. Scénarios testés :
  - exclusion mutuelle ;
  - même échéance cron déclenchée par trois processus ;
  - tâche plus longue que son bail ;
  - arrêt brutal (`SIGKILL`) puis reprise après expiration ;
  - processus figé (`SIGSTOP`) puis perte du bail détectée.

  Exécution obligatoire en CI. En local :
  `JOB_LEASE_PG_URL=postgresql://postgres@127.0.0.1:<port>/postgres node --test test/job-lease-processes.test.js`
  (serveur jetable local uniquement).
- `test/scheduler-process.test.js` : le vrai serveur, avec un faux Supabase local. Il vérifie que :
  - le mode secours ne fait aucune requête ;
  - rien ne s'exécute pendant le délai de démarrage ;
  - sans bail, aucune tâche ne touche la base.
