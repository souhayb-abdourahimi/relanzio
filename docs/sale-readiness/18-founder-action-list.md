# 18 — Actions du fondateur

Uniquement ce que **vous** devez faire, parce que cela demande vos comptes, vos décisions ou votre signature.
Rien ici n’interrompt le produit ni la prospection si l’ordre est respecté.

## A — À faire maintenant (sans lien avec une vente)

1. **Vérifier les sauvegardes Supabase.** Supabase → votre projet → *Database* → *Backups* : notez s’il y a des sauvegardes
   automatiques, leur fréquence et leur durée de conservation (filet de sécurité en plus du job Railway).
2. **Mettre en service le nouveau job de sauvegarde v2 et sa restauration de contrôle** (une seule fois, environ 15 minutes, voir
   [06 §9](06-backup-restore-runbook.md)). Conservez aussi la clé `BACKUP_ENCRYPTION_KEY_B64` dans votre gestionnaire de mots de passe.
3. **Activer la double authentification** sur GitHub, Railway, Supabase, Stripe, Brevo, OVH, Amelu.
4. **Ajouter le secret GitHub `STAGING_URL`** = `https://relanzio.com` (GitHub → dépôt → *Settings* → *Secrets and variables* →
   *Actions*) pour que le test horaire du site fonctionne.
5. **Ajouter une surveillance de disponibilité** gratuite sur `https://relanzio.com/api/health` avec alerte par email.
6. **Noter la commande de pré-déploiement Railway** (*Settings* → *Deploy* → *Pre-deploy command*, attendue :
   `node server/qa-predeploy-final.mjs`) et vérifier qu’une **seule instance** du service tourne.
7. **Supprimer les branches GitHub temporaires** (GitHub → *Branches*), impossible depuis l’outil utilisé ici :
   `qa/prod-smoke-5aa8137`, `qa/prod-smoke-037bbae`, et les branches déjà fusionnées : `feat/followup-steps-reply-e2e`,
   `feat/product-alignment-founder-audit`, `feat/saas-ready`, `fix/predeploy-auto-trial`, `fix/prospection-verify-dns-j7`,
   `p0-product-loop-20261016`, `chore/sale-readiness` (après fusion).

## B — Avant la mise en vente

1. **Obtenir de vrais clients payants et un historique de revenus** (au moins quelques mois) : c’est ce qui donne sa valeur au SaaS.
2. **Remplir les coûts réels** dans [11](11-operating-costs.md) à partir de vos factures.
3. **Lancer les requêtes de métriques** ([metrics/](metrics/README.md)) chaque mois et garder les résultats (tableur).
4. **Sortir `saas-opportunity-research/` du dépôt Relanzio** (le copier dans un dépôt privé séparé, puis le retirer de Relanzio) :
   ce sont vos recherches personnelles, sans rapport avec le produit.
5. **Passer le dépôt GitHub en privé** (recommandé avant toute annonce) : aujourd’hui le code, l’historique et vos recherches sont publics.
6. **Faire relire les points juridiques** ([21](21-legal-review-checklist.md)) par un professionnel, notamment :
   la liste des sous-traitants (elle mentionne encore OpenAI pour « personnaliser les relances », ce qui n’est plus le cas — OpenAI sert
   à l’analyse des réponses de prospection et à l’assistant support), l’hébergement Railway aux États-Unis, la prospection B2B,
   la cession de la base clients et prospects.
7. **Vérifier / déposer la marque « Relanzio »** (INPI) si vous voulez la vendre avec le produit.
8. **Confirmer qui est titulaire** du domaine, du compte Amelu et de chaque compte de service (vous personnellement ? une société ?).
9. **Envisager une structure juridique** (société) si la vente doit se faire par cession de parts plutôt que d’actifs — à voir
   avec un comptable / avocat.
10. **Décider de la signature des emails de prospection** : ils sont signés « Souhayb ». Pour un repreneur, il faudra une
    signature au nom de l’entreprise (petite modification de code, à faire quand vous le décidez — pas pendant une campagne).
11. **Décider du niveau DMARC** (aujourd’hui `p=none`) après lecture des rapports.

## C — Pendant la due diligence

1. Donner l’accès à la data room par niveaux ([19](19-sale-data-room-index.md)) : jamais de mot de passe ni de clé.
2. Fournir : métriques mensuelles, factures fournisseurs, export Stripe des revenus (sans données de carte), historique des incidents.
3. Faire une démonstration du produit et du tableau de bord admin.
4. Montrer `npm run sale:health` exécuté dans Railway (sortie sans secret).
5. Répondre aux questions de [17](17-buyer-due-diligence.md).

## D — Après accord de vente

1. Signer les actes (cession d’actifs ou de parts, cession de droits sur le code, de la marque, du domaine) avec un professionnel.
2. Préparer avec Stripe la migration des abonnements vers le compte de l’acheteur ([08](08-billing-stripe.md)).
3. Informer les clients si nécessaire (avis juridique).
4. Planifier la date de bascule (un jour calme, prospection en pause).
5. Faire une sauvegarde finale chiffrée.

## E — Jour du transfert

1. Mettre la prospection en pause (`COMMERCIAL_OUTREACH_SEND_ENABLED=false` dans Railway).
2. Transférer : dépôt GitHub, projet Supabase, projet Railway (ou laisser l’acheteur recréer), domaine OVH, comptes Brevo / boîtes mail.
3. Laisser l’acheteur créer **ses** secrets ([13](13-security.md)) ; vous ne transmettez aucune clé.
4. Vérifier ensemble : site en ligne, connexion, paiement test, email test, `npm run sale:health`.
5. Retirer vos accès, votre carte bancaire et votre email `ADMIN_EMAILS` de tous les services.
6. Rester joignable pendant la période de transition convenue ([20](20-transition-plan.md)).
