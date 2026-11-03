# DD-A39 — Devoir de conseil formalisé (Recommandation ACPR 2024-R-03) pour petits cabinets de courtage — Due diligence phase 2

Date : 2026-10-29. Finaliste A-39 (phase 1 : 71/100 dans A-top.md ; notes brutes de scores-bruts.csv rappelées en §14).
Méthode : 44 recherches WebSearch, dont environ 45 % orientées vers l'invalidation (outils gratuits des associations, concurrents dotés d'un module DDA, gratuité des extranets, portée juridique de la recommandation, réalité des sanctions et des contrôles, jurisprudence).
**WebFetch est bloqué** (acpr.banque-france.fr ne résout pas). Le texte de la recommandation n'a donc **pas été lu dans sa source primaire**. Tout ce qui suit repose sur des extraits de recherche (Deloitte Avocats, Actu-Juridique, presse spécialisée).
Preuves : `DD-A39-preuves.csv` (P01 à P36). Concurrents : `DD-A39-concurrents.csv`.
Étiquettes : **[O]** fait observé (extrait sourcé) · **[E]** estimation · **[H]** hypothèse · **[I]** inconnu.

---

## 0. Vérification du texte et de son périmètre (demandée)

| Point | Constat | Statut |
|---|---|---|
| Identifiant et date | Recommandation ACPR **2024-R-03 du 21/11/2024**, qui complète la 2024-R-01 du 28/06/2024. Un site la numérote 2024-R-02 (erreur probable). | [O] P01, P04 |
| Entrée en application | **31/12/2025** selon Deloitte et la plupart des sources ; « contrats distribués ou renouvelés à compter du 01/01/2026 » selon une autre. L'écart est d'un jour. Le texte est en vigueur. | [O] P01 |
| Produits couverts | **Étendue à l'ensemble des produits d'assurance**, assurance de dommages et prévoyance comprises (auparavant surtout l'assurance vie). **Devoir de conseil dans la durée** étendu à la plupart des contrats. | [O] P01, P04 |
| Exclusions | Grands risques (art. L.111-6), **contrats collectifs à adhésion obligatoire**, **contrats souscrits par l'employeur** pour ses salariés, produits qui ne sont plus distribués et sans tacite reconduction. | [O] P02 |
| Proportionnalité | Application « en tenant compte de la complexité du contrat ». | [O] P03 (extrait, attribution moyenne) |
| Portée juridique | Une recommandation **n'est pas directement sanctionnable** sur le plan disciplinaire. Elle peut conduire à une **mesure de police administrative**. Les sanctions se fondent sur la loi (L.521-1, L.521-4 C. assur.). | [O] P03, P11 |

**Conséquence pour la thèse.** Le catalyseur existe et il est en vigueur. Il est en revanche plus « mou » que ne le laissait entendre la phase 1, pour trois raisons :
- le texte est une recommandation ;
- il s'applique de façon proportionnée ;
- il exclut le collectif obligatoire et les grands risques, qui représentent une part du chiffre d'affaires des courtiers entreprises et santé collective.

**Correction d'un signal de phase 1.** La « sanction d'un intermédiaire le 13/05/2026 » vise la **Société Générale** (blâme et 20 M€, offre « Sobrio »), pas un petit courtier (P11). Elle prouve que l'ACPR fait respecter le devoir de conseil, mais pas qu'elle contrôle les TPE.

---

## 1. ICP, acteurs, contexte d'achat

- **ICP** : cabinet de courtage de proximité de 1 à 10 personnes, immatriculé COA à l'ORIAS, multi-compagnies, en IARD particuliers et professionnels ou en santé-prévoyance individuelle et TNS. Il n'a **pas** de logiciel de gestion de cabinet doté d'un module DDA : il travaille avec Excel, Word et les extranets des assureurs ou des grossistes [H : ce sous-segment est à mesurer, voir §13].
- **Utilisateur** : le courtier ou le chargé de clientèle qui réalise le rendez-vous et la souscription.
- **Prescripteurs** :
  - l'association agréée (Endya, ANACOFI-Courtage, CNCEF Assurance, etc.) au moment d'un contrôle ou d'une formation ;
  - les grossistes et assureurs qui exigent la fiche ;
  - les organismes de formation DDA (Planète CSCA RH, IFPASS) ;
  - l'expert-comptable ou le consultant conformité.
- **Décideur économique** : le dirigeant gérant, qui est presque toujours aussi utilisateur.
- **Sponsor** : le dirigeant à la suite d'un contrôle de l'association, d'une réclamation client ou d'une mise en cause de sa RC pro.
- **Objections attendues** :
  1. « Mon extranet ou mon grossiste génère déjà la fiche » (P34, concurrents.csv).
  2. « Mon association me donne des modèles » (P20, P22).
  3. « J'ai déjà CourtiGo ou Lya » (P13, P15).
  4. « Une recommandation n'est pas une obligation » (P03).
  5. « Je n'ai jamais été contrôlé » (P29).
  6. « Encore un abonnement ».
- **Contexte d'achat** :
  - achat individuel, carte bancaire, sans appel d'offres ;
  - déclenché par un événement (contrôle, litige, création du cabinet, adhésion à une nouvelle association après un retrait d'agrément, P24) ;
  - cycle court s'il y a un déclencheur, sinon il n'y a pas d'achat [H].

## 2. Job-to-be-Done et workflow actuel

**JTBD** : « Quand je place un contrat, je veux produire sans y passer une demi-heure une trace datée et opposable montrant que j'ai recueilli les besoins, comparé et motivé ma recommandation. Je veux pouvoir la ressortir en cas de contrôle ou de litige, et refaire le point avec le client au renouvellement. »

**Workflow actuel probable** [H, à confirmer en entretiens] :
1. Rendez-vous téléphonique ou physique, prise de notes libre.
2. Tarification sur un ou plusieurs extranets, ou sur un multi-tarificateur (Oggo Data, P18).
3. Fiche de conseil générée par l'extranet de la compagnie retenue (P34, FMA), ou modèle Word ou PDF de l'association (P20), complété à la main. L'ACPR relève des « fiches standardisées » (P35, non revérifié).
4. Signature électronique via l'extranet, ou e-mail.
5. Archivage dispersé entre les extranets, la boîte mail et un dossier réseau.
6. Pas de revue périodique des besoins au renouvellement, alors que la 2024-R-03 attend désormais un conseil dans la durée (P01, P04).

**Pourquoi c'est douloureux** :
- les preuves sont dispersées entre plusieurs extranets ;
- la motivation est générique ;
- il n'y a pas de comparaison documentée entre les assureurs ;
- rien ne déclenche le suivi dans la durée.

**Fréquence** : à chaque souscription, avenant ou renouvellement, donc chaque semaine. La partie « durée » est annuelle par client [E].

## 3. Coût de l'inaction

**Formule** :
`CI annuel = P(contrôle) × C(contrôle) + P(litige) × C(litige non couvert) + T(formalisation) × N(contrats) × coût horaire`

| Variable | Valeur | Statut |
|---|---|---|
| P(contrôle ACPR) par cabinet et par an | < 0,5 % | [H] Aucun chiffre récent. Le dernier chiffre public est de 79 contrôles sur place, tous assujettis confondus, en 2012 (P29). |
| P(contrôle par l'association) | inconnue | [I] Aucune publication trouvée sur la fréquence ou les résultats des contrôles Endya, ANACOFI ou CNCEF. |
| C(contrôle défavorable) pour une TPE | 2 000 à 15 000 € (temps de remédiation, conseil externe) ; sanction ou radiation rare | [H] |
| P(litige pour défaut de conseil) | 0,5 à 2 % des cabinets par an | [H] |
| C(litige non couvert) | franchise RC pro de 1 000 à 5 000 €. Le juge exige un dommage effectif (P30). | [H] ; [O] pour le principe |
| T(formalisation) par contrat | 15 à 30 min aujourd'hui, contre 5 à 10 min outillé | [H] |
| N(contrats) par an pour un cabinet de 1 à 3 personnes | 200 à 800 | [H] |
| Coût horaire chargé | 35 à 50 € | [H] |

**Ordre de grandeur** :
- Risque réglementaire : 0,5 % × 8 000 € + 1 % × 3 000 € ≈ **70 €/an**. C'est faible.
- Temps : 15 min gagnées × 400 contrats × 40 €/h ≈ **4 000 €/an** [H].

→ Le ROI repose sur le **gain de temps**, pas sur la peur de la sanction. Or le gain de temps est déjà vendu par CourtiGo et Lya à partir de 29 €/mois (P13, P15).

## 4. Concurrents, indirects, substituts (détail dans le CSV)

| Acteur | Type | Prix | Limite / remarque |
|---|---|---|---|
| **Lya Courtage** | direct | 29 €/mois/utilisateur à 249 €/mois [O] P13 | « Conformité automatisée (devoir de conseil) » revendiquée ; 350 courtiers en 2023 (P14). C'est le **concurrent le plus proche**. |
| **CourtiGo** | direct | 29,90 à 199,90 €/mois [O] P15 | Conformité DDA, CRM, IA, du solo à l'agence. Profondeur du module fiche de conseil non vérifiée. |
| **Custy**, **SKY** | direct | inconnu | Documents réglementaires DDA générés, DDA « native » (P16). |
| **Modulr** (Ecilia) | indirect | inconnu | Plus de 650 clients, orienté grossistes et réseaux (P17). |
| **Oggo Data** | indirect | inconnu, sans engagement | Tarification jusqu'à la souscription signée (P18). |
| **Extranets assureurs et grossistes** (FMA, Zenioo…) | substitut | probablement gratuit [H] | Fiche mono-compagnie, sans motivation comparative [H]. |
| **ANACOFI** (documents types, outils, modèles) | substitut gratuit pour l'adhérent | inclus dans la cotisation (130 €/personne en 2023) [O] P20, P21 | Modèles statiques. |
| **Endya** (guides) | substitut | cotisation | Guides pédagogiques. Aucun logiciel ni partenariat éditeur trouvé (P22). |
| **Planète CSCA RH × Endya « Easy DDA »** | indirect | 15 €/h de formation [O] P23 | Les associations monétisent la formation, pas l'outillage. |
| **MustCompliance**, **Capital Explorer** (106 € HT/mois), **O2S** (60 à 120 € HT/mois en 2020), **Prisme** (85 € HT/mois) | indirects côté CGP/CIF | [O] P25 à P27, CSV | L'extension vers les CIF tomberait sur un marché déjà équipé. |
| Sur mesure (Kolonell) | substitut | module DDA à 15 000-25 000 € HT [O, source intéressée] P19 | Pour les plus gros cabinets. |
| Word, Excel, LLM généraliste | substitut | 0 € à quelques dizaines d'euros | C'est le statu quo. |
| Hiway, Assurly, Ma Mutuelle Assurance | ? | inconnu | **Aucun résultat** : non vérifiés, à ne pas citer comme concurrents établis. |

**Plaintes observées** : aucune plainte d'utilisateur sur ces modules n'a été trouvée [I]. Le seul avis vu (Oggo Data, Capterra) porte sur des adresses de résiliation obsolètes.

**Lecture** : **la lacune annoncée en phase 1 (« CRM courtiers non cartographiés ») est en grande partie comblée par l'existant.** Au moins quatre éditeurs revendiquent la DDA et le devoir de conseil, deux d'entre eux à partir d'environ 30 €/mois. De leur côté, les associations et les extranets fournissent gratuitement les modèles de base.

## 5. Différenciation possible

Proposer un « meilleur générateur de fiche de conseil » n'est **pas** un wedge viable. Deux wedges restent défendables, tous deux à l'état d'[H] :

1. **« Conseil dans la durée » en surcouche (overlay)**
   - Principe : le courtier importe son portefeuille (CSV ou bordereaux) quel que soit son CRM ou son extranet. L'outil envoie avant chaque échéance un questionnaire d'actualisation des besoins au client par e-mail ou SMS. Le client répond en ligne. L'outil horodate la réponse et signale les écarts (cumul d'assurances, besoin non couvert). Le courtier reçoit une liste d'actions et de ventes croisées.
   - Ce que la 2024-R-03 ajoute pour l'IARD et la prévoyance : le suivi dans la durée (P01, P04).
   - Réutilisation : c'est un **moteur de relance**, la brique déjà construite pour Relanzio (Node, Supabase, Brevo).
   - Raison de changer : le suivi est **à la fois de la conformité et du chiffre d'affaires**, par la détection d'opportunités et la rétention.
2. **Dossier de preuve prêt pour un contrôle d'association** : un export par client qui rassemble recueil, comparaison, motivation, remise des documents précontractuels (DIPA) et signature, sous une grille de contrôle. Il n'y a pas de contenu de grille public [I].

- **Time-to-value visé** : moins de 30 min (import CSV et premier envoi) [H].
- **ROI mesurable** : taux de réponse des clients, nombre d'écarts détectés et, en conséquence, ventes croisées.

## 6. Taille de marché bottom-up

| Étape | Valeur | Statut |
|---|---|---|
| Inscriptions COA au 31/12/2025 | **27 500** (+2,0 %) | [O] P06 (extrait Argus d'après le rapport Orias 2025) |
| Adhérents Endya (2024) | environ 12 000 | [O] P08 (titre seulement) |
| Part des TPE de moins de 11 salariés | environ 90 % | [O, confiance faible] P09 |
| Part des COA qui sont des cabinets spécialisés de proximité (hors banques, concessionnaires, activité accessoire, grossistes) | 35 à 55 % | [H] |
| Part de ceux qui n'ont pas de logiciel de cabinet avec DDA | 40 à 70 % | [H] |
| **Acheteurs adressables (SAM)** | **27 500 × 0,45 × 0,55 ≈ 3 900 à 10 600 cabinets** | [E] |
| Prix annuel par cabinet | 500 à 1 200 € | [H] |
| **TAM** (tous les COA × 500-1 200 €) | 14 à 33 M€/an. Plafond théorique qui inclut des non-acheteurs. | [E] |
| **SAM** | **2 à 13 M€/an** | [E] |
| **SOM à 3 ans** (1 à 3 % du SAM) | 40 à 320 cabinets, soit **25 k€ à 380 k€ d'ARR** | [E] |

Lecture : c'est une **micro-entreprise rentable possible**, pas un gros marché, et la concurrence à 29 €/mois plafonne le prix.

## 7. Pricing

- **Recommandé** : **39 €/mois par cabinet** jusqu'à 500 clients suivis, puis 0,08 € par client et par mois au-delà, avec 14 jours d'essai.
  - Exemple de ROI : un cabinet de 2 personnes et 600 clients récupère 2 h par mois de formalisation (80 €) et détecte 1 % d'écarts. Si cela produit 6 ventes croisées à 80 € de commission annuelle, cela fait 480 €. Le ROI annuel est d'environ 1 400 € pour 468 € payés [H].
- **Alternative 1** : un pack par dossier (par exemple 0,50 € par fiche ou par campagne), pour les cabinets à faible volume.
- **Alternative 2** : une licence de groupe vendue à une association, un grossiste ou un réseau, en marque blanche, par exemple 3 à 6 € par adhérent et par an [H]. Le volume serait élevé et le prix bas. Aucune association ne montre aujourd'hui d'appétit pour un partenariat logiciel (P22, P23).
- **Qui signe** : le dirigeant, par carte bancaire.

## 8. Intrants du modèle économique

| Intrant | Valeur | Statut |
|---|---|---|
| Prix moyen | 35 à 60 €/mois par cabinet | [H] |
| COGS IA (rédaction de la motivation, synthèse des réponses) | < 0,05 € par dossier ; < 2 € par cabinet et par mois | [H] |
| E-mail ou SMS (relances clients) | 1 à 5 € par cabinet et par mois selon le SMS | [H] |
| Signature électronique et horodatage qualifié (si exigés) | 0,5 à 2 € par signature, en option facturée | [H] |
| Hébergement UE (Supabase / Postgres) | moins de 150 €/mois au total au début | [H] |
| Support et onboarding | 1 à 2 h par client au démarrage (import du portefeuille) | [H] |
| Marge brute | 80 à 90 % | [E] |
| CAC | 150 à 500 € (outbound, webinaires) | [H] |
| Cycle de vente | 1 à 4 semaines s'il y a un déclencheur, sinon indéfini | [H] |
| Churn | 2 à 4 % par mois (TPE, faible contrainte) | [H] |
| Payback | 4 à 12 mois | [E] |

## 9. Risques

- **Responsabilité de l'éditeur** :
  - Le devoir de conseil reste celui du courtier (P32, P31). Un texte motivé généré par l'IA et non relu peut être reproché au courtier, qui se retournera contre l'éditeur.
  - Protections nécessaires : CGV B2B avec clause limitative, outil présenté comme « aide à la formalisation » et non comme un « conseil », validation humaine obligatoire tracée, RC pro éditeur.
  - La jurisprudence propre aux éditeurs n'a pas été trouvée [I].
- **RGPD** :
  - données de santé possibles en prévoyance et santé (questionnaires de besoins) ;
  - si l'outil stocke des données de santé : hébergement HDS [H : à vérifier selon que le recueil des besoins inclut ou non des données médicales] ;
  - à défaut, exclure explicitement les données médicales du recueil.
- **Réglementation** :
  - texte non contraignant juridiquement (P03) ;
  - pas de report ni de suspension trouvés ;
  - risque inverse : l'ACPR ou les associations publient un modèle officiel gratuit [H].
- **Accès aux données** : pas d'API standard vers les extranets. On dépend d'imports CSV ou de bordereaux, et le portefeuille est souvent dans l'extranet [H].
- **Réaction des éditeurs en place** : CourtiGo et Lya peuvent ajouter une campagne de « conseil dans la durée » en quelques semaines. Ils ont déjà la base installée.
- **Fiabilité de l'IA** : une motivation générique serait précisément le défaut relevé par l'ACPR (P35). L'IA doit donc s'appuyer sur les réponses réelles et les garanties comparées.
- **Canal instable** : retraits d'agrément d'AFIB, de La Compagnie des IAS et de Courtensia (P24). C'est une opportunité ponctuelle (re-adhésion) mais aussi un signe d'instabilité.

## 10. Distribution

- **Canal 1 : outbound ciblé.**
  - Source : le registre ORIAS (public, consultable par numéro ou nom) croisé avec Google Maps et LinkedIn « courtier en assurances » + ville.
  - Message : « Depuis le 31/12/2025, l'ACPR attend un conseil dans la durée sur vos contrats IARD et prévoyance. En 30 minutes, importez votre portefeuille : vos clients reçoivent avant l'échéance un questionnaire d'actualisation, vous gardez la preuve horodatée et vous voyez qui a besoin d'un avenant. 39 €/mois. »
- **Canal 2 : formateurs DDA et consultants conformité externalisée** (revendeurs ou apporteurs, 20 à 30 % de commission), plus des webinaires « 2024-R-03 pour courtiers IARD ».
- **Associations agréées** : elles servent à **parler** (contenus, webinaires), pas de canal de vente garanti. Aucune ne montre de partenariat logiciel (P22) et l'ANACOFI fournit ses propres modèles (P20).
- **Obtenir 10 conversations** :
  - 150 appels ou messages LinkedIn ciblés sur des courtiers de 1 à 5 personnes en santé-prévoyance individuelle et IARD particuliers ;
  - 3 groupes Facebook ou LinkedIn de courtiers ;
  - script de 15 minutes sur l'outil utilisé aujourd'hui pour la fiche, la dernière fois que la fiche a servi, et l'existence d'une revue à l'échéance.
- **Premières ventes sans audience** : pré-vente à 39 €/mois, avec import de portefeuille fait gratuitement par le fondateur (« concierge »).
- **Profil fondateur** : francophone en France, donc la distribution est faisable. Le fondateur ne vient pas du métier du courtage, ce qui crée un déficit de crédibilité à compenser par un courtier conseiller [H].

## 11. Faisabilité

- **MVP** :
  1. import de portefeuille (CSV ou bordereau) ;
  2. bibliothèque de questionnaires de besoins par branche (habitation, auto, multirisque pro, santé individuelle, prévoyance TNS) ;
  3. parcours client en ligne avec horodatage ;
  4. rédaction assistée de la motivation, avec validation humaine ;
  5. génération du PDF de la fiche et coffre de preuves ;
  6. campagnes d'échéance (le moteur de relance Relanzio) ;
  7. export du dossier de contrôle.
- **Briques réutilisables** : Node, Supabase, Stripe, Brevo (Relanzio). Signature électronique par API tierce en option.
- **Partie difficile** :
  - le **contenu métier**, c'est-à-dire des questionnaires et des motivations jugés recevables par une association : il faut un courtier ou un juriste relecteur ;
  - l'import de bordereaux hétérogènes.
- **Coût et temps** : 6 à 10 semaines pour une personne, plus 2 000 à 5 000 € de relecture juridique [H].
- **Dépendances critiques** : accès aux données de portefeuille, validation du contenu par un expert, HDS si des données de santé sont présentes.

## 12. Défendabilité à 2 ans

- **Faible.**
- **Ce qui sera commoditisé** :
  - un LLM généraliste rédige une motivation en 10 secondes ;
  - CourtiGo et Lya (et les extranets) intégreront le suivi dans la durée.
- **Ce qui retiendrait le client** :
  - l'historique de preuves horodatées (coût de sortie) ;
  - les campagnes d'échéance qui génèrent du chiffre d'affaires ;
  - les modèles de questionnaires validés.
- **Rien de cela n'est un fossé** : c'est une rétention par inertie.

## 13. Raisons de ne PAS le faire / expériences d'invalidation

**Raisons de ne pas le faire** :
1. Lacune largement comblée : au moins 4 logiciels revendiquent la DDA et le devoir de conseil, dont 2 à partir de 29 €/mois (P13, P15, P16, P19).
2. Gratuité des substituts : modèles des associations (P20) et fiches générées par les extranets et grossistes (P34).
3. Catalyseur mou : recommandation non sanctionnable directement (P03), contrôles rares (P29), et une sanction phare qui vise une banque, pas une TPE (P11).
4. Aucune preuve de volonté de payer pour un outil spécifique au devoir de conseil (seulement pour des suites complètes).
5. Marché adressable petit (SOM de 25 à 380 k€ d'ARR) et prix plafonné par la concurrence.
6. Risque de responsabilité et peut-être de HDS sur la santé-prévoyance.

**Expériences d'invalidation (2 à 3 semaines)** :
- **E1** — 20 appels à des courtiers de 1 à 10 personnes. Si **plus de 60 %** génèrent déjà leurs fiches via un extranet, CourtiGo, Lya ou un modèle d'association et s'en déclarent satisfaits → **stop**.
- **E2** — question sur la revue à l'échéance. Si **moins de 25 %** des cabinets la jugent utile, même pour la vente croisée → abandon du wedge « durée ».
- **E3** — pré-vente à 39 €/mois sur 30 conversations qualifiées. **Moins de 3 engagements** (carte bancaire ou lettre d'intention signée) → **stop**.
- **E4** — e-mail à 3 associations (Endya, ANACOFI-Courtage, CNCEF Assurance) pour connaître leurs contrôles et leurs modèles. Si un modèle de suivi dans la durée gratuit est déjà diffusé → le wedge s'effondre.
- **E5** — vérifier sur une démo CourtiGo ou Lya s'ils gèrent déjà les campagnes d'actualisation des besoins. Si oui → **stop**.

## 14. Re-notation

Les notes de phase 1 (0-10) viennent de `scores-bruts.csv`. A-top.md affichait 71/100 avec une ventilation pondérée légèrement différente.

| Critère (poids) | Phase 1 (0-10) | Phase 2 (0-10) | Pondéré | Cause du changement |
|---|---|---|---|---|
| Douleur / budget (20) | 6 | **5** | 10,0 | La recommandation n'est pas directement sanctionnable (P03), les contrôles sont rares (P29) et la sanction phare vise la Société Générale (P11). La douleur réelle est le temps passé, déjà adressé à 29 €/mois. |
| Fréquence (10) | 8 | **7** | 7,0 | Fréquence hebdomadaire maintenue, mais le collectif obligatoire et les grands risques sont exclus (P02). |
| Preuves (15) | 6 | **5** | 7,5 | Les preuves de défaillances ACPR n'ont pas été revérifiées (P35). Il n'y a pas de preuve de volonté de payer pour un outil dédié. Les éditeurs qui vendent la DDA prouvent seulement une demande pour des suites complètes. |
| Distribution (15) | 7 | **6** | 9,0 | 27 500 COA identifiables (P06) et fondateur francophone. Mais aucune association ne distribue de logiciel et l'ANACOFI fournit ses propres modèles (P20, P22). |
| Lacune (10) | 5 | **2** | 2,0 | Lya, CourtiGo, Custy et SKY revendiquent la DDA ; les extranets et associations fournissent des fiches gratuites. |
| Faisabilité (10) | 8 | **8** | 8,0 | Inchangée : stack Relanzio réutilisable. Le contenu métier et le HDS éventuel sont les points durs. |
| Marge (5) | 8 | **7** | 3,5 | Marge brute élevée, mais prix plafonné autour de 30-40 €/mois. |
| Timing (5) | 9 | **6** | 3,0 | En vigueur depuis 10 mois : la vague de mise en conformité est probablement déjà absorbée par les éditeurs en place [H]. |
| Défendabilité (5) | 4 | **2** | 1,0 | Commoditisable par un LLM et par les éditeurs en place. |
| Risques (5) | 6 | **4** | 2,0 | Responsabilité éditeur, HDS possible, réaction des éditeurs en place, instabilité des associations (P24). |
| **Total** | **71 (A-top)** | | **53,0 / 100** | Confiance : moyenne (texte primaire non lu ; concurrents vérifiés par extraits). |

**Verdict** : **NO-GO en l'état** (« formalisation du devoir de conseil » pour courtiers). Un **GO conditionnel** reste possible pour une expérience de 2 à 3 semaines sur le wedge « conseil dans la durée et campagnes d'échéance en surcouche », qui réutilise le moteur de relance Relanzio, sous réserve que E1, E3 et E5 ne l'invalident pas.
