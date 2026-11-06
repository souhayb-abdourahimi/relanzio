# Relanzio — dossier de préparation à la cession

Ce dossier décrit Relanzio pour un futur repreneur : produit, architecture, services, exploitation, risques et transfert.
Il ne contient **aucun secret** (seulement des noms de variables) et **aucune donnée réelle** de client ou de prospect.

> État : préparé le 2026-11-05 à partir du code de la branche de production `staging` (version déployée `1cc431e`).
> Tout ce qui ne peut pas être lu dans le code (contrats, coûts, propriétaires de comptes, offres souscrites, chiffres d’activité)
> est marqué **À confirmer** ou **À renseigner par le propriétaire**. Rien n’a été inventé.

## Sommaire

| # | Document | Pour qui |
|---|---|---|
| 01 | [Produit](01-product-overview.md) | Acheteur, tous |
| 02 | [Architecture](02-architecture.md) | Technique |
| 03 | [Inventaire des services](03-infrastructure-inventory.md) | Technique, transfert |
| 04 | [Variables d’environnement](04-environment-variables.md) | Technique |
| 05 | [Déploiement](05-deployment-runbook.md) | Technique |
| 06 | [Sauvegarde et restauration](06-backup-restore-runbook.md) — inventaire : [backup-inventory.md](backup-inventory.md) | Technique, transfert |
| 07 | [Base de données](07-database.md) | Technique |
| 08 | [Facturation Stripe](08-billing-stripe.md) | Technique, finance |
| 09 | [Emails et délivrabilité](09-email-and-deliverability.md) | Technique |
| 10 | [Moteur de prospection commerciale](10-commercial-engine.md) | Technique, commercial |
| 11 | [Coûts d’exploitation](11-operating-costs.md) | Finance |
| 12 | [Surveillance et incidents](12-monitoring-and-incidents.md) | Technique |
| 13 | [Sécurité](13-security.md) | Technique |
| 14 | [Dépendances tierces](14-third-party-dependencies.md) | Technique, juridique |
| 15 | [Propriété intellectuelle et licences](15-ip-and-licenses.md) | Juridique |
| 16 | [Checklist de transfert](16-transfer-checklist.md) | Transfert |
| 17 | [Questions de due diligence](17-buyer-due-diligence.md) | Acheteur |
| 18 | [Actions du fondateur](18-founder-action-list.md) | **Fondateur** |
| 19 | [Index de la data room](19-sale-data-room-index.md) | Vente |
| 20 | [Plan de transition](20-transition-plan.md) | Acheteur |
| 21 | [Points à faire vérifier par un professionnel](21-legal-review-checklist.md) | Juridique — **LEGAL REVIEW REQUIRED** |
| — | [Audit de cession (constats classés)](audit-findings.md) | Tous |
| — | [Métriques : requêtes SQL en lecture seule](metrics/README.md) | Finance, acheteur |

## Outil de vérification

`npm run sale:health` (script `scripts/sale-readiness-health.mjs`) vérifie en lecture seule, avec les variables d’environnement de
production, que l’application, la base, Stripe, Brevo, les boîtes mail et les flags sont configurés. Il n’affiche aucun secret,
n’écrit rien et n’envoie aucun email. Voir [05-deployment-runbook.md](05-deployment-runbook.md#vérification-lecture-seule).

## Règles de ce dossier

- Jamais de valeur de secret : seulement le **nom** des variables.
- Jamais de donnée personnelle de client ou de prospect.
- Les points juridiques sont signalés **LEGAL REVIEW REQUIRED** : ce dossier n’est pas un avis juridique.
