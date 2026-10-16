# Pilote entretien chaudière — plan avant implémentation

16 octobre 2026 — proposition à valider. Aucun code produit modifié, aucune mutation fournisseur.

## Objectif et limites

Préparer les trois premiers clients payants d'un service manuel assisté : diagnostic gratuit, puis campagne à 190 € en paiement unique, 500 contacts maximum, deux emails maximum par personne (J0 et J+10), rapport à J+21. Aucun abonnement, aucune garantie de rendez-vous. Paiement après validation des textes. Reprendre dans les conditions en revue les garanties du document métier : remboursement si moins de 100 contacts finalement autorisés ou absence d'envoi sous 10 jours ouvrés après validation des textes. Ne pas ouvrir le paiement tant que le calendrier et les autorisations ne permettent pas de tenir cet engagement.

La demande actuelle prévaut sur le texte joint autorisant un déploiement : livraison par PR vers main, sans fusion, sans déploiement, sans email/SMS réel, sans modification de configuration de production. Aucune donnée de client final pendant la QA. Les informations professionnelles de demande de diagnostic sont distinctes des données des clients finaux et font l'objet d'une notice spécifique.

Diagnostic par questionnaire structuré et compteurs agrégés dans cette première version. C'est une des variantes du cadrage et cela évite de construire un import CSV avant validation commerciale. Aucun champ libre pour raconter les dossiers clients, aucune pièce jointe. Le diagnostic fournit une estimation déclarative, jamais une autorisation juridique d'envoi. Les sources métier prévoient des anciens clients gaz/fioul hors contrat : ils restent pending_legal_validation et ne sont pas comptés comme envoyables. PAC hors contrat, prospects et autres cas exclus restent exclus. Un contrat déclaré ne suffit pas à approuver une campagne.

## État vérifié

- Dépôt : souhayb-abdourahimi/relanzio ; main = 380e6c7079a638ee8106ef8b8755c8484969a147.
- Production Railway : branche staging, déploiement réussi 02c9f855-324b-4034-a492-84d872715563, commit e41f13886358c1d05c4a099a5e462abce53b6225. Source et branche confirmées dans la configuration en lecture seule.
- staging est en avance de 334 commits, 112 fichiers diffèrent. Une PR issue de main ne prouve donc pas à elle seule l'absence de régression en production. Aucun rapprochement de branches n'est inclus.
- Région applicative Railway : sfo ; bucket de sauvegardes : ams. Cela ne permet pas de promettre un traitement exclusivement européen. Région Supabase, accès, sous-traitants et conservation des sauvegardes restent à vérifier avant données réelles.
- Branche locale dédiée créée : codex/pilote-entretien-190, issue de main. Aucune publication distante effectuée.
- Les quatre fichiers de tests existants sur main s'exécutent avec succès. Pas de build, de test navigateur ou de test d'intégration effectué à ce stade.

## Architecture choisie

Conserver React/Vite, Express et Supabase. Ajouter un module server/maintenance-pilot et une page client dédiée. Aucun nouveau service, portail artisan, ordonnanceur ou outil de prospection. Les opérations de préparation et de suivi passent par des routes administrateur dédiées et une procédure documentée ; la gestion reste manuelle pour trois clients.

Réutiliser requireUser dans server/auth.js et le client serveur de server/db.js, sans changer leurs contrats. Le client serveur utilise service_role : chaque accès pilote doit donc vérifier explicitement le rôle opérateur et le dossier visé, en complément de RLS. Ne pas réutiliser les tables quotes, followups, prospects ou outreach_queue. Ne pas importer generateFollowup, analyzeReply ou les traitements IA. Ne pas brancher le pilote sur les crons existants.

Le transport Brevo existant fournit un exemple de senderName/replyTo ; son module mélange transport et IA et ne sera pas importé dans le pilote. La livraison contient uniquement un adaptateur de simulation, sans appel réseau Brevo. Une future activation réelle nécessitera un changement revu séparément en plus des autorisations humaines : un simple flag ne permettra pas d'envoyer.

Trois gates indépendantes, false par défaut : MAINTENANCE_PILOT_VISIBLE, MAINTENANCE_PILOT_PERSONAL_DATA_ENABLED, MAINTENANCE_PILOT_SENDS_ENABLED. Ajouter MAINTENANCE_PILOT_PAYMENTS_ENABLED, également false. Les verrous sont vérifiés par le serveur ; l'affichage du navigateur n'accorde aucun droit. Un paiement ou une demande ne crée aucun envoi. Même si les flags sensibles sont mal configurés, les adaptateurs réels d'import et d'envoi non livrés restent indisponibles.

## Fichiers et étapes

### 1. Isolation et modèle de données

Créer server/maintenance-pilot/config.js, validation.js, repository.js et routes.js. Ajouter une migration additive générée par la CLI Supabase sous supabase/migrations/ pour les tables maintenance_pilot_cases, maintenance_pilot_payments, maintenance_pilot_events et maintenance_pilot_deliveries. Les deux dernières servent à l'audit et aux preuves de simulation ; aucun nom/email de client final n'y est accepté dans cette version.

Un dossier porte son identifiant, le contact professionnel, les réponses agrégées, les statuts de validation, la version des textes et les dates. Les écritures sont serveur/opérateur uniquement. Le rôle opérateur est défini par une liste serveur MAINTENANCE_PILOT_OPERATOR_IDS d'identifiants Supabase vérifiés par requireUser, vide par défaut ; aucune valeur user_metadata ne donne ce rôle. Chaque dossier porte operator_id : un opérateur peut attribuer atomiquement un dossier non affecté à lui-même, puis ne consulter/modifier que ses dossiers. Aucun identifiant de propriétaire fourni par le navigateur n'est accepté. RLS activée, aucune lecture/écriture publique directe, pas de relation modifiant profiles ou les abonnements. Contraintes uniques sur session Stripe, événement fournisseur et (dossier, campagne, destinataire synthétique normalisé, étape). Les statuts et plafonds sont aussi contraints en base.

Modifier server/index.js uniquement pour monter les routes pilote, placer le webhook brut avant express.json, isoler les événements Stripe et appliquer le verrou serveur à la page. Modifier .env.example pour documenter les valeurs inactives. Aucun appel à la base au démarrage du module désactivé : le SaaS doit rester opérationnel avant application de la migration.

Tests : test/maintenance-pilot-gates.test.js et test/maintenance-pilot-db.test.js. Prouver les refus 401/403, le refus d'un dossier tiers, l'absence d'accès direct par anon/authenticated, l'impossibilité de contourner les gates via l'API et le démarrage sans migration lorsque le pilote est désactivé. Appliquer et vérifier la migration uniquement dans une base locale jetable.

### 2. Offre et diagnostic

Créer client/src/MaintenancePilot.jsx, client/src/maintenance-pilot.css et server/maintenance-pilot/diagnostic.js. Modifier client/src/main.jsx uniquement pour la route /rappel-entretien, placée avant la redirection des utilisateurs connectés vers leur dashboard. Styles bornés à la page pilote.

Questionnaire public : email professionnel de retour, nom d'entreprise borné, taille d'équipe, outil de rappel existant et compteurs par groupe. Champs inconnus rejetés, nombres entiers cohérents, plafonds de taille, refus des pièces jointes. Pas de compte SaaS requis et aucune inscription automatique. Limiteur propre au pilote, réponse générique en cas d'erreur et protection contre les doublons de soumission. Aucun email de confirmation automatique.

Résultat : sous contrat déclaré / hors contrat à examiner / informations insuffisantes / exclus. Pas de formulation « légalement éligible ». Validation humaine finale sous 48 h ouvrées. Afficher clairement 190 €, les limites, les conditions, l'identité professionnelle issue des paramètres publics existants et les fonctionnalités encore verrouillées. Ne pas affirmer un hébergement UE déjà vérifié. Bloquer la publication commerciale si l'identité ou les conditions ne sont pas validées.

Tests : test/maintenance-pilot-diagnostic.test.js, test/maintenance-pilot-routes.test.js et test/maintenance-pilot.browser.spec.js. Inclure formulaires malformés, compteurs incohérents, champs surnuméraires nom_client/email_client, données surdimensionnées, soumission répétée, absence de stockage sur échec. Vérifier page connectée/déconnectée, clavier et absence de débordement à 390×844 et 412×915.

### 3. Paiement unique isolé

Créer server/maintenance-pilot/billing.js. Checkout mode payment, 19000 centimes, EUR, quantité 1, sans promotion ni abonnement. Session créée uniquement par un opérateur pour un dossier approuvé, après validation des textes et contrôle de disponibilité. Produit/prix pilote séparé ; aucune mutation du produit Pro, aucun partage d'identifiant client Stripe avec profiles. Métadonnées dédiées pilot_case_id et purpose=maintenance_pilot, sans user_id interprétable comme abonnement.

Le webhook pilote dédié vérifie signature, mode, montant, devise, dossier, session et état paid. Il enregistre le paiement et l'événement atomiquement, avec reprise sûre après panne ; le retour navigateur ne valide jamais le paiement. Ajouter au webhook SaaS de server/index.js une exclusion explicite des événements pilote ; conserver les événements Pro existants. Ne pas changer la politique générale de facturation.

Tests : test/maintenance-pilot-billing.test.js. Doubles clics, événements répétés/concurrents/désordonnés, mauvaise signature, montant ou devise incorrects, session inconnue, annulation, paiement non abouti et panne de base. Prouver qu'un paiement pilote ne change ni plan, ni essai, ni abonnement Pro. QA avec Stripe simulé ; test Stripe sandbox seulement si un environnement test isolé est disponible. Aucun Checkout Live créé pendant cette mission. Le client pilote utilise une clé test dédiée et refuse toute clé Live avant appel réseau, même si le flag paiement est activé ; les événements livemode=true sont refusés sur son endpoint. L'activation du paiement réel exigera une modification explicite revue et autorisée, après disponibilité effective de la prestation. Ne jamais utiliser automatiquement STRIPE_SECRET_KEY du SaaS pour le pilote.

### 4. Préparation de campagne et protections

Créer server/maintenance-pilot/campaign.js, templates.js et simulations.js. Préparer les deux textes sans IA, les groupes, dates, expéditeur, reply-to et leur approbation versionnée. Toute modification de ces éléments invalide l'approbation. Les simulations utilisent exclusivement des adresses en .invalid et des données fictives.

J+10 est calculé depuis le premier envoi effectivement confirmé dans la simulation. Maximum deux tentatives acceptées comme envois par destinataire/campagne ; doublons d'adresse normalisés. Claim atomique et contrainte unique par étape. En cas de résultat fournisseur indéterminé, statut unknown_delivery, blocage et rapprochement manuel : aucun renvoi automatique. Les STOP, rebonds définitifs, plaintes et réponses neutralisent la suite. Vérifier de nouveau les oppositions et l'approbation au moment du claim.

Les réponses vont à l'artisan ; le système ne peut donc pas supposer qu'il connaît toutes les réponses reçues. Avant J+10, imposer une confirmation humaine récente du relevé des réponses ; toute réponse/STOP invalide ce feu vert. Aucun accès IMAP de l'artisan, aucun transfert de contenu vers l'IA. Préparer les interfaces de STOP et de demande de RDV avec jetons opaques, affichage sans effet sur GET et action explicite idempotente ; leur usage réel reste verrouillé avec les données nominatives.

Expéditeur futur : adresse contrôlée et authentifiée, nom « Entreprise via Relanzio », reply-to validé de l'artisan. Ne jamais usurper son adresse. Authentification du domaine et capacité de réception vérifiées humainement avant un envoi réel.

Tests : test/maintenance-pilot-campaign.test.js. Concurrence, même adresse deux fois, J+10 prématuré, troisième message, STOP/reply entre préparation et claim, modification après approbation, timeout fournisseur, reprise après crash. Vérifier zéro appel réseau, même avec les flags activés, et absence de raccordement aux crons existants.

### 5. Données réelles, rapport et exploitation

Créer server/maintenance-pilot/report.js et scripts/maintenance-pilot-purge.mjs. Rapport agrégé : envois, délivrabilité, rebonds, oppositions, réponses, demandes et RDV déclarés, sans inventer de résultats. Export CSV neutralisant les formules. Rapport à J+21 ; liste STOP restituée à l'artisan lors d'une future campagne réelle.

Préparer dans docs/maintenance-pilot/operations.md les étapes avant premier fichier : contrat/DPA en revue, instructions, paiement, périmètre juridique, régions, sous-traitants, MFA, stockage privé, isolation par dossier, URL signée courte, limites MIME/taille, aucune copie locale, aucune IA, journal sans données nominatives. L'endpoint de fichier réel répond locked ; aucun bucket ni URL d'upload réel n'est créé. La procédure et les tests de refus sont livrés ; la sécurité d'un stockage réel n'est pas déclarée validée sans test réel ultérieur dans un environnement isolé.

Choix proposé de conservation : réponses détaillées au questionnaire supprimées après 7 jours, contact professionnel/dossier non converti après 30 jours ; agrégats sans identifiant éventuellement conservés. Après activation future : fichiers et données opérationnelles supprimés au plus tard 30 jours après fin de campagne, après restitution du rapport/STOP. Les preuves comptables sont séparées et leur conservation précisée dans les conditions. Une suppression partielle échoue explicitement ; aucune attestation émise avant confirmation de chaque système et traitement des sauvegardes documenté.

Tests : test/maintenance-pilot-report.test.js et test/maintenance-pilot-purge.test.js : échéances, export dangereux, échec/reprise de purge, impossibilité d'attester une suppression incomplète, maintien des oppositions jusqu'à restitution. Les textes juridiques sont des projets à revoir, pas des documents réputés approuvés.

### 6. Validation et PR

Ajouter les tests au parcours npm run check et une vérification navigateur dédiée, avec dépendances de test minimales si nécessaires. Exécuter npm ci, npm run check, npm run build, tests base locale et navigateur sur fixtures uniquement. Ne lancer aucun script qa-* hérité susceptible de contacter la production. Ne démarrer server/index.js qu'avec environnement nettoyé et dépendances isolées, car ses crons sont enregistrés à l'import.

Tester la PR sur main puis son intégration dans une copie locale jetable de e41f138, sans publication sur staging et sans intégrer ses 334 commits dans la PR. Résoudre uniquement les adaptations indispensables au pilote ; toute incompatibilité restante est un blocage de déploiement déclaré.

Publier la branche dédiée et créer une PR vers main sans fusion automatique, avec preuves, fichiers, migration non appliquée et limites. Avant publication, vérifier que les checks PR éventuels n'exposent pas les secrets ni ne déclenchent un environnement relié à la production. Aucune configuration Railway, Supabase, Stripe ou Brevo modifiée. Fournir un retour arrière par désactivation du pilote et revert de ses points d'entrée, sans suppression de tables existantes.

## Critères d'acceptation

1. Offre et demande de diagnostic fonctionnelles localement, résultats prudents et compréhensibles.
2. Paiement unique simulé à 190 €, indépendant de Pro, reconnu uniquement par webhook vérifié.
3. Aucun fichier client final accepté et aucun envoi réel possible dans la version livrée.
4. Erreurs, isolation, doublons, réponses, STOP, délais et purge vérifiés par tests comportementaux et transactions locales, pas seulement par recherche de chaînes dans le code.
5. Mobile et parcours existants vérifiés ; compatibilité avec le commit déployé documentée.
6. PR vers main, sans fusion ni déploiement. Ne pas déclarer le pilote « commercialisable en production » tant que la divergence de branches et les autorisations opérationnelles restent ouvertes.

## Risques et décision attendue

Le risque principal est la divergence main/production, devant le risque de mélange Stripe et celui de relancer une personne ayant répondu. L'isolation, le routage explicite des événements et la validation humaine de J+10 répondent à ces risques. La région applicative et les conditions juridiques sont des blocages d'exploitation réelle, pas des raisons d'élargir le développement.

Valider ce périmètre avant implémentation : questionnaire sans import CSV, opérations manuelles, simulation des campagnes, PR pilote seule vers main avec vérification séparée sur staging. Si vous souhaitez d'abord aligner main sur la production, cela doit être une opération distincte et explicitement autorisée ; elle n'est pas incluse ici.
