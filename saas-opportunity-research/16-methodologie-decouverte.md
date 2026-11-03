# 16 — Méthodologie de découverte (phase 10)

Date : 2026-10-30.

**Objectif** : trouver un **déséquilibre de marché**. Il faut trois éléments réunis :
- des clients avec un problème important ;
- des solutions insuffisantes ;
- une possibilité réaliste, pour un fondateur solo assisté de Claude Code, de créer un meilleur produit.

Le produit doit pouvoir être exploité en micro-entreprise, financé par abonnement et revendu.

## 1. Ce qui change par rapport aux phases 1 à 9
| Avant | Maintenant |
|---|---|
| Partir de familles de marché et de réglementations, puis éliminer dès qu'un concurrent apparaît | **Partir de problèmes observés**, puis chercher la concurrence et les raisons pour lesquelles la lacune pourrait ne pas exister |
| « Concurrent trouvé » = pénalité | Un concurrent prouve la dépense. On analyse les **segments mal servis** |
| « Aucun concurrent trouvé » = lacune | « Aucun concurrent trouvé » = **incertitude**, à vérifier par plusieurs formulations, plusieurs langues et des éditeurs multi-verticaux |
| Grilles successives centrées sur la faisabilité ou l'acquisition | Grille v4 centrée sur la **demande et l'insuffisance de l'offre** |
| Pistes anciennes (N06, Relanzio, Qualiopi) | **Aucun privilège** : elles sont réévaluées comme les autres |

## 2. Quatre angles de découverte, menés en parallèle par des agents distincts

| Angle | Catégorie visée | Sources de signaux |
|---|---|---|
| **D1. Tâches manuelles payées** | A (demande forte, offre insuffisante) | Offres d'emploi décrivant une tâche répétitive précise ; prestataires et freelances payés pour cette tâche (Malt, Upwork, Fiverr, ComeUp) ; modèles Excel vendus ; forums métiers |
| **D2. Insatisfaction mesurable** | B (marché existant, différenciation radicale) | Avis négatifs récents (G2, Capterra, Trustpilot, app stores), fils « alternative à X » et « switching from X », demandes de fonctionnalités publiques, hausses de prix, produits abandonnés ou rachetés |
| **D3. Ruptures récentes** | C (nouveau ou révolutionnaire) | Nouvelles capacités IA (agents, vision, voix, MCP), nouvelles API publiques, obligations 2025-2027 qui créent un **workflow** nouveau (pas une simple case à cocher), nouveaux métiers |
| **D4. Recyclage critique et combinaisons** | A / B | Pistes des phases 1-9 éliminées surtout parce qu'un concurrent existait ; combinaisons de 2 ou 3 besoins traités aujourd'hui par des outils séparés |

## 3. Règles de preuve
Chaque affirmation porte l'une de ces étiquettes :
- **[F] fait vérifié** : source citée, extrait cohérent ;
- **[O] observation indirecte** : signal compatible, mais pas une mesure ;
- **[H] hypothèse** ;
- **[E] estimation** : raisonnement explicite ;
- **[M] information manquante.**

Règles absolues :
- On ne déduit jamais une demande forte du seul nombre de plaintes. On cherche aussi :
  - la **dépense actuelle** : prix des outils, salaires, prestataires ;
  - la **fréquence** du problème ;
  - le **coût de l'inaction**.
- **Nombre de sources ≠ nombre de preuves indépendantes.** Trois articles qui citent la même étude comptent pour une.
- Les témoignages ne sont jamais simulés. Les avis ne sont cités que s'ils apparaissent dans un extrait.
- **WebFetch est bloqué** dans cet environnement : les pages ne sont pas lues en entier. Toute preuve est un extrait de moteur de recherche et doit être marquée comme telle.

## 4. Concurrence sur trois niveaux, pour chaque piste retenue
1. **Directe** : quasiment la même solution.
2. **Indirecte** : une autre façon de résoudre le problème.
3. **Substituts** : Excel, automatisations (Zapier, n8n), services humains, logiciels généralistes, IA conversationnelle.

Pour chaque niveau, on note :
- le nombre de concurrents pertinents pour le **segment précis** ;
- leur maturité ;
- leur couverture fonctionnelle ;
- leurs prix ;
- leurs avantages commerciaux ;
- la satisfaction observable de leurs clients ;
- les besoins qu'ils ne couvrent pas ;
- la facilité pour un nouvel entrant de gagner des clients.

On cherche au moins en **français et en anglais**, et en allemand ou en espagnol lorsque cela aide à repérer un marché moins bien servi. **Au moins 3 formulations** de recherche par piste.

## 5. Grille v4 (sur 100)

| Critère | Points |
|---|---|
| Demande réelle et intensité du problème | 25 |
| Insuffisance vérifiable des offres actuelles | 20 |
| Faiblesse de la concurrence directe | 15 |
| Acquisition possible sans réseau personnel | 15 |
| Faisabilité et exploitation en solo | 10 |
| Rentabilité, récurrence et volonté de payer | 10 |
| Transférabilité et attractivité à la revente | 5 |

- Chaque critère est noté de 0 à 10, puis pondéré.
- Chaque note porte un **niveau de confiance** (élevée / moyenne / faible).
- À part, **sans effet sur la note** :
  - un **indice d'innovation** de 0 à 5 ;
  - une **possibilité de nouvelle catégorie** (oui / non / peut-être).
- **Garde-fou** : une piste dont la confiance sur la *demande* est faible ne peut pas dépasser une piste dont la demande est prouvée à note égale. En cas d'égalité, la preuve de demande l'emporte.

## 6. Déroulé
1. **Découverte** : 4 agents, un par angle, 8 à 12 pistes chacun, avec un dossier de preuves.
2. **Consolidation** : dédoublonnage et notation v4 harmonisée → TOP 15.
3. **Vérification contradictoire** : une red team et un analyste de la concurrence, distincts des découvreurs, cherchent la concurrence cachée et les preuves contraires. On re-note.
4. **Approfondissement des 5 premières** :
   - lacune réelle et pourquoi elle existe ;
   - économie ;
   - architecture solo ;
   - acquisition ;
   - revente.
5. **Choix** :
   - 3 gagnants par stratégie (A, B, C) ;
   - 1 recommandation finale ;
   - 1 alternative plus ambitieuse ;
   - plans de validation réels.
6. Tout est tracé dans `06-registre-preuves.csv` et dans `_work/P10-*`.

## 7. Contraintes du porteur (rappel)
- Fondateur solo + Claude Code ; micro-entreprise française.
- MRR visé : 2 000 à 5 000 € (objectif, pas présumé).
- MVP sans équipe ; architecture simple ; faible support ; automatisation ; intégrations stables ; faible risque juridique ; produit transférable.
- **Leçon de la phase 9** : se méfier des pistes qui reviennent à exercer une profession réglementée (comptabilité, droit, conseil fiscal ou financier).
- **Aucun logiciel n'est construit et aucun prospect n'est contacté sans l'accord du porteur.**
