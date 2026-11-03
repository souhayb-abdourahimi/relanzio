# P8-US — Acquisition sans réseau : C-39, B-11, A-38 (marchés US)

- Date : 2026-10-29. Brief : `brief-phase8.md`. Contexte lu : `P7-DD-C39.md`, `DD-B11.md`, `A-top.md` (A-38), `redteam3.md`, `P7-fiscal.md`, `micro_saas_sim.py`, `P7-sim-config.json`.
- Preuves : `P8-US-preuves.csv`, **P8U-P01 à P8U-P54** (C-39 : P01-P16 ; B-11 : P17-P30 ; A-38 : P31-P50 ; transverse : P51-P54). Les preuves des dossiers antérieurs sont citées avec leur identifiant d'origine (P7DC39-Pxx, DD-B11-Pxx, A-Pxx, P7F-Pxx).
- Étiquettes : **[F]** fait vérifié (source citée), **[E]** estimation (raisonnement explicite), **[H]** hypothèse.

## 0. Méthode, limites et alerte préalable

- **45 recherches WebSearch** (C-39 : 11 ; B-11 : 12 ; A-38 : 18 ; transverse : 4).
- **WebFetch essayé une fois** sur le portail RMD (`fccprod.servicenowservices.com`) : échec DNS (ENOTFOUND). Toutes les preuves sont donc des **extraits de recherche**. Aucune page n'a été ouverte. Pour compter les lignes du CSV RMD ou lire les PDF municipaux, il faut autoriser ces domaines dans les réglages réseau.
- Aucun avis simulé. Les prix concurrents prouvent une **offre**, pas des ventes.
- Taux de change supposé : 1 $ ≈ 0,90 € [H].

> **Alerte : trois pages de « test » de tiers trouvées sur les mêmes cibles.**
> - « RMD Autopilot » propose un audit RMD gratuit et une recertification à 490 $/an (P8U-P01).
> - « Cowork Recon » propose un rapprochement pour agences P&C à 500 $/mois (P8U-P32).
> - Un importeur HawkSoft non partenaire est hébergé sur un domaine IP (P8U-P33).
>
> Leurs propriétaires sont inconnus : aucun site complet, aucun avis. **Le porteur doit vérifier qu'il ne s'agit pas de ses propres tests ou de ceux d'un autre agent du projet.**
> - Si ce sont les siens : ce ne sont pas des preuves de concurrence. Il faut les retirer du registre.
> - Sinon : d'autres fondateurs testent **la même offre sur les mêmes listes publiques**. Cela confirme que l'idée est jugée plausible, mais les boîtes des prospects seront plus sollicitées, et un e-mail personnalisé avec un constat concret devient indispensable.

---

## 1. Faisabilité transverse : fondateur solo en micro-entreprise française vendant aux États-Unis

| Sujet | Constat | Étiquette | Conséquence pratique |
|---|---|---|---|
| **Facturation en $** | Stripe France sait encaisser en USD. Frais sur carte internationale : 3,25 % + 0,25 €, plus 2 % si conversion de devise (sources secondaires, P8U-P51), plus Stripe Billing 0,7 % (P7F-P41/42). | [F] secondaire | Retenir **6 % + 0,25 €** dans le modèle. Le prépaiement annuel réduit le coût fixe à environ 0,02 € par mois. Un compte multidevise (solde USD) éviterait la conversion [H, non vérifié]. |
| **Entité** | Aucune obligation trouvée d'avoir une entité US pour vendre du SaaS B2B depuis la France. Une entreprise individuelle peut facturer. | [E] | Un acheteur US peut demander un formulaire W-8BEN-E ou un questionnaire fournisseur [E]. Une LLC n'est utile qu'à la cession ou pour rassurer, et elle ajoute des coûts (agent enregistré, déclarations) [H]. |
| **TVA** | Prestation B2B à un client hors UE : lieu d'imposition hors de France (art. 259-1° CGI), donc hors champ de la TVA française (P7-fiscal §5.3). | [F]/[E] | Facture sans TVA, avec la mention de l'article (formulation exacte à vérifier, recodification CIBS 2027, P7F-P07). Ce CA compte pour les seuils micro. Son effet sur le seuil de **franchise** de TVA est à confirmer par un expert-comptable [H]. Les achats d'outils étrangers restent soumis à l'autoliquidation (§5.5). |
| **Sales tax US** | Nexus économique à 100 000 $ par État dans la plupart des États (500 000 $ à NY et TX). Taxation du SaaS variable. Aucune règle propre aux vendeurs étrangers trouvée (P8U-P53). | [F] secondaire | Sans objet sous 100 000 $ de ventes par État, ce qui couvre tout l'horizon du projet [E]. Mettre une clause « taxes à la charge du client » dans les CGV. |
| **Fuseau horaire** | Côte Est = Paris − 6 h, Pacifique = Paris − 9 h. | [F] | Appels entre 15 h et 23 h, heure de Paris. Les pistes 100 % e-mail (C-39) le supportent mieux que celles qui reposent sur le téléphone (B-11). |
| **RC Pro / E&O** | Aucune information sur la clause territoriale US/Canada des RC Pro françaises (P8U-P54). E&O tech US en moyenne 1 094 $/an pour un assuré américain (P7DC39-P37). | [F] absence + [H] | **Obtenir un devis écrit avant la première vente**, avec une zone de garantie incluant les réclamations US. Coût supposé de 1 500 à 3 000 €/an selon la piste [H]. |
| **Prospection e-mail** | **CAN-SPAM** : opt-out, en-têtes exacts, objet non trompeur, désinscription traitée sous 10 jours ouvrés, et adresse postale valide (rue, boîte USPS ou boîte privée CMRA, P8U-P52). L'adresse étrangère n'est pas tranchée. **France (CNIL)** : prospection B2B en opt-out si le message concerne la profession du destinataire, avec information sur la source des données (art. 14 RGPD). CASL et PECR : sans objet. | [F]/[E] | Prendre une boîte CMRA US (≈ 10 à 20 $/mois [H]). Ajouter à chaque e-mail une ligne « source : base publique X » et un lien d'opposition. |
| **Données personnelles** | Le fondateur, établi dans l'UE, est soumis au RGPD même pour des données US (DD-B11 §9). | [E] | Préparer un DPA simple. Pour A-38, les données des assurés relèvent de **GLBA** côté agence [E] : question de sécurité probable. |

---

## 2. C-39 — Calendrier et dépôts FCC (RMD, CPNI, 499) pour petits revendeurs VoIP US

### 2.1 Canal vérifié

**Source.** Le Robocall Mitigation Database (RMD) est téléchargeable en CSV sans inscription. Il contient le nom, le titre, le service, l'adresse, le téléphone et l'**e-mail** d'un contact par société (P7DC39-P18). Ces données sont publiques et ne peuvent pas être marquées confidentielles (P7DC39-P19) [F].

**Nombre d'entrées.**

| Mesure | Valeur | Étiquette |
|---|---|---|
| Sociétés au RMD au 28/09/2025 | 9 242 | [F] P7DC39-P20 |
| dont aucun STIR/SHAKEN | 2 909 (31 %) | [F] P7DC39-P20 |
| dont STIR/SHAKEN partiel | 1 696 | [F] P7DC39-P20 |
| Retraits d'août 2025 | plus de 1 200, soit ≈ 13,7 % des certifications en place | [F] P8U-P03 |
| Base avant retrait (déduite) | ≈ 10 000 | [E] : (185 + 1 200) / 0,137 |
| Total 2026 | non trouvé ; WebFetch bloqué | — |
| **Petits acteurs US qui facturent la voix** | **≈ 2 000 à 4 000** | [E] : 9 242, moins ≈ 25 % d'étrangers et d'intermédiaires (P7DC39-P21, 2021), moins les grands opérateurs, en gardant surtout le groupe « aucun ou partiel STIR/SHAKEN » |

**Signal de qualité des fiches.**
- En décembre 2024, l'Enforcement Bureau a ordonné à **2 411 sociétés** de corriger leur fiche : plan de mitigation absent, ou plan et certification sans les informations désormais exigées (P8U-P02) [F].
- Sur une base d'environ 10 000 fiches, **environ un quart était déficient** [E].

**Base légale.**
- CAN-SPAM (P8U-P52) et CNIL B2B (opt-out).
- Le message concerne bien l'activité réglementée du destinataire.
- Indiquer la source : « FCC Robocall Mitigation Database, public record ».

**Limite.** Le contact RMD est souvent un consultant ou un avocat [E]. D'autres acteurs exploitent probablement la même liste [H], et RMD Autopilot le fait en apparence (P8U-P01).

**SEO.**
- Requêtes d'intention : « RMD recertification 2027 », « robocall mitigation plan template », « CPNI certification due date », « 499-A due date ».
- Pages qui rankent : Nelson Mullins, Womble Bond Dickinson, Mondaq, TransNexus, Commio, Vantage Point, Viirtue (P8U-P15). RMD Keeper fait déjà des pages par État (P7DC39-P03).
- **Le SEO n'est pas un canal de test à 30 jours** [E].

**Marketplaces.** Aucune pertinente. Le seul canal d'intégration plausible serait un grossiste (Viirtue, SkySwitch), qui reste non prouvé [H].

### 2.2 Frustrations vérifiables

- **Directes (Reddit, forums, avis)** : **non trouvées** (P8U-P14). RMD Keeper n'a toujours aucune trace tierce (P8U-P12). Aucun barème public de consultant (P8U-P13).
- **Indirectes, sourcées :**
  - « Most VoIP resellers assume their upstream platform's RMD filing covers them » (Viirtue, P8U-P08) : c'est une **ignorance** de l'obligation, pas une plainte.
  - « Companies that failed to re-certify by the deadline currently cannot complete a re-certification within the system » (Mondaq, P8U-P06) : un oubli est irréversible.
  - Le MFA est désormais obligatoire et la fenêtre de recertification ne dure qu'un mois (P8U-P07) : friction d'accès [F].
- **Contre-signal** : l'exécution 2026 est faible, avec 14 retraits en septembre (P8U-P04). Un cabinet promeut la sortie du statut de revendeur (P8U-P16).

### 2.3 Segment insuffisamment servi

| Segment candidat | Identifiable dans la liste publique ? | Servi par | Verdict |
|---|---|---|---|
| **Revendeurs non facilities-based** (aucun STIR/SHAKEN ou partiel) | **Oui** (colonne STIR/SHAKEN, P7DC39-P20) | Guides gratuits des grossistes (« not legal advice »), RMD Keeper en libre-service, cabinets sur devis | **Cible n° 1**. Ils croient être couverts par l'amont (P8U-P08) et sont nombreux (2 909 + 1 696) |
| Petits opérateurs facilities-based | Oui | JSI, CommLaw, Performance West (P7DC39-P05/P07) | Mieux servis. Pas de priorité |
| Nouveaux entrants 2026 (agents vocaux IA, MVNO, P8U-P09) | Seulement si le CSV contient une date de dépôt [H] | Personne de spécifique | Bon message, mais impossible à cibler en masse sans vérifier le CSV |
| Recertification annuelle du 1er mars | C'est un **déclencheur**, pas un segment | RMD Keeper « done with you » 499 $/an (P7DC39-P02) ; RMD Autopilot 490 $/an (P8U-P01) | **Moment d'achat**, à combiner avec la cible n° 1 |

**Recommandation : revendeurs non facilities-based sans STIR/SHAKEN complet, approchés pour la recertification 2027.** [E]

**Différenciation réalisable en solo :**
- un audit **factuel** de la fiche publique, fait avant l'envoi : plan joint ou non, champs requis depuis 2026, contact cohérent, présence au 499 Filer Database [H : base publique, non revérifiée ici] ;
- puis une préparation « done-with-you » de la recertification ;
- plus un calendrier CPNI et 499 en option.

Ce n'est **pas** une différenciation forte : RMD Autopilot affiche la même promesse.

**Faut-il l'aimant « audit gratuit de votre fiche RMD » ?** Oui [E] :
1. Il est **vérifiable**, puisque le RMD est public : on peut faire l'audit **avant** le premier e-mail et citer un constat réel. C'est la personnalisation la plus forte possible à froid.
2. Il est cohérent avec la fréquence annuelle : la valeur se juge une fois par an.
3. Il reste clérical : un contrôle de complétude par rapport aux instructions FCC, sans avis juridique, ce qui limite le risque UPL (P7DC39-P36).

**Limite** : l'aimant est déjà utilisé par un tiers (P8U-P01). Le test mesure donc aussi notre capacité à nous distinguer.

**Calendrier : la fenêtre novembre-février est-elle favorable ?** Oui, mais elle est **unique et serrée** [E] :
- 9 novembre - 18 décembre 2026 : audits et premiers e-mails (éviter la semaine de Thanksgiving, 26 novembre) ;
- 5 - 22 janvier 2027 : relance « la fenêtre ouvre le 1er février » et date limite de prépaiement ;
- 1er février - 1er mars : exécution, et seconde vente d'urgence aux retardataires ;
- après le 1er mars, **plus de déclencheur** hors des mises à jour sous 10 jours. Un échec reporte le test d'un an.

### 2.4 Support et maintenance [E]

- Veille FCC (ordres, FNPRM de juillet 2026 dont l'issue n'est pas confirmée, P8U-P10) et mise à jour des grilles d'audit : 10 à 12 h/mois, avec un pic de janvier à mars.
- Support : environ 2 h par client et par an, concentrées en février. Ce sont des questions proches du conseil, donc des réponses-types et une mention « not legal advice » s'imposent.
- **Dépendance au fondateur : forte** (savoir réglementaire).
- Transférabilité : moyenne. La liste publique et les gabarits se transfèrent ; la confiance et l'expertise, beaucoup moins.

### 2.5 Expérimentation commerciale

- **Cible** : 400 contacts US du RMD, sans STIR/SHAKEN ou avec STIR/SHAKEN partiel, dont le nom évoque un MSP, un intégrateur ou un revendeur. Exclure les cabinets d'avocats en contact et les grands opérateurs.
- **Préparation** : pré-audit de 10 minutes par fiche, soit environ 65 h pour 400. **Variante moins coûteuse** : pré-audit de 150 fiches, et e-mail générique pour les autres.
- **Offre** : audit écrit gratuit, puis « Recertification 2027 Readiness » en prépaiement annuel remboursable si rien n'est livré avant le 1er février.
  - **A : 490 $/an** (ancrage identique à RMD Keeper « done with you » et à RMD Autopilot) ;
  - **B : 790 $/an** (A + calendrier CPNI/499 + fiche 499-A à relire).
  - Répartition aléatoire 50/50.
- **Canal** : e-mail via un domaine d'envoi dédié, puis une relance. Pas de téléphone.
- **Coût** : environ 280 € (domaine et préchauffage 30 €, outil d'envoi 2 mois 80 €, boîte CMRA 3 mois 50 €, Stripe Payment Links 0 €, formulaire 0 €, devis E&O gratuit). Temps : 35 à 45 h (150 pré-audits de 10 min = 25 h ; 20 audits complets de 30 min = 10 h ; échanges 5 à 10 h).

**Message** (anglais, conforme CAN-SPAM et CNIL) :

> **Subject:** [Company] — 2 gaps in your public RMD filing before the Feb 1 window
>
> Hi [First name],
> Your company's entry in the FCC Robocall Mitigation Database (public record) shows [gap 1, e.g. "no mitigation plan attached"] and [gap 2]. Since Feb 5, 2026 the base fine for inaccurate RMD data is $10,000, and late filers cannot recertify after March 1.
> I'll send you a free written check of your full listing within 2 business days. Reply "check". Data completeness only, not legal advice.
> — [Name], [Brand], [CMRA US address] · Source: FCC RMD public CSV · Unsubscribe: reply "stop" or [link] · EU privacy notice: [link]

**Indicateurs et seuils**

| Indicateur | GO | ITÉRER | STOP | Justification |
|---|---|---|---|---|
| Demandes d'audit / e-mails délivrés | ≥ 4 % (≥ 16) | 1,5-4 % | < 1,5 % | Un audit gratuit à froid, à un acheteur conscient d'une échéance : un taux bas révélerait un sujet déjà délégué [E] |
| Prépaiements annuels avant le 22/01/2027 | **≥ 4** (A ou B) | 2-3 | ≤ 1 | Achat **annuel** : un paiement vaut un an de revenu. 4 clients pour ≈ 280 € + 40 h ≈ 1 680 € donne un CAC d'environ 420 €, inférieur à l'ARPA annuel de 441 à 711 € : récupéré en moins d'un an [E] |
| Part B parmi les payants | ≥ 40 % | — | — | Valide l'extension CPNI/499, sinon le prix reste plafonné à environ 490 $ |
| Raison explicite de ne pas prendre RMD Keeper, RMD Autopilot ou un cabinet | ≥ 2 payants | 1 | 0 | Sans cela, pas de différenciation |
| Devis E&O couvrant les US | ≤ 3 000 €/an | 3 000-5 000 € | refus ou > 5 000 € | Charge fixe majeure au regard d'un ARPA d'environ 500 € |

Le GO du DD (≥ 5 paiements ≥ 500 $) était jugé irréaliste par `redteam3.md`. Le seuil de 4 prépaiements à 490 $ minimum en tient compte, tout en restant cohérent avec un CAC récupérable en un an.

### 2.6 Économie unitaire révisée

```json
{"id":"C-39-P8","titre":"Audit et préparation de la recertification RMD (+ CPNI/499) pour revendeurs VoIP US, prépayé annuel","prix_mensuel_ht":50,"cout_variable_client_mois":1.5,"frais_paiement_pct":0.06,"frais_paiement_fixe":0.02,"fixes_mensuels":335,"heures_fixes_mois":12,"heures_par_client_mois":0.4,"churn_mensuel":0.024,"cac":400}
```

| Clé | Valeur | Justification | Étiquette |
|---|---|---|---|
| prix_mensuel_ht | 50 € | Mélange A/B ≈ 670 $/an ≈ 600 €/an. Baisse par rapport aux 79 € du DD : RMD Autopilot (490 $/an) et RMD Keeper (499 $/an) ancrent le marché | [F] P8U-P01, P7DC39-P02 ; [H] mélange |
| cout_variable_client_mois | 1,5 € | Stockage, e-mails, diff nocturne du CSV | [E] |
| frais_paiement_pct | 0,06 | Carte internationale 3,25 % + conversion 2 % + Billing 0,7 % | [F] secondaire P8U-P51 |
| frais_paiement_fixe | 0,02 € | 0,25 € par an, paiement annuel | [E] |
| fixes_mensuels | 335 € | E&O 250 €, CMRA 15 €, envoi 30 €, hébergement 40 € | [E] sur P7DC39-P37 |
| heures_fixes_mois | 12 h | Veille FCC et grilles d'audit | [E] |
| heures_par_client_mois | 0,4 h | Environ 5 h par an et par client : audit, recertification, questions | [E] |
| churn_mensuel | 0,024 | Non-renouvellement annuel supposé de 25 %, soit 1 − 0,75^(1/12) | [H] |
| cac | 400 € | Coût du test divisé par 4 clients | [H] |

**Sortie du simulateur** (`micro_saas_sim.py`, configuration temporaire) :
- à 3 000 € de MRR : 60 clients ; 36 h/mois ; net fondateur 1 702 €/mois ; bénéfice ajusté 1 134 €, ou **558 € après remplacement du churn** ;
- valorisation centrale ≈ 55 k€ ;
- heures concentrées en février.

### 2.7 Ce qui la rendrait excellente / l'abandon

**Excellente :**
- ≥ 4 prépaiements, dont ≥ 40 % en B ;
- ≥ 25 % des audits convertis ;
- un grossiste qui accepte de relayer l'audit à ses revendeurs ;
- l'adoption du FNPRM, qui élargirait la base (P8U-P10).

**Abandon :**
- moins de 1,5 % de demandes d'audit ;
- au plus 1 paiement ;
- des réponses du type « mon grossiste / mon avocat s'en occupe » ;
- un E&O introuvable ;
- RMD Autopilot ou RMD Keeper qui se révèlent dominants auprès des prospects interrogés.

---

## 3. B-11 — Outil pour testeurs backflow US multi-districts

### 3.1 Canal vérifié

**Il n'existe pas de liste nationale. Les listes publiques par État et par service d'eau sont hétérogènes, et l'e-mail y est rare** [F] :

| Juridiction | Format | Champs | E-mail ? | Source |
|---|---|---|---|---|
| Oregon (OHA) | Recherche en ligne par comté, triable | n° de certification, nom, employeur, ville | Non confirmé. Inscription volontaire | P8U-P17 |
| Washington | Annuaire complet de Washington Certification Services (Green River College) ; listes municipales PDF (Walla Walla 2026, Lynnwood, Monroe, Lacey, Clark PU 2025) | Coordonnées dans les listes municipales | Partiel | P8U-P18 ; DD-B11-P31 |
| Utah | Base WaterLink « Commercially Available Backflow Technicians » | Nom, licence, catégorie | Non confirmé | P8U-P20 |
| Texas (TCEQ) | Recherche de licence, sans export trouvé ; 5 520 licences BPAT en 2021 | Licence, formation continue | Non | P8U-P19 |
| New York (DOH) | Pages par comté | Nom, ville, n° de certification, expiration | Non | DD-B11-P30 |
| Californie | PDF par district : BCVWD (avec e-mail), Rainbow MWD 6/7/2026 (téléphone), Ville de San Diego (téléphone) | Variables | **BCVWD : oui** | DD-B11-P29 ; P8U-P21 |
| Floride | PDF par service d'eau : Panama City (certains e-mails), ECUA 26/8/2026, Lynn Haven, Casselberry, Seminole | Téléphone, n° de certification | **Partiel** | P8U-P22 |

**Volume.**
- Texas : environ 5 500 testeurs licenciés [F, 2021]. Los Angeles : plus de 700 [F faible, DD-B11-P38].
- Une région test (Puget Sound, Inland Empire, Panhandle de Floride) peut fournir environ **300 entreprises uniques** en croisant 5 à 10 listes municipales [E]. Une entreprise présente sur ≥ 2 listes travaille par définition dans plusieurs districts.
- **E-mails** : directs pour 10 à 30 % au plus [E]. Le reste passe par le site web de l'entreprise (adresse générique) ou par le **téléphone**.

**Base légale.**
- CAN-SPAM pour l'e-mail.
- Appels B2B vers des numéros professionnels : la TCPA vise surtout les appels automatisés et les SMS. Appeler manuellement une entreprise est courant [E, non revérifié ici].
- Plusieurs listes portent la mention « convenience only, no endorsement » (P8U-P22) : aucune restriction d'usage trouvée, aucune autorisation explicite non plus [F]/[H].

**SEO** : « backflow test form [ville] », « backflow tester registration [ville] ». Pages qui rankent : sites municipaux et des portails (BSI, VEPO) [E, observé dans les résultats]. Une page par district peut ranker sur des requêtes de longue traîne, mais cela prend 6 à 12 mois [E].

**Marketplaces** : aucune. Les portails ne publient pas d'API côté testeur (DD-B11-P62).

### 3.2 Frustrations vérifiables

**Frais par rapport et par ville** (pages municipales [F]) : ils s'empilent pour un testeur multi-districts.

| Portail / ville | Frais par rapport | Enregistrement annuel | Source |
|---|---|---|---|
| BSI, Wilton Manors FL | 25 $ (2016), puis **28 $** (2024) | — | P8U-P23 |
| BSI, Queen Creek AZ, Broomfield CO | 14,95 $ | — | P8U-P24 |
| BSI, Cedar Hill TX | 30 $ | 20 $ | P8U-P24 |
| VEPO, Georgetown TX | 11,50 $ | — | P8U-P25 |
| VEPO, Corpus Christi TX | 20 $ (lignes incendie) | **135 $** | P8U-P25 |
| VEPO CrossConnex, Portland Water District | 18 $ | — | P8U-P25 |
| Boerne TX | papier (VEPO abandonné en 2022) | 53 $, puis **75 $** (10/2025) | P8U-P26 |
| Tokay, Galveston TX | 1 $ résidentiel / 26 $ commercial | 50 $ | P8U-P27 |

**Rejets.**
- Rapport refusé si la licence ou la calibration a expiré (Plantation FL, DD-B11-P02).
- Rapport en retard au-delà de 10 jours : retest obligatoire (Corpus Christi, DD-B11-P13) [F].

**Syncta.**
- 4,3/5 sur 14 avis, rapport qualité/prix 3,9/5.
- « wish the link with QuickBooks was smoother… filter data by date or purveyor when scheduling large groups » (P8U-P28).
- Ancien avis : « lost data, botched 1000's of test dates » (DD-B11-P42).

**Plaintes de testeurs sur les frais, les rejets, BSI, VEPO ou Tokay : non trouvées**, après trois recherches dédiées (P8U-P29). Les frais sont **répercutés au propriétaire** (DD-B11-P22). La douleur est donc administrative, pas financière pour le testeur [E].

### 3.3 Segment insuffisamment servi : testeurs indépendants multi-districts

**Preuve indirecte** [F] : chaque ville ajoute un portail, un délai, un tarif et un enregistrement payant de 20 à 135 $/an (tableau ci-dessus). Un testeur actif dans 5 villes du DFW gère 5 calendriers d'enregistrement, 2 ou 3 portails et un dépôt papier.

**Ce que les outils existants ne couvrent pas** [E, à valider en entretien] :
- Syncta, C3 et R2 sont centrés sur le **rapport**.
- Syncta sert d'abord les purveyors équipés de Syncta (DD-B11-P08).
- Aucun outil trouvé ne tient le **calendrier des enregistrements et règles par district** ni ne **relance les clients du testeur avant la lettre de la ville**.
- Des agences et services vendent des rappels au propriétaire (P8U-P30) : la fonction existe, mais pas comme outil pour le testeur indépendant [F]/[E].

**Différenciation réalisable en solo, sans automatiser les portails** (ce qui évite le risque CGU) :
1. un **moteur de rappels annuels** aux clients du testeur (e-mail et courrier), envoyés 45 jours avant l'échéance avec un lien de réservation ;
2. un **coffre de credentials** multi-villes (licence, calibration, enregistrements), avec alertes ;
3. une **fiche règles et frais par district**.

**Prix plus élevé que 15 à 49 $ : est-ce justifiable ?** [E/H] Oui, si le produit est vendu comme un **moteur de chiffre d'affaires** et non comme un outil de rapports :
- valeur : 600 tests × 5-10 % de clients perdus × 100 $ = **3 000 à 6 000 $/an** (DD-B11 §3, [H]) ;
- 10 tests reconduits à 100 $ = 1 000 $, ce qui paie un abonnement de 79 à 99 $/mois.

**Risque** : les SMS vers des propriétaires particuliers exigent un consentement (TCPA) [E, non revérifié]. **Le test se limite à l'e-mail et au courrier.**

### 3.4 Support et maintenance [E]

- Onboarding : import de la liste de tests de l'an passé (Excel, PDF, papier) en 1 à 3 h par client.
- Bibliothèque de districts : 2 à 4 h par semaine (DD-B11 §8).
- Support par **téléphone**, aux heures US, avec un pic de mars à septembre.
- Dépendance au fondateur : moyenne (données des districts). Transférabilité : bonne si la bibliothèque est structurée.

### 3.5 Expérimentation commerciale

- **Cible** : 300 entreprises présentes sur ≥ 2 listes. Régions : Washington (Puget Sound, listes avec coordonnées), Panhandle de Floride (e-mails partiels), Inland Empire en Californie (BCVWD avec e-mails).
- **Offre** :
  - aimant gratuit : « carte des frais, enregistrements et échéances de vos 3 à 5 villes » en PDF, construite à la main à partir des pages municipales (30 min par prospect) ;
  - puis un pilote concierge « Rebook 2027 » : le testeur envoie la liste de ses tests 2026, et le fondateur envoie les rappels par e-mail ou courrier depuis Brevo, au nom du testeur.
- **Tarif, prépaiement de la saison (A/B aléatoire)** :
  - A : **590 $/an** (≈ 49 $/mois) ;
  - B : **990 $/an** (≈ 82 $/mois).
  - Alternative : carte enregistrée pour 79 $/mois après 30 jours.
- **Canal** : e-mail quand il est disponible, puis **appel** entre 16 h et 23 h, heure de Paris. Un numéro US virtuel coûte environ 10 $/mois [H].
- **Coût** : environ 200 € (domaine et outil d'envoi 80 €, numéro US 30 €, CMRA 50 €, impressions 40 €). Temps : 45 à 55 h (constitution de la liste 10 h, cartes gratuites 15 × 0,5 h, 60 appels × 15 min, concierge 3 × 4 h).

**Message** :

> **Subject:** Your 2027 backflow customers — before the city letter goes out
>
> Hi [Name], I saw [Company] on the approved tester lists of [City A] and [City B]. Each one has its own portal, fee ($[x]/report) and registration date.
> I'm piloting a service that emails your 2026 customers 45 days before their due date, with your booking link, so they rebook with you instead of picking from the city list. I'll also send you a free one-page map of fees and deadlines for your cities.
> Pilot price: $590 for the 2027 season, refundable if fewer than 10 tests are rebooked. Interested? Reply "map".
> — [Name], [Brand], [CMRA address] · Source: [City] public tester list · Unsubscribe: [link]

La garantie « remboursé si moins de 10 tests reconduits » est une variante à tester : elle aligne le prix sur la valeur.

**Indicateurs et seuils**

| Indicateur | GO | ITÉRER | STOP | Justification |
|---|---|---|---|---|
| Réponses positives (e-mail et appel) / 300 | ≥ 5 % (15) | 2-5 % | < 2 % | Population peu en ligne : l'appel est inclus dans le ratio |
| Listes de clients transmises (concierge) | ≥ 5 | 2-4 | ≤ 1 | Transmettre ses clients est un engagement fort, plus probant qu'un clic |
| Prépaiements de saison (≥ 590 $) ou cartes enregistrées (79 $/mois) | ≥ 3 | 1-2 | 0 | Achat saisonnier annuel : 3 × 590 $ ≈ 1 600 € couvrent le coût du test (≈ 200 € + 50 h) avec un CAC d'environ 650 €, à peine récupérable la première année. Un seuil plus bas ne prouverait rien |
| Part B (990 $) parmi les payants | ≥ 1 sur 3 | — | — | Valide la valeur « chiffre d'affaires » face aux outils à 15-49 $ |
| Objection « la ville relance déjà » ou « Syncta/C3 suffit » | < 40 % | 40-60 % | > 60 % | Seuil du DD (DD-B11 §13) |
| Taux de rappels qui aboutissent à une réservation (pilotes, au printemps 2027) | ≥ 15 % | 5-15 % | < 5 % | Ne se mesure qu'en mars-mai 2027 : c'est un critère de rétention, pas de lancement |

### 3.6 Économie unitaire révisée

```json
{"id":"B-11-P8","titre":"Rappels annuels clients + calendrier des enregistrements multi-districts pour testeurs backflow US","prix_mensuel_ht":55,"cout_variable_client_mois":3,"frais_paiement_pct":0.06,"frais_paiement_fixe":0.25,"fixes_mensuels":160,"heures_fixes_mois":14,"heures_par_client_mois":0.6,"churn_mensuel":0.035,"cac":350}
```

| Clé | Valeur | Justification | Étiquette |
|---|---|---|---|
| prix_mensuel_ht | 55 € | Mélange A/B ≈ 730 $/an ; au-dessus de C3 (15 $) et R2 (25 $), justifié seulement par les reconductions | [F] DD-B11-P43/P44 ; [H] |
| cout_variable_client_mois | 3 € | E-mails, et courrier occasionnel | [E] |
| frais_paiement_pct / fixe | 0,06 / 0,25 € | Carte internationale ; mensuel prudent | [F] secondaire P8U-P51 |
| fixes_mensuels | 160 € | E&O 80 € (risque plus faible qu'en C-39), numéro US 10 €, CMRA 15 €, outils et hébergement 55 € | [H] |
| heures_fixes_mois | 14 h | Bibliothèque de districts, 2 à 4 h par semaine | [E] DD-B11 §8 |
| heures_par_client_mois | 0,6 h | Onboarding lourd et support téléphonique saisonnier | [E] |
| churn_mensuel | 0,035 | Saisonnalité, solos qui arrêtent | [H] DD-B11 §8 |
| cac | 350 € | Appels et listes faites à la main | [H] |

**Simulateur** :
- à 3 000 € de MRR : 55 clients ; **47 h/mois** ; net fondateur 1 808 € ; bénéfice ajusté 860 €, **186 € après remplacement du churn** ;
- c'est la piste la plus gourmande en heures.

### 3.7 Excellente / abandon

**Excellente :**
- ≥ 3 prépaiements, dont un à 990 $ ;
- ≥ 5 listes clients transmises ;
- un taux de reconduction mesuré ≥ 15 % au printemps ;
- un formateur ou une section ABPA qui relaie l'offre.

**Abandon :**
- 0 paiement ;
- plus de 60 % d'objections « la ville relance » ou « Syncta suffit » ;
- des listes sans e-mail qui imposent le téléphone pour plus de 80 % des contacts : la charge horaire devient intenable depuis la France.

---

## 4. A-38 — Rapprochement des commissions, agences IARD indépendantes US hors Applied Epic

### 4.1 Canal vérifié

| Source | Format | Volume | E-mail ? | Conditions | Source |
|---|---|---|---|---|---|
| **TrustedChoice.com** (Big I), relancé en juin 2026 | Localisateur web consommateur, par lieu et besoin | Toutes les agences membres du Big I. Total non publié | **Non confirmé.** Le formulaire transmet la demande du consommateur à l'agence par e-mail : l'adresse n'est probablement pas affichée [H] | Usage consommateur. Une extraction en masse poserait un risque CGU [H] | P8U-P45 |
| **Univers des agences** | Étude Big I / Future One | **36 000 agences indépendantes en 2020**, en légère baisse en 2024 | — | — | P8U-P46 |
| **Registres d'État** : Texas TDI sur data.texas.gov | Jeu de données ouvert, une ligne par licence d'agence | Non chiffré ici | **Non** (nom, licence, adresse, téléphone) | Données publiques. Usage marketing non vérifié [H] | P8U-P47 |
| Floride DFS | Pas d'export officiel trouvé (scraper tiers seulement) | — | Non | — | recherche « state insurance department licensed agency list download » |
| Associations d'État (IIAT, PIA…) | « Find an agent » non confirmé en 2026 | — | Non confirmé | — | recherche « state independent insurance agents association find an agent » |
| **HawkSoft Marketplace** (intégration) | Partenaires API dans l'AMS | 22 partenaires ; **38 % des agences** abonnées à ≥ 1 partenaire (billet non daté) | — | Programme de partenaires, approbation, délai inconnu | P8U-P48 |
| **EZLynx Connect** | Marketplace intégrée | — | — | Revue juridique et sécurité, API par partenariat | P8U-P49 |

**Conclusion sur le canal** :
- On peut **identifier les agences** (registres d'État, TrustedChoice).
- Les **e-mails** sont à collecter sur le site de chaque agence (adresse générique info@ ou nom du dirigeant), pendant 2 à 3 minutes par agence [E].
- **L'AMS utilisé (EZLynx ou HawkSoft) n'apparaît dans aucun registre.** Indices possibles : portail client EZLynx sur le site, offres d'emploi « HawkSoft experience » [H, non vérifié].

**Base légale** : CAN-SPAM et CNIL B2B. Le message porte sur la comptabilité de l'agence, donc sur sa profession.

**SEO.**
- Requêtes : « EZLynx commission statement import », « HawkSoft commission reconciliation », « direct bill reconciliation ».
- Pages qui rankent : **la documentation des éditeurs** (support EZLynx, PDF d'aide HawkSoft, Momentum), Selectsys, ReSource Pro, AgencyBloc (recherches « HawkSoft direct bill commission reconciliation », « insurance-forums direct bill… EZLynx », « NowCerts OR QQCatalyst… »).
- C'est une intention de type « comment faire » : un guide tiers par AMS peut se positionner sur la longue traîne [E].

### 4.2 Concurrents (prix et avis)

| Concurrent | Ce qu'il fait | Prix | Avis / traction | Source |
|---|---|---|---|---|
| Commission Wizard | Rapprochement IA relevés ↔ export AMS, P&C | dès 199 $/mois | Lancé en mars 2026, 2 followers, **0 avis** | P8U-P31 |
| Applied Recon | IA intégrée à Applied Epic | sur devis | Article sponsorisé (« 99 %+ ») | P8U-P44 |
| AgencyBloc Commissions+ | Commissions, orienté vie et santé | 109 $/utilisateur ; ancien message : min 158 $ pour 2 utilisateurs | Avis positifs sur le suivi | P8U-P42 |
| AgencyZoom | Calcul des commissions des producteurs (pas des relevés assureurs) | 79 / 99 $/mois | 14 avis, 4,6/5 | P8U-P43 |
| EZLynx (natif) | Rapprochement des relevés. **PDF : saisie manuelle ou gabarit CSV** | inclus dans l'AMS | G2 : 722 avis, 4,4/5 ; 29 citent l'inexactitude | P8U-P35, P36 |
| HawkSoft (natif) | Import tableur CSV/XLS, rapprochement | inclus | Capterra 4,5/5 (64) ; erreurs d'import signalées en sandbox | P8U-P37 |
| Mivation Xcelerator | Partenaire API HawkSoft, capture des relevés | sur devis | — | P8U-P34 |
| Importeur HawkSoft (domaine IP) | PDF → HawkSoft, par un propriétaire d'agence | inconnu | — | P8U-P33 |
| NowCerts | Téléchargements direct bill via Ivans ; import CSV | inclus | — | P8U-P39 |
| Momentum AMS | « Commission Scan » PDF → CSV, appariement par n° de police seulement | inclus | — | P8U-P38 |
| QQCatalyst | Téléchargements Ivans, page des éléments rapprochés | inclus | Avis G2 positif | recherche « NowCerts OR QQCatalyst… » (g2.com/survey_responses/qqcatalyst-review-13706403) |
| Cowork Recon | Rapprochement P&C | 500 $/mois forfait | Landing seulement | P8U-P32 |
| Fintary, EZ Commissions | Plateformes de commissions | inconnu | Mentions secondaires | recherche « AI commission statement reconciliation… 2026 » (chatgate.ai, coverager.com) |
| Outils IA récents | Commission Wizard (2026) ; aucun autre nommé trouvé | — | — | — |

### 4.3 Frustrations vérifiables

- **Forum Insurance-Forums** : un agent rapproche sous Excel et cherche « a more elegant solution » (P8U-P40).
- **Forum Insurance Journal** : une agence a cessé de rapprocher, parce que « reconciliation took too many man-hours » (P8U-P41).
- **EZLynx** :
  - la documentation officielle impose la saisie manuelle ou le gabarit CSV pour les relevés PDF (P8U-P35) : c'est une friction documentée [F] ;
  - G2 : 29 avis sur l'inexactitude, sans précision sur les commissions (P8U-P36).
- **HawkSoft** : erreurs répétées d'import de tableurs en sandbox (question communautaire, P8U-P37).
- **Reddit r/InsuranceAgent : non trouvé** (P8U-P50).
- Le chiffre « 40-80 h par mois » vient d'un blog d'éditeur non sourcé : il n'est pas retenu.

### 4.4 Segment insuffisamment servi

**Agences sous EZLynx ou HawkSoft, de 3 à 30 personnes, dont une partie des assureurs (MGA, grossistes, petits assureurs régionaux) envoie des relevés en PDF hors téléchargement Ivans** [E sur P8U-P35, P37, P39].

- **Côté HawkSoft** : déjà occupé par Mivation (partenaire) et l'importeur non partenaire (P8U-P33, P34).
- **Côté EZLynx** : **aucun outil tiers trouvé** qui produise le gabarit CSV EZLynx depuis un PDF [F : absence dans les recherches sur EZLynx, Mivation et « Commission reconciliation for independent P&C agencies »]. C'est le créneau le plus ouvert.

**Différenciation réalisable en solo** :
- « PDF du relevé → fichier d'import au format exact de l'AMS, plus une liste d'écarts (impayés, sous-payés, rétrocessions) » ;
- **aucune API nécessaire**, puisque la sortie est un fichier, ce qui évite les marketplaces ;
- extraction par LLM vérifiée par des règles (totaux qui doivent correspondre, comme l'exige EZLynx).

Commission Wizard vise le même travail, mais sur un export AMS générique et à 199 $.

**Prix** : 149 $/mois (A) contre 249 $/mois (B). B est placé entre Commission Wizard (199 $) et Cowork Recon (500 $).

### 4.5 Support et maintenance [E]

- **Bibliothèque de formats de relevés par assureur** : c'est le cœur de la valeur et du coût, avec 15 à 20 h/mois au début.
- Support à la clôture mensuelle (du 1er au 10 du mois, heures US) : environ 1 h par client et par mois.
- **Données sensibles** : n° de police et noms d'assurés. Questionnaire de sécurité probable et GLBA côté agence [E]. Prévoir suppression après traitement, DPA et cyber-assurance.
- Dépendance au fondateur : moyenne. Transférabilité : **bonne**, car la bibliothèque de formats est un actif.

### 4.6 Expérimentation commerciale

- **Cible** : 400 agences IARD du Texas (jeu de données TDI), de 3 à 30 personnes [H : taille déduite du site ou de LinkedIn], avec un indice EZLynx ou HawkSoft sur le site si possible. Les e-mails sont collectés à la main sur les sites (≈ 15 h).
- **Offre** :
  - aimant gratuit : « Commission leak check ». L'agence envoie les relevés PDF d'un mois pour 3 assureurs et l'export AMS correspondant. En 48 h, elle reçoit le fichier d'import prêt pour EZLynx ou HawkSoft et la liste des écarts.
  - Engagement de suppression à 30 jours, NDA simple.
- **Tarif** : essai de 14 jours, **carte enregistrée**, puis A 149 $/mois ou B 249 $/mois (aléatoire). Option annuelle à 10 mois.
- **Canal** : e-mail et une relance. Démo en visio de 20 minutes entre 16 h et 19 h, heure de Paris.
- **Coût** : environ 250 € (domaine et envoi 80 €, CMRA 50 €, API LLM pour les audits 20 €, NDA modèle 0 €, devis E&O et cyber gratuits). Temps : 40 à 50 h (collecte 15 h, 8 audits × 2,5 h, échanges 10 h).

**Message** :

> **Subject:** [Agency] — PDF carrier statements into EZLynx without retyping
>
> Hi [Name], EZLynx asks agencies to key PDF commission statements by hand or rebuild them in its CSV template. I'm offering 10 Texas agencies a free check: send last month's PDF statements from 3 carriers plus your AMS export, and within 48 hours you get the import-ready file and a list of missing or short-paid commissions. Files deleted after 30 days, NDA on request.
> Reply "check" and I'll send a secure upload link.
> — [Name], [Brand], [CMRA address] · Source: Texas Department of Insurance public licensee data · Unsubscribe: [link]

Pour HawkSoft, la même version, en remplaçant le gabarit CSV par le tableur HawkSoft.

**Indicateurs et seuils**

| Indicateur | GO | ITÉRER | STOP | Justification |
|---|---|---|---|---|
| Réponses positives / 400 | ≥ 3 % (12) | 1-3 % | < 1 % | Achat mensuel récurrent à plus de 149 $ : un intérêt modeste suffit s'il se convertit |
| Audits réalisés (données réellement transmises) | ≥ 5 | 2-4 | < 2 | **Le vrai obstacle est la confiance** (données d'assurés envoyées à une société étrangère) |
| Audits avec un écart ≥ 300 $/mois (2× le prix A) ou un gain de temps ≥ 4 h/mois | ≥ 3 sur 5 | 1-2 | 0 | Sans valeur chiffrée sur leurs propres données, pas de vente durable |
| Cartes enregistrées (essai de 14 jours, ≥ 149 $/mois) | ≥ 3 | 1-2 | 0 | Usage mensuel : la carte vaut engagement. 3 clients pour ≈ 250 € + 45 h (≈ 1 830 €) donnent un CAC d'environ 610 €, récupéré en environ 4,5 mois à 135 € HT |
| Conversion de l'essai en paiement | ≥ 2 sur 3 | — | ≤ 1 | Confirme que le fichier d'import fonctionne dans l'AMS réel |

### 4.7 Économie unitaire révisée

```json
{"id":"A-38-P8","titre":"Relevés de commissions PDF → fichier d'import EZLynx/HawkSoft + liste d'écarts, agences IARD US","prix_mensuel_ht":135,"cout_variable_client_mois":5,"frais_paiement_pct":0.06,"frais_paiement_fixe":0.25,"fixes_mensuels":360,"heures_fixes_mois":16,"heures_par_client_mois":1.0,"churn_mensuel":0.025,"cac":600}
```

| Clé | Valeur | Justification | Étiquette |
|---|---|---|---|
| prix_mensuel_ht | 135 € | ≈ 149 $ (A), sous Commission Wizard (199 $). B à 249 $ donnerait un potentiel supérieur | [F] P8U-P31 ; [H] |
| cout_variable_client_mois | 5 € | Extraction LLM d'environ 20 à 60 pages de relevés par mois, et stockage chiffré | [E] |
| frais_paiement_pct / fixe | 0,06 / 0,25 € | Carte internationale, mensuel | [F] secondaire P8U-P51 |
| fixes_mensuels | 360 € | E&O et cyber 250 € (données d'assurés), CMRA 15 €, outils et hébergement 95 € | [H] |
| heures_fixes_mois | 16 h | Formats d'assureurs et évolutions des gabarits AMS | [E] |
| heures_par_client_mois | 1,0 h | Exceptions à la clôture mensuelle, nouveaux assureurs | [E] |
| churn_mensuel | 0,025 | Usage mensuel ancré dans la clôture ; risque d'absorption par l'AMS | [H] |
| cac | 600 € | Coût du test divisé par 3 clients | [H] |

**Simulateur** :
- à 3 000 € de MRR : **23 clients** ; 39 h/mois ; net fondateur 1 722 € ; bénéfice ajusté 1 073 €, **728 € après remplacement du churn** ;
- valorisation centrale ≈ 63 k€ ;
- c'est **le meilleur des trois** après coût d'acquisition.

### 4.8 Excellente / abandon

**Excellente :**
- ≥ 5 audits réalisés, avec des écarts chiffrés ;
- ≥ 3 cartes enregistrées, dont une à 249 $ ;
- un import EZLynx accepté sans retouche ;
- ensuite, la candidature à la HawkSoft Marketplace (38 % d'agences abonnées à un partenaire) comme canal d'échelle.

**Abandon :**
- moins de 2 audits, c'est-à-dire un refus de transmettre les données ;
- des écarts médians inférieurs à 150 $/mois ;
- des relevés presque tous déjà téléchargés via Ivans (aucun PDF à traiter) ;
- des cyber-assurances et E&O inassurables pour un assuré français.

---

## 5. Comparaison des trois pistes

| Critère | C-39 FCC | B-11 Backflow | A-38 Commissions |
|---|---|---|---|
| Liste publique | **RMD CSV national avec e-mail** [F] | Listes locales hétérogènes, e-mail rare [F] | Registres d'État et TrustedChoice **sans e-mail** [F] |
| Coût de constitution de 300 à 400 contacts | Faible (filtre CSV) | Élevé (croisement de PDF, téléphone) | Moyen (≈ 15 h de collecte) |
| Frustration sourcée | Indirecte (ignorance, irréversibilité) ; aucune plainte | Frais et rejets municipaux ; **aucune plainte de testeur** | **Forums (Excel, heures-homme) et documentation EZLynx** |
| Concurrence / tiers testeurs | RMD Keeper, RMD Autopilot (même aimant) | Syncta, C3, R2 à 15-49 $ | Commission Wizard, Mivation, Cowork Recon, outils natifs des AMS |
| Segment mal servi le plus crédible | Revendeurs non facilities-based, à la recertification | Testeurs multi-districts, rappels clients | **Agences EZLynx avec relevés PDF** |
| Fenêtre de test | **Nov.-janv. obligatoire, une fois par an** | Hiver (nov.-fév.) [H] | **Toute l'année** |
| Coût du test | ≈ 280 € + 40 h | ≈ 200 € + 50 h | ≈ 250 € + 45 h |
| Dépendance au fuseau horaire | Faible (e-mail) | **Forte (téléphone)** | Moyenne (démos courtes) |
| E&O et données | E&O critique (amendes de 10 000 $), UPL | Faible ; TCPA si SMS | E&O et cyber, GLBA |
| Clients pour 3 000 € de MRR | 60 | 55 | **23** |
| Heures/mois à 3 000 € | 36 | 47 | 39 |
| Bénéfice ajusté net d'acquisition à 3 000 € | 558 € | 186 € | **728 €** |

**Ordre recommandé** [E] :
1. **C-39 maintenant** (du 9 novembre au 22 janvier). La fenêtre est datée et irrattrapable avant 2028, le test est le moins coûteux et l'aimant est vérifiable. Il faut d'abord trancher l'alerte RMD Autopilot.
2. **A-38 en parallèle à partir de décembre.** C'est la meilleure économie (23 clients) et le test ne dépend pas d'un calendrier. Le risque principal, la confiance pour transmettre des données, se mesure directement par le nombre d'audits.
3. **B-11 en dernier, ou pas du tout.** Canal téléphonique depuis la France, e-mails rares, pas de plainte de testeur, et la plus forte charge horaire. Ne le lancer que si C-39 ou A-38 s'arrêtent, et seulement dans une région à e-mails (WA, Inland Empire).

Aucune des trois pistes n'est **validée**. Chacune reste **inconnue**, avec un test chiffré et des seuils liés au prix et à la fréquence d'achat.
