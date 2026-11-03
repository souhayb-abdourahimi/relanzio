# P7 — Réévaluation des recherches existantes avec la grille v3 (micro-SaaS rentable et revendable)

Date : 2026-10-29. Phase 7. Brief : `_work/brief-phase7.md`.
Fichiers liés :
- notes détaillées : `_work/P7-rescreen-scores.csv` (27 pistes notées) ;
- preuves nouvelles : `_work/P7-rescreen-preuves.csv` (P7R-P01 à P7R-P48 : 11 POUR, 26 CONTRE, 11 NEUTRE).

---

## Décision en une page

- **Aucune piste n'atteint 65/100 sur la grille v3.** La meilleure obtient 62. Elle repose encore sur des hypothèses ([H]) au critère le plus lourd, l'acquisition.
- **3 finalistes à approfondir** :
  1. **P7-N06**, rapprochement des reversements des marketplaces françaises de type Mirakl (Cdiscount, ManoMano, Fnac Darty, Leroy Merlin) vers Pennylane ou un FEC : **62,0** ;
  2. **C-39**, calendrier et dépôts FCC pour petits opérateurs VoIP américains : **57,5** ;
  3. **P7-N04**, application Jira de justification du temps R&D (CIR/CII, puis SR&ED) : **54,5**.
- **4e et 5e non retenus** : E-39 (reconductions tacites, 54,0) et B-04 (pay apps AIA, 54,0). Motifs au §6.
- **E-13 / Relanzio : 41/100 dans sa forme actuelle. Gel confirmé.**
  - Son faible coût de test ne le rend pas attractif à la revente. À 24 € et 6 % de churn, tenir 3 000 € de MRR (125 clients) suppose de remplacer environ 7,5 clients par mois. Avec 20 à 30 h de vente directe par client, cela représente **150 à 225 h d'acquisition par mois**, incompatible avec « quelques heures par semaine ».
  - Le meilleur repositionnement, vers les agences et prestataires B2B à 59 €, monte à **51,5**. La fonction y est déjà incluse chez Yousign, chez HubSpot depuis juin 2026, chez Sellsy et chez Axonaut.
  - La voie des marketplaces d'éditeurs tombe à **43** : Pennylane relance déjà, et aucune API publique n'a été trouvée chez Tolteck ni chez Obat.
- **Ce qui change par rapport aux phases 1 à 6** : les pistes à petit plafond ne sont plus éliminées pour cette raison. Elles ont été pénalisées pour d'autres motifs :
  - gratuité d'un substitut (D-37, D-20, E-24, E-21) ;
  - migration lourde ou vente terrain (propreté N1-V09, incendie B-13) ;
  - service humain (C-20, recouvrement N3-01) ;
  - réglementation instable (C-01, B-09).

---

## 1. Méthode et limites

- **Recherches** : 30 WebSearch et 1 WebFetch. Le WebFetch a échoué : `www.pennylane.com` ne se résout pas (ENOTFOUND), et aucune autre page n'a été ouverte. **Toutes les preuves sont des extraits de recherche** reformulés par le moteur.
- **Invalidation** : environ 22 recherches sur 30 (≈ 73 %) cherchaient à invalider (offres gratuites, fonctions natives, concurrents en place, prix bas).
- **Exploitation de l'existant** : la longlist (206 pistes) a été filtrée par script (`python3 -I`), avec relecture de :
  - `03-classement-top20.csv`, `03b-classement-v2-potentiel.csv`, `12-audit-critique.md` ;
  - `DD-E13.md` (en entier) et les verdicts des autres DD ;
  - `N1.md` §2.7 et §3, `alternatives-negligees.md` ;
  - `redteam.md` (E-13, O3 à O5).
- **Étiquettes** : chaque note /10 porte [P] (preuve sourcée, ici ou dans un fichier antérieur), [E] (estimation raisonnée) ou [H] (hypothèse non vérifiée).
- **Règle des phases antérieures appliquée** : une lacune fondée sur « aucun X trouvé » est plafonnée à 5/10 en Différenciation (P7-N06 : 4 ; C-39 : 5).
- **Ce qui n'est pas une preuve** :
  - aucun chiffre marketing n'est utilisé comme preuve de volonté de payer (le chiffre Lido de 25 à 40 h est étiqueté « marketing », P7R-P20) ;
  - aucun acheteur n'a été simulé.
- **Pistes existantes non recherchées à nouveau** : C-39, C-01, E-21, A-39, E-01, B-11, A-19, A-31 et N1-V09 sont notées à partir de leurs preuves antérieures (DD, alternatives, red team 2) et des données de la longlist.

### Pénalités appliquées (consignes du brief)
| Motif | Effet sur la grille | Pistes touchées |
|---|---|---|
| Vente terrain, migration lourde, service humain | Acquisition ≤ 3 et/ou Solo ≤ 3 | N1-V09, B-13, A-31, C-20, N3-01 (recouvrement), E-13-OEM |
| Réglementation temporaire ou instable | Risques ≤ 3 | C-01, B-09 (reconsidération EPA), N1-V13 (SEFi 2027) |
| Outil gratuit, public ou natif qui couvre le besoin | Problème ≤ 4 et Différenciation ≤ 2 | D-37, D-20, E-24, E-21, E-01, P7-N01, P7-N02, E-31 |
| Prix < 49 €/mois | Rentabilité ≤ 3 | E-13, B-11, P7-N05, E-21, E-13-MKT |

Pistes éliminées sans renotation détaillée, parce que leur motif d'exclusion v3 est direct :
- A-23 (Beacon gratuit, HIPAA) ;
- B-09 (révision EPA) ;
- D-15 (outils MTD gratuits) ;
- N3-01 et N3-16 (services humains) ;
- N2-01 (concurrents financés, API lourde) ;
- A-01 (US, HIPAA, marché bruyant).

---

## 2. Étape 1 : ce que la grille v3 change dans l'existant

1. **Le « petit potentiel » n'élimine plus**, mais il ne sauve pas non plus.
   - Les pistes autrefois classées « < 1 M€ » (E-13, D-37, B-11, E-21) restent basses, pour d'autres raisons : prix faible, substituts gratuits, acquisition coûteuse.
   - Le plafond de 30 à 300 k€ d'ARR est atteignable par plusieurs pistes. Ce qui les sépare désormais, c'est **le nombre de clients nécessaires et leur coût d'acquisition**.
2. **Les pistes à ticket élevé et à base d'acheteurs listable remontent** : C-39 (base publique RMD), B-04 (79 à 99 $), A-31 (150 à 250 $). Les deux dernières perdent ensuite des points sur l'exploitation solo (formats GC, validation Part 11).
3. **Les systèmes d'enregistrement verticaux (N1) baissent**. La propreté passe de 60,5 (v2) à 50,5 (v3), parce que migration et vente terrain contredisent l'objectif solo et revendable.
4. **Les « services-as-software » (N3) sont éliminés** : ils exigent du service humain.

---

## 3. Réexamen de E-13 / Relanzio

### 3.1 Coût de test ≠ attractivité à la revente
| Dimension | E-13 actuel | Lecture |
|---|---|---|
| Coût marginal de test | Très faible : produit construit (Node/Supabase/Stripe/Brevo) [P dépôt] ; test concierge < 100 € (DD-E13 §11) | C'est le seul vrai atout. **Il n'entre dans aucun critère de la grille v3**, sauf « Solo » (7/10) |
| Prix | 24 € HT (DD-E13 §7) ; ancrage Abby Pro 19 € (P7R-P13), Tolteck 19-25 € | Il faut **125 clients** pour 3 000 € de MRR |
| Churn | 4 à 8 %/mois [H] (DD-E13 §8) | À 6 %, **7,5 clients à remplacer chaque mois** |
| Acquisition | 20 à 30 h de fondateur par client en vente directe [E] | **150 à 225 h/mois** juste pour rester à 3 000 € de MRR. Incompatible avec l'objectif |
| Revente | Les sources de plateformes de cession situent un micro-SaaS < 5 k$ de MRR à 1,5-2,5 × l'ARR, avec de fortes décotes au-delà de 3 % de churn (P7R-P47, P7R-P48, sources commerciales, confiance faible) | Un actif à 36 k€ d'ARR, 6 % de churn et acquisition par le fondateur serait vendu bas, s'il trouve preneur [E] |
| Substituts | Abby Pro 19 € relance les devis non signés (P7R-P13) ; freelances ComeUp (P7R-P14) ; GMass et Mailmeteor dans Gmail (P7R-P17, P18) ; Axonaut et Sellsy (DD-E13) | Fonction banalisée |

**Note v3 : 41/100** (détail dans le CSV).

### 3.2 Repositionnements étudiés (sans tout reconstruire)
| Variante | Note v3 | Preuve décisive | Verdict |
|---|---|---|---|
| **E-13-AG** : agences et prestataires B2B, 59 €/mois, plusieurs expéditeurs, relance des propositions | **51,5** | Il existe une dépense dans les outils de proposition : Qwilr 35-39 $/utilisateur (P7R-P07), Proposify 19-41 $ (P7R-P08). **Mais** Yousign relance automatiquement les non-signataires (P7R-P09), HubSpot a lancé les rappels de devis natifs en juin 2026 (P7R-P10, P11), et Sellsy et Axonaut l'ont déjà | Meilleure variante. Prix ×2,5 : 51 clients au lieu de 125. Mais l'acquisition reste directe (30 à 75 h/mois) et la fonction est déjà incluse dans des outils que les agences paient. **Test borné uniquement si le porteur a un accès direct à des agences** |
| **E-13-MKT** : distribution via Pennylane, Qonto, Obat, Tolteck | **43,0** | La marketplace Pennylane existe : 300+ éditeurs, approbation (P7R-P01, P02). Mais Pennylane relance déjà (DD-E13-P04, P7R-P19). Aucune API publique trouvée chez Tolteck (P7R-P05) ni chez Obat (recherche sans résultat, sans URL citable). Les partenaires Qonto sont sélectionnés (P7R-P06) | Éliminée : les éditeurs qui ont une marketplace ont déjà la fonction ; ceux qui ne l'ont pas n'ont pas d'API ouverte trouvée |
| **P7-N02** : application HubSpot de relance des devis (comptes Starter) | **38,5** | Rappels de devis natifs chez HubSpot (juin 2026) | Éliminée |
| **P7-N03** : moteur de relance appliqué aux pièces justificatives manquantes des cabinets comptables | **53,0** | Pennylane propose des « relances en un clic » des justificatifs (P7R-P19). Tiime, Dext et Conciliator collectent déjà (P7R-P20) | Réserve. Seulement pour les cabinets hors Pennylane, avec une intégration Cegid/ACD **non vérifiée** ; 2 recherches seulement |
| **E-13-OEM** : licence en marque blanche à un éditeur BTP | **36,5** | — | Éliminée : négociation de partenariat (vente) et concentration sur 1 à 3 clients |

### 3.3 Verdict E-13
- **Gel maintenu, sans nouveau code.** Le faible coût de test ne justifie pas de tester une piste qui, même réussie, donne un actif peu revendable (§3.1). C'était déjà la conclusion de la red team (O5) ; la grille v3 la renforce, parce qu'elle pèse l'acquisition (20) et la revente (15).
- **Valeur résiduelle** : la pile technique (auth, Stripe, Brevo, planificateur, tableau de bord) est réutilisable pour un finaliste. Cela vaut surtout pour P7-N06 et P7-N04, qui demandent un back-office SaaS du même type [E].
- **Seule exception** : un test E-13-AG de 2 à 3 semaines si, et seulement si, le porteur peut joindre 20 agences par son réseau. Critère d'arrêt : moins de 3 cartes enregistrées à 59 €.

---

## 4. Étape 2 : nouvelles pistes (6, dont 2 repositionnements de Relanzio)

Angle visé : prix ≥ 49 €/mois et acquisition par une marketplace, le SEO ou une intégration.

| id | Piste | Recherches (dont invalidation) | Preuves de dépense observées | Preuve contraire décisive | Note | Statut |
|---|---|---|---|---|---|---|
| **P7-N06** | Rapprochement des reversements des marketplaces françaises de type Mirakl vers Pennylane, FEC ou Excel | 3 (2) | A2X : 29 à 1 039 $/canal/mois (P7R-P29) ; 4,9/5 sur G2 (300+ avis) ; app Xero de l'année 2024-2025 (P7R-P30). Link My Books dès ~21 $ (P7R-P31) | **Sellsy a une application Mirakl** de rapprochement et de FEC (P7R-P33). A2X ne couvre que Amazon, Shopify, eBay, Etsy et Walmart (P7R-P32 ; absence de marketplaces FR = pas une preuve d'absence). Aucun connecteur Pennylane ↔ Cdiscount/ManoMano trouvé (P7R-P34) | **62,0** | Finaliste 1 |
| **P7-N04** | Application Jira de justification du temps R&D (CIR/CII, puis SR&ED) | 4 (3) | La catégorie existe : SABI SR&ED, « paid via vendor », v1 2023 (P7R-P21) | **Sredio gratuit, 62 installations** (P7R-P22) : demande observée faible. Export de worklogs générique (P7R-P23). Clockify gratuit (P7R-P24). Les cabinets CIR offrent leur propre plateforme (extrait Ayming, sans URL citable) | **54,5** | Finaliste 3 |
| P7-N03 | Relance des justificatifs pour cabinets comptables (moteur Relanzio) | 2 (2) | Aucune dépense chiffrée observée | Pennylane : relances en un clic (P7R-P19) ; Tiime, Dext, Conciliator (P7R-P20) | 53,0 | Réserve (recherche incomplète) |
| P7-N05 | Application Shopify de factures conformes / Factur-X pour marchands FR | 2 (1) | Sufio : 4,9/5, 416 avis, dès 7 $ (P7R-P25) ; Facturation PDF 33 $, 0 avis (P7R-P26) | Prix d'ancrage bas ; Pennylane connecte Shopify (P7R-P27) | 52,0 | Pénalisée : prix < 49 € |
| P7-N01 | Connecteur HubSpot ↔ facturation française | 3 (2) | — | **Intégration native Pennylane-HubSpot** (P7R-P03) ; Zapier (P7R-P04) | 46,5 | Éliminée |
| P7-N02 | Relance des devis HubSpot (Starter) | 3 (3) | — | **Rappels de devis natifs HubSpot, juin 2026** (P7R-P10, P11) | 38,5 | Éliminée |

Idées écartées avant recherche, faute de temps ou parce qu'elles sont redondantes avec l'existant :
- relances d'impayés Xero/QuickBooks (Chaser, D-20) ;
- signatures e-mail Google Workspace ;
- applications B2B wholesale Shopify ;
- Peppol belge (outil public gratuit, D-11).

Pistes US re-vérifiées par une recherche :
- **B-13**, incendie : Inspect Point gratuit puis 24 $/siège (P7R-P40), ServiceTrade 99-149 $ (P7R-P39) ;
- **B-04**, pay apps AIA : PayAppPro 79 $/mois (P7R-P36), Knowify partenaire Intuit Gold et AIA (P7R-P37), PayAppCheck gratuit (P7R-P38) ;
- **E-39**, contrats : RemindR 25-150 €/utilisateur (P7R-P41), MyContrat (P7R-P42) ;
- **E-24**, cookies : iubenda gratuit jusqu'à 25 000 pages vues (P7R-P43) ;
- **E-31**, honoraires MOP : OOTI couvre les phases dès 14 €/utilisateur (P7R-P45, P46).

---

## 5. Étape 3 : TOP 15 sur la grille v3

Notes /10 avec leur étiquette. Total = Σ note × poids / 10. Les rangs 14 à 16 sont ex aequo à 50,5 ; les 27 pistes sont dans le CSV.

| Rang | id | Piste | Problème 15 | Acquisition 20 | Solo 15 | Rentabilité 15 | Rétention 10 | Revente 15 | Différenciation 5 | Risques 5 | **Total** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | P7-N06 | Rapprochement des reversements des marketplaces françaises (Mirakl : Cdiscount, ManoMano, Fnac Darty, Leroy Merlin...) vers Pennylane / FEC pour vendeurs et leurs comptables | 6[E] | 6[H] | 5[H] | 7[E] | 8[E] | 7[E] | 4[P] | 5[E] | **62** |
| 2 | C-39 | Calendrier et dépôts FCC (RMD, CPNI, 499-A) pour petits opérateurs VoIP US | 6[P] | 6[E] | 5[E] | 6[H] | 7[E] | 6[E] | 5[E] | 3[E] | **57.5** |
| 3 | P7-N04 | Application Jira (Atlassian Marketplace) pour justifier le temps R&D : CIR/CII (FR) puis SR&ED (CA) | 4[P] | 6[P] | 6[E] | 6[H] | 6[E] | 6[E] | 3[P] | 4[E] | **54.5** |
| 4 | E-39 | Suivi des reconductions tacites et préavis des contrats fournisseurs (PME) | 4[E] | 4[E] | 8[E] | 5[P] | 7[E] | 6[E] | 2[P] | 7[E] | **54** |
| 5 | B-04 | Pay applications AIA G702/G703 + lien waivers pour sous-traitants US (QuickBooks) | 7[P] | 4[E] | 4[P] | 7[P] | 7[E] | 6[E] | 2[P] | 4[E] | **54** |
| 6 | C-01 | CBAM multi-clients pour représentants en douane et PME importatrices | 6[P] | 5[E] | 4[E] | 7[P] | 6[E] | 6[E] | 2[P] | 3[E] | **53** |
| 7 | P7-N03 | Relance automatisée des pièces justificatives manquantes pour cabinets comptables hors Pennylane (Relanzio repositionné) | 6[E] | 4[E] | 6[E] | 6[E] | 7[E] | 5[E] | 2[P] | 5[E] | **53** |
| 8 | P7-N05 | Application Shopify de factures conformes / Factur-X pour marchands français | 5[E] | 7[P] | 6[E] | 2[P] | 7[E] | 6[E] | 2[P] | 3[E] | **52** |
| 9 | E-13-AG | Relanzio repositionné : relance des propositions pour agences et prestataires B2B (49-79 €) | 5[E] | 4[E] | 7[E] | 6[E] | 5[H] | 5[E] | 2[P] | 6[E] | **51.5** |
| 10 | E-21 | Contrats d'influence conformes (seuil 1 000 €) pour agences et marques FR | 3[P] | 6[E] | 9[E] | 3[P] | 5[E] | 5[E] | 3[P] | 6[E] | **51.5** |
| 11 | A-31 | eISF / eRegulatory léger pour sites d'investigation indépendants | 6[P] | 3[E] | 3[E] | 8[P] | 8[E] | 6[E] | 3[P] | 3[E] | **51.5** |
| 12 | E-01 | Questionnaires de sécurité pour éditeurs SaaS 5-50 pers. sans SOC 2 | 4[P] | 5[E] | 5[E] | 7[E] | 5[E] | 6[E] | 2[P] | 4[E] | **51** |
| 13 | A-39 | Devoir de conseil DDA pour petits courtiers FR | 5[P] | 5[E] | 6[E] | 5[E] | 6[E] | 5[E] | 2[P] | 5[E] | **51** |
| 14 | A-19 | Suivi des unités autorisées ABA (US) | 6[E] | 4[E] | 3[E] | 7[P] | 8[E] | 5[E] | 3[E] | 3[E] | **50.5** |
| 15 | B-13 | Rapports d'inspection incendie pour petits contractors US | 6[P] | 4[E] | 3[E] | 6[P] | 8[E] | 6[E] | 1[P] | 5[E] | **50.5** |
| 16 | N1-V09 | Logiciel de gestion pour entreprises de propreté (FR) | 6[E] | 3[E] | 3[E] | 7[E] | 8[E] | 6[E] | 2[P] | 5[E] | **50.5** |

### Prix, clients, canal, heures et risque à la revente

| id | Prix plausible | Clients pour 3 000 € MRR | Canal principal | Heures/mois | Principal risque à la revente |
|---|---|---|---|---|---|
| P7-N06 | 79 €/mois (49-149 € selon volume ; ancre A2X 29-1 039 $/canal) | 38 | Marketplace Pennylane + SEO « comptabilité Cdiscount/ManoMano » + cabinets e-commerce | 15-25 | Dépendance aux formats de relevés des marketplaces et à Pennylane ; A2X/Link My Books/Sellsy peuvent étendre leur couverture |
| C-39 | 149 $/mois ou ~1 500 $/an [H] | ≈21-23 | E-mail ciblé sur la base publique RMD + SEO sur les échéances FCC | 10-20 (pic février-mars) | Responsabilité sur les dépôts ; règles FCC qui bougent ; acheteurs US méfiants envers un éditeur étranger |
| P7-N04 | 59 €/mois par instance [H] (avant commission Atlassian [H]) | 51 (≈60 après commission [H]) | Atlassian Marketplace + SEO « justificatif temps CIR Jira » | 8-15 | Demande faible observée (Sredio gratuit, 62 installations) ; dépendance Atlassian ; cabinets CIR qui offrent leur outil |
| E-39 | 49 €/mois | 62 | SEO « logiciel gestion contrats / reconduction tacite » | 8-12 | Substituts gratuits (agenda, tableur) ; SEO occupé par les CLM ; churn si la PME n'a que 40-80 contrats |
| B-04 | 99 $/mois (PayAppPro 79 $) | ≈33 | SEO « AIA billing software » + annuaire d'apps QuickBooks | 25-40 (formats propres à chaque GC) | Maintenance des formats GC (Siteline revendique >24 000 formulaires) ; licence des formulaires AIA ; Siteline/Knowify financés |
| C-01 | 149 €/mois (marché 60-990 €) | 21 | SEO + annuaires de représentants en douane | 20-30 | Règles mouvantes (simplifications UE) ; seuil 50 t qui exempte ~90 % des importateurs ; marché déjà animé |
| P7-N03 | 99 €/mois par cabinet | 31 | Annuaire de l'Ordre + webinaires + intégrateurs de logiciels de production | 15-25 | Pennylane, Tiime, Dext font déjà la collecte et la relance ; intégrations Cegid/ACD fragiles |
| P7-N05 | 15 €/mois (Sufio dès 7 $, Facturation PDF 33 $) | 200 | Shopify App Store | 10-15 | Prix tiré vers le bas par Sufio (416 avis) ; dépendance à Shopify et aux PA |
| E-13-AG | 59 €/mois | 51 | Prospection directe d'agences + SEO « relance proposition commerciale » | 30-75 d'acquisition + 5-10 d'exploitation | Fonction incluse dans Yousign, HubSpot (juin 2026), Sellsy, Axonaut ; acquisition liée au fondateur |
| E-21 | 29 €/mois (Infloxy 19 $) | 104 | Communautés d'agences + SEO | 10-15 | Modèles d'avocats gratuits ; plateformes d'influence qui ajoutent la fonction |
| A-31 | 150 $/mois (eClinPro 150-250 $) | ≈22 | SEO + réseaux de sites (vente consultative probable) | 25-40 | Validation Part 11 ; achat sur démo ; Study eSafe gratuit |
| E-01 | 99 €/mois | 31 | SEO + communautés SaaS | 20-30 | TrustCloud gratuit, agents IA de Vanta/Drata ; responsabilité sur les réponses |
| A-39 | 49 €/mois | 62 | Registre ORIAS + associations de courtiers | 15-20 | Lya, CourtiGo, Custy ; modèles ANACOFI gratuits ; recommandation non sanctionnable |
| A-19 | ≈300 $/mois par agence [H] (VGPM 50 $/membre du personnel) | ≈11 | SEO + annuaires de prestataires ABA | 30+ | HIPAA/BAA ; marché US de la santé ; logiciels de practice management qui intègrent |
| B-13 | 79 $/utilisateur/mois | ≈15 entreprises (≈42 sièges) | SEO + associations NFPA | 25-40 | Inspect Point gratuit puis 24 $/siège ; ServiceTrade, Uptick ; migration du système d'enregistrement |
| N1-V09 | 199 €/mois [H] | 16 | Vente directe aux entreprises de propreté | 40+ | Senef/Progiclean (Oakley Capital) ; migration lourde ; vente terrain |

---

## 6. Les 3 finalistes à approfondir

### Finaliste 1 — P7-N06 : rapprochement des reversements des marketplaces françaises (62,0)
- **Pourquoi** :
  - c'est le seul candidat où une **dépense réelle et répétée** est prouvée dans une catégorie identique à l'étranger (A2X : 12 paliers jusqu'à 1 039 $/canal, primé par Xero) ;
  - la tarification au volume permet un ARPA ≥ 79 € avec **~38 clients** pour 3 000 € de MRR ;
  - l'usage est mensuel (clôture), ce qui donne une bonne rétention [E] ;
  - l'actif est transférable : formats documentés, métriques Stripe auditables, acheteurs naturels (A2X, Link My Books, éditeurs comptables FR) [E].
- **Ce qui peut le tuer** :
  - Sellsy a déjà une application Mirakl (P7R-P33) ;
  - Pennylane peut ajouter un connecteur ;
  - l'accès aux relevés vendeurs par API Mirakl (une instance par opérateur) n'est **pas vérifié** [H] ;
  - la douleur des vendeurs FR n'est attestée que par un témoignage ancien (P7R-P35).
- **Recherches suivantes (≤ 10, ≥ 50 % d'invalidation)** :
  1. connecteurs existants de Pennylane, Tiime et Indy pour Cdiscount, ManoMano et Fnac ;
  2. nombre de vendeurs actifs par marketplace FR ;
  3. API vendeur Mirakl (Shop API) : accès aux transactions et aux factures de commission ;
  4. éditeurs FR de niche (recherche nominative) ;
  5. prix de l'application Sellsy Mirakl ;
  6. cabinets spécialisés e-commerce et leurs outils.

### Finaliste 2 — C-39 : conformité FCC des petits opérateurs VoIP (57,5)
- **Pourquoi** :
  - acheteurs **listables gratuitement** (base RMD publique) et joignables par e-mail, sans terrain ;
  - obligations **permanentes et annuelles** (RMD au 1er mars, CPNI, 499-A), donc récurrence naturelle ;
  - amendes réelles (alternatives-negligees.md) ;
  - prix plausible ≥ 149 $ : **~22 clients** suffisent ;
  - 10 à 20 h/mois hors pic.
- **Ce qui peut le tuer** :
  - **le prix et la volonté de payer pour un logiciel ne sont pas observés** [H] : le marché est servi par des cabinets et des consultants (JSI) ;
  - responsabilité sur les dépôts ;
  - un fondateur français qui vend de la conformité américaine.
- **Recherches suivantes** :
  1. outils SaaS FCC existants (recherche nominative : Inteserra, CommLaw, Compliance+…) ;
  2. prix des forfaits de dépôt des consultants ;
  3. taille de la base RMD hors grands opérateurs ;
  4. taux de défaillance et radiations récentes ;
  5. possibilité d'automatiser le 499-A sans conseil fiscal.

### Finaliste 3 — P7-N04 : application Jira de justification R&D (54,5)
- **Pourquoi** :
  - **acquisition par marketplace** (Atlassian), avec installations et avis publics, donc auditables ;
  - exploitation légère (8 à 15 h/mois) ;
  - les applications Atlassian sont un format d'actif courant à la revente [H] ;
  - deux marchés (CIR/CII en FR, SR&ED au Canada) avec le même produit ;
  - il réutilise la pile Relanzio pour la facturation et le back-office [E].
- **Ce qui peut le tuer** :
  - la **demande observée est faible** (Sredio, gratuit : 62 installations) ;
  - les cabinets CIR fournissent gratuitement leur plateforme ;
  - les exports génériques de worklogs suffisent peut-être ;
  - la commission et les règles Atlassian ne sont pas vérifiées [H].
- **Recherches suivantes** :
  1. installations des applications SR&ED et R&D tax (Atlassian) ;
  2. exigences documentaires du CIR (BOFiP, guide MESR) ;
  3. part des startups CIR sur Jira ;
  4. outils des cabinets (Ayming, Leyton, ABGi) et leurs conditions ;
  5. commission Atlassian et règles de transfert d'application.

### Pourquoi pas le 4e (E-39, 54,0)
- Le substitut gratuit (agenda, tableur, rappels de la GED) couvre le besoin de la plupart des PME de 40 à 80 contrats.
- Le SEO « gestion de contrats » est occupé par des CLM (RemindR 25-150 €/utilisateur, MyContrat), et aucune marketplace ne sert de canal naturel.
- L'acquisition est notée 4 [E], contre 6 pour les trois finalistes.

### Pourquoi pas le 5e (B-04, 54,0)
- Problème et prix sont bien prouvés (PayAppPro 79 $, Siteline). Mais l'exploitation solo est pénalisée : **chaque GC impose son format**, et Siteline revendique plus de 24 000 formulaires.
- Il faut aussi une licence des formulaires AIA (Knowify passe par un partenariat).
- Face à Siteline (financé) et Knowify (Intuit Gold), un solo français n'a ni différenciation ni canal QuickBooks privilégié.

---

## 7. Limites
- Aucune page n'a été ouverte (WebFetch bloqué). Les prix viennent de comparateurs, de concurrents (Link My Books sur A2X) ou d'éditeurs, souvent sans date.
- Les notes d'acquisition des trois finalistes sont des **[E] ou [H]** : aucune ne repose sur une conversion observée.
- **La capacité du porteur à vendre reste la variable la plus incertaine** : il n'a aucun client payant.
- P7-N03 et P7-N05 n'ont reçu que 2 recherches chacune, en dessous des 3 à 5 demandées.
- Les sources de valorisation de micro-SaaS (P7R-P47, P48) sont commerciales ou éditoriales, non transactionnelles. Elles ne servent qu'à l'ordre de grandeur du critère Revente.
