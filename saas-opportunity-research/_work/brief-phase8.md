# Brief commun — Phase 8 : acquisition sans réseau personnel

Date : 2026-10-30. Langue : français.

## Objectif du porteur (inchangé)
- Créer seul un micro-SaaS B2B rentable et revendable, avec un investissement limité.
- Exploitation en micro-entreprise française.
- Pas de développement avant d'avoir vérifié la demande.

## Corrections exigées par le porteur (obligatoires)
1. Une opportunité **non validée n'est pas mauvaise** : elle est inconnue et doit être testée.
2. **Aucun réseau personnel n'est supposé.** Les premiers clients doivent être joignables par :
   - des listes publiques ou des annuaires professionnels ;
   - du SEO ;
   - des marketplaces ;
   - des intégrations ;
   - de la prospection ciblée légale.
3. Les notes subjectives de la recherche documentaire **ne suffisent pas à éliminer un marché**. La concurrence n'élimine pas : elle prouve que la dépense existe. Il faut analyser les segments insuffisamment servis.
4. Les critères de validation doivent correspondre au **prix normal**, à la **fréquence d'achat** et à la **nature de l'engagement** :
   - essai, carte enregistrée, abonnement mensuel ou annuel prépayé ;
   - lettre d'intention, inscription en liste d'attente avec prix affiché, réponse à une prospection, démo réservée.
   - **Pas de « 3 précommandes à 149 € » arbitraires.**
5. Distinguer **[F] fait vérifié** (source citée), **[E] estimation** (raisonnement explicite) et **[H] hypothèse**.

## Outils
- WebSearch fonctionne.
- WebFetch est bloqué (DNS refusé) : essaie une fois, puis extraits uniquement, et dis-le.
- N'invente aucune URL, prix, chiffre, avis, transaction ou concurrent.
- Les avis simulés d'agents ne sont jamais des preuves.

## Les 5 pistes retenues pour leurs canaux d'acquisition
Sélection du directeur de recherche ; preuves dans `06-registre-preuves.csv`.

| Id | Piste | Canal sans réseau déjà prouvé [F] | Dépense existante prouvée [F] |
|---|---|---|---|
| C-39 | Calendrier et dépôts FCC (RMD, CPNI, 499-A/Q) pour petits revendeurs VoIP US | RMD téléchargeable en CSV public, avec e-mail et téléphone d'un contact par société (P7DC39-P18, P19) | RMD Keeper 39-399 $/mois (P7DC39-P01) ; Performance West 1 499 $/an (P7DC39-P05) |
| B-11 | Application pour testeurs backflow US multi-districts | Listes publiques de testeurs certifiés avec e-mail et n° de certification (DD-B11-P29 à P31) | C3Backflow 15 $/mois, R2 Utility 25 $, Syncta (DD-B11-P08, P43) |
| A-38 | Rapprochement des commissions des agences d'assurance IARD indépendantes US hors Applied Epic | Annuaires d'agents indépendants et registres d'État des producteurs [H : à vérifier] | Commission Wizard dès 199 $/mois (A-P41) ; Applied Recon (A-P42) |
| N06 | Rapprochement des reversements des marketplaces FR (Mirakl, Octopia, ManoMano, Amazon) → Pennylane/FEC, vendeurs et cabinets | Marketplace Pennylane (300+ éditeurs, approbation) (P7R-P01, P02) ; boutiques vendeurs publiques sur les marketplaces [H] | Synchron.io 150-350 €/mois (P7DN06-P03) ; Order Invoicer 0/59 € et plus (P7DN06-P04) |
| N04 | Application Jira (Forge) de justification du temps R&D (CIR/CII, SR&ED) | Atlassian Marketplace : 0 % de commission jusqu'à 1 M$, app transférable (P7DN04-P35, P40) | MyCIR 2 500 €/an, honoraires de cabinets ; Tempo (P7DN04) |

Fichiers à lire pour le contexte :
- `P7-DD-C39.md`, `P7-DD-N04.md`, `P7-DD-N06.md` ;
- `DD-B11.md` ;
- `A-top.md` (A-38) ;
- `redteam3.md`.

## Ce que chaque analyste doit produire, par piste
1. **Canal vérifié.**
   - Où se trouve la liste ou l'annuaire, et sous quel format.
   - Nombre d'entrées [F/E].
   - Champs disponibles (e-mail ?).
   - Conditions d'usage et base légale du contact :
     - France : CNIL, B2B en opt-out si le message concerne la profession ;
     - États-Unis : CAN-SPAM ;
     - Canada : CASL ;
     - UK : PECR.
   - Pour le SEO : requêtes d'intention, et concurrence sur ces requêtes (pages qui rankent). Pas de volumes inventés.
   - Pour les marketplaces : conditions de publication, délai d'approbation, possibilité d'une fiche « bientôt disponible » ou d'une liste d'attente.
2. **Frustrations vérifiables** envers les solutions existantes, avec des citations courtes et leurs liens :
   - avis G2, Capterra, App Store, Shopify, Atlassian ;
   - Reddit, forums, groupes métier.
   Marquer « non trouvé » si rien n'est trouvé.
3. **Segment insuffisamment servi.** Qui les concurrents servent mal (taille, langue, logiciel métier, prix, fonction), avec des preuves. Différenciation spécifique réalisable par un développeur solo.
4. **Support et maintenance** attendus [E] ; dépendance au fondateur ; transférabilité.
5. **Expérimentation commerciale sans développement complet**, adaptée au modèle économique :
   - cible précise et taille de l'échantillon ;
   - offre (concierge, maquette, fiche, landing avec prix, audit gratuit comme aimant, prévente annuelle remboursable) ;
   - tarif testable (avec variantes A/B si utile) ;
   - canal ;
   - coût en € et en heures ;
   - message (objet et corps courts, prêts à l'emploi, conformes au droit applicable) ;
   - indicateurs mesurables avec seuils **justifiés par le prix, la fréquence et l'engagement**. Exemples : taux de réponse, rendez-vous, cartes enregistrées, prépaiements annuels, inscriptions avec prix affiché, conversion de l'audit gratuit.
   - Préciser les seuils GO / ITÉRER / STOP et leur justification. Exemple : à 79 $/mois et une décision annuelle, une carte enregistrée pour un abonnement fondateur vaut davantage qu'un paiement unique de 149 €.
6. **Économie unitaire révisée**, au format JSON de `micro_saas_sim.py` :
   `{"id","titre","prix_mensuel_ht","cout_variable_client_mois","frais_paiement_pct","frais_paiement_fixe","fixes_mensuels","heures_fixes_mois","heures_par_client_mois","churn_mensuel","cac"}`,
   avec un tableau des justifications [F/E/H].
7. **Ce qui rendrait la piste excellente** et ce qui la ferait abandonner après le test.

Format du CSV de preuves, avec l'en-tête EXACT :
`id,opportunite_id,affirmation,url,titre,auteur_organisme,date_publication,date_consultation,extrait_ou_paraphrase,type,pertinence,fraicheur,confiance,sens`
