# Alternatives négligées : contre-vérification rapide de 5 pistes non approfondies

- Date : 2026-10-29. Éclaireur « alternatives négligées ».
- Question : une piste non approfondie peut-elle dépasser **62,5/100** (meilleure note après due diligence, DD-D37) une fois les preuves contraires cherchées ?
- Méthode : 4 à 6 recherches orientées invalidation par piste (gratuit, outil public, éditeur en place, prix bas, report) et 1 à 2 recherches de volonté de payer. WebFetch est bloqué (échec de résolution DNS sur gov.uk) : **seuls les extraits de recherche ont été lus**, aucune page n'a été ouverte. Toutes les preuves sont dans `alternatives-preuves.csv` (ALT-P01 à ALT-P51 : 19 POUR, 25 CONTRE, 7 NEUTRE).
- Grille : Douleur 20, Fréquence 10, Preuves 15, Distribution 15, Lacune 10, Faisabilité 10, Marge 5, Timing 5, Défendabilité 5, Risques 5 (notes de 0 à 10). Le profil du fondateur (francophone, solo ou 1 à 3 personnes, technique + IA, capital modéré, stack Node/Supabase/Stripe/Brevo, aucun client) est pris en compte surtout en Distribution, Faisabilité et Risques.

## Synthèse

| Piste | Note initiale | Nouvelle note | Écart | Dépasse 62,5 ? |
|---|---|---|---|---|
| C-39 Conformité FCC des petits opérateurs VoIP US | 64,0 | **61,0** (64,0 dans le scénario haut avec un canal partenaire) | −3,0 | Non. Seulement sous condition non vérifiée |
| C-01 CBAM multi-clients pour représentants en douane | 63,5 | **58,5** | −5,0 | Non |
| C-14 Pack conformité fourgons 2,5-3,5 t | 63,0 | **58,5** | −4,5 | Non |
| D-15 MTD ITSA pour petits cabinets UK | 65,5 | **57,0** | −8,5 | Non |
| E-21 Contrats d'influence conformes (FR) | 64,5 | **57,0** | −7,5 | Non |

**Conclusion : aucune piste ne dépasse 62,5 après recherche contraire.** Le même schéma se répète : outil gratuit ou très bon marché, éditeur en place qui ajoute la fonction, ou catalyseur déjà passé. La seule piste qui reste près du plafond est C-39, parce qu'aucun SaaS dédié n'a été trouvé. Elle ne le dépasse que si l'on suppose un canal de distribution américain (plateformes de gros ou UCaaS qui revendent à des revendeurs), ce qui n'est pas prouvé et va contre le profil du fondateur.

---

## C-39 : calendrier et dépôts FCC (RMD, CPNI, 499-A) pour petits opérateurs VoIP US

### Preuves contre
- **Service externalisé installé** : JSI, qui a absorbé Inteserra, dit traiter plus de 2 500 dépôts réglementaires par mois (ALT-P08, déclaratif éditeur). TransNexus et de nombreux cabinets (Wiley, Womble, Kelley Drye, Lerman Senter) occupent le terrain du conseil.
- **Outils publics gratuits** : la certification CPNI se dépose via une application web de la FCC (ALT-P10). Les plateformes de gros et UCaaS (RingLogix, SkySwitch) publient des guides gratuits pour leurs revendeurs (ALT-P11, P12).
- **Pression réglementaire moins forte que prévu** : les frais de 100 $ ne sont pas encore en vigueur, en attente de l'OMB (ALT-P03, attribution exacte incertaine). La vague d'exclusion de septembre 2026 ne vise que **14** sociétés (ALT-P04), contre plus de 1 200 en 2025.
- **Saisonnalité** : la recertification RMD et le CPNI ont lieu en mars et le 499-A au 1er avril. Le prochain pic est en février-avril 2027, puis il faut attendre un an.
- **Profil du fondateur** : marché américain uniquement, acheteurs habitués à des avocats américains, responsabilité en cas de dépôt erroné (amende de base de 10 000 $ pour une donnée fausse). La crédibilité et la distribution sont difficiles pour un fondateur francophone sans réseau télécom.

### Preuves pour
- **La liste de prospects publique existe** : 9 242 entreprises figuraient dans le RMD au 28/09/2025 (U.S. PIRG, ALT-P01). L'hypothèse de la longlist est confirmée.
- **Erreurs massives et sanctions réelles** : 2 411 déclarants ont reçu l'ordre de corriger leurs dépôts (ALT-P06), plus de 1 200 ont été retirés en août 2025 (ALT-P05), et Vonage a payé 2 M$ pour des dépôts 499 (ALT-P09). Une règle finale de janvier 2026 impose une recertification annuelle, des mises à jour sous 10 jours et des amendes de 10 000 $ et 1 000 $ (ALT-P02). La FCC propose de nouvelles exigences en septembre 2026 (ALT-P15).
- **De nouveaux assujettis arrivent** : les revendeurs d'agents vocaux IA avec numéros peuvent devenir des « voice providers » (ALT-P14). Les revendeurs portent eux-mêmes les obligations (ALT-P12). Un revendeur a découvert tard le 499-A et paie 100 $ par mois de pénalité (ALT-P13).
- **Lacune** : aucun SaaS dédié de type calendrier et dépôts pour petits opérateurs VoIP n'a été trouvé en trois recherches. C'est une absence de résultat, pas une preuve d'absence.
- **Volonté de payer** : aucun tarif public de service de conformité n'a été trouvé. La volonté de payer reste **non prouvée**.

### Nouvelle note

| Critère (poids) | Ancien | Nouveau | Justification |
|---|---|---|---|
| Douleur et budget (20) | 7 | 7 | Les sanctions sont réelles, mais aucun prix n'est observé |
| Fréquence (10) | 5 | 5 | Pics annuels (mars-avril) et mises à jour sous 10 jours |
| Preuves (15) | 6 | 7 | Taille de la base et vagues d'exclusion vérifiées |
| Distribution (15) | 7 | 5 | Liste publique, mais marché US, confiance juridique, fondateur FR |
| Lacune (10) | 6 | 6 | Pas de SaaS trouvé, mais des services (JSI) et des cabinets |
| Faisabilité (10) | 7 | 6 | 499-A (revenus, safe harbor) et responsabilité |
| Marge (5) | 8 | 8 | Logiciel pur |
| Timing (5) | 7 | 7 | Cycle de mars 2027 et nouvelles propositions FCC |
| Défendabilité (5) | 5 | 5 | Base réglementaire à maintenir |
| Risques (5) | 5 | 4 | Responsabilité sur les dépôts, frais de 100 $ suspendus |
| **Total** | **64,0** | **61,0** | Scénario haut (Distribution 7 via un canal UCaaS) : 64,0 |

**Verdict** : 61,0/100 avec une confiance faible. C'est la seule piste qui reste proche du plafond, mais elle ne le dépasse qu'avec une hypothèse de distribution non prouvée (partenariat avec une plateforme de gros qui fournit déjà des guides à ses revendeurs). Pour valider à faible coût : interroger 10 petits opérateurs tirés du RMD sur ce qu'ils paient aujourd'hui (cabinet, JSI, rien) et contacter une plateforme UCaaS pour un modèle en marque blanche. Sans signal de prix, la piste ne passe pas devant DD-D37.

---

## D-15 : outil MTD ITSA pour petits cabinets UK (vague d'avril 2027)

### Preuves contre
- **Gratuit côté bailleurs** : GetGround se dit reconnu par HMRC et entièrement gratuit (ALT-P16). RentalBux est gratuit pour un bien jusqu'en avril 2028, August est gratuit jusqu'à la soumission, et Hammock, Landlord Vision et Landlord Studio sont reconnus (ALT-P17).
- **Prix plancher côté cabinets** : 123 Sheets vend le bridging pour comptables à environ 9,96 £ HT par mois pour 100 entreprises, soit 0,10 £ par client et par mois (ALT-P18). TaxCalc serait moins cher encore selon un forum (ALT-P21). La fourchette du marché va de 20 £ par client et par an à plus de 40 £ par client et par mois (ALT-P19).
- **L'angle « IA + multi-clients » est déjà pris** : Abridged vend un bridging MTD ITSA « IA » avec tableau de bord multi-clients (ALT-P20).
- **Barrière d'entrée** : il faut obtenir la reconnaissance HMRC. Xero, QuickBooks, FreeAgent, IRIS et Dext sont déjà dans les cabinets.
- **Pénalités adoucies** la première année selon plusieurs sources (contradictoires), ce qui réduit l'urgence.
- **Profil du fondateur** : marché UK, fiscalité UK, aucun réseau de comptables britanniques.

### Preuves pour
- **Volume** : environ 1 077 000 personnes de plus entrent dans MTD en avril 2027 (ALT-P22). Aucun report n'a été trouvé.
- **Retard d'équipement** : 31 % des sondés étaient équipés en mai 2026 et un sur quatre tient encore papier ou tableur (ALT-P23, enquête d'un éditeur concurrent). Le même éditeur chiffre le coût à environ 3 311 £ par an et 13 heures par mois (ALT-P24, chiffre intéressé). La douleur existe, mais elle est captée par des offres moins chères.

### Nouvelle note

| Critère (poids) | Ancien | Nouveau | Justification |
|---|---|---|---|
| Douleur et budget (20) | 7 | 6 | Douleur réelle, mais le budget logiciel s'effondre (gratuit à 0,10 £ par client) |
| Fréquence (10) | 9 | 9 | Trimestriel |
| Preuves (15) | 8 | 8 | Volumes officiels |
| Distribution (15) | 6 | 5 | UK, fondateur FR, canal comptable saturé par les éditeurs |
| Lacune (10) | 3 | 2 | Gratuits, bridging bon marché, multi-clients IA existant |
| Faisabilité (10) | 5 | 4 | Reconnaissance HMRC et fiscalité UK |
| Marge (5) | 8 | 5 | Prix de marché très bas |
| Timing (5) | 10 | 9 | Six mois, mais marché déjà servi |
| Défendabilité (5) | 4 | 3 | Fonction banalisée |
| Risques (5) | 5 | 4 | Cible de seuil 20 000 £ en révision, politique fiscale |
| **Total** | **65,5** | **57,0** | |

**Verdict** : 57,0/100. Le catalyseur est le plus solide des cinq pistes, mais c'est un marché de commodité : gratuit côté bailleurs, quelques pence par client côté cabinets, et un concurrent qui a déjà l'angle IA multi-clients. À abandonner.

---

## E-21 : contrats d'influence conformes (seuil de 1 000 €) pour agences et marques FR

### Preuves contre
- **Modèles gratuits** : un cabinet d'avocats offre deux modèles gratuits (marque-créateur et via agence) (ALT-P25).
- **Outil existant bon marché** : Infloxy génère des contrats dès 19 $ avec une version gratuite (ALT-P26). Kolsquare, plateforme installée, a déjà lancé un « Compliance Score » sur les publications (ALT-P31) : la fonction contrat est une extension naturelle pour les plateformes.
- **Sanction faible** : le défaut d'écrit entraîne la nullité civile du contrat, pas une amende administrative spécifique (ALT-P29). Les contrôles DGCCRF publiés portent sur la transparence des contenus, pas sur les contrats, et aucun bilan 2025-2026 n'a été trouvé (ALT-P30).
- **Timing** : l'obligation s'applique depuis le 01/01/2026. Dix mois plus tard, les agences ont déjà adapté leurs modèles Word.
- **Marché étroit** : environ 300 acteurs recensés (agences, plateformes et outils confondus), France seule.

### Preuves pour
- **La logique de cumul est un vrai problème outillable** : le seuil s'apprécie par annonceur, par objectif et par année, gifting compris (ALT-P28). Trois colis de 350 € suffisent à déclencher l'obligation (ALT-P27). Le baromètre UMICC-CPA compte 15 000 campagnes de gifting en un an (ALT-P32).
- **Profil du fondateur** : marché FR, MVP simple (faisabilité élevée).
- **Volonté de payer** : aucun prix dédié n'a été observé hors Infloxy (19 $). Elle reste **non prouvée**.

### Nouvelle note

| Critère (poids) | Ancien | Nouveau | Justification |
|---|---|---|---|
| Douleur et budget (20) | 5 | 4 | Nullité civile, modèles gratuits |
| Fréquence (10) | 7 | 7 | Chaque collaboration |
| Preuves (15) | 6 | 5 | Pas de signal de paiement, pas de contrôle sur les contrats |
| Distribution (15) | 7 | 7 | FR, UMICC, communautés d'agences |
| Lacune (10) | 6 | 4 | Modèles gratuits, Infloxy, plateformes qui étendent leur offre |
| Faisabilité (10) | 9 | 9 | Simple |
| Marge (5) | 7 | 7 | Logiciel pur |
| Timing (5) | 9 | 6 | Obligation en vigueur depuis dix mois |
| Défendabilité (5) | 4 | 3 | Fonction copiable par les plateformes |
| Risques (5) | 6 | 6 | Faibles |
| **Total** | **64,5** | **57,0** | |

**Verdict** : 57,0/100. C'est facile à construire et adapté au profil, mais la douleur est juridique et faible (nullité), les modèles sont gratuits et les plateformes peuvent absorber la fonction. Au mieux, une fonction d'un CRM d'influence, pas un produit autonome.

---

## C-01 : CBAM multi-clients pour représentants en douane et PME importatrices

### Preuves contre
- **Marché réduit par l'Omnibus** : le seuil de 50 t exempte environ 90 % des importateurs, soit environ 182 000 entreprises selon une source, tout en couvrant 99 % des émissions (ALT-P33).
- **L'angle « représentants en douane » est déjà pris** : CBAMable vise les commissionnaires et transitaires avec un espace partagé et une marque blanche (ALT-P35). Un éditeur, Sustys, annonce une console multi-clients pour représentants en bêta (post LinkedIn, URL exacte non retenue). TariffTel vend un add-on CBAM (ALT-P36), DAKOSY intègre un outil d'analyse CBAM dans son logiciel douanier (ALT-P39), et AEB s'est associé à CBAMBOO (extrait de recherche, page non identifiée avec certitude).
- **Outils gratuits** : des calculateurs CBAM gratuits et sans inscription existent (ALT-P37), et The Sustainability Cloud a une offre gratuite (longlist).
- **Règles mouvantes** : la vente des certificats est reportée au 01/02/2027, le seuil de 50 t est révisé chaque année et la date de première déclaration diverge selon les sources (31/05 contre 30/09/2027) (ALT-P41).
- La mise en œuvre est décrite comme « sans heurts », avec plus de 4 100 déclarants autorisés dès janvier 2026 (ALT-P40, attribution incertaine).

### Preuves pour
- **Les représentants indirects sont visés** : selon PwC, ils doivent eux aussi se conformer et demander l'autorisation (ALT-P34). D'autres autorités parlent seulement de « recommandation » sous 50 t, donc le point est discuté.
- **Prix élevés observés** : l'add-on TariffTel coûte 1 499 £ par mois (ALT-P36) et PwC/SAP 990 € par mois (longlist). Aucun des 17 prestataires déclarants ne publie de tarif (ALT-P38), ce qui laisse une place à un prix transparent.
- **Catalyseur à venir** : première déclaration et achat de certificats en 2027.

### Nouvelle note

| Critère (poids) | Ancien | Nouveau | Justification |
|---|---|---|---|
| Douleur et budget (20) | 7 | 7 | Collecte des données fournisseurs, coût des certificats |
| Fréquence (10) | 6 | 6 | Déclaration annuelle et couverture trimestrielle |
| Preuves (15) | 7 | 7 | Réglementation et prix observés |
| Distribution (15) | 6 | 5 | Multi-pays, commissionnaires conservateurs, éditeurs douaniers en place |
| Lacune (10) | 4 | 3 | Concurrents ciblant exactement les représentants |
| Faisabilité (10) | 6 | 5 | Règles mouvantes, valeurs par défaut, registre |
| Marge (5) | 8 | 8 | |
| Timing (5) | 9 | 8 | 2027, mais l'Omnibus a réduit le marché |
| Défendabilité (5) | 6 | 5 | |
| Risques (5) | 5 | 4 | Révision annuelle du seuil, réformes continues |
| **Total** | **63,5** | **58,5** | |

**Verdict** : 58,5/100. Le créneau « multi-clients pour représentants » était la différenciation retenue, et il est déjà occupé (CBAMable, Sustys), tandis que les logiciels douaniers en place intègrent la fonction. À abandonner.

---

## C-14 : pack conformité fourgons 2,5-3,5 t internationaux (tachygraphe + détachement)

### Preuves contre
- **Analyse tachygraphe banalisée et bon marché** : Tachogram à 3,99 € par conducteur et par mois (ALT-P42), Tachomaster à 1 £ par travailleur et par semaine (ALT-P43), Descartes à 52 £ par conducteur et par an (ALT-P44).
- **Les éditeurs télématiques ont déjà le pack** : Webfleet (Bridgestone) a étendu à la flotte légère son offre clé en main (boîtier, pose, téléchargement, services de conformité) (ALT-P45). Geotab publie un guide français VUL (ALT-P46), et Teltonika pousse une option à bas coût.
- **Détachement difficile à automatiser** : la déclaration passe par le portail web RTPD de la Commission (EU Login) et aucune API n'a été trouvée (ALT-P47). Des prestataires de services gèrent déjà ces déclarations (ALT-P48).
- **Cible floue** : il n'existe aucune donnée publique sur le nombre d'entreprises, et les estimations vont de 300 000 à 2-3 millions de véhicules (ALT-P50). La cible est surtout PL, LT, RO et UA, multilingue et sensible au prix.

### Preuves pour
- **L'application a commencé** : amendes en Allemagne, 2 640 € en Belgique et 4 400 € aux Pays-Bas selon la presse (ALT-P49). La France contrôle aussi (ALT-P51).
- **Faible connaissance** : opérateurs et conducteurs sont largement non informés (ALT-P50), et 27,7 % seulement étaient prêts selon l'IRU (longlist).

### Nouvelle note

| Critère (poids) | Ancien | Nouveau | Justification |
|---|---|---|---|
| Douleur et budget (20) | 7 | 7 | Amendes réelles |
| Fréquence (10) | 9 | 9 | Quotidienne |
| Preuves (15) | 7 | 7 | Application vérifiée |
| Distribution (15) | 4 | 4 | Cible fragmentée et multilingue |
| Lacune (10) | 5 | 3 | Webfleet en clé en main, analyse à 1-4 € par conducteur |
| Faisabilité (10) | 5 | 5 | Lecteurs de cartes, pas d'API RTPD |
| Marge (5) | 7 | 6 | Prix plancher bas |
| Timing (5) | 9 | 7 | Échéance passée le 01/07/2026 |
| Défendabilité (5) | 5 | 4 | |
| Risques (5) | 6 | 5 | |
| **Total** | **63,0** | **58,5** | |

**Verdict** : 58,5/100. La douleur est forte, mais elle est servie à bas prix par les acteurs du tachygraphe et par les télématiciens. Le volet détachement, seul différenciant, n'a pas d'API. Le profil du fondateur (francophone, pas de réseau transport en Europe de l'Est) n'aide pas. À abandonner.

---

## Limites
- Seuls les extraits de recherche ont été lus : WebFetch est bloqué (gov.uk inaccessible depuis la session). Les chiffres attribués à une page précise mais vus dans un résumé de recherche multi-sources sont marqués avec une confiance faible dans le CSV.
- L'absence de SaaS FCC dédié (C-39) repose sur trois recherches : elle reste à confirmer, par exemple sur G2/Capterra et par des entretiens.
- Les notes sont des re-notations rapides par un seul évaluateur. Avec ±1 point par critère, la marge d'erreur est de ±3 à 4 points sur le total.
