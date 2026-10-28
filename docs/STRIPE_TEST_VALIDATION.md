# Validation Stripe réelle — mode test uniquement

Statut : **REQUIRES REAL STRIPE TEST ENVIRONMENT**. Tout le parcours est testé localement avec des événements signés par le SDK Stripe (`test/stripe-webhook.test.js`), mais aucun appel réel à Stripe n'a été fait.

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

## 2. Configuration Stripe (dashboard, mode test)

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
