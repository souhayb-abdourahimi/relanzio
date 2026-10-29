> **⚠ RÉVISION DU 2026-10-29 (phase 6)** — Les conclusions de ce fichier sont **corrigées** par `12-audit-critique.md`. Le contenu d'origine est conservé ci-dessous, sans modification, pour la traçabilité.
> MVP sans objet : D-37 est abandonné. Aucun produit ne doit être construit (décision du fichier 12).

# 09 — MVP, architecture et difficultés

Date : 2026-10-29. Sujet : recommandation n° 1 (sous-traitance et preuves de réalisation Qualiopi).

**Règle issue du conseil et de la red team : aucune ligne de code avant J30**, ni avant :
- au moins 3 précommandes payées ;
- un portail SYCFI jugé non bloquant ;
- de préférence, la publication du guide de lecture v10.

Pendant le test, le « produit » est un **concierge** : formulaires, dossier partagé et export assemblé à la main.

## 1. MVP strict : 3 fonctions, pas une de plus

| # | Fonction | Ce qu'elle doit faire | Critère « fini » |
|---|---|---|---|
| 1 | **Dossier sous-traitant réutilisable** | L'OF invite un formateur par lien ; le formateur dépose une seule fois contrat signé, CV, attestations URSSAF/vigilance, preuves de veille et de compétences, avec dates d'expiration ; l'OF voit ce qui manque ou expire ; le formateur peut partager son dossier avec un autre OF | Un OF obtient le dossier complet d'un intervenant en moins de 10 minutes de son propre temps |
| 2 | **Émargement session apprenant + formateur** | Lien signé par demi-journée, horodatage, adresse IP, journal d'audit chaîné (hash) ; formateur signataire ; mention distanciel avec pièce jointe de trace de connexion (export visio ou LMS) | 100 % des sessions d'un pilote émargées sans papier pendant 2 semaines |
| 3 | **Export « dossier d'audit / de contrôle »** | ZIP + PDF index par sous-traitant et par session, rangé selon les indicateurs 27 et 19 et les preuves de réalisation | Un auditeur ou ex-auditeur relit un export et dit ce qui manque, **avant** toute promesse commerciale |

### Exclusions explicites (versions ultérieures, si demandées et payées)
- Classement IA d'un Google Drive et « diff V9 → V10 » (commoditisé, usage ponctuel).
- Tableau des 33 indicateurs : Formiva le fait gratuitement.
- Questionnaires de satisfaction, BPF, calcul des taux de l'indicateur 2.
- Intégrations EDOF/Kairos (pas d'API publique connue) et LMS.
- Signature électronique qualifiée eIDAS : à évaluer si les auditeurs l'exigent.
- Application mobile native.
- Tout vocabulaire « conforme », « opposable » ou « garanti ».

## 2. Architecture praticable

```
Next.js ou Express + vues serveur (stack déjà maîtrisée : Node 22)
  ├─ Supabase : Auth (magic link), Postgres (RLS par organisme), Storage (pièces, chiffrées au repos), région UE
  ├─ Modèle : organisme ─< session ─< émargement ; organisme >─< sous-traitant (dossier partagé avec consentement) ─< pièce(type, date_expiration, hash)
  ├─ Journal d'audit : table append-only, hash(n) = sha256(hash(n-1) + événement) ; export du journal dans le dossier
  ├─ Liens signés à usage unique pour l'émargement (JWT court + horodatage serveur)
  ├─ Brevo : invitations, relances de pièces manquantes ou expirées, liens d'émargement
  ├─ Stripe : précommande du Pack (paiement unique remboursable), puis abonnement
  └─ Génération PDF/ZIP côté serveur (bibliothèque PDF open source)
```

**Composants à réutiliser ou acheter** :
- authentification, stockage et base de données (Supabase) ;
- envoi d'e-mails (Brevo) ;
- paiement (Stripe) ;
- PDF (bibliothèque open source) ;
- modèles de contrat de sous-traitance, à faire relire par un juriste (ponctuel).

**Briques Relanzio réutilisables** :
- moteur de relances planifiées : utile pour réclamer les pièces manquantes ou expirées aux formateurs ;
- intégration Stripe/Brevo ;
- garde-fous de déploiement.

C'est une économie de temps, **pas** un avantage concurrentiel.

## 3. La partie difficile
1. **Le contenu réglementaire exact** :
   - liste des pièces exigibles par type de sous-traitant (micro-entrepreneur, portage, société) ;
   - mise à jour quand le guide v10 et les arrêtés paraîtront.
   - Il faut un ex-auditeur ou consultant partenaire (600 € de relecture budgétés).
2. **La valeur probante de l'émargement « maison »** face à un contrôle CDC/DGEFP. La valeur est inconnue. Edusign revendique l'acceptation par les financeurs ; il faut vérifier si un prestataire eIDAS est nécessaire.
3. **Le partage d'un dossier formateur entre plusieurs OF**, seul effet de réseau possible : consentement RGPD, droit de retrait, versions des pièces.
4. **L'adoption par le formateur sous-traitant**, qui n'est pas le payeur. Le dépôt doit lui prendre moins de 10 minutes et lui être utile (réutilisation chez ses autres clients).

## 4. Sécurité, RGPD, responsabilité
- **Données** :
  - identité et signatures d'apprenants ;
  - pièces des formateurs (URSSAF, contrats) ;
  - parfois une situation de handicap (indicateur 26, donnée sensible), **exclue du MVP**.
- **Mesures** :
  - hébergement UE ;
  - DPA avec chaque OF (sous-traitant RGPD) ;
  - chiffrement au repos ;
  - RLS stricte ;
  - durées de conservation paramétrées ;
  - journal des accès.
- **Responsabilité** :
  - vendre une « aide à la constitution du dossier », jamais une conformité ;
  - CGV avec limitation de responsabilité ;
  - check-list issue du texte officiel, citée et datée.

## 5. Coûts et délais (estimation)

| Poste | Estimation |
|---|---|
| Développement des 3 fonctions par une personne | 6 à 8 semaines |
| Relecture juridique (CGV, DPA, modèle de contrat) | 800 € |
| Relecture du référentiel par un ex-auditeur ou consultant | 600 € |
| Infrastructure pendant la phase pilote | < 50 €/mois |
| IA | Quasi nulle dans ce MVP (aucune fonction IA indispensable) |

## 6. Dépendances critiques
- Publication du **guide de lecture v10** et des **arrêtés des indicateurs 19 et 20**, non parus au 20/10/2026 [RT-P01, RT-P02].
- **Décret d'application** du devoir de vigilance de la loi n° 2026-534, au plus tard le 26/12/2026 [RT-P11].
- Position du **SYCFI** et de son « Portail des Formateurs » [RT-P03].

## 7. Rappel n° 2 (Relanzio)
Pour un test concierge, le produit existe déjà. Pour 5 à 10 pilotes, la red team et DD-E13 identifient 3 travaux indispensables :
- **identité d'envoi** : domaine Relanzio + Reply-To de l'artisan, puisque les adresses gmail ou orange ne sont pas authentifiables par DMARC ;
- **saisie des devis** : import CSV ou transfert en copie cachée ;
- **détection des réponses** : sans stockage de mot de passe IMAP, ce qui pose un risque de sécurité.

Estimation : 3 à 8 jours-homme. Le README du dépôt indique « NON PRÊT POUR PILOTES » tant que les vérifications externes ne sont pas au vert.
