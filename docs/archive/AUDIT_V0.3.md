# Audit Relanzio v0.2 → v0.3

## Verdict
v0.2 était un MVP utile mais pas une release commerciale complète. Les risques principaux étaient la gestion incomplète du cycle abonnement/compte, des métriques trompeuses, un upsert prospects incompatible avec le schéma SQL, l'absence de support opérationnel et l'absence de mesure du funnel.

## Défauts trouvés et corrigés
1. `prospects upsert onConflict=email` sans contrainte unique compatible → contrainte UNIQUE(email) + migration.
2. Win rate = gagnés / tous les devis → gagnés / (gagnés + perdus).
3. `isBusinessEmail` prétendait distinguer un email professionnel alors qu'il ne faisait que valider la syntaxe → renommage `isValidEmail`, alias rétrocompatible.
4. Aucun portail de facturation/résiliation → Stripe Customer Portal.
5. Aucun traitement `invoice.payment_failed` → statut `past_due`.
6. Suppression de compte absente → annulation abonnement puis `auth.admin.deleteUser` côté serveur.
7. Aucune télémétrie funnel → `product_events` first-party, sans tracker publicitaire.
8. Aucun ticket support → tickets + escalade humaine paiement/RGPD/sécurité.
9. Délivrabilité email non remontée → webhook Brevo delivered/opened/clicked/bounced/unsubscribed.
10. IA réponse basée sur JSON libre → Structured Outputs avec fallback déterministe.
11. Prospection sans limite de cadence → score minimum, suppression, cooldown 7 jours, plafond quotidien.
12. Provenance insuffisante des contacts nominatifs → source + URL requises à l'import.
13. Pas de cockpit CEO → visiteurs, inscriptions, activation, payants, MRR indicatif, reply rate + recommandations.
14. Pas de lifecycle → nudge/activation/winback uniquement pour les utilisateurs ayant opt-in marketing.
15. Landing sans démonstration de valeur économique → calculateur scénario basé sur le panier réel, sans promesse de conversion.

## Non corrigible sans environnement externe
- authentification Supabase réelle ;
- paiement Stripe Test réel + portail + échec paiement ;
- délivrabilité Brevo réelle + SPF/DKIM/DMARC ;
- appel OpenAI réel ;
- build Vite dans cet environnement (installation npm indisponible) ;
- tests Safari/iOS/Android réels ;
- validation juridique des pages et identité éditeur.

Ces éléments restent des blockers GO-LIVE.
