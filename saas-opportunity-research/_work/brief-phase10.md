# Brief commun — Phase 10 : découverte d'opportunités

Lis d'abord /home/user/relanzio/saas-opportunity-research/16-methodologie-decouverte.md. Il contient la méthode, les règles de preuve, la grille v4 et les contraintes du porteur. Respecte-le strictement.

Date : 2026-10-30. Langue : français.

## Outils
- WebSearch fonctionne.
- WebFetch est BLOQUÉ (DNS refusé) : essaie une fois, puis travaille sur extraits et dis-le.
- Recherche en français et en anglais, et dans d'autres langues si utile.
- **N'invente jamais** une URL, un prix, un chiffre, un avis, un témoignage, une fonctionnalité ou un concurrent.

## Ce que tu dois produire
Un **petit nombre de pistes bien étayées**, plutôt qu'une longue liste superficielle : **8 à 10 pistes**. Chaque piste est construite à partir d'un **problème observé**, pas d'une idée de produit.

Pour chaque piste :
1. **Description très précise** :
   - client cible et décideur payeur ;
   - problème concret, fréquence, coût actuel ;
   - ce qu'ils font aujourd'hui.
2. **Preuves de demande**, étiquetées [F] / [O] / [H] / [E] / [M] :
   - au moins **2 preuves indépendantes** (sources différentes, non dérivées l'une de l'autre) ;
   - preuves de **dépense actuelle** : salaires d'offres d'emploi, tarifs de prestataires, prix d'outils partiels, modèles payants.
3. **Concurrence sur 3 niveaux** (directe, indirecte, substituts) :
   - au moins **3 formulations de recherche** pour trouver un concurrent direct, et note-les ;
   - FR et EN, au minimum ;
   - recherche nominative des éditeurs multi-verticaux du domaine.
   - « Aucun concurrent trouvé » = incertitude, à écrire ainsi.
4. **Pourquoi les solutions existantes ne suffisent pas**, avec preuves (plaintes, demandes de fonctionnalités, limites documentées).
5. **Pourquoi la lacune pourrait ne pas exister.** Cherche activement : outil gratuit, fonction native d'un logiciel dominant, marché trop petit, problème toléré, profession réglementée.
6. **Innovation** (indice de 0 à 5, nouvelle catégorie oui / non / peut-être).
   - Pour une idée de catégorie C, réponds aux **7 questions** suivantes :
     1. Pourquoi impossible ou non pertinent avant ?
     2. Quel changement maintenant ?
     3. Qui en a besoin immédiatement ?
     4. Comment ils font aujourd'hui ?
     5. Pourquoi ils paieraient ?
     6. Quels obstacles à la copie ?
     7. Réalisable en solo ?
7. **Prix envisageable à tester** et justification (ancrages observés).
8. **Faisabilité en solo** (MVP, intégrations, support) ; **acquisition sans réseau** (où trouver les acheteurs, et comment les contacter légalement).
9. **Principal risque.**
10. **Notes grille v4** :
    - 7 critères de 0 à 10 ;
    - pour chacun, une confiance élevée / moyenne / faible ;
    - le total pondéré sur 100.

## Fichiers à écrire (préfixe donné dans ta consigne)
- `<prefix>.md` : les pistes, au format ci-dessus.
- `<prefix>-pistes.csv`, avec l'en-tête EXACT :
  `id,titre,categorie,client_payeur,probleme,depense_actuelle,concurrents_directs,substituts,lacune,innovation_0_5,prix_test,demande_25,insuffisance_20,concurrence_faible_15,acquisition_15,solo_10,rentabilite_10,revente_5,total_100,confiance_demande,confiance_globale,risque_principal`
  (notes de 0 à 10 pour chaque critère ; total pondéré)
- `<prefix>-preuves.csv`, avec l'en-tête EXACT :
  `id,opportunite_id,affirmation,url,titre,auteur_organisme,date_publication,date_consultation,extrait_ou_paraphrase,type,pertinence,fraicheur,confiance,sens`
  (type : F / O / H / E / M ; sens : POUR / CONTRE / NEUTRE)

## Réponse finale
COURTE (< 250 mots) : tes 3 meilleures pistes avec leur note v4 et leur confiance sur la demande, et la preuve la plus forte de chacune.
