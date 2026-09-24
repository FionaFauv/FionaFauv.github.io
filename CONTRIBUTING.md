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
- Nom : `feature/<n>-nom-en-kebab-case`, où `<n>` est le numéro de l'Issue : `feature/4-integration-youtube`, `feature/12-page-discord`.

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
   Le workflow [CI](.github/workflows/ci.yml) relance ces vérifications sur la PR : tant que le check « Vérifications » n'est pas vert, la fusion est bloquée.
5. **Seule FionaFauv accepte la PR, depuis GitHub.** Personne d'autre ne merge, même en local.
6. PR acceptée : supprimer la branche juste après, puis fermer l'Issue.
   ```sh
   git checkout dev
   git pull
   git branch -d feature/nom-fonctionnalite
   git push origin --delete feature/nom-fonctionnalite   # inutile si GitHub l'a déjà supprimée
   gh issue close <n> --reason completed --comment "Livrée dans dev via #<PR>."
   ```

La mise en production (`dev` → `main`) passe aussi par une PR, validée par FionaFauv.

## Issues

Chaque tâche commence par une Issue, créée à partir d'un modèle (les Issues vierges sont désactivées) :

| Modèle         | Label     | Pour                                              |
| -------------- | --------- | ------------------------------------------------- |
| Fonctionnalité | `feature` | Une nouvelle fonctionnalité : objectif, à faire, terminé quand |
| Bug            | `bug`     | Quelque chose ne marche pas : constat, attendu, étapes |
| Contenu        | `contenu` | Un jeu, un avis ou un texte à ajouter ou modifier |

Les labels `technique` (outillage, CI, dépendances) et `documentation` s'ajoutent à la main.
Chaque Issue est rattachée à une **milestone** (une étape de la feuille de route).

Le lien Issue ↔ branche ↔ PR :

1. Issue **#12** « Page Discord »
2. Branche `feature/12-page-discord`, créée depuis `dev`
3. PR vers `dev` avec `Closes #12` dans la description : l'Issue et la PR sont liées
4. PR fusionnée : l'Issue #12 est fermée à la main (étape 6 du cycle)

GitHub ne ferme automatiquement une Issue via `Closes #n` que si la PR est fusionnée dans la branche par défaut (`main`). Nos PR visent `dev`, d'où la fermeture manuelle.

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
