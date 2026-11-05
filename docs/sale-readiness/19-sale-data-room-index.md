# 19 — Index de la data room

Règle absolue : **aucun secret** (clé, mot de passe, jeton) dans aucun niveau. Les accès techniques se créent au moment du transfert,
directement par l’acheteur. Données personnelles : uniquement agrégées, jamais nominatives, avant le paiement.

## PUBLIC / NON SENSIBLE (annonce)

- Présentation du produit ([01](01-product-overview.md)), captures d’écran (données fictives).
- Offre : Free 5 devis, Pro 29 €/mois 100 devis, essai 7 jours sans carte.
- Stack générale (Node, React, Supabase, Stripe, Brevo, Railway).
- Fourchettes de métriques (si le propriétaire le souhaite).

## CONFIDENTIEL APRÈS NDA

- Ce dossier `docs/sale-readiness/` complet (sans secret).
- Métriques mensuelles détaillées (agrégées) : MRR, clients, essais, churn, usage, prospection ([metrics/](metrics/README.md)).
- Coûts réels par fournisseur ([11](11-operating-costs.md)) et factures (montants).
- Résultats de délivrabilité (taux de livraison, bounces, plaintes) et de prospection (agrégés).
- Accès en lecture au dépôt GitHub (s’il est privé).
- Sortie de `npm run sale:health`.

## CONFIDENTIEL APRÈS LOI (lettre d’intention)

- Export Stripe des revenus par mois (sans données de carte, clients pseudonymisés).
- Démonstration avec accès administrateur (en présence du fondateur).
- Historique des incidents et du support (anonymisé).
- Résultat d’un test de restauration de sauvegarde.
- Questions juridiques et réponses du professionnel ([21](21-legal-review-checklist.md)).
- Contrats / conditions des fournisseurs, titularité des comptes, domaine, marque.

## TRANSFERT UNIQUEMENT APRÈS PAIEMENT

- Dépôt GitHub (propriété), projet Supabase (avec les données personnelles), projet Railway, domaine, boîtes mail, compte Brevo.
- Base clients et base prospects **avec** `suppressions`, `followup_optouts` et `prospect_tombstones` (obligatoire).
- Sauvegarde chiffrée finale (clé transmise séparément, hors email).
- Les secrets ne sont **jamais** transférés : l’acheteur génère les siens ([13](13-security.md)).
