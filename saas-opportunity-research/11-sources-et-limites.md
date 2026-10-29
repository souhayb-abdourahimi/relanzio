# 11 — Sources, limites et biais

Date : 2026-10-29.

## 1. Accès aux sources : la limite principale
- **WebSearch fonctionnait ; WebFetch ne fonctionnait pas.** La politique réseau de l'environnement cloud refuse la résolution des domaines externes. Ont été testés et refusés, entre autres : economie.gouv.fr, impots.gouv.fr, legifrance.gouv.fr, eur-lex.europa.eu, gov.uk, cms.gov, epa.gov, ncpa.org, reddit.com, g2.com, capterra.com, formiva.fr, obat.fr.
- **Conséquence** :
  - toutes les preuves sont des **extraits renvoyés par le moteur de recherche**, souvent reformulés par un modèle ;
  - **aucune page n'a été lue en entier**, y compris les textes officiels (décret 2026-728, recommandation ACPR, règles CMS ou EPA) et les pages tarifaires ;
  - l'étiquette « primaire » du registre signifie « domaine officiel ou de l'éditeur », pas « texte lu ».
- **Pour lever la limite** : paramètres de l'environnement cloud → Network access → niveau plus large, ou domaines ajoutés aux « Allowed domains » (https://code.claude.com/docs/en/cloud-environments#network-access).
- **Priorités de relecture** :
  1. legifrance.gouv.fr (décret 2026-728, loi 2026-534) ;
  2. le guide de lecture Qualiopi (travail-emploi.gouv.fr) ;
  3. helloasso.com (webinaire SYCFI) ;
  4. les pages tarifaires de Formiva, Qualiobee et Digiforma ;
  5. data.gouv.fr (liste publique des OF).

## 2. Registre des preuves : statistiques (`06-registre-preuves.csv`)
- Total : **691 preuves**, 469 domaines distincts.
- Par phase : due-diligence 353, phase-1 246, alternatives 51, red-team 41
- Par type : secondaire 288, primaire 233, comparateur 24, presse 23, éditeur 22, témoignage 16
- Par confiance : moyenne 370, élevée 186, faible 123, faible (absence de preuve) 3, moyenne (enquête d'association de défense) 1, faible (fournisseur, base hospitalière/340b) 1
- Par sens (due diligence, red team, alternatives) : non renseigné 246, contre 199, pour 141, neutre 105
- Sans URL : 2
- 20 domaines les plus cités : cms.gov (11), lafabriquedunet.fr (11), certiforma.fr (11), appvizer.fr (9), ncpa.org (8), centre-inffo.fr (8), plenful.com (6), economie.gouv.fr (6), capeb.fr (6), capterra.com (6), blogdumoderateur.com (6), acpr.banque-france.fr (5), epa.gov (5), secureframe.com (5), assemblee-nationale.fr (5), helloasso.com (5), taxation-customs.ec.europa.eu (4), questions.assemblee-nationale.fr (4), impots.gouv.fr (4), blog.avocats.deloitte.fr (4)
Fichiers sources du registre :
- `_work/[A-E]-preuves.csv` (phase 1) ;
- `_work/DD-*-preuves.csv` (due diligence) ;
- `_work/alternatives-preuves.csv` ;
- `_work/redteam-preuves.csv`.

Reproductible avec `python3 -I _work/merge_preuves.py _work 06-registre-preuves.csv`.

## 3. Sources décisives pour la recommandation (extrait du registre)
Date de consultation : 2026-10-29 pour toutes. Mode d'accès : extrait de recherche.

| ID | Affirmation | Source | Date pub. | Sens | Confiance |
|---|---|---|---|---|---|
| DD-D37-P01 | Décret n° 2026-728 du 1/8/2026, JO du 4/8/2026, en vigueur le 1/11/2026 ; 32 → 33 indicateurs ; 7 critères inchangés | [Certiforma](https://certiforma.fr/decret-qualiopi-2026-728-33-indicateurs/) | 2026-08/09 | POUR | moyenne |
| DD-D37-P08 | Loi anti-fraudes n° 2026-534 du 25/6/2026, publiée le 26/6, volet formation en vigueur le 27/6 (sauf art. 59-II) | [Centre Inffo](https://www.centre-inffo.fr/site-droit-formation/actualites-droit/publication-de-la-loi-anti-fraudes) | 2026-06 | POUR | élevée |
| DD-D37-P10 | Liste publique : 152 357 OF au 20/10/2026, dont 45 665 certifiés pour au moins une catégorie | [Docteur Certif](https://docteurcertif.fr/liste-des-meilleurs-certificateurs-qualiopi-2024/) | 2026-10 | POUR | moyenne |
| DD-D37-P14 | Formations CPF 2025 : 1,22 million, -11 % vs 2024 (DARES, juillet 2026) ; fin de prise en charge intégrale ; permis en baisse | [Toutsurmesfinances (citant la DARES)](https://www.toutsurmesfinances.com/actualites/?p=1225) | 2026-07 | CONTRE | moyenne |
| DD-D37-P15 | Reste à charge CPF porté à 150 € par formation au 2/4/2026 (103,20 € début 2026) | [Culture RH](https://culture-rh.com/cpf-reste-a-charge-2026/) | 2026-04 | CONTRE | moyenne |
| DD-D37-P20 | Formiva propose un plan gratuit sans CB, suit les indicateurs RNQ, centralise les preuves ; fondé en 2024 par le fondateur de Certiforma | [hunted.space / Capterra](https://hunted.space/product/formiva) | 2025-2026 | CONTRE | moyenne |
| DD-D37-P21 | Digiforma Indep à 49 € HT/mois (annuel) ou 59 € sans engagement, 200 apprenants/an | [Certiforma (+ lonasante.com)](https://certiforma.fr/alternatives-digiforma/) | 2026-07/09 | CONTRE | moyenne |
| RT-P01 | Le guide de lecture Qualiopi v10 n'était pas publié au 2/10/2026 | [CNFCE](https://www.cnfce.com/actualites/qualiopi-ce-qui-change-au-1er-novembre-2026) | 2026-10-02 | CONTRE | moyenne |
| RT-P02 | Au 20/10/2026, aucun des deux arrêtés (seuils des indicateurs 19 et 20) n'était publié au JO ; le guide reste en v9 du 8/1/2024 | [SchoolMaker (éditeur)](https://schoolmaker.com/fr/blog/nouveau-referentiel-qualiopi-2026.md) | 2026-10 | CONTRE | moyenne |
| RT-P03 | Le SYCFI présente le 4/11/2026 (webinaire gratuit) le « Portail des Formateurs », destiné à centraliser la conformité Qualiopi des formateurs ET de le | [SYCFI (via HelloAsso)](https://www.helloasso.com/associations/sycfi/evenements/centralisez-votre-conformite-qualiopi-et-celle-de-vos-sous-traitants) | 2026-10 | CONTRE | moyenne |
| RT-P05 | L'adhésion annuelle CFI au SYCFI pour 2026-2027 coûte 192 € | [SYCFI (via HelloAsso)](https://www.helloasso.com/associations/sycfi/adhesions/formulaire-d-adhesion-sycfi) | 2026 | NEUTRE | moyenne |
| RT-P06 | Qualiobee affiche des formules Indépendant 49 €/mois, Équipe 79 €, Organisme 139 € (utilisateurs illimités), avec émargement et signature électronique | [Appvizer (agrégateur)](https://www.appvizer.fr/education/formation-elearning/qualiobee) | inconnue | CONTRE | moyenne |
| RT-P09 | Aucune source ne montre de module dédié aux sous-traitants (contrats, CV, attestations) chez Formiva, Digiforma ou Qualiobee | [hunted.space](https://hunted.space/product/formiva) | inconnue | POUR | faible |
| RT-P11 | La loi anti-fraude crée un devoir de vigilance du maître d'ouvrage (formalités L8221-3 et L8221-5 du Code du travail) au-delà d'un montant, en vigueur | [Centre Inffo](https://www.centre-inffo.fr/site-droit-formation/actualites-droit/sous-traitance-devoir-de-vigilance-du-maitre-douvrage) | 2026 | CONTRE | moyenne |
| RT-P12 | La déclaration annuelle de sous-traitance CPF existe depuis le décret 2023-1350 ; la campagne 2026 (portant sur 2025) s'est tenue sur EDOF du 1/5 au 3 | [Centre Inffo](https://www.centre-inffo.fr/?p=512863) | 2026-05 | CONTRE | moyenne |
| DD-E13-P01 | Axonaut permet de configurer des relances automatiques d'un devis envoyé jusqu'à sa signature | [La Fabrique du Net (comparateur)](https://www.lafabriquedunet.fr/logiciel/axonaut) | inconnue | CONTRE | moyenne |
| DD-E13-P02 | Sellsy permet de créer plusieurs plans de relance attribués client par client, avec historique | [Codeur.com](https://www.codeur.com/comparatif/logiciel-facturation/sellsy-facturation) | 2026-03 | CONTRE | moyenne |
| DD-E13-P22 | Conjoncture CAPEB AURA 2017 : seuls 11 % des artisans transforment plus de 70 % de leurs devis, 35 % entre 41 et 70 % | [CAPEB Auvergne-Rhône-Alpes](https://www.capeb.fr/www/capeb/media//loire/document/Etude%20conjoncture%20CAPEB%20AURA%20 %202ème%20trimestre%202017.pdf) | 2017 | POUR | faible (ancienne, régionale) |
| DD-E13-P40 | Prix d'ancrage des logiciels de devis BTP : Tolteck 19-25 EUR HT/mois ; Obat 25-32 EUR HT (micro), dès 39 EUR (sociétés) | [Tool Advisor](https://tool-advisor.fr/logiciel-facturation/comparatif/logiciel-devis-facture-batiment/obat-vs-tolteck/) | 2026 | CONTRE | moyenne |
| RT-P19 | Extrabat propose une relance automatique des devis par SMS | [Blog du Modérateur](https://www.blogdumoderateur.com/tools/extrabat/) | inconnue | CONTRE | moyenne |
| RT-P21 | Tolteck : tri manuel des devis en attente ; relances automatiques d'impayés ; 25 € HT/mois ou 19 € en annuel ; aucune relance de devis trouvée | [tool-advisor.fr](https://tool-advisor.fr/logiciel-facturation/comparatif/tolteck/) | 2026 | POUR | moyenne |
| RT-P22 | Obat publie un guide de relance de devis par email (manuelle) ; aucune fonction native de relance automatique de devis trouvée | [Obat](https://www.obat.fr/blog/mail-de-relance-devis/) | inconnue | POUR | faible |
| RT-P27 | Abby indique pouvoir programmer des relances automatiques pour les devis en attente et les factures impayées | [Abby](https://abby.fr/guide/facturation/automatiser-devis-factures-independants) | inconnue | CONTRE | faible |
| RT-P28 | Comparatif : les relances automatiques sont payantes chez Henrri et Indy ; Abby les réserve à son plan Pro à 19 €/mois | [sk-web.fr](https://sk-web.fr/article/devis-facturation-artisan-outils-gratuits) | 2026 | CONTRE | faible |
| RT-P31 | L'accès à Beacon MFP et son utilisation sont gratuits pour les pharmacies | [Beacon Channel Management](https://www.mfp.beaconchannelmanagement.com) | inconnue | CONTRE | élevée |
| RT-P34 | McKesson (ideaShare 2026) : Health Mart Atlas, McKesson Reimbursement Advantage et ProviderPay aident les officines indépendantes à rapprocher des pai | [Pharmacy Times](https://www.pharmacytimes.com/view/mckesson-ideashare-2026-why-reimbursement-predictability-matters-for-independent-pharmacies) | 2026 | CONTRE | moyenne |
| RT-P35 | Health Mart Atlas est la première PSAO (6 077 pharmacies), devant Cardinal Health (5 416) et Elevate (5 014) au 1/1/2024 | [Milliman](https://careers.milliman.com/-/media/milliman/pdfs/2024-articles/9-12-24_top-psaos-20240910.ashx) | 2024-09-12 | NEUTRE | élevée |
## 4. Lacunes connues
- **Volonté de payer** : aucune donnée. Aucun entretien, précommande ou test de prix n'a été réalisé. C'est la lacune qui empêche toute validation.
- **Taille des segments** :
  - répartition des 45 665 OF certifiés par effectif : inconnue ;
  - part des OF qui sous-traitent : inconnue ;
  - nombre de testeurs backflow US : inconnu ;
  - nombre d'opérateurs VoIP concernés : non vérifié.
- **Communautés** : Reddit, groupes Facebook et LinkedIn inaccessibles ou non indexés. Les plaintes d'utilisateurs sont sous-représentées.
- **Textes en attente** :
  - guide de lecture Qualiopi v10 et arrêtés des indicateurs 19 et 20 ;
  - décret d'application du devoir de vigilance (loi 2026-534) ;
  - guidance CMS 2028 (MFP) ;
  - reconsidération EPA (ER&R).
- **Couverture sectorielle faible** : sport et événements, services professionnels spécialisés (traducteurs, photographes), industrie et fabrication, 3PL, marchés hors US/UE (Inde, Amérique latine, Asie). Voir `01-cartographie-marches.md`.
- **Contradictions non résolues** :
  - nombre d'indicateurs Qualiopi modifiés (11, 12 ou 13 selon les sources) ;
  - statut de la phase 2 du CMMC ;
  - plafond du CII ;
  - sanctions de l'accessibilité (EAA) en France.

## 5. Biais identifiés et traitement

| Biais | Effet | Traitement |
|---|---|---|
| Phase 1 sans recherche contraire | Notes surestimées de 9 à 22 points | 8 due diligences avec ≥ 30 % de recherches d'invalidation ; red team séparée ; notes non approfondies signalées comme probablement surestimées (`03`) |
| Malédiction du vainqueur (maximum de 206 notes bruitées) | Le n° 1 est surestimé par construction | Le classement ne décide pas seul ; les décisions reposent sur des seuils comportementaux (`10`) |
| Confusion entre catalyseur réglementaire et demande | Préférence pour des obligations qu'un Drive ou un outil public gratuit satisfait | Critères GO fondés uniquement sur des paiements ; la grille est signalée comme biaisée |
| SEO produit par les concurrents (Certiforma = Formiva, Plenful, éditeurs de logiciels BTP) | Fausse impression de « marché documenté » | Sources marquées comme intéressées dans les fiches |
| Proximité de la stack (Relanzio) | Faisabilité et distribution surnotées pour les pistes françaises | Sensibilité : faisabilité 8 → 6 pour D-37, le classement tient (60,5) |
| Escalade d'engagement (nom « Preuvio », code de Relanzio) | Maintien de pistes faibles | E-13 classée n° 2 pour le coût du test, explicitement ; founder-brand non exécuté |
| Absence de critère « accès du fondateur à l'ICP » dans la grille | Pistes US surnotées en distribution | Distribution US réévaluée à 3-5,5/10 ; A-23 parqué |
| Extraits de moteur reformulés par un modèle | Fausse précision des étiquettes [OBS] | Confiance abaissée ; relecture des textes officiels exigée avant décision de code |

## 6. Ce que cette étude n'est pas
- Ce n'est pas une étude de marché représentative, ni une preuve d'adéquation produit-marché, ni un conseil juridique, fiscal ou financier.
- Le panel d'acheteurs simulés du Founder Skill (founder-consumer) n'a **pas** été exécuté. Les notes et scénarios financiers reposent sur des hypothèses étiquetées.
- Faire vérifier par un professionnel :
  - les obligations Qualiopi et anti-fraude ;
  - la structure juridique ;
  - le RGPD.
