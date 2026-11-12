# Mode secours : version sans tâches planifiées

## Principe

Le secours n'est plus une copie séparée du code dont on a supprimé les tâches (`f6e0ab24`). C'est le **même code**, avec un
interrupteur :
- `SCHEDULER_ENABLED=false` ;
- en option, `SCHEDULER_START_DELAY_SECONDS=0`.

Ce que cela change :
- **Une seule version** à construire, tester et maintenir. Les protections Stripe de la PR #16 et le verrou partagé de la PR
  #17 sont donc présents dans les deux modes.
- **Plus rapide.** On bascule en changeant une variable puis en redémarrant le service, sans redéployer une autre révision.
- **Retour simple.** On remet la variable à `true`.

Cette branche (`rescue/stripe-guarded-no-scheduler`) réunit le commit exact de la PR #16 (`76a803bb`) et la PR #17. Elle sert
à construire et vérifier le candidat. **Elle n'est pas destinée à être fusionnée telle quelle** : la mise en production passe
par les PR #16 et #17.

## Effets du mode secours (à accepter explicitement avant usage)

| Arrêté | Conservé |
|---|---|
| Relances automatiques de devis (`followups`) | Site public, inscription, connexion, devis, relances manuelles |
| Lecture des réponses aux devis et de la boîte IMAP | Webhooks Stripe et leurs contrôles de mode, compte et prix |
| File de prospection, alimentation et séquences commerciales | Checkout et portail (s'ils sont prêts selon `/api/readiness`) |
| Résumé du matin, rappels de fin d'essai, emails de cycle de vie | Calcul des droits Pro et des essais (fin d'essai appliquée à la lecture du profil) |
| Traitements de démarrage (`trials`, IMAP, alimentation, pilotes) et `POST /api/cron/run` (réponse 503) | |

Pour reprendre les traitements après une période en mode secours : remettre `SCHEDULER_ENABLED=true`. Les relances dues
pendant l'arrêt partent alors au premier passage, selon les règles existantes (plafonds, J+7, désinscriptions). **Vérifier
leur nombre avant de réactiver.**

## Construire et vérifier (reproductible, sans déploiement)

- **Automatiquement.** À chaque push sur une branche `rescue/**`, GitHub Actions lance
  `.github/workflows/rescue-image.yml`, qui exécute `scripts/rescue/verify-image.sh`.
- **En local**, avec Docker :

```bash
scripts/rescue/verify-image.sh relanzio-rescue:verify
```

Le script :
1. construit l'image avec le `Dockerfile` du dépôt. La construction exécute aussi `npm run check`, donc toute la suite de
   tests, puis `npm run build` et le contrôle mobile ;
2. lance le conteneur en mode secours, dans un **réseau Docker interne sans accès Internet**, avec uniquement des valeurs
   fictives ;
3. vérifie depuis ce réseau :
   - santé 200 ;
   - accueil et page tarifs 200 ;
   - `POST /api/cron/run` en 503 ;
   - disponibilité non prête, car Stripe est injoignable et c'est attendu ;
   - **aucune requête** vers la base (un faux Supabase enregistre tout) ;
   - aucun secret dans les journaux ;
   - aucune tentative de tâche ;
4. affiche l'empreinte de l'image.

Le test `test/emergency-mode.test.js` complète cette vérification. Il prouve qu'en mode secours, avec une configuration Live
fictive servie en local, le serveur devient **prêt**. Ses seules requêtes sortantes sont alors les deux lectures Stripe :
compte et prix.

## Limites

- **Builder Railway.** Railway construit l'application avec son propre builder (Railpack), pas avec ce `Dockerfile`. L'image
  vérifiée ici est représentative du code et des dépendances, mais pas identique au conteneur Railway. Avant de compter
  dessus, vérifier dans Railway le builder, la commande de démarrage et le contrôle `/api/readiness`.
- **Pas de coordination pendant le basculement.** Le mode secours ne synchronise rien avec une ancienne instance encore
  active. Si l'ancienne instance n'utilise pas encore le verrou partagé, ses tâches continuent jusqu'à son arrêt par Railway.
- **Actions de production.** Basculer en production (variable Railway, redémarrage) est une action de production qui demande
  l'accord explicite du propriétaire.
