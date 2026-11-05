# Relanzio v0.4 — checklist GO LIVE

Ne cocher une case qu'après observation réelle du résultat.

## P0 — build et staging
- [ ] `npm install` réussit avec Node >= 22.12.
- [ ] Générer et commiter `package-lock.json`, puis remplacer CI/Docker par `npm ci`.
- [ ] `npm run check` vert.
- [ ] `npm run build` vert.
- [ ] Déploiement staging réussi.
- [ ] `/api/health` = 200 et version 0.4.0.
- [ ] `/api/readiness` = 200 avec Supabase + Stripe + Brevo configurés.
- [ ] `npm run smoke` vert sur staging.

## P0 — Supabase / compte
- [ ] Schéma/migration appliqué sans erreur.
- [ ] Security Advisor vérifié.
- [ ] Inscription compte A.
- [ ] Confirmation email reçue si activée.
- [ ] Connexion compte A.
- [ ] Inscription compte B.
- [ ] A ne peut jamais lire/modifier/supprimer un devis de B.
- [ ] Reset mot de passe : email → `/reset-password` → nouveau mot de passe → connexion.
- [ ] Suppression de compte de test supprime l'utilisateur et les données en cascade.

## P0 — produit
- [ ] Onboarding sans aide.
- [ ] Création devis.
- [ ] Modification client/email/objet/montant/date.
- [ ] Suppression devis.
- [ ] Statuts ouvert/gagné/perdu/pause.
- [ ] Retour pause → ouvert recalcule une prochaine action cohérente.
- [ ] Calculs valeur ouverte/gagnée/win rate vérifiés manuellement.
- [ ] Préparation d'une relance en mode Revue.
- [ ] Copie du message.
- [ ] Aucun email ne part en mode Revue sans action explicite.

## P0 — Stripe Test
- [ ] Free reste Free sans carte.
- [ ] Checkout Pro aboutit.
- [ ] Webhook `checkout.session.completed` reçu.
- [ ] `invoice.paid` → Pro actif.
- [ ] Renouvellement simulé/testé.
- [ ] `invoice.payment_failed` → `past_due`; automatisation bloquée.
- [ ] Portail Stripe accessible.
- [ ] Annulation via portail.
- [ ] `customer.subscription.deleted` → Free/canceled.
- [ ] Aucun double abonnement pour un même compte.

## P0 — Brevo / domaine
- [ ] Domaine expéditeur vérifié.
- [ ] SPF validé.
- [ ] DKIM validé.
- [ ] DMARC publié et vérifié.
- [ ] Email de relance reçu dans une boîte externe.
- [ ] Reply-To renvoie vers l'email du compte Relanzio concerné.
- [ ] Webhook delivered reçu.
- [ ] Bounce test enregistré.
- [ ] Unsubscribe test enregistré lorsque applicable.
- [ ] Aucun faux statut `sent` quand le fournisseur échoue.

## P0 — sécurité / opérations
- [ ] Secrets absents du frontend et du dépôt.
- [ ] `ACQUISITION_ENABLED=false`.
- [ ] Rate limits testés.
- [ ] Webhook Stripe rejette une signature invalide.
- [ ] Webhook Brevo rejette un secret invalide.
- [ ] Route cron rejette un secret invalide.
- [ ] Erreur provoquée visible dans `system_events`/cockpit.
- [ ] Backup réel créé puis restauration testée sur un projet jetable.
- [ ] Procédure incident connue.

## P0 — mobile / navigateurs
- [ ] iPhone Safari : accueil, signup, onboarding, devis, modal, support, paramètres.
- [ ] Android Chrome : mêmes parcours.
- [ ] Tablette portrait/paysage.
- [ ] Chrome desktop.
- [ ] Firefox desktop.
- [ ] Safari desktop si disponible.
- [ ] Aucun débordement horizontal bloquant.
- [ ] Clavier/focus utilisables sur formulaires et modales.

## P0 — légal / confiance
- [ ] `VITE_LEGAL_NAME` réel.
- [ ] `VITE_LEGAL_ADDRESS` réel.
- [ ] `VITE_LEGAL_EMAIL` réel.
- [ ] `VITE_LEGAL_REGISTRATION` réel.
- [ ] `VITE_HOST_NAME` réel.
- [ ] `VITE_DATA_RETENTION` validé.
- [ ] Politique de confidentialité relue.
- [ ] CGU/CGV relues et cohérentes avec Stripe.
- [ ] Contact support public réel.
- [ ] Aucun témoignage/client/chiffre fictif.

## P1 — performance
- [ ] `LOAD_BASE_URL=<staging> npm run load` sans erreur.
- [ ] Lighthouse mobile exécuté sur accueil et app.
- [ ] LCP/CLS/INP examinés et régressions majeures corrigées.

## Gate final
- [ ] `LEGAL_PAGES_APPROVED=true`
- [ ] `EXTERNAL_QA_APPROVED=true`
- [ ] `MOBILE_QA_APPROVED=true`
- [ ] `RELEASE_STAGE=production npm run preflight` = PASS

**Seulement après cette dernière ligne : PRÊT POUR PILOTES.**
