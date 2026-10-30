## A. Questionnaire de découverte (entretien de 25 minutes, visio ou téléphone)

Règles d'entretien :
- **On parle du passé, pas des intentions** : « la dernière fois », « le mois dernier », « montrez-moi ».
- On ne présente pas la solution avant la question 14.
- On note les verbatims mot pour mot.
- **Aucune donnée client n'est demandée ni reçue pendant l'entretien.**

### Bloc 1 — Contexte (qualification)
1. Combien de dossiers clients vendent sur des marketplaces (Amazon, Cdiscount, ManoMano, Leroy Merlin, Fnac, autres) ? Lesquelles reviennent le plus ?
2. Quel logiciel de production comptable utilisez-vous pour ces dossiers (ACD, Sage, Cegid/Quadra, Pennylane, autre) ? Tous les dossiers sont-ils sur le même ?
3. Qui traite ces dossiers dans le cabinet (collaborateur, assistant, expert) ? À quel rythme (mensuel, trimestriel, annuel) ?

### Bloc 2 — Workflow actuel (« montrez-moi la dernière fois »)
4. Prenons le dernier dossier marketplace que vous avez traité : par quoi avez-vous commencé ? Quels fichiers avez-vous récupérés, et auprès de qui (client, back-office vendeur, banque) ?
5. Comment avez-vous transformé un versement en écritures ? Excel, saisie manuelle, outil, macro, n8n, connecteur ?
6. Comment avez-vous rapproché le versement du virement bancaire ? Que faites-vous quand ça ne tombe pas juste ?
7. Comment traitez-vous la TVA (ventes FR, UE, OSS, marketplace « vendeur réputé ») ?

### Bloc 3 — Douleur mesurée
8. Combien de temps a pris ce dossier, ce mois-là ou à la clôture ? Combien de dossiers comme celui-là par mois ou par an ?
9. Ce temps est-il facturé au client, ou absorbé dans le forfait ?
10. Racontez-moi la dernière erreur ou le dernier écart non expliqué sur un dossier marketplace : qu'est-ce que ça a coûté (temps, relance client, redressement) ?

### Bloc 4 — Solutions essayées
11. Qu'avez-vous déjà essayé (Order Invoicer, Synchron.io, connecteur Pennylane, A2X, outil maison, sous-traitance de saisie) ? Pourquoi l'avez-vous gardé ou abandonné ?
12. Combien payez-vous aujourd'hui pour ces outils ou ce temps ?
13. Si ce problème disparaissait demain, que feriez-vous du temps libéré ?

### Bloc 5 — Test d'engagement (seulement après le bloc 4)
14. Présentation en 2 minutes : « un traitement des versements à partir des exports bruts, livré dans le format d'import de votre logiciel, avec une vue des écarts par dossier ». Qu'est-ce qui vous semble utile ou inutile ?
15. Accepteriez-vous une démonstration de 20 minutes sur des **données fictives** de votre marketplace la plus fréquente ? (→ **démonstration réservée**)
16. Si le pilote vous fait gagner X h/mois, quel prix mensuel jugeriez-vous raisonnable ? Cher ? Trop cher pour ne pas même essayer ? (Van Westendorp simplifié, sur des réponses réelles)
17. Seriez-vous prêt à signer un pilote payant d'un mois sur 1 ou 2 dossiers, avec un accord de confidentialité et un contrat de sous-traitance RGPD ? (→ **intention d'achat écrite**)

### Grille de notation après l'entretien (remplie le jour même)

| Champ | Valeur |
|---|---|
| Dossiers marketplace | nombre |
| Logiciel de production | nom |
| Minutes par dossier et par mois (déclaré) | nombre |
| Temps facturé ou absorbé | F / A |
| Outil actuel et satisfaction | 1-5 |
| Douleur (1 = aucune, 5 = critique) | justifiée par un verbatim |
| Démo réservée | oui / non |
| Intention écrite | oui / non |
| Paiement | oui / non |

## B. Protocole de démonstration (données fictives uniquement)

1. **Jeu de données synthétique** construit à partir des **documentations publiques** des exports :
   - 1 vendeur fictif (« SARL Démo Maison ») ;
   - 2 marketplaces ;
   - 3 versements sur un mois.
   - Il contient : ventes, commissions, frais d'abonnement, 1 retour, 1 remboursement partiel, 1 retenue ou réserve, et 1 écart volontaire.
   - Aucun nom réel de client final, aucun identifiant réel.
2. **Livrable démontré** :
   - (a) le tableau de décomposition du versement ;
   - (b) les écritures produites dans **un seul** format d'import, celui du logiciel du prospect s'il est couvert, sinon un CSV paramétrable ;
   - (c) l'état versement ↔ virement avec l'écart mis en évidence.
3. **Déroulé en 20 minutes** :
   - 3 min : rappel de son workflow ;
   - 10 min : démonstration ;
   - 5 min : ses objections ;
   - 2 min : proposition de pilote.
4. **À ne pas faire** :
   - pas de capture d'écran de dossier réel ;
   - pas d'import de données du prospect en séance ;
   - **pas de promesse de format, de marketplace ou d'automatisation non encore vérifiés.**
   - Si le prospect demande un format non couvert, il est noté comme **demande**, pas comme engagement.
5. Après la démo : envoyer un compte rendu de 5 lignes et la proposition de pilote écrite.

## C. Protocole de mesure du temps réel de traitement d'un dossier (pilote)

**But** : remplacer les hypothèses de `P9-modele-temps.md` par des mesures.

1. **Unité mesurée** : 1 versement d'une marketplace pour 1 dossier.
2. **Chronométrage** par tâche, au chronomètre et saisi dans un tableur de 9 colonnes :
   - réception des fichiers ;
   - préparation (nettoyage et contrôle) ;
   - décomposition ;
   - mapping des comptes et des codes TVA ;
   - génération du fichier d'import ;
   - rapprochement du virement ;
   - traitement des exceptions (type d'exception noté) ;
   - échanges avec le cabinet ;
   - contrôle final.
3. **Classement de chaque versement** :
   - **standard** : aucune intervention hors règles ;
   - **exception** : nouveau type de ligne, écart, fichier incomplet, TVA ambiguë.
   - On note la cause.
4. **Mesures dérivées** à la fin du pilote :
   - minutes médianes par versement standard et par exception ;
   - taux d'exception ;
   - part du temps « automatisable » (règle répétable) contre « jugement comptable » ;
   - nombre de types de lignes rencontrés par marketplace.
5. **Volume minimum pour conclure** : au moins 30 versements, au moins 2 marketplaces, au moins 2 dossiers. En dessous, on conclut « indéterminé ».
6. **Projection** : les mesures sont réinjectées dans `_work/p9_temps.py` (paramètres `exc`, `min_exc`, `min_ctrl`) pour recalculer les heures par semaine à 21 cabinets.
