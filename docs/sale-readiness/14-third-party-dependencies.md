# 14 — Dépendances tierces

## Services

| Fournisseur | Usage | Criticité | Transfert possible ? | Remplacement |
|---|---|---|---|---|
| Supabase | Base de données, authentification | **Critique** | Oui (transfert de projet entre organisations, ou dump/restore) | Tout Postgres + autre fournisseur d’auth : travail important (auth, RLS, client) |
| Railway | Hébergement, tâches planifiées, QA avant déploiement | **Critique** | Oui (transfert de projet) ou recréation simple (Dockerfile standard) | Toute plateforme Docker (Render, Fly.io, VPS) : facile ; garder **une seule instance** et reproduire la commande de pré-déploiement |
| Stripe | Abonnements | **Critique** (revenu) | Compte lié à l’entité : en pratique **nouveau compte + migration des abonnements** | Autre PSP : réécriture de `billing.js` / `stripe-webhook.js` |
| Brevo | Tous les emails | **Critique** | Transfert de compte ou nouveau compte + domaine à ré-authentifier | Autre API email (Postmark, SES…) : `server/email.js` + webhooks |
| OVH | Domaine, DNS, boîte commerciale | **Critique** | Oui (changement de titulaire / transfert de domaine) | Tout registrar |
| Amelu | Boîte des réponses clients | Élevée (détection des réponses) | À confirmer (compte personnel ?) | Toute boîte IMAP acceptant le sous-adressage `+` |
| GitHub | Code, CI | Élevée | Oui (transfert de dépôt) | GitLab, etc. (workflows à adapter) |
| Cloudflare | Présent devant le site (À confirmer) | À confirmer | À confirmer | — |
| OpenAI | Analyse des réponses de prospection, assistant support | Faible (repli sans IA dans le code) | Nouvelle clé | Désactivation possible |

## Bibliothèques principales (production)

| Paquet | Version | Licence | Usage |
|---|---|---|---|
| express | 5.1.0 | MIT | Serveur HTTP |
| @supabase/supabase-js | 2.57.0 | MIT | Client base / auth |
| stripe | 18.5.0 | MIT | Facturation |
| helmet | 8.1.0 | MIT | En-têtes de sécurité |
| cors | 2.8.5 | MIT | CORS |
| node-cron | 4.2.1 | ISC | Tâches planifiées |
| openai | 5.20.0 | Apache-2.0 | Analyse de réponses (optionnelle) |
| dotenv | 16.6.1 | BSD-2-Clause | Variables locales |

Front (inclus dans le bundle) : react / react-dom 19.1.1 (MIT), sonner 2.0.7 (MIT). Outils : vite 7.1.4 (MIT),
@vitejs/plugin-react (MIT), concurrently (MIT). QA en CI uniquement : Playwright (Apache-2.0), axe-core (MPL-2.0, non distribué).

Versions figées (`package-lock.json`, `npm ci`). Node ≥ 22.12. Aucune dépendance native ou propriétaire.
