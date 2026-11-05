# 01 — Produit

## Problème résolu

Un artisan ou une petite entreprise de services envoie des devis, puis n’a pas le temps de les suivre. Une partie des devis
reste sans réponse simplement faute de relance au bon moment. Relanzio dit **quel devis relancer, quand, et avec quel message**,
et peut envoyer la relance à la place de l’artisan (offre Pro).

## Utilisateurs cibles

- Artisans du bâtiment (couverture, plomberie, électricité, rénovation…), indépendants et TPE de services qui travaillent sur devis.
- Pas de CRM, pas d’équipe commerciale : une seule personne, souvent sur mobile.

## Offre (source unique : `shared/plans.js`)

| | Free | Pro |
|---|---|---|
| Prix | 0 € | **29 € / mois** |
| Devis actifs | **5** | **100** (jamais « illimité ») |
| Relances | L’artisan relance lui-même (message prêt à copier, SMS, appel) | Relanzio envoie la relance par email au nom de l’entreprise, en un geste |
| Essai | — | **7 jours, sans carte bancaire**, démarré automatiquement au premier devis |

Mention fiscale affichée partout : « **TVA non applicable, art. 293 B du CGI** ».

## Fonctionnement principal

1. L’artisan ajoute un devis déjà envoyé (client, objet, montant, date d’envoi, email et/ou téléphone).
2. Relanzio planifie au plus **3 relances** (par défaut J+2, J+5, J+10 après l’envoi), uniquement les jours ouvrés, à 9 h (Paris).
3. Chaque matin, la vue **Aujourd’hui** montre : réponses reçues, devis en retard, à relancer aujourd’hui, à appeler.
4. Pour chaque relance : message fixe et sûr (relance 1, 2, 3 différentes), à copier, à envoyer par SMS, ou envoyé par Relanzio (Pro).
5. **Dès que le client répond, tout s’arrête** : bouton « Le client a répondu », ou détection automatique quand la relance est partie
   par Relanzio (adresse de réponse tokenisée). L’artisan reçoit la réponse et répond directement au client.
6. L’artisan marque le devis gagné ou perdu.

## Fonctionnalités

- Vue Aujourd’hui priorisée, actions limitées (3 par carte + menu), recherche dans la liste.
- Trois modèles de relance déterministes (sans IA), salutation sûre (jamais « Bonjour M., »).
- Envoi via Relanzio (Pro) avec confirmation, garde-fous (jours ouvrés, plafond quotidien par compte, aucune relance après réponse).
- Détection des réponses clients (boîte dédiée), classement (intéressé, question, prix, délai, refus, STOP, absence, non remis).
- Désinscription en un clic des destinataires (STOP / lien), exports CSV et JSON (portabilité), suppression de compte.
- Rappel du matin par email (désactivé tant que non validé), emails de facturation (idem).
- Moteur de prospection commerciale interne de Relanzio (voir [10](10-commercial-engine.md)) — **outil d’acquisition de l’éditeur**,
  distinct du produit vendu aux artisans.

## Positionnement actuel

- Promesse : « Vos devis relancés au bon moment. Sans harceler vos clients. »
- Gratuit : « Vous gardez la main ». Pro : « Relanzio relance pour vous ».
- La promesse publique « Tout s’arrête dès que le client répond » (détection automatique) est **masquée**
  (`VITE_REPLY_DETECTION_LIVE=false`) tant que la validation juridique n’est pas faite — **LEGAL REVIEW REQUIRED**.
- Aucune promesse chiffrée de résultat, aucun faux témoignage (le composant témoignages n’affiche que des témoignages consentis).

## Chiffres d’activité

Clients payants, MRR, utilisateurs, devis : **À renseigner par le propriétaire** à partir des requêtes de [metrics/](metrics/README.md).
