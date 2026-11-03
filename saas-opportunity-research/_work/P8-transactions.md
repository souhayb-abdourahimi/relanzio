# P8 — Transactions conclues de micro-SaaS : multiples observés et multiples recommandés

Date : 2026-10-30. Données : `P8-transactions.csv` (26 lignes). Preuves : `P8-transactions-preuves.csv` (P8T-P01 à P8T-P38).
Étiquettes : **[P]** preuve sourcée, **[E]** estimation ou calcul, **[H]** hypothèse non vérifiée.
Statuts : **CONFIRMÉE** (prix conclu publié par le vendeur, l'acheteur ou la plateforme), **AGRÉGÉE** (multiple réalisé publié par une plateforme), **DEMANDÉE** (prix affiché, exclu du calcul), **NON VÉRIFIABLE** et **HORS PÉRIMÈTRE** (exclus).

## 0. Méthode et limites

- **41 recherches web.** WebFetch n'a pas été retenté, puisqu'il avait échoué en P7. Tous les chiffres viennent des extraits de résultats de recherche ou des preuves P7 déjà collectées. Aucune page n'a été lue en entier.
- **Multiples calculés par moi [E].** Le multiple d'ARR vaut prix ÷ (MRR × 12). Le multiple de bénéfice vaut prix ÷ bénéfice annuel, seulement quand le bénéfice est publié ou que la marge est déclarée.
- **Le MRR est celui déclaré à la vente.** Pour TalkNotes et Xnapper, c'est un pic ou une estimation. Ces cas sont signalés.
- **Ce que je n'ai pas trouvé :**
  - aucune annonce Empire Flippers « vendue » avec son **prix final**. Les pages « Sold » visibles sont des miroirs tiers qui montrent le prix **affiché** ;
  - aucun prix conclu sur Flippa, car les prix de vente y sont masqués ;
  - aucune transaction française chiffrée et vérifiable ;
  - aucun effectif (n) publié dans les extraits des rapports Acquire.com et Flippa ;
  - aucune médiane SaaS en SDE chez FE International ou Quiet Light.

## 1. Synthèse

1. **L'échantillon confirmé est petit et biaisé.**
   - **18 transactions** ont un prix conclu publié.
   - **14** ont un MRR connu, donc un multiple d'ARR calculable.
   - **3** ont un multiple de bénéfice.
   - Seules **4** transactions sont dans la tranche du porteur (1-5 k$ de MRR), dont 3 datent de 2021-2022.
2. **Dans la tranche 1-5 k$ de MRR, les ventes confirmées se font à 2,2-3,1x l'ARR (médiane 2,37x, n = 4).** Avec une marge de 85 à 90 %, cela fait environ **2,5-3,5x le bénéfice** [E]. C'est cohérent avec le Flippa réalisé (2,24x pour les transactions de 10 à 100 k$, 2,47x tous SaaS confondus). C'est **sous** la médiane Acquire.com de 3,9x.
3. **Sous 300 $ de MRR, les multiples (4,5 à 8,3x l'ARR) sont un artefact de prix plancher.** Les acheteurs paient 2 à 10 k$ pour du code, un domaine et des utilisateurs, pas pour le flux de revenus. Ces multiples ne sont pas transposables.
4. **Les effets observables sont nets mais anecdotiques.**
   - **Dépendance à une plateforme hostile** (API Twitter) : valeur effondrée. Black Magic est vendu environ 128 k$ après une offre refusée de 500 k$ (**−74 %**).
   - **Fondateur épuisé et CA en baisse** : TalkNotes à 2,2x l'ARR, contre 4,0x pour Potion dans la même tranche (**−44 %**). Le scoreboard Empire Flippers donne −45 % pour les entreprises « en difficulté ».
   - **Churn** : **aucun effet mesurable**, car aucune vente confirmée ne publie le churn avec le prix.
5. **Multiples recommandés pour un micro-SaaS B2B de 1 à 5 k€ de MRR** (sur le bénéfice annuel ou SDE) :
   - **prudent 2,0x** ;
   - **central 2,5x** ;
   - **favorable 3,5x**.
   Ces multiples sont à **pondérer par une probabilité de vente nettement inférieure à 100 %**.

## 2. Échantillon des transactions CONFIRMÉES

Les montants sont en dollars. Le multiple d'ARR est mon calcul [E].

| # | Transaction | Date | Plateforme | MRR | Prix conclu | × ARR | × bénéfice | Structure | Confiance | Preuve |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Générateur VBA (12 clients) | 2023-25 | Microns | 25 | 2 223 | 7,41 | — | ? | moyenne | P8T-P13 |
| 2 | Outil de prospection Twitter (Shri) | 2022 | Microns | ≈ 67 | 6 000 | 7,46 | — | ? | moyenne | P8T-P12 |
| 3 | GameWidget (Marc Lou) | 2023-03 | ? | 80 | 4 300 | 4,48 | — | ? | moyenne-haute | P8T-P06 |
| 4 | Rocket Note (extension Chrome) | ~2021-22 | ? | ≈ 100 | ≈ 10 000 | 8,33 | — | ? | basse | P8T-P11 |
| 5 | PageIndexer (30 clients) | 2023-25 | Microns | ≈ 308 | 5 000 | 1,35 | — | ? | moyenne | P8T-P13 |
| 6 | Outil CSV vers tableau de bord | ? | Fusellit | 350 | 6 500 | 1,55 | — | ? | moyenne | P8T-P10 |
| 7 | Habits Garden (Marc Lou, B2C) | 2023 | ? | 450 | 10 000 | 1,85 | — | ? | moyenne-haute | P8T-P06 |
| 8 | PulseBanner | 2022-10 | Acquire.com | 1 700 | 45 750 | 2,24 | — | 100 % comptant | moyenne | P8T-P02 |
| 9 | Cloakist | 2022-03 | MicroAcquire | ≈ 2 000 | 60 000 | 2,50 | — | ? | moyenne-haute | P8T-P01 |
| 10 | App réseaux sociaux (anonyme) | ≤ 2021 | ? | 3 750 | 100 000 | 2,22 | — | ? | basse | P8T-P14 |
| 11 | Xnapper (Tony Dinh) | 2023 | ? | ≈ 4 000 (estimation) | 150 000 | 3,12 | — | ? | moyenne-basse | P8T-P08 |
| 12 | Potion | 2023-04 | Acquire.com | ≈ 6 300 | 300 000 | 3,97 | — | ? | moyenne-haute | P8T-P03 |
| 13 | App Shopify (anonyme) | ? | ? | 6 700 | 250 000 | 3,11 | 3,45 (marge 90 % déclarée) | 100 % comptant | moyenne | P8T-P04 |
| 14 | TalkNotes (Nico Jeannen) | 2024 | Acquire.com | ≈ 7 500 (pic, CA en baisse) | 200 000 | 2,22 | — | 100 % comptant | moyenne | P8T-P07 |
| 15 | MakeLanding (Marc Lou) | 2023 | Acquire.com | ventes ponctuelles (≈ 1,2 k$/mois de bénéfice) | 35 000 | — | 2,50 | ? (1re transaction avortée) | moyenne-haute | P8T-P05 |
| 16 | Zencast | ? | ? | ? | ? | — | 3,48 | comptant, J+1, sans earn-out | basse | P8T-P15 |
| 17 | Black Magic (Tony Dinh → HypeFury) | 2023 | directe | inconnu à la vente (pic 14 k$) | ≈ 128 000 | ≤ 0,76 sur le pic, exclu | — | ? | basse-moyenne | P8T-P09 |
| 18 | MakeLogo.ai (Nico Jeannen) | 2023-24 | ? | inconnu | 65 000 | — | — | ? | moyenne | P8T-P07 |

**Données exclues du calcul (voir le CSV) :**
- Lot Slack/Monday : demandé 15 k$ pour environ 750 $ de MRR, prix final non publié.
- MealByMeal : non vendu, voir le §6.
- Trois annonces Empire Flippers : prix affichés.
- Exemple français de La Fabrique du Net : 3 500 €/mois pour 140 000 €, probablement illustratif.
- SaaS de données sportives cité par Tekpon : incohérent et introuvable.
- Plateforme paywall à 3,5 M$ : plus de 20 k$ de MRR.

## 3. Multiples observés par tranche (CONFIRMÉES uniquement)

### 3.1 En multiple d'ARR (n = 14)

| Tranche de MRR | n | Médiane | Min | Max | Lecture |
|---|---|---|---|---|---|
| < 1 k$ (tout) | 7 | 4,48x | 1,35x | 8,33x | bimodale : inutilisable telle quelle |
| — dont < 300 $ | 4 | 7,4x | 4,48x | 8,33x | prix plancher de 2 à 10 k$, indépendant du revenu |
| — dont 300 $ à 1 k$ | 3 | 1,55x | 1,35x | 1,85x | vrai multiple de flux ; vendeurs pressés |
| **1 à 5 k$** | **4** | **2,37x** | **2,22x** | **3,12x** | tranche du porteur ; 3 cas sur 4 datent de 2021-2022 ; Xnapper repose sur un MRR estimé |
| 5 à 20 k$ | 3 | 3,11x | 2,22x | 3,97x | dispersion pilotée par l'état de l'entreprise (TalkNotes en déclin, Potion en bonne santé) |
| Total | 14 | 2,81x | 1,35x | 8,33x | non pertinent (mélange) |

### 3.2 En multiple de bénéfice (n = 3)

- App Shopify : 3,45x (bénéfice calculé avec la marge déclarée [E]).
- MakeLanding : 2,50x (bénéfice TTM publié).
- Zencast : 3,48x (taille inconnue).
- **Médiane : 3,45x ; minimum 2,50x ; maximum 3,48x.** L'effectif est trop faible pour une statistique.

### 3.3 Conversion ARR vers bénéfice [E]

Pour un micro-SaaS solo à marge de 85 à 90 %, le multiple de bénéfice vaut le multiple d'ARR divisé par la marge. La médiane 1-5 k$ de 2,37x l'ARR correspond donc à **≈ 2,6-2,8x le bénéfice**. La fourchette 2,22-3,12x l'ARR correspond à **≈ 2,5-3,6x le bénéfice**.

## 4. Comparaison avec les médianes AGRÉGÉES

| Source | Multiple réalisé | Base | Échantillon | Statut, preuve |
|---|---|---|---|---|
| Acquire.com, 2024 et 2025 | **3,9x** (médiane ; une synthèse dit « moyenne ») | bénéfice, ventes **déclarées** | non publié dans les extraits | AGRÉGÉE, P8T-P22 |
| Acquire.com 2025, < 100 k$ de bénéfice | 3,7x (moyenne) | bénéfice | non publié | AGRÉGÉE, P8T-P23 |
| Acquire.com, rapport 2023 | 4,3x (moyenne SaaS ; 5,4x en 2022) ; < 100 k$ : 4,11x ; étendue 0,63-34x | bénéfice TTM | non publié | AGRÉGÉE (synthèse tierce), P8T-P24 |
| Flippa H1 2026, SaaS | **2,47x** (moyenne), 4,06x au quartile supérieur | bénéfice, ventes conclues sur Flippa | non publié | AGRÉGÉE, P8T-P25 |
| Flippa H1 2026, transactions de 10 à 100 k$ | **2,24x** (moyenne), 5,96x au quartile supérieur | bénéfice | non publié | AGRÉGÉE, P8T-P25 |
| Flippa H1 2026, transactions de 100 à 250 k$ | 1,85x | bénéfice | non publié | AGRÉGÉE, P8T-P25 |
| Flippa 2025, SaaS | 2,7x (moyenne), 5,8x au quartile supérieur | bénéfice | non publié | AGRÉGÉE, P8T-P26 |
| Empire Flippers, comparables SaaS | **≈ 3,2x** (1,8-4,6x) | bénéfice net annuel | **270 comparables** | AGRÉGÉE (miroir tiers), P8T-P19 |
| Empire Flippers, comparables SaaS plus grands (≈ 44 k$/mois) | ≈ 3,7x (1,8-5,1x) | bénéfice net annuel | 36 comparables | AGRÉGÉE (miroir tiers), P8T-P19 |
| Empire Flippers, scoreboard toutes niches | 26,4x mensuel (≈ 2,2x annuel) ; « en difficulté » 14,4x (≈ 1,2x) | bénéfice net | non publié | AGRÉGÉE, P8T-P21 |
| Microns, 2023 | prix moyen 4 600 $ (40 ventes, 185 800 $) | prix seul | 40 | AGRÉGÉE (montants), P8T-P28 |
| Dotmarket (France), tous sites | 23x mensuel (≈ 1,9x annuel) | bénéfice net | non publié | AGRÉGÉE (faible), P8T-P32 |
| **Pour comparaison : annonces Acquire.com, juin 2026** | 3,60x le bénéfice, 2,30x le CA (médianes **demandées**) | prix affichés | 275 SaaS | **DEMANDÉE**, P8T-P27 |

**Lecture [E].**
- Les ventes confirmées de la tranche 1-5 k$ (≈ 2,6-2,8x le bénéfice) tombent **entre Flippa (2,2-2,5x) et Empire Flippers (3,2x)**, et **sous Acquire.com (3,7-3,9x)**.
- Les chiffres Acquire.com sont déclarés par les utilisateurs, et les vendeurs satisfaits déclarent davantage. Ils sont **au niveau des prix demandés** sur la même plateforme (3,6x en juin 2026). C'est un indice de biais à la hausse, ou d'une décote demandé/conclu faible sur cette plateforme. Je ne peux pas trancher.
- Empire Flippers n'accepte que des entreprises vérifiées à au moins 2 000 $ de bénéfice net par mois (P7C-P19). Ses 3,2x valent pour des dossiers déjà **courtés et audités**. C'est un repère **favorable**, pas central.
- Les multiples d'Empire Flippers sont exprimés en annuel depuis le **8 septembre 2026** (P8T-P20). Il ne faut plus diviser par 12 les chiffres récents de cette plateforme.

## 5. Effets observables

| Facteur | Observation (paires ou groupes comparables) | Effet chiffré | Fiabilité |
|---|---|---|---|
| **Dépendance à une plateforme hostile** (API Twitter) | Black Magic : offre de 500 k$ (dont 100 k$ comptant) refusée, puis vente à ≈ 128 k$ après la hausse de prix de l'API, à ≤ 0,76x l'ARR du pic. PulseBanner (Twitter) : acheté 2,24x l'ARR, sous-performance ensuite (P8T-P09, P02) | jusqu'à **−74 %** de valeur, ou acheteur perdant | basse-moyenne (une offre n'est pas une vente) |
| **Dépendance à une place de marché stable** (Shopify, Slack, Monday) | App Shopify : 3,11x l'ARR et 3,45x le bénéfice, payés comptant, **sans décote visible** face à Potion (3,97x). Lot Slack/Monday demandé à ≈ 1,66x l'ARR (P8T-P04, P16) | décote non démontrée (n = 1) ; −15 à −25 % plausible [E] | basse |
| **Temps et énergie du fondateur, déclin** | Même tranche : TalkNotes (burnout, bugs, CA en baisse) à 2,22x contre Potion (sain) à 3,97x, soit **−44 %**. Outil CSV (vendeur sans temps) : 1,55x en 10 jours. Empire Flippers : « en difficulté » 14,4x contre « typique » 26,4x mensuel, soit **−45 %** (P8T-P07, P03, P10, P21) | **−40 à −45 %** pour une vente sous contrainte ou en déclin | moyenne (convergence de 2 sources indépendantes) |
| **Churn** | Cloakist (churn estimé par le vendeur à 5-15 %/mois) vendu 2,5x l'ARR, sans décote visible. Aucune autre vente ne publie le churn (P8T-P01) | **non mesurable** | — |
| **Taille** | < 300 $ de MRR : 4,5-8,3x (plancher) ; 300 $-1 k$ : 1,35-1,85x ; 1-5 k$ : 2,2-3,1x ; 5-20 k$ : 2,2-4,0x. Flippa montre l'inverse au-dessus de 100 k$ de prix (1,82-1,85x contre 2,24x) | le multiple monte de 300 $ à environ 5 k$ de MRR, puis la dispersion domine | moyenne-basse |
| **Audience du vendeur** | Marc Lou, Tony Dinh et Nico Jeannen vendent vite et publient. Leurs multiples ne sont pourtant pas supérieurs à la tranche (Habits Garden 1,85x, TalkNotes 2,22x) | pas de prime visible ; biais de **publication** surtout | basse |

**Conséquence pour le porteur [E].** Les deux leviers que l'on observe vraiment sont la **santé au moment de la vente** (CA stable ou en hausse, vendeur non contraint) et l'**absence de dépendance à une API tierce révocable**. Chacun vaut environ 40 % de valeur. L'effet du churn reste **non démontré** par des transactions. Il repose sur les dires des acheteurs (P7C-P31) et la logique (un bénéfice qui fond fait baisser le prix).

## 6. Non-ventes et prix demandés

- **MealByMeal** (P8T-P17).
  - Affiché à 20 k$ (≈ 20x l'ARR), puis baissé à 10 k$.
  - Offre de 5 k$, contre-offre de 6 k$.
  - **Transaction abandonnée** le 7 mars 2025.
- **MakeLanding** (P8T-P05). Une première transaction a avorté après NDA, LOI et séquestre : l'acheteur n'avait versé qu'une fraction du prix.
- **TrustMRR** (P8T-P29). Plus de 3 000 startups à vendre et environ 115 acquisitions conclues en 6 mois, soit environ **4 % des annonces sur 6 mois**. Le calcul est grossier [E] : beaucoup d'annonces sont opportunistes.
- **Flippa**, ancienne extraction tous sites (P8T-P33) : environ **38 % d'invendus**.
- **Taux affichés par les courtiers** : 94,1 % chez FE International (P8T-P30) ; 85 % vendus en 90 jours chez Quiet Light (P8T-P31). Ces taux portent sur des **mandats pré-sélectionnés**, à plus de 100 k$ de SDE chez Quiet Light. Ils ne s'appliquent pas à un micro-SaaS de 1 à 5 k$ de MRR.
- **Écart entre prix demandé et prix conclu.** Sur Acquire.com, les médianes demandées (3,6x le bénéfice) sont au niveau de la médiane « réalisée » (3,9x). Sur les micro-annonces, l'écart atteint 2 à 4 fois (MealByMeal). MakeLanding a été vendu 8 % sous son prix demandé.

## 7. Multiples recommandés pour un micro-SaaS B2B de 1 à 5 k€ de MRR

Ils s'appliquent au **bénéfice annuel** (SDE : bénéfice + rémunération du fondateur réintégrée). Avec une marge de 85 à 90 %, l'équivalent ARR est donné entre parenthèses [E].

| Scénario | Multiple de bénéfice | ≈ Multiple d'ARR | Conditions | Ancrage |
|---|---|---|---|---|
| **Prudent** | **2,0x** | ≈ 1,8x | vente sur Flippa ou Microns, vendeur pressé, historique < 18 mois, ou CA plat ou en léger déclin | Flippa 100-250 k$ : 1,85x ; Flippa 10-100 k$ : 2,24x ; TalkNotes 2,22x l'ARR ; scoreboard Empire Flippers ≈ 2,2x |
| **Central** | **2,5x** | ≈ 2,2-2,3x | B2B, Stripe vérifiable, 12 à 24 mois d'historique stable, < 5 h/semaine, vente sans urgence | médiane confirmée 1-5 k$ : 2,37x l'ARR (≈ 2,6x le bénéfice) ; Flippa SaaS 2,47x ; Cloakist 2,5x ; MakeLanding 2,5x |
| **Favorable** | **3,5x** | ≈ 3,0-3,1x | croissance démontrée, churn mensuel ≤ 3 %, abonnements annuels, aucune dépendance à une API, plusieurs acheteurs en concurrence ; Empire Flippers ou Acquire.com | comparables Empire Flippers 3,2x (n = 270) ; App Shopify 3,45x ; Xnapper 3,1x ; plafond sous Acquire.com 3,7-3,9x (déclaratif) |

**Pourquoi ne pas prendre 3,9x (Acquire.com) comme central :**
1. Ce sont des données déclarées, au niveau des prix demandés.
2. Aucune vente confirmée de la tranche 1-5 k$ ne dépasse 3,12x l'ARR.
3. Flippa, qui ne compte que des ventes conclues, se situe à 2,2-2,5x.

**Pourquoi pas sous 2,0x :** les cas à 1,35-1,85x sont des tranches inférieures (moins de 1 k$ de MRR) ou des vendeurs qui bradent.

**Ajustements à appliquer [E] :**
- −40 % en cas de déclin ou de vente contrainte (§5).
- Dépendance à une API révocable : multiple prudent au mieux, voire invendable.
- Produit, code et documentation uniquement en français : rester au **central au mieux**. Aucune décote chiffrée n'a été trouvée [H].

**Valeur espérée [E].** Prix espéré = probabilité de vente × multiple × bénéfice − frais (4 à 10 % de commission, séquestre, impôt ; voir P7 §5 et §9). Pour un micro-SaaS sain de 1 à 5 k€ de MRR, je retiens **une probabilité de vente de 50 à 70 % en 6 mois** comme hypothèse de travail [H]. Aucune source ne la mesure pour ce segment. Exemple : 3 000 € de MRR et 90 % de marge donnent ≈ 32 k€ de bénéfice. Les fourchettes sont alors 65 k€ (prudent), 81 k€ (central) et 113 k€ (favorable) bruts. En espérance, le central fait ≈ 40 à 57 k€ avant frais et impôt.

**Écart avec P7.** P7 retenait 2,5-3x en central pour la tranche 1-5 k$ de MRR. Les transactions confirmées justifient de **ramener le central à 2,5x**, le bas de la fourchette P7, et de **plafonner le favorable à 3,5x**. P7 retenait 1,5-2,5x sous 1 k$ de MRR : c'est confirmé pour 300 $-1 k$ de MRR (1,35-1,85x l'ARR).

## 8. Biais à garder en tête

1. **Sélection des succès publiés.** Les ventes connues viennent de fondateurs à forte audience (Marc Lou, Tony Dinh, Nico Jeannen) ou de plateformes qui font leur promotion (Microns, Flippa). Les ventes ratées et bradées sont rarement racontées. MealByMeal est l'exception.
2. **Non-vente invisible.** Aucun multiple ne tient compte des annonces qui ne se vendent pas : environ 4 % de conversion en 6 mois sur TrustMRR [E, grossier] ; 38 % d'invendus sur l'ancien Flippa. Un multiple « réalisé » est **conditionnel à la vente**.
3. **Déclaratif.** Les multiples d'Acquire.com reposent sur des ventes déclarées par les utilisateurs, et la plateforme n'est pas partie aux transactions. Pour plusieurs cas (Xnapper, TalkNotes), le MRR est un pic ou une estimation, ce qui biaise le multiple à la baisse ou à la hausse selon le cas.
4. **Effet plancher sur les micro-prix.** En dessous de 300 $ de MRR, les multiples de 4 à 8x l'ARR reflètent un prix minimum d'actif, pas une valorisation de flux.
5. **Ancienneté et période de bulle.** Cinq des 14 multiples d'ARR datent de 2021-2022, dont trois sur quatre dans la tranche 1-5 k$. Les multiples Acquire.com sont passés de 5,4x (2022) à 3,9x (2024-2025), et Flippa de 2,7x (2025) à 2,47x (H1 2026).
6. **Confusion entre prix demandé et prix conclu.** Les miroirs Empire Flippers marquent « Sold » des pages qui montrent le prix affiché. Plusieurs blogs (Beancount, Tekpon) mêlent annonces et ventes, ou publient des chiffres incohérents. Ces données ont été exclues.
7. **Moyenne ou médiane.** Flippa publie des moyennes. Pour Acquire.com, le libellé (moyenne ou médiane) varie selon les synthèses.
8. **Effectifs absents.** Aucun rapport n'expose son n dans les extraits, sauf les comparables Empire Flippers (270 et 36) et Microns 2023 (40 ventes).
9. **Marché français.** Aucune vente de SaaS française chiffrée et vérifiable n'a été trouvée. Le repère Dotmarket (≈ 1,9x annuel, tous sites) n'est pas propre au SaaS.

## 9. Pistes pour fiabiliser

- Autoriser `blog.acquire.com`, `flippa.com` et `empireflippers.com` dans les réglages réseau, pour lire les rapports complets (effectifs, médianes par tranche) et les pages « sold » officielles d'Empire Flippers.
- Demander à Empire Flippers ou à Flippa leurs **comparables SaaS vendus** pour un dossier de 1 à 5 k$ de MRR. Le service est gratuit à l'évaluation.
- Suivre TrustMRR ou Microns sur 6 mois (annonces retirées contre annonces vendues) pour mesurer un vrai taux de vente du segment.
