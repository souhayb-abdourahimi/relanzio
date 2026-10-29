# Validation Stripe des nouveautés de `feat/saas-ready` — mode test uniquement

**Contexte.** Stripe fonctionne déjà en production (Checkout Live, webhooks, passage Pro, facturation). Ce document ne concerne **que les nouveautés de la branche** ; la configuration Stripe Live existante ne doit pas être modifiée.

**Statut des nouveautés : REQUIRES REAL STRIPE TEST ENVIRONMENT.** Aucune clé Stripe de test n'était disponible pendant le développement. Les nouveautés sont testées localement, avec des événements signés par le SDK Stripe officiel, au format de l'API utilisée par le SDK (`2025-08-27.basil`) :
- `test/stripe-webhook.test.js` : cycle de vie complet ;
- `test/stripe-live-compat.test.js` : compatibilité avec le parcours Live, en partant de profils écrits par le code actuellement en production ;
- `test/past-due-grace.test.js` : règle de grâce.

## 0. Ce qui n'a pas été vérifié contre Stripe réel

| Nouveauté | Vérifié localement | Non vérifié contre Stripe réel |
| --- | --- | --- |
| Essai Pro automatique au premier devis | Ne fait aucun appel à Stripe. Testé : essai démarré une seule fois ; jamais pour un client payant ou résilié ; essai puis Checkout → Pro payant après la fin de l'essai. | Un vrai Checkout Test pendant un essai actif. |
| Grâce `past_due` de 14 jours | Règle et bornes ; événements `invoice.payment_failed` et `customer.subscription.updated` au format basil ; stockage de `current_period_start` lu sur les items de l'abonnement. | Les dates réelles envoyées par Stripe lors d'un renouvellement refusé (test clock). L'enchaînement entre les relances de paiement Stripe (*Smart Retries*, paramétrées dans le dashboard Live) et nos 14 jours : si Stripe abandonne plus tôt (`unpaid`/`canceled`), le passage au Free est plus tôt ; s'il continue plus longtemps, le compte passe Free au 15e jour et redevient Pro au paiement. |
| Email de paiement refusé | Contenu, un envoi par facture, coupé si `BILLING_EMAILS_ENABLED≠true`. | Envoi réel par Brevo (l'option reste à `false`). |
| Retour au Free (`unpaid`, `canceled`, fin de grâce) | Transitions et règle des 5 devis actifs. | Le statut final réellement choisi par les paramètres de relance Live (à lire dans le dashboard, sans le modifier). |
| Portail ouvert en `past_due`, `unpaid` et `canceled` | Affichage et appel API identiques à aujourd'hui (`billingPortal.sessions.create`). | Qu'un client en `past_due` puisse, avec la configuration de portail Live actuelle, changer sa carte et régler la facture ouverte. |
| Checkout refusé pendant `past_due`/`unpaid` | Garde côté serveur (409), la configuration Checkout est inchangée (`pro-card-v4-vat293b`). | — (aucun appel Stripe). |

**Point de compatibilité au déploiement.** Le webhook enregistre désormais `subscription_current_period_start/end` et `subscription_cancel_at_period_end`. Si le code est déployé avant la migration `20261028120000_subscription_period.sql`, les webhooks Live échoueront (HTTP 400). Stripe les renverra ensuite, en mode Live jusqu'à 3 jours. Il faut donc appliquer les migrations **avant** le code. Les migrations sont compatibles avec le code actuel.

**Lecture de l'abonnement.** Le serveur relit toujours l'abonnement par l'API, avec la version épinglée par le SDK. La version d'API de l'endpoint webhook Live n'a donc pas d'effet sur la forme des données lues. Les deux formes de factures (`subscription` à la racine ou `parent.subscription_details`) sont gérées.

## 1. À renseigner dans `.env` (jamais commité)

| Variable | Valeur attendue |
| --- | --- |
| `STRIPE_SECRET_KEY` | `sk_test_…` (refus automatique d'une clé `sk_live_`) |
| `STRIPE_PRO_PRICE_ID` | `price_…` du prix Pro **mensuel 29 €** créé en mode test |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` affiché par `stripe listen` (ou celui de l'endpoint de staging) |
| `STRIPE_PORTAL_CONFIGURATION_ID` | facultatif, `bpc_…` (voir §2) |
| `BILLING_ENABLED` / `VITE_BILLING_ENABLED` | `true` |
| `BILLING_EMAILS_ENABLED` | `true` pour vérifier l'email d'échec de paiement, sinon `false` |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_*` | projet Supabase **de développement** |
| `EMAIL_LINK_SECRET` | 24 caractères aléatoires ou plus |
| `APP_URL` | `http://localhost:5173` |

Le projet Supabase de dev doit avoir reçu `supabase/schema.sql` puis toutes les migrations de `supabase/migrations/` (dans l'ordre).

## 2. Configuration Stripe (dashboard, **mode test** uniquement — ne rien changer en Live)

1. Produit « Relanzio Pro », prix récurrent mensuel 29,00 EUR, sans taxe.
2. Paramètres → Informations publiques de l'entreprise : nom de l'éditeur, adresse, SIREN (apparaissent sur les factures).
3. Paramètres → Factures : pied de page par défaut « TVA non applicable, art. 293 B du CGI » (le code le pose aussi sur chaque client).
4. Portail client : autoriser la mise à jour du moyen de paiement, l'historique des factures et la résiliation **en fin de période**. Copier l'identifiant de configuration dans `STRIPE_PORTAL_CONFIGURATION_ID` si ce n'est pas la configuration par défaut.
5. Webhook (staging) ou `stripe listen` (local) avec les événements : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`.

## 3. Lancer

```bash
npm run dev
```

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Créer un compte de test dans l'app (inscription), récupérer son id (`auth.users`), puis :

```bash
RELANZIO_DEV_SUPABASE_CONFIRMED=yes VALIDATION_USER_ID=<uuid> node scripts/stripe-test-validation.mjs
```

Le script utilise une *test clock* Stripe : paiement → Pro, renouvellement refusé → `past_due` avec Pro conservé pendant la grâce (début de période + 14 jours), carte corrigée → Pro, résiliation en fin de période → Pro jusqu'à la date, fin de période → gratuit sans perte de devis, mention 293 B sur les factures.

## 4. Vérifications manuelles (navigateur, mode test)

- Inscription → ajout du premier devis → bannière « Essai Pro : 7 jours restants ».
- Formules → « Passer à Pro » → Checkout avec la carte `4242 4242 4242 4242` → retour `?billing=success` → Pro.
- « Gérer mon abonnement » → changer de carte, télécharger une facture, résilier.
- Dashboard Stripe → renvoyer un événement déjà traité → la réponse du serveur contient `"duplicate":true`.
