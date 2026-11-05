# Relanzio v0.4 — audit final de pré-lancement

Date : 2026-10-02

## Verdict

**NON PRÊT POUR PILOTES à cet instant.**

Le noyau local est nettement plus sûr et les tests déterministes passent, mais quatre preuves indispensables manquent encore : build frontend Vite réussi dans un environnement npm fonctionnel, test Supabase réel, matrice Stripe/Brevo réelle, et QA navigateur/mobile sur le staging. Les informations légales de l'éditeur ne sont pas encore fournies non plus. Aucun de ces points n'est déclaré réussi sans preuve.

## Corrections P0/P1 effectuées

- Suppression du faux succès email : sans Brevo configuré, l'envoi échoue explicitement.
- Le mode Revue possède maintenant un vrai parcours : préparer une relance, la relire, la copier ; l'envoi via Relanzio exige Pro actif.
- Ajout de modification et suppression de devis.
- Reset de mot de passe complété avec écran de nouveau mot de passe.
- Verrou anti-double-envoi et contrainte unique `(quote_id, step)` sur les relances.
- En cas d'échec ambigu d'une relance automatique, l'automatisation du devis est désactivée plutôt que de retenter aveuglément.
- Un abonnement `past_due`/`unpaid` n'autorise plus les envois automatiques.
- États Stripe isolés dans une logique testable : actif, trial, paiement échoué, renouvellement, annulation.
- Acquisition verrouillée par défaut avec `ACQUISITION_ENABLED=false`.
- Relances automatiques et lifecycle verrouillés par défaut jusqu'à validation explicite.
- Ajout de logs structurés, identifiant de requête, table `system_events`, cockpit incidents et smoke test de staging.
- Rate limiter durci et comparaison des secrets via `timingSafeEqual`.
- IA : `store:false`, plafonds de sortie, fallback déterministe, aucune capacité d'action autonome.
- Support : paiement, vie privée, sécurité et juridique escaladés vers un humain.
- Dashboard CEO enrichi : actifs 30j, devis, relances envoyées, payants, MRR indicatif, problèmes récents.
- Sauvegarde logique préparée via `scripts/backup.sh` ; aucun dump ne doit être commité.
- Pages publiques dédiées : tarifs, documentation, FAQ, contact, connexion, inscription, reset, confidentialité, CGV/CGU.
- Sitemap/robots générés au build depuis `APP_URL` pour éviter de publier `YOUR_DOMAIN`.
- Build de production bloqué par des gates explicites pour légal, QA externe et QA mobile.

## Tests locaux exécutés

`npm test` : **24/24 PASS**.

`npm run check` : syntaxe serveur + tests : **PASS**.

Préflight staging avec configuration factice complète : **PASS**.

Préflight production sans validations légales/externes/mobile : **FAIL attendu**, ce qui confirme que les gates bloquent correctement une publication prématurée.

Les tests couvrent notamment : J+2/J+5/J+10, quatre personas, classification de réponses, opt-out, validation email, métriques, win rate, funnel CEO, événements Brevo, support sensible, priorisation produit, transitions d'abonnement, absence de faux succès email, routes self-service, confirmation de suppression, contraintes SQL et RLS.

## Ce qui reste non prouvé

### Frontend / navigateurs
- `npm install` a expiré dans l'environnement d'audit ; aucun `node_modules` ni `package-lock.json` n'a pu être généré.
- Par conséquent, **le build Vite v0.4 n'est pas certifié**.
- Le JSX modifié n'a pas pu être compilé par Vite dans cet environnement.
- Safari iPhone, Chrome Android, tablette, Chrome/Firefox/Safari desktop restent à valider sur le staging réel.

### Supabase
- inscription réelle ; confirmation email ; connexion ; récupération mot de passe ; changement de mot de passe ; isolation entre deux comptes ; RLS ; suppression utilisateur ; migration v0.4 : non testés contre un projet réel.
- Production : exécuter Security Advisor et Performance Advisor.

### Stripe
- Checkout test ; `checkout.session.completed` ; `invoice.paid` ; `invoice.payment_failed` ; `customer.subscription.updated/deleted` ; portail ; annulation ; renouvellement : logique locale testée, **webhooks Stripe réels non testés**.

### Brevo / domaine
- envoi réel ; réception ; bounce ; unsubscribe ; webhook authentifié ; SPF ; DKIM ; DMARC : **non testés**.

### Légal
- identité, adresse, immatriculation, contact données, hébergeur et politique de conservation réels manquent. La production doit rester bloquée.

### Charge et disponibilité
- script de charge et smoke test fournis, mais ils nécessitent un staging déployé. Aucune latence p95 réelle n'est donc annoncée.

## Risques résiduels

1. **Build frontend non certifié** — bloquant.
2. **Absence de lockfile npm** — builds non parfaitement reproductibles jusqu'à génération d'un `package-lock.json` validé.
3. **Intégrations externes non certifiées** — bloquant.
4. **Délivrabilité domaine non certifiée** — bloquant pour envoi réel.
5. **Pages légales non finalisées** — bloquant pour publication publique/vente.
6. **QA mobile réelle non effectuée** — bloquant selon la gate choisie.
7. Le scheduler Node convient à une première instance ; une architecture multi-instance nécessitera un job runner/queue durable. Le verrou DB ajouté réduit le risque de doublon mais ne remplace pas une queue à grande échelle.
8. Un échec ambigu après tentative d'envoi est volontairement bloqué pour vérification humaine. C'est plus sûr qu'un retry automatique mais demande une procédure support.
9. Le MRR du cockpit est indicatif (`nombre de Pro actifs × 29 €`) et ne remplace pas le rapprochement Stripe/comptable.

## Critère pour passer à PRÊT POUR PILOTES

Tous les éléments P0 de `GO_LIVE_CHECKLIST_V0.4.md` doivent être cochés avec preuve : build vert, staging, deux comptes Supabase isolés, reset password, CRUD devis, relance revue, email réel, Stripe Test complet, suppression compte, smoke/load, QA mobile, informations légales configurées et support testable.
