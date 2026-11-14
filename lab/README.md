# Laboratoire d'intégration Stripe Test + Supabase isolé

Le laboratoire fait tourner le **vrai serveur** du commit testé, `76a803bb` (PR #16, code inchangé), avec :
- une pile Supabase locale, en conteneurs Docker, sur une machine GitHub Actions jetable ;
- un **bac à sable Stripe Test séparé**.

Il s'exécute dans GitHub Actions ([workflow](../.github/workflows/stripe-integration-lab.yml)) et comporte deux tâches :

| Tâche | Quand | Secrets | Contenu |
|---|---|---|---|
| `infra` | À chaque push sur une branche `lab/**` | **aucun** | Isolation, pile Supabase, schéma et migrations, serveur, connexion d'un utilisateur, facturation refusée par sécurité, navigateur |
| `stripe` | **Uniquement** sur la branche `lab/stripe-run` **et** après approbation par le propriétaire de l'environnement protégé `stripe-lab` | Clé Test du bac à sable | Scénarios Stripe Test réels |

Les verrous de la tâche `stripe` sont entre les mains du propriétaire : il crée la branche, approuve l'exécution, et
déclare le commit qu'il a relu. Avant toute étape qui reçoit la clé, la tâche vérifie et **s'arrête** sinon
(`scripts/lab/gate-check.mjs`) :
1. le commit exécuté est exactement celui déclaré dans la variable `LAB_APPROVED_COMMIT` de l'environnement ;
2. le code applicatif est identique, octet pour octet, au commit de la PR #16 (`76a803bb`) : seuls les fichiers du
   laboratoire diffèrent ;
3. l'environnement `stripe-lab` exige bien un relecteur et n'est ouvert qu'à la branche `lab/stripe-run`, d'après l'API
   GitHub lue avec le jeton en lecture seule de l'exécution. S'il est impossible de le vérifier, la tâche s'arrête.

La tâche `infra` affiche à chaque push le même contrôle en mode rapport, sans bloquer : commit courant à approuver, code
identique à la PR #16 et état de protection de l'environnement.

## Démarrage du serveur dans le laboratoire

En production, `/api/readiness` ne répond 200 que si Supabase, Stripe **et Brevo** sont configurés. Le laboratoire n'a
volontairement pas Brevo, puisqu'aucun email ne doit partir. Il ne se fie donc pas à cette route, dont le comportement en
production reste inchangé.

`scripts/lab/server-ready.mjs` lit le diagnostic détaillé du serveur (`/api/admin/readiness`) avec un compte
administrateur propre au laboratoire (`lab-admin@example.com`, créé dans l'Auth locale, listé dans `ADMIN_EMAILS` du seul
workflow du laboratoire). Il exige :
- `/api/health` répond 200 ;
- Supabase est configuré ;
- Stripe est vérifié par le moniteur du serveur lui-même (`BILLING_CONFIGURATION_VERIFIED` : clé Test, compte attendu,
  prix exact, secret webhook) ;
- **Brevo est absent** et aucun interrupteur d'email n'est actif.

Il refuse si `/api/readiness` répond 200, ce qui signifierait que Brevo est configuré. Des tests permanents sur le vrai
serveur couvrent les trois cas :
- Brevo absent et Stripe valide : prêt ;
- prix Stripe invalide : refusé ;
- Brevo présent : refusé par le laboratoire, alors que `/api/readiness` répond 200 comme en production.

## Certification du passage Stripe

Les 22 scénarios de `REQUIRED` (`scripts/lab/stripe-run.mjs`) sont **obligatoires**. Le résultat global vaut :
- **CERTIFIÉ** seulement si les 22 ont été réellement exécutés et réussis ;
- **NON CERTIFIÉ** dans tous les autres cas.

Un scénario non exécuté apparaît comme **MANQUANT** dans le résumé, jamais comme réussi. Toute erreur arrête le passage avec
un code de sortie 1 et un résultat NON CERTIFIÉ.

Le premier scénario est la preuve d'isolation : variables, hôtes de production, puis bac à sable Stripe. S'il échoue, rien
d'autre n'est tenté : pas de navigateur, pas d'écriture chez Stripe, pas de webhook. Un test permanent
(`test/lab-workflow-guard.test.js`) le vérifie.

Pour le scénario « événement plus ancien », le laboratoire crée toujours lui-même deux modifications réelles de l'abonnement,
espacées dans le temps. Il garde la plus ancienne de côté, puis la livre après la plus récente. Ce scénario est donc toujours
exécuté.

## Le parcours testé : Checkout → profil → abonnement

La PR #16 n'accorde des droits que si le profil est rattaché à l'abonnement par `checkout.session.completed`. Un événement
d'abonnement ou de facture reçu avant ce rattachement est refusé avec un 503 (`BILLING_SUBSCRIPTION_NOT_LINKED`) et n'écrit
rien. Stripe le renvoie ensuite, et il est accepté une fois le rattachement fait.

Le laboratoire suit donc le vrai parcours d'un client :
1. un utilisateur du laboratoire se connecte ;
2. la **vraie route** `/api/billing/checkout` de l'application crée la session Checkout ;
3. la **vraie page Stripe Checkout (mode Test)** est payée dans un navigateur Chromium sans interface, avec la carte de test
   `4242 4242 4242 4242`.

Remplissage de la page (`scripts/lab/checkout-browser.mjs`, adapté au DOM réel relevé par `LAB_CHECKOUT_DOM` à
l'exécution 4) :
- chaque champ est cherché dans la page **et dans chaque iframe affichée** (attribut `autocomplete`), avec une attente
  explicite avant chaque action ; interactions Playwright normales uniquement (jamais `force`, jamais d'état modifié par
  script) ;
- devise : les radios réelles `input#currency-usd` / `input#currency-eur` (iframe `js.stripe.com`, sans nom accessible)
  sont trouvées par leur identifiant ; `currency-eur` est cochée par un clic normal (ou un clic sur son libellé si
  l'entrée est recouverte), puis l'état est relu : **EUR cochée, aucune autre devise cochée, et chaque montant du
  récapitulatif de la page égal à `29,00 €`** (la description « 29 € / mois », présente dans toutes les devises, ne
  compte pas) ; contrôle refait juste avant le paiement, sinon arrêt `CHECKOUT_AMOUNT_NOT_29_EUR` ;
- Link : `input#payment-linkOptInInput` est décochée et relue, le champ `payment-linkMobilePhoneInput` doit être vide
  (jamais rempli) ; sinon `CHECKOUT_LINK_SAVE_STILL_CHECKED` / `CHECKOUT_LINK_PHONE_NOT_EMPTY` ; l'e-mail doit être
  prérempli par Stripe ;
- CAPTCHA : si un défi hCaptcha/reCAPTCHA est affiché (avant toute action, juste avant le paiement ou après l'envoi),
  arrêt `CHECKOUT_CAPTCHA_REQUIRED` ; le laboratoire ne répond jamais à un CAPTCHA ;
- en cas d'échec : capture d'écran et `LAB_CHECKOUT_DOM`, inventaire caviardé des contrôles de chaque frame (attributs et
  états uniquement, jamais de valeur saisie), des montants affichés et de la présence d'un défi CAPTCHA.

`scripts/lab/checkout-fixture.test.mjs` teste cette automatisation contre une **imitation locale** de cette structure
(`scripts/lab/fixtures/checkout-fixture.mjs` : radios de devise et formulaire de paiement dans deux iframes d'une autre
origine, défi CAPTCHA servi localement). Aucune requête ne sort de la machine. Ce test **ne certifie rien** du vrai
Checkout : seule une exécution réelle du job Stripe, autorisée séparément, le peut.

`scripts/stripe-test-validation.mjs` (le script manuel du dépôt) n'est **plus utilisé** par le laboratoire. Il crée
l'abonnement directement par l'API, sans Checkout, ce qui ne peut pas aboutir avec la PR #16. Il faudra l'aligner dans une PR
de suivi.

## Ce qui est réel et ce qui est synthétique

Chaque étape est étiquetée dans le journal et dans le résumé de l'exécution GitHub :

| Code | Signification |
|---|---|
| **R** | Action Stripe Test réelle sans webhook : session créée par l'application, page Checkout payée dans un navigateur, lectures API |
| **A** | Événement Stripe Test **réel, livré par Stripe lui-même** : `stripe listen`, puis relais local, puis serveur. L'ordre est celui choisi par Stripe, et le relais l'enregistre avec les réponses du serveur |
| **B** | Événement Stripe Test **réel** (lu dans l'API Stripe), **relivré par le laboratoire** à un moment et dans un ordre contrôlés, signé avec le secret du laboratoire (comme le fait `stripe listen`) |
| **C** | Événement **synthétique**, construit par le laboratoire et signé avec son secret. Stripe ne l'a jamais émis |

### Phase 1 : livraisons de Stripe retenues par le relais, utilisateur « linking »

| Étape | Catégorie | Résultat attendu |
|---|---|---|
| Session Checkout créée par l'application, page payée dans le navigateur | R | Paiement accepté |
| `customer.subscription.created` livré **avant** `checkout.session.completed` | B | 503, rien d'écrit, non marqué traité |
| `invoice.paid` livré **avant** `checkout.session.completed` | B | 503, rien d'écrit, non marqué traité |
| `checkout.session.completed` | B | Profil rattaché, Pro actif |
| Les deux événements précédents **relivrés après** le rattachement | B | Acceptés (200), droits corrects |
| Événement `livemode=true` correctement signé | **C** | Refusé avant toute écriture |
| `checkout.session.completed` livré une 2e fois | B | Doublon reconnu |
| Base indisponible (PostgREST local en pause) | B | 503, rien d'appliqué |
| Même événement après rétablissement | B | Appliqué une fois |
| Événement plus ancien livré après un plus récent | B | Sans effet sur les droits |

### Phase 2 : livraisons de Stripe transmises, utilisateur « lifecycle », client sur horloge de simulation

| Étape | Catégorie | Résultat attendu |
|---|---|---|
| Vrai Checkout dans le navigateur | R puis A | Pro, avec l'ordre réel de livraison enregistré |
| Renouvellement refusé | A | `past_due`, Pro conservé pendant le délai de grâce |
| Carte corrigée | A | Actif |
| Résiliation demandée | A | Pro jusqu'à la fin de la période |
| Fin de période | A | Free, devis conservés |
| Factures | R | Mention de TVA présente |
| Clients du passage | R | Tous en `@example.com` |

Seule préparation propre au laboratoire : le client de la phase 2 est créé sur une horloge de simulation pour simuler les
mois, puis enregistré sur le profil. L'application réutilise ce client après avoir vérifié qu'il appartient bien à cet
utilisateur, exactement comme en production. Le Checkout reste le vrai.

Ce qui n'est pas couvert :
- le portail client Stripe dans un navigateur ;
- les relances automatiques de Stripe sur plusieurs jours (en phase 2, le relais transmet chaque livraison une seule fois).

## Ce que l'isolation garantit, et ce qu'elle ne garantit pas

1. **Aucun identifiant de production.** C'est la garantie principale. Le laboratoire ne reçoit que la clé Test du bac à
   sable. Il ne dispose ni de clé Supabase de production, ni de clé Brevo, ni de jeton Railway, ni de clé Stripe Live. Même
   s'il atteignait un service de production, il ne pourrait ni s'y authentifier ni y écrire.
   - `scripts/lab/isolation-check.mjs` refuse de démarrer si une valeur contient un identifiant de production ou si une
     variable de fournisseur réel est présente.
   - Il vérifie aussi par l'API Stripe que :
     - la clé est une clé Test ;
     - elle appartient au compte déclaré ;
     - ce compte n'est **pas** le compte de production, dont le mode Test garde un endpoint vers la production ;
     - le bac à sable n'a **aucun** endpoint webhook ;
     - le prix vaut 29 € par mois.
2. **Pare-feu de sortie du noyau**, appliqué après les installations et avant tout secret
   (`scripts/lab/egress-firewall.sh`, IPv4 et IPv6, pour la machine et pour les conteneurs Docker) :
   - **toute sortie est refusée sauf** le DNS et le HTTPS (port 443) ;
   - en pratique : pas de SMTP (25, 465, 587), pas d'IMAP ni de POP, pas de connexion PostgreSQL directe (5432, 6543), pas
     de HTTP, quelle que soit l'adresse visée ;
   - le contrôle est prouvé à chaque exécution : connexions refusées vers des ports SMTP et IMAP réels, Stripe joignable.
3. **Blocage DNS** des hôtes de production connus (`/etc/hosts`). C'est une **défense complémentaire, pas une isolation** :
   - un processus pourrait viser une adresse IP directement ;
   - **le HTTPS reste ouvert vers Internet**, car Stripe et sa page Checkout utilisent de nombreux hôtes derrière des CDN
     partagés. Une liste d'autorisation par IP n'est pas fiable ici.
4. **GitHub.**
   - `permissions: contents: read` : le jeton GitHub de l'exécution ne peut rien modifier.
   - `persist-credentials: false`.
   - Pas de déclencheur `pull_request` ni `pull_request_target` : une contribution extérieure (fork) ne peut pas exécuter le
     laboratoire avec ses secrets.
   - Les secrets sont **ceux de l'environnement `stripe-lab` uniquement**, accessibles à la seule tâche `stripe`, et transmis
     aux seules étapes qui en ont besoin.
   - Le secret de signature et les mots de passe du laboratoire sont masqués dans les journaux.
   - La tâche `infra` n'a accès à aucun secret.
   - **Secrets de dépôt et d'organisation.** GitHub ne transmet à une étape que les secrets qu'elle nomme explicitement. Le
     laboratoire ne nomme que `STRIPE_LAB_SECRET_KEY`. Il n'utilise ni `toJSON(secrets)`, ni `secrets: inherit`. Un test
     permanent échoue si une autre référence apparaît.
   - Dans tout le dépôt, le seul autre secret référencé est `STAGING_URL` (workflow `smoke.yml`), qui est une adresse et non
     un identifiant.
   - Je ne peux pas lister les secrets enregistrés : l'API GitHub le refuse au jeton d'exécution. **Le propriétaire doit
     vérifier** qu'aucun identifiant de production n'est stocké en secret de dépôt ou d'organisation. Le relecteur
     obligatoire et l'approbation du commit protègent contre un workflow modifié qui chercherait à les lire.
5. **Limites qui restent, à connaître.**
   - Une personne ayant le droit de pousser sur le dépôt pourrait modifier le workflow sur une branche `lab/**` pour exfiltrer
     la clé du bac à sable. La règle de relecteur obligatoire existe pour cela : **vérifier le commit avant d'approuver**.
   - Les images `stripe/stripe-cli:latest` et Supabase, ainsi que les actions GitHub, sont prises par étiquette et non par
     empreinte figée. L'empreinte de l'image Stripe CLI est affichée à chaque exécution.
   - Une clé Test ne donne accès qu'au bac à sable, qui ne contient rien de réel. La renouveler après chaque campagne.

## Emails : aucun ne doit partir

- **Application.**
  - Pas de clé Brevo : le serveur répond `EMAIL_PROVIDER_NOT_CONFIGURED`.
  - Les interrupteurs d'envoi sont à `false`.
  - Les ports SMTP sont fermés par le pare-feu.
  - Les hôtes Brevo et OVH sont bloqués.
- **Supabase Auth.** Les emails restent dans le collecteur local de la pile. Les utilisateurs sont créés déjà confirmés.
- **Stripe.**
  - Tous les clients du laboratoire ont une adresse `@example.com`. Ce domaine est réservé (RFC 2606) et n'accepte aucun
    email.
  - Au démarrage, le laboratoire refuse un utilisateur dont l'adresse n'est pas en `@example.com`.
  - En fin d'exécution, il liste **tous** les clients créés dans le bac à sable pendant le passage. Le résultat est NON
    CERTIFIÉ si un seul n'a pas une adresse `@example.com` (scénario `EMAIL_CUSTOMERS`).
  - Le scénario `EMAIL_NONE` vérifie qu'aucun email n'a été réclamé par l'application pour les utilisateurs du laboratoire.
  - **Je ne peux pas vérifier par l'API Stripe les réglages d'emails du bac à sable.** Le propriétaire doit donc les
    désactiver (voir la procédure ci-dessous). Stripe n'envoie normalement pas d'emails clients automatiques depuis un bac à
    sable, mais le laboratoire ne compte pas sur ce comportement.

## Procédure définitive : environnement GitHub `stripe-lab`

### A. Dans le bac à sable Stripe séparé (pas le mode Test du compte principal)

1. **Webhooks** : la liste des endpoints doit être **vide**. Le laboratoire refuse de démarrer sinon.
2. **Prix** : créer ou vérifier un produit « Relanzio Pro » avec un prix récurrent de **29,00 EUR par mois**, actif. Noter son
   identifiant `price_…`.
3. **Emails clients** : désactiver tous les emails automatiques :
   - paiements réussis et remboursements ;
   - factures finalisées et reçus ;
   - rappels de renouvellement et d'essai ;
   - paiements échoués et cartes expirantes ;
   - emails de relance (*Smart Retries / dunning*).
4. **Clé API** : utiliser la **clé secrète Test standard** du bac à sable (`sk_test_…`). Une clé restreinte peut empêcher
   `stripe listen` et les horloges de simulation de fonctionner. Ne jamais la coller dans une conversation.
5. Noter l'identifiant du bac à sable (`acct_…`, en haut à gauche ou dans les paramètres du compte) et celui du compte
   principal de production (`acct_…`, identifiant public, non secret).

### B. Dans GitHub : *Settings → Environments → `stripe-lab`*

L'environnement a été créé vide automatiquement lors d'un premier lancement.

| Type | Nom exact | Valeur |
|---|---|---|
| Secret | `STRIPE_LAB_SECRET_KEY` | Clé secrète Test du bac à sable (`sk_test_…`) |
| Variable | `STRIPE_LAB_ACCOUNT_ID` | `acct_…` du bac à sable |
| Variable | `STRIPE_LAB_PRICE_ID` | `price_…` du prix Test à 29 € par mois |
| Variable | `PRODUCTION_STRIPE_ACCOUNT_ID` | `acct_…` du compte principal (sert à prouver que le laboratoire en est distinct) |
| Variable | `LAB_APPROVED_COMMIT` | SHA complet (40 caractères) du commit relu, celui que la tâche `infra` affiche dans `LAB_GATE_OK COMMIT` |

Protections à activer :
- **Required reviewers** : vous seul. Cocher **Prevent self-review** seulement si une autre personne de confiance peut
  approuver ; sinon, laisser décoché pour pouvoir approuver vous-même.
- **Deployment branches and tags** : *Selected branches*, règle `lab/stripe-run` uniquement.
- **Wait timer** : facultatif, 0 à 5 minutes.
- Ne mettre **aucun autre secret** dans cet environnement. Vérifier aussi qu'aucun secret de production n'est stocké en
  secret de **dépôt** ou d'**organisation** : ceux-là sont accessibles à tout workflow.

### C. Lancer les scénarios réels (étape à autoriser par le propriétaire)

1. Renseigner `LAB_APPROVED_COMMIT` avec le SHA relu.
2. Créer la branche `lab/stripe-run` **sur ce commit exact**, puis la pousser. Avec git :

   ```bash
   git push origin <SHA>:refs/heads/lab/stripe-run
   ```

3. GitHub exécute `infra`, puis met `stripe` **en attente d'approbation**. Approuver après avoir vérifié le commit affiché.
4. Le contrôle d'accès (commit, code identique à la PR #16, protection de l'environnement), puis la preuve d'isolation,
   arrêtent la tâche à la moindre anomalie.
5. Lire le résumé : 22 scénarios, chacun RÉUSSI ou MANQUANT, et le résultat global CERTIFIÉ ou NON CERTIFIÉ.
6. Ensuite : supprimer la branche `lab/stripe-run`, vider `LAB_APPROVED_COMMIT` et renouveler la clé Test.
