# P7-DD-N04 — Application Jira (Forge) de justification du temps R&D : CIR/CII, puis SR&ED, UK, US

Date : 2026-10-29. Preuves : `P7-DD-N04-preuves.csv` (P7DN04-P01 à P50).
Étiquettes : **[P]** preuve sourcée, **[E]** estimation raisonnée, **[H]** hypothèse non vérifiée.

## 0. Méthode, limites, verdict

- **41 WebSearch** (une de plus que le plafond de 40 du brief), plus **1 WebFetch**.
  - **Invalidation** : 30 recherches sur 41, soit environ 73 %. Elles visaient les apps concurrentes, les fonctions natives, les outils des cabinets, les tarifs bas, les exigences documentaires, les règles Atlassian et l'instabilité fiscale.
  - Le WebFetch sur `marketplace.atlassian.com` a échoué (ENOTFOUND). Pour lire les fiches (installations, avis, prix exacts), il faut autoriser ce domaine dans les réglages réseau de la session.
- **Toutes les preuves sont des extraits de moteur de recherche.** Aucune page n'a été ouverte : ni le BOFiP, ni le guide MESR complet, ni les fiches Marketplace.
- **Recherche nominative** des éditeurs multi-verticaux et des fonctions natives :
  - éditeurs de temps sur Jira : Tempo, Clockwork, Timesheet Management PRO, ActivityTimeline ;
  - apps R&D fiscales : SABI, Sredio, RDTI Tracka, Finnli ;
  - cabinets : Ayming, Leyton, G.A.C./MyCIR ; ABGi et Sogedev ne sont pas ressortis ;
  - acteurs SR&ED, US et UK : Boast, Chrono, GrowWise, SRED.io, SRED.it, Neo.Tax, TaxCredit.ai, Tax Cloud, Perspiqua ;
  - outils de temps génériques : Forecast, Teamwork (aucune fonction R&D trouvée), Toggl, Harvest.
  - Swile et Jenji (titres-restaurant, notes de frais) ne sont pas pertinents. Je ne les ai pas recherchés.
- **Verdict** : **49,5/100**, contre 54,5 au rescreen. **La piste recule derrière N06 et C-39.**
  - Le problème réglementaire est réel.
  - Mais la demande observée sur la Marketplace pour cette catégorie est très faible : environ 100 installations cumulées pour les trois apps fiscales R&D visibles, dont deux gratuites.
  - Le temps par projet et par personne est déjà couvert gratuitement ou à bas prix par Tempo et Clockwork.
  - La partie qui a de la valeur (opérations, état de l'art, valorisation) reste humaine ou relève des cabinets.
  - Deux bonnes surprises : **0 % de commission Atlassian** jusqu'à 1 M$ de revenus Forge, et un **transfert d'app documenté**.
  - Recommandation : garder la piste en réserve, avec un test de 30 jours **sans code**, centré sur une prestation de « rattrapage CIR 2026 depuis Jira » facturée.

---

## 1. Problème et acheteur

### ICP
- **Startups et PME tech françaises de 8 à 60 personnes sur Jira Cloud** qui déclarent le CIR ou le CII. Elles font l'une de ces deux choses :
  - elles déposent en autonomie, ou avec un forfait de type MyCIR ;
  - elles passent par un cabinet, mais doivent elles-mêmes fournir le tableau des temps.
- **Acheteur** : CEO, DAF ou CFO à temps partiel. **Utilisateur** : CTO ou engineering manager, qui rattache les tickets aux opérations.

### Volume
| Donnée | Valeur | Étiquette |
|---|---|---|
| Sociétés déclarant le CIR en 2023 | 29 720 | [P] P32 |
| Part de PME parmi les déclarants (2021) | 84 % | [P] P32 |
| PME déclarant des dépenses d'innovation (CII), 2023 | > 11 000, en partie les mêmes que les déclarants CIR | [P] P32 |
| Part du logiciel et du numérique parmi les déclarants | non trouvée ; 20 à 30 % supposés | [H] |
| Part sur Jira Cloud | non trouvée (aucune statistique française) ; 30 à 50 % supposés pour les éditeurs logiciels | [H] |
| **Instances Jira françaises concernées** | **≈ 2 000 à 4 500** | [H], produit de deux hypothèses |
| Parmi elles, sur le plan Jira Free (≤ 10 utilisateurs, donc faible budget) | part significative, non chiffrée | [E] d'après P48 |

### Workflow actuel et fréquence
- **Pour un exercice civil, la déclaration annuelle (2069-A-SD) se dépose en mai** [E, date usuelle non revérifiée]. Le dossier justificatif n'est produit qu'en cas de contrôle ou de demande, mais il doit être **constitué au fil de l'eau** [P] P15.
- **Pratique observée chez les cabinets** [P] P13 :
  - le temps est demandé par personne et par projet, idéalement par phase ou par tâche ;
  - il faut le renseigner régulièrement, pour éviter une reconstitution a posteriori ;
  - les dirigeants valorisés au CIR sont souvent contestés.
- **Pratique supposée des startups** [H] :
  - reconstitution en avril-mai, sous Excel, à partir de Jira, des agendas et de la mémoire ;
  - ou export brut des worklogs, quand l'équipe saisit son temps, ce qui est minoritaire chez les développeurs [H].
- **Fréquence** :
  - la valeur se concentre une fois par an, au dépôt, ou en cas de contrôle ;
  - le geste utile (rattacher et saisir) est quotidien ou hebdomadaire.

### Un export de worklogs suffit-il ? Réponse : **nécessaire, pas suffisant**
- **Doctrine et jurisprudence** :
  - suivi « précis et rigoureux », estimations forfaitaires exclues (doctrine reprise dans l'amendement CF753) [P] P14 ;
  - temps réellement consacrés : CAA de Paris, déc. 2023 [P] P12 ;
  - un tableau annuel en pourcentages a été refusé (Cellectis) [P] P13.
  - Des worklogs Jira datés, par personne et par ticket, sont donc de bonnes **traces contemporaines** [E].
- **Ce qu'un export ne fait pas** :
  1. **Rattacher chaque ticket à une opération de R&D éligible**, et exclure le développement courant, les bugs et le support.
  2. Fournir la **fiche par opération** (≤ 10 pages, état de l'art critique, verrous), dont l'intitulé doit être identique à celui du classeur Excel [P] P15.
  3. **Valoriser** les dépenses (salaires, charges).
  4. **Figer** les périodes (aucune modification rétroactive).
  - La première cause de reprise après contrôle est l'absence de documentation technique [P] P49. Ce n'est pas le tableau des temps.
- **SR&ED** : l'ARC attend des relevés de temps contemporains, selon des cabinets [P] P22. Aucune publication de l'ARC n'a été lue.
- **Conséquence** : le produit ne crée de la valeur que s'il couvre les points 1, 2 (au moins une trame pré-remplie) et 4. Le point 2 est le plus utile, mais il est **difficilement automatisable sans risque** : « le CIR ne peut pas être automatisé » [P] P16.

### Coût de l'inaction
- Reprise des dépenses de personnel valorisées, généralement le premier poste de l'assiette [E], avec intérêts de retard.
- **1 à 5 jours** de reconstitution par campagne [H, à confirmer en entretien].
- Les honoraires de cabinet au succès atteignent 25 % du crédit dans l'exemple du BOFiP [P] P21. Ils couvrent le dossier, pas forcément le tableau des temps [E].

### Preuves de dépense actuelle
| Signal | Valeur | Étiquette |
|---|---|---|
| Honoraires de cabinet au succès | 25 % du CIR (exemple BOFiP) | [P] P21 |
| MyCIR (G.A.C.), forfait en autonomie | 2 500 € HT/an, jusqu'à 3 projets (2023) | [P] P20 |
| Outil Ayming/LabOxy | 9 €/personne/mois sous 25 salariés (2017, ancien) | [P] P17 |
| Chrono R&D (SR&ED) | 2 000 à 9 500 CAD par dossier, avec intégration Jira | [P] P23 |
| Tempo | des clients produisent leurs rapports de crédit R&D depuis Jira (étude de cas) | [P] P05 |
| **Apps Jira dédiées au crédit R&D** | Sredio gratuit, 62-64 installations ; RDTI Tracka gratuit, 34 ; SABI payant hors Marketplace, installations non affichées | [P] P01-P03 |

**Lecture** : la dépense existe, mais elle va aux **cabinets et aux forfaits de service** (2 500 € à 25 % du crédit), pas aux apps Jira. La catégorie « app Jira R&D fiscale » n'a pas trouvé de demande visible, même gratuite [P].

---

## 2. Concurrence et segment mal servi

| Acteur | Prix | Cible | Limites pour l'ICP | Source |
|---|---|---|---|---|
| Tempo Timesheets | 1 $/utilisateur (≤ 10) ; 5,21 $ (11-100) d'après la page éditeur ; 10 $ affiché par Capterra et G2 | Tous, ≈ 26-27 k installations | Rapport CapEx/OpEx et « R&D tax credit » générique ; pas de trame CIR, pas de fiche par opération | P04-P07 |
| Clockwork Lite / Pro | 0 $ sous 10 utilisateurs, puis 0,35 $ | ≈ 8 190 installations | Temps et exports ; rapport CapEx/OpEx ; rien de fiscal | P09-P10 |
| Timesheet Management PRO | non relevé | Finance | CapEx/OpEx par JQL, **mois figés** : couvre déjà le « gel » | P08 |
| SABI SR&ED | payant hors Marketplace, prix inconnu | Canada | SR&ED uniquement ; hébergement canadien | P01 |
| Sredio / SRED.io | app gratuite ; plateforme IA (startup en croissance) | Canada | SR&ED ; 62-64 installations | P02, P27 |
| RDTI Tracka | gratuit | Australie | 34 installations, version de 2022 | P03 |
| Finnli | inconnu | R&D en général | Conformité dépenses ; CIR non mentionné | P50 (basse) |
| MyCIR (G.A.C.) | 2 500 € HT/an | Startups et PME FR | Service et plateforme du cabinet ; pas d'intégration Jira connue | P20 |
| Ayming Drive / Leyton For Me | inclus dans la mission ou sur démo | Clients des cabinets | Portails de cabinet, pas d'outil de saisie Jira identifié | P18, P19 |
| Chrono, Boast, GrowWise | 2-9,5 k CAD par dossier, ou 15-25 % au succès | Canada, US | Intégration Jira **déjà présente** ; financés | P23-P25 |
| SRED.it | 0 / 29 / 79 $ par mois | Canada | Analyse GitHub ; ancre de prix basse | P26 |
| TaxCredit.ai, Neo.Tax (US) ; Perspiqua, Tax Cloud (UK) | 2 % des dépenses qualifiées ; 75 £/mois + 1 499 £/dossier | US, UK | Intégrations Jira annoncées (TaxCredit.ai, Perspiqua) | P28-P31 |
| Jira natif | inclus (gratuit ≤ 10 utilisateurs) | — | Rapport par ticket, sans agrégation ni export selon un concurrent | P11, P48 |

### Ce que les puissants servent mal
- **Aucune app Jira propre au CIR français n'a été trouvée** [P] P50. Selon la règle du brief, cette absence vaut **au plus 5/10** en différenciation. La recherche nominative montre que **Tempo** vise déjà explicitement le « R&D tax credit reporting » [P] P05-P06. Le vide est donc étroit : il tient au **format CIR/MESR, à la langue et à la notion d'opération**.
- **Pays secondaires** : le Canada, les US et le UK sont déjà occupés par des acteurs financés, dotés d'une intégration Jira (Boast, Chrono, GrowWise, SRED.io, TaxCredit.ai, Perspiqua) [P]. **L'extension multi-pays du rescreen est un argument faible.**

### Ce qui empêcherait l'hôte, ou Tempo, de copier
- **Atlassian** : il est peu probable qu'il développe une fonction fiscale propre à la France [E]. Son IA (Rovo) pourrait toutefois résumer des tickets en narratif [H].
- **Tempo** : ajouter un modèle « CIR » à son rapport CapEx serait facile [E]. La seule barrière est son intérêt limité pour un marché de quelques milliers d'instances [E].
- **Fossé défendable** : le contenu réglementaire tenu à jour (trame MESR, qui change chaque année : versions 2024 et 2025 [P] P15), le français, et la relation avec les experts-comptables. **C'est faible.**

---

## 3. Acquisition (A)

### Canal 1 — Atlassian Marketplace
- Mots-clés à couvrir : « CIR », « crédit d'impôt recherche », « R&D tax credit », « timesheet R&D ».
- **Évidence défavorable** : environ 100 installations cumulées pour les trois apps R&D fiscales visibles, dont deux gratuites [P] P02-P03. **Le trafic d'intention fiscale sur la Marketplace est donc faible.**
- Attente : **1 à 4 essais par mois** en régime de croisière en France [H].
- Avantage : facturation, TVA et licences gérées par Atlassian, conversion de l'essai sans friction [E].

### Canal 2 — Prescription et contenu français
- **Experts-comptables orientés startups et cabinets CIR « au forfait »** : ils ont besoin d'un tableau des temps propre, que l'app leur fournit [E].
- **SEO** : « tableau des temps CIR », « justifier temps CIR Jira », « contrôle CIR temps ».
- Communautés : France Digitale, groupes ACE Atlassian Paris, Slack de CTO.
- **E-mail B2B** ciblé vers les CEO, DAF et CTO.

### Coût d'acquisition plausible
- **≈ 150 à 300 € par client**, soit 4 à 8 h de contenu, d'échanges avec les prescripteurs et de démos asynchrones, plus des outils [E].
- Le pic d'achat se situe entre **janvier et mai**. Le reste de l'année, l'acquisition est lente [E].

### Listes de prospects et contact légal
- **Il n'existe aucune liste publique des déclarants CIR (secret fiscal)** [E]. Proxys possibles :
  - offres d'emploi mentionnant Jira et R&D ;
  - annuaires French Tech ;
  - posts LinkedIn sur le CIR et le statut JEI ;
  - liste publique des organismes agréés CIR/CII du MESR [E, non vérifiée ici] ;
  - clients des experts-comptables partenaires.
- **France** : prospection B2B par e-mail en **opt-out**, si l'objet est lié à la fonction [P] P46. Mentions obligatoires :
  - identité de l'expéditeur ;
  - lien de désinscription fonctionnel ;
  - information RGPD : source des données et droit d'opposition.
- **US (CAN-SPAM)** : opt-out, adresse postale, en-têtes exacts [E].
- **Royaume-Uni (PECR)** : e-mail libre vers les personnes morales, consentement requis pour les entrepreneurs individuels [E].
- **Canada (CASL)** : consentement exprès, ou tacite si l'adresse est publiée de façon visible et que le message est lié à la fonction [E]. Ces marchés sont de toute façon secondaires.

### Message d'accroche
> « CIR 2026 : vos temps sont déjà dans Jira. Rattachez vos epics aux opérations de R&D en une heure, figez chaque mois, et sortez le tableau des temps par personne et par opération que demandent votre cabinet et le contrôleur, sans reconstitution Excel en avril. »

Ne jamais promettre la conformité ni le montant du crédit.

### Délais réalistes
- **10 clients payants** : **6 à 9 mois** après la mise en ligne, si celle-ci a lieu avant février 2027 [H].
- **40 clients** : **18 à 30 mois**, soit deux campagnes CIR [H].

---

## 4. Produit et exploitation (B)

### Architecture minimale
- **App Forge seule**, sans module Connect, pour être éligible au taux de 0 % [P] P35.
- **Custom UI React**, avec trois écrans :
  1. **Opérations** : création d'une opération de R&D, et rattachement d'epics, de labels ou de JQL.
  2. **Revue mensuelle** : tickets non classés, exclusion des bugs et du support, verrouillage du mois.
  3. **Exports** : tableau des temps par personne, opération et mois en XLSX ou CSV ; trame de fiche MESR pré-remplie en Markdown ou DOCX (intitulés, période, personnes, tickets clés, jalons).
- **Stockage Forge** (KVS ou entités) : opérations, règles, instantanés mensuels figés.
- **Déclencheur planifié** : rappels et instantané mensuel.
- **Aucune donnée salariale stockée** : la valorisation reste dans l'Excel du client ou du cabinet. Le risque RGPD reste ainsi faible [E].
- **Aucune sortie de données** : visée du badge « Runs on Atlassian », argument de sécurité [P] P41.
- **Hors Forge** : un site vitrine statique et une base de connaissances. La pile Relanzio ne sert presque à rien, puisque la facturation passe par Atlassian [E].

### Intégrations indispensables
| Intégration | Stabilité et accès | Étiquette |
|---|---|---|
| Jira Cloud REST v3 (worklogs, issues, changelog, JQL) | Stable et documentée ; accès par les scopes de l'app | [E] |
| Plateforme Forge | Évolue vite : fin de Connect repoussée au 31/01/2027 ; quotas et tarification d'usage de Forge non vérifiés | [P] P38 ; [H] |
| Licences Marketplace | Gérées par Atlassian ; palier aligné sur le produit hôte (forfait ≤ 10 utilisateurs, puis par utilisateur) | [P] P42 |
| Programme partenaire Marketplace | Fiche, onglet sécurité et confidentialité, contact support ; Cloud Fortified remplacé par AEC, qui est **optionnel** | [P] P39 ; [E] sur le caractère optionnel |

### Ce qui casse, et à quelle fréquence
- **Changements de la plateforme Forge** (API, runtime, UI Kit) : plusieurs fois par an, avec préavis [E].
- **Grandes instances** : limites de débit et délais d'exécution sur les gros volumes de worklogs [H].
- **Trame MESR révisée chaque année** [P] P15 et **lois de finances** : taux du CII ramené à 20 % en 2025, dépenses exclues ; PLF débattu chaque automne [P] P34, P33.
- **Équipes qui ne saisissent pas leur temps** : l'app devra proposer une estimation à partir des statuts. Elle est **juridiquement fragile**, puisque les estimations forfaitaires sont exclues [P] P14.

### Charge et support
- **Maintenance : 8 à 12 h par mois** [E].
- **Support** : faible de juin à décembre ; pic de mars à mai, avec des questions de fond (« ce ticket est-il éligible ? ») auxquelles il faut **refuser de répondre**, sous peine de faire du conseil fiscal [E].
- **Automatisable** : agrégation, règles de rattachement, rappels, verrouillage, exports, trame de fiche.
- **Non automatisable sans risque** : qualification de l'éligibilité, état de l'art, verrous, valorisation [P] P16.

### MVP
- **4 à 6 semaines** pour un solo avec Claude Code, plus la revue Marketplace (délai non vérifié) [H].

---

## 5. Économie unitaire (D)

| Clé | Valeur | Justification | Étiquette |
|---|---|---|---|
| prix_mensuel_ht | 49 | Forfait ≤ 10 utilisateurs vers 35 €, puis environ 2,5 €/utilisateur ; panier moyen pour des instances de 10 à 30 utilisateurs. Ancres : Tempo 1 à 5,21 $/utilisateur, Clockwork gratuit sous 10 utilisateurs, MyCIR 2 500 €/an | [H] (ancres [P] P07, P09, P20, P42) |
| cout_variable_client_mois | 1 | Calcul et stockage Forge ; tarification d'usage non vérifiée | [H] |
| frais_paiement_pct | 0.02 | Commission Atlassian de 0 % jusqu'à 1 M$ de revenus Forge [P] P35 ; 2 % pour le change USD→EUR et les virements | [E] |
| frais_paiement_fixe | 0 | Atlassian facture les clients et reverse au partenaire | [E] |
| fixes_mensuels | 60 | Domaine, site, base de connaissances, e-mail, RC pro au prorata | [E] |
| heures_fixes_mois | 10 | Maintenance Forge, veille fiscale, mise à jour annuelle de la trame, contenu | [E] |
| heures_par_client_mois | 0.3 | Support saisonnier lissé sur l'année | [E] |
| churn_mensuel | 0.035 | Valeur annuelle concentrée ; startups qui meurent ou arrêtent le CIR ; cabinets qui reprennent la main ; amorti par l'abonnement annuel | [E] |
| cac | 200 | 4 à 6 h de contenu et de prescription par client, plus outils | [E] |

```json
{"id":"P7-N04","titre":"Application Jira (Forge) de justification du temps R&D CIR/CII","prix_mensuel_ht":49,"cout_variable_client_mois":1,"frais_paiement_pct":0.02,"frais_paiement_fixe":0,"fixes_mensuels":60,"heures_fixes_mois":10,"heures_par_client_mois":0.3,"churn_mensuel":0.035,"cac":200}
```

- **3 000 € de MRR ≈ 62 instances**, soit environ 1,5 à 3 % du parc estimé de 2 000 à 4 500 instances, lui-même [H].
- Écart avec le rescreen : la commission n'est plus pénalisante, mais le prix est revu à la baisse (59 → 49 €), à cause des ancres et de la tarification par utilisateur.

---

## 6. Transférabilité et attractivité (C)

### Ce qui se transfère
| Actif | Mécanisme | Étiquette |
|---|---|---|
| **App Marketplace et licences clients** | Ticket au support Atlassian, avec preuve de vente et confirmation des deux partenaires. **Les clients restent abonnés à l'app**, sans migration Stripe. C'est un net avantage sur un SaaS en direct (cf. P7-cession §9.2) | [P] P40 ; [E] |
| Code et propriété intellectuelle | Dépôt Git ; contrat de cession d'actifs | [E] |
| Identifiant de l'app Forge, rattaché à un espace développeur | Transfert de l'espace par le support ; frictions signalées sur le forum développeurs | [E] (fil vu dans les résultats, non lu) |
| Données clients | Stockées chez Atlassian, dans les sites clients (aucune sortie) ; peu de données détenues par l'éditeur | [E] |
| Métriques | Rapports partenaire Marketplace : ventes, licences, évaluations | [E] |
| Domaine, marque, site, contenu SEO | Classique | [E] |
| Incitation à 0 % | **Ne suit pas l'app** : elle est calculée par partenaire. Un acquéreur qui a déjà dépassé 1 M$ (Appfire, Tempo) paiera 17 % | [P] P37 |

### Ce qui détruit la valeur
- **Dépendance à Atlassian** : la commission a changé trois fois en 2025-2026, et le framework Connect a été retiré [P] P35-P38.
- **Niche française et saisonnière.**
- **Savoir fiscal porté par le fondateur.**
- **Faible MRR probable** : sous 1 k€, la vente est marginale (P7-cession §10).

### Acheteurs probables
1. **Consolidateurs d'apps Atlassian** : Appfire, Tempo [P] P43. Tempo serait l'acquéreur naturel en complément de son rapport R&D, mais seulement si l'app a de la traction.
2. **Cabinets CIR** (Ayming, Leyton, G.A.C., ABGi), comme outil de collecte et d'acquisition de leads [H].
3. **Acheteurs individuels** sur FE International, Acquire ou Flippa : des apps Atlassian y sont proposées, par exemple à 6,4 k$ de MRR [P] P44.

### Points d'audit d'un acheteur
- MRR mensuel et saisonnalité.
- Évaluations converties en ventes.
- Churn par cohorte et par mois.
- Absence de module Connect.
- Remboursements.
- Volume de support en avril-mai.
- Clause de non-conseil fiscal dans les CGU.
- Journal des mises à jour réglementaires.
- Licences open source.
- Onglet confidentialité et sécurité, absence de sortie de données.

---

## 7. Risques et difficultés concrètes

1. **Demande** : catégorie peu installée, même gratuite [P] P02-P03. Risque principal.
2. **Substitution par Tempo, Clockwork et Excel**, déjà présents sur la plupart des instances qui saisissent leur temps [P] P04-P09.
3. **Cabinets** : ils fournissent leur plateforme et demandent leur propre format [P] P18-P20.
4. **Responsabilité** : si un client subit une reprise après avoir suivi les exports de l'app, une réclamation est possible [E]. Il faut des CGU et une assurance RC pro.
5. **Instabilité fiscale** : CII réduit en 2025, débats budgétaires chaque automne [P] P34. Le PLF 2027 maintient le CIR [P] P33.
6. **Plateforme** : tarification Forge, revues de sécurité, programme AEC [P] P39 ; [H].
7. **Saisonnalité** : on encaisse de janvier à mai, on désabonne en juin, si l'abonnement est mensuel [E].
8. **Développeurs qui ne saisissent pas leur temps** : l'estimation automatique est fragile juridiquement [P] P14.

---

## 8. Notes grille v3

| Critère (poids) | Rescreen | DD | Points | Cause de l'écart |
|---|---|---|---|---|
| Problème et volonté de payer (15) | 4 [P] | **4 [P]** | 6 | Inchangé. Douleur prouvée (jurisprudence P12-P13), mais la dépense va aux cabinets et aux forfaits, pas aux apps Jira |
| Acquisition (20) | 6 [P] | **4 [P]** | 8 | −2 : la Marketplace n'apporte pas de trafic d'intention pour cette catégorie (≈ 100 installations cumulées) ; pas de liste de déclarants ; pic saisonnier |
| Exploitation solo (15) | 6 [E] | **6 [E]** | 9 | Inchangé. Forge simple, mais mise à jour fiscale annuelle et support de printemps |
| Rentabilité (15) | 6 [H] | **5 [E]** | 7,5 | −1 : la commission à 0 % [P] compense en partie, mais la tarification par utilisateur, les ancres Tempo et Clockwork et le plan Jira Free tirent le prix vers 49 € |
| Rétention (10) | 6 [E] | **5 [E]** | 5 | −1 : usage annuel, startups qui disparaissent, cabinets qui reprennent la main |
| Revente (15) | 6 [E] | **7 [E]** | 10,5 | +1 : transfert d'app documenté [P] P40, clients sans migration Stripe, acquéreurs actifs [P] P43-P44. Reste une niche française, et l'incitation à 0 % n'est pas transférable |
| Différenciation (5) | 3 [P] | **3 [P]** | 1,5 | Inchangé. Absence d'app CIR (plafond 5), mais Tempo vise le « R&D tax » |
| Risques (5) | 4 [E] | **4 [E]** | 2 | Inchangé. Le risque Connect est neutralisé par Forge seul, la responsabilité fiscale est ajoutée |
| **Total** | **54,5** | **49,5** | | −5 points |

---

## 9. Plan de validation sur 30 jours (avant tout code)

**Fenêtre favorable** : la campagne CIR 2025 (mai 2026) est fraîche dans les mémoires, et la préparation du CIR 2026 commence en janvier.

1. **Premiers clients et contact légal** (semaine 1) :
   - liste de 120 startups françaises sur Jira, via les proxys du §3 ;
   - 10 experts-comptables orientés startups ;
   - 3 cabinets au forfait.
   - E-mail B2B en opt-out, avec objet lié à la fonction, identité de l'expéditeur, lien de désinscription et mention RGPD de la source [P] P46. En parallèle, LinkedIn.
2. **Entretiens** (15 à 20, semaines 1 à 3), sur le comportement passé :
   - « Pour le CIR déposé en mai 2026, comment avez-vous produit le tableau des temps ? Qui l'a fait, en combien d'heures, à partir de quelles sources ? »
   - « Votre cabinet a-t-il demandé des reprises ? Avez-vous déjà eu un contrôle ou une demande de justificatifs ? »
   - « Quelle part des tickets porte un worklog ? Utilisez-vous Tempo, Clockwork ou autre chose ? »
   - « Combien payez-vous pour le CIR (cabinet, forfait) ? »
   - « Qu'avez-vous essayé pour éviter la reconstitution ? »
3. **Proposition de valeur testée** : « tableau des temps par personne et par opération, figé chaque mois, prêt pour votre cabinet, à partir de votre Jira ».
4. **Test de prix** : 3 offres annuelles, 390, 590 et 890 € HT par instance, présentées après l'entretien.
5. **Premiers paiements** :
   - **prestation manuelle facturée « Rattrapage CIR 2026 depuis Jira »** à 490 € HT : j'exploite leur export, je rattache les tickets aux opérations avec eux et je livre le tableau. Le prompt et les scripts deviendront le produit ;
   - ou **précommande annuelle** remboursable si l'app n'est pas livrée avant le 15 mars 2027.
6. **Seuils** :
   - **GO** : ≥ 15 entretiens, **et** ≥ 8 entreprises déclarant ≥ 2 jours de reconstitution par campagne, **et** ≥ 5 paiements (prestation ou précommande) ≥ 390 €, **et** ≥ 1 prescripteur (expert-comptable ou cabinet) qui s'engage à le présenter à ≥ 5 clients.
   - **STOP** : < 2 paiements après 60 contacts qualifiés, **ou** ≥ 60 % des interviewés satisfaits de leur cabinet ou de Tempo pour les temps, **ou** < 40 % qui saisissent leur temps dans Jira ou acceptent de le faire.
7. **Budget** : ≤ 150 € (domaine, outil d'e-mail en offre gratuite, éventuel essai LinkedIn) et environ 45 h du fondateur.

---

## 10. Conditions qui feraient monter ou baisser la piste

**Monterait** (vers 55-58), si :
- ≥ 5 paiements au test, et un prescripteur engagé ;
- les fiches Marketplace (une fois le domaine autorisé) montrent des installations ou des avis significatifs pour SABI ou des apps CapEx ;
- les cabinets confirment qu'ils reçoivent des tableaux de temps inexploitables ;
- l'incitation Forge à 0 % est maintenue au-delà de 2027.

**Baisserait** (sous 45), si :
- Tempo ou Clockwork publient un modèle CIR ou « R&D tax » européen ;
- les entretiens montrent que les cabinets gèrent entièrement les temps ;
- le parc de startups sur Jira qui saisissent leur temps est marginal ;
- une réforme du CIR est votée au PLF 2027 ;
- Atlassian relève la commission sur les petits partenaires.
