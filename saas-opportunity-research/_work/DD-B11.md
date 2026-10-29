# DD-B11 — Application pour testeurs de dispositifs anti-retour (backflow), multi-districts, US

Finaliste de remplacement. Date : 2026-10-29. Phase 2/4.

**Méthode.**
- 43 recherches WebSearch. Environ 20 d'entre elles (≈ 47 %) visaient l'invalidation : portails municipaux qui imposent la saisie, absence d'API, concurrents bon marché, rappels déjà envoyés par les villes, absence de plaintes, Syncta/Watts.
- WebFetch est bloqué : `r2utility.com` ne se résout pas dans cette session. Aucune page n'a été lue en entier : toutes les preuves sont des **extraits de recherche**.
- Preuves : `P01`…`P62` dans `DD-B11-preuves.csv` (identifiants `DD-B11-Pxx`) : 22 POUR, 26 CONTRE, 14 NEUTRE.
- Concurrents : 28 lignes dans `DD-B11-concurrents.csv`.

Étiquettes : **[OBS]** fait observé dans un extrait ; **[EST]** estimation ; **[HYP]** hypothèse ; **[INC]** inconnu.

---

## Verdict d'abord

- **Note : 53/100.** En phase 1, B-top affichait 69 ; le calcul de `scores-bruts.csv` donne 66.
- **Le problème est réel et bien documenté par des sources officielles.** Le testeur subit :
  - un canal de dépôt et un format différents dans chaque ville (BSI Online, VEPO, SwiftComply, Syncta, SAMS, SpryBackflow, C3, Tokay, Klir, PDF par email, papier) [OBS P04, P05, P10, P15 à P17, P19, P20, P58] ;
  - des frais par rapport de 0 à 38 USD [OBS P01 à P03, P06, P07, P11, P12, P24, P56] ;
  - des enregistrements annuels dans chaque ville, de 20 à 250 USD [OBS P23, P24, P57] ;
  - un rejet du rapport si la licence ou la calibration a expiré, ou si le dépôt est en retard [OBS P02, P13].
- **Mais le produit imaginé en phase 1 se heurte à trois murs :**
  1. **Les portails imposent une ressaisie testeur par testeur, sans API publique ni import par lot** [OBS P04, P05, P62]. La migration vers ces portails s'accélère en 2026 : Longmont en février, Seattle en août, Mesa en août [OBS P18 à P20]. Une app testeur ne supprime donc pas la saisie : elle en **ajoute** une, sauf à automatiser les portails (risque CGU, fragilité).
  2. **Le seul acteur qui supprime vraiment la double saisie existe déjà.** Syncta, propriété de Watts, fabricant de vannes, envoie en un clic les rapports aux purveyors équipés de Syncta [OBS P08]. Son prix testeur est très bas : 25 USD/mois de minimum, puis 4,95 USD par test [OBS P09].
  3. **Le marché testeur est déjà encombré d'offres à 10-50 USD/mois** : C3Backflow 15, R2 25, QuoteIQ 29,99, BackflowBoss 49, apps iOS de 9,99 [OBS P43 à P47]. Le « moteur de revenu » des rappels est en partie assuré gratuitement par les villes, qui écrivent elles-mêmes aux propriétaires et publient la liste des testeurs, parfois avec leurs prix [OBS P25 à P28].
- **Aucune plainte publique de testeurs n'a été trouvée sur Reddit ou dans les forums** [OBS P41]. Seul signal d'insatisfaction : un avis très négatif sur Syncta (pertes de données, pannes) [OBS P42].
- **Wedge résiduel crédible mais étroit** : un « copilote de dépôt multi-portails » couplé à une bibliothèque de formulaires par district (§5). Sa valeur dépend d'une question non vérifiée : **les CGU des portails tolèrent-elles un pré-remplissage assisté ?** [INC]
- **Verdict : à ne pas lancer en l'état.** Une seule expérience peu coûteuse pourrait relancer l'idée : 30 appels à des testeurs (§13).

---

## 1. ICP, acteurs et contexte d'achat

| Rôle | Qui | Statut |
|---|---|---|
| **ICP** | Entreprise de test backflow de 1 à 10 testeurs certifiés (plomberie, irrigation/paysage, protection incendie) qui dépose dans **au moins 3 juridictions aux canaux différents**. Volume de 300 à 3 000 tests par an. Zones denses en portails hétérogènes : sud de la Floride (BSI), DFW/Austin (VEPO, papier, enregistrements municipaux), Californie (CCCPH), Colorado, Washington. | [EST] |
| Taille des entreprises | Un testeur solo fait de 8 à 12 tests par jour sur une tournée dense [OBS P40, source faible]. Une entreprise de plomberie et de test à vendre à San Diego déclare 635 tests par an [OBS P39]. Le démarrage coûte peu : un cours, une jauge de 800 à 1 200 USD, une assurance [OBS P40]. **Il y a donc beaucoup de solos et de plombiers pour qui le test est une activité d'appoint.** Leur part réelle est inconnue [INC]. | OBS/HYP |
| Utilisateur | Le testeur sur le terrain (saisie), et l'office manager ou le conjoint pour le dépôt sur les portails, la facturation et les rappels | [HYP] |
| Prescripteur | Formateurs BPAT (TEEX, ICC, chapitres ABPA/ASSE), pairs, distributeurs de kits de test | [HYP] |
| Décideur économique | Le patron, qui est souvent aussi le testeur | [HYP] |
| Sponsor | L'office manager, qui ressaisit dans 3 à 6 portails | [HYP] |

**Objections attendues :**
1. « Je dois de toute façon saisir dans BSI ou VEPO, alors pourquoi saisir deux fois ? » C'est l'objection la plus forte [OBS P04, P05].
2. « La ville envoie déjà le rappel à mes clients » [OBS P25, P27].
3. « Syncta, R2 ou C3 fait ça pour 15 à 25 USD » [OBS P09, P43, P44].
4. « Mon Jobber ou mon QuoteIQ me suffit » [OBS P45].
5. « Je fais 200 tests par an, le papier suffit » [HYP].
6. « Vous êtes une boîte française ? »

**Contexte d'achat :**
- Achat en libre-service, entre 15 et 80 USD/mois [OBS sur les prix concurrents].
- Saisonnalité forte : avant le pic de printemps et d'été et pendant celui-ci, avec des tarifs « early bird » à Wentzville [OBS P56].
- **Fenêtre d'achat utile : l'hiver** (novembre à février), quand les testeurs ont le temps de changer d'outil [HYP].
- **Déclencheur fort : la bascule d'une ville vers un nouveau portail**, comme Longmont, Seattle ou Mesa en 2026 [OBS P18 à P20].

## 2. Job-to-be-Done et workflow actuel

**JTBD.** « Faire mes 600 tests annuels, être payé, que chaque rapport soit accepté du premier coup par la bonne ville, et que mes clients me rappellent moi, et pas un concurrent de la liste municipale, l'an prochain. »

**Workflow actuel** (reconstruit à partir des pages des villes ; aucun entretien) :
1. La ville envoie l'avis annuel au propriétaire avec la liste des testeurs agréés [OBS P25, P27]. Le propriétaire choisit un testeur, parfois sur le prix publié [OBS P26].
2. Le testeur planifie, se déplace et teste (20 à 45 minutes par assemblage [OBS P40, source faible]). Il note les mesures sur papier ou dans une app.
3. Il identifie l'utility qui dessert le bien, ce qui n'est pas trivial : Columbus n'accepte que ses propres clients [OBS P16].
4. Il dépose dans le canal de cette ville, selon le cas :
   - le portail du prestataire de la ville, avec saisie unitaire, choix de la jauge et paiement par carte [OBS P04, P05, P10] ;
   - le PDF de la ville par email, un email par adresse [OBS P17] ;
   - le papier [OBS P23] ;
   - parfois deux destinataires, la ville et le comté [OBS P58].
   Le délai est de 5 à 10 jours ; au-delà, le rapport est rejeté et il faut retester [OBS P13, P16].
5. Il entretient ses credentials dans chaque portail et chaque ville : licence, calibration annuelle de la jauge, enregistrement payant [OBS P04, P24, P33, P57].
6. Il facture le client, en répercutant parfois les frais de dépôt [OBS P22].
7. Il se rappelle, ou non, de relancer le client l'an suivant (tableur, calendrier) [HYP].

**Pourquoi c'est douloureux :**
- ressaisie multi-portails ;
- règles et délais propres à chaque ville ;
- risque de rejet ;
- credentials dispersés ;
- concurrence par les prix sur les listes publiques.

**Mais la douleur la plus forte (le portail) est imposée par la ville et non par l'outil du testeur.** Aucune plainte publique ne l'exprime [OBS P41].

**Fréquence.** Chaque assemblage est testé une fois par an ; 94 % des distributeurs exigent un test au moins annuel [OBS P60]. Pour le testeur, la saisie et le dépôt sont quotidiens en saison.

## 3. Coût de l'inaction

Formule (par entreprise et par an) :

`C = N × t_admin × h + N × p_perte × prix_test + N × r_rejet × prix_test + F_credentials`

| Variable | Valeur | Étiquette |
|---|---|---|
| N (tests par an) | 600 | [HYP] ; ordre de grandeur de P39 (635) |
| t_admin (saisie, dépôt, facture par test) | 10 min | [HYP] |
| h (coût horaire de l'office ou du patron) | 35 USD | [HYP] |
| p_perte (clients non relancés, partis chez un autre testeur de la liste) | 5 à 10 % | [HYP] |
| prix_test | 70 à 150 USD, retenu 100 | [OBS P40, source faible] |
| r_rejet (rapport rejeté ou en retard, retest non facturable) | 1 % | [HYP] |
| F_credentials (enregistrements multi-villes) | 20 à 250 USD par ville et par an | [OBS P24, P57] — inévitable, l'outil ne le réduit pas |

**Application :**
- Temps : 600 × 10/60 × 35 = **3 500 USD**.
- Clients perdus : 600 × 7,5 % × 100 = **4 500 USD**.
- Rejets : 600 × 1 % × 100 = **600 USD**.
- **Total ≈ 8 600 USD/an [EST]**, hors frais d'enregistrement.

**Part réellement capturable par une app testeur :**
- la moitié du temps au plus, puisque la saisie portail reste ;
- une partie des pertes, puisque la ville relance déjà ;
- soit environ **2 000 à 4 000 USD/an [EST]**.

C'est suffisant pour justifier 30 à 80 USD/mois. **Mais Syncta, R2 ou C3 capturent la même valeur pour 180 à 300 USD/an.**

## 4. Concurrents (détail : `DD-B11-concurrents.csv`, 28 lignes)

**Directs, côté testeur** [OBS, extraits] :

| Acteur | Prix observé | Limite ou plainte |
|---|---|---|
| **Syncta (Watts)** | Min 25 USD/mois, 5 tests gratuits puis 4,95 USD/test ; 99 USD/testeur ; 549 USD illimité [P09] | Double face : SynctaOne dépose chez les purveyors Syncta [P08]. Capterra 4,3/5, valeur 3,9/5 ; pertes de données, pannes, support dégradé, migration longue [P42] |
| R2 Utility | 25 USD/mois Basic ; 99/199/300 selon les pages [P44] | Aucune intégration BSI trouvée ; grille incohérente |
| C3Backflow | 15 USD/mois, version gratuite [P43] | 0 avis |
| QuoteIQ | 29,99 à 699 USD/mois [P45] | CRM horizontal ; classement auto-promotionnel |
| BackflowBoss | 49 USD/mois, cité par QuoteIQ [P45] | Site non trouvé |
| Backflow Pro (iPad) | 29,99 / 49,99 / 71,99 USD ; 3,99 USD/mois [P46] | Libellés incohérents |
| The Backflow Assistant | 9,99 USD/mois [P47] | Solo seulement |

**Noms fournis par la consigne et non trouvés** : « Backflow Test Pro », « BackflowManager », « Rapid Tester ». Ils ont été cherchés explicitement, sans aucun résultat [INC]. Ils ne figurent pas dans le CSV.

**Indirects :**
- FSM généralistes : Jobber 39 USD/utilisateur, Housecall Pro 59, Markate 69, Workiz 225, FieldEdge environ 600 pour 5 personnes, ServiceTitan sur devis, tous cités par QuoteIQ [P45]. Aucun formulaire backflow natif n'a été trouvé.
- HindSite, côté irrigation (prix inconnu).
- **Portails côté utility**, qui sont à la fois le canal imposé et un concurrent fonctionnel (licences, kits, historique) : BSI Online, VEPO, SwiftComply, SAMS, SpryBackflow, Tokay, Klir, C3. Au Canada, MTS FAST coûte 49,99 CAD/an au testeur et couvre toutes les municipalités du réseau [P48].

**Substituts :**
- PDF ou papier de la ville, tableur et calendrier [HYP : substitut dominant chez les solos].
- Formulaires GoCanvas ou Typeform [P59].
- **Rappels envoyés gratuitement par la ville** [P25, P27].

**Plaintes publiques :**
- un avis Capterra sur Syncta [P42] ;
- **aucune sur Reddit, PlumbingZone ou les forums** (4 recherches dédiées) [P41] ;
- aucune opposition de testeurs aux frais de portail trouvée dans les comptes rendus de conseils municipaux. Seul Des Plaines traite les frais comme une hausse de redevance [P52].

## 5. Différenciation

**Wedge possible : « Saisissez une fois, déposez partout ».**
1. **Une bibliothèque de formulaires et de règles par district** : PDF officiel pré-rempli, destinataire, délai, frais, credentials requis. Aucun produit de ce type n'a été trouvé [OBS recherche P58 ; absence ≠ preuve].
2. **Un copilote de dépôt** : extension navigateur qui pré-remplit BSI, VEPO, SwiftComply ou Syncta à partir du test stocké, le testeur validant et payant lui-même. Faisabilité technique et CGU [INC].
3. **Un coffre de credentials multi-villes** : licence, calibration, enregistrements, avec alertes avant expiration [OBS P02, P35 sur le besoin].
4. **Des rappels clients envoyés avant l'avis de la ville**, avec lien de réservation : capter le client avant qu'il consulte la liste municipale [HYP].

**Time-to-value :** l'import du fichier clients et du premier lot de tests prend une journée [HYP]. Le principal frein à la migration chez Syncta est justement le temps de saisie des clients existants [OBS P42].

**ROI mesurable :**
- minutes de dépôt par test ;
- taux de rejet ;
- taux de rétention des clients d'une année sur l'autre.

**Raison de changer :**
- la bascule d'une ville vers un nouveau portail ;
- l'insatisfaction envers Syncta [P42] ;
- l'expansion vers une nouvelle ville.

**Limite :** sans le copilote (point 2), le produit n'est qu'un énième outil de rapports à 15-50 USD.

## 6. Taille de marché (bottom-up, fourchettes larges)

**Aucun décompte national des testeurs certifiés n'a été trouvé** : 6 recherches ; TCEQ, ABPA, ASSE, NY, WA et CA ne publient pas de total dans les extraits [INC].

**Points d'appui :**
- Californie : 1,5 à 2,5 M d'assemblages testables, selon une estimation d'opinion sans décompte officiel [OBS-faible P37].
- Los Angeles : plus de 51 000 dispositifs et plus de 700 testeurs certifiés, attribution incertaine [OBS-faible P38].
- Une entreprise fait environ 635 tests par an [P39].
- Les villes et États publient des listes de testeurs (NY par comté, WA, nombreuses villes de CA, TX, OH) : un comptage manuel serait possible [OBS P29 à P31].

**Calcul :**

| Étape | Bas | Haut | Étiquette |
|---|---|---|---|
| Assemblages testés par an aux US (CA = 12 à 20 % du total) | 7,5 M | 20 M | [EST] |
| Tests par entreprise et par an (moyenne) | 1 500 | 300 | [HYP] |
| Entreprises qui font du test | ≈ 5 000 | ≈ 65 000 | [EST] |
| Fourchette centrale retenue | 10 000 | 30 000 | [EST] |
| ICP (au moins 300 tests et au moins 3 canaux différents) : 30 à 40 % | 3 000 | 12 000 | [HYP] |
| ARPA | 480 USD/an | 960 USD/an | [HYP] |

**Résultats :**
- **TAM** (toutes entreprises × 600 USD) : **6 à 18 M USD/an** [EST].
- **SAM** (ICP × ARPA) : **1,4 à 11,5 M USD/an** [EST].
- **SOM à 3 ans** (1 à 3 % du SAM, face à Syncta et aux offres à 15-25 USD) : **50 à 300 clients, soit 30 à 250 k USD d'ARR** [EST].

**Conclusion : une niche de revenu complémentaire, pas un business autonome confortable pour 2 à 3 personnes.**

## 7. Pricing

**Recommandé : Solo 39 USD/mois** (1 testeur, tests illimités, bibliothèque de formulaires de 3 districts, rappels) et **Équipe 89 USD/mois** (jusqu'à 5 testeurs, districts illimités, copilote de dépôt). Remise de 2 mois en annuel. Celui qui signe est le patron, en libre-service par carte.

**Alternatives :**
1. **À l'usage** : 0,99 USD par test déposé, minimum 19 USD/mois. Ce modèle colle à la saisonnalité et reste sous les 4,95 USD de Syncta [OBS P09].
2. **Forfait annuel** de 299 USD par testeur, prépayé en hiver. Cela finance la saison et réduit le churn saisonnier.

**Exemple de ROI** (entreprise de 600 tests, offre Équipe) :
- Coût : 89 × 12 = 1 068 USD.
- Gain : 50 h de dépôt économisées × 35 USD = 1 750 USD, plus 15 clients retenus × 100 USD = 1 500 USD, soit **3 250 USD**.
- **ROI d'environ 3× [EST]**, à condition que le copilote fonctionne réellement.

## 8. Intrants du modèle économique

| Intrant | Valeur | Étiquette |
|---|---|---|
| Prix moyen | 40 à 80 USD/mois | [HYP] (calé sur 15 à 99 USD observés) |
| Hébergement (Supabase, stockage PDF) | 1 à 3 USD par client et par mois | [EST] |
| SMS et emails de rappel | moins de 2 USD par client et par mois (environ 600 rappels par an et par client) | [HYP] (tarifs SMS non vérifiés dans cette session) |
| IA / OCR (scan de vieux rapports papier, mapping des PDF) | moins de 1 USD par client et par mois | [HYP] |
| Maintenance de la bibliothèque de districts | 2 à 4 h par semaine, poste fixe et croissant | [EST] — **coût caché principal** |
| Onboarding (import clients et assemblages) | 1 à 3 h par client | [HYP] ; P42 montre la difficulté |
| Support | Pic au printemps ; attente d'un support par téléphone, aux heures US | [HYP] |
| Marge brute | 80 à 88 % | [EST] |
| CAC | 150 à 600 USD (outbound sur listes + appels) | [HYP] |
| Cycle de vente | 1 à 14 jours, en libre-service après démo | [HYP] |
| Churn | 2 à 4 % par mois, avec un pic de fin de saison | [HYP] |
| Payback | 4 à 12 mois | [EST] |

## 9. Risques

- **Dépendance aux portails et CGU** : le copilote de pré-remplissage pourrait violer les conditions de BSI, VEPO, SwiftComply ou Syncta, ou être cassé par un changement d'interface ou un CAPTCHA [INC]. **C'est le risque n°1.**
- **Réaction des éditeurs en place** :
  - Watts/Syncta contrôle les deux côtés et peut baisser son prix testeur ou étendre SynctaOne [OBS P08, P09] ;
  - les portails ajoutent déjà côté testeur la gestion des certifications et des kits (SAMS Seattle) [OBS P19].
- **Responsabilité** : le rapport de test est un document réglementaire signé par le testeur. L'outil ne doit jamais présumer un « pass ». Une erreur de mapping de formulaire peut conduire à un rapport rejeté, voire faux [HYP].
- **Réglementation** :
  - pas de suspension ; tendance au durcissement en Californie (CCCPH en vigueur au 1/7/2024 ; certification ISO 17024 au 1/7/2027) [OBS P34, P35] ;
  - de rares contestations de fond, comme l'article d'opinion « racket » en Californie [OBS P37] ;
  - un risque marginal d'assouplissement local (test tous les 5 ans) [OBS P41].
- **Données** :
  - données personnelles des clients (nom, adresse, téléphone) ;
  - pas de HIPAA ;
  - CCPA pour les clients californiens ;
  - **le RGPD s'applique à une société établie dans l'UE**, même pour des personnes concernées aux US : DPA à prévoir [HYP juridique].
- **Saisonnalité** : revenus et usage concentrés de mars à septembre [HYP].
- **Fiabilité de l'IA** : faible enjeu si l'IA ne sert qu'au mapping de formulaires, avec validation humaine.

## 10. Distribution

**Canal 1 — Outbound sur les listes publiques (le meilleur atout de l'idée).**
- Sources :
  - NY DOH publie les testeurs certifiés comté par comté [OBS P30] ;
  - en CA, BCVWD, Rainbow MWD, San Diego et San Francisco publient des listes, BCVWD avec emails, téléphones, n° de certification et dates d'expiration [OBS P29] ;
  - en WA : Sumner, Oak Harbor, Walla Walla, Lacey [OBS P31] ;
  - Columbus et Tucson [OBS P25].
- On peut constituer une base de plusieurs milliers de testeurs, avec leurs villes de rattachement : **un testeur présent sur plusieurs listes est par définition multi-juridictions**.
- Message : *« Vous déposez à [Ville A] sur BSI, à [Ville B] sur VEPO et à [Ville C] par PDF ? Saisissez le test une fois sur votre téléphone : on remplit le bon formulaire et le bon portail, et votre client reçoit son rappel avant la lettre de la ville. »*

**Canal 2 — Écosystème de formation et de certification.**
- Formateurs BPAT (TEEX, ICC) [OBS P32 sur leur existence].
- Chapitres ABPA : conférence de mai 2026 à Las Vegas, une trentaine d'exposants [OBS P53].
- Laboratoires de calibration de jauges [HYP].
- Contenu SEO « backflow test form [ville] » : chaque district de la bibliothèque devient une page [HYP].

**10 conversations d'acheteurs :**
1. Extraire 300 testeurs présents sur au moins 2 listes de la même région (par exemple CA Inland Empire).
2. Envoyer un email court, puis appeler entre 15 h et 23 h, heure de Paris, de novembre à février.
3. Proposer « 20 minutes sur vos dépôts, bon d'achat de 50 USD ».
4. Objectif : 10 à 15 appels pour 300 contacts [HYP].

**Premières ventes sans audience :**
- prévente annuelle (299 USD) aux testeurs interviewés, avec leurs 3 districts configurés à la main ;
- s'appuyer ensuite sur le bouche-à-oreille entre testeurs d'une même zone [HYP].

**Faisabilité pour un fondateur non-US : moyenne-faible.**
- Atouts : libre-service, petits montants, listes publiques, aucune visite terrain nécessaire.
- Obstacles :
  - population de métiers manuels, peu en ligne, habituée au téléphone ;
  - décalage horaire ;
  - confiance (société étrangère, données clients) ;
  - entité US et numéro US nécessaires ;
  - saison qui laisse 4 mois par an pour vendre ;
  - la connaissance fine des règles locales doit s'acquérir à distance, district par district.

## 11. Faisabilité

**MVP (8 à 12 semaines pour 1 développeur [EST]) :**
- PWA mobile hors ligne : saisie de test par type d'assemblage (RP, DC, PVB, SVB), signature, photos.
- Base clients, assemblages et historique.
- Coffre de credentials (licences, calibrations, enregistrements, alertes).
- Moteur de PDF qui remplit les formulaires officiels : mapping des champs, éventuellement assisté par LLM puis vérifié à la main.
- Rappels email et SMS avec réservation.
- Facturation Stripe.
- Import CSV ou Excel.

**Phase 2 :** extension navigateur de pré-remplissage des portails.

**Intégrations indispensables :**
- Formulaires PDF de 20 à 50 districts d'une région pilote : 3 à 4 semaines [EST].
- Portails BSI, VEPO et SwiftComply via l'extension [INC sur la faisabilité et les CGU].
- Aucune API publique côté testeur [OBS P62]. Le seul import de fichiers trouvé est côté utility (Springbrook) [OBS P49] : c'est un partenariat possible, mais sur un cycle de vente public.

**Briques Relanzio réutilisables :**
- moteur de relance (Brevo) ;
- Supabase et Stripe ;
- génération de PDF.

**Partie difficile :**
- maintenir la bibliothèque de centaines de districts qui changent (Longmont, Seattle et Mesa ont changé en 2026) ;
- rendre l'automatisation des portails robuste et licite.

**Coût :** 15 à 40 k€ de temps de développement pour le MVP et la région pilote [EST].

**Dépendances critiques :** les interfaces et les CGU des portails tiers.

## 12. Défendabilité à 2 ans

**Ce qui protège un peu :**
- la bibliothèque de districts maintenue, qui est un actif de données ;
- l'historique des assemblages et des clients du testeur, qui crée un coût de changement réel [OBS P42 : migrer est pénible] ;
- l'effet réseau local (testeurs d'une même zone).

**Ce qui commoditise :**
- **les LLM rendent le mapping de PDF trivial pour tous les concurrents** ;
- Syncta peut étendre SynctaOne ou baisser ses prix ;
- les portails ajoutent des espaces testeurs gratuits (SAMS) [OBS P19] ;
- les FSM (QuoteIQ, Jobber) peuvent ajouter un formulaire backflow ;
- chaque migration d'une ville vers un portail unique réduit la valeur de la bibliothèque PDF.

**Pourquoi le client resterait :** ses données, ses rappels et l'habitude. Ce verrouillage est faible face à des alternatives à 15 USD.

## 13. Raisons de NE PAS le faire, et expériences d'invalidation

**Raisons de ne pas le faire :**
1. **Les portails imposent la ressaisie, sans API** : le cœur de la douleur est hors de portée d'une app testeur sans automatisation risquée [P04, P05, P62].
2. **Watts/Syncta est déjà intégré des deux côtés**, à un prix testeur plancher [P08, P09].
3. **Des concurrents à 10-50 USD/mois** fixent un prix bas [P43 à P47].
4. **Les villes relancent elles-mêmes** les propriétaires [P25, P27, P28].
5. **Aucune plainte publique** ni preuve de volonté de payer davantage [P41].
6. **Le SAM est petit** (1,4 à 11,5 M USD) et la distribution exige du téléphone aux heures US, sur 4 mois utiles.

**Expériences (à faire avant toute ligne de code, environ 3 semaines) :**
1. **30 appels** à des testeurs présents sur au moins 2 listes publiques.
   - **Tuer l'idée** si moins de 40 % déposent dans au moins 3 canaux différents, ou si plus de 60 % se disent satisfaits de Syncta, R2 ou C3.
2. **Vérifier les CGU** de BSI Online, VEPO, SwiftComply et Syncta, et tester sur un compte le pré-remplissage navigateur (formulaires, CAPTCHA).
   - **Tuer le wedge** si c'est interdit ou bloqué.
3. **Landing page et 300 emails** sur une région.
   - **Tuer** si moins de 3 % de réponses positives ou moins de 5 démos.
4. **Prévente** : 10 paiements annuels de 299 USD avant le 1/3/2027.
   - **Tuer** si moins de 5 paiements.

## 14. Re-notation

Phase 1 : notes brutes de `scores-bruts.csv` (6, 8, 6, 7, 5, 9, 8, 3, 6, 8), soit un total pondéré de 66. B-top affichait 69 ; l'écart vient d'un arrondi des points dans B-top.

| Critère (poids) | Phase 1 (0-10) | Phase 2 (0-10) | Points | Cause du changement |
|---|---|---|---|---|
| Douleur et budget (20) | 6 | 5 | 10 | Douleur confirmée par sources officielles [P13, P15 à P17, P24], mais elle est surtout imposée par les portails, que l'app ne supprime pas [P04, P05] ; les testeurs répercutent les frais sur le client [P22] ; ROI capturable de 2 à 4 k USD par an |
| Fréquence (10) | 8 | 8 | 8 | Inchangée : test annuel [P60], dépôt quotidien en saison |
| Preuves (15) | 6 | 5 | 7,5 | Workflow très bien documenté ; volonté de payer seulement indirecte (abonnements concurrents) ; aucune voix de testeur sauf un avis Syncta [P41, P42] |
| Distribution (15) | 7 | 5,5 | 8,25 | Listes publiques confirmées, avec emails [P29 à P31] (+) ; mais vente par téléphone aux heures US, saison courte, confiance envers une société étrangère (−) |
| Lacune (10) | 5 | 3 | 3 | Syncta à double face, R2, C3, QuoteIQ, BackflowBoss, apps iOS, portails gratuits côté testeur, rappels des villes [P08, P09, P19, P25, P43 à P48] |
| Faisabilité (10) | 9 | 6 | 6 | Le CRUD est simple, mais la valeur exige une bibliothèque multi-districts maintenue et une automatisation des portails sans API [P62] |
| Marge (5) | 8 | 8 | 4 | COGS faibles ; maintenance de la bibliothèque en coût fixe |
| Timing (5) | 3 | 4 | 2 | Légère hausse : CCCPH Californie [P34], transition de certification au 1/7/2027 [P35], migrations de portails en 2026 [P18 à P20], qui sont des déclencheurs de changement d'outil |
| Défendabilité (5) | 6 | 3 | 1,5 | Mapping de PDF commoditisé par les LLM ; Watts et les portails peuvent absorber la fonction |
| Risques (5) | 8 | 5 | 2,5 | CGU et fragilité des portails, dépendance aux plateformes tierces, réaction de Watts, RGPD pour un éditeur UE |
| **Total** | **66** (B-top : 69) | — | **52,75 ≈ 53** | |

**Confiance : moyenne.**
- Faits de workflow et de prix : nombreux, primaires (pages des villes), mais lus en extrait.
- Taille de marché : faible (aucun décompte national).
- Volonté de payer : faible (aucun entretien).
