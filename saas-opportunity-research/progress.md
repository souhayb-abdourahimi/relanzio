# Progress — étude d'opportunités SaaS (2026-10-29)

## Audit de l'environnement
- [x] WebSearch opérationnel ; **WebFetch bloqué** par la politique réseau (voir `11-sources-et-limites.md` §1)
- [x] Python 3.13, écriture de fichiers et sous-agents disponibles
- [x] Founder Skill : non installé comme skill/plugin. Archive fournie extraite dans le scratchpad (hors dépôt), 11 SKILL.md lus, 4 scripts audités (bibliothèque standard, aucun accès réseau). founder-board, founder-cfo et founder-plan ont été appliqués.
  - Installation officielle : `/plugin marketplace add Jakeschincariol/founder-skill` puis `/plugin install founder-skill@founder-skill`
- [x] Dépôt hôte : Relanzio v0.4 ; étude isolée dans `saas-opportunity-research/`
- [x] Interruption par limite d'usage (vers 11 h 50 UTC) ; reprise sans perte

## Phases
- [x] Phase 1 — cartographie : 31 familles, 206 opportunités, 246 preuves (5 analystes)
- [x] Phase 3a — notation harmonisée de 38 pistes (`_work/score.py`) → `03-classement-top20.csv`
- [x] Phase 2/4 — 8 due diligences (5 finalistes + B-11, E-01 + contrôle E-13) avec recherche contraire
- [x] Vérification de 5 alternatives négligées (C-39, C-01, C-14, D-15, E-21) : aucune au-dessus de 62,5
- [x] Red team distincte + conseil founder-board (2 FUND IF, 1 PASS, 3,7/10)
- [x] Phase 3b — notes après recherche contraire et red team ajoutées à `03-classement-top20.csv`
- [x] Phase 5 — mémo, business model (unit_economics.py), MVP, plan de validation sur 30 jours, sources et limites

## Phase 6 — audit critique (2026-10-29 soir)
- [x] Relecture des 3 sources primaires du porteur tentée : **échec** (DNS refusé pour leportailformateurs.fr, help.digiforma.com, legifrance.gouv.fr). Vérification par extraits
- [x] Audit D-37 : matrice de 9 outils, obligations classées (obligatoire / conseillé / commercial), notes 47,5 (grille d'origine) et 38,5 (v2) → **ABANDON**
- [x] Grille v2 avec critère Potentiel (20 %) ; 3 recherches nouvelles (N1 verticales, N2 infrastructure/API, N3 service-as-software) : 31 pistes
- [x] Red team 2 : propreté 51,0 ; API e-facture 50,5 ; recouvrement 49,5 → aucune retenue
- [x] Interruption par limite d'usage (reset à 17 h UTC), reprise sans perte
- [x] Fichiers 03b, 05 (addendum), 06 (943 preuves) et 12 créés ou mis à jour ; bandeaux de révision sur 04, 05, 07, 08, 09, 10 et founder/

## Phase 7 — micro-SaaS solo revendable (2026-10-29 nuit)
- [x] Grille v3 (acquisition 20, revente 15…) ; re-classement de 27 pistes existantes et nouvelles (`_work/P7-rescreen*`)
- [x] Données de cession (multiples constatés, seuils) et règles micro-entrepreneur 2026 (`_work/P7-cession.md`, `_work/P7-fiscal.md`)
- [x] 3 études approfondies : C-39 50 ; N04 49,5 ; N06 48,5
- [x] Simulations reproductibles (`P7-simulations-financieres.md`) ; red team 3, option achat comprise
- [x] Interruption par limite d'usage (reset à 22 h 10 UTC), reprise sans perte
- [x] Décision : `13-micro-saas-decision.md`

## Décisions restant à vérifier (humain)
- [ ] **J0 : inventaire des contacts décideurs par segment + budget perdable** → règle du fichier 13
- [ ] Sprint de vente de 30 jours sans code ; GO seulement avec ≥ 3 paiements
- [ ] **Inventaire de vos accès réels** : secteurs où vous joignez ≥ 20 décideurs (variable la plus discriminante)
- [ ] Sprint de découverte terrain de 30 jours (§7 du fichier 12) ; critère global : 0 paiement à 90 jours → problème de distribution
- [ ] (Obsolète depuis la phase 6) Webinaire SYCFI du 4/11/2026 : prix, opérateur et fonctions du « Portail des Formateurs »
- [ ] Essais d'une journée : Formiva, Qualiobee, Digiforma (module sous-traitants ?) ; Obat, Tolteck, EBP, Batappli, Extrabat, Abby (relance automatique de devis ?)
- [ ] Parution du guide de lecture Qualiopi v10 et des arrêtés des indicateurs 19 et 20
- [ ] Lecture des textes officiels une fois le réseau ouvert (Légifrance : décret 2026-728, loi 2026-534)
- [ ] Accord du porteur avant tout contact commercial (aucun message envoyé)
- [ ] Comité de décision à J30 (matrice dans `10-validation-30-jours.md`)
