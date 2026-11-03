# 17 — Résultats de la découverte (phase 10)

Date : 2026-11-03. Méthode : `16-methodologie-decouverte.md`.

**Équipe** :
- 4 découvreurs, un par angle :
  - D1 : tâches manuelles payées ;
  - D2 : insatisfaction mesurable ;
  - D3 : ruptures récentes ;
  - D4 : recyclage critique et combinaisons ;
- 3 vérificateurs distincts (V1 à V3), chacun red team et analyste de la concurrence ;
- consolidation par le directeur de recherche.

**Volume** : 36 pistes construites à partir de problèmes observés ; 12 vérifiées de façon contradictoire (au moins 6 formulations, recherche nominative) ; 2 approfondies.

**Étiquettes** : [F] fait vérifié, [O] observation indirecte, [H] hypothèse, [E] estimation, [M] information manquante.

**Limites** :
- **Pages non lues** : WebFetch est bloqué dans cette session, donc les avis, Reddit, G2, Légifrance et les pages d'éditeurs n'ont été vus que par **extraits de moteur**.
- **Seule source directe** : les offres d'emploi lues via l'outil Indeed.
- Aucun prospect contacté, aucun avis simulé, aucun logiciel construit.

---

## Réponse courte

**Je n'ai pas trouvé de déséquilibre de marché fort**, c'est-à-dire une demande prouvée face à une offre faible. Aucune piste ne dépasse 57/100 après vérification, et aucune n'a une confiance « élevée » sur la demande.

**Constat central** : sur 12 pistes vérifiées, la note a baissé en moyenne de **10,1 points**. La cause est toujours la même : une recherche **nominative et multilingue** trouve les concurrents que la découverte ne voit pas. Exemples :
- Appel Consenti (29 €/mois) pour le registre de consentement au démarchage ;
- Fotostudio, Helpho, AdminPhoto, Octoa et Fotografen.Management pour les photographes de mariage ;
- HubyUP (49 €/mois) pour les redevances de franchise ;
- Tacto (50 M€ levés) et Phacet pour la relance des ARC ;
- DataFret et Sightness pour les factures transporteurs ;
- Billbee (9 €) pour les vendeurs Etsy.

**Ce qui reste** est une piste au **déséquilibre étroit mais explicable**, avec un facteur nouveau :
- les tarifs fournisseurs hétérogènes des petits négoces ;
- une « longue traîne » que les standards (FAB-DIS) et les éditeurs ne couvrent pas ;
- un traitement fiable et peu coûteux rendu possible par les LLM depuis 2024-2026.

**Recommandation : la tester en premier.** Son test technique initial ne demande **aucun contact** : il se fait sur des tarifs fournisseurs publics.

---

## A. TOP 15 des opportunités
Source : `17-top-pistes.csv`, généré par `_work/build_p10_top.py` à partir de `_work/P10-D*-pistes.csv` et `_work/P10-V*-scores.csv`. Détail de chaque piste dans `_work/P10-D1.md` à `P10-D4.md`, et des vérifications dans `_work/P10-V1.md` à `P10-V3.md`.

