# Fiabilité des notifications Stripe

Correctif destiné à `staging`, sans migration de base. Aucun tarif, essai, paramètre Stripe ou réglage d’envoi d’email n’est modifié.

## Comportement

- Une erreur de lecture/écriture de la base fait échouer le traitement (`BILLING_DB_ERROR`) : réponse HTTP 503, donc nouvelle livraison possible.
- Un profil absent est distinct (`BILLING_PROFILE_NOT_FOUND`). Aucun profil n’est créé par le webhook. Un abonnement non encore rattaché attend le Checkout (`BILLING_SUBSCRIPTION_NOT_LINKED`). Ces situations restent à reprendre, plutôt qu’être acquittées silencieusement.
- Les événements non concernés, les factures hors abonnement et les événements anciens/d’un autre abonnement sont acquittés avec un motif explicite.
- Seul un événement avec `processed_at` renseigné est un doublon terminé. Un traitement en cours renvoie 503. Après cinq minutes, une tentative interrompue peut être reprise atomiquement en utilisant `created_at` comme date de réservation. Cette colonne représente alors le début de la dernière tentative, pas nécessairement la première réception.
- L’ancienne tentative ne peut ni effacer ni terminer la réservation d’une autre tentative. Une réponse perdue après validation en base ne supprime pas l’événement terminé.
- Les droits proviennent d’une lecture de l’abonnement Stripe actuel, avec contrôle de son identifiant et de son client. Aucune activation de secours à partir du seul contenu d’une facture payée. Un abonnement résilié doit être relu avec son état `canceled`. Une erreur 404 ne prouve pas une résiliation et ne modifie aucun droit : elle peut signaler un mauvais compte ou mode.
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

## Séparation Test / Live (renforcement du 8 novembre 2026)

Avant toute réservation en base, même pour un doublon terminé, le traitement exige :

- `STRIPE_EXPECTED_MODE` explicitement `live` ou `test`, cohérent avec le préfixe de la clé et `event.livemode` (booléen obligatoire). Le mode Test est refusé si `NODE_ENV=production`, si la base est la production Relanzio connue, ou si `APP_URL` désigne relanzio.com.
- `STRIPE_EXPECTED_ACCOUNT_ID` explicite et identique au compte retourné par la même connexion Stripe. Les champs `event.account`/`event.context`, lorsqu’ils existent, doivent correspondre ; leur absence est normale pour les événements du compte direct.
- `STRIPE_PRO_PRICE_ID` exact, relu dans ce compte et ce mode : 2 900 centimes EUR par mois. Aucun choix automatique entre tarifs Test et Live.

Avant de modifier les droits, le client et l’abonnement relus doivent avoir le bon mode et la même métadonnée `user_id` que le profil. L’abonnement doit correspondre au client de l’événement, avec un seul article complet, quantité 1 et le tarif Pro exact. Le Checkout contrôle aussi `client_reference_id` si renseigné. Les événements anciens ou d’un autre abonnement restent ignorés sans changement des droits.

Le Checkout et le portail vérifient également le compte, le mode, le tarif et le propriétaire du client avant leurs opérations Stripe. Aucun paramètre de production n’a été ajouté ou changé par cette PR.

Une incohérence ou panne de vérification produit une erreur 503, sans marquer l’événement traité. Cela préserve les reprises après correction, mais les erreurs permanentes exigent une intervention ; les erreurs de mode ne seront pas réglées par une simple répétition.

### Conditions préalables au déploiement — non exécutées

1. Confirmer depuis le service son compte et son mode réels. Ne pas déduire cette information du nom des variables.
2. Après accord explicite, définir `STRIPE_EXPECTED_MODE=live` et l’identifiant public du compte attendu, vérifier la clé Live, le tarif Live exact et le secret du webhook Live. Ces deux nouvelles variables sont obligatoires : sans elles, la facturation est bloquée volontairement.
3. Vérifier les six événements souscrits : `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`.
4. Terminer les essais isolés et les contrôles GitHub, puis obtenir un accord distinct pour la fusion et le déploiement.
5. Traiter séparément les anciennes associations Test avec sauvegarde et préconditions ; cette PR ne nettoie ni les profils ni les événements historiques.

### Couverture et limites supplémentaires

`test/stripe-boundary.test.js` utilise exclusivement des objets fictifs et une base mémoire, y compris un événement Test signé. Il couvre les modes, comptes, prix, quantités, propriétaires, erreurs de lecture Stripe, doublons et reprises. Les tests de cycle de vie utilisent un abonnement résilié toujours consultable ; le cas 404 est testé séparément et conserve les droits jusqu’à clarification.

Les contrôles ajoutent des lectures Stripe par notification : une indisponibilité Stripe bloque temporairement le traitement et impose une reprise. Aucune mutation Stripe n’est effectuée par le webhook. L’identification de la production contient les coordonnées connues de Relanzio : une migration de domaine/base devra conserver `NODE_ENV=production` et réviser ces garde-fous. Les événements historiques ne contiennent pas tous leur mode ou compte en base ; aucune réparation automatique n’est supposée sûre.
