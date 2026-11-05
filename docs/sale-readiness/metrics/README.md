# Métriques — requêtes SQL en lecture seule

À exécuter dans l’éditeur SQL Supabase (ou `psql` sur une **copie** de la base). Toutes les requêtes sont des `select` :
aucune ne modifie de données. Elles ne renvoient que des **agrégats** (aucun nom, email ou contenu).
Les comptes et prospects de test créés par la QA avant déploiement sont exclus.

| Fichier | Métriques |
|---|---|
| `01-revenue.sql` | Clients payants, MRR, ARR, ARPU (état actuel) ; nouveaux abonnements et résiliations par mois (événements Stripe) |
| `02-trials.sql` | Nouveaux essais par mois, conversion essai → payant |
| `03-churn.sql` | Churn mensuel (résiliations / abonnés), comptes en défaut de paiement |
| `04-usage.sql` | Utilisateurs, actifs 7/30 jours, devis, relances, taux de relance, réponses, devis gagnés |
| `05-outreach.sql` | Prospection : D0, J+3, livraison, bounces, réponses, opt-out, backlog des candidats |
| `06-deliverability.sql` | Délivrabilité des relances produit (livré, bounce) |

## Limites (à dire à un acheteur)

- **MRR exact** : le tableau de bord Stripe fait foi (remises, taxes, remboursements). `01-revenue.sql` donne une estimation
  `abonnés actifs × 29 €`.
- L’historique d’abonnement n’est pas conservé en base au-delà des événements Stripe reçus (`stripe_webhook_events`, depuis leur création).
  Pour un historique de MRR mensuel fiable, exporter les revenus depuis Stripe chaque mois.
- Coûts d’infrastructure et marge brute : voir `../11-operating-costs.md` (factures).
