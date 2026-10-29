# Red team n° 3 : contradicteur final, avant la recommandation unique

Date : 2026-10-29. Rôle : chercher les défauts commerciaux et les obstacles à la vente.
- Preuves : `redteam3-preuves.csv` (RT3-P01 à RT3-P40 : 3 POUR, 19 CONTRE, 18 NEUTRE). Dans ce document, `Pxx` renvoie à `RT3-Pxx`.
- Les identifiants `P7DN06-`, `P7DC39-`, `P7DN04-`, `P7C-`, `P7F-` et `P7R-` renvoient aux registres des dossiers attaqués.
- Étiquettes : **[P]** preuve sourcée, **[E]** estimation raisonnée, **[H]** hypothèse non vérifiée.

## En bref

- **Aucune option à construire n'atteint l'objectif tel qu'il est formulé.** Une fois les heures d'acquisition ajoutées (remplacement du churn × CAC / 35 €), tenir 3 000 € de MRR demande **9,6 à 13,9 h par semaine** pour N04, E-13-AG, C-39 et N06, et **43,6 h** pour E-13 actuel (§3). « Quelques heures par semaine » n'est atteignable qu'avec un churn ≤ 1,5 % et un canal organique. Aucun dossier ne prouve l'un ou l'autre.
- **Les études approfondies ont toutes fait baisser la note** : −13,5 pour N06, −7,5 pour C-39, −5 pour N04, soit −8,7 en moyenne. E-13-AG (51,5) **n'a pas été approfondie**. La comparer telle quelle aux trois autres est un biais. Avec la décote moyenne, elle tombe vers 43 [E].
- **E-13-AG** : la fonction est incluse dans des outils que les agences paient déjà : Yousign dès 9 € (P01, P02), PandaDoc Business (P05), Qwilr (P06), Axonaut (P08), Sellsy (P09). Deux nuances corrigent le rescreen :
  - le rappel natif de HubSpot semble réservé aux offres Professional et Enterprise (P03, P04) ;
  - aucune relance native n'a été trouvée chez Pipedrive (P07), mais une absence ne vaut pas preuve.

  Aucune donnée ne montre que les agences françaises paient un outil de proposition : la base de Qwilr est surtout américaine et australienne (P10, P11).
- **L'achat d'un micro-SaaS (option non étudiée jusqu'ici)** est la voie la plus directe vers un actif revendable. Mais il exige du capital : **≈ 33 à 45 k€ tout compris pour 1 000 € de MRR B2B**, et 80 à 110 k€ et plus pour 3 000 € (§2.5).
  - Il n'élimine pas le problème central. Le churn moyen des SaaS vendus sur Flippa est de **5,43 %/mois** (P18) : sans acquisition, un actif acheté perd environ **49 % de son MRR en 12 mois** [E].
  - Avec un budget « réduit », **l'achat n'est pas recommandé**. Le seuil est fixé au §4.
- **Recommandation unique : l'option (f).** Arrêter la recherche documentaire. Faire **un sprint de vente de 30 jours, sans code, à partir des contacts du porteur**, avec une règle mécanique de choix du segment (§4).
  - C'est l'option qui a la plus forte probabilité d'obtenir 3 paiements, au coût le plus bas.
  - C'est aussi la seule qui mesure la variable dont dépendent toutes les autres : la capacité du porteur à encaisser.
  - Elle bascule vers l'achat dans un seul cas : budget perdable ≥ 40 k€ **et** réseau insuffisant.

---

## 0. Méthode

- **28 recherches WebSearch**, dont environ **21 d'invalidation (≈ 75 %)** : relances natives chez 9 éditeurs, fraude aux métriques, churn hérité, frais, fiscalité de l'achat, absence de traces de RMD Keeper, reconstitution des temps CIR, couverture d'Order Invoicer.
- **1 WebFetch, en échec** : `microns.io` ne se résout pas (ENOTFOUND, domaine non autorisé dans les réglages réseau de la session). **Toutes les preuves sont des extraits de recherche**, souvent reformulés par le moteur, sans lecture des pages.
- **Absences** : aucun avis ni nombre de clients tiers pour RMD Keeper (recherche nominative sans résultat, donc pas de ligne CSV). Aucun prix public de forfait CIR indépendant. Aucun chiffre sur l'équipement des agences françaises en outils de proposition. Aucune transaction française chiffrée de SaaS de 500 à 2 000 € de MRR.
- **Probabilités** : ce sont des jugements subjectifs [H], pas des mesures. Chacun est expliqué au §2. Aucun acheteur n'a été simulé.

---

## 1. Le défaut de méthode commun : chaque approfondissement fait baisser la note

| Piste | Rescreen | DD | Écart | Principale cause |
|---|---|---|---|---|
| N06 | 62,0 | 48,5 | −13,5 | Concurrents nominatifs (Order Invoicer, Synchron.io), 3 familles d'API |
| C-39 | 57,5 | 50,0 | −7,5 | RMD Keeper au même prix, pas d'API de dépôt |
| N04 | 54,5 | 49,5 | −5,0 | ≈ 100 installations cumulées pour la catégorie |
| E-13-AG | 51,5 | **non approfondie** | décote attendue ≈ −5 à −13 | Déjà visible : la fonction est incluse ailleurs (P01-P09) |

**Conséquence.** Classer E-13-AG première à 51,5 compare une note non auditée à des notes auditées. Après décote, elle se situe vers **38 à 46** [E]. Les quatre options restent dans le bruit, et la grille ne peut plus les départager. La recherche documentaire a atteint son rendement nul : trois DD de plus de 40 recherches chacune n'ont produit **aucun signal de paiement**. Elles ont seulement rapproché les notes de 50.

---

## 2. Attaque option par option, sous l'angle « 3 000 € de MRR, quelques heures, revendable »

### 2.1 (a) N06 : opérateurs Mirakl secondaires + offre multi-dossiers pour cabinets e-commerce

- **La variante repose sur deux « aucun X trouvé »** : Leroy Merlin, Boulanger et Carrefour non couverts, et aucune vue cabinet (P7-DD-N06 §2). La seule information nouvelle va dans ce sens, sans le prouver : la fiche d'Order Invoicer décrit une facture par commande et des avoirs, sans ventilation des versements (P40) [P faible].
- **Défauts commerciaux** :
  1. **Les cabinets sont à la fois le canal et le concurrent.** Les plus avancés ont automatisé avec n8n (P7DN06-P15). Le DD estime leur cycle de signature à 1 à 3 mois. Or son seuil GO exige « au moins 1 cabinet » parmi 3 paiements **en 30 jours**. Ce seuil contredit son propre délai.
  2. **La crédibilité comptable est un prérequis de vente**, et le porteur ne l'a pas démontrée. Le support porte sur des écarts de TVA et de CA (« pourquoi 3,12 € ? »), ce qui le rend dépendant du fondateur et pèse sur la revente.
  3. **Les opérateurs secondaires sont la petite partie du marché** : Leroy Merlin compte environ 900 vendeurs (P7DN06-P37), et aucun chiffre n'existe pour Boulanger ou Carrefour. Le segment « mal servi » l'est peut-être parce qu'il est petit [E].
  4. **C'est l'option la plus lourde à exploiter** : 47 h/mois avant acquisition, **60 h/mois après**.
- **Probabilité de ≥ 3 paiements en 30 jours : ≈ 10 %** [H]. Base : 190 contacts froids, avec une réponse de 1 à 3 % [H], soit 2 à 6 conversations, dont il faudrait convertir la moitié. **≈ 25 %** si le porteur connaît personnellement au moins 3 experts-comptables qui ont des dossiers e-commerce.

### 2.2 (b) N04 : service de « rattrapage CIR depuis Jira » à 490 €

- **Le test ne valide pas le produit.** Un client qui paie 490 € pour qu'un humain reconstitue ses temps paie un **service**. Cela ne prouve pas qu'il paierait 49 €/mois pour une app que la catégorie n'a pas su vendre, même gratuite (≈ 100 installations cumulées, P7DN04-P02, P03).
- **Le service vend ce que la doctrine décourage.** Les cabinets demandent de renseigner les temps régulièrement « pour éviter de devoir les reconstituer a posteriori » (P38). Le contentieux porte d'abord sur l'éligibilité, pas sur l'arithmétique (P39). Un « rattrapage » est par nature une reconstitution. Il peut donc se vendre, mais il ne protège pas le client et expose le porteur à une réclamation [E].
- **Calendrier défavorable** : le dépôt a lieu en mai, et novembre est hors saison. Pour le CIR 2026, le tableau sera demandé entre mars et mai 2027 [E, P7-DD-N04 §1].
- **Concurrence du « gratuit inclus »** : les cabinets au succès (25 % du crédit, P7DN04-P21) et MyCIR à 2 500 €/an incluent la collecte.
- **Probabilité : ≈ 10 %** [H] à froid. **≈ 25 %** si le porteur connaît au moins 10 CEO ou CTO de startups qui déclarent le CIR.

### 2.3 (c) E-13-AG : Relanzio pour agences et prestataires B2B à 59 €

Vérifications demandées :

| Outil | Relance automatique des non-signataires ? | Preuve |
|---|---|---|
| Yousign | **Oui**, uniquement vers les non-signataires, à intervalles définis, dès 9 € HT/mois (tarif ancien) | P01, P02 |
| HubSpot | **Oui, mais apparemment en Professional et Enterprise seulement** (post communautaire du 27/06/2026 cité par une agence). La base de connaissances, mise à jour le 12/05/2026, décrit encore un workflow. Starter n'est pas couvert, ce qui reste à confirmer | P03, P04 |
| Pipedrive | **Non trouvé**. Smart Docs notifie l'ouverture, et une demande de fonction existe. C'est une absence, plafonnée à 5/10 | P07 |
| Axonaut | **Oui** (comparatifs) | P08 |
| Sellsy | **Oui** (plans de relance des devis) | P09 |
| Qwilr | **Oui** (« Reminders and Expirations », 173 avis G2) | P06 |
| Proposify | Non vérifié dans cette recherche | — |
| PandaDoc | **Oui** (Business et Enterprise, jusqu'à 10 rappels par document) | P05 |
| Teamleader | Non trouvé en natif ; passe par Signaturit ou Xodo Sign | P14 |

- **Combien d'agences paient déjà un outil de proposition ? Inconnu.** Qwilr aurait environ 1 000 clients pour 17,7 M$ (estimation Latka, P10), dont 48 % aux États-Unis, 16 % en Australie et 10 % au Royaume-Uni (P11). La France compterait environ 18 400 agences de communication, dont 86 % de micro-entreprises (chiffre non sourcé, P12). **Aucune preuve ne montre que les agences françaises paient pour la relance de propositions.** Celles qui signent électroniquement paient déjà Yousign, qui relance.
- **Défauts commerciaux** :
  1. La valeur ajoutée se réduit à « relancer les propositions qui ne passent pas par la signature électronique ». Ce besoin est réel, mais on le comble avec un rappel dans l'agenda.
  2. Yousign occupe le SEO « relance commerciale » (P13).
  3. Le churn de 4 % est une hypothèse [H]. Une fonction disponible dans un outil déjà payé produit un churn « je l'ai trouvé dans X ».
  4. **Biais d'engagement** : le code existant ne doit pas départager. Il ne réduit que le coût du test, et ce coût est déjà quasi nul pour toutes les options sans code.
- **Probabilité : ≈ 5 %** à froid. **≈ 25 %** si le porteur peut joindre personnellement au moins 20 dirigeants d'agences. Le résultat dépend entièrement du réseau.

### 2.4 (d) C-39 face à RMD Keeper

- RMD Keeper vend déjà le même produit, à 39-399 $/mois, avec des pages SEO par État (P7DC39-P01 à P03). La recherche nominative de traces tierces (avis, clients) n'a **rien** donné : sa traction est inconnue. Deux lectures sont possibles :
  - un marché vierge que RMD Keeper n'a pas su convertir ;
  - un marché qui ne paie pas pour du logiciel.

  **Aucune des deux ne favorise un second entrant.**
- La dépense observée va aux services faits pour vous, comme Performance West à 1 499 $/an (P7DC39-P05). Un logiciel qui ne dépose pas est plafonné en dessous.
- **Le profil du porteur est l'obstacle principal** : il est français, sans réseau télécom US, doit assurer un support à l'heure américaine, et prendre une E&O d'assuré étranger.
- Le seuil GO du DD (≥ 5 paiements ≥ 500 $ en 30 jours, à froid, aux États-Unis) est hors de portée.
- **Probabilité : ≈ 5 %** pour ≥ 3 paiements ≥ 149 $, et ≈ 2 % pour le GO du DD [H]. La fenêtre novembre-décembre, avant la recertification de février, est le seul atout.

### 2.5 (e) Acheter un micro-SaaS B2B rentable (500 à 2 000 € de MRR)

**Ce que montre le marché**
- **Microns** : 40 ventes en 2023, pour une moyenne de **4 600 $** (P15). Exemples : 3 700 $ d'ARR vendus 5 000 $ (P16) ; une app Shopify à 1 620 $ de MRR **demandée** à 57 000 $ (P17). La plateforme sert surtout des projets de moins de 300 $ de MRR. Une cible de 1 000 € de MRR y est rare [E].
- **Flippa** : 2,47x le bénéfice en moyenne au H1 2026, et churn moyen des SaaS vendus **5,43 %/mois** (P18). Les enchères attirent les chasseurs de bonnes affaires (P19).
- **Acquire.com** :
  - abonnement acheteur ≈ 390 $/an pour les cibles ≤ 250 k$ de CA (P20, agrégateurs, divergents) ;
  - 6 à 8 % de commission payés par le vendeur (P21) ;
  - visibilité faible sous 500 k$ d'ARR, clôture en 60 à 120 jours (P22, opinion) ;
  - médiane de 3,9x le bénéfice (P7C-P01).
- **France** :
  - Dotmarket : 18 à 30x le bénéfice **mensuel**, soit 1,5 à 2,5x l'annuel. Commissions de 4 à 10 % côté acheteur, selon les sources (P23, P25). Un vendeur à moins de 2 000 € de profit mensuel aurait été refusé (P24) : **la tranche 500 à 2 000 € est donc sous le seuil de la principale plateforme française**.
  - Dealing-Room revendique plus de 1 000 deals depuis 2008 (P25).
  - Annonces UIMM sans chiffres (P7C-P48).
- **SideProjectors** : ni séquestre ni vérification (P26).
- **Fiabilité des métriques** : une capture Stripe se falsifie dans le navigateur, et le volume brut n'est pas un MRR (P27). Il faut exiger un accès en lecture au compte Stripe et rapprocher les encaissements du relevé bancaire.

**Prix et budget minimal réaliste (pour 1 000 € de MRR B2B)**

| Poste | Montant | Base |
|---|---|---|
| Prix : SDE ≈ 10,8 k€/an (marge ≈ 90 %) × 2,5 à 3 | **27 à 32 k€** | P7-cession §2, P18 [E] |
| Commission acheteur (0 % Microns, 4 à 10 % Dotmarket) + abonnement Acquire | 0 à 3,2 k€ | P20, P23 |
| Séquestre (≈ 1 à 3 %) | 0,3 à 1 k€ | P7C-P36 |
| Revue juridique et comptable du contrat d'achat d'actifs | 1,5 à 3 k€ | [H] |
| Droits d'enregistrement si la cession est qualifiée de fonds de commerce : 3 % au-delà de 23 000 € | 0,1 à 0,3 k€ | P35 [E sur la qualification] |
| TVA autoliquidée **non déductible** en franchise, si le vendeur est étranger et que l'art. 257 bis ne s'applique pas | **jusqu'à +6 k€** | P37, P7F-P25 [H sur l'application à des actifs incorporels] |
| Réserve d'exploitation et d'acquisition, 6 mois | 2 à 4 k€ | [E] |
| **Total** | **≈ 33 à 45 k€** | |

- **Pour 3 000 € de MRR** : ≈ 80 à 110 k€ de prix (P7-cession §10), plus les frais. Il faut alors un emprunt.
- **Financement** :
  - prêt d'honneur Initiative Île-de-France reprise jusqu'à 70 000 €, **à condition d'un crédit bancaire au moins égal** (P32) ;
  - ailleurs, de 1 500 à 30 000 € (P33) ;
  - prêt Bpifrance réservé aux porteurs accompagnés (P34).

  L'éligibilité d'un actif purement numérique sans salarié n'est pas vérifiée [H]. Aucune source ne documente un prêt bancaire français pour racheter un site ou un SaaS. Le fonds de commerce n'est en principe pas amortissable (P36).
- **Compatibilité avec la micro-entreprise** :
  - rachat d'actifs possible (code, domaine, marque, clientèle) [E] ;
  - **le prix n'est pas déductible** : l'abattement forfaitaire est réputé tout couvrir (P7F-P36), et les cotisations restent dues sur le CA brut ;
  - migration Stripe : les clients et les cartes se copient entre comptes, mais **les abonnements doivent être recréés** et les anciens annulés (P28). C'est le moment de churn le plus risqué ;
  - un achat ≥ 30 k€ financé à crédit pousse vers une société au régime réel, ce qui sort du cadre « micro ».
- **Risques** :
  1. **Actif qui fond** : (1 − 0,0543)¹² ≈ 0,51, soit la moitié du MRR perdue en un an sans acquisition (P18) [E].
  2. **Déclin caché et fraude aux métriques** (P27, P29).
  3. **Dépendance au vendeur** : prévoir au moins 30 jours d'accompagnement (P29).
  4. **Clôture lente** : 60 à 120 jours (P22, P7C-P01). Le contre-exemple de réussite (P30) s'appuie sur l'audience du créateur : biais du survivant.
- **Rentabilité** : à 1 000 € de MRR, le net fondateur est d'environ 650 €/mois (simulation, lignes à 1 000 €). Pour 33 à 45 k€ investis, le retour prend **≈ 4 à 6 ans à MRR constant** [E]. À la revente, on récupère au mieux le multiple payé : **l'achat ne crée de valeur que si le porteur fait croître le MRR**, ce qui revient à savoir acquérir des clients.
- **Probabilité de ≥ 3 paiements en 30 jours** : le critère n'a pas de sens, puisque l'actif acheté a déjà des clients. Les bonnes mesures sont :
  - P(clôturer un achat sain en 30 jours) ≈ **10 %** [H] ;
  - P(détenir ≥ 1 000 € de MRR vérifié à J+120) ≈ **50 %**, si le budget existe [H].

### 2.6 (f) Arrêter la recherche documentaire et partir des contacts du porteur

- **Pour** :
  - le réseau remplace la confiance que le porteur ne peut pas acheter ;
  - c'est le seul canal où sa capacité de vente, la variable la plus incertaine (brief), est mesurée au coût le plus bas ;
  - la red team n° 2 recommandait déjà de sortir de la recherche documentaire (redteam2.md, « Question centrale »). Phase 7 a ajouté environ 170 recherches sans un seul paiement.
- **Contre** :
  1. le réseau du porteur est **inconnu** de tous les analystes ;
  2. un réseau donne les 3 à 10 premiers clients, pas les 50 suivants. Un actif vendu par le réseau du fondateur se revend mal (P7-cession §6) ;
  3. le risque de dériver vers un service non transférable.
- **Parade** : le GO exige un paiement hors du premier cercle, et un canal transférable identifié pour les clients 11 à 50 (§4).
- **Probabilité : ≈ 30 %** [H] avec au moins 15 décideurs B2B joignables personnellement dans un même segment ; **≈ 5 %** sinon (on retombe alors dans les cas à froid).

---

## 3. Tableau comparatif

Heures/semaine à 3 000 € de MRR : heures de la simulation (`P7-simulations-financieres.md`), **plus** les heures d'acquisition = clients perdus par mois × CAC / 35 €, divisé par 4,33.

| Option | P(≥ 3 paiements en 30 j) [H] | Coût du test | Valeur de revente si 3 k€ de MRR atteints (centrale de la simulation → lecture red team) | Heures/mois : simulation + acquisition = total → **h/semaine** | Principal risque mortel |
|---|---|---|---|---|---|
| (a) N06 Mirakl secondaires + cabinets | 10 % (25 % avec un réseau d'experts-comptables e-commerce) | 60-120 € + 40-50 h | 67 k€ → **40-55 k€** : acheteurs limités aux concurrents français, dépendance au savoir comptable [E] | 47 + 13,1 = 60,1 → **13,9** | Crédibilité comptable du porteur + Order Invoicer/Synchron.io qui ajoutent un opérateur en quelques jours |
| (b) N04 service CIR à 490 € | 10 % (25 % avec ≥ 10 startups CIR dans le réseau) | ≤ 150 € + 45 h | 73 k€ → **≤ 40 k€** : traction improbable ; transfert d'app facile (+) [E] | 29 + 12,4 = 41,4 → **9,6** (pic mars-mai) | Pas de demande pour une app (≈ 100 installations cumulées) ; le service ne le prouve pas |
| (c) E-13-AG agences à 59 € | 5 % (25 % avec ≥ 20 agences dans le réseau) | ≈ 0-50 € + 20-30 h | 63 k€ → **30-45 k€** : churn probablement > 4 % [E] | 23 + 20,4 = 43,4 → **10,0** ; avec un CAC de 700 € : 63,8 → **14,7** | Fonction incluse dans des outils déjà payés (Yousign, Axonaut, Sellsy, PandaDoc, Qwilr) |
| (d) C-39 FCC | 5 % (2 % pour le GO du DD) | 250-300 € + 25-30 h | 59 k€ → **30-45 k€** : acheteurs US stratégiques peu nombreux [E] | 38 + 13,3 = 51,3 → **11,8** en moyenne, bien plus en février-avril | Clone de RMD Keeper au même prix + E&O et UPL pour un assuré étranger |
| (e) Achat 1 k€ de MRR | Sans objet. Clôture en 30 j ≈ 10 % ; 1 k€ de MRR vérifié à J+120 ≈ 50 % si budget | **33-45 k€** (1 k€ de MRR) ; 80-110 k€ et plus (3 k€) | ≈ le prix payé si le MRR est maintenu ; aucune plus-value sans croissance | Illustratif [H] : 60 clients à 50 €, churn de 5,43 %, CAC de 300 €, 20 h d'exploitation → 20 + 27,9 = 47,9 → **11,1** | Actif qui fond (−49 % de MRR par an sans acquisition) ; fraude ou déclin caché ; capital perdu |
| (f) Réseau d'abord | **≈ 30 %** avec ≥ 15 décideurs dans un segment ; 5 % sinon | 0-100 € + 30-40 h | Inconnue tant que le produit n'est pas choisi ; plafonnée par les critères du §4 | Imposé par la règle : ≤ 10 h/semaine à 3 k€, sinon pas de code | Réseau insuffisant, ou glissement vers un service non transférable |
| *Référence : E-13 actuel* | — | — | **0 €** (simulation) | 39 + 150 = 189 → **43,6** | Remplacement du churn impossible |

**Lecture.**
- Hors E-13 actuel, l'écart d'heures entre options (9,6 à 13,9 h/semaine) pèse peu face à l'écart de probabilité d'obtenir les premiers paiements.
- Pour l'objectif « quelques heures », aucune option ne passe sous 9 h/semaine en régime de croisière avec les hypothèses actuelles. **3 000 € de MRR pour environ 10 h/semaine** est la promesse honnête.

---

## 4. Recommandation unique

### Recommandation : option (f). Sprint de vente de 30 jours depuis le réseau du porteur, sans code, avec des offres déjà rédigées

**Pourquoi celle-ci.**
1. Les quatre options à construire sont indiscernables sur la grille (48,5 à environ 46 après décote). Leur risque mortel commun est le même : **le porteur n'a jamais encaissé un client**.
2. (f) est l'option qui a la plus forte probabilité d'obtenir 3 paiements, au coût le plus bas.
3. (f) produit l'information qui manque pour choisir entre (a), (b), (c), (d) et (e). Une quatrième étude documentaire ne la produirait pas.

**Règle de décision, appliquée mécaniquement.**

*J0 (2 h, avant tout envoi)* : le porteur écrit deux choses.
- (i) La liste de ses contacts **décideurs B2B qui le connaissent personnellement**, chacun classé dans un segment : agences/prestataires ; vendeurs e-commerce ou experts-comptables ; startups tech CIR ; télécom US ; autre.
- (ii) Le **budget qu'il peut perdre en totalité** sans mettre son foyer en difficulté.

| Condition à J0 | Action |
|---|---|
| Budget perdable ≥ 40 k€ **et** aucun segment ≥ 15 contacts | **La recommandation bascule vers (e) Achat**, avec le protocole ci-dessous |
| Un segment ≥ 15 contacts | Sprint (f) sur ce segment, avec l'offre payante correspondante : agences → relance de propositions faite pour vous, 3 mois prépayés à 59 €/mois (sans nouveau code) ; e-commerce/comptables → service N06 à 149 € par dossier ; startups CIR → tableau des temps CIR depuis Jira à 490 € ; télécom US → contrôle RMD + CPNI à 149 $ |
| Plusieurs segments ≥ 15 | Le segment le plus fourni ; en cas d'égalité, celui qui demande le moins d'heures à 3 k€ (N04 9,6 < E-13-AG 10,0 < C-39 11,8 < N06 13,9) |
| Aucun segment ≥ 15 et budget < 40 k€ | Sprint (f) en mode découverte : 15 contacts, toutes catégories, sur une seule question : « quelle tâche récurrente payez-vous déjà, ou faites-vous à la main chaque mois ? ». Puis vente d'un service manuel à ≥ 149 € sur le problème le plus cité, avec ARPA visé ≥ 59 €/mois |

*J30, seuils durs* (un « oui » oral ne compte jamais) :
- **GO, tous requis** :
  - **≥ 3 paiements** d'au moins 149 € (ou 3 mois prépayés à ≥ 59 €), de tiers distincts, hors famille ;
  - **dont ≥ 1 payeur hors du premier cercle** : recommandation de second degré ou contact froid ;
  - **un canal transférable nommé** pour les clients 11 à 50 : marketplace, liste publique ou mot-clé SEO avec volume vérifié ;
  - **une projection ≤ 10 h/semaine** à 3 k€ de MRR, avec la formule du §3.

  Alors seulement : MVP limité à ce qui a été payé, 6 semaines au maximum.
- **1 à 2 paiements** : un seul cycle supplémentaire de 30 jours, sur le même segment, **à froid uniquement**. Si le total reste < 3, c'est STOP.
- **0 paiement** : arrêt de toute construction de SaaS à partir de zéro, et **aucune reprise de recherche documentaire**. Si le budget perdable est ≥ 40 k€, passer à (e). Sinon, abandonner l'objectif pour l'instant.

**Protocole minimal si (e) devient la voie** :
- cible B2B à ≥ 1 000 € de MRR, churn ≤ 3 % sur 12 mois, et au moins 50 % des nouveaux clients issus d'un canal organique documenté ;
- accès en lecture à Stripe et relevés bancaires, plutôt que des captures ;
- au moins 30 jours d'accompagnement du vendeur et séquestre ;
- revue juridique et fiscale avant signature : TVA, droits d'enregistrement, régime de l'acheteur ;
- prix ≤ 3x le SDE.

### Seuil de budget pour l'achat
- **< 15 k€** : non. On n'achète que des projets de taille Microns (moyenne de 4,6 k$), sans MRR significatif.
- **15 à 40 k€** : non recommandé. Le budget permet au mieux 300 à 700 € de MRR, sous le seuil des plateformes françaises (P24), avec un actif qui fond.
- **≥ 40 k€ perdables, sans emprunt** : l'achat d'un actif à environ 1 000 € de MRR devient une option rationnelle.
- **≥ 100 k€**, ou un emprunt adossé à un prêt d'honneur et à une banque : achat direct d'environ 3 000 € de MRR. Cela sort probablement du cadre micro-entreprise.

### Ce qui ferait changer la recommandation
1. **Budget ≥ 40 k€ perdables et réseau < 15 contacts dans un segment** → (e).
2. **Le porteur refuse toute prise de contact personnelle** (appels, messages directs) → aucune option à construire n'est viable : (e) si le budget le permet, sinon arrêt.
3. **Un test public déjà disponible change la donne**, par exemple une liste d'attente payante existante, ou ≥ 3 paiements déjà obtenus sur l'une des offres → GO direct sur cette offre.
4. **Un fait nouveau qui invalide une offre avant J0** (Order Invoicer annonce Leroy Merlin et Boulanger, RMD Keeper ajoute le 499, HubSpot ouvre les rappels à Starter) → retirer l'offre de la table. Pas de nouvelle recherche pour autant.

### Plan sur 30 jours (≈ 30 à 40 h, ≤ 100 €)
- **J0-J2** : inventaire du réseau et du budget, application de la règle, rédaction de l'offre (une page et un lien de paiement Stripe).
- **J3-J10** : 15 messages personnels par jour au maximum, puis 15 conversations au moins. Questions sur le comportement passé : la dernière fois, combien de temps, combien payé, quel outil essayé. **Demande de paiement à la fin de chaque conversation qualifiée.**
- **J11-J20** : livraison manuelle aux payeurs. Demande d'**une introduction** à un pair. 30 contacts froids sur le canal transférable visé, pour mesurer le taux de réponse.
- **J21-J30** : livraison, mesure (paiements, heures passées, taux de réponse à froid), décision selon les seuils. **Aucune ligne de code produit avant la décision.**

---

## 5. Désaccords avec les analystes

1. **Rescreen** : E-13-AG (51,5) est présentée au même niveau que des pistes approfondies. Ce n'est pas comparable : la décote moyenne des DD est de −8,7 (§1).
2. **Rescreen** : « HubSpot a lancé les rappels de devis natifs en juin 2026 » est trop général. Selon les sources trouvées, la fonction serait réservée à Professional et Enterprise, et la documentation officielle décrit encore un workflow (P03, P04). Cela ne sauve pas E-13-AG : Yousign, Axonaut, Sellsy, PandaDoc et Qwilr suffisent à l'invalider.
3. **Simulation** : elle compte le remplacement du churn en euros, mais **pas en heures**. Les heures affichées (23 à 47 h/mois) sous-estiment la charge de 12 à 20 h/mois. Avec elles, aucune option n'atteint « quelques heures par semaine » (§3).
4. **P7-DD-N06** : le seuil GO « ≥ 1 cabinet parmi 3 paiements en 30 jours » est incompatible avec son propre cycle de signature des cabinets (1 à 3 mois). Le test est conçu pour échouer, ou pour être assoupli après coup.
5. **P7-DD-N04** : le test « rattrapage CIR à 490 € » mesure la volonté de payer un **service de reconstitution**, que la pratique déconseille (P38). Il ne mesure pas la volonté de payer une app. Un GO sur ce test ne justifierait pas de coder l'app.
6. **P7-DD-C39** : le seuil GO (≥ 5 paiements ≥ 500 $ à froid aux États-Unis en 30 jours, plus un devis E&O) est irréaliste pour ce porteur. En pratique, c'est un STOP différé.
7. **P7-cession et simulation** : les valorisations centrales (59 à 73 k€) supposent un multiple de marché standard. Or les dossiers montrent des acheteurs restreints (concurrents français, acheteurs stratégiques US), et la principale plateforme française refuserait les actifs sous 2 000 € de profit mensuel (P24). Il faut lire ces valorisations comme des plafonds, pas comme des centres.
8. **Rescreen §3.3** (« la pile Relanzio est réutilisable pour N06 et N04 ») et DD C-39 (« pile Relanzio ») : le DD N04 note lui-même qu'elle est presque inutile pour une app Forge. L'argument de réutilisation entretient le biais d'engagement. Il ne doit peser dans aucun choix.
9. **Ensemble du programme** : l'option d'achat, pourtant la plus directe vers « un actif revendable », n'a jamais été étudiée en sept phases. Inversement, elle n'est pas la solution miracle : elle déplace le problème de « trouver les premiers clients » vers « remplacer le churn hérité », qui demande la même compétence.
10. **Red team n° 2 non suivie** : elle recommandait déjà de sortir de la recherche documentaire. La phase 7 a produit trois DD et un rescreen de plus, sans test terrain. Je maintiens la même conclusion, avec une règle plus dure : **pas de recherche documentaire supplémentaire avant le verdict du J30.**

---

## 6. Limites

- Extraits de recherche uniquement. WebFetch est bloqué (`microns.io`) : il faut autoriser ce domaine, ainsi que `flippa.com` et `acquire.com`, dans les réglages réseau de la session pour lire les annonces.
- Les frais d'Acquire.com et de Dotmarket divergent selon les sources (P20, P21, P23, P25).
- L'application de la TVA (autoliquidation, art. 257 bis) et des droits d'enregistrement à l'achat d'un SaaS par un micro-entrepreneur **n'est pas vérifiée**. Elle est à faire valider par un expert-comptable avant toute offre.
- L'éligibilité d'un rachat d'actif numérique aux prêts d'honneur n'est pas vérifiée.
- Toutes les probabilités sont subjectives. Elles servent à **ordonner** les options, pas à prévoir un résultat.
