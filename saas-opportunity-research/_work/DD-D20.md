# DD-D20 — Relance des impayés B2B branchée sur le cycle de vie de la facture électronique (TPE de services, FR)

Fusion : D-20 (relance des impayés), D-09 (statut « encaissée » et e-reporting des paiements), D-08 (canal cabinets comptables). Adjacence : E-13 / Relanzio (relance de devis).
Date : 2026-10-29. Phase 2/4.

**Méthode.** 33 recherches WebSearch, dont 14 visaient l'invalidation : gratuité, fonction déjà intégrée par les PA, les banques et les logiciels de facturation, report, API fermées. WebFetch est bloqué (`www.impots.gouv.fr` ne se résout pas). Aucune page n'a donc été lue en entier : toutes les preuves sont des **extraits de recherche**. Les prix viennent d'agrégateurs ou de comparatifs, sauf mention contraire. Aucune page tarifaire officielle n'a été lue. Les preuves sont référencées `P01`…`P35` (fichier `DD-D20-preuves.csv`, identifiants `DD-D20-Pxx`).

Étiquettes : **[OBS]** fait observé dans un extrait ; **[EST]** estimation ; **[HYP]** hypothèse ; **[INC]** inconnu.

---

## Verdict d'abord

- **Note : 56/100.** Phase 1 : 68. La baisse tient à la lacune, à la distribution et à la défendabilité.
- **La douleur est réelle et bien documentée** :
  - 13 Md€ de trésorerie manquent aux TPE/PME [OBS P01] ;
  - le risque de défaillance augmente de 25 % [OBS P04] ;
  - on compte 72 000 défaillances sur 12 mois, un record [OBS P05].
- **Le « crochet » réglementaire existe, mais il appartient aux Plateformes Agréées (PA).** Le statut « encaissée » doit être *émis via sa PA* [OBS P07, P08]. Les PA les plus utilisées par les TPE fournissent toutes, gratuitement ou pour moins de 25 €/mois, le suivi des paiements et souvent la relance automatique : Pennylane, Tiime, Qonto, Indy, Abby, Axonaut, Sellsy, les banques et Jefacture [OBS P13 à P19].
- **Conséquence : un outil tiers ne peut pas posséder le cycle de vie.** Il ne fait que le lire, quand l'API le permet [OBS P24, P27].
- **Pour Relanzio, l'extension devis → facture → encaissement est un piège en tant que produit autonome**, car le marché est saturé et la fonction commoditisée. **Elle reste un avantage modeste en tant que fonction ajoutée** à Relanzio pour ses propres clients artisans : moteur de relance déjà construit, même ICP, panier relevé de 10 à 15 €/mois [HYP]. Voir §5 et §13.

---

## 1. ICP, acteurs et contexte d'achat

| Rôle | Qui | Statut |
|---|---|---|
| **ICP** | TPE de services B2B de 1 à 20 personnes, en France : BTP second œuvre qui facture des professionnels, conseil, agences, maintenance, nettoyage, sous-traitance. Elle a au moins 20 factures par mois et des clients PME, ETI ou grands comptes. Elle n'a ni service de recouvrement ni DAF. Elle est soumise à la TVA sur les encaissements, le régime par défaut des prestations de services. | [EST] |
| Utilisateur | Le dirigeant, ou le ou la conjoint(e) ou l'assistante administrative | [HYP] |
| Prescripteur | L'expert-comptable, qui choisit ou recommande souvent la PA : Jefacture revendique 4 000 cabinets [OBS P18], Pennylane 2 000 cabinets partenaires [OBS P24]. Également la banque, qui intègre une PA [OBS P17]. | OBS/HYP |
| Décideur économique | Le dirigeant | [HYP] |
| Sponsor | L'assistante (gain de temps) ou le comptable (moins de relances à faire, rapprochement plus propre) | [HYP] |

**Objections attendues :**
1. « Mon logiciel de facturation ou ma banque le fait déjà » : c'est vrai pour Pennylane, Axonaut, Sellsy, Abby Pro et Qonto [OBS P14 à P16, P19].
2. « Je ne veux pas froisser mes clients » : la PPL Rietmann note que les petits fournisseurs renoncent aux pénalités par crainte de perdre des clients [OBS P34].
3. « Encore un abonnement. »
4. « Mon comptable a choisi la PA. »

**Contexte d'achat :**
- Achat en libre-service, entre 15 et 40 €/mois [EST].
- Il se déclenche lors d'une crise de trésorerie ou lors du choix de PA avant le 1/9/2027 [HYP].
- **Risque principal : le choix d'outil est verrouillé au moment du choix de PA**, aujourd'hui pour la réception, en 2027 pour l'émission. Les acteurs qui ont gagné le choix de PA deviennent alors le cockpit par défaut.

## 2. Job-to-be-Done et workflow actuel

**JTBD.** « Être payé à l'échéance sans y passer mes soirées ni abîmer la relation client, et, à partir de septembre 2027, déclarer correctement les encaissements de mes prestations de services. »

**Workflow actuel** [HYP, non observé en entretien] :
1. Le dirigeant émet la facture dans un logiciel ou dans Word.
2. Il ne fait aucun suivi formel de l'échéance.
3. En fin de mois, lui ou le comptable fait le rapprochement bancaire et repère les retards.
4. Il relance par e-mail ou par téléphone, de façon irrégulière, avec un ton gêné.
5. Il ne réclame presque jamais l'indemnité de 40 € ni les pénalités [OBS P34 indirect].
6. Au-delà de 60 à 90 jours, il passe par une mise en demeure, un cabinet de recouvrement ou une injonction de payer.

**Pourquoi c'est douloureux :**
- trésorerie tendue ;
- tâche désagréable et toujours repoussée ;
- dépendance à quelques gros clients qui paient tard : 24 % seulement des factures des ETI et grandes entreprises sont payées à l'échéance [OBS P03].

**Nouveau à partir de septembre 2027** [OBS P07, P09] : chaque paiement d'une prestation de services soumise à la TVA sur les encaissements doit produire un statut « encaissée », avec la date et le montant par taux. Il doit être transmis via la PA au plus tard à la fin de la période d'e-reporting, par exemple le 10 du mois suivant au réel normal.

**Fréquence.** Hebdomadaire pour la relance, mensuelle pour l'e-reporting.

### Vérification demandée : quels statuts sont obligatoires ?

- **Quatre statuts sont obligatoires** et remontent au concentrateur du PPF : **Déposée, Rejetée, Refusée, Encaissée** [OBS P06]. Ce point est concordant entre Tiime, Hayot, Abby, Quadient et FNFE, mais aucune source primaire DGFiP n'a été lue.
- **« Encaissée » n'est obligatoire que si la TVA est exigible à l'encaissement** : prestations de services sans option pour les débits, et **toutes les factures d'acompte**, y compris sur des biens [OBS P06, P07]. Selon une source commerciale isolée, l'article 123 de la LF 2026 aurait élargi le champ [OBS-faible P10].
- **Données transmises** : numéro de facture, date de paiement, montant encaissé ventilé par taux [OBS P08, page DGFiP].
- **L'omission est un manquement déclaratif** [OBS P07, Legifiscal]. Le montant de l'amende n'a pas été vérifié ici [INC].
- **Pour la cible**, l'émission de factures et l'e-reporting des TPE/PME commencent le **1/9/2027** [OBS P09]. Un report d'un trimestre au plus, jusqu'au 1/12/2027, est évoqué par amendement, sans adoption trouvée [OBS P35]. Aucun report ni suspension général n'a été trouvé au 29/10/2026.
- **Points INCONNUS** :
  - la fréquence exacte pour la franchise en base (bimestrielle selon une seule source, P09) ;
  - le texte du BOFiP ;
  - le montant de l'amende.

## 3. Coût de l'inaction

Formule (par TPE et par an) :

`C = (CA_B2B × j_retard / 365) × taux_financement + h_relance × 52 × coût_horaire + CA_B2B × taux_irrécouvrable + R_conformité`

| Variable | Valeur | Étiquette |
|---|---|---|
| CA_B2B | 600 000 € | [HYP] (TPE de services de 5 à 8 personnes) |
| j_retard | 13 à 18 jours de retard moyen | [OBS P02 (13,4 j), P03 (17,99 j)] — moyennes nationales, pas propres à la cible |
| taux_financement (découvert ou coût d'opportunité) | 6 % | [HYP] |
| h_relance | 1,5 h par semaine | [HYP] |
| coût_horaire chargé du dirigeant ou de l'assistante | 40 € | [HYP] |
| taux_irrécouvrable | 0,5 % du CA | [HYP] |
| R_conformité (statut « encaissée » oublié) | inconnu | [INC] (amende non vérifiée) |

Application :
- Trésorerie immobilisée : 600 000 × 15/365 ≈ **24 700 €**, soit un coût financier d'environ **1 480 €/an**.
- Temps : 1,5 × 52 × 40 = **3 120 €/an**.
- Pertes : **3 000 €/an**.

**Total ≈ 7 600 €/an [EST]**. Le coût le plus *visible* reste la trésorerie bloquée (≈ 25 k€), plutôt que le coût annuel. Un outil ne capte qu'une fraction de cette somme, et **les solutions déjà payées par la TPE (PA, banque) en captent une partie gratuitement**.

## 4. Concurrents (détail : `DD-D20-concurrents.csv`, 25 lignes)

**Directs — relance intégrée à la PA ou à la facturation** [OBS, prix d'agrégateurs] :

| Acteur | Prix observé | Ce qui est inclus | Preuve |
|---|---|---|---|
| Pennylane | 7 €, puis 24 € HT/mois | Relances, rapprochement | P14 |
| Tiime | PA gratuite ; Business 17,99 € HT/mois | — | P13 |
| Axonaut | 69,99 à 97 € HT/mois | Relance devis **et** factures sur 3 niveaux | P15 |
| Sellsy | 29 à 39 € par utilisateur et par mois | — | P15 |
| Abby Pro | dès 15 €/mois | Relance des impayés | P19 |
| Qonto | facturation gratuite | Relances automatiques en option payante (sources contradictoires) | P16 |

**Spécialistes du recouvrement** :

| Acteur | Prix observé | Preuve |
|---|---|---|
| LeanPay | 95 à 225 € HT/mois en TPE, selon la source | P20 |
| Upflow | 400 à 800 $/mois ; plan Discover gratuit | P21 |
| Libeo | 49 et 99 €/mois | P22 |
| Kollekt | dès 235 €/mois | P25 |
| Agicap | sur devis, engagement annuel | P23 |
| Dunforce | inconnu | — |
| Gcollect, RubyPayeur, My DSO Manager, LegalCity | inconnu | P25 |

**Indirects et substituts :**
- Banques : PA gratuites chez BPCE (iPaidThat) et Crédit Mutuel/CIC (HBS) [P17].
- Jefacture.com, la PA de la profession comptable : gratuite, puis 5 € HT/mois [P18].
- Chaintrust : de 5 à 20 € HT par dossier, pour les cabinets [fichier concurrents].
- Indy et Henrri, gratuits.
- Le tableur et la relance manuelle : **c'est le vrai concurrent** [HYP].
- Les cabinets de recouvrement.

**Outil public gratuit de l'État : il n'existe pas.** L'État a renoncé au portail public gratuit le 15/10/2024 ; le PPF n'est qu'un concentrateur et un annuaire [OBS P11]. Une question écrite demande de le réintroduire [OBS P12] : c'est un risque faible mais non nul de commoditisation publique.

**Plaintes et limites relevées :**
- Grilles de prix opaques ou incohérentes (LeanPay, Upflow).
- Engagement annuel (Agicap).
- Chez Pennylane, le statut « payé » n'est **automatique que si le paiement passe par le compte pro Pennylane** ou un export XML ; sinon, la mise à jour est manuelle sur Free et Starter [OBS P26].
- Aucune plainte d'utilisateur TPE n'a été trouvée : WebFetch est bloqué sur les sites d'avis [INC].

## 5. Différenciation

| Piste de wedge | Évaluation |
|---|---|
| a) « Relance + statut encaissée » pour TPE | **Faible.** Le statut est émis par la PA. Les PA-banques (Qonto, BPCE, CIC) voient l'encaissement nativement, et les PA-compta (Pennylane, Tiime) par le rapprochement. Le seul trou observé : le passage en « payé » est manuel chez certaines offres d'entrée de gamme [P26]. C'est une lacune de produit que l'éditeur peut corriger en un sprint [HYP]. |
| b) Relance « devis → facture → encaissement » pour artisans clients de Relanzio | **Moyenne en tant que fonction, faible en tant que produit.** Axonaut, Jobber et Tolteck (tableau de suivi) couvrent déjà les deux [P15, P33]. Le différenciateur possible tient au ton et à la séquence (« relance qui ne froisse pas »), à la lecture des réponses (le module IMAP de Relanzio existe) et au rythme J+2, J+5, J+10. C'est copiable [HYP]. |
| c) Cockpit multi-clients pour cabinets comptables : retards de leurs clients TPE, préparation PA (D-08), statuts « encaissée » manquants avant la date d'e-reporting | **La plus originale**, mais elle dépend de l'accès aux données de 100 à 160 PA différentes [P27, P28]. Pennylane, Tiime et Chaintrust proposent déjà des vues cabinet [HYP]. Les données de paiement ne sont pas exposées par l'API Pennylane selon un connecteur tiers [P24]. |

- **Time-to-value** : moins d'une heure si la TPE importe un CSV ou connecte une API [EST] ; plusieurs jours avec une agrégation bancaire.
- **ROI mesurable** : DSO avant et après, montant encaissé après relance.
- **Raison de changer** : faible, si la PA déjà adoptée fait 80 % du travail [HYP].

## 6. Taille de marché (bottom-up)

| Étape | Valeur | Étiquette |
|---|---|---|
| TPE employeuses de 1 à 9 salariés | ≈ 1,24 M (Dares 2022) | [OBS-secondaire P31] |
| Part du tertiaire | ≈ 75 % → ≈ 930 000 | [OBS-secondaire P31] |
| Part facturant majoritairement du B2B, avec un volume suffisant | 25 à 35 % → **230 000 à 325 000 acheteurs** | [HYP] |
| Prix | 15 à 40 €/mois, soit 180 à 480 €/an | [EST, bornes Abby/Tiime ↔ Libeo] |
| **TAM** | 230 k à 325 k × 180 à 480 € ≈ **41 à 156 M€/an** | [EST] |
| **SAM**, hors TPE déjà équipées d'une PA avec relance intégrée, en hausse forte d'ici septembre 2027 | 15 à 25 % du TAM → **35 000 à 80 000 TPE, soit 6 à 38 M€** | [HYP] |
| **SOM** à 3 ans pour 1 à 3 personnes sans levée | 150 à 500 clients × 300 à 400 €/an ≈ **45 à 200 k€ d'ARR** | [HYP] |

**Canal cabinets.** On compte environ 19 500 sociétés d'expertise comptable [OBS-secondaire P32]. À 30 €/mois par cabinet, ou 3 à 5 € par dossier, sur 1 % de pénétration, cela donne environ 70 à 200 k€ d'ARR [HYP].

## 7. Pricing

| Option | Prix | Qui signe | Commentaire |
|---|---|---|---|
| **Recommandé : module « Relance factures » de Relanzio** | +12 €/mois sur Relanzio Pro (29 €), soit 41 €/mois | Dirigeant artisan déjà client | Le moins risqué : il monétise une base existante. |
| Alternative 1 : produit autonome « relance impayés TPE » | 29 €/mois jusqu'à 100 factures ouvertes | Dirigeant TPE de services | Se bat contre Abby (15 €), Pennylane (7 à 24 €) et la gratuité bancaire. |
| Alternative 2 : licence cabinet | 4 €/dossier/mois, minimum 49 €/mois | Associé du cabinet | Repère Chaintrust de 5 à 20 €/dossier [OBS]. Cycle de vente long. |

**Exemple de ROI (module Relanzio)** [HYP] :
- Un artisan facture 30 000 €/mois à des professionnels.
- La relance systématique réduit son retard moyen de 15 à 8 jours.
- Gain : 30 000 × 12 × 7/365 ≈ **6 900 €** de trésorerie libérée une fois, plus environ 1 h par semaine, soit environ 2 000 €/an.
- Coût : 144 €/an.
- Le ROI est réel, **mais il est souvent déjà obtenu avec l'outil de facturation actuel.**

## 8. Intrants du modèle économique

| Intrant | Valeur | Étiquette |
|---|---|---|
| Prix moyen (ARPA) | 12 €/mois pour le module ; 29 €/mois en autonome | [HYP] |
| COGS d'hébergement | Supabase et serveur déjà payés pour Relanzio : marginal inférieur à 1 €/client/mois | [EST] |
| COGS d'e-mail (Brevo) | Moins de 0,5 €/client/mois pour environ 100 relances par mois | [EST] |
| COGS d'IA (rédaction et classement des réponses) | Moins de 0,3 €/client/mois | [EST] |
| Agrégation bancaire DSP2, si l'on veut détecter l'encaissement | Prix inconnu : prestataire AISP nécessaire, aucun prix trouvé | [INC] |
| Support et onboarding | 30 à 60 min par client | [HYP] |
| CAC | Module : environ 0 € (vente additionnelle). Autonome : 150 à 400 € (SEO, prospection, partenariats) | [HYP] |
| Cycle de vente | TPE : de quelques jours à 2 semaines. Cabinet : 1 à 3 mois. | [HYP] |
| Churn | TPE de 3 à 5 %/mois ; plus élevé à l'approche du 1/9/2027 si la PA absorbe la fonction | [HYP] |
| Payback | Module : immédiat. Autonome : 150 à 400 € / 27 € de marge ≈ 6 à 15 mois. | [EST] |
| Marge brute | Supérieure à 85 % sans agrégation bancaire | [EST] |

## 9. Risques

- **Dépendance aux plateformes (majeur).** Les données de facture, de statut et d'encaissement vivent dans la PA. Chaque PA expose sa propre interface [P27]. L'API Pennylane n'exposerait pas le détail des paiements [P24]. Un outil tiers n'a **aucun droit** d'émettre le statut « encaissée » sans passer par la PA de l'émetteur [P07].
- **Réaction des éditeurs en place (majeur).** Pennylane, Tiime, Qonto et Axonaut ont déjà la fonction. Le « trou » observé (statut « payé » manuel en entrée de gamme) peut être comblé rapidement.
- **Responsabilité.** Si l'outil pilote l'envoi du statut « encaissée » (date, montant par taux) et se trompe, la TPE commet un manquement déclaratif [P07]. Il faut donc rester en lecture et en aide, et ne pas émettre à la place de la PA.
- **RGPD.** Données de contacts des débiteurs (B2B, intérêt légitime plausible [HYP]) et données bancaires si agrégation (DSP2 : agrément ou partenaire obligatoire [HYP]).
- **Réglementation.**
  - Calendrier non suspendu au 29/10/2026 ; report au plus d'un trimestre évoqué [P35].
  - La PPL Rietmann, si elle est adoptée, interdirait de renoncer aux pénalités et alourdirait les amendes. C'est un catalyseur positif, mais il n'est pas adopté définitivement [P30].
  - Le règlement européen sur les retards de paiement est bloqué (D-P23 phase 1).
- **Fiabilité de l'IA.** Un ton inadapté envers un gros client peut coûter la relation. Garder une validation humaine.
- **Intégrations.** Avec plus de 100 PA [P28], la couverture ne peut se faire que par import CSV ou PDF Factur-X, ou via 3 à 5 API (Pennylane, Tiime, Qonto, Axonaut, Sellsy) dont l'accès et les conditions restent à vérifier [INC].

## 10. Distribution

1. **Canal 1 — base Relanzio** : vente additionnelle aux artisans pilotes. C'est le seul canal à CAC quasi nul. Limite : Relanzio est encore **pré-pilotes** (README v0.4), donc la base est à construire.
2. **Canal 2 — marketplace d'une PA** : Pennylane a un marketplace avec certification [P24], mais il est déjà peuplé de 5 outils de recouvrement ou plus [P25]. Autre option : partenariat avec une PA indépendante sans module de relance, comme Jefacture [P18], dont la relance n'est pas mentionnée [INC].
3. **Canal 3 — cabinets comptables** : environ 19 500 [P32], mais ils sont déjà rattachés à une PA partenaire.

**Message.** « Vos factures de prestations vous sont payées à 60 jours au lieu de 30 ? Relanzio relance vos devis ET vos factures avec le bon ton, et vous dit chaque 5 du mois quelles factures payées doivent être déclarées "encaissées" avant le 10. »

**Obtenir 10 conversations d'acheteurs :**
- 10 appels aux artisans pilotes de Relanzio ;
- 20 messages LinkedIn ciblés vers des dirigeants de TPE de services B2B (codes NAF 43, 70.22, 81.2 et 71) ;
- 5 cabinets comptables locaux.

**Listes publiques de prospects :**
- Sirene et l'annuaire des entreprises (open data, par code NAF et tranche d'effectif) [HYP, non vérifié dans ce cycle] ;
- le tableau de l'Ordre des experts-comptables ;
- les listes de PA de la DGFiP, pour trouver des partenaires [P28].

**Premières ventes sans audience.** Offre « Founder » à 19 € pour les 10 premiers ; prévente sur page d'attente avec paiement Stripe.

## 11. Faisabilité

**Briques Relanzio réutilisables** (vérifié dans le dépôt) :
- `server/followups.js` et `followup-policy.js` (séquences de relance) ;
- `imap-replies.js` et `imap-reply-parser.js` (détection des réponses) ;
- `email.js` avec Brevo ;
- `billing.js` et `stripe-webhook.js` ;
- `morning-digest.js` ;
- schéma Supabase.

**Briques à construire :**
- un objet « facture » (échéance, montant TTC par taux, statut) ;
- l'import CSV ou Factur-X ;
- l'indemnité de 40 € et les pénalités calculées dans la relance [P29] ;
- un tableau des retards ;
- un rappel « statuts encaissée à déclarer avant le 10 ».

**Partie difficile :**
- détecter le paiement de façon fiable : agrégation bancaire DSP2 ou API de PA ;
- couvrir la fragmentation des PA.

**Estimation** [EST] :
- MVP du module : 3 à 5 semaines pour une personne.
- Connecteur API d'une PA : 1 à 2 semaines chacun, sous réserve d'accès.
- Coût cash : moins de 100 €/mois hors agrégation bancaire.

**Dépendances critiques :**
- accès aux API des PA (non vérifié, sauf Pennylane, documentée) ;
- passage en production de Relanzio (gates externes non vertes).

## 12. Défendabilité à 2 ans

- **Ce qu'un gros éditeur commoditise :** tout ce qui touche à la relance et au statut. Les PA ont l'avantage structurel des données : facture, statut et banque [P13 à P17, P26].
- **Ce qu'un LLM généraliste commoditise :** la rédaction des relances.
- **Pourquoi le client resterait :** historique des séquences et des réponses par client débiteur ; intégration au flux devis de Relanzio ; habitude. C'est un verrou faible [HYP].
- **Défendabilité : 2/10.**

## 13. Raisons de NE PAS le faire et expériences d'invalidation

**Raisons de ne pas le faire :**
1. Le crochet réglementaire (statut « encaissée ») appartient aux PA, pas à un tiers.
2. Une dizaine d'acteurs offrent déjà la relance, dont plusieurs gratuitement ou pour moins de 25 €.
3. Les banques et la profession comptable distribuent des PA gratuites.
4. Distribution TPE coûteuse et cabinets déjà captés.
5. Aucune preuve directe de volonté de payer.
6. Le pic de catalyseur (septembre 2027) est aussi le moment où les PA verrouillent le client.

**Est-ce un avantage ou un piège pour Relanzio ?**
- *Avantage* en tant que module : même ICP, même moteur et même canal.
- *Piège* si Relanzio pivote vers « recouvrement + e-invoicing » : marché saturé, dépendance aux PA, et cela détourne de la validation non encore faite du produit devis.
- Recommandation : **ne pas en faire un produit distinct** ; tester la fonction en module après les premiers pilotes payants de Relanzio.

**Expériences qui invalideraient l'idée (seuil d'arrêt) :**
1. **Entretiens** avec 10 artisans ou TPE de services B2B. Si plus de 60 % ont déjà des relances automatiques via leur PA ou leur logiciel, ou n'ont pas de retards significatifs (plus de 10 % des factures à plus de 15 jours), on arrête.
2. **Prévente.** Page « Relance factures » avec un paiement de 19 € pour le premier mois. Moins de 3 prépaiements sur 50 visiteurs qualifiés : on arrête le produit autonome.
3. **Test d'API.** Demander l'accès développeur à Pennylane, Tiime et Qonto, et vérifier si le statut de paiement est lisible. Si non, le wedge « encaissée » est mort et l'on se limite à l'import CSV.
4. **Cabinets.** 5 cabinets interrogés. Si aucun ne paierait 3 à 5 € par dossier pour un tableau des « encaissées manquantes » et des retards clients, on abandonne D-08 et D-09 en tant que canal.

## 14. Re-notation

Phase 1 : notes brutes de `scores-bruts.csv`, total 67,5 ≈ 68.

| Critère (poids) | Phase 1 (0-10) | Phase 2 (0-10) | Points | Cause du changement |
|---|---|---|---|---|
| Douleur et budget (20) | 7 | 7 | 14 | Inchangé : les données BdF, AN et Altares confirment [P01, P04, P05]. Les TPE paient elles-mêmes à l'heure (68 %), mais subissent les grands comptes (24 %) [P03]. |
| Fréquence (10) | 9 | 8 | 8 | Relance hebdomadaire, e-reporting mensuel ; volume de factures modeste en TPE. |
| Preuves (15) | 7 | 6 | 9 | Preuves macro solides, mais aucune volonté de payer observée. La gratuité généralisée suggère une faible disposition à payer *en plus*. |
| Distribution (15) | 6 | 4 | 6 | Cabinets captés par des PA (Jefacture : 4 000 cabinets ; Pennylane : 2 000) ; banques distributrices ; marketplace Pennylane déjà occupée [P18, P24, P25]. |
| Lacune (10) | 3 | 2 | 2 | Relance incluse chez Pennylane, Axonaut, Sellsy, Abby, Qonto (option), Libeo, Tiime ; PA gratuites [P13 à P19, P22]. |
| Faisabilité (10) | 8 | 6 | 6 | La relance est facile (briques Relanzio), mais le volet « cycle de vie » exige l'accès à plus de 100 PA hétérogènes ou une agrégation bancaire [P24, P27]. |
| Marge (5) | 8 | 7 | 3,5 | Bonne marge, mais prix plafonné par la gratuité. |
| Timing (5) | 7 | 6 | 3 | Septembre 2027 confirmé, sans report général [P09, P35] ; mais c'est aussi le moment où les PA captent la fonction. La PPL Rietmann n'est pas adoptée [P30]. |
| Défendabilité (5) | 4 | 2 | 1 | Données détenues par les PA et les banques ; LLM pour la rédaction. |
| Risques (5) | 8 | 6 | 3 | Dépendance aux API des PA, responsabilité déclarative si l'outil pilote le statut [P07, P24]. |
| **Total** | **67,5** | — | **55,5 ≈ 56** | |

**Confiance : moyenne.** Faits réglementaires concordants (secondaires) ; prix d'agrégateurs ; aucun entretien.
