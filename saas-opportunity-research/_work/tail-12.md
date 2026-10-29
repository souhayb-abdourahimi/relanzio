
---

## 6. D-37 face à E-13, selon deux objectifs distincts

| Objectif | D-37 (sous-traitance Qualiopi) | E-13 (relance de devis) | Gagnant |
|---|---|---|---|
| **1. Le test le moins coûteux** | Il faudrait un concierge, et le test est rendu presque sans objet par la matrice : la lacune n'existe plus | Produit existant ; concierge payant à < 50 € et 40-80 h ; réponse en < 30 jours | **E-13** |
| **2. Le potentiel d'une entreprise importante** | 0,1 à 0,85 M€ d'ARR à 5-7 ans (9 000 à 18 000 acheteurs × 350-470 €/an × 3-10 %) ; potentiel 2/10 | 30-60 k€ d'ARR à 24 mois ; < 1 M€ même avec expansion, car chaque maillon est tenu ; potentiel 2-3/10 | **Aucun** |
| Note grille d'origine | 62,5 → 56 → **47,5** | 52 → **~50** | E-13 |
| Note grille v2 (avec potentiel) | **38,5** | **49,5** | E-13 |

**Conclusion** : être le **test le moins coûteux** ne fait pas d'E-13 un **projet qui mérite plusieurs années**. Le seul intérêt rationnel restant d'un test E-13 est de mesurer votre capacité à obtenir un paiement, qui est la variable la plus incertaine. Mais la découverte terrain (§7) mesure aussi cette capacité, et elle le fait dans un marché au plafond plus haut. Le test E-13 n'est donc **pas prioritaire**. Option bornée, si vous voulez valoriser Relanzio : proposer la fonction comme module ou intégration à 3 éditeurs BTP qui n'ont pas la relance automatique (Tolteck, Batappli, Costructor) ; **5 h au maximum, arrêt sans réponse positive**.

## 7. Plan des 30 prochains jours (remplace `10-validation-30-jours.md`, conservé pour mémoire)

| Jours | Action | Mesure | Seuil d'arrêt (écrit avant) |
|---|---|---|---|
| J1 | **Inventaire des accès** : lister les secteurs où vous pouvez joindre ≥ 20 décideurs par votre réseau | Nombre de contacts par secteur | — |
| J2-J5 | Si un secteur a ≥ 20 contacts : préparer 15 entretiens de découverte dans ce secteur. **Sinon** : propreté, NAF 81.21Z, entreprises de 10 à 200 salariés dans 2 départements | — | — |
| J2-J5 | Relever les prix et modules des éditeurs en place (pour la propreté : Progiclean/Senef, Penbase, Dalyo Clean, PROPRET, Organilog), sur leurs documents publics ou en démo **en vous présentant honnêtement** | Grille de fonctions et de prix | — |
| J5-J25 | 60 appels → 15 entretiens de 20 minutes, sur le **comportement passé** : outil actuel et prix ; ce qui fait perdre de l'argent chaque mois ; **tout ce que l'entreprise paie déjà à l'extérieur** (expert-comptable, intérim, contrôle qualité, recouvrement, logiciel) ; changement de logiciel déjà vécu | Douleurs payées, récurrentes, non couvertes par les éditeurs relevés | **> 50 %** déjà équipés d'un outil dédié et satisfaits → STOP du secteur |
| J15-J28 | Seulement si une douleur non couverte revient chez **≥ 5 entreprises sur 15** : proposer une précommande payée ou un service facturé (ex. 3 mois à 5 €/agent pour la propreté, ou une prestation manuelle) | Paiements | **< 2 paiements** → STOP ; prix médian accepté < 3 €/agent (propreté) → STOP |
| J30 | Comité : continuer le secteur (vérifier alors la piste par ≤ 10 recherches d'invalidation), changer de secteur (deuxième et dernier sprint), ou arrêter | — | À 90 jours : **0 paiement** → le problème est la distribution (voir la décision) |

- Budget : < 50 €, aucun code.
- **Aucun contact n'est pris et aucun message n'est envoyé sans votre accord.**

## 8. L'objectif initial a-t-il été atteint ?
**Non.** L'objectif était de « découvrir la meilleure opportunité SaaS parmi tous les marchés ». Ce qui a été produit :
- **Une carte d'élimination solide.** Environ 240 opportunités ont été examinées (206 en phase 1, 31 en phase 6). 13 pistes ont reçu une due diligence complète ou un audit, et 3 red teams ont été menées. Plus de 40 éliminations sont motivées par des preuves contraires sourcées : outil gratuit, éditeur financé, obligation suspendue ou non contraignante.
- **Aucune opportunité qui mérite plusieurs années.** Ni dans les finalistes initiaux, ni dans la nouvelle recherche orientée potentiel.

**Pourquoi l'objectif n'a pas été atteint** (causes, de la plus importante à la moins importante) :
1. **La grille de départ ne mesurait pas le potentiel.** Aucun critère de taille, 5 % seulement pour la marge et la récurrence. Le brief de phase 1 orientait vers les obligations documentaires, d'où une sélection de niches réglementaires à petit plafond, où une feuille Excel ou un outil public suffit. Corrigé en phase 6 (grille v2, potentiel à 20 %), mais tard.
2. **La recherche documentaire ne peut pas observer la volonté de payer d'un nouvel entrant.** C'est pourtant la preuve que la grille exige. Toutes les notes plafonnent donc à « plausible ».
3. **Les fausses lacunes.** Une absence de résultat sur un mot-clé vertical a été prise pour une absence d'acteur, trois fois. Les éditeurs multi-verticaux (Senef) et les sociétés privées non financées (Portail des Formateurs, Penbase, CertiSkool) restent invisibles à ces requêtes.
4. **L'environnement.** Aucune page n'a pu être ouverte (WebFetch bloqué) ; toutes les preuves sont des résumés de moteur.
5. **La couverture.** Faible hors US/UE (Inde, Amérique latine, Asie) et faible sur plusieurs secteurs (`01`, `11`).

**Ce qu'il serait irrationnel de faire** : prolonger la recherche documentaire en espérant qu'un 4e tour trouve « la » lacune. La valeur attendue est faible, voire négative : chaque tour a produit de nouvelles lacunes illusoires.

## 9. Règles ajoutées à la méthode
1. Toute lacune fondée sur « aucun X trouvé » est notée **au plus 5/10** au critère Lacune. Elle est publiée avec ses requêtes exactes et soumise à une recherche nominative sur les éditeurs multi-verticaux (paie, planning, ERP de services) avant d'entrer dans une note.
2. **Catalyseur ≠ demande.** Une obligation ne compte en Preuves que si un payeur dépense déjà pour la satisfaire.
3. Une note n'est comparable qu'au-delà de **± 5 points** ; en deçà, on départage par le coût et la vitesse du test.
4. Le critère **« accès du porteur à l'ICP »** est ajouté à la distribution.
5. Aucune recommandation d'engagement sans **au moins un paiement observé**.

## 10. Journal des corrections
