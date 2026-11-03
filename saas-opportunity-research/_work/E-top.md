# E — Top 8 et éliminations (phase 1)

Date : 2026-10-29. Notes sur la grille commune (total sur 100). Toutes les preuves viennent d'extraits de moteur de recherche (WebFetch bloqué sur eur-lex.europa.eu et nosparlementaires.fr) : **aucune note ne repose sur une volonté de payer observée directement** (pas d'entretien, pas de liste d'attente). Les scores « Preuves » restent donc ≤ 9/15.

Légende des colonnes : D = Douleur et budget (20) ; F = Fréquence et criticité (10) ; P = Preuves de demande (15) ; Di = Distribution (15) ; L = Lacune concurrentielle (10) ; M = Faisabilité MVP (10) ; R = Marge et récurrence (5) ; T = Timing (5) ; Df = Défendabilité (5) ; Ri = Risques maîtrisables (5).

| Rang | ID | Piste (acheteur, problème) | D | F | P | Di | L | M | R | T | Df | Ri | **Total** | Confiance |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | E-21 | Contrats d'influence conformes (seuil 1 000 EUR, mentions, preuves de transparence) pour agences d'influence et marques PME en France | 11 | 8 | 9 | 10 | 7 | 9 | 4 | 5 | 2 | 3 | **68** | moyenne-faible |
| 2 | E-01 | Questionnaires de sécurité pour éditeurs SaaS de 5 à 50 personnes sans SOC 2 (UE et US) | 15 | 8 | 8 | 9 | 5 | 8 | 4 | 4 | 2 | 4 | **67** | moyenne |
| 3 | E-05 | Signalement CRA (24 h/72 h/14 j) et veille des vulnérabilités pour petits fabricants de produits connectés (UE) | 15 | 5 | 9 | 7 | 6 | 7 | 4 | 5 | 3 | 3 | **64** | moyenne |
| 4 | E-09 | CMMC niveaux 1/2 (preuves, auto-évaluation, préparation C3PAO) pour micro-sous-traitants défense (US) | 16 | 6 | 8 | 9 | 4 | 7 | 4 | 4 | 3 | 2 | **63** | moyenne-faible |
| 5 | E-13 | Relance des devis non signés pour artisans et TPE de services (France) | 12 | 9 | 6 | 9 | 4 | 9 | 4 | 2 | 2 | 4 | **61** | faible |
| 6 | E-36 | Dossier justificatif CIR/CII tenu au fil de l'eau pour startups et PME tech (France) | 14 | 5 | 6 | 8 | 6 | 8 | 4 | 3 | 3 | 3 | **60** | faible |
| 7 | E-28 | Diligence et déclaration DAC7 pour petites marketplaces UE | 13 | 5 | 7 | 8 | 6 | 7 | 4 | 3 | 3 | 3 | **59** | faible |
| 8 | E-03 | Pilotage NIS2/ReCyF multi-clients pour infogérants français | 12 | 6 | 7 | 10 | 5 | 7 | 4 | 2 | 3 | 3 | **59** | faible |

Hors top 8, juste en dessous : E-31 honoraires MOP architectes (58), E-22 audit FTC des avis (~57), E-02 kit fournisseur NIS2 (~57, à fusionner avec E-01).

---

## Justifications (une ligne chacune + points à vérifier en phase 2)

**1. E-21 — Contrats d'influence FR (68).** Obligation récente et datée (contrat écrit dès 1 000 EUR HT cumulés depuis le 1er janv. 2026, décret du 28 nov. 2025), acheteurs identifiables (agences d'influence, marques D2C), les outils existants sont des plateformes de sourcing côté marque, chères et peu orientées conformité FR. MVP simple (modèles + cumul par créateur + signature + archivage des preuves de mention). *Limites* : marché FR seul, modèles d'avocats gratuits, défendabilité faible. *À vérifier* : texte du décret sur Légifrance, nombre d'agences, volonté de payer (5 entretiens), contrôles DGCCRF 2026.

**2. E-01 — Questionnaires de sécurité, petits éditeurs (67).** Douleur qui bloque des deals, budget commercial réel ; marché payant prouvé (Conveyor, SafeBase, Vanta, Drata) mais jugé cher et pensé pour le mid-market (extraits guptadeepak, soc2auditors) ; NIS2 DE (en vigueur le 6 déc. 2025, ~29 500 entités) pousse les questionnaires vers les fournisseurs. *Limites* : risque de « wrapper IA » si pas de bibliothèque de réponses et de preuves structurée ; responsabilité en cas de réponse fausse ; concurrents nombreux. *À vérifier* : prix réels (pages officielles), volume de questionnaires par éditeur de moins de 50 personnes, fils de fondateurs (Reddit/HN, rien trouvé ici).

**3. E-05 — Signalement CRA pour petits fabricants (64).** Catalyseur live et sanctionné (signalement depuis le 11 sept. 2026, amendes jusqu'à 15 M EUR / 2,5 %), seuls 32 % des fabricants ont un SBOM pour tous leurs produits (enquête balena) ; Verimu affiche 49 à 149 EUR/mois (prix de référence bas). *Limites* : acquisition d'industriels fragmentée, entrants nombreux, analyse binaire difficile pour 1 à 3 personnes. *À vérifier* : périmètre exact (logiciel seul, SaaS exclu ?), prix des autres outils, canaux (fédérations, écosystèmes de microcontrôleurs).

**4. E-09 — CMMC micro-sous-traitants US (63).** L'éligibilité aux contrats en dépend (règle en vigueur le 10 nov. 2025, phase 2 le 10 nov. 2026), acheteurs listables (registres fédéraux, APEX Accelerators [H]). *Limites* : très concurrentiel (Secureframe, Vanta, RPO), contradiction sur une suspension de la phase C3PAO, risques de manipulation de CUI ; marché US uniquement. *À vérifier* : statut de la phase 2 sur une source DoD, nombre de sous-traitants niveau 1.

**5. E-13 — Relance de devis TPE FR (61).** Problème fréquent et monétisable ; Jobber intègre les relances automatiques à partir de son offre Connect (« à partir de 70 USD/mois » selon un extrait de sa page tarifs), ce qui prouve la valeur mais aussi la commoditisation. *Limites* : aucun catalyseur réglementaire vérifié, acquisition TPE coûteuse, fonction susceptible d'être copiée par les logiciels de devis FR. **Biais** : piste proche du produit hôte (Relanzio), notée sans bonus. *À vérifier* : présence de relances automatiques chez Tolteck, Batappli et EBP ; effet de la facturation électronique 2026 (non vérifié ici).

**6. E-36 — Dossier CIR/CII au fil de l'eau (60).** Enjeu financier direct ; règles modifiées par la LF 2025 (CII à 20 %, brevets exclus du CIR) ; les concurrents principaux sont des cabinets payés au pourcentage, d'où un argument pour un SaaS à prix fixe. *Limites* : saisonnalité, risque fiscal, canal des experts-comptables à construire. *À vérifier* : LF 2026, outils logiciels existants, plafond CII (sources divergentes).

**7. E-28 — DAC7 pour petites marketplaces (59).** Obligation annuelle claire (31 janvier, règle des 60 jours), acheteurs identifiables, outils KYC et cabinets peu adaptés aux petites plateformes [H]. *Limites* : catalyseur ancien (2023), saisonnalité forte, schémas XML propres à chaque pays. *À vérifier* : portail et format DGFiP, nombre de plateformes concernées, existence d'intégrations Stripe Connect.

**8. E-03 — NIS2 multi-clients pour infogérants FR (59).** Le canal infogérant démultiplie la distribution (une vente couvre N clients), le ReCyF existe en document de travail et les clients pré-s'enregistrent. *Limites* : **loi toujours non adoptée** (retirée de l'ordre du jour de l'AN des 7 et 9 oct. 2026), Cynomi bien installé. *À vérifier* : réinscription du texte, prix de Cynomi, appétit des infogérants (entretiens).

---

## Pistes ÉLIMINÉES explicitement

1. **E-11 — Inventaire des usages IA et preuve de littératie IA pour PME (AI Act).** *Critères éliminatoires* : **pas de volonté de payer plausible** à court terme et **wrapper IA générique sans avantage**. L'omnibus (Règlement 2026/1744, en vigueur le 27 juil. 2026) reporte le haut risque au 2 déc. 2027 et au 2 août 2028, et assouplit l'art. 4 en obligation de moyens, sans amende propre selon une source ; un registre interne suffit, ce que des tableurs et des formations gratuites couvrent.
2. **E-10 — Migration Atlassian Data Center.** *Critères éliminatoires* : **marge et récurrence structurellement défavorables** (besoin ponctuel jusqu'en 2029, de nature service) et **acquisition non crédible** face aux partenaires Atlassian et au programme Ascend ; les ventes nouvelles ont cessé le 30 mars 2026 et le parc ne fait que décroître.
3. **E-08 — Offboarding SaaS / révocation des accès pour PME.** *Critères éliminatoires* : **aucune lacune concurrentielle et marge défavorable**. Les prix sont déjà très bas (JumpCloud ~3 USD et AccessOwl dès 2,50 USD par utilisateur et par mois, selon un comparatif tiers), les acteurs sont financés (Torii, Zluri, BetterCloud) et l'IdP lui-même absorbe la fonction ; la fiabilité dépend de connecteurs SCIM qu'un solo ne peut pas maintenir à grande échelle.

(Également déclassées sans être formellement éliminées : E-38 Section 174A, dont la fenêtre rétroactive est close depuis le 6 juil. 2026 ; E-18 helpdesk, marché saturé ; E-40 registre RGPD, encombré et concurrencé par un modèle CNIL gratuit.)
