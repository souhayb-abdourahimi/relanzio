> **⚠ RÉVISION DU 2026-10-29 (phase 6)** — Les conclusions de ce fichier sont **corrigées** par `12-audit-critique.md`. Le contenu d'origine est conservé ci-dessous, sans modification, pour la traçabilité.
> Ce plan (tests D-37 + E-13) est **remplacé** par le plan de découverte terrain du §7 du fichier 12 (correction C8).

# 10 — Plan de validation sur 30 jours (tests réels)

Fenêtre : du 2026-10-30 au 2026-11-28.

**Principes** (issus de la red team et du conseil) :
- **aucun code nouveau** pour la n° 1 ;
- moins de 150 € de dépenses ;
- 2 pistes testées en parallèle (60 % du temps sur la n° 2, la moins chère à tester ; 40 % sur la n° 1) ;
- **critères d'arrêt écrits avant le premier appel** ;
- décisions fondées sur des **comportements d'achat** (paiement, carte enregistrée), pas sur des opinions ;
- **aucun contact commercial ni publication sans votre accord explicite.** Les messages ci-dessous sont des brouillons.

## Calendrier

| Jours | Piste | Action | Mesure | Seuil d'arrêt (pré-enregistré) |
|---|---|---|---|---|
| J1-J2 | n° 1 | Essais de Formiva (gratuit), Qualiobee (essai 14 j), Digiforma (démo) : module sous-traitants ? émargement du formateur ? export par sous-traitant ? | Grille oui/non par fonction | **≥ 2 outils sur 3 ont un module sous-traitants** (contrats, CV, attestations) → STOP n° 1 |
| J1-J2 | n° 2 | Essais d'Obat, Tolteck, EBP Bâtiment, Batappli (+ Extrabat, Abby) : relance **automatique** des devis non signés ? par quel canal ? | Grille oui/non | **≥ 2 des 4 logiciels BTP** l'ont → STOP du wedge « artisans BTP » (repli possible sur les agences et prestataires B2B) |
| J1-J7 | n° 1 | Webinaire SYCFI du 4/11/2026 (gratuit) ; vérifier chaque semaine la parution du guide v10 et des arrêtés des indicateurs 19 et 20 | Prix, opérateur, fonctions du portail ; partenariat possible ? | Portail **gratuit pour la cible et complet** sur la sous-traitance, sans partenariat possible → STOP n° 1 |
| J3-J25 | n° 1 | **15 entretiens** avec des OF de 2 à 10 personnes qui sous-traitent, + 3 consultants Qualiopi + 2 ex-auditeurs | Voir le script ci-dessous | **< 4 sur 15** ont un audit dans les 9 mois **et** au moins 3 sous-traitants → STOP |
| J10-J25 | n° 1 | Offre de **précommande du Pack audit sous-traitance** à 149 € HT (remboursable si le guide v10 change le périmètre), proposée aux seuls entretiens qualifiés | Paiements Stripe | **< 3 précommandes sur 15** → STOP. **≥ 5** → GO fort ; tester 299 € sur les suivants |
| J3-J25 | n° 2 | **20 entretiens problème** avec des artisans d'une seule verticale (ex. plombiers-chauffagistes) dans un seul département | Comportement passé : « vos 5 derniers devis sans réponse, qu'en avez-vous fait ? » | **≥ 60 %** répondent « mon outil le fait » ou « le téléphone suffit » → STOP |
| J8-J28 | n° 2 | **Concierge payant d'emblée** : 19 € le premier mois, ou carte enregistrée, pour 5 à 10 artisans ; relances envoyées depuis le domaine Relanzio avec Reply-To de l'artisan | Paiement ; taux de réponse aux relances ; nombre de devis saisis | **< 3 sur 10 paient** → STOP. Taux de réponse aux relances **< 15 %** → STOP. **< 50 %** des pilotes saisissent au moins 5 devis la première semaine sans aide → STOP |
| J26-J30 | les deux | **Comité de décision** fondé uniquement sur les seuils ci-dessus | — | Voir la matrice ci-dessous |

« Devis gagnés grâce à la relance » **n'est pas** un critère : on en attend environ 4 ou 5 sur 90 relances, un volume trop faible pour conclure en 30 jours.

## Matrice de décision à J30

| n° 1 (précommandes) | n° 2 (paiements concierge) | Décision |
|---|---|---|
| ≥ 3 sur 15 et SYCFI non bloquant | quel qu'il soit | **GO MVP n° 1** (3 fonctions, `09`) ; la n° 2 reste une activité d'appoint |
| < 3 | ≥ 3 sur 10 | **GO pilotes n° 2** (identité d'envoi + import CSV), en assumant un plafond de 30-60 k€ d'ARR |
| < 3 | < 3 | **Arrêt des deux.** Pas de nouvelle due diligence documentaire : analyser les ~35 entretiens pour y repérer les douleurs **déjà payées** (sourcing par le problème) |
| 1-2 précommandes et guide v10 non paru | — | **PIVOT** : prolonger de 15 jours sur la n° 1 avec 10 entretiens de plus, uniquement si au moins une des conditions d'inversion de la red team est remplie (`_work/redteam.md`) |

## Budget

| Poste | Coût |
|---|---|
| Essais de logiciels | 0 € (plans gratuits et essais) |
| Enrichissement d'e-mails (outil à l'usage, ou manuel) | 0-60 € |
| Domaine/landing de précommande (Stripe Payment Link + page statique) | 0-20 € |
| Adhésion SYCFI, si utile pour l'accès au portail | 192 €/an [OBS RT-P05], **à décider après le webinaire** |
| Total hors adhésion | < 100 € |
| Temps fondateur | 60 à 80 h |

## Critères de prospection

### n° 1 (OF)
- Source : liste publique des OF (data.gouv, CSV quotidien).
- Filtres : certifiés « actions de formation » ; 2 à 10 salariés (via SIRENE) ; site mentionnant « formateurs partenaires », « intervenants » ou « réseau de formateurs » ; financement CPF ou OPCO visible.
- Deux régions au départ.
- Exclure les CFA (indicateur 33), les bilans de compétences et la VAE.

### n° 2 (artisans)
- Source : annuaires publics (Pages Jaunes, Google Maps) et réseaux locaux (CAPEB départementale).
- Filtres : 1 à 10 salariés ; une seule verticale ; activité de devis supérieurs à 500 € ; décideur joignable.

## Scripts d'entretien (comportement passé, pas d'opinion)

### n° 1, OF
1. Combien de formateurs extérieurs avez-vous fait intervenir sur les 12 derniers mois ? Comment les avez-vous vérifiés ?
2. Racontez-moi votre dernier audit Qualiopi : qu'est-ce qui a pris le plus de temps ? Y a-t-il eu une non-conformité ? Sur quel indicateur ?
3. Quand est votre prochain audit ? Que savez-vous du référentiel du 1er novembre ?
4. Montrez-moi où se trouve aujourd'hui le dossier d'un de vos intervenants (partage d'écran).
5. Qu'avez-vous déjà payé pour vous préparer (consultant, logiciel, audit blanc) ? Combien ?
6. *(Si qualifié)* Je prépare un Pack qui constitue le dossier de vos sous-traitants et l'émargement avant votre audit, pour 149 € HT, remboursable si le guide officiel change le périmètre. Voulez-vous le précommander ?

### n° 2, artisans
1. Combien de devis avez-vous envoyés le mois dernier ? Combien sont restés sans réponse ?
2. Qu'avez-vous fait pour les 5 derniers sans réponse ? Montrez-moi.
3. Avec quel logiciel faites-vous vos devis ? Fait-il des relances ?
4. Avez-vous déjà perdu un chantier faute d'avoir relancé ? Racontez.
5. *(Si qualifié)* Pendant un mois, je relance pour vous vos devis sans réponse. 19 €, carte enregistrée aujourd'hui. On commence ?

## Brouillons de messages (non envoyés)

### n° 1, e-mail à un OF
> Objet : vos formateurs sous-traitants et le référentiel du 1er novembre
> Bonjour [Prénom], depuis le 1er novembre, l'audit Qualiopi porte sur le nouveau référentiel (décret 2026-728), qui précise la sous-traitance (indicateur 27). La loi anti-fraude de juin renforce aussi la vigilance du donneur d'ordre. Je mène une courte enquête auprès d'organismes qui font intervenir des formateurs extérieurs : comment rassemblez-vous aujourd'hui leurs pièces ? 15 minutes cette semaine ? Je partage la synthèse anonymisée avec chaque participant.

### n° 2
Reprendre le message de `BUSINESS_PLAN.md` §9 du dépôt, centré sur la découverte et non sur la vente.

## Métriques suivies (tableur partagé)
- Entretiens réalisés / qualifiés.
- Part d'OF qui sous-traitent ; sous-traitants par OF ; OF servis par sous-traitant.
- Précommandes (montant, date) et remboursements.
- Heures passées par précommande, pour calculer le CAC observé.
- n° 2 : artisans contactés → entretiens → concierges payés → devis saisis/semaine → taux de réponse aux relances.

## Après J30 si GO
- Exécuter founder-pricing (`van_westendorp.py`) sur les réponses **réelles** de prix.
- Exécuter founder-offer, founder-marketing et founder-launch sur les objections réellement entendues.
- founder-brand en dernier.
