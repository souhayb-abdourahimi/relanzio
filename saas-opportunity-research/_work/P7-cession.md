# P7 — Cession de micro-SaaS : ce qui se vend réellement, et à quel prix

Date : 2026-10-29. Preuves : `P7-cession-preuves.csv` (P7C-P01 à P7C-P48).
Étiquettes : **[P]** preuve sourcée, **[E]** estimation raisonnée, **[H]** hypothèse non vérifiée.

## 0. Méthode et limites

- 40 recherches web. WebFetch a été essayé une fois et a échoué (`blog.acquire.com` non résolu). Tous les chiffres proviennent donc des **extraits** de résultats de recherche, pas des rapports complets. Pour lire les PDF d'Acquire.com, de Flippa et de MicroConf, il faut autoriser ces domaines dans les réglages réseau de la session.
- **Aucun multiple historique n'est un prix garanti.** Les multiples ci-dessous décrivent des ventes passées sur des places de marché précises, avec leurs biais :
  - Acquire.com : ventes « confirmées » déclarées par les utilisateurs, la plateforme ne participe pas aux transactions [P7C-P01, P05].
  - Flippa : ventes conclues sur Flippa uniquement [P7C-P08].
  - Empire Flippers : toutes niches confondues [P7C-P20].
- **Prix demandé et prix conclu.** Les annonces (Flippa, Empire Flippers, agrégateurs) donnent des prix **demandés**. Ce document les signale chaque fois et ne les utilise jamais comme référence de prix.
- **Moyenne et médiane.** La plupart des rapports publient des **moyennes**. Seuls Acquire.com (janv. 2026), Investors Club (délais) et FounderSold publient une **médiane**.
- **Lacunes.** Je n'ai trouvé :
  - aucun taux de non-vente propre au SaaS ;
  - aucune décote chiffrée liée à la langue française ;
  - aucun retour d'expérience francophone avec prix et MRR ;
  - aucun chiffre de churn tiré du rapport MicroConf.

## 1. Synthèse

1. **Le micro-SaaS se vend sur un multiple de bénéfice (SDE), pas sur un multiple d'ARR.** En dessous d'environ 1 M$ d'ARR, les courtiers et les places de marché raisonnent en × SDE ou × bénéfice net [P7C-P10, P41, P43]. Les multiples d'ARR à 4-5x (SaaS Capital) ne concernent que des sociétés de 3 à 20 M$ d'ARR [P7C-P13]. Ils ne s'appliquent pas au porteur.
2. **Centre de gravité réaliste : 2 à 4x le bénéfice annuel.**
   - Flippa, ventes conclues au H1 2026 : 2,47x en moyenne, 4,06x au quartile supérieur [P7C-P08].
   - Acquire.com, ventes confirmées : médiane 3,9x en 2024 et en 2025 [P7C-P01] ; 3,7x en moyenne sous 100 k$ de bénéfice net [P7C-P02].
   - L'écart entre les deux plateformes est réel. Il vient du public, des données déclarées et de la sélection des vendeurs [E].
3. **Les petites transactions ne sont pas pénalisées en moyenne, mais leur dispersion est énorme.** Sur Flippa, les transactions de 10 à 100 k$ se font à 2,24x en moyenne et à 5,96x au quartile supérieur [P7C-P08]. Les cas individuels vont de 1,5x l'ARR [P7C-P27] à environ 8x l'ARR, en période de bulle et sur de très petits montants [P7C-P26].
4. **Les transactions se concluent en 2 à 4 mois** : 81 jours en moyenne sur Acquire.com [P7C-P01], 97 jours en médiane chez Investors Club [P7C-P22], 2 mois pour Potion [P7C-P23].
5. **Les conditions de paiement se durcissent.** Selon le rapport Acquire 2025 [P7C-P04] :
   - retenues de garantie dans 14 % des transactions ;
   - crédit vendeur dans 13 % ;
   - autres conditions, dont les earn-outs, dans 41 %.
   Les petites ventes restent souvent payées comptant [P7C-P29, P30].
6. **Spécificité française du porteur.**
   - La vente se fait **uniquement en actifs** : code, domaine, marque, clientèle, comptes.
   - **Stripe ne se transfère pas simplement** vers une entité étrangère [P7C-P34, P35].
   - La fiscalité est favorable seulement **après 5 ans d'activité** (art. 151 septies et 238 quindecies) [P7C-P37, P38].
   - Un produit francophone réduit le bassin d'acheteurs. Cet effet est plausible mais non chiffré [P7C-P12, H].

## 2. Tableau des multiples retenus

Tous les multiples portent sur le bénéfice annuel ou le SDE, sauf mention contraire. Pour un micro-SaaS solo à marge de 80 à 95 %, le bénéfice reste proche du CA ; je le note **≈ CA** [E].

| Tranche (MRR / bénéfice annuel) | Multiple central retenu | Fourchette courante | Extrêmes constatés | Sources, nature, date | Confiance |
|---|---|---|---|---|---|
| **< 1 k$ MRR** (prix < 25 k$) | **1,5-2,5x** | 1-3x | 1,5x l'ARR (350 $ de MRR → 6 500 $) ; ≈ 8x l'ARR (100 $ de MRR → 10 k$, 2021-22) ; lot d'apps à 750 $ de MRR proposé 15 k$ (≈ 1,7x) | P7C-P27, P26, P25 : ventes conclues, anecdotiques. Flippa 10-100 k$ : moyenne 2,24x, quartile supérieur 5,96x (P7C-P08, 2026) | moyenne-basse |
| **1-5 k$ MRR** (≈ 12-60 k$ de bénéfice, prix 25-200 k$) | **2,5-3x** | 2-4x | Flippa quartile supérieur 3,8-6x ; MealByMeal demandé à ≈ 20x l'ARR, offre ≈ 4x, non conclu | Acquire.com < 100 k$ de bénéfice : moyenne 3,7x (P7C-P02, 2025). Flippa 100-250 k$ : moyenne 1,85x (P7C-P08, 2026). FE International : 2-4x le SDE (P7C-P41). FounderSold : médiane 2,8x sur 51 sorties < 1 M$ (P7C-P24) | moyenne |
| **5-20 k$ MRR** (≈ 60-240 k$ de bénéfice, prix 150 k$-1 M$) | **3-3,5x** | 2-4,5x | Potion : 4,0x l'ARR (6,3 k$ de MRR → 300 k$, 2023) ; app Shopify : ≈ 3,1x l'ARR, ≈ 3,5x le bénéfice (6,7 k$ de MRR → 250 k$ payés comptant) ; Zencast 3,48x | Acquire.com 100 k$-1 M$ : moyenne 3,9x (P7C-P02). Flippa 250 k$-1 M$ : moyenne 1,82x, quartile supérieur 2,84x (P7C-P08). Flippa : SDE 2,5-4,5x (P7C-P10) | moyenne |
| **> 80 k$ MRR** (≈ 1 M$ d'ARR et plus) | 3-5x l'**ARR** possible | — | — | Quiet Light : multiples de CA à partir d'environ 1 M$ d'ARR (P7C-P43). SaaS Capital : 4,8x l'ARR pour les autofinancés de 3-20 M$ (P7C-P13, 2025) | moyenne ; hors périmètre du porteur |

**Médiane et extrêmes.**
- Acquire.com (janv. 2024) déclare une moyenne de 4,3x avec une étendue de **0,63x à 34x** [P7C-P07]. Les extrêmes hauts sont des cas de croissance forte ou d'acheteurs stratégiques. Ce ne sont pas des repères [E].
- Empire Flippers affiche environ 26-28x le bénéfice **mensuel**, soit environ 2,2-2,4x l'annuel, toutes niches confondues [P7C-P20].

**Historique, pour éviter de se tromper d'époque.**
- Mi-2022 : Acquire.com annonçait 2-4x le **CA** [P7C-P06].
- Fin 2022 : « 2-3x le CA ou 5x le bénéfice » [P7C-P05].
- Depuis 2024, la plateforme raisonne en bénéfice, et la médiane est stable à 3,9x [P7C-P01].
- Flippa : 2,7x en moyenne en 2025 [P7C-P09], 2,47x au H1 2026 [P7C-P08]. La pente est légèrement baissière [E].

**Prix demandés (à ne pas utiliser comme référence de prix).**
- Une extension Chrome demandée à 3,3x le CA, avec 64 % de churn [P7C-P32].
- Un SaaS linguistique demandé à 3,8x alors que les comparables se vendent vers 2,7x [P7C-P46].
- MealByMeal demandé à environ 20x l'ARR, avec une offre reçue à environ 4x [P7C-P28].
- Le prix demandé est structurellement au-dessus du prix conclu. Un prix affiché à plus de 10 % au-dessus du marché ne toucherait qu'environ 2 % des acheteurs [P7C-P03, confiance basse].

## 3. Catégories effectivement revendues

| Catégorie | Se vend ? | Ce que montrent les preuves |
|---|---|---|
| **Outils B2B horizontaux ou verticaux, autonomes et rentables** (ex. Potion, constructeur de sites à partir de Notion) | Oui, le mieux | Potion : 4x l'ARR, 3 offres, 2 mois [P7C-P23]. Le micro-SaaS fait partie des catégories les plus recherchées par les acheteurs [P7C-P33] |
| **Apps de marketplace** (Shopify, Slack, Monday) | Oui, avec décote de plateforme | App Shopify : 250 k$ payés comptant [P7C-P30]. Lot Slack/Monday à environ 1,7x l'ARR [P7C-P25]. Décotes pour fonctionnalité native possible, saisonnalité et concentration [P7C-P31, confiance basse] |
| **Extensions Chrome** | Oui, petits montants | 10 k$ pour 100 $ de MRR [P7C-P26]. Annonces à 64 % de churn et monétisation par achat unique [P7C-P32] |
| **SaaS à petit prix pour particuliers ou très petits clients** (ARPA < 10-25 $) | **Mal** | Churn mensuel médian de 6,8 %, et seulement 2,7 % de ces SaaS ont une rétention nette > 100 % [P7C-P15, P16]. Les acheteurs évitent un churn > 6 % [P7C-P31] |
| **SaaS non rentables, en déclin, à clients concentrés ou dépendants du fondateur** | **Mal** | Empire Flippers refuse les entreprises dépendant d'un seul client [P7C-P19]. La rentabilité attire plus d'offres que le CA [P7C-P01, P03] |
| **Agences et services présentés comme du SaaS** | Mal (≈ 1x le CA) | Agences ≈ 1x le CA ou 1-3x le bénéfice [P7C-P05] |
| **SaaS français non anglophones** | Marché étroit, peu transparent | Annonces UIMM sans chiffres, certaines sous le coût de développement [P7C-P48]. Aucune transaction française chiffrée trouvée |

## 4. Revenus et bénéfices typiques au moment de la vente

- **Acquire.com.** Les transactions se concentrent entre **100 k$ et 3 M$** selon un guide tiers, non vérifié dans le rapport [E]. Le niveau « < 100 k$ de bénéfice net » est assez fréquent pour avoir son propre multiple [P7C-P02].
- **Places de marché micro** (Microns, Fusellit, Indie Hackers). On y voit des ventes de **100 à 750 $ de MRR pour 6 à 15 k$** [P7C-P25, P26, P27]. Le budget typique des acheteurs Microns est d'environ 5 k$ [P7C-P33, confiance basse].
- **Exemples nommés** (fondateurs solo ou petits produits) :

| Produit | MRR à la vente | Prix | Multiple | Date | Source | Confiance |
|---|---|---|---|---|---|---|
| Potion (Notion-to-website) | ≈ 6 300 $ | 300 000 $ | ≈ 4,0x l'ARR | avr. 2023 | P7C-P23 | haute |
| App Shopify (non nommée) | 6 700 $, marge ≈ 90 % | 250 000 $, payés comptant | ≈ 3,1x l'ARR | ? | P7C-P30 | moyenne |
| Zencast | ? | ? | 3,48x le bénéfice, comptant, sans earn-out | ? | P7C-P29 | basse-moyenne |
| Lot de 3 apps Slack/Monday | ≈ 750 $ | 15 000 $ (demandé, acheté) | ≈ 1,7x l'ARR | ? | P7C-P25 | moyenne |
| Outil CSV-vers-tableau de bord | ≈ 350 $ | 6 500 $ | ≈ 1,5x l'ARR | ? | P7C-P27 | moyenne |
| Rocket Note (extension Chrome) | ≈ 100 $ | ≈ 10 000 $ | ≈ 8x l'ARR | ~2021-22 | P7C-P26 | moyenne |

## 5. Structure des transactions : earn-out, échelonnement, séquestre

- **Conditions de paiement.** Acquire 2025 : retenues de garantie dans 14 % des transactions, crédit vendeur dans 13 %, autres conditions (earn-outs, etc.) dans 41 % [P7C-P04, secondaire].
- **Petites ventes.** Elles se font souvent comptant [P7C-P29, P30]. Un vendeur dépendant de lui-même subit davantage d'earn-out, qui transforme une partie du prix en paiement conditionnel [P7C-P42, E].
- **Séquestre.** Escrow.com, barème « domaines » depuis mai 2024 : 2,6 % sous 5 k$ (50 $ minimum). Pour 25 k$, environ 600 $ de frais. Le barème « entreprise » peut différer [P7C-P36].
- **Commissions.** Les commissions des plateformes et courtiers n'ont pas été vérifiées dans cette recherche, à part un avis tiers non fiable [P7C-P44].
- **Conséquence pratique [E].** Il faut raisonner en **prix net encaissé**, après commission, séquestre, retenue de garantie, part conditionnelle et impôt. Un multiple affiché de 3x peut se traduire par environ 2-2,3x net encaissé et sûr pour un micro-entrepreneur qui vend avant 5 ans (voir §9).

## 6. Ce que regardent les acheteurs

| Critère | Ce que disent les preuves | Étiquette |
|---|---|---|
| **Rentabilité réelle** | Un SaaS à 1 M$ de CA et 500 k$ de bénéfice reçoit plus d'offres qu'un SaaS à 2 M$ et 100 k$ ; les entreprises rentables vendent plus vite | [P] P7C-P01, P03 |
| **Churn et rétention** | Un churn > 6 % par mois ou un MRR non reconstituable font échouer les transactions ; un churn annuel < 8 % vaut une prime ; les abonnements annuels augmentent la valorisation | [P] P7C-P31 (basse), P21 |
| **Prix moyen par client (ARPA)** | Sous 10 $ d'ARPA : churn médian de 6,8 % par mois ; au-dessus de 500 $ : 1,9 % | [P] P7C-P15, P16, P17 |
| **Ancienneté et historique** | Empire Flippers exige 12 mois de revenus et 3 mois d'analytics ; les guides d'acheteurs demandent 12 mois, idéalement 24 | [P] P7C-P19 ; [E] |
| **Concentration clients** | Décote de 20 à 30 % (SEG, sociétés plus grandes) ; refus d'Empire Flippers si un client dépasse 50 % | [P] P7C-P40, P19 |
| **Dépendance au fondateur et heures d'exploitation** | « Indépendance opérationnelle » citée par Empire Flippers ; décote de 15 à 30 % pour les agences (FE) ; prime de 15 à 25 % pour un faible temps propriétaire (estimation éditoriale) | [P] P7C-P21, P42 (agences) ; [E] |
| **Dépendance à une plateforme** (Shopify, Chrome, Slack) | Décote si la plateforme peut intégrer la fonction ; saisonnalité des marchands décotée | [P] P7C-P31 (basse) |
| **Métriques vérifiables** | Stripe connecté, preuve directe dans le processeur de paiement ; un vendeur à 3 k$ de MRR a reçu plusieurs offres en 3 semaines grâce à Stripe connecté | [P] P7C-P47 (basse) ; [E] |
| **Stack et documentation** | Aucun chiffre trouvé. Un code standard et documenté réduit le risque de reprise | [H] |
| **Tendance récente** | Les acheteurs paient sur les 12 derniers mois et pénalisent la baisse | [E] |

## 7. Pourquoi certaines entreprises ne se vendent pas

- **Taux de non-vente.** Je n'ai trouvé aucune statistique fiable pour le SaaS. Une ancienne extraction Flippa, tous sites confondus, donne environ **38 % d'invendus** [P7C-P45, confiance basse]. Un avis de 2026 affirme que la plupart des annonces de moins de 500 k$ d'ARR sur Acquire.com restent peu vues [P7C-P44, opinion].
- **Raisons documentées :**
  1. Prix trop élevé : à plus de 10 % au-dessus du marché, l'annonce ne toucherait que 2 % des acheteurs [P7C-P03]. L'écart demandé/offert peut être de 4 à 5 fois [P7C-P28].
  2. Absence de bénéfice ou bénéfice trop faible : seuil de 2 000 $/mois chez Empire Flippers [P7C-P19].
  3. Historique < 12 mois [P7C-P19].
  4. Churn élevé et MRR non reconstituable [P7C-P31].
  5. Concentration sur un client [P7C-P19, P40].
  6. Dépendance au fondateur [P7C-P21].
  7. Visibilité insuffisante sur la plateforme [P7C-P44].
  8. Marché d'acheteurs étroit pour un produit non anglophone [P7C-P12, H].

## 8. Effets chiffrés disponibles (à manier avec prudence)

| Facteur | Effet | Source, confiance |
|---|---|---|
| Qualité générale (quartile supérieur vs moyenne) | ≈ ×1,6 sur Flippa (4,06x contre 2,47x) ; jusqu'à ×2,7 sur les transactions de 10 à 100 k$ (5,96x contre 2,24x) | P7C-P08, moyenne-haute |
| Concentration clients | −20 à −30 % | P7C-P40, basse-moyenne (taille différente) |
| Dépendance au fondateur | −15 à −30 % (agences) ; prime de +15 à 25 % pour un faible temps propriétaire (éditorial) | P7C-P42, basse |
| Churn | Aucun coefficient fiable. Seuils indicatifs : > 6 %/mois fait échouer la vente, < 8 %/an vaut une prime | P7C-P31, basse |
| Prix affiché au-dessus du marché | +10 % de prix → environ 2 % des acheteurs engagés | P7C-P03, basse |

## 9. Spécificités d'une vente par un micro-entrepreneur français

1. **Vente d'actifs uniquement.** Un entrepreneur individuel n'a pas de parts sociales à céder [E]. Le contrat de cession d'actifs (APA) liste :
   - le code et sa propriété intellectuelle ;
   - les noms de domaine et la marque (INPI) ;
   - la clientèle et les contrats ;
   - les comptes tiers ;
   - la documentation ;
   - une période d'accompagnement ;
   - éventuellement une non-concurrence.
   Les données clients relèvent du RGPD : il faut informer les clients du changement de responsable de traitement [H, à valider par un juriste].
2. **Stripe.** Le changement de propriétaire d'un compte se fait par le support. La procédure est **différente si l'acquéreur est une entité d'un autre pays** [P7C-P34]. Selon des sources communautaires, on ne peut pas transférer un compte entre parties ni changer son pays. L'acheteur ouvre son propre compte et demande une **migration des clients et des moyens de paiement** [P7C-P35, basse-moyenne]. Conséquences [E] :
   - prévoir 2 à 6 semaines ;
   - prévoir un risque d'échec de paiement ou de churn au moment de la bascule ;
   - prévoir des clauses de reversement des encaissements perçus après la date de cession.
3. **Séquestre.** Escrow.com est l'usage pour les acheteurs étrangers, avec environ 2,6 % sous 5 k$ [P7C-P36]. Un acheteur étranger impose souvent un droit étranger (Delaware, Angleterre) dans le contrat type de la plateforme [H].
4. **Fiscalité de la plus-value (à faire valider par un expert-comptable).**
   - **Art. 151 septies.** Exonération si l'activité a **au moins 5 ans** et que les recettes sont sous environ 90 k€ (services, exonération totale) ou 126 k€ (exonération partielle). Les sources divergent ; les seuils sont à vérifier sur Légifrance [P7C-P37].
   - **Art. 238 quindecies.** Exonération si la valeur cédée est ≤ 300 k€ (partielle jusqu'à 500 k€) et que l'activité a au moins 5 ans, sous réserve que le SaaS soit qualifié de « branche complète d'activité » [P7C-P38].
   - **Avant 5 ans.** Une clientèle créée par le vendeur a un coût d'acquisition nul : presque tout le prix est une plus-value. Au-delà de 2 ans de détention, la plus-value à long terme est imposée à **16 % + prélèvements sociaux** [P7C-P37]. Avant 2 ans, c'est une plus-value à court terme, imposée comme un revenu [H].
   - **Conclusion fiscale [E].** Il faut **viser une cession après 5 ans d'activité**, ou chiffrer le net après impôt.
5. **TVA.** L'article 257 bis (dispense de TVA pour la transmission d'une universalité de biens) vise les cessions entre redevables. Son application à un cédant en franchise de TVA et à un acheteur hors de France n'est pas documentée [P7C-P39, H].
6. **Langue française.** Flippa affirme que 85 % de ses transactions sont transfrontalières et que la langue a déjà bloqué des transactions européennes [P7C-P12, argument commercial]. Je n'ai trouvé aucune décote chiffrée. Le marché français de cession de micro-SaaS est peu structuré : annonces UIMM sans chiffres, plateforme Cedaf « pas encore assez connue » [P7C-P48]. Pistes [E] :
   - garder le code, l'administration et la documentation **en anglais**, et ne localiser que l'interface ;
   - viser comme repreneurs les **acheteurs stratégiques francophones** : éditeurs verticaux, intégrateurs, concurrents.

## 10. Seuils pratiques

| Question | Réponse retenue | Base |
|---|---|---|
| MRR sous lequel la vente est **marginale** | **< 1 000 €/mois** : vente possible, mais 5 à 25 k€ bruts, acheteurs particuliers, frais fixes et temps de vente disproportionnés | P7C-P25, P26, P27, P08 [E] |
| MRR minimal pour une vente **réaliste** (accès aux courtiers, plusieurs offres) | **≈ 2 000 à 2 500 € de bénéfice net mensuel**, régulier sur 12 mois. C'est le plancher d'Empire Flippers (2 000 $ net/mois) | P7C-P19 [P] ; témoignage de 3 k$ de MRR avec plusieurs offres en 3 semaines, P7C-P47 [basse] |
| Délai de vente | **2 à 4 mois** (moyenne 81 jours, médiane 97 jours) ; ≤ 30 jours si le prix est juste ; jusqu'à 6 mois et plus si le prix est trop haut | P7C-P01, P02, P22, P11 |
| Historique requis | **12 mois minimum** (Empire Flippers) ; **24 mois** conseillés ; **5 ans** pour l'optimum fiscal français | P7C-P19, P37 [P] ; [E] |

**Application au porteur (3 000 € de MRR, scénario et non promesse) [E].**
- Bénéfice annuel ≈ 32 k€ (marge ≈ 90 %).
- Fourchette 2-3,5x → **≈ 65 à 110 k€ bruts**, centre ≈ 80 k€ au multiple moyen de Flippa (2,47x).
- La médiane d'Acquire.com (3,9x → ≈ 125 k€) est un plafond optimiste, pas une attente.
- Net encaissé avant 5 ans, après frais et impôt : de l'ordre de **55 à 85 k€** [E].
- Chaque point de churn mensuel en moins et chaque heure d'exploitation en moins pèsent plus que +10 % de MRR [E].

## 11. Checklist « construire pour revendre »

1. **Prix moyen par client ≥ 30 à 50 €/mois** en B2B, pour viser un churn mensuel ≤ 3 % (P7C-P16, P17). Proposer des **formules annuelles**, avec une part d'annuel ≥ 30 à 40 % (P7C-P21).
2. **Facturation 100 % Stripe**, propre, sans paiements hors plateforme. MRR, churn et cohortes doivent être reconstituables mois par mois dès le premier jour (P7C-P31, P47).
3. **Un compte Stripe, un domaine, des comptes SaaS tiers (Brevo, Supabase, hébergeur) dédiés au produit** et transférables, jamais mêlés à d'autres activités [E].
4. **Comptabilité séparée** par produit, avec le SDE documenté : coûts, temps passé [E].
5. **Aucun client > 10 % du MRR**, et les 5 premiers < 30 % (P7C-P40).
6. **Moins de 5 heures par semaine d'exploitation, journalisées.** Support par base de connaissances, onboarding automatique, aucune vente « au téléphone » (P7C-P21, P42).
7. **Stack standard** (Node, Postgres/Supabase, Stripe), tests, déploiement scripté, README d'exploitation **en anglais**, runbook d'incidents [H].
8. **Acquisition transférable**, documentée avec son coût et son volume : SEO, annuaires, marketplace. Pas de dépendance à l'audience personnelle du fondateur [E].
9. **Dépendance à une plateforme limitée et assumée** : pas de fonctionnalité que Shopify, Google ou Notion pourraient intégrer nativement (P7C-P31).
10. **Propriété intellectuelle et aspects juridiques propres** : marque déposée, conditions générales et DPA permettant la cession du contrat, registre RGPD, licences open source compatibles [H].
11. **12 mois de croissance ou de stabilité** avant la mise en vente, idéalement 24. Calendrier fiscal : **5 ans** (P7C-P19, P37).
12. **Prix affiché au niveau du marché**, entre 2,5 et 3,5x le SDE, et non au niveau rêvé. Les 30 premiers jours concentrent l'intérêt (P7C-P02, P03).

## 12. Facteurs qui détruisent la valeur

| Facteur | Mécanisme | Gravité |
|---|---|---|
| Churn mensuel > 5 à 6 % (ARPA faible, clients particuliers) | Rend la vente difficile ou fait échouer la transaction ; rétention nette < 100 % presque certaine sous 10 $ d'ARPA | Critique (P7C-P15, P31) |
| Absence de bénéfice ou bénéfice < 2 k$/mois | Exclusion des courtiers ; acheteurs amateurs seulement | Critique (P7C-P19) |
| Métriques invérifiables (paiements hors Stripe, comptabilité mélangée) | Confiance nulle, transaction abandonnée | Critique (P7C-P31) |
| Dépendance au fondateur (ventes, support expert, audience personnelle) | Décote de 15 à 30 % ou earn-out | Forte (P7C-P42, P21) |
| Concentration sur 1 à 3 clients | Décote de 20 à 30 %, ou refus | Forte (P7C-P40, P19) |
| Dépendance à une plateforme qui peut copier la fonction | Décote, transaction bloquée | Forte (P7C-P31) |
| Tendance baissière sur les 12 derniers mois | Le multiple s'applique à un bénéfice qui baisse | Forte [E] |
| Prix demandé excessif | Annonce ignorée, puis historique d'invendu | Moyenne (P7C-P03, P28) |
| Produit, code et documentation uniquement en français | Bassin d'acheteurs restreint | Moyenne, non chiffrée [H] |
| Vente avant 5 ans d'activité (micro-entreprise) | Plus-value imposable sur presque tout le prix | Moyenne (P7C-P37) |

## 13. Conséquences pour la grille v3 (critère « Revente », 15 points)

- **8 à 10/10** : B2B, ARPA ≥ 30 €, abonnements annuels, Stripe propre, aucun client > 10 %, < 5 h/semaine, pas de plateforme hôte.
- **5 à 7/10** : app de marketplace (Shopify, Slack) ou produit francophone de niche avec acheteurs stratégiques identifiables.
- **≤ 4/10** : B2C ou ARPA < 10 €, service déguisé en SaaS, dépendance à 1 à 3 clients, ou vente assurée par le fondateur.
- **Relanzio** (relance de devis, Node/Supabase/Stripe/Brevo) : la stack est revendable [E]. La revente dépend entièrement de l'atteinte d'environ 2 000 € de bénéfice mensuel sur 12 mois, avec un ARPA B2B suffisant. Aucune de ces deux conditions n'est remplie aujourd'hui, puisque le produit n'a aucun client payant [P, brief].
