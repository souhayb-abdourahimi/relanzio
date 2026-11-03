# D — Cartographie : fonctions back-office et secteur public

Analyste D. Date : 2026-10-29. Familles : (1) professions juridiques, (2) comptabilité et fiscalité, (3) services financiers, (4) recrutement et RH, (5) secteur public et associations, (6) éducation et formation.

## Note de méthode (à lire avant tout)

- Environ 38 recherches web (WebSearch) faites. **WebFetch était bloqué** par la politique réseau de la session : `www.impots.gouv.fr` et `www.presse-citron.net` renvoient « ENOTFOUND, hors des domaines autorisés ». Aucune page n'a donc été ouverte en entier. Toutes les vérifications reposent sur les extraits que renvoie le moteur de recherche. Pour que la phase 2 puisse lire les sources primaires, il faut autoriser au moins impots.gouv.fr, economie.gouv.fr, legifrance.gouv.fr, eur-lex.europa.eu, irs.gov et gov.uk dans les réglages réseau de la session.
- Convention utilisée dans les CSV :
  - **VÉRIFIÉ** : l'affirmation est confirmée par l'extrait d'une source officielle ou primaire (gouvernement, régulateur, ordre professionnel, banque centrale), souvent recoupée par d'autres sources. La page elle-même n'a pas été ouverte.
  - **PARTIEL** : sources secondaires (cabinets, éditeurs, blogs spécialisés) concordantes, ou source officielle qui ne couvre qu'une partie de l'affirmation.
  - **HYPOTHÈSE** : aucune preuve trouvée dans ce cycle.
- Prix des concurrents : aucune page tarifaire officielle n'a pu être lue. La colonne `prix_concurrents_observes` vaut donc « inconnu » partout, comme l'exige le brief. Les prix vus sur des agrégateurs (Capterra, SourceForge, Appvizer, comparatifs) figurent dans `notes` avec la mention ESTIMATION.
- Libellés : **FAIT** = sourcé ; **EST.** = estimation ; **HYP.** = hypothèse ; **INCONNU**.

---

## 1. Professions juridiques

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

## 2. Comptabilité et fiscalité

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

## 3. Services financiers

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

## 4. Recrutement et RH

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

## 5. Secteur public et associations

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

## 6. Éducation et formation

**Qui paie.** Organismes de formation (OF) et formateurs indépendants, CFA, écoles privées ; aux US, éditeurs edtech qui vendent aux districts K-12.

**Workflows.** Certification Qualiopi (audit initial, de surveillance, de renouvellement) ; publication des offres CPF sur EDOF ; feuilles d'émargement et preuves de réalisation ; BPF annuel ; conventions OPCO ; suivi des apprentis.

**Changements vérifiables.**
- **Nouveau référentiel Qualiopi** (secondaire concordant : Schoolmaker, Certiforma, 75secondes, Akto) : **décret n° 2026-728** (août 2026), applicable au **1/11/2026**. On passe de 32 à **33 indicateurs** : 13 réécrits et un indicateur 33 créé pour l'apprentissage. Évaluation des acquis distincte de la satisfaction ; suivi de la formation à distance. Présenté comme une mesure du plan de lutte contre la fraude. À vérifier sur Légifrance.
- **BPF** (FAIT, Centre Inffo) : campagne 2026 du 1/4 au 31/5 sur « Mon Activité Formation ». Sans transmission, la déclaration d'activité devient caduque.
- Volume (EST., source commerciale) : environ 45 000 OF certifiés Qualiopi pour 132 237 OF déclarés au 1/1/2025. Non vérifié auprès de la DARES.

**Niches.** Kit de preuves conforme au nouveau référentiel pour formateurs indépendants ; BPF automatisé ; émargement et preuves de réalisation contre la fraude CPF/OPCO ; indicateur 33 pour CFA.

**Couverture : moyenne** sur Qualiopi et le BPF, **faible** sur EDOF / déréférencement CPF et sur les K-12 US (non couverts).

---

## Synthèse transversale

1. **Calendrier de forte densité réglementaire (FAIT)** : facturation électronique FR septembre 2027 (PME), DE 2027–2028, ES 2027, PL sanctions fin 2027, UK MTD avril 2027 et 2028, AMLR juillet 2027, Qualiopi novembre 2026. La fenêtre de 6 à 18 mois correspond à un MVP vendable en 6 à 12 semaines.
2. **Plusieurs catalyseurs ont été retardés ou affaiblis (FAIT)** : transposition de la transparence salariale (FR pas avant 2027–2028), AML des RIA (2028), 1099 (seuil relevé), règlement européen sur les retards de paiement (bloqué). Ne pas fonder une opportunité sur ces seuls catalyseurs.
3. **Les éditeurs PA, paie et practice management absorbent les besoins génériques (HYP. forte)**. Les lacunes restantes sont les **obligations de niche portées par une personne seule** (avocat, formateur indépendant, petite association) et les **outils pour prescripteurs** (cabinet comptable gérant des centaines de TPE).
