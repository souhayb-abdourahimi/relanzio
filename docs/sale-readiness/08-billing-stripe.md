# 08 — Facturation (Stripe)

Aucune clé dans ce document. Valeurs commerciales : `shared/plans.js` (source unique, testée).

## Modèle

| | Free | Pro |
|---|---|---|
| Prix | 0 € | 29 € / mois (TTC = HT : « TVA non applicable, art. 293 B du CGI ») |
| Devis actifs | 5 | 100 |
| Essai | — | 7 jours sans carte, démarré **automatiquement au premier devis**, une seule fois par compte |

L’essai est géré **par Relanzio** (colonnes `trial_*` du profil), **pas par Stripe** : aucune carte n’est demandée pendant l’essai.
À la fin de l’essai sans abonnement, le compte repasse en Free ; les devis au-delà de 5 deviennent en lecture seule (rien n’est supprimé).

## Architecture

1. `POST /api/billing/checkout` : crée (ou réutilise) le client Stripe et une session Checkout d’abonnement sur `STRIPE_PRO_PRICE_ID`
   (idempotence, protection contre les doubles sessions, refus si déjà abonné ou paiement en échec).
2. Stripe → `POST /api/stripe/webhook` (corps brut, signature `STRIPE_WEBHOOK_SECRET`), événements traités :
   `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`.
   Idempotence et ordre garantis (`stripe_webhook_events`, `stripe_state_event_created`).
3. `POST /api/billing/portal` : portail client Stripe (carte, factures, résiliation), configuration `STRIPE_PORTAL_CONFIGURATION_ID` optionnelle.

## États d’abonnement (`profiles.subscription_status`)

| État Stripe | Droits Relanzio |
|---|---|
| `active`, `trialing` | Pro |
| `past_due` | Pro pendant **14 jours** après le début de la période impayée (`PAST_DUE_GRACE_DAYS`), envoi automatique suspendu ; puis Free |
| `unpaid`, `canceled` | Free immédiatement |
| `none` | Free (ou Pro pendant l’essai Relanzio) |

Interrupteurs : `BILLING_ENABLED` / `VITE_BILLING_ENABLED` (souscription), `BILLING_EMAILS_ENABLED` (emails de facturation, désactivés).

## Tests

Tests unitaires de compatibilité avec l’API Stripe utilisée (`test/stripe-*.test.js`, `test/subscription.test.js`,
`test/past-due-grace.test.js`, `test/checkout-policy.test.js`). Procédure de validation en mode test : `docs/STRIPE_TEST_VALIDATION.md`
et `scripts/stripe-test-validation.mjs` (refuse de tourner sur la base de production).

## Transfert / reconfiguration pour un nouvel opérateur

Un compte Stripe est lié à une **entité légale** (aujourd’hui : entreprise individuelle du fondateur). Options, à valider avec
Stripe et un professionnel (**LEGAL REVIEW REQUIRED**) :

1. **Nouveau compte Stripe de l’acheteur** (cas le plus courant) :
   - créer le produit « Relanzio Pro » et le prix mensuel 29 € ;
   - créer le webhook `https://relanzio.com/api/stripe/webhook` avec les 5 événements ci-dessus ;
   - configurer le portail client ;
   - renseigner `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID`, `STRIPE_PORTAL_CONFIGURATION_ID` ;
   - **migrer les abonnements existants** : demande de migration des données de paiement entre comptes Stripe (procédure Stripe),
     puis recréation des abonnements, ou réinscription des clients. Mettre à jour `profiles.stripe_customer_id` /
     `stripe_subscription_id` en conséquence (script à écrire au moment du transfert, avec sauvegarde préalable).
2. **Reprise de l’entité** (cession de société) : le compte Stripe suit l’entité — non applicable tant que l’éditeur est une
   entreprise individuelle.

Pendant la transition : ne jamais avoir deux webhooks actifs écrivant sur la même base pour des comptes Stripe différents
sans plan de migration.

## Chiffres

MRR, abonnés actifs, conversions essai → payant : requêtes de [metrics/](metrics/README.md) et tableau de bord Stripe.
**À renseigner par le propriétaire.**
