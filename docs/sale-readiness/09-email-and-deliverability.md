# 09 — Emails et délivrabilité

## Fournisseur : Brevo

Deux flux distincts dans `server/email.js` :

| Flux | Emails | Clé | Expéditeur |
|---|---|---|---|
| `product` | Relances envoyées pour les artisans (Pro), transferts de réponses, rappels, facturation | `BREVO_API_KEY` | `EMAIL_FROM_ADDRESS` ; nom « *Entreprise* via Relanzio » pour les relances |
| `outreach` | Prospection de Relanzio (D0, J+3) | `OUTREACH_BREVO_API_KEY` sinon `BREVO_API_KEY` | `contact@relanzio.com` (Reply-To `contact@relanzio.com`) |

Les erreurs Brevo sont journalisées **sans les adresses email** (masquées).

## Authentification du domaine `relanzio.com` (relevé public)

| Mécanisme | Valeur publiée | État |
|---|---|---|
| SPF | `v=spf1 include:mx.ovh.com include:spf.brevo.com ~all` | Brevo et OVH autorisés |
| DKIM | `brevo1._domainkey`, `brevo2._domainkey` → CNAME Brevo | Présents |
| DMARC | `v=DMARC1; p=none; rua=…@dmarc.brevo.com` | Présent, **en mode surveillance** (`p=none`) |
| Code Brevo | TXT `brevo-code` | Présent |

Avant chaque email commercial, le code revérifie SPF, DKIM (en DNS public), DMARC, l’authentification Brevo du domaine,
l’expéditeur actif, le webhook transactionnel et les crédits (`getBrevoPilotSenderStatus`). Échec ⇒ pause, 0 email.

## Webhooks Brevo

- `POST /api/brevo/webhook` (en-tête `x-webhook-secret` = `BREVO_WEBHOOK_SECRET`) : `delivered`, `opened`, `clicked`,
  `hardbounce` / `softbounce` / `invalid` / `blocked` / `error` / `spam` (→ bounce), `unsubscribed` (→ opt-out).
  Effets : statut des relances et des envois commerciaux, ajout en `suppressions`, désactivation de l’envoi automatique des devis
  du destinataire après un bounce dur.
- `POST /api/brevo/inbound` (même secret) : réponses entrantes à la prospection, si l’inbound Brevo est configuré.

## Boîte des réponses clients (produit)

- Adresse : `reponses@reply.relanzio.com` (Amelu, IMAP 993). Chaque relance envoyée par Relanzio a un `Reply-To`
  unique `reponses+<jeton de 20 caractères>@reply.relanzio.com`.
- Relevé toutes les 2 minutes, **en lecture seule** (EXAMINE, aucune suppression/déplacement), INBOX + Junk + Spam, 7 derniers jours.
- Une vraie réponse (intéressé, question, prix, délai, refus, STOP, autre) ⇒ **arrêt immédiat** de la séquence
  (`apply_quote_reply`) ; aucune relance 2 ou 3 ne peut partir, contrôle répété juste avant l’appel Brevo.
- **STOP** ⇒ désinscription du client chez cet artisan (`followup_optouts`, source `reply_stop`).
- **Absence / réponse automatique** ⇒ enregistrée, signalée à l’artisan, **la séquence continue** (aucune date de retour devinée).
- **Non remis (bounce)** ⇒ envoi automatique coupé, artisan prévenu.
- **Notification artisan** : la réponse est transférée à l’artisan (pièces jointes autorisées jusqu’à 8 Mo) avec `Reply-To` = client ;
  en cas d’échec d’envoi, jusqu’à 5 nouvelles tentatives.
- Validé en production avec de vrais emails (réponse, absence, STOP) le 2026-11-04 selon le propriétaire.

## Boîte commerciale (prospection)

- IMAP `IMAP_*` (OVH, TLS 993), relevée toutes les 10 minutes et **à chaque tick** de la séquence : si elle n’est pas joignable,
  la séquence se met en pause (0 email).
- Réponses analysées (OpenAI si clé présente, sinon règles) : positive ⇒ suivi humain (`sales_followups`) et arrêt de la séquence
  de **ce** prospect seulement ; refus / STOP ⇒ suppression ; absence ⇒ pas d’arrêt, le J+3 reste prévu.

## Suppressions

Table `suppressions` commune : toute adresse en bounce, plainte, désinscription, refus ou STOP n’est plus jamais contactée
(contrôle avant import, avant chaque envoi, et dans `sendEmail` lui-même). Les prospects supprimés sont gardés en
`prospect_tombstones` pour empêcher toute réimportation.

## Points d’attention

- DMARC `p=none` : acceptable au démarrage ; passer à `quarantine` après observation des rapports (décision du propriétaire).
- La prospection et le produit partagent aujourd’hui le domaine `relanzio.com` (la clé Brevo dédiée à la prospection est optionnelle).
  Recommandation : sous-domaine ou compte Brevo dédiés à la prospection.
