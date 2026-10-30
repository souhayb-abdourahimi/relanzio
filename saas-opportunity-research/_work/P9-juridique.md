# P9 — Limites juridiques d'un pilote manuel N06 (préfixe P9L)

Date : 2026-10-30. Piste : N06 uniquement. Preuves : `P9L-preuves.csv` (P9L-01 à P9L-33).

> **Avertissement.** Ce document n'est pas un conseil juridique. C'est une analyse documentaire préparatoire. **Un avocat (droit des professions réglementées et droit pénal des affaires) doit valider le montage avant tout pilote**, et idéalement le conseil régional de l'Ordre des experts-comptables (CROEC) concerné doit être interrogé par écrit.

**Méthode et limites.**
- 35 recherches web.
- WebFetch est bloqué : un essai sur legifrance.gouv.fr a échoué (`ENOTFOUND`). Tout repose donc sur les **extraits des moteurs de recherche**.
- Aucun arrêt n'a été lu en texte intégral. Les motifs exacts de Crim. 4 oct. 2022 et de Crim. 21 janv. 2026 sont connus seulement par des commentaires et des extraits.
- [F] signifie qu'un extrait le confirme. [H] signale une hypothèse ou une interprétation. Les articles cités sans [F] sont des références à vérifier sur Légifrance.
- Personne n'a été contacté et aucune donnée comptable réelle n'a été collectée.

**Cadre analysé.** Un micro-entrepreneur, non inscrit à l'Ordre, reçoit des relevés de versement marketplace (Cdiscount/Octopia, ManoMano, opérateurs Mirakl, Amazon). Il les décompose à la main en ventes, commissions, frais, retours et retenues. Il produit des écritures importables dans le logiciel comptable.

---

## Verdict en une phrase

- **Vente directe aux vendeurs.** Produire à la main, contre rémunération, des écritures comptables pour des vendeurs e-commerce n'est **pas possible**. C'est le cœur du monopole (« tenir, centraliser… les comptabilités »).
- **Vente aux cabinets.** Une **sous-traitance de production d'écritures** à un cabinet est elle aussi **juridiquement exposée** depuis Crim. 4 oct. 2022. Ce qui reste défendable :
  - fournir un **outil** ou une **transformation de données sans codification comptable** ;
  - laisser le choix des comptes, la validation et l'import au personnel du cabinet, sous la responsabilité de l'expert-comptable ;
  - faire les démonstrations sur **données fictives**.

---

## 1. Monopole de l'expertise comptable

### 1.1 Textes

| Élément | Contenu | Statut |
|---|---|---|
| Ord. 45-2138, **art. 2** | L'expert-comptable « fait aussi profession de **tenir, centraliser, ouvrir, arrêter, surveiller, redresser et consolider les comptabilités** des entreprises et organismes auxquels il n'est pas lié par un contrat de travail » | [F] P9L-01 (extrait Légifrance) |
| Ord. 45-2138, **art. 20** | Exerce illégalement la profession celui qui, **sans être inscrit au tableau en son propre nom et sous sa responsabilité**, exécute **habituellement** les travaux de l'art. 2 | [F] pour le critère « en son propre nom et sous sa responsabilité » (P9L-05). Texte exact non lu |
| Sanction actuelle | **1 an d'emprisonnement et 15 000 €** d'amende, selon le CROEC Pays de la Loire. Le renvoi à l'art. 433-17 C. pén. est cité dans les débats parlementaires | [F] P9L-09 |
| Réforme en cours | Des amendements au projet de loi fraudes n° 2250 (février 2026) proposent **2 ans et 30 000 €** (50 000 € selon un amendement du Sénat) et la responsabilité des personnes morales. **Adoption définitive non confirmée** | [F] dépôt (P9L-10). [H] adoption |
| Loi 2026 (WebLex, 16/07/2026) | Facilite la transmission d'informations de la DGFiP aux Ordres pour poursuivre l'exercice illégal | [F] P9L-11 (résumé seulement) |

### 1.2 Jurisprudence

- **Cass. 7 mars 1995, n° 91-21.856** : les activités réservées « incluent également la **tenue**, la centralisation, l'ouverture et l'arrêt » des comptes. Il y a exercice illégal même sans vérifier ni redresser les comptes. [F] P9L-02
- **Crim. 4 oct. 2022, n° 21-85.594** (pourvoi rejeté) :
  - une société **non inscrite, sous-traitante d'un expert-comptable**, faisait de la saisie de comptabilité et des déclarations fiscales. Elle est condamnée pour exercice illégal ;
  - l'**expert-comptable donneur d'ordre est condamné pour complicité** (30 000 € avec sursis). [F] P9L-03, P9L-04, P9L-06
  - Le pourvoi soutenait qu'un sous-traitant lié **seulement** à l'expert-comptable n'exerce pas illégalement. Cet argument a été rejeté. [F] P9L-04
  - Un extrait secondaire laisse entendre que, dans cette affaire, la société facturait aussi en son nom ou était liée aux clients. **La portée exacte est donc discutée** :
    - Gasbaoui/Lexbase : « impossibilité de sous-traiter des travaux entrant dans le champ de la prérogative » ;
    - Gazette du Palais : « ne pas surestimer la sous-traitance ». [F] P9L-07
  - Lecture prudente [H] : **ne pas compter sur un « sous-traité » pour échapper à l'art. 20.**
- **Crim. 21 janv. 2026, n° 24-81.008** (mise à disposition de comptables par une entreprise de travail à temps partagé) :
  - la Cour approuve la règle selon laquelle la comptabilité ne s'exerce habituellement que « par un comptable inscrit à l'ordre **ou sous son autorité** », ou par un salarié pour son seul employeur. [F] P9L-08
  - Un indépendant n'est pas « sous l'autorité » au sens d'un lien de subordination [H]. Les motifs intégraux n'ont pas été lus.

### 1.3 Réponses aux questions

**a) Produire des écritures pour un vendeur e-commerce directement : exercice illégal ?**
- **Oui, très probablement** [H fort, fondé sur F] :
  - décomposer un versement en écritures (choisir les comptes 411/706/622/627/709…, puis les passer) revient à **tenir** et **centraliser** la comptabilité d'un tiers (art. 2 ; Cass. 1995) ;
  - Bpifrance Création résume : un non-inscrit ne peut intervenir pour autrui **que pour de la « saisie informatique sans codification »**. [F] P9L-12
  - Or la valeur de N06 est précisément la **codification** (ventilation par nature et par compte).
- **Critère « habituellement »** :
  - un pilote ponctuel pour un seul vendeur pourrait ne pas être « habituel » [H] ;
  - une offre commerciale répétée auprès de plusieurs vendeurs l'est. **Ne pas bâtir le pilote sur cette marge.**
- **Risque supplémentaire** : le vendeur client peut être poursuivi comme complice, selon une page CROEC Bretagne citée en résultat [F partiel, extrait du moteur].

**b) Logiciel utilisé par le client ou service humain : la différence est-elle décisive ?**
- **Oui, c'est la ligne de partage la plus défendable** [H] :
  - un chef d'entreprise peut **tenir lui-même** sa comptabilité, avec n'importe quel outil [F] P9L-13 ;
  - un éditeur qui fournit un outil que le client utilise ne « tient » pas la comptabilité d'autrui.
- **Non trouvé** : aucune décision visant un éditeur de logiciel pour exercice illégal (P9L-15).
- **Point critique** : un « logiciel » opéré en coulisse par un humain (pilote « magicien d'Oz ») **est un service**, pas un logiciel. Si le micro-entrepreneur fait lui-même la ventilation et livre des écritures, la qualification « outil » ne tient pas [H].

**c) Vendre ce service à un cabinet, en sous-traitance technique sous sa responsabilité et son contrôle : licite ?**
- **Risque élevé si la prestation inclut la codification ou la production d'écritures** :
  - Crim. 4 oct. 2022 condamne précisément le sous-traitant non inscrit **et** le cabinet complice ;
  - le contrôle a posteriori par l'expert-comptable ne semble pas suffire, selon les commentaires (P9L-05, P9L-07) ;
  - l'ECF Paris-IDF parle de « couverture d'exercice illégal » (P9L-06).
- **La « tolérance » de l'Ordre** n'est rapportée que par un forum juridique de 2014 (Documentissime, non retenu comme preuve) :
  - elle suppose une lettre de mission, un sous-traité, une validation et une assurance couvrant ce mode d'exercice ;
  - elle n'est **pas confirmée par un document ordinal** et paraît fragilisée par l'arrêt de 2022 [H].
- **Sociétés de saisie et offshore** : **Non trouvé**. Aucune position écrite du CSOEC ou d'un CROEC n'apparaît dans les extraits [F négatif, recherche P9L]. La jurisprudence 2022 s'applique quel que soit le lieu, dès lors que les travaux concernent des comptabilités françaises [H].
- **Ce qui paraît défendable** [H, à valider par un avocat] :
  1. **Fournir un outil** (même rudimentaire : script, tableur à règles, convertisseur), avec un **paramétrage des comptes fait par le cabinet**. Le personnel du cabinet l'exécute, contrôle et importe.
  2. **Transformation de format sans codification** : extraire et normaliser les lignes d'un relevé (date, n° de commande, type de ligne tel que nommé par la marketplace, montant), sans attribuer de compte ni produire d'écriture. Cette prestation se rapproche de la « saisie sans codification » (P9L-12). **Zone grise** : regrouper les lignes par nature peut déjà être vu comme de la codification.
  3. **Assistance technique ou formation** : montrer au cabinet comment paramétrer ses propres règles de ventilation.
- **Option propre** : faire réaliser la production par un **expert-comptable inscrit** (associé, partenaire ou salarié d'un cabinet), le micro-entrepreneur restant éditeur de l'outil [H].

**d) Formulations et périmètre à éviter** : voir § 7.4.

---

## 2. RGPD

### 2.1 Qualification
- **Vis-à-vis d'un cabinet** : le micro-entrepreneur traite des données pour le compte du cabinet, sur instructions. Il est donc **sous-traitant (art. 28 RGPD)** [H, qualification classique].
- **Chaîne de responsabilité** : le cabinet est lui-même, selon les cas, responsable de traitement ou sous-traitant de son client vendeur. Si le cabinet est sous-traitant, le micro-entrepreneur est un **sous-traitant ultérieur**, ce qui exige l'**autorisation écrite préalable** du responsable (art. 28.2 et 28.4) [F pour l'autorisation écrite : P9L-22].
- **Vente directe à un vendeur** (de toute façon déconseillée, § 1) : le micro-entrepreneur serait sous-traitant du vendeur.

### 2.2 Contenu obligatoire du DPA (art. 28.3) [F] P9L-22
1. Objet, durée, nature et finalité du traitement ; types de données ; catégories de personnes concernées.
2. Traitement **uniquement sur instructions documentées**, y compris pour les transferts hors UE. Obligation d'alerter si une instruction paraît illicite.
3. Confidentialité imposée aux personnes autorisées.
4. Mesures de sécurité (art. 32).
5. Sous-traitants ultérieurs : **autorisation écrite préalable**, et mêmes obligations répercutées. Cela inclut l'hébergeur, l'outil de stockage et tout outil d'IA.
6. Aide au responsable pour les droits des personnes, la sécurité, les violations (art. 33-34) et l'AIPD.
7. **Suppression ou restitution** des données en fin de prestation, au choix du responsable, et destruction des copies.
8. Mise à disposition des informations prouvant la conformité, et **audits**.

Le guide CNIL date de 2017. Les clauses contractuelles types de la Commission européenne (art. 28.7) sont une base utile [H].

### 2.3 Données concernées
- Relevés de versement : identifiants de commande, montants, frais, commissions, remboursements, dates [H].
- Exports de commandes : souvent **nom et adresse de l'acheteur final** [H]. La liste des colonnes Cdiscount/Mirakl/Amazon est **Non trouvée** (P9L-33).
- Données des vendeurs : raison sociale, IBAN partiel, identifiants vendeur. Elles concernent aussi des personnes physiques quand le vendeur est un entrepreneur individuel [H].
- Ce sont des données financières, mais **pas des données « sensibles »** au sens de l'art. 9 [H].

### 2.4 Minimisation, conservation, sécurité
- **Minimisation (art. 5.1.c)** :
  - exiger que le cabinet **supprime les colonnes nom, adresse et e-mail de l'acheteur** avant envoi ;
  - travailler sur le **relevé de versement**, pas sur l'export de commandes ;
  - refuser tout fichier qui ne sert pas au pilote. [H]
- **Conservation (art. 5.1.e)** :
  - durée = durée du pilote + 30 jours au plus, puis suppression documentée (attestation de destruction) ;
  - la conservation légale des pièces comptables (10 ans, C. com. L. 123-22, non vérifié dans cette session) **incombe au cabinet ou au vendeur, pas au sous-traitant** [H].
- **Sécurité (art. 32)** :
  - poste chiffré, stockage chiffré, double authentification ;
  - échange par lien chiffré, pas par pièce jointe e-mail ;
  - pas de copie sur un appareil personnel non chiffré ;
  - journal des accès ;
  - procédure de notification de violation au cabinet sous 24-48 h (art. 33.2 : « dans les meilleurs délais »). [H]

### 2.5 Hébergement et transferts hors UE
- **Hébergement UE** : il n'est pas imposé par le RGPD, mais il est fortement recommandé. Les cabinets l'exigeront souvent [H].
- **Transferts (chapitre V)** :
  - vers les États-Unis, un destinataire **certifié DPF** (décision d'adéquation du 10/07/2023) est possible sans CCT. Il faut vérifier que la certification couvre l'entité et les données [F] P9L-26 ;
  - sinon : CCT avec analyse d'impact des transferts (guide AIPD-transferts de la CNIL, 2025).
- Inventaire des outils à déclarer au cabinet dans le DPA : messagerie, stockage, tableur en ligne, IA [H].
- **IA tierce** : voir § 3.3. Par défaut, **aucun relevé réel dans une IA grand public**.

### 2.6 Registre (art. 30.2)
- Le sous-traitant tient un registre des catégories de traitements effectués pour chaque client. [F] P9L-23
- La dérogation des moins de 250 salariés (art. 30.5) ne vaut que pour les traitements **occasionnels** et sans risque. La CNIL a sanctionné des petites structures sans registre. **À tenir dès le premier pilote.** [F] P9L-23

### 2.7 AIPD
- **Probablement pas obligatoire** pour un pilote [H] :
  - pas de profilage ni de décision automatisée ;
  - pas de données sensibles ;
  - faible volume.
- Le croisement de sources (relevé et banque) et la « grande échelle » pourraient faire deux critères à terme.
- La CNIL : deux critères sur neuf = présomption ; **en cas de doute, en faire une** [F] P9L-24.
- Recommandation : **documenter par écrit** l'analyse « AIPD non requise » [H].

---

## 3. Confidentialité

### 3.1 Secret professionnel de l'expert-comptable
- **Art. 21 de l'ordonnance** : secret professionnel « dans les conditions et sous les peines » de l'**art. 226-13 C. pén.** (1 an, 15 000 €). [F] P9L-16, P9L-18
- **Cass. com. 8 févr. 2005, n° 02-11.044** : secret **absolu** pour les missions réservées ; simple **discrétion** pour les missions accessibles aux non-inscrits. [F] P9L-17
- **Extension au sous-traitant** :
  - l'art. 226-13 vise toute personne dépositaire d'un secret « par état ou par profession, ou en raison d'une fonction ou d'une mission temporaire » [F partiel P9L-18] ;
  - un prestataire du cabinet **pourrait** être visé [H] ;
  - surtout, le cabinet **viole son propre secret** s'il communique les données sans cadre. Il exigera donc un engagement contractuel strict [H].

### 3.2 NDA
Un accord de confidentialité, distinct du DPA ou intégré, doit prévoir [H] :
- périmètre (données clients, méthodes du cabinet) ;
- interdiction de réutilisation, y compris pour entraîner ou améliorer un outil, **sauf accord écrit et données anonymisées** ;
- interdiction de citer le cabinet ou les vendeurs comme références sans accord ;
- durée de 5 ans après la fin ;
- restitution et destruction ;
- pénalité ou clause de responsabilité.

### 3.3 Outils d'IA tiers sur données comptables
- **Ordre (CNOEC)** : « Ne chargez pas de données personnelles, pas de mails clients, de FEC, de DSN… non anonymisés dans des outils d'IA » ; respect du RGPD **et** du secret professionnel. [F] P9L-19
- **OEC Paris** : « Jamais de données clients dans les IA publiques ». [F] P9L-20
- **CNIL** : charte interne ; vérifier si le fournisseur réutilise les données saisies ; préférer un déploiement sur site pour les données clients. [F] P9L-21
- **Conditions minimales** si une IA est utilisée un jour sur des données réelles [H] :
  - offre professionnelle ou API **sans entraînement sur les données** ;
  - DPA avec le fournisseur ;
  - région UE si possible, ou garanties de transfert ;
  - **autorisation écrite du cabinet** comme sous-traitant ultérieur ;
  - pseudonymisation préalable.
- **Pour le pilote : pas d'IA sur données réelles.**

---

## 4. Données fictives ou anonymisées pour les démonstrations

- **Pseudonymisation** (remplacer les noms par des alias) : les données **restent personnelles** et le RGPD s'applique. [F] P9L-25
- **Anonymisation** : irréversible, hors RGPD. Elle est difficile à garantir sur des relevés réels, car n° de commande, montants et dates permettent un recoupement avec la marketplace [H].
- **Recommandation** :
  - démonstrations sur **jeux de données fictifs générés** (structure de colonnes copiée sur la documentation publique, valeurs inventées) ;
  - mention « données fictives » sur chaque support ;
  - aucune donnée de pilote réutilisée en démonstration. [H]

---

## 5. Prospection

- **E-mail B2B aux cabinets** :
  - **pas de consentement préalable** si l'objet est en rapport avec la profession du destinataire (un outil de traitement des relevés marketplace pour un expert-comptable l'est) ;
  - information lors de la collecte ;
  - **opposition simple et gratuite dans chaque message** ;
  - identité de l'expéditeur. [F] P9L-27
- **Art. 14 RGPD** (collecte sur une page publique) :
  - informer **au plus tard au premier contact**, et dans un délai d'un mois ;
  - indiquer la **source** des coordonnées et les catégories de données. [F] P9L-28
  - Le modèle d'e-mail de P8-FR (source, STOP, durée, droits) va dans ce sens. Ajouter : identité du responsable, finalité, base légale (intérêt légitime), droit de réclamation auprès de la CNIL [H].
- **Préférer l'adresse générique** du cabinet (contact@) à une adresse nominative reconstituée [H, cohérent avec P8].
- **Déontologie côté cabinets** : **Non trouvé**. Aucune règle ordinale n'interdit à un cabinet de recevoir une prospection ou d'acheter un outil.
- **Point clé** [H] : un message qui propose au cabinet de « sous-traiter la saisie ou la comptabilisation » l'invite à un schéma condamné en 2022, et pourrait **le faire fuir ou être signalé** à l'Ordre (formulaires de signalement des CROEC, P9L-09).

---

## 6. Facturation du pilote en micro-entreprise

- **Mentions** :
  - « **TVA non applicable, article 293 B du CGI** » (franchise) [F] P9L-29 ;
  - mentions générales (C. com. L. 441-9 et CGI 242 nonies A ; non vérifié dans cette session) : identité et adresse, SIREN, numéro et date, désignation précise, prix, date d'échéance, pénalités de retard et **indemnité forfaitaire de 40 €** (B2B) [H] ;
  - **facture électronique** : réception obligatoire depuis le 1/09/2026 ; émission au plus tard en 2027 pour les micro-entrepreneurs. [F] P9L-30
- **Libellé de facture** : « Licence d'essai / mise à disposition d'un outil de conversion de relevés marketplace — pilote » ou « Assistance technique au paramétrage ». **Jamais** « tenue comptable », « saisie comptable », « comptabilisation » [H].
- **RC professionnelle** :
  - non obligatoire légalement pour une activité non réglementée ;
  - **recommandée** et souvent exigée par les clients [F] P9L-31 ;
  - à souscrire avant le pilote, en déclarant l'activité réelle (« édition et assistance logicielle »). Une activité mal déclarée peut faire refuser la garantie [H] ;
  - l'assurance **ne couvre pas** l'exercice illégal, qui est une infraction pénale [H].
- **Responsabilité en cas d'erreur d'écriture** :
  - la clause limitative est valable entre professionnels si elle ne vide pas l'**obligation essentielle** de sa substance (**art. 1170 C. civ.**) ;
  - elle est inefficace en cas de faute lourde ou dolosive (**art. 1231-3**). [F] P9L-32
  - Proposition [H] :
    - plafond égal au prix du pilote ;
    - exclusion des dommages indirects (redressement, pénalités) ;
    - obligation du cabinet de **contrôler et valider** tout fichier avant import ;
    - outil livré « en l'état » pendant la phase d'essai.

---

## 7. Synthèse opérationnelle

### 7.1 INTERDIT (ou exposé à un risque pénal sérieux)
1. Produire, contre rémunération et de façon répétée, des **écritures comptables** (affectation aux comptes, journal, FEC, fichier d'import) pour un **vendeur** (art. 2 et 20 ; Cass. 1995 ; P9L-12).
2. Faire la même chose **pour un cabinet en sous-traitance**, même avec contrôle de l'expert-comptable. Cela expose le prestataire (exercice illégal) **et le cabinet** (complicité) : Crim. 4 oct. 2022.
3. Rapprocher le versement du virement bancaire et lettrer les comptes pour le compte d'autrui. C'est de la tenue ou de la surveillance des comptes [H].
4. Se présenter comme « comptable », « expert », ou proposer un « conseil » comptable ou fiscal (usage du titre ; non vérifié ici).
5. Charger des relevés réels dans une IA grand public (P9L-19, P9L-20 ; RGPD art. 28 et chapitre V).
6. Utiliser des relevés réels, même pseudonymisés, pour des démonstrations à d'autres prospects.

### 7.2 AUTORISÉ sous conditions [H, à valider par un avocat]
**A. Pilote « outil » avec un cabinet** (format recommandé) :
1. Le livrable est un **outil** : script, tableur à règles, convertisseur CSV vers import. **Le paramétrage du plan comptable et des règles d'affectation est fait ou validé par le cabinet.**
2. **L'exécution sur données réelles est faite par un collaborateur salarié du cabinet**, sous l'autorité de l'expert-comptable. Le micro-entrepreneur fait l'assistance technique en partage d'écran ou sur jeux fictifs.
3. Si le micro-entrepreneur doit manipuler un fichier réel, ce n'est que pour un **diagnostic technique** (format, colonnes, anomalies), **sans produire d'écritures**. Cette manipulation est couverte par DPA et NDA.
4. Le cabinet garde la lettre de mission, la validation, l'import et la responsabilité.
5. Facturation en licence ou assistance logicielle, plafonnée.

**B. Pilote « données fictives »** : aucun risque de monopole ni de RGPD sur les données. C'est utile pour valider l'intérêt avant le premier fichier réel.

**C. Vente directe aux vendeurs** : seulement sous forme d'**outil en libre-service** que le vendeur exécute lui-même (tenue de sa propre comptabilité, P9L-13), sans prestation humaine de ventilation ni conseil. **Pas de pilote manuel vendeur.**

### 7.3 Documents à préparer avant tout pilote
1. **DPA art. 28** : clauses du § 2.2, liste des sous-traitants ultérieurs (hébergeur, messagerie), localisation UE, suppression en fin de pilote.
2. **NDA** (§ 3.2), avec interdiction de réutilisation et d'entraînement.
3. **CGV ou conditions de pilote** :
   - objet « mise à disposition d'un outil et assistance technique » ;
   - **clause de non-exercice** : « le prestataire n'effectue aucune mission de tenue, centralisation, surveillance ou arrêt des comptes ; l'affectation comptable, la validation et l'import relèvent exclusivement du cabinet » ;
   - limitation de responsabilité (art. 1170, 1231-3) ;
   - durée, prix, propriété intellectuelle de l'outil, résiliation.
4. **Registre art. 30.2** (sous-traitant), même pour un seul client.
5. **Politique de conservation et de destruction** : durée du pilote + 30 jours, puis attestation de destruction.
6. **Note « AIPD non requise »** argumentée.
7. **Politique de sécurité d'une page** : chiffrement, double authentification, canal d'échange, notification des violations.
8. **Charte IA** : pas d'IA sur données réelles.
9. **Attestation RC pro** avec activité déclarée exacte.
10. **Mentions d'information art. 14** pour la prospection.
11. **Consultation écrite** d'un avocat et, idéalement, du CROEC sur le schéma A.

### 7.4 Formulations commerciales à éviter, et alternatives
| À éviter | Pourquoi | Alternative [H] |
|---|---|---|
| « Nous tenons / saisissons / comptabilisons vos versements marketplace » | Verbes de l'art. 2 | « Outil de conversion des relevés marketplace en fichier d'import, paramétré par votre cabinet » |
| « Externalisez / sous-traitez la saisie de vos dossiers e-commerce » | Schéma condamné en 2022, complicité du cabinet | « Équipez vos collaborateurs d'un outil qui décompose les relevés » |
| « Nous produisons vos écritures / votre FEC / vos journaux » | Production d'écritures pour autrui | « L'outil génère un fichier que votre équipe contrôle et importe » |
| « Rapprochement bancaire et lettrage pour vous » | Surveillance et tenue des comptes | « Aide au rapprochement dans votre logiciel » |
| « Comptabilité marketplace clé en main » (aux vendeurs) | Offre de tenue | Ne pas proposer de service ; seulement un outil en libre-service |
| « Expert / spécialiste comptable e-commerce » | Confusion avec le titre | « Éditeur d'outil pour relevés marketplace » |
| « Propulsé par IA » sur des données clients | Contraire aux recommandations ordinales et CNIL | Ne pas mentionner d'IA tant qu'aucun cadre n'existe |

---

## Points ouverts (à faire valider)
1. Motifs intégraux de Crim. 4 oct. 2022 et de Crim. 21 janv. 2026 (Légifrance), en particulier :
   - le rôle du lien contractuel avec le client final ;
   - la notion de « sous son autorité ».
2. Texte en vigueur de l'art. 20 et sort des amendements du projet de loi fraudes 2026 (montant des peines).
3. Position écrite du CSOEC ou du CROEC sur la frontière entre « transformation de données sans codification » et « tenue ».
4. Colonnes réelles des relevés de versement Octopia, ManoMano, Mirakl et Amazon : présence ou non des noms et adresses des acheteurs (Non trouvé).
5. Qualification RGPD du cabinet (responsable ou sous-traitant) et donc besoin d'une autorisation du vendeur.
