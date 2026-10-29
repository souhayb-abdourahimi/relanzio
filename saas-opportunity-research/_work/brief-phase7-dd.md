# Brief — Phase 7 : étude approfondie d'un finaliste micro-SaaS

Lis d'abord `brief-phase7.md` (objectif, grille v3, règles de preuve) et `P7-rescreen.md` (section du finaliste). Les deux sont dans /home/user/relanzio/saas-opportunity-research/_work/. Lis aussi `P7-cession.md` (multiples, facteurs de valeur). WebSearch fonctionne ; WebFetch est bloqué (une tentative, puis extraits).

**Recherche** :
- 30 à 40 recherches, dont **≥ 50 % d'invalidation**.
- Cherche nominativement les éditeurs multi-verticaux et les fonctions natives des plateformes.
- N'invente jamais un prix, un nombre de clients ou d'installations, une URL.

Tu tiens quatre rôles à la fois ; garde leurs conclusions séparées quand elles divergent.
- **(A) expert en acquisition B2B sans commercial**
- **(B) développeur senior de produits simples et maintenables**
- **(C) expert en cession d'actifs numériques**
- **(D) analyste financier**, qui fournit les intrants seulement ; le calcul est fait par un script central

## Sections obligatoires de `P7-DD-<id>.md`
1. **Problème et acheteur.**
   - ICP précis et volume d'acheteurs, sourcé [P] ou estimé [E].
   - Workflow actuel, fréquence, coût de l'inaction.
   - Preuves de **dépense actuelle** : prix et clients des concurrents, installations ou avis sur les marketplaces.
2. **Concurrence et segment mal servi.**
   - Tableau des concurrents : prix, cible, limites, source.
   - Ce que les puissants servent mal, avec preuves.
   - Ce qui empêcherait une plateforme hôte de copier la fonction.
3. **Acquisition (A).**
   - Canal 1 et canal 2, sans commercial.
   - Coût d'acquisition plausible en € et en heures.
   - Listes de prospects : où, et **contact légal** :
     - en France, prospection B2B par e-mail en opt-out si le message est en rapport avec la profession (CNIL), mentions obligatoires ;
     - aux US, CAN-SPAM ;
     - au Royaume-Uni et au Canada, PECR et CASL s'ils sont pertinents.
   - Message d'accroche.
   - Délai réaliste pour 10, puis 40 clients.
4. **Produit et exploitation (B).**
   - Architecture minimale.
   - Intégrations ou API indispensables, avec leur stabilité et leurs conditions d'accès vérifiées.
   - Ce qui casse et à quelle fréquence.
   - Charge de maintenance mensuelle estimée.
   - Support attendu.
   - Ce qui peut être automatisé, et ce qui ne le peut pas.
   - Délai de construction d'un MVP vendable par un solo avec Claude Code.
5. **Économie unitaire (D).** Un bloc JSON avec ces clés exactes :
   `{"id","titre","prix_mensuel_ht","cout_variable_client_mois","frais_paiement_pct","frais_paiement_fixe","fixes_mensuels","heures_fixes_mois","heures_par_client_mois","churn_mensuel","cac"}`
   - Montants en € HT ; churn en fraction.
   - Chaque valeur est justifiée et étiquetée [P]/[E]/[H] dans un tableau juste avant le bloc.
6. **Transférabilité et attractivité pour un acheteur (C).**
   - Ce qui se transfère, et comment : code et propriété intellectuelle, domaine, marque, site, données clients (RGPD), contrats et abonnements Stripe, hébergement, intégrations ou comptes partenaires (une app marketplace se transfère-t-elle ?), support, canaux d'acquisition.
   - Ce qui détruit la valeur : dépendance au fondateur, à une plateforme, concentration client.
   - Acheteurs probables.
   - Points d'audit (due diligence) d'un acheteur.
7. **Risques et difficultés concrètes** de développement et de maintenance ; dépendances.
8. **Notes grille v3**, critère par critère, avec étiquettes, et la cause de chaque écart avec `P7-rescreen-scores.csv`.
9. **Plan de validation sur 30 jours** (avant tout code) :
   - où trouver les premiers clients, comment les contacter légalement ;
   - problème à confirmer en entretien, avec les questions sur le comportement passé ;
   - proposition de valeur ;
   - test de prix ;
   - premiers paiements (précommande, service manuel facturé, acompte) ;
   - **seuils GO et STOP chiffrés** ;
   - budget.
10. **Conditions qui feraient monter ou baisser la piste au classement.**

## Livrables
- `P7-DD-<id>.md`
- `P7-DD-<id>-preuves.csv` (en-tête EXACT de `brief-phase7.md`, ids `P7D<id>-P01`…)

Réponse finale < 250 mots : note v3, les 3 preuves POUR et CONTRE les plus fortes, le JSON économique, verdict.
