# Laboratoire d'intégration Stripe Test + Supabase isolé

Ce laboratoire fait tourner le **vrai serveur** du commit testé, ici `76a803bb` (PR #16), avec :
- une **pile Supabase locale** (Docker, adresse `127.0.0.1` uniquement) ;
- quand le propriétaire l'a configuré, un **bac à sable Stripe Test séparé**.

Il ne touche jamais la production. Il s'exécute dans GitHub Actions
([workflow](../.github/workflows/stripe-integration-lab.yml)) à chaque push sur une branche `lab/**`, ou à la main.

## Preuves d'isolation (le workflow s'arrête si l'une échoue)

1. **Réseau.** Avant toute lecture de secret, les hôtes de production sont redirigés vers `0.0.0.0` :
   - `relanzio.com` et le domaine Railway ;
   - le projet Supabase de production ;
   - Brevo, OVH et OpenAI.

   `scripts/lab/isolation-check.mjs network` vérifie ensuite qu'aucune connexion TCP n'aboutit vers ces hôtes.
2. **Variables.** Elles sont contrôlées avant le démarrage du serveur, qui est refusé si l'un de ces points n'est pas respecté :
   - aucune valeur ne contient d'identifiant de production (`relanzio.com`, `up.railway.app`, la référence Supabase,
     `.supabase.co`, `brevo.com`, `ovh.net`, `sk_live_`…) ;
   - aucune clé de fournisseur réel n'est présente (Brevo, SMTP/IMAP, OpenAI, jeton Supabase/Railway, URL de base) ;
   - `SUPABASE_URL` et `APP_URL` sont locales ;
   - `NODE_ENV` n'est pas `production` ;
   - `STRIPE_EXPECTED_MODE` vaut `test`.
3. **Stripe**, contrôlé par `isolation-check.mjs stripe` :
   - la clé est une clé **Test** ;
   - elle appartient au compte déclaré pour le laboratoire ;
   - ce compte est **différent** du compte de production ;
   - le prix vaut 29,00 EUR par mois en mode Test ;
   - le bac à sable ne contient **aucun endpoint webhook**.

   Pourquoi le compte de production est exclu : son mode Test garde un endpoint actif vers le serveur de production. Les
   événements du laboratoire n'arrivent donc que par `stripe listen`, qui transmet en local.
4. **Emails.**
   - Aucune clé Brevo n'existe dans l'environnement : le serveur répond `EMAIL_PROVIDER_NOT_CONFIGURED`.
   - Les hôtes d'envoi sont redirigés vers `0.0.0.0`.
   - Les emails de Supabase Auth restent dans le collecteur local de la pile.
5. **Secrets.** Ils ne viennent que de l'environnement GitHub protégé `stripe-lab`. Aucun secret de production n'y figure.

## Ce que le propriétaire doit configurer (une fois, gratuitement, sans partager de clé dans une conversation)

1. **Bac à sable Stripe.** Dans le tableau de bord Stripe, utiliser le **bac à sable séparé** (« environnement de test
   relanzio »), pas le mode Test du compte principal. Y vérifier :
   - qu'il n'existe **aucun** endpoint webhook ;
   - qu'il existe un prix Pro à 29,00 EUR par mois.
2. **Environnement GitHub.** Dans GitHub, menu *Settings → Environments*, créer l'environnement `stripe-lab` (il est créé
   vide automatiquement au premier lancement du workflow). Puis :
   - ajouter le relecteur obligatoire : le propriétaire ;
   - limiter l'environnement aux branches `lab/*` ;
   - ajouter le secret `STRIPE_LAB_SECRET_KEY` : clé secrète **Test** du bac à sable, de préférence une clé restreinte ;
   - ajouter les variables `STRIPE_LAB_ACCOUNT_ID` (identifiant `acct_…` du bac à sable), `STRIPE_LAB_PRICE_ID` (prix Test
     à 29 €) et `PRODUCTION_STRIPE_ACCOUNT_ID` (identifiant public `acct_…` du compte principal, pour prouver que le
     laboratoire est distinct).
3. Relancer le workflow.

Sans ces éléments, le laboratoire s'exécute en **mode infrastructure seule** :
- contrôles d'isolation ;
- pile Supabase locale ;
- schéma et migrations ;
- démarrage du serveur ;
- facturation refusée par sécurité.

Dans ce mode, **aucun scénario Stripe n'est exécuté** et rien n'est déclaré validé côté Stripe.

## Scénarios exécutés avec Stripe

`scripts/stripe-test-validation.mjs` (existant), sur une horloge de simulation :
1. paiement, puis passage en Pro ;
2. renouvellement refusé, puis statut `past_due` avec délai de grâce ;
3. carte corrigée, puis retour en Pro ;
4. résiliation en fin de période ;
5. retour en Free, devis conservés ;
6. mention de TVA sur les factures.

`scripts/lab/scenarios.mjs` (nouveau) :

| Scénario | Situation | Résultat attendu |
|---|---|---|
| S1 | Événement `livemode=true` correctement signé | Refusé avant toute écriture |
| S2 | Même événement livré deux fois | Accusé comme doublon, état inchangé |
| S3 | Base en panne : service PostgREST local mis en pause | 503 et rien d'appliqué |
| S3 (suite) | Nouvelle livraison après rétablissement | Appliqué une seule fois |
| S4 | Événement plus ancien reçu après un plus récent | Ignoré, aucune régression des droits |
| S5 | Vérification des envois | Aucun fournisseur d'email configuré |

## Limites

- Le **Checkout** hébergé par Stripe et le **portail client** ne sont pas parcourus dans un navigateur. Les abonnements sont
  créés par l'API, ce qui produit les mêmes webhooks qu'un Checkout terminé. `checkout.session.completed` n'est donc pas
  couvert de bout en bout.
- `stripe listen` ne fait pas les nouvelles tentatives automatiques de Stripe. La « nouvelle livraison » de S3 est rejouée
  par le script, signée avec le secret du laboratoire.
- La pile Supabase locale reproduit la base et l'authentification, pas la configuration du projet de production (région,
  offre, réglages du tableau de bord).
- Un passage réussi prouve le comportement du commit testé **dans ce laboratoire**. Il ne certifie ni la configuration Railway
  de production ni les webhooks Live.
