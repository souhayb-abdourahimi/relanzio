# B — Cartographie : secteurs traditionnels et terrain

Analyste B · Phase 1 · 2026-10-29 · 40 recherches web.

**Méthode et limites.** WebFetch n'a pas pu ouvrir plusieurs domaines dans cette session (epa.gov, terre-net.fr, linklaters.com, getapp.com : erreur de résolution DNS). Les vérifications reposent donc sur les extraits renvoyés par WebSearch. Quand l'extrait cite ou paraphrase directement la source (page officielle, texte au JO, document municipal), le statut est VÉRIFIÉ dans les CSV. Sinon, il est PARTIEL.

Conventions utilisées dans ce document :
- **[F]** fait observé et sourcé (référence vers `B-preuves.csv`) ;
- **[E]** estimation ;
- **[H]** hypothèse ;
- **[?]** inconnu.

---

## 1. Construction / BTP

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

## 2. Maintenance et field services

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

## 3. Immobilier et gestion d'actifs

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

## 4. Énergie, eau, déchets, climat

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

## 5. Agriculture et agroalimentaire

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

## 6. Industrie et fabrication

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

## Synthèse transversale

**[E] Motif le plus prometteur : le « dépôt réglementaire multi-destinataires » pour prestataires terrain.** Le technicien produit un rapport normé qu'il doit envoyer à un tiers dont le format varie : water district, administration, maître d'ouvrage. Il paie souvent ce tiers par rapport. Trois cas illustrent le motif :
- backflow ;
- fluides frigorigènes (FR/UE et US) ;
- certified payroll.

Leur point commun : volonté de payer démontrée par des frais existants, récurrence forte, et des listes publiques de professionnels agréés qui servent à l'acquisition [H, à vérifier].

**[E] Comparaison des marchés**
- **US** : marchés plus fragmentés (règles différentes par ville ou par district), avec une volonté de payer observable en frais par rapport.
- **France/UE** : catalyseurs datés (2026-2028), mais concurrence d'outils publics gratuits ou d'éditeurs installés.
- **UK** : timing flou (Awaab's Law pour le locatif privé).
