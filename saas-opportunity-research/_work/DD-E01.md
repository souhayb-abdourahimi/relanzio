# DD-E01 — Questionnaires de sécurité fournisseurs pour éditeurs SaaS B2B de 5 à 50 personnes sans SOC 2/ISO 27001 (UE + US) — Due diligence phase 2

Date : 2026-10-29. Finaliste de remplacement E-01, fusionné avec E-02 (kit fournisseur NIS2). Phase 1 : **67/100** dans E-top.md. La ligne de `scores-bruts.csv` donne 8/7/6/6/4/7/8/7/6/7, soit environ 66 ; l'écart vient de l'arrondi des points. Les deux versions sont rappelées au §14.
Méthode : 40 recherches WebSearch, dont environ 15 (≈ 37 %) visaient l'invalidation : offres gratuites, outils à bas prix, fonctions déjà intégrées par Vanta et Drata, SOC 2 comme véritable bloqueur, LLM généralistes, substituts gratuits (CSA STAR), retard NIS2 en France.
**WebFetch est bloqué** : l'essai sur conveyor.com a échoué (ENOTFOUND). Toutes les preuves viennent donc d'**extraits de recherche**, et aucune page tarifaire n'a été ouverte. Les prix sont ceux des extraits, souvent rapportés par des tiers ou par des concurrents (Wolfia, Sprinto), qui ont intérêt à les présenter d'une certaine façon.
Preuves : `DD-E01-preuves.csv` (P01 à P50 : 21 POUR, 19 CONTRE, 10 NEUTRE). Concurrents : `DD-E01-concurrents.csv` (30 lignes).
Étiquettes : **[O]** fait observé (extrait sourcé) · **[E]** estimation · **[H]** hypothèse · **[I]** inconnu.

---

## 0. Ce que la phase 2 change (synthèse)

1. **La lacune « pas cher pour les petits » est en grande partie comblée.**
   - Offres gratuites :
     - Conveyor : trust portal gratuit à vie, sans automatisation des questionnaires (P02).
     - TrustCloud : « Free Forever » pour les entreprises de moins de 20 salariés, avec pré-remplissage IA (P09, P10).
     - SecurityPal : trust center gratuit (P11).
     - CSA STAR Level 1 : CAIQ publié gratuitement au registre public (P25).
   - Outils libre-service à bas prix : 29 USD/mois (Questionnaire Mapper, P20), 99 USD/mois (Replex, P21), 99 USD une fois (Reuse Kit, P22).
   - Orbiq occupe déjà le créneau « UE, NIS2/DORA, hébergé UE, 299 EUR/mois, free tier » (P23).
2. **Les éditeurs en place ont déjà réagi.**
   - Drata a annoncé le rachat de SafeBase en février 2025 (P03) et lancé un agent de réponse aux questionnaires en bêta en mars 2026 (P30).
   - Vanta a lancé son AI Agent en juin 2025 (P29) et inclut 25 questionnaires par an dans son plan startups (P05).
3. **Le vrai bloqueur de l'ICP est souvent le SOC 2, pas le questionnaire.** Plusieurs sources indiquent qu'un questionnaire bien rempli ne débloque pas un acheteur qui exige un rapport (P31, P50). Un outil de questionnaire n'enlève donc pas le blocage le plus coûteux.
4. **Le volume est modeste pour moins de 50 personnes.**
   - Fourchette observée : « quelques-uns par mois » (P16) à 3 à 5 par mois (P15) [O, témoignages faibles].
   - Le chiffre de 50 par an vient d'une hypothèse de ROI fournie par un vendeur (P08).
   - Avec un tel volume, une bibliothèque tenue dans un tableur suffit souvent (P16).
5. **Le catalyseur UE est réel mais indirect.**
   - NIS2 en Allemagne : plus de 19 000 entités enregistrées au 31/07/2026 (P34).
   - DORA : registre d'information déposé depuis avril 2025 (P37).
   - Ces obligations pèsent sur les clients, pas sur l'éditeur. Elles produisent des questionnaires **en plus** des demandes SOC 2/ISO, et non à leur place (P38, P39).
   - En France, NIS2 n'est toujours pas transposée (P36 ; phase 1 : texte retiré de l'ordre du jour de l'AN les 7 et 9 oct. 2026).

**Note révisée : 51,5/100** (contre 67). Le détail est au §14.

---

## 1. ICP, acteurs, contexte d'achat

- **ICP** : éditeur SaaS B2B de 5 à 50 personnes, sans RSSI, sans SOC 2 ni ISO 27001, qui vend à des ETI ou à des grands comptes. Les clients prioritaires sont les entités NIS2 en Allemagne et les entités financières soumises à DORA. Cet éditeur reçoit au moins 1 à 2 questionnaires par mois [H : seuil à valider]. Le sous-segment le plus exposé est l'éditeur vertical qui vend à des banques, des assureurs ou des fintechs : DORA y produit des questionnaires et des annexes contractuelles (P38, P39) [E].
- **Utilisateur** : le CTO ou le fondateur technique, parfois l'ingénieur qui opère l'infrastructure (P16, P45) [O].
- **Prescripteurs** : le commercial ou l'AE qui voit le deal bloqué ; le vCISO à temps partiel ; l'auditeur ou cabinet SOC 2/ISO qui prépare la certification ; la plateforme GRC si l'éditeur en adopte une [H].
- **Décideur économique** : le CEO ou le fondateur. Le CEO ou le CTO signe les réponses, qui deviennent des engagements contractuels (P16) [O].
- **Sponsor** : le responsable commercial, après un deal ralenti ou perdu en revue de sécurité (P32) [O, anecdotique].
- **Objections attendues** :
  1. « Il me faut le SOC 2, pas un outil » (P31, P50).
  2. « Le free tier de TrustCloud, Conveyor ou SecurityPal me suffit » (P02, P10, P11).
  3. « ChatGPT ou Claude avec mes docs le fait déjà » (substitut ; voir P27 pour ses limites).
  4. « Je prendrai Vanta ou Drata pour le SOC 2 et j'aurai les questionnaires inclus » (P05, P30).
  5. « J'en ai 10 par an, mon Google Doc suffit » (P16).
  6. « Je ne confie pas ma PSSI et mon pentest à un inconnu » [H].
- **Contexte d'achat** :
  - achat par carte bancaire, sans appel d'offres ;
  - déclenché par un questionnaire en cours avec une date limite, donc dans l'urgence [H] ;
  - le besoin disparaît, ou passe dans la suite GRC, dès que l'éditeur obtient le SOC 2 [E], d'où une durée de vie client courte.

## 2. Job-to-be-Done et workflow actuel

**JTBD** : « Quand un prospect grand compte m'envoie un questionnaire de 100 à 300 lignes, je veux répondre vite, de façon cohérente avec mes réponses précédentes et sans m'engager sur des contrôles que je n'ai pas, pour que le deal ne sorte pas du trimestre. »

Workflow actuel (P12, P14, P15, P45) [O, témoignages] :
1. Le commercial reçoit un Excel (SIG Lite, CAIQ, questionnaire maison, annexe NIS2/DORA) ou une invitation à un portail (OneTrust, Whistic, Archer…) [portails : H].
2. Il le transfère au CTO, souvent en fin de cycle (P45).
3. Le CTO cherche un ancien questionnaire similaire et copie-colle les réponses (Google Docs, Excel).
4. Il cherche les preuves (PSSI, politique d'accès, sauvegarde, plan de réponse à incident, sous-traitants, pentest) ; il les rédige s'il ne les a pas (P35, P48).
5. Les questions nouvelles demandent une recherche ou une décision (« avons-nous du MFA partout ? »).
6. Le CEO ou le CTO relit, car les réponses engagent la société (P16, P33).
7. Envoi, puis questions de relance de l'acheteur, puis demande de pièces (rapport SOC 2 absent → contrôles compensatoires, lettre de vCISO, pentest).

**Pourquoi c'est douloureux** :
- le temps d'une personne rare, le CTO, est pris ;
- des réponses incohérentes d'un deal à l'autre créent un risque contractuel (P33) ;
- le deal est retardé ;
- le contenu est ennuyeux et souvent peu lu par l'acheteur (P13).

**Fréquence** :
- 3 à 5 par mois pour de petites équipes SaaS B2B, 40+ en montant en gamme (P15, témoignage unique, faible) ;
- « quelques-uns par mois » (P16) ;
- 50 à 200+ par an selon un vendeur (P17) ;
- 50 par an selon l'hypothèse ROI de Wolfia (P08).
- **Estimation retenue pour l'ICP : 10 à 40 par an [E]**, très inégale d'un éditeur à l'autre (fonction du nombre de deals grands comptes).

## 3. Coût de l'inaction

Formule : **C = N × h × c + p × V**
- N = questionnaires par an ; h = heures par questionnaire ; c = coût horaire chargé du CTO ou du fondateur ;
- p = probabilité additionnelle de perdre ou de décaler un deal à cause de la lenteur ou de l'incohérence ; V = valeur annuelle du deal.

| Variable | Valeur basse / médiane / haute | Statut |
|---|---|---|
| N | 10 / 20 / 40 | [E] d'après P15, P16, P17 |
| h (sans outil) | 5 / 10 / 20 h | [E] fourchette vendeur 10-20 h (P18), 2-3 jours (P14), SIG ~15 h (P15) |
| h (avec bibliothèque) | 2 / 3 / 5 h | [E] cas vendeur 10 h → < 2 h (P08) ; les questions nouvelles restent manuelles |
| c | 60 / 90 / 120 EUR/h | [H] coût chargé d'un CTO de startup en UE |
| p | 0 / 2 % / 5 % | [H] aucune donnée ; le blocage dur vient surtout de l'absence de SOC 2 (P31), sur laquelle l'outil n'agit pas |
| V | 10 000 / 25 000 / 60 000 EUR ACV | [H] |

- **Temps seul, cas médian** : 20 × 10 h × 90 EUR = **18 000 EUR/an**.
- **Économie réaliste avec un outil** (10 → 3 h) : 20 × 7 × 90 = **12 600 EUR/an** [E].
- **Cas bas** : 10 × (5 − 2) × 60 = **1 800 EUR/an** [E]. Une grande partie de l'ICP est dans ce cas, et les offres gratuites y suffisent.
- **Composante deal** (cas médian) : 2 % × 25 000 = 500 EUR par deal exposé [H]. Elle est faible, sauf si l'outil aide aussi à présenter des contrôles compensatoires crédibles.

## 4. Concurrents, substituts (détail et sources : DD-E01-concurrents.csv)

| Acteur | Type | Prix observé | Limite pour l'ICP | Statut |
|---|---|---|---|---|
| Conveyor | direct | Free 0 USD (trust portal, **sans** questionnaires) ; Business dès 9 600 USD/an | Cher dès qu'on automatise ; crédits | VÉRIFIÉ-extrait (P01, P02) |
| SafeBase (Drata) | direct | 5 000-30 000 USD/an, médiane 12 000 (Vendr) | Enterprise ; désormais intégré à Drata | VÉRIFIÉ-extrait (P03, P04) |
| Vanta | direct | Non publié ; ~20 000 USD/an moyen (Vendr via concurrent) ; plan startups avec 25 questionnaires/an | Cher ; mais le questionnaire est **inclus** dans la suite que l'ICP achètera pour son SOC 2 | PARTIEL (P05, P06, P29) |
| Drata | direct | Non publié (~7 500-15 000 USD/an estimé en phase 1) | Agent questionnaire en bêta | PARTIEL (P30) |
| Secureframe / Sprinto | direct | ~5 000-10 000 USD/an estimé ; questionnaires dans le plan supérieur (Secureframe) | Achat lié au SOC 2 | PARTIEL (P46) |
| HyperComply | direct | 500 USD/mois (Capterra) ; médiane 10 200 USD/an (Vendr) | Au questionnaire, avec relecteurs humains | VÉRIFIÉ-extrait (P07) |
| Loopio / Responsive | indirect | Loopio dès 20 000 USD/an ; Responsive non publié | Outils RFP | VÉRIFIÉ-extrait / PARTIEL (P41) |
| Whistic | indirect | 11 625-35 000 USD/an (Vendr) | Côté acheteur | VÉRIFIÉ-extrait (P47) |
| Vendict, Skypher, Inventive AI, Wolfia, Scytale, Procurize | direct/indirect | Sur devis ou contradictoire ; Inventive « Free » selon un tiers | Mid-market | INCONNU / PARTIEL |
| **TrustCloud** | direct | **Gratuit < 20 salariés** ; payant ~6 000 USD/an ou 400 USD/mois selon les sources | Questionnaire IA jugé moins avancé que Conveyor par un tiers | VÉRIFIÉ-extrait (P09, P10) |
| **SecurityPal** | direct | **Trust center gratuit** (early-stage) ; premium sur devis | Le gratuit est un trust center ; la réponse aux questionnaires est payante | VÉRIFIÉ-extrait (P11) |
| **Orbiq (UE)** | direct | **299 EUR/mois**, free tier annoncé, hébergé UE, NIS2/DORA | Occupe déjà le wedge UE | PARTIEL (P23) |
| Replex / Questionnaire Mapper / Reuse Kit | direct/substitut | 99 USD/mois ; 29-99 USD/mois ; 99 USD une fois | Petits acteurs, demande non prouvée | VÉRIFIÉ-extrait (P20-P22) |
| CSA STAR Level 1 | substitut | **Gratuit** | Seulement le CAIQ ; peu d'acheteurs l'acceptent à la place de leur propre questionnaire [H] | VÉRIFIÉ-extrait (P25) |
| ChatGPT / Claude + documents | substitut | Abonnement grand public (prix non vérifié ici) | Pas de citations ni de traçabilité ; hallucinations (P27, P28) | INCONNU |
| Excel / Google Docs | substitut | 0 | Statu quo ; suffisant à faible volume (P16) | VÉRIFIÉ-extrait |
| Tensoria (FR) | indirect | Sur mesure, inconnu | Prestation | INCONNU |
| SOC 2 lui-même | substitut de fond | 15 000-50 000 USD, 3-9 mois (P50) | Résout le vrai bloqueur ; il amène ensuite Vanta ou Drata, questionnaires inclus | PARTIEL |

**Plaintes observées** :
- prix et crédits chez Conveyor (phase 1, guptadeepak) ;
- hausse au renouvellement de 40 à 100 % chez Vanta (phase 1, compliancerated) ;
- « les outils existants visent le mauvais acheteur » (P15, un seul témoignage).

**Lecture** : il n'y a pas de trou « rien d'abordable pour les petits ». L'espace libre restant est **étroit** : un outil francophone ou germanophone, qui produit des annexes NIS2/DORA fournisseur et des **contrôles compensatoires** quand on n'a pas de SOC 2. Orbiq vise déjà le même espace en Allemagne.

## 5. Différenciation possible (wedge)

- **Wedge le plus défendable trouvé** : « dossier de sécurité fournisseur sans SOC 2 » pour éditeurs SaaS FR/DE qui vendent à des entités DORA/NIS2. Il comprend :
  1. un questionnaire de diagnostic de 30 minutes qui produit une bibliothèque de 150 à 300 réponses **vérifiées par l'éditeur**, avec le niveau de preuve de chaque réponse (« oui, preuve X », « partiel, plan Y », « non ») ;
  2. un pack de politiques minimales rédigées à partir de la réalité de l'éditeur (PSSI courte, accès, sauvegarde, incident, sous-traitants) ;
  3. un remplissage du fichier Excel **du client** qui conserve son format ;
  4. des correspondances prêtes vers les annexes DORA art. 30 et NIS2 art. 21 ;
  5. une trust page.
- **Time-to-value visé** : premier questionnaire rendu en moins de 48 h [H].
- **ROI mesurable** : heures par questionnaire avant et après ; part de réponses réutilisées ; délai de retour à l'acheteur.
- **Raison de changer** : le français et l'allemand, les annexes DORA/NIS2 et un prix public inférieur à 100 EUR/mois.
- **Faiblesse** : chacun de ces éléments est reproductible en quelques semaines par Orbiq, TrustCloud ou Vanta. La « réponse honnête sans SOC 2 » est aussi décrite dans des guides gratuits (P48).

## 6. Taille de marché (bottom-up)

| Brique | Valeur | Statut |
|---|---|---|
| Éditeurs de logiciels de 11 à 50 salariés (monde, une base de prospection) | 85 000+ | [O] P44, revendication d'un vendeur, sans ventilation géographique |
| Ajout des 5-10 salariés | × 1,3 à 1,6 | [H] |
| Part vendant à des grands comptes ou à des entités régulées et recevant ≥ 6 questionnaires/an | 25 à 40 % | [H] |
| Part sans SOC 2/ISO (donc hors suites GRC) | 50 à 70 % | [H] |
| Part UE + US | ~70 % | [H] |
| **Acheteurs potentiels (TAM en nombre)** | 85 000 × 1,45 × 0,32 × 0,6 × 0,7 ≈ **16 500** (fourchette 8 000-30 000) | [E] |
| Prix moyen | 600 à 1 500 EUR/an | [H], plafonné par les offres gratuites et les outils à 29-99 USD |
| **TAM** | ≈ 5 à 45 M EUR/an | [E] |
| **SAM** (FR + DE + Benelux + vente en anglais à l'UE ; les US sont exclus en pratique pour un fondateur FR sans présence, voir §10) | 3 000 à 7 000 éditeurs × 600-1 200 EUR ≈ **2 à 8 M EUR/an** | [E] |
| **SOM à 3 ans** | 1 à 3 % du SAM, soit 60 à 200 clients × ~900 EUR ≈ **55 à 180 k EUR d'ARR** | [E] |

Aucun TAM de cabinet n'a été retenu. Le SOM est compatible avec un revenu de solo, mais il n'est pas protégé.

## 7. Pricing recommandé et alternatives

- **Recommandé : abonnement « Dossier fournisseur »**. Solo à **59 EUR/mois** (1 utilisateur, bibliothèque, 3 questionnaires/mois, trust page). Équipe à **149 EUR/mois** (illimité raisonnable, annexes DORA/NIS2, export, multi-langue). Facturation annuelle avec 2 mois offerts. Signé par le CEO ou le fondateur, par carte bancaire [H].
- **Alternative 1 : au questionnaire**, 79 à 149 EUR par questionnaire rendu (bibliothèque gratuite). Ce modèle colle au volume irrégulier et réduit l'objection « j'en ai 10 par an » [H].
- **Alternative 2 : concierge hybride** (IA + relecture humaine), 300 à 600 EUR par questionnaire ou forfait d'amorçage de 990 EUR (pack de politiques + bibliothèque initiale). Meilleure marge par client, mais c'est un service, peu scalable, avec une responsabilité accrue [H : le chiffre « 300-600 USD par questionnaire » d'un billet dev.to est une simulation, non retenu comme preuve].
- **Exemple de ROI** (cas médian) : 20 questionnaires/an × 7 h économisées × 90 EUR = 12 600 EUR, contre 149 × 12 = 1 788 EUR, soit **un ROI d'environ 7×** [E/H]. Au cas bas (10 × 3 h × 60 EUR = 1 800 EUR), le ROI tombe à environ 1× au prix Équipe et à 2,5× au prix Solo. L'offre gratuite de TrustCloud concurrence alors directement.

## 8. Intrants du modèle économique

| Intrant | Valeur | Statut |
|---|---|---|
| ARPA | 60 à 120 EUR/mois | [H] |
| COGS IA | 200 lignes × (~3 000 tokens de contexte RAG + 300 en sortie) ≈ 0,7 M tokens par questionnaire, soit 1 à 5 USD avec un modèle intermédiaire, 3 à 15 USD/mois/client | [E] calcul ; tarifs de modèles non vérifiés dans cette DD |
| Hébergement | Supabase + stockage chiffré + workers : 50 à 150 EUR/mois au total au début | [E] |
| Support et onboarding | 1 à 2 h par client au démarrage (import des anciens questionnaires, revue des réponses « non ») | [H] ; le démarrage à froid est réel (Conveyor conseille ~400 paires Q/R, P49) |
| Marge brute | 75 à 85 % hors onboarding humain | [E] |
| CAC | 300 à 1 000 EUR (contenu FR/DE + outbound) ; > 1 000 EUR aux US depuis la France | [H] ; la SERP anglaise est saturée de contenus Wolfia, Orbiq, Procurize (constat sur les résultats) |
| Cycle de vente | 1 à 14 jours si un questionnaire est en cours ; sinon pas d'achat | [H] |
| Churn | 4 à 7 %/mois : volume irrégulier, puis départ vers Vanta ou Drata une fois le SOC 2 lancé | [H] |
| Durée de vie | 15 à 25 mois | [E], dérivée du churn |
| LTV | ~90 EUR × 0,8 × 20 ≈ 1 450 EUR | [E] |
| Payback | 4 à 12 mois | [E] |
| LTV/CAC | 1,5 à 5 | [E], fragile |

## 9. Risques

- **Sécurité** : l'outil stocke la PSSI, les rapports de pentest, l'architecture et la liste des sous-traitants de dizaines d'éditeurs. C'est une cible, et l'outil lui-même recevra des questionnaires de sécurité. Un solo devra être exemplaire : chiffrement, hébergement UE, journalisation, et idéalement une certification à terme [E].
- **RGPD** : peu de données personnelles, mais des documents confidentiels. Il faut un DPA et des sous-traitants IA (OpenAI, Anthropic, Mistral) avec option « UE uniquement ». Orbiq met en avant la souveraineté et le CLOUD Act contre SafeBase (P23) : l'argument « hébergé UE » est donc déjà utilisé.
- **Responsabilité** : les réponses deviennent des engagements contractuels. Une réponse fausse peut annuler une indemnisation ou fonder une action, voire une action pour fraude si elle est délibérée (P33, source vendeur). L'outil doit :
  - ne jamais répondre « oui » sans réponse validée ;
  - marquer « à valider » toute génération ;
  - garder une trace de qui a validé quoi.
  Les CGU doivent placer la responsabilité chez l'éditeur client [E]. Le risque de réputation persiste. P28 confirme qu'on ne peut pas exclure les hallucinations même avec des documents.
- **Réglementation** :
  - NIS2 en Allemagne : en vigueur, plus de 19 000 entités enregistrées (P34). L'estimation de 29 500 est en cours de révision à la baisse possible [O].
  - NIS2 en France : non transposée (P36) [O].
  - DORA : en vigueur, registre annuel (P37), troisième cycle en 2027.
  - Aucune suspension n'a été trouvée, mais la demande est **indirecte** (P38).
- **Intégrations** : les portails acheteurs (OneTrust, Whistic, Archer, Coupa, SAP Ariba) n'ont pas d'API ouverte aux fournisseurs [H]. Il faudrait une extension navigateur, ce qui est fragile. Le parsing des Excel aux formats hétérogènes (cellules fusionnées, listes déroulantes) est le vrai travail.
- **Fiabilité IA** : le risque de réponse plausible mais fausse est le risque central (P27, P28).
- **Dépendance plateforme** : faible (API LLM interchangeables).
- **Réaction des éditeurs en place** : **déjà observée**.
  - Vanta : AI Agent (P29).
  - Drata : agent en bêta et rachat de SafeBase (P30, P03).
  - Gratuité chez TrustCloud, Conveyor et SecurityPal (P02, P10, P11).
  - Un nouveau venu bon marché sera vite copié, ou rendu gratuit dans une offre d'appel.

## 10. Distribution

- **Canal 1 : outbound ciblé FR/DE** vers les CTO et CEO d'éditeurs SaaS de 5 à 50 personnes qui vendent à la banque et à l'assurance (DORA) ou à l'industrie et à l'énergie (NIS2 DE).
  - Sources de prospects [H, non vérifiées ici] : annuaires d'écosystèmes (French Tech, Numeum, France FinTech, Bitkom), pages « clients » des éditeurs qui citent des banques, offres d'emploi « security questionnaire » ou « RSSI à temps partiel ».
  - Message : « Votre prochain questionnaire de sécurité (DORA, NIS2, SIG) rendu en 48 h, sans SOC 2 : chaque réponse est tirée de votre réalité, avec le niveau de preuve, en français ou en allemand. 59 EUR/mois. »
- **Canal 2 : partenaires prescripteurs** : vCISO à temps partiel, cabinets ISO 27001 en phase de préparation, cabinets d'avocats IT qui rédigent les annexes DORA.
  - Le partenaire revend ou utilise l'outil pour plusieurs clients [H].
  - Risque : les cabinets SOC 2/ISO préfèrent vendre la certification.
- **Canal 3 (secondaire)** : contenu SEO FR/DE sur des requêtes longues (« questionnaire DORA fournisseur modèle », « annexe NIS2 sous-traitant »). En anglais, la SERP est saturée.
- **10 conversations d'acheteurs** :
  1. poster sur Indie Hackers, r/SaaS et HN des demandes d'entretien sur le volume réel de questionnaires (le fil IH, P15, montre que le sujet suscite des réponses) ;
  2. envoyer 100 messages LinkedIn à des CTO d'éditeurs FR qui vendent à des banques ;
  3. proposer de remplir gratuitement le prochain questionnaire en échange d'un entretien (concierge).
- **Premières ventes sans audience** : concierge payant (99 à 149 EUR le questionnaire) chez 5 à 10 éditeurs, puis passage à l'abonnement quand la bibliothèque existe.
- **Vendre aux US depuis la France** : peu crédible au départ. Il faudrait affronter Vanta, Drata et les acteurs gratuits sur leur terrain, avec un CAC élevé et des fuseaux décalés [E]. Le marché accessible est l'UE.
- **Listes publiques de prospects** :
  - il n'existe pas de liste publique « éditeurs SaaS sans SOC 2 » [I] ;
  - les registres NIS2 (BSI) listent les **clients** (les entités régulées), pas les fournisseurs, et ne sont pas publics à notre connaissance [I] ;
  - le registre CSA STAR (P25) liste des fournisseurs ayant publié un CAIQ, donc plutôt des éditeurs déjà outillés [O/H].

## 11. Faisabilité

- **Architecture MVP** :
  - Node + Supabase (Postgres + pgvector + stockage chiffré + RLS) + Stripe + Brevo, une base proche de la stack Relanzio [O, contexte du dépôt] ;
  - import des anciens questionnaires et politiques (xlsx, docx, pdf) ;
  - bibliothèque de réponses canoniques validées ;
  - moteur de correspondance question → réponse canonique (embeddings + LLM), avec score de confiance ;
  - remplissage du fichier Excel d'origine avec son format conservé ;
  - piste d'audit ;
  - trust page statique ;
  - correspondances DORA art. 30 et NIS2 art. 21.
- **Intégrations indispensables** : lecture et écriture xlsx/docx fidèles, export PDF. Pas d'intégration portail en V1.
- **Briques réutilisables** : authentification, facturation Stripe et emails Brevo de la stack existante ; SheetJS ou ExcelJS ; un LLM via API.
- **Partie difficile** :
  1. la réécriture fidèle d'Excel hétérogènes ;
  2. la correspondance fiable avec refus de répondre quand c'est incertain ;
  3. le démarrage à froid (P49) ;
  4. la sécurité de l'outil lui-même ;
  5. les portails acheteurs (V2).
- **Coût et temps** : MVP en 6 à 10 semaines pour un développeur [E]. Coût d'infrastructure inférieur à 150 EUR/mois au départ [E]. Pentest externe souhaitable avant de vendre à des clients DORA : 3 000 à 8 000 EUR [H].
- **Dépendances critiques** : API LLM, qualité du parsing Excel, crédibilité sécurité du fondateur.

## 12. Défendabilité à 2 ans

- **Ce qui sera commoditisé** :
  - la génération de réponses à partir de documents (déjà faite par ChatGPT ou Claude avec des fichiers, P27) ;
  - les trust centers (gratuits, P02, P11) ;
  - l'automatisation intégrée aux suites GRC (P05, P29, P30).
- **Ce qui pourrait retenir le client** : la bibliothèque validée et versionnée, avec les preuves et l'historique « qui a répondu quoi à quel client ». Ce coût de changement est modéré : la bibliothèque est exportable, et un concurrent peut l'importer.
- **Point faible structurel** : le client « gradue ». Dès qu'il lance son SOC 2, il achète Vanta, Drata ou Secureframe, qui incluent les questionnaires. Le produit est donc une **étape transitoire** dans la vie de l'éditeur [E].
- **Défendabilité** : faible. Un léger avantage existe sur les contenus réglementaires FR/DE (annexes DORA/NIS2, ReCyF le jour où il s'appliquera), mais Orbiq le vise déjà.

## 13. Raisons de NE PAS le faire, et expériences d'invalidation

**Raisons de ne pas le faire** :
1. Gratuité et prix plancher déjà atteints : TrustCloud gratuit sous 20 salariés, trust centers gratuits, outils à 29-99 USD (P10, P11, P20-P22).
2. L'ICP sans SOC 2 a surtout besoin du SOC 2, et le jour où il l'obtient, il quitte l'outil (P31, P50).
3. Les éditeurs en place ont livré des agents IA et consolident le marché (P03, P29, P30, P42).
4. Le volume est faible et irrégulier chez moins de 50 personnes, ce qui donne un churn structurel élevé (P16).
5. Un risque de responsabilité et de sécurité disproportionné pour un solo (P33).
6. Un wrapper IA presque par définition : la valeur ajoutée hors LLM tient à la fidélité Excel et à la discipline de validation.
7. Le catalyseur français (NIS2) est bloqué ; le catalyseur DORA vise les clients, pas l'éditeur (P36, P38).

**Expériences qui invalideraient l'idée** (2 à 4 semaines) :
- **E1, volume** : 15 entretiens avec des CTO d'éditeurs FR/DE de 5 à 50 personnes qui vendent à des grands comptes. **Abandon** si la médiane est inférieure à 8 questionnaires par an ou inférieure à 4 h chacun.
- **E2, concurrence gratuite** : demander à ces CTO s'ils connaissent ou utilisent TrustCloud, SecurityPal ou un LLM. **Abandon** si plus de la moitié s'en disent satisfaits.
- **E3, consentement à payer** : offre concierge payante (149 EUR le questionnaire rendu en 48 h). **Abandon** si moins de 3 paiements sur 30 propositions qualifiées.
- **E4, wedge DORA/NIS2** : page FR/DE « Annexe DORA fournisseur prête en 48 h » et 300 visites ciblées. **Abandon** si moins de 3 % laissent leur email.
- **E5, graduation** : dans les entretiens, mesurer la part d'éditeurs qui prévoient un SOC 2 ou un ISO dans les 12 mois. Si elle dépasse 60 %, le produit n'est qu'un pont : il faut le revendre comme « préparation SOC 2/ISO » ou abandonner.

## 14. Re-notation

| Critère (poids) | Phase 1 E-top (points) | Phase 1 scores-bruts (/10) | **Phase 2 (/10)** | **Points** | Cause du changement |
|---|---|---|---|---|---|
| Douleur et budget (20) | 15 | 8 | **6** | 12 | La douleur est confirmée (HN, Reddit, IH, P12-P15). Mais le budget de l'ICP est bas, et le blocage le plus cher (SOC 2) n'est pas résolu par l'outil (P31, P50). |
| Fréquence (10) | 8 | 7 | **6** | 6 | Le volume pour moins de 50 personnes est de quelques questionnaires par mois au mieux, et irrégulier (P15, P16). |
| Preuves (15) | 8 | 6 | **5** | 7,5 | Le marché payant est prouvé, mais en mid-market. Aucune volonté de payer observée chez l'ICP. Témoignages rares, via des miroirs ; preuves surtout issues de vendeurs. |
| Distribution (15) | 9 | 6 | **4** | 6 | SERP anglaise saturée ; US peu accessibles depuis la France ; pas de liste de prospects ; prescripteurs (cabinets SOC 2) en conflit d'intérêt. |
| Lacune (10) | 5 | 4 | **2** | 2 | Gratuité (TrustCloud < 20 salariés, SecurityPal, Conveyor, CSA STAR), outils à 29-99 USD, Orbiq sur le wedge UE à 299 EUR (P02, P10, P11, P20-P23, P25). |
| Faisabilité (10) | 8 | 7 | **8** | 8 | Inchangée : MVP simple sur la stack existante ; parties dures identifiées (Excel, portails). |
| Marge (5) | 4 | 8 | **7** | 3,5 | Les COGS IA restent faibles, mais l'ARPA est bas et le churn élevé. |
| Timing (5) | 4 | 7 | **6** | 3 | NIS2 DE et DORA sont réels (P34, P37) mais indirects ; NIS2 FR bloquée (P36). |
| Défendabilité (5) | 2 | 6 | **2** | 1 | Commoditisation déjà en cours (agents Vanta et Drata) ; graduation des clients. |
| Risques (5) | 4 | 7 | **5** | 2,5 | Responsabilité sur les réponses (P33), stockage de documents sensibles, hallucinations (P28). |
| **Total** | **67** | **≈ 66** | — | **51,5** | |

**Confiance** : moyenne sur la concurrence et les prix (nombreux extraits concordants), faible sur le volume et la volonté de payer (aucun entretien).

**Verdict** : **NO-GO en l'état.** Le problème est réel, mais pour l'ICP visé la lacune est déjà fermée par des offres gratuites, des outils à moins de 100 USD et les agents IA des suites GRC. Seul un pivot très étroit (annexes DORA/NIS2 en FR/DE, sans SOC 2) reste envisageable, et uniquement si E1 à E3 réussissent.
