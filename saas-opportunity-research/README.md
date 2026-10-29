# Étude d'opportunités SaaS — exploration mondiale multi-marchés

Démarrée et terminée le 2026-10-29. Statut : **phases 1 à 5 terminées. Conclusion : AUCUNE IDÉE VALIDÉE À CE STADE.**
- **Recommandation n° 1 (à tester, pas à construire)** : dossier de conformité des formateurs sous-traitants et preuves de réalisation pour les organismes de formation de 2 à 10 personnes certifiés Qualiopi.
- **n° 2** : relance de devis TPE (Relanzio), en test commercial borné.
- **n° 3** : conformité FCC pour petits opérateurs VoIP US (parquée).
- **Lire d'abord** : `07-memo-decision.md`, puis `10-validation-30-jours.md`.

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
- 691 preuves sourcées (extraits de recherche : la lecture de pages était bloquée par le réseau).

## Fichiers
Voir la liste en bas de `07-memo-decision.md`. Les fichiers de travail (briefs, livrables bruts des analystes, scripts reproductibles) sont dans `_work/`.
