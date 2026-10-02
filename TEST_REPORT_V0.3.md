# Rapport QA — Relanzio v0.3

Date : 2026-10-02

## Exécuté réellement
`npm test` : **20/20 tests réussis**.
`npm run check` : syntaxe serveur + tests **réussis**.

Couverture déterministe : J+2/J+5/J+10, scoring ICP, classification réponses, opt-out, validation email, métriques devis, funnel CEO, webhooks Brevo, routage support, priorisation produit, schéma SQL, RLS présent, contrainte upsert, routes critiques, confirmation suppression, cap prospection, 4 simulations persona.

## Simulations persona
- petite entreprise ;
- agence ;
- indépendant ;
- utilisateur débutant.

Chaque simulation couvre le coeur métier : qualification → devis ouvert → calendrier → décision gagnée → métriques. Ce ne sont pas des E2E fournisseurs.

## Échec / blocage constaté
`npm install --no-audit --no-fund` a expiré après 120 secondes dans l'environnement de travail. Le build Vite n'est donc **pas certifié** ici.

## Matrice externe obligatoire avant vente
| Test | Statut | Critère GO |
|---|---|---|
| Supabase signup/login/reset | BLOQUÉ clés | 2 comptes isolés, reset fonctionnel |
| RLS réel | BLOQUÉ projet | compte A ne lit jamais B |
| Stripe Checkout test | BLOQUÉ clés | paiement test → Pro |
| Stripe portal | BLOQUÉ clés | annulation → statut cohérent |
| `invoice.payment_failed` | BLOQUÉ webhook | past_due sans faux Pro |
| Suppression compte | BLOQUÉ intégrations | abonnement annulé + auth supprimée |
| Brevo envoi | BLOQUÉ domaine | livré en inbox test |
| Brevo bounce/unsubscribe | BLOQUÉ webhook | état + suppression mis à jour |
| OpenAI Structured Output | BLOQUÉ clé | schéma valide + fallback si erreur |
| Build Vite | BLOQUÉ npm | `npm ci && npm run build` vert |
| Mobile Safari/Chrome | BLOQUÉ devices | signup + devis + settings utilisables |
| Lighthouse | BLOQUÉ build | pas de régression critique |

## Go-live
**NO-GO vente publique aujourd'hui** tant que les lignes externes ci-dessus ne sont pas vertes. **GO pilotes non payants** après build/staging et Supabase test validés.
