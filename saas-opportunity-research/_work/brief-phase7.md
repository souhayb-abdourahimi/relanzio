# Brief commun — Phase 7 : micro-SaaS rentable et revendable (Solo → Bootstrap → Rentabilité → Cession)

Date : 2026-10-29. Langue : français.

## Objectif du porteur (nouveau, il remplace les précédents)
- **Un seul fondateur**, sans salarié, exploitant en **micro-entreprise française**.
- Développement avec Claude Code et l'IA ; budget de lancement réduit.
- Abonnements récurrents ; maintenance minimale après stabilisation.
- Acquisition **sans équipe commerciale**.
- But final : un **actif numérique revendable**, pas un emploi difficile à transférer.
- Préférence explicite : **3 000 € de MRR pour quelques heures par semaine, revendable**, plutôt que 15 000 € de MRR qui exigent une équipe.
- **On ne maximise PLUS** la taille du marché ni le potentiel de levée.
- **On maximise** la rentabilité ajustée du travail du fondateur, l'automatisation, la facilité d'acquisition et la valeur de revente.
- Les concurrents puissants ne sont pas éliminatoires : on cherche les segments qu'ils servent mal.

## Grille de sélection v3 (sur 100)
Note chaque critère de 0 à 10, puis pondère.

| Critère | Points |
|---|---|
| Problème client et volonté de payer | 15 |
| Accessibilité des clients et acquisition (sans commercial, répétable, économique) | 20 |
| Facilité de développement et d'exploitation en solo | 15 |
| Rentabilité et économie unitaire (prix assez élevé pour avoir peu de clients) | 15 |
| Récurrence, rétention, risque de churn | 10 |
| Facilité de revente et transférabilité (pas de dépendance au fondateur, code et contrats transférables, métriques auditables) | 15 |
| Différenciation concurrentielle | 5 |
| Risques juridiques, techniques et de dépendance (plateforme, API instable, réglementation temporaire) | 5 |

Pour chaque note, étiquette : **[P]** preuve sourcée, **[E]** estimation raisonnée, **[H]** hypothèse non vérifiée.

## Leçons des phases 1 à 6 (obligatoires)
- Une lacune fondée sur « aucun X trouvé » vaut **au plus 5/10** au critère Différenciation, et doit être soumise à une recherche nominative des éditeurs multi-verticaux. Cette erreur a été commise 3 fois.
- **Catalyseur réglementaire ≠ demande.** Une obligation satisfaite par un outil gratuit, un tableur ou du papier ne crée pas de marché.
- Faire **≥ 40 %** de recherches d'invalidation : offres gratuites, éditeurs en place, prix bas.
- **Jamais** de simulation d'acheteurs ni de contenu marketing présenté comme preuve de volonté de payer.
- Le porteur n'a encore **aucun client payant**, y compris sur Relanzio (relance de devis, produit construit, Node/Supabase/Stripe/Brevo). Sa capacité de vente est la variable la plus incertaine.

## Outils
- WebSearch fonctionne. WebFetch est bloqué (DNS refusé) : essaie une fois, puis extraits uniquement, et dis-le.
- N'invente jamais une URL, un chiffre, un prix, une citation, une transaction ou un concurrent.

## Format des preuves
CSV `<prefix>-preuves.csv`, avec l'en-tête EXACT :
`id,opportunite_id,affirmation,url,titre,auteur_organisme,date_publication,date_consultation,extrait_ou_paraphrase,type,pertinence,fraicheur,confiance,sens`
(sens : POUR / CONTRE / NEUTRE)
