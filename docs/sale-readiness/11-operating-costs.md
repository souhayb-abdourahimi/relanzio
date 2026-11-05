# 11 — Coûts d’exploitation

Les prix réels dépendent des offres souscrites et des factures, **qui ne sont pas lisibles depuis le code**. Aucun montant n’est
inventé : chaque ligne est **À renseigner par le propriétaire** à partir des factures des 3 à 12 derniers mois.

| Catégorie | Fournisseur | Ce qui est facturé | Offre actuelle | Coût mensuel | Variable avec l’activité ? |
|---|---|---|---|---|---|
| Hébergement | Railway | Service Docker (CPU/RAM au temps d’usage) | À renseigner par le propriétaire | À renseigner par le propriétaire | Faiblement |
| Base de données | Supabase | Projet Postgres + Auth (+ sauvegardes selon l’offre) | À renseigner par le propriétaire | À renseigner par le propriétaire | Faiblement |
| Paiements | Stripe | Commission par transaction (pas d’abonnement fixe) | À renseigner par le propriétaire | À renseigner par le propriétaire (% du chiffre d’affaires) | **Oui** |
| Emails | Brevo | Volume d’emails (offre gratuite : plafond 300/jour, déduit du code) | À confirmer | À renseigner par le propriétaire | Oui au-delà du plafond |
| Domaine | OVH | Renouvellement annuel `relanzio.com` | À renseigner par le propriétaire | À renseigner par le propriétaire (annuel) | Non |
| Boîtes mail | OVH (boîte commerciale), Amelu (réponses) | Hébergement email | À renseigner par le propriétaire | À renseigner par le propriétaire | Non |
| Sauvegardes hors site | — | Stockage des dumps chiffrés | Aucun à ce jour (À confirmer) | À renseigner par le propriétaire | Non |
| Code / CI | GitHub | Dépôt + GitHub Actions | À renseigner par le propriétaire (dépôt public : Actions gratuites) | À renseigner par le propriétaire | Non |
| IA (optionnel) | OpenAI | Appels API (analyse des réponses de prospection, assistant support) | À renseigner par le propriétaire | À renseigner par le propriétaire | Oui |
| CDN / proxy | Cloudflare | À confirmer | À confirmer | À renseigner par le propriétaire | Non |

## Marge brute estimée

Une fois les lignes remplies :

```
Revenu mensuel (MRR, voir metrics/01-revenue.sql)
− Coûts fixes mensuels (Railway + Supabase + domaine/12 + boîtes mail + sauvegardes + GitHub)
− Coûts variables (Stripe ≈ % du MRR + Brevo au-delà du gratuit + OpenAI)
= Marge brute
```

Les requêtes SQL de [metrics/](metrics/README.md) donnent le revenu ; les coûts viennent des factures (data room « après NDA »).
