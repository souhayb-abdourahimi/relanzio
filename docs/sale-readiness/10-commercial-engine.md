# 10 — Moteur de prospection commerciale

Outil interne d’acquisition de Relanzio (prospection B2B d’artisans par email). Distinct du produit vendu.

```
BACKLOG → VERIFY → IMPORT → D0 → J+3 → END → NEXT PROSPECTS
```

> ## ABSOLUMENT AUCUN J+7
> La séquence est **D0 → J+3 → FIN**. Aucune troisième étape n’existe : le moteur ne sélectionne que les étapes 0 et 1,
> l’ancienne file ne sélectionne ni n’envoie jamais une étape ≥ 2, et toute étape ≥ 2 en attente est annulée à chaque tick
> (`sequence_simplified_no_j7`). Testé : `test/prospection-pipeline.test.js`, `test/stream-isolation.test.js`.

## Étapes

| Étape | Où | Ce qui se passe |
|---|---|---|
| **BACKLOG** | `outreach_candidates` | Candidats importés par l’admin (`POST /api/admin/outreach/candidates/import`) avec une **source publique** : entreprise, email publié, page source, secteur, score. Statut initial `waiting`, `manual_review` ou `rejected`. |
| **VERIFY** | `server/commercial-feeder.js` (toutes les 10 min) | Revérification par petits lots des `manual_review` éligibles : score ≥ 55, suppression, tombstone, doublon exact, doublon de domaine, MX (DNS robuste), email présent sur la page publique, parcours de devis visible. Plus strict : messagerie grand public, entreprise déjà connue ou domaine déjà présent ⇒ revue humaine. Ne passe en `waiting` que si **tout** est vrai. |
| **IMPORT** | idem | Les `waiting` sont revérifiés **une seconde fois**, importés via `safe_import_qualified_prospect` (idempotent, refuse suppressions et tombstones). |
| **D0** | `server/controlled-outreach.js` (tick toutes les 5 min) | Préparé en file (`ready`), envoyé par le tick si tous les contrôles passent. Sujet approuvé, personnalisation, prix 29 €/mois, essai 7 jours, ligne STOP obligatoires. |
| **J+3** | idem | Créé à l’envoi du D0, envoyé 3 jours plus tard **seulement si** le D0 a une confirmation de livraison Brevo et qu’aucune réponse, opposition ou bounce n’existe. Sujet `Re: <sujet D0>`. |
| **END** | — | Plus rien après le J+3. |
| **NEXT PROSPECTS** | feeder | Quand le stock de D0 prêts passe sous le seuil, le feeder prépare les suivants. |

## Horaires, quotas, rythme

- Jours ouvrés **lundi–vendredi, 8 h 30 – 18 h (Europe/Paris)** uniquement.
- **1 email maximum par tick de 5 minutes**, pas de rafale (le tick renvoie après le premier envoi).
- Plafond quotidien : capacité Brevo (300/jour sur l’offre gratuite), éventuellement réduit par `OUTREACH_DAILY_CAP` ; réservation
  atomique par jour calendaire de Paris (`claim_outreach_daily_slot`). Une erreur survenue avant l’appel Brevo libère le créneau.

## Garde-fous avant CHAQUE envoi

1. Flags : `LEGAL_PAGES_APPROVED`, `COMMERCIAL_SEQUENCE_ENABLED`, `COMMERCIAL_OUTREACH_SEND_ENABLED`.
2. Boîte commerciale IMAP joignable (relevée à chaque tick) et certifiée (`IMAP_E2E_CERTIFIED`).
3. Santé de délivrabilité 24 h : pause si 1 plainte spam, ≥ 2 blocages, ≥ 2 bounces ou taux de bounce ≥ 10 % (dès 5 envois).
4. Expéditeur Brevo actif, domaine authentifié, SPF, DKIM, DMARC, webhook transactionnel, crédits.
5. Prospect : qualifié, score ≥ 55, source publique, base `professional_relevance`, ni supprimé ni tombstone, email unique,
   aucun envoi ni réponse antérieurs, un seul D0 en file, MX valide (une panne DNS met en pause, ne supprime pas).
6. Revérification après réservation, juste avant l’appel Brevo.

Toute anomalie ⇒ **pause** (journal `Commercial sequence paused` + raison), 0 email. Erreur permanente sur un prospect ⇒ son
élément est annulé et le tick passe au suivant.

## Réponses

| Réponse | Effet |
|---|---|
| Positive (intéressé, prix, demande) | Suivi humain créé (`sales_followups`), J+3 de **ce** prospect annulé, **la campagne continue** pour les autres |
| Refus | Adresse supprimée, plus aucun envoi |
| STOP | Adresse supprimée (`opt_out`) |
| Bounce | Événement `bounced`, suppression, compte dans la santé de délivrabilité |
| Absence automatique | Enregistrée, **ne bloque pas** le J+3 |
| Doublon (même message) | Ignoré (clé de déduplication) |

## Observabilité

- Logs Railway : `outreach.backlog` (comptages, sans données personnelles), `outreach.commercial-feeder`,
  `outreach.commercial-sequence` (`Commercial D0 sent` avec message ID, `Commercial sequence paused`), `cron.commercial-*`.
- Admin : `GET /api/admin/outreach-health` (santé 24 h, backlog, file).
- QA avant chaque déploiement : `server/qa-outreach-safety.mjs` (contre la vraie base, données de test isolées).

## Pour arrêter immédiatement

Railway : `COMMERCIAL_OUTREACH_SEND_ENABLED=false` (redémarrage du service). Aucun autre changement nécessaire.

## Dépendance au fondateur

Les emails D0 et J+3 sont **signés « Souhayb »** (`server/controlled-outreach-policy.js`, `server/pilot-outreach-policy.js`).
Un repreneur devra changer cette signature (petite modification de code + tests), voir [18](18-founder-action-list.md).
