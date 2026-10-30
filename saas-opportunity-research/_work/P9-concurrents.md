# P9 — Concurrents N06 : ce qui est couvert, et ce qui reste ouvert pour les cabinets multi-dossiers

Date : 2026-10-30. Préfixe **P9C**. Preuves : `P9C-preuves.csv` (P9C-P01 à P45). Les identifiants `P7DN06-` et `P8F-` renvoient aux registres des phases 7 et 8. Matrice complète : `P9-concurrents-matrice.csv` (20 solutions × 16 fonctions, 320 lignes).
Étiquettes : **[F]** fait vérifié (source), **[E]** estimation, **[H]** hypothèse.

## 0. Méthode, limites et verdict court

- **36 recherches WebSearch** abouties, presque toutes nominatives (Order Invoicer en a eu 12), plus 2 recherches interrompues par une coupure de quota puis relancées.
- **1 tentative WebFetch** sur `www.orderinvoicer.com/en/pricing`, refusée (ENOTFOUND). Tout le contenu vient des **extraits** de résultats ; aucune page n'a été lue en entier. Pour lire les pages tarifs et la documentation, il faudrait autoriser `orderinvoicer.com`, `docs.orderinvoicer.com`, `synchron.io` et `acomim.com` dans les réglages réseau de la session.
- Valeurs de la matrice :
  - « Oui » : la fonction est vue dans un extrait source. Cela vaut **annonce de l'éditeur**, pas fonctionnement vérifié.
  - « Non trouvé » : la fonction est absente des extraits consultés, **ce qui ne prouve pas qu'elle n'existe pas**.
  - « Inconnu » : la fonction n'a pas été cherchée nominativement.
- Aucun essai, aucun contact, aucune donnée comptable réelle.

**Verdict court.**
1. **Order Invoicer couvre bien plus que ce que supposait la phase 8** [F] :
   - plus de 18 marketplaces, dont Leroy Merlin, Castorama, Decathlon, Leclerc, Brico Marché et un connecteur Mirakl générique (P9C-P03, P08) ;
   - en sortie, **Cegid, ACD, EBP, Sellsy, Axonaut, Evoliz, Abby, Odoo et NetSuite**, en plus de Pennylane (P9C-P05 à P07).
   - Deux créneaux défendus en phase 8 **s'effondrent** : les « opérateurs Mirakl secondaires » et le cabinet « hors Pennylane ».
2. **Les fonctions cabinet multi-dossiers existent ailleurs, mais pas sur ce marché** [F] :
   - **Link My Books** a un portail comptable avec statut de clôture par client et facturation consolidée (P31, P32) ;
   - **A2X** a un tableau de bord partenaire avec remises par palier (P28 à P30) ;
   - **Taxomate** a un tableau de bord partenaire (P34).
   - Aucun des trois ne couvre Cdiscount, ManoMano ou Mirakl, ni ne sort vers un logiciel français (P33, P7DN06-P21). Le modèle est donc prouvé à l'étranger et absent en France.
3. **Il reste un seul créneau plausible : la couche cabinet au-dessus des connecteurs** [H, confiance faible à moyenne]. Elle comprendrait :
   - la vue des versements non rapprochés de tous les dossiers ;
   - l'onboarding en série ;
   - la clôture groupée ;
   - le contrôle des taux de commission.
   Ce créneau repose sur des « Non trouvé ». Il est **réplicable par Order Invoicer**, qui annonce déjà une « Accounting consolidation » au palier Growth, au contenu non décrit (P9C-P01). **Aucun développement ne doit commencer avant les essais du §5.**

---

## 1. Matrice synthétique

Légende : ✔ Oui [F] · ◐ partiel ou par service · ✗ Non trouvé · ? Inconnu. Le détail et les sources sont dans le CSV.

| Solution | Amazon | Cdiscount | ManoMano | Mirakl | Fnac | Rakuten | Entrée | Décomp. versement | Rappr. virement | TVA | Sortie | Multi-dossiers | Écarts | Factur. | Prix | Avis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Order Invoicer** | ✔ | ✔ | ✔ | ✔ générique + LM, Castorama, Decathlon… | ✔ | ✗ | API | ✔ (annoncé) | ✔ (annoncé ; doc détaillée Shopify seulement) | ◐ taux/écarts ; OSS ✗ | Pennylane, Cegid, ACD, EBP, Sellsy, Axonaut, Evoliz, Abby, Odoo, NetSuite, Qonto ; Quadra/Sage/FEC ✗ | ✗ (plusieurs connecteurs par organisation) | ✗ | par connexion | 0-299 € | 2 ou 52 avis |
| Synchron.io | ✗ | ✗ | ✗ | ✔ | ✗ | ✗ | API | ✗ (commandes/factures) | ✗ | ✗ | Pennylane | ✗ | ◐ (erreurs de synchro) | par intégration | 150-350 € | ✗ |
| Acomim | ✔ | ✔ | ✗ | ✗ | ✗ | ✗ | API | ◐ | ✗ | ✗ | Pennylane, Abby | ✗ | ✗ | ✗ | 0-249 (contradictoire, ancien) | ✗ |
| Pennylane natif | ✗ (en pause) | ✗ (achats) | ✗ (achats) | ✗ | ✗ | ✗ | Shopify, Stripe, PayPal | ◐ Stripe/PayPal | ? | ✗ | Pennylane | ✔ (logiciel cabinet) | ✗ | ✗ | 7-79 € | ✔ |
| Sellsy | ◐ | ◐ | ✗ | ✔ (app partenaire) | ✗ | ✗ | API | ✗ | ◐ (compte par marketplace) | ✗ | FEC, CSV | ? | ✗ | ✗ | ✗ | ✗ |
| Tiime / Indy | ✗ / ◐ manuel | ✗ | ✗ | ✗ | ✗ | ✗ | Stripe, Make / manuel | ✗ / ◐ manuel | ✗ | ✗ | propre | ? | ✗ | ✗ | ✗ | ✗ |
| Dext Commerce | ✔ (2021) | ✗ | ✗ | ✗ | ✗ | ✗ | API | ✔ | ✗ | ✗ | Xero, QBO | ✔ (cible comptables) | ✗ | ✗ | ✗ | ✗ |
| A2X | ✔ | ✗ | ✗ | ✗ | ✗ | ✗ | API | ✔ | ✔ | ◐ | QBO, Xero, NetSuite, Sage | ✔ Partner Dashboard | ◐ | par client + remises | ✔ | ✗ |
| Link My Books | ✔ (.fr) | ✗ | ✗ | ◐ via Shopify | ✗ | ✗ | API, CSV hors canaux | ✔ | ✔ | ✗ | Xero, QBO | ✔ Accountant Portal | ✔ | directe ou consolidée | ✔ | ✗ |
| Taxomate | ✔ (UE) | ✗ | ✗ | ✗ | ✗ | ✗ | API | ✗ | ✗ | ✗ | QBO, Xero, Wave | ✔ | ✗ | choix du payeur | 59 $ | ✔ |
| ChannelEngine Settlements | ✔ | ✗ | ✔ CSV | ✔ | ✗ | ✗ | API + CSV | ✔ | ✗ | ✗ | e-mail, FTP | ✗ | ✗ | ✗ | ✗ | ✗ |
| Lengow / Shopping Feed / Channable / BeezUP | flux | flux | — | flux (Channable) | — | — | commandes | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Boostmyshop | ? | ? | ? | ? | ? | ? | API | ✗ | ◐ lettrage | ✗ | Pennylane | ✗ | ✗ | ✗ | ✗ | ✗ |
| Cegid / Sage FR | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | — | ✗ | ✗ | — | natif | natif | — | — | — | — |
| Qashflo | ? | ? | ? | ? | ? | ? | ? | ? | ✔ vue | ? | Excel | ? | ? | ? | 79-299 € | ? |
| Cabinets (Hayot, HR Associés, Eurofiscalis, Dougs, Keobiz) | ◐ service | ◐ | ◐ | ✗ | ◐ | ✗ | exports + n8n | ◐ | ◐ (compte 512220) | ◐ OSS | Pennylane (Hayot) | interne | ✗ | sur devis | ✗ | cas commerciaux |

**Sources clés** :
- Order Invoicer : P9C-P01 à P15.
- Synchron.io : P16-P17. Acomim : P18-P19. Pennylane : P20-P22.
- Sellsy : P23-P24. Tiime : P25. Indy : P26. Dext : P27.
- A2X : P28-P30. Link My Books : P31-P33. Taxomate : P34-P35.
- ChannelEngine : P36-P37. Outils de flux : P38-P39. Cegid et Sage : P40, P43.
- Cabinets : P41-P42, P7DN06-P13 à P16, P8F-P22-23.

---

## 2. Order Invoicer en détail

| Question | Réponse | Statut |
|---|---|---|
| Marketplaces | Amazon, Cdiscount, ManoMano, Fnac, Leroy Merlin, Castorama, Brico Marché, Leclerc, Decathlon, Alltricks, Ankorstore, Choose, Faire, Leboncoin, eBay, Etsy, Bol.com, Uber Eats, plus un connecteur Mirakl générique en libre-service depuis mai 2026. **Boulanger, Darty et Rakuten : non trouvés.** Le connecteur Mirakl générique pourrait les accepter [H] | [F] P03, P08, P09 |
| Connexions comptables | Pennylane, Cegid (produit exact non précisé), ACD, EBP, Abby, Sellsy, Axonaut, Evoliz, Odoo, NetSuite, Qonto, bexio, Factecom ; Xero et Factomos « bientôt ». **Quadra, Sage FR et export FEC générique : non trouvés** | [F] P05-P08 |
| Nature du flux vers Cegid et ACD | Attesté pour la **facturation des commandes**. L'export des **écritures de versement** vers ACD ou Cegid n'est pas décrit [H] | [F] P06 |
| Rapprochement des versements | Annoncé sur chaque page marketplace : décomposition en ventes, commissions, port et ajustements, puis rapprochement avec la transaction bancaire et écritures « prêtes à valider ». **La documentation détaillée ne couvre que Shopify Payments vers Pennylane** | [F] P04, P12 ; marketplaces [H] |
| ManoMano | ManoMano ne fournit pas ses règlements par API (P37). Order Invoicer dit pourtant les décomposer : soit par import CSV, soit par reconstitution à partir des commandes [H] | à tester |
| TVA | Ligne de correction d'écart TTC et règles de correspondance de taux. **OSS et « deemed supplier » : non trouvés** | [F] P13 |
| Multi-dossiers et offre cabinet | Plusieurs connecteurs par organisation, avec un forfait par connexion. Un lien « Générer un lien pour mon comptable » permet au cabinet d'autoriser l'accès depuis son Pennylane Collaboratif, **dossier par dossier**. **Aucune vue cabinet, aucun tarif cabinet trouvés.** La « Accounting consolidation » (Growth/Pro) reste non définie | [F] P01, P10, P11 ; absence [H] |
| Prix | 0 / 12 / 59 / 149 / 299 €/mois, au crédit ; essai de 14 jours. Les pages se contredisent (25 ou 100 crédits) | [F] P01, P02 |
| Avis | App Shopify « Connecteur factures Pennylane » lancée le 19 mars 2026 : 2 ou 52 avis selon l'agrégateur. Aucun avis de cabinet trouvé | [F] P14, P8F-P16 |
| Visibilité Pennylane | Fiche partenaire présente, mais centrée sur Shopify, PrestaShop, WooCommerce et Wix. Seul acteur e-commerce marketplace visible côté Pennylane | [F] P15, P22, P45 |

**Lecture [E].** Order Invoicer est un **connecteur par boutique**, vendu au vendeur. Le cabinet n'y apparaît que comme celui qui autorise l'accès dans Pennylane. Le produit est large (plus de 30 sources, plus de 12 destinations) et récent (changelog 2026), avec une traction publique faible. C'est le concurrent le plus proche, et aussi le mieux placé pour ajouter une vue cabinet.

---

## 3. Autres solutions : ce qu'il faut retenir

- **Synchron.io** synchronise des commandes et des factures Mirakl vers Pennylane, pas des versements (P16). Son tarif, 150 €/mois par intégration, le rend cher pour un cabinet de 20 dossiers [E].
- **Acomim** couvre Amazon et Cdiscount vers Pennylane et Abby, à petit prix. Ses tarifs sont contradictoires et probablement anciens (P18). Il revendique un « support des comptables » sans fonction décrite (P19).
- **Pennylane natif** ne couvre pas les versements marketplaces. Le connecteur Amazon Seller est en pause (P20, P7DN06-P17) ; Cdiscount Pro et ManoMano Pro ne servent qu'aux achats.
  - En revanche, Pennylane **est lui-même un logiciel multi-dossiers pour cabinets** (plan Collaboratif, P11).
  - Une partie de la « vue cabinet » pourrait donc déjà exister nativement : les transactions non rapprochées par dossier. C'est à vérifier [H].
- **Sellsy** centralise les ventes et règlements par marketplace dans un compte dédié et exporte un FEC (P23). Les commissions ne sont pas décrites.
- **Tiime et Indy** n'ont pas de connecteur marketplace : Tiime a seulement une demande sur sa feuille de route (P25), Indy passe par une saisie manuelle (P26). Ce sont des cibles de sortie possibles, pas des concurrents.
- **Dext Commerce** est un outil pour comptables lancé en 2021, sans preuve de disponibilité en France (P27).
- **A2X, Link My Books et Taxomate** ont tous des fonctions cabinet, mais aucune marketplace française hors Amazon et aucune sortie française (P28-P35). C'est la **preuve que le workflow cabinet se vend** (paliers A2X jusqu'à 40 clients ou plus), sur un autre marché.
- **ChannelEngine Settlements** est une découverte de cette phase :
  - récupération automatique des règlements Mirakl et Amazon, import CSV pour ManoMano (P36, P37) ;
  - mais il vise les marques et les ERP, pas les cabinets, et sa sortie se limite à l'e-mail et au FTP.
- **Outils de flux** (Lengow, Shopping Feed, Channable, BeezUP) : aucune donnée de paiement trouvée (P38, P39). Ils ne sont ni concurrents ni sources de données de versement [E].
- **Cegid et Sage France** : aucun connecteur Amazon ni marketplace trouvé, seulement des intégrateurs britanniques (P40, P43).
- **Cabinets** :
  - Hayot automatise avec n8n (P7DN06-P15) ;
  - Dougs aurait un module e-commerce interne avec OSS, IOSS et rapprochement (P41, source tierce) ;
  - Eurofiscalis rapproche Stripe, Shopify Payments et PayPal (P42).
  Les cabinets en ligne **internalisent** l'outil, et sont donc des concurrents plutôt que des clients [E].

---

## 4. Workflows multi-dossiers insuffisamment couverts

« Non trouvé » ≠ absent. La confiance porte sur l'**absence de couverture en France**, pas sur l'existence d'une demande, qui n'est pas testée ici.

| # | Workflow | Couverture observée | Preuves de non-couverture | Confiance « non couvert » | Risque principal |
|---|---|---|---|---|---|
| W1 | **Vue des versements non rapprochés de tous les dossiers** (cabinet : « quels clients ont des versements Cdiscount, ManoMano ou Leroy Merlin non lettrés ce mois-ci ? ») | Existe chez Link My Books (statut de clôture par client, P32) et en partie chez A2X (comptes inactifs, P30), mais pour Xero/QBO et Amazon seulement. Order Invoicer : configuration par connecteur (P10). Pennylane natif : non vérifié | Aucune vue cabinet chez Order Invoicer, Synchron.io ou Acomim (P10, P16, P19, P44) | **Moyenne** | Pennylane Collaboratif montre peut-être déjà les transactions non rapprochées par dossier [H] ; « Accounting consolidation » d'Order Invoicer non définie (P01) |
| W2 | **Onboarding de N clients** (création en série, modèle de plan de comptes, clés API par client) | Order Invoicer : un lien comptable par société dans Pennylane (P11) et un forfait par connexion (P10). Link My Books et Taxomate : invitation des clients depuis un tableau de bord partenaire (P31, P34) | Aucun onboarding groupé trouvé en France | **Moyenne** | La collecte des clés API reste par vendeur, quel que soit l'outil (P7DN06-P25) : le gain réel est peut-être faible [E] |
| W3 | **Clôture mensuelle groupée** (checklist par dossier et par marketplace, statut « clos ») | Link My Books seulement (P32), hors France | Rien trouvé en France | **Moyenne** | Le cabinet pilote peut-être déjà sa clôture dans Pennylane ou dans son outil de production ; la demande est non mesurée [H] |
| W4 | **Contrôle des écarts de commission** (taux facturé ≠ taux contractuel par catégorie, frais inattendus) | ChannelEngine annonce un « contrôle des finances marketplace » (P36), sans détail. Rien chez Order Invoicer ni chez les outils anglo-saxons dans les extraits | Aucun outil trouvé | **Moyenne à haute** pour l'absence ; **faible** pour la demande | La valeur est-elle pour le cabinet ou pour le vendeur ? HR Associés range les litiges dans la valeur ajoutée du cabinet (P7) [H]. Il faut les grilles de commission par opérateur |
| W5 | **Règles de ventilation par client** (modèles réutilisables au niveau cabinet, puis surcharges par dossier) | Order Invoicer : règles par connecteur, par exemple la correspondance des taux de TVA (P13). Aucun modèle de règles cabinet trouvé | Non trouvé | **Faible** | Les règles par connecteur reviennent fonctionnellement à des règles par client ; le surplus d'un modèle cabinet est peut-être marginal [E] |
| W6 | **Export vers un logiciel non-Pennylane** | **Largement couvert** par Order Invoicer : Cegid, ACD, EBP, Sellsy, Axonaut, Evoliz, Abby, Odoo (P05-P07). Restent Quadra, Sage France et le FEC générique, non trouvés | Quadra, Sage FR et FEC absents des extraits (P07, P43) | **Faible** (le segment de la phase 8 est affaibli) | Le flux ACD/Cegid observé est peut-être limité à la facturation des commandes. Si Order Invoicer exporte aussi les écritures de versement, le créneau disparaît [H] |

**Synthèse [E].** Le seul ensemble cohérent qui reste est **W1 + W3 + W2** : un « cockpit cabinet » des versements marketplaces français, branché sur les connecteurs existants ou sur des imports CSV. W4 est un différenciateur possible, mais la demande n'est pas démontrée. W5 et W6 ne suffisent pas à porter une offre.

Ce cockpit fait face à trois menaces :
1. Order Invoicer peut l'ajouter (« Accounting consolidation ») ;
2. Pennylane Collaboratif le fait peut-être déjà en partie ;
3. Link My Books, qui a déjà le produit, peut ajouter des marketplaces françaises et une sortie Pennylane.

---

## 5. À vérifier par essai réel avant d'y croire

Ces essais sont à faire par le porteur. **Aucun contact ni aucune donnée réelle dans cette phase** : comptes d'essai, boutiques de test et fichiers d'exemple anonymisés seulement.

| # | Essai | Question tranchée | Seuil « créneau mort » |
|---|---|---|---|
| T1 | **Order Invoicer, essai de 14 jours** (P01) : une organisation, deux connecteurs pour deux sociétés fictives | Existe-t-il une vue unique de plusieurs sociétés ? Que contient « Accounting consolidation » (Growth) ? La facturation peut-elle être consolidée ? | Vue multi-sociétés avec statut de rapprochement → W1 et W3 couverts |
| T2 | Order Invoicer : connecteur ManoMano et Cdiscount (ou démo) | Mode d'entrée réel (API ou CSV, P37) ? Les commissions, retenues et retours apparaissent-ils ligne à ligne ? Le rapprochement avec le virement est-il automatique ? | Décomposition complète et rapprochement automatique → la proposition de base est entièrement couverte |
| T3 | Order Invoicer vers **ACD** et **Cegid** | Exporte-t-il les **écritures de versement** ou seulement les factures de commande (P06) ? Un FEC est-il possible ? | Écritures de versement vers ACD ou Cegid → W6 mort |
| T4 | **Pennylane Collaboratif** (démo cabinet) | Le cabinet voit-il, sur tous ses dossiers, les transactions bancaires non rapprochées, y compris les virements marketplaces ? | Oui → W1 couvert nativement pour les cabinets sous Pennylane |
| T5 | **Link My Books, Accountant Portal** (essai) | Niveau de détail du statut de clôture et des exceptions : c'est le modèle à reproduire. Ajout de Cdiscount ou ManoMano sur la feuille de route ? | Annonce de canaux français et d'une sortie Pennylane → fenêtre fermée |
| T6 | **Synchron.io** (essai de 60 jours, P17) et **Acomim** (gratuit, P18) | Une fonction cabinet est-elle cachée ? Les versements sont-ils traités ? | Fonction cabinet présente → concurrence directe supplémentaire |
| T7 | ChannelEngine Settlements (démo) | Calcul d'écarts de commission ? Sortie comptable française ? | Contrôle des commissions présent → W4 affaibli |

**Ordre conseillé** : T1, T4 et T3 d'abord (≈ 1 journée). Ce sont les trois qui peuvent tuer le créneau restant.

---

## 6. Conséquences pour N06

- **Révision du positionnement [E].** La piste n'est plus « connecteur de versements marketplaces vers la comptabilité » : c'est couvert, au moins en annonce, par Order Invoicer. Elle devient « **cockpit cabinet multi-dossiers** au-dessus des versements marketplaces français ».
- **Conséquences commerciales.** Le seul acheteur devient le cabinet ; la cible se réduit à quelques centaines de cabinets [H] (P7) ; il faut un argumentaire face à Order Invoicer plus Pennylane.
- **Signal favorable [F].** Les tableaux de bord partenaires A2X, Link My Books et Taxomate montrent que ce workflow est vendu et payé dans les pays anglo-saxons (P28-P34). Aucun équivalent n'a été trouvé pour les marketplaces françaises.
- **Signal défavorable [F].**
  - Le concurrent direct est large, actif (changelog de mai 2026) et en place chez Pennylane (P09, P15).
  - Il dispose déjà d'une fonction nommée « Accounting consolidation » (P01).
- **Recommandation.**
  - **Ne pas coder.** Faire T1, T3 et T4.
  - Si aucun ne couvre W1 + W3, refaire les 15 entretiens du plan P7 avec des cabinets uniquement, en leur demandant comment ils suivent aujourd'hui les versements non rapprochés de tous leurs dossiers.
  - Si T1 ou T4 montrent une vue multi-dossiers existante, **abandonner N06**.
