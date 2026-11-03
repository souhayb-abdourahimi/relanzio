# B — Top 8 et éliminations

Analyste B · secteurs traditionnels et terrain · 2026-10-29.

Grille (total sur 100) : Douleur et budget /20 · Fréquence /10 · Preuves /15 · Distribution /15 · Lacune concurrentielle /10 · Faisabilité MVP /10 · Marge et récurrence /5 · Timing /5 · Défendabilité /5 · Risques /5.

Références : `B-longlist.csv` pour les identifiants B-xx, `B-preuves.csv` pour les identifiants P-B-xx.

## Tableau récapitulatif

| # | Id | Piste | D/20 | F/10 | P/15 | Dist/15 | L/10 | MVP/10 | M/5 | T/5 | Déf/5 | R/5 | **Total** | Confiance |
|---|----|-------|------|------|------|---------|------|--------|-----|-----|-------|-----|-----------|-----------|
| 1 | B-09 | Journal de conformité fuites AIM Act (ER&R) pour contractors HVAC/R commerciaux US | 15 | 8 | 9 | 9 | 6 | 9 | 4 | 5 | 2 | 3 | **70** | moyenne |
| 2 | B-11 | App testeurs backflow multi-districts (rapports, dépôt, rappels annuels, calibration) US | 13 | 9 | 9 | 11 | 5 | 9 | 4 | 2 | 3 | 4 | **69** | moyenne |
| 3 | B-10 | Fiche Cerfa 15497 + registre équipement + entretien PAC pour frigoristes indépendants FR puis UE | 13 | 8 | 8 | 10 | 5 | 9 | 4 | 3 | 3 | 4 | **67** | moyenne |
| 4 | B-18 | Pilotage conformité DPE d'un portefeuille de gestion locative (FR) | 13 | 5 | 9 | 9 | 6 | 9 | 4 | 5 | 2 | 3 | **65** | moyenne |
| 5 | B-03 | Certified payroll multi-formats (WH-347 v2025, eCPR XML DIR, formats LCPtracker) pour petits subcontractors US | 15 | 9 | 8 | 8 | 5 | 7 | 4 | 3 | 3 | 3 | **65** | faible-moyenne |
| 6 | B-01 | Dossier sous-traitant BTP (vigilance semestrielle, DC4, paiement direct, autoliquidation) pour PME donneuses d'ordre FR | 13 | 7 | 7 | 10 | 6 | 9 | 4 | 3 | 2 | 4 | **65** | faible-moyenne |
| 7 | B-02 | Suivi et récupération des retenues de garantie et cautions (FR) / retainage (US) | 12 | 5 | 5 | 9 | 7 | 10 | 4 | 2 | 2 | 5 | **61** | faible |
| 8 | B-26 | Inventaire branchements plomb LCRI pour petits réseaux d'eau US | 13 | 4 | 7 | 7 | 5 | 7 | 4 | 5 | 3 | 3 | **58** | faible |

## Justifications

### 1. B-09 — Conformité fuites ER&R, US : 70/100, confiance moyenne
- **Douleur 15.** Depuis le 1er janvier 2026, les appareils contenant au moins 15 lb d'HFC sont soumis à des seuils de fuite (10, 20 ou 30 %), à des délais de réparation et à une obligation de registres [P-B-08, P-B-09]. Le contractor tient ces registres pour ses clients.
- **Fréquence 8.** Le calcul se fait à chaque ajout de réfrigérant.
- **Preuves 9.** Règle et dates vérifiées. La demande est indirecte : un outil dédié aux petits contractors existe déjà [P-B-10]. Aucun témoignage de volonté de payer.
- **Distribution 9.** Grossistes en réfrigérants, ACCA, groupes de techniciens [H].
- **Lacune 6.** Ref LeakLog et Oxmaint existent. Les FSM n'ont pas, a priori, de calcul de fuite natif [H].
- **MVP 9.** Logique de calcul, registres et export PDF : simple.
- **Timing 5.** Le 1er janvier 2027 marque l'entrée de la réfrigération commerciale et industrielle existante.
- **Risques 3.** Possible reconsidération des règles AIM par l'EPA actuelle [H, non vérifié].
- **Synergie** avec B-10 : même cœur produit (registre de fluide par équipement) sur deux marchés.

### 2. B-11 — Testeurs backflow, US : 69/100, confiance moyenne
- **Douleur 13.** Chaque district a son format et son canal de dépôt. Le testeur paie des frais par rapport de 14,95 à 35,95 USD [P-B-22, P-B-23]. Les rapports sont rejetés si la licence ou la calibration n'est pas à jour. Les enregistrements annuels coûtent de 75 à 250 USD par ville [P-B-25].
- **Fréquence 9.** Test annuel par dispositif, ce qui fait des rappels un moteur de revenu pour le testeur.
- **Preuves 9.** Pages municipales officielles.
- **Distribution 11.** Listes publiques de testeurs agréés [H, à confirmer], formations ABPA/ASSE.
- **Lacune 5.** R2 Utility à 25 USD par mois et QuoteIQ à 29,99 USD par mois [P-B-26, P-B-27] fixent un prix plafond bas.
- **Défendabilité 3.** Bibliothèque des formulaires par district.
- **Timing 2.** Aucun catalyseur nouveau.

### 3. B-10 — Fluides frigorigènes, FR puis UE : 67/100, confiance moyenne
- **Douleur 13.** La fiche Cerfa 15497 et le registre d'équipement sont vérifiés en inspection [P-B-29, P-B-30]. L'entretien des PAC de 4 à 70 kW est biennal [P-B-32].
- **Distribution 10.** Marché domestique pour un fondateur français : grossistes et organismes d'attestation de capacité [H].
- **Lacune 5.** Extractivs, F.i360, C'Fluide et Kizeo existent [P-B-31]. Leurs prix ne sont pas publics.
- **Timing 3.** Pas de date nouvelle en France. Le règlement 2024/573 est déjà en vigueur.
- **Inconnu clé.** Acceptation administrative de la fiche dématérialisée en France.

### 4. B-18 — Conformité DPE en gestion locative, FR : 65/100, confiance moyenne
- **Douleur 13 et timing 5.** Les G sont interdits à la location depuis 2025 et les F le seront en 2028 [P-B-17]. Le coefficient électricité passe à 1,9 en 2026 (environ 850 000 logements sortent du statut de passoire) puis à 1,7 en 2027 [P-B-15, P-B-16]. Chaque gestionnaire doit trier ses lots.
- **Fréquence 5.** Événement annuel ou lié au renouvellement de bail.
- **Lacune 6.** Les logiciels de gestion pourraient intégrer la fonction.
- **Risque.** L'accès à l'open data DPE de l'ADEME n'est pas vérifié [H]. C'est un éliminatoire potentiel.

### 5. B-03 — Certified payroll, US : 65/100, confiance faible-moyenne
- **Douleur 15.** Production hebdomadaire. Un formulaire faux ou absent bloque le paiement [H]. Nouveau WH-347 exigé par les maîtres d'ouvrage [P-B-34]. XML DIR strict [P-B-35].
- **Lacune 5.** eMars, Miter et LCPtracker existent [P-B-36].
- **MVP 7.** Règles de fringe benefits et d'apprentis complexes, avec un risque de responsabilité en cas d'erreur.
- **Distribution 8.** Bases publiques des contractors enregistrés (DIR) [H].

### 6. B-01 — Dossier sous-traitant BTP, FR : 65/100, confiance faible-moyenne
- **Douleur 13.** Le donneur d'ordre est financièrement solidaire si les attestations semestrielles manquent [P-B-37]. La facturation électronique de 2026-2027 ajoute la gestion de l'autoliquidation [P-B-14].
- **Lacune 6.** e-attestations et Provigis ciblent plutôt les grands acheteurs ; la lacune côté PME est une hypothèse [H].
- **Preuves 7.** Aucune preuve directe de volonté de payer chez les PME.

### 7. B-02 — Retenues de garantie, FR/US : 61/100, confiance faible
- **Douleur.** Trésorerie bloquée un an après réception, puis à réclamer activement [P-B-38]. Le montant agrégé non récupéré est inconnu.
- **Risque.** Simple fonctionnalité de logiciels comme Obat ou Graneet [P-B-39]. MVP très simple.

### 8. B-26 — LCRI, US : 58/100, confiance faible
- **Échéance.** Inventaire et plan au 1er novembre 2027 [P-B-48].
- **Limites.** Acheteurs publics, cycle de vente lent, concurrents installés (120Water et d'autres, non vérifiés).
- **Alternative au même score.** B-31, le registre phyto 2027 : date ferme, mais papier toléré jusqu'en 2029 et outils gratuits des coopératives.

## Pistes éliminées

### 1. B-28 — Bilan carbone / reporting CSRD pour PME
**Critère éliminatoire : pas de volonté de payer plausible.**
- Omnibus I limite la CSRD aux entreprises de plus de 1 000 salariés et de plus de 450 M€ de CA, pour les exercices à partir de 2027 (JOUE du 26 février 2026) [P-B-04, P-B-05].
- L'obligation qui créait la demande PME a disparu, et le marché reste saturé d'éditeurs financés.

### 2. B-14 — Alternative à The Compliance Engine pour la soumission des rapports incendie
**Critères éliminatoires : acquisition impossible et canal indispensable inaccessible.**
- La juridiction choisit le canal et ne paie rien. Le contractor paie environ 15 à 20 USD par rapport [P-B-20, P-B-21].
- Un solo ne peut pas déloger un canal imposé par contrat public.
- Le segment voisin des applications d'inspection pour petits contractors est déjà saturé d'offres entre 49 et 175 USD par mois (B-13) [P-B-51].

### 3. B-37 — Passeport numérique batterie (DPP)
**Critère éliminatoire : données indispensables inaccessibles et acquisition non crédible pour 1 à 3 personnes.**
- Les acheteurs sont des fabricants et importateurs de batteries de plus de 2 kWh, peu nombreux et vendus en cycle enterprise.
- Les données requises (empreinte carbone, contenu recyclé, diligence) viennent de l'amont, et certaines spécifications sont encore en attente [P-B-50].

## Mises en veille (non éliminées)

- **B-30, EUDR.** Revue de simplification d'avril 2026 non vérifiée, donc risque réglementaire non maîtrisable.
- **B-32, FSMA 204.** Échéance en 2028 [P-B-03].
- **B-24, Awaab's Law pour le locatif privé UK.** Aucune date fixée.
