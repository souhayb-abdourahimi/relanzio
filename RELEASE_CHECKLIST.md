# GO-LIVE — ordre exact

## P0 — avant staging
- Remplacer `YOUR_DOMAIN` dans robots/sitemap.
- Renseigner identité éditeur et pages légales.
- `npm install --no-audit --no-fund && npm run check && npm run build` doit être vert.
- Appliquer schema.sql sur un projet Supabase de test.

## P0 — staging
- Créer 2 comptes et vérifier isolation.
- Tester reset password.
- Ajouter 5 devis, tester limite Free.
- Tester gagné/perdu/pause.
- Tester Stripe carte de test, webhook, portail, annulation, échec paiement.
- Vérifier suppression d'un compte avec abonnement.
- Vérifier Brevo delivered, hard bounce et unsubscribe.
- Vérifier SPF/DKIM/DMARC.
- Tester OpenAI puis retirer la clé et confirmer fallback.
- Tester mobile 375 px, tablette, desktop ; Chrome, Firefox, Safari si disponible.

## P1 — pilotes
- 5 pilotes gratuits maximum, onboarding manuel.
- Observer sans expliquer pendant la première création de devis.
- Noter temps jusqu'au premier devis et incompréhensions.
- Ne pas activer l'automatique au premier jour.

## P1 — paiement
- Demander 19/29 € uniquement après usage réel.
- Vérifier facture/statut/annulation.
- Aucun témoignage sans autorisation.

## GO
Vente publique uniquement si build, auth, RLS, Stripe, Brevo, suppression et mobile sont verts.
