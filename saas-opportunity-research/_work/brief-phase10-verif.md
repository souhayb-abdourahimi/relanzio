# Brief — Phase 10 : vérification contradictoire et approfondissement

Lis :
- `/home/user/relanzio/saas-opportunity-research/16-methodologie-decouverte.md` : méthode, grille v4, règles de preuve ;
- les dossiers de découverte `_work/P10-D1.md`, `P10-D2.md`, `P10-D3.md`, `P10-D4.md`, pour les pistes qui te sont confiées.

**Tu es DISTINCT des découvreurs.** Tu joues deux rôles :
1. **red team indépendante** : invalider ;
2. **analyste de la concurrence** : trouver ce qu'ils ont manqué.

Puis, pour les pistes qui résistent, tu approfondis.

## Outils
- WebSearch fonctionne. WebFetch est bloqué (une tentative, puis extraits uniquement).
- L'outil Indeed (`mcp__Indeed__search_jobs`, `mcp__Indeed__get_job_details`) peut être disponible via ToolSearch : utile pour mesurer la fréquence d'une tâche dans les offres d'emploi.
- N'invente rien. Étiquettes : [F] fait vérifié, [O] observation indirecte, [H] hypothèse, [E] estimation, [M] information manquante.

## Pour chaque piste confiée

### 1. Chasse à la concurrence cachée
- **Au moins 6 formulations** de recherche, en FR et en EN, plus DE ou ES si pertinent ; note-les.
- Recherche **nominative** :
  - des éditeurs multi-verticaux et des modules natifs des logiciels dominants du segment : ERP de négoce, logiciels BTP, CRM, logiciels associatifs, logiciels de téléprospection, etc. ;
  - des startups récentes : Product Hunt, YC, BetaList ;
  - des solutions gratuites ou publiques.
- Classe les concurrents en directs, indirects et substituts. Pour chacun : maturité, couverture, prix, satisfaction observable, ce qu'ils ne couvrent pas.

### 2. Preuves contraires
- Le problème est-il toléré ?
- Est-il déjà absorbé par un outil généraliste (Excel, IA conversationnelle, fonction de l'ERP) ?
- Le marché est-il trop petit ?
- Le payeur manque-t-il de budget ?
- La piste relève-t-elle d'une profession réglementée ?
- La demande est-elle temporaire ?

### 3. Pourquoi la lacune existe-t-elle, si elle existe ?
Exemples : marché trop petit pour les grands éditeurs, formats hétérogènes, besoin récent, langue, segment négligé. Une lacune sans explication est suspecte.

### 4. Re-notation v4
- 7 critères, notés de 0 à 10, chacun avec une confiance.
- Total pondéré.
- Cause de chaque écart par rapport à la note du découvreur.
- Indice d'innovation (0-5).

### 5. Si la piste reste ≥ 55 après re-notation : approfondissement
- **ICP et décideur payeur.** Nombre d'acheteurs : sourcé ([F] INSEE, annuaires, fédérations) ou estimé ([E]).
- **Économie** :
  - prix à tester, avec ancrages observés ;
  - nombre de clients pour 2 000 à 5 000 € de MRR ;
  - coûts variables ;
  - heures d'exploitation estimées.
- **Architecture solo** : MVP, intégrations indispensables avec leur stabilité, part réellement automatisable, partie difficile, risque d'intervention humaine récurrente.
- **Acquisition sans réseau** : où sont les acheteurs (listes publiques, annuaires, SEO, marketplaces), et comment les contacter légalement.
- **Revente** : transférabilité, dépendances.
- **Plan de validation réel**, toujours sans contacter personne :
  - lieu des premiers acheteurs ;
  - vérification du problème ;
  - mesure du budget existant ;
  - proposition de valeur ;
  - test commercial ;
  - preuve de volonté de payer (engagements financiers ≥ déclarations) ;
  - coût ;
  - seuils GO et STOP.

## Fichiers
- `<prefix>.md` : une section par piste, avec les points 1 à 5.
- `<prefix>-scores.csv`, avec l'en-tête EXACT :
  `id,titre,categorie,demande_25,insuffisance_20,concurrence_faible_15,acquisition_15,solo_10,rentabilite_10,revente_5,total_100,total_decouvreur,confiance_demande,confiance_globale,innovation_0_5,verdict`
- `<prefix>-preuves.csv`, avec l'en-tête EXACT :
  `id,opportunite_id,affirmation,url,titre,auteur_organisme,date_publication,date_consultation,extrait_ou_paraphrase,type,pertinence,fraicheur,confiance,sens`

## Réponse finale
COURTE (< 250 mots) : nouvelle note de chaque piste, la preuve contraire la plus forte de chacune, et ton verdict.
