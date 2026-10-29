# Progress — étude d'opportunités SaaS (démarrée le 2026-10-29)

## Audit environnement (2026-10-29)
- [x] Modèle configuré : identifiant de session (non répété ici) ; WebSearch + WebFetch chargés et opérationnels
- [x] Python 3.13 disponible ; écriture fichiers OK ; sous-agents (Agent tool) disponibles
- [x] Founder Skill : NON installé comme skill/plugin. Archive `founder-skill-main.zip` fournie → extraite dans le scratchpad, 11 SKILL.md lus, 4 scripts Python audités (stdlib uniquement, aucun accès réseau). Méthodologie appliquée manuellement ; `unit_economics.py` exécuté sur intrants SaaS.
  - Installation officielle : `/plugin marketplace add Jakeschincariol/founder-skill` puis `/plugin install founder-skill@founder-skill` (commandes `/founder-skill:founder-*`), ou copie de `skills/founder-*` dans `~/.claude/skills/`.
- [x] Dépôt : Relanzio v0.4 (relance de devis TPE, pré-pilotes). Étude isolée dans `saas-opportunity-research/`.
- [ ] Serveurs MCP design/slack/notion… : échec de connexion (non nécessaires).

## Phases
- [x] Phase 1 — cartographie large : 31 familles, 206 opportunités, 246 preuves (5 analystes en parallèle)
- [ ] Phase 2 — collecte de preuves
- [x] Phase 3 (1re passe) — notation harmonisée de 38 pistes (`_work/scores-bruts.csv` → `03-classement-top20.csv`) ; top 5 : A-23, B-09, D-37, D-20, A-39
- [ ] Phase 4 — due diligence top 5 (défenseur + contradicteur)
- [ ] Phase 5 — recommandation, business model, MVP, plan 30 jours

## Limite réseau constatée (2026-10-29)
- WebSearch fonctionne (titres + URL + extraits). WebFetch / curl vers sites externes **bloqués** par la politique réseau de l'environnement
  (testés : economie.gouv.fr, impots.gouv.fr, eur-lex.europa.eu, gov.uk, reddit.com, g2.com, capterra.com).
- Conséquence : les preuves reposent sur les extraits renvoyés par le moteur ; aucune page n'a été lue en intégralité. Les preuves sont marquées en conséquence.
- Pour lever la limite : paramètres de l'environnement cloud → Network access → niveau plus large ou domaines autorisés. https://code.claude.com/docs/en/cloud-environments#network-access
