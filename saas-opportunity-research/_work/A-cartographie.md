# A — Cartographie : santé, soins, pharmacie/véto/labos, recherche, assurances

Analyste A. Date : 2026-10-29. Méthode : 36 recherches web (WebSearch). **Limite importante** : WebFetch a échoué sur `www.fda.gov` et `www.cms.gov` (domaines hors réseau autorisé dans cette session). Les faits « officiels » ci-dessous viennent donc des **extraits de pages officielles renvoyés par le moteur de recherche** (cms.gov, medicaid.gov, health.gov.au, has-sante.fr, acpr.banque-france.fr, anses.fr…). Je n'ai pas lu le texte intégral de ces pages. Statut : VÉRIFIÉ = extrait officiel concordant ; PARTIEL = source secondaire ou extrait incomplet ; HYPOTHÈSE = raisonnement de l'analyste.

Légende : **[F]** fait observé sourcé · **[E]** estimation · **[H]** hypothèse · **[?]** inconnu.

---

## Famille 1 — Santé et cabinets médicaux

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

## Famille 2 — Soins aux personnes

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

## Famille 3 — Vétérinaires, pharmacies, opticiens/audio, laboratoires de biologie

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

## Famille 4 — Recherche et laboratoires

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

## Famille 5 — Assurances

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

## Synthèse transverse US / FR-UE / autres
- **US** : catalyseurs datés les plus nombreux et budgets les plus élevés (WISeR, CMS-0057-F, MFP, HCBS 80/20). En contrepartie, HIPAA, BAA et des intégrations payeurs pénibles.
- **FR** : catalyseurs réels (ACPR 2026, évaluations HAS jusqu'à fin 2027, réforme des SAD) avec des acheteurs petits et nombreux, joignables via les fédérations. Les métiers de santé « facturants » sont verrouillés par la certification des LGC.
- **Autres** :
  - Australie : réforme de l'aged care au 1er novembre 2025.
  - Allemagne : TI dans les soins, facturation SGB XI via la TI en décembre 2026 ; barrière de langue et de certification.
  - Brésil : glosas TISS, avec des concurrents locaux (ZG Soluções, Datasigh).
