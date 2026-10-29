# Red team n° 2 : N1-V09 (propreté), N2-01 (API d'e-facturation), N3-01 (recouvrement au succès)

Date : 2026-10-29. Rôle : contradicteur. Preuves : `redteam2-preuves.csv` (RT2-P01 à RT2-P46). Dans ce document, `Pxx` renvoie à `RT2-Pxx`. `N1-Pxx`, `N2-Pxx` et `N3-Pxx` renvoient aux registres des dossiers attaqués.

## En bref

- **L'affirmation centrale de V09, « aucun éditeur financé trouvé », est fausse.** Senef (Progiclean et Mobiclean, un ERP dédié à la propreté) a levé 6,5 M€ auprès d'Isatis en 2023 (P01, P02). Le fonds Origin II d'Oakley Capital y est entré en mars 2026, avec un mandat explicite : IA, automatisation et **acquisitions** (P03). Penbase (Dalyo Clean, Mozaik Clean) est installé depuis 2003 (P07). C'est la même erreur que pour le module « sous-traitants » de D-37 : une absence de résultats a été lue comme une lacune de marché. **V09 passe de 60,5 à 51.**
- **N2-01 : de nouveaux entrants financés sont arrivés en 2026 sur ce créneau exact.** DDD Invoices a levé 1,31 M€ en mai 2026 (P23) et A-Cube 4,4 M$ (P24). Invopop publie un tarif Pro à partir de 500 €/mois (P19), et le transport devient gratuit ou open source (P27, P28, P29). **N2-01 passe de 59 à 50,5.**
- **N3-01 : la procédure sans juge favorise le créancier, pas l'agence.** Ses frais sont à la charge du débiteur et elle n'a pas de plafond (P33, P34). Elle capte donc les créances incontestées, c'est-à-dire la part la plus facile et la plus rentable d'une agence au succès. Les commissaires de justice font déjà de l'amiable (P35). Le secteur est sous surveillance de la DGCCRF, avec 41 % d'opérateurs en anomalie (P36). **N3-01 passe de 62 à 49,5.**
- **Question centrale.** Aucun des cinq candidats ne justifie, sur pièces, plusieurs années de travail. Après correction, ils sont tous entre 38 et 51, dans le bruit de la grille. Le facteur qui manque n'est pas une meilleure idée. C'est **une preuve que ce porteur sait obtenir des clients payants**, et la recherche documentaire ne peut pas la produire. Recommandation : arrêter la recherche documentaire comme outil de décision et faire **un seul sprint terrain de 30 jours** sur V09 (§5), avec des seuils d'arrêt durs.

---

## 0. Méthode

- **42 recherches WebSearch**, dont **38 visant l'invalidation (≈ 90 %)** :
  - recherche nominative des éditeurs cités dans la consigne ;
  - levées et rachats ;
  - offres gratuites et open source ;
  - concurrents publics (commissaires de justice) ;
  - contrôles de la DGCCRF ;
  - vérification de chaque « aucun X trouvé » des dossiers N1, N2 et N3.

  Les 4 autres recherches portaient sur l'équipement en Excel et en papier, les taux de recouvrement et le baromètre Payt.
- **WebFetch : un seul essai, sur `www.propret.fr`, en échec** (ENOTFOUND : le domaine n'est pas autorisé dans les réglages réseau de la session). **Toutes les preuves sont des extraits de recherche.** Ce sont souvent des synthèses produites par l'outil, pas des citations brutes : la confiance plafonne donc à « moyenne », sauf pour les pages officielles.
- **Règle appliquée aux absences.** Chaque conclusion fondée sur une absence est recensée dans un tableau « absences traquées » par candidat. Elle est classée en trois catégories :
  - **réfutée** : on a trouvé ce dont l'absence était affirmée ;
  - **non trouvée** : on ne conclut rien ;
  - **confirmée par une preuve positive** : un texte ou un chiffre la confirme.

  Les recherches négatives figurent dans le CSV avec la requête utilisée (P16, P17, P31, P32, P44, P45).
- **Notes.** Grille v2 du brief (poids 15, 5, 15, 10, 10, 5, 20, 5, 5, 5, 5). Score = Σ(note × poids) / 10.

---

## 1. N1-V09 : logiciel de gestion pour entreprises de propreté de 10 à 200 agents (60,5 → **51,0**)

### 1.1 Cinq objections graves

1. **Un consolidateur financé par un fonds de capital-investissement occupe déjà la catégorie.**
   - Senef édite Progiclean, un ERP dédié à la propreté et au multiservice : commercial, facturation, planning, RH et paie, qualité, applications terrain, portails clients (P04).
   - Il a levé 6,5 M€ en 2023 (P01, P02), puis le fonds Origin II d'Oakley Capital y est entré en mars 2026. La part d'OCI seule est d'environ 9 M£ et le montant total n'est pas publié. Les fonds iront à l'IA et à des « acquisitions stratégiques sélectives » (P03).
   - Senef revendique 1 300 clients en 2023 (P01) et plus de 2 000 selon Dealroom (P06, faible). Ces chiffres couvrent toutes ses verticales.
   - Le « wedge » de N1 (pointage, remplacement, rapport client, puis facturation et paie) recouvre exactement la feuille de route d'un concurrent financé qui a un mandat d'acquisition.
2. **Le marché est un marché de remplacement, pas d'équipement.**
   - Progiclean publie une page « changer de logiciel entreprises de propreté » (P05).
   - Penbase équipe le secteur en pointage NFC depuis des années : fondé en 2003, environ 30 personnes, plus de 700 clients tous produits confondus (P07).
   - D'autres offres existent : PROPRET, Organilog, 2BePragma, Optillio et d'autres (P09, P10). SafetyCulture est gratuit jusqu'à 10 personnes (P12).
   - Un entrant solo devra donc faire migrer des clients, avec leurs plannings, leurs paies et leurs historiques. C'est le cycle de vente le plus difficile qui soit.
3. **Le plafond est contraint par la structure du secteur.**
   - La base varie du simple au double selon les sources : 15 500 entreprises, 600 000 salariés et 21 Md€ (N1-P42), contre 36 000 entreprises, 500 000 emplois et 12 Md€ (P14, probablement ancienne).
   - Le taux de marge du secteur est bas : la masse salariale pèse lourd et l'EBE représente environ 10 % de la valeur ajoutée, donnée de 2015 (P15).
   - **Je n'ai trouvé aucun chiffre sourcé pour la « marge nette de 2-4 % »** mentionnée dans la consigne. Elle reste donc une hypothèse.
   - Le comparable américain est modeste : Swept, spécialiste du nettoyage commercial, a levé environ 2,5 M$ au total pour 10 000 utilisateurs (P11). La verticale n'a pas produit de grand gagnant logiciel, même aux États-Unis, d'après les extraits.
4. **Le prix de référence de N1 était mal lu, et ses sources sont faibles.**
   - PROPRET coûte 29,99 € **par utilisateur** et par mois, pas 29,99 € par mois au total (P09). C'est plutôt favorable au budget, mais cela montre que la preuve n'avait pas été vérifiée.
   - Les fourchettes « par agent » viennent d'un seul vendeur de sur-mesure, Kolonell, dont les billets se contredisent : 4-9 €, 5-12 €, 8-15 € par agent, ou 400-1 200 €/mois (P13). Ce vendeur domine aussi les résultats de recherche, ce qui biaise toute recherche documentaire sur ce secteur.
5. **Le porteur n'a aucune prise sur la distribution.**
   - Les acheteurs sont peu numériques et la vente se fait sur le terrain (salons, chambres régionales de la FEP).
   - Les éditeurs en place ont 10 à 20 ans de relations. Le porteur est solo, sans réseau et sans client payant.
   - Pire, **Senef cible aussi l'aide à domicile et la sécurité privée** (P03) : les verticales V02 et V10 de N1, notées 54,5, sont touchées par la même réfutation.

### 1.2 Absences de preuve traquées

| Affirmation fondée sur une absence | Recherche | Résultat |
|---|---|---|
| « Aucun éditeur financé trouvé » (N1-P46) | levées, nom des éditeurs, FEP, Mobiclean, puis Senef | **RÉFUTÉE** : Senef 6,5 M€ (2023) puis Oakley (2026) (P01-P03, P06). La requête de N1 cherchait une « startup française de propreté ». Senef est un éditeur **multi-verticales** (SAP, propreté, sécurité, hôtellerie) et restait invisible sous ce mot-clé. |
| « Éditeurs modestes » | Penbase | **Partiellement réfutée** : Penbase existe depuis 2003, avec plus de 700 clients tous produits (P07) ; son chiffre d'affaires n'a pas été trouvé |
| Part d'Excel et du papier élevée | statistiques sectorielles | **Non trouvée** (P16). Seuls des témoignages de vendeurs existent. Rien ne permet de dire que le secteur est sous-équipé. |
| Marges de 2-4 % | Xerfi, Insee, FEP | **Non trouvée** comme marge nette. Insee : marge brute faible, donnée ancienne (P15) |
| Logiprop, Netpilot, Cleanplanet, Okarito, Ecoclean, Quarksup | recherches nominatives | **Non trouvés** (P17). Cela ne prouve pas leur absence. Opti-Time est un outil généraliste (Geoconcept). |
| Les outils de planning horizontaux (Skello, Combo, Snapshift) ne couvrent pas la propreté | recherche | **Non trouvé** dans les extraits (P18). Ce n'est pas une preuve qu'ils n'ont aucun client dans le secteur. |
| Aucun rachat dans le secteur | Senef, Penbase | **Réfutée** pour Senef (Oakley, 2026). Rien trouvé sur Penbase. |

**Ce qui joue POUR, paradoxalement** : la levée de Senef et l'entrée d'Oakley sont la meilleure **preuve de dépense réelle** du dossier. Un fonds de capital-investissement ne finance pas un ERP vertical sans revenus récurrents. La catégorie paie donc. Le problème n'est pas la demande, c'est la place.

### 1.3 Note v2 révisée

| Critère (poids) | N1 | RT2 | Raison |
|---|---|---|---|
| Douleur & budget (15) | 7 | 7 | Budget prouvé par la base de clients installée des éditeurs |
| Fréquence (5) | 9 | 9 | Quotidienne |
| Preuves de dépense (15) | 5 | **6** | Levée de Senef, investissement d'Oakley, plus de 1 300 clients (P01-P03) ; chiffre d'affaires par vertical inconnu |
| Distribution (10) | 6 | **4** | Vente terrain, marché de remplacement, porteur sans réseau |
| Lacune (10) | 5 | **2** | ERP dédié financé avec mandat d'acquisition ; Penbase ; 5 autres offres ou plus |
| Faisabilité ≤ 4 mois (5) | 6 | 6 | Un module de pointage reste simple |
| Potentiel (20) | 6 | **4** | Un nouvel entrant capterait plutôt 1 à 3 M€ ; la sortie la plus plausible est une revente à un consolidateur |
| Marge & récurrence (5) | 7 | 7 | SaaS facturé par agent |
| Timing (5) | 5 | **4** | Le consolidateur a pris de l'avance en 2026 |
| Défendabilité (5) | 6 | **5** | Système d'enregistrement, mais les éditeurs en place le sont déjà |
| Risques (5) | 6 | **4** | Guerre de prix ou rachat des concurrents par un fonds |
| **Total** | **60,5** | **51,0** | |

### 1.4 Adéquation au profil

**Faible à moyenne.**
- **Pour** : le produit est faisable par un développeur solo, et les acheteurs sont listables (code NAF 81.21Z) et joignables par téléphone.
- **Contre** : la vente est terrain, la migration est lourde, et le porteur n'a ni réseau ni première référence.
- **La fin la plus probable d'un succès est une petite cession à Senef/Oakley**, pas une entreprise importante.

### 1.5 Test de 30 jours (sans code)

1. Demander des démos de Progiclean, Dalyo Clean, PROPRET et Organilog **en se présentant honnêtement** (« futur éditeur, étude de marché »), sinon s'en tenir aux documents publics. Objectif : relever les prix et les modules.
2. Appeler 60 entreprises de 10 à 200 salariés (NAF 81.21Z) dans 2 départements. Objectif : 15 entretiens de 20 minutes. Questions :
   - quel outil utilisez-vous, à quel prix ?
   - qu'est-ce qui vous fait perdre de l'argent chaque mois ?
   - avez-vous déjà changé de logiciel ?
3. Si et seulement si une douleur non couverte par Progiclean ou Penbase revient chez au moins 5 des 15 entreprises, proposer une précommande payée, par exemple 3 mois à 5 €/agent.

**Seuil d'arrêt** (un seul suffit) :
- plus de 50 % des entretiens déjà équipés d'un outil dédié et satisfaits ;
- aucune douleur récurrente absente des démos de Progiclean et Penbase ;
- moins de 2 précommandes **payées** ;
- prix médian accepté inférieur à 3 €/agent.

---

## 2. N2-01 : API d'e-facturation multi-pays pour éditeurs SaaS (59,0 → **50,5**)

### 2.1 Cinq objections graves

1. **De nouveaux entrants financés arrivent en 2026, exactement sur ce créneau.**
   - DDD Invoices : 1,31 M€ en mai 2026 pour une API couvrant plus de 30 pays, destinée aux SaaS et ERP (P23).
   - A-Cube : 4,4 M$ en série A, architecture API-first (P24, faible).
   - Une API Peppol autofinancée est apparue en 2025 (P25).
   - Ils s'ajoutent à Storecove, Invopop, Iopole, Fonoa, Avalara, Sovos et Pagero (N2). Un solo arrivé fin 2026 serait au moins le dixième spécialiste.
2. **Le transport devient gratuit des deux côtés.**
   - Côté logiciel : les points d'accès Peppol open source sont gratuits, et phoss SMP équipe plus de 50 % des SMP (P28). Un financement public NLnet vise depuis 2026 des déploiements « prêts à certifier » (P29).
   - Côté plateformes : Tiime est une PA gratuite (P27), Super PDP aussi (N2-P24).
   - Côté éditeurs : Iopole fait de la PA en marque blanche, avec API et sandbox, déjà chez Wolters Kluwer (P26).
   - La valeur restante (normalisation, statuts, multi-pays) est précisément ce que vendent Invopop et DDD.
3. **Le prix observé confirme le budget, mais aussi la concurrence frontale.**
   - Invopop Pro démarre à 500 €/mois, plus le volume et les connecteurs (P19). Storecove démarre à environ 495 €/mois (P21, faible). La part variable est d'environ 1 centime par facture (P22, faible).
   - L'ACV de 12-24 k€ retenu par N2 suppose de vendre au-dessus d'Invopop sans sa notoriété ni son statut de PA.
4. **Vendre à des éditeurs est le canal le plus défavorable à ce profil.**
   - Il faut une revue de sécurité. L'ISO 27001 est obligatoire pour devenir PA (N2-P29), avec un audit annuel (N2-P28). L'intégration se fait sur la feuille de route de l'éditeur, en 1 à 6 mois.
   - Les éditeurs exigent un fournisseur pérenne : un solo sans client est un risque fournisseur évident.
   - Aucune lettre d'intention ne remplace une référence.
5. **Le calendrier est mal placé.**
   - Belgique (2026) et France (septembre 2026 pour la réception, 2027 pour l'émission) : les éditeurs ont choisi leur PA ou leur partenaire en 2025-2026.
   - Allemagne : modèle d'interopérabilité sans réseau imposé (P30).
   - ViDA : juillet 2030 (P30), trop loin pour financer 4 ans d'attente.

### 2.2 Absences de preuve traquées

| Affirmation fondée sur une absence | Recherche | Résultat |
|---|---|---|
| « Les prix des API ne sont pas publics » (N2) | Invopop, Storecove | **Réfutée** : la grille d'Invopop est publique depuis le 30/7/2026 (P19) ; Storecove est listé à partir de 495 €/mois (P21). Ces prix sont **POUR** le budget et **CONTRE** la lacune. |
| Peu de nouveaux entrants financés | levées 2026 | **Réfutée** : DDD Invoices, A-Cube (P23, P24) |
| « Fenêtre déjà prise » en Belgique et en France | enquête sur la part d'éditeurs déjà équipés | **Non trouvée** (P31). C'est l'absence qui joue *contre* N2, et elle reste une inférence. Le test doit la mesurer. |
| Stripe absent de l'e-facturation française | recherche | **Non trouvé** (P32). Ne rien en conclure : un acteur de paiement peut intégrer la fonction. |
| Levée d'Iopole | recherche | **Non trouvée** : son financement est inconnu, pas nul |
| Point d'accès gratuit hébergé pour les éditeurs | recherche | **Non trouvé** en hébergé ; **confirmé** en open source (P28) |

### 2.3 Note v2 révisée

| Critère (poids) | N2 | RT2 | Raison |
|---|---|---|---|
| Douleur & budget (15) | 7 | 7 | Obligation légale ; budgets observés |
| Fréquence (5) | 9 | 9 | Chaque facture |
| Preuves de dépense (15) | 7 | 7 | Grille publique d'Invopop (P19) ; Mews ; Pagero |
| Distribution (10) | 5 | **4** | Vente aux éditeurs : revue de sécurité, ISO, besoin de références |
| Lacune (10) | 3 | **2** | Deux nouveaux entrants financés en 2026 ; open source ; marque blanche |
| Faisabilité ≤ 4 mois (5) | 4 | **3** | Une simple surcouche sur une PA n'offre aucune différenciation |
| Potentiel (20) | 6 | **4** | Entrant tardif : 1 à 3 M€ plausible, 10 M€ improbable |
| Marge & récurrence (5) | 7 | **6** | Prix unitaires qui tendent vers zéro |
| Timing (5) | 7 | **5** | Belgique et France passées ; ViDA en 2030 |
| Défendabilité (5) | 5 | 5 | Coût de sortie une fois intégré |
| Risques (5) | 4 | **3** | Commoditisation, risque fournisseur perçu |
| **Total** | **59,0** | **50,5** | |

### 2.4 Adéquation au profil

**La plus faible des trois.** C'est le meilleur profil *technique*, mais le pire profil *commercial*. Un solo sans référence ni certification vend une infrastructure critique à des acheteurs qui achètent d'abord de la pérennité.

### 2.5 Test de 30 jours

1. Lister 80 éditeurs verticaux FR/BE de 10 à 200 salariés et relever leur partenaire PA ou Peppol annoncé. Cela mesure l'absence de P31.
2. Mener 15 appels avec un CTO ou un responsable produit.
3. Proposer un pilote payant de 3 mois à au moins 500 €/mois, contre Invopop comme référence explicite.

**Seuil d'arrêt** (un seul suffit) :
- plus de 70 % des éditeurs listés déjà adossés à un partenaire ;
- moins de 2 pilotes payants ;
- aucune raison de changer exprimée par 3 éditeurs ou plus.

---

## 3. N3-01 : agence de recouvrement amiable B2B au succès, native IA (62,0 → **49,5**)

### 3.1 Cinq objections graves

1. **La procédure sans juge capte les créances faciles.**
   - Le texte : loi n° 2026-307 du 23/4/2026 et décret n° 2026-967 du 20/10/2026, publié au JO du 21/10/2026. L'entrée en vigueur se fera par arrêté, au plus tard le 31/12/2026 (P33).
   - Le fonctionnement :
     - le commissaire de justice signifie un commandement de payer à personne, à domicile ou à l'étude ;
     - le débiteur a 1 mois pour contester ;
     - sinon, un procès-verbal de non-contestation devient exécutoire ;
     - **les frais sont à la charge du débiteur**, sans plafond de montant (P34).
   - Pour une créance commerciale incontestée, le créancier rationnel ira donc directement chez le commissaire de justice, à coût quasi nul pour lui, plutôt que de céder 10 à 15 % à une agence.
   - L'agence garde les créances **contestées** (la procédure s'arrête et il faut aller au juge) et les débiteurs **insolvables**. Ce sont les créances au taux de succès le plus bas.
   - Le wedge de N3, « dossier clé en main au commissaire de justice », est une prestation administrative à faible valeur, que les commissaires et les logiciels intégreront.
   - **Conclusion : la procédure désintermédie l'agence sur son meilleur segment.**
2. **Des concurrents réglementés font déjà le même métier.** Les commissaires de justice pratiquent l'amiable avec des honoraires libres et un émolument proportionnel (A.444-32) à la charge du créancier (P35). Ils ont le monopole de l'étape suivante et une marque d'autorité auprès des débiteurs. Une agence solo n'a ni l'un ni l'autre.
3. **Le cœur IA est financé ailleurs.**
   - Cleavr a levé 8 M€ ; ses tarifs ne sont pas publics et son produit va jusqu'à l'escalade contentieuse (P37, N3-P05).
   - Respaid revendiquerait environ 458 clients (P38, faible).
   - Upflow, Kollekt, et la relance gratuite intégrée chez Pennylane (N3-P13).
   - Le marché déclaré est dense : 600 entreprises, et les membres de la FIGEC revendiquent 80 % du recouvrement pour compte de tiers (P43).
4. **Le potentiel est surestimé, et ce n'est pas de l'ARR.**
   - La part B2B de 30-40 % n'est **pas sourcée** : la FIGEC ne publie pas de ventilation dans les extraits (P43).
   - Les commissions vont de 5 à 25 % (P39), sur des sommes recouvrées qui baissent vite avec l'âge de la créance : 70-80 % à 90 jours, 20-30 % à 1 an, chiffres américains non vérifiés (P42).
   - Le revenu est volatil, dépend de l'humain (les appels) et sa marge brute est éloignée de celle d'un SaaS.
   - Plafond réaliste pour 1 à 15 personnes : 1 à 3 M€ de commissions.
5. **Le risque réglementaire et de réputation est réel et mesuré.**
   - DGCCRF, enquête 2022 publiée en 2024 : 41 % des opérateurs en anomalie, 90 avertissements, 36 injonctions, 2 procès-verbaux pénaux (P36). Les fautes relevées : frais indus, confusion entre amiable et judiciaire.
   - Une IA qui envoie des relances en masse multiplie ce risque.
   - Les obligations (R.124-1 et suivants du CPCE) : assurance RC (R.124-2), compte dédié dans un établissement agréé, convention écrite, lettre au débiteur aux mentions prescrites (N3-P09). **Je ne les ai pas relues sur Légifrance**, WebFetch étant bloqué.
   - Le débiteur est souvent un client de votre client : la plupart des PME ne confient que des créances « perdues ».

### 3.2 Absences de preuve traquées

| Affirmation fondée sur une absence | Recherche | Résultat |
|---|---|---|
| Part B2B de 30-40 % du marché | FIGEC, Xerfi | **Non trouvée** (P43). L'hypothèse porte le calcul du potentiel. |
| Rôle neutre ou positif de la procédure incontestée pour l'agence | décret, service-public | **Réfutée sur le fond** : les frais sont à la charge du débiteur et le créancier n'a pas besoin d'agence (P33, P34). Les émoluments du commissaire n'ont **pas été trouvés**. |
| Pas d'autre startup française de recouvrement IA financée | levées 2026 | **Non trouvée** (P44). Ne pas lire comme une lacune : Cleavr seul suffit à occuper le segment. |
| Pas de plateforme des commissaires de justice | Chambre nationale des commissaires de justice (CNCJ) | **Non trouvée** (P45). En revanche, la profession opère des plateformes, par exemple Legide (constats, décision 26-D-06). |
| Commission de Cleavr | recherche | **Non trouvée** (P37) |
| PME sous-équipées | baromètre | **Confirmée, mais par une source intéressée** : 71 % sans logiciel de gestion des créances, seulement 1 % des solopreneurs équipés (P40, Payt/Ipsos). Cela plaide plutôt pour un *logiciel* que pour une agence, et la cible la moins équipée est aussi la moins solvable. |

### 3.3 Note v2 révisée

| Critère (poids) | N3 | RT2 | Raison |
|---|---|---|---|
| Douleur & budget (15) | 8 | **7** | Budget réel (600-700 M€), mais part B2B inconnue |
| Fréquence (5) | 7 | 7 | Flux continu |
| Preuves de dépense (15) | 8 | **7** | Chiffre d'affaires de la fédération sans ventilation B2B/B2C |
| Distribution (10) | 5 | **4** | Acquisition de PME à froid ; canal des experts-comptables non prouvé |
| Lacune (10) | 3 | **2** | Cleavr, Respaid, 600 cabinets, commissaires de justice et nouvelle procédure |
| Faisabilité ≤ 4 mois (5) | 7 | **6** | Régime déclaratif, mais compte dédié, RC, conformité DGCCRF |
| Potentiel (20) | 6 | **4** | Segment incontesté capté par la procédure ; commissions, pas d'ARR |
| Marge & récurrence (5) | 6 | **4** | Coût humain, revenu volatil |
| Timing (5) | 6 | **5** | La procédure de 2026 joue dans les deux sens, plutôt contre |
| Défendabilité (5) | 4 | **3** | Données des débiteurs, seulement à grande échelle |
| Risques (5) | 6 | **4** | DGCCRF (41 % d'anomalies), réputation |
| **Total** | **62,0** | **49,5** | |

### 3.4 Adéquation au profil

**Moyenne pour apprendre, faible pour bâtir.**
- C'est le seul candidat où l'on peut **encaisser de l'argent en 30 jours**, ce qui mesure directement la capacité commerciale du porteur.
- Mais le métier est de l'opération humaine (téléphone, litiges) et de la conformité, pas de l'ingénierie. Le profil technique du porteur y est peu valorisé.

### 3.5 Test de 30 jours

- **Étape 1 : partenariat de marque blanche** avec une agence déclarée. Ne pas créer sa propre structure avant d'avoir un signal.
- **Étape 2 : 60 PME B2B ciblées**, via 3 experts-comptables.

**Seuil d'arrêt** (un seul suffit) :
- moins de 8 mandats ;
- moins de 40 k€ de créances confiées ;
- taux de recouvrement inférieur à 25 % à J+30 sur les créances de moins de 120 jours ;
- **plus de 50 % des créances confiées sont incontestées et supérieures à quelques milliers d'euros** : elles iraient de façon rationnelle à la procédure du commissaire de justice dès 2027 ;
- commission nette inférieure à 8 % une fois payés le partenaire et le temps humain.

---

## 4. Tableau comparatif

| Candidat | Note avant | Note RT2 | Potentiel RT2 | Preuve contraire décisive |
|---|---|---|---|---|
| N1-V09 Propreté | 60,5 | **51,0** | 4 (1-3 M€) | Senef : 6,5 M€ puis Oakley en 2026, mandat d'acquisition (P01-P03) |
| N2-01 API d'e-facturation | 59,0 | **50,5** | 4 | DDD Invoices et A-Cube financés en 2026 ; Invopop dès 500 €/mois ; transport open source (P19, P23-P29) |
| N3-01 Recouvrement au succès | 62,0 | **49,5** | 4 | Procédure sans juge aux frais du débiteur (P33-P34) ; Cleavr 8 M€ ; DGCCRF 41 % (P36) |
| E-13 Relance de devis | ~50 (grille 1) ; 49,5 (v2, N1-V15) | inchangé | 2-3 (< 1 M€) | Relance incluse chez Axonaut, Sellsy, Pennylane (DD-E13) |
| D-37 Preuves Qualiopi | ~47 (grille 1) ; 38,5 (v2, audit2) | inchangé | 2 | Portail des Formateurs à 39 €/mois, Digiforma, CertiSkool |

**Les quatre premiers candidats sont à moins de 2 points les uns des autres.** La grille ne les distingue plus : l'incertitude sur chaque note (± 5 points) est supérieure aux écarts.

---

## 5. Question centrale : lequel mérite plusieurs années de travail ?

### 5.1 Réponse

**Aucun, sur la base des preuves disponibles.** Choisir aujourd'hui l'un des cinq pour plusieurs années serait un pari, pas une décision rationnelle :
- aucun n'a de potentiel prouvé au-dessus de 3 M€ pour un entrant ;
- tous ont un éditeur ou un acteur financé en place ;
- aucun ne repose sur un avantage propre au porteur : réseau, accès, données ou expertise métier.

**Faut-il abandonner ?** Pas l'entrepreneuriat, mais **la méthode « choisir une idée sur dossier »**. Le porteur a déjà construit un SaaS sans client payant. La variable la plus incertaine, et la plus décisive, n'est pas le marché. C'est sa capacité à obtenir des clients payants. Aucune recherche documentaire ne la mesure.

### 5.2 La méthode de recherche documentaire est-elle encore productive ?

- **Elle reste productive pour invalider, et vite.** Les réfutations décisives sont tombées après 5 à 15 recherches ciblées par candidat : Senef, DDD Invoices et A-Cube, les frais de la procédure à la charge du débiteur. Elle reste utile comme **contrôle après coup** d'une piste trouvée sur le terrain.
- **Elle a cessé d'être productive pour valider.** Trois défauts structurels s'aggravent à chaque tour :
  1. **Angles morts systématiques.** Les éditeurs multi-verticaux (Senef) et les sociétés privées non financées (Penbase, Portail des Formateurs) sont invisibles sous des mots-clés verticaux. Chaque tour produit donc de fausses « lacunes », que le tour suivant réfute. C'est arrivé trois fois : sous-traitants Qualiopi, puis Digiforma, puis Senef.
  2. **Des résultats pollués par le SEO vendeur.** Kolonell domine les recherches sur la propreté ; dans le recouvrement, ce sont des blogs d'éditeurs. WebFetch étant bloqué, on lit des résumés de résumés.
  3. **Elle ne peut pas produire la preuve exigée par la grille.** La volonté de payer *pour un nouvel entrant* ne s'observe qu'en vendant.
- **Conclusion.** Un 4e tour de recherche documentaire aurait une valeur attendue faible, voire négative : il générerait de nouvelles lacunes illusoires. **Le prochain apprentissage doit venir du terrain.**

### 5.3 Recommandation opérationnelle

1. **Geler la recherche documentaire** comme outil de sélection. La garder pour vérifier, en 10 recherches au maximum, une piste trouvée sur le terrain.
2. **Inventorier ses accès réels** avant toute idée : anciens employeurs, famille, région, associations, communautés de développeurs. Une douleur payée observée dans un secteur où le porteur a 20 contacts vaut plus qu'une note de 60 dans un secteur où il n'en a aucun.
3. **Sans accès particulier, un seul sprint de 30 jours sur V09**, cadré comme de la *découverte* et non comme un produit (§1.5).
   - **Pourquoi V09** :
     - c'est le test le moins coûteux (moins de 50 €, aucun code) ;
     - les acheteurs sont listables par code NAF et joignables au téléphone ;
     - c'est un système d'enregistrement ;
     - un acquéreur qui achète existe (Senef/Oakley) : cela borne le risque à la baisse, même si cela plafonne l'ambition.
   - Dans ces 15 entretiens, noter **tout ce que l'entreprise paie déjà à l'extérieur** (expert-comptable, intérim, contrôle qualité, recouvrement, logiciel). C'est là que se trouvent les douleurs payées, parfois hors logiciel.
   - N3-01 n'est à envisager qu'en marque blanche, et seulement si le porteur veut d'abord tester sa capacité à encaisser.
   - **N2-01 est à écarter pour ce profil.**
4. **Critère d'abandon global.** Si, après 90 jours de terrain sur au plus 2 secteurs, le porteur n'a obtenu **aucun paiement**, même 3 précommandes ou un service facturé, le problème est la distribution et non l'idée. Les options rationnelles sont alors :
   - s'associer à quelqu'un qui a le réseau d'un secteur ;
   - rejoindre une équipe existante, par exemple un éditeur vertical ;
   - vendre du service technique à un secteur pour y acquérir l'accès.

### 5.4 Règle à ajouter à la méthode pour toute recherche future

Toute « lacune » fondée sur « aucun X trouvé » :
- est notée **au plus 5/10** au critère Lacune ;
- est accompagnée des requêtes exactes ;
- est soumise à une recherche nominative sur les éditeurs **multi-verticaux** du domaine (paie, planning, ERP de services) avant d'entrer dans une note.

---

## 6. Les deux preuves contraires les plus fortes

1. **P03 (+ P01, P02)** : Oakley Capital investit dans Groupe Senef en mars 2026 pour financer l'IA et des acquisitions. Senef est l'éditeur de Progiclean, un ERP dédié à la propreté, déjà financé à hauteur de 6,5 M€ en 2023. La lacune centrale de V09 est réfutée, et ce consolidateur touche aussi V02 et V10.
2. **P33-P34** : la procédure des créances commerciales incontestées (décret du 20/10/2026) met les frais à la charge du débiteur, sans plafond. Le segment le plus rentable d'une agence au succès passe aux commissaires de justice.
