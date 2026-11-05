# 15 — Propriété intellectuelle et licences

Ce document est un inventaire technique, **pas un avis juridique** — **LEGAL REVIEW REQUIRED**.

## Dépendances npm (audit du 2026-11-05, arbre complet installé)

| Licence | Nombre de paquets | Compatible usage commercial fermé ? |
|---|---|---|
| MIT | 155 | Oui (conserver les mentions) |
| ISC | 14 | Oui |
| Apache-2.0 | 3 | Oui (mentions, NOTICE éventuels) |
| BSD-2-Clause / BSD-3-Clause | 4 | Oui |
| 0BSD | 1 | Oui |
| CC-BY-4.0 | 1 (`caniuse-lite`, données du build, non livrées dans l’application) | Oui (attribution) |
| **Total** | **178** | **Aucune licence copyleft (GPL/AGPL) ni inconnue** |

Outils de QA téléchargés en CI seulement (non distribués) : Playwright (Apache-2.0), axe-core (MPL-2.0).

## Code

- Code applicatif écrit pour Relanzio. Commits signés par le compte GitHub du fondateur et, pour une partie, produits avec
  des assistants de programmation IA (Claude, attribution « Co-Authored-By » dans les messages de commit ; branche `codex/…`).
  **À faire vérifier** : titularité des droits sur le code généré avec assistance IA et conditions d’utilisation des outils
  utilisés — **LEGAL REVIEW REQUIRED**.
- Aucun code copié d’un projet tiers n’a été identifié (pas d’en-tête de licence tierce dans `server/`, `client/`, `shared/`).
  Incertitude : un audit automatisé de similarité de code n’a pas été réalisé.
- `.claude/skills/` : fichiers d’aide au développement (non livrés dans l’application) d’origine tierce, licence MIT incluse
  (`.claude/skills/LICENSE-emil-kowalski`). Peuvent être retirés du dépôt cédé sans impact.

## Contenus et ressources

| Élément | Origine | Statut |
|---|---|---|
| Logo / nom « Relanzio » (texte stylé, `favicon.svg`) | Créé pour le projet | **Marque : dépôt INPI à vérifier — À confirmer** |
| `og-image.png` | Généré par `scripts/render-og-image.cjs` | Interne |
| Captures `docs/screenshots/` | Faux backend, données fictives | Interne |
| Polices | Aucune police livrée (pile système ; « Inter » seulement si installée sur l’appareil) | Pas de licence de police |
| Textes du site, CGU/CGV, confidentialité, DPA (`relanzio-dpa.pdf`) | Rédigés pour le projet | **Contenu juridique à faire relire** |
| Modèles d’emails (relances, prospection) | Rédigés pour le projet | Interne |
| `saas-opportunity-research/` | Recherches personnelles du fondateur sur d’autres projets, sans lien avec le produit | **À retirer du dépôt cédé** (hors périmètre de la vente) |

## Incertitudes explicites

1. Propriété des droits sur le code produit avec assistance IA.
2. Marque « Relanzio » : dépôt et classes à confirmer ; disponibilité du nom à vérifier.
3. Domaine `relanzio.com` : titulaire à confirmer.
4. Statut des contenus de la data room `saas-opportunity-research/` (hors cession).
