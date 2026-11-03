> **⚠ RÉVISION DU 2026-10-29 (phase 6)** — Les conclusions de ce fichier sont **corrigées** par `12-audit-critique.md`. Le contenu d'origine est conservé ci-dessous, sans modification, pour la traçabilité.
> Les scénarios portent sur D-37, désormais abandonné. Ils restent valables comme exemple de calcul ; même le scénario favorable ne rémunérait pas un fondateur en année 1.

# 08 — Business model, hypothèses et scénarios

Date : 2026-10-29. Sujet : la recommandation n° 1 (sous-traitance et preuves de réalisation Qualiopi, nom de travail « Preuvio »), avec un rappel comparatif pour la n° 2 (relance de devis).

**Tout ce qui suit est ESTIMATION ou HYPOTHÈSE, sauf mention [OBS].** Aucun prix n'a été testé auprès d'un acheteur réel.

**Calculs reproductibles** :
- `python3 -I _work/gen_numbers.py founder` génère les fichiers d'entrée ;
- puis `unit_economics.py` (Founder Skill, founder-cfo) produit `founder/cfo-*.md` ;
- `compile.py` (founder-plan) produit `founder/business-plan.md`.

L'outil affiche « $ » : **tous les montants sont en euros HT**.

## 1. Modèles de revenus envisagés

| Modèle | Prix | Pour | Contre |
|---|---|---|---|
| **A. Pack audit sous-traitance (entrée)** | 149 € HT, précommande remboursable ; variante à 299 € | Capte le moment d'achat (audit à moins de 3 mois) ; se compare aux consultants (900-3 500 € HT [OBS]) et à l'audit blanc (500-1 000 €/jour [OBS]) | Revenu ponctuel ; client qui arrive tard (rien n'a été collecté avant) |
| **B. Abonnement Solo / Équipe (cible)** | 29 € HT/mois (290 €/an) ; 59 € HT/mois jusqu'à 10 sous-traitants | Récurrent ; l'historique des preuves ne peut pas être recréé, ce qui crée un coût de changement | Face à Formiva gratuit et à Digiforma ou Qualiobee à 49 € [OBS], le seul écart visible est la sous-traitance |
| **C. Licence consultants Qualiopi** | 99-199 €/mois pour 10 à 30 clients | Le consultant devient le canal (B2B2B) | Peu de gros comptes ; le consultant peut se sentir menacé |

**Recommandation** :
- A comme test de demande ;
- B seulement si ≥ 30 % des acheteurs du Pack demandent à continuer après l'audit ;
- C à tester dans 5 entretiens de consultants.

## 2. Intrants (valeurs du scénario central)

| Intrant | Valeur | Statut | Source / raisonnement |
|---|---|---|---|
| ARPA | 33 € HT/mois | EST | 85 % Solo à 29 €, 15 % Équipe à 59 € |
| IA (classement, génération) | 1,00 €/client-mois | EST | DD-D37 §8 (0,3 à 1,5 €) |
| Hébergement + stockage | 1,00 €/client-mois | EST | DD-D37 §8 (0,5 à 2 €) |
| Frais Stripe | 0,75 €/client-mois | EST | environ 1,5 % + 0,25 € par transaction (tarif public à vérifier) |
| Support (temps valorisé) | 2,00 €/client-mois | HYP | pics pendant les audits |
| **Contribution** | **28,25 € (86 %)** | calcul | `founder/cfo-central.md` |
| Fixes mensuels | 250 € (outils 80, assurance RC pro et comptabilité 90, prospection 80) | EST | devis réels à obtenir |
| Investissement de départ | 1 800 € (juriste RGPD/CGV 800, relecture par un consultant Qualiopi 600, landing 150, divers 250) | EST | — |
| Rémunération du fondateur | 0 dans le scénario de base ; 2 000 €/mois dans la variante | HYP | coût d'opportunité |
| CAC | 80-250 € (essentiellement du temps du fondateur au début) | HYP | DD-D37 §8 |
| Cycle de vente | quelques jours à 3 semaines, déclenché par une date d'audit | HYP | — |
| Churn | 5 % / 3 % / 2 % par mois selon le scénario | HYP | pic post-audit attendu ; c'est **l'hypothèse la plus fragile** |

## 3. Trois scénarios sur 12 mois (sortie de `unit_economics.py`)

Nouveaux clients payants par mois. Les mois 1 et 2 sont consacrés à la validation et au MVP.

| | Pessimiste | Central | Favorable |
|---|---|---|---|
| Nouveaux clients/mois (M1 → M12) | 0,0,1,1,2,2,2,3,3,3,3,3 | 0,0,3,4,5,6,7,8,9,10,10,10 | 0,0,5,8,10,12,14,16,18,20,22,24 |
| Churn mensuel | 5 % | 3 % | 2 % |
| Clients actifs à M12 | 19 | 65 | 139 |
| MRR à M12 | ≈ 640 € | ≈ 2 140 € | ≈ 4 600 € |
| Chiffre d'affaires an 1 | 3 092 € | 9 986 € | 20 427 € |
| Résultat d'exploitation an 1 (sans rémunération) | **−353 €** | **+5 548 €** | **+14 487 €** |
| Trésorerie nécessaire avant autofinancement | 2 988 € | 2 520 € | 2 409 € |
| Investissement de départ remboursé | après M12 | M10 | M8 |
| Signaux d'alerte de l'outil | an 1 en perte ; départ non remboursé | aucun | aucun |

**Variante réaliste « le fondateur se paie » (central + 2 000 €/mois)** :
- point mort à **80 clients actifs** ;
- résultat d'exploitation an 1 de **−18 452 €** ;
- **trésorerie nécessaire d'environ 20 250 €** ;
- verdict founder-plan : **« Not yet »** (`founder/cfo-central-avec-salaire.md`).

**Lecture** :
- La marge unitaire n'est pas le problème.
- **Le volume l'est** : même le scénario favorable (139 clients à M12) ne fait pas vivre un fondateur la première année.
- C'est un micro-SaaS d'appoint ou de long terme, pas un revenu de remplacement à 12 mois. Il faut le savoir avant de commencer.

## 4. Sensibilité (central, sortie de l'outil)

| What-if | Résultat d'exploitation an 1 |
|---|---|
| Base | 5 548 € |
| Prix −10 % | 4 550 € |
| Volume −20 % | 3 839 € |

- **La ligne à surveiller est le rythme d'acquisition, combiné au churn post-audit.** Ce n'est pas le prix.
- Avec un churn de 8 % (hypothèse « tout le monde part après l'audit »), le parc plafonne autour de 125 clients pour 10 nouveaux par mois (10 / 0,08), même à long terme.

## 5. Unit economics à vérifier par les entretiens

| Hypothèse | Comment la vérifier en 30 jours | Seuil |
|---|---|---|
| Un OF qui sous-traite paie 149 € pour un dossier prêt | Précommandes payées (Stripe, remboursables) | ≥ 3 sur 15 entretiens qualifiés |
| L'abonnement tient après l'audit | Question : « à quelle fréquence arrive un nouveau sous-traitant ? » | ≥ 1 par trimestre chez la majorité |
| Le CAC reste sous 250 € | Heures passées par précommande obtenue × 50 €/h | ≤ 5 h par précommande |
| Le prix de 29 € ne bloque pas | 4 questions Van Westendorp posées à de **vrais** répondants (`van_westendorp.py` lit un CSV d'enquête réelle) | Prix acceptable ≥ 29 € |
| Le support reste léger | Temps passé par concierge | ≤ 1 h par client et par mois |

## 6. Rappel n° 2 — relance de devis (E-13), chiffres de DD-E13 §7-8

- **Prix recommandé** : 24 € HT/mois (19 € en annuel).
- **ARPA réaliste** : 20-27 €.
- **Marge brute** : 85-95 % hors temps du fondateur.
- **Churn estimé** : 4-8 %/mois.
- **LTV** : environ 360 €.
- **CAC en vente directe** : environ 20-30 h de fondateur par client.
- **LTV/CAC** : 1,2-2,4 en acquisition payante, donc **faible**.
- **Plafond central à 24 mois** : 30-60 k€ d'ARR [EST].
- Le modèle ne tient qu'avec un canal quasi gratuit (partenaire, intégration à un logiciel de devis, SEO) ou un ARPA plus élevé (offre agences à 49-79 €).

## 7. Founder Skill : ce qui a été exécuté et ce qui ne l'a pas été

| Skill | État | Raison |
|---|---|---|
| founder-board | Exécuté : 3 sous-agents, 1 par lentille → `founder/board.md` | — |
| founder-competitors | Couvert par les due diligences → `05-concurrents-et-prix.md` | Format CSV adapté |
| founder-cfo | Exécuté : `unit_economics.py` sur 4 jeux d'entrées | — |
| founder-plan | Exécuté : `compile.py` → `founder/business-plan.md`, avec avertissement en tête | Le verdict « Profitable » exclut la rémunération du fondateur |
| founder-consumer (panel simulé) | **Non exécuté, volontairement** | Une idée sans aucune preuve de demande ne gagne rien à un panel synthétique, dont le taux d'achat est biaisé vers le haut. 20 ou 100 sous-agents auraient un coût réel pour une information non fiable. Les entretiens réels remplacent ce panel |
| founder-pricing | Non exécuté | Il lit les réponses du panel ; à exécuter sur les réponses **réelles** des entretiens |
| founder-offer, founder-marketing, founder-ops, founder-launch | Couverts en version réduite (`07` §C et F, `09`, `10`) | Version détaillée seulement après un GO à J30 |
| founder-brand | Non exécuté, volontairement | Le nom et l'identité viennent après la validation du problème. « Preuvio » reste un nom de travail |
