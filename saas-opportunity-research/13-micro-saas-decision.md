# 13 — Décision stratégique micro-SaaS : Solo → Bootstrap → Rentabilité → Cession

Date : 2026-10-29 (nuit). Ce document remplace la décision du fichier `12-audit-critique.md` : l'objectif a changé. Il ne s'agit plus d'une grande entreprise, mais d'un **actif numérique rentable, exploité seul et revendable**.

Tout ce qui suit est issu de recherches par extraits de moteur. Aucune page n'a pu être ouverte : WebFetch est bloqué par le réseau de la session. **Aucun entretien et aucun paiement réels n'ont été observés.** Aucune simulation d'acheteur n'a été utilisée.

Étiquettes : **[P]** preuve sourcée, **[E]** estimation, **[H]** hypothèse non vérifiée.

---

## RECOMMANDATION FINALE UNIQUE

### Ne développer aucun SaaS maintenant. Faire un sprint de vente de 30 jours, sans code, avec une offre payante déjà rédigée, sur le segment où vous connaissez personnellement au moins 15 décideurs. Coder seulement après au moins 3 paiements réels.

**Pourquoi** :
1. **Aucune piste ne se détache.** Après étude approfondie, les trois finalistes obtiennent 48,5 / 49,5 / 50 sur 100. Écart < 2 points, pour une marge d'erreur de ± 5. Chaque approfondissement a fait baisser la note de 8,7 points en moyenne.
2. **Le même risque mortel commun** : vous n'avez encore jamais encaissé un client, y compris avec Relanzio, produit construit. Pour un fondateur solo sans équipe commerciale, c'est la compétence qui décide de tout, et aucune recherche documentaire ne la mesure.
3. **Un réseau personnel est le canal qui donne la plus forte probabilité de 3 paiements en 30 jours** : environ 30 % [H] avec au moins 15 décideurs dans un segment, contre 5 à 10 % [H] à froid. C'est aussi le moins coûteux : moins de 100 €, 30 à 40 h.
4. **Il produit l'information qui manque** pour choisir entre les pistes. Une 8e phase documentaire ne la produirait pas. Phase 7 a ajouté environ 170 recherches et aucun paiement.

**Règle de décision, à appliquer telle quelle** (J0, 2 h, avant tout envoi). Écrivez :
- (i) vos contacts décideurs B2B qui vous connaissent personnellement, classés par segment ;
- (ii) le budget que vous pouvez perdre en totalité.

| Situation à J0 | Action |
|---|---|
| Un segment ≥ 15 contacts | Sprint sur ce segment avec l'offre correspondante (§6) |
| Plusieurs segments ≥ 15 | Le plus fourni. En cas d'égalité, celui qui demande le moins d'heures à 3 000 € de MRR : N04 (9,6 h/sem) < agences (10,0) < C-39 (11,8) < N06 (13,9) |
| Aucun segment ≥ 15 **et** budget perdable ≥ 40 k€ | **Acheter** un micro-SaaS B2B existant d'environ 1 000 € de MRR, selon le protocole du §9 |
| Aucun segment ≥ 15 **et** budget < 40 k€ | Sprint de découverte : 15 contacts toutes catégories, une question (« quelle tâche récurrente payez-vous déjà, ou faites-vous à la main chaque mois ? »), puis vente d'un service manuel à ≥ 149 € sur le problème le plus cité |

**Seuils à J30** (un « oui » oral ne compte jamais) :
- **GO** (MVP limité à ce qui a été payé, 6 semaines maximum), si **tout** est réuni :
  - ≥ 3 paiements d'au moins 149 € (ou 3 mois prépayés à ≥ 59 €), de tiers distincts hors famille ;
  - dont ≥ 1 payeur hors du premier cercle ;
  - un canal d'acquisition **transférable** nommé (marketplace, liste publique, mot-clé SEO à volume vérifié) ;
  - une projection ≤ 10 h/semaine à 3 000 € de MRR.
- **1 ou 2 paiements** : un seul cycle supplémentaire de 30 jours, à froid ; STOP si le total reste < 3.
- **0 paiement** : arrêt de la création d'un SaaS à partir de zéro, et pas de reprise de la recherche documentaire. Passage à l'achat si le budget perdable est ≥ 40 k€ ; sinon, objectif suspendu.

**Sur E-13 / Relanzio (artisans à 24 €)** : **ne pas le relancer.**
- Il est le moins cher à tester, mais son attractivité à la revente est nulle dans la simulation : à 6 % de churn mensuel, remplacer les clients perdus coûte plus que le bénéfice.
- À 3 000 € de MRR, il faudrait environ 43,6 h/semaine en comptant l'acquisition.
- Le code garde une valeur d'apprentissage, pas de valeur d'actif.

---

## 1. Nouveau TOP 10 (grille v3 sur 100)

Grille : problème 15, acquisition 20, solo 15, rentabilité 15, rétention 10, revente 15, différenciation 5, risques 5.
Sources : `_work/P7-rescreen-scores.csv` (27 pistes notées) et les études approfondies `_work/P7-DD-*.md`.
**Les notes non approfondies ne sont pas comparables** aux notes approfondies : décote moyenne observée de −8,7 points.

| Rang | Piste | Note rescreen | Note après étude ou décote | Prix plausible | Clients pour 3 k€ de MRR | Canal principal | Statut |
|---|---|---|---|---|---|---|---|
| 1 | **C-39** : calendrier et préparation des dépôts FCC pour petits revendeurs VoIP US | 57,5 | **50,0** (étude) | 79 $/mois | 38 | E-mail ciblé sur la base publique RMD | Finaliste ; clone de RMD Keeper (39-399 $) |
| 2 | **P7-N04** : application Jira de justification du temps R&D (CIR/CII, puis SR&ED) | 54,5 | **49,5** (étude) | 49 €/mois | 62 | Atlassian Marketplace + SEO | Finaliste ; demande faible (≈ 100 installations cumulées pour les apps gratuites de la catégorie) |
| 3 | **P7-N06** : rapprochement des reversements des marketplaces FR vers Pennylane/FEC | 62,0 | **48,5** (étude) | 59 €/mois | 51 | Marketplace Pennylane + cabinets | Finaliste ; Order Invoicer, Synchron.io (150-350 €/mois), Acomim en place |
| 4 | E-39 : suivi des reconductions tacites des contrats fournisseurs | 54,0 | ~45 (décote) | 49 €/mois | 62 | SEO | Réserve ; tableur et agenda suffisent |
| 5 | B-04 : pay applications AIA + lien waivers, sous-traitants US | 54,0 | ~45 (décote) | 99 $/mois | 33 | SEO | Réserve ; Siteline, Knowify ; formats propres à chaque donneur d'ordre |
| 6 | P7-N03 : relance des pièces justificatives pour cabinets hors Pennylane (moteur Relanzio) | 53,0 | ~44 (décote) | 99 €/mois | 31 | Annuaire de l'Ordre | Réserve ; Pennylane, Tiime, Dext collectent déjà |
| 7 | C-01 : CBAM multi-clients pour représentants en douane | 53,0 | ~44 (décote) | 149 €/mois | 21 | SEO, annuaires | Pénalisé : réglementation mouvante (seuil 50 t) |
| 8 | P7-N05 : application Shopify de factures Factur-X pour marchands FR | 52,0 | ~43 (décote) | 15 €/mois | 200 | Shopify App Store | Pénalisé : prix bas (Sufio dès 7 $) |
| 9 | E-13-AG : Relanzio repositionné pour agences et prestataires B2B | 51,5 | ~42 (décote ; red team : 38-46) | 59 €/mois | 51 | Prospection directe | Fonction incluse dans Yousign (dès 9 €), PandaDoc, Qwilr, Axonaut, Sellsy |
| 10 | E-21 : contrats d'influence conformes pour agences FR | 51,5 | ~43 (décote) | 29 €/mois | 104 | Communautés | Pénalisé : modèles gratuits, Infloxy 19 $ |
| hors classement | E-13 actuel (Relanzio, artisans à 24 €) | 41,0 | **valeur de revente 0** (simulation) | 24 € | 125 | Vente directe | Gel |
| alternative stratégique | **Acheter** un micro-SaaS B2B d'environ 1 000 € de MRR | — | — | 33-45 k€ tout compris | — | — | Seulement avec un budget perdable ≥ 40 k€ (§9) |

## 2. Étude approfondie des 3 meilleures (synthèse ; détails dans `_work/P7-DD-C39.md`, `P7-DD-N04.md`, `P7-DD-N06.md`)

| | C-39 FCC VoIP US | N04 Jira R&D | N06 reversements marketplaces |
|---|---|---|---|
| Acheteur | Petit revendeur ou opérateur VoIP US, dirigeant qui certifie | Startup/PME tech sur Jira qui déclare le CIR (29 720 déclarants CIR [P]) | Vendeur multi-marketplaces FR et son expert-comptable |
| Douleur prouvée | Amendes réelles : 10 000 $ par donnée fausse (règle de 2026), environ 57 000 $ pour un mauvais classement au 499 [P] | La jurisprudence refuse les temps imprécis [P] | Dépense réelle dans la catégorie : Synchron.io 150-350 €/mois, Order Invoicer 59-299 € [P] |
| Ce qui l'affaiblit | RMD Keeper vend le même produit à 39-399 $ ; la dépense va aux services faits pour vous (Performance West 1 499 $/an) ; aucun dépôt n'est automatisable (pas d'API USAC, certification par le dirigeant) ; risque d'exercice illégal du droit sur le 499-A [P] | Apps gratuites de la catégorie à 34 et environ 63 installations [P] ; Tempo (environ 26 000 installations) et cabinets au succès ; la valeur est dans la fiche par opération, faite par des humains ; saison mars-mai | Order Invoicer couvre déjà ManoMano, Cdiscount, Fnac et Amazon vers Pennylane [P] ; Cdiscount passe par Octopia et ManoMano par sa propre API, soit 3 familles de connecteurs [P] ; Excel suffit sous 500 commandes/mois (avis d'un cabinet) [P] |
| Preuve d'accès | Base RMD publique, téléchargeable, avec un e-mail par société [P] | Marketplace Atlassian : commission de 0 % jusqu'à 1 M$ cumulés sur Forge [P] | API vendeur Mirakl (TL02, IV01) avec clé générée par le vendeur [P] |
| Test sans code | Contrôle RMD + CPNI à 149 $ | Tableau des temps CIR depuis Jira à 490 € (mesure un service, pas l'app) | Service de rapprochement à 149 € par dossier |
| Probabilité de ≥ 3 paiements en 30 j [H] | 5 % | 10 % (25 % avec ≥ 10 startups CIR dans le réseau) | 10 % (25 % avec ≥ 3 experts-comptables e-commerce dans le réseau) |

## 3. Simulation financière
Fichier `P7-simulations-financieres.md`, généré par `_work/micro_saas_sim.py` depuis `_work/P7-sim-config.json`.

**Hypothèses** :
- micro-entreprise BIC prestations de services en 2026 : cotisations 21,2 % + CFP et TFC 0,144 % + versement libératoire 1,7 % du CA [P extraits officiels, à valider par un expert-comptable] ;
- opérateur de remplacement à 35 €/h [E] ;
- multiples de 1,5×, 2,5× et 3,5× le SDE annuel net du coût de remplacement du churn [P historiques, non garantis].

| À 3 000 € de MRR | N06 | C-39 | N04 | E-13-AG | E-13 actuel |
|---|---|---|---|---|---|
| Clients | 51 | 38 | 62 | 51 | 125 |
| Charges réelles/mois (paiement, variables, fixes) | 301 € | 581 € | 183 € | 189 € | 199 € |
| Cotisations + IR libératoire/mois | 693 € | 692 € | 700 € | 693 € | 691 € |
| **Net fondateur/mois** (trésorerie disponible) | **2 015 €** | **1 730 €** | **2 155 €** | **2 127 €** | 2 110 € |
| Heures/mois, exploitation seule | 47 | 38 | 29 | 23 | 39 |
| + heures d'acquisition pour remplacer le churn (red team 3) | +13 | +13 | +12 | +20 | +150 |
| **Heures/semaine au total** | **13,9** | **11,8** | **9,6** | **10,0** | **43,6** |
| Bénéfice ajusté/mois (opérateur payé, churn remplacé) | 618 € | 633 € | 1 420 € | 1 291 € | −3 822 € |
| Valorisation pess. / centrale / fav. (simulation) | 40 / 67 / 94 k€ | 35 / 59 / 82 k€ | 44 / 73 / 102 k€ | 38 / 63 / 88 k€ | 0 |
| Lecture red team (acheteurs restreints, petits actifs) | 40-55 k€ | 30-45 k€ | ≤ 40 k€ | 30-45 k€ | 0 |

**À retenir** :
- **3 000 € de MRR ≈ 1 700 à 2 150 € nets par mois** en micro-entreprise. Les prélèvements font environ 23 % du CA ; les charges réelles, 6 à 19 %.
- **« Quelques heures par semaine » n'est atteint par aucune option.** La promesse honnête est : **3 000 € de MRR pour environ 10 h par semaine**, acquisition comprise.
- **CA, trésorerie et bénéfice diffèrent** :
  - les cotisations sont dues sur le CA même en perte ;
  - la TVA autoliquidée sur les outils étrangers n'est pas déductible en franchise ;
  - au-delà de 37 500 € de CA (≈ 3 125 € de MRR), la franchise est perdue. C'est neutre en B2B si les prix sont affichés HT ;
  - mettez de côté environ 23 % du CA chaque mois (`_work/P7-fiscal.md` §6).
- **Le micro-régime reste adapté jusqu'à environ 7 000 € de MRR** (seuil de 83 600 €), tant que les charges réelles restent sous l'abattement de 50 %.

## 4. Attractivité pour un futur acheteur (synthèse de `_work/P7-cession.md`)

**Multiples constatés** (pas des prix garantis) :

| MRR | Multiple | Exemple |
|---|---|---|
| < 1 k$ | 1,5-2,5× le bénéfice | — |
| 1-5 k$ | 2-4× | médiane Acquire 3,9× ; Flippa H1 2026 : 2,47× en moyenne |

- Churn moyen des SaaS vendus sur Flippa : 5,43 %/mois [P].
- **Seuil pratique de vente** : environ 2 000 à 2 500 € de bénéfice mensuel régulier sur 12 mois. Dotmarket, la principale plateforme française, refuse en dessous de 2 000 € de profit mensuel [P].

**Ce qui fait la valeur** :
1. un bénéfice vérifiable dans Stripe et sur le relevé bancaire ;
2. un churn ≤ 3 % et des abonnements annuels ;
3. moins de 5 h/semaine d'exploitation, documentées ;
4. aucune concentration client ;
5. pas de plateforme hôte capable de copier la fonction.

| Piste | Acheteurs probables | Ce qui fait baisser le prix |
|---|---|---|
| C-39 | Cabinets et consultants télécom US, RMD Keeper | Responsabilité réglementaire, support à l'heure US, clientèle restreinte |
| N04 | Éditeurs d'apps Atlassian (Appfire, Tempo rachètent des apps [P]) ; transfert d'app documenté par Atlassian [P] | Faible traction de la catégorie ; saisonnalité ; dépendance à Atlassian (Forge) |
| N06 | Concurrents FR (Order Invoicer, Synchron.io), éditeurs comptables, A2X | Savoir comptable lié au fondateur ; 3 familles d'API à maintenir |
| E-13-AG | Peu d'acheteurs : fonction banalisée | Churn « je l'ai trouvé dans Yousign » |

**Transfert concret** :
- code et propriété intellectuelle (dépôts à votre nom, e-Soleau, aucun AGPL, journal des apports humains au code produit avec l'IA) ;
- domaine et marque INPI (190 €) ;
- **Stripe** : on copie les clients et les cartes, mais les abonnements doivent être recréés, ce qui est le moment de churn le plus risqué [P] ;
- CGV avec clause de cession ;
- DPA RGPD transférable ;
- comptes d'hébergement et d'API au nom de l'entreprise, jamais personnels ;
- runbook de support ;
- tableau de bord MRR et churn exportable.

## 5. Difficultés concrètes de développement et de maintenance

| Piste | Ce qui casse | Charge |
|---|---|---|
| C-39 | Calendrier FCC qui évolue (règles 2026, projet de juillet 2026) ; aucune API de dépôt ; formulaires à mettre à jour chaque année | Pic février-avril ; veille réglementaire permanente |
| N04 | Migration Forge (fin de Connect) ; exigences Cloud Fortified ; doctrine CIR (BOFiP) | Faible hors saison ; pic mars-mai |
| N06 | Trois API vendeur (Mirakl, Octopia, ManoMano) plus Amazon SP-API ; questions comptables (« pourquoi 3,12 € ? ») | La plus lourde : environ 60 h/mois au total |
| Toutes | Délivrabilité des e-mails, Stripe, mises à jour de sécurité | 5 à 10 h/mois incompressibles [E] |

## 6. Plan pour atteindre les premiers revenus
Offres prêtes à vendre pendant le sprint : une page, un lien de paiement Stripe, livraison **manuelle**.

| Segment de votre réseau | Offre | Prix |
|---|---|---|
| Agences / prestataires B2B | Relance des propositions faite pour vous | 3 mois prépayés à 59 €/mois |
| Vendeurs e-commerce / experts-comptables | Rapprochement des reversements marketplaces → Pennylane/FEC | 149 € par dossier |
| Startups tech CIR | Tableau des temps CIR depuis Jira | 490 € |
| Opérateurs télécom US | Contrôle RMD + CPNI | 149 $ |
| Autre | Service manuel sur la tâche récurrente la plus citée | ≥ 149 € |

**Contact légal** :
- France : prospection B2B par e-mail autorisée en opt-out si le message concerne la profession du destinataire, avec l'identité de l'expéditeur et un lien de désinscription (règles CNIL) ;
- États-Unis : CAN-SPAM (adresse postale, désinscription) ;
- le contact personnel par le réseau reste le premier canal.
- **Aucun message n'est envoyé sans votre accord.**

## 7. Scénario de revente réaliste
1. **Mois 0-1** : sprint ; GO seulement sur paiements.
2. **Mois 2-4** : MVP limité à ce qui a été payé ; 10 premiers clients.
3. **Mois 5-24** : croissance vers 3 000 € de MRR **si** le canal transférable fonctionne. C'est l'incertitude principale ; aucune donnée observée.
4. **12 mois de MRR stable** au moins, comptabilité et métriques propres, ≤ 10 h/semaine documentées.
5. **Vente** : 2 à 4 mois de processus, séquestre, accompagnement de 30 jours ou plus, souvent un paiement échelonné ou un earn-out.

**Prix réaliste** : 30 à 55 k€ pour 3 000 € de MRR (lecture prudente), jusqu'à environ 70 k€ dans le scénario central de la simulation. Aucun prix n'est garanti.

**Fiscalité** :
- plus-value professionnelle à long terme d'environ 31,4 % (12,8 % + prélèvements sociaux), sauf exonération après **5 ans d'activité** (art. 151 septies ou 238 quindecies, seuils à vérifier) ;
- droits d'enregistrement de 3 % au-delà de 23 000 €, généralement payés par l'acheteur [P extraits, à valider].

**Lecture honnête** : le prix de vente ≈ **1,5 à 2,5 ans de net fondateur**. **La valeur de l'actif est d'abord son revenu d'exploitation ; la cession est un bonus, pas le cœur du rendement.** Une vente avant 5 ans perd environ un tiers de la plus-value en impôts.

## 8. Ce qui ferait changer le classement ou la recommandation
1. **Budget perdable ≥ 40 k€ et réseau < 15 contacts** dans un segment → achat (§9).
2. **Vous refusez toute prise de contact personnelle** → aucune option à construire n'est viable : achat si le budget le permet, sinon arrêt.
3. **≥ 3 paiements déjà obtenus** sur une offre, ou une liste d'attente payante existante → GO direct sur cette offre.
4. **Un fait nouveau invalide une offre avant J0** → l'offre est retirée, sans nouvelle recherche. Exemples :
   - Order Invoicer ajoute Leroy Merlin ou Boulanger ;
   - RMD Keeper ajoute le 499 ;
   - HubSpot ouvre les rappels de devis à l'offre Starter.
5. **Réseau** : ≥ 3 experts-comptables e-commerce → N06 monte ; ≥ 10 startups CIR → N04 monte ; ≥ 20 dirigeants d'agences → E-13-AG redevient testable.
6. Une donnée de dépense réelle pour une app N04 (installations payantes, avis) ferait monter N04, qui a la meilleure rentabilité horaire (9,6 h/semaine, 75 €/h).

## 9. Alternative : acheter plutôt que construire (`_work/redteam3.md` §2.5)
- **Coût pour environ 1 000 € de MRR B2B : 33 à 45 k€ tout compris** : prix de 2,5 à 3× le SDE, frais, séquestre, revue juridique, réserve, plus jusqu'à environ 6 k€ de TVA non déductible si le vendeur est étranger [H].
- Prix non déductible en micro-entreprise.
- Retour à MRR constant : 4 à 6 ans.
- Risque principal : **un actif qui fond**. Avec 5,43 % de churn moyen, environ la moitié du MRR est perdue en un an sans acquisition.
- **N'est pertinent que si vous savez déjà acquérir des clients**, c'est-à-dire la même compétence que pour construire.
- **Protocole** :
  - B2B, ≥ 1 000 € de MRR, churn ≤ 3 % sur 12 mois, ≥ 50 % d'acquisition organique documentée ;
  - accès en lecture à Stripe et au relevé bancaire ;
  - séquestre et 30 jours d'accompagnement ;
  - revue juridique et fiscale ;
  - prix ≤ 3× le SDE.
- **Seuils de budget** : < 15 k€ non ; 15 à 40 k€ non recommandé ; ≥ 40 k€ perdables, envisageable.

## 10. Plan de validation sur 30 jours (avant tout développement)

| Jours | Action | Mesure | Seuil |
|---|---|---|---|
| J0-J2 | Inventaire du réseau et du budget perdable ; application de la règle ; offre d'une page + lien de paiement Stripe | Contacts par segment | Règle de la recommandation finale |
| J3-J10 | ≤ 15 messages personnels par jour, ≥ 15 conversations. Questions sur le comportement passé : la dernière fois, combien de temps, combien payé, quel outil essayé. **Demande de paiement à la fin de chaque conversation qualifiée** | Conversations ; paiements | — |
| J11-J20 | Livraison **manuelle** aux payeurs ; demande d'une introduction à un pair ; 30 contacts froids sur le canal transférable visé | Taux de réponse à froid ; heures de livraison | — |
| J21-J30 | Livraison, mesure, décision | Paiements, heures/client, taux de réponse | GO / un cycle de plus / STOP (seuils de la recommandation finale) |

- **Budget** : ≤ 100 €, 30 à 40 h.
- **Aucune ligne de code avant la décision.**
- **Ce qui justifie le développement** : ≥ 3 paiements, dont 1 hors du premier cercle, un canal transférable et une projection ≤ 10 h/semaine.
- **Ce qui oblige à abandonner** : 0 paiement à J30, ou < 3 paiements après un second cycle.

---

## Journal des corrections de la phase 7
| # | Point | Correction |
|---|---|---|
| P7-C1 | Décision du fichier 12 (« rechercher une autre opportunité, plusieurs années ») | Remplacée : l'objectif est désormais un micro-SaaS solo revendable. La méthode « terrain d'abord » est conservée et précisée |
| P7-C2 | Simulation : les heures n'incluaient pas l'acquisition de remplacement | Corrigé dans ce document (§3, ligne « heures d'acquisition »), sur le constat de la red team 3 |
| P7-C3 | Valorisations centrales de la simulation (59-73 k€) | À lire comme des **plafonds** : acheteurs restreints et seuil de 2 000 €/mois des plateformes françaises |
| P7-C4 | E-13-AG (51,5) présentée comme meilleure note | Non comparable (non approfondie) ; décotée vers 38-46 |
| P7-C5 | « HubSpot a les rappels de devis natifs » | Nuancé : apparemment Professional et Enterprise seulement ; ne change pas la conclusion |
| P7-C6 | Seuils GO des études N06, N04 et C-39 | Jugés intenables ou mal ciblés par la red team ; remplacés par les seuils communs de la recommandation finale |
| P7-C7 | Réutilisation de la pile Relanzio comme argument | Retirée de toute pondération (biais d'engagement) |

## Fichiers de la phase 7
- `_work/brief-phase7.md`, `_work/brief-phase7-dd.md` : briefs
- `_work/P7-rescreen.md`, `_work/P7-rescreen-scores.csv` : 27 pistes notées sur la grille v3
- `_work/P7-DD-C39.md`, `_work/P7-DD-N04.md`, `_work/P7-DD-N06.md` : études approfondies
- `_work/P7-cession.md` : transactions et multiples
- `_work/P7-fiscal.md` : règles micro-entrepreneur 2026, cession
- `_work/redteam3.md` : contradicteur final
- `P7-simulations-financieres.md` + `_work/micro_saas_sim.py` + `_work/P7-sim-config.json` : simulations reproductibles
- `06-registre-preuves.csv` : registre mis à jour (preuves P7 incluses)
