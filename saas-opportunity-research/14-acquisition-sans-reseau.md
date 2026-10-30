> **⚠ RÉVISION DU 2026-10-30 (phase 9)** — Pour N06, voir `15-validation-n06.md`. Les créneaux « Mirakl secondaires » et « hors Pennylane » sont affaiblis par Order Invoicer, et le pilote « concierge » ainsi que le bras « vendeurs » sont juridiquement exposés (monopole de l'expertise comptable). Le contenu ci-dessous est conservé pour la traçabilité.

# 14 — Opportunités accessibles sans réseau personnel (phase 8)

Date : 2026-10-30.
- **Objectif inchangé** : un micro-SaaS B2B, créé seul, rentable et revendable, avec un investissement limité. Aucun développement avant vérification de la demande.
- **Ce document corrige la décision du fichier 13.** Il ne l'efface pas.

**Étiquettes** : **[F]** fait vérifié (source citée, identifiant dans `06-registre-preuves.csv`) ; **[E]** estimation raisonnée ; **[H]** hypothèse.

**Limite permanente** : la lecture de pages est bloquée par le réseau de la session. Toutes les preuves sont des extraits de moteur de recherche. Aucun entretien, aucun paiement et aucun avis simulé n'a été utilisé comme preuve.

---

## 1. Corrections de ma décision précédente (fichier 13)

| Hypothèse du fichier 13 | Pourquoi elle était fausse | Correction |
|---|---|---|
| Il faut connaître personnellement ≥ 15 décideurs pour réussir | J'ai confondu « canal le plus probable pour obtenir 3 paiements vite » et « condition de succès ». Plusieurs pistes ont des **acheteurs listés publiquement avec leurs coordonnées** [F] | Le réseau n'est plus un critère. Le canal est évalué piste par piste (§2) |
| Une piste non validée est mauvaise par défaut | Une piste non testée est **inconnue**, pas mauvaise | Les pistes sont classées pour être **testées**, pas éliminées |
| Les notes documentaires (± 5 points) suffisent à départager ou éliminer | La red team 3 l'avait elle-même établi : ces notes sont dans le bruit | Le choix repose maintenant sur 4 axes mesurables (§5) et sur le test terrain |
| Critère « 3 précommandes à 149 € » pour toutes les pistes | Arbitraire : il ne tenait compte ni du prix normal, ni de la fréquence, ni de l'engagement | Seuils propres à chaque modèle (§3) |
| Multiples 1,5 / 2,5 / 3,5× | Fondés surtout sur des médianes de plateformes | **2,0 / 2,5 / 3,5× le bénéfice annuel**, recalés sur des ventes conclues (§4.2) |
| Fiscalité « extraits officiels à confirmer » | Plusieurs points mal précisés (portée de la franchise de TVA, mention sur les factures US, CFP) | Corrigés (§4.1) |

## 2. Les cinq pistes existantes qui ont les meilleurs canaux d'acquisition sans réseau

Sélection faite dans les pistes déjà étudiées. Toutes ont un **canal joignable sans réseau** et une **dépense existante prouvée** par des concurrents payants. La concurrence n'élimine personne : on cherche le segment mal servi.

| Id | Piste | Canal vérifié | Dépense existante prouvée | Frustration vérifiable | Segment mal servi visé |
|---|---|---|---|---|---|
| **N06** | Rapprochement des reversements des marketplaces FR (Cdiscount, ManoMano, Mirakl, Amazon) vers la comptabilité, **offre cabinets multi-dossiers, entrée par fichiers CSV** | DSA art. 30 : les marketplaces doivent afficher nom, adresse, téléphone, e-mail et immatriculation du vendeur [F P8F-P07] ; environ 40 à 100 cabinets « e-commerce » identifiables par Google [E] ; un client peut générer lui-même une clé API Pennylane [F P8F-P06] | Synchron.io 150-350 €/mois [F P7DN06-P03] ; Order Invoicer jusqu'à 149 € et plus [F P7DN06-P04] | **Non trouvée** envers les outils [F d'absence] ; indices indirects (« reconstitution du CA laborieuse », plus de 30 types de lignes par relevé Amazon) [F P8F-P22, P24] | Cabinets multi-dossiers **hors Pennylane** (ACD, Sage, Cegid, FEC) [H fort] ; Order Invoicer accepte déjà Mirakl [F P8F-P14] |
| **C-39** | Calendrier et dépôts FCC (RMD, CPNI, 499) pour petits revendeurs VoIP US | **RMD public en CSV avec e-mail** : 9 242 sociétés en 2025, dont 2 909 sans STIR/SHAKEN ; 2 411 fiches déficientes en 2024 [F P8U] | RMD Keeper 39-399 $/mois [F P7DC39-P01] ; Performance West 1 499 $/an [F P7DC39-P05] | Aucune plainte publique ; « la plupart des revendeurs se croient couverts par leur amont » (Viirtue) [F P8U] | Revendeurs non facilities-based, recertification annuelle [H] |
| **A-38** | Rapprochement des commissions, agences d'assurance IARD US **hors Applied Epic** | Registre TDI du Texas, TrustedChoice (sans e-mail) ; HawkSoft Marketplace (38 % des agences abonnées à un partenaire) [F P8U] | Commission Wizard dès 199 $/mois [F A-P41] ; Applied Recon [F A-P42] | La doc EZLynx impose saisie manuelle ou gabarit CSV pour les relevés PDF ; une agence a cessé de rapprocher faute de temps [F P8U] | Agences sous EZLynx ou HawkSoft [E] |
| **N04** | Justification du temps R&D (CIR/CII) depuis Jira | Lauréats i-Lab/i-Nov et open data des organismes agréés CIR [F P8F-P46 à P48]. Approbation Atlassian de 10-15 jours ouvrés annoncés, semaines à mois observés, sans fiche « bientôt disponible » [F P8F-P28 à P32] | MyCIR 2 500 €/an ; honoraires des cabinets [F P7DN04] | TA de Paris, 5/5/2026 : des feuilles de temps journalières ne permettent pas de « rattacher de manière suffisamment précise » le temps aux projets [F P8F-P41] | Startups qui déclarent seules, sans cabinet [H] |
| **B-11** | Testeurs backflow US multi-districts | Listes par État ou ville ; **e-mail rare** (BCVWD, Panama City), surtout le téléphone [F P8U] | C3Backflow 15 $/mois, R2 Utility 25 $, Syncta [F DD-B11] | Frais de 11,50 à 30 $ par rapport, enregistrements annuels jusqu'à 135 $ ; aucune plainte de testeur [F P8U] | Testeurs indépendants multi-districts [H] |

**Pas retenues ici** :
- **E-13 / Relanzio** : canal correct (SIRENE, e-mail B2B légal), mais un prix de 24 € et un churn de 4-8 % donnent une valeur de revente nulle en simulation (fichier 13).
- **D-15 (MTD UK)** : les bailleurs sont souvent des particuliers. Pour un fournisseur non établi au Royaume-Uni, la TVA britannique sur les services numériques B2C pourrait s'appliquer dès le premier client [H à vérifier]. GetGround est gratuit [F].

**Alerte de marché** [F P8U] : trois pages de test tierces visent les mêmes cibles :
- « RMD Autopilot » : audit RMD gratuit, puis 490 $/an ;
- « Cowork Recon » : 500 $/mois ;
- un importeur HawkSoft.

Si ce ne sont pas les vôtres, d'autres fondateurs testent ces idées en ce moment. Cela confirme l'intérêt, et rend la vitesse importante.

## 3. Une expérimentation par piste, adaptée à son modèle économique (sans développement)
Détail complet, messages prêts à l'emploi et base légale : `_work/P8-FR.md` (N06, N04) et `_work/P8-US.md` (C-39, A-38, B-11).

| Piste | Cible et échantillon | Offre | Tarif testé | Canal et coût | Indicateurs et seuils | Pourquoi ces seuils |
|---|---|---|---|---|---|---|
| **N06** | **A** : 60 cabinets avec une page « e-commerce / marketplaces » (hors ceux qui ont automatisé en interne). **B** : 200 vendeurs SIREN FR présents sur au moins 2 marketplaces | A : rapprochement **gratuit d'un versement** livré en 5 jours, puis **pilote concierge mensuel, premier mois prépayé**. B : landing avec prix, carte enregistrée en mode setup, 0 € débité avant la première livraison | A : **149 € contre 99 € HT/mois** jusqu'à 8 dossiers. B : **59 € contre 89 € HT/mois** | E-mail à l'adresse publique, 1 relance ; ≈ 25 € ; 40-50 h sur 6 à 10 semaines | **GO** : ≥ 2 cabinets avec pilote payé à S10, **ou** 1 cabinet + ≥ 4 cartes vendeurs. **STOP** : 0 pilote et ≤ 1 carte. Intermédiaires : ≥ 6 réponses positives sur 60 cabinets à S4 ; ≥ 3 audits sur de vrais exports | Abonnement mensuel, donc le premier mois prépayé est l'engagement normal. 2 cabinets d'environ 5 dossiers valent environ 10 vendeurs. Horizon S10 pour le cycle de décision des cabinets (1 à 3 mois) |
| **C-39** | 400 contacts du CSV RMD, revendeurs et petits acteurs | **Audit gratuit de votre fiche RMD**, puis **prépaiement annuel** avant la date limite de recertification | **490 contre 790 $/an** | E-mail (CAN-SPAM) ; < 100 € ; 30-40 h | **GO** : ≥ 4 % de demandes d'audit **et** ≥ 4 prépaiements. **STOP** : < 1,5 % ou ≤ 1 paiement | Achat annuel lié à une échéance réglementaire : le prépaiement annuel est l'engagement normal. Fenêtre de novembre à janvier [F P8U] |
| **A-38** | 400 agences sous EZLynx ou HawkSoft (registres d'État, TrustedChoice) | **Audit gratuit des écarts de commissions** sur un relevé, puis abonnement avec carte enregistrée | **149 contre 249 $/mois** | E-mail ou formulaire, pas d'e-mail direct dans les registres [F] ; < 100 € ; 40-50 h | **GO** : ≥ 5 audits réalisés **et** ≥ 3 cartes. **STOP** : 0 carte | Prix élevé et abonnement : 3 cartes à ce prix ≈ 450-750 $ de MRR potentiel |
| **N04** | 150 startups (lauréats i-Lab/i-Nov, liste des organismes agréés), décembre-janvier | **Modèle gratuit** (aimant SEO), puis landing avec **prévente annuelle remboursable** | **490 contre 290 €/an** | E-mail B2B + SEO ; < 100 € ; 30-40 h | **GO** : ≥ 3 prépaiements **et** ≥ 50 % sur Jira Cloud. **STOP** : 0 prépaiement et < 8 inscriptions | Achat annuel, saisonnier (dépôt en mai) |
| **B-11** | 300 testeurs (listes avec e-mail quand elles existent, sinon téléphone) | **Rappels annuels aux clients du testeur en concierge** (génère du chiffre d'affaires pour le testeur) | **590 contre 990 $ par saison** | E-mail ou téléphone ; < 100 € ; 40 h | **GO** : ≥ 5 % de réponses positives, ≥ 5 listes clients transmises **et** ≥ 3 paiements | Achat saisonnier, valeur mesurable en rendez-vous de test générés |

## 4. Corrections fiscales et de valorisation

### 4.1 Fiscalité micro-entrepreneur 2026 (`_work/P8-fiscal-corrections.md`, extraits de sources officielles, pages non lues en entier)
**Ce n'est pas un conseil fiscal ; validation par un expert-comptable nécessaire.**

| Point | Statut | Valeur retenue |
|---|---|---|
| Qualification du SaaS | CONFIRMÉE avec réserve (aucun texte ne vise le SaaS ; l'Urssaf cite la « fourniture de logiciels » comme BIC) | BIC prestations de services : cotisations 21,2 %, abattement 50 %. Variante prudente BNC : 25,6 % (taux confirmé au 1/1/2026), soit environ −1 800 €/an de net à 3 000 € de MRR |
| CFP | **CORRIGÉE** | 0,1 % si l'activité est immatriculée comme commerciale, 0,2 % si libérale |
| Taxe pour frais de chambre (TFC) | Précisée | 0,044 %, due à partir de la 2e année, non due si le CA de l'avant-dernière année est < 5 000 € |
| Versement libératoire | CONFIRMÉ | 1,7 % (BIC services), si le revenu fiscal de référence 2024 est ≤ 29 315 € par part ; option à exercer dans les délais |
| Seuil micro | CONFIRMÉ | 83 600 € HT (2026-2028), proratisé l'année de création, perdu après 2 années consécutives de dépassement |
| **Franchise TVA** | **CORRIGÉE (portée)** | 37 500 / 41 250 € ; seuil de 25 000 € abandonné (loi 2025-1044). **Seul le CA imposable en France compte** : les clients B2B étrangers (US) n'entrent pas dans le seuil |
| **Factures à des clients US** | **CORRIGÉE** | Mention « TVA non applicable – art. 259-1 du CGI », et non « autoliquidation » |
| Achats de services étrangers | CONFIRMÉ | 20 % de TVA autoliquidée dès le 1er euro, non déductible en franchise |
| Cession : plus-value à long terme | CONFIRMÉ | 12,8 % + prélèvements sociaux 18,6 % (LFSS 2026) ; long terme seulement si l'élément est détenu ≥ 2 ans |
| Art. 151 septies | CONFIRMÉ + **précision** | Exonération totale si la moyenne des recettes ≤ 90 000 € (dégressive jusqu'à 126 000 €), après 5 ans d'activité. **Elle couvre aussi les prélèvements sociaux** |
| Art. 238 quindecies | CONFIRMÉ | ≤ 500 000 € (dégressive jusqu'à 1 M€), après 5 ans |
| Droits d'enregistrement | CONFIRMÉ | 0 % jusqu'à 23 000 €, 3 % jusqu'à 200 000 €, 5 % au-delà ; à la charge de l'acheteur sauf clause contraire. Vente d'actifs numériques isolés, sans clientèle : non vérifiable |
| TVA sur la cession | CONFIRMÉ | Dispense de l'art. 257 bis pour une universalité, entre redevables |

**Conséquence pour le choix** : une piste à clientèle **US** reste plus longtemps en franchise de TVA en France. C'est un avantage administratif modeste pour C-39 et A-38, sans effet sur le prix HT d'un client B2B.

### 4.2 Multiples de revente (`_work/P8-transactions.md`)
- **18 ventes conclues avec un prix publié** ont été trouvées, mais **seulement 4 dans la tranche 1-5 k$ de MRR**, dont 3 datent de 2021-2022.
- Sur ces 4 ventes, la médiane est de **2,37× l'ARR** (2,22-3,12×), soit environ 2,6-2,8× le bénéfice à 85-90 % de marge [F/E].
- Médianes publiées par les plateformes :
  - Flippa : 2,2-2,5× (ventes conclues) ;
  - Empire Flippers : 3,2× (270 ventes) ;
  - Acquire.com : 3,9× (déclaré par les vendeurs).
- **Effets observés** :
  - dépendance à une API qui peut être retirée : jusqu'à −74 % ;
  - vente sous contrainte ou chiffre d'affaires en baisse : −40 à −45 % ;
  - effet du churn : non mesurable (jamais publié avec le prix).
- **Multiples retenus : 2,0× (prudent), 2,5× (central), 3,5× (favorable) le bénéfice annuel**, à condition que la vente aboutisse. Probabilité de vente en 6 mois : 50 à 70 % [H, non mesurée].

## 5. Comparaison et recommandation

### 5.1 Simulation à 3 000 € de MRR
Source : `P8-simulations-financieres.md`, générée par `_work/micro_saas_sim.py` depuis `_work/P8-sim-config.json`. Hypothèses : fiscalité corrigée, multiples corrigés, opérateur de remplacement à 35 €/h, montants en $ assimilés à des € pour simplifier.

| Piste | Clients nécessaires | Net fondateur/mois | Heures/semaine (exploitation + acquisition pour remplacer le churn) | Bénéfice ajusté/mois (opérateur payé, churn remplacé) | Valorisation prudente / centrale / favorable |
|---|---|---|---|---|---|
| **N06** (cabinets, 149 €) | **21** | **2 181 €** | **8,8** | **1 565 €** | **64 / 79 / 111 k€** |
| N04 (490 €/an) | 74 | 2 140 € | 11,1 | 1 157 € | 55 / 69 / 96 k€ |
| A-38 (135 $) | 23 | 1 722 € | 11,3 | 728 € | 50 / 63 / 88 k€ |
| C-39 (≈ 600 $/an) | 60 | 1 702 € | 12,1 | 558 € | 44 / 55 / 76 k€ |
| B-11 (≈ 55 $/mois) | 55 | 1 808 € | 15,3 | 186 € | 44 / 55 / 77 k€ |

Tous les intrants sont des estimations [E/H] justifiées dans `P8-FR.md` §N06-6 et suivants, et dans `P8-US.md`. Les plus fragiles : le churn et le CAC.

### 5.2 Les quatre axes demandés

| Axe | N06 | N04 | A-38 | C-39 | B-11 |
|---|---|---|---|---|---|
| **Rentabilité potentielle** (bénéfice ajusté, nombre de clients) | **1er** : 21 clients, 1 565 € [E] | 2e | 3e | 4e | 5e |
| **Accessibilité des acheteurs** | 2e : contacts DSA [F], cabinets via Google [E] ; e-mails souvent génériques [H] | 4e : listes i-Lab, pas de test sur la marketplace [F] | 3e : registres sans e-mail [F] | **1er** : CSV public avec e-mail [F] | 5e : surtout le téléphone [F] |
| **Exploitation solo** | **1er** : 8,8 h/sem ; fichiers CSV plutôt que 4 API [E] ; questions comptables exigeantes au début | 2e : 11,1 h ; saison mars-mai | 3e : 11,3 h ; formats PDF des assureurs | 4e : 12,1 h ; veille réglementaire, fuseau horaire US, responsabilité | 5e : 15,3 h |
| **Revente** | **1er en valeur** (64-111 k€ [E]) ; acheteurs FR restreints [E] ; risque de concentration (~20 cabinets) [E] | 2e ; app Atlassian transférable [F P7DN04-P40] | 3e ; acheteurs US plus nombreux [E] | 4e ; responsabilité réglementaire | 5e |
| **Langue et marché pour vous** | France, en français | France | US, en anglais | US, en anglais | US, en anglais |

### 5.3 Recommandation

**Piste prioritaire : N06, version « cabinets multi-dossiers, entrée par fichiers CSV, sortie vers n'importe quel logiciel comptable (FEC, ACD, Sage, Cegid, Pennylane) ».**

**Pourquoi** :
1. **La meilleure rentabilité ajustée du travail.** Il suffit d'environ 21 clients à 149 € pour 3 000 € de MRR, en moins de 9 h par semaine [E]. C'est la seule piste où un prix élevé est **ancré par des concurrents payants** au même niveau : Synchron.io 150-350 €, Order Invoicer jusqu'à 149 € [F].
2. **Des acheteurs joignables sans réseau.** La loi impose la publication des coordonnées des vendeurs (DSA art. 30) [F], et les cabinets e-commerce se trouvent par recherche. Prospection B2B en opt-out légale en France, avec les mentions RGPD [F].
3. **Une exploitation sobre** si l'entrée se fait par les exports CSV plutôt que par 4 API : pas de délégation Octopia, pas de compte développeur Amazon. C'est aussi meilleur pour la revente : aucun compte partenaire à transférer [E].
4. **Votre avantage réel** : marché français, interlocuteurs francophones, pas de fuseau horaire ni de responsabilité réglementaire étrangère.

**Ce qui reste non prouvé, et que le test doit trancher** :
- la frustration réelle envers les outils existants (aucune trouvée) ;
- le segment « cabinets hors Pennylane » [H] ;
- l'acceptation d'un prix de 149 € par un cabinet ;
- la stabilité des formats d'export ;
- la dépendance initiale à vos connaissances comptables, réduite par des règles versionnées et testées.

**Deuxième choix, si vous préférez l'anglais et les listes les plus faciles** :
- **C-39**, pour son canal (CSV public avec e-mail) et sa fenêtre de novembre à janvier ;
- **mais** sa rentabilité ajustée est 3 fois plus faible, et RMD Keeper et « RMD Autopilot » sont déjà là.

**A-38** est la piste US la plus rentable par client, mais son canal est moins direct (registres sans e-mail).

## 6. Le meilleur test commercial concret, sans réseau professionnel

**Test N06 « un versement rapproché gratuitement, puis un mois prépayé », en 6 à 10 semaines, sans développement.**

1. **Semaine 1 : liste** (≈ 6 h pour les cabinets, 10 h pour les vendeurs)
   - 60 cabinets d'expertise comptable ayant une page publique « e-commerce / Amazon / Cdiscount / marketplaces », trouvés par recherche « expert-comptable e-commerce + ville ».
     - Exclure ceux qui revendiquent une automatisation interne.
     - Noter leur logiciel s'il est visible.
   - 200 vendeurs français présents sur au moins 2 marketplaces (ManoMano, Cdiscount, Leroy Merlin, Boulanger), d'après leur fiche vendeur publique (DSA art. 30). Vérifier le SIREN dans l'annuaire public des entreprises.
   - Collecte manuelle, sans extraction automatique, à cause des conditions d'utilisation des marketplaces [H].
2. **Semaine 1 : supports** (≈ 4 h, ≈ 25 €)
   - Une landing statique avec les prix ;
   - un lien de paiement Stripe pour les cabinets ;
   - une page d'enregistrement de carte Stripe en mode setup (0 € débité) pour les vendeurs ;
   - une adresse e-mail de domaine.
   - En parallèle, une demande de partenariat à Pennylane, uniquement pour **mesurer** le délai.
3. **Semaines 2-3 : envois**
   - Messages prêts dans `_work/P8-FR.md` §N06-5, avec identité, SIREN, origine des coordonnées, opposition par « STOP » et durée de conservation. Pas de pixel de suivi.
   - Moitié des cabinets à 149 €, moitié à 99 € ; moitié des vendeurs à 59 €, moitié à 89 €.
   - Une seule relance à J+7.
4. **Semaines 2-6 : audits gratuits** (≈ 2 h chacun)
   - Rapprochement manuel d'un versement réel à partir des exports bruts.
   - Livrable : écritures importables + état versement ↔ virement.
   - **Le fait de recevoir de vrais exports est déjà une preuve.**
5. **Semaines 3-10 : pilotes payés**
   - Service manuel mensuel, premier mois prépayé, résiliable.
   - Chronométrez chaque dossier-mois : c'est votre future mesure de coût d'exploitation.
6. **Questions d'entretien** (comportement passé) :
   - « Comment traitez-vous aujourd'hui les versements de [marketplace] ? »
   - « Qu'avez-vous essayé, et pourquoi l'avoir abandonné ? »
   - « Combien de temps par dossier et par mois ? »
   - « Sous quel logiciel ? »
   - « Combien de dossiers e-commerce gérez-vous ? »

**Indicateurs et décision** (seuils calés sur un abonnement mensuel professionnel avec un cycle de décision de 1 à 3 mois) :

| Indicateur | GO | ITÉRER | STOP |
|---|---|---|---|
| Réponses positives des cabinets à S4 | ≥ 6 sur 60 | 3-5 | ≤ 2 |
| Audits gratuits réalisés sur de vrais exports | ≥ 3 | 1-2 | 0 |
| **Pilotes de cabinets payés (≥ 99 €, premier mois prépayé) à S10** | **≥ 2** | 1 | 0 |
| Cartes enregistrées par des vendeurs (59 ou 89 €) | ≥ 4 | 1-3 | 0 |
| Part des interlocuteurs hors Pennylane ou insatisfaits | ≥ 50 % | — | ≥ 60 % équipés et satisfaits |

- **GO** (développement d'un MVP limité aux parsers CSV et aux sorties demandées par les payeurs) : ≥ 2 pilotes de cabinets payés, **ou** 1 pilote + ≥ 4 cartes de vendeurs.
- **STOP** : 0 pilote **et** ≤ 1 carte, ou ≥ 60 % d'interlocuteurs déjà équipés et satisfaits.
- **Sinon ITÉRER** : un seul segment (par exemple les cabinets sous ACD ou Sage uniquement) ou un autre prix.

**Coût** : ≈ 25 € et 40 à 50 h sur 6 à 10 semaines. **Aucun code produit.**

**Rien n'est envoyé sans votre accord** : je peux préparer la liste de requêtes, la landing et les messages finalisés à votre demande.

## 7. Incertitudes restantes
- Toutes les données sont des **extraits de recherche**. Les textes officiels, les pages tarifaires et les fiches vendeurs n'ont pas été lus en entier.
- Pour la suite, il faut autoriser dans les réglages réseau : `legifrance.gouv.fr`, `urssaf.fr`, `impots.gouv.fr`, `manomano.fr`, `cdiscount.com`, `pennylane.com`, `rmd.fcc.gov`.
- Le churn, le CAC et la charge par client sont **estimés**. Seuls les pilotes les mesureront.
- La valorisation suppose une vente qui aboutit ; peu de transactions confirmées existent dans la tranche visée.
- La qualification fiscale du SaaS (BIC ou BNC) doit être confirmée par un expert-comptable, éventuellement par rescrit.
