# 03 — Inventaire des services

Aucun secret ici. « À confirmer » = information non lisible dans le code (compte, offre, propriétaire).

| Service | Rôle | Ressource | Données stockées | Dépend de | Ce que l’acheteur devra faire |
|---|---|---|---|---|---|
| **GitHub** | Code source, CI (GitHub Actions) | dépôt `relanzio` (public à ce jour), branche de production `staging` | Code, historique, docs | — | Transfert du dépôt vers son organisation (ou fork privé), CI incluse |
| **Railway** | Hébergement du serveur (Docker), tâches planifiées, QA avant déploiement | 1 projet / 1 environnement « production » / 1 service (région déclarée : `sfo`, États-Unis) | Aucune donnée persistante (sans état) ; logs | GitHub (déploiement auto de `staging`), toutes les variables d’environnement | Transfert du projet Railway **ou** recréation + copie des variables (nouvelles valeurs) |
| **Supabase** | Base Postgres, authentification | 1 projet (région déclarée : Paris, AWS eu-west-3) | **Toutes les données** : comptes, devis, relances, réponses, prospects, suppressions, événements | — | Transfert de l’organisation/projet Supabase, ou migration (dump/restore) vers un projet à lui |
| **Stripe** | Abonnements Pro, factures, portail client | Compte Stripe (Live), 1 produit/prix Pro 29 €/mois, 1 webhook | Clients, abonnements, paiements, factures | Entité légale de l’éditeur | Voir [08](08-billing-stripe.md) : un compte Stripe **n’est pas cessible simplement** ; migration des abonnements à prévoir |
| **Brevo** | Envoi des emails (produit + prospection), webhooks de livraison | Compte Brevo, domaine `relanzio.com` authentifié, expéditeurs, 1 webhook transactionnel (+ inbound éventuel) | Contacts/emails envoyés, journaux de livraison | DNS (SPF, DKIM, code Brevo) | Transfert du compte ou nouveau compte + ré-authentification du domaine |
| **OVH** | Domaine `relanzio.com`, DNS, boîte(s) mail du domaine | Domaine, zone DNS, MX OVH (`mx*.mail.ovh.net`) | Emails de la boîte commerciale (`contact@`) et autres boîtes OVH — À confirmer | — | Transfert du domaine (code de transfert / changement de titulaire), zone DNS, boîtes |
| **Amelu** | Boîte de réception des réponses clients | `reponses@reply.relanzio.com` (MX `marduk.mx.amelu.org`), IMAP 993 | Réponses des clients finaux des artisans | DNS (`reply.relanzio.com`) | Transfert du compte ou nouvelle boîte + variables `REPLY_*` |
| **Cloudflare** | Présent devant le site (un script Cloudflare est injecté dans les pages) | À confirmer (proxy DNS ? Web Analytics ?) | À confirmer | DNS | À confirmer |
| **OpenAI** (optionnel) | Analyse des réponses de prospection, assistant support | Clé API | Textes envoyés à l’API (sans conservation demandée) | — | Nouvelle clé ou désactivation (repli sans IA prévu dans le code) |
| **Stockage des sauvegardes** | Sauvegardes de la base | **À confirmer** (le script `scripts/backup.sh` écrit en local ; aucune sauvegarde automatisée hors Supabase n’existe dans le code) | Dumps complets | Supabase | Voir [06](06-backup-restore-runbook.md) |
| **Analytics / monitoring externes** | — | Aucun dans le code (pas de Sentry, pas de service d’uptime). Événements produit internes (`product_events`) | — | — | Ajouter un monitoring si souhaité ([12](12-monitoring-and-incidents.md)) |

## Adresses email utilisées (noms, pas de mots de passe)

| Adresse | Usage |
|---|---|
| `notifications@relanzio.com` (`EMAIL_FROM_ADDRESS`) | Expéditeur des emails produit — À confirmer en production |
| `support@relanzio.com` | Contact support affiché |
| `contact@relanzio.com` | Expéditeur et Reply-To de la prospection (codé dans `server/pilot-outreach-policy.js`) |
| `reponses@reply.relanzio.com` (+ jetons) | Réception des réponses aux relances clients |

## Domaine et DNS (relevé public du 2026-11-04)

- `relanzio.com` : MX OVH ; SPF `include:mx.ovh.com include:spf.brevo.com ~all` ; DMARC `p=none` (rapports Brevo) ;
  DKIM Brevo `brevo1._domainkey` et `brevo2._domainkey` (CNAME) ; code de vérification Brevo présent.
- `reply.relanzio.com` : MX Amelu ; SPF `v=spf1 mx -all`.
