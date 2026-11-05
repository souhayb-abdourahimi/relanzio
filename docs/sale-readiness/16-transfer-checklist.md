# 16 — Checklist de transfert

## Tableau des actifs

| ASSET | OWNER CURRENT | TRANSFER METHOD | DOWNTIME | BUYER ACTION | SELLER ACTION | RISK |
|---|---|---|---|---|---|---|
| Domaine `relanzio.com` | Fondateur (titulaire À confirmer), registrar OVH | Changement de titulaire OVH ou transfert vers le registrar de l’acheteur (code d’autorisation) | Aucun si la zone DNS est conservée à l’identique | Fournir son compte registrar, recopier la zone DNS | Déverrouiller, fournir le code, valider le changement de titulaire | **Élevé** : une erreur de zone coupe site + emails |
| Dépôt GitHub | Compte personnel du fondateur | Transfert de dépôt vers l’organisation de l’acheteur | Aucun (Railway à reconnecter) | Accepter le transfert, reconnecter Railway, passer en privé | Lancer le transfert, retirer `saas-opportunity-research/` avant | Faible |
| Railway | Compte du fondateur (À confirmer) | Transfert de projet vers l’équipe de l’acheteur, ou recréation depuis le Dockerfile | Quelques minutes si recréation (DNS) | Recréer les variables avec **ses** valeurs, recopier la commande de pré-déploiement | Exporter la liste des variables (noms), transférer le projet | Moyen : commande de pré-déploiement hors dépôt |
| Supabase | Organisation du fondateur (À confirmer) | Transfert du projet vers l’organisation de l’acheteur, ou dump/restore | Aucun (transfert) / court (restore) | Prendre l’organisation, régénérer les clés | Transférer, confirmer l’offre et les sauvegardes | Moyen : données personnelles, clés à régénérer |
| Stripe | Compte lié à l’entreprise individuelle du fondateur | Nouveau compte de l’acheteur + migration des abonnements (procédure Stripe) | Risque de friction pour les abonnés | Créer produit, prix, webhook, portail ; migrer | Demander la migration des données de paiement, accompagner | **Élevé** : continuité des paiements |
| Brevo | Compte du fondateur (À confirmer) | Transfert du compte ou nouveau compte + ré-authentification du domaine | Aucun si fait avant bascule DNS | Nouvelles clés, webhook, expéditeurs | Transférer ou fermer après bascule | Moyen : réputation d’envoi |
| Boîte des réponses (`reponses@reply.relanzio.com`, Amelu) | À confirmer | Transfert du compte ou nouvelle boîte + MX `reply.` | Réponses non détectées pendant la bascule | Nouvelle boîte, variables `REPLY_*`, test réel | Fournir l’accès / fermer l’ancienne après | Moyen |
| Boîte transactionnelle / commerciale (OVH : `contact@`, `support@`, `notifications@`) | À confirmer | Transfert avec le domaine ou recréation | Faible | Recréer, changer les mots de passe, `IMAP_*` | Transférer les boîtes | Moyen |
| Stockage des sauvegardes | Bucket Railway `relanzio-backups` (Amsterdam), job quotidien chiffré ([06](06-backup-restore-runbook.md)) | Remise de la clé de chiffrement + restauration devant l’acheteur, puis rotation | Aucun | Reprendre le job ou le recréer chez lui | Fournir les manifestes et une restauration vérifiée | **Élevé** tant que la restauration n’est pas vérifiée sur les données réelles (job v2) |
| DNS | Zone OVH | Recopie à l’identique puis modification progressive | Aucun si recopie exacte | Garder SPF, DKIM Brevo, DMARC, MX OVH, MX `reply.` | Exporter la zone | Élevé si mal recopiée |
| Code source | Fondateur | Cession de droits + transfert du dépôt | Aucun | Revue de code, audit de licences | Signer la cession de droits | Faible (licences permissives) — **LEGAL REVIEW REQUIRED** |
| Base clients (artisans) | Fondateur (responsable de traitement) | Selon la structure de la vente | Aucun | Informer les clients, reprendre les engagements RGPD | Préparer l’information des clients | **Juridique** — LEGAL REVIEW REQUIRED |
| Base prospects | Fondateur | Idem, avec suppressions **obligatoirement** transférées | Aucun | Conserver `suppressions` et `prospect_tombstones` | Ne rien supprimer avant transfert | **Juridique** — LEGAL REVIEW REQUIRED |
| Marque / logo | Fondateur (dépôt À confirmer) | Cession de marque (si déposée) | Aucun | Enregistrer la cession | Fournir le certificat de dépôt | À confirmer |
| Documentation | Dépôt (`docs/`) | Avec le dépôt | Aucun | Lire `docs/sale-readiness/` | Tenir à jour | Faible |

## Checklist par domaine

Pour chaque élément : **Avant** (préparation), **Pendant** (bascule), **Après** (vérification).

### GitHub
- Avant : retirer `saas-opportunity-research/`, supprimer les branches fusionnées et QA, passer le dépôt en privé, activer la 2FA.
- Pendant : transfert du dépôt ; reconnecter Railway au nouveau dépôt.
- Après : CI verte sur `staging` ; l’acheteur retire l’accès du fondateur.

### Domaine
- Avant : confirmer le titulaire, désactiver le renouvellement automatique sur la carte du fondateur, exporter la zone.
- Pendant : changement de titulaire / transfert, sans changer les serveurs DNS.
- Après : `npm run smoke` + contrôle SPF/DKIM/DMARC (voir [09](09-email-and-deliverability.md)).

### DNS
- Avant : export complet de la zone (MX, SPF, DKIM Brevo, DMARC, code Brevo, `reply.` MX/SPF, enregistrements Railway).
- Pendant : recopie à l’identique.
- Après : comparaison enregistrement par enregistrement, envoi d’un email test.

### Railway
- Avant : noter la commande de pré-déploiement, la liste des variables (noms), la région, le nombre d’instances (une seule).
- Pendant : transfert du projet ou recréation ; nouvelles valeurs des secrets.
- Après : déploiement réussi (QA pré-déploiement verte), `/api/health`, `npm run sale:health`.

### Supabase
- Avant : confirmer offre et sauvegardes, faire et **tester** une restauration.
- Pendant : transfert du projet ; régénération des clés.
- Après : `DB: PASS`, connexion de test, URL de redirection Auth.

### Stripe
- Avant : liste des abonnés actifs (sans données de carte), plan de migration validé avec Stripe.
- Pendant : création du produit/prix/webhook/portail sur le compte de l’acheteur ; migration.
- Après : un paiement test, webhooks reçus (`stripe_webhook_events`), `BILLING: PASS`.

### Brevo / Email
- Avant : état de réputation, liste des expéditeurs, webhooks.
- Pendant : transfert ou nouveau compte ; ré-authentification du domaine ; nouveau secret de webhook.
- Après : email produit test, email de prospection en **dry-run**, webhook de livraison reçu.

### Boîtes mail
- Avant : inventaire des boîtes (OVH, Amelu), redirections.
- Pendant : nouveaux mots de passe ; variables `IMAP_*` et `REPLY_*`.
- Après : relevé `reply.poll` sans erreur ; test réel réponse / absence / STOP.

### Sauvegardes
- Avant : sauvegarde chiffrée récente et restauration testée.
- Pendant : remise de la sauvegarde à l’acheteur (canal chiffré).
- Après : sauvegardes automatiques chez l’acheteur, premier test de restauration.

### Secrets
- Avant : aucun secret envoyé par email ou chat.
- Pendant : l’acheteur crée ses propres valeurs ([13](13-security.md), ordre de rotation).
- Après : révocation de toutes les anciennes clés.

### Analytics / Monitoring
- Avant : métriques des 12 derniers mois ([metrics/](metrics/README.md)).
- Pendant : —
- Après : moniteur d’uptime, secret `STAGING_URL` pour le smoke horaire.

### Documentation
- Avant : mettre à jour ce dossier (date, version déployée).
- Pendant : session de passation ([20](20-transition-plan.md)).
- Après : l’acheteur maintient `docs/`.

### Facturation (éditeur)
- Avant : factures fournisseurs des 12 derniers mois.
- Pendant : changement des moyens de paiement des fournisseurs.
- Après : plus aucune facture au nom du fondateur.

### Données
- Avant : registre des traitements, durées de conservation, base légale de la prospection — **LEGAL REVIEW REQUIRED**.
- Pendant : transfert du projet Supabase (pas d’export de données personnelles par email).
- Après : information des clients si nécessaire.

### Support
- Avant : historique des tickets (`support_tickets`), réponses types.
- Pendant : redirection de `support@relanzio.com`.
- Après : l’acheteur répond aux tickets ; le fondateur est retiré des destinataires.
