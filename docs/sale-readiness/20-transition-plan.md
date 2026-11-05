# 20 — Plan de transition (acheteur)

Hypothèse : transfert des comptes le jour J ([18](18-founder-action-list.md), section E). Le fondateur reste disponible selon l’accord.

## J0 → J+7 : reprendre la main sans rien casser

- **Transfert technique** : dépôt, Supabase, Railway, domaine, Brevo, boîtes mail. Prospection en pause.
- **Rotation des secrets** dans l’ordre de [13](13-security.md) ; redéploiement après chaque groupe ; `npm run sale:health` → PASS.
- **DNS** : aucune modification sauf nécessité ; vérifier SPF, DKIM, DMARC, MX `reply.` après transfert du domaine.
- **Emails** : email produit test, relance test vers une boîte de l’acheteur, réponse / absence / STOP réels sur la boîte des réponses.
- **Stripe** : nouveau compte prêt (produit, prix, webhook, portail) ; plan de migration des abonnements validé avec Stripe.
- **Sauvegardes** : sauvegarde automatique active chez l’acheteur + une sauvegarde manuelle chiffrée.
- **Surveillance** : moniteur d’uptime sur `/api/health`, secret `STAGING_URL` pour le smoke horaire, accès aux logs Railway.
- **Support** : `support@relanzio.com` redirigé vers l’acheteur.
- Session de passation avec le fondateur : 2 à 3 heures (architecture, déploiement, prospection, incidents connus).

## J+8 → J+14 : valider la production

- **Stripe** : migration des abonnements effectuée ; un renouvellement réel observé ; webhooks reçus sans erreur.
- **Production** : un déploiement complet par l’acheteur (PR → CI → QA pré-déploiement → mise en ligne).
- **Restauration** : un test de restauration sur un projet vide.
- **Prospection** : reprise (si souhaitée) avec la signature de l’acheteur ; surveiller les premiers D0 (message ID, livraison).
- **Données** : registre des traitements à jour au nom du nouvel éditeur (avis juridique).

## J+15 → J+30 : autonomie

- Retrait de tous les accès du fondateur ; ancien compte Stripe sans abonnement actif.
- Mentions légales et identité de l’éditeur mises à jour (`shared/company.js`, pages légales), relecture juridique.
- Revue de la dette technique ([audit-findings.md](audit-findings.md)) et choix des priorités.
- Questions résiduelles au fondateur (canal convenu).

## Heures de transition à demander au fondateur

Estimation : **10 à 20 heures** sur 30 jours (passation 3 h, assistance aux transferts de comptes et à la migration Stripe 4 à 8 h,
questions ponctuelles 3 à 9 h). Plus si l’acheteur n’est pas technique.
