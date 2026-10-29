# P9 — Modèle bottom-up du temps d'exploitation N06 à 21 cabinets

Généré par `_work/p9_temps.py`. **Estimations [E] et hypothèses [H] à remplacer par les mesures du protocole de chronométrage** (`15-validation-n06.md` §7).

Modèle précédent (P8) : 8,8 h/semaine, soit 31 h d'exploitation + 7,2 h d'acquisition par mois, calculé **par client**. Ce modèle-ci le recalcule **par versement**, car la charge réelle dépend du volume de versements et du taux d'exceptions.

| Poste (h/mois) | Bas | Central | Haut |
|---|---|---|---|
| Acquisition (remplacement du churn) | 3.8 | 7.1 | 15.8 |
| Intégration (nouveaux cabinets + nouveaux dossiers) | 1.7 | 5.4 | 15.1 |
| Rapprochement (contrôle humain des versements automatisés) | 0.0 | 0.0 | 9.2 |
| Gestion des exceptions | 1.1 | 6.1 | 27.7 |
| Maintenance (formats d'export, dépendances, sécurité) | 3.0 | 6.0 | 13.0 |
| Support aux cabinets | 3.5 | 7.0 | 14.0 |
| Administration (facturation, RGPD, comptabilité) | 1.5 | 2.0 | 3.0 |
| **Total h/mois** | **15** | **34** | **98** |
| **Total h/semaine** | **3.4** | **7.8** | **22.6** |
| Dossiers gérés | 105 | 136 | 168 |
| Versements traités/mois | 315 | 614 | 1109 |

## Paramètres

| Paramètre | Bas | Central | Haut | Statut |
|---|---|---|---|---|
| Dossiers marketplace par cabinet | 5 | 6.5 | 8 | [H] |
| Marketplaces par dossier | 1.5 | 1.8 | 2.2 | [H] |
| Versements par marketplace et par mois | 2.0 | 2.5 | 3.0 | [H] |
| Taux d'exception (versement non traité automatiquement) | 0.02 | 0.05 | 0.1 | [H] |
| Minutes par exception | 10 | 12 | 15 | [H] |
| Minutes de contrôle humain par versement automatisé | 0.0 | 0.0 | 0.5 | [H] |
| Churn mensuel des cabinets | 0.015 | 0.02 | 0.03 | [H] |
| Heures d'acquisition par cabinet | 12 | 17 | 25 | [H] |
| Heures de mise en place par cabinet | 2 | 3 | 4 | [H] |
| Heures par nouveau dossier | 0.5 | 1.0 | 1.5 | [H] |
| Renouvellement mensuel des dossiers | 0.02 | 0.03 | 0.05 | [H] |
| Changements de format d'export par mois (toutes sources) | 0.5 | 1.0 | 2.0 | [H] |
| Heures par changement de format | 2 | 3 | 4 | [H] |
| Heures fixes de maintenance | 2 | 3 | 5 | [H] |
| Minutes de support par cabinet et par mois | 10 | 20 | 40 | [H] |
| Heures d'administration | 1.5 | 2 | 3 | [H] |

## Pilote manuel (concierge) : jusqu'où tient-il ?

Sans automatisation, chaque versement est décomposé, saisi et rapproché à la main.

| Minutes par versement manuel | Versements/mois pour 1 cabinet de 6,5 dossiers (central) | Heures/mois par cabinet | Cabinets tenables à 10 h/semaine |
|---|---|---|---|
| 10 | 29 | 4.9 | 8.9 |
| 15 | 29 | 7.3 | 5.9 |
| 20 | 29 | 9.8 | 4.4 |
| 30 | 29 | 14.6 | 3.0 |

**Lecture** :
- **Le pilote manuel ne passe pas à l'échelle.** Il tient pour 3 à 9 cabinets selon le temps réel par versement (30 min → 3 cabinets ; 10 min → 9). En pratique, limitez-le à 2 ou 3 cabinets pour garder du temps pour la mesure et la prospection. Il sert à mesurer, pas à exploiter.
- **L'objectif de moins de 10 h/semaine à 21 cabinets n'est atteignable que si deux conditions sont réunies** :
  - le traitement des versements est automatisé (contrôle humain proche de 0) ;
  - le taux d'exceptions reste d'environ 5 % ou moins.
- **Scénario haut** : sans ces deux conditions, la charge dépasse 20 h/semaine et l'objectif d'exploitation solo légère échoue.
- **Ces deux paramètres sont précisément ce que le pilote doit mesurer.**
