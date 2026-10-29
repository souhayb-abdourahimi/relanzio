# DD-E13 — Relance automatique des devis non signés (J+2/J+5/J+10) pour indépendants, artisans et TPE de services en France, sans remplacer leur logiciel de devis

Date : 2026-10-29. Phase 2/4 (due diligence indépendante). Note de phase 1 : **61/100** (E-top.md). La ligne de `scores-bruts.csv` (6,9,4,6,3,9,8,3,3,8) donne 60 avec `score.py` : l'écart d'un point vient de la Lacune, du Timing et de la Défendabilité, notés un peu plus haut dans E-top. La référence retenue est la table d'E-top, convertie en notes sur 10.
**Nouvelle note : 52/100. Confiance moyenne-faible.**

**Conflit d'intérêts déclaré.** Cette piste correspond au produit que développe le porteur (Relanzio). Le BUSINESS_PLAN et le README sont traités comme des **affirmations internes**, pas comme des preuves. Le code existant ne donne **aucun bonus** de note. Son seul effet est de réduire le coût marginal du test (§11).

**Méthode.** 42 requêtes WebSearch, dont environ 55 % visaient l'invalidation : fonctionnalité déjà présente chez chaque éditeur, substituts gratuits, prestataires n8n, faible budget numérique, chiffres marketing, réglementation. WebFetch est bloqué (`www.obat.fr` ne se résout pas dans cette session). Toutes les preuves sont donc des **extraits de recherche**, avec pages non ouvertes. Étiquettes utilisées : **[O]** fait observé (`Pxx` = `DD-E13-Pxx`), **[E]** estimation, **[H]** hypothèse, **[I]** inconnu, **[INT]** affirmation interne de Relanzio.

---

## 1. ICP, rôles, contexte d'achat
- **ICP recommandé** (plus étroit que le BP, qui vise « universel ») : artisan du bâtiment ou du second œuvre, de 1 à 10 personnes, en rénovation, plomberie-chauffage, électricité ou menuiserie. Il émet **15 à 50 devis par mois** à un **panier de 1 000 EUR ou plus**. Il fait ses devis sur un logiciel **sans relance automatique de devis** (Tolteck, Obat, EBP Bâtiment, Batappli : aucune relance de devis trouvée, P09-P13) ou sur Word/Excel. Il a une adresse email qu'il consulte. Segment secondaire : petites agences web/marketing et prestataires B2B (photo/vidéo, événementiel) qui envoient des propositions à plus de 2 000 EUR [H].
- **Exclus** : les clients d'Axonaut, de Sellsy, et probablement de Pennylane, qui ont déjà la relance (P01, P02, P04). Exclus aussi les micro-entrepreneurs à 1 ou 2 devis par mois : Word ou Excel leur suffit, selon un éditeur (P41).
- **Utilisateur** : le gérant, ou le conjoint qui gère l'administratif [H].
- **Prescripteurs** : expert-comptable, CAPEB/CMA locales (les éditeurs utilisent déjà ce canal : partenariat CAPEB × Costructor, P14), fournisseurs et négoces, groupes Facebook d'artisans [H].
- **Décideur économique et sponsor** : le gérant, qui paie par carte, sans appel d'offres.
- **Objections attendues** : (1) « je relance déjà au téléphone » [H] ; (2) « mon logiciel le fait » (vrai chez Axonaut et Sellsy, P01-P02) ; (3) « encore un outil, et je dois ressaisir mes devis » (double saisie) [H, risque n° 1] ; (4) « 29 EUR pour une seule fonction, alors que Tolteck coûte 19-25 EUR pour tout » (P40) ; (5) « je ne veux pas que le client se sente harcelé » (Effy recommande de limiter les tentatives, P42) ; (6) « je ne donne pas l'accès à ma boîte mail » [H].
- **Contexte d'achat** : l'activité de l'artisanat du bâtiment recule depuis 8 trimestres (−3,5 % au T3 2025, P28). Il y a moins de chantiers, donc chaque devis compte plus, mais la trésorerie est tendue. Le budget numérique est faible : 27 % des TPE-PME du bâtiment ont investi plus de 1 000 EUR dans le numérique, contre 42 % tous secteurs (P30). La réforme de la facture électronique (2026-2027) pousse les TPE à **choisir ou changer** de logiciel de facturation (P31, P32), ce qui ouvre une fenêtre de réévaluation des outils mais favorise les suites tout-en-un.

## 2. Job-to-be-Done et workflow actuel
**JTBD** : « Après avoir envoyé un devis, savoir lequel relancer, quand et comment, sans y penser, sans paraître insistant, et sans changer mon logiciel de devis. »

Workflow actuel pas à pas [H, sauf mention] :
1. Visite du chantier ou appel, puis chiffrage (45 à 90 min par devis rédigé à la main selon un extrait de webandseo.fr qui attribue ce chiffre à une agence ; fiabilité faible, non repris en preuve).
2. Envoi du devis en PDF par email (ou par lien de signature dans les logiciels qui le proposent).
3. Pas de liste « devis en attente » tenue, ou alors un tri dans le logiciel (Tolteck, P09).
4. Relance téléphonique quand l'artisan y pense, souvent trop tard. Obat recommande lui-même 48-72 h, puis 5-10 jours, puis 2 semaines (P11) ; Effy, 2 à 4 jours ouvrés (P42).
5. Le devis expire ou le client signe ailleurs. Côté particulier, un témoignage décrit un artisan, pourtant le moins cher, qui n'a jamais rappelé (P43).

**Pourquoi c'est douloureux** : chiffre d'affaires perdu sans que personne le voie, oubli lié à la charge du chantier, gêne à relancer. **Fréquence** : hebdomadaire pour l'ICP (10 à 50 devis par mois) [H]. **Faible** pour les micro-entrepreneurs à faible volume (P41).

**Point critique** : la douleur est **invisible**. L'artisan ne connaît ni son taux de transformation ni ce que la relance lui rapporterait. Seule source chiffrée trouvée : CAPEB AURA en **2017**, où seuls 11 % des artisans transforment plus de 70 % de leurs devis (P22). Aucune étude FFB ou CAPEB récente sur la part des devis **sans réponse** n'a été trouvée [I].

## 3. Coût de l'inaction
Formule mensuelle par entreprise :
`Perte = N devis/mois × s (part sans réponse) × r (part supplémentaire gagnée grâce à des relances systématiques, en plus de ce que l'artisan fait déjà) × panier × marge brute + temps de relance manuelle × coût horaire`

| Variable | Bas | Central | Haut | Étiquette |
|---|---|---|---|---|
| N devis/mois | 10 | 20 | 40 | [H] (ICP du BP : 10-80, [INT]) |
| s, part sans réponse | 30 % | 45 % | 60 % | [H], cohérent avec des taux de transformation faibles (P22, 2017) |
| r, gain incrémental de la relance | 2 % | 5 % | 10 % | [H]. Les chiffres d'éditeurs (+75 %, P24) sont du marketing non vérifiable |
| Panier moyen | 800 EUR | 1 500 EUR | 3 000 EUR | [H] (un vendeur ComeUp évoque 1 400 EUR, P18) |
| Marge brute | 25 % | 30 % | 40 % | [H] |
| Temps de relance manuelle | 1 h | 1,5 h | 2 h/mois à 30-45 EUR | [H] |

- Bas : 10 × 0,30 × 0,02 × 800 × 0,25 + 30 = **≈ 42 EUR/mois**
- Central : 20 × 0,45 × 0,05 × 1 500 × 0,30 + 60 = **≈ 263 EUR/mois**
- Haut : 40 × 0,60 × 0,10 × 3 000 × 0,40 + 90 = **≈ 2 970 EUR/mois**

**Lecture** : le **seuil de rentabilité est bas**. Pour un artisan à 10 devis sans réponse par mois, un panier de 2 000 EUR et 30 % de marge, il suffit que r atteigne environ 0,5 % pour couvrir 29 EUR par mois. Le problème n'est donc pas le ROI théorique. C'est que (a) **r n'a jamais été mesuré**, (b) l'artisan ne voit pas le contrefactuel, et (c) il croit déjà relancer. Le premier test doit **mesurer r**.

## 4. Concurrents et substituts (détail : `DD-E13-concurrents.csv`, 28 lignes)
| Acteur | Type | Prix observé | Relance de devis automatique ? |
|---|---|---|---|
| **Axonaut** | direct | 34,99 à 97 EUR HT/mois selon les sources (P32) | **Oui**, jusqu'à signature (P01) |
| **Sellsy** | direct | 39 EUR HT/utilisateur (P32) | **Oui** : plans de relance par client (P02), jugés génériques (P03) |
| **Pennylane** | indirect | inconnu | Scénarios de relance au plan Essentiel ; application aux devis **non confirmée** (P04) |
| **Obat** | indirect | 25-39 EUR HT/mois (P40) | Relances d'**impayés** automatiques ; **devis : non trouvé**, guide de relance manuelle (P10, P11) |
| **Tolteck** | indirect | 19-25 EUR HT/mois (P40) | **Non trouvé** ; tri manuel (P09) |
| **EBP Bâtiment** | indirect | inconnu | Relances de règlements seulement (P12) |
| **Batappli** | indirect | 39 EUR/utilisateur (Appvizer) | Non trouvé ; publipostage en offre Entreprise (P13) |
| **Costructor** | indirect | 0/15/30/300 EUR HT (tiers) | Impayés oui ; devis non trouvé ; partenaire CAPEB (P14) |
| **Extrabat** | indirect | inconnu | « Relances automatiques et prospection » (tiers), non confirmé pour les devis (P47) |
| **Henrri / Abby / Freebe / Qonto / Zervant** | indirect | 0 à 39,90 EUR (P15-P17, P48, P49) | Relances d'**impayés** ; devis non confirmé |
| **Vulko** (nouvel entrant IA BTP) | direct | dès 19 EUR/mois (P20) | « Tableau de bord paiements et relances » |
| **Maitrio** (2026) | indirect | inconnu | Relances de paiement (P21) |
| **Organilog, Hemea, Lemlist** | — | **inconnu** | Aucune donnée trouvée |
| **Jobber** (US) | direct hors FR | 49-249 USD/mois selon les tiers (P06) | **Oui**, dès Connect selon l'aide officielle (P05) |
| **Housecall Pro** (US) | direct hors FR | 59-299 USD/mois (tiers, P50) | Module **Pipeline** payant à part (P07) |
| **Tradify** (AU/UK) | direct hors FR | £21/mois (tiers, ancien) | **Oui** (P08) |
| **HubSpot** | indirect | gratuit sans séquences ; Pro ~90 USD/siège + 1 500 USD (P36) | Seulement en Pro |
| **Pipedrive** | indirect | ~14-24 USD/utilisateur (P37) | Selon le plan [I] |
| **Brevo** | substitut | 0 à 15 EUR/mois (P35) | Bricolable |
| **Gmail nudges / snooze** | substitut | 0 EUR (P38) | Suggestion de relance, sans envoi automatique |
| **Freelances n8n/Make (ComeUp)** | substitut | prix de base non extrait ; maintenance +116 USD/30 j (P18, P19) | Oui, sur mesure |
| **Statu quo** (téléphone, mémoire, tableur) | substitut | 0 EUR | — |

**Conclusion** : la fonction est **banalisée** dans les suites généralistes (Axonaut, Sellsy) et dans le field service anglo-saxon (Jobber, Housecall Pro, Tradify). Une **lacune existe chez les logiciels BTP français** (Obat, Tolteck, EBP, Batappli : absence de preuve, à confirmer par essai gratuit), mais elle est étroite : ces éditeurs pourraient l'ajouter en quelques semaines [H]. Les comparateurs citent déjà la relance automatique comme critère de choix standard (P46).

## 5. Différenciation
- **Wedge** : « la relance de devis pour les artisans qui gardent Tolteck, Obat, EBP ou Word, envoyée depuis votre adresse, avec arrêt automatique dès que le client répond ». Ce n'est pas « universel ».
- **Time-to-value** : il doit être inférieur à 10 minutes : premier devis suivi et première relance programmée. La double saisie le menace directement. Le transfert en copie cachée (BCC) vers une adresse Relanzio ou un import CSV est **indispensable** dès les pilotes [H]. Le BP le place en V2 [INT].
- **ROI mesurable** : le tableau de bord doit afficher « devis relancés → réponses → gagnés après relance » en EUR. Sans cette preuve, le client ne voit pas la valeur (§3).
- **Raison de changer** : ne pas changer de logiciel de devis au moment où la réforme de la facture électronique impose déjà une migration. C'est un argument réel, mais **réversible** : si le logiciel choisi pour la facture électronique fait la relance, Relanzio devient inutile.

## 6. Taille de marché (bottom-up)
- **Base BTP** : 500 000 entreprises artisanales du bâtiment de 1 à 10 salariés selon la CAPEB (P27 ; un autre communiqué de la CAPEB cite 620 000). Environ 50 % n'utiliseraient pas de logiciel professionnel (baromètre CAPEB 2021 cité par Fiducial, P29).
- **Filtre ICP** : au moins 10 devis par mois, email utilisé, pas de relance dans l'outil actuel, appétence numérique, soit 10 à 20 % [H], donc **50 000 à 100 000** entreprises.
- **Services** (agences, consultants, photographes, événementiel) : nombre d'entreprises à 10 propositions par mois ou plus **inconnu** [I]. Hypothèse : 50 000 à 150 000 [H].
- **SAM** : 100 000 à 250 000 comptes × 230 à 350 EUR par an (19 à 29 EUR/mois) ≈ **23 à 87 M EUR/an** [E]. Aucun TAM « cabinet » n'est retenu.
- **SOM à 24 mois pour un solo** : pénétration de 0,05 à 0,2 % du SAM, soit **50 à 500 clients**, soit **14 à 170 k EUR d'ARR** ; central de 100 à 200 clients, soit environ 30 à 60 k EUR d'ARR [E]. L'objectif du BP (500 EUR de MRR, 18 clients [INT]) est atteignable. 10 000 EUR de MRR (345 comptes) se situe en haut de la fourchette, sans canal prouvé.

## 7. Pricing
- **Recommandé** : **24 EUR HT/mois**, ou 19 EUR/mois en annuel, avec 30 jours d'essai et la garantie « remboursé si aucun devis gagné après relance en 60 jours ». Justification : l'ancrage est Tolteck à 19-25 EUR pour **tout** le logiciel, et Vulko à 19 EUR (P40, P20). Un prix de 29 EUR pour une seule fonction se défend mal tant que le ROI n'est pas mesuré. **Qui signe** : le gérant.
- **Alternative 1** : garder 29 EUR (Pro) [INT] et l'offre Founder à 19 EUR [INT], en ajoutant le reporting EUR « récupéré ». À tester contre 24 EUR dans les entretiens.
- **Alternative 2** : une offre **Agence/Équipe à 49-79 EUR/mois** pour les services B2B à gros panier (plusieurs expéditeurs, modèles par offre). L'ARPA est plus élevé, le CAC est le même [H].
- **Exemple de ROI** (illustratif [H]) : un plombier-chauffagiste envoie 25 devis par mois, dont 10 restent sans réponse, avec un panier de 2 000 EUR et 30 % de marge. Un devis de plus gagné tous les deux mois (r = 5 %) rapporte environ 300 EUR de marge par mois, soit **≈ 12 fois** un abonnement à 24 EUR. Le point mort est à un devis récupéré tous les 2 ou 3 ans. L'enjeu est donc la **preuve** et la **perception**, pas le prix.

## 8. Intrants du modèle économique
| Intrant | Valeur | Étiquette |
|---|---|---|
| Prix catalogue | 29 EUR HT (Pro), 19 EUR (Founder) | [INT] |
| ARPA réaliste | 20-27 EUR | [E] (remises Founder, annuel) |
| Email | 0 EUR jusqu'à 300 emails/jour ; 7-15 EUR/mois ensuite (Brevo) | [O, P35] |
| Hébergement + base de données | ~5 USD (Railway) + Supabase gratuit puis payant | [INT] ; prix Supabase payant non vérifié [H] |
| IA (brouillons de relance) | < 0,10 EUR/client/mois, plafonnée | [H] |
| Paiement | frais Stripe par transaction (taux non vérifiés ici) | [I] |
| Support/onboarding | 1-2 h à l'entrée, puis 15-30 min/mois au début | [H] ; c'est le **vrai COGS** |
| Marge brute hors temps du fondateur | 85-95 % | [E] |
| CAC en vente directe | 30 conversations pour 2 payants (critère GO du BP), soit environ 40-60 h pour 2 clients, donc **20-30 h par client** | [E] à partir de [INT] |
| CAC payant (ads/SEO plus tard) | 150-300 EUR | [H] ; coût par clic de « logiciel devis » non trouvé [I] |
| Cycle de vente | 1-3 semaines (essai) | [H] |
| Churn mensuel | 4-8 % (TPE, saisonnalité, mois sans devis) | [H] |
| LTV (ARPA 24, marge 90 %, churn 6 %) | ≈ 360 EUR | [E] |
| Payback | 7-14 mois avec un CAC payant de 150-300 EUR ; en vente directe, environ 25 h de fondateur par client | [E] |

**Signal d'alerte** : un LTV/CAC d'environ 1,2 à 2,4 en acquisition payante est **faible**. Le modèle ne tient qu'avec un canal à coût marginal quasi nul (partenaire, intégration, SEO) ou un ARPA plus élevé (agences).

## 9. Risques
- **Délivrabilité / identité d'envoi (élevé)** : Gmail et Yahoo (2024) puis Microsoft (mai 2025) exigent un domaine propre authentifié par DKIM et DMARC. Sans DMARC, les envois vers Outlook et Hotmail partent en spam ou sont rejetés (P34). Beaucoup d'artisans utilisent une adresse gratuite (gmail.com, orange.fr) [H], qu'on ne peut pas authentifier. Trois options : (a) envoyer depuis le domaine Relanzio avec Reply-To vers l'artisan, ce qui inspire moins confiance au client [H] ; (b) passer par OAuth Gmail/Microsoft, où lire la boîte pour détecter les réponses exige des droits Google sensibles ou restreints, avec une vérification et éventuellement un audit de sécurité [H, à vérifier] ; (c) IMAP avec mot de passe d'application, le chemin présent dans le dépôt (`imap-replies.js`), qui pose un **risque de sécurité** car on stocke des identifiants de boîte [O dépôt / H risque].
- **RGPD** : Relanzio agit comme **sous-traitant** (art. 28) pour les données des clients de l'artisan, ce qui suppose un DPA et un registre. Envoyer un email de prospection à un particulier exige un opt-in, alors qu'en B2B l'intérêt légitime est possible (P33). **Aucune source CNIL ne tranche** le cas de la relance d'un devis **demandé** par le client [I]. L'hypothèse prudente est d'en faire un message précontractuel, sans contenu promotionnel, avec un lien « ne plus être relancé » [H].
- **Responsabilité** : relancer un client qui a déjà signé par un autre canal, ou relancer trop souvent, nuit à l'image de l'artisan. Il faut des statuts simples (gagné/perdu) et un arrêt à la réponse.
- **Réglementation, facture électronique** : réception obligatoire au 1er septembre 2026, émission par les TPE/PME au 1er septembre 2027 (P31). **Seule la facture est visée ; un devis n'est pas une facture** : aucune obligation ne s'applique au devis selon les extraits, mais aucune source officielle (BOFiP) ne le dit explicitement [inférence]. Effet indirect **défavorable** : la réforme pousse les TPE vers des plateformes agréées tout-en-un, dont Sellsy et Axonaut, qui incluent la relance (P32).
- **Réaction des éditeurs** : Obat, Tolteck et EBP peuvent ajouter la relance de devis rapidement [H], et des entrants IA arrivent déjà (Vulko, Maitrio : P20, P21).
- **Dépendance plateforme** : Brevo, Google et Microsoft (OAuth), Stripe.
- **Fiabilité de l'IA** : enjeu faible si l'IA ne fait que rédiger des brouillons relus par l'artisan.
- **Sécurité** : stockage des PDF de devis (données personnelles et prix) ; jetons OAuth ou IMAP.

## 10. Distribution
- **Canal 1, vente directe ciblée par téléphone et email** sur une seule verticale et un ou deux départements, par exemple les artisans RGE en rénovation énergétique. Listes publiques possibles : annuaire RGE France Rénov', Pages Jaunes, Google Maps [H, annuaire non vérifié dans cette session]. La prospection B2B vers une adresse professionnelle est défendable sur la base de l'intérêt légitime, avec opt-out (P33). **Coût** : 1 à 2 h par jour de fondateur [INT].
- **Canal 2, prescripteurs et partenaires** : experts-comptables qui migrent leurs clients vers la facture électronique ; CAPEB/CMA locales (modèle Costructor, P14) ; groupes d'utilisateurs Tolteck ou Obat. **Variante marketplace** : la marketplace Pennylane existe (P44), mais Pennylane a déjà des relances (P04). Les vrais partenaires seraient les éditeurs **sans** la fonction, qui ont plutôt intérêt à la construire [H].
- **Message** : « Vous faites vos devis sur Tolteck, Obat ou Word ? Transférez-les en copie à Relanzio : vos clients sont relancés à J+2, J+5 et J+10 depuis votre nom, et ça s'arrête dès qu'ils répondent. Si aucun devis n'est gagné après relance en 60 jours, vous ne payez rien. »
- **Obtenir 10 conversations d'acheteurs** : appeler 50 à 60 artisans d'une même verticale dans un département, avec une question d'ouverture factuelle : « Combien de devis envoyés le mois dernier sont encore sans réponse ? ». L'hypothèse est 20 % de conversations utiles [H].
- **Premières ventes sans audience** : **pilote concierge**. Le fondateur relance pour 10 artisans pendant 30 jours, à la main ou avec l'outil, mesure r, puis demande le paiement. C'est le critère GO du BP : au moins 5 testeurs et 2 payants après 30 conversations [INT].

## 11. Faisabilité (sans bonus pour le code existant)
- **Architecture MVP minimale** : saisie ou import du devis (formulaire, CSV, transfert BCC avec analyse du PDF), planificateur J+2/J+5/J+10, envoi email, arrêt sur réponse (OAuth ou IMAP, ou clic manuel « répondu »), statuts, tableau de bord EUR, paiement. Un développeur compétent la construit de zéro en **3 à 6 semaines** [E].
- **Parties difficiles** : (1) **l'identité d'envoi et la détection des réponses** (§9) ; (2) **l'entrée des devis sans double saisie** ; (3) les intégrations avec les logiciels BTP, dont l'API ou l'export est **inconnu** [I].
- **État observé du dépôt** : environ 7 000 lignes JS/TS ; statut « **NON PRÊT POUR PILOTES** ». Il reste à valider le build Vite, Supabase réel, Stripe Test, la délivrabilité Brevo, la QA mobile et les mentions légales [O dépôt, README et FINAL_AUDIT_V0.4, affirmations internes].
- **Coût marginal restant pour TESTER** [E] :
  - **Test concierge** (le seul indispensable pour valider la volonté de payer) : **0 jour de développement**, moins de 50 EUR, 40 à 80 h de fondateur sur 4 à 6 semaines.
  - **Rendre l'outil sûr pour 5 à 10 pilotes** (gates externes, BCC entrant, mode « envoyer depuis le domaine Relanzio + Reply-To ») : **3 à 8 jours-homme**, moins de 50 EUR par mois.
  - **OAuth Gmail/Microsoft avec détection des réponses** : 1 à 3 semaines, plus une vérification Google de durée et de coût inconnus [I]. À **ne pas** engager avant le résultat du test.

## 12. Défendabilité à 2 ans
Elle est faible. Ce qui peut banaliser l'offre : (a) les suites (Axonaut, Sellsy, Pennylane) l'ont déjà ; (b) les logiciels BTP peuvent l'ajouter ; (c) les assistants IA des boîtes mail (nudges Gmail déjà gratuits, P38) et les LLM généralistes peuvent rédiger et programmer des relances [H] ; (d) des freelances n8n l'installent pour un coût unique (P18, P19, P45). **Pourquoi le client resterait** : l'habitude, l'historique des devis, des modèles de relance qui ont fait leurs preuves, et le reporting EUR. Ce sont des coûts de sortie faibles. **Seul fossé possible** : des intégrations natives avec les logiciels BTP sans relance, plus des benchmarks propriétaires de transformation par métier, mais cela demande du volume.

## 13. Raisons de NE PAS le faire, et expériences d'invalidation
**Raisons** :
1. C'est une **fonction, pas un produit** : elle est déjà incluse dans les suites que la réforme de 2027 va pousser (P01, P02, P32).
2. **Double saisie** : le principe « sans remplacer votre logiciel » impose une étape de plus à chaque devis.
3. **ARPA faible et CAC en temps élevé** (§8).
4. **Budget numérique faible** dans le BTP (P30) et activité en baisse (P28).
5. **Aucune preuve de volonté de payer** : discussions peu actives (P25), chiffres de conversion marketing (P24), aucune étude récente (P22 date de 2017).
6. **Biais du porteur** : la piste est retenue en partie parce que le code existe.

**Expériences qui invalideraient l'idée** (4 à 6 semaines, avant tout développement supplémentaire) :
- **E1, vérification des concurrents (1 jour)** : essais gratuits d'Obat, Tolteck, Batappli et EBP. Si deux d'entre eux ou plus relancent déjà automatiquement les devis, abandonner le wedge BTP.
- **E2, 30 conversations** : si au moins 60 % disent « mon outil le fait » ou « je relance au téléphone, ça me suffit », c'est **STOP** (critère du BP [INT]).
- **E3, concierge auprès de 10 artisans pendant 30 jours** : mesurer le nombre de devis relancés, les réponses et les devis gagnés après relance. Si **moins de 1 devis gagné après relance par artisan sur 30 jours** en médiane, ou si moins de 3 artisans sur 10 acceptent de payer 19 à 24 EUR, c'est **STOP**.
- **E4, friction** : si moins de 50 % des pilotes ajoutent au moins 5 devis la première semaine sans aide, c'est la double saisie qui tue. Il faut pivoter vers une intégration, ou arrêter.
- **E5, prévente** : lien de paiement Stripe envoyé à 50 contacts qualifiés. Zéro prépaiement invalide le prix ou le canal.

### Comparaison des variantes
| Variante | Douleur | Lacune | Faisabilité | Distribution | Verdict |
|---|---|---|---|---|---|
| **Relance de devis seule** (actuelle) | moyenne, invisible | étroite (logiciels BTP sans relance) | élevée, sauf l'envoi et l'entrée des devis | directe, coûteuse en temps | Test borné uniquement |
| **Devis + impayés** | **plus forte** (47 % seulement des entreprises paient à l'heure ; 13 Md EUR de trésorerie manquent aux TPE/PME, P39) | **quasi nulle** : Obat, Costructor, Henrri, Abby, Freebe, Qonto, Axonaut et Pennylane relancent déjà les impayés (P10, P14-P17, P48) | plus difficile (statut de paiement, rapprochement bancaire) | identique | **Défavorable** : on se rapproche d'un logiciel de facturation sans la conformité facture électronique. Au mieux, un simple rappel d'échéance sans rapprochement bancaire |
| **Vente via une plateforme agréée ou un logiciel de devis (marketplace / partenariat)** | identique | lacune seulement chez les éditeurs sans relance | dépend d'API inconnues [I] | CAC potentiellement bas | **La plus prometteuse si un éditeur BTP sans relance accepte** ; sinon dépendance totale. Pennylane a déjà la fonction (P04). À sonder en parallèle de E1 |

## 14. Re-notation
| Critère (poids) | Phase 1 (pts → /10) | Phase 2 /10 | Points | Cause du changement |
|---|---|---|---|---|
| Douleur/budget (20) | 12 → 6 | **5** | 10 | ROI théorique fort (§3), mais douleur invisible, budget numérique faible (P30), aucune volonté de payer observée. |
| Fréquence (10) | 9 → 9 | **8** | 8 | Hebdomadaire pour l'ICP ; faible pour les petits volumes (P41). |
| Preuves (15) | 6 → 4 | **4** | 6 | Signaux nouveaux (offres ComeUp P18-P19, guide Obat P11, module Housecall Pro P07) compensés par la faible activité des forums (P25), des chiffres marketing (P24) et une étude datée (P22). |
| Distribution (15) | 9 → 6 | **5** | 7,5 | Cibles listables et joignables, mais CAC d'environ 25 h de fondateur par client pour un ARPA d'environ 24 EUR ; les fédérations sont déjà occupées par les éditeurs (P14). |
| Lacune (10) | 4 → 4 | **3** | 3 | Axonaut, Sellsy, Jobber, Tradify et Housecall Pro l'ont ; lacune limitée aux logiciels BTP FR (absence de preuve seulement). |
| Faisabilité (10) | 9 → 9 | **8** | 8 | MVP simple, mais l'identité d'envoi, la détection des réponses et l'entrée sans double saisie sont difficiles ; aucun bonus pour le code. |
| Marge (5) | 4 → 8 | **7** | 3,5 | COGS très faibles (P35), mais ARPA faible, support et churn TPE. |
| Timing (5) | 2 → 4 | **3** | 1,5 | Pas de catalyseur ; la facture électronique 2026-2027 ne vise pas les devis et favorise les suites tout-en-un (P31, P32). |
| Défendabilité (5) | 2 → 4 | **2** | 1 | Banalisée par les suites, les éditeurs BTP, les nudges Gmail, les LLM et les freelances n8n. |
| Risques (5) | 4 → 8 | **7** | 3,5 | RGPD gérable (sous-traitant, opt-out) ; délivrabilité et sécurité OAuth/IMAP à traiter (P34). |
| **Total** | **61** | | **52** | |

**Verdict** : **NO-GO pour tout investissement produit supplémentaire au-delà des gates de sécurité ; GO limité pour un test commercial borné** (4 à 6 semaines, concierge et 30 conversations, moins de 8 jours de développement, moins de 100 EUR), centré sur les artisans BTP qui utilisent un logiciel sans relance de devis. Arrêt si E2 ou E3 échouent. En cas de signal positif, privilégier la variante « intégration ou partenariat avec un logiciel BTP sans relance » plutôt que « devis + impayés ».
