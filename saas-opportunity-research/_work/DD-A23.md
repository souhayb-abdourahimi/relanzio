# DD-A23 — Rapprochement des remboursements MFP pour pharmacies indépendantes (US)

Date : 2026-10-29. Phase 2/4 (due diligence). Note de phase 1 : **77/100** (A-top.md) ; la ligne de `scores-bruts.csv` (9,9,7,6,5,7,8,9,6,5) donne 72,5 avec `score.py`. L'écart vient de notes en points converties de façon incohérente. La référence retenue ici est la table d'A-top, convertie en notes sur 10.
**Nouvelle note : 55/100. Confiance moyenne.**

Méthode : 41 requêtes WebSearch, dont environ 45 % consacrées à l'invalidation (substituts gratuits, éditeurs de PMS, PSAO, modèle prospectif, litiges, réforme, plaintes absentes, barrières HIPAA). WebFetch est bloqué (ncpa.org ne se résout pas dans cette session) : toutes les preuves viennent d'**extraits de recherche**. Étiquettes : **[O]** fait observé (sourcé, n° de preuve `Pxx` = `DD-A23-Pxx`), **[E]** estimation, **[H]** hypothèse, **[I]** inconnu.

---

## 1. ICP, rôles, contexte d'achat
- **ICP** : pharmacie indépendante de détail aux US, 1 à 3 officines, avec un volume Medicare Part D significatif, qui délivre les médicaments MFP (Eliquis, Jardiance, Xarelto, Januvia… en 2026 ; sémaglutide à partir de 2027). Elle n'est pas en 340B contract pharmacy, ou seulement marginalement [H]. Segment secondaire : pharmacies de soins de longue durée (LTC, membres ASCP), plus exposées [O, P21 ; l’enquête NCPA P02 couvre aussi les LTC].
- **Utilisateur** : responsable back-office / comptabilité tiers payant (souvent un technicien senior), ou le titulaire lui-même [H].
- **Prescripteurs** : PSAO / coopératives (IPC, Elevate/Good Neighbor, Health Mart Atlas, AAP), consultants (Apex Consulting, PAAS National), éditeur du PMS, comptable spécialisé pharmacie [O pour leur rôle sur le MTF : P09, P13, P42 ; H pour leur rôle de prescripteur].
- **Décideur économique** : le titulaire (pharmacist-owner).
- **Sponsor** : le titulaire, ou la PSAO/coop si l'achat se fait en marque blanche.
- **Objections attendues** : (1) « Beacon est gratuit et me montre déjà mes remboursements » [O, P07] ; (2) « ma PSAO/coop s'en occupe » [O, P09, P13] ; (3) « mon PMS va le faire » [O, P20, P21] ; (4) « je ne confie pas mes données patients à un éditeur étranger inconnu » [H] ; (5) « le vrai problème, c'est le délai de paiement, pas les erreurs » [O, P14, P15 vs P02] ; (6) « je ne stocke plus ces médicaments » [O, 19 % selon P34].
- **Contexte d'achat** : marges sous pression, fermetures d'officines, budgets logiciels déjà engagés (PMS, PSAO, outils de rapprochement des paiements tiers type Outcomes) [H]. Achat individuel par carte, mensuel, sans appel d'offres ; décision en 1 à 4 semaines si la confiance est établie [H].

## 2. Job-to-be-Done et workflow actuel
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

## 3. Coût de l'inaction
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

## 4. Concurrents et substituts (détail : `DD-A23-concurrents.csv`)
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

## 5. Différenciation possible
- **Wedge** : « audit MFP en 10 minutes » pour une officine indépendante non 340B. On importe les 835 du MTF, le Claims Tracking Report et un export PMS standard. On obtient la liste des délivrances MFP **sans remboursement après 30/45 jours**, **sous le SDRA**, ou en **doublon**, plus un brouillon de GFI prêt à coller dans Beacon avant l'échéance de 120 jours.
- **Time-to-value** : moins d'une heure si l'export PMS est pris en charge [H].
- **ROI mesurable** : dollars récupérés par GFI acceptée, affichés dans un tableau de bord.
- **Raison de changer** : Beacon est la vue des fabricants (sans le PMS) ; l'outil est la vue de la pharmacie, croisée avec ses délivrances. Mais cet argument ne vaut que si l'écart de remboursements est réel chez les indépendants [I].
- **Option architecture « PHI local »** : traitement dans le navigateur, sans stockage serveur des PHI, pour réduire le périmètre HIPAA d'un éditeur non US [H, à valider par un juriste].

## 6. Taille de marché (bottom-up)
- Acheteurs : **18 988 pharmacies indépendantes** en 2026 [O, P27]. Part qui délivre des médicaments MFP : 80 à 95 % [H], à pondérer par les 19 % qui disent ne plus stocker certains médicaments MDPNP [O, P34]. Les officines LTC sont un segment additionnel au nombre inconnu [I].
- Prix : 1 200 à 2 400 $/an par officine [H].
- **TAM** ≈ 18 988 × 0,8 à 0,95 × 1 200 à 2 400 $ ≈ **18 à 43 M$/an** [E].
- **SAM** (hors officines servies par leur PSAO/coop ou leur PMS, et seulement celles atteignables) : 20 à 40 % du TAM ≈ **4 à 17 M$/an** [H].
- **SOM à 24 mois** pour un fondateur solo non US : 50 à 300 officines ≈ **60 k$ à 540 k$ d'ARR** [H]. Le bas de la fourchette est le plus probable sans partenaire PSAO.

## 7. Pricing
- **Recommandé** : **149 $/mois par officine** (ou 1 490 $/an), import illimité, détection et brouillons de GFI. Signataire : le titulaire. ROI central : 11 700 $/an de perte évitée contre 1 788 $ ≈ **6,5×** [E/H]. Au bas de la fourchette (4 100 $), ≈ 2,3×.
- **Alternative 1, au succès** : 20 % des sommes récupérées via une GFI acceptée, avec un minimum de 49 $/mois. Plus facile à vendre, mais revenu volatil et preuve de causalité difficile.
- **Alternative 2, marque blanche PSAO/coop** : 25 à 40 $/officine/mois, contrat signé par la PSAO pour tout son réseau. Seule voie vers le volume, mais cycle long et pouvoir de négociation chez la PSAO.
- Aucun prix concurrent public n'a été trouvé (tous « inconnu »), ce qui empêche d'ancrer le prix [O].

## 8. Intrants du modèle économique
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

## 9. Risques
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

## 10. Distribution
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

## 11. Faisabilité
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

## 12. Défendabilité à 2 ans
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

## 13. Raisons de NE PAS le faire, et expériences d'invalidation
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

## 14. Re-notation
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
