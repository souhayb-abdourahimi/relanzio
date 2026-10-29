# Brief commun — Phase 2/4 (due diligence d'un finaliste)

Date : 2026-10-29. Langue : français. Profil créateur : solo ou 1-3 personnes, technique + IA, capital modéré, objectif clients payants
sans levée ; probablement francophone (le dépôt héberge un SaaS français, Relanzio : relance de devis TPE, stack Node/Supabase/Stripe/Brevo).
Ce profil ne doit pas biaiser les faits, mais la faisabilité de la DISTRIBUTION pour ce profil doit être évaluée honnêtement (ex. vendre aux US depuis la France).

## Contraintes d'outils
- WebSearch fonctionne. WebFetch est BLOQUÉ pour la plupart des domaines externes (politique réseau). Essaie-le une fois ; s'il échoue, n'insiste pas :
  travaille sur les extraits de WebSearch et indique-le. Une preuve issue d'un extrait est marquée « extrait de recherche ».
- N'invente JAMAIS d'URL, de prix, de chiffre, de citation, de concurrent. Une URL n'est citée que si elle est apparue dans un résultat.
- Sépare FAIT OBSERVÉ / ESTIMATION / HYPOTHÈSE / INCONNU. Budget : 30 à 45 recherches.
- Cherche ACTIVEMENT les preuves CONTRAIRES (concurrent qui résout déjà le problème, gratuité, réglementation suspendue, faible volonté de payer,
  plaintes absentes, acteur dominant qui a annoncé la fonctionnalité). Au moins 30 % de tes recherches doivent viser l'invalidation.

## Livrables (chemins dans ta consigne)
1. `DD-<id>.md` — fiche de décision, sections obligatoires :
   1. ICP précis ; utilisateur ; prescripteur ; décideur économique ; sponsor ; objections ; contexte d'achat.
   2. Job-to-be-Done et workflow actuel pas à pas ; pourquoi c'est douloureux ; fréquence.
   3. Coût de l'inaction : formule + valeurs, chaque valeur étiquetée (observé/estimé/hypothèse).
   4. Concurrents directs, indirects, substituts (Excel, prestataires, travail manuel, outil public gratuit) : positionnement, prix SOURCÉ ou « inconnu », limites, plaintes.
   5. Différenciation : wedge hyper-spécifique, time-to-value, ROI mesurable, raison de changer.
   6. Taille de marché bottom-up : nombre d'acheteurs (sourcé si possible) × prix × pénétration ; TAM/SAM/SOM en fourchettes ; pas de TAM de cabinet comme vérité.
   7. Pricing recommandé + 2 alternatives ; qui signe ; exemple chiffré de ROI.
   8. Intrants du modèle économique : prix, COGS (IA, API, hébergement, support, onboarding), CAC plausible, cycle de vente, churn, payback — chacun étiqueté.
   9. Risques : sécurité, RGPD/HIPAA, accès aux données, responsabilité, réglementation (suspension/report ?), intégrations, fiabilité IA, dépendance plateforme, réaction des éditeurs en place.
   10. Distribution : canal 1 et 2, message commercial spécifique, comment obtenir 10 conversations d'acheteurs, premières ventes sans audience. Listes publiques de prospects ?
   11. Faisabilité : architecture MVP, intégrations indispensables, briques réutilisables, partie difficile, coût/temps approximatifs, dépendances critiques.
   12. Défendabilité à 2 ans ; ce qu'un LLM généraliste ou un gros éditeur pourrait commoditiser ; pourquoi le client resterait.
   13. Raisons de NE PAS le faire ; expériences qui invalideraient l'idée.
   14. Re-notation sur la grille (Douleur 20, Fréquence 10, Preuves 15, Distribution 15, Lacune 10, Faisabilité 10, Marge 5, Timing 5, Défendabilité 5, Risques 5),
       en notes de 0 à 10 par critère, avec la note de phase 1 rappelée et la cause de chaque changement.
2. `DD-<id>-concurrents.csv` — en-tête EXACT :
   `nom,type,url,marche,prix_observe,ce_qui_est_vendu,positionnement,source_prix,date_source,statut_verification,notes`
   (type : direct/indirect/substitut ; statut_verification : VÉRIFIÉ-extrait / PARTIEL / INCONNU)
3. `DD-<id>-preuves.csv` — en-tête EXACT :
   `id,opportunite_id,affirmation,url,titre,auteur_organisme,date_publication,date_consultation,extrait_ou_paraphrase,type,pertinence,fraicheur,confiance,sens`
   (sens : POUR / CONTRE / NEUTRE ; id : `DD-<id>-P01`…)

## Réponse finale
COURTE (< 250 mots) : chemins des fichiers, nouvelle note sur 100, les 3 preuves POUR et les 3 preuves CONTRE les plus fortes, verdict en une ligne.
