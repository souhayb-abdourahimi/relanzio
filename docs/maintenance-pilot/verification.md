# Validation du pilote — 16 octobre 2026

PILOT CODE READY FOR REVIEW — NO REAL DATA / NO REAL SENDS / NO PRODUCTION DEPLOYMENT

**PR de revue uniquement. Pas prête à fusionner pour la production.** Aucun réalignement main/staging, aucune fusion, aucun déploiement, aucune migration distante ni configuration fournisseur modifiée.

## Bases vérifiées et résultats

| Vérification | Branche pilote issue de main 380e6c7 | Copie jetable exacte de e41f13886358c1d05c4a099a5e462abce53b6225 + adaptations |
|---|---|---|
| Installation verrouillée npm ci | PASS | PASS |
| npm run check | 40 tests, 40 PASS | 125 tests, 125 PASS |
| npm run build | PASS | PASS |
| Serveur compilé, pilote masqué puis visible | 2/2 PASS | 2/2 PASS après ajout à spaRoutes |
| Parcours navigateur pilote | 4/4 PASS | 4/4 PASS |
| Navigation mobile/desktop historique e41f138 | non présente sur main | 2/2 PASS |

Le navigateur vérifie 390×844, 412×915 et 1280×800, soumission, données envoyées, résultat, absence de débordement, erreur serveur et retour paiement non probant. Les tests UI utilisent des API simulées ; les routes serveur sont testées séparément avec des données fictives. Aucun compte utilisateur réel ni session de production n'a été utilisé.

Les tests SQL exécutent la migration dans PostgreSQL embarqué PGlite : permissions anon/authenticated, propriété, mises à jour avec révision, appels concurrents, rollback après donnée invalide, unicité de réservation Stripe, gel du texte, paiement répété et purge. PGlite sérialise les requêtes sur une instance ; ce n'est pas un essai de charge multi-connexion d'un serveur Supabase distant.

Les webhooks sont testés avec signatures Stripe fabriquées par le SDK et clés fictives. Aucun Checkout fournisseur n'a été créé, même en sandbox. Le transport Brevo est absent. Le test du vrai serveur bloque le réseau externe. Sur e41f138, le démarrage existant tente la maintenance des essais et la journalisation : ces appels ont été bloqués, puis le test a vérifié que les requêtes HTTP pilote n'ajoutent aucun accès externe.

Deux corrections de revue ont leurs régressions : une réservation de paiement unique par dossier avant appel Stripe, et conservation simultanée des signaux STOP/réponse/RDV/rebond/plainte.

## Adaptations spécifiques à e41f138

Le cherry-pick brut ne s'applique pas proprement. Trois fichiers en conflit ont été résolus dans la copie jetable seulement :

1. `client/src/main.jsx` : garder tous les imports/composants de production (dont useRef et les améliorations produit), ajouter seulement MaintenancePilot et sa route avant le dashboard connecté.
2. `server/index.js` : conserver entièrement le traitement Stripe de production. Insérer le filtre des événements pilote immédiatement après vérification de signature, **avant** la réservation dans stripe_webhook_events. Monter le routeur pilote avant express.json. Ajouter `/rappel-entretien` à la liste `spaRoutes` : sans cet ajout, le test du serveur compilé a échoué avec 404, puis passé après correction.
3. `.github/workflows/ci.yml` : conserver le test mobile historique, garder Playwright verrouillé plutôt que l'installation transitoire 1.55, ajouter les tests pilote et du serveur compilé.

Le patch `e41f138-integration.patch` décrit ces trois fichiers par rapport au commit e41f138 d'origine. **C'est un document d'intégration, pas un patch à appliquer sur main.** Il complète les fichiers dédiés de la PR et ne réimporte pas les 334 commits. La copie locale testée se termine au commit d01eca30c93a232cc44447679a14bfedbd4b53ca, sans publication de cette branche.

Aucune incompatibilité fonctionnelle non résolue n'a été observée dans ces tests après adaptation. Une application directe sans adaptation reste incompatible. Le futur déploiement demeure bloqué par l'absence de réalignement ou stratégie explicite, et doit être revérifié si la production évolue.

## Migration et sécurité

`supabase/migrations/20261016141934_maintenance_pilot.sql` : quatre tables dédiées (cases, payments, events, deliveries), RLS et droits limités, RPC de mise à jour atomique, réservation unique de Checkout, paiement et purge. Aucune table SaaS modifiée. Migration testée localement uniquement.

Les données finales réelles ne sont pas acceptées : endpoint de fichier verrouillé avant parsing, aucun bucket ni URL signé créé. Aucune sécurité de stockage réel n'est prétendue testée. Les coordonnées professionnelles du formulaire sont séparées du questionnaire agrégé. Aucun import CSV.

## Flags livrés

| Flag | Défaut | Capacité effective |
|---|---|---|
| MAINTENANCE_PILOT_VISIBLE | false | page/API masquées |
| MAINTENANCE_PILOT_PUBLICATION_APPROVED | false | formulaire bloqué avant revue |
| MAINTENANCE_PILOT_PAYMENTS_ENABLED | false | uniquement Stripe TEST si ouvert ultérieurement |
| MAINTENANCE_PILOT_PERSONAL_DATA_ENABLED | false | impossible même si configuré true |
| MAINTENANCE_PILOT_SENDS_ENABLED | false | impossible même si configuré true |

Liste opérateur et clés TEST vides. Aucune valeur de production modifiée. La lecture des noms de variables Railway ne montre aucune variable MAINTENANCE_PILOT existante ; la branche n'est pas déployée.

## Risques et actions restantes

- Écart main/staging critique : 334 commits, production connectée à staging. Décider le réalignement ou la stratégie avant toute fusion destinée à produire une release.
- Railway applicatif sfo : aucune promesse « exclusivement UE ». Vérifier Supabase, Brevo, sauvegardes et transferts avant ouverture réelle.
- Revoir et signer conditions, DPA, instructions et validation juridique. Hors contrat = pending_legal_validation ; aucune autorisation automatique.
- L'activation réelle n'est pas un changement de flag : stockage, envoi, réception STOP/RDV et paiement Live nécessitent une implémentation revue séparément.
- Le pilote reste manuel : suivi opérateur par API documentée, purge quotidienne à exécuter et contrôler. Aucun portail ou cron supplémentaire.
- Pas de test réel Stripe/Brevo/Supabase hébergé, pas de test d'authentification avec comptes réels, pas de garantie de délivrabilité.

## Fichiers

La liste exacte figure dans la PR. Groupes : page et CSS dédiées ; raccordements minimaux React/Express ; sept modules server/maintenance-pilot ; migration ; tests unitaires, HTTP, SQL et navigateur ; outils de purge et de contrôle compilé ; configuration CI et dépendances de test verrouillées ; documents de cadrage, exploitation, modèles en revue et compatibilité.
