# Fiabilité des notifications Stripe

Correctif destiné à `staging`, sans migration de base. Aucun tarif, essai, paramètre Stripe ou réglage d’envoi d’email n’est modifié.

## Comportement

- Une erreur de lecture/écriture de la base fait échouer le traitement (`BILLING_DB_ERROR`) : réponse HTTP 503, donc nouvelle livraison possible.
- Un profil absent est distinct (`BILLING_PROFILE_NOT_FOUND`). Aucun profil n’est créé par le webhook. Un abonnement non encore rattaché attend le Checkout (`BILLING_SUBSCRIPTION_NOT_LINKED`). Ces situations restent à reprendre, plutôt qu’être acquittées silencieusement.
- Les événements non concernés, les factures hors abonnement et les événements anciens/d’un autre abonnement sont acquittés avec un motif explicite.
- Seul un événement avec `processed_at` renseigné est un doublon terminé. Un traitement en cours renvoie 503. Après cinq minutes, une tentative interrompue peut être reprise atomiquement en utilisant `created_at` comme date de réservation. Cette colonne représente alors le début de la dernière tentative, pas nécessairement la première réception.
- L’ancienne tentative ne peut ni effacer ni terminer la réservation d’une autre tentative. Une réponse perdue après validation en base ne supprime pas l’événement terminé.
- Les droits proviennent d’une lecture de l’abonnement Stripe actuel, avec contrôle de son identifiant et de son client. Aucune activation de secours à partir du seul contenu d’une facture payée. Une souscription supprimée et réellement absente de Stripe retire les droits.
- L’écriture du profil compare son état initial en base, y compris ses droits et dates. Une modification concurrente impose une reprise et une nouvelle lecture Stripe, même pour deux événements datant de la même seconde.
- La signature invalide donne HTTP 400 ; les échecs de traitement donnent HTTP 503, même si la journalisation des erreurs échoue.

## Tests

`npm run check` exécute notamment les événements fictifs signés avec le SDK Stripe et la base isolée en mémoire. `test/stripe-retry-safety.test.js` injecte pannes de lecture, écriture, nettoyage, réponse perdue après validation, doublons et concurrence contrôlée.

`test/sql/stripe_retry_safety.test.sql`, inclus dans `npm run test:sql`, vérifie sur PostgreSQL jetable l’unicité, les comparaisons de dates, les réservations, la protection contre l’ancien propriétaire et une écriture à partir d’un état périmé. Aucun changement du schéma n’est nécessaire.

## Limites et vérification avant mise en service

- Pas de connexion à Stripe Live, pas de paiement réel, pas d’email envoyé, pas de modification Supabase en production pendant cette préparation.
- Les simulations ne remplacent pas un essai de bout en bout Stripe Test → application isolée → Supabase/PostgREST de test. Vérifier également les événements souscrits sur le point de terminaison Stripe, dont `customer.subscription.created`.
- Un profil définitivement supprimé ou une association incorrecte continue de produire une erreur explicite ; l’exploitant doit examiner le cas. Les nouvelles tentatives Stripe sont limitées dans le temps : surveiller les erreurs persistantes et prévoir une relivraison après réparation. Ce correctif ne rejoue pas les anciens événements déjà acquittés par l’ancienne version.
- La reprise des réservations dépend d’horloges serveur synchronisées. La protection des droits n’est pas une transaction englobant Stripe et PostgreSQL ; un changement côté Stripe sera réconcilié par sa prochaine notification.
- Les journaux produit et le mécanisme d’email existants ne deviennent pas une file transactionnelle garantissant une livraison externe exactement une fois. Les tests garantissent les droits et les réponses du webhook, pas une livraison d’emails réels.
- PR distincte de la restauration (#15). Fusion et déploiement soumis à l’accord du propriétaire.
