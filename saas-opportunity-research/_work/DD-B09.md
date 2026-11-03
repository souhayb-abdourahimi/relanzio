# DD-B09 — Registre de conformité des fluides frigorigènes par équipement : B-09 (US, AIM Act ER&R) + B-10 (FR, Cerfa 15497 / F-gas)

Due diligence de phase 2 · 2026-10-29.

Preuves : `DD-B09-preuves.csv` (P01 à P39). Concurrents : `DD-B09-concurrents.csv`.

**Méthode.** Environ 34 recherches web, dont plus de 40 % visaient à invalider l'idée. WebFetch est bloqué (epa.gov, ecologie.gouv.fr et data.gouv.fr renvoient ENOTFOUND ou 403). Toutes les preuves proviennent donc d'extraits de recherche, qu'aucune page n'a été ouverte pour confirmer.

**Étiquettes.** [O] fait observé (sourcé) · [E] estimation · [H] hypothèse · [?] inconnu.

## Verdict en tête

| Option | Note phase 1 | Note phase 2 | Verdict |
|---|---|---|---|
| B-09 US (ER&R) | 70 (B-top) / 68 (barème brut) | **46** | NO-GO pour un solo francophone |
| B-10 FR (Cerfa / registre / PAC) | 67 (B-top) / 64 (barème brut) | **52** | NO-GO en produit autonome ; au mieux un test de 4 semaines |

**Note retenue pour le finaliste : 52/100.**

**Marché à attaquer d'abord, si l'on attaque : la France.** Ce choix ne tient pas à la qualité du marché français. Il tient à la dégradation encore plus forte du marché US :
- la règle est en cours de reconsidération ;
- le wedge exact est déjà vendu entre 29 et 89 USD par mois ;
- des applications gratuites existent ;
- les FSM ont ajouté la fonction ;
- la distribution est difficile depuis la France.

## Ce que la phase 2 change par rapport à la phase 1

1. **Erreur de date corrigée.** La réparation des fuites ER&R s'applique à tous les appareils couverts (15 lb ou plus) depuis une date unique, le **1er janvier 2026** [P01]. Le **1er janvier 2027** ne concerne que la **détection automatique des fuites** (ALD) des systèmes de froid commercial ou IPR existants de **1 500 lb ou plus** installés entre 2017 et 2025 [P02, P03]. Ces systèmes appartiennent à de grands sites, pas à la clientèle d'un petit contractor. Le catalyseur « 2027 » de la phase 1 est donc largement inexistant pour l'ICP visé. Autres dates : réfrigérant régénéré obligatoire au 1/1/2029 pour l'entretien des systèmes de supermarché, bouteilles jetables au 1/1/2028 [P04].
2. **Reconsideration EPA : l'hypothèse de la phase 1 est confirmée.**
   - Le 26/05/2026, l'EPA a proposé d'exclure les TRU (transport frigorifique) des obligations de réparation [P05], à la suite d'une pétition de Carrier du 21/04/2026 [P07].
   - L'EPA annonce qu'elle « s'attaquera ensuite » à la **gestion des fuites**, avec la **distribution alimentaire** et la climatisation résidentielle comme secteurs sensibles [P06].
   - La NGA et la FMI (épiciers et supermarchés) demandent l'alignement sur les seuils SAO de la Part 82, soit 50 lb au lieu de 15 lb [P08, P09].
   - Précédent : en 2020, la même famille politique avait déjà retiré l'extension HFC des règles de fuite [P10].
   - Aucun recours contentieux contre ER&R n'a été trouvé [P11].
   - Aucune proposition « leak management » n'était publiée à la date de la recherche [?].
   - **Conséquence.** Le segment des 15 à 50 lb (chambres froides, groupes de restaurants et de supérettes) est le seul vraiment nouveau pour les petits contractors, car les plus de 50 lb sont suivis depuis des années sous la Part 82. C'est précisément ce segment que les pétitions veulent supprimer.
3. **Le cœur produit est commoditisé en France.**
   - L'État a lancé l'**application gratuite « Fluides Frigorigènes »** (DGPR), présentée le **22 avril 2026**. Elle couvre la saisie des fiches d'intervention, la signature du détenteur qui verrouille la fiche, et le **bilan annuel des fluides** [P25, P26, P27].
   - Trackdéchets (BSFF) est gratuit et obligatoire depuis 2023 [P30].
   - L'« inconnu clé » de la phase 1 est levé : la fiche électronique est acceptée [P32], et c'est l'État lui-même qui la propose.
4. **Les FSM US ont la fonction.** ServiceTitan propose un formulaire Refrigerant Tracking [P17], BuildOps un suivi réfrigérant par équipement [P18]. ServiceChannel couvre les chaînes, où le donneur d'ordre impose l'outil au prestataire [P19].

## 1. ICP, utilisateur, prescripteur, décideur, sponsor, objections, contexte d'achat

| | US (B-09) | FR (B-10) |
|---|---|---|
| ICP | Contractor de froid commercial de 1 à 15 techniciens, clients restaurants, supérettes, épiceries indépendantes, chambres froides de 15 à 50 lb ; hors chaînes équipées de ServiceChannel ou Trakref [H] | Frigoriste ou climaticien de 1 à 10 techniciens, titulaire d'une attestation de capacité, froid commercial et PAC tertiaire ; pas encore de FSM complet (Praxedo, etc.) [H] |
| Utilisateur | Technicien certifié Section 608 (saisie d'une recharge) ; dispatcher | Technicien (fiche), assistante ou gérant (bilan annuel, audit de l'organisme agréé) |
| Prescripteur | Grossistes frigorifiques, RSES/ACCA, formateurs 608 [H] | Organisme agréé (audit annuel), CAPEB/UECF-FFB/SNEFCCA, distributeurs de fluides [H] |
| Décideur économique | Propriétaire du contractor | Gérant |
| Sponsor | Client propriétaire de l'équipement qui exige des registres [H] | Organisme agréé qui signale les manques en audit [H] |
| Objections | « ServiceTitan le fait déjà » ; « la règle va sauter » ; « 608Log est gratuit » ; « c'est le problème du propriétaire » | « L'appli de l'État est gratuite » ; « j'ai C'Fluide à 22 € » ; « mes carnets Cerfa suffisent » ; « 450 € d'amende au pire » |
| Contexte d'achat | Achat en ligne à moins de 100 USD par mois, essai gratuit, sans cycle | Achat de TPE, démo téléphonique, déclenché par un audit ou le changement de régime du 1/1/2027 [P28] |

**Obligations : propriétaire ou technicien.** Aux US, l'obligation de réparer, de vérifier et de conserver les registres pèse d'abord sur le **propriétaire ou l'exploitant** (supermarché, restaurant). Le technicien doit calculer le taux de fuite et documenter son intervention. Un registre détenu par le contractor et inaccessible au propriétaire ne suffit pas [P21, source commerciale, confiance faible].

Cela crée une tension. Le contractor est l'acheteur naturel d'un outil de terrain, mais le risque juridique est porté par le client. Les grandes chaînes imposent leur portail [P19].

En France, l'opérateur attesté établit la fiche. Le détenteur la co-signe au-dessus des seuils, conserve l'original et tient le registre de l'équipement. Les deux conservent la fiche 5 ans [P33].

## 2. Job-to-be-Done et workflow actuel

**JTBD.** « Quand j'ajoute du réfrigérant sur un appareil, je veux savoir immédiatement si le seuil de fuite est dépassé et produire la preuve conforme. Je veux aussi que mon client et moi soyons couverts en cas de contrôle, sans double saisie. »

**Workflow US actuel.**
1. Le technicien recharge.
2. Il note les livres ajoutés sur le bon d'intervention (papier ou champ FSM).
3. Le calcul du taux de fuite se fait de tête ou sur un calculateur, quand il est fait (annualisé ou moyenne glissante sur 365 jours).
4. Si le seuil est dépassé : réparation sous 30 jours, vérification initiale et de suivi, inspections périodiques.
5. Le bureau facture et archive 3 ans.
6. Le propriétaire doit garder une copie.

**Workflow FR actuel.**
1. Fiche Cerfa 15497*04 par intervention (papier ou application).
2. Signature du détenteur.
3. BSFF dans Trackdéchets pour le fluide récupéré.
4. Report dans le registre de l'équipement.
5. Planification des contrôles d'étanchéité selon les tonnes équivalent CO2 (F-gas 2024/573), et entretien biennal des PAC de 4 à 70 kW.
6. Bilan annuel des mouvements de fluides à l'organisme agréé.

**Douleur.** Double ou triple saisie (fiche, BSFF, registre, bilan), calcul de seuils, échéances à suivre. Fréquence : à chaque intervention avec manipulation de fluide, soit plusieurs fois par semaine et par technicien [E].

**Ce qui a diminué la douleur en 2026.** En France, l'application de l'État fusionne fiche et bilan [P25]. Aux US, les calculateurs sont gratuits [P14, P15].

## 3. Coût de l'inaction

**Contractor US.**

> Coût annuel = (temps de calcul et d'archivage × recharges par an × coût horaire) + P(perte d'un compte commercial faute de registres) × marge du compte + P(sanction) × amende

| Paramètre | Valeur | Étiquette |
|---|---|---|
| Temps par recharge | 10 min | [H] |
| Recharges sur des appareils de 15 lb ou plus | 150 par technicien et par an | [H] |
| Coût horaire chargé | 60 USD | [H] |
| Coût temps, par technicien | environ 1 500 USD par an | [E] |
| Amende | 44 539 ou 59 114 USD par jour et par violation selon la source | [O, contradictoire, non vérifié auprès de l'EPA] |
| Probabilité de contrôle | faible, dans un contexte de déréglementation et d'« assistance à la conformité » | [H] |

**Propriétaire de supermarché.** Le profil type EPA est de 3 500 lb à 25 % de fuite par an, soit environ 875 lb perdues par an [P22, O, ancien]. La valeur en USD dépend d'un prix du réfrigérant non sourcé ici [?]. Cette douleur réelle et chiffrable appartient au propriétaire, que ServiceChannel, Trakref et les fournisseurs d'ALD servent déjà.

**Frigoriste FR.**

> Coût annuel = temps de double saisie + amende R543 (450 € par manquement, 3e classe) [P34, O] + risque de non-renouvellement de l'attestation en audit [H]

Avec l'application gratuite de l'État, le coût évité par un outil payant se limite au temps gagné par rapport à cette application [?]. C'est faible.

## 4. Concurrents (détail dans le CSV)

| Acteur | Marché | Prix | Lecture |
|---|---|---|---|
| Ref LeakLog | US | 29 / 59 / 89 USD par mois [O] | Le wedge exact, déjà construit, au prix plancher |
| 608Log, LeakClock, EPA Refrigerant Tracker, hvacaudit | US | Gratuit ou inconnu [O] | Afflux d'outils indépendants depuis 2026 : commoditisation |
| ServiceTitan, BuildOps | US | Inclus, prix non publié | Registre par équipement natif ; calcul automatique non démontré pour ServiceTitan |
| ServiceChannel, Trakref (Fexa) | US | Sur devis | Côté propriétaire ; impose la saisie au prestataire |
| Oxmaint, Nuvolo, Blynk, Axiom | US | Prix contradictoires | GMAO et capteurs |
| Jobber, Housecall Pro, FieldEdge | US | ? | Résidentiel, exempté de toute façon [P12] |
| Appli « Fluides Frigorigènes » (État) | FR | **Gratuit** [O] | Fiche, signature, bilan ; pas d'intégration tierce, export CSV |
| Trackdéchets | FR | Gratuit, obligatoire | BSFF, avec une API |
| C'Fluide | FR | 22 à 204 € par mois, utilisateurs illimités [O] | Spécialiste ; plus de 400 clients en 2018 |
| Extractivs, F.i360, Praxedo | FR | ? | Cerfa intégré au FSM |
| Kizeo Forms | FR | 12 à 22 € par utilisateur et par mois [O] | Formulaires génériques |

**Plaintes utilisateurs.** Aucune plainte publique trouvée (Reddit et forums non remontés). C'est une preuve contraire faible mais réelle.

## 5. Différenciation possible

Les wedges restants sont étroits :
- **(a) FR, une couche au-dessus des outils publics.** Registre de l'équipement côté détenteur, planification des contrôles d'étanchéité selon les tonnes équivalent CO2, attestation d'entretien PAC, portail client. S'y ajoute une passerelle vers l'application de l'État (CSV) et Trackdéchets (API BSFF [P31]) pour supprimer la double saisie.
- **(b) US, un portail propriétaire de restaurants ou supérettes alimenté par le contractor**, marqué au nom du contractor. Il exporte les « records » exigés du propriétaire.

**Time-to-value.** Moins d'une heure [E].

**ROI mesurable.** Uniquement en temps [H]. La raison de changer est faible dans les deux cas. En France, l'outil gratuit de l'État pose un plafond de prix psychologique. Aux US, Ref LeakLog et les applications gratuites, plus l'incertitude réglementaire, jouent le même rôle.

## 6. Taille de marché bottom-up

**US.**

| Étape | Valeur | Étiquette |
|---|---|---|
| NAICS 238220 | 190 808 entités, date inconnue | [O, P23] |
| Part froid commercial | 5 à 10 % | [H] |
| Acheteurs (TAM) | 9 500 à 19 000 | [E] |
| Prix | 50 à 90 USD par mois | [E] |
| TAM | 5,7 à 20,5 M USD par an | [E] |
| SAM : 1 à 15 techniciens, sans ServiceTitan ni BuildOps, clientèle de 15 lb ou plus hors chaînes | 3 000 à 8 000 contractors, soit 1,8 à 8,6 M USD | [H] |
| SOM à 3 ans, solo depuis la France | 40 à 150 clients, soit 25 à 160 k USD d'ARR | [E] |
| Risque binaire | Si le seuil remonte à 50 lb, le SAM peut être divisé par deux ou plus | [H] |

Le nombre de techniciens certifiés Section 608 est **inconnu** : l'EPA ne publie pas de total [P24].

**France.**

| Étape | Valeur | Étiquette |
|---|---|---|
| Établissements attestés | **inconnu**. La liste REP-GF existe sur data.gouv.fr [P38], mais son API était inaccessible | [?] |
| Fourchette de travail | 15 000 à 30 000 établissements | [H, non sourcé] |
| Borne basse du marché payant | C'Fluide, plus de 400 clients en 2018 | [O, P36] |
| Prix | 30 à 60 € par mois | [E] |
| TAM | 5,4 à 21,6 M€ | [E] |
| SAM : TPE de 1 à 10 techniciens, sans FSM, n'adoptant pas l'application gratuite | 3 000 à 8 000, soit 1,1 à 5,8 M€ | [H] |
| SOM à 3 ans | 80 à 250 clients, soit 30 à 150 k€ d'ARR | [E] |
| Extension UE (F-gas 2024/573) | Formats nationaux différents | [?] |

## 7. Pricing

**Recommandé (FR) : 29 € HT par mois par entreprise, jusqu'à 3 techniciens, puis 9 € par technicien.** Inclut registre, planning des contrôles et de l'entretien PAC, portail détenteur et passerelle vers l'application de l'État et Trackdéchets. Le gérant signe.

**Alternatives :**
- (1) 290 € par an avec paiement annuel au moment du bilan (janvier) ;
- (2) facturation au parc : 1 € par équipement suivi et par mois, plafonnée.

**US, si jamais :** 39, 69 ou 99 USD par mois, calé juste au-dessus de Ref LeakLog, ce qui donne peu de raisons de payer plus.

**ROI (FR).** 2 techniciens × 4 fiches par semaine × 46 semaines × 5 min économisées [H] ≈ 31 h par an × 45 € [H] ≈ **1 400 € par an**, contre 348 € par an. Le ROI est positif sur le papier, mais l'application gratuite capture probablement la majeure partie de ce gain.

## 8. Intrants du modèle économique

| Intrant | Valeur | Étiquette |
|---|---|---|
| ARPA | FR 35 € par mois ; US 60 USD par mois | [E] |
| COGS | Hébergement Supabase et PDF moins de 1 € par compte et par mois ; IA optionnelle (OCR de plaques signalétiques) 0,1 à 0,5 € ; support 1 à 3 € | [E] |
| Marge brute | 85 à 90 % | [E] |
| CAC | FR 150 à 400 € (prospection sur liste publique, partenariats d'organismes) ; US 300 à 800 USD (ads et SEO saturés par Oxmaint et les indépendants) | [H] |
| Cycle de vente | FR 1 à 4 semaines ; US en libre-service | [H] |
| Churn mensuel | 2 à 4 % ; risque de pic si l'application de l'État s'enrichit (FR) ou si la règle est assouplie (US) | [H] |
| Payback | FR 5 à 13 mois ; US 6 à 15 mois | [E] |

## 9. Risques

- **Réglementaire US (critique).**
  - Reconsideration annoncée de la gestion des fuites, distribution alimentaire ciblée [P06].
  - Pétitions NGA et FMI pour revenir à 50 lb [P08, P09].
  - Exemption TRU proposée [P05].
  - Précédent de 2020 [P10].
  - Aucun report formel de l'échéance du 1/1/2026 n'a été trouvé : la règle s'applique, mais son périmètre est menacé.
- **Concurrence publique FR (critique).** Application gratuite de l'État [P25] et Trackdéchets [P30]. L'État peut ajouter le registre ou le planning à tout moment.
- **Responsabilité.** Un calcul de seuil faux peut entraîner une non-réparation et une sanction. Il faut des CGU limitatives, un affichage de la méthode et des citations.
- **RGPD.** Données de techniciens et de sites, risque faible. HIPAA sans objet.
- **Intégrations.**
  - L'application de l'État ne s'intègre pas aux logiciels tiers : CSV seulement [P27], interopérabilité future inconnue [?].
  - L'API Trackdéchets BSFF existe [P31].
  - Aux US, intégration ServiceTitan via une marketplace partenaire, accès [?].
- **Dépendance aux plateformes.** Les donneurs d'ordre imposent ServiceChannel [P19].
- **Réaction des éditeurs.** ServiceTitan et BuildOps ont déjà réagi [P17, P18]. C'Fluide a son module de bilan.
- **IA.** Faible valeur ajoutée. Une erreur d'OCR sur une charge nominale fausse le calcul.

## 10. Distribution

**FR, canal 1 : prospection directe sur la liste publique REP-GF et datafluides** [P38].
- Appels et e-mails aux TPE de froid commercial, avec ce message : « Votre registre d'équipement et vos contrôles d'étanchéité planifiés automatiquement. Fiches importées depuis l'application de l'État. Bilan du 31 janvier prêt en 1 clic. »
- 10 conversations : 100 appels ciblés sur une région, plus 2 grossistes (comptoirs de fluides) le matin [H].

**FR, canal 2 : organismes agréés et syndicats.**
- Contexte : nouvelles catégories A1/A2/B/C au 1/1/2027 [P28, P29].
- Sujets à porter : webinaires CAPEB/SNEFCCA, partenariat « kit de conformité » avec un organisme d'attestation [H].

**US.** Les canaux seraient les grossistes (Johnstone, United Refrigeration [H]), les groupes Facebook et Reddit de techniciens, et le SEO. Depuis la France : décalage horaire, culture du téléphone, aucune légitimité locale, et un SEO déjà saturé (pages Oxmaint, dizaines de pages.dev). **Distribution jugée non crédible pour ce profil.**

**Premières ventes sans audience (FR).** Pilote gratuit de 60 jours pour 5 frigoristes rencontrés au comptoir d'un distributeur, en échange de témoignages.

## 11. Faisabilité MVP

**Architecture.** Stack Relanzio réutilisable : Node, Supabase, Stripe, Brevo. Modèle de données :
- client et site, puis équipement (fluide, charge, tonnes équivalent CO2, catégorie) ;
- intervention (fluide ajouté ou récupéré) ;
- règles (seuils, fréquences de contrôle) ;
- documents (PDF du Cerfa 15497*04, registre).

PWA hors ligne pour le terrain. Rappels Brevo réutilisables (logique de relance de Relanzio).

**Intégrations indispensables (FR).** Import et export CSV de l'application de l'État, API Trackdéchets BSFF.

**Partie difficile.**
- Règles F-gas par seuil de tonnes équivalent CO2, dont la réduction de fréquence avec détection de fuites.
- Transition de catégories 2027.
- Signature du détenteur à valeur probante.
- Hors ligne fiable.

**Coût et délai.** 6 à 10 semaines à 1 ETP [E]. Hébergement moins de 50 € par mois [E].

**Dépendance critique.** Évolution de l'application de l'État [?].

## 12. Défendabilité à 2 ans

**Faible.**
- La logique de règles est publique et tient en quelques centaines de lignes. Un LLM généraliste produit un calculateur en une soirée, ce que montre l'afflux d'outils pages.dev aux US [P14 à P16].
- L'État français peut absorber le registre et le planning.
- ServiceTitan et BuildOps peuvent ajouter le calcul automatique.

**Pourquoi le client resterait.** L'historique d'équipements et de fiches crée un coût de sortie, et un portail détenteur produit un petit effet réseau contractor → clients [H]. Cela ne suffit pas à protéger les marges face à un outil gratuit.

## 13. Raisons de NE PAS le faire, et expériences d'invalidation

**Raisons de ne pas le faire :**
- (1) L'application gratuite de l'État couvre le cœur B-10.
- (2) La règle US est en cours de reconsideration sur le segment visé.
- (3) Ref LeakLog, des applications gratuites et des FSM couvrent déjà B-09.
- (4) La sanction française est faible (450 €).
- (5) Aucune preuve de volonté de payer ou de plainte n'a été trouvée.
- (6) La distribution US n'est pas crédible depuis la France.

**Expériences d'invalidation (2 à 4 semaines, avant tout code) :**
1. Appeler 20 frigoristes issus de REP-GF et demander : « Utilisez-vous l'application de l'État ? Qu'est-ce qui manque ? Paieriez-vous 29 € par mois ? » **Arrêt si moins de 3 sur 20 se disent prêts à payer pour le registre et le planning hors application de l'État.**
2. Demander à 2 organismes agréés ce qui fait échouer les audits, pour savoir si le registre ou le bilan sont des motifs fréquents. **Arrêt si non.**
3. Suivre le Federal Register et le Unified Agenda de l'EPA pour une proposition « leak management ». **Arrêt US définitif si le seuil passe à 50 lb.**
4. Landing page FR à 29 € avec pré-inscription, 300 € d'annonces ciblées. **Arrêt si le taux de conversion vers la pré-inscription est inférieur à 3 %.**

## 14. Re-notation (notes de 0 à 10 par critère)

Rappel de la phase 1 (barème brut `scores-bruts.csv`) : B-09 D7 F7 P6 Dist6 L6 MVP9 M8 T10 Déf4 R6 = 68 (70 dans B-top) ; B-10 D6 F7 P5 Dist7 L5 MVP9 M8 T5 Déf5 R8 = 64 (67 dans B-top).

| Critère (poids) | B-09 US, phase 1 → phase 2 | B-10 FR, phase 1 → phase 2 | Cause du changement |
|---|---|---|---|
| Douleur (20) | 7 → 5 | 6 → 4 | US : obligation surtout côté propriétaire, résidentiel exempté, faible probabilité de contrôle. FR : amende de 450 € et appli gratuite qui retire la douleur de saisie |
| Fréquence (10) | 7 → 6 | 7 → 7 | US : seules les recharges sur des appareils de 15 lb ou plus comptent |
| Preuves (15) | 6 → 6 | 5 → 6 | Règles vérifiées, marché payant observé (Ref LeakLog, C'Fluide), mais aucune preuve de volonté de payer ni de plainte |
| Distribution (15) | 6 → 3 | 7 → 6 | US non crédible depuis la France. FR : liste publique, mais l'État occupe les mêmes canaux |
| Lacune (10) | 6 → 2 | 5 → 2 | Ref LeakLog à 29 USD, applis gratuites, FSM, ServiceChannel. Appli de l'État gratuite, C'Fluide à 22 €, Kizeo |
| Faisabilité (10) | 9 → 8 | 9 → 7 | FR : interopérabilité avec l'appli de l'État limitée au CSV, règles F-gas, signature |
| Marge (5) | 8 → 6 | 8 → 6 | Prix plafonnés par le gratuit |
| Timing (5) | 10 → 3 | 5 → 6 | US : l'échéance de 2026 est passée, celle de 2027 ne vise que l'ALD de 1 500 lb ou plus, et une reconsideration arrive. FR : changement de régime au 1/1/2027 [P28] |
| Défendabilité (5) | 4 → 2 | 5 → 3 | Logique publique, commoditisée par les LLM et l'État |
| Risques (5) | 6 → 2 | 8 → 5 | US : risque d'assouplissement ciblé. FR : extension possible de l'appli de l'État |
| **Total /100** | **68 → 46** | **64 → 52** | |

**Note finale du finaliste B-09 (+B-10) : 52/100.** On retient la meilleure option, le FR. Confiance moyenne : les preuves viennent d'extraits, le volume d'opérateurs FR est inconnu, et la volonté de payer n'est pas testée.
