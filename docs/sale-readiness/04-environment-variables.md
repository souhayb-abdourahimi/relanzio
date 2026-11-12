# 04 — Variables d’environnement

Liste établie à partir du code (`process.env.*`, `import.meta.env.*`, `Dockerfile`). **Aucune valeur n’est donnée.**
Les valeurs de production sont dans Railway (onglet *Variables* du service). Modèle local : `.env.example`.

Légende — **Secret** : à garder secrète et à **remplacer** lors d’une cession. **Build** : lue au moment du build (Vite / Docker `ARG`),
un changement impose un redéploiement.

## Socle

| Nom | Service | Description | Secret | Obligatoire | Impact si absente |
|---|---|---|---|---|---|
| `PORT` | Railway | Port HTTP (fourni par Railway) | non | oui | Serveur sur 3000 |
| `NODE_ENV` | Serveur | `production` (fixé dans le Dockerfile) | non | oui | CSP/CORS de développement |
| `APP_URL` | Serveur, build | URL publique (`https://relanzio.com`) : CORS, liens dans les emails | non | oui | Liens et CORS incorrects |
| `RELEASE_STAGE` | `scripts/preflight.mjs` | `production` active les contrôles de mise en ligne | non | non | Préflight en mode staging |

## Supabase

| Nom | Service | Description | Secret | Obligatoire | Impact si absente |
|---|---|---|---|---|---|
| `SUPABASE_URL` | Serveur | URL du projet | non | oui | Application hors service |
| `SUPABASE_ANON_KEY` | Serveur | Clé publique (vérification des sessions) | non (publique) | oui | Connexion impossible |
| `SUPABASE_SERVICE_ROLE_KEY` | Serveur | Accès complet à la base, **contourne la RLS** | **OUI — critique** | oui | Application hors service |
| `VITE_SUPABASE_URL` | Build | URL du projet côté navigateur | non | oui | Front sans authentification |
| `VITE_SUPABASE_ANON_KEY` | Build | Clé anon côté navigateur | non (publique) | oui | Idem |
| `SUPABASE_DB_URL` | `scripts/backup.sh` | Chaîne de connexion Postgres pour les sauvegardes | **OUI** | pour sauvegarder | Pas de sauvegarde par script |

## Stripe

| Nom | Description | Secret | Obligatoire | Impact si absente |
|---|---|---|---|---|
| `STRIPE_SECRET_KEY` | Clé API (Live en production) | **OUI — critique** | oui (facturation) | Pas d’abonnement possible ; readiness `false` |
| `STRIPE_WEBHOOK_SECRET` | Signature des webhooks | **OUI** | oui | Webhooks refusés : abonnements non synchronisés |
| `STRIPE_PRO_PRICE_ID` | Prix Pro 29 €/mois | non | oui | Checkout impossible |
| `STRIPE_PORTAL_CONFIGURATION_ID` | Configuration du portail client | non | non | Portail par défaut |
| `BILLING_ENABLED` | Active la souscription Pro (serveur) | non | oui (`true` en prod) | Bouton Pro bloqué (423) |
| `VITE_BILLING_ENABLED` | Idem côté interface (build) | non | oui | Interface sans bouton Pro |

## Emails (Brevo) et liens

| Nom | Description | Secret | Obligatoire | Impact si absente |
|---|---|---|---|---|
| `BREVO_API_KEY` | Clé API Brevo (emails produit, et prospection si pas de clé dédiée) | **OUI** | oui | Aucun email |
| `OUTREACH_BREVO_API_KEY` | Clé Brevo dédiée à la prospection (sous-compte) | **OUI** | non | Prospection sur la clé principale |
| `BREVO_WEBHOOK_SECRET` | En-tête `x-webhook-secret` des webhooks Brevo (livraison, inbound) | **OUI** | oui | Webhooks refusés : bounces/STOP non traités |
| `EMAIL_FROM_ADDRESS` | Expéditeur des emails produit | non | oui | Aucun email |
| `EMAIL_FROM_NAME` | Nom d’expéditeur par défaut | non | non | « Relanzio » |
| `SUPPORT_EMAIL`, `CONTACT_EMAIL` | Adresses affichées / utilisées | non | non | Valeurs par défaut |
| `VITE_SUPPORT_EMAIL`, `VITE_CONTACT_EMAIL` | Idem côté interface (build) | non | non | Valeurs par défaut |
| `EMAIL_LINK_SECRET` | Signe les liens de désinscription (≥ 24 caractères aléatoires) | **OUI** | oui | Envoi via Relanzio bloqué (lien impossible à signer) |
| `FOLLOWUP_ACCOUNT_DAILY_CAP` | Plafond quotidien d’envois par compte artisan (défaut 60) | non | non | 60 |

## Boîte des réponses clients (produit)

| Nom | Description | Secret | Obligatoire | Impact si absente |
|---|---|---|---|---|
| `REPLY_INBOUND_ADDRESS` | Adresse de base (`reponses@reply.relanzio.com`), sous-adressage `+jeton` | non | non | Pas de détection automatique (bouton manuel seulement) |
| `REPLY_IMAP_HOST`, `REPLY_IMAP_PORT` (993), `REPLY_IMAP_USER` | Accès IMAP en lecture | non | avec l’adresse | Idem |
| `REPLY_IMAP_PASSWORD` | Mot de passe IMAP | **OUI** | avec l’adresse | Idem |
| `VITE_REPLY_DETECTION_LIVE` | Affiche la promesse publique « tout s’arrête » (build) | non | non (`false`) | Promesse masquée — **LEGAL REVIEW REQUIRED** avant `true` |

## Boîte commerciale et prospection de l’éditeur

| Nom | Description | Secret | Obligatoire | Impact si absente |
|---|---|---|---|---|
| `IMAP_HOST`, `IMAP_PORT`, `IMAP_SECURE`, `IMAP_USER` | Boîte où arrivent les réponses aux emails de prospection | non | pour prospecter | Séquence commerciale en pause |
| `IMAP_PASSWORD` | Mot de passe IMAP commercial | **OUI** | pour prospecter | Idem |
| `IMAP_E2E_CERTIFIED` | Confirme que la boîte a été testée de bout en bout | non | pour prospecter | Aucun envoi commercial |
| `COMMERCIAL_FEEDER_ENABLED` | Revérifie, importe et prépare les D0 | non | non | Pas de nouveaux prospects |
| `COMMERCIAL_SEQUENCE_ENABLED` | Tick d’envoi D0 → J+3 (toutes les 5 min) | non | non | Aucun envoi commercial |
| `COMMERCIAL_OUTREACH_SEND_ENABLED` | Autorise l’envoi commercial réel | non | non | Aucun envoi commercial |
| `LEGAL_PAGES_APPROVED` | Pages légales validées : condition de tout envoi commercial | non | non | Aucun envoi commercial |
| `OUTREACH_DAILY_CAP` | Plafond quotidien commercial (borné par la capacité Brevo, 300 sur le plan gratuit) | non | non | Capacité fournisseur |
| `COMMERCIAL_D0_STOCK_THRESHOLD`, `COMMERCIAL_D0_STOCK_TARGET`, `COMMERCIAL_FEEDER_BATCH_MAX`, `COMMERCIAL_VERIFICATION_MAX_AGE_DAYS`, `COMMERCIAL_REVERIFY_BATCH` | Réglages du feeder | non | non | Valeurs par défaut du code |
| `ACQUISITION_ENABLED` | Ancienne file de prospection (héritée) | non | non | Inactive (recommandé : `false`) |
| `PILOT_OUTREACH_DAILY_CAP`, `PILOT_OUTREACH_ALLOWED_EMAILS`, `PILOT_ADMIN_RUNNER_ENABLED`, `PILOT_ADMIN_RUNNER_IDS`, `PILOT_ADMIN_RUNNER_SEND`, `PILOT_OUTREACH_STARTUP_DRY_RUN`, `PILOT_OUTREACH_STARTUP_DRY_RUN_IDS` | Outils du pilote de prospection (historique, envois unitaires contrôlés) | non | non | Inactifs |

## Automatisations produit (interrupteurs de sécurité)

| Nom | Description | Valeur prudente |
|---|---|---|
| `FOLLOWUP_AUTOMATION_ENABLED` | Envoi automatique des relances (exige aussi la boîte réponses) | `false` |
| `MORNING_DIGEST_ENABLED` | Rappel du matin | `false` |
| `BILLING_EMAILS_ENABLED` | Emails de fin d’essai, d’échec de paiement, de résiliation | `false` |
| `LIFECYCLE_EMAILS_ENABLED` | Emails de cycle de vie | `false` |

## Divers

| Nom | Description | Secret | Obligatoire |
|---|---|---|---|
| `ADMIN_EMAILS` | Emails ayant accès à l’administration (liste) | non (mais sensible) | oui pour l’admin |
| `CRON_SECRET` | Protège `POST /api/cron/run` (déclenchement manuel des relances dues) | **OUI** | non (sans valeur : route refusée) |
| `SCHEDULER_ENABLED` | `false` = mode secours : aucune tâche planifiée ni de démarrage, `POST /api/cron/run` en 503 ([SCHEDULED_JOBS](../SCHEDULED_JOBS.md)) | non | non (défaut `true`) |
| `SCHEDULER_START_DELAY_SECONDS` | Délai sans tâche après démarrage, pour laisser Railway arrêter l'ancienne instance | non | non (défaut `120`) |
| `OPENAI_API_KEY` | Analyse des réponses de prospection, assistant support | **OUI** | non (repli sans IA) |
| `OPENAI_MODEL` | Modèle utilisé | non | non |
| `VITE_LEGAL_ENTITY_TYPE`, `VITE_LEGAL_NAME`, `VITE_LEGAL_FORM`, `VITE_LEGAL_CAPITAL`, `VITE_LEGAL_ADDRESS`, `VITE_LEGAL_REGISTRATION`, `VITE_LEGAL_PHONE`, `VITE_PUBLICATION_DIRECTOR` | Identité légale (build, contrôlée par le préflight). L’identité affichée vient aujourd’hui de `shared/company.js` | non | préflight |
| `VITE_LEGAL_EMAIL`, `VITE_LEGAL_VAT`, `VITE_HOST_NAME`, `VITE_DATA_RETENTION` | Présentes dans `.env.example`/Dockerfile, **plus lues par le code** | non | non |
| `EXTERNAL_QA_APPROVED`, `MOBILE_QA_APPROVED` | Portes du préflight | non | non |
| `SMOKE_BASE_URL`, `SMOKE_EXPECT_REPLY_LIVE` | Smoke test (`scripts/smoke.mjs`) | non | non |
| `TRIAL_CERTIFICATION_EMAIL`, `VALIDATION_USER_ID`, `PRODUCTION_SUPABASE_URL`, `RELANZIO_DEV_SUPABASE_CONFIRMED`, `QA_EMAIL_RECIPIENT` | Scripts de certification / validation ponctuels | non | non |

## Secrets à remplacer lors d’une cession

`SUPABASE_SERVICE_ROLE_KEY` (et clés Supabase si projet conservé), `SUPABASE_DB_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`BREVO_API_KEY`, `OUTREACH_BREVO_API_KEY`, `BREVO_WEBHOOK_SECRET`, `EMAIL_LINK_SECRET`*, `REPLY_IMAP_PASSWORD`, `IMAP_PASSWORD`,
`CRON_SECRET`, `OPENAI_API_KEY`, et `ADMIN_EMAILS`.

\* Changer `EMAIL_LINK_SECRET` invalide les liens de désinscription déjà envoyés : prévoir la rotation **après** quelques jours
sans envoi, ou accepter que d’anciens liens renvoient une erreur (le STOP par réponse reste possible).
