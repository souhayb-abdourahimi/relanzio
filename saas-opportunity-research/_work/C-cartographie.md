# C — Cartographie : opérations, commerce et services de proximité

Analyste C. Date : 2026-10-29. Périmètre : 7 familles attribuées (supply chain/douane, transport/flottes, commerce, restauration/hôtellerie, sport/événements/loisirs, achats/fournisseurs, télécoms).

## Note de méthode (à lire avant tout)
- ~38 recherches web (WebSearch). **WebFetch était bloqué dans cette session** (DNS non résolu pour taxation-customs.ec.europa.eu, rsa.ie, eaccny.com…). Aucune page n'a donc été ouverte directement : toutes les vérifications reposent sur le contenu des résultats de recherche (extraits et synthèses), en ciblant les domaines officiels (`allowed_domains`) chaque fois que c'était possible.
- Convention de statut : **VÉRIFIÉ** = l'affirmation provient d'un résultat issu du domaine officiel (EUR-Lex, Commission, ELA, impots.gouv, urssaf.fr, IRS, ARCEP…) et concorde avec au moins une autre source ; **PARTIEL** = sources secondaires concordantes ou source officielle vue seulement à travers une copie ; **HYPOTHÈSE** = raisonnement de l'analyste.
- Étiquettes utilisées ci-dessous : [FAIT] sourcé / [ESTIMATION] / [HYPOTHÈSE] / [INCONNU].
- Les prix concurrents ne sont repris dans la longlist que lorsqu'ils proviennent de la page de l'éditeur lui-même (tel que restitué par la recherche) ; sinon « inconnu ».

---

## 1. Supply chain, entrepôts, logistique, douane

**Acteurs payeurs** : PME importatrices (négoce acier/alu, fixations, quincaillerie, matériaux), e-commerçants importateurs, commissionnaires/transitaires de 5 à 50 personnes, représentants en douane indirects, 3PL PME, chargeurs PME (US : expéditeurs LTL).

**Workflows fréquents** : déclarations en douane (import, ENS ICS2), classement tarifaire, calcul droits/TVA, collecte de données fournisseurs (émissions CBAM, géolocalisation EUDR), rapprochement factures transport vs tarifs (freight audit), suivi des comptes palettes, gestion des réserves et litiges, demandes de remboursement (drawback, refunds IEEPA).

**Documents & systèmes** : DAU/entrées CBP (type 01/11), ENS, factures commerciales, BL/CMR/e-CMR, POD, registre CBAM, TRACES (EUDR), TMS/forwarding (CargoWise, Magaya, GoFreight), ACE (US), portails transporteurs.

**Contraintes structurelles** : données fournisseurs hors UE difficiles à obtenir ; logiciels douaniers soumis à certification/connexion aux systèmes nationaux ; forte saisonnalité réglementaire (dates qui glissent : EUDR reportée deux fois).

**Changements vérifiables**
- [FAIT] CBAM : période définitive depuis le 1er janvier 2026 ; seuil unique de 50 t/an par importateur (Règl. (UE) 2025/2083) ; statut de déclarant autorisé requis (demande au plus tard le 31 mars 2026 pour continuer d'importer) ; première déclaration annuelle (imports 2026) au 30 septembre 2027 ; vente des certificats à partir du 1er février 2027. Sources : taxation-customs.ec.europa.eu (pages « CBAM definitive regime », « Reminder: CBAM goes live », « CBAM successfully entered into force », 2026-01-14).
- [FAIT, PARTIEL] UK CBAM au 1er janvier 2027 ; HMRC a publié des valeurs par défaut par code NC en octobre 2026 (KPMG, 2026-10).
- [FAIT] EUDR reportée par le Règl. (UE) 2025/2650 (JOUE du 23/12/2025) : application au 30 décembre 2026, 30 juin 2027 pour micro et petits opérateurs, déclaration simplifiée pour ceux-ci (EY Global Tax News, 2026-01-20 ; SGS).
- [FAIT, PARTIEL] UE : droit de douane forfaitaire de 3 € par article (par catégorie tarifaire) sur les envois < 150 € à partir du 1er juillet 2026, provisoire jusqu'au 1er juillet 2028 ; distinct du futur « handling fee » (communiqué Conseil du 11/02/2026 vu via copies).
- [FAIT] France : taxe de 2 € par article sur les petits colis extra-UE < 150 €, art. 82 LF 2026, applicable depuis le 1er mars 2026, provisoire jusqu'au dispositif européen de frais de gestion (au plus tard le 31/12/2026) (info.gouv.fr / economie.gouv.fr).
- [FAIT] États-Unis : suspension du de minimis pour tous les pays à compter du 29 août 2025 ; fin des entrées type 86, entrée formelle (01) ou informelle (11) obligatoire (CBP CSMS).
- [FAIT, PARTIEL] États-Unis : la Cour suprême a invalidé les droits IEEPA (6-3) ; le CIT a ordonné des remboursements ; CBP prépare un portail de réclamations « CAPE » ; <10 % des importateurs éligibles avaient activé l'ACH fin mars 2026 (Tradlinx, BakerLaw, Mondaq). [INCONNU] état réel de CAPE au 29/10/2026.
- [FAIT] ICS2 Release 3 : fenêtre de déploiement des transporteurs routiers du 1er avril au 1er septembre 2025 (Revenue Irlande, AADE).
- [FAIT] eFTI : application complète le 9 juillet 2027 (Commission, DG MOVE).
- [FAIT, PARTIEL] CargoWise (éditeur dominant des transitaires) : passage en décembre 2025 à une tarification par transaction (« Value Packs »), hausses rapportées de 20 % à plus de 50 % ; les petits et moyens transitaires réévaluent leurs options (The Loadstar, Breakbulk).

**Niches repérées** : CBAM multi-clients pour représentants en douane ; déclaration simplifiée EUDR pour micro-opérateurs ; contrôle des droits forfaitaires 3 €/2 € refacturés ; préparation des réclamations IEEPA ; drawback pour PME ; audit des frais par transaction CargoWise ; comptes palettes ; litiges transporteurs.

**Couverture** : MOYENNE-ÉLEVÉE sur la réglementation douanière et CBAM ; FAIBLE sur les 3PL PME (WMS, facturation stockage) et la preuve de livraison. Angles non couverts : facturation 3PL et rapprochement stockage, réforme du code des douanes de l'Union (data hub ~2028), post-Brexit UK (BTOM).

---

## 2. Transport et flottes

**Acteurs payeurs** : transporteurs routiers PME (5–50 véhicules), messageries express en VUL à l'international (forte présence PL, LT, RO, ES, NL), déménageurs, taxis conventionnés et ambulanciers (FR), flottes d'entreprise, transporteurs US (owner-operators à 50 camions).

**Workflows** : téléchargement et analyse des tachygraphes (carte conducteur tous les 28 jours, unité véhicule tous les 90 jours [connaissance générale, non vérifié ici]), déclarations de détachement IMI, temps de travail (LIC / Mobilic), dossiers DQ et Clearinghouse (US), IFTA, désignation conducteur ANTAI, facturation CPAM des taxis.

**Documents & systèmes** : fichiers .DDD, déclarations IMI, LIC/Mobilic, contrats de transport, factures CPAM/SEFi, permis/CDL, rapports FMCSA.

**Contraintes** : marges faibles, fragmentation, multilinguisme (UE), logiciels de tachygraphe déjà peu chers.

**Changements vérifiables**
- [FAIT] Depuis le 1er juillet 2026, les VUL de plus de 2,5 t et jusqu'à 3,5 t utilisés en transport international ou en cabotage sont soumis aux temps de conduite et de repos (Règl. 561/2006), au tachygraphe intelligent G2V2 et aux règles de détachement des conducteurs ; le national et le compte propre sont exclus (ELA, DG MOVE).
- [FAIT, PARTIEL] Préparation : selon une enquête IRU, à environ deux mois de l'échéance, 88 % des VUL concernés n'avaient pas encore d'appareil installé et seuls 27,7 % des opérateurs se disaient prêts ; selon Kienzle, une flotte sur trois n'était pas prête à la date (trans.info).
- [FAIT] Fin du rétrofit tachygraphe pour les poids lourds en août 2025 (DG MOVE, 2025-08-19).
- [FAIT, PARTIEL] France : arrêté du 6 mars 2025 créant le LIC électronique (Mobilic) pour le transport sans tachygraphe (< 3,5 t, déménagement) (Kohen Avocats, ecologie.gouv.fr).
- [FAIT, PARTIEL] Taxis conventionnés : nouvelle convention en vigueur depuis le 1er novembre 2025 (forfait de 13 € par prise en charge, 15 € en zone urbaine, fin du retour à vide, au moins 50 % de l'activité dans la zone de stationnement) ; baisse de tarifs d'environ 40 % évoquée (questions écrites AN).
- [FAIT, PARTIEL] États-Unis : règle CDL « non-domiciled » en vigueur le 16 mars 2026 (contestée) ; maîtrise de l'anglais devenue condition d'immobilisation (out-of-service), plus de 20 000 conducteurs immobilisés depuis juin 2025 (fiche DOT, TCIA).

**Niches** : pack conformité VUL international (tachygraphe + détachement + infractions) ; génération des déclarations IMI à partir des données tachygraphe ; vérification ELP/CDL pour petits transporteurs US ; facturation/optimisation des taxis conventionnés.

**Couverture** : MOYENNE. Non couvert : ambulances (FR/US), VTC, ANTAI (aucune recherche dédiée), maintenance de flotte, IFTA.

---

## 3. Commerce physique et e-commerce

**Acteurs payeurs** : vendeurs marketplace PME (UE et hors UE vendant dans l'UE), DTC Shopify, franchisés, cabinets comptables e-commerce.

**Workflows** : rapprochement des reversements marketplace, enregistrements EPR par pays (emballages, DEEE, piles), dossiers de sécurité produit (GPSR), OSS/IOSS, accessibilité du site, retours et litiges de paiement (chargebacks).

**Documents & systèmes** : rapports de règlement Amazon, numéros EPR (LUCID en Allemagne, etc.), fiches GPSR/personne responsable, déclarations OSS/IOSS.

**Changements vérifiables**
- [FAIT] GPSR (Règl. 2023/988) applicable depuis le 13 décembre 2024 : une personne responsable établie dans l'UE est obligatoire et doit figurer dans les annonces de vente à distance ; les marketplaces ne doivent pas publier une offre sans ces informations (EUR-Lex, FAQ Commission).
- [FAIT, PARTIEL] PPWR (Règl. 2025/40) applicable depuis le 12 août 2026 : un producteur non établi dans le pays de mise sur le marché doit désigner un représentant autorisé pour la REP. Une proposition de suspension partielle (producteurs UE jusqu'en 2035) est signalée, statut [INCONNU] (Expando, Coolset).
- [FAIT, témoignages] Amazon supprime ou suspend les annonces non conformes à la REP en Allemagne et en France ; des vendeurs se disent perdus sur les forums Seller Central.
- [FAIT] EAA : s'applique aux services de commerce électronique fournis aux consommateurs après le 28 juin 2025 ; les micro-entreprises de services (< 10 salariés et ≤ 2 M€) sont exemptées (EUR-Lex, Conseil).
- [FAIT] ViDA adopté le 11 mars 2025 : certaines clarifications OSS/IOSS au 1er janvier 2027, enregistrement TVA unique au 1er juillet 2028, facturation électronique et déclaration numérique intra-UE au 1er juillet 2030 (Commission).

**Niches** : REP emballages multi-pays + représentant autorisé ; dossier GPSR pour vendeurs hors UE ; préparation IOSS 2028.

**Couverture** : MOYENNE. Les marchés du rapprochement des reversements (A2X, Link My Books) et des chargebacks sont jugés saturés [ESTIMATION] ; retours non couverts.

---

## 4. Restauration et hôtellerie

**Acteurs payeurs** : restaurants indépendants et petits groupes (2–20 sites), franchisés, chaînes de 20 sites ou plus (Californie), hôtels indépendants, campings, loueurs de véhicules (Espagne).

**Workflows** : saisie des factures fournisseurs et calcul du food cost, inventaires, fiches techniques et allergènes, plannings, pourboires, rapprochement des reversements des plateformes de livraison, enregistrement des voyageurs, taxe de séjour.

**Changements vérifiables**
- [FAIT] France : depuis le 1er septembre 2026, toutes les entreprises doivent pouvoir recevoir des factures électroniques ; les grandes entreprises et ETI émettent depuis cette date, les PME et micro-entreprises à partir du 1er septembre 2027 ; même calendrier pour l'e-reporting (impots.gouv.fr, economie.gouv.fr). **Conséquence [HYPOTHÈSE forte]** : les grossistes alimentaires de taille GE/ETI envoient déjà des factures structurées aux restaurateurs, ce qui rend possible le calcul automatique du food cost ligne par ligne.
- [FAIT] Espagne : RD 933/2021 (SES.Hospedajes) appliqué depuis le 2 décembre 2024 pour l'hébergement et la location de véhicules ; amendes de 601 à 30 000 € (presse, Chekin).
- [FAIT, PARTIEL] Californie : SB 68 (ADDE Act), divulgation des 9 allergènes majeurs par les chaînes de 20 sites ou plus à partir du 1er juillet 2026 ; le seuil est interprété différemment selon les sources (CalRest, AFS Law).
- [FAIT] États-Unis : « no tax on tips » (2025-2028), nouveaux champs sur le W-2 2026 (box 12 code TP, box 14b Treasury Tipped Occupation Code) (IRS).
- [FAIT, PARTIEL] France : Booking a reversé la taxe de séjour du second semestre 2025 le 16/01/2026, hors délai, avec une déclaration incomplète (question écrite AN n° 13144).

**Concurrence observée** : MarginEdge à 330 $ par site et par mois (page tarifs officielle) ; FR : Koust, Steandy, Onrush, FoodCost PRO (tarifs inconnus) ; livraison : Loop AI et Voosh aux États-Unis ; Espagne : Chekin.

**Couverture** : MOYENNE. Non couvert : HACCP digital, plannings/pourboires FR, commissions Booking côté hôtel.

---

## 5. Sport, événements, loisirs

**Acteurs payeurs** : clubs et associations (budget faible, bénévoles), salles privées, organisateurs d'événements, campings, centres de loisirs.

**Changements vérifiables** : [FAIT] contrôle d'honorabilité des éducateurs et encadrants bénévoles, opéré par l'État via le « SI Honorabilité » et les fédérations (guide Ministère des Sports du 05/02/2026, FFCK) : le système public couvre déjà le besoin.

**Niches** [HYPOTHÈSE] : rapprochement de la billetterie et des reversements pour les associations ; gestion du matériel loué ; taxe de séjour et registre clients dans les campings (voir famille 4).

**Couverture** : FAIBLE (2 recherches seulement). Volonté de payer jugée faible côté associations [ESTIMATION]. Non couvert : règle FTC « junk fees » pour la billetterie (US), assurances et déclarations préfectorales d'événements.

---

## 6. Achats et fournisseurs

**Acteurs payeurs** : DAF et acheteurs de PME/ETI, donneurs d'ordre recourant à la sous-traitance (BTP, nettoyage, transport, événementiel, industrie).

**Workflows** : collecte et renouvellement semestriel des attestations de vigilance, rapprochement à trois voies commande/réception/facture, onboarding fournisseurs, contrats.

**Changements vérifiables**
- [FAIT] Vigilance URSSAF : attestation exigée pour tout contrat d'au moins 5 000 € HT, à la conclusion puis tous les 6 mois ; solidarité financière du donneur d'ordre ; depuis la LFSS 2023, sanction plafonnée à 15 000 € (personne physique) ou 75 000 € (personne morale) pour un premier manquement ; annulation possible des exonérations (urssaf.fr, Légifrance).
- [FAIT] La facturation électronique (voir famille 4) fournit des données structurées pour le rapprochement à trois voies, réception obligatoire depuis le 01/09/2026.
- [FAIT, PARTIEL] CSDDD après Omnibus I : seuils de 5 000 salariés et 1,5 Md€ de chiffre d'affaires, application au 26 juillet 2029 : hors cible PME (MoFo, DLA Piper).

**Concurrence** : Provigis, e-attestations, Attestation Légale (tarifs non trouvés) ; plateformes agréées (Cegid, Sage…) pour le rapprochement.

**Couverture** : MOYENNE. Non couvert : appels d'offres, gestion des contrats fournisseurs.

---

## 7. Télécommunications

**Acteurs payeurs** : intégrateurs et revendeurs télécoms (FR/UK), petits opérateurs VoIP (US), entreprises multi-sites, gestionnaires d'ascenseurs, d'alarmes et de téléassistance.

**Changements vérifiables**
- [FAIT] France : fermeture commerciale du cuivre dans environ 25 000 communes depuis fin janvier 2026 ; lot 3 en janvier 2027 (2 097 communes selon l'ARCEP), lot 4 en 2028, lot 5 en 2029, extinction visée fin 2030 (ARCEP, Selectra).
- [FAIT, PARTIEL] Royaume-Uni : extinction du PSTN le 31 janvier 2027 sans report ; environ 1,5 M de lignes encore sur cuivre, dont ~350 000 locaux professionnels (Openreach cité par Mobile Europe) ; risques identifiés pour les ascenseurs, alarmes et TPE (Stannah).
- [FAIT, PARTIEL] États-Unis : la recertification annuelle dans la Robocall Mitigation Database est due au 1er mars ; amendes de base de 10 000 $ par information fausse et 1 000 $ par défaut de mise à jour, en vigueur le 5 février 2026 (Womble Bond Dickinson, NatLawReview).
- [ESTIMATION vendeurs] Jusqu'à 20 % des factures télécoms contiendraient des erreurs (Gartner cité par un livre blanc du Crown Commercial Service).

**Niches** : inventaire et planification de la migration des lignes cuivre critiques ; calendrier et dépôts de conformité FCC pour petits VoIP ; audit des factures télécoms multi-sites.

**Couverture** : MOYENNE. Non couvert : obligations ARCEP des petits FAI, factures inter-opérateurs.
