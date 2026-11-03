

**Lecture** :
- Les notes des **pistes 1 à 9 et 11** sont **vérifiées**.
- Les pistes « non vérifiées » portent une décote indicative de −10,1 points. Elles peuvent remonter ou baisser à la vérification.
- **Garde-fou appliqué** : une piste originale sans preuve de demande ne passe pas devant une piste dont la demande est observée (D3-01 reste derrière D1-02).

---

## B. Top 5 approfondi

| | **1. P10-D1-02 Tarifs fournisseurs → ERP** | **2. P10-D4-05 Subventions multi-financeurs** | **3. P10-D1-01 Contrôle et relance des ARC** | **4. P10-D4-02 Commissions → import EZLynx (US)** | **5. D3-01 Consentement au démarchage (variante « certificat transférable »)** |
|---|---|---|---|---|---|
| Note vérifiée / confiance demande | **57,0** / moyenne | **55,0** / faible-moyenne | 51,5 / moyenne | 51,0 / moyenne | 47,5 / moyenne |
| Catégorie | A | A (combinaison) | B | B | C |
| Client payeur | Dirigeant ou responsable achats d'un négoce B2B de 10 à 100 salariés ; utilisateur : l'approvisionneur | Direction ou trésorier d'une association de 3 à 50 salariés | Responsable achats d'une PME industrielle | Gérant d'une agence d'assurance IARD indépendante US sous EZLynx | Éditeurs de formulaires et vendeurs de leads ; annonceurs qui appellent des particuliers |
| Preuve de demande la plus forte | 5 offres d'emploi citent la tâche, dont Bestway (ADV 2 400-2 500 € brut, Indeed) [F] ; service Tarif dédié chez Partedis ; poste à 22,5-25 k€/an (Union Healthcare) [F] | Weka vend un tableau de suivi des subventions à ses abonnés [F] ; prestataire payé (Alpes Solidaires) [O] | 3 offres d'octobre 2026 en font une mission explicite (ISOPLAF 2 100-2 300 €/mois) [F] | Doc EZLynx : saisie manuelle ou gabarit CSV pour les relevés PDF [F] ; 2 forums [O] | Décret 2026-662 : obligation de preuve depuis le 11/08/2026, amende jusqu'à 375 000 € [F, Légifrance non lu] |
| Concurrents directs | Parabola, Tableflow (US, génériques), Zylio, Tensoria (FR) ; imports natifs Sage et Odoo ; FAB-DIS pour les gros fournisseurs | GrantBite (pipeline, FR) ; Instrumentl et GrantHub (US) | Tacto (50 M€), Phacet (FR), Onventis, Comena ; Divalto natif | Fintary (10 M$), Applied Recon, Palm, Cowork Recon | Appel Consenti (29 €/mois) ; Didomi (grands comptes) |
| Substituts | Ressaisie manuelle, Excel, intégrateur Sage, IA conversationnelle | Tableurs gratuits (France Active, GrantBite) ; consultants à 550 €/jour | Tableur, Outlook | Saisie manuelle | Formulaires + tableur ; HubSpot |
| Pourquoi la lacune existe [E] | Longue traîne de fournisseurs hors standards, trop petite pour les éditeurs ; extraction de PDF rendue fiable et peu chère par les LLM | Segment pauvre ; outils de subventions payés par les financeurs ; barrière du français et des Cerfa | PME de 20 à 100 salariés sous le seuil de Tacto [H] ; mais Phacet est présent | Petites agences peu servies [H] ; mais la concurrence est financée | Besoin d'août 2026 ; CMP centrées sur le web ; mais la catégorie existe (TrustedForm aux US) |
| Preuve contraire la plus forte | Seule la longue traîne reste ; saisonnalité (campagnes annuelles) ; prix plafond d'une gestion commerciale à 45 €/mois | 69 % des associations employeuses ont des fonds propres fragiles ou nuls ; le tableur gratuit est la norme | Concurrence européenne financée ; accès messagerie + synchronisation ERP quotidienne | Fintary, Applied ; marché US pour un fondateur français | Rénovation énergétique exclue ; contraction du secteur ; concurrent identique au même prix |
| Prix à tester | 99 / 199 / 349 €/mois selon le nombre de fournisseurs ; forfait campagne 490 € | 29 / 59 €/mois ; 290 €/an | Module de la piste 1 (+ 50-100 €/mois) [H] | 149-249 $/mois | Par certificat ou 49-149 €/mois [H] |
| Clients pour 2-5 k€ de MRR | **12 à 30** | 41 à 128 | — (module) | 15 à 35 | Inconnu |
| Faisabilité solo | Bonne : échanges par fichiers seulement ; validation humaine obligatoire ; pic de décembre à février | Très bonne : aucune intégration | Moyenne : messagerie + ERP | Moyenne : formats PDF par assureur | Moyenne : responsabilité probatoire sur 3 ans |
| Innovation | 2/5 | 2/5 | 2/5 | 2/5 | 2/5 (3/5 pour la variante transférable) |
| Principal risque | Erreur de prix propagée dans les devis ; churn entre deux campagnes | Faible budget, churn saisonnier | Concurrence financée | Concurrence financée ; vente aux US | Faible culture de conformité ; demande non prouvée |

### Points communs aux 5 pistes
- **Aucune** n'a de preuve de **volonté de payer** pour un nouvel entrant.
- Les preuves de **dépense** sont indirectes : salaires, modèles payants, outils voisins.
- La lacune des pistes 1 et 2 est **étroite** et peut se refermer : Zylio et Parabola pour la 1, GrantBite et AssoConnect pour la 2.

### Économie et difficultés comparées (pistes 1 et 2, approfondies)

| | Tarifs fournisseurs (1) | Subventions (2) |
|---|---|---|
| Acheteurs cibles | 1 500 à 2 500 négoces hors groupement et hors FAB-DIS [E] (base : 4 689 entreprises de 11-49 salariés dans le commerce de gros, Akto 2019 [F]) | 22 000 à 37 000 associations avec au moins 3 salariés et au moins 3 financeurs [E] (base : 153 000 employeuses [F]) |
| Coût variable | < 10 €/client/mois (LLM) + 30-60 €/mois d'hébergement [E] | ≈ 1 €/client/mois [E] |
| Heures à 25 clients (1) / 100 clients (2) | ~15 h/mois en moyenne, 30-40 h en pic [E] | ~30 h/mois [E] |
| Partie difficile | Désignations et unités changeantes, remises par famille, responsabilité du prix | Affectation d'une dépense entre cofinanceurs (risque de glisser vers le conseil) |
| Revente | Bonne : bibliothèque de mappings transférable, B2B récurrent | Faible : revenu par client bas, churn saisonnier |

---

## C. Trois gagnants par stratégie

| Stratégie | Gagnant | Note | Pourquoi lui | Réserve |
|---|---|---|---|---|
| **1. Forte demande, faible concurrence (A)** | **P10-D1-02 : tarifs fournisseurs hétérogènes → fichier d'import ERP, pour négoces B2B indépendants** | 57,0 | Demande observée dans des offres d'emploi réelles [F] ; lacune expliquée (longue traîne hors standards) ; peu de clients nécessaires ; intégrations par fichiers, stables | Concurrence moyenne (Zylio, Parabola) et saisonnalité |
| **2. Marché existant mal servi (B)** | **P10-D1-01 : contrôle et relance des ARC pour PME industrielles et négoces FR sous Sage 100 / EBP**, **en extension de la piste 1** (même acheteur, même ERP) | 51,5 | Tacto et ses pairs visent l'ETI et le Mittelstand ; les PME françaises de 20 à 100 salariés sous Sage 100 sont sous leur seuil commercial [H] | Phacet est déjà en France ; seuil de démarrage fixé à ≥ 10 clients de la piste 1 qui le demandent |
| **3. Innovation réellement nouvelle (C)** | **D3-01 variante : certificat de consentement transférable dans la chaîne des leads** (équivalent européen de TrustedForm, vendu à l'émetteur du formulaire) | 47,5 | Seule piste de rupture qui combine une obligation récente et sanctionnée [F] avec un manque structurel : preuve neutre entre éditeur de formulaire, vendeur de leads, annonceur et centre d'appels | **Sous le seuil** ; demande non prouvée ; à rouvrir seulement si la CNIL publie sa doctrine « multipropriétés » et qu'Appel Consenti ne couvre pas ce flux |

**Aucune idée de catégorie C ne passe le seuil.** Les autres ruptures examinées sont déjà couvertes ou très disputées :
- back-office des agences d'automatisation IA ;
- agent de dépôt sur portails clients ;
- détection de justificatifs falsifiés ;
- visibilité dans les assistants IA.

---

## D. Recommandation finale

### Piste recommandée : P10-D1-02, « vos tarifs fournisseurs en PDF ou Excel deviennent un fichier d'import pour votre ERP, avec la liste des hausses »

**Cible** : négoces et distributeurs B2B indépendants de 10 à 100 salariés, hors groupement et hors FAB-DIS. Priorité aux fournitures industrielles, à la quincaillerie professionnelle, à l'hygiène, à l'emballage et à l'agroéquipement, sous Sage 100, Divalto ou Odoo.

**Pourquoi c'est le meilleur équilibre pour vous** :
1. **Demande observée de source primaire** : des offres d'emploi réelles décrivent la tâche, avec un salaire [F].
2. **Une lacune qu'on peut expliquer** :
   - standards et éditeurs couvrent les gros fournisseurs, pas la longue traîne ;
   - les LLM rendent la lecture de PDF tarifaires fiable et peu coûteuse **seulement depuis peu** [E].
3. **Économie solo favorable** :
   - 12 à 30 clients pour 2 000 à 5 000 € de MRR ;
   - coût variable inférieur à 10 €/client ;
   - aucune API obligatoire (fichiers) ;
   - pas de profession réglementée.
4. **Acquisition sans réseau** :
   - Sirene NAF 46.xx avec tranche d'effectif ;
   - offres d'emploi qui signalent les négoces concernés ;
   - SEO technique de longue traîne ;
   - marketplaces Sage et Odoo.
5. **Revente** : produit B2B, bibliothèque de mappings transférable, pas de dépendance à une plateforme hôte.
6. **Test technique initial sans contact** : on peut mesurer la précision d'extraction sur 20 tarifs **publics** avant de parler à quiconque.

**Ce qui pourrait la faire échouer** :
- précision insuffisante sur les PDF (< 90 %) ;
- saisonnalité qui provoque du churn ;
- prix plafonné par les gestions commerciales à ~45 €/mois ;
- Zylio ou Parabola qui ciblent le même segment ;
- négoces trop petits pour payer.

### Alternative plus ambitieuse
**D3-01 variante : certificat de consentement transférable pour la chaîne des leads en France et dans l'UE.**
- **Plus ambitieuse** : c'est une infrastructure de confiance entre acteurs. L'équivalent américain, TrustedForm, est une catégorie établie [O]. Elle peut avoir un effet de réseau.
- **Moins étayée** : 47,5, demande non prouvée en France, concurrent PME déjà présent (Appel Consenti), secteur d'origine en contraction et en partie exclu (rénovation énergétique).
- **À reconsidérer seulement si** les deux conditions sont réunies :
  - (a) la doctrine CNIL sur le consentement multi-partenaires est publiée ;
  - (b) ≥ 3 vendeurs de leads ou éditeurs de formulaires confirment une dépense ou une perte liée à l'absence de preuve.

### Ce que je ne recommande pas
- Relancer N06, Relanzio, Qualiopi, D2-01 (photographes), D2-02 (Etsy), la franchise ou les remboursements OPCO.
- Ces pistes ont été réexaminées sans privilège, et chacune a un concurrent identifié qui couvre déjà le segment (voir `_work/P10-V*.md`).

---

## E. Plans de validation réels (aucun contact sans votre accord)

### Gagnant 1 — Tarifs fournisseurs → ERP (P10-D1-02)

| Étape | Action | Coût | GO | STOP |
|---|---|---|---|---|
| 1. Où sont les acheteurs | Recenser sur 90 jours les offres Indeed / France Travail citant « tarifs fournisseurs », « base articles », « mise à jour des prix » dans des négoces de 10 à 100 salariés | 0 € | ≥ 30 employeurs distincts | < 10 |
| 2. Vérifier la faisabilité (sans contact) | Collecter 20 tarifs fournisseurs **publics** (PDF et Excel) ; prototype local d'extraction ; précision mesurée ligne par ligne | ≈ 20 € d'API, 10-15 h | ≥ 95 % de lignes exactes sur Excel, ≥ 90 % sur PDF | < 90 % sur PDF après 2 itérations |
| 3. Mesurer les budgets existants | Salaires des offres (22,5-25 k€/an [F]) ; prix des modules d'import et des formations d'intégrateurs Sage ; tarifs de Zylio et Parabola | 0 € | — | — |
| 4. Proposition de valeur | Landing : « Votre tarif fournisseur PDF devient un fichier d'import Sage 100 / Divalto / Odoo en 10 minutes, avec la liste des hausses » | — | — | — |
| 5. Test commercial **entrant** | Google Ads 400-600 € sur une vingtaine de requêtes de longue traîne + 2 articles SEO | 400-600 € | ≥ 15 demandes qualifiées pour 1 000 visiteurs en 60 jours | < 5 demandes |
| 6. Volonté de payer | « Pilote campagne 2027 » à 290 € HT, remboursable, paiement réel par Stripe | — | **≥ 3 pilotes payés** en 60 jours | **0 pilote payé** |
| 7. (Avec votre accord) Prospection ciblée | E-mail B2B légal aux négoces repérés à l'étape 1 | 0-50 € | ≥ 5 entretiens et ≥ 1 pilote payé sur 50 contacts | 0 entretien |
| **Total** | | **≈ 600-900 € + 30-40 h** | | |

**Ce qui justifie le développement** : étapes 2 **et** 6 au GO.
**Ce qui fait abandonner** :
- précision insuffisante ;
- 0 pilote payé après 60 jours ;
- ≥ 60 % des interlocuteurs déjà équipés (FAB-DIS, groupement, Zylio).

### Gagnant 2 — Contrôle des ARC (P10-D1-01), en extension
- **Pas de test séparé**, pour ne pas disperser l'effort.
- Ajouter à l'étape 6 du gagnant 1 une option « contrôle des ARC » à +50 €/mois, cochable.
- Compter les offres d'emploi « relance ARC » à l'étape 1.
- **GO module** : ≥ 10 clients du gagnant 1 qui le demandent ou le cochent.
- **STOP** : Divalto, Sage ou Phacet couvrent la cible au même prix.

### Gagnant 3 — Certificat de consentement transférable (D3-01)
- **Veille, sans dépense** :
  1. doctrine CNIL « multipropriétés » ;
  2. traction d'Appel Consenti (pages, offres, levée) ;
  3. arrivée de TrustedForm ou de Jornaya en UE.
- **Test seulement si (1) est publiée** :
  - landing destinée aux éditeurs de formulaires et vendeurs de leads, avec une offre « certificat à l'unité » ;
  - précommande remboursable ;
  - coût ≈ 300 € ;
  - **GO** : ≥ 3 précommandes ;
  - **STOP** : 0 sur ≥ 300 visiteurs qualifiés.

### Piste 2 du TOP 5 — Subventions multi-financeurs (P10-D4-05), à garder en réserve
- Test de `_work/P10-V2.md` §2.5 : modèle Google Sheets gratuit en aimant, Google Ads ≈ 300 €, précommande annuelle à 290 € remboursable.
- **GO** : ≥ 8 précommandes et ≥ 300 téléchargements en 8 semaines.
- **STOP** : 0 précommande sur ≥ 500 visiteurs.
- **Coût** : ≈ 450 € + 30 h.
- Réserve : budget des associations faible ; la revente serait peu attractive.

---

## Ce que cette phase apporte, et ses limites
- **Méthode** : partir des problèmes plutôt que des marchés a produit des pistes **plus concrètes**. Elles s'appuient sur des offres d'emploi lues en entier, des postes payés et des modèles vendus. Mais elle n'a pas fait apparaître de marché vierge : la recherche nominative retrouve presque toujours un acteur.
- **Interprétation honnête** :
  - les micro-niches B2B françaises « évidentes » sont occupées par de petits éditeurs souvent peu visibles ;
  - les lacunes restantes sont **étroites** et doivent être **testées par l'argent** ;
  - la recherche documentaire ne peut plus départager les pistes.
- **Limites** : pages non lues (WebFetch bloqué) ; demande mesurée par des signaux indirects ; décote moyenne de 10 points sur les pistes vérifiées ; 24 pistes non vérifiées.
- **Accès réseau** : `www.legifrance.gouv.fr`, `www.reddit.com`, `www.g2.com` et les sites des éditeurs restent à autoriser dans les réglages réseau de l'environnement pour une vérification directe.
