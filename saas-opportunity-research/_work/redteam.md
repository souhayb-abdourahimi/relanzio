# Red team — comité d'investissement contradictoire

Date : 2026-10-29. Rôle : contradicteur distinct des analystes de due diligence. Langue : français.

**Méthode.**
- 30 requêtes WebSearch, dont environ 80 % visaient l'invalidation des pistes n° 1 à n° 3.
- 1 essai WebFetch (`www.formiva.fr`, ENOTFOUND), puis abandon. Toutes les preuves nouvelles sont donc des **extraits de recherche**. WebSearch renvoie des résumés rédigés par un modèle, pas des citations brutes, ce qui rend la confiance plus faible que l'étiquette « observé » ne le laisse croire (voir Biais, B7).
- Preuves nouvelles : `redteam-preuves.csv` (`RT-P01` à `RT-P41`).
- Étiquettes : **[O]** observé dans un extrait ; **[E]** estimation ; **[H]** hypothèse ; **[I]** inconnu.

**Synthèse en 5 lignes.**
1. Aucune des pistes n'a de preuve de volonté de payer : zéro entretien, zéro précommande. « Aucune idée validée » est le **constat factuel**, pas une option parmi d'autres.
2. Le n° 1 (D-37) est le plus touché par les preuves nouvelles. Le SYCFI présente le 4/11/2026 un outil qui occupe exactement le wedge « sous-traitance » [RT-P03]. Qualiobee a une offre Indépendant à 49 €/mois avec émargement [RT-P06]. Le guide v10 et les arrêtés de l'indicateur 19 n'étaient toujours pas publiés au 20/10/2026 [RT-P01, RT-P02]. Enfin, une partie du « catalyseur anti-fraude » sur la sous-traitance est antérieure : la déclaration CPF existe depuis 2023 [RT-P12].
3. Le n° 2 (E-13) garde une lacune étroite mais réelle chez Obat, Tolteck, EBP, Batappli et Costructor. C'est une absence de preuve, pas une preuve. Extrabat (relance de devis par SMS) et Abby Pro réduisent cette lacune [RT-P19, RT-P20, RT-P27]. Le test d'invalidation le moins cher (essayer les logiciels concurrents, 1 jour) n'a **toujours pas été fait**, alors que le produit est construit.
4. Le n° 3 (A-23 « via partenaire ») est contradictoire dans les termes. Le premier partenaire possible, Health Mart Atlas (McKesson, la plus grande PSAO), affirme déjà rapprocher les remboursements liés à l'IRA [RT-P34, RT-P35]. Beacon est gratuit [RT-P31].
5. Après correction, les trois pistes tombent dans une bande de 51 à 56 points, à l'intérieur du bruit de mesure. **La note ne peut plus départager les pistes. Ce qui doit décider, c'est le coût et la vitesse du test de demande.**

---

## Objections n° 1 — D-37 « Preuvio » (preuves de réalisation opposables + sous-traitance), Pack audit 149 €, puis 29 €/mois

### Les 5 objections les plus graves

**O1. Le wedge « sous-traitance » est déjà occupé par le prescripteur naturel du marché.**
- Le SYCFI, le syndicat des consultants-formateurs indépendants (adhésion à 192 €/an [RT-P05]), organise le 4/11/2026 un webinaire **gratuit** : « Centralisez votre conformité Qualiopi et celle de vos sous-traitants ». Il y présente le « Portail des Formateurs » et les obligations de la loi anti-fraude du 25/6/2026 [RT-P03].
- Le prix, l'opérateur et les fonctions de ce portail sont [I]. Mais le canal 2 du dossier (SYCFI en co-webinaire) devient au mieux un partenariat à négocier avec un acteur qui a déjà son outil, au pire un concurrent qui distribue gratuitement à la cible.
- Le SYCFI organisait aussi le 28/10/2026 un webinaire « Qualiopi V10 » [RT-P04]. La pédagogie de la réforme, base du « Diagnostic V10 », est donc déjà offerte par le syndicat.

**O2. Le catalyseur « loi anti-fraude 2026-534 → sous-traitance » est en partie mal attribué, et sa date reste incertaine.**
- La **déclaration annuelle de sous-traitance CPF** vient du décret 2023-1350. Elle se fait gratuitement sur EDOF ; la campagne 2026 s'est tenue du 1/5 au 30/9 [RT-P12]. Ce n'est pas nouveau, et un outil public la couvre déjà.
- Le **devoir de vigilance du maître d'ouvrage** introduit par la loi est générique : contrôle des formalités L8221-3 et L8221-5 du Code du travail (travail dissimulé), au-delà d'un montant. Il entre en vigueur à une date fixée par décret, **au plus tard le 26/12/2026** [RT-P11]. Il n'est pas propre à Qualiopi.
- Pour Centre Inffo, la portée opérationnelle du volet formation **dépend de textes d'application encore à publier** [RT-P13]. Aucune recherche n'a trouvé de montant d'amende propre aux OF pour la sous-traitance [O d'absence].
- Pour l'**indicateur 27**, la nouveauté se résume à une conformité tracée **dans les contrats**, portage salarial compris [RT-P10]. Il suffit d'une clause type et d'une trace de vérification : c'est un modèle de document, pas un logiciel.

**O3. On ne peut pas vendre des preuves « opposables » tant que le texte qui fixe les preuves recevables n'existe pas.**
- Le guide de lecture v10 n'était pas publié le 2/10/2026 (CNFCE) [RT-P01]. Les deux arrêtés des indicateurs 19 et 20 ne l'étaient pas au 20/10/2026 (SchoolMaker) [RT-P02]. Le v9 du 8/1/2024 reste la référence.
- Le mot « opposable » engage la responsabilité de l'éditeur, d'autant que l'émargement serait « maison », sans prestataire eIDAS. Edusign revendique déjà l'acceptation de ses feuilles par les financeurs [DD-D37].
- Un guide de lecture du marché admet déjà, pour le distanciel, des attestations de connexion et des relevés LMS ou de visioconférence. Si le guide v10 confirme que **tout export LMS suffit**, le volet indicateur 19 perd sa valeur (c'était déjà l'expérience E5 du dossier). Ce point repose sur un extrait d'attribution incertaine [RT-P16].

**O4. La lacune est plus étroite que la note 3/10 ne le laisse croire.**
- **Qualiobee** : formule Indépendant à **49 €/mois**, Équipe à 79 €, Organisme à 139 €, avec utilisateurs illimités et émargement électronique (Appvizer) [RT-P06]. Un autre agrégateur ne montre qu'une offre Enterprise [RT-P07]. Le dossier DD indiquait « prix inconnu ».
- **Formiva** : plan gratuit (50 apprenants/an, 1 formateur), puis 39 et 99 € ; module Qualiopi avec « agent d'audit IA » [RT-P08]. La source est intéressée (Certiforma), mais elle concorde.
- **Digiforma** (49 €) et **Edusign** (39 €) gèrent l'émargement en présentiel et en distanciel, avec signature de l'intervenant chez Edusign [RT-P14, RT-P15].
- **Ce qui reste ouvert** : aucune source ne montre un module **dédié** aux sous-traitants (contrats, CV, attestations de veille, vigilance L8221) chez Formiva, Digiforma ou Qualiobee [RT-P09 ; absence de preuve]. C'est le seul espace libre, et le SYCFI vient de s'y placer (O1).

**O5. Le segment visé se contracte, et le modèle est ponctuel.**
- Plafond CPF à 1 500 € : un OF de Charente prévoit **200 k€ de perte** de CA en 2026 (question écrite AN 17876, 1/9/2026) [RT-P17]. On ne dispose que d'un cas, sans statistique par taille [I].
- La loi anti-fraude **vise précisément la « fausse » sous-traitance et le portage Qualiopi** [RT-P18]. Le sous-segment « OF qui sous-traite » est donc celui que la réforme veut réduire.
- Le Pack audit à 149 € est un achat ponctuel. Le passage à 29 €/mois suppose une rétention que le dossier lui-même juge faible (pic de churn après l'audit, Drive gratuit suffisant).

### Scénarios d'échec concrets
1. **Le portail SYCFI est gratuit pour les adhérents (192 €/an).** Les consultants-formateurs indépendants, cœur de l'ICP, l'adoptent par défaut. Preuvio se retrouve à vendre aux OF de 2 à 10 personnes non adhérents, une cible sans liste et sans canal.
2. **Le guide v10 paraît en décembre 2026 ou en 2027** avec des preuves recevables différentes de celles codées. Le produit doit être refait, et le Pack audit vendu entre-temps devient un risque de réclamation.
3. **L'entonnoir ne se remplit pas.** Le plan prévoit 300 emails, un seuil de STOP à 3 % de diagnostics demandés (soit 9 diagnostics), et un succès à 3 précommandes **sur 30 diagnostics**. Pour obtenir 30 diagnostics à 3 %, il faut environ **1 000 emails**, alors que la liste data.gouv ne donne pas d'email (enrichissement manuel). L'expérience ne peut donc pas atteindre sa propre condition de succès. **Incohérence du plan de test.**
4. **Ventes réalisées, rétention nulle.** Quelques Packs à 149 € sont vendus à des OF dont l'audit approche ; aucun ne passe à l'abonnement, car Formiva gratuit ou un Drive suffisent hors période d'audit. On obtient environ 450 € de revenus et un produit à maintenir au rythme des textes.
5. **Qualiobee, Formiva et Digiforma** publient leur grille V10 et un écran « sous-traitants » en quelques semaines. Leurs clients ne changent pas d'outil.

### Ce qui a été surestimé dans DD-D37
- **Distribution 7/10.** Pas d'email dans la liste publique, SEO saturé, aucune communauté identifiée, et le SYCFI a son outil. **5/10 est plus réaliste.**
- **Timing 8/10.** Le pic d'avant le 1/11 est passé, le guide et les arrêtés manquent, et le volet sous-traitance de la loi dépend de décrets. **5/10.**
- **Risques 7/10.** La promesse « opposable » engage la responsabilité ; il y a des données de handicap ; le texte n'est pas stabilisé. **5/10.**
- **Lacune 3/10.** Qualiobee à 49 € et le portail SYCFI la réduisent encore. **2/10.**
- **Note red team indicative : 62,5 − 3 − 1,5 − 1 − 1 = environ 56/100** [E].

---

## Objections n° 2 — E-13 (Relanzio, relance de devis TPE) en test borné, D-20 en module ultérieur

### Vérification des concurrents (nouvelles recherches)
| Éditeur | Relance **automatique de devis** ? | Preuve |
|---|---|---|
| **Extrabat** | **Oui, par SMS** (module CRM, « relances automatiques ») | [O] BDM, Appvizer [RT-P19, RT-P20]. La plaquette officielle 2023 ne cite que des rappels d'entretien |
| **Abby** | **Probablement** : un guide parle de relances programmées pour les devis en attente ; plan Pro à 19 €/mois selon un comparatif | [O marketing, confiance faible] [RT-P27, RT-P28] |
| **Obat** | Non trouvée : guide de relance **manuelle** par email | [O d'absence] [RT-P22] |
| **Tolteck** | Non trouvée : tri manuel des devis en attente ; relances automatiques d'**impayés** ; 25 € HT, ou 19 € en annuel | [O d'absence] [RT-P21] |
| **EBP Bâtiment** | Non trouvée : lettres de relance de **règlements**. Le suivi « devis à relancer » apparaît dans l'app EBP Gestion Commerciale, pas dans la version Bâtiment | [O d'absence] [RT-P24] |
| **Batappli** | Non trouvée : envoi automatique par email seulement | [O d'absence] [RT-P26] |
| **Costructor** | Non trouvée : relances d'impayés (formule à 30 €) | [O d'absence] [RT-P23] |
| **Hemea** | Non trouvée : logiciel gratuit pour ses artisans, avec signature électronique (information de 2020-2021) | [O d'absence, ancien] [RT-P25] |
| Freelances n8n (ComeUp) | Oui : séquences J+3/J+7/J+14, avec détection de l'envoi depuis Pennylane, Henrri, Axonaut ou Sellsy | [O] [RT-P29] |

**Lecture.** La lacune « logiciels BTP sans relance de devis » tient, mais **uniquement sur la base d'absences de preuve dans des extraits**. Le premier éditeur BTP vérifié avec la fonction (Extrabat) l'a, par SMS. Il faut faire les essais réels avant toute autre action.

### Les 5 objections les plus graves
**O1. Une fonction vendue au prix d'un logiciel complet.**
- L'ancrage du prix est défavorable : Tolteck à 19 € (annuel) et Abby Pro à 19 € couvrent devis, factures, facture électronique et relances d'impayés [RT-P21, RT-P28].
- Relanzio à 24-29 € pour **une** fonction, sans ROI mesuré, se vend mal. Le portail de facture électronique de 2027 poussera l'artisan vers une suite tout-en-un (DD-E13 §9).

**O2. La lacune s'érode, et le test qui la vérifie n'a pas été fait.**
- Extrabat et Abby ont déjà la fonction ; Axonaut, Sellsy et Jobber aussi (DD-E13).
- Obat, Tolteck et EBP peuvent l'ajouter rapidement [H].
- **Biais d'engagement** : un produit de 7 000 lignes a été construit avant un essai d'une journée des quatre logiciels concurrents.

**O3. Le test « borné » à 30 jours ne peut pas mesurer ce qu'il prétend mesurer.**
- Calcul : 10 artisans × environ 9 devis sans réponse par mois = environ 90 devis relancés. Avec r = 5 %, on attend **environ 4 à 5 devis gagnés au total**. L'intervalle de confiance couvre aussi bien r ≈ 1 % que r ≈ 10 %.
- Les cycles de décision en BTP durent plusieurs semaines [H]. Le critère « au moins 1 devis gagné après relance par artisan en médiane sur 30 jours » (DD-E13 E3) sera donc **en échec mécanique**, ou sa réussite sera due au hasard.
- Il faut un critère de test fondé sur un **comportement d'achat** (paiement, carte enregistrée) et sur un **indicateur avancé** (taux de réponse aux relances), pas sur r.

**O4. Double saisie et identité d'envoi : les deux points durs ne sont pas résolus.**
- Il faut entrer chaque devis : transfert en copie cachée ou CSV, prévus en V2.
- L'adresse d'envoi pose problème : beaucoup d'artisans ont une adresse gmail ou orange, impossible à authentifier par DMARC.
- La détection des réponses passe par IMAP avec mot de passe stocké, ce qui est un **risque de sécurité** (DD-E13 §9).
- Un pilote qui envoie des relances en spam, ou qui relance un client ayant déjà signé, détruit la confiance dès la première semaine.

**O5. Même un succès donne un petit business.**
- CAC en vente directe d'environ 20 à 30 h de fondateur par client, LTV d'environ 360 € (DD-E13 §8).
- Plafond central à 24 mois : 30 à 60 k€ d'ARR [E].
- Le fondateur doit accepter ce plafond **avant** le test, sinon un « succès » mène à un piège de rentabilité.

### D-20 en « module ultérieur » : à retirer de la feuille de route
DD-D20 conclut lui-même que l'extension « devis → facture → encaissement » est **un piège comme produit autonome**. Le statut « encaissée » appartient aux Plateformes Agréées, qui offrent déjà le suivi des paiements et les relances. Ajouter D-20 à Relanzio, c'est se rapprocher d'un logiciel de facturation sans la conformité facture électronique, face à des concurrents gratuits ou à 19 €. **Le seul ajout défendable est un simple rappel d'échéance**, sans rapprochement, et seulement après des paiements observés sur E-13.

### Scénarios d'échec concrets
1. **Les 30 jours partent dans les « gates ».** Les vérifications listées dans le README (build, Supabase, Stripe, QA, délivrabilité) occupent le temps à la place des conversations. Le dépôt indique « non prêt pour pilotes ».
2. **Les pilotes arrêtent de saisir leurs devis** à partir de la deuxième semaine. Le tableau de bord EUR reste vide, et le paiement n'est jamais demandé.
3. **Faux positif.** Trois amis ou connaissances paient 19 € « pour aider », puis résilient au troisième mois.
4. **Un éditeur ajoute la fonction.** Obat ou Tolteck annonce une relance automatique de devis : le message « gardez votre logiciel » perd son objet.
5. **Incident de délivrabilité ou RGPD.** Un client particulier se plaint d'avoir été « harcelé ». Pour un artisan, c'est une atteinte directe à la réputation.

### Ce qui a été surestimé dans DD-E13
- **Faisabilité 8/10** : les trois parties difficiles (identité d'envoi, entrée des devis, intégrations) ne sont pas faites.
- **Risques 7/10** : le stockage IMAP et la délivrabilité méritent plutôt 5 ou 6.
- **Lacune 3/10** : Extrabat et Abby la réduisent à environ 2,5.
- **Note red team indicative : environ 50 à 51/100** [E].
- **Seul vrai atout** : le **coût marginal du test** est le plus bas des trois. Cela ne justifie pas la note, mais cela justifie l'ordre des tests.

---

## Objections n° 3 — A-23 (remboursements MFP, pharmacies indépendantes US), uniquement via un partenaire PSAO ou une coopérative

### Les 5 objections les plus graves
**O1. Le partenaire visé est déjà un concurrent.**
- Lors de McKesson ideaShare 2026, Health Mart Atlas est présenté, avec McKesson Reimbursement Advantage et ProviderPay, comme aidant les officines indépendantes à rapprocher les remboursements fabricants liés aux prix négociés de l'IRA [RT-P34]. C'est une déclaration générale, sans description du flux.
- Health Mart Atlas est la **première PSAO** (6 077 officines), devant Cardinal (5 416) et Elevate (5 014) au 1/1/2024 [RT-P35]. Ces trois PSAO appartiennent à des grossistes.
- IPC suit déjà les inscriptions MTF de ses membres [RT-P40].
- Une PSAO n'a aucune raison de confier des PHI à un éditeur solo, non américain, sans SOC 2.

**O2. Des substituts gratuits et officiels couvrent le cœur du besoin.**
- Beacon MFP : « accès et utilisation gratuits », avec tableau de bord des fichiers de remboursement, erreurs de validation, base de calcul et GFI ouvertes [RT-P31, RT-P32].
- CMS : le Claims Tracking Report donne une visibilité ligne à ligne, à croiser avec le 835 [RT-P36].
- NCPA et Apex : un tutoriel de rapprochement gratuit (janvier 2026) [RT-P33].
- Outcomes vend déjà le rapprochement ligne à ligne aux indépendants, avec récupération du 835 et des chargés de compte ; le MFP n'y est pas mentionné [RT-P37].

**O3. La douleur exprimée est la trésorerie, que le produit ne traite pas.**
- La plupart des titulaires attendent **22 jours ou plus** leurs remboursements (enquête NCPA, 27/2/2026) [RT-P41].
- Le chiffre de « 20 % de remboursements manquants » vient de **Plenful**, mesuré chez des **systèmes de santé**, dans un contenu de fournisseur [RT-P38]. Aucune mesure n'existe chez les indépendants non 340B [I].

**O4. Pour un fondateur solo basé en France, le « partenariat » n'est pas un plan sur 30 jours.**
- Il faut une BAA, une LLC américaine, une assurance cyber/E&O et le statut TPSE ([I] pour une entité détenue par un non-US). Le cycle PSAO prend 3 à 9 mois (DD-A23).
- Avec un capital modéré, il est irréaliste de financer 3 000 à 10 000 $ de conformité avant toute lettre d'intention.

**O5. Le cadre réglementaire peut encore bouger.**
- La guidance d'effectuation 2028 était en projet (16/07/2026, commentaires jusqu'au 18/9). Aucune version finale n'a été trouvée [RT-P39].
- Un modèle prospectif, ou l'enrichissement des rapports CMS et Beacon, supprimerait la valeur ajoutée.

### Scénarios d'échec concrets
1. **Six mois d'échanges courtois avec IPC ou AAP**, qui demandent une BAA, un SOC 2, un pilote gratuit de 6 mois, puis intègrent la fonction eux-mêmes ou l'achètent à Outcomes ou Plenful.
2. **L'expérience 2 de DD-A23 échoue** : moins de 1 % du flux est non payé au-delà de 45 jours chez les indépendants. Le produit n'a plus d'objet.
3. **Beacon ajoute un import PMS.** Les pharmacies n'ont plus besoin d'un outil tiers.

### Ce qui a été surestimé
- **Douleur 7/10** : la douleur porte sur la trésorerie, pas sur des écarts mesurés.
- **Timing 8/10** : la guidance 2028 n'est pas finale.
- **Lacune 3/10** : avec Health Mart Atlas et Beacon, plutôt 2.
- **Note red team indicative : environ 52 à 54** [E]. Dans la configuration « partenaire seulement », la probabilité de signer un accord en 30 jours est **très faible** [H].

**Incohérence de sélection.** A-39 (courtiers, devoir de conseil ACPR, **France**, 53) et B-11 (53) ont une note à peine plus basse qu'A-23 (55). Retenir une piste **américaine** dont la distribution est notée 3/10 comme n° 3 n'est pas cohérent avec le constat central de l'étude (la distribution est le maillon faible pour ce fondateur). Recommandation : **pas de n° 3**, plutôt qu'un n° 3 de principe.

---

## Option « AUCUNE IDÉE VALIDÉE À CE STADE »

### Est-ce la conclusion honnête ? Oui, sans réserve.
- **Aucune** des 8 pistes n'a de preuve de volonté de payer : aucun entretien, aucune précommande, aucune liste d'attente (brief Preuvio §« Ce qui n'existe pas encore » ; DD-E13 §13 ; DD-A23 §13).
- Les 8 pistes ont perdu 9 à 22 points dès qu'on a cherché des preuves contraires. Les notes finales (51,5 à 62,5) ont une confiance « moyenne » ou « moyenne-faible ». Après la red team, les trois pistes envisagées tombent entre **51 et 56 points**. **C'est l'écart que produirait un changement d'analyste.**
- Aucune n'atteint un seuil raisonnable de GO, qu'on peut placer autour de 65-70 avec au moins une preuve de paiement [H sur le seuil].
- Toutes les preuves viennent d'**extraits résumés** : aucun texte officiel n'a été lu (Légifrance, CMS) et aucune page tarifaire officielle non plus.

**Mais « aucune idée validée » ne veut pas dire « rien à tester ».** La recherche documentaire a atteint son rendement décroissant : WebFetch est bloqué, les sources sont des extraits, le SEO est contaminé par les éditeurs. Une 9e due diligence n'apporterait presque rien. **Seul le terrain peut maintenant faire bouger les notes.**

### Meilleur usage de 30 jours (proposition)
**Principe** : aucun nouveau code produit, moins de 150 € de dépenses, 2 pistes en parallèle avec des critères d'arrêt **écrits avant le premier appel**. A-23 reçoit zéro heure.

| Jours | Action | Critère d'arrêt (pré-enregistré) |
|---|---|---|
| J1-J2 | **Tests d'élimination à la journée.** E-13 : essais gratuits d'Obat, Tolteck, EBP Bâtiment, Batappli, Costructor, Extrabat et Abby (relance de devis : oui ou non, par quel canal). D-37 : Formiva (gratuit), Qualiobee (essai), Digiforma (démo) sur sous-traitants, distanciel et export | E-13 : **≥ 2 logiciels BTP sur 4** (Obat, Tolteck, EBP, Batappli) ont la relance automatique de devis → abandon du wedge BTP. D-37 : **≥ 2 outils** ont un module sous-traitants (contrats, CV, attestations) → abandon du wedge 1 |
| J1-J7 | **D-37 : assister au webinaire SYCFI du 4/11** (gratuit). Relever le prix du Portail, son opérateur, ses fonctions et un éventuel programme partenaire. Vérifier sur une machine non bloquée si le guide v10 et les arrêtés de l'indicateur 19 sont parus | Portail gratuit ou inclus dans l'adhésion, avec un module sous-traitants complet → **STOP D-37**, sauf si un partenariat (intégration, marque blanche) est proposé |
| J3-J25 | **E-13 : 20 entretiens problème** avec des artisans d'une verticale et d'un département. Questions sur le comportement passé : « vos 5 derniers devis sans réponse, qu'en avez-vous fait ? ». Puis un **concierge payant d'emblée** : 19 € le premier mois, ou carte enregistrée, auprès de 5 à 10 artisans. Relances faites à la main ou avec l'outil, depuis le domaine Relanzio avec Reply-To | **< 3 artisans sur 10 paient ou enregistrent leur carte** → STOP. **≥ 60 %** répondent « mon outil le fait » ou « le téléphone me suffit » → STOP. Indicateur avancé : **taux de réponse aux relances < 15 %** → STOP [H sur le seuil] |
| J3-J25 | **D-37 : 15 entretiens** avec des OF de 2 à 10 personnes **qui sous-traitent** (liste data.gouv enrichie à la main), plus 3 consultants Qualiopi. Ne pas vendre de « preuves opposables ». Proposer un **diagnostic payant ou une précommande** du Pack, remboursable si le guide v10 change le périmètre | **< 4 sur 15** ont un audit dans les 9 mois **et** une douleur sous-traitance → STOP. **< 3 précommandes** sur **15** entretiens qualifiés (et non sur 30 diagnostics, voir le scénario d'échec 3) → STOP |
| J26-J30 | **Comité de décision** fondé uniquement sur les critères ci-dessus | Si aucune piste ne passe : **arrêter les deux**. Ne pas rouvrir la longlist par recherche documentaire. Analyser les ~35 entretiens pour y repérer les douleurs **payées** (sourcing par le problème) |

Répartition indicative du temps : 60 % sur E-13 (le test le moins cher, le produit existe), 40 % sur D-37. **Aucune ligne de code D-37 avant J30.**

---

## Biais du processus

Biais déjà reconnus (phase 1 surnotée, sources intéressées, peu de recherche contraire, distribution US optimiste), plus les suivants :

- **B1. Malédiction du vainqueur et régression vers la moyenne.**
  - Retenir le maximum de 206 notes bruitées surestime mécaniquement les gagnantes. La DD a corrigé de 9 à 22 points, mais elle partait de la grille de phase 1 (**ancrage**).
  - Une notation « à froid », sans voir la note précédente, serait probablement plus basse [H].
  - Les écarts entre finalistes (51,5 à 62,5) ne sont **pas significatifs**.
- **B2. Confusion entre catalyseur réglementaire et demande.**
  - La grille compte dans « Preuves » (15 pts) des preuves **réglementaires** : décret confirmé, JO, nombre de certifiés. Ce ne sont pas des preuves de **demande**.
  - Le brief de phase 1 (« privilégie obligations documentaires, réglementations ») a orienté vers des idées où **l'obligation existe, mais où un Drive ou un outil public gratuit suffit**.
  - Le raisonnement implicite « obligation = besoin de logiciel » n'a jamais été testé.
- **B3. Biais de disponibilité SEO.**
  - Les sujets très documentés (Qualiopi, relance de devis) **paraissent** riches en preuves. Mais ce contenu est produit par les éditeurs concurrents : Certiforma = Formiva, Plateya, Obat, Abby, Tensoria (qui publie à la fois sur la relance BTP et sur la preuve Qualiopi par IA) [RT-P30].
  - Une forte densité de contenu signale un marché **saturé**, pas une lacune.
- **B4. Lampadaire et proximité de la stack (oui, le n° 1 en est influencé).**
  - DD-D37 note la faisabilité 8/10 et la distribution comme « bonne » parce que le projet serait « cohérent avec la stack Relanzio (Node, Supabase, Stripe, Brevo) » et réutiliserait les « relances Brevo » (§10, §11).
  - Or cette stack est **banale** : n'importe quel concurrent l'a. Ce n'est pas un avantage.
  - Le vrai facteur est la **zone de confort francophone**. Il est légitime pour la distribution, mais **Relanzio n'a encore aucun client payant** (« non prêt pour pilotes »). L'expérience du fondateur ne prouve donc **aucune capacité de vente** auprès des TPE.
  - D-37 et E-13 sont tous deux dans la zone de confort. A-39 (France) a été écarté au profit d'A-23 (US) : la sélection n'est pas cohérente.
- **B5. Escalade d'engagement avant preuve.**
  - D-37 a déjà un **nom de produit (« Preuvio »)**, un brief de conseil et une grille tarifaire en trois niveaux, sans un seul entretien.
  - E-13 reste dans le top 3 à 52, devant A-39 et B-11 (53), **parce que le code existe**. DD-E13 interdit pourtant explicitement tout bonus pour le code.
  - Le maintien est défendable uniquement par le coût du test, à condition de le dire.
- **B6. Composition narrative.**
  - Le schéma « E-13 puis D-20 en module » et « A-23 via partenaire » transforme des **NO-GO** de DD en options. On rassemble des pistes faibles pour fabriquer une feuille de route.
  - Deux pistes faibles combinées ne font pas une piste forte. DD-D20 dit lui-même que l'extension est un piège.
- **B7. Qualité réelle des preuves surévaluée.**
  - WebSearch renvoie des **résumés rédigés par un modèle**. Les étiquettes [OBS] ou [O] reposent donc sur une couche d'interprétation.
  - Exemple de fragilité : l'intitulé du webinaire SYCFI parle d'évolutions « applicables au 1/10/2026 », alors que l'entrée en vigueur est le 1/11 [RT-P04].
  - Plusieurs attributions de source sont incertaines dans les extraits (voir colonne « confiance » du CSV).
- **B8. La grille n'a pas de critère d'accès du fondateur.**
  - Rien ne mesure le réseau ou la légitimité du fondateur auprès de l'ICP (formateurs, artisans, pharmaciens).
  - Avec un critère « accès personnel à 20 acheteurs en 2 semaines », A-23 serait éliminé d'emblée, et l'ordre entre D-37 et E-13 dépendrait du carnet d'adresses réel du fondateur [I].
- **B9. Plans de test incohérents.**
  - D-37 : 3 précommandes sur 30 diagnostics n'est pas atteignable avec 300 emails à 3 %.
  - E-13 : le critère r ne peut pas être mesuré en 30 jours.
  - Les seuils de test ont été posés sans calcul de puissance. Un test incapable de réussir ou d'échouer de façon nette entretient l'ambiguïté et prolonge les projets.

---

## Classement recommandé

**Statut officiel : AUCUNE IDÉE VALIDÉE.** Il ne faut pas présenter de « n° 1 » au sens d'une piste à construire.

Ordre des **tests de demande** sur 30 jours, à classer par valeur d'information divisée par le coût, et non par note :

| Rang | Piste | Note DD | Note red team [E] | Décision |
|---|---|---|---|---|
| **1** | **E-13 : test commercial borné** (concierge payant, 20 entretiens, essais des concurrents à J1-J2) | 52 | ~50-51 | Tester en premier : coût marginal quasi nul, critères d'arrêt nets, réponse en moins de 30 jours. Plafond assumé : micro-SaaS de 30 à 60 k€ d'ARR [E] |
| **2** | **D-37 : découverte seulement** (webinaire SYCFI, 15 entretiens OF sous-traitants, précommandes remboursables) | 62,5 | ~56 | Pas de code et pas de promesse « opposable » avant le guide v10 et l'évaluation du Portail SYCFI. Le wedge se réduit à « OF de 2 à 10 personnes qui sous-traitent, hors adhérents SYCFI » |
| — | D-20 en module | 56 | — | Retiré de la feuille de route. Au plus, un rappel d'échéance simple si E-13 paie |
| — | A-23 via partenaire | 55 | ~52-54 | **Parqué** : zéro heure sur 30 jours. Rouvrir uniquement sur un signal externe (voir conditions) |

Pourquoi E-13 passe devant D-37 malgré une note plus basse : les deux notes sont dans le bruit, et D-37 a perdu le plus face aux preuves nouvelles (SYCFI, Qualiobee à 49 €, texte non stabilisé). Pour D-37, construire maintenant reviendrait à coder contre un guide de lecture qui n'existe pas. E-13 peut être testé **sans écrire de code**.

## Conditions d'inversion

**D-37 repasse n° 1 et justifie un MVP si au moins 3 des 5 conditions sont remplies :**
1. Le guide v10 ou les arrêtés sont publiés et exigent pour les indicateurs 19 ou 27 des preuves précises (horodatage, attestations de sous-traitants) que Formiva, Qualiobee et Digiforma ne produisent pas (constat lors des essais de J1-J2).
2. Le Portail des Formateurs du SYCFI se révèle payant, limité, ou **ouvert à un partenariat** (intégration ou distribution). Le cas le plus favorable : le SYCFI devient le canal.
3. Au moins 4 OF sur 15 qui sous-traitent citent un contrôle CDC ou DGEFP, une non-conformité sur l'indicateur 27, ou une exigence de vigilance de la part d'un donneur d'ordre.
4. Au moins 3 précommandes ou acomptes sur 15 entretiens qualifiés.
5. Le décret d'application du devoir de vigilance (au plus tard le 26/12/2026) fixe un seuil qui touche les petits OF.

**E-13 sort du classement si :**
- au moins 2 des 4 logiciels BTP visés ont la relance automatique de devis ;
- ou au moins 60 % des répondants disent « mon outil le fait » ou « le téléphone me suffit » ;
- ou moins de 3 artisans sur 10 paient ;
- ou moins de 50 % des pilotes saisissent au moins 5 devis la première semaine sans aide.

**A-23 revient seulement si :**
- une PSAO ou une coopérative signe une **lettre d'intention écrite** de pilote en marque blanche, avec accès aux données ;
- **et** des données anonymisées de 3 officines montrent plus de 1 % du flux non payé au-delà de 45 jours.
Sans ces deux conditions, la piste reste parquée.

**« Aucune idée » devient la conclusion définitive (arrêt des deux pistes) si** E-13 et D-37 échouent tous deux à leurs critères à J30. Dans ce cas, on n'ouvre pas de nouvelle due diligence documentaire. On repart des douleurs **payées** relevées dans les ~35 entretiens.

---

## Preuves nouvelles (détail : `redteam-preuves.csv`)

**Contre D-37**
- Portail SYCFI sur la sous-traitance [RT-P03].
- Guide v10 et arrêtés absents [RT-P01, RT-P02].
- Qualiobee Indépendant à 49 € [RT-P06].
- Déclaration de sous-traitance CPF existant depuis 2023 [RT-P12].
- Vigilance L8221 générique, entrée en vigueur au plus tard le 26/12 [RT-P11].
- Textes d'application attendus [RT-P13].
- Indicateur 27 : une clause contractuelle suffit [RT-P10].
- Plafond CPF : perte de 200 k€ pour un OF [RT-P17].

**Pour D-37**
- Aucun module sous-traitants trouvé chez Formiva, Digiforma ou Qualiobee (absence de preuve) [RT-P09].

**Contre E-13**
- Extrabat : relance de devis par SMS [RT-P19, RT-P20].
- Abby : relances de devis, plan Pro à 19 € [RT-P27, RT-P28].
- Offres n8n intégrées aux suites [RT-P29].

**Pour E-13 (lacune par absence)**
- Obat [RT-P22], Tolteck [RT-P21], EBP [RT-P24], Batappli [RT-P26], Costructor [RT-P23].

**Contre A-23**
- Health Mart Atlas rapproche les remboursements IRA [RT-P34], et c'est la plus grande PSAO [RT-P35].
- Beacon gratuit [RT-P31, RT-P32].
- Claims Tracking Report de CMS [RT-P36].
- Tutoriel NCPA [RT-P33].
- Douleur = délai de paiement [RT-P41].
- Guidance 2028 non finale [RT-P39].

**Pour A-23**
- 20 % de remboursements manquants selon Plenful : chiffre de fournisseur, mesuré chez des systèmes de santé [RT-P38].

**Limites.**
- Les pages officielles (formiva.fr, Légifrance, cms.gov, ncpa.org) n'ont pas été lues, faute d'accès (WebFetch bloqué). `www.formiva.fr` doit être autorisé dans les réglages réseau de la session pour pouvoir le vérifier.
- Plusieurs attributions d'extraits sont incertaines (confiance faible dans le CSV).
- L'existence de la relance de devis chez Obat, Tolteck, EBP et Batappli **doit être vérifiée par essai réel**. Ce test d'une journée est la première action à faire.
