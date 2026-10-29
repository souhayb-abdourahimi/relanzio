> **AVERTISSEMENT DU DIRECTEUR DE RECHERCHE (2026-10-29) — lire avant le verdict.**
> Le verdict « Profitable » ci-dessous est calculé par `compile.py` sur des **hypothèses non observées**. Rien ne vient d'un client réel : rythme de 3 à 10 nouveaux clients/mois, churn de 3 %, ARPA de 33 € HT.
> - Le calcul **exclut toute rémunération du fondateur**. Avec 2 000 €/mois de rémunération (`numbers-central-avec-salaire.json`), le même outil donne **« Not yet »**, une perte d'environ 18,5 k€ en année 1 et un point mort à 80 clients actifs.
> - Le contrôle n° 4 (panel d'acheteurs) n'a pas été exécuté **volontairement** : un panel simulé n'apporterait aucune preuve de volonté de payer.
> - Le symbole « $ » est imposé par l'outil : **tous les montants sont en euros HT**.
> - Ce plan ne valide pas l'idée. Voir `../07-memo-decision.md` (statut : AUCUNE IDÉE VALIDÉE À CE STADE).

# Preuvio (nom de travail) — dossier de preuves Qualiopi & anti-fraude pour petits organismes de formation · Business plan

**Verdict: Profitable**

- ✓ Each client-mois earns $28.25 before fixed costs (86% contribution).
- ✓ Year 1 operating profit: $5,548.

| key number | |
| --- | ---: |
| Price | $33.00 a client-mois |
| Profit margin at plan | 74% per client-mois |
| Break-even | 9 client-moiss a day |
| Year 1 operating profit | $5,548 |
| Startup spend | $1,800 |
| Cash needed before it pays for itself | $2,520 |
| Startup money earned back | month 10 |

## The idea

- What it is: un SaaS qui collecte au fil de l'eau les preuves de réalisation opposables (émargement apprenants + formateur, traces de connexion du distanciel, certificat de réalisation) et la conformité des formateurs sous-traitants (contrat, CV, veille, déclaration), puis exporte un dossier d'audit Qualiopi (référentiel du décret n° 2026-728, en vigueur au 1/11/2026) et un dossier de contrôle CDC/DGEFP (loi anti-fraude n° 2026-534).
- Who it is for: formateurs indépendants et organismes de formation de 1 à 10 personnes déjà certifiés Qualiopi, en France, dont au moins 30 % du CA dépend de financements CPF/OPCO/France Travail ; priorité aux OF de 2 à 10 personnes qui sous-traitent à des formateurs freelances.
- What it sells, at what price: abonnement Solo 29 € HT/mois (290 €/an) ; Équipe 59 € HT/mois ; « Pack audit » ponctuel 149 € (diagnostic V10 + dossier d'audit + 3 mois d'accès) comme offre d'entrée à tester.
- Where and how: en ligne, France ; prospection sur la liste publique des OF (data.gouv) enrichie, partenariats avec consultants Qualiopi et syndicats (SYCFI) ; self-serve + import Google Drive.
- Budget and constraints: fondateur solo ou 1-3 personnes, technique + IA, capital modéré, stack existante Node/Supabase/Stripe/Brevo (héritée de Relanzio) ; MVP estimé 6-10 semaines ; aucun client ni entretien à ce jour.

## What the board said

Idée examinée : Preuvio, dossier de preuves Qualiopi et anti-fraude pour petits organismes de formation (`idea.md`, `board/brief.md`).
Méthode : founder-board appliqué manuellement. Le pack n'est pas installé ; les SKILL.md et lenses.md de l'archive fournie ont été lus. Trois sous-agents distincts ont chacun appliqué une seule lentille, sans recherche web. Les lentilles résument des cadres publiés ; elles ne parlent au nom de personne.

### Le vote
**2 FUND IF, 1 PASS. Note moyenne : 3,7/10.**

| Lentille | Note | Vote | Mémo |
|---|---|---|---|
| Offres | 4/10 | FUND IF | `board/offers.md` |
| Monopole | 3/10 | PASS | `board/monopoly.md` |
| Produit | 4/10 | FUND IF | `board/product.md` |

### Risques soulevés par plusieurs membres (prioritaires)
1. **Le gratuit et le « suffisant »** (les 3 membres). Formiva est gratuit et occupe aussi le principal canal SEO via Certiforma. Digiforma, Edusign et Qualiobee sont présents. Un Google Drive bien rangé passe l'audit. Le seul écart visible aujourd'hui est le prix.
2. **Preuves recevables inconnues** (les 3 membres). Le guide de lecture v10 n'est pas publié. Promettre des preuves « opposables » avant validation par un auditeur ou un certificateur est risqué.
3. **Usage épisodique et churn après l'audit** (Offres, Monopole, Produit). La douleur se concentre avant l'audit (environ tous les 18 mois) et le marché CPF se contracte (−11 % en 2025).
4. **Produit diffus** (Produit, Monopole) : six fonctions et trois offres, sans fonction centrale.
5. **Copie rapide** (Monopole) : pas d'avancée 10x. Le seul fossé possible, l'effet de réseau sur les sous-traitants, est visé par le Portail des Formateurs du SYCFI.

### Conditions fusionnées (check-list pour la suite)
- [ ] Définir le produit en **une phrase** et garder **une seule fonction cœur** dans le MVP.
- [ ] 15 appels d'OF certifiés : au moins la moitié citent un audit ou un contrôle dans les 9 mois **et** une dépense actuelle pour s'y préparer.
- [ ] Vendre avant de construire : **≥ 3 précommandes payées sur 30 diagnostics**, à 149 € puis test à 299 €.
- [ ] Faire relire un dossier exporté par **au moins un auditeur ou un certificateur**, après publication du guide v10, avant d'écrire « opposable ».
- [ ] Choisir entre remplacer les outils d'émargement existants, s'y brancher ou en importer les données.
- [ ] Mesurer : part des OF qui sous-traitent, nombre d'OF servis par un sous-traitant, part du distanciel.
- [ ] Clarifier la position du SYCFI : concurrent, canal ou partenaire.
- [ ] Mesurer la rétention après le premier audit avant de payer pour acquérir des clients.
- [ ] Obtenir un coût d'acquisition observé (et non estimé) sur le premier canal.

### La version la plus forte que le conseil voit
Elle **diffère du pitch**. Ce n'est pas un « kit de preuves Qualiopi » de plus, mais un outil centré sur **une seule relation : l'OF donneur d'ordre et ses formateurs sous-traitants**, dans le cadre de la loi anti-fraude n° 2026-534 et de l'indicateur 27.
- Le formateur freelance dépose une fois son dossier de conformité (contrat type, CV, veille, attestation, déclaration).
- Chaque OF qui le fait travailler le réutilise et y ajoute les émargements de session.
- C'est la seule configuration avec un début d'effet de réseau (un formateur sert plusieurs OF) et un acheteur qui porte un risque juridique nouveau.

Elle reste sous-financée par les preuves : on ignore la part d'OF qui sous-traitent, et le syndicat SYCFI vise le même espace. **Le conseil ne financerait aucun développement avant les tests de précommande.**

## Not done yet

- Summary: run /founder-plan
- The competition: run /founder-competitors
- The buyer panel: run /founder-consumer
- Pricing: run /founder-pricing
- The offer: run /founder-offer
- The numbers: run /founder-cfo
- Marketing: run /founder-marketing
- Brand: run /founder-brand
- Operations: run /founder-ops
- Launch plan: run /founder-launch

_The panel is simulated buyers and the numbers are projections from your inputs. Confirm demand with real customers and costs with real quotes before you spend. Not financial, legal or tax advice._
