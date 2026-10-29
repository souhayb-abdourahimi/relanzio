# 01 — Cartographie des marchés et couverture

Date : 2026-10-29. Sources : rapports des 5 analystes de phase 1 (`_work/A..E-cartographie.md`), reproduits intégralement ci-dessous.
**Limite commune** : la recherche web a fonctionné, mais pas la lecture de pages (politique réseau). Les faits viennent donc d'extraits de moteur de recherche. Les dates réglementaires ont été recoupées autant que possible sur les domaines officiels ; les pages n'ont pas été lues en entier.

## Vue d'ensemble : 31 familles, 206 opportunités

| # | Famille | Analyste | Opportunités | Couverture | Angles non couverts (principaux) |
|---|---|---|---|---|---|
| 1 | Santé et cabinets médicaux (US/FR) | A | ~12 | moyenne | dentaire, centres de santé FR, UK/Inde/Canada |
| 2 | Soins aux personnes (SAD, EHPAD, home care, crèches) | A | ~9 | moyenne | UK CQC, handicap, crèches US |
| 3 | Pharmacie, vétérinaire, optique/audio, biologie | A | ~8 | moyenne (pharmacie US), faible (reste) | optique/audio, biologie FR |
| 4 | Recherche et laboratoires, sites d'essais cliniques | A | ~6 | moyenne-faible | labos académiques, CTIS UE |
| 5 | Assurances (courtiers, agences, sinistres) | A | ~8 | moyenne | sinistres, experts, Allemagne |
| 6 | Construction / BTP | B | ~8 | moyenne | sécurité chantier, RE2020 |
| 7 | Maintenance et field services (CVC, froid, incendie, backflow) | B | ~9 | moyenne-élevée (fluides, backflow) | ascenseurs, électricité |
| 8 | Immobilier et gestion d'actifs | B | ~7 | moyenne | location courte durée, UK |
| 9 | Énergie, eau, déchets, climat | B | ~7 | moyenne | CEE en détail, bornes de recharge |
| 10 | Agriculture et agroalimentaire | B | ~5 | faible-moyenne | bio, coopératives |
| 11 | Industrie et fabrication | B | ~3 | faible | chiffrage industriel, ISO 9001 |
| 12 | Supply chain, entrepôts, douane | C | ~7 | moyenne-élevée (douane/CBAM), faible (3PL) | facturation 3PL, preuve de livraison |
| 13 | Transport et flottes | C | ~6 | moyenne | ambulances, VTC, ANTAI, IFTA |
| 14 | Commerce physique et e-commerce | C | ~7 | moyenne | retours, chargebacks |
| 15 | Restauration et hôtellerie | C | ~6 | moyenne | HACCP, Booking |
| 16 | Sport, événements, loisirs | C | ~3 | **faible** | billetterie (junk fees US) |
| 17 | Achats et fournisseurs | C | ~5 | moyenne | appels d'offres, contrats |
| 18 | Télécommunications | C | ~4 | moyenne | obligations ARCEP des petits FAI |
| 19 | Professions juridiques | D | ~7 | moyenne (LCB-FT), faible (notaires) | délais de procédure |
| 20 | Comptabilité et fiscalité (e-invoicing FR/BE/DE/PL/ES, MTD UK) | D | ~10 | **élevée** (calendriers) | nexus sales tax US |
| 21 | Services financiers | D | ~6 | moyenne | MiCA, CGP, affacturage |
| 22 | Recrutement et RH | D | ~7 | moyenne | DSN, contrôle des références |
| 23 | Secteur public et associations | D | ~5 | faible-moyenne | marchés publics |
| 24 | Éducation et formation | D | ~6 | moyenne (Qualiopi), faible (EDOF, K-12) | K-12 US |
| 25 | Cybersécurité, IT, DevOps | E | ~11 | élevée (dates), faible (volonté de payer) | prix des outils CRA |
| 26 | Ventes, support, opérations commerciales | E | ~5 | moyenne-faible | taux de transformation des devis |
| 27 | Marketing, agences, médias | E | ~7 | moyenne | ARPP, contentieux EAA |
| 28 | Créateurs et communautés | E | ~4 | faible-moyenne | formateurs en ligne |
| 29 | Services professionnels spécialisés | E | ~4 | **faible** | traducteurs, photographes |
| 30 | Transverses (crédits d'impôt R&D, RGPD, contrats, IA) | E | ~8 | moyenne (R&D), faible (reste) | assurance-crédit, litiges B2B |
| 31 | Télécoms / VoIP US (FCC) — ajout | C | inclus au 18 | faible | — |

Les comptes « ~ » sont approximatifs (une opportunité peut toucher deux familles). Le détail par ligne est dans `02-idees-longlist.csv`.

## Calendrier des catalyseurs vérifiés (extraits de sources officielles ou de presse spécialisée)

| Date | Événement | Zone | Source (registre) |
|---|---|---|---|
| 01/01/2026 | Programme MFP (prix négociés Medicare) en vigueur ; remboursements via le MTF | US | A-preuves |
| 01/01/2026 | Règle EPA ER&R : registres de fuites des équipements ≥ 15 lb d'HFC | US | B-preuves |
| 01/01/2026 | Reco ACPR 2024-R-03 sur le devoir de conseil, étendue à tous les produits | FR | A-preuves |
| 01/01/2026 | Contrat écrit obligatoire pour l'influence commerciale dès 1 000 € HT | FR | E-preuves |
| 01/01/2026 | CBAM en régime définitif (seuil 50 t) ; WISeR (autorisation préalable Medicare) dans 6 États | UE / US | C, A |
| 01/01/2026 | E-invoicing B2B obligatoire en Belgique | BE | D-preuves |
| 01/07/2026 | Tachygraphe et détachement pour les fourgons de plus de 2,5 t en international | UE | C-preuves |
| 27/07/2026 | Omnibus AI Act (Règl. 2026/1744) : haut risque reporté au 02/12/2027 et au 02/08/2028 | UE | E-preuves |
| 01/09/2026 | Réception obligatoire des e-factures pour toutes les entreprises FR ; émission pour les GE/ETI | FR | D, C |
| 11/09/2026 | CRA : signalement des vulnérabilités exploitées et des incidents | UE | E-preuves |
| 01/11/2026 | Nouveau référentiel Qualiopi (33 indicateurs) — à confirmer sur Légifrance | FR | D-preuves |
| 01/01/2027 | ER&R : entrée du froid commercial et industriel existant ; API prior authorization (CMS-0057-F) | US | B, A |
| 31/01/2027 | Fin du cuivre Openreach (UK) ; lot 3 de la fermeture du cuivre ARCEP | UK/FR | C-preuves |
| 06/04/2027 | MTD ITSA : seuil abaissé à 30 000 £ (~1,08 M d'entrants) | UK | D-preuves |
| 10/07/2027 | AMLR (anti-blanchiment) applicable | UE | D-preuves |
| 01/09/2027 | Émission des e-factures et e-reporting pour les PME/TPE | FR | D-preuves |
| 30/09/2027 | Première déclaration CBAM annuelle | UE | C-preuves |
| 2027-2028 | Verifactu (ES) 2027 ; émission obligatoire en DE en 2027-2028 ; sanctions KSeF (PL) fin 2027 | UE | D-preuves |
| 30/12/2026 et 30/06/2027 | EUDR : grandes et moyennes entreprises, puis micro et petites | UE | B-preuves |
| 20/07/2028 | FSMA 204 (traçabilité alimentaire) reportée | US | B-preuves |

Catalyseurs **disparus ou affaiblis**, qui ont fait éliminer des pistes :
- CSRD pour les PME (Omnibus I) ;
- CSDDD (> 5 000 salariés, 2029) ;
- règle FDA sur les LDT (annulée) ;
- AML pour les RIA US (reportée à 2028) ;
- seuil 1099 relevé à 2 000 $ ;
- NIS2 en France (loi non adoptée au 29/10/2026).

---
