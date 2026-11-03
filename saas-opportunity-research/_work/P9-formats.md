# P9 — Formats d'import des logiciels de production et exports des marketplaces (risque 2, piste N06)

Date : 2026-10-30. Preuves : `P9F-preuves.csv` (P9F-P01 à P46). Étiquettes : [F] fait vérifié (source) ; [E] estimation ; [H] hypothèse.

**Méthode et limites.**
- 36 recherches WebSearch.
- WebFetch est bloqué : l'essai sur Légifrance a échoué (ENOTFOUND). Toutes les preuves viennent donc d'**extraits de recherche**, sans lecture complète des pages.
- Les centres d'aide officiels d'ACD, Pennylane, Inqom, MyUnisoft et Octopia ne sont pas remontés dans les résultats. Une fonction non vue est notée « Non trouvé », jamais « Non ».
- Colonne `sens` du CSV, par rapport à l'hypothèse « un format de sortie unique suffit pour un pilote » : POUR = la soutient ; CONTRE = l'affaiblit ; NEUTRE = sans effet.

## Résumé

1. **Il n'existe pas de format d'import universel.** Les outils de pré-comptabilité installés (Qonto, iDocus, Dext, Expensya) produisent tous **un format par logiciel cible** : TRA pour Cegid et MyUnisoft, ASCII pour Quadra, IN ZIP pour ACD, CSV paramétrable pour Sage 100, FEC ou format Sage Expert pour Génération Experts [F, P01-P03, P07]. C'est la convention du marché.
2. **Le FEC est le format le plus largement *lu*, mais il n'est pas conçu pour l'import.** C'est un format de contrôle fiscal (A47 A-1 LPF, BOFiP CF-IOR) [F, P34-P36]. Il est importable dans :
   - Sage 50 et Génération Experts (avec des pièges sur les dates et les à-nouveaux) [F, P15-P16] ;
   - Isacompta [F, P26] ;
   - EBP (zip avec pièces jointes) [F, P29] ;
   - l'API Cegid Loop [F, P10] ;
   - Pennylane, mais **en reprise de données** [F, P19-P20].

   Pour ACD, Quadra, Tiime, MyUnisoft et Inqom, l'import d'un FEC est **Non trouvé**.
3. **Les API d'écriture publiques documentées** sont celles de **Pennylane** (`ledger_entries`) [F, P17] et de **Cegid Loop** (`importPerso`, `importFec`) [F, P09-P10]. ACD (iSuite), MyUnisoft et Tiime passent par des clés ou accès API dont la documentation n'est pas publique dans les extraits [F, P04, P22, P25].
4. **Côté marketplaces**, seuls Amazon (Settlement V2) et Mirakl (TL02) ont une **documentation publique des lignes de versement**. Cdiscount/Octopia et ManoMano : **Non trouvé**. Fnac : en transition hors Mirakl pour le catalogue [F, P37-P46].
5. **Recommandation [H]** : pour le pilote, viser une **sortie pivot « écritures au gabarit FEC 18 colonnes »**, plus **un seul adaptateur natif**, choisi d'après le logiciel des 3 à 5 premiers cabinets prospects. Ne rien développer avant d'avoir la réponse aux questions de la section D.

---

## A. Logiciels de production comptable

### Tableau principal

| Logiciel | Formats d'import d'écritures | Import FEC | API | Source | Confiance |
|---|---|---|---|---|---|
| **ACD Compta / iSuite Expert** | Format « IN ZIP (.auto) » utilisé par Qonto pour ACD (structure non publiée) ; import paramétrable d'écritures **Non trouvé** (seul le module Banque mémorise des formats CSV) | Non trouvé | Oui, accès API créé par le cabinet (Administration > i-Suite Expert Tools > API Access Management), dossier « iSuite » activé ; doc publique Non trouvée | P03, P04 | Moyenne (sources tierces) |
| **Sage 100 Comptabilité** | Formats paramétrables (.ema) sur fichier .txt ou .csv, modèles fournis (« Modèles d'importation », dont « Import écritures EBP.ema ») ; PNM/PNC non importables par automatisation externe | Export FEC oui ; import FEC Non trouvé pour Sage 100 | Objets métier / ImportParam.Execute (automatisation locale) ; API cloud Non trouvée | P12, P13 | Moyenne (forum éditeur, réponse validée Sage) |
| **Sage 50** | Import paramétrable (formats duplicables) | Oui : « Import FEC (tabulation) » et « Import FEC (trait vertical) » ; pièges : dates des à-nouveaux, format de date | Non trouvé | P15 | Moyenne |
| **Sage Génération Experts (ex-Coala)** | Format d'import « Sage Expert » (dont « ARF ») ; TXT/PNM/PNC évoqués ; Coala reçoit un zip avec pièces et un Excel d'écritures (via iDocus) | Oui, avec contrôle de conformité (refus « il ne s'agit pas d'un FEC ») | Non trouvé | P01, P14, P16 | Moyenne |
| **Cegid Quadra (Quadra Expert / On Demand)** | Fichier ASCII Quadra : enregistrements typés M (écriture), C (compte), Y (complément), positions fixes, date JJMMAA | Non trouvé (le chemin de menu « import paramétrable FEC » vu concerne probablement Sage 50) | Non trouvé (Qonto propose un format « Cegid Quadra On Demand ») | P02, P05, P06 | Moyenne-haute (fiche Cegid 2023) |
| **Cegid Expert / Loop / XRP** | **TRA** (positions fixes, ANSI, libellés de 35 caractères au plus) ; « modèle d'import » personnalisé via l'API Loop | Oui, via l'API Loop (`importFec`) ; reprise ACD vers Loop par un extracteur dédié | **Oui, publique** : `POST /importPerso` (code dossier, MODELE, URL du fichier) puis getstatus ; `importFec` | P07-P11 | Haute (portail développeurs Cegid) |
| **Pennylane** | API ; import Excel/CSV d'écritures cité par un blog tiers (cas des factures fournisseurs) ; centre d'aide **Non trouvé** | Oui, **à la reprise** (prestation « à la carte », contrôle d'équilibre et correspondance de plan de comptes) ; usage mensuel Non trouvé | **Oui, publique** : `POST ledger_entries` (scope `ledger_entries:all`, lignes équilibrées, ID de journal et de comptes propres au dossier, pièces via `file_attachments`) ; changements cassants en 2026 | P17-P21 | Haute pour l'API, faible pour l'import CSV |
| **MyUnisoft** | **TRA** (Qonto le cite parmi les cibles TRA) ; publication directe par Dext et Regate | Non trouvé | Oui, clé API par dossier (Paramètres > Connecteurs) ; plus de 100 partenaires revendiqués ; doc publique Non trouvée | P07, P22, P23 | Moyenne |
| **Inqom (Visma)** | Import **Non trouvé** ; export CSV/XLSX documenté | Non trouvé | Non trouvé | P30 | Faible |
| **Tiime Expert** | Envoi d'écritures avec pièces jointes via le module Make (journaux et comptes à créer avant) ; import fichier Non trouvé | Non trouvé (export FEC oui) | Oui, via Make ; API directe Non trouvée | P25 | Moyenne-faible |
| **Agiris / Isacompta Connect** | Copier-coller, fichier texte, **FEC**, Excel, fichiers de logiciels clients ; « Import tableur universel » | **Oui** | Non trouvé (Isagi Connect non lu) | P26, P27 | Moyenne (fiche produit éditeur) |
| **EBP (Compta / Expert)** | Import/export paramétrable des écritures, comptes et journaux ; import texte au format EBP ; « format du logiciel du cabinet » | Oui (Open Line : zip avec FEC et dossier « Pieces jointes » en PDF) ; EBP Expert : à vérifier | Non trouvé | P28, P29 | Moyenne |

### Contraintes communes [F, sauf mention]

- **Plan de comptes** : les comptes doivent exister dans le dossier. Pennylane exige des ID de comptes et de journaux propres à chaque dossier (P17). Tiime, via Make, exige des comptes et journaux préexistants (P25). MyUnisoft fait configurer comptes et journaux par défaut (P22). → Il faut un **paramétrage par dossier** : compte client marketplace (411xxx), 706/707, 622x pour la commission, 44571/44566, 512/58x [H].
- **Journaux** : le code journal fait 2 caractères dans l'ASCII Quadra (P05). Changer tous les codes en « OD » a fait échouer un import dans Génération Experts (fil P16).
- **Codes TVA** : MyUnisoft les fait paramétrer (P22). Le TRA et l'ASCII Quadra ont leurs propres zones (non détaillées dans les extraits).
- **Libellés** : 35 caractères au plus en TRA (P07).
- **Lettrage** : le FEC porte EcritureLet et DateLet (zones 14-15, P34). La reprise du lettrage à l'import est Non trouvée hors Pennylane, où le cabinet le revalide après la bascule (P20).
- **Pièces jointes** :
  - API Pennylane (P17) ;
  - Tiime via Make (P25) ;
  - EBP (zip, P29) ;
  - iDocus vers Coala (zip, P01) ;
  - Regate vers ACD et MyUnisoft (« avec les justificatifs », P04, P23).

### Parts de marché chez les experts-comptables

**Aucune étude chiffrée de l'Ordre, du CSOEC ou d'un institut n'a été trouvée** (deux recherches dédiées). Seuls existent des chiffres déclaratifs :

| Éditeur | Chiffre | Nature | Source | Confiance |
|---|---|---|---|---|
| Cegid (groupe, Shine inclus) | > 15 000 cabinets | Déclaratif, post-rachat de Shine (juin 2026) | P31 | Faible |
| ACD | > 3 500 cabinets, 30 000 utilisateurs | Déclaratif | P31 | Faible |
| Tiime | > 3 000 cabinets partenaires | Déclaratif | P32 | Faible |
| Sage, MyUnisoft, Inqom, Pennylane | Non trouvé (Pennylane : 350 000 entreprises, pas de chiffre cabinets) | — | — | — |

Les chiffres déclarés se recouvrent (multi-équipement, périmètres groupe) et ne s'additionnent pas. Le nombre total de cabinets n'a pas été vérifié dans cette phase.

Lecture [E] : chez les cabinets installés, **Cegid (Quadra + Expert/Loop) et ACD** dominent probablement, suivis de Sage (Génération Experts). Les cabinets récents vont vers Pennylane et Tiime (comparatif éditorial P33). Il n'y a **pas de logiciel majoritaire démontré**, ce qui empêche de viser un seul format natif sans données de terrain.

---

## B. Le FEC : texte, usage, import

- **Texte** [F, P34, copie du texte Légifrance] : article A47 A-1 LPF, modifié par l'arrêté du 29 juillet 2013.
  - **18 premières zones obligatoires, dans l'ordre** : JournalCode, JournalLib, EcritureNum, EcritureDate, CompteNum, CompteLib, CompAuxNum, CompAuxLib, PieceRef, PieceDate, EcritureLib, Debit, Credit, EcritureLet, DateLet, ValidDate, Montantdevise, Idevise.
  - Format : fichier à plat avec séparateur unique (tabulation ou « | »), ou XML conforme au XSD de la DGFiP.
  - Légifrance n'a pas pu être consulté directement (WebFetch bloqué).
- **Usage** [F, P35, P36] :
  - c'est la copie remise à l'administration lors d'un contrôle des comptabilités informatisées (BOFiP BOI-CF-IOR-60-40-20, version du 7 juin 2017) ;
  - c'est un **format de restitution**, pas un format d'échange courant ;
  - il couvre un **exercice entier, à-nouveaux compris**, ce qui crée des frictions à l'import : dates d'à-nouveaux, format de date, contrôle de conformité (P15, P16).
- **Qui importe un FEC, et quand :**

| Logiciel | Import FEC | Contexte observé |
|---|---|---|
| Sage 50 | Oui (import paramétrable) | Import d'écritures, y compris partielles (titre du fil P15) |
| Sage Génération Experts | Oui | Reprise ou échange depuis Sage 100 (P14, P16) |
| Isacompta | Oui | Liste des sources d'import (P26) |
| EBP Open Line | Oui (zip avec pièces) | Import d'écritures (P29) |
| Cegid Loop | Oui (API `importFec`) | Usage non précisé (P10) ; la reprise ACD utilise pourtant un extracteur dédié (P11) |
| Pennylane | Oui | **Reprise** de données (P19, P20) |
| ACD, Quadra, MyUnisoft, Tiime, Inqom | Non trouvé | — |

- **Conséquence [H]** : un « FEC mensuel » contenant seulement les écritures de versement (sans à-nouveaux) est un **fichier au gabarit FEC**, pas un FEC légal. Son acceptation par chaque logiciel en import courant reste **à tester**. Les fils Sage montrent qu'il passe dans Sage 50 avec un format paramétrable dupliqué (P15).

---

## C. Exports des marketplaces (relevés de versement)

| Marketplace | Source documentée | Format | Champs disponibles (extraits) | Fréquence | Stabilité | Confiance |
|---|---|---|---|---|---|---|
| **Amazon** | Settlement Report V2, `GET_V2_SETTLEMENT_REPORT_DATA_FLAT_FILE_V2` (SP-API, téléchargeable aussi dans Seller Central) | Texte tabulé | settlement-id, settlement-start/end-date, deposit-date, total-amount, currency, transaction-type, order-id, … + **amount-type / amount-description / amount** (une seule colonne de montant) | Généré par Amazon, ≈ tous les 14 jours, lié au cycle de versement ; impossible à demander ; disponible 90 jours | **Changements** : XML et flat file v1 dépréciés au profit du V2 (date de coupure 2026 illisible dans l'extrait) ; frais SP-API annoncés puis abandonnés en 2026 (P7DN06-P34) | Haute (P37-P39) |
| **Mirakl** (Leroy Merlin, Boulanger, Darty, Carrefour…) | API vendeur **TL02** `GET /api/sellerpayment/transactions_logs` (lignes de transaction) ; **TL03/TL04** export asynchrone ; **IV01** documents comptables ; exports back-office du même contenu [H] | JSON (API) ; CSV back-office [H] | Types : ORDER_AMOUNT, ORDER_AMOUNT_TAX, ORDER_SHIPPING_AMOUNT, COMMISSION_FEE, COMMISSION_VAT, MANUAL_CREDIT(_VAT)… ; filtres par bon de paiement (payment voucher), dates, commande | Suit le cycle de paiement défini par **chaque opérateur** [H] | **Changements** : chemin passé de `/api/transactions_logs` à `/api/sellerpayment/...` ; IV01 vide avec « Enhanced Seller Invoicing » (remplacé par DR11) ; limites de débit fixées par opérateur | Moyenne (P40-P42) |
| **Cdiscount / Octopia** | Portail API Octopia : zone « Finance » (« financial reporting to manage accountancy ») et factures clients ; relevé de versement et « Invoices history » du back-office : **Non trouvé** | Non trouvé | Non trouvé | Non trouvé (« trois fois par mois » selon un éditeur tiers, non retenu) | Délégation du vendeur requise (P7DN06-P29) | Faible (P43) |
| **ManoMano** | Partners API (`partnersapi.manomano.com`) : commandes, offres, factures clients ; clé Toolbox + contract ID par pays et mode de livraison ; relevé vendeur **Non trouvé** | Non trouvé | Non trouvé | Non trouvé | Non trouvé | Faible (P44) |
| **Fnac (Fnac Darty)** | Historiquement sur Mirakl ; le catalogue est sorti de Mirakl le 30 juin 2025 (portail propre) ; vendeurs Darty basculés sur le back-office Fnac (BOMP) ; relevé de paiement **Non trouvé** | Non trouvé | Non trouvé | Non trouvé | **Instable** : migrations en cours en 2025-2026 | Faible-moyenne (P45, P46) |

**Lecture.** Le pilote peut s'appuyer sur deux sources documentées : **Amazon V2** et **Mirakl TL02**. Les deux décrivent des lignes typées (vente, TVA, commission, frais, remboursement) rattachées à un versement, ce qui correspond au besoin de ventilation. Pour Cdiscount et ManoMano, il faut **obtenir un relevé anonymisé** du prospect avant d'écrire un parseur (déjà prévu en P7, question 6).

---

## D. Conclusion : quel format de sortie pour le pilote ?

### Options

| Option | Couverture (sources) | Pour | Contre |
|---|---|---|---|
| 1. **Gabarit FEC 18 colonnes** (TXT tabulé, une écriture équilibrée par versement) | Import vu dans Sage 50, Génération Experts, Isacompta, EBP, Cegid Loop (API) et Pennylane (reprise) | Seule spécification **publique et stable** (2013) ; lisible par tout auditeur ; sert aussi d'export de contrôle | Non trouvé pour ACD, Quadra, MyUnisoft, Tiime, Inqom ; frictions de dates et de conformité ; import « courant » non garanti [H] |
| 2. **CSV paramétrable** (colonnes au choix du cabinet) | Sage 100 (.ema), Sage 50, EBP, Isacompta (tableur universel) | Le cabinet adapte les colonnes à son modèle d'import | Pas de format de référence ; ACD et Quadra non couverts dans les sources ; support lourd |
| 3. **Format natif d'un éditeur** (TRA Cegid, ASCII Quadra, IN ZIP ACD) | TRA : Cegid Expert/Loop/XRP + MyUnisoft ; ASCII : Quadra | Import « en un clic », format attendu par les cabinets installés | Specs partielles (TRA via des tiers, IN ZIP non publié) ; un format par cible |
| 4. **API** (Pennylane `ledger_entries`, Cegid Loop `importPerso`/`importFec`) | Pennylane, Cegid Loop | Pas de fichier à manipuler ; pièces jointes (Pennylane) | Pennylane est déjà occupé par Order Invoicer et d'autres (P7) ; changements cassants en 2026 ; segment « hors Pennylane » visé (P8) |

### Recommandation [H]

1. **Noyau** : un modèle interne d'écritures équilibrées par versement, **exporté au gabarit FEC 18 colonnes**. C'est le format le plus lu, il est documenté par l'État, et il sert de preuve d'audit pour le cabinet. Ajouter un **export XLSX lisible**, sur le modèle iDocus vers Coala (P01), pour la revue humaine.
2. **Un seul adaptateur natif**, choisi après les entretiens, selon la répartition observée chez les prospects :
   - si les prospects sont surtout sous **Cegid** (Expert, Loop) **ou MyUnisoft** → **TRA**, un format pour deux familles (P07) ;
   - si Quadra domine → **ASCII Quadra**, avec une spec Cegid partielle disponible (P05) ;
   - si ACD domine → **demander la spec IN ZIP ou l'accès API iSuite** à ACD avant tout développement (P03, P04). Risque : l'accès partenaire est inconnu.
3. **Ne pas** viser Pennylane en premier : c'est le segment déjà servi (P7, P8).
4. **Sources d'entrée du pilote** : Amazon V2 et Mirakl TL02 uniquement. Cdiscount et ManoMano restent en import CSV, sur échantillon fourni par le cabinet.

Critère de décision [H] : si au moins 3 des 5 premiers cabinets intéressés confirment qu'ils importent un fichier au gabarit FEC **en cours d'exercice** dans leur logiciel, le format 1 suffit pour le pilote. Sinon, il faut le format natif majoritaire de l'échantillon.

### Questions à poser aux prospects (cabinets)

1. Quel logiciel de production utilisez-vous (version, et en local ou en SaaS : Quadra On Demand, iSuite, Loop…) ? Le même pour tous les dossiers e-commerce ?
2. Comment intégrez-vous aujourd'hui des écritures venues d'un outil tiers (banque, notes de frais, caisse) ? Par quel format : TRA, ASCII, FEC, CSV paramétrable, API ?
3. Importez-vous déjà des **fichiers au format FEC en cours d'exercice**, pas seulement à la reprise ? Avec quelles erreurs (dates, journaux, à-nouveaux) ?
4. Avez-vous un **modèle d'import paramétré** que vous pourriez nous montrer (colonnes, séparateur, encodage) ?
5. Plan de comptes : un compte 411 par marketplace ? Comptes de commission (622x) et de frais ? Sous-comptes par pays ou par TVA (OSS) ?
6. Quel journal (VT, OD, journal dédié marketplace) ? Une écriture par versement, par jour ou par commande ?
7. Codes TVA : comment les traitez-vous à l'import (code par ligne, compte de TVA par taux) ?
8. Le lettrage avec le virement bancaire doit-il être produit par l'outil ou fait dans votre logiciel ?
9. Faut-il joindre le relevé ou la facture de commission (PDF) à l'écriture ?
10. Sur quelles marketplaces sont vos clients ? Pouvez-vous fournir un **relevé anonymisé** Cdiscount, ManoMano ou Fnac (test d'engagement, et seule source de format pour ces trois) ?
11. Utilisez-vous déjà iDocus, Dext, Regate ou un autre outil qui dépose des écritures dans votre logiciel ? Un dépôt par ce canal serait-il acceptable ?
12. Qui importe : un collaborateur ou un process automatisé ? Combien de dossiers e-commerce par collaborateur ?

---

## Lacunes et contrôles à faire

- Documentation officielle ACD (import paramétrable, API iSuite) : **Non trouvée**. C'est le point le plus bloquant si ACD domine l'échantillon.
- Centre d'aide Pennylane (import d'écritures CSV et FEC en cours d'exercice) : **Non trouvé**.
- Spécification TRA officielle Cegid : **Non trouvée** (seulement via des tiers).
- Relevés Cdiscount/Octopia, ManoMano et Fnac : champs **Non trouvés**.
- Parts de marché : **aucune étude chiffrée** trouvée. Pistes : Top 250 Numeum-EY, enquêtes de la presse professionnelle, données de l'Ordre (non consultées).
- La date de coupure de la dépréciation Amazon (2026) est illisible dans l'extrait.
