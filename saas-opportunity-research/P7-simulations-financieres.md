# Simulations financières — micro-SaaS solo (phase 7)

Généré par `_work/micro_saas_sim.py` depuis `P7-sim-config.json`. **Toutes les entrées sont des estimations** sauf mention contraire.

- Cotisations sociales : 21.2% du CA ; CFP : 0.14% ; versement libératoire de l'IR : 1.7% (source : P7-fiscal.md : BIC prestations de services 2026, CFP 0,1 % + TFC 0,044 %, versement libératoire 1,7 % (extraits de sources officielles, à valider par un expert-comptable)).
- Coût d'un opérateur qui remplacerait le fondateur : 35 €/h.
- Multiples appliqués, selon la convention de marché, au **SDE annuel** (bénéfice avant rémunération du propriétaire), net du coût d'acquisition de remplacement : pessimiste 1.5×, central 2.5×, favorable 3.5× (source : P7-cession.md : micro-SaaS < 1 k$ MRR 1,5-2,5x ; 1-5 k$ MRR 2-4x (Acquire, Flippa, Empire Flippers ; historiques, non garantis)). **Ce ne sont pas des prix garantis.**
- **Net fondateur** = trésorerie disponible après charges réelles, cotisations et IR libératoire. **Bénéfice ajusté** = bénéfice avant impôts personnels, moins le coût d'un opérateur rémunéré pour les heures d'exploitation. C'est le rendement économique réel ; un acheteur qui ne travaille pas lui-même raisonnera sur ce chiffre et paiera moins.

## P7-N06 — Rapprochement des reversements marketplaces FR vers Pennylane/FEC (intrants DD)

Prix 59 € HT/mois ; coût variable 3 €/client/mois ; paiement 1.5% + 0.25 € ; fixes 90 €/mois ; 16 h fixes + 0.6 h/client/mois ; churn 3.0%/mois ; CAC 300 €.

| MRR visé | Clients | Charges réelles | Cotisations + CFP | IR (VL) | **Net fondateur/mois** | Heures/mois | €/h fondateur | Bénéfice ajusté/mois (opérateur payé) | − remplacement du churn | Clients perdus/an | Valorisation pess. / centrale / fav. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 000 € | 17 | 160 € | 214 € | 17 € | **612 €** | 26 | 23 € | -74 € | -227 € | 5 | 12 415 € / 20 691 € / 28 968 € |
| 2 000 € | 34 | 231 € | 428 € | 34 € | **1 313 €** | 36 | 36 € | 501 € | 195 € | 10 | 26 449 € / 44 082 € / 61 715 € |
| 3 000 € | 51 | 301 € | 642 € | 51 € | **2 015 €** | 47 | 43 € | 1 077 € | 618 € | 16 | 40 484 € / 67 473 € / 94 463 € |
| 5 000 € | 85 | 441 € | 1 070 € | 85 € | **3 418 €** | 67 | 51 € | 2 229 € | 1 464 € | 26 | 68 553 € / 114 256 € / 159 958 € |

## C-39 — Calendrier et préparation des dépôts FCC pour petits revendeurs VoIP US (intrants DD)

Prix 79 € HT/mois ; coût variable 2 €/client/mois ; paiement 5.5% + 0.25 € ; fixes 330 €/mois ; 15 h fixes + 0.6 h/client/mois ; churn 3.5%/mois ; CAC 350 €.

| MRR visé | Clients | Charges réelles | Cotisations + CFP | IR (VL) | **Net fondateur/mois** | Heures/mois | €/h fondateur | Bénéfice ajusté/mois (opérateur payé) | − remplacement du churn | Clients perdus/an | Valorisation pess. / centrale / fav. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 000 € | 13 | 416 € | 219 € | 17 € | **375 €** | 23 | 16 € | -187 € | -346 € | 5 | 8 136 € / 13 560 € / 18 985 € |
| 2 000 € | 26 | 501 € | 438 € | 35 € | **1 079 €** | 31 | 35 € | 482 € | 163 € | 9 | 22 213 € / 37 021 € / 51 829 € |
| 3 000 € | 38 | 581 € | 641 € | 51 € | **1 730 €** | 38 | 46 € | 1 098 € | 633 € | 13 | 35 206 € / 58 677 € / 82 147 € |
| 5 000 € | 64 | 752 € | 1 079 € | 86 € | **3 139 €** | 53 | 59 € | 2 435 € | 1 651 € | 22 | 63 359 € / 105 598 € / 147 837 € |

## P7-N04 — Application Jira de justification du temps R&D CIR/CII (intrants DD)

Prix 49 € HT/mois ; coût variable 1 €/client/mois ; paiement 2.0% + 0 € ; fixes 60 €/mois ; 10 h fixes + 0.3 h/client/mois ; churn 3.5%/mois ; CAC 200 €.

| MRR visé | Clients | Charges réelles | Cotisations + CFP | IR (VL) | **Net fondateur/mois** | Heures/mois | €/h fondateur | Bénéfice ajusté/mois (opérateur payé) | − remplacement du churn | Clients perdus/an | Valorisation pess. / centrale / fav. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 000 € | 21 | 102 € | 220 € | 17 € | **690 €** | 16 | 42 € | 357 € | 210 € | 7 | 14 048 € / 23 413 € / 32 778 € |
| 2 000 € | 41 | 141 € | 429 € | 34 € | **1 405 €** | 22 | 63 € | 1 087 € | 800 € | 14 | 28 455 € / 47 425 € / 66 394 € |
| 3 000 € | 62 | 183 € | 648 € | 52 € | **2 155 €** | 29 | 75 € | 1 854 € | 1 420 € | 22 | 43 582 € / 72 637 € / 101 692 € |
| 5 000 € | 103 | 264 € | 1 077 € | 86 € | **3 620 €** | 41 | 89 € | 3 352 € | 2 631 € | 36 | 73 117 € / 121 862 € / 170 607 € |

## E-13-AG — Relanzio repositionné agences et prestataires B2B (intrants estimés : P7-rescreen §3.2)

Prix 59 € HT/mois ; coût variable 1 €/client/mois ; paiement 1.5% + 0.25 € ; fixes 80 €/mois ; 8 h fixes + 0.3 h/client/mois ; churn 4.0%/mois ; CAC 350 €.

| MRR visé | Clients | Charges réelles | Cotisations + CFP | IR (VL) | **Net fondateur/mois** | Heures/mois | €/h fondateur | Bénéfice ajusté/mois (opérateur payé) | − remplacement du churn | Clients perdus/an | Valorisation pess. / centrale / fav. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 000 € | 17 | 116 € | 214 € | 17 € | **656 €** | 13 | 50 € | 428 € | 190 € | 7 | 11 677 € / 19 461 € / 27 246 € |
| 2 000 € | 34 | 153 € | 428 € | 34 € | **1 391 €** | 18 | 76 € | 1 216 € | 740 € | 13 | 24 793 € / 41 322 € / 57 851 € |
| 3 000 € | 51 | 189 € | 642 € | 51 € | **2 127 €** | 23 | 91 € | 2 005 € | 1 291 € | 20 | 37 910 € / 63 183 € / 88 457 € |
| 5 000 € | 85 | 261 € | 1 070 € | 85 € | **3 598 €** | 34 | 107 € | 3 581 € | 2 391 € | 33 | 64 143 € / 106 906 € / 149 668 € |

## E-13 — Relanzio actuel, artisans/TPE à 24 € (intrants DD-E13 §8 : churn 6 %, ~20 h de vente par client valorisées à 35 €/h ≈ 700 €)

Prix 24 € HT/mois ; coût variable 0.5 €/client/mois ; paiement 1.5% + 0.25 € ; fixes 60 €/mois ; 8 h fixes + 0.25 h/client/mois ; churn 6.0%/mois ; CAC 700 €.

| MRR visé | Clients | Charges réelles | Cotisations + CFP | IR (VL) | **Net fondateur/mois** | Heures/mois | €/h fondateur | Bénéfice ajusté/mois (opérateur payé) | − remplacement du churn | Clients perdus/an | Valorisation pess. / centrale / fav. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 000 € | 42 | 107 € | 215 € | 17 € | **669 €** | 18 | 36 € | 254 € | -1 510 € | 22 | 0 € / 0 € / 0 € |
| 2 000 € | 84 | 153 € | 430 € | 34 € | **1 398 €** | 29 | 48 € | 848 € | -2 680 € | 44 | 0 € / 0 € / 0 € |
| 3 000 € | 125 | 199 € | 640 € | 51 € | **2 110 €** | 39 | 54 € | 1 428 € | -3 822 € | 66 | 0 € / 0 € / 0 € |
| 5 000 € | 209 | 292 € | 1 071 € | 85 € | **3 568 €** | 60 | 59 € | 2 615 € | -6 163 € | 110 | 0 € / 0 € / 0 € |
