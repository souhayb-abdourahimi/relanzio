# 12 — Audit critique des conclusions (phase 6)

Date : 2026-10-29 (soir).

**Déclencheur** : trois preuves nouvelles apportées par le porteur contre D-37, et une question élargie : *quelle idée mérite rationnellement plusieurs années de travail ?*

Ce document **corrige** des conclusions antérieures. Rien n'a été supprimé : les fichiers 03 à 11 portent un bandeau de révision qui renvoie ici, et l'historique git conserve les versions d'origine.

---

## DÉCISION : RECHERCHER UNE AUTRE OPPORTUNITÉ, PAR LE TERRAIN ET NON PAR DOSSIER, ET ABANDONNER LES PISTES ACTUELLES COMME PROJETS DE PLUSIEURS ANNÉES

| Piste | Décision | Motif principal |
|---|---|---|
| **D-37** (sous-traitance et preuves Qualiopi) | **ABANDON** | Chaque brique existe déjà, souvent gratuite : dossier formateur réutilisable entre OF (Portail des Formateurs, partenaire officiel du SYCFI), contrat + signature + émargement du formateur (Digiforma, SmartOF, Dendreo), attestations URSSAF avec alertes (CertiSkool, gratuit jusqu'à 5 dossiers). **Aucune obligation nouvelle en vigueur n'impose un logiciel** : la feuille papier reste valable et la vigilance semestrielle existe depuis longtemps. Potentiel < 1 M€ d'ARR. Notes : 47,5/100 (grille d'origine), 38,5/100 (grille v2) |
| **E-13** (relance de devis, Relanzio) | **Pas de projet de plusieurs années ; gel** (pas de nouveau code) | Test le moins coûteux, mais potentiel < 1 M€. Chaque maillon d'une expansion est tenu : devis (Obat : 15 000 clients, 12 M€ levés ; Tolteck, adossé à Saint-Gobain), e-facture (~130 PA), paiement (Qonto), financement (Faktus : 56 M€ levés). Note v2 : 49,5 |
| **Nouvelles pistes à fort potentiel** (31 candidats de 3 angles : systèmes d'enregistrement verticaux, API d'infrastructure, service-as-software IA) | **Aucune retenue pour un engagement** | Après red team, les trois meilleures tombent à environ 50/100 (propreté 51,0 ; API d'e-facturation 50,5 ; recouvrement au succès 49,5), avec un potentiel de 1 à 3 M€ pour un entrant. Chacune a un acteur financé en place, découvert seulement à la contre-recherche |
| **Méthode « choisir une idée sur dossier »** | **ARRÊT comme outil de sélection** ; conservée pour invalider (≤ 10 recherches par piste) | Trois fois de suite, une « lacune » fondée sur une absence de preuve a été réfutée : sous-traitants Qualiopi, puis Digiforma, puis Senef pour la propreté. La volonté de payer pour un nouvel entrant ne s'observe qu'en vendant |

**Ce que vous devriez faire maintenant** (détail en §7) :
1. **Un jour** : inventaire de vos accès réels. Dans quels secteurs pouvez-vous joindre 20 décideurs par votre réseau (anciens employeurs, famille, région, associations, communautés) ? Seul vous pouvez y répondre ; c'est désormais la variable la plus discriminante.
2. **30 jours de découverte terrain**, sans code, dans le secteur où vous avez le meilleur accès. À défaut, dans la propreté (NAF 81.21Z), avec des seuils d'arrêt écrits à l'avance.
3. **Critère global à 90 jours** : si aucun paiement n'est obtenu (précommande, service facturé), le problème est la distribution, pas l'idée. Les options deviennent alors : s'associer à quelqu'un qui a le réseau d'un secteur, rejoindre un éditeur vertical, ou vendre du service technique dans un secteur pour y acquérir l'accès.

**Incertitudes restantes** (toutes décisives) :
- votre accès réel à un secteur ;
- votre capacité à obtenir un premier paiement (Relanzio n'a pas encore de client payant) ;
- le contenu exact des textes officiels (Légifrance, guide v10, décret L8222-1-1), toujours inaccessibles depuis cet environnement ;
- l'exactitude des extraits de recherche, reformulés par un modèle.

---

## 1. Accès aux sources primaires : ce qui a été lu, et ce qui ne l'a pas été

| Source demandée | Résultat | Ce qui a été vérifié autrement |
|---|---|---|
| https://leportailformateurs.fr/sycfi | **Non lue** : DNS refusé par la politique réseau (2 tentatives, 2026-10-29) | Par extraits sur le domaine : page « Partenariat SYCFI » ; dossier formateur, coffre-fort, alertes d'expiration, « gestion d'équipe et sous-traitance (ind. 17, 18, 27) », dossier partageable avec plusieurs OF, inscription gratuite [AU-P01 à P04]. **Le prix de 39 € HT (33 € pour les adhérents) n'apparaît dans aucun extrait** : non confirmé, non infirmé. Ce document le retient tel que vous l'avez cité, étiqueté « source porteur » |
| help.digiforma.com (2 articles) | **Non lus** (DNS refusé) | Titres et extraits du centre d'aide : signature électronique des contrats de sous-traitance (option payante), émargement apprenants et formateurs, y compris à distance [AU-P08 à P11]. **Confirmé par extraits** |
| legifrance.gouv.fr (JORFTEXT000054608509) | **Non lu** (DNS refusé) | Le décret n° 2026-728 existe (plusieurs sources secondaires). Le texte de l'indicateur 27 n'est connu que par paraphrase : « s'assure du respect de la conformité » des sous-traitants, conformité « tracée dans les contrats » [AU-P16]. **Le texte intégral n'a pas été lu** ; les qualifications juridiques ci-dessous restent à confirmer sur Légifrance |

**Pour lever la limite** : paramètres de l'environnement cloud → Network access → ajouter `leportailformateurs.fr`, `help.digiforma.com`, `www.legifrance.gouv.fr` (https://code.claude.com/docs/en/cloud-environments#network-access). La relecture des quatre pages prendrait environ 15 minutes. Elle peut préciser un prix ou un article, mais elle ne changerait pas la décision : les fonctions concurrentes sont confirmées par plusieurs extraits indépendants.

---

## 2. Matrice de fonctionnalités concurrentes (D-37)
Source : `_work/audit2-D37.md` §A et `_work/audit2-D37-matrice.csv`.
- [ED] = extrait du domaine de l'éditeur ;
- [T] = tiers (comparateur, blog) ;
- « Non trouvé » = absence dans les extraits, **pas** une preuve d'absence.

Détail, sources et notes dans `audit2-D37-matrice.csv`. **CertiSkool** a été ajouté : c'est un concurrent découvert pendant l'audit et absent du DD.

| Fonction | Portail Formateurs | Digiforma | Qualiobee | Formiva | Dendreo | SmartOF | Edusign | Drive + modèles | CertiSkool |
|---|---|---|---|---|---|---|---|---|---|
| Dossier formateur (CV, diplômes, pièces) | **Oui** [ED] | **Oui** (base Intervenants) [ED] | Inconnu | Oui (fiches formateurs) [T] | **Oui** (fiche CRM) [ED] | **Oui** [ED] | Non trouvé | Oui (manuel) | **Oui** (Kbis, URSSAF, RC Pro, CV, contrat) [ED] |
| Contrat de sous-traitance + signature électronique | Non trouvé | **Oui** (option payante) [ED] | Inconnu (signature listée) | Non trouvé | **Oui** (« Documents à signer ») [ED] | **Oui** [ED] | Non trouvé | Inconnu (modèles gratuits) | Inconnu (contrat suivi, signature non citée) |
| Attestations URSSAF + alertes d'expiration | Inconnu (alertes génériques : Oui) | Non trouvé | Non trouvé | Non trouvé | Non trouvé | Non trouvé | Non trouvé | Non trouvé | **Oui** (IA, alerte à J-30) [ED] |
| Émargement apprenant | Non trouvé | **Oui** | **Oui** [T] | Inconnu | **Oui** | **Oui** | **Oui** | Oui (papier) | Non trouvé |
| Émargement formateur | Non trouvé | **Oui** [ED] | Inconnu | Inconnu | **Oui** [ED] | Inconnu | **Oui** [T] | Oui (modèle Centre Inffo) | Non trouvé |
| Traces du distanciel | Non trouvé | Oui (signature à distance, double authentification) | Inconnu | Inconnu | Inconnu | Inconnu | Oui (Zoom/Teams, e-mail) | Non trouvé | Non trouvé |
| Export du dossier d'audit par indicateur | Oui (périmètre formateur : 17, 18, 21-25, 27) | Inconnu | Inconnu (« préparation automatique des audits ») | Inconnu (« agent d'audit IA ») | Inconnu | Inconnu | Non trouvé | Oui (manuel) | Oui (critère 4) |
| Réutilisation d'un dossier formateur entre plusieurs OF | **Oui** [ED] | Non trouvé | Non trouvé | Non trouvé | Non trouvé | Non trouvé | Non trouvé | Inconnu | Non trouvé |
| Vérification automatique (API URSSAF) | Non trouvé | Non trouvé | Non trouvé | Non trouvé | Non trouvé | Non trouvé | Non trouvé | Non trouvé | Non trouvé (vérification « sur le site URSSAF ») |
| Mise à jour V10 | Inconnu | Inconnu (page éditoriale V10) | Inconnu | Inconnu | Inconnu | Inconnu | — | Oui (liste Certiforma des 33 indicateurs) | Inconnu |
| Prix d'entrée | **Gratuit** côté formateur ; Équipe Pro 39 € HT/mois (33 € adhérents SYCFI) selon la source du porteur, non confirmé par extrait | 49 € HT/mois + options [T] | 49 €/mois [T] | Gratuit, puis 39 € [T] | 225 € HT/mois [T] | 75 € HT/mois [T] | **29 €/mois** [ED] (le DD indiquait 39 €) | 0 € | **Gratuit (5 dossiers)** ; 29 €/mois ou 249 €/an [ED] |

**Lecture** : chaque brique du wedge 1 du DD existe déjà au moins une fois :
- contrat + signature + émargement formateur : Digiforma, SmartOF, Dendreo ;
- attestations URSSAF + alertes : CertiSkool ;
- dossier formateur réutilisable entre plusieurs OF : Portail des Formateurs.

Seule la vérification automatique n'existe nulle part, et le §4 explique pourquoi (pas de voie d'accès légale aux données).

---

## 3. Obligations juridiques : obligatoire, conseillé, simple fonctionnalité commerciale

Aucun texte n'a été lu sur Légifrance. Les articles cités viennent d'extraits secondaires.

| Sujet | OBLIGATOIRE (texte et article) | CONSEILLÉ (guide, recommandations) | SIMPLE FONCTIONNALITÉ COMMERCIALE |
|---|---|---|---|
| **Indicateur 27** | Décret 2026-728 (annexe RNQ) : « s'assure du respect de la conformité » des sous-traitants et du portage. Nouveauté : conformité **tracée dans les contrats** [AU-P16] | Preuves : clause contractuelle, questionnaire, point annuel, CV, diplômes, NDA, Qualiopi si CPF [AU-P16, AU-P35]. Le guide v10 n'est pas paru | Fiche sous-traitant, relances, tableau de bord |
| **Indicateur 19** | Vérifier l'**effectivité** du suivi à distance [AU-P17] | Seuils renvoyés à des arrêtés **non publiés au 20/10**. Preuves recevables à fixer par le guide v10. L'avis « les relevés de connexion ne suffiront plus » (Certiforma) n'est pas sourcé | Journal de connexion horodaté, quiz de présence |
| **Indicateur 2** | Publier les taux **et leur méthode de calcul** [AU-P18] | Format de présentation | Calcul automatique des taux |
| **Indicateur 12** | Mesures de prévention des VSS, du harcèlement et des discriminations [AU-P18] | Modèle de procédure | Générateur de procédure |
| **Indicateurs 14 et 15** | Selon un résumé, ils visent l'**accompagnement et les droits des apprentis (CFA)** [AU-P18]. **Probablement non applicables** à un formateur indépendant hors apprentissage. Cela corrige le DD, qui disait que « 2, 12, 14, 15, 19 vous concernent directement » | — | — |
| **Vigilance du donneur d'ordre** | L8222-1, R8222-1, D8222-5 : contrat **≥ 5 000 € HT** → attestation de vigilance **à la conclusion puis tous les 6 mois** jusqu'à la fin de l'exécution [AU-P20]. Vérification de l'authenticité auprès de l'URSSAF ; seuls les documents de D8222-5 sont libératoires [AU-P21]. Sanction : solidarité financière (L8222-2). **Cette obligation existait avant 2026** | Calendrier de relance | Alertes d'expiration, lecture des dates par IA (déjà chez CertiSkool) |
| **Ce que change la loi 2026-534** | Crée **L8222-1-1** : vigilance du **maître d'ouvrage** sur les sous-traitants qu'il a acceptés. **Seuil et liste des documents fixés par décret**, entrée en vigueur **au plus tard le 26/12/2026** [AU-P22]. **Décret non trouvé au 29/10** [AU-P23]. Selon un cabinet (non vérifié), il s'agit de l'art. 95 de la loi, et l'art. 70 prévoit des amendes jusqu'à 4 000 € par manquement [AU-P24] | « Vérification périodique » des formateurs sous-traitants, selon une société de portage, sans base citée ; c'est probablement L8222-1 déjà en vigueur [AU-P25] | — |
| **Déclaration de sous-traitance CPF** | Décret 2023-1350 : déclaration **annuelle** sur Mon Compte Formation/EDOF pour tout OF référencé ; sous-traitance encadrée depuis le 1/4/2024 ; sous-traitant Qualiopi sauf micro-social en franchise (R6333-6-3) [AU-P26] | — | Préremplissage. L'outil public est **gratuit et obligatoire** |
| **Émargement** | Il faut **prouver la réalité et l'assiduité** : copie aux financeurs (R6332-26 selon un tiers), CGU de la CDC pour le CPF. **Aucune source ne montre que la signature électronique est exigée. Le papier reste valable** [AU-P27] | **Signature du formateur** et des stagiaires par demi-journée « pour avoir force probante » (Centre Inffo, jurisprudence, modèle renvoyant à D6353-4) [AU-P28]. C'est une exigence de preuve, **pas un texte qui l'impose expressément** | Signature électronique, horodatage, double authentification (art. 1366 C. civ. : valeur probante si la personne est identifiable et le document intègre) |
| **Guide de lecture v10** | — | **Non trouvé publié au 29/10/2026** : Akto « prochainement », Certiforma (août) « aucune V10 », SchoolMaker (20/10) v9 toujours en vigueur ; aucune page ministérielle trouvée [AU-P19]. C'est une absence de preuve, pas une preuve d'absence | — |

**Conséquence** : aucune obligation **nouvelle et en vigueur** n'impose un logiciel. La seule obligation récurrente (vigilance tous les 6 mois, ≥ 5 000 € HT) est ancienne et déjà outillée (CertiSkool, Drive). Celle qui est nouvelle (L8222-1-1) n'est **pas encore en vigueur**, n'a ni seuil ni liste de documents, et vise le maître d'ouvrage.

---

## 4. Différenciation objectivement vérifiable restante

| Candidat | Déjà couvert ? | Preuve |
|---|---|---|
| Réutilisation d'un dossier formateur entre plusieurs OF | **Oui, par le Portail des Formateurs** : « partageable avec plusieurs organismes », lien sécurisé, inscription gratuite | AU-P02 [ED] |
| Alertes d'expiration des attestations URSSAF et autres pièces | **Oui, par CertiSkool** (IA, J-30, 29 €/mois, gratuit jusqu'à 5 dossiers). Le Portail annonce aussi des alertes génériques | AU-P29, AU-P03 |
| Vérification **automatique** de l'authenticité des attestations (API URSSAF) | Non couverte… **parce qu'elle n'est pas accessible** : API Entreprise est réservée aux acteurs publics, et les micro-entrepreneurs non libéraux ne sont pas appelables. CertiSkool renvoie à une vérification manuelle « sur le site URSSAF » | AU-P31, AU-P30. Une automatisation par robot sur le site URSSAF n'a pas été étudiée ; risque CGU et juridique [INC] |
| Contrat + signature + émargement formateur dans un même outil pour un petit OF | **Oui** : Digiforma (dès 49 € + option), SmartOF, Dendreo | AU-P08 à AU-P11, AU-P32, AU-P33 |
| « Dossier de contrôle » CDC ou DGEFP par session (émargements + contrat + attestations + traces) | Pas trouvé **sous ce nom**, mais c'est un **assemblage** de fonctions qui existent déjà. Aucune exigence officielle ne définit ce dossier | [ABS] |
| Preuves de l'indicateur 19 (effectivité du distanciel) | Non différenciable tant que les arrêtés et le guide v10 ne sont pas parus. Edusign et Digiforma couvrent déjà la signature à distance | AU-P17, AU-P34 |

**Le Portail est-il un réseau formateur ↔ OF ?**
- **En partie oui** [ED]. Le dossier appartient au **formateur**, l'inscription est gratuite, et le dossier se partage par lien avec **tous ses OF**. Une fonction « gestion d'équipe et sous-traitance » existe.
- **Aucun espace côté OF** (invitation, tableau de suivi des sous-traitants) n'est documenté.
- Le modèle est biface et porté par le syndicat de la cible : c'est **l'angle réseau**, le seul qui aurait donné de la défendabilité, et il est déjà occupé.

**Conclusion C** : **aucune différenciation objectivement vérifiable ne subsiste.**
- Ce qui reste, c'est un **bundle** (Digiforma + CertiSkool + Portail) à un prix unique, c'est-à-dire une différenciation par l'intégration et le prix, que n'importe lequel de ces acteurs peut copier.
- La vérification automatique serait la seule vraie différence, mais aucune voie légale d'accès aux données n'a été trouvée.

---

## 5. Scores recalculés

### 5.1 D-37

#### Grille d'origine (note sur 10 × poids / 10)

| Critère (poids) | DD | Red team | **Audit 2** | Pts | Cause du changement |
|---|---|---|---|---|---|
| Douleur (20) | 6 | 6 | **5** | 10 | Le papier reste valable ; il existe des alternatives gratuites (Portail, CertiSkool jusqu'à 5 dossiers, modèles Centre Inffo et Certiforma) ; aucune obligation nouvelle en vigueur n'impose un outil |
| Fréquence (10) | 7 | 7 | **6** | 6 | Les indicateurs 14 et 15 ne concernent probablement que les CFA. La vigilance semestrielle crée une récurrence (élément POUR), mais seulement pour les contrats ≥ 5 000 € HT et elle est déjà outillée |
| Preuves (15) | 6 | 6 | **5** | 7,5 | Les preuves du porteur se confirment (sauf le prix 39/33) et vont toutes **contre** la lacune. Légifrance n'est toujours pas lu. Aucune preuve de volonté de payer pour **ce** produit |
| Distribution (15) | 7 | 5 | **4** | 6 | Le canal SYCFI est pris par le Portail (partenariat officiel, `/sycfi`). CertiSkool occupe le SEO « attestation vigilance formateur » |
| Lacune (10) | 3 | 2 | **1** | 1 | Chaque brique existe chez au moins un acteur, souvent gratuitement (section C) |
| Faisabilité (10) | 8 | 8 | **7** | 7 | API Entreprise inaccessible : la seule fonction différenciante n'est pas réalisable par une voie officielle |
| Marge (5) | 8 | 8 | **8** | 4 | Inchangée |
| Timing (5) | 8 | 5 | **5** | 2,5 | Le guide v10 et les arrêtés de l'indicateur 19 sont absents ; le décret L8222-1-1 est attendu au plus tard le 26/12 (possible catalyseur, non paru). Bascule de grille au 1/1/2027 selon Digiforma, non vérifiée |
| Défendabilité (5) | 3 | 3 | **2** | 1 | L'effet réseau formateur ↔ OF est déjà porté par le Portail, adossé au syndicat de la cible |
| Risques (5) | 7 | 5 | **5** | 2,5 | Inchangé par rapport à la red team (responsabilité, textes non stabilisés, contraction du CPF) |
| **Total** | **62,5** | **~56** | | **47,5/100** | **−15 points par rapport au DD** |

#### Grille v2 « entreprise importante » (brief-phase6)

| Critère (poids) | Note /10 | Pts | Justification |
|---|---|---|---|
| Douleur & budget existant (15) | 5 | 7,5 | Budget existant réel (Digiforma 49 €, options à 29 €, consultants), mais la douleur spécifique (sous-traitance) a des réponses gratuites |
| Fréquence / criticité (5) | 6 | 3 | Session par session et tous les 6 mois ; criticité forte seulement à l'audit |
| Preuves de **dépense réelle** (15) | 4 | 6 | Prix publics de produits voisins (Digiforma, Edusign, CertiSkool à 29 €). **Aucun nombre de clients ni CA** de concurrent trouvé sur ce segment |
| Distribution pour ce porteur (10) | 4 | 4 | Liste data.gouv sans e-mails ; SYCFI pris ; SEO occupé |
| Lacune (10) | 1 | 1 | Voir section C |
| Faisabilité ≤ 4 mois (5) | 8 | 4 | Techniquement simple, hors vérification automatique |
| **Potentiel** (20) | **2** | 4 | Calcul bottom-up ci-dessous : **< 1 M€ d'ARR** |
| Marge & récurrence (5) | 6 | 3 | Marge élevée ; churn après l'audit ; récurrence semestrielle partielle |
| Timing (5) | 5 | 2,5 | Textes d'application et guide absents |
| Défendabilité (5) | 2 | 1 | Pas de réseau propre ; système d'enregistrement déjà tenu par Digiforma et ses pairs |
| Risques maîtrisables (5) | 5 | 2,5 | Idem grille d'origine |
| **Total v2** | | **38,5/100** | |

**Calcul du Potentiel (bottom-up)** :
1. 45 665 OF certifiés [DD, OBS].
2. Part de 1 à 10 personnes qui sous-traitent : 20 à 40 % [HYP], soit **9 000 à 18 000** acheteurs.
3. Prix : 29 à 39 €/mois, soit 350 à 470 €/an.
4. Pénétration à 5-7 ans : 3 à 10 % [HYP] face à des alternatives gratuites.
5. Résultat : **0,1 à 0,85 M€ d'ARR**.

L'expansion vers la vigilance multisectorielle (BTP, transport, IT) est déjà le modèle de CertiSkool. Note **2/10**.

### 5.2 Nouvelles opportunités à fort potentiel (phase 6, grille v2)

Trois angles de recherche (`_work/N1.md`, `N2.md`, `N3.md`), puis une red team sur les trois meilleures (`_work/redteam2.md`). Au moins 40 % des recherches visaient l'invalidation. Tableau complet : `03b-classement-v2-potentiel.csv`.

| ID | Piste | Note v2 analyste | Après red team | Potentiel | Preuve contraire décisive |
|---|---|---|---|---|---|
| N1-V09 | Logiciel de gestion pour entreprises de propreté 10-200 agents (FR) | 60.5 | 51.0 | 4 (1-3 M€) | Senef/Progiclean : 6,5 M€ levés puis Oakley Capital (03/2026) ; « aucun éditeur financé » réfuté |
| N2-01 | API d'e-facturation multi-pays pour éditeurs SaaS (UE) | 59.0 | 50.5 | 4 | DDD Invoices et A-Cube financés en 2026 ; Invopop dès 500 €/mois ; transport Peppol gratuit ou open source |
| N3-01 | Agence de recouvrement amiable B2B au succès, native IA (FR) | 62.0 | 49.5 | 4 | Procédure des créances incontestées (décret 20/10/2026) aux frais du débiteur ; Cleavr 8 M€ ; DGCCRF 41 % d'anomalies |
| N3-16 | Cabinet de récupération de cash natif IA (IJSS puis audit fournisseurs) | 57.5 | — | — | Nibelis intègre la récupération d'IJ ; Yooz/Spendesk détectent les doublons |
| N1-V13 | Taxis conventionnés et petits ambulanciers (contrôle avant facturation SEFi) | 55.5 | — | 4 | Obligation SEFi au 1/1/2027, 60 % déjà équipés, certification Assurance maladie |
| N1-V02 | Services à la personne (avance immédiate) | 54.5 | — | — | Senef cible aussi ce secteur (RT2) |
| N1-V10 | Sécurité privée | 54.5 | — | — | Senef cible aussi ce secteur (RT2) |
| N2-05 | Conformité EAA continue pour e-commerce | 54.0 | — | — | Marché banalisé (overlays, agences) |
| N3-09 | CIR/CII et aides au succès | 54.0 | — | — | Cabinets en place, risque fiscal |
| N3-10 | Audit des comptes fournisseurs (doublons, trop-payés) | 54.0 | — | — | Fonction intégrée aux outils AP |
| N3-US-denials | Contestation des refus d'assurance santé US | 52.5 | — | — | Éliminé : US, HIPAA, acteurs financés |
| N3-04 | Audit des factures de transport | 52.0 | — | — | — |
| N3-AO | Réponses aux appels d'offres publics | 52.0 | — | — | Éliminé : IA concurrente nombreuse |
| N1-V11 | Pompes funèbres | 51.5 | — | — | — |
| N3-08 | Récupération des indemnités journalières | 51.5 | — | — | Nibelis l'intègre |
| N1-V01 | Auto-écoles | 49.5 | — | — | — |
| E-13 / N1-V15 | Relance de devis TPE (Relanzio) et chemin BTP | 49.5 | 49.5 | 2-3 (< 1 M€) | Obat (15 000 clients, 12 M€), Tolteck (Saint-Gobain), ~130 PA, Qonto, Faktus (56 M€) |
| N2-02 | Passerelle opérateur de dématérialisation pour éditeurs verticaux FR | 48.5 | — | — | Éliminé |
| N2-03 | Vérification du bénéficiaire (VoP) et fraude au virement | 47.0 | — | — | Éliminé : banques obligées de fournir le service |
| N3-salestax | Sales tax US PME e-commerce | 46.0 | — | — | Éliminé |
| N3-chargebacks | Litiges et chargebacks e-commerce | 45.0 | — | — | Éliminé |
| N3-energie | Récupération de trop-perçus énergie/télécoms | 44.5 | — | — | Éliminé |
| N3-TVA | Remboursement de TVA étrangère | 44.5 | — | — | Éliminé |
| N2-07 | Transparence salariale | 43.0 | — | — | En attente : transposition FR non adoptée |
| N3-taxefonciere | Appels de taxe foncière US | 42.5 | — | — | Éliminé |
| N2-06 | DAC7/8, pilier 2, CBAM (API de données) | 42.0 | — | — | Éliminé |
| N3-ATMP | Taux AT/MP | 42.0 | — | — | Éliminé : réservé aux avocats |
| N2-04 | Digital Product Passport | 40.5 | — | — | Éliminé |
| D-37 | Preuves Qualiopi et sous-traitance pour petits OF (FR) | 38.5 | 38.5 | 2 (< 1 M€) | Portail des Formateurs (SYCFI), Digiforma, CertiSkool ; aucune obligation nouvelle en vigueur n'impose un outil |
| N3-IRS | Réponses aux avis IRS | 37.0 | — | — | Éliminé |
| N3-amendes | Contestation des amendes de flotte | 32.5 | — | — | Éliminé |

**Lecture** : les quatre premiers candidats après red team (51,0 ; 50,5 ; 49,5 ; 49,5) sont à moins de 2 points les uns des autres, sous la marge d'erreur de la grille (± 5). Aucun n'a un potentiel prouvé au-dessus de 3 M€ pour un entrant, et aucun ne repose sur un avantage propre au porteur.

---

## 6. D-37 face à E-13, selon deux objectifs distincts

| Objectif | D-37 (sous-traitance Qualiopi) | E-13 (relance de devis) | Gagnant |
|---|---|---|---|
| **1. Le test le moins coûteux** | Il faudrait un concierge, et le test est rendu presque sans objet par la matrice : la lacune n'existe plus | Produit existant ; concierge payant à < 50 € et 40-80 h ; réponse en < 30 jours | **E-13** |
| **2. Le potentiel d'une entreprise importante** | 0,1 à 0,85 M€ d'ARR à 5-7 ans (9 000 à 18 000 acheteurs × 350-470 €/an × 3-10 %) ; potentiel 2/10 | 30-60 k€ d'ARR à 24 mois ; < 1 M€ même avec expansion, car chaque maillon est tenu ; potentiel 2-3/10 | **Aucun** |
| Note grille d'origine | 62,5 → 56 → **47,5** | 52 → **~50** | E-13 |
| Note grille v2 (avec potentiel) | **38,5** | **49,5** | E-13 |

**Conclusion** : être le **test le moins coûteux** ne fait pas d'E-13 un **projet qui mérite plusieurs années**. Le seul intérêt rationnel restant d'un test E-13 est de mesurer votre capacité à obtenir un paiement, qui est la variable la plus incertaine. Mais la découverte terrain (§7) mesure aussi cette capacité, et elle le fait dans un marché au plafond plus haut. Le test E-13 n'est donc **pas prioritaire**. Option bornée, si vous voulez valoriser Relanzio : proposer la fonction comme module ou intégration à 3 éditeurs BTP qui n'ont pas la relance automatique (Tolteck, Batappli, Costructor) ; **5 h au maximum, arrêt sans réponse positive**.

## 7. Plan des 30 prochains jours (remplace `10-validation-30-jours.md`, conservé pour mémoire)

| Jours | Action | Mesure | Seuil d'arrêt (écrit avant) |
|---|---|---|---|
| J1 | **Inventaire des accès** : lister les secteurs où vous pouvez joindre ≥ 20 décideurs par votre réseau | Nombre de contacts par secteur | — |
| J2-J5 | Si un secteur a ≥ 20 contacts : préparer 15 entretiens de découverte dans ce secteur. **Sinon** : propreté, NAF 81.21Z, entreprises de 10 à 200 salariés dans 2 départements | — | — |
| J2-J5 | Relever les prix et modules des éditeurs en place (pour la propreté : Progiclean/Senef, Penbase, Dalyo Clean, PROPRET, Organilog), sur leurs documents publics ou en démo **en vous présentant honnêtement** | Grille de fonctions et de prix | — |
| J5-J25 | 60 appels → 15 entretiens de 20 minutes, sur le **comportement passé** : outil actuel et prix ; ce qui fait perdre de l'argent chaque mois ; **tout ce que l'entreprise paie déjà à l'extérieur** (expert-comptable, intérim, contrôle qualité, recouvrement, logiciel) ; changement de logiciel déjà vécu | Douleurs payées, récurrentes, non couvertes par les éditeurs relevés | **> 50 %** déjà équipés d'un outil dédié et satisfaits → STOP du secteur |
| J15-J28 | Seulement si une douleur non couverte revient chez **≥ 5 entreprises sur 15** : proposer une précommande payée ou un service facturé (ex. 3 mois à 5 €/agent pour la propreté, ou une prestation manuelle) | Paiements | **< 2 paiements** → STOP ; prix médian accepté < 3 €/agent (propreté) → STOP |
| J30 | Comité : continuer le secteur (vérifier alors la piste par ≤ 10 recherches d'invalidation), changer de secteur (deuxième et dernier sprint), ou arrêter | — | À 90 jours : **0 paiement** → le problème est la distribution (voir la décision) |

- Budget : < 50 €, aucun code.
- **Aucun contact n'est pris et aucun message n'est envoyé sans votre accord.**

## 8. L'objectif initial a-t-il été atteint ?
**Non.** L'objectif était de « découvrir la meilleure opportunité SaaS parmi tous les marchés ». Ce qui a été produit :
- **Une carte d'élimination solide.** Environ 240 opportunités ont été examinées (206 en phase 1, 31 en phase 6). 13 pistes ont reçu une due diligence complète ou un audit, et 3 red teams ont été menées. Plus de 40 éliminations sont motivées par des preuves contraires sourcées : outil gratuit, éditeur financé, obligation suspendue ou non contraignante.
- **Aucune opportunité qui mérite plusieurs années.** Ni dans les finalistes initiaux, ni dans la nouvelle recherche orientée potentiel.

**Pourquoi l'objectif n'a pas été atteint** (causes, de la plus importante à la moins importante) :
1. **La grille de départ ne mesurait pas le potentiel.** Aucun critère de taille, 5 % seulement pour la marge et la récurrence. Le brief de phase 1 orientait vers les obligations documentaires, d'où une sélection de niches réglementaires à petit plafond, où une feuille Excel ou un outil public suffit. Corrigé en phase 6 (grille v2, potentiel à 20 %), mais tard.
2. **La recherche documentaire ne peut pas observer la volonté de payer d'un nouvel entrant.** C'est pourtant la preuve que la grille exige. Toutes les notes plafonnent donc à « plausible ».
3. **Les fausses lacunes.** Une absence de résultat sur un mot-clé vertical a été prise pour une absence d'acteur, trois fois. Les éditeurs multi-verticaux (Senef) et les sociétés privées non financées (Portail des Formateurs, Penbase, CertiSkool) restent invisibles à ces requêtes.
4. **L'environnement.** Aucune page n'a pu être ouverte (WebFetch bloqué) ; toutes les preuves sont des résumés de moteur.
5. **La couverture.** Faible hors US/UE (Inde, Amérique latine, Asie) et faible sur plusieurs secteurs (`01`, `11`).

**Ce qu'il serait irrationnel de faire** : prolonger la recherche documentaire en espérant qu'un 4e tour trouve « la » lacune. La valeur attendue est faible, voire négative : chaque tour a produit de nouvelles lacunes illusoires.

## 9. Règles ajoutées à la méthode
1. Toute lacune fondée sur « aucun X trouvé » est notée **au plus 5/10** au critère Lacune. Elle est publiée avec ses requêtes exactes et soumise à une recherche nominative sur les éditeurs multi-verticaux (paie, planning, ERP de services) avant d'entrer dans une note.
2. **Catalyseur ≠ demande.** Une obligation ne compte en Preuves que si un payeur dépense déjà pour la satisfaire.
3. Une note n'est comparable qu'au-delà de **± 5 points** ; en deçà, on départage par le coût et la vitesse du test.
4. Le critère **« accès du porteur à l'ICP »** est ajouté à la distribution.
5. Aucune recommandation d'engagement sans **au moins un paiement observé**.

## 10. Journal des corrections

| # | Conclusion antérieure (fichier) | Correction | Motif |
|---|---|---|---|
| C1 | « Seul espace où aucun outil dédié n'a été trouvé : aucun module sous-traitants chez Formiva, Digiforma ou Qualiobee » (07, raison n° 3 ; RT-P09) | **Retirée.** Digiforma documente la signature des contrats de sous-traitance et l'émargement des formateurs ; le Portail des Formateurs vend la gestion de la sous-traitance Qualiopi (voir l'audit) | Une **absence de preuve** dans des extraits de recherche a été présentée comme une lacune de marché. Erreur de méthode : la 3e raison « sourcée » reposait sur une recherche non concluante |
| C2 | « Recommandation n° 1 : D-37 » maintenue alors que la red team signalait déjà le Portail SYCFI (statut « inconnu ») | **Rétrogradée** (voir les notes recalculées) | J'ai traité l'incertitude sur un concurrent occupant le wedge comme neutre. Elle aurait dû baisser la note par prudence, puisque le prescripteur naturel du marché était déjà positionné |
| C3 | La grille de notation (03, 04) mesurait la « meilleure opportunité » | **Requalifiée** : elle mesurait la **meilleure opportunité testable vite par un solo**, pas la meilleure opportunité. Ajout d'une grille v2 avec un critère « Potentiel » (20 %) | Aucun critère de taille ou de plafond ; marge et récurrence à 5 % seulement. Le brief de phase 1 (« privilégie obligations documentaires… ») a orienté vers des niches réglementaires à petit plafond. L'objectif « meilleure opportunité parmi tous les marchés » n'était donc pas mesuré |
| C4 | « RECOMMANDATION N° 1 » coexistait avec le statut « AUCUNE IDÉE VALIDÉE » (07) | **Clarifiée** : il n'y avait pas d'opportunité recommandée, seulement des tests à faible coût | Le libellé pouvait laisser croire à une recommandation d'investissement |
| C5 | Prix des concurrents D-37 tirés d'agrégateurs (DD-D37, 05) | Le prix du Portail des Formateurs (39 € HT/mois, 33 € pour les adhérents), fourni par le porteur, sert de nouveau plafond de prix. Statut d'accès indiqué dans le registre | Le prix de 29 € HT envisagé ne laisse plus d'écart de valeur crédible face à un acteur du même prix, adossé au syndicat de la cible |
| C6 | Section « Obligations » du dossier D-37 | **Reclassée** en obligatoire / conseillé / fonctionnalité commerciale (voir l'audit) | Plusieurs « besoins » présentés comme réglementaires sont en réalité des commodités commerciales (signature électronique, alertes, export) |
| C7 | Sources primaires « non lues » | **Inchangé et répété** : legifrance.gouv.fr, help.digiforma.com et leportailformateurs.fr ne sont toujours pas accessibles depuis cette session (DNS refusé le 2026-10-29, 2e tentative) | Limite d'environnement, pas une lecture |
| C8 | n° 2 = E-13 « pour le coût du test » ; plan de 30 jours D-37 + E-13 (07, 10) | **Remplacés** par la décision et le plan du §7 de ce document | Être le test le moins coûteux ne fait pas un projet de plusieurs années ; les deux pistes ont un potentiel < 1 M€ |
| C9 | DD-D37 : Edusign à 39 €/mois ; indicateurs « 2, 12, 14, 15, 19 vous concernent directement » | Edusign **29 €/mois** [AU] ; indicateurs 14 et 15 **probablement réservés aux CFA** | Erreurs factuelles relevées par l'audit (extraits) |
| C10 | « Aucun éditeur financé » (N1-V09 propreté, phase 6) | **Réfuté** : Senef (Progiclean), 6,5 M€ levés puis Oakley Capital en 2026 [RT2-P01 à P03] | Même erreur que C1, commise et corrigée dans la phase 6 elle-même |
| C11 | Verdict founder-plan « Profitable » (`founder/business-plan.md`) | Sans objet : piste abandonnée. Le verdict était déjà annoté comme non probant (aucune rémunération du fondateur, hypothèses non observées) | — |
