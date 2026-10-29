# E — Cartographie : économie numérique et workflows (phase 1)

Analyste E. Date : 2026-10-29. Périmètre : 6 familles (cyber/IT/DevOps ; ventes et ops commerciales ; marketing et agences ; créateurs ; services professionnels ; transverses).

## Note de méthode (à lire avant tout)
- 38 recherches web effectuées (WebSearch). **WebFetch a été bloqué par la configuration réseau de la session** pour `eur-lex.europa.eu` et `nosparlementaires.fr` (hôtes hors des domaines autorisés). Conformément à la consigne de la session, je n'ai pas tenté d'autres sites ensuite. **Toutes les preuves proviennent donc d'extraits de moteur de recherche** ; les pages n'ont pas été ouvertes. Pour consulter EUR-Lex directement, il faut autoriser `eur-lex.europa.eu` dans les paramètres réseau de la session.
- Conséquence : le statut VÉRIFIÉ n'est utilisé que pour les dates confirmées par au moins deux sources concordantes, dont une institutionnelle si possible. Tout le reste est PARTIEL ou HYPOTHÈSE. Les prix relevés sur des comparatifs tiers figurent dans `notes`, jamais dans `prix_concurrents_observes`.
- Légende : **[F]** fait observé sourcé (extrait de recherche) ; **[E]** estimation ; **[H]** hypothèse ; **[?]** inconnu.

## Tableau de bord réglementaire vérifié (catalyseurs de mes familles)

| Texte | Statut au 2026-10-29 | Source (extrait) | Confiance |
|---|---|---|---|
| NIS2 — France (projet de loi Résilience) | [F] **Non adopté.** Sénat 12/03/2025 ; commission spéciale AN 10/09/2025 ; retiré de l'ordre du jour de l'AN des 7 et 9 oct. 2026, sans nouvelle date. Article 16 bis (anti-portes dérobées) au cœur du blocage. Commission → CJUE le 8 juil. 2026 (FR, IE, ES, NL). | nosparlementaires.fr ; it-connect.fr ; directive-nis2.fr | moyenne |
| NIS2 — ANSSI | [F] ReCyF (Référentiel Cyber France) présenté le 17 mars 2026 en **document de travail** ; pré-enregistrement des entités depuis le 24 nov. 2025 (source secondaire). | cyber.gouv.fr ; donneespersonnelles.fr | moyenne |
| NIS2 — Allemagne | [F] Loi de transposition en vigueur le 6 déc. 2025, sans période transitoire ; ~4 500 → ~29 500 entités (BSI cité). | locaterisk.com | moyenne |
| NIS — Royaume-Uni (Cyber Security and Resilience Bill) | [F] MSP moyens/grands dans le périmètre, régulateur ICO, 900-1 100 MSP ; au stade du rapport aux Lords (sept. 2026), sanction royale espérée fin 2026, mise en œuvre complète possiblement en 2028. | mondaq.com ; usecure.io | moyenne |
| Cyber Resilience Act | [F] **Signalement obligatoire depuis le 11 sept. 2026** (vulnérabilités activement exploitées et incidents graves) : 24 h / 72 h / 14 j (vuln.) ou 1 mois (incidents), via la plateforme unique ENISA ; pas de pré-enregistrement ; repli e-mail seulement si la plateforme est déclarée hors service. Obligations principales au **11 déc. 2027**. Lignes directrices Commission du 27 juil. 2026. Amendes jusqu'à 15 M EUR / 2,5 % du CA. | mccannfitzgerald.com ; CSA ; ncsc.gov.ie ; crowell.com | élevée (dates) |
| AI Act + omnibus numérique IA | [F] **Règlement (UE) 2026/1744** publié au JO le 24 juil. 2026, en vigueur le 27 juil. 2026. Haut risque Annexe III : **2 déc. 2027** (au lieu du 2 août 2026) ; Annexe I : **2 août 2028**. Art. 4 (littératie IA) maintenu mais recalibré en obligation de moyens. Transparence art. 50 maintenue au 2 août 2026, avec grâce jusqu'au 2 déc. 2026 pour le marquage des systèmes déjà sur le marché (à confirmer). Nouvelles interdictions (contenus intimes non consentis, CSAM). EUR-Lex non consulté (bloqué). | hunton.com ; lewissilkin.com ; sidley ; ki-campus.org | élevée (dates principales) |
| European Accessibility Act | [F] Applicable depuis le 28 juin 2025 ; micro-entreprises de services (<10 pers. et ≤2 M EUR) exemptées (art. 4(5)) ; en France, DGCCRF autorité par défaut ; montants de sanctions **contradictoires** selon sources (7 500 EUR/infraction chez Deque). Mises en demeure de grands distributeurs (nov. 2025) rapportées par des vendeurs, non confirmées. | taylorwessing.com ; deque.com | moyenne |
| FTC — Consumer Reviews and Testimonials Rule (16 CFR 465) | [F] En vigueur le 21 oct. 2024 ; premières lettres d'avertissement à 10 entreprises le 22 déc. 2025 ; ~53 088 USD par infraction (ajustement 2026 annulé, à vérifier). Influenceurs : relèvent des Endorsement Guides. | beneschlaw.com ; foodnavigator-usa.com | moyenne |
| Influence commerciale — France | [F] Contrat écrit obligatoire **depuis le 1er janv. 2026** dès 1 000 EUR HT cumulés/an pour un même objectif promotionnel (décret du 28 nov. 2025, art. 8 de la loi du 9 juin 2023). Légifrance non consulté. | eurojuris.fr ; woo.paris | moyenne |
| DAC7 | [F] Déclaration annuelle au 31 janvier ; exception vendeur occasionnel (<30 ventes et ≤2 000 EUR) ; fermeture de compte ou retenue des paiements 60 jours après la 2e relance. Spécificités françaises (DGFiP) non vérifiées. | vistra.com ; ondato.com | moyenne |
| CMMC (US) | [F] Règle DFARS en vigueur le 10 nov. 2025 ; phase 2 (C3PAO niveau 2) prévue au **10 nov. 2026**. Une source (Secureframe) évoque une suspension de l'étape C3PAO : **contradiction non résolue**. | secureframe.com ; venable.com | moyenne / faible sur la phase 2 |
| CIR/CII (FR) | [F] LF 2025 : CII à 20 % (dépenses dès le 1er janv. 2025), frais de fonctionnement exclus ; CIR : brevets exclus, régime « jeunes docteurs » supprimé (dépenses dès le 15 févr. 2025). Plafond CII divergent selon sources. LF 2026 non vérifiée. | Deloitte Avocats ; WebLex ; PNO | moyenne |
| R&D UK | [F] Formulaire AIF obligatoire depuis le 8 août 2023 ; régime fusionné pour les exercices ouverts dès le 1er avr. 2024 ; notification préalable des primo-demandeurs sous 6 mois. | granttree ; pricebailey ; JCK | moyenne |
| R&D US (Section 174A, OBBBA) | [F] Dépense immédiate rétablie dès 2025 ; fenêtre rétroactive 2022-2024 close le 6 juil. 2026 (source secondaire, IRS non consulté). | beancount.io | faible |
| Fin de vie d'un logiciel dominant | [F] Atlassian Data Center : fin de vie le 28 mars 2029 (30 mars selon d'autres sources) ; fin des ventes nouvelles le 30 mars 2026 ; fin des renouvellements le 30 mars 2028. | jimiwikman.se ; community.atlassian.com | moyenne |
| CNIL | [F] Bilan 2025 : 83 sanctions, 486 839 500 EUR ; cookies parmi les sujets principaux. Procédure simplifiée 2026 : 23 sanctions pour 133 750 EUR (presse, à confirmer). | cnil.fr ; economiematin.fr | élevée / faible |

---

## Famille 1 — Cybersécurité, IT, DevOps et développeurs

**Acteurs payeurs**
- Éditeurs SaaS B2B de 5 à 100 personnes vendant à des grands comptes (payent pour débloquer des deals) [H, plausible vu le marché existant Vanta/Drata/Conveyor].
- MSP / infogérants (payent des outils multi-clients revendus en service récurrent) [F : offres MSP de Cynomi, CyberArrow].
- PME fournisseurs d'entités NIS2 (payent sous contrainte contractuelle) [F : DIGITAL SME].
- Fabricants de produits avec éléments numériques (IoT, électronique, logiciel embarqué) : nouveaux payeurs CRA [F].
- Sous-traitants défense US (CMMC) [F].

**Workflows fréquents** : réponse aux questionnaires de sécurité fournisseurs ; collecte de preuves (politiques, captures, journaux d'accès) ; arrivées/départs et révocation des accès ; veille CVE et correctifs ; production de SBOM ; signalement d'incidents (NIS2 24 h/72 h, CRA 24 h/72 h/14 j, RGPD 72 h en parallèle) ; inventaire des outils IA.

**Documents et systèmes** : questionnaires (Excel, portails acheteurs), SOC 2 / ISO 27001, PSSI, registres d'actifs, SBOM (SPDX, CycloneDX), VEX, déclaration UE de conformité, plateforme unique ENISA, MonEspaceNIS2 (ANSSI), SPRS (US), RMM/PSA côté MSP, IdP (Google Workspace, Entra), SCIM.

**Contraintes structurelles** : marché GRC dominé par des acteurs financés (Vanta, Drata, Secureframe) ; prix non publics ; responsabilité en cas de réponse erronée ; besoin d'intégrations (IdP, cloud, Git) pour automatiser la preuve ; en France, incertitude législative sur NIS2.

**Changements vérifiables** : voir tableau (NIS2 FR bloquée, DE en vigueur, UK en cours ; CRA signalement live ; omnibus IA ; CMMC ; fin de vie Atlassian DC).

**Niches repérées** : questionnaires pour petits éditeurs sans SOC 2 (E-01) ; kit fournisseur NIS2 pour PME non tech (E-02) ; pilotage NIS2 multi-clients pour infogérants FR (E-03) ; signalement CRA pour petits fabricants (E-05) ; SBOM depuis binaire (E-06) ; dossier technique CRA (E-07) ; CMMC pour micro-sous-traitants (E-09).

**Couverture** : **élevée** sur les dates réglementaires ; **moyenne** sur les concurrents ; **faible** sur la volonté de payer (aucun entretien, aucune donnée de conversion). Angles non couverts : prix réels des outils CRA hors Verimu ; taille du marché des petits fabricants IoT UE ; volume réel de questionnaires reçus par un petit éditeur ; état du marché SBOM en open source (Dependency-Track etc. non vérifiés).

## Famille 2 — Ventes, support et opérations commerciales

**Acteurs payeurs** : TPE artisans et services à domicile (budget faible, forte sensibilité au prix) ; PME de services B2B (agences, BET, conseil) ; PME avec équipe commerciale de 5 à 30 personnes (commissions).

**Workflows** : devis → relance → signature → acompte ; propositions commerciales longues ; calcul de la rémunération variable ; réponses aux appels d'offres (DCE, mémoire technique) ; support par e-mail.

**Documents et systèmes** : logiciels de devis/facturation (Batappli, Tolteck, EBP, Sellsy, Axonaut, Henrri, Abby — [F] cités dans des comparatifs), CRM (HubSpot, Pipedrive [H]), tableurs de commissions, signature électronique.

**Contraintes** : la relance de devis est souvent une **fonction** intégrée aux logiciels de devis (Jobber l'inclut à partir de l'offre Connect [F]) → risque de commoditisation ; acquisition TPE coûteuse ; aucun catalyseur réglementaire vérifié dans ce lot (la réforme de la facturation électronique n'a pas été vérifiée ici).

**Niches** : relance de devis TPE en FR (E-13) ; suivi des propositions des sociétés de services (E-14) ; commissions PME, angle FR (E-15) ; mémoires techniques pour marchés publics (E-16).

**Couverture** : **moyenne-faible**. Non couvert : prix officiels des logiciels de devis FR ; taux de transformation des devis ; existence de relances automatiques chez Tolteck/Batappli/EBP. **Biais signalé** : le dépôt hôte (Relanzio) traite la relance de devis ; j'ai noté E-13 sans bonus.

## Famille 3 — Marketing, agences et médias

**Acteurs payeurs** : petites agences (2-20 pers.) et studios ; agences web gérant des dizaines de sites ; marques D2C ; agences d'influence.

**Workflows** : validation des livrables par le client ; reporting mensuel ; maintenance des sites (bandeaux cookies, accessibilité) ; contractualisation avec créateurs ; sollicitation d'avis clients ; gestion des droits d'images/musiques.

**Documents et systèmes** : outils de validation (Filestage, Ziflow, PageProof), CMP (Didomi, Axeptio, Cookiebot [H, non vérifiés]), audits d'accessibilité, contrats d'influence, déclarations d'accessibilité.

**Contraintes** : marchés de validation et de reporting encombrés ; responsabilité partagée agence/client en conformité ; prix d'entrée des outils de validation autour de 199 USD/mois selon un concurrent [F secondaire].

**Changements vérifiables** : EAA (28 juin 2025) ; FTC règle avis (21 oct. 2024, lettres déc. 2025) ; contrat d'influence écrit obligatoire en France (1er janv. 2026) ; sanctions cookies CNIL (bilan 2025, procédure simplifiée). **ARPP : non vérifié** dans ce lot.

**Niches** : contrats d'influence conformes FR (E-21) ; audit FTC des pratiques d'avis (E-22) ; monitoring cookies multi-sites pour agences (E-24) ; accessibilité e-commerce PME (E-23).

**Couverture** : **moyenne**. Non couvert : ARPP ; prix officiels des CMP ; nombre d'agences d'influence en France ; état des contentieux EAA.

## Famille 4 — Créateurs et communautés

**Acteurs payeurs** : créateurs professionnels et leurs agents ; marques payant des créateurs UGC ; petites plateformes/marketplaces (DAC7) ; éditeurs de newsletters.

**Workflows** : pipeline des sponsorings, livrables, factures, relances de paiement ; contrats (obligatoires en FR) ; collecte des données fiscales des vendeurs (DAC7) ; vente d'emplacements de newsletter.

**Systèmes** : Notion/tableurs, outils comme GetSponsored [F, Capterra], plateformes d'influence côté marque (Upfluence, GRIN), acteurs KYC (Ondato), cabinets fiscaux (Vistra).

**Contraintes** : faible budget des créateurs individuels ; forte saisonnalité DAC7 (janvier) ; données fiscales sensibles.

**Niches** : DAC7 pour petites plateformes (E-28) ; CRM sponsorings créateur (E-27) ; paiements UGC US (E-30, [H]).

**Couverture** : **faible-moyenne**. Non couvert : implémentation française de DAC7 (portail DGFiP) ; DAC8/DAC9 ; outils côté créateur en France ; formateurs en ligne (non traités).

## Famille 5 — Services professionnels spécialisés

**Acteurs payeurs** : agences d'architecture (2-15 pers.), bureaux d'études, géomètres, cabinets de conseil, traducteurs, photographes.

**Workflows** : suivi des honoraires par phase (ESQ → AOR selon les missions MOP) ; saisie des temps ; facturation à l'avancement ; renouvellement de licences d'images ; dépôt d'attestations de vigilance chez les donneurs d'ordre.

**Systèmes** : OOTI et logiciels de gestion d'agence [F nom seulement], Excel, logiciels comptables.

**Contraintes** : marchés verticaux de taille modeste par pays ; la saisie des temps est un problème d'adoption ; pas de catalyseur réglementaire vérifié.

**Niches** : honoraires MOP architectes (E-31) ; avancement BET/géomètres (E-32).

**Couverture** : **faible**. Les seules sources sont du contenu SEO d'un éditeur (Kolonell). Non couvert : prix officiels d'OOTI ; effectifs des professions ; traducteurs et photographes (hypothèses non sourcées).

## Famille 6 — Transverses et marchés oubliés

**Acteurs payeurs** : startups et PME innovantes (CIR/CII, R&D UK/US) ; DAF de PME (contrats, assurance-crédit, litiges) ; référents RGPD de TPE/PME ; DSI/DPO (gouvernance IA).

**Workflows** : documentation au fil de l'eau des projets R&D et des temps ; formulaires AIF (UK) ; calendrier des préavis de résiliation ; registre de l'art. 30 et demandes d'accès ; déclarations d'impayés à l'assureur-crédit [H] ; inventaire des usages IA.

**Systèmes** : cabinets CIR rémunérés au pourcentage ; modèle Excel CNIL ; outils RGPD (Legiscope, Leto, Dastra) ; outils de renouvellement (RenewalWatch, Renewly).

**Changements vérifiables** : LF 2025 (CIR/CII) ; AIF UK et régime fusionné ; Section 174A US ; omnibus IA (art. 4 assoupli, haut risque reporté) ; bilan CNIL 2025.

**Niches** : dossier CIR/CII au fil de l'eau (E-36) ; AIF UK (E-37) ; reconductions tacites (E-39) ; registre RGPD (E-40, encombré).

**Couverture** : **moyenne** sur la fiscalité R&D ; **faible** sur l'assurance-crédit, les litiges B2B et la gestion documentaire réglementaire (aucune recherche dédiée faute de budget).

---

## Synthèse comparative US / France-UE / autres

- **États-Unis** : catalyseurs = application par la FTC (avis), CMMC (défense), Section 174A. Marché plus grand, concurrence plus financée (GRC, CMMC), acquisition plus chère. Les fonctions « relance de devis » y sont déjà intégrées aux logiciels de terrain (Jobber).
- **France/UE** : catalyseurs les plus nombreux et les plus récents (CRA live depuis sept. 2026, contrat d'influence 2026, NIS2 DE en vigueur, NIS2 FR en attente, EAA, CNIL). Avantage pour un solo francophone : documentation en français, référentiels locaux (ReCyF), outillage peu localisé chez les acteurs US.
- **Royaume-Uni** : CS&R Bill (MSP), AIF R&D : marchés de niche, plutôt modules complémentaires.
- **Allemagne** : NIS2 en vigueur depuis le 6 déc. 2025 avec ~29 500 entités → meilleur marché UE immédiat pour la cascade de questionnaires fournisseurs (E-01/E-02), mais exige l'allemand.
