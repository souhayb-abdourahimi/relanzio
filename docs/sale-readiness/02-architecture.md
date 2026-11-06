# 02 — Architecture

## Vue d’ensemble

```
                 navigateur (artisan, prospect, visiteur)
                              │ HTTPS  relanzio.com (DNS OVH, proxy Cloudflare devant le site — À confirmer)
                              ▼
┌──────────────────────── Railway : 1 service Docker (Node 22) ─────────────────────────┐
│  Express 5 (server/index.js)                                                          │
│   • sert le front React (dist/, + 12 pages publiques pré-rendues : SEO, sans JS)      │
│   • API /api/*  (auth par jeton Supabase, rate limiting, helmet/CSP, CORS = APP_URL)  │
│   • webhooks : /api/stripe/webhook, /api/brevo/webhook, /api/brevo/inbound            │
│   • tâches planifiées node-cron (dans le même processus, voir plus bas)               │
└───────┬───────────────┬───────────────────┬─────────────────────┬─────────────────────┘
        │               │                   │                     │
        ▼               ▼                   ▼                     ▼
  Supabase          Stripe              Brevo (API)          Boîtes IMAP (lecture seule)
  Postgres + Auth   abonnements Pro     emails produit       • réponses clients :
  RLS, fonctions    portail client      + prospection          reponses@reply.relanzio.com (Amelu)
  SQL atomiques     webhooks →          webhooks livraison   • réponses prospection :
  (région Paris)    /api/stripe/webhook  → /api/brevo/webhook  boîte commerciale OVH
                                                             OpenAI (optionnel) : analyse des réponses
                                                             de prospection, assistant support
```

Un seul service applicatif, sans file de messages ni worker séparé : le serveur web exécute aussi les tâches planifiées.

## Frontend (`client/`)

- React 19 + Vite 7, une seule application (`client/src/main.jsx`), CSS maison (`styles.css`), notifications `sonner`.
- Pages publiques (landing, tarifs, FAQ, documentation, légal…) **pré-rendues au build** (`scripts/prerender.mjs`) :
  lisibles sans JavaScript, servies par Express.
- Authentification Supabase côté navigateur (email + mot de passe, réinitialisation par email). Seule la clé **anon** est exposée
  (`VITE_SUPABASE_*`). Le navigateur ne lit/écrit pas les tables métier directement : il passe par l’API.
- Valeurs commerciales partagées avec le serveur : `shared/plans.js` ; identité de l’éditeur : `shared/company.js` ;
  modèles de relance : `shared/followup-templates.js`.

## Backend (`server/`)

| Module | Rôle |
|---|---|
| `index.js` | Serveur Express, routes, webhooks, tâches planifiées |
| `db.js` | Client Supabase **service_role** (serveur uniquement) |
| `entitlements.js`, `trials.js`, `plans` | Droits Free/Pro, essai 7 jours, fin d’essai |
| `followups.js`, `followup-policy.js` | Planification et envoi des relances clients |
| `quote-replies.js`, `reply-classifier.js`, `imap-reply-parser.js` | Détection et traitement des réponses clients |
| `stripe-webhook.js`, `billing.js`, `checkout-policy.js` | Facturation |
| `email.js`, `email-links.js` | Envoi Brevo (flux `product` / `outreach`), liens de désinscription signés |
| `commercial-feeder.js`, `controlled-outreach*.js`, `outreach*.js`, `pilot-outreach*.js`, `imap-replies.js` | Prospection de Relanzio |
| `dns-resolve.js` | Contrôles DNS (MX, SPF, DKIM, DMARC) robustes |
| `observability.js` | Logs JSON structurés + table `system_events` |
| `qa-*.mjs` | QA exécutée avant chaque déploiement (voir [05](05-deployment-runbook.md)) |

## Données (Supabase)

Postgres avec **RLS activée sur les 21 tables**, opérations sensibles en fonctions SQL atomiques (quota, relances, réponses,
créneaux d’envoi). Détail : [07-database.md](07-database.md).

## Tâches planifiées (node-cron, dans le serveur)

| Fréquence | Tâche | Active si |
|---|---|---|
| toutes les 15 min | Relances automatiques dues | `FOLLOWUP_AUTOMATION_ENABLED=true` + boîte réponses configurée |
| 4 fois / heure | Expiration des essais | toujours |
| toutes les 2 min | Relevé de la boîte réponses clients | boîte `REPLY_*` configurée |
| toutes les 10 min | Ancienne file de prospection | `ACQUISITION_ENABLED=true` |
| toutes les 10 min | Relevé de la boîte commerciale | IMAP commercial configuré |
| toutes les 10 min | Feeder commercial (revérification, import, préparation D0) | `COMMERCIAL_FEEDER_ENABLED=true` |
| toutes les 5 min | Séquence commerciale D0 → J+3 (1 email max) | `COMMERCIAL_SEQUENCE_ENABLED` + `COMMERCIAL_OUTREACH_SEND_ENABLED` |
| 7 h 30 jours ouvrés | Rappel du matin | `MORNING_DIGEST_ENABLED=true` |
| 10 h 05 | Rappels de fin d’essai | `BILLING_EMAILS_ENABLED=true` |
| 8 h 15 | Emails de cycle de vie | `LIFECYCLE_EMAILS_ENABLED=true` |

Conséquence : **une seule instance** doit tourner (sinon tâches en double ; les fonctions SQL évitent les doubles envois mais
pas le travail en double). Voir le risque correspondant dans [audit-findings.md](audit-findings.md).

## Flux principaux

1. **Inscription** : Supabase Auth (email + mot de passe) → profil créé → onboarding (nom d’entreprise) → premier devis →
   essai Pro 7 jours démarré automatiquement (`trial_started`).
2. **Relance manuelle** : aperçu instantané (modèle fixe) → l’artisan envoie lui-même → « Relance faite » (fonction SQL
   `confirm_manual_followup`).
3. **Relance via Relanzio (Pro)** : réservation atomique du devis → brouillon → revérification « pas de réponse » →
   Brevo avec `Reply-To: reponses+<jeton>@reply.relanzio.com` → `finalize_relanzio_followup`.
4. **Réponse client** : relevé IMAP toutes les 2 min → jeton → `apply_quote_reply` (arrêt) → transfert à l’artisan
   (Reply-To = client) ; ou bouton « Le client a répondu ».
5. **Abonnement** : `/api/billing/checkout` → Stripe Checkout → webhook → profil Pro ; portail Stripe pour carte/résiliation.
6. **Livraison / bounces** : webhook Brevo → événements, suppressions, désactivation de l’envoi automatique.
7. **Prospection de l’éditeur** : voir [10-commercial-engine.md](10-commercial-engine.md).
