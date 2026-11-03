# P7-DD-C39 — Calendrier et préparation des dépôts FCC pour petits opérateurs et revendeurs VoIP américains

- Date : 2026-10-29. Phase 7, étude approfondie du finaliste 2 (`P7-rescreen.md`, 57,5/100).
- Brief : `brief-phase7-dd.md` et `brief-phase7.md`. Contexte : `alternatives-negligees.md` (ALT-P01 à P15).
- Preuves : `P7-DD-C39-preuves.csv`, P7DC39-P01 à P40 (13 POUR, 23 CONTRE, 4 NEUTRE).
- Étiquettes : **[P]** preuve sourcée, **[E]** estimation raisonnée, **[H]** hypothèse non vérifiée.

## 0. Méthode et limites

- **43 recherches WebSearch**, soit un peu plus que la fourchette de 30 à 40 demandée. Environ **30 visaient l'invalidation (≈ 70 %)** : recherche nominative des concurrents, prix bas, outils gratuits, absence d'API, UPL, contraction du marché.
- **WebFetch a été essayé une fois et a échoué** : `www.jsitel.com` ne se résout pas (ENOTFOUND). Aucune page n'a été ouverte, toutes les preuves sont des **extraits de recherche**. Pour lire les pages tarifaires (rmd.jayanas.com, performancewest.net, jsitel.com), il faut autoriser ces domaines dans les réglages réseau de la session.
- Recherche interrompue une fois par la limite d'usage, puis reprise. Aucun résultat n'a été perdu.
- Aucun acheteur n'a été simulé. Aucun contenu marketing n'est utilisé comme preuve de volonté de payer : les prix des concurrents prouvent une **offre**, pas des ventes.
- Taux de change supposé : 1 $ ≈ 0,90 € [H].

## Verdict en une page

- **Le principal argument de la piste tombe** : elle reposait sur « aucun SaaS dédié trouvé » (alternatives-negligees.md). La recherche nominative trouve un produit **presque identique** :
  - **RMD Keeper** (Jayanas) propose un calendrier FCC, la surveillance du listing RMD et des partenaires, un constructeur de plan et le compteur des 10 jours ouvrés, à **39, 79, 149 et 399 $ par mois**, plus un accompagnement de recertification à 499 $ par an (P01, P02). Le produit décline déjà des pages SEO par État (P03).
  - **AccuCompliance** (The Commpliance Group, adossé au cabinet CommLaw) prépare le 499-A en SaaS (P10).
  - **JSI TrackNow** suit les échéances, et TrackNow Plus fait les dépôts (P07).
- **La dépense actuelle visible va à des services « faits pour vous »** :
  - Performance West : 499-A à 499 $, conformité complète (499-A/Q, CPNI, RMD, calendrier) à **1 499 $ par an** (P05) ;
  - JSI : plus de 2 500 dépôts par mois (P08) ;
  - CommLaw, TaxConnex : sur devis (P11, P12).
  Un logiciel d'aide au dépôt est donc **plafonné sous le prix d'un service complet** (≈ 125 $ par mois).
- **Rien ne s'automatise jusqu'au dépôt** :
  - USAC E-File n'a pas d'API, l'accès est nominatif, et seul le dirigeant certifie (P34) ;
  - l'API ECFS sert à la recherche, pas au dépôt (P35) ;
  - le 499-A demande des choix de méthode (safe harbor 64,9 % ou étude de trafic) qui relèvent du jugement d'expert (P33) ;
  - la frontière avec l'exercice illégal du droit (UPL) est réelle (P36).
- **Ce qui reste vrai** :
  - la liste de prospects est publique, téléchargeable, avec un e-mail de contact (P18, P19) ;
  - la pression réglementaire monte : règle de janvier 2026 (P22), avis du 20/02/2026 aux revendeurs (P25), FNPRM de juillet 2026 qui élargirait le périmètre (P23) ;
  - les erreurs coûtent cher (P31, P32).
- **Note v3 : 50,0/100** (contre 57,5 au rescreen). **Verdict : piste rétrogradée, pas de code.** Seul un test de 30 jours à moins de 300 € peut la relancer : il doit trouver des acheteurs qui paient d'avance et qui refusent à la fois RMD Keeper et un service fait pour vous.

---

## 1. Problème et acheteur

### 1.1 ICP
- **Cible principale** : revendeurs VoIP et petits opérateurs américains de 1 à 20 personnes qui **facturent eux-mêmes** la voix. Ce sont des MSP qui revendent de l'hébergé PBX, des intégrateurs 3CX ou FreePBX, des revendeurs de plateformes en marque blanche (SkySwitch, Viirtue, RingLogix), et de nouveaux revendeurs d'agents vocaux IA avec numéros (ALT-P14).
- Ils portent eux-mêmes les obligations 499-A/Q, CPNI et RMD. L'avis de l'Enforcement Bureau du 20/02/2026 précise qu'ils **ne peuvent pas s'en remettre à leur opérateur amont** (P25, ALT-P12).
- **Cibles exclues** :
  - opérateurs ruraux (ILEC) déjà suivis par JSI ou des cabinets ;
  - grands opérateurs ;
  - déposants étrangers et intermédiaires purs, qui représentaient environ 9 % et 16 % de la base en 2021 (P21).

### 1.2 Volume
| Mesure | Valeur | Étiquette |
|---|---|---|
| Entreprises au RMD au 28/09/2025 | 9 242 | [P] P20 |
| Dont aucun STIR/SHAKEN (profil petit ou non-facilities) | 2 909 | [P] P20 |
| Part étrangère + intermédiaire (2021) | ≈ 25 % | [P] P21, ancien |
| Base adressable « petit acteur US qui facture » | **≈ 3 000 à 5 000** | [E] : 9 242 moins étrangers, intermédiaires, grands opérateurs et sociétés radiées |
| Total 2026 | inconnu, aucun chiffre trouvé | — |

### 1.3 Workflow actuel et fréquence
- **Pic annuel** :
  - recertification RMD au 1er mars, fenêtre ouverte dès le 1er février (P22) ;
  - CPNI au 1er mars (2 mars en 2026, P29) ;
  - 499-A au 1er avril ;
  - 499-Q chaque trimestre.
- **Hors pic** : mise à jour du RMD sous 10 jours ouvrés après tout changement (P22), plus Form 477 et dépôts d'État.
- **Outils actuels** : rappels de l'opérateur amont (guides gratuits, ALT-P11), cabinet ou consultant, Performance West ou JSI, RMD Keeper, ou rien.
- **Coût de l'inaction** :
  - RMD : 10 000 $ par information fausse, 1 000 $ par mise à jour tardive [P] P22 ; une radiation entraîne le blocage du trafic par les autres opérateurs (P26).
  - 499 : pénalités et intérêts USAC, environ 57 000 $ dans un cas d'erreur de classement (P31) ; 100 000 $ proposés pour 13 formulaires non déposés (P32).
  - CPNI : plafond légal de 251 322 $ par violation (P29). Mais les amendes CPNI observées datent de 2009 (20 000 $, P30).
  - **L'exécution récente est plus faible que prévu** : 14 radiations seulement en septembre 2026 (P26), et aucune action annoncée contre les retardataires du 1er mars 2026 (P28).

### 1.4 Preuves de dépense actuelle
| Acteur | Ce qui est vendu | Prix | Clients | Source |
|---|---|---|---|---|
| Performance West | 499-A seul / 499-A + Q / conformité complète | 499 $ / 799 $ / **1 499 $ par an** | inconnu | P05 [P] (prix affiché, incohérent sur la page) |
| Performance West | Enregistrement CORES, FRN, 499 initial, PUC | 1 299 $ | inconnu | P06 [P] |
| RMD Keeper | SaaS, quatre formules | 39 à 399 $ par mois ; 499 $ par an d'accompagnement | **aucune trace tierce** | P01, P02, P04 |
| JSI / Inteserra | Service de dépôts + TrackNow | sur devis | « 2 500+ dépôts par mois » (déclaratif) | P07, P08 |
| JSI | Formation CPNI | 295 $ par société | inconnu | P09 |
| CommLaw / Commpliance Group / TaxConnex | Conseil + AccuCompliance + fiscalité | sur devis | inconnu | P10, P11, P12 |

**Lecture** : il y a une dépense, mais elle se porte sur des **services** de quelques centaines de dollars à 1 500 $ par an. Aucun avis, aucune installation, aucun nombre de clients n'est observable pour un **logiciel**.

## 2. Concurrence et segment mal servi

### 2.1 Tableau des concurrents
| Concurrent | Type | Prix | Cible | Limites | Source |
|---|---|---|---|---|---|
| **RMD Keeper (Jayanas)** | SaaS | 39 / 79 / 149 / 399 $ par mois | Fournisseurs de voix, consultants, plateformes | Centré sur le RMD ; ne prépare pas le 499-A ; traction inconnue | P01-P04 |
| **AccuCompliance (TCG / CommLaw)** | SaaS + avocats | forfait ou abonnement (non publié) | PME IT et télécom | Source de 2020 sponsorisée ; statut actuel inconnu | P10 |
| **JSI TrackNow / TrackNow Plus** | Tracker web + service | sur devis | Opérateurs, souvent ruraux | Pas de prix public ; orienté accompagnement | P07, P08 |
| **Performance West** | Service fait pour vous | 499 à 1 499 $ par an | Petits opérateurs, revendeurs | Service humain, incohérences de prix | P05, P06 |
| **TaxConnex + Commpliance Group** | Plateforme taxe + réglementaire | sur devis | VoIP, MVNO, cloud | Haut de marché | P11 |
| **TransNexus** | Modèle de plan de mitigation pour ses clients | inclus | Clients ClearIP/NexOSS | « No legal guidance » | P13 |
| **ZipDX Robocall Mitigation Explorer** | Suivi public du RMD | gratuit (2021, statut non vérifié) | Tous | Pas d'alertes vérifiées | P14 |
| **Grossistes (SkySwitch, Viirtue, RingLogix, Loop)** | Guides gratuits ; paiement USF/TRS parfois inclus | inclus | Leurs revendeurs | Le revendeur reste responsable | P15, ALT-P11 |
| **FCC** | Appli CPNI, RMD, E-File | gratuit (100 $ de frais RMD) | Tous | Aucun rappel ni contrôle de cohérence | ALT-P10, P22 |
| Teleforge, Telecom Compliance Services | — | — | — | **Aucune trace** en recherche nominative | P40 |
| Neustar / TransUnion | STIR/SHAKEN | — | — | Pas d'offre de conformité réglementaire trouvée | recherche n° 31 |

### 2.2 Ce que les acteurs en place servent mal (preuves)
- **Le 499-A pour les très petits revendeurs**. Les cabinets ne publient aucun prix (P39), RMD Keeper ne couvre pas le 499. Le seul prix public est celui de Performance West à 499 $ (P05). Le besoin est réel : des erreurs de classement coûtent des dizaines de milliers de dollars (P31), et les revendeurs découvrent l'obligation tard (ALT-P13).
- **Les nouveaux assujettis** (revendeurs d'agents IA, MVNO, plateformes si le FNPRM est adopté, P23) ne connaissent pas les cabinets télécom [E].
- **Ce n'est pas un segment vide**. RMD Keeper occupe déjà l'angle « RMD + calendrier + SEO par État » au prix visé. Un 499-A « logiciel » touche au jugement d'expert (P33) : c'est précisément ce que les acheteurs paient aux cabinets.

### 2.3 Ce qui empêche une plateforme hôte de copier la fonction
- Les grossistes (SkySwitch, Viirtue) **n'ont pas intérêt** à prendre la responsabilité réglementaire de leurs revendeurs : ils publient des guides avec avertissement « not legal advice » (ALT-P11, P15) [E].
- La FCC et USAC ne fournissent ni rappels ni contrôle de cohérence [E].
- **Mais** rien n'empêche RMD Keeper, JSI ou CommLaw d'ajouter un module 499 ou un rabais. Le seul fossé possible est le contenu réglementaire tenu à jour, et il dépend du fondateur.

## 3. Acquisition (A)

### Canal 1 : e-mail sortant à partir du CSV public du RMD
- **Source** : le CSV est téléchargeable sans inscription. Il contient nom, titre, adresse, téléphone et e-mail du contact « robocall mitigation » (P18). Ces données sont publiques par décision de la FCC (P19).
- **Filtres** :
  - pays US ;
  - statut « voice service provider » ;
  - STIR/SHAKEN partiel ou nul ;
  - exclusion des grands opérateurs et des sociétés radiées.
- **Cadre légal** :
  - **CAN-SPAM** : opt-out, le B2B n'est pas exempté. Il faut des en-têtes exacts, un objet non trompeur, une adresse postale valide (une boîte enregistrée suffit selon la FTC d'après une source secondaire, à vérifier) et un désabonnement traité sous 10 jours ouvrés. Les amendes vont jusqu'à environ 53 000 $ par e-mail (P38).
  - Lois d'États (Californie) : à vérifier [H].
  - Le droit français (CNIL, prospection B2B en opt-out si le message est en rapport avec la profession) s'applique aussi à l'expéditeur établi en France. Message en rapport avec l'activité de télécom du destinataire, identité de l'expéditeur, lien d'opposition, information RGPD sur la source des données (base FCC) [E].
  - PECR et CASL : sans objet (cible US).
- **Limite** : RMD Keeper exploite très probablement la même liste [H]. Le contact RMD est souvent un avocat ou un consultant, pas le dirigeant [E].

### Canal 2 : SEO sur les échéances
- Pages « RMD recertification 2027 », « CPNI certification 2027 », « 499-A due date », et une page par État.
- **Le terrain est occupé** : Kelley Drye, Wiley, TLP, TransNexus et Mondaq publient chaque année. RMD Keeper fait déjà des pages par État (P03). L'effet serait lent, au mieux 6 à 12 mois [E].
- **Canal 2 bis** : partenariat avec un grossiste en marque blanche [H]. C'est le seul scénario haut d'alternatives-negligees.md, et il n'est pas prouvé.

### Coût d'acquisition plausible
- Outils (domaine d'envoi, outil d'envoi, boîte postale US) : ≈ 60 à 100 € par mois [E].
- Temps : environ 6 à 8 h par client signé (ciblage, relances, une démo en visio sur le fuseau US, de 15 h à minuit heure de Paris) [H].
- **CAC ≈ 350 €** [H], si 1 000 e-mails donnent environ 10 essais et 3 clients. Aucun taux observé.

### Message d'accroche (non testé)
> « Your RMD recertification window opens Feb 1. Since the January 2026 rules, a wrong field is a $10,000 base fine and a late update $1,000. We check your RMD listing, CPNI and 499 calendar every night and tell you what changed. 14-day trial, no lawyer jargon. Not legal advice. »

### Délais [E]
- **10 clients** : 4 à 6 mois, à condition de démarrer avant le pic de février-mars 2027.
- **40 clients** : 18 à 30 mois, soit deux cycles annuels, à cause de la saisonnalité et d'un concurrent déjà en place.

## 4. Produit et exploitation (B)

### Architecture minimale
- Node, Supabase/Postgres, Stripe et Brevo : la pile Relanzio.
- Import nocturne du CSV RMD : diff du listing du client et de ses partenaires, alertes.
- Calendrier par client : fédéral, plus États en option.
- Assistant de préparation du 499-A : saisie des revenus par catégorie, rappel des règles USAC, fiche à recopier dans E-File.
- Générateur de certificat CPNI (modèle) et de plan de mitigation à relire.

### Intégrations et API
| Source | Accès | Stabilité | Source |
|---|---|---|---|
| CSV public du RMD | Public, sans inscription | Format modifié par chaque réforme (2024, janvier 2026, FNPRM 2026) | P18, P22, P23 |
| API ECFS | Clé gratuite, **recherche seulement** | Stable | P35 |
| USAC E-File | **Pas d'API** ; accès nominatif, MFA, seul le dirigeant certifie | — | P34 |
| Appli CPNI de la FCC | Formulaire web, pas d'API trouvée | — | ALT-P10 |

**Conséquence** : le produit **prépare et rappelle, il ne dépose pas**. Sa valeur perçue est donc inférieure à celle d'un service « fait pour vous ».

### Ce qui casse, et à quelle fréquence
- Format du CSV RMD : 1 à 2 fois par an [E].
- **Contenu réglementaire** à revoir à chaque ordonnance : janvier 2026, FNPRM de juillet 2026, instructions annuelles du 499-A (P22, P23, P33) [P].
- Changement des formulaires USAC chaque année [P] P33.

### Charge et support
- Maintenance et veille réglementaire : 12 à 18 h par mois, avec un pic en janvier-avril [E].
- Support : 0,5 à 0,8 h par client et par mois en moyenne, très concentré de février à avril, avec des questions qui frôlent le conseil juridique (« dois-je cocher interconnected VoIP ? ») [E].
- Fuseau horaire : support US en fin de journée et en soirée heure de Paris [E].

### Automatisable / non automatisable
- **Automatisable** : rappels, surveillance du listing et des partenaires, contrôles de complétude, modèles.
- **Non automatisable** :
  - le choix de classement (interconnected ou non) et de méthode (safe harbor 64,9 % ou étude de trafic), qui relève du jugement d'expert (P33) ;
  - la signature du dirigeant (P34) ;
  - la réponse à une mise en demeure.
- **Risque UPL** : un logiciel qui choisit à la place de l'utilisateur peut être qualifié d'exercice illégal du droit (Reynoso, 9e Circuit ; règle du Colorado sur les logiciels, P36). Le produit doit rester clérical : informations, rappels, contrôles.

### Délai de MVP
- MVP vendable (surveillance RMD, calendrier, CPNI) : 4 à 6 semaines en solo avec Claude Code [E]. **Ce serait un clone de RMD Keeper.**
- Assistant 499-A crédible : 2 à 3 mois de plus, avec relecture par un spécialiste US [E].

## 5. Économie unitaire (D)

| Clé | Valeur | Justification | Étiquette |
|---|---|---|---|
| prix_mensuel_ht | 79 € (≈ 88 $) | Coincé entre RMD Keeper Monitor (79 $) / Keeper (149 $) et le service complet de Performance West (1 499 $ par an ≈ 125 $ par mois). Un logiciel qui ne dépose pas ne peut pas coûter plus cher qu'un service qui dépose | [E] sur P01, P05 |
| cout_variable_client_mois | 2 € | Base, e-mails, stockage des PDF | [E] |
| frais_paiement_pct | 0,055 | Carte hors EEE, conversion USD-EUR et Stripe Billing. Tarifs Stripe non revérifiés ici | [H] |
| frais_paiement_fixe | 0,25 € | Frais fixe Stripe par transaction | [H] |
| fixes_mensuels | 330 € | E&O tech d'environ 3 000 € par an : 250 €, au-dessus de la moyenne US de 1 094 $ car l'assuré est étranger et le sujet réglementaire (P37). Hébergement et outils : 40 €. Boîte postale US, domaine et outil d'envoi : 40 € | [E] sur P37 |
| heures_fixes_mois | 15 h | Veille FCC/USAC, mise à jour des règles et des formulaires, SEO | [E] sur P22, P23, P33 |
| heures_par_client_mois | 0,6 h | Support saisonnier proche du conseil, onboarding en anglais | [E] |
| churn_mensuel | 0,035 | Usage saisonnier (désabonnement après avril si mensuel), sorties vers le modèle d'agent (P16, P17), radiations ; compensé en partie par l'annuel | [E] |
| cac | 350 € | Outils plus 6 à 8 h par client, sans conversion observée | [H] |

```json
{"id":"C-39","titre":"Calendrier et préparation des dépôts FCC (RMD, CPNI, 499-A/Q) pour petits revendeurs VoIP US","prix_mensuel_ht":79,"cout_variable_client_mois":2,"frais_paiement_pct":0.055,"frais_paiement_fixe":0.25,"fixes_mensuels":330,"heures_fixes_mois":15,"heures_par_client_mois":0.6,"churn_mensuel":0.035,"cac":350}
```

**Ordre de grandeur indicatif [E]**, le calcul officiel étant fait par le script central :
- 3 000 € de MRR demandent **38 clients**, soit ≈ 38 h par mois (≈ 9 h par semaine, concentrées en février-avril).
- Il faudrait remplacer ≈ 1,3 client par mois.

## 6. Transférabilité et attractivité pour un acheteur (C)

| Élément | Transfert | Commentaire |
|---|---|---|
| Code et propriété intellectuelle | Oui, par cession d'actifs | Pile standard, en anglais [E] |
| Domaine, marque, site | Oui | Marque à déposer aux US (USPTO) pour un acheteur US [H] |
| Données clients | Oui, avec information des clients | Données B2B US ; RGPD côté vendeur [H] |
| Abonnements Stripe | **Difficile** | Pas de transfert entre pays, migration des clients nécessaire (P7-cession §9) |
| Hébergement | Oui | |
| Intégrations | Aucune à transférer (CSV public) | Point fort : aucune dépendance à une marketplace |
| Support | Partiel | La valeur tient à la **compétence réglementaire** du fondateur |
| Acquisition | Partielle | Liste publique et pages SEO transférables ; relation de confiance non transférable |

- **Ce qui détruit la valeur** :
  - dépendance au savoir réglementaire FCC du fondateur ;
  - risque de responsabilité (E&O, UPL) que l'acheteur reprend ;
  - saisonnalité ;
  - churn de fin de saison ;
  - un concurrent direct au même prix.
- **Acheteurs probables** :
  - cabinets ou consultants télécom (JSI, CommLaw/Commpliance, Performance West) qui veulent un produit d'appel ;
  - RMD Keeper / Jayanas ;
  - un grossiste en marque blanche.
  Ce sont des acheteurs stratégiques US, donc un marché d'acheteurs étroit [E].
- **Points d'audit** :
  - MRR et churn par cohorte, et saisonnalité ;
  - part de l'annuel ;
  - sinistres et réclamations liés à un dépôt ;
  - avertissements « not legal advice » et conditions générales ;
  - police E&O ;
  - heures de support en pic ;
  - fréquence des mises à jour réglementaires ;
  - conformité CAN-SPAM de l'historique d'envoi.

## 7. Risques et difficultés concrètes
1. **Concurrent direct au même prix** (RMD Keeper), plus des cabinets qui ont un SaaS (AccuCompliance) [P].
2. **Responsabilité** : une erreur d'outil peut coûter 10 000 $ ou plus au client (P22, P31). L'E&O est indispensable, cher et difficile à obtenir pour un assuré étranger [E].
3. **UPL** : la frontière entre outil clérical et conseil juridique est étroite (P36).
4. **Règles mouvantes** : ordonnance de janvier 2026 et FNPRM de juillet 2026 (P22-P24). Le FNPRM peut aussi **élargir** la base (P23).
5. **Pas d'API de dépôt** (P34, P35) : la valeur reste plafonnée.
6. **Contraction possible du marché** : les MSP passent au modèle d'agent sur conseil des cabinets (P16, P17).
7. **Exécution moins intense que prévu** (14 radiations en 2026, P26), ce qui réduit l'urgence perçue.
8. **Fondateur** :
   - français, sans réseau télécom US, et sans aucun client payant à ce jour ;
   - support aux horaires US ;
   - facturation en dollars depuis une micro-entreprise (TVA hors UE et sales tax des États sur le SaaS à vérifier, [H]).

## 8. Notes grille v3

| Critère (poids) | Rescreen | DD | Étiquette | Cause de l'écart |
|---|---|---|---|---|
| Problème et volonté de payer (15) | 6 | **6** → 9,0 | [P] | Sanctions et pression réelles (P22, P25, P31) ; dépense prouvée seulement pour des **services** (P05) ; WTP logiciel non observée |
| Acquisition (20) | 6 | **5** → 10,0 | [E] | Liste publique avec e-mails confirmée (P18, P19), mais concurrent sur la même liste et le même SEO (P01, P03), confiance envers un étranger, saisonnalité |
| Solo (15) | 5 | **4** → 6,0 | [E] | Pas d'API de dépôt (P34, P35) ; règles qui changent (P23) ; support proche du conseil (P33) |
| Rentabilité (15) | 6 | **4** → 6,0 | [P]/[E] | Prix plafonné à ≈ 79-149 $ par RMD Keeper et le service à 1 499 $ par an (P01, P05) au lieu de 149 $ [H] ; E&O en charge fixe (P37) |
| Rétention (10) | 7 | **6** → 6,0 | [E] | Obligations annuelles, mais usage saisonnier et sortie vers le modèle d'agent (P16) |
| Revente (15) | 6 | **6** → 9,0 | [E] | Produit en anglais pour acheteurs US (+) ; dépendance au savoir du fondateur et responsabilité (−) |
| Différenciation (5) | 5 | **2** → 2,0 | [P] | Concurrents nominatifs directs (P01, P07, P10) ; la lacune « aucun SaaS trouvé » est invalidée |
| Risques (5) | 3 | **2** → 2,0 | [E] | UPL (P36), E&O, règles mouvantes |
| **Total** | **57,5** | **50,0** | | −7,5, surtout Différenciation, Rentabilité et Solo |

## 9. Plan de validation sur 30 jours (avant tout code)

Fenêtre favorable : novembre-décembre 2026, avant l'ouverture de la recertification le 1er février 2027.

1. **Premiers clients** :
   - télécharger le CSV RMD et filtrer 300 contacts US de petits revendeurs (STIR/SHAKEN partiel ou nul, nom de MSP ou d'intégrateur) ;
   - envoyer 3 vagues conformes à CAN-SPAM (identité exacte, adresse postale, lien de désabonnement, suppression sous 10 jours) avec mention RGPD de la source ;
   - poster en parallèle des réponses utiles sur les forums 3CX et VoiceOps, sans publicité.
2. **Entretiens** : 12 à 15 entretiens de 20 minutes. Questions sur le **passé** uniquement :
   - « Qui a fait votre recertification RMD en mars 2026, et combien de temps cela a pris ? »
   - « Combien avez-vous payé l'an dernier pour le 499-A, le CPNI et le RMD (cabinet, Performance West, JSI, rien) ? »
   - « Avez-vous reçu une mise en demeure, une pénalité USAC ou une question de votre grossiste ? »
   - « Connaissez-vous ou utilisez-vous RMD Keeper ? Pourquoi pas ? »
   - « Votre grossiste vous a-t-il proposé de passer en modèle d'agent ? »
3. **Proposition de valeur testée** : « Votre calendrier FCC et votre listing RMD surveillés, plus une fiche 499-A pré-remplie à relire par vous ou votre conseil. Pas de conseil juridique. »
4. **Test de prix** : deux offres aléatoires, 790 $ par an ou 1 190 $ par an (avec revue de la fiche 499-A). L'offre mensuelle n'est montrée qu'en ancrage.
5. **Premiers paiements** : précommande annuelle « founding customer » via Stripe Payment Link, remboursable si le produit n'est pas livré le 15/01/2027. Ou bien un **service manuel facturé** : contrôle de cohérence RMD + CPNI à 149 $, présenté comme une vérification de données, pas un avis juridique.
6. **Seuils** :
   - **GO** :
     - ≥ 5 paiements (précommande ≥ 500 $ ou service manuel) sur ≥ 12 entretiens ;
     - et ≥ 3 acheteurs qui expliquent pourquoi ni RMD Keeper ni un service fait pour vous ne leur conviennent ;
     - et un taux de réponse e-mail ≥ 3 % ;
     - et un devis E&O ≤ 4 000 € par an.
   - **STOP** :
     - < 2 paiements ;
     - ou la majorité répond « mon grossiste, mon avocat ou Performance West le fait » ;
     - ou le prix accepté est < 40 $ par mois ;
     - ou le devis E&O est > 6 000 € par an, ou il y a un refus d'assurer ;
     - ou le taux de réponse est < 1 % après 300 envois.
7. **Budget** : ≈ 250 à 300 € (domaine d'envoi, outil d'envoi un mois, boîte postale US, devis E&O gratuit) et 25 à 30 h.

## 10. Ce qui ferait monter ou baisser la piste

**Monter** (jusqu'à environ 58-60) :
- un **grossiste en marque blanche** qui accepte de distribuer l'outil à ses revendeurs (canal non commercial) ;
- l'adoption du FNPRM qui élargit le RMD aux revendeurs, MVNO et plateformes (P23) ;
- une preuve que RMD Keeper n'a pas de traction et que le 499-A petit revendeur reste sans offre logicielle ;
- ≥ 5 précommandes.

**Baisser** (sous 45) :
- un E&O introuvable ou trop cher ;
- RMD Keeper qui ajoute le 499 ;
- des entretiens qui montrent une préférence nette pour le « fait pour vous » ;
- une exécution FCC qui reste faible en 2027 ;
- l'accélération de la sortie des MSP vers le modèle d'agent.
