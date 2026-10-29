# Audit 2 — D-37 (preuves Qualiopi + sous-traitance pour OF de 1 à 10 personnes)

Date : 2026-10-29. Rôle : auditeur de vérification des preuves apportées par le porteur. Langue : français.
Fichiers liés : `audit2-D37-matrice.csv` (99 lignes : 9 outils × 11 fonctions) et `audit2-D37-preuves.csv` (AU-P01 à AU-P35).

## Méthode et limites

- **WebFetch : 4 essais, 4 échecs** (ENOTFOUND) sur `leportailformateurs.fr`, `help.digiforma.com` (deux articles) et `www.legifrance.gouv.fr`. **Aucune page n'a été lue directement.** Pour les lire, il faut autoriser ces domaines dans les réglages réseau de la session.
- **WebSearch : 43 recherches abouties**, plus une refusée (limite d'usage atteinte puis levée). Environ 45 % visaient l'invalidation : outils gratuits, concurrents qui couvrent déjà la fonction, obligations moins fortes qu'annoncé.
- Plusieurs recherches ont été **limitées au domaine** de l'éditeur (`allowed_domains`). Leurs extraits viennent donc des pages de l'éditeur, mais WebSearch renvoie des **résumés produits par un modèle**, pas des citations brutes. Confiance maximale : « moyenne ».
- Modes d'accès utilisés ci-dessous :
  - **[ED]** extrait WebSearch issu du site de l'éditeur ;
  - **[T]** extrait d'un site tiers ;
  - **[ABS]** absence de résultat. Une absence de preuve ne prouve pas l'absence de la fonction.

---

## Vérification des 3 preuves du porteur

| # | Affirmation du porteur | Verdict | Mode d'accès | Détail |
|---|---|---|---|---|
| 1 | Le Portail des Formateurs (SYCFI) annonce : gestion d'équipe et de sous-traitance Qualiopi, dossiers formateurs, documents centralisés, alertes | **CONFIRMÉ** | [ED] recherche limitée à `leportailformateurs.fr`. WebFetch en échec | La page `/sycfi` existe, titrée « Le Portail des Formateurs · Partenariat SYCFI » [AU-P01]. Fonctions trouvées : CV, diplômes et justificatifs ; coffre-fort ; alertes avant expiration ; « gestion d'équipe et sous-traitance (ind. 17, 18, 27) » ; dossier conforme aux indicateurs 17, 18, 21 à 25 et 27, **partageable avec plusieurs OF** [AU-P02, AU-P03] |
| 1b | Tarif Équipe Pro à 39 € HT/mois, 33 € pour les adhérents SYCFI | **NON CONFIRMÉ, NON INFIRMÉ** | [ED] et [ABS] après 4 requêtes ciblées | Les extraits ne montrent qu'une « inscription 100 % gratuite, sans engagement, sans CB » [AU-P04]. La page tarifs n'est peut-être pas indexée. À relever au webinaire du 4/11 |
| 2 | Digiforma couvre les contrats de sous-traitance, la signature et l'émargement des apprenants et des formateurs | **CONFIRMÉ**, avec une nuance de prix | [ED] recherche limitée à `help.digiforma.com` : les titres des deux articles cités apparaissent, avec des extraits. Pages non lues | Contrat généré depuis la fiche intervenant, puis signé avec un code SMS ou e-mail et un certificat de preuve [AU-P08]. Contrat cadre et convention d'intervention [AU-P10]. Le formateur émarge depuis son espace intervenant [AU-P09]. Émargement sécurisé des apprenants, y compris en classe virtuelle [AU-P11]. **Nuance** : la signature électronique est une **option payante** ; un tiers donne 29 € HT/mois pour l'émargement sécurisé [AU-P12] |
| 3 | Texte du décret n° 2026-728 sur Légifrance (JORFTEXT000054608509) | **EXISTENCE CONFIRMÉE, TEXTE NON LU** | [T] concordants (Certiforma, CNFCE, Akto, Lefebvre Dalloz, Lexisveille, SchoolMaker). Légifrance en ENOTFOUND | L'identifiant JORFTEXT n'est cité que par Certiforma, et le NOR diverge (TRSD2619632D / TRSD2609875D) [AU-P15]. Une page Digiforma annonce une bascule de grille au 1/1/2027 avec tolérance, ce qui contredit l'entrée en vigueur au 1/11/2026 donnée par toutes les autres sources [AU-P14] : à vérifier |

---

## A. Matrice de fonctionnalités

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
| Prix d'entrée | **Gratuit** (39/33 € non confirmés) | 49 € HT/mois + options [T] | 49 €/mois [T] | Gratuit, puis 39 € [T] | 225 € HT/mois [T] | 75 € HT/mois [T] | **29 €/mois** [ED] (le DD indiquait 39 €) | 0 € | **Gratuit (5 dossiers)** ; 29 €/mois ou 249 €/an [ED] |

**Lecture** : chaque brique du wedge 1 du DD existe déjà au moins une fois :
- contrat + signature + émargement formateur : Digiforma, SmartOF, Dendreo ;
- attestations URSSAF + alertes : CertiSkool ;
- dossier formateur réutilisable entre plusieurs OF : Portail des Formateurs.

Seule la vérification automatique n'existe nulle part, et la section C explique pourquoi.

---

## B. Obligations juridiques

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

## C. Différenciation objectivement vérifiable restante

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

## D. Re-notation de D-37

### Grille d'origine (note sur 10 × poids / 10)

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

### Grille v2 « entreprise importante » (brief-phase6)

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

---

## Verdict

**STOP D-37 en tant que SaaS autonome.** Note : 47,5/100 sur la grille d'origine (62,5 au DD, ~56 en red team) et **38,5/100 sur la grille v2**.

Les deux preuves fonctionnelles du porteur sont confirmées par extraits issus des domaines des éditeurs ; seul le prix du Portail (39/33 €) reste invérifié. La découverte de CertiSkool ferme la dernière brique (attestations + alertes) que le DD et la red team croyaient libre.

**Conditions de réouverture** (toutes vérifiables, aucune ne justifie du code aujourd'hui) :
1. Le décret L8222-1-1 paraît (au plus tard le 26/12/2026) et impose aux OF des pièces ou un contrôle d'authenticité que ni CertiSkool ni le Portail ne couvrent, **et** une voie d'accès légale aux données URSSAF existe pour un acteur privé.
2. Le Portail des Formateurs (éditeur probablement vousformez.fr, contact relevé dans les extraits) propose un **partenariat ou une marque blanche** côté OF. À demander au webinaire SYCFI du 4/11, où il faudra aussi relever le prix réel.
3. Le guide v10 exige pour les indicateurs 19 ou 27 des preuves que Digiforma, SmartOF et Edusign ne produisent pas.

**Actions** :
- Autoriser `leportailformateurs.fr`, `help.digiforma.com` et `legifrance.gouv.fr` dans la session, puis relire les 4 pages (15 minutes).
- Corriger dans le DD : le prix d'Edusign (29 € et non 39 €), et l'applicabilité des indicateurs 14 et 15.
