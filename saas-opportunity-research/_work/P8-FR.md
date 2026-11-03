# P8-FR — Acquisition sans réseau personnel : N06 et N04

Date : 2026-10-29 (brief daté du 2026-10-30). Preuves : `P8-FR-preuves.csv` (P8F-P01 à P52). Les identifiants `P7DN06-` et `P7DN04-` renvoient aux registres de phase 7.
Étiquettes : **[F]** fait vérifié avec source, **[E]** estimation au raisonnement explicite, **[H]** hypothèse.

## 0. Méthode et limites

- **38 recherches WebSearch** sur un budget de 30 à 40.
- **1 tentative WebFetch** sur `www.pennylane.com`, refusée (ENOTFOUND). Comme le prévoit le brief, tout ce qui suit vient des **extraits** de résultats ; aucune page n'a été lue en entier. Pour lire les fiches Pennylane, Atlassian Marketplace et les pages vendeurs, il faut autoriser ces domaines dans les réglages réseau de la session.
- **Résultats de recherche indicatifs** : l'outil WebSearch renvoie des résultats « US-only ». Ce que j'appelle « pages qui rankent » est donc un échantillon indicatif, pas le classement de google.fr. **Aucun volume de recherche n'est donné**, faute de source.
- **Non trouvé**, ce qui n'est pas une preuve d'absence :
  - avis utilisateurs sur Order Invoicer et Synchron.io ;
  - fil de forum vendeur (Seller Central FR, Que Choisir, Reddit) sur le rapprochement des versements ;
  - nombre de vendeurs Boulanger et Decathlon ;
  - délai d'approbation de la marketplace Pennylane ;
  - annuaire public Station F ou French Tech ;
  - témoignage de startup sur un contrôle CIR lié aux temps.

**Verdict court.** Aucune des deux pistes n'est validée ni invalidée. Toutes deux restent **inconnues et testables sans code**, pour moins de 50 € et 35 à 45 h chacune.
- **N06** : le canal le plus solide est une **obligation légale d'affichage** de l'identité des vendeurs (DSA art. 30, P8F-P07), complétée par les cabinets e-commerce qui publient une page dédiée. En revanche, l'hypothèse « opérateurs Mirakl secondaires mal servis » **s'affaiblit** : Order Invoicer accepte Mirakl (P8F-P14). Le segment le mieux défendable devient **le cabinet multi-dossiers hors Pennylane** (ACD, Sage, Cegid, FEC), avec une conception « CSV d'abord ».
- **N04** : la Marketplace Atlassian **ne permet pas de fiche « bientôt disponible »** (P8F-P28, P32), et son délai d'approbation est imprévisible (P8F-P29 à P31). Le test passe donc hors Marketplace : landing avec prix, prévente annuelle remboursable et modèle gratuit. Les meilleures listes publiques sont les **lauréats i-Lab et i-Nov** et la **liste open data des organismes agréés CIR** (P8F-P46 à P48). La frustration la mieux sourcée est **juridique** (TA de Paris, 5 mai 2026, P8F-P41), pas un avis d'utilisateur.

---

# PISTE N06 — Rapprochement des reversements des marketplaces FR vers la comptabilité

## N06-1. Canal vérifié

### a) Marketplace Pennylane (Pennylane Connect)

| Élément | Constat | Statut |
|---|---|---|
| Point d'entrée | Équipe « partenariats connectivité » ; aucun formulaire ni critère public | [F] P8F-P01 |
| Taille | « Des dizaines » de partenaires selon la doc API ; **500+ apps** selon une offre d'emploi 2026 | [F] P8F-P02, P03 |
| Programme | Programme partenaires techniques **en construction** : paliers, incitations, certifications | [F] P8F-P03 |
| Technique | OAuth 2.0 pour les partenaires ; sandbox sur demande aux Partenariats ; conditions contractuelles API | [F] P8F-P04 |
| Revue | Partenariat, revue d'app et audit de sécurité listés comme prérequis possibles par un agrégateur, statut non confirmé | [F faible] P8F-P05 |
| Délai d'approbation | **Non trouvé** ; 1 à 3 mois supposés | [H] |
| Fiche « bientôt disponible » ou liste d'attente | **Non trouvée** | — |
| **Contournement** | Un client peut générer **lui-même une clé API** dans Pennylane (lecture et écriture), comme le fait Fotostudio. Un service pilote peut donc écrire dans le dossier Pennylane d'un client **sans listing** | [F] P8F-P06 |

**Conclusion.** La marketplace Pennylane est un canal **de seconde phase**, pas un canal de test : délai inconnu, critères non publics, Order Invoicer déjà présent (P7DN06-P09). Le test peut s'en passer grâce à la clé API générée par le client. Il faut envoyer la demande de partenariat dès J0 pour **mesurer** le délai de réponse ; ce délai sert à vérifier le canal, pas à décider du GO.

### b) Listes publiques de vendeurs par marketplace

| Élément | Constat | Statut |
|---|---|---|
| Base légale de l'affichage | **DSA art. 30** : la place de marché doit afficher clairement le nom, l'adresse, le téléphone, l'e-mail et le numéro d'immatriculation du vendeur professionnel | [F] P8F-P07 |
| Cdiscount | « Vendu par [NOM du Vendeur] » sur chaque fiche produit et au panier | [F] P8F-P08 |
| Leroy Merlin | Vendeurs obligatoirement inscrits au RCS ; contact acheteur via le vendeur | [F] P8F-P09 |
| ManoMano, Boulanger | Format exact de la page vendeur **non vérifié** (WebFetch bloqué) | — |
| Format | Pages HTML, sans export ni annuaire téléchargeable | [E] |
| Collecte | Manuelle, environ 1 à 2 min par vendeur, puis contrôle du SIREN sur l'annuaire public des entreprises (gratuit) | [E] |
| Extraction automatisée | Les CGU des marketplaces peuvent l'interdire ; à vérifier, d'où la collecte manuelle | [H] |

**Nombre d'entrées.**

| Marketplace | Vendeurs | Source |
|---|---|---|
| Cdiscount | ≈ 10 000 | [F faible] P7DN06-P35 |
| ManoMano | 5 000+, tous pays | [F] P7DN06-P36 |
| Leroy Merlin | **500+ en 2024** (le chiffre non daté de 900+ d'eDesk est contredit) | [F] P8F-P10 |
| Carrefour | ≈ 100 en 2020 | [F, ancien] P8F-P12 |
| Decathlon | sélective, sur invitation | [F] P8F-P13 |
| Boulanger | inconnu ; marketplace opérée sur Mirakl | [F] P8F-P11 |

**Champs disponibles.** Raison sociale, adresse, téléphone, e-mail et immatriculation, dans la mesure où l'obligation du DSA est respectée [F pour l'obligation, H pour l'affichage effectif sur chaque site]. L'e-mail affiché est souvent une adresse générique de service client [H]. Cela simplifie le RGPD, mais l'adresse joint le SAV plutôt que le dirigeant.

### c) Cabinets d'expertise comptable spécialisés e-commerce

- **Pages trouvées** :
  - Hayot Expertise, sous Pennylane, qui cite plus de 30 types de transactions par Settlement Report Amazon (P8F-P22) ;
  - Eurofiscalis (P8F-P23) ;
  - HR Associés, Excilio et Auctus (P7DN06-P13 à P16) ;
  - contenus Keobiz et Dougs (P8F-P25).
- **Nombre** : environ 40 à 100 cabinets identifiables par Google, avec les requêtes « expert-comptable e-commerce / Amazon / marketplace » + ville [E]. L'annuaire de l'Ordre n'a pas été vérifié ici.
- **Champs** : site, e-mail de contact générique, parfois un associé nommé [E].
- **Position** : les cabinets sont **à la fois canal et concurrent**. Hayot a automatisé avec n8n (P7DN06-P15). Il faut donc les exclure de l'échantillon ou leur proposer un partenariat.

### d) SEO (pages qui rankent, échantillon indicatif)

| Requête | Ce qui ressort | Lecture |
|---|---|---|
| « rapprochement ManoMano comptabilité » | **Uniquement des offres d'emploi comptables de ManoMano** ; aucun éditeur, aucun cabinet | Concurrence nulle sur l'échantillon ; volume inconnu, peut-être quasi nul [F] P8F-P19, [H] volume |
| « export comptable Cdiscount » | Un guide tiers (Expando) qui décrit l'export du **relevé de versement** (Finance > Invoices history > Export) et la rubrique « Retention » ; le reste concerne des connecteurs de flux produits | Faible concurrence ; confirme qu'**un export structuré existe** côté Cdiscount [F] P8F-P20 |
| « Mirakl Pennylane » | Aucun résultat ne mentionne Pennylane, pas même la page Synchron.io dédiée | Créneau SEO libre, mais intention probablement rare [F] P8F-P21, [H] |
| « expert-comptable e-commerce marketplaces » | Hayot, Eurofiscalis, agences et freelances Malt | Requête tenue par les cabinets [F] P8F-P22, P23 |

**Lecture.** Les requêtes de longue traîne « [marketplace] + comptabilité / rapprochement / export » sont **peu disputées**. C'est un canal à coût marginal faible, mais **lent** (3 à 9 mois) et de **volume inconnu** [E]. Il ne remplace pas la prospection pour le test.

### e) Base légale du contact (France)

- **E-mail B2B en opt-out** si le message concerne la fonction du destinataire (P7DN06-P42).
- **Information au titre de l'article 14 RGPD** et moyen d'opposition **dès le premier envoi**, même pour des données publiques (P8F-P26).
- **Pas de pixel de suivi** sans consentement (P7DN06-P43). Doctrine CNIL de 2026 à surveiller (P8F-P27).
- **Réutilisation de l'e-mail affiché au titre du DSA** : sa finalité première est le contact acheteur. Sa réutilisation pour une prospection liée à l'activité de vendeur se défend sur l'intérêt légitime, avec un test de mise en balance documenté. Volume limité : 1 envoi et 1 relance [E].
- **Téléphone** : à éviter. Des blogs annoncent un passage à l'opt-in en août 2026, information non confirmée [H] (P8F-P27).

## N06-2. Frustrations vérifiables

| Cible | Résultat | Source |
|---|---|---|
| Order Invoicer | **Non trouvé** : aucun avis utilisateur, fiche Wix sans avis, Shopify 2 avis à 5/5 | P8F-P16, P7DN06-P10 |
| Synchron.io | **Non trouvé** | — |
| Pennylane | Pas de plainte trouvée ; le connecteur Amazon Seller est « en bêta » selon un cabinet partenaire | P8F-P17 |
| Forums vendeurs, Seller Central FR | **Non trouvé** (2 recherches) | — |
| Indices indirects, **qui ne sont pas des frustrations d'utilisateurs** | « Reconstitution du CA réel laborieuse » avec des soldes nets tous les 15 jours (Digitiz) ; plus de 30 types de transactions par relevé Amazon (Hayot) ; « vérifier le niveau réel d'automatisation » (Dougs) | P8F-P24, P22, P25 |

**Conclusion.** Aucune frustration envers les outils existants n'est sourcée. Selon la règle du brief, ce n'est **pas** un motif d'élimination : l'absence d'avis va de pair avec une faible traction publique des concurrents. Le test doit produire cette preuve lui-même, sous la forme de la question 2 du script : « qu'avez-vous essayé, pourquoi l'avoir abandonné ? ».

## N06-3. Segment insuffisamment servi

| Hypothèse | Preuves pour | Preuves contre | Verdict |
|---|---|---|---|
| **Opérateurs Mirakl secondaires** (Leroy Merlin, Boulanger, Carrefour, Decathlon, Darty, Galeries Lafayette) | Aucun outil trouvé ne décrit la **ventilation par versement** Mirakl (TL02) vers la comptabilité FR [absence] | Order Invoicer **accepte Mirakl** et automatise la saisie des règlements (P8F-P14) ; easybill facture Leroy Merlin, Darty et Decathlon (P8F-P15) ; segment petit : Leroy Merlin 500+ (P8F-P10), Carrefour ≈ 100 (P8F-P12), Decathlon sur invitation (P8F-P13) | **Affaibli.** À ne plus mettre en avant seul. Galeries Lafayette n'a pas été recherché |
| **Cabinets multi-dossiers** | Aucun outil trouvé ne propose une vue cabinet multi-dossiers ; les cabinets avancés bricolent avec n8n (P7DN06-P15) | Les cabinets avancés ont internalisé ; cycle de vente de 1 à 3 mois (redteam3 §2.1) | **Plausible, non prouvé** [H] |
| **Sage, Cegid, ACD ou FEC hors Pennylane** | Pages experts-comptables Sage sans connecteur marketplace (P8F-P18) ; rien trouvé sur ACD et Cegid ; Order Invoicer, Synchron.io et Acomim sortent vers Pennylane, Sellsy ou Abby (P7DN06) | Absence ≠ preuve ; A2X et Link My Books exportent vers Xero et QBO (non pertinents) | **Le créneau le mieux défendable** [H fort] : il cumule « cabinet » et « hors Pennylane » |

### Différenciation réalisable en solo [E]
**« CSV d'abord, multi-dossiers, sortie vers n'importe quel logiciel comptable. »**
1. L'**entrée** se fait par les exports back-office (relevé de versement Cdiscount, P8F-P20 ; CSV ManoMano et Mirakl ; settlement Amazon). On évite ainsi la délégation Octopia, l'app publique Amazon et les clés par opérateur, qui sont les risques n° 3 et 4 du DD.
2. Une **bibliothèque de règles de ventilation** par marketplace et par type de ligne.
3. Les **sorties** : FEC, import ACD, Sage et Cegid, et Pennylane par la clé client (P8F-P06).
4. Un **écran cabinet** : liste des dossiers, versements non rapprochés, écarts.

Un concurrent orienté Pennylane ou commandes ne le copie pas en quelques jours si la valeur tient au **multi-logiciels et multi-dossiers** plutôt qu'à un connecteur de plus. C'est **faible** face à un cabinet qui garde n8n [E].

## N06-4. Support, maintenance, dépendance, transférabilité [E]

- **Maintenance fixe** : 8 à 12 h par mois, contre 12 à 20 h dans le DD. Les parsers CSV cassent moins souvent que 4 ou 5 API, mais un changement de colonnes reste possible 2 à 4 fois par an, toutes sources confondues.
- **Support** : ≈ 1 h par cabinet et par mois, pour 5 à 8 dossiers en moyenne. L'interlocuteur est un comptable : il pose moins de questions de principe, mais il exige l'exactitude.
- **Dépendance au fondateur** : forte au départ, car le paramétrage des règles demande des connaissances en PCG et en TVA. Elle se réduit si chaque règle est versionnée et testée sur des relevés anonymisés.
- **Transférabilité** : meilleure que dans la version API du DD. Il n'y a ni compte développeur Amazon ni délégation Octopia à transférer. Les actifs sont les parsers, les règles, les clients sur Stripe et le contenu SEO. **Risque de concentration** : 20 cabinets environ portent tout le MRR (décote de 20 à 30 % si l'un pèse plus de 30 %, P7-cession).

## N06-5. Expérimentation sans développement (6 à 10 semaines)

### Bras A — Cabinets (principal)
- **Cible** : **60 cabinets** d'expertise comptable français ayant une page publique « e-commerce / marketplaces / Amazon / Cdiscount ». Ceux qui revendiquent une automatisation interne (par exemple n8n) sont exclus. On note leur logiciel (Pennylane, ACD, Sage, Cegid) s'il est visible.
- **Offre** :
  1. **Aimant** : rapprochement gratuit **d'un versement** d'un dossier, livré en 5 jours ouvrés. Le livrable est l'écriture importable dans le logiciel du cabinet plus l'état versement ↔ virement.
  2. **Pilote payant** : service manuel (concierge) mensuel, avec un **premier mois payé d'avance** par lien Stripe, résiliable chaque mois.
- **Tarif testé** (A/B par moitié de liste) : **149 € HT/mois jusqu'à 8 dossiers** contre **99 € HT/mois jusqu'à 8 dossiers**, puis 15 € par dossier supplémentaire. Ancres : Order Invoicer Growth 149 € (P7DN06-P04) ; Synchron.io 150 à 350 € (P7DN06-P03).
- **Canal** : e-mail à l'adresse de contact publique du cabinet, avec 1 relance à J+7. Pas de pixel.
- **Coût** : ≈ 15 € (domaine), outil d'e-mail gratuit. **≈ 30 à 40 h** : 6 h de liste, 4 h d'envois et réponses, 2 h par audit gratuit, 4 h par dossier-mois de pilote.
- **Message** (prêt à l'emploi) :
  > **Objet : Versements Cdiscount / ManoMano de vos clients : un essai sur un dossier ?**
  > Bonjour, votre site présente une activité auprès des vendeurs marketplaces. Je teste un service de rapprochement des versements (Cdiscount, ManoMano, Leroy Merlin et autres boutiques Mirakl, Amazon) : à partir des exports bruts, je vous rends des écritures importables dans votre logiciel (FEC, ACD, Sage, Cegid ou Pennylane) et l'état versement ↔ virement. Je propose de traiter gratuitement un versement d'un de vos dossiers. Ensuite : 149 € HT/mois jusqu'à 8 dossiers, sans engagement. Est-ce un sujet chez vous ?
  > — [Prénom Nom], [micro-entreprise, SIREN, adresse]. Vos coordonnées proviennent de la page publique de votre cabinet ([URL]). Pour ne plus être contacté : répondez « STOP ». Données conservées 3 ans au plus ; droits d'accès et d'opposition : [e-mail].

### Bras B — Vendeurs (secondaire : il mesure le canal DSA)
- **Cible** : **200 vendeurs**, sociétés françaises, dont le SIREN est vérifié, présents sur **au moins 2** des places ManoMano, Cdiscount, Leroy Merlin et Boulanger. La présence croisée est vérifiée par une recherche du nom.
- **Offre** : landing avec prix affiché : « Vos versements marketplace rapprochés chaque mois et livrés à votre comptable ».
  - **Accès fondateur** : la carte est enregistrée via Stripe en mode *setup*, **0 € débité** avant la livraison du premier mois rapproché, résiliable à tout moment.
  - Le premier mois est traité à la main.
- **Tarif A/B** : **59 € HT/mois** contre **89 € HT/mois**.
- **Coût** : 10 € (landing statique) ; ≈ 10 h de liste et 3 h d'envois.
- **Message** :
  > **Objet : vos versements [ManoMano] en écritures comptables**
  > Bonjour, chaque virement [ManoMano] mélange ventes, commissions, frais et retours. Je propose de découper chaque mois vos versements en écritures prêtes pour votre comptable (ou Pennylane), rapprochées du virement : 59 € HT/mois, premier mois traité à la main avant tout débit. Détails et prix : [lien]. Combien de temps y passez-vous aujourd'hui ?
  > — [identité, SIREN, adresse]. Coordonnées issues de votre page vendeur publique sur [ManoMano] (art. 30 DSA). Pour ne plus être contacté : « STOP ». Droits : [e-mail].

### Indicateurs et seuils

| Indicateur | GO | ITÉRER | STOP | Justification |
|---|---|---|---|---|
| A. Réponses positives (demande d'info ou d'audit) / 60 cabinets, à S4 | ≥ 6 (10 %) | 3-5 | ≤ 2 | Un CAC de 600 € représente ≈ 17 h par cabinet. Sous 3 réponses pour 60 contacts, chaque cabinet signé coûterait plus de 35 h de prospection [E] |
| A. Audits gratuits réalisés sur de vrais exports | ≥ 3 | 1-2 | 0 | Mesure l'accès aux données et la faisabilité du parsing « CSV d'abord » |
| A. **Pilotes payés** (1er mois prépayé ≥ 99 €), **à S10** | **≥ 2** | 1 | 0 | L'abonnement mensuel est l'engagement normal à ce prix. 2 cabinets d'environ 5 dossiers valent environ 10 vendeurs. S10, et non S4, pour tenir compte du cycle de 1 à 3 mois (corrige le défaut relevé par redteam3 §2.1) |
| B. Taux de réponse / 200 vendeurs | ≥ 4 % | 1,5-4 % | < 1,5 % | À 59 €/mois, le CAC cible est de 300 € (≈ 8 h). Sous 1,5 %, les heures de liste par client explosent [E] |
| B. **Cartes enregistrées** pour l'accès fondateur | **≥ 4** (2 %) | 1-3 | 0 | Pour un abonnement mensuel à 59 €, l'essai avec carte est l'engagement standard ; 4 cartes représentent ≈ 240 € de MRR potentiel pour ≈ 13 h |
| Qualitatif (≥ 8 conversations, bras confondus) | ≥ 50 % hors Pennylane **ou** insatisfaits de l'outil actuel | — | ≥ 60 % équipés et satisfaits (Order Invoicer, cabinet, n8n) | Teste directement le segment |

**Décision.**
- **GO** : pilotes payés A ≥ 2, **ou** (A = 1 **et** B ≥ 4 cartes).
- **STOP** : A = 0 pilote **et** B ≤ 1 carte.
- **Sinon ITÉRER** : changer de segment, par exemple uniquement les cabinets sous ACD ou Sage, ou le prix.

## N06-6. Économie unitaire révisée (offre cabinet, CSV d'abord)

```json
{"id":"P8-N06","titre":"Rapprochement des versements marketplaces FR, offre cabinet multi-dossiers CSV-first (FEC/ACD/Sage/Cegid/Pennylane)","prix_mensuel_ht":149,"cout_variable_client_mois":5,"frais_paiement_pct":0.015,"frais_paiement_fixe":0.25,"fixes_mensuels":70,"heures_fixes_mois":10,"heures_par_client_mois":1.0,"churn_mensuel":0.02,"cac":600}
```

| Clé | Valeur | Justification | Statut |
|---|---|---|---|
| prix_mensuel_ht | 149 | Plan cabinet jusqu'à 8 dossiers ; ancres Order Invoicer Growth 149 € et Synchron.io 150 € et plus | [F] ancres P7DN06-P03/P04 ; [H] acceptation |
| cout_variable_client_mois | 5 | Stockage des relevés de 5 à 8 dossiers, e-mails | [E] |
| frais_paiement_pct / fixe | 0,015 / 0,25 | Stripe, cartes européennes (repris du DD, non revérifié) | [E] |
| fixes_mensuels | 70 | Hébergement, domaine, e-mail, RC pro au prorata ; pas d'API payante | [E] |
| heures_fixes_mois | 10 | Parsers CSV de 4 ou 5 sources et règles, sans maintenance d'API | [E] |
| heures_par_client_mois | 1,0 | Support et contrôle des écarts sur 5 à 8 dossiers | [E] |
| churn_mensuel | 0,02 | Le cabinet garde ses dossiers ; outil inséré dans la clôture mensuelle | [H] |
| cac | 600 | ≈ 17 h de prospection, d'audit gratuit et de démo par cabinet, valorisées à 35 €/h | [E], vérifié par le test (seuils A) |

**Simulation** (`micro_saas_sim.py`) : à 3 000 € de MRR, **21 cabinets**, **31 h par mois**, net fondateur ≈ 2 181 € ; valorisation centrale ≈ 79 k€ [E]. Pour comparer : le DD donnait 51 clients et 47 h par mois.

## N06-7. Ce qui la rendrait excellente / ce qui la ferait abandonner

- **Excellente** :
  - au moins 2 cabinets payent un pilote, dont au moins 1 sous ACD, Sage ou Cegid ;
  - les exports CSV de 3 marketplaces sont parsés sans retouche manuelle 2 mois de suite ;
  - au moins 1 cabinet demande une extension à d'autres dossiers ;
  - Pennylane répond à la demande de partenariat en moins de 6 semaines.
- **Abandon** :
  - 0 pilote payé à S10 et au plus 1 carte côté vendeurs ;
  - au moins 60 % des interlocuteurs déjà équipés et satisfaits ;
  - les exports back-office changent de format plus d'une fois par trimestre ;
  - les cabinets refusent de payer plus de 49 €/mois pour 8 dossiers, ce qui rendrait l'économie intenable : il faudrait plus de 60 cabinets.

---

# PISTE N04 — Application Jira (Forge) de justification du temps R&D (CIR/CII)

## N04-1. Canal vérifié

### a) Atlassian Marketplace

| Élément | Constat | Statut |
|---|---|---|
| Délai officiel | **10 à 15 jours ouvrés** pour toute nouvelle app publique ; mises à jour ultérieures sans réapprobation, sauf exceptions | [F] P8F-P28 |
| Délai réel | Apps Forge bloquées en « Submitted » **plus de 2 semaines**, et **plusieurs mois** dans un autre fil ; position dans la file invisible | [F] P8F-P29, P30 ; [F faible] P31 |
| Prérequis | Questionnaires de sécurité, onglets confidentialité et sécurité | [F] P8F-P30 |
| Version minimale | Autorisée si l'app fait ce qu'annonce sa fiche ; une app **gratuite** doit « apporter une fonction utile telle quelle » | [F] P8F-P28 |
| Fiche « bientôt disponible », liste d'attente | **Aucune option trouvée** ; les listings privés sont documentés pour Connect, pas pour Forge | [F] P8F-P32 |
| Statistiques visibles | Installations publiques par fiche, qui incluent les versions gratuites et privées ; écarts et incident de comptage en 2026 ; suivi tiers quotidien (Built with Forge) | [F] P8F-P33, P34 |
| Essai et facturation | Essai cloud de 30 jours ; conversion automatique en payant sur les sites à facturation mensuelle | [F faible] P8F-P35 |
| Vente hors Atlassian | Non tranchée (question ouverte sur le forum) | [F] P8F-P36 |
| Commission et transfert | 0 % jusqu'à 1 M$ ; transfert d'app documenté | [F] P7DN04-P35, P40 |

**Conclusion.** La Marketplace est un canal **de distribution après validation**, pas un canal de test. On ne peut pas y mesurer la demande sans livrer une app fonctionnelle, et il faut compter 3 à 8 semaines d'approbation [E, d'après P28-P30]. Avant tout code, on peut toutefois lire la **demande de la catégorie** avec les suivis tiers d'installations (P8F-P34). L'état connu, environ 100 installations cumulées pour les apps fiscales R&D (P7DN04-P02, P03), reste défavorable.

### b) Listes publiques de startups susceptibles de déclarer le CIR

| Liste | Format | Entrées | Champs | Statut |
|---|---|---|---|---|
| **Organismes agréés CIR/CII** (MESR) | Open data **CSV/XLS** | Non relevé ; hors organismes ayant fait opposition | Raison sociale, probablement SIREN et adresse (non vérifié) | [F] P8F-P46 |
| **Lauréats i-Lab, i-Nov** (France 2030) | Communiqués et PDF régionaux nominatifs | 147 (2024/2025, dont 62 i-Lab) ; 109 (cérémonie 2026) ; 73 (i-Nov, 7e vague) | Nom, projet, région ; e-mail à trouver sur le site | [F] P8F-P47, P48 |
| Station F, French Tech | Aucun annuaire public téléchargeable trouvé | ≈ 1 000 startups à Station F à un instant donné | — | [F] P8F-P49 (non trouvé) |
| Déclarants CIR, JEI | Secret fiscal, pas de liste | 29 720 déclarants en 2023 | — | [F] P7DN04-P32 |

- **Échantillon exploitable** : ≈ 250 à 330 lauréats sur 3 vagues, dont **≈ 80 à 150 à dominante logicielle** et probablement sur Jira [E/H].
- Proxy complémentaire : les offres d'emploi qui mentionnent Jira et R&D [E].
- Les agréés CIR sont des sociétés **qui font de la R&D pour d'autres**. Ils sont souvent eux-mêmes déclarants, et ce sont des prescripteurs possibles [E].

**Base légale.**
- E-mail B2B en opt-out, lié à la fonction : CEO, CTO, DAF (P7DN04-P46).
- Information au titre de l'article 14 et opposition dès le premier envoi (P8F-P26).
- Une adresse nominative reconstituée n'est utilisable qu'après un test d'intérêt légitime ; il vaut mieux viser le formulaire ou l'adresse générique (P8F-P26).
- Pas de téléphone [H] (P8F-P27).
- CAN-SPAM, CASL et PECR : hors champ, la cible est française.

### c) SEO (pages qui rankent, échantillon indicatif)

| Requête | Ce qui ressort | Lecture |
|---|---|---|
| « justificatif temps CIR », « feuille de temps CIR modèle » | **Shine** (néobanque) : landing « modèle de feuille de temps CIR » gratuit, plus un article ; modèles génériques (Créer Entreprise, Harvest, Clockify, Microsoft) | Intention « modèle gratuit » **prouvée par l'existence d'un aimant concurrent** ; concurrence d'un domaine fort [F] P8F-P37, P38 |
| « Jira CIR », « Jira crédit d'impôt recherche » | **Aucune page propre à Jira** ; Leyton, Appvizer, Shine, amendements de l'Assemblée nationale | Créneau libre ; volume probablement faible [F] P8F-P39 ; [H] volume |
| Équivalent anglais (R&D tax credit + Jira) | Tempo, SABI, Chrono, Everhour, Keypup, Handled Time, ClickTime | Saturé, hors cible [F] P8F-P40 |

**Lecture [E].** Un modèle **« tableau des temps CIR par opération, version Jira »**, avec XLSX et guide JQL, se différencie du modèle Shine, qui est générique. Il peut se positionner seul sur les requêtes « Jira + CIR ». Il faut 3 à 6 mois avant d'en tirer du trafic : ce n'est pas un indicateur décisif sur 8 semaines.

## N04-2. Frustrations vérifiables

| Source | Citation ou fait | Id |
|---|---|---|
| **TA de Paris, 5 mai 2026** | des feuilles de temps journalières, un tableau et des captures « ne permettaient pas de rattacher de manière suffisamment précise […] le temps consacré par chacun des employés aux projets éligibles au CIR » | P8F-P41 |
| Leyton (cabinet) | renseigner les temps régulièrement « pour éviter de devoir les reconstituer a posteriori » ; affaire Cellectis, avec un tableau annuel en pourcentages contesté | P8F-P39 |
| Atlassian Community (2021) | question « Structuring Jira for automated time tracking for R&D Credits », restée **sans réponse** | P8F-P42 |
| Chrono (éditeur SR&ED) | « Jira suit les tickets, pas l'effort réel » (argument commercial) | P8F-P44 |
| Avis sur Tempo, Clockwork ou MyCIR qui portent sur le CIR | **Non trouvé** | — |
| Reddit, forums de fondateurs sur les temps reconstitués | **Non trouvé** | — |

**Lecture.** La douleur est **juridiquement prouvée** : le rattachement précis du temps aux projets est le motif de rejet. Elle n'est **pas exprimée par des utilisateurs** envers un outil. Le produit devrait répondre exactement au motif du TA de Paris, avec un rattachement ticket → opération par personne et un gel mensuel [E].

## N04-3. Segment insuffisamment servi : les startups qui déclarent seules

| Élément | Preuve | Lecture |
|---|---|---|
| Le segment existe | En 2019, 34,78 % des non-accompagnées contrôlées contre 66,67 % des accompagnées : la population « sans cabinet » est réelle (P8F-P51) ; Icypeas déclare en autonomie depuis 2021 (P8F-P50) | [F] |
| Qui le sert | **MyCIR** (plateforme et experts ; 2 500 € HT/an en 2023, P7DN04-P20) ; **Self & Innov** (autodiagnostic gratuit, P8F-P52) ; **modèles gratuits** (Shine, P8F-P37) ; Tempo et Clockwork pour le temps brut (P7DN04) | [F] |
| Ce qui manque | Aucun outil trouvé ne relie les **worklogs et epics Jira** à des **opérations CIR** avec un gel mensuel et un export aligné sur le classeur MESR | [absence, H] |
| Prix | Entre le gratuit (modèle Excel, Clockwork) et 2 500 €/an (MyCIR) ; une app à 290-490 €/an se loge dans cet écart | [E] |

**Différenciation réalisable en solo [E].** La présentation en opérations CIR, le français, le **gel mensuel opposable** et l'export « tableau des temps par personne × opération × mois » aux intitulés MESR. Ne **jamais** qualifier l'éligibilité, pour ne pas faire de conseil fiscal.

## N04-4. Support, maintenance, dépendance, transférabilité [E]

- **Maintenance** : 8 à 12 h par mois : Forge, trame MESR annuelle, loi de finances (P7DN04).
- **Support** : saisonnier, de mars à mai ; ≈ 0,3 h par client et par mois, lissé sur l'année.
- **Dépendance au fondateur** : moyenne. Le savoir porte sur la mise à jour annuelle de la trame, documentable.
- **Transférabilité** : bonne. Transfert d'app par ticket, clients sans migration Stripe (P7DN04-P40). L'incitation à 0 % ne suit pas l'app.

## N04-5. Expérimentation sans développement (fenêtre décembre 2026 – janvier 2027)

**Pourquoi cette fenêtre.** La décision « suivre proprement les temps 2027 » se prend en début d'exercice, et la préparation du dépôt de mai 2027 commence en janvier [E]. Le test **ne vend pas** de rattrapage CIR 2026, qui est une reconstitution déconseillée (redteam3 §2.2).

### Dispositif
1. **Aimant SEO** (6 à 8 h) : page « Modèle de tableau des temps CIR par opération, avec export Jira ».
   - Contenu : XLSX, guide JQL pour exporter les worklogs par epic, check-list issue du TA de Paris 2026.
   - Téléchargement contre e-mail, avec une case d'abonnement **séparée et non pré-cochée**.
2. **Landing avec prix** (4 h) : « Vos temps R&D déjà dans Jira, rattachés à vos opérations CIR et figés chaque mois ».
   - Deux appels à l'action :
     - **Précommande fondateur annuelle, remboursable** : intégralement si l'app n'est pas publiée sur la Marketplace Atlassian au 31/03/2027, ou sur simple demande avant usage.
     - **Liste d'attente avec prix affiché.**
   - **Prix A/B** : **490 € HT/an** contre **290 € HT/an** pour 25 utilisateurs au plus.
   - Après publication, la précommande serait honorée par un code promotionnel Marketplace ou remboursée [H : fonctionnement des codes à vérifier, cf. P8F-P36].
3. **Prospection** (≈ 20 h) : **150 contacts** sur 8 semaines.
   - ≈ 100 startups logicielles lauréates i-Lab ou i-Nov de 2024 à 2026 (P8F-P47, P48) ;
   - ≈ 30 sociétés logicielles agréées CIR (open data, P8F-P46) ;
   - ≈ 20 experts-comptables orientés startups, comme prescripteurs.
   - 1 envoi et 1 relance, à l'adresse générique ou par le formulaire.
- **Coût** : ≈ 10 à 30 € (domaine, landing statique, frais Stripe sur les précommandes) ; **≈ 35 à 45 h**.

### Message prêt à l'emploi
> **Objet : CIR 2027 : vos temps R&D sont déjà dans Jira**
> Bonjour, en mai 2026 le TA de Paris a écarté des feuilles de temps journalières faute de rattachement précis du temps de chaque salarié aux projets éligibles. Je prépare une app Jira qui rattache vos epics à vos opérations CIR, fige chaque mois les temps par personne et exporte le tableau attendu par votre cabinet ou le contrôleur. Elle ne qualifie pas l'éligibilité. Modèle gratuit et prix (290 à 490 € HT/an, précommande remboursable) : [lien]. Comment avez-vous produit votre tableau des temps l'an dernier ?
> — [Prénom Nom, micro-entreprise, SIREN, adresse]. Coordonnées issues de [liste publique des lauréats i-Lab / site de la société]. Pour ne plus être contacté : « STOP ». Droits : [e-mail].

### Indicateurs et seuils (arrêt au 31 janvier 2027)

| Indicateur | GO | ITÉRER | STOP | Justification |
|---|---|---|---|---|
| **Précommandes annuelles payées** (≥ 290 €) | **≥ 3** (2 % de 150) | 1-2 | 0 | Pour un logiciel annuel à 290-490 €, le prépaiement annuel est l'engagement normal. Il est remboursable, donc le risque perçu est minimal : 0 sur 150 signale une demande insuffisante à ce prix par ce canal. Entonnoir : ≈ 5 % de réponses, soit 7 à 8 conversations, dont ≈ 40 % prépayent [H] |
| Inscriptions en liste d'attente avec prix affiché (prospection et SEO) | ≥ 20 | 8-19 | < 8 | Signal plus faible, sans argent : il sert seulement à ITÉRER |
| Téléchargements du modèle | Suivi seulement | — | — | Le SEO met 3 à 6 mois : non décisif sur 8 semaines |
| Heures de prospection par précommande | ≤ 8 h | 8-15 h | > 15 h | CAC cible de 250 € ≈ 7 h à 35 €/h |
| Qualification (au moins 6 conversations) | ≥ 50 % sur Jira Cloud **et** acceptent des worklogs ou un rattachement par epic | 30-50 % | < 30 % | Sans données dans Jira, il n'y a pas de produit |
| Satisfaction de l'existant | — | — | ≥ 60 % déclarent que le cabinet ou MyCIR fournit déjà les temps | Substitution par le service inclus |

**Décision.**
- **GO** : au moins 3 précommandes **et** qualification ≥ 50 %.
- **STOP** : 0 précommande **et** moins de 8 inscriptions.
- **Sinon ITÉRER** : prix à 290 €, ou cible déplacée vers les experts-comptables prescripteurs.

## N04-6. Économie unitaire révisée (abonnement annuel)

```json
{"id":"P8-N04","titre":"App Jira Forge : tableau des temps CIR par opération, gel mensuel, abonnement annuel","prix_mensuel_ht":41,"cout_variable_client_mois":1,"frais_paiement_pct":0.02,"frais_paiement_fixe":0,"fixes_mensuels":60,"heures_fixes_mois":10,"heures_par_client_mois":0.3,"churn_mensuel":0.03,"cac":250}
```

| Clé | Valeur | Justification | Statut |
|---|---|---|---|
| prix_mensuel_ht | 41 | 490 €/an ÷ 12, variante haute du test. Ancres : modèles gratuits (P8F-P37), Clockwork gratuit sous 10 utilisateurs, MyCIR 2 500 €/an | [H] prix ; [F] ancres |
| cout_variable_client_mois | 1 | Calcul et stockage Forge | [H] |
| frais_paiement_pct / fixe | 0,02 / 0 | 0 % de commission Atlassian jusqu'à 1 M$ ; ≈ 2 % de change et de virement | [F] P7DN04-P35 ; [E] |
| fixes_mensuels | 60 | Domaine, site, e-mail, RC pro au prorata | [E] |
| heures_fixes_mois | 10 | Forge, trame MESR annuelle, contenu | [E] |
| heures_par_client_mois | 0,3 | Support saisonnier lissé | [E] |
| churn_mensuel | 0,03 | Contrat annuel : ≈ 30 % de non-renouvellement par an (startups qui disparaissent, retour au cabinet), soit ≈ 3 % par mois | [H] |
| cac | 250 | ≈ 7 h par client (prospection et démo asynchrone), à tester (seuil « heures par précommande ») | [E] |

**Simulation** : à 3 000 € de MRR, **74 instances**, **32 h par mois**, net fondateur ≈ 2 140 € ; valorisation centrale ≈ 69 k€ [E]. 74 instances représentent 1,6 à 3,7 % d'un parc estimé de 2 000 à 4 500 instances, estimation elle-même [H] (P7-DD-N04).

## N04-7. Ce qui la rendrait excellente / ce qui la ferait abandonner

- **Excellente** :
  - au moins 3 précommandes à 490 €, et au moins 1 expert-comptable qui s'engage à présenter l'outil à au moins 5 clients ;
  - au moins 50 % des prospects ont des worklogs ou des epics exploitables ;
  - le suivi tiers montre une catégorie « timesheet R&D / CapEx » en croissance ;
  - approbation Marketplace en moins de 4 semaines.
- **Abandon** :
  - 0 précommande sur 150 contacts, alors que l'offre est remboursable ;
  - au moins 60 % des prospects ne saisissent rien dans Jira ;
  - le cabinet ou MyCIR fournit déjà le tableau ;
  - Tempo publie un modèle CIR ;
  - réforme du CIR au PLF 2027 ;
  - fin de l'incitation à 0 % pour les petits partenaires.

---

# Comparaison N06 / N04

| Critère | N06 (cabinets, CSV d'abord) | N04 (app Jira CIR) |
|---|---|---|
| Canal sans réseau le plus solide | Pages vendeurs, avec **obligation légale** d'afficher l'identité (DSA, P8F-P07), et pages publiques de cabinets e-commerce | Lauréats i-Lab et i-Nov, et open data des agréés CIR (P8F-P46 à P48) |
| Marketplace d'intégration | Pennylane : conditions et délai non publics ; contournable par la clé API du client (P8F-P06) | Atlassian : 10-15 jours ouvrés annoncés, des semaines à des mois observés ; pas de fiche « bientôt disponible » (P8F-P28 à P32) |
| SEO | Longue traîne « [marketplace] + comptabilité » quasi vide (P8F-P19 à P21) ; volume inconnu | « Jira + CIR » libre ; « modèle feuille de temps CIR » tenu par Shine (P8F-P37, P39) |
| Frustration sourcée | **Aucune** envers les outils (non trouvé) | **Juridique** : TA de Paris 2026 (P8F-P41) ; aucune envers les outils |
| Segment mal servi | Cabinets hors Pennylane (ACD, Sage, Cegid, FEC) [H fort] ; opérateurs Mirakl secondaires **affaiblis** (P8F-P14) | Startups qui déclarent seules, entre l'Excel gratuit et MyCIR à 2 500 € [H] |
| Engagement mesuré | Mois de pilote prépayé (cabinets) ; carte enregistrée (vendeurs) | Prépaiement annuel remboursable ; liste d'attente avec prix |
| Durée du test | 6-10 semaines, possible **dès novembre** | 8 semaines, **décembre-janvier** (saisonnier) |
| Coût du test | ≈ 25 € + 40-50 h (2 bras) | ≈ 10-30 € + 35-45 h |
| Clients pour 3 k€ de MRR | **21** cabinets | **74** instances |
| Heures par mois à 3 k€ | 31 | 32 |
| Valorisation centrale à 3 k€ [E] | ≈ 79 k€ (concentration à surveiller) | ≈ 69 k€ (transfert facile) |
| Principal risque | Cabinets à la fois canal et concurrent ; crédibilité comptable du porteur | Demande d'app non prouvée (≈ 100 installations pour la catégorie) ; substitution par le cabinet |

**Lecture d'ensemble.**
- Après révision, les deux pistes ont des charges d'exploitation **comparables** (≈ 31-32 h par mois à 3 k€). N06 exige **3,5 fois moins de clients**, mais des clients plus difficiles à signer (cabinets).
- Les fenêtres de test **ne se chevauchent pas**. **N06 peut partir tout de suite** (novembre à mi-janvier). Pour **N04**, on prépare la landing et le modèle en novembre, puis on prospecte de décembre à janvier.
- Mener les deux en séquence coûte ≈ 80 h et moins de 60 €, et produit pour chacune un signal de paiement au prix normal. C'est précisément ce qu'aucune phase précédente n'a obtenu (redteam3 §1).
