# Simulations financières — micro-SaaS solo (phase 7)

Généré par `_work/micro_saas_sim.py` depuis `P8-sim-config.json`. **Toutes les entrées sont des estimations** sauf mention contraire.

- Cotisations sociales : 21.2% du CA ; CFP : 0.14% ; versement libératoire de l'IR : 1.7% (source : P8-fiscal-corrections.md : BIC prestations de services 2026 confirmée sous réserve (variante prudente BNC 25,6 %), CFP 0,1 % (activité commerciale) + TFC 0,044 %, VL 1,7 %. Franchise TVA calculée sur le CA réalisé en France : clients B2B US hors champ (art. 259-1 CGI)).
- Coût d'un opérateur qui remplacerait le fondateur : 35 €/h.
- Multiples appliqués, selon la convention de marché, au **SDE annuel** (bénéfice avant rémunération du propriétaire), net du coût d'acquisition de remplacement : pessimiste 2.0×, central 2.5×, favorable 3.5× (source : P8-transactions.md : 4 ventes confirmées 1-5 k$ MRR (médiane 2,37x ARR, soit environ 2,6-2,8x le bénéfice) ; Flippa 2,2-2,5x ; Empire Flippers 3,2x ; Acquire 3,9x déclaré. Ces multiples supposent que la vente aboutisse (probabilité de 50 à 70 % en 6 mois [H])). **Ce ne sont pas des prix garantis.**
- **Net fondateur** = trésorerie disponible après charges réelles, cotisations et IR libératoire. **Bénéfice ajusté** = bénéfice avant impôts personnels, moins le coût d'un opérateur rémunéré pour les heures d'exploitation. C'est le rendement économique réel ; un acheteur qui ne travaille pas lui-même raisonnera sur ce chiffre et paiera moins.

## C-39 — FCC VoIP US — audit RMD gratuit puis abonnement annuel 490-790 $ (P8-US ; montants $ traités ≈ €)

Prix 50 € HT/mois ; coût variable 1.5 €/client/mois ; paiement 6.0% + 0.02 € ; fixes 335 €/mois ; 12 h fixes + 0.4 h/client/mois ; churn 2.4%/mois ; CAC 400 €.

| MRR visé | Clients | Charges réelles | Cotisations + CFP | IR (VL) | **Net fondateur/mois** | Heures/mois | €/h fondateur | Bénéfice ajusté/mois (opérateur payé) | − remplacement du churn | Clients perdus/an | Valorisation pess. / centrale / fav. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 000 € | 20 | 425 € | 213 € | 17 € | **344 €** | 20 | 17 € | -125 € | -317 € | 5 | 9 182 € / 11 478 € / 16 069 € |
| 2 000 € | 40 | 516 € | 427 € | 34 € | **1 023 €** | 28 | 37 € | 504 € | 120 € | 10 | 26 405 € / 33 006 € / 46 208 € |
| 3 000 € | 60 | 606 € | 640 € | 51 € | **1 702 €** | 36 | 47 € | 1 134 € | 558 € | 15 | 43 627 € / 54 534 € / 76 348 € |
| 5 000 € | 100 | 787 € | 1 067 € | 85 € | **3 061 €** | 52 | 59 € | 2 393 € | 1 433 € | 25 | 78 072 € / 97 590 € / 136 626 € |

## A-38 — Rapprochement des commissions, agences IARD US hors Applied Epic (P8-US ; $ ≈ €)

Prix 135 € HT/mois ; coût variable 5 €/client/mois ; paiement 6.0% + 0.25 € ; fixes 360 €/mois ; 16 h fixes + 1.0 h/client/mois ; churn 2.5%/mois ; CAC 600 €.

| MRR visé | Clients | Charges réelles | Cotisations + CFP | IR (VL) | **Net fondateur/mois** | Heures/mois | €/h fondateur | Bénéfice ajusté/mois (opérateur payé) | − remplacement du churn | Clients perdus/an | Valorisation pess. / centrale / fav. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 000 € | 8 | 467 € | 231 € | 18 € | **364 €** | 24 | 15 € | -227 € | -347 € | 2 | 11 837 € / 14 796 € / 20 714 € |
| 2 000 € | 15 | 560 € | 432 € | 34 € | **998 €** | 31 | 32 € | 380 € | 155 € | 4 | 29 754 € / 37 192 € / 52 070 € |
| 3 000 € | 23 | 667 € | 663 € | 53 € | **1 722 €** | 39 | 44 € | 1 073 € | 728 € | 6 | 50 231 € / 62 788 € / 87 904 € |
| 5 000 € | 38 | 867 € | 1 095 € | 87 € | **3 081 €** | 54 | 57 € | 2 373 € | 1 803 € | 10 | 88 625 € / 110 781 € / 155 093 € |

## B-11 — Testeurs backflow US — rappels clients et dépôts (P8-US ; $ ≈ €)

Prix 55 € HT/mois ; coût variable 3 €/client/mois ; paiement 6.0% + 0.25 € ; fixes 160 €/mois ; 14 h fixes + 0.6 h/client/mois ; churn 3.5%/mois ; CAC 350 €.

| MRR visé | Clients | Charges réelles | Cotisations + CFP | IR (VL) | **Net fondateur/mois** | Heures/mois | €/h fondateur | Bénéfice ajusté/mois (opérateur payé) | − remplacement du churn | Clients perdus/an | Valorisation pess. / centrale / fav. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 000 € | 19 | 284 € | 223 € | 18 € | **520 €** | 25 | 20 € | -128 € | -361 € | 7 | 12 667 € / 15 834 € / 22 168 € |
| 2 000 € | 37 | 402 € | 434 € | 35 € | **1 164 €** | 36 | 32 € | 366 € | -88 € | 13 | 28 306 € / 35 382 € / 49 535 € |
| 3 000 € | 55 | 520 € | 646 € | 51 € | **1 808 €** | 47 | 38 € | 860 € | 186 € | 19 | 43 944 € / 54 930 € / 76 902 € |
| 5 000 € | 91 | 756 € | 1 068 € | 85 € | **3 096 €** | 69 | 45 € | 1 848 € | 733 € | 32 | 75 221 € / 94 026 € / 131 636 € |

## N06 — Reversements marketplaces → compta, offre cabinets multi-dossiers 149 €/mois (P8-FR)

Prix 149 € HT/mois ; coût variable 5 €/client/mois ; paiement 1.5% + 0.25 € ; fixes 70 €/mois ; 10 h fixes + 1.0 h/client/mois ; churn 2.0%/mois ; CAC 600 €.

| MRR visé | Clients | Charges réelles | Cotisations + CFP | IR (VL) | **Net fondateur/mois** | Heures/mois | €/h fondateur | Bénéfice ajusté/mois (opérateur payé) | − remplacement du churn | Clients perdus/an | Valorisation pess. / centrale / fav. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 000 € | 7 | 122 € | 223 € | 18 € | **680 €** | 17 | 40 € | 326 € | 242 € | 2 | 20 079 € / 25 098 € / 35 137 € |
| 2 000 € | 14 | 175 € | 445 € | 35 € | **1 431 €** | 24 | 60 € | 1 071 € | 903 € | 3 | 41 837 € / 52 296 € / 73 215 € |
| 3 000 € | 21 | 227 € | 668 € | 53 € | **2 181 €** | 31 | 70 € | 1 817 € | 1 565 € | 5 | 63 596 € / 79 494 € / 111 292 € |
| 5 000 € | 34 | 324 € | 1 081 € | 86 € | **3 574 €** | 44 | 81 € | 3 202 € | 2 794 € | 7 | 104 004 € / 130 005 € / 182 007 € |

## N04 — Justification du temps R&D CIR depuis Jira, 490 €/an (P8-FR)

Prix 41 € HT/mois ; coût variable 1 €/client/mois ; paiement 2.0% + 0 € ; fixes 60 €/mois ; 10 h fixes + 0.3 h/client/mois ; churn 3.0%/mois ; CAC 250 €.

| MRR visé | Clients | Charges réelles | Cotisations + CFP | IR (VL) | **Net fondateur/mois** | Heures/mois | €/h fondateur | Bénéfice ajusté/mois (opérateur payé) | − remplacement du churn | Clients perdus/an | Valorisation pess. / centrale / fav. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 000 € | 25 | 106 € | 219 € | 17 € | **683 €** | 18 | 39 € | 307 € | 120 € | 8 | 17 568 € / 21 960 € / 30 744 € |
| 2 000 € | 49 | 149 € | 429 € | 34 € | **1 397 €** | 25 | 57 € | 995 € | 628 € | 15 | 35 816 € / 44 770 € / 62 677 € |
| 3 000 € | 74 | 195 € | 648 € | 52 € | **2 140 €** | 32 | 66 € | 1 712 € | 1 157 € | 23 | 54 824 € / 68 530 € / 95 941 € |
| 5 000 € | 122 | 282 € | 1 068 € | 85 € | **3 567 €** | 47 | 77 € | 3 089 € | 2 174 € | 37 | 91 319 € / 114 149 € / 159 808 € |
