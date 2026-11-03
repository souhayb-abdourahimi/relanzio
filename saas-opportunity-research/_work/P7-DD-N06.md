# P7-DD-N06 — Rapprochement des reversements des marketplaces françaises vers la comptabilité

Date : 2026-10-29. Finaliste **P7-N06** (62,0 au rescreen). Preuves : `P7-DD-N06-preuves.csv` (P7DN06-P01 à P50).
Étiquettes : **[P]** preuve sourcée, **[E]** estimation raisonnée, **[H]** hypothèse non vérifiée.

## 0. Méthode, limites et verdict court

- **45 recherches WebSearch** et 1 tentative WebFetch (`go.sellsy.com` non résolu, comme prévu par le brief) : tout vient des **extraits** de résultats, aucune page n'a été lue en entier.
- **≈ 30 recherches sur 45 (≈ 67 %) visaient l'invalidation.** Elles portaient sur :
  - les connecteurs existants, cherchés par leur nom : Sellsy, Pennylane et Pennylane Connect, A2X, Link My Books, Order Invoicer, Synchron.io, Acomim, Qashflo, Boostmyshop, Lengow, Shopping Feed, Beezup, Tiime, Indy, Axonaut, Jeen et ECOSIRE ;
  - les conditions d'accès aux API : Octopia, ManoMano, Mirakl et Amazon ;
  - les cabinets comptables.
- Une coupure de quota a interrompu la recherche une fois. Deux recherches ont échoué puis ont été relancées.
- **Non trouvé**, ce qui n'est pas une preuve d'absence :
  - aucun nombre de clients chez aucun concurrent ;
  - aucun prix pour Acomim ni pour l'application Sellsy ;
  - aucune information sur « Jeen » ;
  - aucun nombre de vendeurs pour Fnac Darty, Boulanger et Carrefour ;
  - aucun point d'accès « relevé de paiement » dans l'API Octopia (Cdiscount) ni dans l'API ManoMano.

**Verdict court.** La piste **recule de 62,0 à 48,5/100** (§8). Elle ne doit pas être codée en l'état. Trois découvertes la font reculer :
1. **Le segment n'est pas vide.** **Order Invoicer** (P04-P10) couvre déjà ManoMano, Cdiscount, Fnac et Amazon vers Pennylane, avec rapprochement des versements, pour 0 à 299 €/mois. Il est référencé dans le catalogue **Pennylane Connect** (P09). S'y ajoutent :
   - **Synchron.io**, de Mirakl vers Pennylane pour 150 à 350 €/mois (P02, P03) ;
   - **Acomim**, d'Amazon et Cdiscount vers Pennylane ou Abby (P11) ;
   - **Qashflo** (P12) et l'application Mirakl de Sellsy (P01).
2. **Le cadrage « Mirakl » est faux pour les deux plus grosses marketplaces françaises hors Amazon.** Cdiscount passe par l'API **Octopia** (P28-P30). ManoMano a sa propre API, à clé Toolbox (P31) ; qu'elle ne repose pas sur Mirakl est une hypothèse [H]. Il faudrait donc construire 3 familles de connecteurs plus Amazon, et non un seul connecteur Mirakl.
3. **La douleur et la dépense en France restent peu observées.**
   - Les concurrents montrent une traction publique faible : 2 avis Shopify pour Order Invoicer (P10).
   - Un cabinet juge Excel suffisant sous 500 commandes par mois (P13).
   - Les témoignages viennent de cabinets qui vendent le service (P14, P15).

---

## 1. Problème et acheteur

### ICP
- **Acheteur principal [E].** Une société française (SAS, SARL ou EURL) qui vend sur **au moins deux marketplaces françaises** : Cdiscount, ManoMano, Fnac/Darty, Leroy Merlin, Boulanger ou Carrefour, avec Amazon.fr souvent en plus.
  - Volume : **plus de 300 à 500 commandes par mois** au total. C'est le seuil où Excel cesse de suffire selon HR Associés (P13).
  - Elle tient sa comptabilité, ou la fait tenir, dans Pennylane, sinon par un FEC importé chez le cabinet.
- **Prescripteur ou acheteur secondaire [E].** Le cabinet comptable qui suit 10 à 100 dossiers e-commerce. Le rapprochement des versements y est du temps non facturable ou mal facturé.

### Volume d'acheteurs

| Marketplace | Vendeurs | Source |
|---|---|---|
| Cdiscount (Octopia) | ≈ 10 000 actifs revendiqués ; 13 000-14 000 dans des sources plus anciennes | [P] P35 (attribution faible) |
| ManoMano | 5 000+ marchands actifs, tous pays | [P] P36 |
| Leroy Merlin FR | 900+ actifs (non daté) | [P] P37 (faible) |
| Fnac/Darty, Boulanger, Carrefour | inconnu | — |
| Amazon (PME françaises) | 16 000+ (2024) | [P] P38 (faible) |

Ces bases se recoupent fortement, et une part des vendeurs Cdiscount et ManoMano est étrangère [H].

**Estimation [E] :**
- ≈ 15 000 à 20 000 vendeurs français uniques sur ces places ;
- dont 15 à 25 % multi-marketplaces au-dessus de 300 commandes par mois ;
- soit **≈ 2 000 à 5 000 comptes cibles**, et quelques centaines de cabinets ayant au moins 5 dossiers de ce type [H].

Il suffit d'environ 50 clients (§5), soit 1 à 2,5 % de la cible. Le marché n'est donc pas le facteur limitant ; l'acquisition et la concurrence le sont.

### Workflow actuel [E, appuyé sur P13-P15, P27, P40]
1. Chaque marketplace verse un **net** : ventes, moins commissions, frais de paiement, retours et réserves.
   - Le rythme varie : Mirakl par défaut les 1er, 11 et 21 du mois (P27) ; Fnac tous les 15 jours, ou 30 jours en cas de réclamations (P40) ; Cdiscount selon son propre calendrier.
2. Le vendeur ou le cabinet télécharge les relevés et factures de commission de chaque back-office, en CSV ou PDF.
3. Il ventile ensuite dans Excel : CA brut, TVA, commission, frais et remboursements.
4. Il passe l'écriture dans un compte d'attente par marketplace (méthode 512220 de Hayot, P15), puis rapproche ce compte du virement bancaire.
5. **Fréquence** : à chaque versement (3 à 4 par mois et par marketplace), avec contrôle à la clôture mensuelle.

### Coût de l'inaction
- Erreurs de CA et de TVA. Un cas d'audit cité par un cabinet : **42 k€ de CA sous-déclarés sur 12 mois** pour 590 k€ de ventes (P14) [P, faible : cas commercial non vérifiable].
- Temps comptable. Le chiffre de « 14 h/mois selon la Fevad » (P46) est **introuvable** à la source et n'est donc pas retenu.
- Estimation sans source [H] : 2 à 8 h par mois et par vendeur multi-marketplaces.

### Preuves de dépense actuelle
| Indice | Ce qu'il prouve | Source |
|---|---|---|
| Synchron.io de 150 à 350 €/mois, de Mirakl vers Pennylane | Une offre payante existe ; le nombre de clients est inconnu | P02, P03 [P] |
| Order Invoicer : Launch à 59 €, Growth à 149 €, Pro à 299 € | Une grille payante existe ; traction publique faible (2 avis Shopify, rang ≈ 4 933) | P04, P07, P10 [P] |
| Qashflo de 79 à 299 €/mois | Payé d'abord pour l'avance de trésorerie, pas pour le rapprochement | P12 [P] |
| Cabinets spécialisés (Excilio, plus de 1 000 entreprises revendiquées ; Hayot ; HR Associés ; Auctus) | La dépense va **au cabinet**, pas à un logiciel | P15, P16 [P] |
| A2X et Link My Books (hors France) | La catégorie se paie bien au Royaume-Uni et aux États-Unis (P7R-P29 à P31) ; aucune preuve équivalente en France | rescreen |

**Conclusion (A et D).** Une dépense logicielle existe, mais **aucun client ni volume n'est observé en France**. La volonté de payer d'un vendeur français pour un logiciel, plutôt que pour son cabinet, reste une hypothèse [H].

---

## 2. Concurrence et segment mal servi

| Concurrent | Prix | Couverture | Cible | Limites observées | Source |
|---|---|---|---|---|---|
| **Order Invoicer** | 0 / 12 / 59 / 149 / 299 €/mois (crédits) | ManoMano, Cdiscount, Fnac, Amazon, Shopify, PrestaShop, WooCommerce, Wix → Pennylane | Marchands sur Pennylane | Ventilation Cdiscount non décrite ; pages contradictoires (25 ou 100 crédits) ; traction faible | P04-P10 |
| **Synchron.io** | 150-350 €/mois, 1 intégration par plan | Mirakl ↔ Pennylane (commandes, factures, remboursements) | PME | Pas de Cdiscount ni de ManoMano indiqués ; orientation synchronisation de commandes | P02, P03 |
| **Acomim** | non trouvé | Amazon, Cdiscount → Pennylane, Abby | Petits vendeurs | Pas de Mirakl ni de ManoMano trouvés | P11 |
| **Sellsy, app Mirakl (partenaire)** | gratuite côté Sellsy ; abonnement partenaire, tarif non affiché | Mirakl → Sellsy ; mention d'un FEC ventilé | Clients Sellsy | Lié à Sellsy ; centré sur les commandes | P01 |
| **Qashflo** | 79-299 €/mois + commission dès 1 % | Vue de rapprochement et export Excel | Vendeurs à financer | Le produit cœur est le financement | P12 |
| **Boostmyshop myFulfillment** | inclus | Commandes → factures Pennylane, lettrage | Clients Boostmyshop | Pas de ventilation des versements marketplace | P44 |
| **A2X / Link My Books** | 29-1 039 $ ; dès 21 $ | Amazon.fr oui (LMB, P22) ; Mirakl, Cdiscount et ManoMano non trouvés ; Pennylane non trouvé | Anglophones, Xero/QBO | Pas de logiciel comptable français | P21, P22 |
| **Pennylane natif** | 7-79 €/mois | Connecteur Amazon Seller en bêta puis en pause, en attente d'Amazon ; « portails » Cdiscount Pro et ManoMano Pro pour les **achats** | Toutes PME | Pas de reversements marketplaces | P17-P19, P49 |
| **Tiime, Indy, Axonaut** | — | Aucun connecteur marketplace trouvé | TPE | Absence ≠ preuve | P45 |
| **ECOSIRE (D365), easybill (DE)** | — | Leroy Merlin / Mirakl → ERP ; facturation Mirakl | ERP, Allemagne | Hors Pennylane | P47, P48 |
| **Cabinets spécialisés** (Hayot avec n8n, Excilio, HR Associés, Auctus, Eurofiscalis) | sur devis | Service complet | Vendeurs de 200 k€ et plus | Internalisent l'automatisation (n8n) : concurrents autant que canal | P13-P16 |

### Ce que les puissants servent mal (hypothèses à tester, pas des preuves)
1. **Les opérateurs Mirakl secondaires** (Leroy Merlin, Boulanger, Carrefour, Darty) **vers Pennylane, avec ventilation par versement.**
   - Order Invoicer annonce Fnac, Cdiscount et ManoMano, mais aucun de ces opérateurs.
   - Synchron.io synchronise les commandes plutôt que les versements.
   - Ce manque reste une hypothèse [H], car il repose sur « aucun X trouvé ».
2. **Le cabinet multi-dossiers.** Aucun outil trouvé ne propose une vue cabinet qui produise le FEC ou les écritures pour Pennylane, ACD, Cegid ou Sage sur 20 dossiers à la fois [H].
3. **Les logiciels comptables autres que Pennylane** (Tiime, Indy, Sage par FEC) : aucun connecteur trouvé [H, P45].

### Ce qui empêche une plateforme hôte de copier
- **Pennylane** pourrait le faire. Elle a racheté Billy pour ses intégrations, et son connecteur Amazon montre l'intention (P17).
  - Elle bute sur la validation Amazon et sur la multiplicité des API. Elle a jusqu'ici préféré laisser des partenaires (Order Invoicer) couvrir le besoin (P09) [E].
  - **Protection faible** : Pennylane peut aussi mettre un partenaire en avant au détriment d'un autre.
- **Les marketplaces** (Mirakl, Octopia) ne produisent pas d'écritures pour le vendeur ; elles exposent seulement les données (P23, P24) [E].
  - Le risque vient moins d'une copie par l'hôte que des **concurrents déjà présents**, qui peuvent ajouter un opérateur Mirakl en quelques jours [E].

---

## 3. Acquisition (A)

### Canal 1 — Cabinets e-commerce et SEO de niche
- **Cibles.** Les cabinets qui publient sur « comptabilité Cdiscount, ManoMano, marketplaces » : Hayot, HR Associés, Excilio, Auctus, Eurofiscalis (P13-P16), et une centaine de cabinets « e-commerce » repérables sur Google et LinkedIn [E].
- **Offre.** Un outil multi-dossiers qui remplace leurs scripts n8n et Excel.
- **Risque.** Les plus avancés ont déjà automatisé (Hayot avec n8n, P15).
- **SEO.** Les pages « rapprochement versements Leroy Merlin / Boulanger / Carrefour → Pennylane ou FEC » sont moins disputées que « comptabilité Cdiscount », où se trouvent déjà les cabinets, Qashflo et Order Invoicer [E]. Délai de 4 à 9 mois [E].

### Canal 2 — Marketplace Pennylane et e-mail B2B aux vendeurs
- **Marketplace Pennylane.**
  - La fiche passe par l'équipe partenariats connectivité ; les conditions ne sont pas publiques (P20).
  - Order Invoicer y est déjà (P09).
  - Le délai d'acceptation est inconnu [H].
- **E-mail B2B.**
  - Les vendeurs Cdiscount, ManoMano et Leroy Merlin ont des pages boutique publiques, avec raison sociale et souvent un site [E].
  - En France, l'**opt-out** est admis pour un e-mail professionnel en rapport avec la fonction (P42).
  - Mentions obligatoires : identité de l'expéditeur, origine des données, lien d'opposition fonctionnel.
  - Ne pas mettre de **pixel de suivi** sans consentement (recommandation CNIL de mars 2026, P43).
  - CAN-SPAM, PECR et CASL ne s'appliquent pas : la cible est française.

### Coût d'acquisition plausible [E/H]
- **E-mail.** 300 contacts qualifiés par mois demandent environ 10 h de constitution de liste et 20 € d'outils.
  - À 3 % de réponse, 20 % d'essai et 40 % de conversion [H], on obtient ≈ 0,7 client par mois.
  - Soit **≈ 15 h et 30 € par client**, ou **≈ 300 à 450 €** si l'heure est valorisée à 20-30 €.
- **Cabinet.** Une signature apporte 3 à 10 dossiers [H], pour un cycle de 1 à 3 mois et ≈ 10 à 20 h de démonstrations.
- **CAC retenu : 300 €** [H].

### Message d'accroche (test)
> Objet : vos versements Leroy Merlin / ManoMano dans Pennylane
> Bonjour, chaque virement ManoMano ou Leroy Merlin mélange ventes, commissions et retours. Nous découpons automatiquement chaque versement en écritures (CA, TVA, commission, frais) prêtes pour Pennylane ou votre FEC, rapprochées du virement. Combien de temps y passez-vous (ou votre comptable) chaque mois ? — [identité, origine des données, lien d'opposition]

### Délais réalistes [E]
- **10 clients : 4 à 8 mois** après le lancement du MVP, compte tenu de la concurrence et de l'absence d'historique de vente du porteur.
- **40 clients : 15 à 30 mois.** Ce délai suppose qu'un ou deux cabinets prescripteurs signent ; sinon, il n'est pas atteint.

---

## 4. Produit et exploitation (B)

### Architecture minimale
- Node, Supabase/Postgres et Stripe, en réutilisant la pile Relanzio (P7-rescreen).
- **Connecteurs par source** :
  - Mirakl Seller API : **TL02** pour les lignes de transaction par cycle, IV01 ou SBC11/DR11 pour les factures de commission (P23, P24). Une URL et une clé par opérateur (P25, P26).
  - Octopia (Cdiscount) : API REST avec délégation du vendeur (P29). **Les données de versement ne sont pas trouvées dans l'API** ; il faut prévoir un import CSV manuel du relevé back-office [H].
  - ManoMano : clé API Toolbox (P31) ; données de versement non trouvées, import CSV en secours [H].
  - Amazon : rapports de règlement V2 récupérés automatiquement (P32).
- **Moteur de ventilation** : règles par type de transaction → comptes PCG, avec TVA, OSS et compte d'attente par marketplace.
- **Sorties** : écritures via l'API Pennylane, **FEC**, CSV Sage ou Cegid.
- **Rapprochement** : versement ↔ virement bancaire, via le compte d'attente.

### Intégrations, stabilité et conditions d'accès
| API | Accès | Stabilité | Statut |
|---|---|---|---|
| Mirakl Seller API | Clé générée par le vendeur dans son back-office ; aucun partenariat requis (P25) | Évolutions : l'*Enhanced Seller Invoicing* rend IV01 obsolète (P23) | [P] pour l'existence des endpoints ; [H] sur l'activation de l'API par chaque opérateur |
| Octopia (Cdiscount) | Délégation du vendeur à l'intégrateur (P29) | SOAP arrêté en juillet 2025 (P30) | [P] migration récente ; [H] données de versement |
| ManoMano | Clé Toolbox (P31) | Inconnue | [H] |
| Amazon SP-API | Profil développeur, rôles ; app publique autorisée par le vendeur (P33) | Frais annoncés puis annulés en mai 2026 (P34) | [P] ; l'approbation d'une app publique reste à obtenir [H] |
| API Pennylane | Publique ; listing marketplace via les partenariats (P20) | — | [P] |

### Ce qui casse et à quelle fréquence [E]
- Changement de format ou de version d'une API : 2 à 4 fois par an, toutes sources confondues.
- Nouveaux types de transaction (pénalités, frais logistiques, publicité) qui tombent en « non ventilé » : chaque mois au début, puis chaque trimestre.
- Expiration ou révocation d'une clé : une nouvelle clé invalide l'ancienne.
- Écarts de TVA ou d'OSS.

### Charge et support
- **Maintenance mensuelle estimée : 12 à 20 h** pour 5 sources [E].
- **Support [E].** Il est surtout **comptable** : « pourquoi cet écart de 3,12 € ? ». Il faut un fondateur capable de raisonner en PCG et en TVA, ce qui crée une dépendance à sa compétence. Environ 0,5 à 1 h par client et par mois les 6 premiers mois, puis 0,3 à 0,5 h.

### Automatisable ou non
- **Automatisable** : la collecte (Mirakl, Amazon), la ventilation standard, le FEC et le lettrage.
- **Non automatisable ou difficile** :
  - le paramétrage initial du plan de comptes, propre à chaque cabinet ;
  - les litiges, indemnités et pénalités, qui restent la valeur ajoutée du cabinet selon HR Associés ;
  - l'import manuel des relevés Cdiscount et ManoMano tant que l'API ne les expose pas [H].

### MVP vendable
- **Périmètre** : 2 opérateurs Mirakl, Amazon, l'export FEC et Pennylane.
- **Délai** : 6 à 10 semaines solo avec Claude Code [E]. L'ajout de Cdiscount et ManoMano demande 3 à 6 semaines de plus, à cause de la délégation Octopia et des formats inconnus [H].
- La validation comptable sur de vrais relevés est le goulot, pas le code.

---

## 5. Économie unitaire (D)

| Clé | Valeur | Justification | Étiquette |
|---|---|---|---|
| prix_mensuel_ht | 59 € | Aligné sur Order Invoicer Launch (59 €, P04/P07), sous Synchron.io (150 €, P03). Pennylane Premium coûte 79 € (P49) : un module plus cher que le logiciel comptable est difficile à vendre | [E] |
| cout_variable_client_mois | 3 € | Stockage des relevés, appels API, e-mails ; aucun frais d'API (frais Amazon annulés, P34) | [E] |
| frais_paiement_pct | 0,015 | Tarif Stripe standard pour cartes européennes, non revérifié dans cette recherche | [E] |
| frais_paiement_fixe | 0,25 € | Idem | [E] |
| fixes_mensuels | 90 € | Supabase, hébergement, Brevo, domaine, monitoring ; RC pro probablement nécessaire (outil comptable) | [E]/[H] |
| heures_fixes_mois | 16 h | Maintenance de 4 à 5 connecteurs et veille des API (§4) | [E] |
| heures_par_client_mois | 0,6 h | Support comptable sur les écarts (§4) | [E] |
| churn_mensuel | 0,03 | B2B, usage mensuel de clôture, mais des vendeurs quittent les marketplaces ou changent d'outil ; ARPA ≈ 60 € (P7-cession : ≥ 30-50 € → visée ≤ 3 %) | [E] |
| cac | 300 € | §3 : e-mail B2B et cabinets, temps valorisé | [H] |

```json
{"id":"P7-N06","titre":"Rapprochement des reversements des marketplaces françaises vers Pennylane / FEC","prix_mensuel_ht":59,"cout_variable_client_mois":3,"frais_paiement_pct":0.015,"frais_paiement_fixe":0.25,"fixes_mensuels":90,"heures_fixes_mois":16,"heures_par_client_mois":0.6,"churn_mensuel":0.03,"cac":300}
```

À 3 000 € de MRR, il faut **51 clients** et environ 16 + 31 = **47 h par mois** [E]. C'est au-dessus de l'objectif de « quelques heures par semaine ».

---

## 6. Transférabilité et attractivité pour un acheteur (C)

### Ce qui se transfère
- **Code et propriété intellectuelle** : le code, les règles de ventilation et les tests sur des relevés anonymisés.
- **Domaine, marque INPI, site, contenus SEO.**
- **Stripe** : migration des clients et des moyens de paiement vers le compte de l'acheteur (P7-cession §9).
- **Données clients (RGPD)** : clés API vendeurs chiffrées et relevés financiers. Il faut un **DPA avec clause de cession** et une information des clients.
- **Comptes partenaires** :
  - Amazon : un compte développeur et une app publique liés à une entité ; leur transfert n'est pas documenté [H].
  - Octopia : la délégation est accordée à un intégrateur et serait à refaire au nom de l'acheteur [H].
  - Mirakl : rien à transférer, puisque les clés appartiennent aux vendeurs [E].
  - Pennylane : le listing marketplace est soumis à l'accord de Pennylane [H].

### Ce qui détruit la valeur
- **Dépendance au fondateur** pour le support comptable.
- **Dépendance à 4 ou 5 API** et à l'écosystème Pennylane.
- **Concurrent direct mieux placé** dans le catalogue Pennylane (P09).
- **Produit francophone** : bassin d'acheteurs étroit (P7-cession).
- **Concentration** si quelques cabinets apportent la majorité des dossiers ; un cabinet qui apporte 30 % du MRR entraîne une décote de 20 à 30 % (P7-cession).

### Acheteurs probables
1. Order Invoicer, Synchron.io ou Acomim, pour consolider [E].
2. Les cabinets e-commerce, pour internaliser l'outil [E].
3. Link My Books ou A2X, pour entrer en France. Peu probable sous 3 k€ de MRR [H].
4. Des intégrateurs Pennylane [H].

### Points d'audit
- MRR, churn et cohortes dans Stripe.
- Part de MRR par cabinet.
- Taux de versements ventilés sans intervention.
- Historique des incidents d'API.
- Exactitude comptable : un échantillon est rapproché par un expert-comptable.
- DPA, registre RGPD, sécurité des clés.
- Statut des comptes Amazon et Octopia.
- Heures d'exploitation journalisées.

---

## 7. Risques et difficultés concrètes
1. **Concurrence installée** : Order Invoicer, Synchron.io et Acomim, au même prix ou moins cher, déjà dans Pennylane Connect [P].
2. **Responsabilité comptable** : une erreur de TVA ou de CA chez un client entraîne un risque de réclamation. Il faut une RC pro et des CGV limitatives [H].
3. **Hétérogénéité des API** :
   - Octopia a migré en 2025 (P30) ;
   - Mirakl change son modèle de facturation (*Enhanced Seller Invoicing*, P23) ;
   - les données de versement Cdiscount et ManoMano ne sont pas trouvées dans les API [H].
4. **Amazon** : approbation d'une app publique et politique de frais instable (P34). Amazon.fr est déjà couvert par Link My Books et A2X (P22), avec un export Pennylane qui reste à vérifier.
5. **Capacité de vente du porteur** : aucun client payant à ce jour (brief). La cible exige de la crédibilité comptable.
6. **Charge** : ≈ 47 h par mois à 3 k€ de MRR. Cela dépasse l'objectif, car la maintenance de plusieurs connecteurs est incompressible [E].

---

## 8. Notes grille v3

| Critère (poids) | Rescreen | DD | Points | Cause de l'écart |
|---|---|---|---|---|
| Problème et volonté de payer (15) | 6 [E] | **5 [E]** | 7,5 | Les offres payantes existent (P03, P04), mais aucune traction ni aucun client n'est observé en France (P10). Excel suffit sous 500 commandes par mois (P13). La douleur n'est attestée que par des cabinets vendeurs (P14) |
| Acquisition (20) | 6 [H] | **5 [H]** | 10 | Le canal « Marketplace Pennylane » est déjà occupé par Order Invoicer (P09) et l'accès y est non public (P20). Le SEO « comptabilité Cdiscount » est tenu par les cabinets. L'opt-out B2B est confirmé (P42) |
| Solo (15) | 5 [H] | **4 [E]** | 6 | Il faut 3 familles d'API plus Amazon, et non un seul connecteur Mirakl (P26, P28, P31). Données de versement non trouvées chez Octopia et ManoMano. Support comptable lourd |
| Rentabilité (15) | 7 [E] | **5 [E]** | 7,5 | Prix ramené de 79 à 59 € par la concurrence (P04) et l'ancre Pennylane (P49) : 51 clients et ≈ 47 h par mois |
| Rétention (10) | 8 [E] | **7 [E]** | 7 | Usage mensuel, mais les vendeurs quittent ou changent de marketplace, et des alternatives équivalentes existent |
| Revente (15) | 7 [E] | **5 [E]** | 7,5 | Dépendance à de multiples API et au savoir comptable du fondateur, comptes Amazon et Octopia, produit francophone. Les concurrents sont des acheteurs plausibles |
| Différenciation (5) | 4 [P] | **2 [P]** | 1 | Order Invoicer couvre ManoMano, Cdiscount, Fnac et Amazon vers Pennylane (P04-P08). Les manques restants (opérateurs Mirakl secondaires, vue cabinet) reposent sur « aucun X trouvé » |
| Risques (5) | 5 [E] | **4 [E]** | 2 | Migrations d'API (P30, P23), frais Amazon instables (P34), responsabilité comptable |
| **Total** | **62,0** | **48,5** | | |

---

## 9. Plan de validation sur 30 jours (avant tout code)

**Proposition de valeur testée.** « Chaque versement Leroy Merlin, Boulanger, Darty, Carrefour ou ManoMano est découpé en écritures prêtes pour Pennylane ou le FEC et rapproché du virement. Version cabinet multi-dossiers. »
C'est le créneau que les concurrents trouvés ne couvrent pas explicitement [H].

### Semaine 1 : listes et contact légal
- **Vendeurs** : 150 vendeurs français pris sur les pages boutique Leroy Merlin, ManoMano et Cdiscount. On garde ceux qui ont une société française et un site ; on écrit à l'adresse professionnelle de contact.
- **Cabinets** : 40 cabinets « e-commerce / marketplaces », trouvés sur Google et dans les annuaires.
- **E-mail en opt-out B2B** : identité, origine des données, lien d'opposition, sans pixel (P42, P43).
- **Questions de qualification** : 3 questions au plus dans l'e-mail.

### Semaines 1 à 3 : 15 entretiens au moins, sur le comportement passé
1. « Racontez-moi la dernière clôture : quelles marketplaces, combien de versements, qui a fait le rapprochement, combien de temps ? »
2. « Quel outil ou quel fichier utilisez-vous aujourd'hui ? Avez-vous essayé Order Invoicer, Synchron.io, Acomim, A2X ou Link My Books ? Pourquoi les avoir gardés ou abandonnés ? »
3. « Quelle est la dernière erreur ou le dernier écart découvert, par vous ou par votre cabinet ? Combien a-t-il coûté ? »
4. « Combien payez-vous aujourd'hui votre cabinet ou vos outils pour cette partie ? »
5. Pour les cabinets : « Combien de dossiers marketplace ? Comment les facturez-vous ? Qui fait la saisie ? »
6. « Pouvez-vous m'envoyer un relevé anonymisé ? » C'est un test d'engagement, et il donne les formats.

### Test de prix et premiers paiements
- **Service manuel facturé** : rapprochement d'un mois de versements, livré en FEC ou en écritures Pennylane, pour **149 € par dossier**, au moyen d'un lien Stripe.
- **Précommande** : 3 mois à 59 €, avec 20 % de remise.
- **Cabinets** : pilote de 5 dossiers à 199 € par mois pendant 2 mois.
- **Variation de prix** : 39, 59 ou 99 € annoncés en entretien. On mesure les objections, sans jamais compter un « oui » oral comme une preuve.

### Seuils
- **GO** (tous requis) :
  - au moins **15 entretiens** ;
  - au moins **8** décrivent au moins **4 h par mois** de rapprochement et aucun outil satisfaisant ;
  - au moins **3 paiements** encaissés (service manuel ou précommande), **dont au moins 1 cabinet** ;
  - au moins 5 relevés réels reçus ;
  - au moins 2 vendeurs confirment que leur opérateur Mirakl permet de générer une clé API.
- **STOP** (un seul suffit) :
  - **moins de 2 paiements** à J+30 ;
  - **au moins 50 %** des interrogés déjà équipés et satisfaits (Order Invoicer, Synchron.io, Acomim, cabinet) ;
  - moins de 8 entretiens obtenus avec au moins 190 contacts ;
  - les relevés Cdiscount et ManoMano ne sont exploitables ni par API ni par un export structuré stable.

### Budget
- **Environ 60 à 120 €** : domaine, Brevo gratuit, outil de liste éventuel.
- **Environ 40 à 50 h** de travail du fondateur.
- Pas de code, hormis des scripts de ventilation jetables pour le service manuel.

---

## 10. Ce qui ferait monter ou baisser la piste

**Monter (vers 58-62)** :
- Des entretiens montrent qu'Order Invoicer et Synchron.io **ne ventilent pas réellement les versements** (commissions, réserves, frais) pour les opérateurs Mirakl ou pour Cdiscount, preuves à l'appui : captures d'essai, retours d'utilisateurs.
- 2 cabinets ou plus signent un pilote multi-dossiers payant.
- Pennylane accepte un listing et met l'outil en avant pour les opérateurs Mirakl secondaires.
- Mirakl et Octopia exposent les relevés de manière stable : TL02 vérifié sur 2 opérateurs français, endpoint finance Octopia trouvé.

**Baisser (sous 45, abandon)** :
- Order Invoicer ou Synchron.io couvrent déjà Leroy Merlin, Boulanger et Carrefour avec ventilation.
- Pennylane lance un connecteur Mirakl ou Cdiscount natif, ou réactive son connecteur Amazon (P17).
- Les opérateurs désactivent l'API vendeur par défaut.
- Les vendeurs jugent le gain inférieur à 2 h par mois.
- Le seuil STOP est atteint.

**Réponse distincte des quatre rôles**
- **(A)** Acquisition possible mais lente. Le meilleur levier, ce sont les cabinets, qui sont aussi des concurrents.
- **(B)** Techniquement faisable. La difficulté est plus comptable que logicielle, et la multiplicité des API garde une maintenance permanente au-dessus de 12 h par mois.
- **(C)** Actif revendable seulement au-delà d'environ 2,5 k€ de bénéfice mensuel, avec un bassin d'acheteurs restreint aux concurrents français.
- **(D)** 51 clients et ≈ 47 h par mois à 3 k€ de MRR : moins bon que l'hypothèse du rescreen (38 clients, 15 à 25 h).
