# Audit de cession — constats classés

Audit du 2026-11-05 sur la branche de production `staging` (`1cc431e`), dans l’optique d’une due diligence.
Les comptes de service (Railway, Supabase, Stripe, Brevo, OVH, Amelu) n’ont pas pu être consultés : ce qui en dépend est **À confirmer**.

## BLOCKER SALE

| # | Constat | Pourquoi ça bloque | Action |
|---|---|---|---|
| B1 | **Pas d’historique de revenus documenté** (clients payants, MRR sur plusieurs mois) | Un acheteur valorise un SaaS sur ses revenus récurrents prouvés | Obtenir des clients payants ; archiver chaque mois les métriques ([metrics/](metrics/README.md)) et l’export Stripe |
| B2 | ~~Sauvegarde incomplète, restauration jamais vérifiée~~ **Corrigé le 6 novembre 2026** : job v2 en service, restauration complète (21 tables + comptes Auth) vérifiée sur les données réelles dans un environnement isolé. Reste : test de connexion dans un projet Supabase restauré | Question systématique en due diligence | [06](06-backup-restore-runbook.md) ; [inventaire](backup-inventory.md) |
| B3 | **Aucune revue juridique** (propriété du code, RGPD clients et prospects, cession de base, structure de vente) | Un acheteur ne peut pas signer sans | [21](21-legal-review-checklist.md) — LEGAL REVIEW REQUIRED |

## IMPORTANT BEFORE SALE

| # | Constat | Détail / action |
|---|---|---|
| I1 | Dépôt **public** | Code, historique (email de commit du fondateur), documents de recherche personnels visibles. Recommandé : passer en privé avant l’annonce (décision du propriétaire) |
| I2 | `saas-opportunity-research/` dans le dépôt (186 fichiers) | Recherches personnelles du fondateur sur d’autres projets, simulations financières. Hors périmètre de la vente : à déplacer dans un dépôt privé séparé |
| I3 | Compte Stripe lié à l’entreprise individuelle | Pas cessible tel quel ; migration des abonnements à planifier avec Stripe ([08](08-billing-stripe.md)) |
| I4 | Commande de pré-déploiement Railway **hors dépôt** | `node server/qa-predeploy-final.mjs`, configurée dans le tableau de bord. Si elle est perdue lors d’un transfert, les déploiements ne sont plus contrôlés ([05](05-deployment-runbook.md)) |
| I5 | Une seule instance requise, non documentée dans Railway | Les tâches planifiées tournent dans le serveur web ; deux instances = travail en double |
| I6 | Aucune alerte externe ; smoke horaire inactif (secret `STAGING_URL` absent) | [12](12-monitoring-and-incidents.md) ; [18 — A4/A5](18-founder-action-list.md) |
| I7 | Migrations appliquées à la main, non tracées en base | Le contrôle `DB` de `npm run sale:health` vérifie le schéma attendu ; à terme, outil de migration (Supabase CLI) |
| I8 | Signature « Souhayb » codée dans les emails de prospection | À rendre configurable au moment du transfert (pas pendant une campagne) |
| I9 | Identité de l’éditeur codée dans `shared/company.js` (nom, SIREN, adresse, téléphone) | Normal et exact aujourd’hui ; à remplacer par celle du repreneur (avec ses pages légales) |
| I10 | Liste publique des sous-traitants inexacte sur OpenAI | Indique « personnalisation des relances » (supprimée) ; OpenAI sert à l’analyse des réponses de prospection et à l’assistant support — LEGAL REVIEW REQUIRED |
| I11 | Hébergement applicatif aux États-Unis (Railway `sfo`) | Transfert hors UE à documenter ; option : région européenne |
| I12 | Prospection et produit sur le même domaine ; DMARC `p=none` | Risque de réputation partagé ; sous-domaine/compte Brevo dédié recommandé ; DMARC à durcir après observation |
| I13 | Branches : `main` obsolète mais branche **par défaut** ; 8 branches avec commits non fusionnés ; branches fusionnées et QA non supprimées (suppression refusée par l’outil) | Définir `staging` comme branche par défaut ; archiver/supprimer ([18 — A7](18-founder-action-list.md)) |
| I14 | Titularité des comptes (domaine, Amelu, services) non documentée | À confirmer ([16](16-transfer-checklist.md)) |
| I15 | Pas d’historique d’incidents ni de mesure de disponibilité | À tenir dès maintenant |

## NICE TO HAVE

| # | Constat | Détail |
|---|---|---|
| N1 | `server/index.js` volumineux, style de code très compact (lignes longues) | Lisibilité pour un repreneur ; découpage progressif possible, sans urgence (tests en place) |
| N2 | Script destructif `server/qa-destructive-final.mjs` non référencé | Ne jamais l’exécuter en production ; le supprimer ou le déplacer dans un dossier `tools/` |
| N3 | Variables obsolètes (`VITE_LEGAL_EMAIL`, `VITE_LEGAL_VAT`, `VITE_HOST_NAME`, `VITE_DATA_RETENTION`) encore dans `.env.example`/Dockerfile | Nettoyage sans effet fonctionnel |
| N4 | CSP refuse le script d’analytics injecté par Cloudflare | Sans effet fonctionnel ; autoriser ou désactiver l’injection |
| N5 | `.claude/skills/` (outillage de développement tiers, MIT) dans le dépôt | Peut être retiré du dépôt cédé |
| N6 | Avertissements « Node.js 20 deprecated » des actions GitHub | Mettre à jour `actions/checkout` et `actions/setup-node` |
| N7 | Pas de tableau de bord business | Requêtes fournies ; un tableau de bord simple faciliterait la data room |

## Points positifs (à mettre en avant)

- **Aucun secret dans tout l’historique Git** (recherche complète, voir [13](13-security.md)).
- **178 dépendances, toutes sous licence permissive**, aucune GPL/AGPL ([15](15-ip-and-licenses.md)).
- RLS sur les 21 tables ; opérations critiques en fonctions SQL atomiques ; webhooks signés.
- ~220 tests unitaires + tests SQL (migrations, rollbacks) + E2E + mobile + accessibilité en CI ; **QA contre la production avant chaque
  déploiement** (bloquante).
- Garde-fous de prospection testés : D0 → J+3 → FIN, aucun J+7, 1 email / 5 min, plafond quotidien, suppressions, pauses automatiques.
- Source unique des prix et limites (`shared/plans.js`) protégée par des tests.

## Corrigé dans cette préparation

- README principal réécrit (il annonçait encore « v0.4 — non prêt pour pilotes »).
- 19 documents obsolètes déplacés dans `docs/archive/` (historique conservé).
- Dossier `docs/sale-readiness/`, requêtes de métriques en lecture seule (testées en CI dans une transaction en lecture seule).
- Outil `npm run sale:health` (lecture seule).
