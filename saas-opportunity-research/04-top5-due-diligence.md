# 04 — Due diligence des finalistes (5 initiaux + 3 contrôles)

Date : 2026-10-29. Chaque fiche a été rédigée par un analyste distinct sur un brief commun (`_work/brief-phase2.md`). Les 14 sections sont obligatoires : ICP, JTBD, coût de l'inaction, concurrents, différenciation, taille de marché, pricing, intrants économiques, risques, distribution, faisabilité, défendabilité, raisons de ne pas le faire, re-notation. Au moins 30 % des recherches de chaque analyste devaient viser l'invalidation. Toutes les preuves sont des extraits de moteur de recherche : aucune page n'a été ouverte.

**Pourquoi 8 fiches et non 5.**
- Les 5 finalistes initiaux (A-23, B-09, D-37, D-20, A-39) ont tous perdu entre 11 et 22 points.
- Deux pistes suivantes ont donc été ajoutées : B-11 et E-01.
- La relance de devis (E-13, produit existant du porteur) a été soumise à la même épreuve, pour contrôler l'indépendance du classement.

## Tableau comparatif (notes 0-10 par critère après due diligence ; total pondéré sur 100)

| Critère (poids) | D-37 Qualiopi | D-20 Impayés e-facture | A-23 MFP pharmacies US | A-39 Courtiers | B-11 Backflow US | B-09/B-10 Fluides (FR) | E-13 Relance devis | E-01 Questionnaires sécu |
|---|---|---|---|---|---|---|---|---|
| Douleur & budget (20) | 6 | 7 | 7 | 5 | 5 | 4 | 5 | 6 |
| Fréquence (10) | 7 | 8 | 8 | 7 | 8 | 7 | 8 | 6 |
| Preuves (15) | 6 | 6 | 6 | 5 | 5 | 6 | 4 | 5 |
| Distribution (15) | 7 | 4 | 3 | 6 | 5,5 | 6 | 5 | 4 |
| Lacune (10) | 3 | 2 | 3 | 2 | 3 | 2 | 3 | 2 |
| Faisabilité (10) | 8 | 6 | 6 | 8 | 6 | 7 | 8 | 8 |
| Marge (5) | 8 | 7 | 7 | 7 | 8 | 6 | 7 | 7 |
| Timing (5) | 8 | 6 | 8 | 6 | 4 | 6 | 3 | 6 |
| Défendabilité (5) | 3 | 2 | 3 | 2 | 3 | 3 | 2 | 2 |
| Risques (5) | 7 | 6 | 3 | 4 | 5 | 5 | 7 | 5 |
| **Total phase 1 → DD** | **68 → 62,5** | **67 → 56** | **72,5 → 55** | **66 → 53** | **66 → 53** | **64 → 52** (US : 68 → 46) | **59 → 52** | **66 → 51,5** |
| Verdict de l'analyste | GO faible, conditionnel au wedge « preuves de réalisation + sous-traitance » | Pas un produit autonome ; module éventuel de Relanzio | NO-GO pour un fondateur en France ; possible via partenaire PSAO US | NO-GO en l'état | NO-GO en l'état | NO-GO (outil gratuit de l'État en FR, règle EPA instable aux US) | Aucun investissement produit ; test commercial borné de 4 à 6 semaines | NO-GO en l'état |

Le détail et la cause de chaque changement figurent au §14 de chaque fiche ci-dessous. Après la red team (`_work/redteam.md`), les notes indicatives deviennent : D-37 ≈ 56, E-13 ≈ 50-51, A-23 ≈ 52-54.

## Ce qui a fait chuter les notes (causes communes)
1. **Un gratuit existe presque partout**, qu'il vienne de l'État, d'un concurrent ou d'une plateforme imposée :
   - Formiva (Qualiopi) ;
   - Beacon MFP (pharmacies) ;
   - l'application « Fluides Frigorigènes » de l'État (avril 2026) ;
   - les plateformes agréées gratuites (e-facture) ;
   - les modèles ANACOFI (courtiers) ;
   - TrustCloud et les trust centers gratuits (sécurité) ;
   - les portails municipaux (backflow).
2. **Les éditeurs en place absorbent la fonction** : logiciels de gestion de pharmacie (PMS) et groupements de pharmacies (PSAO), plateformes agréées de facturation électronique (PA), Axonaut et Sellsy pour la relance de devis, Vanta et Drata, logiciels de gestion d'OF.
3. **Aucune volonté de payer observée** : toutes les preuves de demande sont des preuves de douleur ou de réglementation.
4. **La distribution vers les États-Unis n'est pas crédible pour un fondateur basé en France** sans partenaire local (A-23, B-09, B-11).
5. **Sources intéressées** : par exemple Certiforma, appartenant au fondateur de Formiva, ou les chiffres d'écart MFP publiés par des fournisseurs.

---

---

## DD-D37 — Kit de preuves Qualiopi (référentiel au 1/11/2026) pour formateurs indépendants et OF de 1 à 10 personnes

Date : 2026-10-29. Phase 2/4 (due diligence). Contexte phase 1 : `D-top.md` (D-37, 68/100), lignes D-37/D-38/D-41.

**Méthode et limites.**
- 35 recherches WebSearch, dont environ 12 visant l'invalidation (gratuité, outils en place, contraction du CPF, renoncement des indépendants, suffisance d'un Drive, éditeurs déjà à jour).
- WebFetch est bloqué : Légifrance échoue (ENOTFOUND), et l'API data.gouv / DGEFP renvoie 403. **Le texte du décret n'a PAS été lu.** Toutes les preuves sont des « extraits de recherche ».
- Étiquettes : **[OBS]** fait observé dans un extrait ; **[EST]** estimation ; **[HYP]** hypothèse ; **[INC]** inconnu.
- Biais de source majeur découvert : **Certiforma**, première source SEO sur Qualiopi et source de plusieurs chiffres de phase 1, appartient au fondateur de **Formiva**, logiciel concurrent avec plan gratuit [OBS, extrait hunted.space / Capterra]. Ses comparatifs de prix ne sont donc pas neutres.

---

### 0. Vérification réglementaire (ce qui change vraiment)

| Point | Constat | Statut |
|---|---|---|
| Texte | Décret n° 2026-728 du 1er août 2026, publié au JO du 4/8/2026 (JORF n° 0180, texte n° 11). NOR **TRSD2619632D** selon une source, TRSD2609875D selon une autre (coquille probable). Lien Légifrance cité par une source : JORFTEXT000054608509 | [OBS] secondaire concordant (Certiforma, CNFCE, Lefebvre Dalloz, Lexisveille, Akto, Weblex). Légifrance non lu |
| Entrée en vigueur | **1/11/2026**. Jusqu'au 31/10/2026, le référentiel du décret 2019-565 (32 indicateurs) s'applique. À partir du 1/11, tout audit porte sur le nouveau référentiel, quelle que soit la date du contrat de certification | [OBS] Certiforma |
| Structure | 7 critères inchangés ; **32 → 33 indicateurs** | [OBS] concordant |
| Indicateurs modifiés | Le décompte **diverge** : 11 (Certiforma, autre page), 12 (Lexisveille ; liste Certiforma : 1, 2, 3, 7, 12, 14, 15, 19, 20, 27, 30, 32), 13 dont 2 de forme seulement (Schoolmaker) | [OBS] divergent |
| Indicateur 33 | Nouveau, **réservé aux CFA** : les apprentis évaluent contenus et pédagogie, séparément de la satisfaction | [OBS] |
| Indicateur 2 | Publier le taux de satisfaction ou de résultat **et sa méthode de calcul** | [OBS] Schoolmaker |
| Critère 3 (12, 14, 15) | Nouvelle obligation de **prévention des violences** | [OBS] CNFCE, Certiforma |
| Indicateur 19 | **Vérifier l'effectivité** de la formation à distance (lien direct avec l'anti-fraude) | [OBS] Schoolmaker, CNFCE |
| Indicateur 27 | Sous-traitance précisée ou renforcée. Contenu exact non trouvé | [OBS] partiel |
| Textes encore attendus | 2 arrêtés fixant des seuils pour les indicateurs 19 et 20 ; **guide de lecture v10** (en vigueur : v9 du 8/1/2024). C'est le guide qui définit les **preuves recevables** | [OBS] Certiforma (sept. 2026), CNFCE. Publication depuis : [INC] |
| Périmètre | Les OF « actions de formation », bilans de compétences et VAE restent sur 32 indicateurs, l'indicateur 33 ne les concernant pas | [OBS] extrait |
| Loi anti-fraude | Loi n° 2026-534 du 25/6/2026 (JO du 26/6), volet formation en vigueur au 27/6/2026 (sauf art. 59-II, transparence des prestataires). Effets décrits : présence obligatoire du titulaire CPF aux épreuves de certification (remboursement en cas d'absence), sous-traitance encadrée et déclarée, amendes administratives. Contrôles renforcés en Île-de-France (circulaire DGEFP du 17/2/2026) | [OBS] Centre Inffo, Certiforma, cpformation |

**Corrections par rapport à la phase 1.**
- « Évaluation des acquis distincte de la satisfaction » ne vaut que pour l'**indicateur 33 (CFA)**. Pour un formateur indépendant, les vrais changements sont :
  - méthode de calcul publiée (indicateur 2) ;
  - prévention des violences (12, 14, 15) ;
  - effectivité du distanciel (19) ;
  - sous-traitance (27).
- Le référentiel change **à la marge** (environ 1/3 des indicateurs), pas une refonte. C'est donc une **mise à jour**, pas une re-certification.
- Les preuves recevables ne seront fixées qu'avec le guide de lecture v10, pas encore publié à la date des sources.

---

### 1. ICP, rôles, objections, contexte d'achat

- **ICP** : formateur indépendant (micro-entrepreneur, EURL ou SASU) ou OF de 1 à 10 personnes. Il est **déjà certifié Qualiopi** pour les actions de formation et tire au moins 30 % de son CA de financements CPF, OPCO, France Travail ou FAFCEA [HYP sur le seuil]. Il fait 10 à 100 sessions par an et un peu de distanciel.
  - Sous-segment prioritaire : l'OF de 2 à 10 personnes qui **sous-traite** à des formateurs freelances (indicateur 27 et loi anti-fraude).
- **Utilisateur** : le dirigeant-formateur lui-même. Dans les OF de 3 à 10 personnes, l'assistante administrative ou le référent qualité.
- **Prescripteurs** : consultants Qualiopi (900 à 3 500 € HT par mission [OBS]), syndicats (SYCFI, qui organise des webinaires Qualiopi [OBS]), experts-comptables, plateformes de portage. Les certificateurs (38 accrédités [OBS]) sont tenus à l'impartialité et ne prescrivent pas d'outil [HYP].
- **Décideur économique** : le même dirigeant, qui paie sur sa carte bancaire.
- **Sponsor** : l'éventuel consultant qualité, qui peut aussi se sentir menacé.
- **Objections attendues** :
  1. « J'ai déjà Digiforma, Qualiobee ou Formiva » (ou un Drive qui a passé l'audit) ;
  2. « Mon audit de surveillance est dans 14 mois » ;
  3. « Le CPF s'effondre, je réduis mes coûts » ;
  4. « Mon consultant m'a donné ses modèles » ;
  5. « Un abonnement de plus ».
- **Contexte d'achat** : déclenché par un **événement**, à savoir une date d'audit fixée (surveillance entre 14 et 22 mois après l'initial [OBS, Centre Inffo 2026], renouvellement à 3 ans), une non-conformité à lever (3 mois pour une majeure [OBS]), ou un changement réglementaire. Hors de ces moments, la priorité est faible.

### 2. Job-to-be-Done et workflow actuel

**JTBD** : « Quand mon audit approche, ou quand une règle change, je veux être sûr que chaque indicateur applicable a une preuve récente, datée et retrouvable. Je ne veux ni perdre ma certification, ni payer un consultant, ni passer mes soirées à reconstituer des dossiers. »

**Workflow actuel (HYP étayée par les guides [OBS Keobiz, Certiforma])** :
1. **Avant la session** : programme, prérequis, positionnement, convention, CGV, accessibilité handicap (indicateur 26, jugé exigeant par les auditeurs [OBS]).
2. **Pendant** : émargement par demi-journée (papier, Edusign ou SoWeSign) ; en distanciel, traces de connexion ; évaluation des acquis.
3. **Après** : certificat de réalisation (obligatoire depuis 2020 [OBS]), questionnaires de satisfaction à chaud et à froid, calcul et publication des taux (désormais **avec la méthode**), traitement des réclamations, saisie EDOF / Kairos.
4. **En continu** : veille légale, métier et pédagogique (indicateurs 23 à 25), développement des compétences du formateur, sous-traitants (contrats, CV, preuves).
5. **Une fois par an** : BPF entre le 1/4 et le 31/5 (la déclaration d'activité devient caduque si le BPF n'est pas transmis [OBS phase 1]).
6. **Avant l'audit** : rangement dans un Drive en 7 dossiers par critère et 32/33 sous-dossiers (méthode recommandée [OBS Certiforma]), audit blanc éventuel (500 à 1 000 € la journée [OBS culture-rh]).

**Pourquoi c'est douloureux** : les preuves sont dispersées entre Drive, e-mails, LMS et tableur [OBS plateya]. Elles sont rétroactives : on ne recrée pas une feuille d'émargement. La préparation est « la phase la plus longue et la plus exigeante » [OBS Keobiz]. Des indépendants renoncent à Qualiopi pour cause de « lourdeur administrative » [OBS, question écrite AN QE8034].

**Fréquence** : la collecte suit chaque session (hebdomadaire à mensuelle) ; l'audit revient environ tous les 18 mois ; la réforme est **ponctuelle**.

### 3. Coût de l'inaction

Formule (par OF et par an) :
`CI = P(perte ou suspension) × CA_financé × durée_interruption + H_prép × taux_horaire + coût_consultant_évitable + coût_audit_complémentaire`

| Variable | Valeur | Étiquette |
|---|---|---|
| CA annuel financé (CPF, OPCO, FT) d'un indépendant certifié | 30 000 à 80 000 € | [HYP] |
| P(NC majeure non levée ou perte) par cycle | 2 à 5 % | [HYP]. Seul repère : 70 % certifiés d'emblée et 30 % avec NC corrigées, échantillon ancien de 1 500 audits [OBS, Centre Inffo, vers 2021] |
| Interruption en cas de perte | 3 à 6 mois de CA financé | [HYP] |
| Heures de préparation par audit | 20 à 40 h | [HYP] |
| Taux horaire de référence d'un formateur | 50 à 100 €/h | [HYP] |
| Consultant Qualiopi | 900 à 3 500 € HT par mission ; 600 à 1 200 €/jour | [OBS] culture-rh, Certiforma |
| Audit complémentaire en cas de NC majeure | [INC] | — |

Exemple central (par an, audit tous les 18 mois) :
- risque : 3 % × 50 000 € × 0,4 an ≈ **600 €** ;
- temps : 30 h × 70 € / 1,5 ≈ **1 400 €** ;
- consultant évité (1 500 € par cycle) ≈ **1 000 €/an**.

**CI ≈ 3 000 €/an [EST]**. Le chiffre est surtout porté par le temps et le consultant, pas par le risque de retrait. La douleur est donc **réelle mais diffuse**, et le prix plafond se situe autour de 30 à 60 €/mois [EST].

### 4. Concurrents (détail dans `DD-D37-concurrents.csv`)

| Catégorie | Acteurs | Prix observé | Limite pour l'ICP |
|---|---|---|---|
| Logiciel d'OF généraliste | Digiforma | Indep : 49 € HT/mois (engagement annuel), 59 € sans engagement, 200 apprenants/an [OBS, 2 sources tierces 2026] | Couvre déjà Qualiopi, BPF et émargement. Concurrent direct principal |
| | Dendreo | 225 à 992 € HT/mois [OBS tiers] | Surdimensionné pour un indépendant |
| | SmartOF | 75 à 449 € HT/mois [OBS tiers] | Milieu de gamme |
| Logiciel « Qualiopi » léger | Qualiobee (Beehelp) | Selon le nombre d'apprenants ; essai de 14 jours ; montant [INC] | Préparation automatique de l'audit, tableau des indicateurs : **le même pitch** |
| | Formiva | **Plan gratuit** sans carte bancaire [OBS] ; 39 et 99 € HT selon la phase 1 (source Certiforma = même fondateur) | Suivi des indicateurs du RNQ et centralisation des preuves : **pitch identique, gratuit** |
| | Teetche | Environ 49 €/mois [OBS partiel, comparatif avril 2026] | Peu documenté |
| Émargement | Edusign | Freelancer : 39 €/mois pour 200 émargements, puis 0,50 € par signature [OBS tiers BDM + grille Edusign] | Couvre la preuve de réalisation, pas tout le référentiel |
| | SoWeSign | Sur devis [OBS] | Idem |
| Outils publics gratuits | EDOF (CDC), Kairos (France Travail) | Gratuits, obligatoires | Saisie d'assiduité ; pas de dossier d'audit |
| Kits et modèles | Certiforma | **A arrêté de vendre son kit** ; 11 modèles **gratuits** [OBS] | Signal que le kit statique ne se vend plus |
| | Pack autonome | 790 € ; accompagné 1 790 € HT [OBS] | — |
| | Kits ComeUp | [INC] | — |
| | Kit Excel/Notion à 50-300 € | **Aucun prix observé** | La fourchette de la consigne reste non vérifiée |
| Prestataires | Consultants Qualiopi | 900 à 3 500 € HT ; 600 à 1 200 €/jour [OBS] | Récurrence faible ; prescripteurs potentiels |
| | Audit blanc | 500 à 1 000 € la journée [OBS] | — |
| Émergents | « Le Portail des Formateurs » (présenté par le SYCFI le 4/11/2026) | [INC] | Centralise la conformité Qualiopi des **sous-traitants** : occupe le wedge D-41 |
| | Tensoria (« dossier de preuve Qualiopi IA ») ; Kolonell (logiciel sur mesure) | [INC] | Montre l'arrivée de l'angle IA |
| Substituts | Drive + tableur organisé par critère | 0 € | **Rien n'impose un logiciel** : « l'auditeur évalue vos pratiques réelles » [OBS plateya] |
| | Portage ou sous-traitance par un OF certifié | 30 à 60 % du CA [OBS, question AN] | Évite Qualiopi |

**Plaintes observées** : lourdeur administrative et coût, d'où un renoncement (question AN) ; exigences jugées démesurées sur l'indicateur 26 ; hétérogénéité des auditeurs [OBS Centre Inffo]. **Aucune plainte trouvée visant spécifiquement les logiciels existants** [INC : forums et groupes non accessibles].

### 5. Différenciation (wedge)

La gestion d'OF généraliste ou le « tableau des indicateurs » est **déjà pris**, y compris gratuitement (Formiva). Trois wedges restent défendables, par ordre de préférence :
1. **« Preuves de réalisation opposables + sous-traitance »**. Sur une session, l'outil génère les liens de signature des apprenants **et** du formateur sous-traitant (contrat, CV, attestation de veille, déclaration de sous-traitance), les traces de connexion distancielles (indicateur 19) et le certificat de réalisation. Il exporte un **dossier de contrôle** prêt pour un contrôle CDC ou DGEFP, pas seulement pour l'audit Qualiopi. Raison de changer : la loi anti-fraude du 25/6/2026 rend le donneur d'ordre responsable de ses sous-traitants [OBS].
2. **« Diff V9 → V10 en 15 minutes »**. On importe son Drive existant, le moteur (LLM) classe les pièces par indicateur, signale celles qui manquent pour les indicateurs 2, 12, 14, 15, 19 et 27, puis génère les procédures manquantes (méthode de calcul publiée, procédure de prévention des violences). Time-to-value inférieur à 1 heure. **Limite** : produit ponctuel, faible rétention.
3. **Score de préparation à l'audit**, avec des alertes datées (surveillance 14 à 22 mois, BPF le 31/5, questionnaire à froid).

ROI mesurable : heures de préparation évitées et consultant évité. **Pas encore mesuré** [INC].

### 6. Taille de marché (bottom-up)

| Étape | Valeur | Statut |
|---|---|---|
| OF sur la Liste publique (data.gouv) | 152 357 au 20/10/2026 | [OBS extrait docteurcertif ; non vérifié sur le fichier] |
| … dont certifiés Qualiopi (au moins une catégorie) | **45 665** au 20/10/2026 ; 42 892 sur 132 237 au 1/1/2025 ; « 46 000 sur 148 000 » (réutilisation data.gouv) | [OBS] concordant |
| Part des certifiés qui comptent 1 à 10 personnes | 60 à 80 % | [HYP] : pas de répartition par taille trouvée (les séries DARES et BPF par taille ne sont pas disponibles en ligne dans les extraits) |
| Acheteurs potentiels (SAM) | **27 000 à 36 000** | [EST] |
| Part sans logiciel spécialisé | 40 à 60 % | [HYP] |
| Prix moyen | 25 à 40 €/mois, soit 300 à 480 €/an | [EST] |
| **TAM** (tous les certifiés × 400 €) | environ 18 M€/an | [EST] |
| **SAM** (1-10 personnes, 27 000 à 36 000 × 300-480 €) | 8 à 17 M€/an | [EST] |
| **SOM à 3 ans** (1 à 3 % du SAM) | 300 à 1 000 clients, soit **0,1 à 0,45 M€ d'ARR** | [EST] |

**Vents contraires sur le volume** :
- Formations CPF en 2025 : 1,22 M, **soit -11 %** par rapport à 2024 [OBS, DARES juillet 2026, via presse].
- Reste à charge de **150 €** depuis le 2/4/2026, contre 103,20 € début 2026 [OBS culture-rh].
- Plafonds fixés par le décret du 25/2/2026 : Répertoire spécifique 1 500 €, bilans 1 600 €, permis 900 € ; objectif de 250 M€ d'économies [OBS, presse].
- Le PLF 2026 visait l'exclusion des bilans de compétences [OBS, projet].

La niche RS (langues, bureautique, IA), cœur des petits OF, est la plus touchée. Contrepoints :
- OPCO, France Travail et FAFCEA (Qualiopi exigé depuis le 1/7/2026 [OBS]) restent des financeurs.
- Le nombre d'OF certifiés **augmente** (42 892 → 45 665 en environ 21 mois) malgré la baisse du CPF.

### 7. Pricing recommandé

- **Recommandé : Solo à 29 € HT/mois, ou 290 €/an.**
  - Contenu : 1 formateur, sessions illimitées, émargement inclus jusqu'à 300 signatures/mois, dossier d'audit et de contrôle, diff V10.
  - Positionnement : sous Digiforma Indep (49 €), proche d'Edusign Freelancer (39 €), mais le produit couvre émargement + Qualiopi.
  - Signataire : le dirigeant.
  - **Équipe à 59 € HT/mois** : jusqu'à 10 utilisateurs et 10 sous-traitants.
- **Alternative A : « Pack audit » ponctuel à 149 à 249 €**. Diff V10 + dossier d'audit généré + 3 mois d'accès. Il capte le pic d'avant-audit et se substitue au kit à 790 € et à l'audit blanc. Revenu non récurrent.
- **Alternative B : licence pour consultants Qualiopi, 99 à 199 €/mois pour 10 à 30 clients**. Le consultant devient le canal (B2B2B). Risque : un petit nombre de gros comptes.
- **Exemple de ROI** (Solo, 290 €/an) : 15 h de préparation évitées × 70 €/h, soit 1 050 € ; audit blanc évité, environ 600 € ; ROI ≈ **5,7×** [EST/HYP]. La comparaison est défavorable face à Formiva gratuit si l'utilisateur n'a besoin que du tableau des indicateurs.

### 8. Intrants du modèle économique

| Intrant | Valeur | Statut |
|---|---|---|
| ARPA | 25 à 40 €/mois | [EST] |
| COGS IA (classement de pièces, génération de procédures) | 0,3 à 1,5 €/client/mois | [EST] |
| Signatures / horodatage (eIDAS simple ou maison) | 0 à 1 €/mois (maison) ; prestataire tiers [INC] | [EST] |
| Hébergement (Supabase + stockage de fichiers, environ 1 à 5 Go par client) | 0,5 à 2 €/client/mois | [EST] |
| Support | 1 à 3 €/client/mois (forte demande pendant les périodes d'audit) | [HYP] |
| Onboarding | self-serve + import de Drive ; 0 à 30 min humaines | [HYP] |
| **Marge brute** | 80 à 88 % | [EST] |
| CAC | 80 à 250 € (SEO saturé ; partenariats avec consultants et syndicats ; e-mailing sur la liste publique) | [HYP] |
| Cycle de vente | de quelques jours à 3 semaines, déclenché par une date d'audit | [HYP] |
| Churn | 2 à 4 % par mois ; pic après l'audit | [HYP] |
| Payback | 3 à 9 mois | [EST] |

### 9. Risques

- **Réglementaire**
  - Les arrêtés (seuils des indicateurs 19 et 20) et le guide de lecture v10 ne sont pas publiés [OBS sept. 2026] : le produit dépend d'un texte qui peut encore bouger.
  - Le décret est en vigueur, donc **pas de risque de report**.
  - Le CPF continue de se contracter.
  - Extension de Qualiopi aux formations certifiantes : projet de loi non promulgué [OBS].
- **Responsabilité** : promettre la « conformité » expose à une mise en cause si l'audit échoue. Il faut parler d'« aide à la préparation » et suivre une check-list issue du guide officiel.
- **RGPD** : données d'apprenants (nom, présence, évaluations, parfois situation de handicap pour l'indicateur 26, soit des données sensibles). Il faut un DPA, un hébergement UE et une politique de conservation.
- **Valeur probante** : la valeur juridique des signatures électroniques maison face à un contrôle CDC ou DGEFP est [INC]. Edusign revendique l'acceptation de ses documents par les financeurs [OBS, brochure].
- **Fiabilité de l'IA** : un classement erroné de pièces ou une procédure générée hors sol serait vu par l'auditeur (« pratiques réelles »). Revue humaine indispensable.
- **Plateformes** : EDOF et Kairos n'ont pas d'API publique connue pour un tiers [INC]. Toute double saisie reste manuelle.
- **Réaction des éditeurs** : Digiforma, Qualiobee et Formiva mettront à jour leurs grilles V10 ; aucune annonce n'a été trouvée [INC]. Leurs clients ne changeront pas pour une simple mise à jour.

### 10. Distribution

- **Canal 1 : liste publique des OF (data.gouv, quotidienne, CSV)**, filtrée sur les certifiés « actions de formation ».
  - La liste donne raison sociale, SIREN et adresse [OBS], mais **pas d'e-mail** [HYP] : il faut enrichir via le site web ou LinkedIn.
  - Prospection B2B par e-mail légale (intérêt légitime, opt-out), mais à volume modéré.
  - Message : « Votre prochain audit Qualiopi se fera sur le référentiel du 1er novembre (décret 2026-728). Cinq indicateurs vous concernent directement (2, 12, 14, 15, 19). Diagnostic gratuit en 10 minutes à partir de votre Drive. »
- **Canal 2 : consultants Qualiopi et syndicats.**
  - SYCFI : webinaires payants ou gratuits via HelloAsso [OBS], soit un modèle « co-webinaire ».
  - Consultants freelances sur Malt et LinkedIn : programme partenaire (licence pour consultants, cf. §7).
- **Canal 3 (SEO)** : saturé par Certiforma, cpformation, culture-rh et Digi-Certif, souvent adossés à des éditeurs. Ce canal est **lent** et n'est pas prioritaire.
- **Communautés** : aucun groupe Facebook ou LinkedIn identifiable dans les extraits [INC]. À vérifier manuellement (recherche Facebook « formateurs indépendants », « Qualiopi entraide »).
- **10 conversations acheteurs**
  1. Extraire 200 certifiés « actions de formation » de 1 à 10 personnes dans 2 régions.
  2. Envoyer un « diagnostic V10 » gratuit et personnalisé (PDF généré) à 100 d'entre eux.
  3. Viser 10 % de réponses.
  4. En parallèle, proposer à 5 consultants Qualiopi un outil gratuit pour leurs clients en échange d'interviews.
- **Premières ventes sans audience** : vendre le « Pack audit » à 149 € aux OF dont l'audit de surveillance tombe dans les 3 mois (question posée en appel découverte). Cible : 5 précommandes avant de développer le récurrent.
- **Faisabilité pour le profil** : marché francophone, acheteurs solo, paiement par carte. Cohérent avec la stack Relanzio (Node, Supabase, Stripe, Brevo), donc **bonne**.

### 11. Faisabilité MVP

- **Architecture** : Next/Node + Supabase (auth, Postgres, stockage) + Stripe + Brevo.
  - Modèle : référentiel (33 indicateurs × applicabilité par catégorie) → sessions → pièces (fichier, date, source, indicateur).
  - Émargement : lien signé + horodatage + IP + journal d'audit inaltérable (hash chaîné).
  - Import Google Drive (OAuth) et classement des pièces par LLM avec validation humaine.
  - Générateur de procédures (prévention des violences, méthode de calcul).
  - Export PDF/ZIP « dossier d'audit » et « dossier de contrôle ».
- **Intégrations indispensables** : Google Drive (ou upload), signature et e-mail, formulaires de satisfaction (natifs). EDOF et Kairos : non indispensables, saisie manuelle.
- **Briques réutilisables** : relances Brevo de Relanzio (questionnaires à froid, signatures manquantes), Stripe.
- **Partie difficile** :
  1. Contenu réglementaire exact et maintenu, avec une dépendance au guide v10.
  2. Valeur probante de l'émargement.
  3. Gestion fine de l'applicabilité des indicateurs (bilan, VAE, CFA, distanciel, sous-traitance).
- **Coût et délai** : 6 à 10 semaines pour une personne. Budget hors salaire de 300 à 1 500 € (juriste RGPD ou CGV ponctuel, LLM, hébergement) [EST].
- **Dépendances critiques** : publication du guide v10 et des arrêtés ; relecture par un consultant ou un ex-auditeur Qualiopi (à recruter comme partenaire).

### 12. Défendabilité à 2 ans

- **Faible.**
  - Un LLM généraliste produit déjà des procédures et des check-lists Qualiopi.
  - Digiforma et Qualiobee intègrent la V10 par simple mise à jour.
  - Formiva est gratuit.
  - Le « kit » est commoditisé : Certiforma a arrêté de le vendre et le donne.
- **Ce qui retient le client** : l'historique des preuves (horodatées, rétroactivement impossibles à recréer), les signatures et le journal d'audit, le réseau de sous-traitants rattachés. C'est un **coût de changement par accumulation de données**, réel mais modeste.
- **Moat possible** : la relation avec les consultants prescripteurs, et une base de « motifs de NC observés » collectée auprès des utilisateurs. Celle-ci n'existe pas publiquement : aucune statistique de NC par indicateur n'a été trouvée [OBS d'absence].

### 13. Raisons de NE PAS le faire, et expériences d'invalidation

**Raisons de ne pas le faire**
1. Lacune faible : Formiva (gratuit), Qualiobee et Digiforma (49 €) vendent déjà « suivi des indicateurs + preuves + préparation d'audit ».
2. Marché sous pression : CPF -11 % en 2025, reste à charge à 150 €, plafonds sur le RS. Des indépendants renoncent à Qualiopi ou passent par le portage.
3. La réforme est incrémentale (environ 12 indicateurs) et déjà en vigueur. Le pic de demande « avant le 1/11 » est passé ; le levier restant est l'étalement des audits sur 18 à 36 mois.
4. Rien n'impose un logiciel : un Drive bien rangé passe l'audit.
5. Douleur payée surtout au moment de l'audit, d'où un churn post-audit probable.
6. Défendabilité faible face aux LLM et aux éditeurs.

**Expériences qui invalideraient l'idée (avant tout code)**
- E1. 15 appels à des formateurs certifiés tirés de la liste publique : si moins de 4 sur 15 déclarent un audit dans les 9 mois **et** l'absence de logiciel, **STOP**.
- E2. Landing « Diagnostic V10 » + 300 e-mails : si le taux de demande de diagnostic est inférieur à 3 %, **STOP**.
- E3. Offre « Pack audit » à 149 € : si moins de 3 précommandes sur 30 diagnostics livrés, **STOP**.
- E4. Tester 1 heure Formiva (gratuit) et Qualiobee (essai de 14 jours) : si les deux couvrent déjà diff V10 + émargement + dossier exportable, abandonner le wedge 2 et ne garder que le wedge 1 (sous-traitance et contrôle).
- E5. Demander à 2 certificateurs ou ex-auditeurs quelles preuves de l'indicateur 19 ils accepteront : si « tout export LMS suffit », le wedge distanciel s'effondre.

### 14. Re-notation

Note sur 10 par critère, convertie au poids de la grille.

| Critère (poids) | Phase 1 (pts) | Note DD /10 | Pts DD | Cause du changement |
|---|---|---|---|---|
| Douleur & budget (20) | 13 | 6 | 12 | Coût de l'inaction modéré (environ 3 000 €/an, porté par le temps) ; budget sous pression du CPF ; certains renoncent plutôt que de s'outiller |
| Fréquence (10) | 8 | 7 | 7 | Collecte par session, mais achat déclenché par l'audit (environ 18 mois) ; réforme ponctuelle |
| Preuves (15) | 8 | 6 | 9 | + Décret confirmé (date, JO, 33 indicateurs) par plus de 5 sources dont Lefebvre Dalloz et Lexisveille ; loi anti-fraude 2026-534 ; 45 665 certifiés. − Légifrance non lu ; aucune preuve de volonté de payer ; sources souvent intéressées (Certiforma = Formiva) |
| Distribution (15) | 11 | 7 | 10,5 | Liste publique exploitable mais sans e-mails ; SEO saturé ; communautés non localisées ; consultants et SYCFI comme relais plausibles |
| Lacune (10) | 5 | 3 | 3 | Formiva gratuit au même pitch ; Qualiobee ; Digiforma à 49 € ; kits devenus gratuits ; le Portail des Formateurs (SYCFI) occupe déjà la sous-traitance |
| Faisabilité MVP (10) | 8 | 8 | 8 | Inchangée ; stack Relanzio réutilisable |
| Marge (5) | 4 | 8 | 4 | Inchangée |
| Timing (5) | 5 | 8 | 4 | En vigueur au 1/11/2026, donc pas de report ; mais le pic « avant le 1/11 » est passé et le guide v10 n'est pas encore là |
| Défendabilité (5) | 2 | 3 | 1,5 | Commoditisation par les LLM et les éditeurs ; rétention par les données seulement |
| Risques (5) | 4 | 7 | 3,5 | Contraction du CPF ; responsabilité « conformité » ; RGPD (handicap) |
| **Total** | **68** | | **62,5/100** | |

**Verdict** : 62,5/100, en baisse. Le catalyseur est réel et vérifié, mais la lacune est faible (Formiva gratuit, Qualiobee, Digiforma). À ne poursuivre que sur le wedge « preuves de réalisation opposables + sous-traitance (loi anti-fraude) », après les expériences E1 à E3.

---

## DD-D20 — Relance des impayés B2B branchée sur le cycle de vie de la facture électronique (TPE de services, FR)

Fusion : D-20 (relance des impayés), D-09 (statut « encaissée » et e-reporting des paiements), D-08 (canal cabinets comptables). Adjacence : E-13 / Relanzio (relance de devis).
Date : 2026-10-29. Phase 2/4.

**Méthode.** 33 recherches WebSearch, dont 14 visaient l'invalidation : gratuité, fonction déjà intégrée par les PA, les banques et les logiciels de facturation, report, API fermées. WebFetch est bloqué (`www.impots.gouv.fr` ne se résout pas). Aucune page n'a donc été lue en entier : toutes les preuves sont des **extraits de recherche**. Les prix viennent d'agrégateurs ou de comparatifs, sauf mention contraire. Aucune page tarifaire officielle n'a été lue. Les preuves sont référencées `P01`…`P35` (fichier `DD-D20-preuves.csv`, identifiants `DD-D20-Pxx`).

Étiquettes : **[OBS]** fait observé dans un extrait ; **[EST]** estimation ; **[HYP]** hypothèse ; **[INC]** inconnu.

---

## Verdict d'abord

- **Note : 56/100.** Phase 1 : 68. La baisse tient à la lacune, à la distribution et à la défendabilité.
- **La douleur est réelle et bien documentée** :
  - 13 Md€ de trésorerie manquent aux TPE/PME [OBS P01] ;
  - le risque de défaillance augmente de 25 % [OBS P04] ;
  - on compte 72 000 défaillances sur 12 mois, un record [OBS P05].
- **Le « crochet » réglementaire existe, mais il appartient aux Plateformes Agréées (PA).** Le statut « encaissée » doit être *émis via sa PA* [OBS P07, P08]. Les PA les plus utilisées par les TPE fournissent toutes, gratuitement ou pour moins de 25 €/mois, le suivi des paiements et souvent la relance automatique : Pennylane, Tiime, Qonto, Indy, Abby, Axonaut, Sellsy, les banques et Jefacture [OBS P13 à P19].
- **Conséquence : un outil tiers ne peut pas posséder le cycle de vie.** Il ne fait que le lire, quand l'API le permet [OBS P24, P27].
- **Pour Relanzio, l'extension devis → facture → encaissement est un piège en tant que produit autonome**, car le marché est saturé et la fonction commoditisée. **Elle reste un avantage modeste en tant que fonction ajoutée** à Relanzio pour ses propres clients artisans : moteur de relance déjà construit, même ICP, panier relevé de 10 à 15 €/mois [HYP]. Voir §5 et §13.

---

### 1. ICP, acteurs et contexte d'achat

| Rôle | Qui | Statut |
|---|---|---|
| **ICP** | TPE de services B2B de 1 à 20 personnes, en France : BTP second œuvre qui facture des professionnels, conseil, agences, maintenance, nettoyage, sous-traitance. Elle a au moins 20 factures par mois et des clients PME, ETI ou grands comptes. Elle n'a ni service de recouvrement ni DAF. Elle est soumise à la TVA sur les encaissements, le régime par défaut des prestations de services. | [EST] |
| Utilisateur | Le dirigeant, ou le ou la conjoint(e) ou l'assistante administrative | [HYP] |
| Prescripteur | L'expert-comptable, qui choisit ou recommande souvent la PA : Jefacture revendique 4 000 cabinets [OBS P18], Pennylane 2 000 cabinets partenaires [OBS P24]. Également la banque, qui intègre une PA [OBS P17]. | OBS/HYP |
| Décideur économique | Le dirigeant | [HYP] |
| Sponsor | L'assistante (gain de temps) ou le comptable (moins de relances à faire, rapprochement plus propre) | [HYP] |

**Objections attendues :**
1. « Mon logiciel de facturation ou ma banque le fait déjà » : c'est vrai pour Pennylane, Axonaut, Sellsy, Abby Pro et Qonto [OBS P14 à P16, P19].
2. « Je ne veux pas froisser mes clients » : la PPL Rietmann note que les petits fournisseurs renoncent aux pénalités par crainte de perdre des clients [OBS P34].
3. « Encore un abonnement. »
4. « Mon comptable a choisi la PA. »

**Contexte d'achat :**
- Achat en libre-service, entre 15 et 40 €/mois [EST].
- Il se déclenche lors d'une crise de trésorerie ou lors du choix de PA avant le 1/9/2027 [HYP].
- **Risque principal : le choix d'outil est verrouillé au moment du choix de PA**, aujourd'hui pour la réception, en 2027 pour l'émission. Les acteurs qui ont gagné le choix de PA deviennent alors le cockpit par défaut.

### 2. Job-to-be-Done et workflow actuel

**JTBD.** « Être payé à l'échéance sans y passer mes soirées ni abîmer la relation client, et, à partir de septembre 2027, déclarer correctement les encaissements de mes prestations de services. »

**Workflow actuel** [HYP, non observé en entretien] :
1. Le dirigeant émet la facture dans un logiciel ou dans Word.
2. Il ne fait aucun suivi formel de l'échéance.
3. En fin de mois, lui ou le comptable fait le rapprochement bancaire et repère les retards.
4. Il relance par e-mail ou par téléphone, de façon irrégulière, avec un ton gêné.
5. Il ne réclame presque jamais l'indemnité de 40 € ni les pénalités [OBS P34 indirect].
6. Au-delà de 60 à 90 jours, il passe par une mise en demeure, un cabinet de recouvrement ou une injonction de payer.

**Pourquoi c'est douloureux :**
- trésorerie tendue ;
- tâche désagréable et toujours repoussée ;
- dépendance à quelques gros clients qui paient tard : 24 % seulement des factures des ETI et grandes entreprises sont payées à l'échéance [OBS P03].

**Nouveau à partir de septembre 2027** [OBS P07, P09] : chaque paiement d'une prestation de services soumise à la TVA sur les encaissements doit produire un statut « encaissée », avec la date et le montant par taux. Il doit être transmis via la PA au plus tard à la fin de la période d'e-reporting, par exemple le 10 du mois suivant au réel normal.

**Fréquence.** Hebdomadaire pour la relance, mensuelle pour l'e-reporting.

### Vérification demandée : quels statuts sont obligatoires ?

- **Quatre statuts sont obligatoires** et remontent au concentrateur du PPF : **Déposée, Rejetée, Refusée, Encaissée** [OBS P06]. Ce point est concordant entre Tiime, Hayot, Abby, Quadient et FNFE, mais aucune source primaire DGFiP n'a été lue.
- **« Encaissée » n'est obligatoire que si la TVA est exigible à l'encaissement** : prestations de services sans option pour les débits, et **toutes les factures d'acompte**, y compris sur des biens [OBS P06, P07]. Selon une source commerciale isolée, l'article 123 de la LF 2026 aurait élargi le champ [OBS-faible P10].
- **Données transmises** : numéro de facture, date de paiement, montant encaissé ventilé par taux [OBS P08, page DGFiP].
- **L'omission est un manquement déclaratif** [OBS P07, Legifiscal]. Le montant de l'amende n'a pas été vérifié ici [INC].
- **Pour la cible**, l'émission de factures et l'e-reporting des TPE/PME commencent le **1/9/2027** [OBS P09]. Un report d'un trimestre au plus, jusqu'au 1/12/2027, est évoqué par amendement, sans adoption trouvée [OBS P35]. Aucun report ni suspension général n'a été trouvé au 29/10/2026.
- **Points INCONNUS** :
  - la fréquence exacte pour la franchise en base (bimestrielle selon une seule source, P09) ;
  - le texte du BOFiP ;
  - le montant de l'amende.

### 3. Coût de l'inaction

Formule (par TPE et par an) :

`C = (CA_B2B × j_retard / 365) × taux_financement + h_relance × 52 × coût_horaire + CA_B2B × taux_irrécouvrable + R_conformité`

| Variable | Valeur | Étiquette |
|---|---|---|
| CA_B2B | 600 000 € | [HYP] (TPE de services de 5 à 8 personnes) |
| j_retard | 13 à 18 jours de retard moyen | [OBS P02 (13,4 j), P03 (17,99 j)] — moyennes nationales, pas propres à la cible |
| taux_financement (découvert ou coût d'opportunité) | 6 % | [HYP] |
| h_relance | 1,5 h par semaine | [HYP] |
| coût_horaire chargé du dirigeant ou de l'assistante | 40 € | [HYP] |
| taux_irrécouvrable | 0,5 % du CA | [HYP] |
| R_conformité (statut « encaissée » oublié) | inconnu | [INC] (amende non vérifiée) |

Application :
- Trésorerie immobilisée : 600 000 × 15/365 ≈ **24 700 €**, soit un coût financier d'environ **1 480 €/an**.
- Temps : 1,5 × 52 × 40 = **3 120 €/an**.
- Pertes : **3 000 €/an**.

**Total ≈ 7 600 €/an [EST]**. Le coût le plus *visible* reste la trésorerie bloquée (≈ 25 k€), plutôt que le coût annuel. Un outil ne capte qu'une fraction de cette somme, et **les solutions déjà payées par la TPE (PA, banque) en captent une partie gratuitement**.

### 4. Concurrents (détail : `DD-D20-concurrents.csv`, 25 lignes)

**Directs — relance intégrée à la PA ou à la facturation** [OBS, prix d'agrégateurs] :

| Acteur | Prix observé | Ce qui est inclus | Preuve |
|---|---|---|---|
| Pennylane | 7 €, puis 24 € HT/mois | Relances, rapprochement | P14 |
| Tiime | PA gratuite ; Business 17,99 € HT/mois | — | P13 |
| Axonaut | 69,99 à 97 € HT/mois | Relance devis **et** factures sur 3 niveaux | P15 |
| Sellsy | 29 à 39 € par utilisateur et par mois | — | P15 |
| Abby Pro | dès 15 €/mois | Relance des impayés | P19 |
| Qonto | facturation gratuite | Relances automatiques en option payante (sources contradictoires) | P16 |

**Spécialistes du recouvrement** :

| Acteur | Prix observé | Preuve |
|---|---|---|
| LeanPay | 95 à 225 € HT/mois en TPE, selon la source | P20 |
| Upflow | 400 à 800 $/mois ; plan Discover gratuit | P21 |
| Libeo | 49 et 99 €/mois | P22 |
| Kollekt | dès 235 €/mois | P25 |
| Agicap | sur devis, engagement annuel | P23 |
| Dunforce | inconnu | — |
| Gcollect, RubyPayeur, My DSO Manager, LegalCity | inconnu | P25 |

**Indirects et substituts :**
- Banques : PA gratuites chez BPCE (iPaidThat) et Crédit Mutuel/CIC (HBS) [P17].
- Jefacture.com, la PA de la profession comptable : gratuite, puis 5 € HT/mois [P18].
- Chaintrust : de 5 à 20 € HT par dossier, pour les cabinets [fichier concurrents].
- Indy et Henrri, gratuits.
- Le tableur et la relance manuelle : **c'est le vrai concurrent** [HYP].
- Les cabinets de recouvrement.

**Outil public gratuit de l'État : il n'existe pas.** L'État a renoncé au portail public gratuit le 15/10/2024 ; le PPF n'est qu'un concentrateur et un annuaire [OBS P11]. Une question écrite demande de le réintroduire [OBS P12] : c'est un risque faible mais non nul de commoditisation publique.

**Plaintes et limites relevées :**
- Grilles de prix opaques ou incohérentes (LeanPay, Upflow).
- Engagement annuel (Agicap).
- Chez Pennylane, le statut « payé » n'est **automatique que si le paiement passe par le compte pro Pennylane** ou un export XML ; sinon, la mise à jour est manuelle sur Free et Starter [OBS P26].
- Aucune plainte d'utilisateur TPE n'a été trouvée : WebFetch est bloqué sur les sites d'avis [INC].

### 5. Différenciation

| Piste de wedge | Évaluation |
|---|---|
| a) « Relance + statut encaissée » pour TPE | **Faible.** Le statut est émis par la PA. Les PA-banques (Qonto, BPCE, CIC) voient l'encaissement nativement, et les PA-compta (Pennylane, Tiime) par le rapprochement. Le seul trou observé : le passage en « payé » est manuel chez certaines offres d'entrée de gamme [P26]. C'est une lacune de produit que l'éditeur peut corriger en un sprint [HYP]. |
| b) Relance « devis → facture → encaissement » pour artisans clients de Relanzio | **Moyenne en tant que fonction, faible en tant que produit.** Axonaut, Jobber et Tolteck (tableau de suivi) couvrent déjà les deux [P15, P33]. Le différenciateur possible tient au ton et à la séquence (« relance qui ne froisse pas »), à la lecture des réponses (le module IMAP de Relanzio existe) et au rythme J+2, J+5, J+10. C'est copiable [HYP]. |
| c) Cockpit multi-clients pour cabinets comptables : retards de leurs clients TPE, préparation PA (D-08), statuts « encaissée » manquants avant la date d'e-reporting | **La plus originale**, mais elle dépend de l'accès aux données de 100 à 160 PA différentes [P27, P28]. Pennylane, Tiime et Chaintrust proposent déjà des vues cabinet [HYP]. Les données de paiement ne sont pas exposées par l'API Pennylane selon un connecteur tiers [P24]. |

- **Time-to-value** : moins d'une heure si la TPE importe un CSV ou connecte une API [EST] ; plusieurs jours avec une agrégation bancaire.
- **ROI mesurable** : DSO avant et après, montant encaissé après relance.
- **Raison de changer** : faible, si la PA déjà adoptée fait 80 % du travail [HYP].

### 6. Taille de marché (bottom-up)

| Étape | Valeur | Étiquette |
|---|---|---|
| TPE employeuses de 1 à 9 salariés | ≈ 1,24 M (Dares 2022) | [OBS-secondaire P31] |
| Part du tertiaire | ≈ 75 % → ≈ 930 000 | [OBS-secondaire P31] |
| Part facturant majoritairement du B2B, avec un volume suffisant | 25 à 35 % → **230 000 à 325 000 acheteurs** | [HYP] |
| Prix | 15 à 40 €/mois, soit 180 à 480 €/an | [EST, bornes Abby/Tiime ↔ Libeo] |
| **TAM** | 230 k à 325 k × 180 à 480 € ≈ **41 à 156 M€/an** | [EST] |
| **SAM**, hors TPE déjà équipées d'une PA avec relance intégrée, en hausse forte d'ici septembre 2027 | 15 à 25 % du TAM → **35 000 à 80 000 TPE, soit 6 à 38 M€** | [HYP] |
| **SOM** à 3 ans pour 1 à 3 personnes sans levée | 150 à 500 clients × 300 à 400 €/an ≈ **45 à 200 k€ d'ARR** | [HYP] |

**Canal cabinets.** On compte environ 19 500 sociétés d'expertise comptable [OBS-secondaire P32]. À 30 €/mois par cabinet, ou 3 à 5 € par dossier, sur 1 % de pénétration, cela donne environ 70 à 200 k€ d'ARR [HYP].

### 7. Pricing

| Option | Prix | Qui signe | Commentaire |
|---|---|---|---|
| **Recommandé : module « Relance factures » de Relanzio** | +12 €/mois sur Relanzio Pro (29 €), soit 41 €/mois | Dirigeant artisan déjà client | Le moins risqué : il monétise une base existante. |
| Alternative 1 : produit autonome « relance impayés TPE » | 29 €/mois jusqu'à 100 factures ouvertes | Dirigeant TPE de services | Se bat contre Abby (15 €), Pennylane (7 à 24 €) et la gratuité bancaire. |
| Alternative 2 : licence cabinet | 4 €/dossier/mois, minimum 49 €/mois | Associé du cabinet | Repère Chaintrust de 5 à 20 €/dossier [OBS]. Cycle de vente long. |

**Exemple de ROI (module Relanzio)** [HYP] :
- Un artisan facture 30 000 €/mois à des professionnels.
- La relance systématique réduit son retard moyen de 15 à 8 jours.
- Gain : 30 000 × 12 × 7/365 ≈ **6 900 €** de trésorerie libérée une fois, plus environ 1 h par semaine, soit environ 2 000 €/an.
- Coût : 144 €/an.
- Le ROI est réel, **mais il est souvent déjà obtenu avec l'outil de facturation actuel.**

### 8. Intrants du modèle économique

| Intrant | Valeur | Étiquette |
|---|---|---|
| Prix moyen (ARPA) | 12 €/mois pour le module ; 29 €/mois en autonome | [HYP] |
| COGS d'hébergement | Supabase et serveur déjà payés pour Relanzio : marginal inférieur à 1 €/client/mois | [EST] |
| COGS d'e-mail (Brevo) | Moins de 0,5 €/client/mois pour environ 100 relances par mois | [EST] |
| COGS d'IA (rédaction et classement des réponses) | Moins de 0,3 €/client/mois | [EST] |
| Agrégation bancaire DSP2, si l'on veut détecter l'encaissement | Prix inconnu : prestataire AISP nécessaire, aucun prix trouvé | [INC] |
| Support et onboarding | 30 à 60 min par client | [HYP] |
| CAC | Module : environ 0 € (vente additionnelle). Autonome : 150 à 400 € (SEO, prospection, partenariats) | [HYP] |
| Cycle de vente | TPE : de quelques jours à 2 semaines. Cabinet : 1 à 3 mois. | [HYP] |
| Churn | TPE de 3 à 5 %/mois ; plus élevé à l'approche du 1/9/2027 si la PA absorbe la fonction | [HYP] |
| Payback | Module : immédiat. Autonome : 150 à 400 € / 27 € de marge ≈ 6 à 15 mois. | [EST] |
| Marge brute | Supérieure à 85 % sans agrégation bancaire | [EST] |

### 9. Risques

- **Dépendance aux plateformes (majeur).** Les données de facture, de statut et d'encaissement vivent dans la PA. Chaque PA expose sa propre interface [P27]. L'API Pennylane n'exposerait pas le détail des paiements [P24]. Un outil tiers n'a **aucun droit** d'émettre le statut « encaissée » sans passer par la PA de l'émetteur [P07].
- **Réaction des éditeurs en place (majeur).** Pennylane, Tiime, Qonto et Axonaut ont déjà la fonction. Le « trou » observé (statut « payé » manuel en entrée de gamme) peut être comblé rapidement.
- **Responsabilité.** Si l'outil pilote l'envoi du statut « encaissée » (date, montant par taux) et se trompe, la TPE commet un manquement déclaratif [P07]. Il faut donc rester en lecture et en aide, et ne pas émettre à la place de la PA.
- **RGPD.** Données de contacts des débiteurs (B2B, intérêt légitime plausible [HYP]) et données bancaires si agrégation (DSP2 : agrément ou partenaire obligatoire [HYP]).
- **Réglementation.**
  - Calendrier non suspendu au 29/10/2026 ; report au plus d'un trimestre évoqué [P35].
  - La PPL Rietmann, si elle est adoptée, interdirait de renoncer aux pénalités et alourdirait les amendes. C'est un catalyseur positif, mais il n'est pas adopté définitivement [P30].
  - Le règlement européen sur les retards de paiement est bloqué (D-P23 phase 1).
- **Fiabilité de l'IA.** Un ton inadapté envers un gros client peut coûter la relation. Garder une validation humaine.
- **Intégrations.** Avec plus de 100 PA [P28], la couverture ne peut se faire que par import CSV ou PDF Factur-X, ou via 3 à 5 API (Pennylane, Tiime, Qonto, Axonaut, Sellsy) dont l'accès et les conditions restent à vérifier [INC].

### 10. Distribution

1. **Canal 1 — base Relanzio** : vente additionnelle aux artisans pilotes. C'est le seul canal à CAC quasi nul. Limite : Relanzio est encore **pré-pilotes** (README v0.4), donc la base est à construire.
2. **Canal 2 — marketplace d'une PA** : Pennylane a un marketplace avec certification [P24], mais il est déjà peuplé de 5 outils de recouvrement ou plus [P25]. Autre option : partenariat avec une PA indépendante sans module de relance, comme Jefacture [P18], dont la relance n'est pas mentionnée [INC].
3. **Canal 3 — cabinets comptables** : environ 19 500 [P32], mais ils sont déjà rattachés à une PA partenaire.

**Message.** « Vos factures de prestations vous sont payées à 60 jours au lieu de 30 ? Relanzio relance vos devis ET vos factures avec le bon ton, et vous dit chaque 5 du mois quelles factures payées doivent être déclarées "encaissées" avant le 10. »

**Obtenir 10 conversations d'acheteurs :**
- 10 appels aux artisans pilotes de Relanzio ;
- 20 messages LinkedIn ciblés vers des dirigeants de TPE de services B2B (codes NAF 43, 70.22, 81.2 et 71) ;
- 5 cabinets comptables locaux.

**Listes publiques de prospects :**
- Sirene et l'annuaire des entreprises (open data, par code NAF et tranche d'effectif) [HYP, non vérifié dans ce cycle] ;
- le tableau de l'Ordre des experts-comptables ;
- les listes de PA de la DGFiP, pour trouver des partenaires [P28].

**Premières ventes sans audience.** Offre « Founder » à 19 € pour les 10 premiers ; prévente sur page d'attente avec paiement Stripe.

### 11. Faisabilité

**Briques Relanzio réutilisables** (vérifié dans le dépôt) :
- `server/followups.js` et `followup-policy.js` (séquences de relance) ;
- `imap-replies.js` et `imap-reply-parser.js` (détection des réponses) ;
- `email.js` avec Brevo ;
- `billing.js` et `stripe-webhook.js` ;
- `morning-digest.js` ;
- schéma Supabase.

**Briques à construire :**
- un objet « facture » (échéance, montant TTC par taux, statut) ;
- l'import CSV ou Factur-X ;
- l'indemnité de 40 € et les pénalités calculées dans la relance [P29] ;
- un tableau des retards ;
- un rappel « statuts encaissée à déclarer avant le 10 ».

**Partie difficile :**
- détecter le paiement de façon fiable : agrégation bancaire DSP2 ou API de PA ;
- couvrir la fragmentation des PA.

**Estimation** [EST] :
- MVP du module : 3 à 5 semaines pour une personne.
- Connecteur API d'une PA : 1 à 2 semaines chacun, sous réserve d'accès.
- Coût cash : moins de 100 €/mois hors agrégation bancaire.

**Dépendances critiques :**
- accès aux API des PA (non vérifié, sauf Pennylane, documentée) ;
- passage en production de Relanzio (gates externes non vertes).

### 12. Défendabilité à 2 ans

- **Ce qu'un gros éditeur commoditise :** tout ce qui touche à la relance et au statut. Les PA ont l'avantage structurel des données : facture, statut et banque [P13 à P17, P26].
- **Ce qu'un LLM généraliste commoditise :** la rédaction des relances.
- **Pourquoi le client resterait :** historique des séquences et des réponses par client débiteur ; intégration au flux devis de Relanzio ; habitude. C'est un verrou faible [HYP].
- **Défendabilité : 2/10.**

### 13. Raisons de NE PAS le faire et expériences d'invalidation

**Raisons de ne pas le faire :**
1. Le crochet réglementaire (statut « encaissée ») appartient aux PA, pas à un tiers.
2. Une dizaine d'acteurs offrent déjà la relance, dont plusieurs gratuitement ou pour moins de 25 €.
3. Les banques et la profession comptable distribuent des PA gratuites.
4. Distribution TPE coûteuse et cabinets déjà captés.
5. Aucune preuve directe de volonté de payer.
6. Le pic de catalyseur (septembre 2027) est aussi le moment où les PA verrouillent le client.

**Est-ce un avantage ou un piège pour Relanzio ?**
- *Avantage* en tant que module : même ICP, même moteur et même canal.
- *Piège* si Relanzio pivote vers « recouvrement + e-invoicing » : marché saturé, dépendance aux PA, et cela détourne de la validation non encore faite du produit devis.
- Recommandation : **ne pas en faire un produit distinct** ; tester la fonction en module après les premiers pilotes payants de Relanzio.

**Expériences qui invalideraient l'idée (seuil d'arrêt) :**
1. **Entretiens** avec 10 artisans ou TPE de services B2B. Si plus de 60 % ont déjà des relances automatiques via leur PA ou leur logiciel, ou n'ont pas de retards significatifs (plus de 10 % des factures à plus de 15 jours), on arrête.
2. **Prévente.** Page « Relance factures » avec un paiement de 19 € pour le premier mois. Moins de 3 prépaiements sur 50 visiteurs qualifiés : on arrête le produit autonome.
3. **Test d'API.** Demander l'accès développeur à Pennylane, Tiime et Qonto, et vérifier si le statut de paiement est lisible. Si non, le wedge « encaissée » est mort et l'on se limite à l'import CSV.
4. **Cabinets.** 5 cabinets interrogés. Si aucun ne paierait 3 à 5 € par dossier pour un tableau des « encaissées manquantes » et des retards clients, on abandonne D-08 et D-09 en tant que canal.

### 14. Re-notation

Phase 1 : notes brutes de `scores-bruts.csv`, total 67,5 ≈ 68.

| Critère (poids) | Phase 1 (0-10) | Phase 2 (0-10) | Points | Cause du changement |
|---|---|---|---|---|
| Douleur et budget (20) | 7 | 7 | 14 | Inchangé : les données BdF, AN et Altares confirment [P01, P04, P05]. Les TPE paient elles-mêmes à l'heure (68 %), mais subissent les grands comptes (24 %) [P03]. |
| Fréquence (10) | 9 | 8 | 8 | Relance hebdomadaire, e-reporting mensuel ; volume de factures modeste en TPE. |
| Preuves (15) | 7 | 6 | 9 | Preuves macro solides, mais aucune volonté de payer observée. La gratuité généralisée suggère une faible disposition à payer *en plus*. |
| Distribution (15) | 6 | 4 | 6 | Cabinets captés par des PA (Jefacture : 4 000 cabinets ; Pennylane : 2 000) ; banques distributrices ; marketplace Pennylane déjà occupée [P18, P24, P25]. |
| Lacune (10) | 3 | 2 | 2 | Relance incluse chez Pennylane, Axonaut, Sellsy, Abby, Qonto (option), Libeo, Tiime ; PA gratuites [P13 à P19, P22]. |
| Faisabilité (10) | 8 | 6 | 6 | La relance est facile (briques Relanzio), mais le volet « cycle de vie » exige l'accès à plus de 100 PA hétérogènes ou une agrégation bancaire [P24, P27]. |
| Marge (5) | 8 | 7 | 3,5 | Bonne marge, mais prix plafonné par la gratuité. |
| Timing (5) | 7 | 6 | 3 | Septembre 2027 confirmé, sans report général [P09, P35] ; mais c'est aussi le moment où les PA captent la fonction. La PPL Rietmann n'est pas adoptée [P30]. |
| Défendabilité (5) | 4 | 2 | 1 | Données détenues par les PA et les banques ; LLM pour la rédaction. |
| Risques (5) | 8 | 6 | 3 | Dépendance aux API des PA, responsabilité déclarative si l'outil pilote le statut [P07, P24]. |
| **Total** | **67,5** | — | **55,5 ≈ 56** | |

**Confiance : moyenne.** Faits réglementaires concordants (secondaires) ; prix d'agrégateurs ; aucun entretien.

---

## DD-A23 — Rapprochement des remboursements MFP pour pharmacies indépendantes (US)

Date : 2026-10-29. Phase 2/4 (due diligence). Note de phase 1 : **77/100** (A-top.md) ; la ligne de `scores-bruts.csv` (9,9,7,6,5,7,8,9,6,5) donne 72,5 avec `score.py`. L'écart vient de notes en points converties de façon incohérente. La référence retenue ici est la table d'A-top, convertie en notes sur 10.
**Nouvelle note : 55/100. Confiance moyenne.**

Méthode : 41 requêtes WebSearch, dont environ 45 % consacrées à l'invalidation (substituts gratuits, éditeurs de PMS, PSAO, modèle prospectif, litiges, réforme, plaintes absentes, barrières HIPAA). WebFetch est bloqué (ncpa.org ne se résout pas dans cette session) : toutes les preuves viennent d'**extraits de recherche**. Étiquettes : **[O]** fait observé (sourcé, n° de preuve `Pxx` = `DD-A23-Pxx`), **[E]** estimation, **[H]** hypothèse, **[I]** inconnu.

---

### 1. ICP, rôles, contexte d'achat
- **ICP** : pharmacie indépendante de détail aux US, 1 à 3 officines, avec un volume Medicare Part D significatif, qui délivre les médicaments MFP (Eliquis, Jardiance, Xarelto, Januvia… en 2026 ; sémaglutide à partir de 2027). Elle n'est pas en 340B contract pharmacy, ou seulement marginalement [H]. Segment secondaire : pharmacies de soins de longue durée (LTC, membres ASCP), plus exposées [O, P21 ; l’enquête NCPA P02 couvre aussi les LTC].
- **Utilisateur** : responsable back-office / comptabilité tiers payant (souvent un technicien senior), ou le titulaire lui-même [H].
- **Prescripteurs** : PSAO / coopératives (IPC, Elevate/Good Neighbor, Health Mart Atlas, AAP), consultants (Apex Consulting, PAAS National), éditeur du PMS, comptable spécialisé pharmacie [O pour leur rôle sur le MTF : P09, P13, P42 ; H pour leur rôle de prescripteur].
- **Décideur économique** : le titulaire (pharmacist-owner).
- **Sponsor** : le titulaire, ou la PSAO/coop si l'achat se fait en marque blanche.
- **Objections attendues** : (1) « Beacon est gratuit et me montre déjà mes remboursements » [O, P07] ; (2) « ma PSAO/coop s'en occupe » [O, P09, P13] ; (3) « mon PMS va le faire » [O, P20, P21] ; (4) « je ne confie pas mes données patients à un éditeur étranger inconnu » [H] ; (5) « le vrai problème, c'est le délai de paiement, pas les erreurs » [O, P14, P15 vs P02] ; (6) « je ne stocke plus ces médicaments » [O, 19 % selon P34].
- **Contexte d'achat** : marges sous pression, fermetures d'officines, budgets logiciels déjà engagés (PMS, PSAO, outils de rapprochement des paiements tiers type Outcomes) [H]. Achat individuel par carte, mensuel, sans appel d'offres ; décision en 1 à 4 semaines si la confiance est établie [H].

### 2. Job-to-be-Done et workflow actuel
**JTBD** : « Être sûr que chaque délivrance d'un médicament MFP m'a rapporté le remboursement fabricant dû, et récupérer vite ce qui manque, sans passer mes soirées à croiser des fichiers. »

Workflow actuel pas à pas [O sauf mention] :
1. Délivrance ; le plan Part D paie le MFP + les honoraires de dispensation (P19).
2. Le PBM transmet la demande au MTF (environ 7 jours), puis le fabricant a 14 jours pour rembourser (P19, Milliman P16).
3. La pharmacie (ou sa TPSE/PSAO) télécharge le **835 (X12 005010)** du MTF et le **Claims Tracking Report** (P11, P12).
4. Elle se connecte en parallèle à **Beacon MFP** pour voir la base de calcul et le statut par demande (P07, P08).
5. Elle compare, ICN par ICN, le SDRA estimé (WAC − MFP) au remboursement autorisé, souvent dans un tableur avec le tutoriel NCPA/Apex (P10).
6. Elle rapproche avec l'export du PMS et les relevés des TPA ; Plenful décrit un croisement « manuel » de 4 systèmes qui « ne se parlent pas » (P03).
7. Pour les écarts, elle ouvre une Good Faith Inquiry dans Beacon (fenêtre de 120 jours selon Plenful, P06) ou porte plainte auprès de CMS (P40).
8. Elle suit le dépôt bancaire (virement ou chèque) et l'impute en comptabilité.

**Pourquoi c'est douloureux** : quatre sources non reliées ; avance de trésorerie (67 % attendent 22 jours ou plus, P02) ; 78 % déclarent des difficultés de rapprochement (P01) ; erreurs d'adjudication élevées au lancement (40 % le premier mois selon un fournisseur, P17) ; très peu de contestations (< 0,5 % de GFI, P03).
**Fréquence** : flux de 835 récurrents (hebdomadaires ou plus fréquents [H]) ; chaque délivrance MFP crée une ligne à suivre. Le volume va augmenter en 2027 avec 15 médicaments supplémentaires, dont le sémaglutide (P28).

### 3. Coût de l'inaction
Formule par officine et par an :
`Perte = Flux annuel de remboursements MFP × taux de remboursements jamais récupérés + heures de rapprochement × coût horaire (+ coût de l'avance de trésorerie, non traité par l'outil)`

| Variable | Valeur | Étiquette |
|---|---|---|
| Avance de trésorerie moyenne | > 27 000 $/mois | [O, projection NCPA 2024, P37 ; attribution d'URL incertaine] |
| Flux annuel de remboursements déduit (avance ÷ délai d'environ 21-30 j) | 250 000 à 450 000 $ | [E, faible confiance] |
| Remboursement pour une délivrance (exemple BestRx) | 375 $ | [O, P19, exemple illustratif] |
| Remboursement d'une boîte de sémaglutide en 2027 (≈ prix catalogue 959 $ − MFP 274 $, catalogue ≈ WAC) | ≈ 685 $ | [E, dérivé de P28] |
| Part des remboursements en retard, incomplets ou absents | 15 à 20 % | [O fournisseur, hôpitaux/340B, P03 ; faible confiance pour les indépendants] |
| Part **jamais récupérée** sans rapprochement (indépendant non 340B) | 1 à 5 % | [H] |
| Temps de rapprochement | 1 à 3 h/semaine | [H] |
| Coût horaire chargé | 30 à 60 $ | [H] |

- Bas : 250 000 × 1 % + 52 × 1 × 30 = **≈ 4 100 $/an**
- Central : 350 000 × 2 % + 52 × 2 × 45 = **≈ 11 700 $/an**
- Haut : 450 000 × 5 % + 52 × 3 × 60 = **≈ 31 900 $/an**
- En 2027, multiplicateur ×1,5 à ×2,5 avec le sémaglutide et 15 médicaments supplémentaires [H].
- Point critique : la plus grande partie de la douleur exprimée est **l'avance de trésorerie** (21 jours en moyenne selon CMS/BRG, P14, P15 ; 43 000 $/an selon une tribune sponsorisée par la NCPA, P36). **Un logiciel de rapprochement ne la réduit pas.** Il ne capte que la part « manquants / sous-payés » et le temps passé.

### 4. Concurrents et substituts (détail : `DD-A23-concurrents.csv`)
| Acteur | Type | Prix | Positionnement / limites |
|---|---|---|---|
| **Beacon MFP** (Second Sight/BRG) | direct / substitut | **0 $** pour la pharmacie [O, P07] | Base de calcul par demande, rapprochement des paiements, GFI. Tous les fabricants IPAY 2026 l'utilisent (P08). Limites : ne voit ni le PMS, ni l'acquisition réelle, ni les TPA [H]. |
| **CMS MTF** (835 + Claims Tracking Report) | substitut | 0 $ | Données brutes officielles (P11, P12) ; pas d'outil multi-sources. |
| **Tutoriel NCPA/Apex** + Excel | substitut | 0 $ | Méthode ICN par ICN (P10). |
| **Plenful** MFP Intelligence + GFI Agent | direct | inconnu | Systèmes de santé et 340B ; accès 835 en tant que TPSE ; IA qui dépose les GFI (P04-P06). Rien de trouvé sur les indépendants. |
| **RxParadigm** Tungsten+PLUS | indirect | inconnu | Hôpitaux et 340B (P18). |
| **Outcomes** Reconciliation | indirect (le plus menaçant) | inconnu | Rapprochement claim-level déjà vendu aux indépendants, avec outil 835 (P23). MFP non mentionné. |
| **PMS** : BestRx, PrimeRx, Liberty, SoftWriters (LTC) | indirect | inconnu | Documentation MFP (BestRx), outils annoncés (PrimeRx), suivi livré (SoftWriters) (P19-P22). PioneerRx et Computer-Rx : rien trouvé [I]. |
| **PSAO / coops** : IPC, Elevate/FDS, Health Mart | substitut / canal | inconnu | IPC met déjà en place le rapprochement avec ses membres (P09) ; une PSAO peut être TPSE et recevoir remboursements et 835 (P13). |
| **Modèle prospectif** (Cencora) | substitut structurel | — | Supprimerait le remboursement à rapprocher ; non retenu en 2026 (P25, P26). |

Plaintes observées : SoftWriters a dû livrer des correctifs de rapprochement (P21). Aucune plainte publique d'utilisateurs trouvée sur Beacon, ni de fil Reddit (P43).

### 5. Différenciation possible
- **Wedge** : « audit MFP en 10 minutes » pour une officine indépendante non 340B. On importe les 835 du MTF, le Claims Tracking Report et un export PMS standard. On obtient la liste des délivrances MFP **sans remboursement après 30/45 jours**, **sous le SDRA**, ou en **doublon**, plus un brouillon de GFI prêt à coller dans Beacon avant l'échéance de 120 jours.
- **Time-to-value** : moins d'une heure si l'export PMS est pris en charge [H].
- **ROI mesurable** : dollars récupérés par GFI acceptée, affichés dans un tableau de bord.
- **Raison de changer** : Beacon est la vue des fabricants (sans le PMS) ; l'outil est la vue de la pharmacie, croisée avec ses délivrances. Mais cet argument ne vaut que si l'écart de remboursements est réel chez les indépendants [I].
- **Option architecture « PHI local »** : traitement dans le navigateur, sans stockage serveur des PHI, pour réduire le périmètre HIPAA d'un éditeur non US [H, à valider par un juriste].

### 6. Taille de marché (bottom-up)
- Acheteurs : **18 988 pharmacies indépendantes** en 2026 [O, P27]. Part qui délivre des médicaments MFP : 80 à 95 % [H], à pondérer par les 19 % qui disent ne plus stocker certains médicaments MDPNP [O, P34]. Les officines LTC sont un segment additionnel au nombre inconnu [I].
- Prix : 1 200 à 2 400 $/an par officine [H].
- **TAM** ≈ 18 988 × 0,8 à 0,95 × 1 200 à 2 400 $ ≈ **18 à 43 M$/an** [E].
- **SAM** (hors officines servies par leur PSAO/coop ou leur PMS, et seulement celles atteignables) : 20 à 40 % du TAM ≈ **4 à 17 M$/an** [H].
- **SOM à 24 mois** pour un fondateur solo non US : 50 à 300 officines ≈ **60 k$ à 540 k$ d'ARR** [H]. Le bas de la fourchette est le plus probable sans partenaire PSAO.

### 7. Pricing
- **Recommandé** : **149 $/mois par officine** (ou 1 490 $/an), import illimité, détection et brouillons de GFI. Signataire : le titulaire. ROI central : 11 700 $/an de perte évitée contre 1 788 $ ≈ **6,5×** [E/H]. Au bas de la fourchette (4 100 $), ≈ 2,3×.
- **Alternative 1, au succès** : 20 % des sommes récupérées via une GFI acceptée, avec un minimum de 49 $/mois. Plus facile à vendre, mais revenu volatil et preuve de causalité difficile.
- **Alternative 2, marque blanche PSAO/coop** : 25 à 40 $/officine/mois, contrat signé par la PSAO pour tout son réseau. Seule voie vers le volume, mais cycle long et pouvoir de négociation chez la PSAO.
- Aucun prix concurrent public n'a été trouvé (tous « inconnu »), ce qui empêche d'ancrer le prix [O].

### 8. Intrants du modèle économique
| Intrant | Valeur | Étiquette |
|---|---|---|
| Prix moyen | 120 à 149 $/mois | [H] |
| Hébergement compatible HIPAA (cloud US + BAA fournisseur) | 200 à 600 $/mois fixes | [E] |
| IA/API (parsing, brouillons de GFI) | < 2 $/officine/mois | [E] |
| Support | 1 h/officine/mois au départ | [H] |
| Onboarding (mapping de l'export PMS) | 1 à 3 h par officine ; plusieurs jours par nouveau PMS | [H] |
| Fixe conformité (LLC US, agent enregistré, assurance cyber/E&O, évaluation des risques HIPAA) | 3 000 à 10 000 $/an | [H] |
| CAC direct (salons d'associations d'État, emails, appels) | 500 à 2 000 $ | [H] ; plus élevé pour un fondateur hors US |
| CAC via PSAO | faible par officine, mais 3 à 9 mois de négociation | [H] |
| Cycle de vente | 2 à 8 semaines (en direct) ; 3 à 9 mois (PSAO) | [H] |
| Churn | 2 à 4 %/mois ; risque de churn massif si le PMS ou la PSAO intègre la fonction | [H] |
| Marge brute | 80 à 90 % | [E] |
| Payback | 4 à 15 mois | [E] |

### 9. Risques
- **Sécurité / HIPAA** : l'éditeur est un *business associate* dès qu'il stocke ou transmet des PHI. Il faut une BAA avec chaque pharmacie ou PSAO, souvent avec une exigence d'assurance cyber [O, P45]. Le 835 contient des identifiants patients et ordonnances [H, standard X12].
- **RGPD** : marginal (données US), mais un sous-traitant UE qui accède aux PHI depuis la France doit figurer dans la BAA [H].
- **Accès aux données** : il passe soit par la pharmacie (téléchargements manuels), soit par l'inscription de l'éditeur comme **TPSE** auprès du MTF (Plenful le fait, P04). La TPSE fournit un Center ID et un questionnaire (P13). L'éligibilité d'une petite LLC détenue par un non-US est [I]. **Beacon** : aucune API ou export automatisé documenté n'a été trouvé [I].
- **Responsabilité** : GFI erronée ou remboursement « détecté » à tort. Il faut des CGU qui limitent la responsabilité et une E&O [H].
- **Réglementation** :
  - Programme consolidé : refus de la Cour suprême le 18/05/2026 (P30), 15 médicaments en 2027 (P28), 15 en 2028 dont des Part B, avec participation de tous les fabricants (P29).
  - Facteurs de changement : projet de guidance d'effectuation 2028 du 16/07/2026, dont la version finale est attendue (P32) ; modèle prospectif possible (P25) ; EPIC Act débattu, qui retarderait certaines sélections sans supprimer le programme (P31). Aucune suspension n'a été trouvée [O].
  - Si CMS ou les fabricants passaient au prospectif, ou si le MTF enrichissait son rapport, le besoin baisserait fortement [H].
- **Intégrations** : autant de formats d'export que de PMS (PioneerRx, Liberty, BestRx, Computer-Rx, PrimeRx…) [H].
- **Fiabilité IA** : faible enjeu si les règles sont déterministes (835, SDRA) ; l'IA ne sert qu'aux brouillons [H].
- **Dépendance plateforme** : formats CMS (les guides 835 sont passés de la version 0.1 à 1.0, P12) et règles des fabricants.
- **Réaction des acteurs en place** : forte probabilité qu'Outcomes, les PMS et les PSAO ajoutent la fonction (P20, P21, P23, P09).

### 10. Distribution
- **Canal 1, PSAO / coopératives / consultants en marque blanche** (IPC, AAP, coops régionales, Apex Consulting, PAAS National). Ils ont déjà la relation de confiance et le rôle de TPSE (P09, P13). Risque : ils font déjà ce travail en mode service, et le produit devient un outil interne à faible prix.
- **Canal 2, vente directe aux titulaires** :
  - Liste publique de prospects : registre **NPPES/NPI** (taxonomie pharmacie communautaire/de détail), connu mais non vérifié dans cette recherche [H]. La base NCPDP est payante [H].
  - Emails et appels avec une offre d'**audit gratuit sur 90 jours** ; associations de pharmacie des États ; salons (NCPA Annual Convention) ; podcasts du secteur (ex. Bottom Line Pharmacy Podcast, où Beacon est intervenu).
- **Message** : « En 2027, chaque boîte de sémaglutide délivrée à un patient Medicare, c'est environ 685 $ que le fabricant vous doit. Chargez vos 835 MTF et votre export PMS : en 10 minutes, nous listons les remboursements manquants ou incomplets et préparons vos Good Faith Inquiries avant la limite de 120 jours. »
- **10 conversations** :
  - (1) 30 emails personnalisés à des titulaires repérés via NPPES dans 2 ou 3 États, avec offre d'audit.
  - (2) Interventions dans des groupes de pharmaciens indépendants [H : existence et taille non vérifiées].
  - (3) 5 appels à des consultants (Apex, PAAS) et coops (IPC, AAP) pour un partenariat.
  - (4) Recrutement d'un pharmacien-conseil américain rémunéré à l'acte pour les introductions.
- **Premières ventes sans audience** : audit gratuit, puis abonnement si l'audit trouve plus de 1 000 $ récupérables.
- **Honnêtement, pour un fondateur francophone basé en France** :
  - culture d'achat au téléphone et par recommandation [H] ;
  - méfiance envers un éditeur étranger qui manipule des PHI [H] ;
  - décalage horaire de 6 à 9 h ;
  - aucune présence physique possible aux salons sans déplacements coûteux.
  La distribution est le maillon le plus faible.

### 11. Faisabilité
- **MVP** :
  - parseur X12 835 (005010, companion guide CMS, P12) et parseur du Claims Tracking Report (format exact [I]) ;
  - import CSV des exports PMS (1 ou 2 PMS au départ) ;
  - table MFP publique CMS + WAC (le WAC vient de l'export PMS ou des factures grossistes ; les bases Medi-Span/FDB sont sous licence payante [H]) ;
  - moteur d'appariement (n° Rx, date de service, NDC, ICN) ;
  - règles : non payé après N jours, < SDRA, doublon, suspicion de 340B ;
  - génération de brouillons de GFI ; tableau de bord des sommes récupérées.
- **Intégrations indispensables** : 835 MTF (via téléchargement manuel ou TPSE), exports PMS. Beacon en import manuel [I sur l'export].
- **Briques réutilisables** (stack Relanzio) : Node, Stripe, Brevo, Supabase. L'éligibilité HIPAA du plan Supabase et la signature d'une BAA sont à vérifier [H] ; hébergement en région US.
- **Partie difficile** :
  - (a) l'accès automatisé aux données (statut TPSE, multiplicité des PMS) ;
  - (b) la conformité HIPAA et la confiance ;
  - (c) la valeur de référence « attendue » quand le fabricant n'utilise pas le SDRA.
- **Coût / délai** : 6 à 10 semaines de développement pour le MVP (un PMS), plus 3 000 à 10 000 $ de structure juridique, assurance et conformité la première année [H/E].
- **Dépendances critiques** : formats CMS/MTF, pratiques des fabricants (Beacon), accès TPSE.

### 12. Défendabilité à 2 ans
Faible.
- **Ce qui peut être commoditisé** :
  - un LLM généraliste sait déjà parser un 835 et faire un rapprochement simple à partir d'un CSV ;
  - Beacon (gratuit) peut ajouter un import PMS ;
  - CMS peut enrichir le Claims Tracking Report ;
  - Outcomes, les PMS et les PSAO peuvent ajouter un module MFP.
- **Ce qui retiendrait le client** :
  - l'historique des GFI et des montants récupérés ;
  - les connecteurs PMS ;
  - les règles par fabricant et par médicament apprises sur les cas réels ;
  - l'intégration chez une PSAO.
  Aucun effet de réseau.

### 13. Raisons de NE PAS le faire, et expériences d'invalidation
**Raisons de ne pas le faire**
1. **Un substitut gratuit couvre déjà le cœur du job** (Beacon : base de calcul, rapprochement, GFI ; P07), avec un tutoriel NCPA gratuit (P10).
2. **La douleur principale est la trésorerie** (délai moyen d'environ 21 jours ; P14, P15, P36), que le produit ne résout pas.
3. **Les acteurs en place s'en emparent** : PMS (P20, P21), PSAO et coops (P09), Outcomes (P23), Plenful en haut de gamme (P05, P06).
4. **Les chiffres d'écart (15-20 %, 40 %) viennent de fournisseurs** au service des hôpitaux et du 340B (P03, P17). Rien de mesuré chez les indépendants.
5. **Distribution et HIPAA difficiles depuis la France**, sur un marché de confiance.
6. **Risque structurel** : bascule vers un modèle prospectif ou amélioration des outils CMS (P25, P32).
7. **Aucune preuve de volonté de payer** et aucune plainte publique trouvée (P43).

**Expériences d'invalidation (2 à 4 semaines)**
1. Entretiens avec 15 titulaires : « Avez-vous identifié un remboursement MFP manquant ou incomplet ces 3 derniers mois ? Montant ? » **Abandon si moins de 30 % citent un cas de plus de 500 $.**
2. Obtenir 3 jeux de 835 MTF + Claims Tracking Report + export PMS anonymisés (sous BAA ou traitement local). **Abandon si moins de 1 % du flux de remboursements reste non payé ou sous-payé au-delà de 45 jours.**
3. Demander à 5 PSAO/coops et 2 éditeurs de PMS (PioneerRx, Liberty) leur feuille de route MFP. **Abandon si au moins 2 éditeurs majeurs livrent le rapprochement automatique avant mi-2027.**
4. Prévente : **abandon si moins de 5 lettres d'intention ou précommandes à 149 $/mois** après 20 démonstrations.
5. Écrire au MTF Help Desk pour savoir si une LLC détenue par un non-US peut être TPSE. **Pivot vers un outil 100 % local si la réponse est non ou trop lourde.**

### 14. Re-notation
| Critère (poids) | Phase 1 (pts → /10) | Phase 2 /10 | Points | Cause du changement |
|---|---|---|---|---|
| Douleur/budget (20) | 18 → 9 | **7** | 14 | Douleur réelle (P01, P02) mais surtout de trésorerie, que l'outil ne traite pas ; perte récupérable non mesurée chez les indépendants. |
| Fréquence (10) | 9 → 9 | **8** | 8 | Flux récurrent confirmé ; 19 % évitent certains médicaments MFP (P34). |
| Preuves (15) | 12 → 8 | **6** | 9 | Preuves de douleur venant d'associations ; chiffres d'écart venant de fournisseurs ; aucune preuve de volonté de payer ; aucune plainte publique. |
| Distribution (15) | 10 → 6,7 | **3** | 4,5 | Canaux contrôlés par les PSAO et PMS, qui proposent eux-mêmes la fonction ou le service ; fondateur hors US ; confiance et PHI. |
| Lacune (10) | 5 → 5 | **3** | 3 | Beacon gratuit + tutoriel NCPA + IPC + PMS qui intègrent ; seule reste la couche « croisement PMS + GFI » pour les indépendants. |
| Faisabilité (10) | 8 → 8 | **6** | 6 | 835 standard (facile) ; accès TPSE incertain ; formats PMS multiples ; HIPAA. |
| Marge (5) | 4 → 8 | **7** | 3,5 | Marge brute élevée, mais fixes de conformité et support d'onboarding. |
| Timing (5) | 5 → 10 | **8** | 4 | 2027 (sémaglutide) et 2028 confirmés, Cour suprême favorable ; risque prospectif et nouvelle guidance à venir. |
| Défendabilité (5) | 3 → 6 | **3** | 1,5 | Commoditisable par Beacon, CMS, PMS ou LLM. |
| Risques (5) | 3 → 6 | **3** | 1,5 | HIPAA/BAA, accès aux données, réaction des acteurs en place. |
| **Total** | **77** | | **55** | |

**Verdict** : NO-GO en l'état pour un fondateur solo basé en France. La douleur est réelle et va croître en 2027, mais le cœur du besoin est déjà couvert gratuitement (Beacon) ou en passe de l'être par les PMS et les PSAO. Un GO conditionnel n'est envisageable que via un partenaire PSAO/coop américain et après l'expérience 2 (écart mesuré de plus de 1 %).

---

## DD-A39 — Devoir de conseil formalisé (Recommandation ACPR 2024-R-03) pour petits cabinets de courtage — Due diligence phase 2

Date : 2026-10-29. Finaliste A-39 (phase 1 : 71/100 dans A-top.md ; notes brutes de scores-bruts.csv rappelées en §14).
Méthode : 44 recherches WebSearch, dont environ 45 % orientées vers l'invalidation (outils gratuits des associations, concurrents dotés d'un module DDA, gratuité des extranets, portée juridique de la recommandation, réalité des sanctions et des contrôles, jurisprudence).
**WebFetch est bloqué** (acpr.banque-france.fr ne résout pas). Le texte de la recommandation n'a donc **pas été lu dans sa source primaire**. Tout ce qui suit repose sur des extraits de recherche (Deloitte Avocats, Actu-Juridique, presse spécialisée).
Preuves : `DD-A39-preuves.csv` (P01 à P36). Concurrents : `DD-A39-concurrents.csv`.
Étiquettes : **[O]** fait observé (extrait sourcé) · **[E]** estimation · **[H]** hypothèse · **[I]** inconnu.

---

### 0. Vérification du texte et de son périmètre (demandée)

| Point | Constat | Statut |
|---|---|---|
| Identifiant et date | Recommandation ACPR **2024-R-03 du 21/11/2024**, qui complète la 2024-R-01 du 28/06/2024. Un site la numérote 2024-R-02 (erreur probable). | [O] P01, P04 |
| Entrée en application | **31/12/2025** selon Deloitte et la plupart des sources ; « contrats distribués ou renouvelés à compter du 01/01/2026 » selon une autre. L'écart est d'un jour. Le texte est en vigueur. | [O] P01 |
| Produits couverts | **Étendue à l'ensemble des produits d'assurance**, assurance de dommages et prévoyance comprises (auparavant surtout l'assurance vie). **Devoir de conseil dans la durée** étendu à la plupart des contrats. | [O] P01, P04 |
| Exclusions | Grands risques (art. L.111-6), **contrats collectifs à adhésion obligatoire**, **contrats souscrits par l'employeur** pour ses salariés, produits qui ne sont plus distribués et sans tacite reconduction. | [O] P02 |
| Proportionnalité | Application « en tenant compte de la complexité du contrat ». | [O] P03 (extrait, attribution moyenne) |
| Portée juridique | Une recommandation **n'est pas directement sanctionnable** sur le plan disciplinaire. Elle peut conduire à une **mesure de police administrative**. Les sanctions se fondent sur la loi (L.521-1, L.521-4 C. assur.). | [O] P03, P11 |

**Conséquence pour la thèse.** Le catalyseur existe et il est en vigueur. Il est en revanche plus « mou » que ne le laissait entendre la phase 1, pour trois raisons :
- le texte est une recommandation ;
- il s'applique de façon proportionnée ;
- il exclut le collectif obligatoire et les grands risques, qui représentent une part du chiffre d'affaires des courtiers entreprises et santé collective.

**Correction d'un signal de phase 1.** La « sanction d'un intermédiaire le 13/05/2026 » vise la **Société Générale** (blâme et 20 M€, offre « Sobrio »), pas un petit courtier (P11). Elle prouve que l'ACPR fait respecter le devoir de conseil, mais pas qu'elle contrôle les TPE.

---

### 1. ICP, acteurs, contexte d'achat

- **ICP** : cabinet de courtage de proximité de 1 à 10 personnes, immatriculé COA à l'ORIAS, multi-compagnies, en IARD particuliers et professionnels ou en santé-prévoyance individuelle et TNS. Il n'a **pas** de logiciel de gestion de cabinet doté d'un module DDA : il travaille avec Excel, Word et les extranets des assureurs ou des grossistes [H : ce sous-segment est à mesurer, voir §13].
- **Utilisateur** : le courtier ou le chargé de clientèle qui réalise le rendez-vous et la souscription.
- **Prescripteurs** :
  - l'association agréée (Endya, ANACOFI-Courtage, CNCEF Assurance, etc.) au moment d'un contrôle ou d'une formation ;
  - les grossistes et assureurs qui exigent la fiche ;
  - les organismes de formation DDA (Planète CSCA RH, IFPASS) ;
  - l'expert-comptable ou le consultant conformité.
- **Décideur économique** : le dirigeant gérant, qui est presque toujours aussi utilisateur.
- **Sponsor** : le dirigeant à la suite d'un contrôle de l'association, d'une réclamation client ou d'une mise en cause de sa RC pro.
- **Objections attendues** :
  1. « Mon extranet ou mon grossiste génère déjà la fiche » (P34, concurrents.csv).
  2. « Mon association me donne des modèles » (P20, P22).
  3. « J'ai déjà CourtiGo ou Lya » (P13, P15).
  4. « Une recommandation n'est pas une obligation » (P03).
  5. « Je n'ai jamais été contrôlé » (P29).
  6. « Encore un abonnement ».
- **Contexte d'achat** :
  - achat individuel, carte bancaire, sans appel d'offres ;
  - déclenché par un événement (contrôle, litige, création du cabinet, adhésion à une nouvelle association après un retrait d'agrément, P24) ;
  - cycle court s'il y a un déclencheur, sinon il n'y a pas d'achat [H].

### 2. Job-to-be-Done et workflow actuel

**JTBD** : « Quand je place un contrat, je veux produire sans y passer une demi-heure une trace datée et opposable montrant que j'ai recueilli les besoins, comparé et motivé ma recommandation. Je veux pouvoir la ressortir en cas de contrôle ou de litige, et refaire le point avec le client au renouvellement. »

**Workflow actuel probable** [H, à confirmer en entretiens] :
1. Rendez-vous téléphonique ou physique, prise de notes libre.
2. Tarification sur un ou plusieurs extranets, ou sur un multi-tarificateur (Oggo Data, P18).
3. Fiche de conseil générée par l'extranet de la compagnie retenue (P34, FMA), ou modèle Word ou PDF de l'association (P20), complété à la main. L'ACPR relève des « fiches standardisées » (P35, non revérifié).
4. Signature électronique via l'extranet, ou e-mail.
5. Archivage dispersé entre les extranets, la boîte mail et un dossier réseau.
6. Pas de revue périodique des besoins au renouvellement, alors que la 2024-R-03 attend désormais un conseil dans la durée (P01, P04).

**Pourquoi c'est douloureux** :
- les preuves sont dispersées entre plusieurs extranets ;
- la motivation est générique ;
- il n'y a pas de comparaison documentée entre les assureurs ;
- rien ne déclenche le suivi dans la durée.

**Fréquence** : à chaque souscription, avenant ou renouvellement, donc chaque semaine. La partie « durée » est annuelle par client [E].

### 3. Coût de l'inaction

**Formule** :
`CI annuel = P(contrôle) × C(contrôle) + P(litige) × C(litige non couvert) + T(formalisation) × N(contrats) × coût horaire`

| Variable | Valeur | Statut |
|---|---|---|
| P(contrôle ACPR) par cabinet et par an | < 0,5 % | [H] Aucun chiffre récent. Le dernier chiffre public est de 79 contrôles sur place, tous assujettis confondus, en 2012 (P29). |
| P(contrôle par l'association) | inconnue | [I] Aucune publication trouvée sur la fréquence ou les résultats des contrôles Endya, ANACOFI ou CNCEF. |
| C(contrôle défavorable) pour une TPE | 2 000 à 15 000 € (temps de remédiation, conseil externe) ; sanction ou radiation rare | [H] |
| P(litige pour défaut de conseil) | 0,5 à 2 % des cabinets par an | [H] |
| C(litige non couvert) | franchise RC pro de 1 000 à 5 000 €. Le juge exige un dommage effectif (P30). | [H] ; [O] pour le principe |
| T(formalisation) par contrat | 15 à 30 min aujourd'hui, contre 5 à 10 min outillé | [H] |
| N(contrats) par an pour un cabinet de 1 à 3 personnes | 200 à 800 | [H] |
| Coût horaire chargé | 35 à 50 € | [H] |

**Ordre de grandeur** :
- Risque réglementaire : 0,5 % × 8 000 € + 1 % × 3 000 € ≈ **70 €/an**. C'est faible.
- Temps : 15 min gagnées × 400 contrats × 40 €/h ≈ **4 000 €/an** [H].

→ Le ROI repose sur le **gain de temps**, pas sur la peur de la sanction. Or le gain de temps est déjà vendu par CourtiGo et Lya à partir de 29 €/mois (P13, P15).

### 4. Concurrents, indirects, substituts (détail dans le CSV)

| Acteur | Type | Prix | Limite / remarque |
|---|---|---|---|
| **Lya Courtage** | direct | 29 €/mois/utilisateur à 249 €/mois [O] P13 | « Conformité automatisée (devoir de conseil) » revendiquée ; 350 courtiers en 2023 (P14). C'est le **concurrent le plus proche**. |
| **CourtiGo** | direct | 29,90 à 199,90 €/mois [O] P15 | Conformité DDA, CRM, IA, du solo à l'agence. Profondeur du module fiche de conseil non vérifiée. |
| **Custy**, **SKY** | direct | inconnu | Documents réglementaires DDA générés, DDA « native » (P16). |
| **Modulr** (Ecilia) | indirect | inconnu | Plus de 650 clients, orienté grossistes et réseaux (P17). |
| **Oggo Data** | indirect | inconnu, sans engagement | Tarification jusqu'à la souscription signée (P18). |
| **Extranets assureurs et grossistes** (FMA, Zenioo…) | substitut | probablement gratuit [H] | Fiche mono-compagnie, sans motivation comparative [H]. |
| **ANACOFI** (documents types, outils, modèles) | substitut gratuit pour l'adhérent | inclus dans la cotisation (130 €/personne en 2023) [O] P20, P21 | Modèles statiques. |
| **Endya** (guides) | substitut | cotisation | Guides pédagogiques. Aucun logiciel ni partenariat éditeur trouvé (P22). |
| **Planète CSCA RH × Endya « Easy DDA »** | indirect | 15 €/h de formation [O] P23 | Les associations monétisent la formation, pas l'outillage. |
| **MustCompliance**, **Capital Explorer** (106 € HT/mois), **O2S** (60 à 120 € HT/mois en 2020), **Prisme** (85 € HT/mois) | indirects côté CGP/CIF | [O] P25 à P27, CSV | L'extension vers les CIF tomberait sur un marché déjà équipé. |
| Sur mesure (Kolonell) | substitut | module DDA à 15 000-25 000 € HT [O, source intéressée] P19 | Pour les plus gros cabinets. |
| Word, Excel, LLM généraliste | substitut | 0 € à quelques dizaines d'euros | C'est le statu quo. |
| Hiway, Assurly, Ma Mutuelle Assurance | ? | inconnu | **Aucun résultat** : non vérifiés, à ne pas citer comme concurrents établis. |

**Plaintes observées** : aucune plainte d'utilisateur sur ces modules n'a été trouvée [I]. Le seul avis vu (Oggo Data, Capterra) porte sur des adresses de résiliation obsolètes.

**Lecture** : **la lacune annoncée en phase 1 (« CRM courtiers non cartographiés ») est en grande partie comblée par l'existant.** Au moins quatre éditeurs revendiquent la DDA et le devoir de conseil, deux d'entre eux à partir d'environ 30 €/mois. De leur côté, les associations et les extranets fournissent gratuitement les modèles de base.

### 5. Différenciation possible

Proposer un « meilleur générateur de fiche de conseil » n'est **pas** un wedge viable. Deux wedges restent défendables, tous deux à l'état d'[H] :

1. **« Conseil dans la durée » en surcouche (overlay)**
   - Principe : le courtier importe son portefeuille (CSV ou bordereaux) quel que soit son CRM ou son extranet. L'outil envoie avant chaque échéance un questionnaire d'actualisation des besoins au client par e-mail ou SMS. Le client répond en ligne. L'outil horodate la réponse et signale les écarts (cumul d'assurances, besoin non couvert). Le courtier reçoit une liste d'actions et de ventes croisées.
   - Ce que la 2024-R-03 ajoute pour l'IARD et la prévoyance : le suivi dans la durée (P01, P04).
   - Réutilisation : c'est un **moteur de relance**, la brique déjà construite pour Relanzio (Node, Supabase, Brevo).
   - Raison de changer : le suivi est **à la fois de la conformité et du chiffre d'affaires**, par la détection d'opportunités et la rétention.
2. **Dossier de preuve prêt pour un contrôle d'association** : un export par client qui rassemble recueil, comparaison, motivation, remise des documents précontractuels (DIPA) et signature, sous une grille de contrôle. Il n'y a pas de contenu de grille public [I].

- **Time-to-value visé** : moins de 30 min (import CSV et premier envoi) [H].
- **ROI mesurable** : taux de réponse des clients, nombre d'écarts détectés et, en conséquence, ventes croisées.

### 6. Taille de marché bottom-up

| Étape | Valeur | Statut |
|---|---|---|
| Inscriptions COA au 31/12/2025 | **27 500** (+2,0 %) | [O] P06 (extrait Argus d'après le rapport Orias 2025) |
| Adhérents Endya (2024) | environ 12 000 | [O] P08 (titre seulement) |
| Part des TPE de moins de 11 salariés | environ 90 % | [O, confiance faible] P09 |
| Part des COA qui sont des cabinets spécialisés de proximité (hors banques, concessionnaires, activité accessoire, grossistes) | 35 à 55 % | [H] |
| Part de ceux qui n'ont pas de logiciel de cabinet avec DDA | 40 à 70 % | [H] |
| **Acheteurs adressables (SAM)** | **27 500 × 0,45 × 0,55 ≈ 3 900 à 10 600 cabinets** | [E] |
| Prix annuel par cabinet | 500 à 1 200 € | [H] |
| **TAM** (tous les COA × 500-1 200 €) | 14 à 33 M€/an. Plafond théorique qui inclut des non-acheteurs. | [E] |
| **SAM** | **2 à 13 M€/an** | [E] |
| **SOM à 3 ans** (1 à 3 % du SAM) | 40 à 320 cabinets, soit **25 k€ à 380 k€ d'ARR** | [E] |

Lecture : c'est une **micro-entreprise rentable possible**, pas un gros marché, et la concurrence à 29 €/mois plafonne le prix.

### 7. Pricing

- **Recommandé** : **39 €/mois par cabinet** jusqu'à 500 clients suivis, puis 0,08 € par client et par mois au-delà, avec 14 jours d'essai.
  - Exemple de ROI : un cabinet de 2 personnes et 600 clients récupère 2 h par mois de formalisation (80 €) et détecte 1 % d'écarts. Si cela produit 6 ventes croisées à 80 € de commission annuelle, cela fait 480 €. Le ROI annuel est d'environ 1 400 € pour 468 € payés [H].
- **Alternative 1** : un pack par dossier (par exemple 0,50 € par fiche ou par campagne), pour les cabinets à faible volume.
- **Alternative 2** : une licence de groupe vendue à une association, un grossiste ou un réseau, en marque blanche, par exemple 3 à 6 € par adhérent et par an [H]. Le volume serait élevé et le prix bas. Aucune association ne montre aujourd'hui d'appétit pour un partenariat logiciel (P22, P23).
- **Qui signe** : le dirigeant, par carte bancaire.

### 8. Intrants du modèle économique

| Intrant | Valeur | Statut |
|---|---|---|
| Prix moyen | 35 à 60 €/mois par cabinet | [H] |
| COGS IA (rédaction de la motivation, synthèse des réponses) | < 0,05 € par dossier ; < 2 € par cabinet et par mois | [H] |
| E-mail ou SMS (relances clients) | 1 à 5 € par cabinet et par mois selon le SMS | [H] |
| Signature électronique et horodatage qualifié (si exigés) | 0,5 à 2 € par signature, en option facturée | [H] |
| Hébergement UE (Supabase / Postgres) | moins de 150 €/mois au total au début | [H] |
| Support et onboarding | 1 à 2 h par client au démarrage (import du portefeuille) | [H] |
| Marge brute | 80 à 90 % | [E] |
| CAC | 150 à 500 € (outbound, webinaires) | [H] |
| Cycle de vente | 1 à 4 semaines s'il y a un déclencheur, sinon indéfini | [H] |
| Churn | 2 à 4 % par mois (TPE, faible contrainte) | [H] |
| Payback | 4 à 12 mois | [E] |

### 9. Risques

- **Responsabilité de l'éditeur** :
  - Le devoir de conseil reste celui du courtier (P32, P31). Un texte motivé généré par l'IA et non relu peut être reproché au courtier, qui se retournera contre l'éditeur.
  - Protections nécessaires : CGV B2B avec clause limitative, outil présenté comme « aide à la formalisation » et non comme un « conseil », validation humaine obligatoire tracée, RC pro éditeur.
  - La jurisprudence propre aux éditeurs n'a pas été trouvée [I].
- **RGPD** :
  - données de santé possibles en prévoyance et santé (questionnaires de besoins) ;
  - si l'outil stocke des données de santé : hébergement HDS [H : à vérifier selon que le recueil des besoins inclut ou non des données médicales] ;
  - à défaut, exclure explicitement les données médicales du recueil.
- **Réglementation** :
  - texte non contraignant juridiquement (P03) ;
  - pas de report ni de suspension trouvés ;
  - risque inverse : l'ACPR ou les associations publient un modèle officiel gratuit [H].
- **Accès aux données** : pas d'API standard vers les extranets. On dépend d'imports CSV ou de bordereaux, et le portefeuille est souvent dans l'extranet [H].
- **Réaction des éditeurs en place** : CourtiGo et Lya peuvent ajouter une campagne de « conseil dans la durée » en quelques semaines. Ils ont déjà la base installée.
- **Fiabilité de l'IA** : une motivation générique serait précisément le défaut relevé par l'ACPR (P35). L'IA doit donc s'appuyer sur les réponses réelles et les garanties comparées.
- **Canal instable** : retraits d'agrément d'AFIB, de La Compagnie des IAS et de Courtensia (P24). C'est une opportunité ponctuelle (re-adhésion) mais aussi un signe d'instabilité.

### 10. Distribution

- **Canal 1 : outbound ciblé.**
  - Source : le registre ORIAS (public, consultable par numéro ou nom) croisé avec Google Maps et LinkedIn « courtier en assurances » + ville.
  - Message : « Depuis le 31/12/2025, l'ACPR attend un conseil dans la durée sur vos contrats IARD et prévoyance. En 30 minutes, importez votre portefeuille : vos clients reçoivent avant l'échéance un questionnaire d'actualisation, vous gardez la preuve horodatée et vous voyez qui a besoin d'un avenant. 39 €/mois. »
- **Canal 2 : formateurs DDA et consultants conformité externalisée** (revendeurs ou apporteurs, 20 à 30 % de commission), plus des webinaires « 2024-R-03 pour courtiers IARD ».
- **Associations agréées** : elles servent à **parler** (contenus, webinaires), pas de canal de vente garanti. Aucune ne montre de partenariat logiciel (P22) et l'ANACOFI fournit ses propres modèles (P20).
- **Obtenir 10 conversations** :
  - 150 appels ou messages LinkedIn ciblés sur des courtiers de 1 à 5 personnes en santé-prévoyance individuelle et IARD particuliers ;
  - 3 groupes Facebook ou LinkedIn de courtiers ;
  - script de 15 minutes sur l'outil utilisé aujourd'hui pour la fiche, la dernière fois que la fiche a servi, et l'existence d'une revue à l'échéance.
- **Premières ventes sans audience** : pré-vente à 39 €/mois, avec import de portefeuille fait gratuitement par le fondateur (« concierge »).
- **Profil fondateur** : francophone en France, donc la distribution est faisable. Le fondateur ne vient pas du métier du courtage, ce qui crée un déficit de crédibilité à compenser par un courtier conseiller [H].

### 11. Faisabilité

- **MVP** :
  1. import de portefeuille (CSV ou bordereau) ;
  2. bibliothèque de questionnaires de besoins par branche (habitation, auto, multirisque pro, santé individuelle, prévoyance TNS) ;
  3. parcours client en ligne avec horodatage ;
  4. rédaction assistée de la motivation, avec validation humaine ;
  5. génération du PDF de la fiche et coffre de preuves ;
  6. campagnes d'échéance (le moteur de relance Relanzio) ;
  7. export du dossier de contrôle.
- **Briques réutilisables** : Node, Supabase, Stripe, Brevo (Relanzio). Signature électronique par API tierce en option.
- **Partie difficile** :
  - le **contenu métier**, c'est-à-dire des questionnaires et des motivations jugés recevables par une association : il faut un courtier ou un juriste relecteur ;
  - l'import de bordereaux hétérogènes.
- **Coût et temps** : 6 à 10 semaines pour une personne, plus 2 000 à 5 000 € de relecture juridique [H].
- **Dépendances critiques** : accès aux données de portefeuille, validation du contenu par un expert, HDS si des données de santé sont présentes.

### 12. Défendabilité à 2 ans

- **Faible.**
- **Ce qui sera commoditisé** :
  - un LLM généraliste rédige une motivation en 10 secondes ;
  - CourtiGo et Lya (et les extranets) intégreront le suivi dans la durée.
- **Ce qui retiendrait le client** :
  - l'historique de preuves horodatées (coût de sortie) ;
  - les campagnes d'échéance qui génèrent du chiffre d'affaires ;
  - les modèles de questionnaires validés.
- **Rien de cela n'est un fossé** : c'est une rétention par inertie.

### 13. Raisons de ne PAS le faire / expériences d'invalidation

**Raisons de ne pas le faire** :
1. Lacune largement comblée : au moins 4 logiciels revendiquent la DDA et le devoir de conseil, dont 2 à partir de 29 €/mois (P13, P15, P16, P19).
2. Gratuité des substituts : modèles des associations (P20) et fiches générées par les extranets et grossistes (P34).
3. Catalyseur mou : recommandation non sanctionnable directement (P03), contrôles rares (P29), et une sanction phare qui vise une banque, pas une TPE (P11).
4. Aucune preuve de volonté de payer pour un outil spécifique au devoir de conseil (seulement pour des suites complètes).
5. Marché adressable petit (SOM de 25 à 380 k€ d'ARR) et prix plafonné par la concurrence.
6. Risque de responsabilité et peut-être de HDS sur la santé-prévoyance.

**Expériences d'invalidation (2 à 3 semaines)** :
- **E1** — 20 appels à des courtiers de 1 à 10 personnes. Si **plus de 60 %** génèrent déjà leurs fiches via un extranet, CourtiGo, Lya ou un modèle d'association et s'en déclarent satisfaits → **stop**.
- **E2** — question sur la revue à l'échéance. Si **moins de 25 %** des cabinets la jugent utile, même pour la vente croisée → abandon du wedge « durée ».
- **E3** — pré-vente à 39 €/mois sur 30 conversations qualifiées. **Moins de 3 engagements** (carte bancaire ou lettre d'intention signée) → **stop**.
- **E4** — e-mail à 3 associations (Endya, ANACOFI-Courtage, CNCEF Assurance) pour connaître leurs contrôles et leurs modèles. Si un modèle de suivi dans la durée gratuit est déjà diffusé → le wedge s'effondre.
- **E5** — vérifier sur une démo CourtiGo ou Lya s'ils gèrent déjà les campagnes d'actualisation des besoins. Si oui → **stop**.

### 14. Re-notation

Les notes de phase 1 (0-10) viennent de `scores-bruts.csv`. A-top.md affichait 71/100 avec une ventilation pondérée légèrement différente.

| Critère (poids) | Phase 1 (0-10) | Phase 2 (0-10) | Pondéré | Cause du changement |
|---|---|---|---|---|
| Douleur / budget (20) | 6 | **5** | 10,0 | La recommandation n'est pas directement sanctionnable (P03), les contrôles sont rares (P29) et la sanction phare vise la Société Générale (P11). La douleur réelle est le temps passé, déjà adressé à 29 €/mois. |
| Fréquence (10) | 8 | **7** | 7,0 | Fréquence hebdomadaire maintenue, mais le collectif obligatoire et les grands risques sont exclus (P02). |
| Preuves (15) | 6 | **5** | 7,5 | Les preuves de défaillances ACPR n'ont pas été revérifiées (P35). Il n'y a pas de preuve de volonté de payer pour un outil dédié. Les éditeurs qui vendent la DDA prouvent seulement une demande pour des suites complètes. |
| Distribution (15) | 7 | **6** | 9,0 | 27 500 COA identifiables (P06) et fondateur francophone. Mais aucune association ne distribue de logiciel et l'ANACOFI fournit ses propres modèles (P20, P22). |
| Lacune (10) | 5 | **2** | 2,0 | Lya, CourtiGo, Custy et SKY revendiquent la DDA ; les extranets et associations fournissent des fiches gratuites. |
| Faisabilité (10) | 8 | **8** | 8,0 | Inchangée : stack Relanzio réutilisable. Le contenu métier et le HDS éventuel sont les points durs. |
| Marge (5) | 8 | **7** | 3,5 | Marge brute élevée, mais prix plafonné autour de 30-40 €/mois. |
| Timing (5) | 9 | **6** | 3,0 | En vigueur depuis 10 mois : la vague de mise en conformité est probablement déjà absorbée par les éditeurs en place [H]. |
| Défendabilité (5) | 4 | **2** | 1,0 | Commoditisable par un LLM et par les éditeurs en place. |
| Risques (5) | 6 | **4** | 2,0 | Responsabilité éditeur, HDS possible, réaction des éditeurs en place, instabilité des associations (P24). |
| **Total** | **71 (A-top)** | | **53,0 / 100** | Confiance : moyenne (texte primaire non lu ; concurrents vérifiés par extraits). |

**Verdict** : **NO-GO en l'état** (« formalisation du devoir de conseil » pour courtiers). Un **GO conditionnel** reste possible pour une expérience de 2 à 3 semaines sur le wedge « conseil dans la durée et campagnes d'échéance en surcouche », qui réutilise le moteur de relance Relanzio, sous réserve que E1, E3 et E5 ne l'invalident pas.

---

## DD-B11 — Application pour testeurs de dispositifs anti-retour (backflow), multi-districts, US

Finaliste de remplacement. Date : 2026-10-29. Phase 2/4.

**Méthode.**
- 43 recherches WebSearch. Environ 20 d'entre elles (≈ 47 %) visaient l'invalidation : portails municipaux qui imposent la saisie, absence d'API, concurrents bon marché, rappels déjà envoyés par les villes, absence de plaintes, Syncta/Watts.
- WebFetch est bloqué : `r2utility.com` ne se résout pas dans cette session. Aucune page n'a été lue en entier : toutes les preuves sont des **extraits de recherche**.
- Preuves : `P01`…`P62` dans `DD-B11-preuves.csv` (identifiants `DD-B11-Pxx`) : 22 POUR, 26 CONTRE, 14 NEUTRE.
- Concurrents : 28 lignes dans `DD-B11-concurrents.csv`.

Étiquettes : **[OBS]** fait observé dans un extrait ; **[EST]** estimation ; **[HYP]** hypothèse ; **[INC]** inconnu.

---

## Verdict d'abord

- **Note : 53/100.** En phase 1, B-top affichait 69 ; le calcul de `scores-bruts.csv` donne 66.
- **Le problème est réel et bien documenté par des sources officielles.** Le testeur subit :
  - un canal de dépôt et un format différents dans chaque ville (BSI Online, VEPO, SwiftComply, Syncta, SAMS, SpryBackflow, C3, Tokay, Klir, PDF par email, papier) [OBS P04, P05, P10, P15 à P17, P19, P20, P58] ;
  - des frais par rapport de 0 à 38 USD [OBS P01 à P03, P06, P07, P11, P12, P24, P56] ;
  - des enregistrements annuels dans chaque ville, de 20 à 250 USD [OBS P23, P24, P57] ;
  - un rejet du rapport si la licence ou la calibration a expiré, ou si le dépôt est en retard [OBS P02, P13].
- **Mais le produit imaginé en phase 1 se heurte à trois murs :**
  1. **Les portails imposent une ressaisie testeur par testeur, sans API publique ni import par lot** [OBS P04, P05, P62]. La migration vers ces portails s'accélère en 2026 : Longmont en février, Seattle en août, Mesa en août [OBS P18 à P20]. Une app testeur ne supprime donc pas la saisie : elle en **ajoute** une, sauf à automatiser les portails (risque CGU, fragilité).
  2. **Le seul acteur qui supprime vraiment la double saisie existe déjà.** Syncta, propriété de Watts, fabricant de vannes, envoie en un clic les rapports aux purveyors équipés de Syncta [OBS P08]. Son prix testeur est très bas : 25 USD/mois de minimum, puis 4,95 USD par test [OBS P09].
  3. **Le marché testeur est déjà encombré d'offres à 10-50 USD/mois** : C3Backflow 15, R2 25, QuoteIQ 29,99, BackflowBoss 49, apps iOS de 9,99 [OBS P43 à P47]. Le « moteur de revenu » des rappels est en partie assuré gratuitement par les villes, qui écrivent elles-mêmes aux propriétaires et publient la liste des testeurs, parfois avec leurs prix [OBS P25 à P28].
- **Aucune plainte publique de testeurs n'a été trouvée sur Reddit ou dans les forums** [OBS P41]. Seul signal d'insatisfaction : un avis très négatif sur Syncta (pertes de données, pannes) [OBS P42].
- **Wedge résiduel crédible mais étroit** : un « copilote de dépôt multi-portails » couplé à une bibliothèque de formulaires par district (§5). Sa valeur dépend d'une question non vérifiée : **les CGU des portails tolèrent-elles un pré-remplissage assisté ?** [INC]
- **Verdict : à ne pas lancer en l'état.** Une seule expérience peu coûteuse pourrait relancer l'idée : 30 appels à des testeurs (§13).

---

### 1. ICP, acteurs et contexte d'achat

| Rôle | Qui | Statut |
|---|---|---|
| **ICP** | Entreprise de test backflow de 1 à 10 testeurs certifiés (plomberie, irrigation/paysage, protection incendie) qui dépose dans **au moins 3 juridictions aux canaux différents**. Volume de 300 à 3 000 tests par an. Zones denses en portails hétérogènes : sud de la Floride (BSI), DFW/Austin (VEPO, papier, enregistrements municipaux), Californie (CCCPH), Colorado, Washington. | [EST] |
| Taille des entreprises | Un testeur solo fait de 8 à 12 tests par jour sur une tournée dense [OBS P40, source faible]. Une entreprise de plomberie et de test à vendre à San Diego déclare 635 tests par an [OBS P39]. Le démarrage coûte peu : un cours, une jauge de 800 à 1 200 USD, une assurance [OBS P40]. **Il y a donc beaucoup de solos et de plombiers pour qui le test est une activité d'appoint.** Leur part réelle est inconnue [INC]. | OBS/HYP |
| Utilisateur | Le testeur sur le terrain (saisie), et l'office manager ou le conjoint pour le dépôt sur les portails, la facturation et les rappels | [HYP] |
| Prescripteur | Formateurs BPAT (TEEX, ICC, chapitres ABPA/ASSE), pairs, distributeurs de kits de test | [HYP] |
| Décideur économique | Le patron, qui est souvent aussi le testeur | [HYP] |
| Sponsor | L'office manager, qui ressaisit dans 3 à 6 portails | [HYP] |

**Objections attendues :**
1. « Je dois de toute façon saisir dans BSI ou VEPO, alors pourquoi saisir deux fois ? » C'est l'objection la plus forte [OBS P04, P05].
2. « La ville envoie déjà le rappel à mes clients » [OBS P25, P27].
3. « Syncta, R2 ou C3 fait ça pour 15 à 25 USD » [OBS P09, P43, P44].
4. « Mon Jobber ou mon QuoteIQ me suffit » [OBS P45].
5. « Je fais 200 tests par an, le papier suffit » [HYP].
6. « Vous êtes une boîte française ? »

**Contexte d'achat :**
- Achat en libre-service, entre 15 et 80 USD/mois [OBS sur les prix concurrents].
- Saisonnalité forte : avant le pic de printemps et d'été et pendant celui-ci, avec des tarifs « early bird » à Wentzville [OBS P56].
- **Fenêtre d'achat utile : l'hiver** (novembre à février), quand les testeurs ont le temps de changer d'outil [HYP].
- **Déclencheur fort : la bascule d'une ville vers un nouveau portail**, comme Longmont, Seattle ou Mesa en 2026 [OBS P18 à P20].

### 2. Job-to-be-Done et workflow actuel

**JTBD.** « Faire mes 600 tests annuels, être payé, que chaque rapport soit accepté du premier coup par la bonne ville, et que mes clients me rappellent moi, et pas un concurrent de la liste municipale, l'an prochain. »

**Workflow actuel** (reconstruit à partir des pages des villes ; aucun entretien) :
1. La ville envoie l'avis annuel au propriétaire avec la liste des testeurs agréés [OBS P25, P27]. Le propriétaire choisit un testeur, parfois sur le prix publié [OBS P26].
2. Le testeur planifie, se déplace et teste (20 à 45 minutes par assemblage [OBS P40, source faible]). Il note les mesures sur papier ou dans une app.
3. Il identifie l'utility qui dessert le bien, ce qui n'est pas trivial : Columbus n'accepte que ses propres clients [OBS P16].
4. Il dépose dans le canal de cette ville, selon le cas :
   - le portail du prestataire de la ville, avec saisie unitaire, choix de la jauge et paiement par carte [OBS P04, P05, P10] ;
   - le PDF de la ville par email, un email par adresse [OBS P17] ;
   - le papier [OBS P23] ;
   - parfois deux destinataires, la ville et le comté [OBS P58].
   Le délai est de 5 à 10 jours ; au-delà, le rapport est rejeté et il faut retester [OBS P13, P16].
5. Il entretient ses credentials dans chaque portail et chaque ville : licence, calibration annuelle de la jauge, enregistrement payant [OBS P04, P24, P33, P57].
6. Il facture le client, en répercutant parfois les frais de dépôt [OBS P22].
7. Il se rappelle, ou non, de relancer le client l'an suivant (tableur, calendrier) [HYP].

**Pourquoi c'est douloureux :**
- ressaisie multi-portails ;
- règles et délais propres à chaque ville ;
- risque de rejet ;
- credentials dispersés ;
- concurrence par les prix sur les listes publiques.

**Mais la douleur la plus forte (le portail) est imposée par la ville et non par l'outil du testeur.** Aucune plainte publique ne l'exprime [OBS P41].

**Fréquence.** Chaque assemblage est testé une fois par an ; 94 % des distributeurs exigent un test au moins annuel [OBS P60]. Pour le testeur, la saisie et le dépôt sont quotidiens en saison.

### 3. Coût de l'inaction

Formule (par entreprise et par an) :

`C = N × t_admin × h + N × p_perte × prix_test + N × r_rejet × prix_test + F_credentials`

| Variable | Valeur | Étiquette |
|---|---|---|
| N (tests par an) | 600 | [HYP] ; ordre de grandeur de P39 (635) |
| t_admin (saisie, dépôt, facture par test) | 10 min | [HYP] |
| h (coût horaire de l'office ou du patron) | 35 USD | [HYP] |
| p_perte (clients non relancés, partis chez un autre testeur de la liste) | 5 à 10 % | [HYP] |
| prix_test | 70 à 150 USD, retenu 100 | [OBS P40, source faible] |
| r_rejet (rapport rejeté ou en retard, retest non facturable) | 1 % | [HYP] |
| F_credentials (enregistrements multi-villes) | 20 à 250 USD par ville et par an | [OBS P24, P57] — inévitable, l'outil ne le réduit pas |

**Application :**
- Temps : 600 × 10/60 × 35 = **3 500 USD**.
- Clients perdus : 600 × 7,5 % × 100 = **4 500 USD**.
- Rejets : 600 × 1 % × 100 = **600 USD**.
- **Total ≈ 8 600 USD/an [EST]**, hors frais d'enregistrement.

**Part réellement capturable par une app testeur :**
- la moitié du temps au plus, puisque la saisie portail reste ;
- une partie des pertes, puisque la ville relance déjà ;
- soit environ **2 000 à 4 000 USD/an [EST]**.

C'est suffisant pour justifier 30 à 80 USD/mois. **Mais Syncta, R2 ou C3 capturent la même valeur pour 180 à 300 USD/an.**

### 4. Concurrents (détail : `DD-B11-concurrents.csv`, 28 lignes)

**Directs, côté testeur** [OBS, extraits] :

| Acteur | Prix observé | Limite ou plainte |
|---|---|---|
| **Syncta (Watts)** | Min 25 USD/mois, 5 tests gratuits puis 4,95 USD/test ; 99 USD/testeur ; 549 USD illimité [P09] | Double face : SynctaOne dépose chez les purveyors Syncta [P08]. Capterra 4,3/5, valeur 3,9/5 ; pertes de données, pannes, support dégradé, migration longue [P42] |
| R2 Utility | 25 USD/mois Basic ; 99/199/300 selon les pages [P44] | Aucune intégration BSI trouvée ; grille incohérente |
| C3Backflow | 15 USD/mois, version gratuite [P43] | 0 avis |
| QuoteIQ | 29,99 à 699 USD/mois [P45] | CRM horizontal ; classement auto-promotionnel |
| BackflowBoss | 49 USD/mois, cité par QuoteIQ [P45] | Site non trouvé |
| Backflow Pro (iPad) | 29,99 / 49,99 / 71,99 USD ; 3,99 USD/mois [P46] | Libellés incohérents |
| The Backflow Assistant | 9,99 USD/mois [P47] | Solo seulement |

**Noms fournis par la consigne et non trouvés** : « Backflow Test Pro », « BackflowManager », « Rapid Tester ». Ils ont été cherchés explicitement, sans aucun résultat [INC]. Ils ne figurent pas dans le CSV.

**Indirects :**
- FSM généralistes : Jobber 39 USD/utilisateur, Housecall Pro 59, Markate 69, Workiz 225, FieldEdge environ 600 pour 5 personnes, ServiceTitan sur devis, tous cités par QuoteIQ [P45]. Aucun formulaire backflow natif n'a été trouvé.
- HindSite, côté irrigation (prix inconnu).
- **Portails côté utility**, qui sont à la fois le canal imposé et un concurrent fonctionnel (licences, kits, historique) : BSI Online, VEPO, SwiftComply, SAMS, SpryBackflow, Tokay, Klir, C3. Au Canada, MTS FAST coûte 49,99 CAD/an au testeur et couvre toutes les municipalités du réseau [P48].

**Substituts :**
- PDF ou papier de la ville, tableur et calendrier [HYP : substitut dominant chez les solos].
- Formulaires GoCanvas ou Typeform [P59].
- **Rappels envoyés gratuitement par la ville** [P25, P27].

**Plaintes publiques :**
- un avis Capterra sur Syncta [P42] ;
- **aucune sur Reddit, PlumbingZone ou les forums** (4 recherches dédiées) [P41] ;
- aucune opposition de testeurs aux frais de portail trouvée dans les comptes rendus de conseils municipaux. Seul Des Plaines traite les frais comme une hausse de redevance [P52].

### 5. Différenciation

**Wedge possible : « Saisissez une fois, déposez partout ».**
1. **Une bibliothèque de formulaires et de règles par district** : PDF officiel pré-rempli, destinataire, délai, frais, credentials requis. Aucun produit de ce type n'a été trouvé [OBS recherche P58 ; absence ≠ preuve].
2. **Un copilote de dépôt** : extension navigateur qui pré-remplit BSI, VEPO, SwiftComply ou Syncta à partir du test stocké, le testeur validant et payant lui-même. Faisabilité technique et CGU [INC].
3. **Un coffre de credentials multi-villes** : licence, calibration, enregistrements, avec alertes avant expiration [OBS P02, P35 sur le besoin].
4. **Des rappels clients envoyés avant l'avis de la ville**, avec lien de réservation : capter le client avant qu'il consulte la liste municipale [HYP].

**Time-to-value :** l'import du fichier clients et du premier lot de tests prend une journée [HYP]. Le principal frein à la migration chez Syncta est justement le temps de saisie des clients existants [OBS P42].

**ROI mesurable :**
- minutes de dépôt par test ;
- taux de rejet ;
- taux de rétention des clients d'une année sur l'autre.

**Raison de changer :**
- la bascule d'une ville vers un nouveau portail ;
- l'insatisfaction envers Syncta [P42] ;
- l'expansion vers une nouvelle ville.

**Limite :** sans le copilote (point 2), le produit n'est qu'un énième outil de rapports à 15-50 USD.

### 6. Taille de marché (bottom-up, fourchettes larges)

**Aucun décompte national des testeurs certifiés n'a été trouvé** : 6 recherches ; TCEQ, ABPA, ASSE, NY, WA et CA ne publient pas de total dans les extraits [INC].

**Points d'appui :**
- Californie : 1,5 à 2,5 M d'assemblages testables, selon une estimation d'opinion sans décompte officiel [OBS-faible P37].
- Los Angeles : plus de 51 000 dispositifs et plus de 700 testeurs certifiés, attribution incertaine [OBS-faible P38].
- Une entreprise fait environ 635 tests par an [P39].
- Les villes et États publient des listes de testeurs (NY par comté, WA, nombreuses villes de CA, TX, OH) : un comptage manuel serait possible [OBS P29 à P31].

**Calcul :**

| Étape | Bas | Haut | Étiquette |
|---|---|---|---|
| Assemblages testés par an aux US (CA = 12 à 20 % du total) | 7,5 M | 20 M | [EST] |
| Tests par entreprise et par an (moyenne) | 1 500 | 300 | [HYP] |
| Entreprises qui font du test | ≈ 5 000 | ≈ 65 000 | [EST] |
| Fourchette centrale retenue | 10 000 | 30 000 | [EST] |
| ICP (au moins 300 tests et au moins 3 canaux différents) : 30 à 40 % | 3 000 | 12 000 | [HYP] |
| ARPA | 480 USD/an | 960 USD/an | [HYP] |

**Résultats :**
- **TAM** (toutes entreprises × 600 USD) : **6 à 18 M USD/an** [EST].
- **SAM** (ICP × ARPA) : **1,4 à 11,5 M USD/an** [EST].
- **SOM à 3 ans** (1 à 3 % du SAM, face à Syncta et aux offres à 15-25 USD) : **50 à 300 clients, soit 30 à 250 k USD d'ARR** [EST].

**Conclusion : une niche de revenu complémentaire, pas un business autonome confortable pour 2 à 3 personnes.**

### 7. Pricing

**Recommandé : Solo 39 USD/mois** (1 testeur, tests illimités, bibliothèque de formulaires de 3 districts, rappels) et **Équipe 89 USD/mois** (jusqu'à 5 testeurs, districts illimités, copilote de dépôt). Remise de 2 mois en annuel. Celui qui signe est le patron, en libre-service par carte.

**Alternatives :**
1. **À l'usage** : 0,99 USD par test déposé, minimum 19 USD/mois. Ce modèle colle à la saisonnalité et reste sous les 4,95 USD de Syncta [OBS P09].
2. **Forfait annuel** de 299 USD par testeur, prépayé en hiver. Cela finance la saison et réduit le churn saisonnier.

**Exemple de ROI** (entreprise de 600 tests, offre Équipe) :
- Coût : 89 × 12 = 1 068 USD.
- Gain : 50 h de dépôt économisées × 35 USD = 1 750 USD, plus 15 clients retenus × 100 USD = 1 500 USD, soit **3 250 USD**.
- **ROI d'environ 3× [EST]**, à condition que le copilote fonctionne réellement.

### 8. Intrants du modèle économique

| Intrant | Valeur | Étiquette |
|---|---|---|
| Prix moyen | 40 à 80 USD/mois | [HYP] (calé sur 15 à 99 USD observés) |
| Hébergement (Supabase, stockage PDF) | 1 à 3 USD par client et par mois | [EST] |
| SMS et emails de rappel | moins de 2 USD par client et par mois (environ 600 rappels par an et par client) | [HYP] (tarifs SMS non vérifiés dans cette session) |
| IA / OCR (scan de vieux rapports papier, mapping des PDF) | moins de 1 USD par client et par mois | [HYP] |
| Maintenance de la bibliothèque de districts | 2 à 4 h par semaine, poste fixe et croissant | [EST] — **coût caché principal** |
| Onboarding (import clients et assemblages) | 1 à 3 h par client | [HYP] ; P42 montre la difficulté |
| Support | Pic au printemps ; attente d'un support par téléphone, aux heures US | [HYP] |
| Marge brute | 80 à 88 % | [EST] |
| CAC | 150 à 600 USD (outbound sur listes + appels) | [HYP] |
| Cycle de vente | 1 à 14 jours, en libre-service après démo | [HYP] |
| Churn | 2 à 4 % par mois, avec un pic de fin de saison | [HYP] |
| Payback | 4 à 12 mois | [EST] |

### 9. Risques

- **Dépendance aux portails et CGU** : le copilote de pré-remplissage pourrait violer les conditions de BSI, VEPO, SwiftComply ou Syncta, ou être cassé par un changement d'interface ou un CAPTCHA [INC]. **C'est le risque n°1.**
- **Réaction des éditeurs en place** :
  - Watts/Syncta contrôle les deux côtés et peut baisser son prix testeur ou étendre SynctaOne [OBS P08, P09] ;
  - les portails ajoutent déjà côté testeur la gestion des certifications et des kits (SAMS Seattle) [OBS P19].
- **Responsabilité** : le rapport de test est un document réglementaire signé par le testeur. L'outil ne doit jamais présumer un « pass ». Une erreur de mapping de formulaire peut conduire à un rapport rejeté, voire faux [HYP].
- **Réglementation** :
  - pas de suspension ; tendance au durcissement en Californie (CCCPH en vigueur au 1/7/2024 ; certification ISO 17024 au 1/7/2027) [OBS P34, P35] ;
  - de rares contestations de fond, comme l'article d'opinion « racket » en Californie [OBS P37] ;
  - un risque marginal d'assouplissement local (test tous les 5 ans) [OBS P41].
- **Données** :
  - données personnelles des clients (nom, adresse, téléphone) ;
  - pas de HIPAA ;
  - CCPA pour les clients californiens ;
  - **le RGPD s'applique à une société établie dans l'UE**, même pour des personnes concernées aux US : DPA à prévoir [HYP juridique].
- **Saisonnalité** : revenus et usage concentrés de mars à septembre [HYP].
- **Fiabilité de l'IA** : faible enjeu si l'IA ne sert qu'au mapping de formulaires, avec validation humaine.

### 10. Distribution

**Canal 1 — Outbound sur les listes publiques (le meilleur atout de l'idée).**
- Sources :
  - NY DOH publie les testeurs certifiés comté par comté [OBS P30] ;
  - en CA, BCVWD, Rainbow MWD, San Diego et San Francisco publient des listes, BCVWD avec emails, téléphones, n° de certification et dates d'expiration [OBS P29] ;
  - en WA : Sumner, Oak Harbor, Walla Walla, Lacey [OBS P31] ;
  - Columbus et Tucson [OBS P25].
- On peut constituer une base de plusieurs milliers de testeurs, avec leurs villes de rattachement : **un testeur présent sur plusieurs listes est par définition multi-juridictions**.
- Message : *« Vous déposez à [Ville A] sur BSI, à [Ville B] sur VEPO et à [Ville C] par PDF ? Saisissez le test une fois sur votre téléphone : on remplit le bon formulaire et le bon portail, et votre client reçoit son rappel avant la lettre de la ville. »*

**Canal 2 — Écosystème de formation et de certification.**
- Formateurs BPAT (TEEX, ICC) [OBS P32 sur leur existence].
- Chapitres ABPA : conférence de mai 2026 à Las Vegas, une trentaine d'exposants [OBS P53].
- Laboratoires de calibration de jauges [HYP].
- Contenu SEO « backflow test form [ville] » : chaque district de la bibliothèque devient une page [HYP].

**10 conversations d'acheteurs :**
1. Extraire 300 testeurs présents sur au moins 2 listes de la même région (par exemple CA Inland Empire).
2. Envoyer un email court, puis appeler entre 15 h et 23 h, heure de Paris, de novembre à février.
3. Proposer « 20 minutes sur vos dépôts, bon d'achat de 50 USD ».
4. Objectif : 10 à 15 appels pour 300 contacts [HYP].

**Premières ventes sans audience :**
- prévente annuelle (299 USD) aux testeurs interviewés, avec leurs 3 districts configurés à la main ;
- s'appuyer ensuite sur le bouche-à-oreille entre testeurs d'une même zone [HYP].

**Faisabilité pour un fondateur non-US : moyenne-faible.**
- Atouts : libre-service, petits montants, listes publiques, aucune visite terrain nécessaire.
- Obstacles :
  - population de métiers manuels, peu en ligne, habituée au téléphone ;
  - décalage horaire ;
  - confiance (société étrangère, données clients) ;
  - entité US et numéro US nécessaires ;
  - saison qui laisse 4 mois par an pour vendre ;
  - la connaissance fine des règles locales doit s'acquérir à distance, district par district.

### 11. Faisabilité

**MVP (8 à 12 semaines pour 1 développeur [EST]) :**
- PWA mobile hors ligne : saisie de test par type d'assemblage (RP, DC, PVB, SVB), signature, photos.
- Base clients, assemblages et historique.
- Coffre de credentials (licences, calibrations, enregistrements, alertes).
- Moteur de PDF qui remplit les formulaires officiels : mapping des champs, éventuellement assisté par LLM puis vérifié à la main.
- Rappels email et SMS avec réservation.
- Facturation Stripe.
- Import CSV ou Excel.

**Phase 2 :** extension navigateur de pré-remplissage des portails.

**Intégrations indispensables :**
- Formulaires PDF de 20 à 50 districts d'une région pilote : 3 à 4 semaines [EST].
- Portails BSI, VEPO et SwiftComply via l'extension [INC sur la faisabilité et les CGU].
- Aucune API publique côté testeur [OBS P62]. Le seul import de fichiers trouvé est côté utility (Springbrook) [OBS P49] : c'est un partenariat possible, mais sur un cycle de vente public.

**Briques Relanzio réutilisables :**
- moteur de relance (Brevo) ;
- Supabase et Stripe ;
- génération de PDF.

**Partie difficile :**
- maintenir la bibliothèque de centaines de districts qui changent (Longmont, Seattle et Mesa ont changé en 2026) ;
- rendre l'automatisation des portails robuste et licite.

**Coût :** 15 à 40 k€ de temps de développement pour le MVP et la région pilote [EST].

**Dépendances critiques :** les interfaces et les CGU des portails tiers.

### 12. Défendabilité à 2 ans

**Ce qui protège un peu :**
- la bibliothèque de districts maintenue, qui est un actif de données ;
- l'historique des assemblages et des clients du testeur, qui crée un coût de changement réel [OBS P42 : migrer est pénible] ;
- l'effet réseau local (testeurs d'une même zone).

**Ce qui commoditise :**
- **les LLM rendent le mapping de PDF trivial pour tous les concurrents** ;
- Syncta peut étendre SynctaOne ou baisser ses prix ;
- les portails ajoutent des espaces testeurs gratuits (SAMS) [OBS P19] ;
- les FSM (QuoteIQ, Jobber) peuvent ajouter un formulaire backflow ;
- chaque migration d'une ville vers un portail unique réduit la valeur de la bibliothèque PDF.

**Pourquoi le client resterait :** ses données, ses rappels et l'habitude. Ce verrouillage est faible face à des alternatives à 15 USD.

### 13. Raisons de NE PAS le faire, et expériences d'invalidation

**Raisons de ne pas le faire :**
1. **Les portails imposent la ressaisie, sans API** : le cœur de la douleur est hors de portée d'une app testeur sans automatisation risquée [P04, P05, P62].
2. **Watts/Syncta est déjà intégré des deux côtés**, à un prix testeur plancher [P08, P09].
3. **Des concurrents à 10-50 USD/mois** fixent un prix bas [P43 à P47].
4. **Les villes relancent elles-mêmes** les propriétaires [P25, P27, P28].
5. **Aucune plainte publique** ni preuve de volonté de payer davantage [P41].
6. **Le SAM est petit** (1,4 à 11,5 M USD) et la distribution exige du téléphone aux heures US, sur 4 mois utiles.

**Expériences (à faire avant toute ligne de code, environ 3 semaines) :**
1. **30 appels** à des testeurs présents sur au moins 2 listes publiques.
   - **Tuer l'idée** si moins de 40 % déposent dans au moins 3 canaux différents, ou si plus de 60 % se disent satisfaits de Syncta, R2 ou C3.
2. **Vérifier les CGU** de BSI Online, VEPO, SwiftComply et Syncta, et tester sur un compte le pré-remplissage navigateur (formulaires, CAPTCHA).
   - **Tuer le wedge** si c'est interdit ou bloqué.
3. **Landing page et 300 emails** sur une région.
   - **Tuer** si moins de 3 % de réponses positives ou moins de 5 démos.
4. **Prévente** : 10 paiements annuels de 299 USD avant le 1/3/2027.
   - **Tuer** si moins de 5 paiements.

### 14. Re-notation

Phase 1 : notes brutes de `scores-bruts.csv` (6, 8, 6, 7, 5, 9, 8, 3, 6, 8), soit un total pondéré de 66. B-top affichait 69 ; l'écart vient d'un arrondi des points dans B-top.

| Critère (poids) | Phase 1 (0-10) | Phase 2 (0-10) | Points | Cause du changement |
|---|---|---|---|---|
| Douleur et budget (20) | 6 | 5 | 10 | Douleur confirmée par sources officielles [P13, P15 à P17, P24], mais elle est surtout imposée par les portails, que l'app ne supprime pas [P04, P05] ; les testeurs répercutent les frais sur le client [P22] ; ROI capturable de 2 à 4 k USD par an |
| Fréquence (10) | 8 | 8 | 8 | Inchangée : test annuel [P60], dépôt quotidien en saison |
| Preuves (15) | 6 | 5 | 7,5 | Workflow très bien documenté ; volonté de payer seulement indirecte (abonnements concurrents) ; aucune voix de testeur sauf un avis Syncta [P41, P42] |
| Distribution (15) | 7 | 5,5 | 8,25 | Listes publiques confirmées, avec emails [P29 à P31] (+) ; mais vente par téléphone aux heures US, saison courte, confiance envers une société étrangère (−) |
| Lacune (10) | 5 | 3 | 3 | Syncta à double face, R2, C3, QuoteIQ, BackflowBoss, apps iOS, portails gratuits côté testeur, rappels des villes [P08, P09, P19, P25, P43 à P48] |
| Faisabilité (10) | 9 | 6 | 6 | Le CRUD est simple, mais la valeur exige une bibliothèque multi-districts maintenue et une automatisation des portails sans API [P62] |
| Marge (5) | 8 | 8 | 4 | COGS faibles ; maintenance de la bibliothèque en coût fixe |
| Timing (5) | 3 | 4 | 2 | Légère hausse : CCCPH Californie [P34], transition de certification au 1/7/2027 [P35], migrations de portails en 2026 [P18 à P20], qui sont des déclencheurs de changement d'outil |
| Défendabilité (5) | 6 | 3 | 1,5 | Mapping de PDF commoditisé par les LLM ; Watts et les portails peuvent absorber la fonction |
| Risques (5) | 8 | 5 | 2,5 | CGU et fragilité des portails, dépendance aux plateformes tierces, réaction de Watts, RGPD pour un éditeur UE |
| **Total** | **66** (B-top : 69) | — | **52,75 ≈ 53** | |

**Confiance : moyenne.**
- Faits de workflow et de prix : nombreux, primaires (pages des villes), mais lus en extrait.
- Taille de marché : faible (aucun décompte national).
- Volonté de payer : faible (aucun entretien).

---

## DD-B09 — Registre de conformité des fluides frigorigènes par équipement : B-09 (US, AIM Act ER&R) + B-10 (FR, Cerfa 15497 / F-gas)

Due diligence de phase 2 · 2026-10-29.

Preuves : `DD-B09-preuves.csv` (P01 à P39). Concurrents : `DD-B09-concurrents.csv`.

**Méthode.** Environ 34 recherches web, dont plus de 40 % visaient à invalider l'idée. WebFetch est bloqué (epa.gov, ecologie.gouv.fr et data.gouv.fr renvoient ENOTFOUND ou 403). Toutes les preuves proviennent donc d'extraits de recherche, qu'aucune page n'a été ouverte pour confirmer.

**Étiquettes.** [O] fait observé (sourcé) · [E] estimation · [H] hypothèse · [?] inconnu.

## Verdict en tête

| Option | Note phase 1 | Note phase 2 | Verdict |
|---|---|---|---|
| B-09 US (ER&R) | 70 (B-top) / 68 (barème brut) | **46** | NO-GO pour un solo francophone |
| B-10 FR (Cerfa / registre / PAC) | 67 (B-top) / 64 (barème brut) | **52** | NO-GO en produit autonome ; au mieux un test de 4 semaines |

**Note retenue pour le finaliste : 52/100.**

**Marché à attaquer d'abord, si l'on attaque : la France.** Ce choix ne tient pas à la qualité du marché français. Il tient à la dégradation encore plus forte du marché US :
- la règle est en cours de reconsidération ;
- le wedge exact est déjà vendu entre 29 et 89 USD par mois ;
- des applications gratuites existent ;
- les FSM ont ajouté la fonction ;
- la distribution est difficile depuis la France.

## Ce que la phase 2 change par rapport à la phase 1

1. **Erreur de date corrigée.** La réparation des fuites ER&R s'applique à tous les appareils couverts (15 lb ou plus) depuis une date unique, le **1er janvier 2026** [P01]. Le **1er janvier 2027** ne concerne que la **détection automatique des fuites** (ALD) des systèmes de froid commercial ou IPR existants de **1 500 lb ou plus** installés entre 2017 et 2025 [P02, P03]. Ces systèmes appartiennent à de grands sites, pas à la clientèle d'un petit contractor. Le catalyseur « 2027 » de la phase 1 est donc largement inexistant pour l'ICP visé. Autres dates : réfrigérant régénéré obligatoire au 1/1/2029 pour l'entretien des systèmes de supermarché, bouteilles jetables au 1/1/2028 [P04].
2. **Reconsideration EPA : l'hypothèse de la phase 1 est confirmée.**
   - Le 26/05/2026, l'EPA a proposé d'exclure les TRU (transport frigorifique) des obligations de réparation [P05], à la suite d'une pétition de Carrier du 21/04/2026 [P07].
   - L'EPA annonce qu'elle « s'attaquera ensuite » à la **gestion des fuites**, avec la **distribution alimentaire** et la climatisation résidentielle comme secteurs sensibles [P06].
   - La NGA et la FMI (épiciers et supermarchés) demandent l'alignement sur les seuils SAO de la Part 82, soit 50 lb au lieu de 15 lb [P08, P09].
   - Précédent : en 2020, la même famille politique avait déjà retiré l'extension HFC des règles de fuite [P10].
   - Aucun recours contentieux contre ER&R n'a été trouvé [P11].
   - Aucune proposition « leak management » n'était publiée à la date de la recherche [?].
   - **Conséquence.** Le segment des 15 à 50 lb (chambres froides, groupes de restaurants et de supérettes) est le seul vraiment nouveau pour les petits contractors, car les plus de 50 lb sont suivis depuis des années sous la Part 82. C'est précisément ce segment que les pétitions veulent supprimer.
3. **Le cœur produit est commoditisé en France.**
   - L'État a lancé l'**application gratuite « Fluides Frigorigènes »** (DGPR), présentée le **22 avril 2026**. Elle couvre la saisie des fiches d'intervention, la signature du détenteur qui verrouille la fiche, et le **bilan annuel des fluides** [P25, P26, P27].
   - Trackdéchets (BSFF) est gratuit et obligatoire depuis 2023 [P30].
   - L'« inconnu clé » de la phase 1 est levé : la fiche électronique est acceptée [P32], et c'est l'État lui-même qui la propose.
4. **Les FSM US ont la fonction.** ServiceTitan propose un formulaire Refrigerant Tracking [P17], BuildOps un suivi réfrigérant par équipement [P18]. ServiceChannel couvre les chaînes, où le donneur d'ordre impose l'outil au prestataire [P19].

### 1. ICP, utilisateur, prescripteur, décideur, sponsor, objections, contexte d'achat

| | US (B-09) | FR (B-10) |
|---|---|---|
| ICP | Contractor de froid commercial de 1 à 15 techniciens, clients restaurants, supérettes, épiceries indépendantes, chambres froides de 15 à 50 lb ; hors chaînes équipées de ServiceChannel ou Trakref [H] | Frigoriste ou climaticien de 1 à 10 techniciens, titulaire d'une attestation de capacité, froid commercial et PAC tertiaire ; pas encore de FSM complet (Praxedo, etc.) [H] |
| Utilisateur | Technicien certifié Section 608 (saisie d'une recharge) ; dispatcher | Technicien (fiche), assistante ou gérant (bilan annuel, audit de l'organisme agréé) |
| Prescripteur | Grossistes frigorifiques, RSES/ACCA, formateurs 608 [H] | Organisme agréé (audit annuel), CAPEB/UECF-FFB/SNEFCCA, distributeurs de fluides [H] |
| Décideur économique | Propriétaire du contractor | Gérant |
| Sponsor | Client propriétaire de l'équipement qui exige des registres [H] | Organisme agréé qui signale les manques en audit [H] |
| Objections | « ServiceTitan le fait déjà » ; « la règle va sauter » ; « 608Log est gratuit » ; « c'est le problème du propriétaire » | « L'appli de l'État est gratuite » ; « j'ai C'Fluide à 22 € » ; « mes carnets Cerfa suffisent » ; « 450 € d'amende au pire » |
| Contexte d'achat | Achat en ligne à moins de 100 USD par mois, essai gratuit, sans cycle | Achat de TPE, démo téléphonique, déclenché par un audit ou le changement de régime du 1/1/2027 [P28] |

**Obligations : propriétaire ou technicien.** Aux US, l'obligation de réparer, de vérifier et de conserver les registres pèse d'abord sur le **propriétaire ou l'exploitant** (supermarché, restaurant). Le technicien doit calculer le taux de fuite et documenter son intervention. Un registre détenu par le contractor et inaccessible au propriétaire ne suffit pas [P21, source commerciale, confiance faible].

Cela crée une tension. Le contractor est l'acheteur naturel d'un outil de terrain, mais le risque juridique est porté par le client. Les grandes chaînes imposent leur portail [P19].

En France, l'opérateur attesté établit la fiche. Le détenteur la co-signe au-dessus des seuils, conserve l'original et tient le registre de l'équipement. Les deux conservent la fiche 5 ans [P33].

### 2. Job-to-be-Done et workflow actuel

**JTBD.** « Quand j'ajoute du réfrigérant sur un appareil, je veux savoir immédiatement si le seuil de fuite est dépassé et produire la preuve conforme. Je veux aussi que mon client et moi soyons couverts en cas de contrôle, sans double saisie. »

**Workflow US actuel.**
1. Le technicien recharge.
2. Il note les livres ajoutés sur le bon d'intervention (papier ou champ FSM).
3. Le calcul du taux de fuite se fait de tête ou sur un calculateur, quand il est fait (annualisé ou moyenne glissante sur 365 jours).
4. Si le seuil est dépassé : réparation sous 30 jours, vérification initiale et de suivi, inspections périodiques.
5. Le bureau facture et archive 3 ans.
6. Le propriétaire doit garder une copie.

**Workflow FR actuel.**
1. Fiche Cerfa 15497*04 par intervention (papier ou application).
2. Signature du détenteur.
3. BSFF dans Trackdéchets pour le fluide récupéré.
4. Report dans le registre de l'équipement.
5. Planification des contrôles d'étanchéité selon les tonnes équivalent CO2 (F-gas 2024/573), et entretien biennal des PAC de 4 à 70 kW.
6. Bilan annuel des mouvements de fluides à l'organisme agréé.

**Douleur.** Double ou triple saisie (fiche, BSFF, registre, bilan), calcul de seuils, échéances à suivre. Fréquence : à chaque intervention avec manipulation de fluide, soit plusieurs fois par semaine et par technicien [E].

**Ce qui a diminué la douleur en 2026.** En France, l'application de l'État fusionne fiche et bilan [P25]. Aux US, les calculateurs sont gratuits [P14, P15].

### 3. Coût de l'inaction

**Contractor US.**

> Coût annuel = (temps de calcul et d'archivage × recharges par an × coût horaire) + P(perte d'un compte commercial faute de registres) × marge du compte + P(sanction) × amende

| Paramètre | Valeur | Étiquette |
|---|---|---|
| Temps par recharge | 10 min | [H] |
| Recharges sur des appareils de 15 lb ou plus | 150 par technicien et par an | [H] |
| Coût horaire chargé | 60 USD | [H] |
| Coût temps, par technicien | environ 1 500 USD par an | [E] |
| Amende | 44 539 ou 59 114 USD par jour et par violation selon la source | [O, contradictoire, non vérifié auprès de l'EPA] |
| Probabilité de contrôle | faible, dans un contexte de déréglementation et d'« assistance à la conformité » | [H] |

**Propriétaire de supermarché.** Le profil type EPA est de 3 500 lb à 25 % de fuite par an, soit environ 875 lb perdues par an [P22, O, ancien]. La valeur en USD dépend d'un prix du réfrigérant non sourcé ici [?]. Cette douleur réelle et chiffrable appartient au propriétaire, que ServiceChannel, Trakref et les fournisseurs d'ALD servent déjà.

**Frigoriste FR.**

> Coût annuel = temps de double saisie + amende R543 (450 € par manquement, 3e classe) [P34, O] + risque de non-renouvellement de l'attestation en audit [H]

Avec l'application gratuite de l'État, le coût évité par un outil payant se limite au temps gagné par rapport à cette application [?]. C'est faible.

### 4. Concurrents (détail dans le CSV)

| Acteur | Marché | Prix | Lecture |
|---|---|---|---|
| Ref LeakLog | US | 29 / 59 / 89 USD par mois [O] | Le wedge exact, déjà construit, au prix plancher |
| 608Log, LeakClock, EPA Refrigerant Tracker, hvacaudit | US | Gratuit ou inconnu [O] | Afflux d'outils indépendants depuis 2026 : commoditisation |
| ServiceTitan, BuildOps | US | Inclus, prix non publié | Registre par équipement natif ; calcul automatique non démontré pour ServiceTitan |
| ServiceChannel, Trakref (Fexa) | US | Sur devis | Côté propriétaire ; impose la saisie au prestataire |
| Oxmaint, Nuvolo, Blynk, Axiom | US | Prix contradictoires | GMAO et capteurs |
| Jobber, Housecall Pro, FieldEdge | US | ? | Résidentiel, exempté de toute façon [P12] |
| Appli « Fluides Frigorigènes » (État) | FR | **Gratuit** [O] | Fiche, signature, bilan ; pas d'intégration tierce, export CSV |
| Trackdéchets | FR | Gratuit, obligatoire | BSFF, avec une API |
| C'Fluide | FR | 22 à 204 € par mois, utilisateurs illimités [O] | Spécialiste ; plus de 400 clients en 2018 |
| Extractivs, F.i360, Praxedo | FR | ? | Cerfa intégré au FSM |
| Kizeo Forms | FR | 12 à 22 € par utilisateur et par mois [O] | Formulaires génériques |

**Plaintes utilisateurs.** Aucune plainte publique trouvée (Reddit et forums non remontés). C'est une preuve contraire faible mais réelle.

### 5. Différenciation possible

Les wedges restants sont étroits :
- **(a) FR, une couche au-dessus des outils publics.** Registre de l'équipement côté détenteur, planification des contrôles d'étanchéité selon les tonnes équivalent CO2, attestation d'entretien PAC, portail client. S'y ajoute une passerelle vers l'application de l'État (CSV) et Trackdéchets (API BSFF [P31]) pour supprimer la double saisie.
- **(b) US, un portail propriétaire de restaurants ou supérettes alimenté par le contractor**, marqué au nom du contractor. Il exporte les « records » exigés du propriétaire.

**Time-to-value.** Moins d'une heure [E].

**ROI mesurable.** Uniquement en temps [H]. La raison de changer est faible dans les deux cas. En France, l'outil gratuit de l'État pose un plafond de prix psychologique. Aux US, Ref LeakLog et les applications gratuites, plus l'incertitude réglementaire, jouent le même rôle.

### 6. Taille de marché bottom-up

**US.**

| Étape | Valeur | Étiquette |
|---|---|---|
| NAICS 238220 | 190 808 entités, date inconnue | [O, P23] |
| Part froid commercial | 5 à 10 % | [H] |
| Acheteurs (TAM) | 9 500 à 19 000 | [E] |
| Prix | 50 à 90 USD par mois | [E] |
| TAM | 5,7 à 20,5 M USD par an | [E] |
| SAM : 1 à 15 techniciens, sans ServiceTitan ni BuildOps, clientèle de 15 lb ou plus hors chaînes | 3 000 à 8 000 contractors, soit 1,8 à 8,6 M USD | [H] |
| SOM à 3 ans, solo depuis la France | 40 à 150 clients, soit 25 à 160 k USD d'ARR | [E] |
| Risque binaire | Si le seuil remonte à 50 lb, le SAM peut être divisé par deux ou plus | [H] |

Le nombre de techniciens certifiés Section 608 est **inconnu** : l'EPA ne publie pas de total [P24].

**France.**

| Étape | Valeur | Étiquette |
|---|---|---|
| Établissements attestés | **inconnu**. La liste REP-GF existe sur data.gouv.fr [P38], mais son API était inaccessible | [?] |
| Fourchette de travail | 15 000 à 30 000 établissements | [H, non sourcé] |
| Borne basse du marché payant | C'Fluide, plus de 400 clients en 2018 | [O, P36] |
| Prix | 30 à 60 € par mois | [E] |
| TAM | 5,4 à 21,6 M€ | [E] |
| SAM : TPE de 1 à 10 techniciens, sans FSM, n'adoptant pas l'application gratuite | 3 000 à 8 000, soit 1,1 à 5,8 M€ | [H] |
| SOM à 3 ans | 80 à 250 clients, soit 30 à 150 k€ d'ARR | [E] |
| Extension UE (F-gas 2024/573) | Formats nationaux différents | [?] |

### 7. Pricing

**Recommandé (FR) : 29 € HT par mois par entreprise, jusqu'à 3 techniciens, puis 9 € par technicien.** Inclut registre, planning des contrôles et de l'entretien PAC, portail détenteur et passerelle vers l'application de l'État et Trackdéchets. Le gérant signe.

**Alternatives :**
- (1) 290 € par an avec paiement annuel au moment du bilan (janvier) ;
- (2) facturation au parc : 1 € par équipement suivi et par mois, plafonnée.

**US, si jamais :** 39, 69 ou 99 USD par mois, calé juste au-dessus de Ref LeakLog, ce qui donne peu de raisons de payer plus.

**ROI (FR).** 2 techniciens × 4 fiches par semaine × 46 semaines × 5 min économisées [H] ≈ 31 h par an × 45 € [H] ≈ **1 400 € par an**, contre 348 € par an. Le ROI est positif sur le papier, mais l'application gratuite capture probablement la majeure partie de ce gain.

### 8. Intrants du modèle économique

| Intrant | Valeur | Étiquette |
|---|---|---|
| ARPA | FR 35 € par mois ; US 60 USD par mois | [E] |
| COGS | Hébergement Supabase et PDF moins de 1 € par compte et par mois ; IA optionnelle (OCR de plaques signalétiques) 0,1 à 0,5 € ; support 1 à 3 € | [E] |
| Marge brute | 85 à 90 % | [E] |
| CAC | FR 150 à 400 € (prospection sur liste publique, partenariats d'organismes) ; US 300 à 800 USD (ads et SEO saturés par Oxmaint et les indépendants) | [H] |
| Cycle de vente | FR 1 à 4 semaines ; US en libre-service | [H] |
| Churn mensuel | 2 à 4 % ; risque de pic si l'application de l'État s'enrichit (FR) ou si la règle est assouplie (US) | [H] |
| Payback | FR 5 à 13 mois ; US 6 à 15 mois | [E] |

### 9. Risques

- **Réglementaire US (critique).**
  - Reconsideration annoncée de la gestion des fuites, distribution alimentaire ciblée [P06].
  - Pétitions NGA et FMI pour revenir à 50 lb [P08, P09].
  - Exemption TRU proposée [P05].
  - Précédent de 2020 [P10].
  - Aucun report formel de l'échéance du 1/1/2026 n'a été trouvé : la règle s'applique, mais son périmètre est menacé.
- **Concurrence publique FR (critique).** Application gratuite de l'État [P25] et Trackdéchets [P30]. L'État peut ajouter le registre ou le planning à tout moment.
- **Responsabilité.** Un calcul de seuil faux peut entraîner une non-réparation et une sanction. Il faut des CGU limitatives, un affichage de la méthode et des citations.
- **RGPD.** Données de techniciens et de sites, risque faible. HIPAA sans objet.
- **Intégrations.**
  - L'application de l'État ne s'intègre pas aux logiciels tiers : CSV seulement [P27], interopérabilité future inconnue [?].
  - L'API Trackdéchets BSFF existe [P31].
  - Aux US, intégration ServiceTitan via une marketplace partenaire, accès [?].
- **Dépendance aux plateformes.** Les donneurs d'ordre imposent ServiceChannel [P19].
- **Réaction des éditeurs.** ServiceTitan et BuildOps ont déjà réagi [P17, P18]. C'Fluide a son module de bilan.
- **IA.** Faible valeur ajoutée. Une erreur d'OCR sur une charge nominale fausse le calcul.

### 10. Distribution

**FR, canal 1 : prospection directe sur la liste publique REP-GF et datafluides** [P38].
- Appels et e-mails aux TPE de froid commercial, avec ce message : « Votre registre d'équipement et vos contrôles d'étanchéité planifiés automatiquement. Fiches importées depuis l'application de l'État. Bilan du 31 janvier prêt en 1 clic. »
- 10 conversations : 100 appels ciblés sur une région, plus 2 grossistes (comptoirs de fluides) le matin [H].

**FR, canal 2 : organismes agréés et syndicats.**
- Contexte : nouvelles catégories A1/A2/B/C au 1/1/2027 [P28, P29].
- Sujets à porter : webinaires CAPEB/SNEFCCA, partenariat « kit de conformité » avec un organisme d'attestation [H].

**US.** Les canaux seraient les grossistes (Johnstone, United Refrigeration [H]), les groupes Facebook et Reddit de techniciens, et le SEO. Depuis la France : décalage horaire, culture du téléphone, aucune légitimité locale, et un SEO déjà saturé (pages Oxmaint, dizaines de pages.dev). **Distribution jugée non crédible pour ce profil.**

**Premières ventes sans audience (FR).** Pilote gratuit de 60 jours pour 5 frigoristes rencontrés au comptoir d'un distributeur, en échange de témoignages.

### 11. Faisabilité MVP

**Architecture.** Stack Relanzio réutilisable : Node, Supabase, Stripe, Brevo. Modèle de données :
- client et site, puis équipement (fluide, charge, tonnes équivalent CO2, catégorie) ;
- intervention (fluide ajouté ou récupéré) ;
- règles (seuils, fréquences de contrôle) ;
- documents (PDF du Cerfa 15497*04, registre).

PWA hors ligne pour le terrain. Rappels Brevo réutilisables (logique de relance de Relanzio).

**Intégrations indispensables (FR).** Import et export CSV de l'application de l'État, API Trackdéchets BSFF.

**Partie difficile.**
- Règles F-gas par seuil de tonnes équivalent CO2, dont la réduction de fréquence avec détection de fuites.
- Transition de catégories 2027.
- Signature du détenteur à valeur probante.
- Hors ligne fiable.

**Coût et délai.** 6 à 10 semaines à 1 ETP [E]. Hébergement moins de 50 € par mois [E].

**Dépendance critique.** Évolution de l'application de l'État [?].

### 12. Défendabilité à 2 ans

**Faible.**
- La logique de règles est publique et tient en quelques centaines de lignes. Un LLM généraliste produit un calculateur en une soirée, ce que montre l'afflux d'outils pages.dev aux US [P14 à P16].
- L'État français peut absorber le registre et le planning.
- ServiceTitan et BuildOps peuvent ajouter le calcul automatique.

**Pourquoi le client resterait.** L'historique d'équipements et de fiches crée un coût de sortie, et un portail détenteur produit un petit effet réseau contractor → clients [H]. Cela ne suffit pas à protéger les marges face à un outil gratuit.

### 13. Raisons de NE PAS le faire, et expériences d'invalidation

**Raisons de ne pas le faire :**
- (1) L'application gratuite de l'État couvre le cœur B-10.
- (2) La règle US est en cours de reconsideration sur le segment visé.
- (3) Ref LeakLog, des applications gratuites et des FSM couvrent déjà B-09.
- (4) La sanction française est faible (450 €).
- (5) Aucune preuve de volonté de payer ou de plainte n'a été trouvée.
- (6) La distribution US n'est pas crédible depuis la France.

**Expériences d'invalidation (2 à 4 semaines, avant tout code) :**
1. Appeler 20 frigoristes issus de REP-GF et demander : « Utilisez-vous l'application de l'État ? Qu'est-ce qui manque ? Paieriez-vous 29 € par mois ? » **Arrêt si moins de 3 sur 20 se disent prêts à payer pour le registre et le planning hors application de l'État.**
2. Demander à 2 organismes agréés ce qui fait échouer les audits, pour savoir si le registre ou le bilan sont des motifs fréquents. **Arrêt si non.**
3. Suivre le Federal Register et le Unified Agenda de l'EPA pour une proposition « leak management ». **Arrêt US définitif si le seuil passe à 50 lb.**
4. Landing page FR à 29 € avec pré-inscription, 300 € d'annonces ciblées. **Arrêt si le taux de conversion vers la pré-inscription est inférieur à 3 %.**

### 14. Re-notation (notes de 0 à 10 par critère)

Rappel de la phase 1 (barème brut `scores-bruts.csv`) : B-09 D7 F7 P6 Dist6 L6 MVP9 M8 T10 Déf4 R6 = 68 (70 dans B-top) ; B-10 D6 F7 P5 Dist7 L5 MVP9 M8 T5 Déf5 R8 = 64 (67 dans B-top).

| Critère (poids) | B-09 US, phase 1 → phase 2 | B-10 FR, phase 1 → phase 2 | Cause du changement |
|---|---|---|---|
| Douleur (20) | 7 → 5 | 6 → 4 | US : obligation surtout côté propriétaire, résidentiel exempté, faible probabilité de contrôle. FR : amende de 450 € et appli gratuite qui retire la douleur de saisie |
| Fréquence (10) | 7 → 6 | 7 → 7 | US : seules les recharges sur des appareils de 15 lb ou plus comptent |
| Preuves (15) | 6 → 6 | 5 → 6 | Règles vérifiées, marché payant observé (Ref LeakLog, C'Fluide), mais aucune preuve de volonté de payer ni de plainte |
| Distribution (15) | 6 → 3 | 7 → 6 | US non crédible depuis la France. FR : liste publique, mais l'État occupe les mêmes canaux |
| Lacune (10) | 6 → 2 | 5 → 2 | Ref LeakLog à 29 USD, applis gratuites, FSM, ServiceChannel. Appli de l'État gratuite, C'Fluide à 22 €, Kizeo |
| Faisabilité (10) | 9 → 8 | 9 → 7 | FR : interopérabilité avec l'appli de l'État limitée au CSV, règles F-gas, signature |
| Marge (5) | 8 → 6 | 8 → 6 | Prix plafonnés par le gratuit |
| Timing (5) | 10 → 3 | 5 → 6 | US : l'échéance de 2026 est passée, celle de 2027 ne vise que l'ALD de 1 500 lb ou plus, et une reconsideration arrive. FR : changement de régime au 1/1/2027 [P28] |
| Défendabilité (5) | 4 → 2 | 5 → 3 | Logique publique, commoditisée par les LLM et l'État |
| Risques (5) | 6 → 2 | 8 → 5 | US : risque d'assouplissement ciblé. FR : extension possible de l'appli de l'État |
| **Total /100** | **68 → 46** | **64 → 52** | |

**Note finale du finaliste B-09 (+B-10) : 52/100.** On retient la meilleure option, le FR. Confiance moyenne : les preuves viennent d'extraits, le volume d'opérateurs FR est inconnu, et la volonté de payer n'est pas testée.

---

## DD-E13 — Relance automatique des devis non signés (J+2/J+5/J+10) pour indépendants, artisans et TPE de services en France, sans remplacer leur logiciel de devis

Date : 2026-10-29. Phase 2/4 (due diligence indépendante). Note de phase 1 : **61/100** (E-top.md). La ligne de `scores-bruts.csv` (6,9,4,6,3,9,8,3,3,8) donne 60 avec `score.py` : l'écart d'un point vient de la Lacune, du Timing et de la Défendabilité, notés un peu plus haut dans E-top. La référence retenue est la table d'E-top, convertie en notes sur 10.
**Nouvelle note : 52/100. Confiance moyenne-faible.**

**Conflit d'intérêts déclaré.** Cette piste correspond au produit que développe le porteur (Relanzio). Le BUSINESS_PLAN et le README sont traités comme des **affirmations internes**, pas comme des preuves. Le code existant ne donne **aucun bonus** de note. Son seul effet est de réduire le coût marginal du test (§11).

**Méthode.** 42 requêtes WebSearch, dont environ 55 % visaient l'invalidation : fonctionnalité déjà présente chez chaque éditeur, substituts gratuits, prestataires n8n, faible budget numérique, chiffres marketing, réglementation. WebFetch est bloqué (`www.obat.fr` ne se résout pas dans cette session). Toutes les preuves sont donc des **extraits de recherche**, avec pages non ouvertes. Étiquettes utilisées : **[O]** fait observé (`Pxx` = `DD-E13-Pxx`), **[E]** estimation, **[H]** hypothèse, **[I]** inconnu, **[INT]** affirmation interne de Relanzio.

---

### 1. ICP, rôles, contexte d'achat
- **ICP recommandé** (plus étroit que le BP, qui vise « universel ») : artisan du bâtiment ou du second œuvre, de 1 à 10 personnes, en rénovation, plomberie-chauffage, électricité ou menuiserie. Il émet **15 à 50 devis par mois** à un **panier de 1 000 EUR ou plus**. Il fait ses devis sur un logiciel **sans relance automatique de devis** (Tolteck, Obat, EBP Bâtiment, Batappli : aucune relance de devis trouvée, P09-P13) ou sur Word/Excel. Il a une adresse email qu'il consulte. Segment secondaire : petites agences web/marketing et prestataires B2B (photo/vidéo, événementiel) qui envoient des propositions à plus de 2 000 EUR [H].
- **Exclus** : les clients d'Axonaut, de Sellsy, et probablement de Pennylane, qui ont déjà la relance (P01, P02, P04). Exclus aussi les micro-entrepreneurs à 1 ou 2 devis par mois : Word ou Excel leur suffit, selon un éditeur (P41).
- **Utilisateur** : le gérant, ou le conjoint qui gère l'administratif [H].
- **Prescripteurs** : expert-comptable, CAPEB/CMA locales (les éditeurs utilisent déjà ce canal : partenariat CAPEB × Costructor, P14), fournisseurs et négoces, groupes Facebook d'artisans [H].
- **Décideur économique et sponsor** : le gérant, qui paie par carte, sans appel d'offres.
- **Objections attendues** : (1) « je relance déjà au téléphone » [H] ; (2) « mon logiciel le fait » (vrai chez Axonaut et Sellsy, P01-P02) ; (3) « encore un outil, et je dois ressaisir mes devis » (double saisie) [H, risque n° 1] ; (4) « 29 EUR pour une seule fonction, alors que Tolteck coûte 19-25 EUR pour tout » (P40) ; (5) « je ne veux pas que le client se sente harcelé » (Effy recommande de limiter les tentatives, P42) ; (6) « je ne donne pas l'accès à ma boîte mail » [H].
- **Contexte d'achat** : l'activité de l'artisanat du bâtiment recule depuis 8 trimestres (−3,5 % au T3 2025, P28). Il y a moins de chantiers, donc chaque devis compte plus, mais la trésorerie est tendue. Le budget numérique est faible : 27 % des TPE-PME du bâtiment ont investi plus de 1 000 EUR dans le numérique, contre 42 % tous secteurs (P30). La réforme de la facture électronique (2026-2027) pousse les TPE à **choisir ou changer** de logiciel de facturation (P31, P32), ce qui ouvre une fenêtre de réévaluation des outils mais favorise les suites tout-en-un.

### 2. Job-to-be-Done et workflow actuel
**JTBD** : « Après avoir envoyé un devis, savoir lequel relancer, quand et comment, sans y penser, sans paraître insistant, et sans changer mon logiciel de devis. »

Workflow actuel pas à pas [H, sauf mention] :
1. Visite du chantier ou appel, puis chiffrage (45 à 90 min par devis rédigé à la main selon un extrait de webandseo.fr qui attribue ce chiffre à une agence ; fiabilité faible, non repris en preuve).
2. Envoi du devis en PDF par email (ou par lien de signature dans les logiciels qui le proposent).
3. Pas de liste « devis en attente » tenue, ou alors un tri dans le logiciel (Tolteck, P09).
4. Relance téléphonique quand l'artisan y pense, souvent trop tard. Obat recommande lui-même 48-72 h, puis 5-10 jours, puis 2 semaines (P11) ; Effy, 2 à 4 jours ouvrés (P42).
5. Le devis expire ou le client signe ailleurs. Côté particulier, un témoignage décrit un artisan, pourtant le moins cher, qui n'a jamais rappelé (P43).

**Pourquoi c'est douloureux** : chiffre d'affaires perdu sans que personne le voie, oubli lié à la charge du chantier, gêne à relancer. **Fréquence** : hebdomadaire pour l'ICP (10 à 50 devis par mois) [H]. **Faible** pour les micro-entrepreneurs à faible volume (P41).

**Point critique** : la douleur est **invisible**. L'artisan ne connaît ni son taux de transformation ni ce que la relance lui rapporterait. Seule source chiffrée trouvée : CAPEB AURA en **2017**, où seuls 11 % des artisans transforment plus de 70 % de leurs devis (P22). Aucune étude FFB ou CAPEB récente sur la part des devis **sans réponse** n'a été trouvée [I].

### 3. Coût de l'inaction
Formule mensuelle par entreprise :
`Perte = N devis/mois × s (part sans réponse) × r (part supplémentaire gagnée grâce à des relances systématiques, en plus de ce que l'artisan fait déjà) × panier × marge brute + temps de relance manuelle × coût horaire`

| Variable | Bas | Central | Haut | Étiquette |
|---|---|---|---|---|
| N devis/mois | 10 | 20 | 40 | [H] (ICP du BP : 10-80, [INT]) |
| s, part sans réponse | 30 % | 45 % | 60 % | [H], cohérent avec des taux de transformation faibles (P22, 2017) |
| r, gain incrémental de la relance | 2 % | 5 % | 10 % | [H]. Les chiffres d'éditeurs (+75 %, P24) sont du marketing non vérifiable |
| Panier moyen | 800 EUR | 1 500 EUR | 3 000 EUR | [H] (un vendeur ComeUp évoque 1 400 EUR, P18) |
| Marge brute | 25 % | 30 % | 40 % | [H] |
| Temps de relance manuelle | 1 h | 1,5 h | 2 h/mois à 30-45 EUR | [H] |

- Bas : 10 × 0,30 × 0,02 × 800 × 0,25 + 30 = **≈ 42 EUR/mois**
- Central : 20 × 0,45 × 0,05 × 1 500 × 0,30 + 60 = **≈ 263 EUR/mois**
- Haut : 40 × 0,60 × 0,10 × 3 000 × 0,40 + 90 = **≈ 2 970 EUR/mois**

**Lecture** : le **seuil de rentabilité est bas**. Pour un artisan à 10 devis sans réponse par mois, un panier de 2 000 EUR et 30 % de marge, il suffit que r atteigne environ 0,5 % pour couvrir 29 EUR par mois. Le problème n'est donc pas le ROI théorique. C'est que (a) **r n'a jamais été mesuré**, (b) l'artisan ne voit pas le contrefactuel, et (c) il croit déjà relancer. Le premier test doit **mesurer r**.

### 4. Concurrents et substituts (détail : `DD-E13-concurrents.csv`, 28 lignes)
| Acteur | Type | Prix observé | Relance de devis automatique ? |
|---|---|---|---|
| **Axonaut** | direct | 34,99 à 97 EUR HT/mois selon les sources (P32) | **Oui**, jusqu'à signature (P01) |
| **Sellsy** | direct | 39 EUR HT/utilisateur (P32) | **Oui** : plans de relance par client (P02), jugés génériques (P03) |
| **Pennylane** | indirect | inconnu | Scénarios de relance au plan Essentiel ; application aux devis **non confirmée** (P04) |
| **Obat** | indirect | 25-39 EUR HT/mois (P40) | Relances d'**impayés** automatiques ; **devis : non trouvé**, guide de relance manuelle (P10, P11) |
| **Tolteck** | indirect | 19-25 EUR HT/mois (P40) | **Non trouvé** ; tri manuel (P09) |
| **EBP Bâtiment** | indirect | inconnu | Relances de règlements seulement (P12) |
| **Batappli** | indirect | 39 EUR/utilisateur (Appvizer) | Non trouvé ; publipostage en offre Entreprise (P13) |
| **Costructor** | indirect | 0/15/30/300 EUR HT (tiers) | Impayés oui ; devis non trouvé ; partenaire CAPEB (P14) |
| **Extrabat** | indirect | inconnu | « Relances automatiques et prospection » (tiers), non confirmé pour les devis (P47) |
| **Henrri / Abby / Freebe / Qonto / Zervant** | indirect | 0 à 39,90 EUR (P15-P17, P48, P49) | Relances d'**impayés** ; devis non confirmé |
| **Vulko** (nouvel entrant IA BTP) | direct | dès 19 EUR/mois (P20) | « Tableau de bord paiements et relances » |
| **Maitrio** (2026) | indirect | inconnu | Relances de paiement (P21) |
| **Organilog, Hemea, Lemlist** | — | **inconnu** | Aucune donnée trouvée |
| **Jobber** (US) | direct hors FR | 49-249 USD/mois selon les tiers (P06) | **Oui**, dès Connect selon l'aide officielle (P05) |
| **Housecall Pro** (US) | direct hors FR | 59-299 USD/mois (tiers, P50) | Module **Pipeline** payant à part (P07) |
| **Tradify** (AU/UK) | direct hors FR | £21/mois (tiers, ancien) | **Oui** (P08) |
| **HubSpot** | indirect | gratuit sans séquences ; Pro ~90 USD/siège + 1 500 USD (P36) | Seulement en Pro |
| **Pipedrive** | indirect | ~14-24 USD/utilisateur (P37) | Selon le plan [I] |
| **Brevo** | substitut | 0 à 15 EUR/mois (P35) | Bricolable |
| **Gmail nudges / snooze** | substitut | 0 EUR (P38) | Suggestion de relance, sans envoi automatique |
| **Freelances n8n/Make (ComeUp)** | substitut | prix de base non extrait ; maintenance +116 USD/30 j (P18, P19) | Oui, sur mesure |
| **Statu quo** (téléphone, mémoire, tableur) | substitut | 0 EUR | — |

**Conclusion** : la fonction est **banalisée** dans les suites généralistes (Axonaut, Sellsy) et dans le field service anglo-saxon (Jobber, Housecall Pro, Tradify). Une **lacune existe chez les logiciels BTP français** (Obat, Tolteck, EBP, Batappli : absence de preuve, à confirmer par essai gratuit), mais elle est étroite : ces éditeurs pourraient l'ajouter en quelques semaines [H]. Les comparateurs citent déjà la relance automatique comme critère de choix standard (P46).

### 5. Différenciation
- **Wedge** : « la relance de devis pour les artisans qui gardent Tolteck, Obat, EBP ou Word, envoyée depuis votre adresse, avec arrêt automatique dès que le client répond ». Ce n'est pas « universel ».
- **Time-to-value** : il doit être inférieur à 10 minutes : premier devis suivi et première relance programmée. La double saisie le menace directement. Le transfert en copie cachée (BCC) vers une adresse Relanzio ou un import CSV est **indispensable** dès les pilotes [H]. Le BP le place en V2 [INT].
- **ROI mesurable** : le tableau de bord doit afficher « devis relancés → réponses → gagnés après relance » en EUR. Sans cette preuve, le client ne voit pas la valeur (§3).
- **Raison de changer** : ne pas changer de logiciel de devis au moment où la réforme de la facture électronique impose déjà une migration. C'est un argument réel, mais **réversible** : si le logiciel choisi pour la facture électronique fait la relance, Relanzio devient inutile.

### 6. Taille de marché (bottom-up)
- **Base BTP** : 500 000 entreprises artisanales du bâtiment de 1 à 10 salariés selon la CAPEB (P27 ; un autre communiqué de la CAPEB cite 620 000). Environ 50 % n'utiliseraient pas de logiciel professionnel (baromètre CAPEB 2021 cité par Fiducial, P29).
- **Filtre ICP** : au moins 10 devis par mois, email utilisé, pas de relance dans l'outil actuel, appétence numérique, soit 10 à 20 % [H], donc **50 000 à 100 000** entreprises.
- **Services** (agences, consultants, photographes, événementiel) : nombre d'entreprises à 10 propositions par mois ou plus **inconnu** [I]. Hypothèse : 50 000 à 150 000 [H].
- **SAM** : 100 000 à 250 000 comptes × 230 à 350 EUR par an (19 à 29 EUR/mois) ≈ **23 à 87 M EUR/an** [E]. Aucun TAM « cabinet » n'est retenu.
- **SOM à 24 mois pour un solo** : pénétration de 0,05 à 0,2 % du SAM, soit **50 à 500 clients**, soit **14 à 170 k EUR d'ARR** ; central de 100 à 200 clients, soit environ 30 à 60 k EUR d'ARR [E]. L'objectif du BP (500 EUR de MRR, 18 clients [INT]) est atteignable. 10 000 EUR de MRR (345 comptes) se situe en haut de la fourchette, sans canal prouvé.

### 7. Pricing
- **Recommandé** : **24 EUR HT/mois**, ou 19 EUR/mois en annuel, avec 30 jours d'essai et la garantie « remboursé si aucun devis gagné après relance en 60 jours ». Justification : l'ancrage est Tolteck à 19-25 EUR pour **tout** le logiciel, et Vulko à 19 EUR (P40, P20). Un prix de 29 EUR pour une seule fonction se défend mal tant que le ROI n'est pas mesuré. **Qui signe** : le gérant.
- **Alternative 1** : garder 29 EUR (Pro) [INT] et l'offre Founder à 19 EUR [INT], en ajoutant le reporting EUR « récupéré ». À tester contre 24 EUR dans les entretiens.
- **Alternative 2** : une offre **Agence/Équipe à 49-79 EUR/mois** pour les services B2B à gros panier (plusieurs expéditeurs, modèles par offre). L'ARPA est plus élevé, le CAC est le même [H].
- **Exemple de ROI** (illustratif [H]) : un plombier-chauffagiste envoie 25 devis par mois, dont 10 restent sans réponse, avec un panier de 2 000 EUR et 30 % de marge. Un devis de plus gagné tous les deux mois (r = 5 %) rapporte environ 300 EUR de marge par mois, soit **≈ 12 fois** un abonnement à 24 EUR. Le point mort est à un devis récupéré tous les 2 ou 3 ans. L'enjeu est donc la **preuve** et la **perception**, pas le prix.

### 8. Intrants du modèle économique
| Intrant | Valeur | Étiquette |
|---|---|---|
| Prix catalogue | 29 EUR HT (Pro), 19 EUR (Founder) | [INT] |
| ARPA réaliste | 20-27 EUR | [E] (remises Founder, annuel) |
| Email | 0 EUR jusqu'à 300 emails/jour ; 7-15 EUR/mois ensuite (Brevo) | [O, P35] |
| Hébergement + base de données | ~5 USD (Railway) + Supabase gratuit puis payant | [INT] ; prix Supabase payant non vérifié [H] |
| IA (brouillons de relance) | < 0,10 EUR/client/mois, plafonnée | [H] |
| Paiement | frais Stripe par transaction (taux non vérifiés ici) | [I] |
| Support/onboarding | 1-2 h à l'entrée, puis 15-30 min/mois au début | [H] ; c'est le **vrai COGS** |
| Marge brute hors temps du fondateur | 85-95 % | [E] |
| CAC en vente directe | 30 conversations pour 2 payants (critère GO du BP), soit environ 40-60 h pour 2 clients, donc **20-30 h par client** | [E] à partir de [INT] |
| CAC payant (ads/SEO plus tard) | 150-300 EUR | [H] ; coût par clic de « logiciel devis » non trouvé [I] |
| Cycle de vente | 1-3 semaines (essai) | [H] |
| Churn mensuel | 4-8 % (TPE, saisonnalité, mois sans devis) | [H] |
| LTV (ARPA 24, marge 90 %, churn 6 %) | ≈ 360 EUR | [E] |
| Payback | 7-14 mois avec un CAC payant de 150-300 EUR ; en vente directe, environ 25 h de fondateur par client | [E] |

**Signal d'alerte** : un LTV/CAC d'environ 1,2 à 2,4 en acquisition payante est **faible**. Le modèle ne tient qu'avec un canal à coût marginal quasi nul (partenaire, intégration, SEO) ou un ARPA plus élevé (agences).

### 9. Risques
- **Délivrabilité / identité d'envoi (élevé)** : Gmail et Yahoo (2024) puis Microsoft (mai 2025) exigent un domaine propre authentifié par DKIM et DMARC. Sans DMARC, les envois vers Outlook et Hotmail partent en spam ou sont rejetés (P34). Beaucoup d'artisans utilisent une adresse gratuite (gmail.com, orange.fr) [H], qu'on ne peut pas authentifier. Trois options : (a) envoyer depuis le domaine Relanzio avec Reply-To vers l'artisan, ce qui inspire moins confiance au client [H] ; (b) passer par OAuth Gmail/Microsoft, où lire la boîte pour détecter les réponses exige des droits Google sensibles ou restreints, avec une vérification et éventuellement un audit de sécurité [H, à vérifier] ; (c) IMAP avec mot de passe d'application, le chemin présent dans le dépôt (`imap-replies.js`), qui pose un **risque de sécurité** car on stocke des identifiants de boîte [O dépôt / H risque].
- **RGPD** : Relanzio agit comme **sous-traitant** (art. 28) pour les données des clients de l'artisan, ce qui suppose un DPA et un registre. Envoyer un email de prospection à un particulier exige un opt-in, alors qu'en B2B l'intérêt légitime est possible (P33). **Aucune source CNIL ne tranche** le cas de la relance d'un devis **demandé** par le client [I]. L'hypothèse prudente est d'en faire un message précontractuel, sans contenu promotionnel, avec un lien « ne plus être relancé » [H].
- **Responsabilité** : relancer un client qui a déjà signé par un autre canal, ou relancer trop souvent, nuit à l'image de l'artisan. Il faut des statuts simples (gagné/perdu) et un arrêt à la réponse.
- **Réglementation, facture électronique** : réception obligatoire au 1er septembre 2026, émission par les TPE/PME au 1er septembre 2027 (P31). **Seule la facture est visée ; un devis n'est pas une facture** : aucune obligation ne s'applique au devis selon les extraits, mais aucune source officielle (BOFiP) ne le dit explicitement [inférence]. Effet indirect **défavorable** : la réforme pousse les TPE vers des plateformes agréées tout-en-un, dont Sellsy et Axonaut, qui incluent la relance (P32).
- **Réaction des éditeurs** : Obat, Tolteck et EBP peuvent ajouter la relance de devis rapidement [H], et des entrants IA arrivent déjà (Vulko, Maitrio : P20, P21).
- **Dépendance plateforme** : Brevo, Google et Microsoft (OAuth), Stripe.
- **Fiabilité de l'IA** : enjeu faible si l'IA ne fait que rédiger des brouillons relus par l'artisan.
- **Sécurité** : stockage des PDF de devis (données personnelles et prix) ; jetons OAuth ou IMAP.

### 10. Distribution
- **Canal 1, vente directe ciblée par téléphone et email** sur une seule verticale et un ou deux départements, par exemple les artisans RGE en rénovation énergétique. Listes publiques possibles : annuaire RGE France Rénov', Pages Jaunes, Google Maps [H, annuaire non vérifié dans cette session]. La prospection B2B vers une adresse professionnelle est défendable sur la base de l'intérêt légitime, avec opt-out (P33). **Coût** : 1 à 2 h par jour de fondateur [INT].
- **Canal 2, prescripteurs et partenaires** : experts-comptables qui migrent leurs clients vers la facture électronique ; CAPEB/CMA locales (modèle Costructor, P14) ; groupes d'utilisateurs Tolteck ou Obat. **Variante marketplace** : la marketplace Pennylane existe (P44), mais Pennylane a déjà des relances (P04). Les vrais partenaires seraient les éditeurs **sans** la fonction, qui ont plutôt intérêt à la construire [H].
- **Message** : « Vous faites vos devis sur Tolteck, Obat ou Word ? Transférez-les en copie à Relanzio : vos clients sont relancés à J+2, J+5 et J+10 depuis votre nom, et ça s'arrête dès qu'ils répondent. Si aucun devis n'est gagné après relance en 60 jours, vous ne payez rien. »
- **Obtenir 10 conversations d'acheteurs** : appeler 50 à 60 artisans d'une même verticale dans un département, avec une question d'ouverture factuelle : « Combien de devis envoyés le mois dernier sont encore sans réponse ? ». L'hypothèse est 20 % de conversations utiles [H].
- **Premières ventes sans audience** : **pilote concierge**. Le fondateur relance pour 10 artisans pendant 30 jours, à la main ou avec l'outil, mesure r, puis demande le paiement. C'est le critère GO du BP : au moins 5 testeurs et 2 payants après 30 conversations [INT].

### 11. Faisabilité (sans bonus pour le code existant)
- **Architecture MVP minimale** : saisie ou import du devis (formulaire, CSV, transfert BCC avec analyse du PDF), planificateur J+2/J+5/J+10, envoi email, arrêt sur réponse (OAuth ou IMAP, ou clic manuel « répondu »), statuts, tableau de bord EUR, paiement. Un développeur compétent la construit de zéro en **3 à 6 semaines** [E].
- **Parties difficiles** : (1) **l'identité d'envoi et la détection des réponses** (§9) ; (2) **l'entrée des devis sans double saisie** ; (3) les intégrations avec les logiciels BTP, dont l'API ou l'export est **inconnu** [I].
- **État observé du dépôt** : environ 7 000 lignes JS/TS ; statut « **NON PRÊT POUR PILOTES** ». Il reste à valider le build Vite, Supabase réel, Stripe Test, la délivrabilité Brevo, la QA mobile et les mentions légales [O dépôt, README et FINAL_AUDIT_V0.4, affirmations internes].
- **Coût marginal restant pour TESTER** [E] :
  - **Test concierge** (le seul indispensable pour valider la volonté de payer) : **0 jour de développement**, moins de 50 EUR, 40 à 80 h de fondateur sur 4 à 6 semaines.
  - **Rendre l'outil sûr pour 5 à 10 pilotes** (gates externes, BCC entrant, mode « envoyer depuis le domaine Relanzio + Reply-To ») : **3 à 8 jours-homme**, moins de 50 EUR par mois.
  - **OAuth Gmail/Microsoft avec détection des réponses** : 1 à 3 semaines, plus une vérification Google de durée et de coût inconnus [I]. À **ne pas** engager avant le résultat du test.

### 12. Défendabilité à 2 ans
Elle est faible. Ce qui peut banaliser l'offre : (a) les suites (Axonaut, Sellsy, Pennylane) l'ont déjà ; (b) les logiciels BTP peuvent l'ajouter ; (c) les assistants IA des boîtes mail (nudges Gmail déjà gratuits, P38) et les LLM généralistes peuvent rédiger et programmer des relances [H] ; (d) des freelances n8n l'installent pour un coût unique (P18, P19, P45). **Pourquoi le client resterait** : l'habitude, l'historique des devis, des modèles de relance qui ont fait leurs preuves, et le reporting EUR. Ce sont des coûts de sortie faibles. **Seul fossé possible** : des intégrations natives avec les logiciels BTP sans relance, plus des benchmarks propriétaires de transformation par métier, mais cela demande du volume.

### 13. Raisons de NE PAS le faire, et expériences d'invalidation
**Raisons** :
1. C'est une **fonction, pas un produit** : elle est déjà incluse dans les suites que la réforme de 2027 va pousser (P01, P02, P32).
2. **Double saisie** : le principe « sans remplacer votre logiciel » impose une étape de plus à chaque devis.
3. **ARPA faible et CAC en temps élevé** (§8).
4. **Budget numérique faible** dans le BTP (P30) et activité en baisse (P28).
5. **Aucune preuve de volonté de payer** : discussions peu actives (P25), chiffres de conversion marketing (P24), aucune étude récente (P22 date de 2017).
6. **Biais du porteur** : la piste est retenue en partie parce que le code existe.

**Expériences qui invalideraient l'idée** (4 à 6 semaines, avant tout développement supplémentaire) :
- **E1, vérification des concurrents (1 jour)** : essais gratuits d'Obat, Tolteck, Batappli et EBP. Si deux d'entre eux ou plus relancent déjà automatiquement les devis, abandonner le wedge BTP.
- **E2, 30 conversations** : si au moins 60 % disent « mon outil le fait » ou « je relance au téléphone, ça me suffit », c'est **STOP** (critère du BP [INT]).
- **E3, concierge auprès de 10 artisans pendant 30 jours** : mesurer le nombre de devis relancés, les réponses et les devis gagnés après relance. Si **moins de 1 devis gagné après relance par artisan sur 30 jours** en médiane, ou si moins de 3 artisans sur 10 acceptent de payer 19 à 24 EUR, c'est **STOP**.
- **E4, friction** : si moins de 50 % des pilotes ajoutent au moins 5 devis la première semaine sans aide, c'est la double saisie qui tue. Il faut pivoter vers une intégration, ou arrêter.
- **E5, prévente** : lien de paiement Stripe envoyé à 50 contacts qualifiés. Zéro prépaiement invalide le prix ou le canal.

### Comparaison des variantes
| Variante | Douleur | Lacune | Faisabilité | Distribution | Verdict |
|---|---|---|---|---|---|
| **Relance de devis seule** (actuelle) | moyenne, invisible | étroite (logiciels BTP sans relance) | élevée, sauf l'envoi et l'entrée des devis | directe, coûteuse en temps | Test borné uniquement |
| **Devis + impayés** | **plus forte** (47 % seulement des entreprises paient à l'heure ; 13 Md EUR de trésorerie manquent aux TPE/PME, P39) | **quasi nulle** : Obat, Costructor, Henrri, Abby, Freebe, Qonto, Axonaut et Pennylane relancent déjà les impayés (P10, P14-P17, P48) | plus difficile (statut de paiement, rapprochement bancaire) | identique | **Défavorable** : on se rapproche d'un logiciel de facturation sans la conformité facture électronique. Au mieux, un simple rappel d'échéance sans rapprochement bancaire |
| **Vente via une plateforme agréée ou un logiciel de devis (marketplace / partenariat)** | identique | lacune seulement chez les éditeurs sans relance | dépend d'API inconnues [I] | CAC potentiellement bas | **La plus prometteuse si un éditeur BTP sans relance accepte** ; sinon dépendance totale. Pennylane a déjà la fonction (P04). À sonder en parallèle de E1 |

### 14. Re-notation
| Critère (poids) | Phase 1 (pts → /10) | Phase 2 /10 | Points | Cause du changement |
|---|---|---|---|---|
| Douleur/budget (20) | 12 → 6 | **5** | 10 | ROI théorique fort (§3), mais douleur invisible, budget numérique faible (P30), aucune volonté de payer observée. |
| Fréquence (10) | 9 → 9 | **8** | 8 | Hebdomadaire pour l'ICP ; faible pour les petits volumes (P41). |
| Preuves (15) | 6 → 4 | **4** | 6 | Signaux nouveaux (offres ComeUp P18-P19, guide Obat P11, module Housecall Pro P07) compensés par la faible activité des forums (P25), des chiffres marketing (P24) et une étude datée (P22). |
| Distribution (15) | 9 → 6 | **5** | 7,5 | Cibles listables et joignables, mais CAC d'environ 25 h de fondateur par client pour un ARPA d'environ 24 EUR ; les fédérations sont déjà occupées par les éditeurs (P14). |
| Lacune (10) | 4 → 4 | **3** | 3 | Axonaut, Sellsy, Jobber, Tradify et Housecall Pro l'ont ; lacune limitée aux logiciels BTP FR (absence de preuve seulement). |
| Faisabilité (10) | 9 → 9 | **8** | 8 | MVP simple, mais l'identité d'envoi, la détection des réponses et l'entrée sans double saisie sont difficiles ; aucun bonus pour le code. |
| Marge (5) | 4 → 8 | **7** | 3,5 | COGS très faibles (P35), mais ARPA faible, support et churn TPE. |
| Timing (5) | 2 → 4 | **3** | 1,5 | Pas de catalyseur ; la facture électronique 2026-2027 ne vise pas les devis et favorise les suites tout-en-un (P31, P32). |
| Défendabilité (5) | 2 → 4 | **2** | 1 | Banalisée par les suites, les éditeurs BTP, les nudges Gmail, les LLM et les freelances n8n. |
| Risques (5) | 4 → 8 | **7** | 3,5 | RGPD gérable (sous-traitant, opt-out) ; délivrabilité et sécurité OAuth/IMAP à traiter (P34). |
| **Total** | **61** | | **52** | |

**Verdict** : **NO-GO pour tout investissement produit supplémentaire au-delà des gates de sécurité ; GO limité pour un test commercial borné** (4 à 6 semaines, concierge et 30 conversations, moins de 8 jours de développement, moins de 100 EUR), centré sur les artisans BTP qui utilisent un logiciel sans relance de devis. Arrêt si E2 ou E3 échouent. En cas de signal positif, privilégier la variante « intégration ou partenariat avec un logiciel BTP sans relance » plutôt que « devis + impayés ».

---

## DD-E01 — Questionnaires de sécurité fournisseurs pour éditeurs SaaS B2B de 5 à 50 personnes sans SOC 2/ISO 27001 (UE + US) — Due diligence phase 2

Date : 2026-10-29. Finaliste de remplacement E-01, fusionné avec E-02 (kit fournisseur NIS2). Phase 1 : **67/100** dans E-top.md. La ligne de `scores-bruts.csv` donne 8/7/6/6/4/7/8/7/6/7, soit environ 66 ; l'écart vient de l'arrondi des points. Les deux versions sont rappelées au §14.
Méthode : 40 recherches WebSearch, dont environ 15 (≈ 37 %) visaient l'invalidation : offres gratuites, outils à bas prix, fonctions déjà intégrées par Vanta et Drata, SOC 2 comme véritable bloqueur, LLM généralistes, substituts gratuits (CSA STAR), retard NIS2 en France.
**WebFetch est bloqué** : l'essai sur conveyor.com a échoué (ENOTFOUND). Toutes les preuves viennent donc d'**extraits de recherche**, et aucune page tarifaire n'a été ouverte. Les prix sont ceux des extraits, souvent rapportés par des tiers ou par des concurrents (Wolfia, Sprinto), qui ont intérêt à les présenter d'une certaine façon.
Preuves : `DD-E01-preuves.csv` (P01 à P50 : 21 POUR, 19 CONTRE, 10 NEUTRE). Concurrents : `DD-E01-concurrents.csv` (30 lignes).
Étiquettes : **[O]** fait observé (extrait sourcé) · **[E]** estimation · **[H]** hypothèse · **[I]** inconnu.

---

### 0. Ce que la phase 2 change (synthèse)

1. **La lacune « pas cher pour les petits » est en grande partie comblée.**
   - Offres gratuites :
     - Conveyor : trust portal gratuit à vie, sans automatisation des questionnaires (P02).
     - TrustCloud : « Free Forever » pour les entreprises de moins de 20 salariés, avec pré-remplissage IA (P09, P10).
     - SecurityPal : trust center gratuit (P11).
     - CSA STAR Level 1 : CAIQ publié gratuitement au registre public (P25).
   - Outils libre-service à bas prix : 29 USD/mois (Questionnaire Mapper, P20), 99 USD/mois (Replex, P21), 99 USD une fois (Reuse Kit, P22).
   - Orbiq occupe déjà le créneau « UE, NIS2/DORA, hébergé UE, 299 EUR/mois, free tier » (P23).
2. **Les éditeurs en place ont déjà réagi.**
   - Drata a annoncé le rachat de SafeBase en février 2025 (P03) et lancé un agent de réponse aux questionnaires en bêta en mars 2026 (P30).
   - Vanta a lancé son AI Agent en juin 2025 (P29) et inclut 25 questionnaires par an dans son plan startups (P05).
3. **Le vrai bloqueur de l'ICP est souvent le SOC 2, pas le questionnaire.** Plusieurs sources indiquent qu'un questionnaire bien rempli ne débloque pas un acheteur qui exige un rapport (P31, P50). Un outil de questionnaire n'enlève donc pas le blocage le plus coûteux.
4. **Le volume est modeste pour moins de 50 personnes.**
   - Fourchette observée : « quelques-uns par mois » (P16) à 3 à 5 par mois (P15) [O, témoignages faibles].
   - Le chiffre de 50 par an vient d'une hypothèse de ROI fournie par un vendeur (P08).
   - Avec un tel volume, une bibliothèque tenue dans un tableur suffit souvent (P16).
5. **Le catalyseur UE est réel mais indirect.**
   - NIS2 en Allemagne : plus de 19 000 entités enregistrées au 31/07/2026 (P34).
   - DORA : registre d'information déposé depuis avril 2025 (P37).
   - Ces obligations pèsent sur les clients, pas sur l'éditeur. Elles produisent des questionnaires **en plus** des demandes SOC 2/ISO, et non à leur place (P38, P39).
   - En France, NIS2 n'est toujours pas transposée (P36 ; phase 1 : texte retiré de l'ordre du jour de l'AN les 7 et 9 oct. 2026).

**Note révisée : 51,5/100** (contre 67). Le détail est au §14.

---

### 1. ICP, acteurs, contexte d'achat

- **ICP** : éditeur SaaS B2B de 5 à 50 personnes, sans RSSI, sans SOC 2 ni ISO 27001, qui vend à des ETI ou à des grands comptes. Les clients prioritaires sont les entités NIS2 en Allemagne et les entités financières soumises à DORA. Cet éditeur reçoit au moins 1 à 2 questionnaires par mois [H : seuil à valider]. Le sous-segment le plus exposé est l'éditeur vertical qui vend à des banques, des assureurs ou des fintechs : DORA y produit des questionnaires et des annexes contractuelles (P38, P39) [E].
- **Utilisateur** : le CTO ou le fondateur technique, parfois l'ingénieur qui opère l'infrastructure (P16, P45) [O].
- **Prescripteurs** : le commercial ou l'AE qui voit le deal bloqué ; le vCISO à temps partiel ; l'auditeur ou cabinet SOC 2/ISO qui prépare la certification ; la plateforme GRC si l'éditeur en adopte une [H].
- **Décideur économique** : le CEO ou le fondateur. Le CEO ou le CTO signe les réponses, qui deviennent des engagements contractuels (P16) [O].
- **Sponsor** : le responsable commercial, après un deal ralenti ou perdu en revue de sécurité (P32) [O, anecdotique].
- **Objections attendues** :
  1. « Il me faut le SOC 2, pas un outil » (P31, P50).
  2. « Le free tier de TrustCloud, Conveyor ou SecurityPal me suffit » (P02, P10, P11).
  3. « ChatGPT ou Claude avec mes docs le fait déjà » (substitut ; voir P27 pour ses limites).
  4. « Je prendrai Vanta ou Drata pour le SOC 2 et j'aurai les questionnaires inclus » (P05, P30).
  5. « J'en ai 10 par an, mon Google Doc suffit » (P16).
  6. « Je ne confie pas ma PSSI et mon pentest à un inconnu » [H].
- **Contexte d'achat** :
  - achat par carte bancaire, sans appel d'offres ;
  - déclenché par un questionnaire en cours avec une date limite, donc dans l'urgence [H] ;
  - le besoin disparaît, ou passe dans la suite GRC, dès que l'éditeur obtient le SOC 2 [E], d'où une durée de vie client courte.

### 2. Job-to-be-Done et workflow actuel

**JTBD** : « Quand un prospect grand compte m'envoie un questionnaire de 100 à 300 lignes, je veux répondre vite, de façon cohérente avec mes réponses précédentes et sans m'engager sur des contrôles que je n'ai pas, pour que le deal ne sorte pas du trimestre. »

Workflow actuel (P12, P14, P15, P45) [O, témoignages] :
1. Le commercial reçoit un Excel (SIG Lite, CAIQ, questionnaire maison, annexe NIS2/DORA) ou une invitation à un portail (OneTrust, Whistic, Archer…) [portails : H].
2. Il le transfère au CTO, souvent en fin de cycle (P45).
3. Le CTO cherche un ancien questionnaire similaire et copie-colle les réponses (Google Docs, Excel).
4. Il cherche les preuves (PSSI, politique d'accès, sauvegarde, plan de réponse à incident, sous-traitants, pentest) ; il les rédige s'il ne les a pas (P35, P48).
5. Les questions nouvelles demandent une recherche ou une décision (« avons-nous du MFA partout ? »).
6. Le CEO ou le CTO relit, car les réponses engagent la société (P16, P33).
7. Envoi, puis questions de relance de l'acheteur, puis demande de pièces (rapport SOC 2 absent → contrôles compensatoires, lettre de vCISO, pentest).

**Pourquoi c'est douloureux** :
- le temps d'une personne rare, le CTO, est pris ;
- des réponses incohérentes d'un deal à l'autre créent un risque contractuel (P33) ;
- le deal est retardé ;
- le contenu est ennuyeux et souvent peu lu par l'acheteur (P13).

**Fréquence** :
- 3 à 5 par mois pour de petites équipes SaaS B2B, 40+ en montant en gamme (P15, témoignage unique, faible) ;
- « quelques-uns par mois » (P16) ;
- 50 à 200+ par an selon un vendeur (P17) ;
- 50 par an selon l'hypothèse ROI de Wolfia (P08).
- **Estimation retenue pour l'ICP : 10 à 40 par an [E]**, très inégale d'un éditeur à l'autre (fonction du nombre de deals grands comptes).

### 3. Coût de l'inaction

Formule : **C = N × h × c + p × V**
- N = questionnaires par an ; h = heures par questionnaire ; c = coût horaire chargé du CTO ou du fondateur ;
- p = probabilité additionnelle de perdre ou de décaler un deal à cause de la lenteur ou de l'incohérence ; V = valeur annuelle du deal.

| Variable | Valeur basse / médiane / haute | Statut |
|---|---|---|
| N | 10 / 20 / 40 | [E] d'après P15, P16, P17 |
| h (sans outil) | 5 / 10 / 20 h | [E] fourchette vendeur 10-20 h (P18), 2-3 jours (P14), SIG ~15 h (P15) |
| h (avec bibliothèque) | 2 / 3 / 5 h | [E] cas vendeur 10 h → < 2 h (P08) ; les questions nouvelles restent manuelles |
| c | 60 / 90 / 120 EUR/h | [H] coût chargé d'un CTO de startup en UE |
| p | 0 / 2 % / 5 % | [H] aucune donnée ; le blocage dur vient surtout de l'absence de SOC 2 (P31), sur laquelle l'outil n'agit pas |
| V | 10 000 / 25 000 / 60 000 EUR ACV | [H] |

- **Temps seul, cas médian** : 20 × 10 h × 90 EUR = **18 000 EUR/an**.
- **Économie réaliste avec un outil** (10 → 3 h) : 20 × 7 × 90 = **12 600 EUR/an** [E].
- **Cas bas** : 10 × (5 − 2) × 60 = **1 800 EUR/an** [E]. Une grande partie de l'ICP est dans ce cas, et les offres gratuites y suffisent.
- **Composante deal** (cas médian) : 2 % × 25 000 = 500 EUR par deal exposé [H]. Elle est faible, sauf si l'outil aide aussi à présenter des contrôles compensatoires crédibles.

### 4. Concurrents, substituts (détail et sources : DD-E01-concurrents.csv)

| Acteur | Type | Prix observé | Limite pour l'ICP | Statut |
|---|---|---|---|---|
| Conveyor | direct | Free 0 USD (trust portal, **sans** questionnaires) ; Business dès 9 600 USD/an | Cher dès qu'on automatise ; crédits | VÉRIFIÉ-extrait (P01, P02) |
| SafeBase (Drata) | direct | 5 000-30 000 USD/an, médiane 12 000 (Vendr) | Enterprise ; désormais intégré à Drata | VÉRIFIÉ-extrait (P03, P04) |
| Vanta | direct | Non publié ; ~20 000 USD/an moyen (Vendr via concurrent) ; plan startups avec 25 questionnaires/an | Cher ; mais le questionnaire est **inclus** dans la suite que l'ICP achètera pour son SOC 2 | PARTIEL (P05, P06, P29) |
| Drata | direct | Non publié (~7 500-15 000 USD/an estimé en phase 1) | Agent questionnaire en bêta | PARTIEL (P30) |
| Secureframe / Sprinto | direct | ~5 000-10 000 USD/an estimé ; questionnaires dans le plan supérieur (Secureframe) | Achat lié au SOC 2 | PARTIEL (P46) |
| HyperComply | direct | 500 USD/mois (Capterra) ; médiane 10 200 USD/an (Vendr) | Au questionnaire, avec relecteurs humains | VÉRIFIÉ-extrait (P07) |
| Loopio / Responsive | indirect | Loopio dès 20 000 USD/an ; Responsive non publié | Outils RFP | VÉRIFIÉ-extrait / PARTIEL (P41) |
| Whistic | indirect | 11 625-35 000 USD/an (Vendr) | Côté acheteur | VÉRIFIÉ-extrait (P47) |
| Vendict, Skypher, Inventive AI, Wolfia, Scytale, Procurize | direct/indirect | Sur devis ou contradictoire ; Inventive « Free » selon un tiers | Mid-market | INCONNU / PARTIEL |
| **TrustCloud** | direct | **Gratuit < 20 salariés** ; payant ~6 000 USD/an ou 400 USD/mois selon les sources | Questionnaire IA jugé moins avancé que Conveyor par un tiers | VÉRIFIÉ-extrait (P09, P10) |
| **SecurityPal** | direct | **Trust center gratuit** (early-stage) ; premium sur devis | Le gratuit est un trust center ; la réponse aux questionnaires est payante | VÉRIFIÉ-extrait (P11) |
| **Orbiq (UE)** | direct | **299 EUR/mois**, free tier annoncé, hébergé UE, NIS2/DORA | Occupe déjà le wedge UE | PARTIEL (P23) |
| Replex / Questionnaire Mapper / Reuse Kit | direct/substitut | 99 USD/mois ; 29-99 USD/mois ; 99 USD une fois | Petits acteurs, demande non prouvée | VÉRIFIÉ-extrait (P20-P22) |
| CSA STAR Level 1 | substitut | **Gratuit** | Seulement le CAIQ ; peu d'acheteurs l'acceptent à la place de leur propre questionnaire [H] | VÉRIFIÉ-extrait (P25) |
| ChatGPT / Claude + documents | substitut | Abonnement grand public (prix non vérifié ici) | Pas de citations ni de traçabilité ; hallucinations (P27, P28) | INCONNU |
| Excel / Google Docs | substitut | 0 | Statu quo ; suffisant à faible volume (P16) | VÉRIFIÉ-extrait |
| Tensoria (FR) | indirect | Sur mesure, inconnu | Prestation | INCONNU |
| SOC 2 lui-même | substitut de fond | 15 000-50 000 USD, 3-9 mois (P50) | Résout le vrai bloqueur ; il amène ensuite Vanta ou Drata, questionnaires inclus | PARTIEL |

**Plaintes observées** :
- prix et crédits chez Conveyor (phase 1, guptadeepak) ;
- hausse au renouvellement de 40 à 100 % chez Vanta (phase 1, compliancerated) ;
- « les outils existants visent le mauvais acheteur » (P15, un seul témoignage).

**Lecture** : il n'y a pas de trou « rien d'abordable pour les petits ». L'espace libre restant est **étroit** : un outil francophone ou germanophone, qui produit des annexes NIS2/DORA fournisseur et des **contrôles compensatoires** quand on n'a pas de SOC 2. Orbiq vise déjà le même espace en Allemagne.

### 5. Différenciation possible (wedge)

- **Wedge le plus défendable trouvé** : « dossier de sécurité fournisseur sans SOC 2 » pour éditeurs SaaS FR/DE qui vendent à des entités DORA/NIS2. Il comprend :
  1. un questionnaire de diagnostic de 30 minutes qui produit une bibliothèque de 150 à 300 réponses **vérifiées par l'éditeur**, avec le niveau de preuve de chaque réponse (« oui, preuve X », « partiel, plan Y », « non ») ;
  2. un pack de politiques minimales rédigées à partir de la réalité de l'éditeur (PSSI courte, accès, sauvegarde, incident, sous-traitants) ;
  3. un remplissage du fichier Excel **du client** qui conserve son format ;
  4. des correspondances prêtes vers les annexes DORA art. 30 et NIS2 art. 21 ;
  5. une trust page.
- **Time-to-value visé** : premier questionnaire rendu en moins de 48 h [H].
- **ROI mesurable** : heures par questionnaire avant et après ; part de réponses réutilisées ; délai de retour à l'acheteur.
- **Raison de changer** : le français et l'allemand, les annexes DORA/NIS2 et un prix public inférieur à 100 EUR/mois.
- **Faiblesse** : chacun de ces éléments est reproductible en quelques semaines par Orbiq, TrustCloud ou Vanta. La « réponse honnête sans SOC 2 » est aussi décrite dans des guides gratuits (P48).

### 6. Taille de marché (bottom-up)

| Brique | Valeur | Statut |
|---|---|---|
| Éditeurs de logiciels de 11 à 50 salariés (monde, une base de prospection) | 85 000+ | [O] P44, revendication d'un vendeur, sans ventilation géographique |
| Ajout des 5-10 salariés | × 1,3 à 1,6 | [H] |
| Part vendant à des grands comptes ou à des entités régulées et recevant ≥ 6 questionnaires/an | 25 à 40 % | [H] |
| Part sans SOC 2/ISO (donc hors suites GRC) | 50 à 70 % | [H] |
| Part UE + US | ~70 % | [H] |
| **Acheteurs potentiels (TAM en nombre)** | 85 000 × 1,45 × 0,32 × 0,6 × 0,7 ≈ **16 500** (fourchette 8 000-30 000) | [E] |
| Prix moyen | 600 à 1 500 EUR/an | [H], plafonné par les offres gratuites et les outils à 29-99 USD |
| **TAM** | ≈ 5 à 45 M EUR/an | [E] |
| **SAM** (FR + DE + Benelux + vente en anglais à l'UE ; les US sont exclus en pratique pour un fondateur FR sans présence, voir §10) | 3 000 à 7 000 éditeurs × 600-1 200 EUR ≈ **2 à 8 M EUR/an** | [E] |
| **SOM à 3 ans** | 1 à 3 % du SAM, soit 60 à 200 clients × ~900 EUR ≈ **55 à 180 k EUR d'ARR** | [E] |

Aucun TAM de cabinet n'a été retenu. Le SOM est compatible avec un revenu de solo, mais il n'est pas protégé.

### 7. Pricing recommandé et alternatives

- **Recommandé : abonnement « Dossier fournisseur »**. Solo à **59 EUR/mois** (1 utilisateur, bibliothèque, 3 questionnaires/mois, trust page). Équipe à **149 EUR/mois** (illimité raisonnable, annexes DORA/NIS2, export, multi-langue). Facturation annuelle avec 2 mois offerts. Signé par le CEO ou le fondateur, par carte bancaire [H].
- **Alternative 1 : au questionnaire**, 79 à 149 EUR par questionnaire rendu (bibliothèque gratuite). Ce modèle colle au volume irrégulier et réduit l'objection « j'en ai 10 par an » [H].
- **Alternative 2 : concierge hybride** (IA + relecture humaine), 300 à 600 EUR par questionnaire ou forfait d'amorçage de 990 EUR (pack de politiques + bibliothèque initiale). Meilleure marge par client, mais c'est un service, peu scalable, avec une responsabilité accrue [H : le chiffre « 300-600 USD par questionnaire » d'un billet dev.to est une simulation, non retenu comme preuve].
- **Exemple de ROI** (cas médian) : 20 questionnaires/an × 7 h économisées × 90 EUR = 12 600 EUR, contre 149 × 12 = 1 788 EUR, soit **un ROI d'environ 7×** [E/H]. Au cas bas (10 × 3 h × 60 EUR = 1 800 EUR), le ROI tombe à environ 1× au prix Équipe et à 2,5× au prix Solo. L'offre gratuite de TrustCloud concurrence alors directement.

### 8. Intrants du modèle économique

| Intrant | Valeur | Statut |
|---|---|---|
| ARPA | 60 à 120 EUR/mois | [H] |
| COGS IA | 200 lignes × (~3 000 tokens de contexte RAG + 300 en sortie) ≈ 0,7 M tokens par questionnaire, soit 1 à 5 USD avec un modèle intermédiaire, 3 à 15 USD/mois/client | [E] calcul ; tarifs de modèles non vérifiés dans cette DD |
| Hébergement | Supabase + stockage chiffré + workers : 50 à 150 EUR/mois au total au début | [E] |
| Support et onboarding | 1 à 2 h par client au démarrage (import des anciens questionnaires, revue des réponses « non ») | [H] ; le démarrage à froid est réel (Conveyor conseille ~400 paires Q/R, P49) |
| Marge brute | 75 à 85 % hors onboarding humain | [E] |
| CAC | 300 à 1 000 EUR (contenu FR/DE + outbound) ; > 1 000 EUR aux US depuis la France | [H] ; la SERP anglaise est saturée de contenus Wolfia, Orbiq, Procurize (constat sur les résultats) |
| Cycle de vente | 1 à 14 jours si un questionnaire est en cours ; sinon pas d'achat | [H] |
| Churn | 4 à 7 %/mois : volume irrégulier, puis départ vers Vanta ou Drata une fois le SOC 2 lancé | [H] |
| Durée de vie | 15 à 25 mois | [E], dérivée du churn |
| LTV | ~90 EUR × 0,8 × 20 ≈ 1 450 EUR | [E] |
| Payback | 4 à 12 mois | [E] |
| LTV/CAC | 1,5 à 5 | [E], fragile |

### 9. Risques

- **Sécurité** : l'outil stocke la PSSI, les rapports de pentest, l'architecture et la liste des sous-traitants de dizaines d'éditeurs. C'est une cible, et l'outil lui-même recevra des questionnaires de sécurité. Un solo devra être exemplaire : chiffrement, hébergement UE, journalisation, et idéalement une certification à terme [E].
- **RGPD** : peu de données personnelles, mais des documents confidentiels. Il faut un DPA et des sous-traitants IA (OpenAI, Anthropic, Mistral) avec option « UE uniquement ». Orbiq met en avant la souveraineté et le CLOUD Act contre SafeBase (P23) : l'argument « hébergé UE » est donc déjà utilisé.
- **Responsabilité** : les réponses deviennent des engagements contractuels. Une réponse fausse peut annuler une indemnisation ou fonder une action, voire une action pour fraude si elle est délibérée (P33, source vendeur). L'outil doit :
  - ne jamais répondre « oui » sans réponse validée ;
  - marquer « à valider » toute génération ;
  - garder une trace de qui a validé quoi.
  Les CGU doivent placer la responsabilité chez l'éditeur client [E]. Le risque de réputation persiste. P28 confirme qu'on ne peut pas exclure les hallucinations même avec des documents.
- **Réglementation** :
  - NIS2 en Allemagne : en vigueur, plus de 19 000 entités enregistrées (P34). L'estimation de 29 500 est en cours de révision à la baisse possible [O].
  - NIS2 en France : non transposée (P36) [O].
  - DORA : en vigueur, registre annuel (P37), troisième cycle en 2027.
  - Aucune suspension n'a été trouvée, mais la demande est **indirecte** (P38).
- **Intégrations** : les portails acheteurs (OneTrust, Whistic, Archer, Coupa, SAP Ariba) n'ont pas d'API ouverte aux fournisseurs [H]. Il faudrait une extension navigateur, ce qui est fragile. Le parsing des Excel aux formats hétérogènes (cellules fusionnées, listes déroulantes) est le vrai travail.
- **Fiabilité IA** : le risque de réponse plausible mais fausse est le risque central (P27, P28).
- **Dépendance plateforme** : faible (API LLM interchangeables).
- **Réaction des éditeurs en place** : **déjà observée**.
  - Vanta : AI Agent (P29).
  - Drata : agent en bêta et rachat de SafeBase (P30, P03).
  - Gratuité chez TrustCloud, Conveyor et SecurityPal (P02, P10, P11).
  - Un nouveau venu bon marché sera vite copié, ou rendu gratuit dans une offre d'appel.

### 10. Distribution

- **Canal 1 : outbound ciblé FR/DE** vers les CTO et CEO d'éditeurs SaaS de 5 à 50 personnes qui vendent à la banque et à l'assurance (DORA) ou à l'industrie et à l'énergie (NIS2 DE).
  - Sources de prospects [H, non vérifiées ici] : annuaires d'écosystèmes (French Tech, Numeum, France FinTech, Bitkom), pages « clients » des éditeurs qui citent des banques, offres d'emploi « security questionnaire » ou « RSSI à temps partiel ».
  - Message : « Votre prochain questionnaire de sécurité (DORA, NIS2, SIG) rendu en 48 h, sans SOC 2 : chaque réponse est tirée de votre réalité, avec le niveau de preuve, en français ou en allemand. 59 EUR/mois. »
- **Canal 2 : partenaires prescripteurs** : vCISO à temps partiel, cabinets ISO 27001 en phase de préparation, cabinets d'avocats IT qui rédigent les annexes DORA.
  - Le partenaire revend ou utilise l'outil pour plusieurs clients [H].
  - Risque : les cabinets SOC 2/ISO préfèrent vendre la certification.
- **Canal 3 (secondaire)** : contenu SEO FR/DE sur des requêtes longues (« questionnaire DORA fournisseur modèle », « annexe NIS2 sous-traitant »). En anglais, la SERP est saturée.
- **10 conversations d'acheteurs** :
  1. poster sur Indie Hackers, r/SaaS et HN des demandes d'entretien sur le volume réel de questionnaires (le fil IH, P15, montre que le sujet suscite des réponses) ;
  2. envoyer 100 messages LinkedIn à des CTO d'éditeurs FR qui vendent à des banques ;
  3. proposer de remplir gratuitement le prochain questionnaire en échange d'un entretien (concierge).
- **Premières ventes sans audience** : concierge payant (99 à 149 EUR le questionnaire) chez 5 à 10 éditeurs, puis passage à l'abonnement quand la bibliothèque existe.
- **Vendre aux US depuis la France** : peu crédible au départ. Il faudrait affronter Vanta, Drata et les acteurs gratuits sur leur terrain, avec un CAC élevé et des fuseaux décalés [E]. Le marché accessible est l'UE.
- **Listes publiques de prospects** :
  - il n'existe pas de liste publique « éditeurs SaaS sans SOC 2 » [I] ;
  - les registres NIS2 (BSI) listent les **clients** (les entités régulées), pas les fournisseurs, et ne sont pas publics à notre connaissance [I] ;
  - le registre CSA STAR (P25) liste des fournisseurs ayant publié un CAIQ, donc plutôt des éditeurs déjà outillés [O/H].

### 11. Faisabilité

- **Architecture MVP** :
  - Node + Supabase (Postgres + pgvector + stockage chiffré + RLS) + Stripe + Brevo, une base proche de la stack Relanzio [O, contexte du dépôt] ;
  - import des anciens questionnaires et politiques (xlsx, docx, pdf) ;
  - bibliothèque de réponses canoniques validées ;
  - moteur de correspondance question → réponse canonique (embeddings + LLM), avec score de confiance ;
  - remplissage du fichier Excel d'origine avec son format conservé ;
  - piste d'audit ;
  - trust page statique ;
  - correspondances DORA art. 30 et NIS2 art. 21.
- **Intégrations indispensables** : lecture et écriture xlsx/docx fidèles, export PDF. Pas d'intégration portail en V1.
- **Briques réutilisables** : authentification, facturation Stripe et emails Brevo de la stack existante ; SheetJS ou ExcelJS ; un LLM via API.
- **Partie difficile** :
  1. la réécriture fidèle d'Excel hétérogènes ;
  2. la correspondance fiable avec refus de répondre quand c'est incertain ;
  3. le démarrage à froid (P49) ;
  4. la sécurité de l'outil lui-même ;
  5. les portails acheteurs (V2).
- **Coût et temps** : MVP en 6 à 10 semaines pour un développeur [E]. Coût d'infrastructure inférieur à 150 EUR/mois au départ [E]. Pentest externe souhaitable avant de vendre à des clients DORA : 3 000 à 8 000 EUR [H].
- **Dépendances critiques** : API LLM, qualité du parsing Excel, crédibilité sécurité du fondateur.

### 12. Défendabilité à 2 ans

- **Ce qui sera commoditisé** :
  - la génération de réponses à partir de documents (déjà faite par ChatGPT ou Claude avec des fichiers, P27) ;
  - les trust centers (gratuits, P02, P11) ;
  - l'automatisation intégrée aux suites GRC (P05, P29, P30).
- **Ce qui pourrait retenir le client** : la bibliothèque validée et versionnée, avec les preuves et l'historique « qui a répondu quoi à quel client ». Ce coût de changement est modéré : la bibliothèque est exportable, et un concurrent peut l'importer.
- **Point faible structurel** : le client « gradue ». Dès qu'il lance son SOC 2, il achète Vanta, Drata ou Secureframe, qui incluent les questionnaires. Le produit est donc une **étape transitoire** dans la vie de l'éditeur [E].
- **Défendabilité** : faible. Un léger avantage existe sur les contenus réglementaires FR/DE (annexes DORA/NIS2, ReCyF le jour où il s'appliquera), mais Orbiq le vise déjà.

### 13. Raisons de NE PAS le faire, et expériences d'invalidation

**Raisons de ne pas le faire** :
1. Gratuité et prix plancher déjà atteints : TrustCloud gratuit sous 20 salariés, trust centers gratuits, outils à 29-99 USD (P10, P11, P20-P22).
2. L'ICP sans SOC 2 a surtout besoin du SOC 2, et le jour où il l'obtient, il quitte l'outil (P31, P50).
3. Les éditeurs en place ont livré des agents IA et consolident le marché (P03, P29, P30, P42).
4. Le volume est faible et irrégulier chez moins de 50 personnes, ce qui donne un churn structurel élevé (P16).
5. Un risque de responsabilité et de sécurité disproportionné pour un solo (P33).
6. Un wrapper IA presque par définition : la valeur ajoutée hors LLM tient à la fidélité Excel et à la discipline de validation.
7. Le catalyseur français (NIS2) est bloqué ; le catalyseur DORA vise les clients, pas l'éditeur (P36, P38).

**Expériences qui invalideraient l'idée** (2 à 4 semaines) :
- **E1, volume** : 15 entretiens avec des CTO d'éditeurs FR/DE de 5 à 50 personnes qui vendent à des grands comptes. **Abandon** si la médiane est inférieure à 8 questionnaires par an ou inférieure à 4 h chacun.
- **E2, concurrence gratuite** : demander à ces CTO s'ils connaissent ou utilisent TrustCloud, SecurityPal ou un LLM. **Abandon** si plus de la moitié s'en disent satisfaits.
- **E3, consentement à payer** : offre concierge payante (149 EUR le questionnaire rendu en 48 h). **Abandon** si moins de 3 paiements sur 30 propositions qualifiées.
- **E4, wedge DORA/NIS2** : page FR/DE « Annexe DORA fournisseur prête en 48 h » et 300 visites ciblées. **Abandon** si moins de 3 % laissent leur email.
- **E5, graduation** : dans les entretiens, mesurer la part d'éditeurs qui prévoient un SOC 2 ou un ISO dans les 12 mois. Si elle dépasse 60 %, le produit n'est qu'un pont : il faut le revendre comme « préparation SOC 2/ISO » ou abandonner.

### 14. Re-notation

| Critère (poids) | Phase 1 E-top (points) | Phase 1 scores-bruts (/10) | **Phase 2 (/10)** | **Points** | Cause du changement |
|---|---|---|---|---|---|
| Douleur et budget (20) | 15 | 8 | **6** | 12 | La douleur est confirmée (HN, Reddit, IH, P12-P15). Mais le budget de l'ICP est bas, et le blocage le plus cher (SOC 2) n'est pas résolu par l'outil (P31, P50). |
| Fréquence (10) | 8 | 7 | **6** | 6 | Le volume pour moins de 50 personnes est de quelques questionnaires par mois au mieux, et irrégulier (P15, P16). |
| Preuves (15) | 8 | 6 | **5** | 7,5 | Le marché payant est prouvé, mais en mid-market. Aucune volonté de payer observée chez l'ICP. Témoignages rares, via des miroirs ; preuves surtout issues de vendeurs. |
| Distribution (15) | 9 | 6 | **4** | 6 | SERP anglaise saturée ; US peu accessibles depuis la France ; pas de liste de prospects ; prescripteurs (cabinets SOC 2) en conflit d'intérêt. |
| Lacune (10) | 5 | 4 | **2** | 2 | Gratuité (TrustCloud < 20 salariés, SecurityPal, Conveyor, CSA STAR), outils à 29-99 USD, Orbiq sur le wedge UE à 299 EUR (P02, P10, P11, P20-P23, P25). |
| Faisabilité (10) | 8 | 7 | **8** | 8 | Inchangée : MVP simple sur la stack existante ; parties dures identifiées (Excel, portails). |
| Marge (5) | 4 | 8 | **7** | 3,5 | Les COGS IA restent faibles, mais l'ARPA est bas et le churn élevé. |
| Timing (5) | 4 | 7 | **6** | 3 | NIS2 DE et DORA sont réels (P34, P37) mais indirects ; NIS2 FR bloquée (P36). |
| Défendabilité (5) | 2 | 6 | **2** | 1 | Commoditisation déjà en cours (agents Vanta et Drata) ; graduation des clients. |
| Risques (5) | 4 | 7 | **5** | 2,5 | Responsabilité sur les réponses (P33), stockage de documents sensibles, hallucinations (P28). |
| **Total** | **67** | **≈ 66** | — | **51,5** | |

**Confiance** : moyenne sur la concurrence et les prix (nombreux extraits concordants), faible sur le volume et la volonté de payer (aucun entretien).

**Verdict** : **NO-GO en l'état.** Le problème est réel, mais pour l'ICP visé la lacune est déjà fermée par des offres gratuites, des outils à moins de 100 USD et les agents IA des suites GRC. Seul un pivot très étroit (annexes DORA/NIS2 en FR/DE, sans SOC 2) reste envisageable, et uniquement si E1 à E3 réussissent.
