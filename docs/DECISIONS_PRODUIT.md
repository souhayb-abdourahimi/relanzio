# Décisions produit — alignement Founder Skill (branche `feat/product-alignment-founder-audit`)

Promesse visée : « Vos devis relancés à votre place. Tout s’arrête dès que le client répond. »
Elle n’est affichée publiquement qu’une fois la détection de réponse vérifiée en conditions réelles (§2).

## 1. Ce qui ne change pas, et pourquoi

| Sujet | Décision | Raison |
|---|---|---|
| Prix | 29 €/mois, « TVA non applicable, art. 293 B du CGI » | Décision Founder (médiane du marché). Statut fiscal actuel inchangé ; afficher « HT » est une décision comptable hors code. |
| Free | 5 devis actifs | Décision Founder : un Free illimité remplace le Pro. |
| Pro | 100 devis actifs | Le quota n’est plus l’argument de vente, mais le changer n’apporte rien : aucun compte n’en approche. |
| Essai | 7 jours, au premier devis, sans carte | Passer à 14 j toucherait CGV (section 3), QA pré-déploiement, textes et tests, sans gain prouvé : la valeur se voit dès J0 en chargeant les devis déjà en attente (première relance proposée le jour même) et avec le moment « C’est suivi ». À rediscuter après le pilote. |
| Cadence par défaut | J+2 / J+5 / J+10, 3 relances max | Comptes existants inchangés ; seules les dates du week-end glissent au lundi. |
| Prospection Relanzio | D0 → J+3 → END, aucun J+7 | Non modifiée (test `stream-isolation` + tests existants). |

## 2. Détection de réponse : activation (actions manuelles)

Sans ces réglages, rien ne change : le Reply-To reste l’adresse de l’artisan, aucun arrêt automatique, aucun envoi automatique.

1. Créer une boîte dédiée au produit (pas `contact@`, qui sert la prospection), ex. `reponses@relanzio.com`, chez l’hébergeur mail actuel.
2. Vérifier qu’elle reçoit `reponses+test12345abcdefghij@relanzio.com` (sous-adressage « + »). Sinon : catch-all sur un sous-domaine, ex. `*@r.relanzio.com` (DNS MX à créer).
3. Variables Railway : `REPLY_INBOUND_ADDRESS`, `REPLY_IMAP_HOST`, `REPLY_IMAP_PORT=993`, `REPLY_IMAP_USER`, `REPLY_IMAP_PASSWORD`.
4. Appliquer la migration `20261029100000_quote_replies.sql` **avant** le code.
5. Test réel (3 échanges) : compte de test Pro → « Envoyer via Relanzio » vers une boîte personnelle → y répondre → vérifier sous 2 min : devis dans « Réponses reçues », plus aucune relance proposée, email de transfert reçu par l’artisan avec la réponse et les pièces jointes, `Reply-To` = client.
6. Seulement après : `VITE_REPLY_DETECTION_LIVE=true` (build) pour afficher la promesse complète, puis éventuellement `FOLLOWUP_AUTOMATION_ENABLED=true`.

Garde-fous codés : l’envoi automatique exige `FOLLOWUP_AUTOMATION_ENABLED=true` **et** la détection configurée ; jamais d’envoi, de préparation ni de confirmation après une réponse ; une réponse arrivée pendant un envoi enregistre l’email parti mais ne planifie rien.

Limites connues : une réponse envoyée à une autre adresse que le Reply-To (nouvel email, téléphone) n’est pas vue → bouton « Le client a répondu ». Réponses automatiques (absence) : enregistrées, n’arrêtent pas la séquence. Pièces jointes transmises : PDF, images, Office, ZIP jusqu’à 8 Mo ; les autres sont signalées dans l’email de transfert.

## 3. Isolation prospection / produit

Fait dans le code (comportement identique tant que rien n’est configuré) :
- flux d’envoi `outreach` distinct, avec clé Brevo optionnelle `OUTREACH_BREVO_API_KEY` (sous-compte Brevo) ;
- boîte des réponses produit distincte de la boîte de prospection ;
- plafond quotidien par compte pour les relances clients (`FOLLOWUP_ACCOUNT_DAILY_CAP`, défaut 60), indépendant des plafonds de prospection ;
- tags distincts (`relanzio-followup`, `relanzio-client-reply` / `relanzio-commercial`, `relanzio-pilot`, `relanzio-outreach`).

Reste à faire hors code (DNS) : envoyer la prospection depuis un domaine ou sous-domaine dédié (ex. `prospection.relanzio.com` ou un domaine séparé), authentifié dans le sous-compte Brevo (SPF via include Brevo, DKIM Brevo, DMARC), puis changer l’expéditeur `PILOT_SENDER` (aujourd’hui `contact@relanzio.com`, codé en dur dans `server/pilot-outreach-policy.js`). Ne pas faire de prospection par email à froid avant cette séparation (décision Founder).

## 4. Ajout de devis par transfert d’email — conçu, non construit

Raison : la détection de réponse est la priorité, et un second flux entrant sur la même boîte augmenterait le risque de confusion avant le pilote.

Conception prête : adresse personnelle `ajout+<jeton-compte>@…` (jeton aléatoire par compte, révocable) sur la même infrastructure IMAP (`server/quote-replies.js` : configuration, extraction des destinataires, pièces jointes). Le message transféré crée un **brouillon** de devis (client = expéditeur d’origine si trouvé dans l’en-tête transféré, objet = sujet, montant non deviné) que l’artisan valide en un geste. Aucun devis n’est créé sans validation ; aucune lecture de PDF (OCR) dans un premier temps. Routage : jeton `ajout+` et jeton `reponses+` sur deux préfixes distincts, jamais mélangés.

## 5. Recommandations non appliquées

| Recommandation | Statut | Raison |
|---|---|---|
| « Devis illimités » en Pro | Réfutée | Décision utilisateur : 100 devis actifs, pas d’« illimité ». |
| Essai 14 jours | Reportée | §1. |
| Garantie « mois remboursé » | Reportée | Elle ne devient tenable qu’après la vérification réelle du §2 ; décision commerciale à prendre ensuite. |
| Places pilotes « 29 € garantis à vie » | Hors code | Offre commerciale, pas une fonction produit. |
| Envoi depuis la boîte de l’artisan (Gmail/Outlook) | Réfutée pour cette version | Fait peur (panel), complexité OAuth. |
| SMS / WhatsApp automatiques | Reportés | Risque juridique (L223-8), demande minoritaire. |
| IA de rédaction | Retirée | Lente, anxiogène ; trois modèles fixes. OpenAI reste utilisé pour la prospection et l’assistant support uniquement. |
| Rapport mensuel | Non construit | 18/20 l’enlèveraient ; remplacé par une petite bande de chiffres. |
| Choix manuel des 5 devis gardés en Free | Reporté | Règle actuelle conservée (5 plus récents) mais annoncée 2 jours avant la fin de l’essai ; « le client a répondu » reste possible sur un devis en lecture seule. |
| Second utilisateur (secrétaire, conjoint) | Reporté | P2 Founder. |

## 6. Juridique — LEGAL REVIEW REQUIRED

Aucune nouvelle promesse juridique. À faire relire : mention L223-8 (rénovation énergétique), traitement des réponses clients (stockage d’un extrait de 2 000 caractères, transfert à l’artisan, sous-traitance Brevo/hébergeur mail) à refléter dans la politique de confidentialité et le DPA avant activation du §2.
