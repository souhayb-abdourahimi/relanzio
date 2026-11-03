# Brief commun — Phase 1 (cartographie + premiers signaux)

Date du jour : 2026-10-29. Langue de restitution : français.

## Mission globale
Un cabinet cherche l'opportunité SaaS B2B (ou vertical SaaS) la plus solide pour un créateur solo / équipe de 1 à 3 personnes,
technique et aidée par l'IA, capital modéré, objectif clients payants sans levée. Prototype en 2-6 semaines, MVP vendable en 6-12 semaines.
Périmètre mondial ; comparer explicitement États-Unis, France/UE et autres marchés prometteurs.

Tu es un analyste sectoriel. Tu couvres UNIQUEMENT les familles de marché qui te sont attribuées.

## Règles absolues
- Utilise réellement WebSearch / WebFetch. N'invente JAMAIS une URL, un chiffre, un prix, une citation, une date ou un concurrent.
  Une URL n'est citée que si elle est apparue dans un résultat de recherche ou si tu l'as ouverte.
- Sépare FAIT OBSERVÉ (sourcé) / ESTIMATION / HYPOTHÈSE / INCONNU.
- Une discussion populaire n'est pas une preuve de volonté de payer.
- Privilégie les marchés peu glamour : obligations documentaires, rapprochements, audits, conformité opérationnelle, reporting,
  coordination terrain, facturation, intégrations pénibles. Évite « IA pour X » générique.
- Chaque opportunité doit avoir un acheteur précis et un problème précis (granularité : « logiciel de registre des fluides frigorigènes
  pour frigoristes indépendants en UE », pas « IA pour la maintenance »).
- Catalyseurs à vérifier en priorité : réglementations récentes ou à venir (avec dates d'entrée en vigueur vérifiées), changements
  technologiques, fin de vie d'un logiciel dominant, hausse de prix d'un éditeur dominant.
- Budget de recherche : environ 25 à 40 recherches/lectures web. Concentre la vérification sur tes 8-10 meilleures pistes.

## Livrables (écris des fichiers, chemins exacts fournis dans ta consigne)
1. `<prefix>-cartographie.md` — pour CHAQUE famille attribuée :
   acteurs payeurs ; workflows fréquents ; documents & systèmes utilisés ; contraintes structurelles ;
   changements réglementaires/technologiques vérifiables (avec source) ; niches ; degré de couverture de ta recherche
   (élevé/moyen/faible) et angles non couverts.
2. `<prefix>-longlist.csv` — 30 à 45 opportunités. Séparateur virgule, champs entre guillemets doubles, en-tête EXACT :
   `id,famille,sous_famille,pays_focus,acheteur_icp,utilisateur,probleme,workflow_actuel,catalyseur,signal_demande,source_url,type_preuve,statut_verification,concurrents_connus,prix_concurrents_observes,notes`
   - id : `<prefix>-01`, `<prefix>-02`…
   - type_preuve : primaire / secondaire / témoignage / aucune
   - statut_verification : VÉRIFIÉ (source lue qui soutient l'affirmation) / PARTIEL / HYPOTHÈSE
   - prix_concurrents_observes : seulement des prix lus sur une page officielle (avec la page dans notes), sinon « inconnu »
3. `<prefix>-preuves.csv` — registre de preuves, en-tête EXACT :
   `id,opportunite_id,affirmation,url,titre,auteur_organisme,date_publication,date_consultation,extrait_ou_paraphrase,type,pertinence,fraicheur,confiance`
   (date_consultation = 2026-10-29 ; confiance : élevée/moyenne/faible ; extrait court, paraphrase fidèle si pas de citation exacte)
4. `<prefix>-top.md` — tes 8 meilleures pistes, chacune notée sur la grille ci-dessous avec justification d'une ligne + confiance,
   puis 3 pistes que tu ÉLIMINES explicitement et pourquoi (critères éliminatoires).

## Grille (sur 100)
Douleur & budget payeur 20 ; Fréquence/criticité 10 ; Qualité/fraîcheur des preuves de demande 15 ; Distribution / accès aux premiers clients 15 ;
Lacune concurrentielle 10 ; Faisabilité MVP par 1-3 personnes 10 ; Marge & récurrence 5 ; Timing/catalyseurs 5 ; Défendabilité 5 ; Risques maîtrisables 5.
Éliminatoires : acheteur non identifiable ; pas de volonté de payer plausible ; aucune acquisition crédible ; données indispensables inaccessibles ;
dépendance illégale ; marge structurellement défavorable ; wrapper IA générique sans avantage.

## Réponse finale
Ta réponse finale (texte) doit être COURTE (< 300 mots) : chemins des fichiers écrits, nombre d'opportunités, tes 5 meilleures pistes avec score,
et les 3 faits sourcés les plus décisifs. Le détail va dans les fichiers.
