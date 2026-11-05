# 17 — Questions de due diligence

Questions qu’un acheteur sérieux posera, avec où trouver la réponse. « À renseigner » = réponse à préparer par le propriétaire.

## Revenus et clients

| Question | Source |
|---|---|
| MRR / ARR actuels et sur 12 mois ? | `metrics/01-revenue.sql` + Stripe — À renseigner |
| Nombre de clients payants, nouveaux par mois ? | `metrics/01-revenue.sql` |
| Churn mensuel (logo et revenu) ? | `metrics/03-churn.sql` + Stripe |
| ARPU ? Remises, prix différents ? | Prix unique 29 €/mois (`shared/plans.js`) ; Stripe pour les exceptions |
| Conversion essai → payant ? | `metrics/02-trials.sql` |
| Concentration du revenu (un gros client ?) | Stripe — À renseigner |

## Usage

| Question | Source |
|---|---|
| Utilisateurs inscrits, actifs (7 / 30 jours) ? | `metrics/04-usage.sql` |
| Devis suivis, relances faites, réponses obtenues, devis gagnés ? | `metrics/04-usage.sql` |
| Le produit fait-il gagner des devis ? | `metrics/04-usage.sql` (gagnés après relance / après réponse) |

## Acquisition

| Question | Source |
|---|---|
| D’où viennent les clients ? | Prospection interne ([10](10-commercial-engine.md)), SEO (pages pré-rendues) — À renseigner |
| Coût d’acquisition ? | Coûts Brevo + temps — À renseigner |
| Résultats de la prospection (envois, livraisons, réponses, bounces) ? | `metrics/05-outreach.sql` |
| La prospection est-elle conforme (RGPD, LCEN) ? | **LEGAL REVIEW REQUIRED** ([21](21-legal-review-checklist.md)) |

## Coûts et marge

| Question | Source |
|---|---|
| Coûts mensuels par fournisseur ? | [11](11-operating-costs.md) — À renseigner |
| Marge brute ? | [11](11-operating-costs.md) |

## Technique

| Question | Source |
|---|---|
| Stack, architecture, dette technique ? | [02](02-architecture.md), [audit-findings.md](audit-findings.md) |
| Tests et CI ? | [05](05-deployment-runbook.md) : ~220 tests unitaires, SQL, E2E, mobile, accessibilité, QA avant déploiement |
| Sécurité, secrets, RLS ? | [13](13-security.md) |
| Sauvegardes et restauration testée ? | [06](06-backup-restore-runbook.md) — **à confirmer et tester** |
| Disponibilité (uptime), incidents passés ? | Pas de moniteur ni de registre — À renseigner |
| Dépendance au fondateur ? | [18](18-founder-action-list.md), [audit-findings.md](audit-findings.md) |
| Combien d’heures pour maintenir le produit ? | À renseigner par le propriétaire |

## Juridique et données

| Question | Source |
|---|---|
| Qui possède le code, le domaine, la marque ? | [15](15-ip-and-licenses.md), [16](16-transfer-checklist.md) — À confirmer |
| Données personnelles traitées, où, combien de temps ? | [07](07-database.md), politique de confidentialité — **LEGAL REVIEW REQUIRED** |
| Sous-traitants et transferts hors UE (Railway aux États-Unis, OpenAI) ? | `shared/company.js` (liste publique) — **LEGAL REVIEW REQUIRED** |
| Contrats fournisseurs cessibles ? | À confirmer |
| Litiges, plaintes, demandes RGPD reçues ? | À renseigner |
