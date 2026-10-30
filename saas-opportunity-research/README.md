# Étude d'opportunités SaaS — exploration mondiale multi-marchés

Démarrée le 2026-10-29 ; **audit critique (phase 6) le même jour.**

**Statut actuel (phase 9, validation de N06)** : **avant tout contact**, trois essais : Order Invoicer en offre gratuite, démo Pennylane Collaboratif, Link My Books. Si une vue cabinet multi-dossiers existe déjà, N06 s'arrête.
- Ce qui reste à valider : un **« cockpit cabinet »** (versements non rapprochés de tous les dossiers, clôture groupée, onboarding en série).
- Le pilote devient un **pilote outil** : le cabinet paramètre, exécute et importe. Le pilote manuel est exposé au monopole de l'expertise comptable.
- Kit prêt et **non envoyé** : 22 cabinets vérifiés sur 30, questionnaire, offre, page `p9-landing/index.html`, messages, protocoles, critères de décision.
- **Lire d'abord** : `15-validation-n06.md`. Historique : 14 → 13 → 12 → 07.

## Hypothèses de travail (par défaut, non imposées)
- Créateur solo ou équipe de 1 à 3 personnes, technique ou aidée par l'IA, capital modéré, objectif : clients payants sans levée.
- Prototype testable en 2 à 6 semaines, MVP commercialisable en 6 à 12 semaines.
- Périmètre : le monde entier pour repérer les pistes ; comparaison explicite États-Unis / France-UE / autres.
- Priorité : SaaS B2B et SaaS vertical à revenus récurrents.
- Contexte observé dans le dépôt : le porteur développe déjà **Relanzio** (relance de devis pour TPE, stack Node/Express + Supabase + Stripe + Brevo, pré-pilotes). Cela renseigne sur ses compétences (marché francophone, stack JS), mais n'oriente pas le classement : la relance de devis est notée comme les autres pistes.

## Méthode
1. Audit des capacités (recherche web, sous-agents, Python, Founder Skill) → `progress.md`.
2. Phase 1 : cartographie de 30 familles de marché par 5 analystes travaillant en parallèle selon un format commun (`_work/brief-phase1.md`).
3. Phase 2 : collecte de signaux de demande sourcés, enregistrés dans le registre de preuves.
4. Phase 3 : grille pondérée sur 100, calculée par `_work/score.py` (calcul reproductible), puis classement top 20 et top 5.
5. Phase 4 : due diligence des 5 finalistes, avec un défenseur et un contradicteur distincts.
6. Phase 5 : recommandation, business model (`unit_economics.py` du Founder Skill), MVP et plan de validation sur 30 jours.

## Étiquetage
FAIT OBSERVÉ (sourcé) / ESTIMATION / HYPOTHÈSE / INCONNU. Aucun entretien client réel n'a été mené. Toute « validation » reste à obtenir sur le terrain.

## Chiffres clés
- 31 familles de marché, 206 opportunités, 38 notées sur une grille unique.
- 8 due diligences, 1 vérification de 5 alternatives négligées, 1 red team, 1 conseil founder-board (3 lentilles).
- Phase 6 : audit de D-37, 3 nouvelles recherches orientées potentiel (31 pistes), 1 red team supplémentaire.
- Phase 7 : re-classement de 27 pistes sur une grille micro-SaaS, 3 études approfondies, données de cession, règles micro-entrepreneur 2026, simulations, red team 3.
- Preuves sourcées (registre complet dans `06-registre-preuves.csv`) ; (extraits de recherche : la lecture de pages était bloquée par le réseau).

## Fichiers
Voir la liste en bas de `07-memo-decision.md`, plus `12-audit-critique.md` et `03b-classement-v2-potentiel.csv` (phase 6). Les fichiers de travail (briefs, livrables bruts des analystes, scripts reproductibles) sont dans `_work/`.
