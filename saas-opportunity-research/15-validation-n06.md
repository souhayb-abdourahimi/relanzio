# 15 — Validation commerciale de N06 avant tout développement (phase 9)

Date : 2026-10-30. Ce dossier ne concerne que **N06** : outil de traitement des relevés de versement marketplace, pour cabinets d'expertise comptable multi-dossiers.

**Garanties de la phase 9** :
- aucune exploration générale ;
- aucun contact pris, aucune facturation ;
- aucune donnée comptable réelle collectée.

**Étiquettes** : **[F]** fait vérifié (source dans `06-registre-preuves.csv`), **[E]** estimation, **[H]** hypothèse.

**Limite** : aucune page n'a pu être ouverte (WebFetch bloqué). Toutes les sources sont des extraits de moteur de recherche. Les textes de loi et les arrêts n'ont pas été lus en entier.

---

## 0. Ce que la phase 9 change : à lire en premier

| Hypothèse de la phase 8 | Résultat de la phase 9 | Conséquence |
|---|---|---|
| Créneau « opérateurs Mirakl secondaires » | **Effondré** : Order Invoicer annonce plus de 18 marketplaces, dont Leroy Merlin, Castorama, Decathlon, Leclerc et un connecteur Mirakl générique [F `_work/P9-concurrents.md`] | Abandonné |
| Créneau « cabinets hors Pennylane » | **Très affaibli** : Order Invoicer exporte vers Cegid, ACD, EBP, Sellsy, Axonaut, Abby, Odoo [F]. Restent non trouvés : Quadra, Sage FR, FEC générique | Ne suffit plus comme différenciation |
| Pilote « concierge » où le fondateur traite les versements à la main | **Juridiquement exposé** [F/H `_work/P9-juridique.md`]. Produire des écritures pour autrui relève du monopole de l'expertise comptable (ord. 45-2138, art. 2 et 20 ; Cass. 1995). La sous-traitance à un cabinet a été sanctionnée pour exercice illégal, et le cabinet pour complicité (Crim. 4 oct. 2022, n° 21-85.594) | **Supprimé.** Le pilote devient un pilote **outil** : le cabinet paramètre, exécute, contrôle et importe |
| Bras B « vendeurs à 59 € » (service manuel) | **Interdit** sous forme de service. Seul un outil en libre-service, utilisé par le vendeur lui-même, reste possible | Supprimé du test |
| « FEC = format d'import universel » | **Faux.** Le FEC est un format de contrôle fiscal (art. A47 A-1 LPF) [F]. Son import est observé dans Sage 50, Génération Experts, Isacompta, EBP, Cegid Loop (API) et Pennylane en reprise ; il n'a pas été trouvé pour ACD, Quadra ni MyUnisoft [F `_work/P9-formats.md`] | Sortie du pilote : gabarit FEC 18 colonnes + Excel lisible, puis **un seul** format natif choisi après entretiens |
| 8,8 h/semaine à 21 cabinets | **Plausible seulement si** le traitement est automatisé et que moins de ~5 % des versements demandent une intervention (central 7,8 h ; haut 22,6 h) [E `P9-modele-temps.md`] | À mesurer dans le pilote |

**Ce qui reste à valider** est un **« cockpit cabinet »** des versements marketplaces français :
- **W1** : vue des versements non rapprochés de **tous** les dossiers ;
- **W3** : clôture mensuelle groupée ;
- **W2** : onboarding en série.

**W4** (contrôle des écarts de commission) est un différenciateur possible, mais sa demande n'est pas prouvée.

Ces fonctions n'ont pas été trouvées en France, ce qui ne prouve pas leur absence. Trois menaces :
- Order Invoicer peut les ajouter (sa fonction « Accounting consolidation » n'est pas décrite) ;
- Pennylane Collaboratif les couvre peut-être en partie ;
- Link My Books les a déjà pour Xero/QBO.

**Probabilité honnête que N06 survive à la validation : faible à moyenne [E].** Le test doit d'abord chercher à **l'invalider vite et à bas coût**.

---

## 1. Les quatre risques, résolus autant que possible

### Risque 1 — Order Invoicer et les workflows encore insuffisamment couverts
- Matrice complète : `_work/P9-concurrents-matrice.csv`.
- Couverture : 320 lignes « solution × fonction ».
- Valeurs : « Oui [source] / Non trouvé / Inconnu » ; aucune fonction absente n'a été inventée.

**Synthèse** :

| Solution | Marketplaces FR | Sortie comptable FR | Multi-dossiers / cabinet | Prix public |
|---|---|---|---|---|
| **Order Invoicer** | Amazon, Cdiscount, ManoMano, Fnac, Leroy Merlin, Castorama, Decathlon, Leclerc, Mirakl générique… (18+) [F] | Pennylane, Cegid, ACD, EBP, Sellsy, Axonaut, Abby, Odoo, NetSuite [F] | **Non trouvé** : facturation par connexion, lien comptable par société dans Pennylane [F] ; « Accounting consolidation » non décrite | 0 / 59 / 149 € et plus [F] |
| Synchron.io | Mirakl → Pennylane [F] | Pennylane [F] | Non trouvé | 150-350 €/mois [F] |
| Link My Books, A2X, Taxomate | Amazon, eBay, Shopify… ; **pas** Cdiscount, ManoMano, Mirakl [F] | Xero, QBO (pas de logiciel FR) [F] | **Oui** : tableau de bord partenaire, statut de clôture par client [F] | Remises par palier [F] |
| Pennylane (natif / Collaboratif) | Connecteur Amazon « en bêta » selon un partenaire [F] | — | Inconnu (à tester) | — |

**Workflows insuffisamment couverts (France)** : W1, W2, W3 (confiance moyenne qu'ils ne soient pas couverts), W4 (moyenne à haute), W5 et W6 (faible). Détail dans `_work/P9-concurrents.md` §4.

**Trois essais à faire AVANT toute prise de contact** (étape 0) :
1. **Order Invoicer, offre gratuite** : peut-on gérer plusieurs sociétés sous un même compte ? Que fait « Accounting consolidation » ? Qu'exporte-t-il vers ACD et Cegid : des écritures de **versement** ou seulement des factures de commande ?
2. **Démo Pennylane Collaboratif** : les transactions marketplace non rapprochées sont-elles visibles **par dossier**, et **sur tous les dossiers** ?
3. **Link My Books** : son tableau de bord partenaire (modèle de ce qu'il faudrait faire) ; prévoit-il des marketplaces françaises ?

**Règle** : si l'essai 1 ou 2 montre une vue multi-dossiers satisfaisante, **ABANDON de N06**, sans prospection.

### Risque 2 — Formats d'import réellement acceptés
Source : `_work/P9-formats.md`.

| Logiciel | Import d'écritures (formats observés) | Import FEC | API publique | Confiance |
|---|---|---|---|---|
| ACD (iSuite) | Format « IN ZIP » non publié ; import paramétrable non documenté publiquement | Non trouvé | Non trouvée | Faible : **point le plus bloquant si ACD domine** |
| Sage 100 / 50 / Génération Experts | Imports paramétrables (.ema pour Sage 100) | Sage 50 et Génération Experts : vu | Non | Moyenne |
| Cegid Expert / Loop / Quadra | **TRA** (Cegid Expert/Loop, également lu par MyUnisoft) ; **ASCII typé** (Quadra) | Cegid Loop par API (`importFec`) | Cegid Loop (`importPerso`, `importFec`) | Moyenne |
| Pennylane | API `ledger_entries` ; FEC en reprise de dossier | Reprise seulement | Oui | Moyenne |
| Isacompta, EBP | Imports paramétrables | Vu | — | Moyenne |

- **Aucune part de marché chiffrée** des logiciels chez les cabinets n'a été trouvée.
- **Exports des marketplaces** : seuls Amazon Settlement V2 et Mirakl TL02 sont documentés publiquement. Cdiscount (Octopia), ManoMano et Fnac : non trouvés.
- **Décision pour le pilote** : sortie au gabarit FEC 18 colonnes + Excel ; puis **un seul** format natif, choisi selon les entretiens (TRA si Cegid ou MyUnisoft, ASCII si Quadra ; si ACD, demander d'abord la spécification à l'éditeur).
- **Critère** : si au moins 3 des 5 premiers cabinets intéressés confirment importer un FEC **en cours d'exercice**, le gabarit FEC suffit pour le pilote.

### Risque 3 — Limites juridiques, confidentialité, RGPD
Source : `_work/P9-juridique.md`. **Ce n'est pas un conseil juridique : validation écrite par un avocat, et idéalement le conseil régional de l'Ordre, avant tout pilote sur données réelles.**

| | |
|---|---|
| **Interdit ou exposé pénalement** | 1. Produire des écritures (affectation aux comptes, journal, FEC, fichier d'import) pour un vendeur.<br>2. Faire la même chose pour un cabinet en sous-traitance (Crim. 4 oct. 2022 : prestataire et cabinet condamnés).<br>3. Rapprocher et lettrer pour autrui.<br>4. Se présenter comme « comptable » ou « expert ».<br>5. Charger des relevés réels dans une IA grand public.<br>6. Réutiliser des données de pilote en démonstration. |
| **Possible sous conditions** [H] | Pilote **outil** :<br>- le cabinet paramètre comptes et règles ;<br>- **un collaborateur du cabinet exécute** sur données réelles, contrôle et importe ;<br>- le fondateur ne fait que l'assistance technique (partage d'écran, jeux fictifs) et, sous contrat, un **diagnostic de format sans production d'écritures** ;<br>- facturation en « licence d'essai / assistance logicielle ». |
| **Documents avant pilote** | Contrat de sous-traitance RGPD (art. 28), avec liste des sous-traitants ultérieurs (hébergeur UE) et suppression en fin de pilote ; accord de confidentialité ; conditions de pilote avec **clause de non-exercice**, responsabilité plafonnée au prix du pilote et obligation de contrôle par le cabinet ; registre art. 30.2 ; politique de conservation (durée du pilote + 30 jours) ; note « AIPD non requise » argumentée ; politique de sécurité ; charte « pas d'IA sur données réelles » ; RC pro avec activité déclarée « édition et assistance logicielle » ; consultation d'un avocat. |
| **Démonstrations** | Uniquement sur **données fictives générées** à partir de la structure publique des exports. La pseudonymisation ne suffit pas, car les données restent personnelles [F]. |
| **Prospection** | E-mail B2B aux cabinets sans consentement préalable, si l'objet concerne la profession, avec opposition dans chaque message et information art. 14 (source des coordonnées) [F]. **Ne jamais proposer de « sous-traiter la saisie ».** |

### Risque 4 — 8,8 h/semaine : décomposition et réalisme
Source : `P9-modele-temps.md`, généré par `_work/p9_temps.py`.

| Poste (h/mois, 21 cabinets) | Bas | Central | Haut |
|---|---|---|---|
| Acquisition (remplacement du churn) | 3,8 | 7,1 | 15,8 |
| Intégration (nouveaux cabinets et dossiers) | 1,7 | 5,4 | 15,1 |
| Rapprochement (contrôle humain des versements automatisés) | 0 | 0 | 9,2 |
| Gestion des exceptions | 1,1 | 6,1 | 27,7 |
| Maintenance | 3,0 | 6,0 | 13,0 |
| Support | 3,5 | 7,0 | 14,0 |
| Administration | 1,5 | 2,0 | 3,0 |
| **Total h/semaine** | **3,4** | **7,8** | **22,6** |
| Versements/mois | 315 | 614 | 1 109 |

**Lecture** :
- **Le modèle « outil » imposé par le droit est aussi celui qui rend l'exploitation solo possible.** Le cabinet traite ses exceptions dans l'outil. Le fondateur corrige des règles et des parsers, il ne retraite pas des versements.
- L'objectif d'environ 8 h/semaine **tient seulement si** :
  - le traitement est entièrement automatisé ;
  - moins de ~5 % des versements sont des exceptions qui remontent au fondateur ;
  - les formats d'export bougent au plus 1 fois par mois toutes sources confondues.
- **Ces trois paramètres sont inconnus.** Le protocole du §7 les mesure.

---

## 2. Liste des cabinets cibles
Fichiers : `_work/P9-cabinets.csv` et `_work/P9-cabinets.md`.

- **22 cabinets vérifiés sur les 30 demandés. Il en manque 8.** Aucun cabinet n'a été ajouté sans preuve publique de positionnement marketplace.
- Deux cabinets ont été écartés :
  - un profil d'annuaire dont l'URL contient « test014 », probablement fictif ;
  - un candidat supplémentaire, expert-comptable-tpe.fr, au statut de cabinet non vérifié.

| Priorité | Cabinets |
|---|---|
| **A** (spécialisés marketplaces, taille petite ou moyenne) | Hayot Expertise (Paris), Nexco (Paris 8e), Auctus Compta (IDF), Kapsens (Nantes), GT Expertise (Saint-Mandé), E-Cab (Bas-Rhin), Belho Xper (Lyon), Cantini (Bordeaux) |
| **B** | HR Associés, Excilio, Eurofiscalis, AdvizExperts, Kardynal, Collectif EARN |
| **C** (gros réseaux ou acteurs en ligne, moins accessibles) | Cecca, Baker Tilly, Cerfrance Gascogne Occitane, L-Expert-Comptable.com, LS Compta, Keobiz, Dougs, Amarris E-commerce |

**Limites, à traiter par vous avant tout envoi** :
- **Coordonnées professionnelles « non relevées » pour les 22** : aucune page contact ni e-mail n'apparaît textuellement dans les extraits. Relevez à la main l'adresse générique ou le formulaire sur le site de chaque cabinet.
- **Inscription à l'Ordre « non vérifiée »** : contrôlez-la sur l'annuaire de l'Ordre des experts-comptables.
- Pour compléter jusqu'à 30, deux pistes manuelles :
  - l'annuaire de l'Ordre (mot-clé « e-commerce ») ;
  - les pages « expert-comptable e-commerce + [ville] » pour Lille, Marseille, Toulouse, Rennes, Nice, Montpellier, Grenoble.
- **Hayot Expertise est prioritaire pour l'apprentissage** : sa page décrit presque exactement la douleur visée. Il a toutefois déjà automatisé en interne (n8n) : c'est à la fois une bonne source d'entretien et un concurrent de fait.

## 3. Matrice des fonctionnalités concurrentes
Voir le §1, risque 1, et `_work/P9-concurrents-matrice.csv` (champs `solution, fonction, valeur, source_url, mode_acces, date, notes`). « Non trouvé » ne signifie jamais « absent ».

## 4. Questionnaire de découverte (25 min)
Règles :
- comportements passés, pas d'intentions ;
- pas de présentation avant la question 14 ;
- verbatims notés ;
- **aucune donnée client demandée ni reçue**.

**Bloc 1 — Qualification**
1. Combien de dossiers clients vendent sur des marketplaces ? Lesquelles reviennent le plus ?
2. Quel logiciel de production pour ces dossiers (version, local ou SaaS) ? Le même pour tous ?
3. Qui les traite (collaborateur, assistant, expert) ? À quel rythme (mensuel, trimestriel, annuel) ?

**Bloc 2 — Workflow actuel (« montrez-moi la dernière fois »)**
4. Dernier dossier marketplace traité : quels fichiers avez-vous récupérés, et auprès de qui ?
5. Comment avez-vous transformé un versement en écritures (Excel, saisie, outil, macro, n8n, connecteur) ?
6. Comment avez-vous rapproché le versement du virement ? Que faites-vous quand ça ne tombe pas juste ?
7. Comment traitez-vous la TVA (FR, UE, OSS, marketplace « vendeur réputé ») ?

**Bloc 3 — Douleur mesurée**
8. Combien de temps a pris ce dossier ce mois-là ? Combien de dossiers comparables par mois ?
9. Ce temps est-il facturé au client, ou absorbé dans le forfait ?
10. Dernière erreur ou dernier écart inexpliqué : qu'est-ce que ça a coûté ?

**Bloc 4 — Solutions essayées**
11. Qu'avez-vous déjà essayé (Order Invoicer, Synchron.io, connecteurs Pennylane, A2X, outil maison, sous-traitance) ? Gardé ou abandonné, et pourquoi ?
12. Combien payez-vous aujourd'hui (outils, temps) ?
13. **Avez-vous besoin de voir l'état de tous vos dossiers marketplace au même endroit ?** Comment le faites-vous aujourd'hui ? *(test direct de W1 et W3)*

**Bloc 5 — Formats** (questions de `_work/P9-formats.md` §D)
14. Par quel format intégrez-vous aujourd'hui des écritures venues d'un outil tiers (TRA, ASCII, FEC, CSV paramétrable, API) ?
15. Importez-vous des FEC **en cours d'exercice** ?
16. Plan de comptes (411 par marketplace ? 622x pour les commissions ?) ; journal ; une écriture par versement ou par commande ?
17. Le lettrage avec le virement doit-il être fait par l'outil ou dans votre logiciel ?

**Bloc 6 — Engagement** (seulement après les blocs 1 à 5)
18. Présentation en 2 minutes du cockpit cabinet. Qu'est-ce qui est utile, et qu'est-ce qui ne l'est pas ?
19. Démonstration de 20 min sur données fictives ? → **démo réservée**
20. Quel prix mensuel jugeriez-vous raisonnable ? Cher ? Trop cher pour essayer ? (Van Westendorp sur des réponses réelles)
21. Accepteriez-vous un pilote payant d'un mois sur 1 ou 2 dossiers, outil exécuté par vos collaborateurs, sous accord de confidentialité et contrat RGPD ? → **intention écrite**

**Fiche remplie le jour même** :
- nombre de dossiers ;
- logiciel ;
- minutes par dossier et par mois déclarées ;
- temps facturé ou absorbé ;
- outil actuel et satisfaction (1-5) ;
- douleur (1-5, avec un verbatim) ;
- besoin multi-dossiers (oui/non, avec un verbatim) ;
- format d'import ;
- démo / intention / paiement.

## 5. Offre de pilote payant (sans promesse technique non vérifiée)
- **Objet** : mise à disposition d'un **outil de conversion des relevés de versement marketplace en fichier d'import**, avec une **vue multi-dossiers**, et assistance technique au paramétrage. **Aucune mission de tenue, centralisation ou surveillance des comptes** (clause de non-exercice).
- **Périmètre vérifié uniquement** :
  - entrée : Amazon (Settlement V2) **ou** un opérateur Mirakl (export TL02). Une seule marketplace par pilote ;
  - sortie : gabarit FEC 18 colonnes + récapitulatif Excel ;
  - **tout autre format ou marketplace est « à étudier »**, sans engagement.
- **Rôles** :
  - le cabinet fournit son plan de comptes et ses règles, exécute l'outil sur ses dossiers, contrôle et importe ;
  - le fondateur paramètre les lectures de format et assure le support à distance.
- **Durée** : 1 mois, 1 à 2 dossiers.
- **Prix** (A/B) :
  - **réservation de pilote à 99 € ou 149 € HT** pour le mois, payée d'avance ;
  - **remboursée** si le pilote ne peut pas démarrer (format non lisible, validation juridique négative) ;
  - mention « TVA non applicable, art. 293 B du CGI ».
- **Engagement du cabinet** : chronométrer son traitement actuel et son traitement avec l'outil (§7) ; donner un retour écrit à la fin du mois.
- **Avant tout pilote sur données réelles** : les 10 documents de la section risque 3, et la validation de l'avocat.
- **Avant cette validation**, l'offre se limite à la **réservation** et à la **démonstration sur données fictives**.

## 6. Page de présentation
Fichier `p9-landing/index.html` : page statique, sans traceur, en thème clair et sombre.
- **Non publiée.** Champs à compléter : identité, SIREN, adresse, URL du formulaire.
- Contenu :
  - le problème à vérifier ;
  - ce que ferait l'outil, avec un périmètre limité à Amazon et Mirakl et la sortie FEC + Excel ;
  - le pilote en 3 étapes ;
  - une FAQ (logiciels, pas d'IA sur données réelles, qui est derrière) ;
  - les mentions RGPD.
- **Mesure de l'intérêt** : visites (si publiée), demandes de démonstration via le formulaire, champs qualifiants (logiciel, nombre de dossiers, marketplaces).
- Formulations conformes à `_work/P9-juridique.md` §7.4 : jamais « tenue », « saisie », « comptabilisation », « expert » ni « IA ».

## 7. Messages de prise de contact (à envoyer seulement avec votre accord)
Base : e-mail B2B à l'**adresse générique** du cabinet ; objet en rapport avec la profession ; opposition dans chaque message ; information art. 14 ; une seule relance ; pas de pixel de suivi.

**Message 1 — premier contact (découverte, pas de vente)**
> **Objet : vos dossiers vendeurs marketplaces — 20 minutes d'échange ?**
> Bonjour,
> Votre site présente un accompagnement des vendeurs sur [Amazon / Cdiscount / ManoMano] ([URL de la page]). Je suis développeur indépendant et j'étudie, avant de construire quoi que ce soit, la façon dont les cabinets traitent les relevés de versement des marketplaces : décomposition, rapprochement, suivi sur plusieurs dossiers.
> Accepteriez-vous un échange de 20 minutes ? Je ne vends rien à ce stade et je ne demande aucune donnée client. Je partagerai la synthèse anonymisée des échanges avec chaque participant.
> [Prénom Nom] — éditeur d'outils logiciels, micro-entreprise, SIREN [xxx], [adresse].
> *Vos coordonnées proviennent de la page publique de votre cabinet ([URL]). Finalité : organiser cet échange (intérêt légitime). Conservation : 3 ans au plus. Pour ne plus être contacté : répondez « STOP ». Droits d'accès, d'opposition et d'effacement : [e-mail] ; réclamation possible auprès de la CNIL.*

**Message 2 — relance unique à J+7**
> **Objet : Re : vos dossiers vendeurs marketplaces**
> Bonjour, je me permets une seule relance : 20 minutes pour comprendre comment vous traitez les versements marketplaces de vos clients, sans démonstration commerciale. Si ce n'est pas un sujet pour vous, une réponse « non » me sera tout aussi utile.
> [signature et mentions identiques]

**Message 3 — après l'entretien (si la douleur est confirmée)**
> Merci pour notre échange. Comme convenu, je vous propose une démonstration de 20 minutes sur un **jeu de données fictives** [Amazon / Mirakl], avec un fichier au gabarit FEC et la vue de tous les dossiers. Créneaux : [x] / [y]. Aucune donnée de votre cabinet n'est nécessaire.

**Message 4 — après la démonstration (si l'intérêt est confirmé)**
> Voici la proposition de pilote : [périmètre §5]. Réservation : [99/149] € HT, remboursée si le pilote ne peut pas démarrer. Le pilote sur vos données ne commencera qu'après la signature d'un accord de confidentialité et d'un contrat de sous-traitance RGPD. Lien de réservation : [lien].

## 8. Protocole de démonstration (données fictives uniquement)
1. **Jeu de données synthétique** construit à partir de la **structure publique** des exports (Amazon Settlement V2, Mirakl TL02) :
   - 1 vendeur fictif (« SARL Démo Maison ») ;
   - 3 versements sur un mois ;
   - les cas : ventes, commissions, frais d'abonnement, 1 retour, 1 remboursement partiel, 1 retenue, 1 écart volontaire ;
   - **mention « données fictives » sur chaque écran et chaque fichier** ;
   - aucun nom réel ni identifiant réel.
2. **Ce qui est montré** :
   - (a) la décomposition d'un versement ;
   - (b) le fichier au gabarit FEC + l'Excel ;
   - (c) la **vue multi-dossiers** avec 3 dossiers fictifs ;
   - (d) l'écart mis en évidence.
   - Support possible sans développement : maquette en tableur ou en pages statiques, préparée à la main sur les données fictives.
3. **Déroulé en 20 min** : 3 min de rappel du workflow du prospect ; 10 min de démo ; 5 min d'objections ; 2 min de proposition de réservation.
4. **Interdits** :
   - importer ou afficher une donnée du prospect ;
   - promettre un format ou une marketplace non vérifiés (une demande est notée comme demande) ;
   - parler d'IA.
5. **Après** : compte rendu de 5 lignes ; proposition écrite (message 4).

## 9. Protocole de mesure du temps réel de traitement d'un dossier
Respect du cadre juridique : **c'est le collaborateur du cabinet qui traite et chronomètre** ; le fondateur mesure **son propre** temps de support et de maintenance.

1. **Référence avant l'outil** : le cabinet note, sur 1 à 2 dossiers et 1 mois, le temps actuel par versement, avec la feuille fournie (9 colonnes) :
   - réception des fichiers ;
   - préparation ;
   - décomposition ;
   - affectation des comptes et de la TVA ;
   - saisie ou import ;
   - rapprochement ;
   - exceptions (avec le type) ;
   - échanges avec le client ;
   - contrôle.
2. **Avec l'outil** (pilote) : les mêmes colonnes. Chaque versement est classé « standard » ou « exception », avec sa cause.
3. **Côté fondateur** : un journal horodaté de chaque intervention, par catégorie :
   - paramétrage ;
   - correction de parser ;
   - correction de règle ;
   - support ;
   - administratif.
4. **Mesures dérivées** :
   - minutes médianes par versement (avant et après) ;
   - taux d'exception ;
   - minutes du fondateur par dossier et par mois ;
   - nombre de types de lignes rencontrés ;
   - incidents de format.
5. **Volume minimum pour conclure** : ≥ 30 versements, ≥ 2 dossiers, ≥ 1 cabinet. En dessous : « indéterminé ».
6. **Projection** : les valeurs mesurées remplacent les paramètres `exc`, `min_exc`, `h_dos`, `min_sup` et `chg` de `_work/p9_temps.py`. On recalcule les heures par semaine à 21 cabinets.

## 10. Critères de décision

On distingue quatre niveaux de preuve. **Seul le 4e est une preuve de marché** :
1. **Entretien** : une conversation sur le comportement passé.
2. **Démonstration** : réservée et réalisée sur données fictives.
3. **Intention d'achat** : demande écrite de pilote ou lettre d'intention.
4. **Paiement** : réservation de pilote encaissée.

| Étape | Mesure | GO (passer à l'étape suivante) | CHANGER DE SEGMENT | ABANDONNER |
|---|---|---|---|---|
| **0. Essais concurrents** (semaine 1, sans contact) | Order Invoicer (offre gratuite), démo Pennylane Collaboratif, Link My Books | Aucune vue multi-dossiers satisfaisante en France | — | **Une vue multi-dossiers existe déjà** chez Order Invoicer ou Pennylane |
| **1. Entretiens** (semaines 2-6 ; 22 à 30 cabinets contactés) | Réponses, entretiens réalisés, douleur | **≥ 8 entretiens** et **≥ 4 cabinets** qui ont ≥ 3 dossiers marketplace, un temps déclaré ≥ 1 h par dossier et par mois [H sur le seuil] et un **besoin multi-dossiers exprimé** | Douleur réelle mais ailleurs : contrôle des commissions (W4), une marketplace mal servie, ou un acheteur différent (le vendeur, en outil libre-service uniquement) | < 8 entretiens après 30 contacts et 1 relance ; ou **≥ 60 % des interviewés équipés et satisfaits** ; ou < 2 cabinets avec douleur |
| **2. Démonstrations** (semaines 4-8) | Démos réalisées | **≥ 3 démos**, dont ≥ 2 suivies d'une **intention écrite** | Intérêt seulement pour un autre format ou une autre marketplace → re-cibler | 0 intention après ≥ 3 démos |
| **3. Paiement** (semaines 6-10) | Réservations de pilote encaissées (99 ou 149 €) | **≥ 2 réservations payées** + format confirmé (≥ 3 sur 5 importent un FEC en cours d'exercice, ou format natif majoritaire identifié) + **validation écrite de l'avocat** | 1 réservation → un seul cycle de 4 semaines de plus sur le segment le plus réactif | 0 réservation |
| **4. Pilote outil** (après GO 3, sur données réelles, sous contrat) | Mesures du §9 | **Taux d'exception ≤ 5 %**, minutes du fondateur ≤ 30 par dossier et par mois, temps du collaborateur réduit d'au moins 50 %, ≥ 1 cabinet qui renouvelle au tarif normal | Automatisable mais rentable seulement pour un segment (par ex. Amazon seul) → recentrer | Taux d'exception > 15 % ou plus de 2 h de fondateur par dossier et par mois : l'exploitation solo est impossible |

**Coût total des étapes 0 à 3** : ≈ 0-100 € et 40-60 h, **sans développement**. Seule la maquette de démonstration est préparée à la main.

**Ce qui n'est PAS une preuve** :
- un « c'est intéressant » oral ;
- une démo réservée sans suite ;
- un avis simulé ;
- un nombre de visites sur la page.

---

## 11. Prochaine action proposée (soumise à votre accord)
1. **Étape 0, sans contact** : créer un compte Order Invoicer gratuit et tester multi-sociétés, « Accounting consolidation » et l'export ACD/Cegid ; demander une démo de Pennylane Collaboratif. **Si une vue multi-dossiers satisfaisante existe déjà, on arrête N06 ici.**
2. Relever à la main les coordonnées génériques des 22 cabinets et vérifier leur inscription à l'Ordre.
3. **Avec votre accord seulement** : envoyer le message 1 à 22-30 cabinets, en commençant par la priorité A.

Je n'ai contacté ni facturé personne.
