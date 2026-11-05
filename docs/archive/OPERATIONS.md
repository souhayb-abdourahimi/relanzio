# Operating System — Relanzio

## Boucle quotidienne (60–120 min)

20 min : incidents/support et relances clients critiques.
30–45 min : 5 prospects qualifiés ou 2 conversations terrain.
20 min : onboarding/retour d'un pilote.
20 min max : produit, uniquement sur bug bloquant ou retour répété.

## Boucle hebdomadaire CEO

Chaque dimanche/lundi, relever : nouveaux comptes, activation (premier vrai devis), WAU, devis actifs, relances envoyées, valeur marquée gagnée, conversion Free→Pro, MRR, churn, prospects contactés, réponses, démos, pilotes, demandes fonctionnelles, erreurs serveur, coût infra/API.

Décision : une seule priorité produit de la semaine. Une fonctionnalité n'entre en développement que si elle corrige un blocage critique ou revient dans plusieurs signaux indépendants.

## Acquisition conforme et contrôlée

Le pipeline fondateur accepte des coordonnées professionnelles importées avec leur source. Relanzio score les prospects, mais l'envoi reste confirmé par l'admin. Toute demande STOP/opposition ajoute l'adresse à `suppressions`, ce qui bloque les envois futurs.

Ne pas acheter/importer des listes dont la provenance et l'information des personnes sont inconnues. Ne pas contourner les mécanismes d'opposition.

## Voice of Customer

Chaque réponse est classée : intéressé, prix, fonctionnalité, non intéressé, opposition, autre. Les demandes sont agrégées dans `/api/admin/insights`.

L'IA peut proposer une synthèse. Elle ne change jamais seule le pricing, le produit ou les messages envoyés.

## Incident email

Si taux de bounce ou plaintes augmente : arrêter les campagnes, vérifier provenance des contacts, domaine, SPF/DKIM/DMARC et contenu. Ne pas compenser en envoyant davantage.

## Incident produit

P0 : fuite de données, paiement incorrect, emails envoyés au mauvais destinataire → couper l'automatisation immédiatement.
P1 : login/paiement indisponible → corriger avant acquisition.
P2 : bug UX avec contournement → backlog semaine.
P3 : amélioration cosmétique → seulement si elle affecte conversion/usage.

## Rétention

J0 : onboarding + premier devis.
J1 : aide si aucun devis ajouté.
Hebdo : digest valeur en attente / gagnée.
Après 14 jours sans activité : demander pourquoi, pas envoyer une promotion automatique.
Annulation : questionnaire 1 question + export des données + confirmation claire.

## Quand scaler

Ne pas acheter de publicité avant : 5 clients payants, activation comprise, au moins un signal de rétention sur plusieurs semaines et message de vente reproductible.

Passer à une queue de jobs et observabilité avant >1 000 relances/jour ou plusieurs instances backend.

---
## Mise à jour v0.3
Le cockpit CEO est disponible dans l'espace admin. La revue hebdomadaire doit partir des métriques d'activation/réponse et des demandes répétées, pas du volume de fonctionnalités. Voir `CEO_PLAYBOOK.md`, `ACQUISITION_SYSTEM.md` et `TEST_REPORT_V0.3.md`.
