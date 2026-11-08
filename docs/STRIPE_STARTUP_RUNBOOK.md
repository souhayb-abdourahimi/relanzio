# Démarrage et mise en service Stripe — PR #16

Préparation uniquement. Production : branche `staging`, service Railway `relanzio`, base Supabase `relanzio-staging`. Aucun changement de ces services n’est effectué par cette PR. Pas de migration ni de nettoyage automatique.

## Contrôles réellement effectués

Le serveur ouvre ses routes sans attendre Stripe. Un moniteur démarre en parallèle et vérifie :

- présence de `STRIPE_EXPECTED_MODE`, `STRIPE_EXPECTED_ACCOUNT_ID`, `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID` et `STRIPE_WEBHOOK_SECRET` ;
- mode explicitement Live en production, cohérent avec le préfixe de la clé ;
- identité du compte obtenue via GET Stripe ;
- identifiant exact du tarif actif dans le même mode, 2 900 centimes EUR par mois. Un tarif archivé interdit une nouvelle souscription ; les notifications des abonnements existants conservent leur traitement protégé.

Le secret du webhook est vérifié uniquement pour sa présence. **Ni sa correspondance avec l’endpoint ni les événements souscrits ne sont prouvés par ce contrôle.** Les contrôles du client, de l’abonnement et du propriétaire restent effectués lors des opérations et des notifications, comme dans le renforcement précédent.

La vérification est bornée à 5 secondes ; les requêtes SDK de ce contrôle ont un délai de 2,5 secondes et aucune reprise interne. Une nouvelle vérification est effectuée toutes les 30 secondes. Un résultat positif vieux de plus de 60 secondes n’est plus utilisable. Les vérifications simultanées sont regroupées. Une réponse tardive après expiration ne rétablit pas un résultat périmé.

Checkout et portail demandent une vérification fraîche avant toute lecture/modification de profil ou opération Stripe (l’authentification utilisateur précède ce contrôle). Une configuration erronée ou une indisponibilité produit HTTP 503. Les webhooks conservent leurs propres contrôles de configuration/identité et leur gestion des reprises ; le moniteur n’acquitte aucun événement.

## États et diagnostics

| État | Signification | Conséquence |
|---|---|---|
| `pending` | Vérification initiale non terminée | Facturation non déclarée prête |
| `ready` | Compte et tarif vérifiés récemment | Facturation autorisée sous réserve des autres contrôles |
| `configuration_error` | Paramètre absent/incohérent, authentification, permission ou ressource manquante | Intervention de configuration requise |
| `temporarily_unavailable` | Réseau, limite API, erreur serveur Stripe ou délai dépassé | Refus temporaire ; recontrôle automatique |
| `verification_error` | Erreur non classée | Refus sécurisé, investigation nécessaire |
| `stale` | Vérification trop ancienne | Aucun ancien feu vert réutilisé |

Les diagnostics contiennent uniquement état, code issu d’une liste fermée, date et message prédéfini. Aucun message brut du prestataire, clé, secret, identifiant client, email ou donnée bancaire n’est repris par le moniteur. Les transitions vont vers les journaux du processus, sans écriture Supabase. Une panne ou un blocage du récepteur de diagnostic ne bloque pas la vérification.

`GET /api/admin/readiness` expose le diagnostic détaillé uniquement à un administrateur authentifié. `GET /api/readiness` ne retourne que `{ready:true|false}`, sans cache. Son état intègre aussi les contrôles de présence Supabase et Brevo déjà existants : il ne constitue pas un test de fonctionnement complet de ces deux services.

## Railway : disponibilité et pages publiques

- `/api/health` : HTTP 200 si le serveur répond, indépendamment de Stripe. Ce contrôle de vie n’affirme **pas** que les paiements fonctionnent.
- `/api/readiness` : HTTP 503 tant que Stripe n’est pas vérifié ou ne l’est plus, HTTP 200 lorsque les conditions de disponibilité sont remplies.
- Les routes publiques ne sont pas placées derrière le contrôle Stripe. Une panne Stripe après mise en service ne déclenche ni arrêt du processus ni blocage global des pages publiques.

Pour la future bascule, Railway devra utiliser `/api/readiness`, **pas `/api/health`**, comme contrôle de déploiement. Railway attend un HTTP 200 avant de basculer et n’utilise pas ce contrôle comme surveillance continue après mise en service : https://docs.railway.com/deployments/healthchecks . Une nouvelle version peut donc rester en attente pendant une panne Stripe, tandis que l’ancienne continue de servir.

Ne pas configurer un moniteur externe pour redémarrer/retirer automatiquement le site à chaque 503 de disponibilité Stripe. Alerter l’opérateur ; utiliser le contrôle de vie pour détecter un arrêt réel. L’état peut refléter la dernière vérification pendant au plus environ 35 secondes après une panne entre deux passages (30 secondes plus le délai du contrôle). Chaque ouverture Checkout/portail refait la vérification.

## Laboratoire isolé

`npm run check` inclut :

- tests du moniteur : paramètres absents, mauvais mode/compte/tarif, authentification, permissions, réseau, limite API, erreur serveur, délai, expiration, concurrence, reprise périodique et diagnostics expurgés ;
- vrai SDK Stripe dirigé vers une API HTTP locale, uniquement GET pendant la vérification ;
- vrai processus `server/index.js` avec environnement neuf, sans secrets hérités ni chargement de `.env` ; API Auth/base fictive et transport Stripe dirigé vers localhost, sorties HTTP/HTTPS externes bloquées par le préchargement de test ;
- démarrage refusé pour paramètres manquants ou mode Test en production, Checkout/portail en 503, contrôle de vie en 200 ;
- démarrage valide, panne API, diagnostic administrateur, puis reprise sans redémarrage ; aucun paiement ni email ;
- suites existantes : paiement fictif, renouvellement, impayé, résiliation, signature, doublons, événements désordonnés, pannes de base, concurrence et reprises.

Ces essais ne remplacent pas Stripe Test → application isolée → Supabase/PostgREST réels. Aucun compte ni donnée de production ne sont utilisés. Les réponses locales sont fictives ; les essais en mémoire ne démontrent pas seuls les contraintes SQL, couvertes séparément dans la CI sur PostgreSQL jetable.

## Conditions bloquantes avant une future mise en service

Chaque modification externe ci-dessous nécessite une autorisation explicite. Aucune n’est exécutée par ce document.

1. Valider la CI du commit exact à déployer et conserver l’artefact/revision de secours protégée ci-dessous. Terminer ou accepter explicitement la limite du parcours Stripe/Supabase réel isolé.
2. Confirmer les réglages de déploiement Railway : déclenchement automatique de `staging`, contrôle de disponibilité, délai d’attente, chevauchement/arrêt gracieux, tâches planifiées et risque de double exécution. Aucun engagement de zéro interruption sans ce contrôle.
3. Préparer ensemble, sans déploiement intermédiaire : `STRIPE_EXPECTED_MODE=live`, `STRIPE_EXPECTED_ACCOUNT_ID=acct_1ULsznKCFRBUYZk8` (identifiant public), clé Live, tarif Live exact à 29 €/mois et secret du webhook Live. Vérifier les permissions API nécessaires aux GET de compte, tarif, client et abonnement. Ne jamais afficher les secrets. Le réglage existant `BILLING_ENABLED` doit correspondre à la disponibilité commerciale souhaitée ; la readiness vérifie la configuration, pas une activation commerciale.
4. Faire approuver et isoler l’ancien webhook Test vers la production ; vérifier le secret de l’endpoint Live et les six événements listés dans `STRIPE_RETRY_SAFETY.md`. Ne pas tester un événement Test contre la production. Aucun rejeu historique.
5. Traiter séparément les sept associations Test selon le plan approuvé. Cette PR ne les répare pas : les faux Pro restent affichés et les anciennes associations peuvent bloquer Checkout/portail jusqu’au nettoyage ciblé. Le client Live correct reste hors périmètre du nettoyage.
6. Vérifier que les envois et automatismes non autorisés restent désactivés. Ne pas profiter du déploiement pour changer ces réglages.
7. Obtenir l’accord de fusion et de déploiement, coordonnés si Railway déploie automatiquement `staging`. Ne basculer que lorsque la nouvelle instance passe `/api/readiness` ; conserver l’ancienne en cas d’échec de préparation.
8. Après bascule : contrôler vie, readiness et diagnostic administrateur, pages publiques, absence d’erreurs de configuration/signature, traitements en attente et droits. Contrôles sans paiement, email ni rejeu ; un test réel nécessiterait un accord séparé.

## Retour arrière protégé

Révision de secours proposée : **`7c0063594969a620f7ba82a2c5479c1202c37e85`**, déjà publiée dans la PR #16 avant l’ajout du moniteur, CI 158 réussie. Elle conserve la séparation mode/compte/tarif/propriétaire, l’idempotence et les reprises. Elle exige les mêmes deux variables. Elle n’a jamais été déployée : il faut préparer et vérifier son artefact avant de la considérer disponible pour un retour arrière Railway. Un bouton « rollback » vers l’ancienne production ne suffit pas.

Cette révision n’a pas le nouveau diagnostic de disponibilité : son HTTP 200 ne prouve pas une vérification Stripe. Avant son activation, vérifier la configuration avec le même diagnostic GET sécurisé et revalider les protections sur son artefact. Préparer un contrôle de démarrage équivalent pour l’artefact de secours si l’on veut conserver la même garantie de bascule ; cette préparation et tout changement associé devront être examinés avant déploiement.

Déclencheurs : attribution de droits incohérents, erreurs persistantes de configuration/signature, régression du parcours ou instabilité de la nouvelle version. Une panne générale Stripe appelle d’abord une attente/reprise, pas un changement de code qui ne la résoudrait pas.

Procédure, après accord : arrêter les étapes de nettoyage, conserver les diagnostics expurgés, vérifier que la révision de secours et ses paramètres sont prêts, puis remplacer seulement la version applicative. Conserver le mode Live, le compte attendu et l’isolation Test. Ne pas réactiver le webhook Test, ne pas retirer les garde-fous et ne pas restaurer globalement Supabase. Toute correction de données constitue une intervention séparée sous préconditions de concurrence.

**Interdit comme secours :** `main` ou l’ancien commit de production dépourvu de séparation Test/Live. Si aucun artefact protégé n’est prêt, ne pas lancer le déploiement. Une suspension ciblée de la facturation serait une mesure exceptionnelle à faire autoriser, pas une action automatique.

## Pré-déploiement sans écriture — correctif proposé

La configuration Railway actuelle exécute `node server/qa-predeploy-final.mjs`. Dans la PR uniquement, ce fichier ne lance plus les trois anciens scripts QA. Il vérifie la présence des paramètres indispensables et utilise le contrôle Stripe GET existant, sans importer le serveur, un client Supabase, des migrations, des tâches planifiées ou un système d’email. Un code non nul bloque le déploiement si la configuration est incorrecte ou si Stripe est indisponible ; aucun message brut du fournisseur ou secret n’est affiché.

Il ne lance pas un serveur factice et n’exige donc pas que ce serveur réponde 200. Railway contrôle séparément `/api/readiness` sur la nouvelle instance : un 503 maintenu empêche la bascule. `/api/health` reste un contrôle de vie. Aucune option de test de la commande ne permet de désactiver la vérification Stripe.

Les deux suites QA historiques qui écrivent et suppriment des données refusent maintenant toute exécution sans `NODE_ENV=test`, sans activation explicite `ALLOW_LOCAL_DESTRUCTIVE_QA=true`, ou sans URLs Supabase et application en boucle locale. Elles refusent aussi un environnement Railway déclaré production. Cela ne prouve pas qu’un tunnel local ne conduit pas à la production : l’isolation réseau et les identifiants fictifs doivent être vérifiés séparément. Aucun de ces scripts ne doit être exécuté avec des données réelles. Le script de diagnostic fournisseur séparé peut contacter des services externes et ne fait plus partie du pré-déploiement.

La configuration Railway existante n’a pas été changée : tant que la PR n’est pas déployée, elle exécutera toujours la version ancienne et dangereuse de la commande. La fusion pouvant déclencher un déploiement, un plan de bascule explicitement approuvé reste nécessaire. Vérifier aussi les tâches de démarrage et la coordination entre instances ; cette correction ne les neutralise pas.

### Secours et ancien pré-déploiement

La révision de secours `7c0063594969a620f7ba82a2c5479c1202c37e85` protège les opérations Stripe, mais contient l’ancien pré-déploiement destructif et l’ancien contrôle de disponibilité. **Ne pas l’activer telle quelle** : préparer un artefact protégé avec un pré-déploiement sans écriture et une disponibilité fiable, puis le valider dans un environnement isolé avant toute mise en service. Le retour arrière Railway restaure aussi d’anciennes variables ; vérifier et approuver la configuration avant activation. Aucun retour vers un code sans séparation Test/Live.
