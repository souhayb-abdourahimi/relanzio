# P7 — Cadre juridique et fiscal 2026 d'un micro-SaaS B2B exploité en micro-entreprise, puis revendu

Date : 2026-10-29. Rédaction : expert juridique et fiscal (agent de recherche).
Preuves : `P7-fiscal-preuves.csv` (ids P7F-P01 à P7F-P45).

> **Avertissement.** Ce document est une synthèse documentaire. **Ce n'est pas un conseil juridique ou fiscal.** Plusieurs points sont incertains ou en cours de réforme (voir § 11). Avant de vous immatriculer, de choisir votre catégorie d'activité, d'opter pour le versement libératoire ou de négocier une cession, faites valider votre situation par un **expert-comptable** et, pour la cession et la propriété intellectuelle, par un **avocat**. La qualification BIC ou BNC d'un SaaS peut faire l'objet d'un **rescrit fiscal** (demande écrite à l'administration).

## 0. Méthode et mode d'accès

- WebFetch a été essayé une fois sur service-public.fr. Il a échoué : `getaddrinfo ENOTFOUND www.service-public.fr`, l'hôte n'est pas autorisé dans cette session. **Aucune page n'a donc été lue en entier.** Toutes les règles ci-dessous viennent d'**extraits** renvoyés par WebSearch, filtrés autant que possible sur des domaines officiels : impots.gouv.fr, bofip.impots.gouv.fr, urssaf.fr, autoentrepreneur.urssaf.fr, economie.gouv.fr, legifrance.gouv.fr, conseil-constitutionnel.fr, inpi.fr, culture.gouv.fr (CSPLA), afnic.fr et douane.gouv.fr. Seules deux sources ne sont pas officielles : stripe.com, pour les frais, et des blogs, utilisés une seule fois pour signaler la pratique sur la qualification.
- 38 recherches au total. Toutes les sources ont été consultées le 2026-10-29. La date de publication est indiquée quand l'URL ou l'extrait la donne, par exemple les versions BOFiP `-20260701` et `-20260819`.
- Étiquettes : **[P]** règle confirmée par un extrait officiel ; **[E]** déduction ou calcul à partir de règles sourcées ; **[H]** hypothèse non vérifiée, par exemple un niveau de charges ou de CFE.

---

## 1. Qualification de l'activité SaaS : BIC prestations de services ou BNC ?

**Constat.** Aucune source officielle trouvée (BOFiP, Urssaf, impots.gouv) ne qualifie expressément l'abonnement SaaS. Ce point reste donc incertain.

| Élément | Ce que disent les sources | Étiquette |
|---|---|---|
| Critère Urssaf / economie.gouv | Une activité commerciale ou artisanale relève des **BIC**. Une activité libérale relève des **BNC**. (P7F-P10) | [P] |
| Doctrine BNC sur le logiciel | Le BOFiP classe en **BNC** les produits de cession ou de concession de droits sur des **logiciels originaux par leur auteur personne physique**, y compris les licences d'exploitation, de distribution ou d'utilisation (BOI-BNC-SECT-30-20 ; BOI-BNC-CHAMP-10-10-20-20). Cela vise l'auteur qui cède ou concède des droits, pas un exploitant de plateforme. (P7F-P08) | [P] |
| Doctrine BIC sur les actifs incorporels | Le régime optionnel de l'art. 238 CGI (BIC) couvre les logiciels originaux, **y compris quand l'accès se fait à distance depuis une plateforme d'hébergement** (BOI-BIC-BASE-110-10). (P7F-P08) | [P] |
| Pratique | Les sites spécialisés et les praticiens classent le plus souvent un SaaS **standardisé, vendu à de nombreux clients** en BIC prestations de services. Le développement sur mesure ou le conseil relève plutôt des BNC. Il existe un risque de requalification en cas de contrôle. (P7F-P09 : source non officielle) | [E] |

**Qualification probable [E] : BIC, prestations de services commerciales.** Le service est standardisé, payé par abonnement, accessible en ligne et reproductible. Il ressemble davantage à une exploitation commerciale qu'à une activité intellectuelle personnelle.

**Zone grise.** Si votre chiffre d'affaires vient surtout de développement sur mesure, d'intégration ou de conseil, la qualification BNC devient plausible, au moins pour cette part. Avec deux activités, vous seriez en **activité mixte** : un même plafond global, avec des déclarations distinctes.

**Conséquences du choix (taux 2026, voir § 3 et 4)**

| | BIC prestations de services | BNC (régime général, hors CIPAV) |
|---|---|---|
| Cotisations sociales | **21,2 %** du CA | **25,6 %** du CA |
| CFP | 0,1 % (commerçant) | 0,2 % (libéral) |
| Taxe pour frais de chambre | 0,044 % (CCI, services) | sans objet |
| Abattement fiscal (régime au barème) | **50 %** (minimum 305 €) | **34 %** (minimum 305 €) |
| Versement libératoire | **1,7 %** du CA | **2,2 %** du CA |

Un SaaS ne relève pas de la **CIPAV**, qui est réservée à une liste de professions libérales réglementées [E]. Le taux CIPAV de 23,2 % ne s'applique donc pas.

**Recommandation.** Choisissez la catégorie avec votre expert-comptable lors de l'immatriculation. Si l'enjeu le justifie, demandez un **rescrit**. Avec la qualification BIC, la différence est d'environ 4,5 points de cotisations en votre faveur.

---

## 2. Seuils du régime micro en 2026 et dépassement

- **Prestations de services (BIC ou BNC) : 83 600 € de CA HT pour 2026, 2027 et 2028**, contre 77 700 € pour 2023-2025. Le seuil pour les ventes est de 203 100 €. En activité mixte, le CA global ne doit pas dépasser 203 100 €, dont 83 600 € au plus de services. (P7F-P11, P7F-P12) [P]
- **Divergence** : certaines pages officielles, dont une table BOFiP et une page impots.gouv sur le versement libératoire, affichaient encore 77 700 € à la date de consultation. Les sources Urssaf et la fiche impots.gouv « Pour rester micro-entrepreneur » donnent 83 600 €. **Retenir 83 600 €** et le faire confirmer.
- **Dépassement** : une seule année de dépassement ne fait pas sortir du régime. Le régime micro est perdu au 1er janvier N+1 après **deux années civiles consécutives** de dépassement. (P7F-P12) [P]
- **Année de création** : le seuil micro est ajusté au prorata du temps d'exploitation. Ce point est à confirmer pour votre date de début [E].
- **Seuils indépendants** : les seuils du régime micro ne sont pas liés à ceux de la **franchise de TVA** (§ 5). On peut rester au régime micro tout en devenant redevable de la TVA. (P7F-P11) [P]

---

## 3. Cotisations sociales 2026, CFP, ACRE, taxe pour frais de chambre

| Poste | Taux 2026 | Source |
|---|---|---|
| Cotisations, BIC prestations de services | **21,2 %** | Urssaf (P7F-P13) [P] |
| Cotisations, BNC du régime général | **25,6 %** depuis le 1/1/2026 (24,6 % en 2025) | Urssaf (P7F-P14) [P] |
| Cotisations, CIPAV | 23,2 % (ne s'applique pas à un SaaS) | Urssaf (P7F-P13) [P] |
| CFP | 0,1 % commerçant, 0,2 % libéral, 0,3 % artisan | Urssaf (P7F-P16) [P] |
| Taxe pour frais de CCI (services) | 0,044 %, due à partir de la 2e année, et non due si le CA de l'avant-dernière année est inférieur à 5 000 € | autoentrepreneur.urssaf.fr (P7F-P16) [P] |

- **Divergence BNC.** Le calendrier voté en 2024 prévoyait 26,1 % en 2026. Les pages Urssaf de 2026 indiquent **25,6 %**. Un incident technique a d'ailleurs appliqué à tort 24,6 % du 1er au 3 février 2026. **Retenir 25,6 %.** (P7F-P14)
- **Réforme de l'assiette au 1/1/2026** : le taux global ne change pas, mais sa répartition interne évolue. Moins de CSG-CRDS, plus de retraite complémentaire. (P7F-P15) [P]
- **ACRE (réformée en 2026)** :
  - L'ACRE n'est **plus automatique**. La LFSS 2026 réserve l'aide à certains publics : demandeurs d'emploi sous conditions, bénéficiaires du RSA ou de l'ASS, jeunes de 18 à 25 ans (moins de 30 ans sous conditions), titulaires d'un CAPE, etc. La demande se fait **dans les 60 jours** suivant le début d'activité. L'aide n'est pas accordée si vous en avez bénéficié au cours des 3 années précédentes.
  - **Pour une création à partir du 1/7/2026, le taux réduit vaut 75 % du taux normal**, soit une exonération de 25 %, contre 50 % auparavant. En BIC services, cela donne un taux d'environ **15,9 %** (21,2 × 0,75, calcul [E]). En BNC, l'Urssaf indique 19,2 %. (P7F-P17) [P]
  - L'extrait mentionne aussi des seuils de revenus en % du PASS (36 045 € et 48 060 €). Ils concernent les indépendants **hors micro**. Ne pas les appliquer sans vérification.

---

## 4. Impôt sur le revenu

**Option A : barème progressif (par défaut).** Le revenu imposable est égal au CA moins l'abattement forfaitaire : **50 % en BIC services, 34 % en BNC**, avec un minimum de 305 €. Ce revenu s'ajoute aux autres revenus du foyer. (P7F-P10) [P]

Barème 2026 sur les revenus 2025, fixé par la LF 2026 (loi n° 2026-103 du 19 février 2026, indexation de +0,9 %) (P7F-P19) [P] :

| Tranche de revenu par part | Taux |
|---|---|
| jusqu'à 11 600 € | 0 % |
| de 11 601 € à 29 579 € | 11 % |
| de 29 580 € à 84 577 € | 30 % |
| de 84 578 € à 181 917 € | 41 % |
| au-delà de 181 917 € | 45 % |

Le barème applicable aux revenus 2026 sera fixé par la LF 2027. Il n'est pas connu au 29/10/2026.

**Option B : versement libératoire.**
- Taux : **1,7 % du CA en BIC services, 2,2 % en BNC.** (P7F-P18) [P]
- Condition pour 2026 : **revenu fiscal de référence 2024 ≤ 29 315 € par part**, soit 58 630 € pour 2 parts. Pour 2027, l'Urssaf indique **29 579 € par part** (RFR 2025). (P7F-P18) [P]
- Démarche : demande à l'Urssaf **au plus tard le 30 septembre** de l'année précédente. En cas de création, l'option se fait lors de la déclaration de création ou dans le délai qui suit. Vérifiez ce délai auprès de l'Urssaf.
- Le versement libératoire est intéressant si votre taux marginal d'imposition est de 11 % ou plus. Pour un foyer **non imposable**, il fait payer un impôt qui n'aurait pas été dû [E].

---

## 5. TVA

### 5.1 Franchise en base en 2026 [P]

- **Seuils 2026 (prestations de services) : 37 500 € (seuil de base) et 41 250 € (seuil majoré)**. Pour les ventes : 85 000 € et 93 500 €. Source : BOFiP BOI-TVA-DECLA-40-10-10, version du **1/7/2026**, et fiche DGFiP « régimes réservés aux petites entreprises 2026 ». (P7F-P01, P7F-P02)
- **Règles de sortie depuis 2025** (P7F-P04) :
  - Si le CA de N-1 dépasse 37 500 €, la franchise est perdue au **1er janvier N**, même si ce CA reste sous 41 250 €.
  - Si le CA de l'année en cours dépasse 41 250 €, la TVA est due **dès le jour du dépassement**, et non plus au 1er jour du mois.
  - Il n'existe plus de tolérance de deux ans.
- **État de la réforme** (P7F-P03, P7F-P05, P7F-P06) :
  - La LF 2025 (art. 32) avait abaissé la franchise à un seuil unique de 25 000 € au 1/3/2025. Cette mesure a été suspendue, puis **supprimée par la loi n° 2025-1044 du 3 novembre 2025**, qui maintient les seuils actuels.
  - La fiche DGFiP 2026 précise que les modifications prévues par la LF 2025, **puis par la LF 2026**, ne sont **pas entrées en vigueur**.
  - Le Conseil constitutionnel (décision 2026-901 DC du 19/2/2026) a censuré 7 cavaliers budgétaires. Les extraits ne disent pas si l'un d'eux portait sur la franchise.
- **Recodification** (P7F-P07) : l'ordonnance n° 2025-1247 du 17/12/2025 transfère la TVA du CGI vers le **CIBS** (Code des impositions sur les biens et services). Les sources donnent deux dates d'entrée en vigueur : 1/9/2026, ou **1/1/2027** selon une ordonnance n° 2026-671 du 27/7/2026 citée par le BOFiP (BOI-RES-TVA-000253). La mention de facture « TVA non applicable, art. 293 B du CGI » aura donc un équivalent dans le CIBS. Economie.gouv cite déjà les deux formulations. **Vérifier la référence à porter sur les factures à partir de 2027.**
- **Fin du régime simplifié de TVA au 1/1/2027** (LF 2025) : une entreprise qui sort de la franchise passera au **réel normal**, avec des déclarations mensuelles, ou trimestrielles si la TVA annuelle est inférieure à 4 000 €. (P7F-P20) [P]
- **Franchise européenne** (art. 293 B ter, depuis 2025) : elle permet d'appliquer la franchise dans d'autres États membres si le CA réalisé dans l'UE ne dépasse pas 100 000 €, sur adhésion. (P7F-P24) [P]

### 5.2 Clients professionnels établis dans l'UE (B2B)

- **Lieu d'imposition** : l'État du preneur (art. 259-1° CGI). Le client **autoliquide** la TVA. La facture ne comporte pas de TVA et porte la mention **« Autoliquidation »**. (P7F-P21) [P]
- **Numéro de TVA intracommunautaire** : le micro-entrepreneur en franchise doit en demander un à son SIE pour ces opérations. La facture doit mentionner le numéro du client et le vôtre. Vérifiez le n° du client dans VIES. Point [E] partiellement sourcé : l'obligation d'avoir un numéro pour réaliser des prestations intracommunautaires est indiquée par impots.gouv (P7F-P22), la mention du numéro du client sur la facture n'a pas été vue dans un extrait.
- **DES (déclaration européenne de services)** : obligatoire **dès le premier euro**, au plus tard le 10e jour ouvrable du mois suivant (selon douane.gouv). (P7F-P21) [P]

### 5.3 Clients hors UE

- Pour une prestation B2B, le lieu d'imposition est hors de France (art. 259-1°). L'opération est hors champ de la TVA française [E].
- Vérifiez les règles locales du pays du client. Certains pays imposent les services numériques fournis par des non-résidents [H].

### 5.4 Particuliers établis dans l'UE (B2C, services fournis par voie électronique)

- **Seuil de 10 000 € par an**, apprécié sur l'ensemble des ventes à distance et des services électroniques B2C dans l'UE, pour l'année en cours et l'année précédente :
  - en dessous, la TVA française s'applique, donc la **franchise** s'applique aussi ;
  - au-dessus, la TVA est due **dans le pays du client**, déclarée via le **guichet unique OSS**. La franchise française ne couvre pas ces opérations, sauf adhésion à la franchise européenne. (P7F-P23, P7F-P24) [P]
- Pour un SaaS B2B, ce cas est rare mais possible si vous servez des indépendants qui ne fournissent pas de n° de TVA. **Bloquez ou identifiez les clients sans n° de TVA** dans Stripe Tax ou un outil équivalent [E].

### 5.5 Piège : vos **achats** de services étrangers

- Un micro-entrepreneur en franchise qui achète des prestations à un assujetti d'un **autre État membre** doit **autoliquider, déclarer et payer en France** la TVA sur ces achats, **sans pouvoir la déduire**. (P7F-P25) [P]
- Le même mécanisme est probable pour un prestataire hors UE, via l'art. 283-2 [E].
- Concrètement, l'hébergement, les API d'IA et les outils SaaS facturés depuis l'Irlande, le Luxembourg ou les États-Unis vous coûtent **environ 20 % de plus** tant que vous êtes en franchise. S'ajoute une obligation déclarative (déclaration CA3).
- Si le fournisseur vous traite comme un particulier et facture directement la TVA, le surcoût est le même.
- Cette TVA devient déductible quand vous sortez de la franchise.

### 5.6 Facturation électronique (P7F-P26) [P]

- Les micro-entrepreneurs, même en franchise, **restent assujettis** à la TVA et sont donc concernés.
- **Réception** des factures électroniques au **1/9/2026**, via une plateforme agréée (PA) à choisir.
- **Émission et e-reporting au 1/9/2027.** Le e-reporting est **bimestriel** pour les entreprises en franchise.
- Pour un SaaS : les factures B2B à des clients français devront passer par une PA. Les ventes B2C et internationales relèveront du e-reporting.
- Vérifiez que votre outil de facturation (Stripe Billing ou autre) se connecte à une PA. Ce point n'a pas été vérifié ici.

---

## 6. Absence de déduction des charges réelles : exemple chiffré

**Hypothèses [H] / [E]**
- Année de croisière (année 2 ou plus), BIC prestations de services, sans ACRE, 100 % de clients B2B français, prix moyen de 100 € HT par mois.
- Stripe (source éditeur, P7F-P41, P7F-P42) : 1,5 % + 0,25 € par paiement par carte EEE, plus Stripe Billing à 0,7 %.
- Charges mensuelles :

| MRR | Hébergement | Outils (e-mail, banque pro, nom de domaine, monitoring, comptabilité) | IA (API produit et outil de développement) |
|---|---|---|---|
| 1 000 € | 30 € | 60 € | 150 € |
| 3 000 € | 60 € | 90 € | 250 € |
| 5 000 € | 120 € | 120 € | 350 € |

- Tous ces services sont **achetés à l'étranger** : +20 % de TVA autoliquidée non déductible tant que vous êtes en franchise (§ 5.5).
- CFE : **300 € par an, hypothèse [H]**. Le montant réel dépend de la commune (§ 7).
- Cotisations : 21,2 % + CFP 0,1 % + TFC 0,044 %, soit 21,344 % du CA.

| | **MRR 1 000 €** | **MRR 3 000 €** | **MRR 5 000 €** |
|---|---|---|---|
| CA annuel HT | 12 000 € | 36 000 € | 60 000 € |
| Régime TVA | franchise (CA < 37 500 €) | franchise, mais **à 1 500 € du seuil** | **TVA due** (CA > 41 250 €) |
| Stripe (paiement + Billing) | 294 € | 882 € | 1 470 € |
| Hébergement, outils, IA | 2 880 € | 4 800 € | 7 080 € |
| TVA autoliquidée non déductible | 576 € | 960 € | 0 € (déductible) |
| **Total des charges réelles** | **3 750 € (31 % du CA)** | **6 642 € (18 %)** | **8 550 € (14 %)** |
| Cotisations sociales, CFP et TFC (21,344 %) | 2 561 € | 7 684 € | 12 806 € |
| CFE [H] | 300 € | 300 € | 300 € |
| **Bénéfice économique avant IR** | **5 389 €** | **21 374 €** | **38 344 €** |
| Base IR au barème (CA × 50 %) | 6 000 € | 18 000 € | 30 000 € |
| IR avec versement libératoire (1,7 %) | 204 € | 612 € | 1 020 € |
| IR au barème si TMI à 30 % (marginal, indicatif) | 1 800 € | 5 400 € | 9 000 € |
| **Net après IR (versement libératoire)** | **5 185 € (432 €/mois)** | **20 762 € (1 730 €/mois)** | **37 324 € (3 110 €/mois)** |
| Prélèvements obligatoires / bénéfice économique avant cotisations | 37 % | 29 % | 27 % |
| *Variante BNC : net après versement libératoire (cotisations 25,8 %, VL 2,2 %)* | *4 590 €* | *18 978 €* | *34 350 €* |

**À retenir [E]**

1. **Le CA n'est pas un revenu.** À 1 000 € de MRR, il reste environ 430 € par mois, et les prélèvements absorbent 37 % de la marge réelle. Les cotisations sont dues sur le CA, **même si vous êtes en perte**.
2. **La trésorerie n'est pas un bénéfice.** À 5 000 € de MRR, vous encaissez 72 000 € TTC, mais vous devez reverser environ 10 600 € de TVA nette (12 000 € collectés moins environ 1 400 € déductibles), puis payer les cotisations mensuelles ou trimestrielles. Mettez de côté chaque mois **la TVA collectée et environ 23 % du CA HT** (cotisations et versement libératoire).
3. **Le régime micro reste avantageux tant que vos charges réelles restent sous l'abattement** de 50 % en BIC ou 34 % en BNC. Avec 14 à 31 % de charges, c'est le cas ici. La base imposable au barème (50 % du CA) est même **inférieure** à la marge réelle.
4. **Dépasser 41 250 € de CA (MRR d'environ 3 440 €)** rend la TVA exigible dès le jour du dépassement. Pour des clients B2B qui récupèrent la TVA, l'effet est neutre si vos prix sont affichés **HT**. Affichez donc vos prix en HT dès le premier jour.

---

## 7. CFE, banque, obligations courantes

- **CFE** (P7F-P27) [P] :
  - **Pas de CFE l'année de création.** Déposez la déclaration 1447-C avant le 31/12 de cette année.
  - À partir de la 2e année, la CFE est calculée sur la valeur locative du local utilisé, ou sur une base minimum si vous travaillez à domicile.
  - **Exonération de la cotisation minimum si le CA de la période de référence est ≤ 5 000 €.**
  - Le montant dépend de la commune. Il n'est pas chiffré ici.
  - En cas de cessation en cours d'année, la CFE reste due pour l'année entière. Un dégrèvement au prorata peut être demandé sur réclamation. (P7F-P37)
- **Compte bancaire dédié** (art. L613-10 CSS) : il devient obligatoire après **deux années civiles consécutives avec plus de 10 000 € de CA**. Il peut s'agir d'un compte personnel dédié. La mention « EI » doit y figurer. (P7F-P28) [P]
  - **Recommandation [E] : ouvrez-le dès le premier jour.** Des flux séparés sont nécessaires pour des métriques auditables lors d'une vente.
- **Frais bancaires** : ils ne sont pas déductibles (§ 6). Comptez-les dans la marge réelle.
- **Livre des recettes** : obligatoire pour un micro-entrepreneur, avec conservation des factures. Ce point relève d'une connaissance générale : il n'a pas été revérifié par un extrait dans cette session.

---

## 8. Propriété du code et de la marque

| Sujet | Règle | Étiquette |
|---|---|---|
| Droit d'auteur sur le logiciel | Les logiciels, y compris le matériel de conception préparatoire, sont des œuvres de l'esprit (art. L112-2 13° CPI). La protection naît **sans formalité**, mais l'auteur doit prouver l'**originalité** (Cass. civ. 1re, 14/11/2013). Le code source et le code objet sont protégés. Les algorithmes, les fonctionnalités et les idées ne le sont pas. (P7F-P29) | [P] |
| Preuve de date | **e-Soleau** à l'INPI : les enveloppes papier ne sont plus acceptées depuis le 1/4/2024. Le dépôt prouve la date et l'auteur mais ne crée aucun droit. Archivage de 5 ans, renouvelable une fois. Alternatives : APP, Logitas. (P7F-P29) | [P] |
| Code produit avec l'IA | Rapport du **CSPLA de juillet 2026** : pas de réforme nécessaire. Les productions **« hybrides »**, avec des choix créatifs humains visibles, peuvent être protégées si elles sont originales. Les productions **« synthétiques »**, sans intervention humaine significative, sont **hors du droit d'auteur**. La difficulté principale est la **preuve** de l'apport humain. (P7F-P30) | [P] |
| Conséquence pour la revente | Une part du code généré par IA peut n'être **protégée par aucun droit d'auteur**. Un acheteur achète alors surtout un actif d'exploitation (clients, données, marque, nom de domaine, savoir-faire, contrats), pas un monopole sur le code. **Documentez votre apport humain** : historique Git, spécifications, revues, refactorisations, choix d'architecture. **Vérifiez les conditions de votre fournisseur d'IA** sur la propriété des sorties (non vérifié ici). | [E] |
| Licences open source | **MIT / BSD / Apache-2.0** : vous devez conserver les notices de copyright et de licence. **GPL** : le copyleft se déclenche à la **distribution**. Un usage côté serveur seulement ne le déclenche pas, mais une livraison on-premise, une application mobile ou un SDK distribué le déclencherait. **AGPL** : la clause réseau impose de fournir le **code source de la version modifiée** aux utilisateurs distants. Un composant AGPL **modifié** dans votre SaaS vous oblige à publier ce code. (P7F-P31) | [P] (FSF, code.gouv) |
| Risque pour la revente | Une revue des licences (*due diligence*) révélant de l'AGPL modifié, de la GPL dans un livrable distribué ou l'absence de notices fait baisser le prix, voire bloque la vente. **Dès le premier jour : SBOM et scanner de licences en CI, liste blanche MIT/Apache/BSD.** | [E] |
| Prestataires ou freelances | Sans **contrat écrit de cession de droits** respectant le formalisme de l'art. L131-3 CPI, le prestataire reste titulaire de son code. C'est un point bloquant classique lors d'une vente (connaissance générale, non revérifiée dans cette session). | [E] |
| Marque INPI | **190 € pour une classe, puis 40 € par classe supplémentaire** (dépôt en ligne, tarifs applicables au 2/7/2026). Pour un SaaS, les classes 9 et 42 sont les plus probables (à confirmer). Une page INPI plus ancienne indique 210 € et 42 € : elle semble obsolète. Faites une recherche d'antériorité avant de choisir le nom. (P7F-P32) | [P] |
| Nom de domaine | Un .fr se cède librement à toute personne éligible, via le bureau d'enregistrement (*registrar*), avec le code auth-info : changement de titulaire (« Update »), et de préférence transfert de registrar d'abord. La jurisprudence traite le nom de domaine comme un élément cessible, sous réserve des droits des tiers. (P7F-P33, P7F-P34) | [P] |

---

## 9. Vendre le SaaS quand on est micro-entrepreneur

### 9.1 Nature juridique de la vente

- **Cession de fonds de commerce** (activité BIC) : la **clientèle** en est l'élément essentiel. Il faut que la clientèle passe au cessionnaire. Une branche autonome avec sa propre clientèle peut être cédée seule (Cass. com. 14/4/1992). (P7F-P34) [P]
- Un SaaS cédé avec ses abonnés, son code, sa marque, son nom de domaine et ses contrats est très probablement une **cession de fonds**. En BNC, ce serait une **cession de clientèle** [E].
- **Cession d'éléments isolés** (code seul, nom de domaine seul) : il s'agit alors d'une cession d'actifs incorporels. Elle ne bénéficie ni de la dispense de TVA de l'art. 257 bis ni, en principe, des exonérations « transmission d'entreprise » [E].

### 9.2 Formalités (P7F-P35) [P]

- **Acte écrit** de cession, en pratique rédigé par un avocat, avec un séquestre du prix.
- **Enregistrement** de l'acte au service de l'enregistrement, dans le mois.
- **Publicité** : annonce dans un journal d'annonces légales (JAL), puis au **BODACC**.
- **Oppositions** des créanciers du vendeur dans les **10 jours** suivant la publication au BODACC.
- **Surenchère du sixième** possible dans les 20 jours.
- **Droits d'enregistrement** (art. 719 CGI), à la charge de l'acheteur sauf clause contraire :

| Part du prix | Taux |
|---|---|
| jusqu'à 23 000 € | 0 % |
| de 23 000 € à 200 000 € | 3 % |
| au-delà de 200 000 € | 5 % |

  Perception minimum : 25 €. La page impots.gouv affichant ce barème date de 2016 ; le barème est confirmé par le BOFiP BOI-ENR-DMTOM-10-20-20 (version de 2024).
- Exemple [E] : pour un prix de 100 000 €, les droits sont de (100 000 − 23 000) × 3 % = 2 310 €.

### 9.3 Régime fiscal de la plus-value professionnelle

- **Règles de calcul** : même au régime micro, les plus-values sur les éléments affectés à l'exploitation suivent le **droit commun** (art. 39 duodecies et suivants ; BOI-BIC-DECLA-20, version du 19/8/2026). L'abattement forfaitaire est réputé couvrir l'amortissement linéaire. (P7F-P36) [P]
- **Fonds créé par vous** : prix de revient nul, donc **plus-value égale au prix de vente** [E].
- **Court terme ou long terme** :
  - Élément détenu **moins de 2 ans** : plus-value **à court terme**, imposée au barème (régime social à vérifier).
  - Élément détenu **2 ans ou plus** : plus-value **à long terme**, sauf pour la fraction correspondant aux amortissements réputés pratiqués, qui reste à court terme.
- **Taux de la plus-value à long terme : 12,8 % d'IR + prélèvements sociaux.** La brochure IR 2026 indique CSG 10,6 % + CRDS 0,5 % + prélèvement de solidarité 7,5 %, soit **18,6 %**, donc environ **31,4 %** au total. Déclaration sur la 2042-C-PRO. (P7F-P36, P7F-P38) [P]
  - **À confirmer** : le passage de 17,2 % à 18,6 % (LFSS 2026) s'applique-t-il bien aux plus-values professionnelles ? L'extrait le suggère.
- **Cessation** : imposition **immédiate** (provisoire) du CA et des plus-values, déclarés **dans les 60 jours** sur la 2042-C-PRO. (P7F-P37) [P]

**Exonérations**

| Dispositif | Conditions | Effet |
|---|---|---|
| **Art. 151 septies** (petites entreprises) | Activité exercée depuis **au moins 5 ans**. Recettes moyennes HT des 2 années précédentes **≤ 90 000 € en services** pour une exonération totale, **dégressive jusqu'à 126 000 €** (taux = (126 000 − recettes) / 36 000). | Exonération d'IR. Le BOFiP mentionne aussi l'absence d'intérêt à cumuler « pour l'IR ou pour les prélèvements sociaux », ce qui suggère une exonération des PS : **à confirmer**. (P7F-P39) |
| **Art. 238 quindecies** (transmission d'une entreprise individuelle ou d'une branche complète) | Activité exercée depuis **5 ans**. Valeur des éléments transmis **≤ 500 000 €** pour une exonération totale, **dégressive jusqu'à 1 000 000 €**. Le cédant **ne doit pas contrôler l'acheteur** (plus de 50 % des droits ou direction effective), sinon l'exonération est remise en cause pendant 3 ans. | Exonération d'IR **et des prélèvements sociaux** sur le montant exonéré (BOFiP). Non cumulable avec 151 septies sur le même montant. (P7F-P40) |
| **Art. 151 septies A** (départ à la retraite) | Départ à la retraite dans un délai encadré, activité de 5 ans, etc. | Exonération d'IR seulement : **les prélèvements sociaux restent dus**. (P7F-P39) |
| **Art. 150-0 D ter** (abattement de 500 000 €) | Ne s'applique qu'à la **cession de titres** d'une PME soumise à l'IS par un dirigeant qui part à la retraite. **Non pertinent pour une entreprise individuelle.** La notice 2074-DIR 2026 mentionne le 31/12/2031. | Abattement d'IR seulement, les PS restent dus. (P7F-P45) |

**Conséquence clé [E]**
- Si le SaaS reste sous environ 90 000 € de recettes et que vous le vendez **après 5 ans d'activité**, la plus-value peut être **totalement exonérée d'IR** (151 septies ou 238 quindecies, et prélèvements sociaux selon le dispositif).
- **Une vente avant 5 ans** est taxée à environ **31,4 %** sur la plus-value à long terme. Sur 100 000 €, cela représente environ **31 400 €**, plus le barème sur l'éventuelle part à court terme.
- **La date de début d'activité compte.** Une vente à 4 ans et 11 mois peut coûter environ un tiers du prix.

### 9.4 TVA sur la cession

- **Art. 257 bis** : la transmission d'une universalité totale ou partielle de biens entre redevables est **dispensée de TVA**. Conditions : les éléments transmis doivent permettre une activité économique autonome, et l'acheteur doit poursuivre l'exploitation. Le montant doit figurer sur la déclaration de TVA des deux parties. (P7F-P43) [P]
- Si vous êtes encore en franchise au moment de la cession, aucune TVA n'est facturée de toute façon [E]. Pour un acheteur établi hors de France, l'analyse est à faire au cas par cas [H].

### 9.5 Cessation de la micro-entreprise (P7F-P37) [P]

- **Déclaration de cessation** sur le guichet unique (formalites.entreprises.gouv.fr), **dans les 30 jours**.
- Dernière déclaration de CA à l'Urssaf.
- **2042-C-PRO dans les 60 jours.**
- CFE due pour l'année entière, avec un dégrèvement au prorata possible.
- Si vous étiez redevable de la TVA : dernière déclaration de TVA.
- **Après la vente** : une clause de non-concurrence et un accompagnement de transition rémunéré sont fréquents. Leur traitement fiscal est à vérifier [H].

### 9.6 Passer en société (EURL ou SASU) avant de vendre ?

| | **Rester en entreprise individuelle et vendre le fonds** | **Apporter le fonds à une société, puis vendre les titres** |
|---|---|---|
| Fiscalité de la sortie | Plus-value professionnelle à long terme : environ 31,4 %, ou **exonération** 151 septies / 238 quindecies après 5 ans | Apport : plus-value **reportée** (art. 151 octies, P7F-P44). La cession des titres met fin au report. La plus-value sur titres est soumise au PFU (12,8 % + 18,6 %). **Le 238 quindecies est exclu** pour un apport à sa propre société, puisque le cédant la contrôle. Le 151 septies A peut s'appliquer sous conditions (BOFiP). |
| Formalités de la vente | Acte de cession de fonds, JAL, BODACC, oppositions, droits de 3 % à 5 % | Cession de titres : droits en principe plus faibles (non vérifié ici). Les contrats, le compte Stripe et la marque restent dans la société, donc **pas de transfert à organiser**. |
| Coûts de fonctionnement | Faibles | Comptabilité réelle, IS (taux réduit PME : connaissance non revérifiée), juridique, tenue des comptes |
| Charges sociales | Calculées sur le CA, au forfait | Président de SASU : assimilé salarié si rémunéré, dividendes. Gérant d'EURL : TNS. Simulation nécessaire. |
| Garanties pour l'acheteur | Achat d'actifs, sans reprise du passif. **C'est souvent ce que préfèrent les acheteurs de petits SaaS** [E]. | Reprise du passif, donc garantie d'actif et de passif exigée |

**Avis [E]**

- Pour un micro-SaaS dont la valeur reste **inférieure à environ 500 000 €**, **rester en entreprise individuelle 5 ans puis céder le fonds** est souvent le schéma le plus favorable fiscalement : exonération possible via 238 quindecies ou 151 septies, et formalités maîtrisables.
- Passer en société devient pertinent dans trois cas :
  - les charges réelles dépassent l'abattement ;
  - vous dépassez durablement 83 600 € de CA ;
  - l'acheteur visé exige une cession de titres (par exemple pour reprendre des contrats grands comptes).
- **Changer de structure entre la création et la vente peut faire perdre l'ancienneté de 5 ans ou l'accès au 238 quindecies.** À arbitrer avec un expert-comptable avant tout apport.

---

## 10. Synthèse pratique

### Quand quitter le régime micro ? [E]

1. **Pas à cause de la TVA.** Dépasser 37 500 € ou 41 250 € fait perdre la franchise de TVA, pas le régime micro. Pour une clientèle B2B, c'est presque neutre si les prix sont affichés HT, et vous récupérez la TVA sur vos achats étrangers. Il faut seulement déposer des déclarations : régime réel normal à partir de 2027.
2. **Quand les charges réelles dépassent l'abattement** : 50 % du CA en BIC, 34 % en BNC. Exemples : salaires de freelances, acquisition payante, IA coûteuse. Dans ce cas, le régime réel ou une société deviennent plus avantageux.
3. **Quand le CA approche durablement 83 600 €** (MRR d'environ 7 000 €) : la sortie est obligatoire après deux années de dépassement.
4. **Vers 3 000 € de MRR** (l'objectif du porteur) : **le régime micro est adapté.** Prélèvements d'environ 29 % du bénéfice économique, net d'environ 1 700 € par mois avec le versement libératoire (§ 6). Il n'y a pas de raison fiscale de changer, sauf charges importantes.

### Pièges à anticiper dès le premier jour pour une vente propre [E]

1. **Catégorie d'activité** (BIC ou BNC) choisie avec un expert-comptable, et rescrit si nécessaire.
2. **Date de début d'activité** : c'est le point de départ des 5 ans des art. 151 septies et 238 quindecies. Planifiez la vente **après le 5e anniversaire**.
3. **Prix affichés HT** dans les CGV, pour absorber la sortie de la franchise sans renégocier.
4. **Achats étrangers** : prévoyez 20 % de TVA autoliquidée, demandez un n° de TVA intracommunautaire et déposez les déclarations.
5. **Facturation électronique** : plateforme agréée choisie avant le 1/9/2026 pour la réception, et émission au 1/9/2027.
6. **Propriété intellectuelle propre** :
   - tout le code dans des dépôts à votre nom, avec un historique Git conservé ;
   - e-Soleau des versions clés ;
   - **cession de droits écrite** pour tout contributeur ;
   - SBOM, scanner de licences, pas d'AGPL modifié ;
   - journal de vos apports humains au code produit avec l'IA.
7. **Marque déposée** (190 €), nom de domaine et comptes (Stripe, hébergement, e-mail, fournisseurs d'IA) **à votre nom d'EI**, avec des identifiants transférables. Évitez les comptes personnels mélangés.
8. **CGV et contrats clients cessibles** : clause autorisant la cession du contrat au repreneur. Accord de sous-traitance RGPD transférable.
9. **Compte bancaire dédié** et livre des recettes tenus dès le départ. Métriques Stripe exportables (MRR, churn, cohortes) pour l'audit de l'acheteur.
10. **Épargne mensuelle** : la TVA collectée plus environ 23 % du CA HT, pour les cotisations et l'IR.
11. **ACRE** : vérifiez votre éligibilité, désormais restreinte, et le délai de **60 jours**.

---

## 11. Incertitudes et divergences relevées

| # | Sujet | Divergence ou incertitude | Position retenue |
|---|---|---|---|
| 1 | Qualification d'un SaaS | Aucun texte officiel trouvé. La pratique penche pour les BIC. | BIC probable ; rescrit conseillé |
| 2 | Franchise de TVA | Le seuil unique de 25 000 € (LF 2025) a été supprimé par la loi 2025-1044. La DGFiP indique que les mesures LF 2026 ne sont pas entrées en vigueur. | 37 500 € / 41 250 € |
| 3 | Recodification de la TVA dans le CIBS | 1/9/2026 ou 1/1/2027 selon les sources | Vérifier la mention de facture avant 2027 |
| 4 | Taux BNC 2026 | 26,1 % (calendrier de 2024) ou 25,6 % (Urssaf 2026) | 25,6 % |
| 5 | Seuil micro services | 83 600 € (Urssaf, impots.gouv) ; certaines pages affichent encore 77 700 € | 83 600 € |
| 6 | Prélèvements sociaux sur la plus-value à long terme professionnelle | 18,6 % (brochure IR 2026) ou 17,2 % | 18,6 %, à confirmer |
| 7 | 151 septies et prélèvements sociaux | Exonération des PS suggérée, non explicitement lue | À confirmer |
| 8 | ACRE | Réformée en 2026 (éligibilité, taux de 75 % au 1/7/2026) | Vérifier le cas personnel |
| 9 | Barème IR applicable aux revenus 2026 | Dépend de la LF 2027, non votée | Barème 2026 utilisé à titre indicatif |
| 10 | Montant de la CFE | Dépend de la commune | 300 € par an [H] dans l'exemple |
| 11 | Frais Stripe | 1,5 % + 0,25 € (page tarifs) ou 1,4 % + 0,25 € (page d'aide FR) | 1,5 % retenu, par prudence |

**Rappel : ce document n'est pas un conseil juridique ou fiscal. Faites-le valider par un expert-comptable, et par un avocat pour la cession et la propriété intellectuelle.**
