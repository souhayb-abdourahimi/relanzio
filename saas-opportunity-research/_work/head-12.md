# 12 — Audit critique des conclusions (phase 6)

Date : 2026-10-29 (soir).

**Déclencheur** : trois preuves nouvelles apportées par le porteur contre D-37, et une question élargie : *quelle idée mérite rationnellement plusieurs années de travail ?*

Ce document **corrige** des conclusions antérieures. Rien n'a été supprimé : les fichiers 03 à 11 portent un bandeau de révision qui renvoie ici, et l'historique git conserve les versions d'origine.

---

## DÉCISION : RECHERCHER UNE AUTRE OPPORTUNITÉ, PAR LE TERRAIN ET NON PAR DOSSIER, ET ABANDONNER LES PISTES ACTUELLES COMME PROJETS DE PLUSIEURS ANNÉES

| Piste | Décision | Motif principal |
|---|---|---|
| **D-37** (sous-traitance et preuves Qualiopi) | **ABANDON** | Chaque brique existe déjà, souvent gratuite : dossier formateur réutilisable entre OF (Portail des Formateurs, partenaire officiel du SYCFI), contrat + signature + émargement du formateur (Digiforma, SmartOF, Dendreo), attestations URSSAF avec alertes (CertiSkool, gratuit jusqu'à 5 dossiers). **Aucune obligation nouvelle en vigueur n'impose un logiciel** : la feuille papier reste valable et la vigilance semestrielle existe depuis longtemps. Potentiel < 1 M€ d'ARR. Notes : 47,5/100 (grille d'origine), 38,5/100 (grille v2) |
| **E-13** (relance de devis, Relanzio) | **Pas de projet de plusieurs années ; gel** (pas de nouveau code) | Test le moins coûteux, mais potentiel < 1 M€. Chaque maillon d'une expansion est tenu : devis (Obat : 15 000 clients, 12 M€ levés ; Tolteck, adossé à Saint-Gobain), e-facture (~130 PA), paiement (Qonto), financement (Faktus : 56 M€ levés). Note v2 : 49,5 |
| **Nouvelles pistes à fort potentiel** (31 candidats de 3 angles : systèmes d'enregistrement verticaux, API d'infrastructure, service-as-software IA) | **Aucune retenue pour un engagement** | Après red team, les trois meilleures tombent à environ 50/100 (propreté 51,0 ; API d'e-facturation 50,5 ; recouvrement au succès 49,5), avec un potentiel de 1 à 3 M€ pour un entrant. Chacune a un acteur financé en place, découvert seulement à la contre-recherche |
| **Méthode « choisir une idée sur dossier »** | **ARRÊT comme outil de sélection** ; conservée pour invalider (≤ 10 recherches par piste) | Trois fois de suite, une « lacune » fondée sur une absence de preuve a été réfutée : sous-traitants Qualiopi, puis Digiforma, puis Senef pour la propreté. La volonté de payer pour un nouvel entrant ne s'observe qu'en vendant |

**Ce que vous devriez faire maintenant** (détail en §7) :
1. **Un jour** : inventaire de vos accès réels. Dans quels secteurs pouvez-vous joindre 20 décideurs par votre réseau (anciens employeurs, famille, région, associations, communautés) ? Seul vous pouvez y répondre ; c'est désormais la variable la plus discriminante.
2. **30 jours de découverte terrain**, sans code, dans le secteur où vous avez le meilleur accès. À défaut, dans la propreté (NAF 81.21Z), avec des seuils d'arrêt écrits à l'avance.
3. **Critère global à 90 jours** : si aucun paiement n'est obtenu (précommande, service facturé), le problème est la distribution, pas l'idée. Les options deviennent alors : s'associer à quelqu'un qui a le réseau d'un secteur, rejoindre un éditeur vertical, ou vendre du service technique dans un secteur pour y acquérir l'accès.

**Incertitudes restantes** (toutes décisives) :
- votre accès réel à un secteur ;
- votre capacité à obtenir un premier paiement (Relanzio n'a pas encore de client payant) ;
- le contenu exact des textes officiels (Légifrance, guide v10, décret L8222-1-1), toujours inaccessibles depuis cet environnement ;
- l'exactitude des extraits de recherche, reformulés par un modèle.

---

## 1. Accès aux sources primaires : ce qui a été lu, et ce qui ne l'a pas été

| Source demandée | Résultat | Ce qui a été vérifié autrement |
|---|---|---|
| https://leportailformateurs.fr/sycfi | **Non lue** : DNS refusé par la politique réseau (2 tentatives, 2026-10-29) | Par extraits sur le domaine : page « Partenariat SYCFI » ; dossier formateur, coffre-fort, alertes d'expiration, « gestion d'équipe et sous-traitance (ind. 17, 18, 27) », dossier partageable avec plusieurs OF, inscription gratuite [AU-P01 à P04]. **Le prix de 39 € HT (33 € pour les adhérents) n'apparaît dans aucun extrait** : non confirmé, non infirmé. Ce document le retient tel que vous l'avez cité, étiqueté « source porteur » |
| help.digiforma.com (2 articles) | **Non lus** (DNS refusé) | Titres et extraits du centre d'aide : signature électronique des contrats de sous-traitance (option payante), émargement apprenants et formateurs, y compris à distance [AU-P08 à P11]. **Confirmé par extraits** |
| legifrance.gouv.fr (JORFTEXT000054608509) | **Non lu** (DNS refusé) | Le décret n° 2026-728 existe (plusieurs sources secondaires). Le texte de l'indicateur 27 n'est connu que par paraphrase : « s'assure du respect de la conformité » des sous-traitants, conformité « tracée dans les contrats » [AU-P16]. **Le texte intégral n'a pas été lu** ; les qualifications juridiques ci-dessous restent à confirmer sur Légifrance |

**Pour lever la limite** : paramètres de l'environnement cloud → Network access → ajouter `leportailformateurs.fr`, `help.digiforma.com`, `www.legifrance.gouv.fr` (https://code.claude.com/docs/en/cloud-environments#network-access). La relecture des quatre pages prendrait environ 15 minutes. Elle peut préciser un prix ou un article, mais elle ne changerait pas la décision : les fonctions concurrentes sont confirmées par plusieurs extraits indépendants.

---

## 2. Matrice de fonctionnalités concurrentes (D-37)
Source : `_work/audit2-D37.md` §A et `_work/audit2-D37-matrice.csv`.
- [ED] = extrait du domaine de l'éditeur ;
- [T] = tiers (comparateur, blog) ;
- « Non trouvé » = absence dans les extraits, **pas** une preuve d'absence.

