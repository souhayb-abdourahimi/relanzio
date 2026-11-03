# Brief commun — Phase 9 : validation commerciale de N06 avant tout développement

Date : 2026-10-30. Langue : français.

## Piste N06
**Pour qui** : cabinets d'expertise comptable français qui gèrent plusieurs clients vendeurs e-commerce actifs sur des marketplaces : Cdiscount (Octopia), ManoMano, opérateurs Mirakl (Leroy Merlin, Boulanger, Darty, Fnac…), Amazon.fr.

**Problème supposé** : chaque versement d'une marketplace mélange ventes, commissions, frais, retours, remboursements et retenues. Le cabinet doit le décomposer en écritures comptables, puis le rapprocher du virement bancaire, pour chaque dossier client.

**Hypothèse de produit** (NON validée) :
- entrée par les exports CSV ou les relevés de versement des marketplaces ;
- règles de ventilation ;
- sortie dans un format importable par le logiciel du cabinet ;
- vue multi-dossiers.

Contexte disponible dans `/home/user/relanzio/saas-opportunity-research/_work/` : `P8-FR.md` (sections N06), `P7-DD-N06.md`, `P7-DD-N06-preuves.csv`, `P8-FR-preuves.csv`.

## Règles
- **Aucune exploration générale de marché.** Uniquement N06.
- WebSearch fonctionne. WebFetch est bloqué (DNS refusé) : essaie une fois, puis extraits uniquement, et dis-le.
- **N'invente jamais** une fonction, un format, un prix, un cabinet, une adresse e-mail, un article de loi.
  - Une fonction absente des sources est « Non trouvé », jamais « Non ».
  - Une coordonnée non vue dans un extrait est « non relevée ».
- Étiquettes : [F] fait vérifié (source) ; [E] estimation ; [H] hypothèse.
- **Ne contacte personne. Ne collecte aucune donnée comptable réelle.**

## Format des preuves
`<prefix>-preuves.csv`, avec l'en-tête EXACT :
`id,opportunite_id,affirmation,url,titre,auteur_organisme,date_publication,date_consultation,extrait_ou_paraphrase,type,pertinence,fraicheur,confiance,sens`
