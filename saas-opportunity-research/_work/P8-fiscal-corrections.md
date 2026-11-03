# P8 — Vérification et correction des hypothèses fiscales et sociales (micro-SaaS en micro-entreprise, puis cession)

Date : 2026-10-30. Rédaction : expert fiscal et social (agent de recherche).
Documents contrôlés : `_work/P7-fiscal.md` et la section 3 de `13-micro-saas-decision.md`.
Preuves : `_work/P8-fiscal-preuves.csv` (ids P8X-P01 à P8X-P45).

> **Avertissement.** Ce document est une vérification documentaire. **Ce n'est pas un conseil fiscal, social ou juridique.** Les règles ont été lues dans des **extraits** de pages officielles, pas dans les textes complets (voir « Méthode »). Avant de vous immatriculer, de choisir la catégorie d'activité, d'opter pour le versement libératoire ou pour la TVA, ou de signer une cession, faites valider votre cas par un **expert-comptable**. Pour l'acte de cession, faites appel à un **avocat**.

## Méthode et mode d'accès

- **WebFetch** a été essayé une fois, sur autoentrepreneur.urssaf.fr. Il a échoué (`getaddrinfo ENOTFOUND`) : l'hôte n'est pas autorisé dans cette session. **Aucune page n'a été lue en entier.** Pour lire les textes complets, il faut autoriser ces domaines dans les réglages réseau de la session.
- J'ai fait **32 recherches WebSearch**, limitées aux domaines officiels : urssaf.fr, autoentrepreneur.urssaf.fr, impots.gouv.fr, bofip.impots.gouv.fr, legifrance.gouv.fr, service-public.fr, entreprendre.service-public.fr et economie.gouv.fr. Une seule recherche a aussi visé cci.fr, mais le taux de la TFC est confirmé par Légifrance.
- Toutes les sources ont été consultées le **2026-10-29 ou le 2026-10-30**. La date de publication vient de l'identifiant BOFiP (par exemple `-20260701`) ou du millésime du document. Quand elle n'est pas connue, la colonne indique « n.c. ».
- Dans le CSV, la colonne `sens` indique le rapport de la source à l'hypothèse d'origine : **POUR** si elle la confirme, **CONTRE** si elle la corrige ou la nuance, **NEUTRE** si elle apporte du contexte.
- Statuts : **CONFIRMÉE** = la source officielle donne la même valeur ; **CORRIGÉE** = la valeur ou sa portée change ; **NON VÉRIFIABLE** = aucun texte officiel trouvé, une valeur prudente est alors proposée. Les mentions [E] signalent un raisonnement de ma part à partir de règles sourcées, et [H] une hypothèse.

---

## 1. Tableau de contrôle des hypothèses

| # | Hypothèse (P7 / §3) | Statut | Valeur retenue | Source officielle (id preuve) | Date de la source | Mode d'accès |
|---|---|---|---|---|---|---|
| 1 | SaaS = **BIC prestations de services** | **CONFIRMÉE, avec réserve** (aucun texte ne vise le SaaS) | BIC prestations de services : abattement 50 %, cotisations 21,2 %. **Ce n'est pas de la « vente »** (12,3 %, abattement 71 %), qui est réservée à l'achat-revente et à la fourniture de logement. Variante prudente : BNC à 25,6 %. | Urssaf, FAQ : « Fourniture de logiciels en tant qu'entreprise de développement informatique » est un exemple de BIC (P8X-P03). impots.gouv : 71 % pour l'achat-revente, 50 % pour les prestations (P8X-P07). Contre : economie.gouv range les « métiers de l'informatique et du numérique » parmi les libéraux non réglementés (BNC) (P8X-P04). BOFiP BNC-SECT-30-20 : les licences de logiciels concédées par leur auteur relèvent des BNC (P8X-P05). | n.c. / 2012 | WebSearch, extraits |
| 2 | Cotisations BIC services **21,2 %** | **CONFIRMÉE** | 21,2 % en 2026 | urssaf.fr, autoentrepreneur.urssaf.fr (P8X-P01, P8X-P02) | 2026 | WebSearch |
| 2b | Cotisations BNC (régime général) | **CONFIRMÉE à 25,6 %** depuis le 1/1/2026 (24,6 % en 2025). Le calendrier de 2024, qui prévoyait 26,1 %, est périmé. | 25,6 % | urssaf.fr, actualité « Évolution des taux » ; page Urssaf de 2024 qui annonçait 26,1 % (P8X-P01, P8X-P45) | 2026 | WebSearch |
| 2c | CIPAV 23,2 % | **CONFIRMÉE**, mais **ne s'applique pas** à un SaaS (professions réglementées listées) [E] | sans objet | Urssaf (P8X-P01) | 2026 | WebSearch |
| 3 | **CFP 0,1 %** | **CONFIRMÉE sous condition** | **0,1 %** si l'activité est immatriculée comme **commerciale**, **0,2 %** si elle est déclarée **libérale** (BNC), 0,3 % pour un artisan. economie.gouv écrit « prestation de service et professions libérales : 0,2 % », ce qui est ambigu. **Valeur prudente : 0,2 %**, soit 0,1 point de CA en plus. | urssaf.fr (P8X-P09) ; economie.gouv (P8X-P08) | 2026 | WebSearch |
| 4 | **TFC 0,044 %** | **CONFIRMÉE**, avec une précision | **0,044 %** (CCI, prestations de services ; 0,015 % pour les ventes). Due **à partir de la 2e année**, et **non due si le CA de l'avant-dernière année est inférieur à 5 000 €**. Le taux de la chambre des métiers (0,48 %) ne concerne pas un SaaS. | CGI art. 1600 sur Légifrance (P8X-P10) ; fiche DGFiP 2026 (P8X-P11) ; autoentrepreneur.urssaf.fr (P8X-P12) | 2026 | WebSearch |
| 5 | **Versement libératoire 1,7 %** | **CONFIRMÉE**, avec une **correction de procédure** | 1,7 % (BIC services), 2,2 % (BNC). Plafond : **RFR 2024 ≤ 29 315 € par part** pour 2026, **RFR 2025 ≤ 29 579 € par part** pour 2027. Option avant le **30/9 de N-1**. **En cas de création : au plus tard le dernier jour du 3e mois qui suit la création.** P7 disait seulement « à vérifier ». | impots.gouv, « Le versement libératoire » (P8X-P13) ; autoentrepreneur.urssaf.fr (P8X-P14) ; fiche DGFiP 2026 (P8X-P11) | 2026 | WebSearch |
| 6 | Seuil micro **83 600 €** | **CONFIRMÉE** | 83 600 € HT pour les services, 2026 à 2028 (203 100 € pour les ventes). Le seuil est **proratisé l'année de création**. Le régime est perdu après **2 années consécutives** de dépassement. Ce seuil se calcule sur **tout le CA**, export compris. | impots.gouv FAQ (P8X-P15) ; BOFiP BAREME-000044 et BIC-DECLA-10-10-10, versions du 19/8/2026 (P8X-P16) | 2026-08-19 | WebSearch |
| 7 | Franchise TVA **37 500 / 41 250 €** | **CONFIRMÉE** pour les seuils, **CORRIGÉE** pour la portée | 37 500 € (N-1) et 41 250 € (en cours d'année). Le seuil unique de 25 000 € est **abandonné** (loi n° 2025-1044 du 3/11/2025). **Correction n° 1** : le CA à comparer au seuil est le **CA réalisé en France**, c'est-à-dire celui des opérations **dont le lieu d'imposition est en France**. Les ventes B2B à des clients professionnels hors de France n'en font pas partie. **Correction n° 2** : un dépassement de 37 500 € en N fait perdre la franchise au **1/1/N+1**. Seul un dépassement de 41 250 € la fait perdre **en cours d'année**. La §3 de `13-…md` écrit « au-delà de 37 500 € la franchise est perdue », ce qui est trop rapide. | BOFiP BOI-TVA-DECLA-40-10-10-20260701 (P8X-P17) ; BOFiP ACTU-2025-00144 (P8X-P18) ; economie.gouv (P8X-P44) ; fiche DGFiP 2026 (P8X-P11) | 2026-07-01 | WebSearch |
| 8 | Clients professionnels **hors UE (US)** | **CORRIGÉE** (précision) | Lieu d'imposition au preneur (art. 259-1° CGI) : **facture HT**, avec la mention **« TVA non applicable – art. 259-1 du CGI »**. La mention « Autoliquidation » est réservée aux clients assujettis **établis dans l'UE**. **Pas de DES** hors UE. Ce CA **ne compte pas** pour la franchise, mais il **compte** pour le seuil micro de 83 600 € et pour les cotisations. À partir du **1/1/2027**, les références de facture passent du CGI au **CIBS**. | impots.gouv, « Prestations entre assujettis » (P8X-P19) ; BOFiP BOI-TVA-CHAMP-20-50-20 (P8X-P20) ; rapport sur l'ordonnance 2026-671 (P8X-P23) | 2019 à 2026 | WebSearch |
| 9 | **Achats de services étrangers** : TVA autoliquidée et non déductible en franchise | **CONFIRMÉE** pour l'UE, **CONFIRMÉE dans son principe** hors UE [E] | 20 % autoliquidés **dès le 1er euro** (pas de seuil pour les services ; le seuil de 10 000 € concerne les **acquisitions de biens**). TVA **non déductible** tant que vous êtes en franchise. Hors UE : art. 283-2 CGI, le preneur assujetti identifié en France est redevable. | impots.gouv FAQ micro TVA (P8X-P21) ; BOFiP BOI-TVA-DECLA-10-10-20 (P8X-P22) | 2020 à 2026 | WebSearch |
| 10 | Plus-value à long terme : **IR 12,8 %** | **CONFIRMÉE** | 12,8 % sur la plus-value nette à long terme (élément détenu **≥ 2 ans**). Moins de 2 ans : **court terme, au barème**. Même au régime micro, les règles de droit commun s'appliquent. | Brochure IR 2026 (P8X-P24) ; BOFiP BIC-DECLA-20 (P8X-P27) ; BOFiP BIC-PVMV-20-10 (P8X-P28) | 2026 | WebSearch |
| 11 | **Prélèvements sociaux 18,6 %** | **CONFIRMÉE** (P7 disait « à confirmer ») | **18,6 %** : CSG 10,6 % + CRDS 0,5 % + solidarité 7,5 %. La LFSS 2026 (loi n° 2025-1403, art. 12) les applique **à partir des revenus 2025**. La brochure IR 2026 applique ce taux aux plus-values professionnelles à long terme des micro-entrepreneurs. Total : **31,4 %**. Une liste limitative de revenus reste à 9,2 % de CSG (revenus fonciers, etc.) ; les plus-values professionnelles n'y figurent pas, d'après la brochure. Le taux d'une vente en 2028-2031 dépendra des LFSS futures. | Brochure IR 2026, revenus non salariés (P8X-P24) ; Légifrance, LFSS 2026 art. 12 (P8X-P25) ; service-public F2329 (P8X-P26) | 2025-12-30 / 2026 | WebSearch |
| 12 | **Art. 151 septies** (services : 90 000 / 126 000 €, 5 ans) | **CONFIRMÉE**, avec une **correction sur les prélèvements sociaux** | Exonération **totale si la moyenne des recettes HT des 2 années précédentes est ≤ 90 000 €**, dégressive jusqu'à **126 000 €**. Activité exercée **à titre professionnel depuis au moins 5 ans**. **La part exonérée échappe à l'IR et aux prélèvements sociaux**, alors que P7 écrivait « PS à confirmer ». Le dispositif vise **toute plus-value sur un élément d'actif**, y compris la vente d'un actif isolé [E]. | Légifrance, art. 151 septies (P8X-P29) ; impots.gouv (P8X-P30) ; BOFiP BIC-PVMV-40-10-10-20 (P8X-P31) ; BOFiP BIC-PVMV-40-10-10-30-20250723 (P8X-P32) | 2025-07-23 | WebSearch |
| 13 | **Art. 238 quindecies** (500 000 / 1 000 000 €, 5 ans) | **CONFIRMÉE** | Exonération totale si la valeur des éléments transmis est **≤ 500 000 €**, dégressive jusqu'à **1 000 000 €**. Conditions : activité de **5 ans**, transmission d'une **entreprise individuelle ou d'une branche complète** (pas d'actifs isolés), cédant **non contrôlant** de l'acheteur pendant 3 ans. Exonération d'**IR et de PS** (BOFiP ; notice MSA). La LF 2026 n'a rien changé pour l'EI : son art. 15 vise l'IS. | Légifrance, art. 238 quindecies (P8X-P33) ; BOFiP BIC-PVMV-40-20-50-20250723 (P8X-P34) ; BOFiP ACTU-2026-00081 (P8X-P43) | 2025-07-23 | WebSearch |
| 14 | **Droits d'enregistrement** : 3 % au-delà de 23 000 € | **CONFIRMÉE**, avec des précisions | Barème cumulé (État, département, commune) : **0 % jusqu'à 23 000 €, 3 % de 23 000 à 200 000 €, 5 % au-delà**. Perception minimum de 25 €. Le barème s'applique aux **cessions de fonds de commerce et de clientèles** (art. 719), **même si tous les éléments ne sont pas cédés, dès que la clientèle est transmise**. **À la charge de l'acquéreur sauf stipulation contraire** (art. 1712). | BOFiP BOI-ENR-DMTOM-10-20-20-20240619 (P8X-P35) ; impots.gouv, « Cession de fonds de commerce » (P8X-P36) ; Légifrance, art. 1712 (P8X-P37) ; BOFiP ENR-DMTOM-10-10-10 et ENR-DMTOM-10 (P8X-P38, P8X-P39) | 2024-06-19 | WebSearch |
| 14b | Vente d'**actifs numériques isolés** (code seul, nom de domaine seul) | **NON VÉRIFIABLE** (aucun texte officiel ne vise ce cas) | Valeur prudente [E] : **sans transfert de clientèle**, pas d'art. 719, donc **pas de droits proportionnels** ; **pas de 257 bis ni de 238 quindecies**. Le **151 septies** reste possible. Si la plus-value est imposable : 12,8 % + 18,6 %, ou le barème à court terme. **Risque de requalification** en cession de fonds si les abonnés suivent de fait. | BOFiP ENR-DMTOM-10-10-10 : la clientèle est l'élément essentiel (P8X-P38) | 2012 | WebSearch |
| 15 | **TVA sur la cession** : dispense de l'art. 257 bis | **CONFIRMÉE** dans son principe | Dispense **de plein droit** pour la transmission d'une universalité (fonds ou branche autonome) **entre redevables**, si l'acheteur poursuit l'exploitation. Un vendeur **encore en franchise** ne facture pas de TVA de toute façon [E]. Pour un acheteur **étranger**, analyse au cas par cas [H]. | BOFiP BOI-TVA-CHAMP-10-10-50-10-20221025 (P8X-P40) | 2022-10-25 | WebSearch |
| 16 | ACRE (P7 §3) | **CONFIRMÉE** | Plus automatique depuis le 1/1/2026 : critères d'éligibilité, demande **dans les 60 jours**. Pour une **création à partir du 1/7/2026**, le taux est égal à **75 % du taux normal**, soit environ 15,9 % en BIC services [E]. | urssaf.fr, « Acre : nouvelles règles 2026 » (P8X-P41) ; economie.gouv (P8X-P08) | 2026 | WebSearch |
| 17 | CFE 300 €/an | **NON VÉRIFIABLE** (le montant dépend de la commune) | **0 € l'année de création.** Cotisation minimum **exonérée si le CA de référence est ≤ 5 000 €**. Sinon, **300 € [H]** à vérifier auprès de la commune. | impots.gouv FAQ CFE (P8X-P42) | n.c. | WebSearch |

### Ce qui change par rapport à P7 et à la §3

1. **Franchise de TVA** :
   - elle s'apprécie sur le **CA réalisé en France** ; une part importante de clients professionnels étrangers (UE ou US) **retarde la sortie de la franchise** ;
   - un dépassement de 37 500 € n'a d'effet qu'au **1/1 de l'année suivante** ; seul un dépassement de 41 250 € fait perdre la franchise en cours d'année.
2. **Facturation aux clients US** : la mention est « TVA non applicable – art. 259-1 du CGI », et non « autoliquidation ». Les références changent au **CIBS le 1/1/2027**.
3. **Art. 151 septies** : il **exonère aussi des prélèvements sociaux** la part exonérée. P7 laissait ce point ouvert.
4. **Prélèvements sociaux à 18,6 %** sur la plus-value à long terme : c'était « à confirmer », c'est **confirmé** pour 2026.
5. **CFP** : 0,1 % seulement si l'activité est **commerciale** ; 0,2 % par prudence.
6. **Versement libératoire en création** : l'option se fait au plus tard le **dernier jour du 3e mois** qui suit la création.
7. **Option pour la TVA**, une piste que P7 ne chiffrait pas : avec 100 % de clients B2B qui récupèrent la TVA, **renoncer à la franchise** permet de déduire les 20 % payés sur les achats étrangers, soit **+576 €/an à 1 000 € de MRR et +960 €/an à 3 000 €**. En contrepartie, il faut déposer des déclarations au **réel normal à partir de 2027**. À arbitrer avec un expert-comptable.

---

## 2. Exemple chiffré corrigé (1 000, 3 000 et 5 000 € de MRR)

**Hypothèses**
- Année de croisière (année 2 ou plus), BIC prestations de services, sans ACRE, prix moyen de 100 € HT par mois.
- Mêmes charges que P7 §6. Stripe : 1,5 % + 0,25 € par paiement + Billing 0,7 % (source éditeur, [H]).
- Achats (hébergement, outils, IA) facturés depuis l'étranger.
- Cotisations : **21,2 % + CFP 0,1 % + TFC 0,044 % = 21,344 %** (confirmé).
- Versement libératoire : 1,7 % (confirmé).
- CFE : 300 € [H].
- **Scénario A** : 100 % de clients B2B en France. **Scénario B** : 50 % de clients B2B aux US (hors champ de la TVA française). Les frais Stripe sont supposés identiques, ce qui est optimiste pour les cartes non européennes [H].

| | **MRR 1 000 €** | **MRR 3 000 €** | **MRR 5 000 €** |
|---|---|---|---|
| CA annuel HT (compte pour le seuil micro de 83 600 € et pour les cotisations) | 12 000 € | 36 000 € | 60 000 € |
| **A** : CA « France » pour la franchise / régime de TVA | 12 000 € / franchise | 36 000 € / franchise (≤ 37 500 €) | 60 000 € / **TVA due**. L'année du premier dépassement, la TVA est due à partir du jour où l'on franchit 41 250 €. |
| **B** : CA « France » pour la franchise / régime de TVA | 6 000 € / franchise | 18 000 € / franchise | **30 000 € / franchise maintenue** |
| Stripe | 294 € | 882 € | 1 470 € |
| Hébergement, outils, IA (HT) | 2 880 € | 4 800 € | 7 080 € |
| TVA autoliquidée non déductible, A / B | 576 € / 576 € | 960 € / 960 € | 0 € / **1 416 €** |
| Cotisations, CFP et TFC (21,344 %) | 2 561 € | 7 684 € | 12 806 € |
| CFE [H] | 300 € | 300 € | 300 € |
| Versement libératoire (1,7 %) | 204 € | 612 € | 1 020 € |
| **Net après IR, scénario A** | **5 185 € (432 €/mois)** | **20 762 € (1 730 €/mois)** | **37 324 € (3 110 €/mois)** |
| **Net après IR, scénario B** | 5 185 € (432 €/mois) | 20 762 € (1 730 €/mois) | **35 908 € (2 992 €/mois)** |
| Variante **option TVA** (A ou B) : TVA d'achat récupérée | **5 761 € (480 €/mois)** | **21 722 € (1 810 €/mois)** | 37 324 € (3 110 €/mois) |
| Variante **CFP prudente à 0,2 %** (scénario A) | 5 173 € | 20 726 € | 37 264 € |
| Variante **BNC** : 25,6 % + CFP 0,2 %, VL 2,2 % (scénario A) | 4 590 € (382 €/mois) | 18 978 € (1 582 €/mois) | 34 350 € (2 862 €/mois) |
| Variante **ACRE** en année 1 (15,9 % + 0,144 %, création après le 1/7/2026, si éligible) [E] | 5 821 € | 22 670 € | 40 504 € |

**Lecture**
- **Les chiffres centraux de P7 et de la §3 sont confirmés.** Ils donnent environ 1 730 € nets par mois à 3 000 € de MRR, et des prélèvements (cotisations et VL) d'environ 23 % du CA. Les corrections ne changent ce résultat qu'à la marge, de −36 € à +960 € par an.
- **L'écart le plus fort vient de la catégorie** : en BNC, on perd environ **1 800 € par an à 3 000 € de MRR**. C'est le point à trancher en premier, avec un rescrit si nécessaire.
- **Avec des clients US, rester en franchise coûte de l'argent** (−1 416 € par an à 5 000 € de MRR). Pour une clientèle 100 % B2B, l'option pour la TVA est presque toujours rentable [E]. Il faut seulement assumer les déclarations.

**Exemple de cession corrigé [E]** : prix de 60 000 € pour un fonds créé par le vendeur (valeur d'origine nulle), dans le scénario A.

| Moment de la vente | Impôt du vendeur | Droits d'enregistrement (acheteur, sauf clause contraire) |
|---|---|---|
| Moins de 2 ans d'activité | Plus-value à **court terme** : barème + PS (régime social à valider), soit environ 18 000 € à un TMI de 30 %, hors PS | (60 000 − 23 000) × 3 % = **1 110 €** |
| De 2 à 5 ans | 60 000 € × (12,8 % + 18,6 %) = **18 840 €** | 1 110 € |
| Plus de 5 ans, recettes moyennes ≤ 90 000 € (151 septies) ou valeur ≤ 500 000 € (238 quindecies) | **0 €** (IR et PS) | 1 110 € |

Le passage de la 5e année d'activité représente donc environ **31 % du prix** pour le vendeur.

---

## 3. Points à faire valider par un expert-comptable (et par un avocat pour la cession)

1. **Catégorie BIC ou BNC** du SaaS, et code APE à l'immatriculation (édition de logiciels ou programmation). Faut-il un **rescrit** (art. L80 B LPF) ? Faut-il ventiler une éventuelle activité mixte (sur mesure, conseil) ?
2. **CFP** : 0,1 % ou 0,2 % selon la nature commerciale ou libérale retenue au guichet unique.
3. **Option pour la TVA** (renoncer à la franchise) dès le départ, compte tenu du passage au **réel normal en 2027** et de la facturation électronique (réception au 1/9/2026, émission au 1/9/2027).
4. **Calcul du CA « France »** pour la franchise : ventilation clients FR, UE et hors UE ; preuve de la qualité d'assujetti des clients US (numéro fiscal, adresse) ; traitement des clients sans numéro de TVA (B2C, guichet OSS au-delà de 10 000 €).
5. **Mentions de facture** à partir du 1/1/2027 (numéros d'articles du CIBS pour la franchise, le 259-1 et l'autoliquidation) et obtention d'un **numéro de TVA intracommunautaire**.
6. **Déclaration de la TVA autoliquidée** sur les achats étrangers quand on est en franchise : formulaire et périodicité (3310-A ou CA3).
7. **Versement libératoire** : comparer avec le barème selon le foyer (RFR N-2, nombre de parts), et respecter le délai d'option en création.
8. **ACRE** : éligibilité personnelle et date de création par rapport au 1/7/2026.
9. **Cession** :
   - qualification : cession de fonds ou de clientèle, ou d'actifs isolés ;
   - répartition du prix (clientèle, logiciel, marque, domaine) ;
   - choix entre **151 septies et 238 quindecies** ;
   - calcul de la **date des 5 ans** ;
   - **régime social de la plus-value à court terme** d'un micro-entrepreneur ;
   - taux des PS applicable l'année de la vente ;
   - clause sur les droits d'enregistrement ;
   - **257 bis** si l'acheteur est étranger ou si le vendeur est en franchise ;
   - traitement d'une clause de non-concurrence ou d'une prestation d'accompagnement payée en plus du prix.
10. **CFE** réelle selon la commune, et exonération de la cotisation minimum si le CA est ≤ 5 000 €.
11. **Fiscalité locale des clients US** (*sales tax* sur le SaaS dans certains États) : non couverte ici [H].

**Rappel : ce document n'est pas un conseil fiscal. Faites valider ces points par un expert-comptable avant toute décision.**
