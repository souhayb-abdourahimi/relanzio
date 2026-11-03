# 01 — Cartographie des marchés et couverture

Date : 2026-10-29. Sources : rapports des 5 analystes de phase 1 (`_work/A..E-cartographie.md`), reproduits intégralement ci-dessous.
**Limite commune** : la recherche web a fonctionné, mais pas la lecture de pages (politique réseau). Les faits viennent donc d'extraits de moteur de recherche. Les dates réglementaires ont été recoupées autant que possible sur les domaines officiels ; les pages n'ont pas été lues en entier.

## Vue d'ensemble : 31 familles, 206 opportunités

| # | Famille | Analyste | Opportunités | Couverture | Angles non couverts (principaux) |
|---|---|---|---|---|---|
| 1 | Santé et cabinets médicaux (US/FR) | A | ~12 | moyenne | dentaire, centres de santé FR, UK/Inde/Canada |
| 2 | Soins aux personnes (SAD, EHPAD, home care, crèches) | A | ~9 | moyenne | UK CQC, handicap, crèches US |
| 3 | Pharmacie, vétérinaire, optique/audio, biologie | A | ~8 | moyenne (pharmacie US), faible (reste) | optique/audio, biologie FR |
| 4 | Recherche et laboratoires, sites d'essais cliniques | A | ~6 | moyenne-faible | labos académiques, CTIS UE |
| 5 | Assurances (courtiers, agences, sinistres) | A | ~8 | moyenne | sinistres, experts, Allemagne |
| 6 | Construction / BTP | B | ~8 | moyenne | sécurité chantier, RE2020 |
| 7 | Maintenance et field services (CVC, froid, incendie, backflow) | B | ~9 | moyenne-élevée (fluides, backflow) | ascenseurs, électricité |
| 8 | Immobilier et gestion d'actifs | B | ~7 | moyenne | location courte durée, UK |
| 9 | Énergie, eau, déchets, climat | B | ~7 | moyenne | CEE en détail, bornes de recharge |
| 10 | Agriculture et agroalimentaire | B | ~5 | faible-moyenne | bio, coopératives |
| 11 | Industrie et fabrication | B | ~3 | faible | chiffrage industriel, ISO 9001 |
| 12 | Supply chain, entrepôts, douane | C | ~7 | moyenne-élevée (douane/CBAM), faible (3PL) | facturation 3PL, preuve de livraison |
| 13 | Transport et flottes | C | ~6 | moyenne | ambulances, VTC, ANTAI, IFTA |
| 14 | Commerce physique et e-commerce | C | ~7 | moyenne | retours, chargebacks |
| 15 | Restauration et hôtellerie | C | ~6 | moyenne | HACCP, Booking |
| 16 | Sport, événements, loisirs | C | ~3 | **faible** | billetterie (junk fees US) |
| 17 | Achats et fournisseurs | C | ~5 | moyenne | appels d'offres, contrats |
| 18 | Télécommunications | C | ~4 | moyenne | obligations ARCEP des petits FAI |
| 19 | Professions juridiques | D | ~7 | moyenne (LCB-FT), faible (notaires) | délais de procédure |
| 20 | Comptabilité et fiscalité (e-invoicing FR/BE/DE/PL/ES, MTD UK) | D | ~10 | **élevée** (calendriers) | nexus sales tax US |
| 21 | Services financiers | D | ~6 | moyenne | MiCA, CGP, affacturage |
| 22 | Recrutement et RH | D | ~7 | moyenne | DSN, contrôle des références |
| 23 | Secteur public et associations | D | ~5 | faible-moyenne | marchés publics |
| 24 | Éducation et formation | D | ~6 | moyenne (Qualiopi), faible (EDOF, K-12) | K-12 US |
| 25 | Cybersécurité, IT, DevOps | E | ~11 | élevée (dates), faible (volonté de payer) | prix des outils CRA |
| 26 | Ventes, support, opérations commerciales | E | ~5 | moyenne-faible | taux de transformation des devis |
| 27 | Marketing, agences, médias | E | ~7 | moyenne | ARPP, contentieux EAA |
| 28 | Créateurs et communautés | E | ~4 | faible-moyenne | formateurs en ligne |
| 29 | Services professionnels spécialisés | E | ~4 | **faible** | traducteurs, photographes |
| 30 | Transverses (crédits d'impôt R&D, RGPD, contrats, IA) | E | ~8 | moyenne (R&D), faible (reste) | assurance-crédit, litiges B2B |
| 31 | Télécoms / VoIP US (FCC) — ajout | C | inclus au 18 | faible | — |

Les comptes « ~ » sont approximatifs (une opportunité peut toucher deux familles). Le détail par ligne est dans `02-idees-longlist.csv`.

## Calendrier des catalyseurs vérifiés (extraits de sources officielles ou de presse spécialisée)

| Date | Événement | Zone | Source (registre) |
|---|---|---|---|
| 01/01/2026 | Programme MFP (prix négociés Medicare) en vigueur ; remboursements via le MTF | US | A-preuves |
| 01/01/2026 | Règle EPA ER&R : registres de fuites des équipements ≥ 15 lb d'HFC | US | B-preuves |
| 01/01/2026 | Reco ACPR 2024-R-03 sur le devoir de conseil, étendue à tous les produits | FR | A-preuves |
| 01/01/2026 | Contrat écrit obligatoire pour l'influence commerciale dès 1 000 € HT | FR | E-preuves |
| 01/01/2026 | CBAM en régime définitif (seuil 50 t) ; WISeR (autorisation préalable Medicare) dans 6 États | UE / US | C, A |
| 01/01/2026 | E-invoicing B2B obligatoire en Belgique | BE | D-preuves |
| 01/07/2026 | Tachygraphe et détachement pour les fourgons de plus de 2,5 t en international | UE | C-preuves |
| 27/07/2026 | Omnibus AI Act (Règl. 2026/1744) : haut risque reporté au 02/12/2027 et au 02/08/2028 | UE | E-preuves |
| 01/09/2026 | Réception obligatoire des e-factures pour toutes les entreprises FR ; émission pour les GE/ETI | FR | D, C |
| 11/09/2026 | CRA : signalement des vulnérabilités exploitées et des incidents | UE | E-preuves |
| 01/11/2026 | Nouveau référentiel Qualiopi (33 indicateurs) — à confirmer sur Légifrance | FR | D-preuves |
| 01/01/2027 | ER&R : entrée du froid commercial et industriel existant ; API prior authorization (CMS-0057-F) | US | B, A |
| 31/01/2027 | Fin du cuivre Openreach (UK) ; lot 3 de la fermeture du cuivre ARCEP | UK/FR | C-preuves |
| 06/04/2027 | MTD ITSA : seuil abaissé à 30 000 £ (~1,08 M d'entrants) | UK | D-preuves |
| 10/07/2027 | AMLR (anti-blanchiment) applicable | UE | D-preuves |
| 01/09/2027 | Émission des e-factures et e-reporting pour les PME/TPE | FR | D-preuves |
| 30/09/2027 | Première déclaration CBAM annuelle | UE | C-preuves |
| 2027-2028 | Verifactu (ES) 2027 ; émission obligatoire en DE en 2027-2028 ; sanctions KSeF (PL) fin 2027 | UE | D-preuves |
| 30/12/2026 et 30/06/2027 | EUDR : grandes et moyennes entreprises, puis micro et petites | UE | B-preuves |
| 20/07/2028 | FSMA 204 (traçabilité alimentaire) reportée | US | B-preuves |

Catalyseurs **disparus ou affaiblis**, qui ont fait éliminer des pistes :
- CSRD pour les PME (Omnibus I) ;
- CSDDD (> 5 000 salariés, 2029) ;
- règle FDA sur les LDT (annulée) ;
- AML pour les RIA US (reportée à 2028) ;
- seuil 1099 relevé à 2 000 $ ;
- NIS2 en France (loi non adoptée au 29/10/2026).

---

---

## A — Cartographie : santé, soins, pharmacie/véto/labos, recherche, assurances

Analyste A. Date : 2026-10-29. Méthode : 36 recherches web (WebSearch). **Limite importante** : WebFetch a échoué sur `www.fda.gov` et `www.cms.gov` (domaines hors réseau autorisé dans cette session). Les faits « officiels » ci-dessous viennent donc des **extraits de pages officielles renvoyés par le moteur de recherche** (cms.gov, medicaid.gov, health.gov.au, has-sante.fr, acpr.banque-france.fr, anses.fr…). Je n'ai pas lu le texte intégral de ces pages. Statut : VÉRIFIÉ = extrait officiel concordant ; PARTIEL = source secondaire ou extrait incomplet ; HYPOTHÈSE = raisonnement de l'analyste.

Légende : **[F]** fait observé sourcé · **[E]** estimation · **[H]** hypothèse · **[?]** inconnu.

---

### Famille 1 — Santé et cabinets médicaux

**Acteurs payeurs**
- US : cabinets indépendants de spécialistes (douleur, orthopédie, plaies/cicatrisation, imagerie), groupes de 2 à 20 praticiens, ASC, sociétés de RCM externalisée (facturation déléguée). Le payeur, c'est le *practice manager* ou le médecin associé.
- FR : professionnels libéraux (médecins, infirmiers, kinés, orthophonistes, dentistes), centres de santé, cliniques. Le payeur est le praticien lui-même (abonnement au logiciel de gestion de cabinet, LGC).
- Autres : Brésil (cliniques conventionnées, facturation TISS/ANS), Allemagne (cabinets et soins à domicile raccordés à la Telematikinfrastruktur).

**Workflows fréquents** : vérification des droits du patient → codage → autorisation préalable (US) → soumission de la demande → relances payeur → refus → appel ou resoumission → rapprochement des paiements (835/ERA aux US, NOEMIE/RSP en FR) → credentialing et enrôlement auprès des payeurs (US).

**Documents et systèmes** : DPI/EHR, PMS, portails payeurs (US), fax (encore courant pour l'autorisation préalable US) [H], 835/837, CAQH ProView ; FR : SESAM-Vitale, LGC, DMP/Mon espace santé, ordonnance numérique.

**Contraintes structurelles**
- US : HIPAA (BAA obligatoire), payeurs morcelés aux règles différentes, faible interopérabilité avant les API imposées en 2027.
- FR : un logiciel qui télétransmet doit être agréé SESAM-Vitale et référencé (Ségur), ce qui bloque un nouvel entrant solo [H] ; marché des LGC déjà consolidé [H].

**Changements vérifiables**
- [F] **CMS-0057-F** : délais de décision des payeurs (72 h en urgence, 7 jours en standard) et motif de refus précis obligatoires depuis le **1er janvier 2026** ; métriques d'autorisation préalable 2025 publiées par les payeurs avant le **31 mars 2026** ; API Prior Authorization, Provider Access et Payer-to-Payer dues au **1er janvier 2027**. Payeurs concernés : Medicare Advantage, Medicaid/CHIP, QHP des marketplaces fédérales ; Medicare traditionnel exclu (cms.gov, extraits fact sheet et FAQ).
- [F] **Modèle WISeR** : autorisation préalable introduite dans **Medicare traditionnel** dans 6 États (NJ, OH, OK, TX, AZ, WA), du 1er janvier 2026 au 31 décembre 2031. Demandes acceptées dès le 5 janvier 2026 ; décision visée en 3 jours, 2 jours en urgence (cms.gov WISeR et FAQ).
- [F] Proposition de règle (Federal Register, 14 avril 2026) étendant ces exigences aux **médicaments**, avec une conformité proposée au 1er octobre 2027. **Non confirmée comme finale.**
- [F] Enquête AMA 2025 : 40 autorisations préalables par médecin et par semaine, 13 h de travail hebdomadaire, 40 % des cabinets avec du personnel dédié.
- [F] La mise à jour de la HIPAA Security Rule (proposée en janvier 2025) a vu sa date de finalisation repoussée à **juillet 2027** (Fierce Healthcare) : catalyseur faible à court terme.
- [F] FR : la généralisation de l'ordonnance numérique, fixée au 31/12/2024, n'a pas été tenue (presse spécialisée) ; aucune nouvelle date officielle trouvée [?].
- [F] DE : raccordement à la TI obligatoire pour soins infirmiers à domicile et établissements de soins au 1er juillet 2025 ; facturation SGB XI via la TI seulement à partir du **1er décembre 2026** (document AOK, PARTIEL).

**Niches** : suivi des autorisations préalables WISeR et Medicare Advantage pour petits cabinets de spécialistes ; tableau de bord des métriques publiées par les payeurs ; appels sur refus (plus de 80 % des appels aboutissent selon l'AMA) ; contrôle de cotation NGAP avant télétransmission pour infirmiers libéraux FR [H] ; gestion des glosas au Brésil.

**Couverture : MOYENNE.** Non couverts : dentaire US et FR (100 % Santé), centres de santé FR, Inde, Canada, Royaume-Uni (NHS/GP), gestion des refus en détail.

---

### Famille 2 — Soins aux personnes

**Acteurs payeurs**
- FR : services autonomie à domicile (SAD, ex-SAAD/SSIAD/SPASAD), EHPAD indépendants ou associatifs, micro-crèches (réseaux franchisés et indépendants).
- US : agences de home care et de home health, prestataires HCBS Medicaid, maisons de retraite médicalisées (SNF).
- AU : prestataires enregistrés d'aged care et de Support at Home.
- DE : Pflegedienste.

**Workflows** : plan de soins / projet personnalisé → planification des intervenants → pointage (EVV aux US, télégestion en FR) → facturation au financeur (département pour l'APA, Medicaid…) → preuves de qualité pour l'évaluation ou l'inspection → reporting au régulateur.

**Documents et systèmes** : outils de télégestion et de planification, DUI, registres, référentiel HAS, CPOM, rapports d'évaluation ; US : agrégateurs EVV des États, cost reports.

**Contraintes structurelles** : financeurs publics à budget contraint, marges faibles, rotation du personnel, nombreux logiciels sectoriels déjà installés [H].

**Changements vérifiables**
- [F] FR : **évaluation HAS des ESSMS**. Référentiel publié en mars 2022, 157 critères dont 18 impératifs. Programmation des premières évaluations du **1er juillet 2023 au 31 décembre 2027**, puis tous les 5 ans. Depuis le **16 septembre 2025**, Qualiscope publie les résultats des ESSMS (has-sante.fr, FHF). Ordre de grandeur : ARS Grand Est, 696 ESMS personnes âgées (dont 530 EHPAD) et plus de 650 ESMS handicap programmés sur 2023-2027.
- [F] FR : **réforme des SAD** (décret 2023-608). Conformité des SPASAD au 30 juin 2025 ; dépôt des demandes d'autorisation SAD mixte par les SSIAD avant le 31 décembre 2025 ; conventionnement transitoire ou GCSMS possible jusqu'à 5 ans. Ce qui s'est passé après décembre 2025 n'a pas été vérifié [?].
- [F] FR : **micro-crèches** (décret 2025-304 du 1er avril 2025). Taux d'encadrement alignés sur les petites crèches au 1er septembre 2026 ; nouvelles règles pour la direction (présence d'une personne qualifiée au moins 20 h par an). Le Conseil d'État a partiellement annulé le décret le 27 mai 2026 et un report d'un an a été annoncé (communiqué Fédésap) → **cadre juridique instable**.
- [F] US : **règle Medicaid Access** (CMS-2442-F). Les États devront rendre compte à partir du **9 juillet 2028** de la part des paiements HCBS consacrée à la rémunération des intervenants directs, et être prêts dès le 9 juillet 2027. Plancher de **80 % par prestataire** au **9 juillet 2030**. Spécifications techniques CMS publiées en 2026. Risque politique de révision [H].
- [F] US : EVV obligatoire pour les soins personnels depuis le 1er janvier 2020 et pour le home health depuis le **1er janvier 2023** : marché mûr.
- [F] AU : **Aged Care Act 2024** en vigueur au **1er novembre 2025**, avec les Strengthened Quality Standards et le programme Support at Home, qui remplace les Home Care Packages.
- [F] DE : TI obligatoire pour toutes les Pflegeeinrichtungen au 1er juillet 2025. Seuls ~8 900 établissements sur ~32 000 étaient raccordés en janvier 2025 (présentation gematik citée par etl.de).

**Niches** : préparation continue à l'évaluation HAS et plan d'action qualité pour SAD et EHPAD indépendants ; suivi du ratio de rémunération 80/20 pour agences US ; preuves de conformité aux Strengthened Standards pour petits prestataires australiens ; conformité d'encadrement des micro-crèches multi-sites.

**Couverture : MOYENNE.** Non couverts : Royaume-Uni (CQC), crèches US (subventions CCDF), handicap (NDIS en Australie, ESAT en FR), Canada, PBJ des SNF US.

---

### Famille 3 — Vétérinaires, pharmacies, opticiens/audio, laboratoires de biologie

**Acteurs payeurs** : pharmacies indépendantes US (titulaire ou gérant), officines FR, cliniques vétérinaires, opticiens/audioprothésistes, laboratoires de biologie (privés, souvent en groupements).

**Workflows** : réception et traçabilité des produits (DSCSA aux US) ; dispensation ; rapprochement des remboursements tiers (835, PSAO aux US ; NOEMIE et complémentaires en FR) ; déclarations réglementaires (antibiotiques vétérinaires dans Calypso).

**Changements vérifiables**
- [F] US : **Maximum Fair Price (IRA)** effectif au **1er janvier 2026** ; les fabricants remboursent la différence aux pharmacies via le Medicare Transaction Facilitator (MTF), qui fournit un 835 et un Claims Tracking Report.
  - Enquête NCPA (communiqué du 27 février 2026) : **78 %** des pharmacies indépendantes ont des difficultés à rapprocher les remboursements, **28 %** n'ont pas l'information nécessaire pour relier le paiement MTF à la demande d'origine, **60 %** puisent dans leur épargne.
  - Plenful (fournisseur) dit observer jusqu'à 20 % de remboursements attendus manquants.
- [F] US : **DSCSA**, exemption pour les petits dispensateurs (≤ 25 ETP) **prolongée au 27 novembre 2027** (page FDA via extrait de recherche, NABP août 2026, BIPC). Outils déjà bon marché : SureCost 29-49 $/mois, LSPedia 69 $ (prix membre MatchRX) ou 150 $/mois.
- [F] FR/UE : déclaration des antimicrobiens vétérinaires dans **CalypsoVet**, obligatoire depuis 2022 et opérationnelle depuis avril 2023. Plus de 90 % des établissements vétérinaires ont un logiciel compatible, mais à peine plus de 30 % transmettent (ANSES). Les pharmaciens déclarent au moins chaque mois, avec des contrôles possibles depuis janvier 2025 (USPO). Le règlement UE 2019/6, art. 57(5)(b), impose la collecte pour toutes les espèces productrices d'aliments 5 ans après le 28 janvier 2022.
- [F] US labos : la règle FDA sur les LDT a été **annulée** par un tribunal le 31 mars 2025, puis abrogée le 19 septembre 2025 → catalyseur disparu.

**Niches** : rapprochement des remboursements MFP pour pharmacies indépendantes (meilleure piste de cette famille) ; Calypso pour vétérinaires ruraux [H] ; tiers payant des complémentaires pour opticiens et audioprothésistes [H, non recherché].

**Couverture : MOYENNE pour la pharmacie US, FAIBLE pour le reste.** Non couverts : opticiens/audio (100 % Santé, tiers payant), biologie FR (accréditation ISO 15189), véto US, pharmacie FR (nouvelles missions et leur facturation).

---

### Famille 4 — Recherche et laboratoires

**Acteurs payeurs** : sites d'investigation indépendants (cabinets de recherche clinique, réseaux de sites), SMO, petites CRO, laboratoires académiques et biotech (achats et inventaire).

**Workflows** : démarrage d'étude (contrats, budget) → dossiers réglementaires (eISF/eReg, CV, certificats GCP, délégations) → formation sur les systèmes des sponsors → visites, saisie en eSource/EDC → facturation au sponsor et rapprochement des paiements → archivage.

**Changements vérifiables**
- [F] **ICH E6(R3)** : texte final ICH du 6 janvier 2025, effectif dans l'UE le 23 juillet 2025 ; guidance FDA finale en septembre 2025. L'annexe 2 (essais décentralisés) serait effective dans l'UE le 15 janvier 2027 (source secondaire, PARTIEL).
- [F] Charge des sites :
  - Advarra 2023 (cité par l'ACRP en août 2026) : près de 70 % des sites gèrent au moins 6 identifiants par étude.
  - SCRS 2023 : 40 % des sites passent 5 à 15 h par mois et par essai en formation aux outils.
  - SCRS et Medidata : **93 %** des sites placent la transparence financière en tête de leurs besoins système.
- Concurrents observés : Florence eBinders (prix sur devis), eClinPro (150 $/mois CTMS seul, 250 $/mois offre petite entreprise), Study eSafe (gratuit selon G2), RealTime, CRIO (prix non trouvés).

**Niches** : rapprochement des paiements sponsors et facturation des frais (*invoiceables*) pour sites indépendants ; eISF léger et dossier de formation multi-sponsors ; preuves de conformité E6(R3) au niveau du site.

**Couverture : MOYENNE-FAIBLE.** Non couverts : laboratoires académiques (achats de réactifs, inventaire), BPL pour petites CRO, EU CTR/CTIS.

---

### Famille 5 — Assurances

**Acteurs payeurs**
- FR : cabinets de courtage IARD, santé et prévoyance (TPE de 1 à 10 personnes), MGA ou souscripteurs délégués.
- US : agences indépendantes IARD.
- UK/Lloyd's : coverholders.
- Gestionnaires de biens et entreprises générales qui suivent les certificats d'assurance de leurs sous-traitants (US).

**Workflows** : recueil des exigences et besoins → devoir de conseil formalisé → placement → émission → rapprochement des commissions avec les relevés des assureurs → sinistres → formation continue DDA → conformité (ORIAS, adhésion à une association agréée, contrôle ACPR) ; US : collecte et vérification des certificats d'assurance (COI) ; Lloyd's : bordereaux de primes et de sinistres au format v5.2.

**Changements vérifiables**
- [F] FR : **recommandation ACPR 2024-R-03 sur le devoir de conseil**, applicable au **1er janvier 2026** et étendue à tous les produits d'assurance (avant : assurance-vie seulement). Défaillances relevées par l'ACPR en mars 2026 : recueil des besoins lacunaire, fiches de conseil standardisées, devoir de conseil non formalisé. Sanction : Société Générale, en qualité d'intermédiaire, le 13 mai 2026.
- [F] FR : **réforme du courtage** (loi 2021-402) ; adhésion obligatoire à une association professionnelle agréée depuis le 1er avril 2022. Renouvellement ORIAS 2023 : 23 806 inscriptions de courtiers en assurance renouvelées.
- [F] Lloyd's : le respect des Coverholder Reporting Standards v5.2 « reste obligatoire » (lloyds.com).
- [?] DDA : obligation de 15 h de formation annuelle non revérifiée dans cette phase (seul l'article R. 512-13-1 est référencé).
- Concurrents observés :
  - COI : bcs (0,95 $ par fournisseur et par mois, gratuit jusqu'à 25 fournisseurs, d'après la page tarifaire du fournisseur), CertLedger (5 $ par fournisseur et par mois, via G2), myCOI et TrustLayer (sur devis).
  - Commissions : Commission Wizard (à partir de 199 $/mois, Product Hunt), Applied Recon, AgencyBloc Commissions+.

**Niches** : dossier de conseil traçable et contrôlable pour petits courtiers IARD et santé FR ; rapprochement des commissions pour agences indépendantes US ; bordereaux v5.2 pour petits coverholders [PARTIEL].

**Couverture : MOYENNE (FR, US agences), FAIBLE (sinistres, experts, Allemagne, Inde).**

---

### Synthèse transverse US / FR-UE / autres
- **US** : catalyseurs datés les plus nombreux et budgets les plus élevés (WISeR, CMS-0057-F, MFP, HCBS 80/20). En contrepartie, HIPAA, BAA et des intégrations payeurs pénibles.
- **FR** : catalyseurs réels (ACPR 2026, évaluations HAS jusqu'à fin 2027, réforme des SAD) avec des acheteurs petits et nombreux, joignables via les fédérations. Les métiers de santé « facturants » sont verrouillés par la certification des LGC.
- **Autres** :
  - Australie : réforme de l'aged care au 1er novembre 2025.
  - Allemagne : TI dans les soins, facturation SGB XI via la TI en décembre 2026 ; barrière de langue et de certification.
  - Brésil : glosas TISS, avec des concurrents locaux (ZG Soluções, Datasigh).

---

## B — Cartographie : secteurs traditionnels et terrain

Analyste B · Phase 1 · 2026-10-29 · 40 recherches web.

**Méthode et limites.** WebFetch n'a pas pu ouvrir plusieurs domaines dans cette session (epa.gov, terre-net.fr, linklaters.com, getapp.com : erreur de résolution DNS). Les vérifications reposent donc sur les extraits renvoyés par WebSearch. Quand l'extrait cite ou paraphrase directement la source (page officielle, texte au JO, document municipal), le statut est VÉRIFIÉ dans les CSV. Sinon, il est PARTIEL.

Conventions utilisées dans ce document :
- **[F]** fait observé et sourcé (référence vers `B-preuves.csv`) ;
- **[E]** estimation ;
- **[H]** hypothèse ;
- **[?]** inconnu.

---

### 1. Construction / BTP

**Acteurs payeurs**
- France : entreprises générales et TCE de 10 à 250 salariés, qui sont donneurs d'ordre de sous-traitants. Aussi les artisans et TPE du second œuvre, et les sous-traitants de rang 1 et 2.
- US : subcontractors (électricité, CVC, plomberie, génie civil) qui facturent des GC, et contractors sur marchés publics (prevailing wage).
- Les maîtres d'ouvrage publics imposent les formats mais paient rarement l'outil du sous-traitant [H].

**Workflows fréquents**
- Devis, puis situations de travaux mensuelles (FR) ou pay applications AIA G702/G703 (US).
- Retenue de garantie (FR) ou retainage (US), puis sa libération.
- Collecte des pièces des sous-traitants (vigilance URSSAF tous les 6 mois, Kbis, décennale, DC4 et agrément, paiement direct).
- Autoliquidation de la TVA en sous-traitance.
- Lien waivers conditionnels et inconditionnels (US).
- Certified payroll hebdomadaire (WH-347, eCPR DIR en Californie).
- DOE à la réception, déchets de chantier.

**Documents et systèmes**
- Excel, PDF, portails des GC (Procore/Textura côté US), site URSSAF.
- Logiciels de devis et factures BTP (Obat, Tolteck, Graneet, Batappli).
- Plateformes de conformité fournisseurs (e-attestations, Provigis), LCPtracker, Siteline/Levelset.

**Contraintes structurelles**
- Marges faibles et trésorerie tendue.
- Faible appétence logicielle des TPE.
- Le format est imposé par l'acheteur (GC ou maître d'ouvrage), ce qui crée une dépendance à des formulaires hétérogènes.
- Marché du logiciel de devis et factures BTP en France déjà très encombré [F P-B-39].

**Changements vérifiables**
- Facturation électronique FR : réception obligatoire au 1er septembre 2026 pour toutes les entreprises, émission au 1er septembre 2027 pour les PME et TPE, sous-traitants compris [F P-B-13, P-B-14 ; sources d'éditeurs, à confirmer sur impots.gouv].
- Nouveau formulaire WH-347 (publié le 15 janvier 2025). L'ancien est accepté jusqu'au 31 janvier 2028, et des maîtres d'ouvrage exigent déjà le nouveau [F P-B-34].
- Californie : upload XML eCPR, validé contre un schéma strict [F P-B-35].
- REP PMCB (déchets du bâtiment) en refondation. Le Conseil d'État rappelle le principe de reprise sans frais (CAPEB, 21 octobre 2026) [F P-B-49].
- Carnet d'information du logement obligatoire depuis 2023, mais adoption faible : 162 397 carnets en 29 mois [F P-B-44].

**Niches repérées**
- Dossier sous-traitant pour PME donneuses d'ordre (B-01).
- Récupération des retenues de garantie (B-02).
- Certified payroll multi-formats pour petits subcontractors (B-03).
- Lien waivers et pay apps (B-04, concurrence forte).

**Couverture : moyenne.** Non couverts :
- RE2020 (seuils 2025 et 2028) ;
- DOE numérique ;
- sécurité chantier (PPSPS) ;
- Australie (Security of Payment) ;
- UK CIS (Construction Industry Scheme) ;
- prix de Graneet, Siteline et e-attestations (non publics dans les extraits).

---

### 2. Maintenance et field services

**Acteurs payeurs**
- Frigoristes et climaticiens indépendants ou TPE (FR/UE).
- Contractors HVAC/R commerciaux (US).
- Testeurs backflow certifiés (US/Canada).
- Contractors sécurité incendie (extincteurs, sprinklers, alarmes).
- Chauffagistes et installateurs de PAC avec contrats d'entretien.
- Ascensoristes et organismes de contrôle : non couverts.

**Workflows fréquents**
- Interventions planifiées récurrentes (annuelles ou biennales).
- Rapport réglementaire à chaque visite.
- Report dans un registre par équipement.
- Calcul du taux de fuite (US, depuis 2026).
- Dépôt du rapport auprès d'un tiers : water utility, fire marshal via The Compliance Engine.
- Relance du client pour la visite suivante, qui est aussi le moteur de chiffre d'affaires du prestataire.

**Documents et systèmes**
- Cerfa 15497 (fiche d'intervention et bordereau de suivi de déchet) et registre de l'équipement [F P-B-29, P-B-30].
- Formulaires backflow propres à chaque district.
- Portails BSI Online, Syncta, Tokay.
- Rapports NFPA 10/25/72 et portail The Compliance Engine.
- FSM généralistes (ServiceTitan, Kizeo Forms), outils spécialisés (Extractivs, F.i360, C'Fluide, Ref LeakLog, R2 Utility).

**Contraintes structurelles**
- Nombreuses petites entreprises, techniciens sur mobile, souvent sans réseau.
- Formats imposés par des tiers (administration, utility, juridiction).
- La conformité est facturée au client final mais exécutée par le technicien.
- Certains canaux de dépôt sont des quasi-monopoles financés par des frais par rapport, payés par le prestataire :
  - Brycer/TCE : 15 USD par rapport plus 15 USD de retard à Charleston [F P-B-20, P-B-21] ;
  - BSI : 14,95 à 35,95 USD par rapport selon la ville [F P-B-22, P-B-23].

**Changements vérifiables**
- **US, AIM Act ER&R** (40 CFR part 84 subpart C) :
  - réparation des fuites obligatoire au 1er janvier 2026 pour les appareils contenant au moins 15 lb d'HFC ;
  - seuils de 10, 20 et 30 % selon le sous-secteur ;
  - réfrigération commerciale et industrielle existante : 1er janvier 2027 ;
  - réfrigérants régénérés : 2029 [F P-B-08, P-B-09].
  - Risque [H] : reconsidération politique des règles AIM. Non vérifié.
- **UE, règlement F-gas 2024/573** : registres des contrôles d'étanchéité, des réparations et des démantèlements. En France, la fiche Cerfa 15497-01 est contrôlée en inspection (lettre ASN 2024) [F P-B-29].
- **FR, décret 2020-912** : entretien des PAC de 4 à 70 kW tous les deux ans, avec contrôle d'étanchéité [F P-B-32].
- **Backflow** : frais de dépôt en hausse à Wentzville (de 12/17/35 à 14/18/38 USD) [F P-B-24]. Les rapports sont rejetés si la licence ou la calibration du testeur n'est pas à jour [F P-B-23]. Enregistrement annuel du testeur dans chaque ville, de 75 à 250 USD [F P-B-25].

**Niches repérées**
- Journal de conformité fuites ER&R pour contractors US (B-09).
- Fiche Cerfa et registre fluides pour frigoristes FR/UE (B-10).
- Application pour testeurs backflow multi-juridictions (B-11).
- Contrats d'entretien PAC (B-15, plutôt un module de B-10).

**Couverture : moyenne-élevée** pour fluides et backflow, **faible** pour le reste. Non couverts :
- ascenseurs (contrôle technique quinquennal) ;
- VGP et contrôles périodiques réglementaires ;
- registre de sécurité ERP ;
- électricité et plomberie hors backflow ;
- Canada et Australie (registres de réfrigérants).

---

### 3. Immobilier et gestion d'actifs

**Acteurs payeurs**
- Administrateurs de biens et agences de gestion locative (FR).
- Syndics professionnels et bénévoles.
- Conciergeries de meublés de tourisme.
- Propriétaires tertiaires multi-sites (décret tertiaire).
- Property managers, PHAs et bailleurs HCV (US).
- Housing associations et letting agents (UK).
- Co-op et condo boards à NYC.

**Workflows fréquents**
- Suivi des DPE par lot et décision de relocation.
- PPPT, DTG et vote en AG.
- Enregistrement des meublés de tourisme.
- Déclaration annuelle OPERAT.
- Inspections NSPIRE et HQS.
- Traitement des signalements damp & mould (UK).
- Rapports LL97 et LL84 (NYC).

**Documents et systèmes**
- Logiciels de gestion locative et de syndic.
- Observatoire DPE de l'ADEME.
- Portail OPERAT.
- Téléservice national d'enregistrement des meublés (nom à confirmer).
- PMS et channel managers.
- Portfolio Manager EPA, portail BEAM.

**Contraintes structurelles**
- Des éditeurs de gestion bien installés absorbent les nouvelles exigences sous forme de modules.
- Plusieurs livrables exigent un professionnel signataire, ce qui limite la valeur d'un SaaS seul :
  - PPT et DTG (bureau d'études) ;
  - LL97 (RDP) ;
  - DPE (diagnostiqueur).

**Changements vérifiables**
- Interdiction de location des G depuis le 1er janvier 2025, des F au 1er janvier 2028, des E au 1er janvier 2034 [F P-B-17].
- Coefficient électricité du DPE passé de 2,3 à 1,9 au 1er janvier 2026, soit environ 850 000 logements qui sortent du statut de passoire [F P-B-15]. Passage à 1,7 au 1er janvier 2027 par arrêté du 19 août 2026 [F P-B-16, à confirmer sur Légifrance].
- Loi Le Meur (n° 2024-1039) : enregistrement de tous les meublés de tourisme au plus tard le 20 mai 2026 [F P-B-18].
- Règlement (UE) 2024/1028 applicable au 20 mai 2026 [F P-B-19].
- PPT obligatoire pour les copropriétés de moins de 50 lots depuis le 1er janvier 2025 [F P-B-40].
- OPERAT : déclaration avant le 30 septembre 2026. Attestation numérique opposable dès juillet 2026, selon une source unique [F P-B-41, confiance faible].
- NSPIRE (HCV/PBV) reporté au 1er février 2027 [F P-B-46].
- UK : Renters' Rights Act en vigueur par phases depuis le 1er mai 2026. Awaab's Law n'a pas de date pour le secteur locatif privé au mois de juillet 2026 [F P-B-47].
- NYC LL97 : environ 9 bâtiments couverts sur 10 ont déposé leur rapport la première année [F P-B-45].

**Niches repérées**
- Pilotage de la conformité DPE d'un portefeuille en gestion locative (B-18).
- Conformité des conciergeries loi Le Meur (B-20).
- OPERAT pour petits multi-sites (B-22).

**Couverture : moyenne.** Non couverts :
- état des lieux ;
- property management US hors NSPIRE (rental registration, security deposits) ;
- réglementations STR des villes US ;
- marché allemand.

---

### 4. Énergie, eau, déchets, climat

**Acteurs payeurs**
- Installateurs RGE (PAC, isolation, PV).
- Mandataires et obligés CEE.
- Petits réseaux d'eau communautaires (US).
- PME importatrices concernées par le CBAM.
- PME soumises (ou plus soumises) au reporting ESG.
- Opérateurs EUDR.

**Workflows fréquents**
- Montage de dossiers d'aides (CEE, MPR).
- Inventaire des branchements en plomb et plan de remplacement.
- Statut de déclarant CBAM et collecte des émissions fournisseurs.
- Déclarations de diligence EUDR.

**Changements vérifiables**
- **CEE** : 6e période du 1er janvier 2026 au 31 décembre 2030, 1 050 TWhc par an (décret 2025-1048) [F P-B-43].
- **MaPrimeRénov'** : suspendu le 31 décembre 2025, rouvert le 23 février 2026, budget de 3,6 Md€ [F P-B-42]. Programme instable.
- **LCRI** : inventaire (connectors compris) et plan de remplacement au 1er novembre 2027, notifications au 1er décembre 2026, seuil d'action à 10 ppb, selon WA DOH [F P-B-48]. Aucun report fédéral trouvé [?].
- **CBAM** : période définitive depuis le 1er janvier 2026, seuil de 50 t par an. Les demandes de statut de déclarant autorisé devaient être déposées avant le 31 mars 2026 pour continuer d'importer [F P-B-06, P-B-07]. Date de la première déclaration annuelle [?].
- **CSRD après Omnibus I** : seuils de plus de 1 000 salariés et plus de 450 M€ de CA. Publication au JOUE le 26 février 2026, entrée en vigueur le 18 mars 2026 [F P-B-04, P-B-05]. La demande des PME se contracte fortement.
- **EUDR** (règlement 2025/2650, JOUE du 23 décembre 2025) : application au 30 décembre 2026 pour les grandes et moyennes entreprises, au 30 juin 2027 pour les micro et petites. Revue de simplification attendue avant le 30 avril 2026 [F P-B-01, P-B-02] ; son résultat n'a pas été vérifié [?].
- **Déchets** : REP PMCB instable (voir famille 1).

**Niches repérées**
- Inventaire LCRI pour petits réseaux d'eau (B-26).
- CBAM pour PME au-dessus de 50 t (B-27).
- Dossiers CEE et MPR côté artisan (B-08).

**Couverture : moyenne.** Non couverts :
- bornes de recharge (ADVENIR, IRVE) ;
- administratif PV (B-29, hypothèse non sourcée) ;
- REP hors bâtiment ;
- détail de la lutte anti-fraude CEE.

---

### 5. Agriculture et agroalimentaire

**Acteurs payeurs**
- Exploitations (viticulture, maraîchage, arboriculture), ETA, coopératives.
- Distributeurs de produits frais (US).
- Importateurs UE de cacao, café, bois.
- Artisans de bouche.

**Workflows fréquents**
- Registre d'utilisation des produits phytosanitaires.
- Traçabilité par lot (KDE/CTE).
- Plan HACCP/PMS (relevés de température, nettoyage).
- Audit bio annuel.
- Géolocalisation des parcelles (EUDR).

**Systèmes**
- Logiciels parcellaires (Mes Parcelles, Smag, Isagri : cités, non vérifiés), outils fournis par les coopératives.
- Papier et Excel.
- Plateformes de traçabilité US.

**Contraintes structurelles**
- Faible propension à payer des petites exploitations [H].
- Outils souvent fournis gratuitement par les coopératives ou les chambres d'agriculture [H].
- Saisonnalité.

**Changements vérifiables**
- Registre phytosanitaire électronique au 1er janvier 2027 (règlements d'exécution 2023/564 et 2025/2203, arrêté FR du 24 décembre 2025). De 2027 à 2029, le papier reste toléré avec conversion avant le 31 janvier N+1. À partir de 2030, conversion sous 30 jours. Aucun logiciel n'est imposé [F P-B-11, P-B-12].
- FSMA 204 : application reportée au 20 juillet 2028 par directive du Congrès [F P-B-03].
- EUDR : voir famille 4.

**Niches repérées**
- Registre phyto pour petites exploitations sans logiciel (B-31). Urgence faible avant 2030.

**Couverture : faible-moyenne.** Non couverts :
- HACCP et PMS (aucune recherche) ;
- certification bio ;
- coopératives des pays producteurs ;
- Canada (SFCR) et Royaume-Uni.

---

### 6. Industrie et fabrication

**Acteurs payeurs**
- PME industrielles et ateliers de sous-traitance mécanique (usinage, tôlerie).
- Fabricants et importateurs de batteries.

**Workflows fréquents**
- Réponse aux RFQ et chiffrage (plans, fichiers STEP).
- Qualité ISO 9001 (non-conformités, CAPA).
- Maintenance des machines.
- Passeport numérique produit.

**Changements vérifiables**
- Passeport batterie obligatoire au 18 février 2027. Le registre DPP est ouvert depuis juillet 2026. Certaines données dépendent de spécifications encore en attente [F P-B-50].
- Acte délégué ESPR acier attendu fin 2026, textiles vers 2027 (sources secondaires, divergentes).

**Concurrence observée**
- Paperless Parts, logiciel de devis pour job shops US (Capterra : 4,9/5 sur 25 avis, intégrations ERP) [F P-B-52].
- Aucun équivalent européen recherché [?].

**Niches repérées**
- Chiffrage de la sous-traitance mécanique en UE (B-36), à creuser en phase 2.

**Couverture : faible.** Non couverts :
- ISO 9001 et QMS ;
- GMAO ;
- traçabilité de pièces aéronautiques et médicales ;
- concurrents européens du devis CAD.

---

### Synthèse transversale

**[E] Motif le plus prometteur : le « dépôt réglementaire multi-destinataires » pour prestataires terrain.** Le technicien produit un rapport normé qu'il doit envoyer à un tiers dont le format varie : water district, administration, maître d'ouvrage. Il paie souvent ce tiers par rapport. Trois cas illustrent le motif :
- backflow ;
- fluides frigorigènes (FR/UE et US) ;
- certified payroll.

Leur point commun : volonté de payer démontrée par des frais existants, récurrence forte, et des listes publiques de professionnels agréés qui servent à l'acquisition [H, à vérifier].

**[E] Comparaison des marchés**
- **US** : marchés plus fragmentés (règles différentes par ville ou par district), avec une volonté de payer observable en frais par rapport.
- **France/UE** : catalyseurs datés (2026-2028), mais concurrence d'outils publics gratuits ou d'éditeurs installés.
- **UK** : timing flou (Awaab's Law pour le locatif privé).

---

## C — Cartographie : opérations, commerce et services de proximité

Analyste C. Date : 2026-10-29. Périmètre : 7 familles attribuées (supply chain/douane, transport/flottes, commerce, restauration/hôtellerie, sport/événements/loisirs, achats/fournisseurs, télécoms).

### Note de méthode (à lire avant tout)
- ~38 recherches web (WebSearch). **WebFetch était bloqué dans cette session** (DNS non résolu pour taxation-customs.ec.europa.eu, rsa.ie, eaccny.com…). Aucune page n'a donc été ouverte directement : toutes les vérifications reposent sur le contenu des résultats de recherche (extraits et synthèses), en ciblant les domaines officiels (`allowed_domains`) chaque fois que c'était possible.
- Convention de statut : **VÉRIFIÉ** = l'affirmation provient d'un résultat issu du domaine officiel (EUR-Lex, Commission, ELA, impots.gouv, urssaf.fr, IRS, ARCEP…) et concorde avec au moins une autre source ; **PARTIEL** = sources secondaires concordantes ou source officielle vue seulement à travers une copie ; **HYPOTHÈSE** = raisonnement de l'analyste.
- Étiquettes utilisées ci-dessous : [FAIT] sourcé / [ESTIMATION] / [HYPOTHÈSE] / [INCONNU].
- Les prix concurrents ne sont repris dans la longlist que lorsqu'ils proviennent de la page de l'éditeur lui-même (tel que restitué par la recherche) ; sinon « inconnu ».

---

### 1. Supply chain, entrepôts, logistique, douane

**Acteurs payeurs** : PME importatrices (négoce acier/alu, fixations, quincaillerie, matériaux), e-commerçants importateurs, commissionnaires/transitaires de 5 à 50 personnes, représentants en douane indirects, 3PL PME, chargeurs PME (US : expéditeurs LTL).

**Workflows fréquents** : déclarations en douane (import, ENS ICS2), classement tarifaire, calcul droits/TVA, collecte de données fournisseurs (émissions CBAM, géolocalisation EUDR), rapprochement factures transport vs tarifs (freight audit), suivi des comptes palettes, gestion des réserves et litiges, demandes de remboursement (drawback, refunds IEEPA).

**Documents & systèmes** : DAU/entrées CBP (type 01/11), ENS, factures commerciales, BL/CMR/e-CMR, POD, registre CBAM, TRACES (EUDR), TMS/forwarding (CargoWise, Magaya, GoFreight), ACE (US), portails transporteurs.

**Contraintes structurelles** : données fournisseurs hors UE difficiles à obtenir ; logiciels douaniers soumis à certification/connexion aux systèmes nationaux ; forte saisonnalité réglementaire (dates qui glissent : EUDR reportée deux fois).

**Changements vérifiables**
- [FAIT] CBAM : période définitive depuis le 1er janvier 2026 ; seuil unique de 50 t/an par importateur (Règl. (UE) 2025/2083) ; statut de déclarant autorisé requis (demande au plus tard le 31 mars 2026 pour continuer d'importer) ; première déclaration annuelle (imports 2026) au 30 septembre 2027 ; vente des certificats à partir du 1er février 2027. Sources : taxation-customs.ec.europa.eu (pages « CBAM definitive regime », « Reminder: CBAM goes live », « CBAM successfully entered into force », 2026-01-14).
- [FAIT, PARTIEL] UK CBAM au 1er janvier 2027 ; HMRC a publié des valeurs par défaut par code NC en octobre 2026 (KPMG, 2026-10).
- [FAIT] EUDR reportée par le Règl. (UE) 2025/2650 (JOUE du 23/12/2025) : application au 30 décembre 2026, 30 juin 2027 pour micro et petits opérateurs, déclaration simplifiée pour ceux-ci (EY Global Tax News, 2026-01-20 ; SGS).
- [FAIT, PARTIEL] UE : droit de douane forfaitaire de 3 € par article (par catégorie tarifaire) sur les envois < 150 € à partir du 1er juillet 2026, provisoire jusqu'au 1er juillet 2028 ; distinct du futur « handling fee » (communiqué Conseil du 11/02/2026 vu via copies).
- [FAIT] France : taxe de 2 € par article sur les petits colis extra-UE < 150 €, art. 82 LF 2026, applicable depuis le 1er mars 2026, provisoire jusqu'au dispositif européen de frais de gestion (au plus tard le 31/12/2026) (info.gouv.fr / economie.gouv.fr).
- [FAIT] États-Unis : suspension du de minimis pour tous les pays à compter du 29 août 2025 ; fin des entrées type 86, entrée formelle (01) ou informelle (11) obligatoire (CBP CSMS).
- [FAIT, PARTIEL] États-Unis : la Cour suprême a invalidé les droits IEEPA (6-3) ; le CIT a ordonné des remboursements ; CBP prépare un portail de réclamations « CAPE » ; <10 % des importateurs éligibles avaient activé l'ACH fin mars 2026 (Tradlinx, BakerLaw, Mondaq). [INCONNU] état réel de CAPE au 29/10/2026.
- [FAIT] ICS2 Release 3 : fenêtre de déploiement des transporteurs routiers du 1er avril au 1er septembre 2025 (Revenue Irlande, AADE).
- [FAIT] eFTI : application complète le 9 juillet 2027 (Commission, DG MOVE).
- [FAIT, PARTIEL] CargoWise (éditeur dominant des transitaires) : passage en décembre 2025 à une tarification par transaction (« Value Packs »), hausses rapportées de 20 % à plus de 50 % ; les petits et moyens transitaires réévaluent leurs options (The Loadstar, Breakbulk).

**Niches repérées** : CBAM multi-clients pour représentants en douane ; déclaration simplifiée EUDR pour micro-opérateurs ; contrôle des droits forfaitaires 3 €/2 € refacturés ; préparation des réclamations IEEPA ; drawback pour PME ; audit des frais par transaction CargoWise ; comptes palettes ; litiges transporteurs.

**Couverture** : MOYENNE-ÉLEVÉE sur la réglementation douanière et CBAM ; FAIBLE sur les 3PL PME (WMS, facturation stockage) et la preuve de livraison. Angles non couverts : facturation 3PL et rapprochement stockage, réforme du code des douanes de l'Union (data hub ~2028), post-Brexit UK (BTOM).

---

### 2. Transport et flottes

**Acteurs payeurs** : transporteurs routiers PME (5–50 véhicules), messageries express en VUL à l'international (forte présence PL, LT, RO, ES, NL), déménageurs, taxis conventionnés et ambulanciers (FR), flottes d'entreprise, transporteurs US (owner-operators à 50 camions).

**Workflows** : téléchargement et analyse des tachygraphes (carte conducteur tous les 28 jours, unité véhicule tous les 90 jours [connaissance générale, non vérifié ici]), déclarations de détachement IMI, temps de travail (LIC / Mobilic), dossiers DQ et Clearinghouse (US), IFTA, désignation conducteur ANTAI, facturation CPAM des taxis.

**Documents & systèmes** : fichiers .DDD, déclarations IMI, LIC/Mobilic, contrats de transport, factures CPAM/SEFi, permis/CDL, rapports FMCSA.

**Contraintes** : marges faibles, fragmentation, multilinguisme (UE), logiciels de tachygraphe déjà peu chers.

**Changements vérifiables**
- [FAIT] Depuis le 1er juillet 2026, les VUL de plus de 2,5 t et jusqu'à 3,5 t utilisés en transport international ou en cabotage sont soumis aux temps de conduite et de repos (Règl. 561/2006), au tachygraphe intelligent G2V2 et aux règles de détachement des conducteurs ; le national et le compte propre sont exclus (ELA, DG MOVE).
- [FAIT, PARTIEL] Préparation : selon une enquête IRU, à environ deux mois de l'échéance, 88 % des VUL concernés n'avaient pas encore d'appareil installé et seuls 27,7 % des opérateurs se disaient prêts ; selon Kienzle, une flotte sur trois n'était pas prête à la date (trans.info).
- [FAIT] Fin du rétrofit tachygraphe pour les poids lourds en août 2025 (DG MOVE, 2025-08-19).
- [FAIT, PARTIEL] France : arrêté du 6 mars 2025 créant le LIC électronique (Mobilic) pour le transport sans tachygraphe (< 3,5 t, déménagement) (Kohen Avocats, ecologie.gouv.fr).
- [FAIT, PARTIEL] Taxis conventionnés : nouvelle convention en vigueur depuis le 1er novembre 2025 (forfait de 13 € par prise en charge, 15 € en zone urbaine, fin du retour à vide, au moins 50 % de l'activité dans la zone de stationnement) ; baisse de tarifs d'environ 40 % évoquée (questions écrites AN).
- [FAIT, PARTIEL] États-Unis : règle CDL « non-domiciled » en vigueur le 16 mars 2026 (contestée) ; maîtrise de l'anglais devenue condition d'immobilisation (out-of-service), plus de 20 000 conducteurs immobilisés depuis juin 2025 (fiche DOT, TCIA).

**Niches** : pack conformité VUL international (tachygraphe + détachement + infractions) ; génération des déclarations IMI à partir des données tachygraphe ; vérification ELP/CDL pour petits transporteurs US ; facturation/optimisation des taxis conventionnés.

**Couverture** : MOYENNE. Non couvert : ambulances (FR/US), VTC, ANTAI (aucune recherche dédiée), maintenance de flotte, IFTA.

---

### 3. Commerce physique et e-commerce

**Acteurs payeurs** : vendeurs marketplace PME (UE et hors UE vendant dans l'UE), DTC Shopify, franchisés, cabinets comptables e-commerce.

**Workflows** : rapprochement des reversements marketplace, enregistrements EPR par pays (emballages, DEEE, piles), dossiers de sécurité produit (GPSR), OSS/IOSS, accessibilité du site, retours et litiges de paiement (chargebacks).

**Documents & systèmes** : rapports de règlement Amazon, numéros EPR (LUCID en Allemagne, etc.), fiches GPSR/personne responsable, déclarations OSS/IOSS.

**Changements vérifiables**
- [FAIT] GPSR (Règl. 2023/988) applicable depuis le 13 décembre 2024 : une personne responsable établie dans l'UE est obligatoire et doit figurer dans les annonces de vente à distance ; les marketplaces ne doivent pas publier une offre sans ces informations (EUR-Lex, FAQ Commission).
- [FAIT, PARTIEL] PPWR (Règl. 2025/40) applicable depuis le 12 août 2026 : un producteur non établi dans le pays de mise sur le marché doit désigner un représentant autorisé pour la REP. Une proposition de suspension partielle (producteurs UE jusqu'en 2035) est signalée, statut [INCONNU] (Expando, Coolset).
- [FAIT, témoignages] Amazon supprime ou suspend les annonces non conformes à la REP en Allemagne et en France ; des vendeurs se disent perdus sur les forums Seller Central.
- [FAIT] EAA : s'applique aux services de commerce électronique fournis aux consommateurs après le 28 juin 2025 ; les micro-entreprises de services (< 10 salariés et ≤ 2 M€) sont exemptées (EUR-Lex, Conseil).
- [FAIT] ViDA adopté le 11 mars 2025 : certaines clarifications OSS/IOSS au 1er janvier 2027, enregistrement TVA unique au 1er juillet 2028, facturation électronique et déclaration numérique intra-UE au 1er juillet 2030 (Commission).

**Niches** : REP emballages multi-pays + représentant autorisé ; dossier GPSR pour vendeurs hors UE ; préparation IOSS 2028.

**Couverture** : MOYENNE. Les marchés du rapprochement des reversements (A2X, Link My Books) et des chargebacks sont jugés saturés [ESTIMATION] ; retours non couverts.

---

### 4. Restauration et hôtellerie

**Acteurs payeurs** : restaurants indépendants et petits groupes (2–20 sites), franchisés, chaînes de 20 sites ou plus (Californie), hôtels indépendants, campings, loueurs de véhicules (Espagne).

**Workflows** : saisie des factures fournisseurs et calcul du food cost, inventaires, fiches techniques et allergènes, plannings, pourboires, rapprochement des reversements des plateformes de livraison, enregistrement des voyageurs, taxe de séjour.

**Changements vérifiables**
- [FAIT] France : depuis le 1er septembre 2026, toutes les entreprises doivent pouvoir recevoir des factures électroniques ; les grandes entreprises et ETI émettent depuis cette date, les PME et micro-entreprises à partir du 1er septembre 2027 ; même calendrier pour l'e-reporting (impots.gouv.fr, economie.gouv.fr). **Conséquence [HYPOTHÈSE forte]** : les grossistes alimentaires de taille GE/ETI envoient déjà des factures structurées aux restaurateurs, ce qui rend possible le calcul automatique du food cost ligne par ligne.
- [FAIT] Espagne : RD 933/2021 (SES.Hospedajes) appliqué depuis le 2 décembre 2024 pour l'hébergement et la location de véhicules ; amendes de 601 à 30 000 € (presse, Chekin).
- [FAIT, PARTIEL] Californie : SB 68 (ADDE Act), divulgation des 9 allergènes majeurs par les chaînes de 20 sites ou plus à partir du 1er juillet 2026 ; le seuil est interprété différemment selon les sources (CalRest, AFS Law).
- [FAIT] États-Unis : « no tax on tips » (2025-2028), nouveaux champs sur le W-2 2026 (box 12 code TP, box 14b Treasury Tipped Occupation Code) (IRS).
- [FAIT, PARTIEL] France : Booking a reversé la taxe de séjour du second semestre 2025 le 16/01/2026, hors délai, avec une déclaration incomplète (question écrite AN n° 13144).

**Concurrence observée** : MarginEdge à 330 $ par site et par mois (page tarifs officielle) ; FR : Koust, Steandy, Onrush, FoodCost PRO (tarifs inconnus) ; livraison : Loop AI et Voosh aux États-Unis ; Espagne : Chekin.

**Couverture** : MOYENNE. Non couvert : HACCP digital, plannings/pourboires FR, commissions Booking côté hôtel.

---

### 5. Sport, événements, loisirs

**Acteurs payeurs** : clubs et associations (budget faible, bénévoles), salles privées, organisateurs d'événements, campings, centres de loisirs.

**Changements vérifiables** : [FAIT] contrôle d'honorabilité des éducateurs et encadrants bénévoles, opéré par l'État via le « SI Honorabilité » et les fédérations (guide Ministère des Sports du 05/02/2026, FFCK) : le système public couvre déjà le besoin.

**Niches** [HYPOTHÈSE] : rapprochement de la billetterie et des reversements pour les associations ; gestion du matériel loué ; taxe de séjour et registre clients dans les campings (voir famille 4).

**Couverture** : FAIBLE (2 recherches seulement). Volonté de payer jugée faible côté associations [ESTIMATION]. Non couvert : règle FTC « junk fees » pour la billetterie (US), assurances et déclarations préfectorales d'événements.

---

### 6. Achats et fournisseurs

**Acteurs payeurs** : DAF et acheteurs de PME/ETI, donneurs d'ordre recourant à la sous-traitance (BTP, nettoyage, transport, événementiel, industrie).

**Workflows** : collecte et renouvellement semestriel des attestations de vigilance, rapprochement à trois voies commande/réception/facture, onboarding fournisseurs, contrats.

**Changements vérifiables**
- [FAIT] Vigilance URSSAF : attestation exigée pour tout contrat d'au moins 5 000 € HT, à la conclusion puis tous les 6 mois ; solidarité financière du donneur d'ordre ; depuis la LFSS 2023, sanction plafonnée à 15 000 € (personne physique) ou 75 000 € (personne morale) pour un premier manquement ; annulation possible des exonérations (urssaf.fr, Légifrance).
- [FAIT] La facturation électronique (voir famille 4) fournit des données structurées pour le rapprochement à trois voies, réception obligatoire depuis le 01/09/2026.
- [FAIT, PARTIEL] CSDDD après Omnibus I : seuils de 5 000 salariés et 1,5 Md€ de chiffre d'affaires, application au 26 juillet 2029 : hors cible PME (MoFo, DLA Piper).

**Concurrence** : Provigis, e-attestations, Attestation Légale (tarifs non trouvés) ; plateformes agréées (Cegid, Sage…) pour le rapprochement.

**Couverture** : MOYENNE. Non couvert : appels d'offres, gestion des contrats fournisseurs.

---

### 7. Télécommunications

**Acteurs payeurs** : intégrateurs et revendeurs télécoms (FR/UK), petits opérateurs VoIP (US), entreprises multi-sites, gestionnaires d'ascenseurs, d'alarmes et de téléassistance.

**Changements vérifiables**
- [FAIT] France : fermeture commerciale du cuivre dans environ 25 000 communes depuis fin janvier 2026 ; lot 3 en janvier 2027 (2 097 communes selon l'ARCEP), lot 4 en 2028, lot 5 en 2029, extinction visée fin 2030 (ARCEP, Selectra).
- [FAIT, PARTIEL] Royaume-Uni : extinction du PSTN le 31 janvier 2027 sans report ; environ 1,5 M de lignes encore sur cuivre, dont ~350 000 locaux professionnels (Openreach cité par Mobile Europe) ; risques identifiés pour les ascenseurs, alarmes et TPE (Stannah).
- [FAIT, PARTIEL] États-Unis : la recertification annuelle dans la Robocall Mitigation Database est due au 1er mars ; amendes de base de 10 000 $ par information fausse et 1 000 $ par défaut de mise à jour, en vigueur le 5 février 2026 (Womble Bond Dickinson, NatLawReview).
- [ESTIMATION vendeurs] Jusqu'à 20 % des factures télécoms contiendraient des erreurs (Gartner cité par un livre blanc du Crown Commercial Service).

**Niches** : inventaire et planification de la migration des lignes cuivre critiques ; calendrier et dépôts de conformité FCC pour petits VoIP ; audit des factures télécoms multi-sites.

**Couverture** : MOYENNE. Non couvert : obligations ARCEP des petits FAI, factures inter-opérateurs.

---

## D — Cartographie : fonctions back-office et secteur public

Analyste D. Date : 2026-10-29. Familles : (1) professions juridiques, (2) comptabilité et fiscalité, (3) services financiers, (4) recrutement et RH, (5) secteur public et associations, (6) éducation et formation.

### Note de méthode (à lire avant tout)

- Environ 38 recherches web (WebSearch) faites. **WebFetch était bloqué** par la politique réseau de la session : `www.impots.gouv.fr` et `www.presse-citron.net` renvoient « ENOTFOUND, hors des domaines autorisés ». Aucune page n'a donc été ouverte en entier. Toutes les vérifications reposent sur les extraits que renvoie le moteur de recherche. Pour que la phase 2 puisse lire les sources primaires, il faut autoriser au moins impots.gouv.fr, economie.gouv.fr, legifrance.gouv.fr, eur-lex.europa.eu, irs.gov et gov.uk dans les réglages réseau de la session.
- Convention utilisée dans les CSV :
  - **VÉRIFIÉ** : l'affirmation est confirmée par l'extrait d'une source officielle ou primaire (gouvernement, régulateur, ordre professionnel, banque centrale), souvent recoupée par d'autres sources. La page elle-même n'a pas été ouverte.
  - **PARTIEL** : sources secondaires (cabinets, éditeurs, blogs spécialisés) concordantes, ou source officielle qui ne couvre qu'une partie de l'affirmation.
  - **HYPOTHÈSE** : aucune preuve trouvée dans ce cycle.
- Prix des concurrents : aucune page tarifaire officielle n'a pu être lue. La colonne `prix_concurrents_observes` vaut donc « inconnu » partout, comme l'exige le brief. Les prix vus sur des agrégateurs (Capterra, SourceForge, Appvizer, comparatifs) figurent dans `notes` avec la mention ESTIMATION.
- Libellés : **FAIT** = sourcé ; **EST.** = estimation ; **HYP.** = hypothèse ; **INCONNU**.

---

### 1. Professions juridiques

**Qui paie.** Avocats exerçant seuls ou en petit cabinet (FR, environ 1 à 10 avocats) ; notaires ; commissaires de justice (ex-huissiers) ; juristes d'entreprise (le budget est celui de la direction juridique) ; aux US, *solo / small law firms*.

**Workflows fréquents.**
- Prise en charge du client (*intake*) et contrôle des conflits d'intérêts.
- KYC / LCB-FT à l'entrée en relation : identification du client et du bénéficiaire effectif, consultation du registre de gel des avoirs, cartographie des risques.
- Facturation au temps passé ou au forfait, conventions d'honoraires.
- Calcul et suivi des délais de procédure.
- US : tenue du compte séquestre IOLTA et rapprochement à trois voies (*three-way reconciliation*) mensuel.

**Documents et systèmes.** RPVA / e-Barreau ; logiciels de cabinet (Secib, Kleos et autres, non vérifiés) ; Clio et MyCase aux US ; QuickBooks avec un module de trust accounting (TrustBooks, LeanLaw) ; registre des bénéficiaires effectifs (RBE) ; Infogreffe ; registre national des gels.

**Contraintes structurelles.**
- Le secret professionnel freine le cloud et l'IA (HYP., à valider en entretiens).
- Achat par des personnes physiques peu outillées ; forte inertie.
- Les notaires vivent dans un écosystème fermé (réseau ADSN, éditeurs agréés). HYP. : il est peu accessible à un nouvel entrant.

**Changements vérifiables.**
- FAIT : le CNB a adopté le 12/12/2025 à l'unanimité, puis ajusté le 13/04/2026, un projet de textes créant une **commission nationale de contrôle mutualisée LCB-FT**. Il prévoit un **diagnostic d'évaluation obligatoire (DEO) que chaque avocat remplit chaque année** (niveau 1), puis des contrôles sur place et sur pièces menés par des contrôleurs indépendants (niveau 2). Source : cnb.avocat.fr, 13/04/2026. **INCONNU** : la date d'entrée en vigueur. Les sources parlent encore de « projet » ; une source annonçait la plateforme DEO pour la fin du T1 2026, sans confirmation.
- FAIT : le règlement AMLR (UE) 2024/1624 s'applique pour l'essentiel à partir du **10/07/2027** (EY, fintech.global). AMLA, la nouvelle autorité européenne anti-blanchiment, ne supervisera directement qu'environ 40 établissements à haut risque, à partir de 2028 (sources secondaires).
- FAIT : le CNB a publié en juin 2023 une analyse sectorielle des risques LCB-FT, qui sert de base à la cartographie des risques de chaque cabinet.
- US : aucun changement IOLTA récent vérifié dans ce cycle.

**Niches repérées.** Outil DEO + dossier KYC pour avocat seul (FR) ; kit LCB-FT commun aux professions assujetties en vue de l'AMLR 2027 ; trust accounting pour solos US qui n'utilisent pas Clio ; calcul des délais de procédure ; *intake* et contrôle des conflits.

**Couverture : moyenne** sur la LCB-FT avocats, **faible** sur les notaires, les commissaires de justice et les délais de procédure. Non couverts : facturation électronique des avocats, volumes réels de contrôles LCB-FT, sanctions effectives.

---

### 2. Comptabilité et fiscalité

**Qui paie.** Cabinets d'expertise comptable (FR), CPA firms et EA/preparers (US), *accountancy practices* (UK), et indirectement les TPE/PME clientes.

**Workflows fréquents.**
- Collecte des pièces auprès des clients (relances, portails).
- Saisie et rapprochement bancaire.
- Déclarations TVA, IS, liasse.
- Migration des clients vers la facturation électronique.
- US : collecte des W-9, émission des 1099, suivi du *nexus* de sales tax, préparation des déclarations en saison fiscale.
- UK : mises à jour trimestrielles MTD.

**Documents et systèmes.** Plateformes agréées (PA) ; formats Factur-X / UBL / CII ; Chorus Pro (secteur public) ; Peppol (BE) ; KSeF (PL) ; Verifactu (ES) ; XRechnung / ZUGFeRD (DE) ; TaxDome, Financial Cents, Canopy (US) ; Dext, Pennylane, Tiime (FR).

**Contraintes.**
- Le marché des outils de cabinet est très saturé.
- La saisonnalité est forte (US : janvier–avril).
- Les clients TPE sont réticents au changement.

**Changements vérifiables (calendriers).**
- **France** (FAIT, economie.gouv.fr / impots.gouv.fr, guide pratique « démarrage au 1er septembre 2026 ») :
  - réception obligatoire pour toutes les entreprises et émission obligatoire pour les grandes entreprises et ETI depuis le **1/9/2026** ;
  - émission pour les **PME et micro-entreprises au 1/9/2027** ;
  - l'e-reporting suit le même calendrier.
  - Le passage par une **plateforme agréée (PA, ex-PDP) est obligatoire**. L'État a renoncé au portail public gratuit pour l'échange ; le PPF reste le concentrateur des données. Une entreprise peut choisir une ou plusieurs PA.
  - **Tolérance** : aucune sanction pour difficultés de mise en œuvre jusqu'à la fin de 2026.
  - Chorus Pro devient la plateforme d'émission des entités publiques.
  - La DGFiP a publié une **liste de 101 premières PA** (presse.economie.gouv.fr). Des articles du 1/9/2026 parlent de 149 PA ; le chiffre n'a pas été vérifié sur la liste officielle.
  - Statut de facture **« encaissée »** : obligatoire pour les prestations de services soumises à la TVA sur les encaissements (sans option pour les débits) et pour les acomptes. Il alimente l'e-reporting de paiement (CMS, ENGIE, Fiducial ; sources secondaires).
- **Belgique** (FAIT secondaire : BDO, RSM) : e-invoicing B2B domestique via Peppol obligatoire depuis le **1/1/2026** ; tolérance de 3 mois (janvier–mars 2026) ; sanctions de 1 500 €, 3 000 € puis 5 000 €. Arrêté royal publié au Moniteur le 14/07/2025.
- **Allemagne** (secondaire) : réception obligatoire depuis le 1/1/2025 ; émission obligatoire au **1/1/2027** si le chiffre d'affaires dépasse 800 000 €, puis au **1/1/2028** pour toutes les entreprises (loi *Wachstumschancengesetz*).
- **Pologne** (KPMG) : KSeF obligatoire au 1/2/2026 pour les entreprises au-delà de 200 M PLN de ventes, puis au 1/4/2026 pour les autres. Report possible au 1/1/2027 pour les très petites entreprises (≤ 10 000 PLN de ventes par mois). **Sanctions reportées à la fin de 2027** (le projet de loi est en cours).
- **Espagne** (RDL 15/2025, BOE du 3/12/2025) : Verifactu au **1/1/2027** pour les sociétés et au **1/7/2027** pour les autónomos. INCONNU : la convalidation du décret-loi par le Congrès.
- **Royaume-Uni** (FAIT, gov.uk) : MTD for Income Tax obligatoire depuis le 6/4/2026 au-delà de 50 000 £ de revenus éligibles (436 000 personnes ont déjà envoyé une première mise à jour trimestrielle). Seuil de **30 000 £ au 6/4/2027** (environ 1 077 000 personnes de plus), puis **20 000 £ en avril 2028** (environ 900 000 de plus). Pas de points de pénalité pour retard de mise à jour trimestrielle en 2026–27.
- **US** (FAIT, irs.gov) : seuil du 1099-NEC / 1099-MISC relevé de 600 $ à **2 000 $** pour les paiements effectués après le 31/12/2025, indexé à partir de 2027. 1099-K ramené à 20 000 $ **et** plus de 200 transactions (rétroactif) : **le besoin diminue**.
- **Pénurie de CPA** (secondaire, chiffres AICPA cités par des tiers) : 28 082 candidats au CPA en 2024 contre 49 597 en 2016. Signes d'amélioration en 2026 : inscriptions en hausse de 8,9 % (CFO Dive, beancount.io).

**Niches repérées.** Tableau de suivi de la préparation des clients à la facturation électronique pour cabinets (FR, avant septembre 2027) ; statut « encaissée » et e-reporting de paiement couplés à la relance des impayés ; outils de passage à MTD (*bridging*) pour cabinets UK gérant des propriétaires bailleurs ; KSeF pour entreprises étrangères immatriculées à la TVA en Pologne ; Verifactu pour autónomos.

**Couverture : élevée** sur les calendriers de facturation électronique, **moyenne** sur les outils des cabinets US, **faible** sur le *nexus* de sales tax et la préparation fiscale US. Non couverts : nombre de cabinets FR (INCONNU), tarifs officiels des PA, sous-traitance offshore.

---

### 3. Services financiers

**Qui paie.** Courtiers en crédit (IOBSP), CGP / RIA, petites sociétés de gestion, établissements de paiement et petites fintechs, PME créancières (relance des impayés), sociétés d'affacturage.

**Workflows.**
- KYC et LCB-FT.
- Registre DORA des prestataires TIC (dépôt annuel).
- Capacité professionnelle et formation continue des intermédiaires.
- Revue de conformité marketing (US).
- Relance des clients et recouvrement amiable.

**Systèmes.** ORIAS, portails des autorités compétentes (BaFin, CSSF, ACPR), taxonomie xBRL / CSV des ESA, CRM métier, logiciels de facturation.

**Changements vérifiables.**
- **DORA** (FAIT, CSSF et sources secondaires) : registre d'information à remettre aux ESA au **31 mars de chaque année**, contrats arrêtés au 31/12 de l'année précédente. Les autorités nationales ouvrent des fenêtres plus courtes (BaFin du 9 au 30/3/2026, AFM au 22/3/2026). Contrôles qualité des ESA en avril, avec resoumission avant fin avril. Format structuré xBRL ou CSV.
- **US** (FAIT, MoFo, Cooley, GT Law) : la règle AML de FinCEN pour les *investment advisers* est **repoussée au 1/1/2028**, et son périmètre sera revu.
- **SEC Marketing Rule** (FAIT, Risk Alert du 16/12/2025 relayé par Mintz, NatLawReview, Comply) : les examens trouvent encore des manquements répétés (témoignages, *endorsements*, notations tierces, documentation). Selon un sondage Comply (éditeur, donc partial), 49 % des responsables conformité relisent encore le marketing à la main.
- **Retards de paiement FR** (FAIT, Banque de France, rapport de l'Observatoire des délais de paiement publié le 23/9/2026) : les TPE/PME auraient **13 Md€ de trésorerie en plus** si les retards étaient ramenés à 60 jours. Moins d'une grande entreprise sur deux paie dans le délai légal.
- **Règlement européen sur les retards de paiement** : bloqué au Conseil en 2025 ; des appels au retrait existent. **INCONNU** : son statut en 2026.
- IOBSP : formation continue de 7 h par an (art. D 314-25 du code de la consommation selon des organismes de formation ; non vérifié sur Légifrance).

**Niches.** Relance des impayés pour TPE de services liée à la facturation électronique ; registre DORA pour petites entités ; capacité professionnelle et formation IOBSP/IAS ; revue marketing pour petits RIA.

**Couverture : moyenne.** Non couverts : MiCA/CASP, affacturage, CGP (DER, adéquation), contrôles IOBSP par l'ACPR.

---

### 4. Recrutement et RH

**Qui paie.** PME employeuses de 50 à 250 salariés, cabinets de recrutement, agences d'intérim, cabinets de paie et d'expertise comptable (social), *staffing agencies* US.

**Workflows.** Entretiens professionnels ; publication d'offres ; grilles salariales ; vérification des autorisations de travail ; I-9 et E-Verify ; onboarding ; DSN.

**Changements vérifiables.**
- **Directive transparence salariale 2023/970** (secondaire, trackers figures.hr, Pinsent Masons, Ius Laboris) : la date limite du **7/6/2026 a été manquée par la majorité des États**. Selon un tracker du 28/9/2026, 5 États sur 27 ont adopté leur loi (Grèce, Italie, Lituanie, Malte, Slovaquie), 12 ont un projet et 10 n'ont rien. Les décomptes diffèrent selon les trackers.
- **France** : projet de loi déposé au Sénat en procédure accélérée, en septembre 2026 selon des sources secondaires (numéro et date exacts non vérifiés sur senat.fr). Il prévoit 7 indicateurs pour les entreprises de plus de 50 salariés à partir de 2028, l'Index égalité étant maintenu pour la déclaration 2027. Adoption incertaine avant la présidentielle de 2027.
- **Entretien de parcours professionnel** (FAIT, Q&R du ministère du Travail mis à jour le 19/2/2026) : la loi n° 2025-989 du 24/10/2025 fait passer la périodicité de 2 à **4 ans** et le bilan de 6 à **8 ans**. Règles applicables depuis le 26/10/2025 ; les accords collectifs doivent être mis en conformité avant le 1/10/2026. Dans les entreprises d'au moins 50 salariés, abondement correctif du CPF de **3 000 €** (Centre Inffo).
- **US I-9** (secondaire, SHRM, JD Supra) : nouvelle édition du formulaire, datée du 01/20/25 et valable jusqu'au 31/05/2027. Les systèmes électroniques devaient être mis à jour avant le 31/7/2026. Aucune donnée officielle sur une hausse des audits ICE n'a été trouvée.
- **FR, travailleurs étrangers** (secondaire) : vérification de l'autorisation de travail auprès de la préfecture au moins 2 jours ouvrables avant l'embauche, par l'ANEF. Le montant de l'amende administrative varie selon les sources.

**Niches.** Suivi des entretiens à 4 et 8 ans pour PME et cabinets de paie ; transparence salariale (fourchettes dans les offres, écarts de rémunération) pour 50–250 salariés ; vérification des titres de séjour pour l'intérim.

**Couverture : moyenne.** Non couverts : DSN (dominée par les éditeurs de paie), contrôle des références, E-Verify des États US.

---

### 5. Secteur public et associations

**Qui paie.** Associations loi 1901 qui émettent des reçus fiscaux, nonprofits US (501(c)(3)), petites communes et intercommunalités, TPE qui répondent aux marchés publics.

**Workflows.** Reçus fiscaux et déclaration annuelle des dons ; rapports aux financeurs ; *single audit* ; enregistrement *charitable solicitation* dans chaque État US ; réponse aux appels d'offres ; facturation via Chorus Pro.

**Changements vérifiables.**
- FAIT (economie.gouv.fr, impots.gouv.fr « Déclaration des dons et reçus ») : déclaration annuelle du nombre de reçus et du montant des dons (art. 222 bis du CGI), **entièrement dématérialisée depuis le 1/1/2026**. Le délai exact diffère selon les sources.
- FAIT secondaire (CDE California, Bonadio) : réforme de l'Uniform Guidance (2 CFR 200) au 1/10/2024. Seuil du *single audit* relevé de 750 000 $ à **1 000 000 $** de dépenses fédérales ; taux *de minimis* des coûts indirects porté de 10 % à 15 %.
- *Charitable solicitation registration* : environ 40 États ou plus l'exigent. Les tarifs de Harbor Compliance trouvés datent de 2018–2021.
- Chorus Pro devient la plateforme d'émission des entités publiques (economie.gouv.fr).

**Niches.** Suivi multi-États des enregistrements *charitable solicitation* (US) ; préparation au *single audit* et suivi des sous-bénéficiaires ; reçus fiscaux (marché saturé par HelloAsso et AssoConnect, HYP.).

**Couverture : faible à moyenne.** Non couverts : marchés publics (aucune source dans ce cycle), budgets des communes, effets du gel des subventions fédérales US 2025.

---

### 6. Éducation et formation

**Qui paie.** Organismes de formation (OF) et formateurs indépendants, CFA, écoles privées ; aux US, éditeurs edtech qui vendent aux districts K-12.

**Workflows.** Certification Qualiopi (audit initial, de surveillance, de renouvellement) ; publication des offres CPF sur EDOF ; feuilles d'émargement et preuves de réalisation ; BPF annuel ; conventions OPCO ; suivi des apprentis.

**Changements vérifiables.**
- **Nouveau référentiel Qualiopi** (secondaire concordant : Schoolmaker, Certiforma, 75secondes, Akto) : **décret n° 2026-728** (août 2026), applicable au **1/11/2026**. On passe de 32 à **33 indicateurs** : 13 réécrits et un indicateur 33 créé pour l'apprentissage. Évaluation des acquis distincte de la satisfaction ; suivi de la formation à distance. Présenté comme une mesure du plan de lutte contre la fraude. À vérifier sur Légifrance.
- **BPF** (FAIT, Centre Inffo) : campagne 2026 du 1/4 au 31/5 sur « Mon Activité Formation ». Sans transmission, la déclaration d'activité devient caduque.
- Volume (EST., source commerciale) : environ 45 000 OF certifiés Qualiopi pour 132 237 OF déclarés au 1/1/2025. Non vérifié auprès de la DARES.

**Niches.** Kit de preuves conforme au nouveau référentiel pour formateurs indépendants ; BPF automatisé ; émargement et preuves de réalisation contre la fraude CPF/OPCO ; indicateur 33 pour CFA.

**Couverture : moyenne** sur Qualiopi et le BPF, **faible** sur EDOF / déréférencement CPF et sur les K-12 US (non couverts).

---

### Synthèse transversale

1. **Calendrier de forte densité réglementaire (FAIT)** : facturation électronique FR septembre 2027 (PME), DE 2027–2028, ES 2027, PL sanctions fin 2027, UK MTD avril 2027 et 2028, AMLR juillet 2027, Qualiopi novembre 2026. La fenêtre de 6 à 18 mois correspond à un MVP vendable en 6 à 12 semaines.
2. **Plusieurs catalyseurs ont été retardés ou affaiblis (FAIT)** : transposition de la transparence salariale (FR pas avant 2027–2028), AML des RIA (2028), 1099 (seuil relevé), règlement européen sur les retards de paiement (bloqué). Ne pas fonder une opportunité sur ces seuls catalyseurs.
3. **Les éditeurs PA, paie et practice management absorbent les besoins génériques (HYP. forte)**. Les lacunes restantes sont les **obligations de niche portées par une personne seule** (avocat, formateur indépendant, petite association) et les **outils pour prescripteurs** (cabinet comptable gérant des centaines de TPE).

---

## E — Cartographie : économie numérique et workflows (phase 1)

Analyste E. Date : 2026-10-29. Périmètre : 6 familles (cyber/IT/DevOps ; ventes et ops commerciales ; marketing et agences ; créateurs ; services professionnels ; transverses).

### Note de méthode (à lire avant tout)
- 38 recherches web effectuées (WebSearch). **WebFetch a été bloqué par la configuration réseau de la session** pour `eur-lex.europa.eu` et `nosparlementaires.fr` (hôtes hors des domaines autorisés). Conformément à la consigne de la session, je n'ai pas tenté d'autres sites ensuite. **Toutes les preuves proviennent donc d'extraits de moteur de recherche** ; les pages n'ont pas été ouvertes. Pour consulter EUR-Lex directement, il faut autoriser `eur-lex.europa.eu` dans les paramètres réseau de la session.
- Conséquence : le statut VÉRIFIÉ n'est utilisé que pour les dates confirmées par au moins deux sources concordantes, dont une institutionnelle si possible. Tout le reste est PARTIEL ou HYPOTHÈSE. Les prix relevés sur des comparatifs tiers figurent dans `notes`, jamais dans `prix_concurrents_observes`.
- Légende : **[F]** fait observé sourcé (extrait de recherche) ; **[E]** estimation ; **[H]** hypothèse ; **[?]** inconnu.

### Tableau de bord réglementaire vérifié (catalyseurs de mes familles)

| Texte | Statut au 2026-10-29 | Source (extrait) | Confiance |
|---|---|---|---|
| NIS2 — France (projet de loi Résilience) | [F] **Non adopté.** Sénat 12/03/2025 ; commission spéciale AN 10/09/2025 ; retiré de l'ordre du jour de l'AN des 7 et 9 oct. 2026, sans nouvelle date. Article 16 bis (anti-portes dérobées) au cœur du blocage. Commission → CJUE le 8 juil. 2026 (FR, IE, ES, NL). | nosparlementaires.fr ; it-connect.fr ; directive-nis2.fr | moyenne |
| NIS2 — ANSSI | [F] ReCyF (Référentiel Cyber France) présenté le 17 mars 2026 en **document de travail** ; pré-enregistrement des entités depuis le 24 nov. 2025 (source secondaire). | cyber.gouv.fr ; donneespersonnelles.fr | moyenne |
| NIS2 — Allemagne | [F] Loi de transposition en vigueur le 6 déc. 2025, sans période transitoire ; ~4 500 → ~29 500 entités (BSI cité). | locaterisk.com | moyenne |
| NIS — Royaume-Uni (Cyber Security and Resilience Bill) | [F] MSP moyens/grands dans le périmètre, régulateur ICO, 900-1 100 MSP ; au stade du rapport aux Lords (sept. 2026), sanction royale espérée fin 2026, mise en œuvre complète possiblement en 2028. | mondaq.com ; usecure.io | moyenne |
| Cyber Resilience Act | [F] **Signalement obligatoire depuis le 11 sept. 2026** (vulnérabilités activement exploitées et incidents graves) : 24 h / 72 h / 14 j (vuln.) ou 1 mois (incidents), via la plateforme unique ENISA ; pas de pré-enregistrement ; repli e-mail seulement si la plateforme est déclarée hors service. Obligations principales au **11 déc. 2027**. Lignes directrices Commission du 27 juil. 2026. Amendes jusqu'à 15 M EUR / 2,5 % du CA. | mccannfitzgerald.com ; CSA ; ncsc.gov.ie ; crowell.com | élevée (dates) |
| AI Act + omnibus numérique IA | [F] **Règlement (UE) 2026/1744** publié au JO le 24 juil. 2026, en vigueur le 27 juil. 2026. Haut risque Annexe III : **2 déc. 2027** (au lieu du 2 août 2026) ; Annexe I : **2 août 2028**. Art. 4 (littératie IA) maintenu mais recalibré en obligation de moyens. Transparence art. 50 maintenue au 2 août 2026, avec grâce jusqu'au 2 déc. 2026 pour le marquage des systèmes déjà sur le marché (à confirmer). Nouvelles interdictions (contenus intimes non consentis, CSAM). EUR-Lex non consulté (bloqué). | hunton.com ; lewissilkin.com ; sidley ; ki-campus.org | élevée (dates principales) |
| European Accessibility Act | [F] Applicable depuis le 28 juin 2025 ; micro-entreprises de services (<10 pers. et ≤2 M EUR) exemptées (art. 4(5)) ; en France, DGCCRF autorité par défaut ; montants de sanctions **contradictoires** selon sources (7 500 EUR/infraction chez Deque). Mises en demeure de grands distributeurs (nov. 2025) rapportées par des vendeurs, non confirmées. | taylorwessing.com ; deque.com | moyenne |
| FTC — Consumer Reviews and Testimonials Rule (16 CFR 465) | [F] En vigueur le 21 oct. 2024 ; premières lettres d'avertissement à 10 entreprises le 22 déc. 2025 ; ~53 088 USD par infraction (ajustement 2026 annulé, à vérifier). Influenceurs : relèvent des Endorsement Guides. | beneschlaw.com ; foodnavigator-usa.com | moyenne |
| Influence commerciale — France | [F] Contrat écrit obligatoire **depuis le 1er janv. 2026** dès 1 000 EUR HT cumulés/an pour un même objectif promotionnel (décret du 28 nov. 2025, art. 8 de la loi du 9 juin 2023). Légifrance non consulté. | eurojuris.fr ; woo.paris | moyenne |
| DAC7 | [F] Déclaration annuelle au 31 janvier ; exception vendeur occasionnel (<30 ventes et ≤2 000 EUR) ; fermeture de compte ou retenue des paiements 60 jours après la 2e relance. Spécificités françaises (DGFiP) non vérifiées. | vistra.com ; ondato.com | moyenne |
| CMMC (US) | [F] Règle DFARS en vigueur le 10 nov. 2025 ; phase 2 (C3PAO niveau 2) prévue au **10 nov. 2026**. Une source (Secureframe) évoque une suspension de l'étape C3PAO : **contradiction non résolue**. | secureframe.com ; venable.com | moyenne / faible sur la phase 2 |
| CIR/CII (FR) | [F] LF 2025 : CII à 20 % (dépenses dès le 1er janv. 2025), frais de fonctionnement exclus ; CIR : brevets exclus, régime « jeunes docteurs » supprimé (dépenses dès le 15 févr. 2025). Plafond CII divergent selon sources. LF 2026 non vérifiée. | Deloitte Avocats ; WebLex ; PNO | moyenne |
| R&D UK | [F] Formulaire AIF obligatoire depuis le 8 août 2023 ; régime fusionné pour les exercices ouverts dès le 1er avr. 2024 ; notification préalable des primo-demandeurs sous 6 mois. | granttree ; pricebailey ; JCK | moyenne |
| R&D US (Section 174A, OBBBA) | [F] Dépense immédiate rétablie dès 2025 ; fenêtre rétroactive 2022-2024 close le 6 juil. 2026 (source secondaire, IRS non consulté). | beancount.io | faible |
| Fin de vie d'un logiciel dominant | [F] Atlassian Data Center : fin de vie le 28 mars 2029 (30 mars selon d'autres sources) ; fin des ventes nouvelles le 30 mars 2026 ; fin des renouvellements le 30 mars 2028. | jimiwikman.se ; community.atlassian.com | moyenne |
| CNIL | [F] Bilan 2025 : 83 sanctions, 486 839 500 EUR ; cookies parmi les sujets principaux. Procédure simplifiée 2026 : 23 sanctions pour 133 750 EUR (presse, à confirmer). | cnil.fr ; economiematin.fr | élevée / faible |

---

### Famille 1 — Cybersécurité, IT, DevOps et développeurs

**Acteurs payeurs**
- Éditeurs SaaS B2B de 5 à 100 personnes vendant à des grands comptes (payent pour débloquer des deals) [H, plausible vu le marché existant Vanta/Drata/Conveyor].
- MSP / infogérants (payent des outils multi-clients revendus en service récurrent) [F : offres MSP de Cynomi, CyberArrow].
- PME fournisseurs d'entités NIS2 (payent sous contrainte contractuelle) [F : DIGITAL SME].
- Fabricants de produits avec éléments numériques (IoT, électronique, logiciel embarqué) : nouveaux payeurs CRA [F].
- Sous-traitants défense US (CMMC) [F].

**Workflows fréquents** : réponse aux questionnaires de sécurité fournisseurs ; collecte de preuves (politiques, captures, journaux d'accès) ; arrivées/départs et révocation des accès ; veille CVE et correctifs ; production de SBOM ; signalement d'incidents (NIS2 24 h/72 h, CRA 24 h/72 h/14 j, RGPD 72 h en parallèle) ; inventaire des outils IA.

**Documents et systèmes** : questionnaires (Excel, portails acheteurs), SOC 2 / ISO 27001, PSSI, registres d'actifs, SBOM (SPDX, CycloneDX), VEX, déclaration UE de conformité, plateforme unique ENISA, MonEspaceNIS2 (ANSSI), SPRS (US), RMM/PSA côté MSP, IdP (Google Workspace, Entra), SCIM.

**Contraintes structurelles** : marché GRC dominé par des acteurs financés (Vanta, Drata, Secureframe) ; prix non publics ; responsabilité en cas de réponse erronée ; besoin d'intégrations (IdP, cloud, Git) pour automatiser la preuve ; en France, incertitude législative sur NIS2.

**Changements vérifiables** : voir tableau (NIS2 FR bloquée, DE en vigueur, UK en cours ; CRA signalement live ; omnibus IA ; CMMC ; fin de vie Atlassian DC).

**Niches repérées** : questionnaires pour petits éditeurs sans SOC 2 (E-01) ; kit fournisseur NIS2 pour PME non tech (E-02) ; pilotage NIS2 multi-clients pour infogérants FR (E-03) ; signalement CRA pour petits fabricants (E-05) ; SBOM depuis binaire (E-06) ; dossier technique CRA (E-07) ; CMMC pour micro-sous-traitants (E-09).

**Couverture** : **élevée** sur les dates réglementaires ; **moyenne** sur les concurrents ; **faible** sur la volonté de payer (aucun entretien, aucune donnée de conversion). Angles non couverts : prix réels des outils CRA hors Verimu ; taille du marché des petits fabricants IoT UE ; volume réel de questionnaires reçus par un petit éditeur ; état du marché SBOM en open source (Dependency-Track etc. non vérifiés).

### Famille 2 — Ventes, support et opérations commerciales

**Acteurs payeurs** : TPE artisans et services à domicile (budget faible, forte sensibilité au prix) ; PME de services B2B (agences, BET, conseil) ; PME avec équipe commerciale de 5 à 30 personnes (commissions).

**Workflows** : devis → relance → signature → acompte ; propositions commerciales longues ; calcul de la rémunération variable ; réponses aux appels d'offres (DCE, mémoire technique) ; support par e-mail.

**Documents et systèmes** : logiciels de devis/facturation (Batappli, Tolteck, EBP, Sellsy, Axonaut, Henrri, Abby — [F] cités dans des comparatifs), CRM (HubSpot, Pipedrive [H]), tableurs de commissions, signature électronique.

**Contraintes** : la relance de devis est souvent une **fonction** intégrée aux logiciels de devis (Jobber l'inclut à partir de l'offre Connect [F]) → risque de commoditisation ; acquisition TPE coûteuse ; aucun catalyseur réglementaire vérifié dans ce lot (la réforme de la facturation électronique n'a pas été vérifiée ici).

**Niches** : relance de devis TPE en FR (E-13) ; suivi des propositions des sociétés de services (E-14) ; commissions PME, angle FR (E-15) ; mémoires techniques pour marchés publics (E-16).

**Couverture** : **moyenne-faible**. Non couvert : prix officiels des logiciels de devis FR ; taux de transformation des devis ; existence de relances automatiques chez Tolteck/Batappli/EBP. **Biais signalé** : le dépôt hôte (Relanzio) traite la relance de devis ; j'ai noté E-13 sans bonus.

### Famille 3 — Marketing, agences et médias

**Acteurs payeurs** : petites agences (2-20 pers.) et studios ; agences web gérant des dizaines de sites ; marques D2C ; agences d'influence.

**Workflows** : validation des livrables par le client ; reporting mensuel ; maintenance des sites (bandeaux cookies, accessibilité) ; contractualisation avec créateurs ; sollicitation d'avis clients ; gestion des droits d'images/musiques.

**Documents et systèmes** : outils de validation (Filestage, Ziflow, PageProof), CMP (Didomi, Axeptio, Cookiebot [H, non vérifiés]), audits d'accessibilité, contrats d'influence, déclarations d'accessibilité.

**Contraintes** : marchés de validation et de reporting encombrés ; responsabilité partagée agence/client en conformité ; prix d'entrée des outils de validation autour de 199 USD/mois selon un concurrent [F secondaire].

**Changements vérifiables** : EAA (28 juin 2025) ; FTC règle avis (21 oct. 2024, lettres déc. 2025) ; contrat d'influence écrit obligatoire en France (1er janv. 2026) ; sanctions cookies CNIL (bilan 2025, procédure simplifiée). **ARPP : non vérifié** dans ce lot.

**Niches** : contrats d'influence conformes FR (E-21) ; audit FTC des pratiques d'avis (E-22) ; monitoring cookies multi-sites pour agences (E-24) ; accessibilité e-commerce PME (E-23).

**Couverture** : **moyenne**. Non couvert : ARPP ; prix officiels des CMP ; nombre d'agences d'influence en France ; état des contentieux EAA.

### Famille 4 — Créateurs et communautés

**Acteurs payeurs** : créateurs professionnels et leurs agents ; marques payant des créateurs UGC ; petites plateformes/marketplaces (DAC7) ; éditeurs de newsletters.

**Workflows** : pipeline des sponsorings, livrables, factures, relances de paiement ; contrats (obligatoires en FR) ; collecte des données fiscales des vendeurs (DAC7) ; vente d'emplacements de newsletter.

**Systèmes** : Notion/tableurs, outils comme GetSponsored [F, Capterra], plateformes d'influence côté marque (Upfluence, GRIN), acteurs KYC (Ondato), cabinets fiscaux (Vistra).

**Contraintes** : faible budget des créateurs individuels ; forte saisonnalité DAC7 (janvier) ; données fiscales sensibles.

**Niches** : DAC7 pour petites plateformes (E-28) ; CRM sponsorings créateur (E-27) ; paiements UGC US (E-30, [H]).

**Couverture** : **faible-moyenne**. Non couvert : implémentation française de DAC7 (portail DGFiP) ; DAC8/DAC9 ; outils côté créateur en France ; formateurs en ligne (non traités).

### Famille 5 — Services professionnels spécialisés

**Acteurs payeurs** : agences d'architecture (2-15 pers.), bureaux d'études, géomètres, cabinets de conseil, traducteurs, photographes.

**Workflows** : suivi des honoraires par phase (ESQ → AOR selon les missions MOP) ; saisie des temps ; facturation à l'avancement ; renouvellement de licences d'images ; dépôt d'attestations de vigilance chez les donneurs d'ordre.

**Systèmes** : OOTI et logiciels de gestion d'agence [F nom seulement], Excel, logiciels comptables.

**Contraintes** : marchés verticaux de taille modeste par pays ; la saisie des temps est un problème d'adoption ; pas de catalyseur réglementaire vérifié.

**Niches** : honoraires MOP architectes (E-31) ; avancement BET/géomètres (E-32).

**Couverture** : **faible**. Les seules sources sont du contenu SEO d'un éditeur (Kolonell). Non couvert : prix officiels d'OOTI ; effectifs des professions ; traducteurs et photographes (hypothèses non sourcées).

### Famille 6 — Transverses et marchés oubliés

**Acteurs payeurs** : startups et PME innovantes (CIR/CII, R&D UK/US) ; DAF de PME (contrats, assurance-crédit, litiges) ; référents RGPD de TPE/PME ; DSI/DPO (gouvernance IA).

**Workflows** : documentation au fil de l'eau des projets R&D et des temps ; formulaires AIF (UK) ; calendrier des préavis de résiliation ; registre de l'art. 30 et demandes d'accès ; déclarations d'impayés à l'assureur-crédit [H] ; inventaire des usages IA.

**Systèmes** : cabinets CIR rémunérés au pourcentage ; modèle Excel CNIL ; outils RGPD (Legiscope, Leto, Dastra) ; outils de renouvellement (RenewalWatch, Renewly).

**Changements vérifiables** : LF 2025 (CIR/CII) ; AIF UK et régime fusionné ; Section 174A US ; omnibus IA (art. 4 assoupli, haut risque reporté) ; bilan CNIL 2025.

**Niches** : dossier CIR/CII au fil de l'eau (E-36) ; AIF UK (E-37) ; reconductions tacites (E-39) ; registre RGPD (E-40, encombré).

**Couverture** : **moyenne** sur la fiscalité R&D ; **faible** sur l'assurance-crédit, les litiges B2B et la gestion documentaire réglementaire (aucune recherche dédiée faute de budget).

---

### Synthèse comparative US / France-UE / autres

- **États-Unis** : catalyseurs = application par la FTC (avis), CMMC (défense), Section 174A. Marché plus grand, concurrence plus financée (GRC, CMMC), acquisition plus chère. Les fonctions « relance de devis » y sont déjà intégrées aux logiciels de terrain (Jobber).
- **France/UE** : catalyseurs les plus nombreux et les plus récents (CRA live depuis sept. 2026, contrat d'influence 2026, NIS2 DE en vigueur, NIS2 FR en attente, EAA, CNIL). Avantage pour un solo francophone : documentation en français, référentiels locaux (ReCyF), outillage peu localisé chez les acteurs US.
- **Royaume-Uni** : CS&R Bill (MSP), AIF R&D : marchés de niche, plutôt modules complémentaires.
- **Allemagne** : NIS2 en vigueur depuis le 6 déc. 2025 avec ~29 500 entités → meilleur marché UE immédiat pour la cascade de questionnaires fournisseurs (E-01/E-02), mais exige l'allemand.
