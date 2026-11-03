# C — Top 8 pistes et éliminations (analyste C : opérations, commerce, proximité)

Date : 2026-10-29. Grille sur 100 : Douleur & budget (20) · Fréquence/criticité (10) · Preuves de demande (15) · Distribution (15) · Lacune concurrentielle (10) · Faisabilité MVP (10) · Marge & récurrence (5) · Timing (5) · Défendabilité (5) · Risques (5).
Rappel méthode : WebFetch était bloqué dans cette session, donc les vérifications reposent sur les résultats WebSearch, en ciblant les domaines officiels (voir C-cartographie.md). Aucune piste n'a de preuve directe de volonté de payer côté UE ; les preuves sont réglementaires (fortes) et concurrentielles (prix observés).

## Synthèse

| Rang | ID | Piste | Pays | Score | Confiance |
|---|---|---|---|---|---|
| 1 | C-14 | Pack conformité VUL 2,5-3,5 t à l'international (tachygraphe + infractions + détachement IMI) | UE | 69 | moyenne |
| 2 | C-37 | Inventaire et pilotage de la migration des lignes cuivre critiques pour intégrateurs télécoms | FR + UK | 68 | moyenne-faible |
| 3 | C-01 | CBAM pour PME importatrices, version multi-clients pour représentants en douane | UE (+UK 2027) | 67 | moyenne |
| 4 | C-27 | Food cost alimenté par les factures électroniques structurées (Factur-X/UBL) | FR | 64 | moyenne-faible |
| 5 | C-21 | REP emballages multi-pays + PPWR (représentant autorisé) pour e-commerçants | UE | 64 | moyenne |
| 6 | C-35 | Rapprochement à trois voies sur e-factures pour PME/ETI | FR | 63 | faible |
| 7 | C-39 | Calendrier et dépôts de conformité FCC (RMD, CPNI, 499-A) pour petits opérateurs VoIP | US | 62 | faible |
| 8 | C-34 | Vigilance URSSAF des sous-traitants hors BTP | FR | 61 | moyenne |

---

### 1. C-14 — Pack conformité « fourgons internationaux » (UE) — **69/100** — confiance moyenne
- **Acheteur** : gérant d'une messagerie express ou d'un transporteur en VUL de 5 à 100 fourgons faisant de l'international ou du cabotage (PL, LT, RO, ES, NL, DE, FR).
- **Problème** : depuis le 01/07/2026, des équipes sans aucune culture du tachygraphe doivent télécharger et analyser les données, respecter les temps de conduite et déposer les déclarations de détachement.
- Douleur 14 : amendes et immobilisations réelles, mais marges faibles du secteur.
- Fréquence 9 : téléchargements et contrôles routiers récurrents, détachement à chaque mission.
- Preuves 11 : obligation confirmée par l'ELA et la DG MOVE. Selon l'IRU, seuls 27,7 % des opérateurs étaient prêts et 88 % des VUL n'avaient pas d'appareil deux mois avant l'échéance (trans.info).
- Distribution 9 : cible fragmentée et multilingue ; canaux possibles via les ateliers installateurs de tachygraphes, les associations nationales et les loueurs de VUL.
- Lacune 5 : l'analyse tachygraphe est banalisée (Tachogram à 3,99 €/conducteur/mois, Tachomaster à 1 £/semaine) ; le créneau libre est l'offre VUL clé en main combinant tachygraphe et détachement IMI.
- Faisabilité 6 : analyse des fichiers .DDD faisable ; le téléchargement à distance demande du matériel et une authentification par carte entreprise ; disponibilité d'une API IMI inconnue.
- Marge 4 · Timing 5 (obligation de juillet 2026 encore mal absorbée) · Défendabilité 3 · Risques 3 (concurrents établis qui peuvent ajouter un module VUL).

### 2. C-37 — Migration des lignes cuivre critiques (FR + UK) — **68/100** — confiance moyenne-faible
- **Acheteur** : intégrateur ou revendeur télécom de 2 à 50 personnes. Acheteurs secondaires : ascensoristes, télésurveilleurs, entreprises multi-sites.
- **Problème** : retrouver chaque ligne cuivre client (y compris les usages critiques : ascenseur, alarme, TPE, téléassistance), la rapprocher de la date de fermeture de sa commune ou de l'échéance UK, et piloter la migration.
- Douleur 13 : risque de sécurité et de responsabilité (ascenseurs), chiffre d'affaires de migration à capter pour le revendeur.
- Fréquence 6 : projet de plusieurs années, pas un flux perpétuel.
- Preuves 10 : calendrier ARCEP (lot 3 en janvier 2027, lots 4-5 en 2028-2029, fin 2030) ; Openreach sans report au 31/01/2027 avec ~350 000 locaux professionnels encore sur cuivre ; alerte de Stannah sur les ascenseurs. Aucun signal direct de volonté de payer.
- Distribution 10 : population d'intégrateurs identifiable (réseaux de distributeurs d'opérateurs, salons, associations professionnelles).
- Lacune 6 : concurrence **non recherchée** (INCONNU), à vérifier en priorité.
- Faisabilité 8 : import CSV + fichier de trajectoire public d'Orange + workflow. MVP en 4 semaines.
- Marge 4 · Timing 5 · Défendabilité 2 (fenêtre qui se ferme en 2030 ; pivot possible vers l'inventaire télécom multi-sites, C-38) · Risques 4.

### 3. C-01 — CBAM PME / représentants en douane multi-clients (UE) — **67/100** — confiance moyenne
- **Acheteur** : représentant en douane indirect ou transitaire PME gérant 20 à 200 importateurs de produits CBAM. Alternative : DAF d'un négoce de fixations ou d'aluminium.
- Douleur 15 : coût des certificats (vendus à partir du 01/02/2027), valeurs par défaut pénalisantes, statut de déclarant autorisé obligatoire.
- Fréquence 6 : déclaration annuelle (30/09/2027) et couverture trimestrielle des certificats à partir de 2027.
- Preuves 11 : pages de la Commission (régime définitif, seuil de 50 t, Règl. 2025/2083) ; enquête BusinessEurope (80 % de recours aux valeurs par défaut, données fournisseurs = premier défi).
- Distribution 9 : les représentants en douane concentrent les importateurs ; extension UK CBAM au 01/01/2027.
- Lacune 4 : marché déjà animé (The Sustainability Cloud à 60-200 €/mois, Dubrink, CBAMBOO, PwC à 990 €/mois). Le créneau multi-clients pour courtiers reste à confirmer.
- Faisabilité 7 · Marge 4 · Timing 5 · Défendabilité 3 (données fournisseurs mutualisées entre clients) · Risques 3 (règles encore modifiées par les Omnibus).

### 4. C-27 — Food cost à partir des e-factures (FR) — **64/100** — confiance moyenne-faible
- **Acheteur** : restaurateur indépendant ou petit groupe de 1 à 15 sites (et son expert-comptable comme prescripteur).
- Douleur 13 : le food cost est le premier poste variable ; la saisie des factures est pénible.
- Fréquence 9 : livraisons et factures hebdomadaires.
- Preuves 8 : catalyseur vérifié (réception obligatoire au 01/09/2026, émission des GE/ETI depuis la même date, donc les grands grossistes envoient déjà des factures structurées : HYPOTHÈSE forte). Volonté de payer prouvée aux États-Unis (MarginEdge à 330 $/site/mois), pas en France.
- Distribution 8 : canaux experts-comptables et plateformes agréées ; la restauration est coûteuse à prospecter.
- Lacune 4 : entrants FR (Koust, Steandy, Onrush, FoodCost PRO) qui font surtout de l'OCR. La différenciation par lecture native Factur-X/UBL est réelle mais copiable.
- Faisabilité 7 (dépend de l'accès aux API des plateformes agréées, INCONNU) · Marge 4 · Timing 5 · Défendabilité 3 · Risques 3.

### 5. C-21 — REP emballages multi-pays + PPWR (UE) — **64/100** — confiance moyenne
- **Acheteur** : e-commerçant PME (UE ou hors UE) vendant dans 3 à 10 pays.
- Douleur 14 : annonces Amazon supprimées ou suspendues, éco-contributions récupérées, représentant autorisé obligatoire depuis le 12/08/2026.
- Fréquence 6 : enregistrements, puis déclarations périodiques.
- Preuves 11 : fils Seller Central (vendeurs perdus), sources PPWR concordantes.
- Distribution 10 : communautés de vendeurs Amazon, comptables e-commerce, agrégateurs.
- Lacune 4 : nombreux prestataires (ecosistant, Avask, Lizenzero/Interzero).
- Faisabilité 5 : chaque système national est différent et le rôle de représentant autorisé exige une entité juridique, d'où un modèle hybride logiciel + partenaires.
- Marge 3 (part de service) · Timing 5 · Défendabilité 3 · Risques 3 (proposition de suspension partielle, statut INCONNU).

### 6. C-35 — Rapprochement à trois voies sur e-factures (FR) — **63/100** — confiance faible
- **Acheteur** : responsable comptabilité fournisseurs d'une PME/ETI industrielle ou de négoce (50 à 1 000 salariés).
- Douleur 13 · Fréquence 9 (quotidienne).
- Preuves 7 : catalyseur officiel (DGFiP, Bercy), mais aucun signal de demande spécifique au rapprochement à trois voies.
- Distribution 7 : intégration ERP nécessaire, cycle de vente plus long.
- Lacune 5 : les plateformes agréées et les ERP vont probablement absorber la fonction.
- Faisabilité 7 · Marge 4 · Timing 5 · Défendabilité 3 · Risques 3.

### 7. C-39 — Conformité FCC des petits opérateurs VoIP (US) — **62/100** — confiance faible
- **Acheteur** : fondateur d'un petit opérateur ou revendeur VoIP US.
- Douleur 13 : amende de base de 10 000 $ par fausse information, 1 000 $ par défaut de mise à jour (en vigueur au 05/02/2026), risque de blocage des appels en cas de retrait de la RMD.
- Fréquence 5 : annuelle, plus les mises à jour.
- Preuves 9 : multiples alertes de cabinets d'avocats (NatLawReview, Womble).
- Distribution 9 : la base RMD publique pourrait servir de liste de prospects (HYPOTHÈSE à vérifier).
- Lacune 5 : aujourd'hui servi par des cabinets et consultants ; existence d'un SaaS INCONNUE.
- Faisabilité 7 · Marge 4 · Timing 4 · Défendabilité 3 · Risques 3 (expertise réglementaire requise ; frais de 100 $ non encore effectifs).

### 8. C-34 — Vigilance URSSAF des sous-traitants hors BTP (FR) — **61/100** — confiance moyenne
- **Acheteur** : DAF ou acheteur de PME/ETI dans le transport, le nettoyage, la sécurité ou l'événementiel, avec 20 à 500 sous-traitants.
- Douleur 12 : solidarité financière, sanctions LFSS 2023 jusqu'à 75 000 € pour une personne morale, annulation possible des exonérations (urssaf.fr).
- Fréquence 7 : renouvellement tous les 6 mois par sous-traitant.
- Preuves 9 : obligation officielle, mais aucun témoignage d'acheteur.
- Distribution 8 · Lacune 4 (Provigis, e-attestations, Attestation Légale ; tarifs non trouvés) · Faisabilité 8 (API de vérification URSSAF INCONNUE).
- Marge 4 · Timing 2 (aucun catalyseur nouveau) · Défendabilité 3 · Risques 4.

Juste sous la barre : C-26, rapprochement des reversements Uber Eats/Deliveroo pour restaurateurs UE (60). Le besoin est validé aux États-Unis par Loop AI et Voosh, mais l'accès aux données des plateformes est risqué.

---

## Pistes éliminées

1. **C-22 — Rapprochement des reversements marketplace (Amazon/Shopify vers la comptabilité)**. Critère : *lacune concurrentielle nulle et marge défavorable*. A2X (dès 29 $/mois) et Link My Books (environ 21 $/mois en entrée, selon des sites tiers) servent déjà ce marché à bas prix ; aucun catalyseur.
2. **C-32 — Contrôle d'honorabilité des encadrants de clubs sportifs (FR)**. Critère : *pas de volonté de payer plausible*. L'État opère gratuitement le contrôle (SI Honorabilité, croisement FIJAISV via les licences fédérales, guide du 05/02/2026) et l'acheteur est une association bénévole.
3. **C-36 — CSDDD / devoir de vigilance européen**. Critère : *acheteur hors de portée d'une équipe de 1 à 3 personnes*. Après Omnibus I, seules les entreprises de plus de 5 000 salariés et 1,5 Md€ sont visées, avec une application au 26/07/2029 ; marché de grandes plateformes ESG.

Autres pistes déclassées (non éliminatoires) : C-17, taxis conventionnés (revenus en baisse d'environ 40 %, budget comprimé) ; C-16, Mobilic (outil public gratuit) ; C-06, réclamations IEEPA (ponctuel, non récurrent).

## Vérifications prioritaires pour la phase 2
- C-37 : cartographier les concurrents (outils d'inventaire cuivre) et confirmer que le fichier de trajectoire d'Orange est réutilisable.
- C-14 : existence d'une API IMI pour le détachement ; offres VUL de Tachogram, Webfleet et autres ; 5 entretiens avec des opérateurs polonais ou lituaniens.
- C-27 : accès API aux factures reçues via les principales plateformes agréées ; part des grossistes alimentaires qui émettent déjà des factures structurées.
- C-01 : intérêt des représentants en douane pour un outil multi-clients (3 à 5 appels).
