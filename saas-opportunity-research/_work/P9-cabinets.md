# P9L30 : cabinets d'expertise comptable positionnés e-commerce / marketplaces (piste N06)

Date : 2026-10-30. Préfixe : P9L30. Fichiers : `P9-cabinets.csv` (liste), `P9L30-preuves.csv` (une preuve par cabinet, format du brief).

## Résultat
- **22 cabinets retenus sur 30 visés : il en manque 8.** Je n'ai rien complété avec des cabinets dont le positionnement marketplace n'apparaît pas dans un extrait.
- **Priorité A (8)** : Hayot Expertise (Paris), Nexco (Paris), Auctus Compta (IdF), Kapsens (Nantes), GT Expertise (Saint-Mandé), E-Cab (Bas-Rhin), Belho Xper (Lyon), Cantini (Bordeaux).
- **Priorité B (6)** : HR Associés, Excilio, Eurofiscalis, AdvizExperts, Kardynal, Collectif EARN.
- **Priorité C (8)** : Cecca, Baker Tilly, Cerfrance Gascogne Occitane, L-Expert-Comptable.com, LS Compta, Keobiz, Dougs, Amarris E-commerce. Ce sont de gros réseaux ou des cabinets en ligne déjà outillés.
- [F] Hayot Expertise décrit presque mot pour mot la douleur visée par N06 : relevés de règlement, plus de 30 types de transactions, comptes passerelles par marketplace, rapprochement de chaque virement. C'est le premier cabinet à interroger.
- [E] La plupart des cabinets cités utilisent Pennylane. L'outil N06 devrait donc sortir au minimum un format importable dans Pennylane.

## Méthode
- J'ai fait 45 requêtes WebSearch. Une requête a échoué sur la limite d'usage et a été relancée après réinitialisation.
- **WebFetch est bloqué** : un essai a renvoyé ENOTFOUND sur www.google.com. Tout repose donc sur les extraits et synthèses de WebSearch, sans lecture des pages complètes.
- **Critère de rétention** : le cabinet se présente comme cabinet d'expertise comptable, et un extrait montre un accompagnement e-commerce citant des marketplaces (Amazon, Cdiscount, ManoMano, eBay, Etsy…) ou les « marketplaces » en général.
- **Champs du CSV** :
  - « extrait_preuve » : citation entre guillemets quand l'extrait est textuel, paraphrase signalée sinon.
  - « logiciel » et « automatisation » : uniquement ce qui figure dans un extrait, sinon « non relevé ».
  - « contact_professionnel » : **non relevé pour les 22 cabinets**. Aucune URL de page contact ni aucun e-mail générique n'est apparu textuellement dans un extrait, et rien n'a été déduit. Au premier contact, on passera par le formulaire du site (url_site).
  - « inscription_ordre » : **non vérifié pour les 22 cabinets**. L'annuaire de l'Ordre n'a pas pu être consulté, faute de WebFetch. « Revendiquée » signifie que le cabinet l'affirme lui-même.

## Requêtes utilisées (résumé)
- **Requêtes génériques** :
  - expert-comptable e-commerce Amazon vendeurs marketplace ;
  - expert comptable marketplace Cdiscount ManoMano ;
  - comptabilité Amazon FBA expert-comptable ;
  - expert-comptable TikTok Shop Amazon Pennylane ;
  - expert-comptable vendeurs Mirakl ;
  - « expert-comptable » « Amazon » « Cdiscount » ;
  - « marketplaces » « ManoMano » ;
  - « Amazon » « Etsy » « eBay » ;
  - « expert-comptable Amazon » ;
  - cabinet comptable pour vendeurs Amazon et Cdiscount rapprochement versements ;
  - expert-comptable Order Invoicer / Synchron (aucun cabinet partenaire trouvé).
- **Requêtes par ville** : Paris, Lyon, Marseille, Lille, Bordeaux, Nantes, Toulouse, Strasbourg, Rennes, Grenoble, Nice, Montpellier, Aix, Rouen, plus des requêtes par région.
- **Requêtes nominatives** : Webforme, LS Compta, Amarris, Dougs, Keobiz, Excilio, HR Associés, Cecca, Kapsens, E-Cab/EARN, Belho Xper, Clementine, In Extenso/Fiducial/Ça Compte Pour Moi, expert-comptable-e-commerce-lyon.fr.

## Écartés ou à confirmer (hors CSV)
- **Alix Meunier-Pascal (Finalib, Montpellier)** : l'URL contient « test014 ». C'est probablement une fiche de test ou fictive, à ne pas utiliser.
- **Clementine** : cabinet inscrit, mais aucune offre marketplace (Amazon n'est cité que comme dépense).
- **Ça Compte Pour Moi, Numbr, In Extenso, Fiducial** : aucune preuve e-commerce/marketplace dans les extraits.
- **Aix Expertise Comptable** et **Cabinet Debat (Toulouse, article de 2018)** : e-commerce mentionné, mais aucune marketplace dans l'extrait. À confirmer.
- **AVASK** : cabinet TVA/compta e-commerce, mais son statut de cabinet inscrit en France n'est pas établi.
- **Exclus par nature** : Webforme (introuvable), Pennylane, Legalplace, Swapn, Cockpit (éditeur), et les freelances Malt/Fiverr (personnes physiques, inscription inconnue).
- **expert-comptable-e-commerce-lyon.fr** : une synthèse l'attribue à Excilio, sans certitude. Pas compté séparément.

## Limites
- **Sources** : uniquement des pages commerciales des cabinets ou des comparatifs (souvent affiliés). Chiffres de clients, avis et tarifs ne sont pas vérifiés.
- **Extraits** : certains « extraits » sont des synthèses du moteur et non des citations. Ils sont marqués « paraphrase » et la confiance est fixée à « faible » dans `P9L30-preuves.csv`.
- **Localisation** : l'implantation est parfois déduite d'un annuaire (Kapsens, HR Associés, E-Cab). Pour E-Cab, le rattachement du domaine à la SARL d'Oberhausbergen est une hypothèse [H].
- **Pages villes** : celles d'Excilio, L-Expert-Comptable.com et EARN sont du référencement local, pas des bureaux.
- **Couverture** : aucun cabinet spécialisé trouvé à Marseille, Lille, Rennes, Grenoble, Nice ou Montpellier.
- **Pour atteindre 30**, il faudrait :
  - consulter l'annuaire de l'Ordre (experts-comptables.fr), ce qui demande d'ouvrir le réseau ;
  - utiliser les listes de partenaires Pennylane ou Tiime filtrées sur l'e-commerce ;
  - utiliser LinkedIn, en saisie manuelle.

## Conformité RGPD de la collecte
- **Données collectées** : uniquement des données professionnelles publiées par les cabinets eux-mêmes (raison sociale, ville, URL, positionnement, logiciel affiché). Aucun nom de personne physique n'est retenu comme contact, aucun e-mail nominatif, aucune donnée comptable réelle.
- **Base légale envisagée** [H] : intérêt légitime (art. 6.1.f RGPD) pour une prospection B2B ciblée et liée à l'activité professionnelle des destinataires.
- **Information des personnes** : les données ne sont pas collectées auprès des personnes, donc l'art. 14 RGPD s'applique. L'information doit être fournie au plus tard au premier contact, et dans un délai d'un mois au maximum. Elle doit indiquer :
  - l'identité du responsable ;
  - les finalités et la base légale ;
  - les catégories de données et leur source (site public du cabinet) ;
  - la durée de conservation ;
  - les droits d'accès, de rectification, d'effacement et d'opposition, ainsi que le droit de réclamation auprès de la CNIL.
- **Prospection électronique** : en B2B, la règle CNIL admet l'e-mail sans consentement préalable si le message est en rapport avec la profession du destinataire et qu'un lien d'opposition simple figure dans chaque message [à confirmer auprès de la CNIL ; non sourcé dans cette passe].
- **Minimisation et conservation** [H] : supprimer les lignes non contactées ou sans suite au terme de la phase de validation, par exemple sous 3 ans au plus pour un prospect inactif, conformément aux recommandations CNIL à confirmer.
- **Aucun contact n'a été effectué.**
