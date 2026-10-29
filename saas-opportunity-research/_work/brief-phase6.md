# Brief commun — Phase 6 (audit critique, recherche d'opportunités à fort potentiel)

Date : 2026-10-29. Langue : français.

## Pourquoi cette phase
La 1re étude (fichiers dans /home/user/relanzio/saas-opportunity-research/) a conclu « AUCUNE IDÉE VALIDÉE » et recommandait de tester D-37 (preuves Qualiopi et sous-traitance pour petits organismes de formation), puis E-13 (relance de devis TPE).

Le porteur a apporté des preuves nouvelles :
- le « Portail des Formateurs » du SYCFI fait déjà la gestion de la sous-traitance Qualiopi pour 39 € HT/mois ;
- Digiforma gère déjà les contrats de sous-traitance, la signature et l'émargement des apprenants et formateurs.

Il pose une nouvelle question : **quelle idée mérite plusieurs années de travail et peut devenir une entreprise importante**, et pas seulement un micro-SaaS de 30 à 450 k€ d'ARR ?

**Défaut de la 1re grille, reconnu** : aucun critère de taille ou de plafond, seulement 5 points sur 100 pour la marge et la récurrence. Elle favorisait donc des niches réglementaires minuscules.

## Profil du porteur (hypothèses)
- 1 à 3 personnes, technique, aidées par l'IA, capital modéré, francophone, basé en France.
- A déjà construit un SaaS Node/Supabase/Stripe/Brevo, sans client payant à ce jour.
- Prêt à travailler plusieurs années. Une levée de fonds **ultérieure** n'est pas exclue si la traction la justifie.

## Leçons de la 1re étude (à appliquer impérativement)
- Toutes les pistes ont perdu 7 à 22 points dès qu'on a cherché les preuves contraires. Les causes :
  - un outil **gratuit** existait (État, concurrent, plateforme imposée) ;
  - un **éditeur en place** intégrait la fonction ;
  - la distribution vers les US était irréaliste depuis la France ;
  - les sources étaient intéressées.
- **Catalyseur réglementaire ≠ demande.** Une obligation qu'un Drive ou un outil public satisfait ne crée pas de marché logiciel.
- Au moins **40 % des recherches** doivent viser l'invalidation : offres gratuites, éditeurs en place, levées de fonds des concurrents, prix bas, reports réglementaires.
- **Interdit** : présenter une simulation d'acheteur ou un contenu marketing comme une preuve de volonté de payer. Les preuves de paiement acceptables sont :
  - des prix publics payés par des clients existants (chiffre d'affaires d'un concurrent, nombre de clients) ;
  - des budgets publics ou des appels d'offres ;
  - des dépenses externalisées mesurées (BPO, cabinets).

## Outils
- WebSearch fonctionne. WebFetch est BLOQUÉ (DNS refusé pour la plupart des domaines) : essaie une fois, puis travaille sur extraits et dis-le.
- N'invente jamais une URL, un chiffre, un prix, une citation ou un concurrent.
- Budget : 35 à 50 recherches.

## Nouvelle grille (v2 « entreprise importante »), notes de 0 à 10 par critère

| Critère | Poids |
|---|---|
| Douleur & budget existant | 15 |
| Fréquence / criticité | 5 |
| Qualité des preuves de **dépense réelle** | 15 |
| Distribution réaliste pour CE porteur | 10 |
| Lacune concurrentielle | 10 |
| Faisabilité d'un premier produit vendable en ≤ 4 mois | 5 |
| **Potentiel** : plafond d'ARR réaliste à 5-7 ans pour une équipe qui passe de 1 à 15 personnes, avec expansion (produits adjacents, paiements, pays) | 20 |
| Marge & récurrence | 5 |
| Timing | 5 |
| Défendabilité (données, réseau, système d'enregistrement, intégrations) | 5 |
| Risques maîtrisables | 5 |

Barème du **Potentiel** :
- 2 = < 1 M€ d'ARR ;
- 4 = 1 à 3 M€ ;
- 6 = 3 à 10 M€ ;
- 8 = 10 à 30 M€ ;
- 10 = > 30 M€.

Le calcul doit être **bottom-up** : nombre d'acheteurs × prix × pénétration plausible, avec des preuves de comparables (concurrents de taille connue, levées, CA publiés).

## Livrables (chemins dans ta consigne)
1. `<prefix>.md` :
   - méthode ;
   - pour CHAQUE candidat :
     - acheteur, problème, dépense actuelle observée ;
     - concurrents et financements ;
     - preuves POUR et CONTRE ;
     - calcul du potentiel ;
     - wedge initial pour une petite équipe ;
     - chemin d'expansion ;
     - notes v2 détaillées ;
     - principal risque mortel ;
     - test de 30 jours avec seuil d'arrêt ;
   - en fin de document : classement et éliminations motivées.
2. `<prefix>-preuves.csv`, avec l'en-tête EXACT :
   `id,opportunite_id,affirmation,url,titre,auteur_organisme,date_publication,date_consultation,extrait_ou_paraphrase,type,pertinence,fraicheur,confiance,sens`
   (sens : POUR / CONTRE / NEUTRE).

## Réponse finale
COURTE (< 250 mots) : fichiers ; candidats avec note v2 ; meilleur candidat et pourquoi ; les 2 preuves contraires les plus fortes.
