# A — Top 8 pistes et éliminations (santé, soins, pharmacie, recherche, assurances)

Date : 2026-10-29. Grille du brief, notée sur 100 :

| Abrév. | Critère | Max |
|---|---|---|
| Dou | Douleur & budget | 20 |
| Fré | Fréquence / criticité | 10 |
| Prv | Preuves de demande | 15 |
| Dis | Distribution | 15 |
| Lac | Lacune concurrentielle | 10 |
| MVP | Faisabilité MVP | 10 |
| Mar | Marge & récurrence | 5 |
| Tim | Timing | 5 |
| Déf | Défendabilité | 5 |
| Rsq | Risques maîtrisables | 5 |

Les identifiants de preuves renvoient à `A-preuves.csv`.
**Limite** : WebFetch était bloqué sur fda.gov et cms.gov. Les faits officiels US viennent d'extraits de pages officielles retournés par la recherche web, sans lecture intégrale.

## Synthèse

| Rang | Id | Piste | Pays | Score | Confiance |
|---|---|---|---|---|---|
| 1 | A-23 | Rapprochement des remboursements MFP pour pharmacies indépendantes | US | **77** | moyenne |
| 2 | A-39 | Devoir de conseil formalisé et contrôlable pour petits courtiers | FR | **71** | moyenne-faible |
| 3 | A-01 | Suivi des autorisations préalables WISeR / Medicare Advantage pour petits cabinets de spécialistes | US | **70** | moyenne |
| 4 | A-33 | Facturation sponsors et rapprochement des paiements pour sites d'investigation indépendants | US→UE | **67** | moyenne-faible |
| 5 | A-12 | Préparation continue à l'évaluation HAS et plan d'action qualité pour SAD et EHPAD indépendants | FR | **65** | moyenne |
| 6 | A-38 | Rapprochement des commissions pour agences IARD indépendantes | US | **62** | faible |
| 7 | A-15 | Suivi du ratio de rémunération 80/20 HCBS pour agences de home care | US | **61** | moyenne |
| 8 | A-17 | Preuves de conformité aux Strengthened Standards pour petits prestataires | AU | **60** | faible |

---

### 1. A-23 — Rapprochement des remboursements MFP pour pharmacies indépendantes (US) — 77/100, confiance moyenne
**Acheteur** : titulaire d'une pharmacie indépendante (1 à 5 officines), ou groupement / PSAO en revente.
**Problème** : relier chaque remboursement fabricant reçu via le MTF (fichier 835 et Claims Tracking Report) à la demande d'origine, puis détecter et réclamer les remboursements manquants ou sous-payés.

| Critère | Note | Justification |
|---|---|---|
| Dou | 18 | Trésorerie directement touchée : 60 % puisent dans leur épargne (NCPA, A-P15). |
| Fré | 9 | Chaque délivrance d'un médicament MFP, chaque semaine. |
| Prv | 12 | Enquête NCPA de février 2026 : 78 % ont du mal à rapprocher, 28 % manquent d'information. C'est une preuve de douleur, pas encore de volonté de payer. |
| Dis | 10 | Canaux concentrés : NCPA, PSAO, groupements, éditeurs de PMS. Un tutoriel gratuit montre que le besoin est déjà formulé. |
| Lac | 5 | Plenful cible les systèmes de santé ; Outcomes et les modules PMS existent ; le niveau réel de service aux indépendants est inconnu. |
| MVP | 8 | Import 835 + export des demandes PMS + règles SDRA. Une BAA HIPAA est nécessaire. |
| Mar | 4 | Abonnement mensuel ; facturation au pourcentage récupéré possible. |
| Tim | 5 | MFP en vigueur depuis le 01/01/2026. Extension à d'autres médicaments en 2027 : HYPOTHÈSE non vérifiée. |
| Déf | 3 | Données de réclamation par fabricant. |
| Rsq | 3 | Risques : CMS ou les éditeurs de PMS peuvent combler le manque ; le dispositif dépend de la politique IRA. |

### 2. A-39 — Devoir de conseil formalisé et contrôlable pour petits courtiers (FR) — 71/100, confiance moyenne-faible
**Acheteur** : dirigeant d'un cabinet de courtage IARD ou santé-prévoyance de 1 à 10 personnes.
**Problème** : formaliser le recueil des besoins, le conseil et sa justification pour tous les produits, avec une piste d'audit présentable à l'ACPR et à l'association agréée.

| Critère | Note | Justification |
|---|---|---|
| Dou | 14 | Risque de sanction réel (une sanction le 13/05/2026), mais il s'agit d'un coût de conformité, pas d'un gain de revenu. |
| Fré | 8 | À chaque souscription et renouvellement. |
| Prv | 9 | Défaillances constatées par l'ACPR en mars 2026 (A-P44) ; aucune preuve de volonté de payer côté courtiers. |
| Dis | 12 | Environ 24 000 courtiers en assurance (A-P45) ; relais possibles via les associations agréées et la presse spécialisée ; avantage d'un fondateur francophone. |
| Lac | 5 | CRM et extranets courtiers non cartographiés : à faire en phase 2. |
| MVP | 9 | Questionnaires par produit, génération de la fiche de conseil, horodatage, export pour l'audit. |
| Mar | 4 | Abonnement par utilisateur. |
| Tim | 5 | Recommandation 2024-R-03 applicable au 01/01/2026 et étendue à tous les produits (A-P43). |
| Déf | 2 | Facilement copiable. |
| Rsq | 3 | Responsabilité si le conseil généré est contesté. |

### 3. A-01 — Suivi des autorisations préalables WISeR / Medicare Advantage pour petits cabinets de spécialistes (US) — 70/100, confiance moyenne
**Acheteur** : practice manager d'un cabinet de spécialistes (douleur, orthopédie, plaies) de 2 à 20 praticiens, dans les 6 États WISeR.

| Critère | Note | Justification |
|---|---|---|
| Dou | 18 | 13 h par semaine et par médecin (AMA, A-P06) ; coût de 2 161 à 3 430 $ par médecin ETP (ACP). |
| Fré | 9 | Quotidien. |
| Prv | 12 | Enquête AMA, plaintes de l'ASA et de l'ArMA sur WISeR ; preuve de douleur forte, volonté de payer pour un outil non mesurée. |
| Dis | 8 | Marché bruyant ; ciblage possible par État × spécialité via les sociétés savantes. |
| Lac | 5 | Les gros acteurs servent surtout payeurs et systèmes de santé. Un tracker simple pour petits cabinets semble peu servi : HYPOTHÈSE. |
| MVP | 6 | Pas d'API avant 2027, et seulement chez les payeurs concernés. Le MVP repose sur un tracker, des modèles de dossiers et des alertes de délai. |
| Mar | 4 | Facturation par praticien et par mois. |
| Tim | 5 | WISeR au 01/01/2026, CMS-0057-F au 01/01/2026, API au 01/01/2027 (A-P01 à A-P03). |
| Déf | 1 | Faible. |
| Rsq | 2 | WISeR pourrait perdre son financement (amendement à la Chambre) ; HIPAA. |

### 4. A-33 — Facturation sponsors et rapprochement des paiements pour sites d'investigation indépendants (US puis UE) — 67/100, confiance moyenne-faible
**Acheteur** : directeur·rice ou responsable financier d'un site indépendant ou d'un petit réseau de 2 à 10 sites.

| Critère | Note | Justification |
|---|---|---|
| Dou | 16 | Du chiffre d'affaires non facturé ou payé en retard, sur fond de marges de sites tendues (HYPOTHÈSE). |
| Fré | 7 | Mensuelle, par étude. |
| Prv | 10 | 93 % des sites placent la transparence financière en tête de leurs besoins (SCRS × Medidata, A-P39 ; date non vérifiée). |
| Dis | 9 | Communautés SCRS et ACRP, réseaux de sites ; LinkedIn. |
| Lac | 5 | CRIO, RealTime et eClinPro couvrent en partie (eClinPro : 150 à 250 $/mois, A-P37). |
| MVP | 8 | Import du budget de l'étude, journal des visites, factures, rapprochement des paiements. Pas de PHI nécessaire. |
| Mar | 4 | Abonnement par site. |
| Tim | 2 | Pas de catalyseur réglementaire ; E6(R3) est indirect. |
| Déf | 3 | Modèles de budget par sponsor. |
| Rsq | 3 | Les CTMS peuvent ajouter la fonction. |

### 5. A-12 — Préparation continue à l'évaluation HAS et plan d'action qualité pour SAD et EHPAD indépendants (FR) — 65/100, confiance moyenne
**Acheteur** : directeur·rice d'un SAD ou d'un EHPAD indépendant / associatif (1 à 5 structures).

| Critère | Note | Justification |
|---|---|---|
| Dou | 13 | Évaluation obligatoire et résultats publics sur Qualiscope depuis le 16/09/2025 ; mais budgets serrés. |
| Fré | 5 | Évaluation tous les 5 ans ; le plan d'action, lui, est continu. |
| Prv | 9 | Volumes programmés (ARS Grand Est) ; un marché de formations à 1 200 € existe (A-P25) ; volonté de payer pour un logiciel non mesurée. |
| Dis | 10 | Listes publiques d'ESSMS, fédérations, Qualiscope pour cibler les structures mal notées. |
| Lac | 4 | Qualineo et d'autres éditeurs qualité existent. |
| MVP | 9 | Grille de 157 critères, collecte de preuves, plan d'action. |
| Mar | 4 | Abonnement. |
| Tim | 4 | Premier cycle jusqu'au 31/12/2027, puis renouvellement. |
| Déf | 3 | Faible à moyenne. |
| Rsq | 4 | Risques maîtrisables. |

### 6. A-38 — Rapprochement des commissions pour agences IARD indépendantes (US) — 62/100, confiance faible
**Acheteur** : responsable comptable d'une agence indépendante (3 à 30 personnes) qui n'utilise pas Applied Epic.

| Critère | Note | Justification |
|---|---|---|
| Dou | 14 | Des écarts de commission font perdre du revenu. |
| Fré | 8 | Mensuelle, avec plusieurs assureurs. |
| Prv | 6 | Seulement des contenus de fournisseurs. |
| Dis | 9 | Réseaux d'agences, groupements. |
| Lac | 4 | Commission Wizard à 199 $/mois (A-P41), Applied Recon, AgencyBloc. |
| MVP | 9 | Analyse des relevés PDF/CSV. |
| Mar | 4 | Abonnement. |
| Tim | 1 | Aucun catalyseur. |
| Déf | 3 | Bibliothèque de formats de relevés par assureur. |
| Rsq | 4 | Risques faibles. |

### 7. A-15 — Suivi du ratio de rémunération 80/20 HCBS pour agences de home care (US) — 61/100, confiance moyenne
**Acheteur** : CFO d'une agence de soins personnels Medicaid (50 à 500 aides).

| Critère | Note | Justification |
|---|---|---|
| Dou | 12 | Le plancher de 80 % peut menacer l'existence de l'agence en 2030. |
| Fré | 5 | Annuelle, avec un suivi mensuel utile. |
| Prv | 9 | Guides de fédérations, spécifications CMS de 2026 (A-P12, A-P13). |
| Dis | 8 | Associations d'État de home care. |
| Lac | 7 | Pas d'outil dédié identifié. |
| MVP | 8 | Import paie + comptabilité, puis calcul. |
| Mar | 4 | Abonnement. |
| Tim | 3 | Échéances lointaines : 2027, 2028, 2030. |
| Déf | 3 | Faible à moyenne. |
| Rsq | 2 | La règle peut être révisée ou abrogée. |

### 8. A-17 — Preuves de conformité aux Strengthened Standards pour petits prestataires (Australie) — 60/100, confiance faible
**Acheteur** : responsable qualité d'un petit prestataire enregistré Support at Home.

| Critère | Note | Justification |
|---|---|---|
| Dou | 13 | Nouvel enregistrement et nouvelles normes depuis le 01/11/2025 (A-P29). |
| Fré | 6 | Audits et suivi continu. |
| Prv | 6 | Seule la réglementation est sourcée ; aucune demande mesurée. |
| Dis | 7 | Marché étranger, mais anglophone. |
| Lac | 4 | Éditeurs locaux non recensés. |
| MVP | 8 | Cartographie des obligations, registre de preuves. |
| Mar | 4 | Abonnement. |
| Tim | 5 | Catalyseur récent. |
| Déf | 3 | Faible à moyenne. |
| Rsq | 4 | Risques maîtrisables. |

**Juste sous la barre** : A-31, eISF / eRegulatory léger pour sites indépendants (58/100). Une offre gratuite existe déjà (Study eSafe) et Florence domine.

---

## 3 pistes ÉLIMINÉES

1. **A-24 — DSCSA pour petits dispensateurs (US)**
   - Critère éliminatoire : **marge structurellement défavorable, aucune lacune**.
   - Des outils existent déjà à 29-49 $/mois (SureCost) et 69-150 $/mois (LSPedia) (A-P20, A-P21), souvent liés aux grossistes et aux PMS.
   - Le catalyseur est repoussé : l'exemption court jusqu'au 27/11/2027 (A-P19).

2. **A-29 — Conformité FDA des tests LDT pour laboratoires (US)**
   - Critère éliminatoire : **pas de volonté de payer plausible**.
   - Le catalyseur a disparu : règle annulée par un tribunal le 31/03/2025 et abrogée en septembre 2025 (A-P35).

3. **A-08 / A-07 — Ordonnance numérique et télétransmission pour paramédicaux libéraux (FR)**
   - Critères éliminatoires : **données et canaux indispensables inaccessibles** et **acquisition non crédible**.
   - Le circuit de télétransmission et d'ordonnance numérique impose un logiciel agréé et référencé (SESAM-Vitale, doctrine ANS ; HYPOTHÈSE à confirmer).
   - Le marché des logiciels de gestion de cabinet est verrouillé, et l'obligation de 2024 n'a pas été tenue, donc pas de pression datée.

Autres pistes écartées sans être formellement éliminées :
- **A-06** (HIPAA) : règle finale repoussée à juillet 2027.
- **A-14** (micro-crèches) : décret partiellement annulé par le Conseil d'État, cadre instable.
- **A-25 et A-26** (Calypso) : volonté de payer faible ; les logiciels métiers intègrent déjà la fonction.
