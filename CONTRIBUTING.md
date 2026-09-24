# Workflow Git

Règles strictes pour toute modification du repo.

## Branches

| Branche                     | Rôle                                                      | Durée de vie |
| --------------------------- | --------------------------------------------------------- | ------------ |
| `main`                      | Production, déployée sur https://FionaFauv.github.io      | Permanente   |
| `dev`                       | Intégration des fonctionnalités terminées                 | Permanente   |
| `feature/NomFonctionnalite` | Une seule fonctionnalité, créée depuis `dev`              | Temporaire   |

- On ne commit jamais directement sur `main` ni sur `dev`.
- **Une fonctionnalité = une branche.** Pas deux sujets dans la même branche.
- Nom en `kebab-case` après le préfixe : `feature/integration-youtube`, `feature/page-discord`.

## Cycle d'une fonctionnalité

1. Partir de `dev` à jour :
   ```sh
   git checkout dev
   git pull
   git checkout -b feature/nom-fonctionnalite
   ```
2. Travailler et commiter au fil de l'eau (voir « Commits »).
3. Pousser la branche : `git push -u origin feature/nom-fonctionnalite`.
4. Quand la fonctionnalité est **totalement terminée** (build OK, `npx astro check` OK), ouvrir une PR `feature/...` → `dev`.
5. **Seule FionaFauv accepte la PR, depuis GitHub.** Personne d'autre ne merge, même en local.
6. PR acceptée : supprimer la branche juste après.
   ```sh
   git checkout dev
   git pull
   git branch -d feature/nom-fonctionnalite
   git push origin --delete feature/nom-fonctionnalite
   ```

La mise en production (`dev` → `main`) passe aussi par une PR, validée par FionaFauv.

## Commits

Chaque commit décrit en détail ce qu'il change :

```
Titre court à l'impératif (≤ 72 caractères)

- fichier/ou/zone : ce qui a changé et pourquoi
- autre/fichier : ce qui a changé et pourquoi

Contexte, impact ou points d'attention si besoin.
```

## Pull requests

Le modèle [.github/pull_request_template.md](.github/pull_request_template.md) est prérempli à l'ouverture : objectif, liste des changements, vérifications faites.
