# Pilote entretien — exploitation et limites

**Code pour revue uniquement. Aucune fusion ou mise en production autorisée.**
La PR est basée sur main (380e6c7), alors que la production connue est staging/e41f138. Ne pas déployer la branche main : elle omet 334 commits. Un réalignement ou une stratégie explicitement approuvée est indispensable, même si le test local de compatibilité réussit.

## Démarrage isolé

Appliquer uniquement la migration `20261016141934_maintenance_pilot.sql` dans une base de développement dédiée. Elle ne modifie aucune table existante. Le script de test PGlite applique réellement le SQL dans un PostgreSQL embarqué jetable ; il ne certifie ni les régions ni la configuration du projet Supabase de production.

Les flags de `.env.example` restent tous false. Pour une revue locale, utiliser des paramètres fictifs : visibilité et publication true, identité professionnelle fictive, UUID opérateur de test. Ne pas copier le `.env` de production. Ne pas lancer les scripts hérités `qa-*` : certains contactent les fournisseurs. Le module pilote n'ajoute aucun cron et n'utilise aucune fonction IA.

- `npm ci`, `npm run check`, `npm run build`.
- `npx playwright install chromium`, `npm run test:pilot:browser`.
- Les tests du vrai serveur nettoient les variables fournisseurs, interdisent le réseau externe et détruisent leurs crons.

## Parcours opérateur

Toutes les routes sont sous `/api/maintenance-pilot`. Les routes opérateur requièrent un Bearer token validé par Supabase et un UUID dans `MAINTENANCE_PILOT_OPERATOR_IDS` (liste serveur, vide par défaut). Ne pas utiliser user_metadata pour accorder un rôle.

1. GET `/cases` : dossiers non affectés et dossiers de l'opérateur. POST `/cases/:id/claim` : attribution atomique d'un dossier libre. GET `/cases/:id` : lecture réservée à son opérateur.
2. POST `/cases/:id/campaign` : corps JSON avec `senderName`, `senderEmail`, `replyTo`, `subject`, `body`, `followup`, `startsAt` (ISO), `segment:"contract_only"`. Les adresses doivent finir par `.invalid`. Toute modification annule l'approbation. Une campagne ayant des simulations ne peut pas être réécrite. La réservation du premier Checkout fige également la campagne, avant tout appel Stripe. Un dossier possède au maximum une réservation/session de paiement ; une session expirée impose une intervention, jamais un nouveau paiement automatique.
3. POST `/cases/:id/approve` avec `{}` : valide cette version du texte, de l'expéditeur, des dates et du segment, pour simulation seulement.
4. POST `/cases/:id/checkout` avec `{}` : disponible seulement avec flag paiement et clé TEST dédiée `MAINTENANCE_PILOT_STRIPE_TEST_KEY`. Aucun fallback sur Stripe Pro. Le SDK refuse les clés Live. Aucun paiement n'est requis pour une simulation.
5. POST `/cases/:id/simulate` avec `addresses` (liste `.invalid`), `step` (1 ou 2), `at` (heure fictive ISO), `outcome` (`simulated` ou `unknown_delivery`). Aucun email n'est envoyé. Le temps fourni est une horloge de simulation, jamais un calendrier réel.
6. POST `/cases/:id/signal` avec `address`, `kind` (`stop`, `reply`, `bounce`, `complaint`, `appointment`) : bloque la suite. POST `/cases/:id/review-replies` avec `{}` enregistre la vérification humaine à l'heure serveur ; le J+10 doit être dans les 24 heures suivant cette vérification. Pour tester sans attendre, choisir un J0 situé 10 jours dans le passé et un J+10 à l'heure courante.
7. GET `/cases/:id/report` ou `?format=csv` : statistiques de simulation uniquement. Délivrés et RDV planifiés restent inconnus ; les champs ne doivent pas être présentés comme des résultats réels.

Une mise à jour concurrente retourne CASE_CONFLICT : relire le dossier et réévaluer l'action. Ne jamais répéter aveuglément une commande. Les états unknown_delivery ne sont jamais retentés automatiquement. Même dans une future version réelle, une réponse HTTP perdue après acceptation fournisseur exige un rapprochement humain.

## Paiement

Le webhook dédié `/stripe/webhook` utilise le corps brut et un secret TEST dédié. Vérifier l'événement, mode payment, EUR, 19000 centimes, dossier et session connus, et payment_status=paid. La transaction enregistre paiement et événement ensemble. Le retour navigateur ne vaut pas preuve. Le webhook SaaS ignore explicitement les événements pilote avant toute écriture liée à Pro.

Aucun lien Live, produit Stripe Live, souscription, débit, remboursement ou configuration fournisseur n'a été créé. Pour cette version, les paiements TEST disparaissent avec le dossier à J+30. Une activation future doit prévoir une conservation comptable distincte et ne peut pas se limiter à changer un flag.

## Avant le premier fichier réel — toutes les validations requises

Le point d'entrée `/files` est fermé avec HTTP 423 avant parsing, et aucun bucket ou URL signé réel n'est fourni. Les flags personal_data/sends ne peuvent pas retirer cette barrière.

- Contrat de service et DPA revus et signés ; instructions et finalité documentées.
- Contrôle juridique individuel ; anciens clients hors contrat maintenus `pending_legal_validation`, jamais autorisés par défaut. Possibilité de limiter le service aux contrats actifs uniquement.
- Liste des prestataires, régions et transferts validés pour Railway, Supabase, Brevo et sauvegardes. Railway `sfo` empêche actuellement la promesse « exclusivement UE ». Le bucket de sauvegardes `ams` ne résout pas le traitement applicatif hors UE.
- MFA, accès opérateur, stockage privé, isolation dossier et URLs signées à courte durée testés dans un environnement séparé. Limites MIME/taille, rejet des fichiers malformés, journalisation sans contenu et purge des sauvegardes à vérifier.
- Aucune donnée nominative dans Git, sur le poste local ou envoyée à une IA. Les coordonnées professionnelles de demande de diagnostic sont distinctes des données des clients finaux.
- Paiement et disponibilité opérationnelle confirmés avant de demander le vrai fichier. Ne pas encaisser tant que le service ne peut pas respecter la garantie de délai.

## Avant le premier envoi réel

Nouvelle modification revue nécessaire : aucun transport réel n'existe ici. Vérifier toutes les gates précédentes et l'approbation de campagne, sans auto-activation à l'upload ou au paiement. Expéditeur contrôlé/authentifié, SPF/DKIM/DMARC et reply-to testés. Pas d'usurpation d'adresse de l'artisan. Les jetons de STOP/RDV devront être opaques, liés au dossier, sans effet sur GET ; leurs routes actuelles retournent 423 sans mutation. Prévoir un contrôle des réponses de l'artisan avant J+10, car sa boîte n'est pas consultée automatiquement. Zéro réponse commerciale envoyée à sa place.

## Conservation et purge

Le questionnaire ne reçoit pas de fichier. Ses comptes détaillés sont effacés après 7 jours ; le dossier et ses simulations/paiements TEST après 30 jours. L’opérateur doit exécuter la purge chaque jour et vérifier son résultat ; aucune planification de production n’est créée par cette PR. La purge est une transaction et cascade uniquement dans les tables dédiées. Commande explicitement manuelle :

```
node scripts/maintenance-pilot-purge.mjs --confirm-pilot-database-purge
```

Elle exige `MAINTENANCE_PILOT_DB_URL` et `MAINTENANCE_PILOT_DB_KEY` explicitement définis, sans fallback aux clés SaaS. Ne pas l'exécuter sur la production dans cette mission. L'opérateur peut aussi appeler POST `/purge` avec `{}` : action globale sur les dossiers expirés uniquement, réservée aux opérateurs nommés.

Son résultat est `scope:database_only`, jamais une attestation de suppression complète. Avant une future attestation réelle, vérifier les fichiers, Brevo et la politique de restauration/expiration des sauvegardes. Toute erreur interdit l'attestation. En cas d'incident : contenir, conserver uniquement les preuves nécessaires, informer le responsable artisan selon la procédure contractuelle (objectif 48 h maximum), documenter correction et obligations de notification avec conseil compétent.

## Retour arrière et ouverture future

Désactiver visibilité et paiement pilote ; ne pas modifier les flags SaaS. Revert des points d'entrée et du module si nécessaire, sans supprimer de tables existantes. Aucune migration destructive proposée. Toute incompatibilité non résolue avec e41f138 bloque un futur déploiement ; la réussite des tests ne résout pas la divergence Git.
