# Relanzio — rapport `feat/saas-ready`

Date : 28 octobre 2026. Branche : `feat/saas-ready` (28 commits au-dessus de `staging`, rien n'a été mergé ni déployé, aucune ressource de production touchée).

Légende des preuves :
- **TESTED LOCALLY** : vérifié ici (tests unitaires, Postgres 16 local, navigateur Chromium).
- **REQUIRES REAL STRIPE TEST ENVIRONMENT** : concerne uniquement les **nouveautés** de cette branche liées à Stripe (essai au premier devis, grâce `past_due`, emails de paiement, retour au Free, portail élargi). Le parcours Stripe Live existant (Checkout, webhooks, passage Pro, facturation) fonctionne déjà en production et n'est pas un bloqueur ; sa configuration n'est pas modifiée.
- **LEGAL REVIEW REQUIRED** : texte rédigé, à faire valider par un juriste.

État des vérifications à la fin du travail :

| Vérification | Résultat |
| --- | --- |
| `npm test` (`npm run check`) | 157/157 |
| `npm run build` | vert, avec 12 pages publiques pré-rendues |
| `npm run test:sql` | schéma + migrations + rollbacks + 3 fichiers de tests SQL, sur Postgres 16 local |
| CI GitHub (ubuntu-24.04) | verte : check, build, SQL, E2E, sans JS |
| `npm run test:e2e` | 18 scénarios Chromium à 1366 px et 390 px, contre une fausse API |
| `npm run test:nojs` | 12 pages publiques lisibles avec JavaScript désactivé |
| `scripts/mobile-dom-check.sh` | QA navigateur existante du dépôt (gate du build Docker) : verte |
| axe-core | 16 écrans : 0 violation grave ou critique |

---

## 1. Ce qui a été fait

### Étape 0 — Skills
`.claude/skills/` contient les 11 skills demandés et leur licence MIT. Sont exclus : `write-swift`, `animate-expo`, `apple-design`.

### Source unique des prix et limites
- `shared/plans.js` contient `FREE_ACTIVE_QUOTES_LIMIT = 5`, `PRO_ACTIVE_QUOTES_LIMIT = 100`, `PRO_MONTHLY_PRICE = 29` et `TRIAL_DAYS = 7`.
- Tout le reste lit cette source : serveur (quotas, Stripe, MRR, support), app, landing, page Tarifs, CGV.
- Un test refuse tout prix ou toute limite écrit en dur.
- « 100 devis actifs » est conservé, conformément à ta décision.

### Étape 2 — Boucle quotidienne
**Fichiers :** `client/src/TodayView.jsx`, `FollowupModal.jsx`, `QuoteEditor.jsx`, `today.js`, `main.jsx` ; serveur `index.js`, `quote-rules.js` ; migration `20261028100000_quote_contact_and_note.sql`.

- **Vue Aujourd'hui** :
  - ordre : en retard, puis aujourd'hui, puis à venir ;
  - libellés « Relance 2/3 » et « en retard de 3 j » ;
  - en-tête « 3 relances aujourd'hui · 16 300 € en jeu ».
- **Un geste par devis** : Relancer, Relance faite, Repousser (demain, +3 j, +1 semaine, date libre), Gagné, Perdu, Pause. Un toast confirme chaque action (Sonner).
- **« Relance faite »** fait avancer l'étape et calcule la suivante à partir du jour de la relance (en SQL).
- **Fin de séquence** : « Séquence terminée — décidez : gagné, perdu ou repousser ».
- **Fenêtre de relance** :
  - message modifiable, Copier, Ouvrir dans mon email (`mailto:` prérempli) ;
  - SMS (`sms:`) et Appeler (`tel:`) quand un téléphone est renseigné ;
  - Relance faite, note du devis et historique.
- **Téléphone client** : l'email devient facultatif si un téléphone existe. Une contrainte SQL exige au moins l'un des deux.
- **Note libre par devis** : 1 000 caractères maximum.
- **Historique** : visible dans la fenêtre de relance, dans « Modifier », et en résumé sur la carte (« Dernière relance : … »).
- **Compteur « À relancer »** : cliquable, il filtre la liste ; un bouton « Tout afficher » retire le filtre.
- **Constat de l'audit du 16/10** : le correctif P0 du 16/10 avait déjà partiellement réglé le problème. Il restait le geste unique, les canaux de relance, le téléphone, la note et le filtre ; c'est maintenant fait.

### Étape 3 — Envoi automatique sécurisé
**Fichiers :** `server/followups.js`, `followup-policy.js`, `email-links.js`, `shared/followup-cadence.js`, `CadenceSettings.jsx` ; migration `20261028110000_followup_cadence_and_optout.sql`.

- **Calcul des dates** : prochaine relance = jour de la dernière relance + délai de l'étape. Les fonctions SQL `confirm_manual_followup` et `finalize_relanzio_followup` lisent la cadence du compte.
- **Cadence réglable par compte** : J+2 / J+5 / J+10 par défaut, modifiable dans Paramètres. La date de la prochaine relance reste modifiable par devis.
- **Un seul envoi par devis et par jour** : index unique en base, plus un contrôle côté code. Test SQL dédié.
- **Fenêtre d'envoi** : jours ouvrés, 8 h – 19 h, heure de Paris (règle existante, couverte par des tests).
- **Devis ancien** : la première relance est proposée aujourd'hui, sans rattraper les étapes. Le formulaire explique pourquoi. Réappliquer le « Planning recommandé » repart de la dernière relance, jamais d'une date passée.
- **Chaque email envoyé via Relanzio** :
  - identifie l'expéditeur (« Message envoyé par X via Relanzio, au sujet du devis … ») ;
  - contient un lien de désinscription signé (HMAC) ;
  - envoie les en-têtes `List-Unsubscribe` et `List-Unsubscribe-Post` (désinscription en un clic, RFC 8058).
- **Désinscription** :
  - elle vaut par expéditeur (table `followup_optouts`) et coupe l'envoi automatique pour ce client ;
  - un clic (GET) affiche une page de confirmation, pour que les robots qui suivent les liens ne désinscrivent personne ; le POST applique.

### Étape 4 — Rappel du matin
**Fichiers :** `server/morning-digest.js`, `DigestSettings.jsx` ; migration `20261028130000_morning_digest.sql`.

- **Envoi** : jours ouvrés à 7 h 30, heure de Paris, uniquement s'il y a au moins une action.
- **Contenu** : « 3 relances aujourd'hui · 9 400 € en jeu », la liste, et un lien vers la vue Aujourd'hui (`?from=digest`, mesuré comme `digest_opened`).
- **Une fois par compte et par jour** : clé primaire `digest_sends(user_id, business_date)`. La réservation est libérée si l'envoi échoue.
- **Désactivation** : en un clic depuis l'email (lien signé) ou depuis Paramètres. C'est un email de service, sans opt-in marketing.
- **Interrupteur général** : `MORNING_DIGEST_ENABLED=false` par défaut.

### Étape 5 — Mobile
- **Sous 760 px** :
  - la liste passe en premier et le premier devis est visible dans le premier écran ;
  - les indicateurs passent en une ligne compacte sous la liste ;
  - chaque carte a 3 boutons d'au moins 46 px : Relancer, Repousser, Résultat.
- **Fenêtre de relance** : elle s'ouvre comme une feuille en bas de l'écran et respecte les safe areas.
- **Saisie** : champs en 16 px (pas de zoom), `inputmode="decimal"` pour le montant, `tel` pour le téléphone.
- **Toucher** : pas de flash gris au tap, retour visuel `:active`.
- **Landing** : le lien Connexion est visible sur mobile.
- **Mesure** : 3 relances enregistrées en 6 taps à 390 px (scénario E2E).

### Étape 6 — Abonnements
**Fichiers :** `server/stripe-webhook.js`, `billing-emails.js`, `shared/quota.js`, `TrialStatus.jsx`, `trial-display.js`, `PlansView.jsx`, `subscription-display.js` ; migration `20261028120000_subscription_period.sql`.

1. **Essai Pro 7 jours sans carte**, démarré automatiquement au premier devis ajouté, une seule fois par compte. L'ancien bouton et la route `/api/trial/start` sont supprimés ; l'activation par l'admin est conservée.
2. **Bannière** « Essai Pro : X jours restants ». La même bannière affiche les autres états : paiement refusé, résiliation, lecture seule.
3. **Email J-2** avant la fin de l'essai (10 h 05, Paris), avec un lien vers Formules. Interrupteur `BILLING_EMAILS_ENABLED=false`.
4. **Fin d'essai** : retour au gratuit, rien n'est supprimé.
   - Règle de lecture seule : parmi les devis actifs (en attente ou en pause), les 5 ajoutés le plus récemment restent utilisables ; l'identifiant départage les égalités.
   - Les autres passent en lecture seule : visibles, pas de modification ni de relance, mais Gagné, Perdu et Supprimer restent possibles et libèrent une place.
   - La règle est appliquée côté serveur (code HTTP 423) et testée.
5. **Checkout** : inchangé, passage à Pro par webhook.
6. **Portail** (carte, factures, résiliation) : accessible quand l'abonnement est actif, impayé (`past_due`) ou résilié. Avant, il était masqué en `past_due`, ce qui empêchait de corriger sa carte.
7. **`past_due`** : période de grâce de 14 jours (règle ci-dessous) :
   - email (une fois par facture), bannière, envoi automatique suspendu ;
   - retour à Pro dès la régularisation ;
   - nouveau Checkout refusé dans cet état, pour éviter un double abonnement.
8. **Résiliation** : Pro jusqu'à la fin de la période payée (date stockée et affichée), puis gratuit.
9. **Mention « TVA non applicable, art. 293 B du CGI »** en pied de facture : déjà en place dans le code. Les mentions vendeur se règlent dans Stripe (voir §2).
10. **Webhooks** : signature vérifiée, chaque événement traité une seule fois, réservation libérée en cas d'échec, événements périmés ignorés. Les tests utilisent des événements signés par le SDK Stripe.
11. **Prix et limites identiques partout** : voir la source unique ci-dessus.
- **Script de validation réelle prêt** : `scripts/stripe-test-validation.mjs` et `docs/STRIPE_TEST_VALIDATION.md` (test clock Stripe, clés `sk_live` refusées).

### Règle de la période de grâce `past_due`

Calculée à la lecture, uniquement à partir des données Stripe stockées par le webhook. Aucune tâche planifiée n'intervient (`server/entitlements.js`, `shared/plans.js`).

- `active` ou `trialing` → Pro.
- `past_due` → le plan reste `pro`. Pro reste utilisable tant que la date courante est avant `subscription_current_period_start + 14 jours`, c'est-à-dire 14 jours après le début de la période dont le renouvellement a échoué (= la fin de la période payée).
  - **Pendant la grâce** : pas de lecture seule, limite Pro de 100 devis, envoi via Relanzio possible.
  - **Ce qui est suspendu pendant la grâce** : l'envoi automatique.
  - **Ce qui s'affiche** : une bannière « Paiement refusé : mettez à jour votre carte avant le JJ/MM », avec accès au portail Stripe.
  - **Email** : un email par facture, seulement si `BILLING_EMAILS_ENABLED=true`.
  - **Nouveau Checkout** : refusé (409), donc pas de second abonnement.
- **Paiement confirmé** (`invoice.paid`, puis Stripe `active`) → Pro normal, l'envoi automatique reprend.
- **Grâce dépassée** alors que Stripe est encore `past_due` → Free et règle des 5 devis actifs, sans action de notre part.
- **`unpaid` ou `canceled`** → Free immédiatement (plan `free`), règle des 5 devis actifs.
- **Date de début de période inconnue** → pas de grâce (choix prudent).
- **Tests** : `test/past-due-grace.test.js`, `test/stripe-webhook.test.js` (événements signés), E2E « past_due in grace », `test/sql/subscription_period.test.sql`.

### Étape 7 — Landing et pages publiques
**Fichiers :** `client/src/PublicSite.jsx`, `public-meta.js`, `entry-server.jsx`, `scripts/prerender.mjs`, `client/index.html`, `client/public/og-image.png`.

- **Nouveau titre et sous-titre**, tels que demandés.
- **Démo sans compte** : la vraie vue Aujourd'hui avec des données d'exemple, dans un cadre de téléphone ; on peut cliquer, rien n'est envoyé.
- **Bénéfices** : 3 cartes concrètes remplacent « IA utile » et « Valeur mesurable ».
- **FAQ** : les 6 questions demandées sont ajoutées, et la FAQ est partagée entre la landing et `/faq`.
- **« Qui est derrière »** : prénom, ville, SIREN, email. Aucun témoignage, chiffre ou logo inventé.
- **CTA final** conservé.
- **Pré-rendu HTML** au build des 12 pages publiques, chacune avec son titre, sa description, sa balise canonical, ses balises OG et Twitter.
- **Image de partage** en 1200×630.
- **Sitemap** : inchangé, il couvre déjà les 12 routes.

### Étape 8 — Conformité
**Fichiers :** `client/src/LegalPage.jsx`, `shared/company.js`, `client/public/relanzio-dpa.pdf`.

- **Mentions légales, CGU/CGV, confidentialité et DPA** : rédigés avec les informations fournies (éditeur, EI micro-entreprise, SIREN, adresse, support, hébergeurs, sous-traitants et régions).
- **CGV** : prix, essai, lecture seule, résiliation en fin de période, pas de remboursement au prorata, responsabilité plafonnée, droit français, tribunaux de Montpellier.
- **DPA** : téléchargeable en PDF.
- **Cookies** : aucun bandeau, car aucun cookie non essentiel ; c'est expliqué dans la politique de confidentialité.
- **Export CSV** : existait déjà ; il inclut maintenant le téléphone et la note.
- **L223-8** :
  - aucun texte marketing ne cible la rénovation énergétique chez les particuliers (vérifié par grep) ;
  - les données de démo ont été changées (PAC → toiture, électricité) ;
  - clause CGU ajoutée ;
  - mention discrète à côté du mode automatique dans Paramètres.
  - **LEGAL REVIEW REQUIRED.**

### Étape 9 — Funnel
- **Événements enregistrés** : `landing_view`, `signup_started`, `signup_completed`, `first_quote_added`, `followup_marked_done`, `snoozed`, `quote_won`, `digest_opened`, `trial_started`, `checkout_started`, `subscription_active`, `payment_failed`, `subscription_canceled`.
- **Cockpit admin** : funnel visites → inscrits → 1er devis → 1re relance faite → payants, sur 30 jours et depuis le début (`server/funnel.js`).
- **Bug corrigé** : le compteur « visiteurs » valait toujours 0, car aucun identifiant n'est envoyé. Il compte désormais les visites de l'accueil.

### Étape 10 — QA
- **E2E Playwright à 1366 px et 390 px** (fausse API) : landing, inscription, onboarding, ajout de devis, démarrage de l'essai, vue Aujourd'hui, Relance faite, Repousser, Gagné, Checkout et portail simulés, lecture seule, `past_due`, navigation au clavier.
- **Captures avant/après** dans `docs/screenshots/`.
- **`break-ui`** sur la vue Aujourd'hui et la carte mobile : nom de 120 caractères, montant de 9 999 999 999,99 €, note de 1 000 caractères, email de 64 caractères, liste vide, un seul devis.
  - Résultat : 0 débordement à 320, 390 et 1366 px.
  - 4 corrections : le montant passe sous le nom, l'objet et la note sont limités à 2 lignes, un message unique remplace la liste vide, l'email est limité à 254 caractères.
  - La bascule de démo se trouve dans `p0-fixture.html?data=worst|empty|one` (dev uniquement).
- **`find-animation-opportunities`** (lecture seule) : une seule animation retenue, la carte qui s'atténue (150 ms) pendant l'enregistrement d'une action. Rejetées : animations de chiffres (données), entrée animée des menus (fréquence élevée), démo en lecture automatique (distrayante).
- **Accessibilité** :
  - contrastes passés au niveau AA (axe : 0 problème grave) ;
  - dialogues : Échap ferme, Tab reste dans la fenêtre, le focus revient à l'élément d'origine ;
  - sur mobile, le clavier ne s'ouvre pas tout seul ;
  - focus visible.
- **CI** : `ubuntu-latest` est passé à Ubuntu 26.04, que Playwright 1.55 ne supporte pas ; c'est pour cela que la CI était rouge, y compris sur `staging`. Le runner est figé sur 24.04. Les tests SQL, l'E2E et le test sans JS sont ajoutés à la CI.

---

## 2. Ce qui reste à faire par toi

1. **Migrations Supabase en production** (après revue), dans cet ordre :
   1. `20261028100000_quote_contact_and_note.sql`
   2. `20261028110000_followup_cadence_and_optout.sql`
   3. `20261028120000_subscription_period.sql`
   4. `20261028130000_morning_digest.sql`

   Chacune a son rollback dans `supabase/rollbacks/`. Elles sont toutes testées en aller-retour sur Postgres 16. Elles **doivent être appliquées avant** de déployer le code de cette branche : le nouveau code lit les nouvelles colonnes et fonctions.

2. **Variables d'environnement Railway** :

   | Variable | Valeur |
   | --- | --- |
   | `EMAIL_LINK_SECRET` | 24 caractères aléatoires ou plus. **Obligatoire** : sans elle, aucun email de relance via Relanzio ne part, et le préflight échoue. |
   | `MORNING_DIGEST_ENABLED` | `false`, jusqu'à ta validation |
   | `BILLING_EMAILS_ENABLED` | `false`, jusqu'à la validation Stripe E2E |
   | `STRIPE_PORTAL_CONFIGURATION_ID` | facultatif |
   | `VITE_LEGAL_PHONE` | téléphone de l'éditeur. **Non fourni** : la LCEN l'exige pour une personne physique, et le préflight de production le réclame. |

3. **Stripe Live** : déjà en place, **ne rien modifier**. À lire seulement : les paramètres de relance des paiements (statut final après échec : `unpaid`, `canceled` ou `past_due`) et la configuration du portail, pour confirmer qu'un client en `past_due` peut changer sa carte.
4. **Validation des nouveautés en Stripe Test Mode** (si possible avant merge) : renseigner `sk_test_…`, `price_…`, `whsec_…` et un projet Supabase de dev, puis lancer `scripts/stripe-test-validation.mjs`. Ce qui n'a pas été vérifié contre Stripe réel est listé en détail dans `docs/STRIPE_TEST_VALIDATION.md` §0.
5. **Juridique (LEGAL REVIEW REQUIRED)** :
   - CGU/CGV, confidentialité, DPA ;
   - interprétation de l'article L223-8 : une relance de devis demandé par un particulier, pour des travaux de rénovation énergétique, compte-t-elle comme de la prospection ?
   - absence de remboursement au prorata ;
   - plafond de responsabilité ;
   - clause attributive de juridiction (Montpellier) ;
   - adresse et téléphone des hébergeurs (adresse Railway reprise du code existant ; adresse Supabase non indiquée).
6. **Brevo** : vérifier en réel que les en-têtes `List-Unsubscribe` passent et que la désinscription en un clic fonctionne depuis Gmail.

## 3. Décisions prises seul

- **Accès Pro en `past_due`** (révisé à ta demande) : période de grâce, voir « Règle de la période de grâce `past_due` » au §1.
- **Comptes existants sans essai** : leur essai démarre au prochain devis ajouté.
- **Désinscription par expéditeur** : elle vaut par professionnel (`followup_optouts`), et non dans la liste globale de suppression utilisée par la prospection. Un client qui se désinscrit d'un artisan peut donc encore recevoir les relances d'un autre.
- **Bornes de la cadence** : relance 1 entre 1 et 60 jours ; les suivantes croissantes, avec 90 et 120 jours au maximum.
- **Jours fériés** : ils ne sont pas exclus. Seuls les week-ends le sont, pour l'envoi automatique comme pour le rappel du matin.
- **Seuil mobile** : 760 px, celui déjà utilisé dans le code, au lieu de 700 px. Toutes les largeurs sous 700 px sont couvertes.
- **Pré-rendu sans hydratation** : React remplace le HTML pré-rendu au chargement. Un petit script `/session-hint.js` masque la landing pour les utilisateurs connectés.
- **Canonical** : toujours `https://relanzio.com`.
- **Email de fin d'essai et email de paiement refusé** : ils renvoient vers `?view=plans` dans l'app, qui demande une connexion, plutôt que vers un lien Stripe direct.
- **Pas d'email lors d'une résiliation** : la bannière suffit.
- **Une seule dépendance ajoutée** : Sonner, pour les toasts.
- **FAQ « Qui êtes-vous ? »** : rédigée à la première personne (« c'est moi qui réponds »).
- **PDF du DPA** : versionné dans le dépôt. Il faut le régénérer avec `scripts/render-dpa-pdf.cjs` à chaque modification du texte.

## 4. Risques restants

- **Couverture des tests** : l'E2E utilise une fausse API. Les routes du serveur ne sont pas testées de bout en bout contre un vrai Supabase (la logique métier l'est, en unitaire et en SQL).
- **Nouveautés Stripe** : compatibles avec le parcours Live d'après les tests locaux (`test/stripe-live-compat.test.js`), mais non exécutées contre Stripe réel (voir `docs/STRIPE_TEST_VALIDATION.md` §0). Brevo et OpenAI non appelés en réel.
- **Webhooks Live et ordre de déploiement** : déployer le code avant la migration `20261028120000` ferait échouer les webhooks Live jusqu'à son application.
- **Planificateur** : il tourne sur une seule instance. Les tables de déduplication empêchent les doublons, mais pas une exécution manquée si le serveur est arrêté à 7 h 30.
- **Ordre de déploiement** : déployer le code avant les migrations casserait la création de devis (paramètres de la fonction SQL).
- **Production bloquée** : le téléphone de l'éditeur est manquant, donc le préflight de production échoue.
- **`npm audit`** : il signale des vulnérabilités dans l'installation Playwright de la CI (déjà présentes avant, hors du bundle de production).

## 5. « Prêt pour la campagne »

| Critère | État | Preuve |
| --- | --- | --- |
| Un inconnu comprend l'offre en 20 s sur mobile | ⚠️ Non mesurable par moi | Nouveau titre et démo en haut de la landing (`docs/screenshots/after-landing-mobile.png`). À tester avec 3 artisans. |
| Inscription → 1er devis → 1re relance en moins de 3 min | ✅ TESTED LOCALLY | E2E : parcours enchaîné en quelques secondes (scripté), 2 taps par relance |
| Aujourd'hui, Repousser et Relance faite fonctionnent en gratuit comme en Pro | ✅ TESTED LOCALLY | E2E essai, gratuit (lecture seule) et Pro ; le serveur ne demande pas Pro pour « Relance faite » |
| Rappel du matin envoyé une seule fois, seulement s'il y a des actions | ✅ TESTED LOCALLY / ⏳ envoi réel Brevo | `test/morning-digest.test.js`, `test/sql/morning_digest.test.sql` |
| Envois automatiques sans rafale | ✅ TESTED LOCALLY | `test/sql/followup_cadence.test.sql` (1 par jour, calcul depuis la dernière relance), fenêtre 8 h – 19 h jours ouvrés |
| Parcours Stripe existant (Live) | ✅ Déjà en production, inchangé | Configuration Checkout identique ; compatibilité testée sur des profils écrits par le code actuel (`test/stripe-live-compat.test.js`) |
| Nouveautés Stripe (essai, grâce `past_due`, emails, retour au Free, portail) | ⏳ REQUIRES REAL STRIPE TEST ENVIRONMENT | Testé localement avec des événements signés au format basil ; script Test Mode prêt ; détail dans `docs/STRIPE_TEST_VALIDATION.md` §0 |
| Prix, limites et essai identiques partout | ✅ TESTED LOCALLY | `test/plans.test.js` |
| Mentions légales, CGV, confidentialité, DPA définitifs | ⚠️ Rédigés, LEGAL REVIEW REQUIRED | Téléphone de l'éditeur manquant |
| Pages publiques lisibles sans JavaScript | ✅ TESTED LOCALLY | `npm run test:nojs` (12/12) |
| Tests et build verts, captures avant/après | ✅ | 157/157, build vert, `docs/screenshots/before-*` et `after-*` |
