# FionaFauv.github.io

Hub perso de FionaFauv : vidéos YouTube, lives Twitch, jeux Steam (top, chasse au 100 %, avis) et serveur Discord privé. Ton perso, entre potes : pas de partie « pro », pas de page de présentation.

Site statique, hébergé sur GitHub Pages à https://FionaFauv.github.io, reconstruit toutes les 30 min par GitHub Actions.

## Stack

- Astro 7, TypeScript `strict` (`astro/tsconfigs/strict`)
- Tailwind CSS v4 via `@tailwindcss/vite` (pas de `tailwind.config`, tout est dans `src/styles/global.css`)
- Content Collections : loader `glob` depuis `astro/loaders`, schéma avec `z` depuis `astro/zod` (zod v4)
- Déploiement : `.github/workflows/deploy.yml` avec les actions officielles `configure-pages`, `upload-pages-artifact`, `deploy-pages`
- CI : `.github/workflows/ci.yml` lance `astro check` et le build sur chaque PR vers `dev` ou `main` (check « Vérifications », obligatoire pour fusionner)

## Structure

- `src/config/site.ts` : **fichier unique** pour le nom, l'accroche, les URLs des réseaux et le menu
- `src/content.config.ts` : collection `games` et son schéma
- `src/content/games/<slug>.md` : une fiche par jeu (frontmatter + avis en Markdown)
- `src/lib/games.ts` : libellés de statut, tris (top, joués récemment, dernières notes, chasse au 100 %), formats de date
- `src/data/placeholders.ts` : types `Video`, `Stream`, `LiveStatus`, `DiscordSnapshot` et données provisoires, utilisées quand les clés API sont absentes
- `src/data/videos.ts` : `VIDEO_PLAYLISTS` (playlists dont toutes les vidéos s'affichent) et `VIDEO_CATALOG` (vidéos à l'unité), URL ou ID, y compris non répertoriées
- `src/lib/youtube.ts` : `getVideos()` (playlists + catalogue + vidéos publiques de la chaîne, un seul appel par build), `hasYouTube`
- `src/lib/twitch.ts` : `getTwitch()` → `{ live, streams }` (statut live, prochain live du planning, rediffusions / temps forts / vidéos), chaîne tirée du lien Twitch de `SOCIALS`, `hasTwitch`
- `src/layouts/BaseLayout.astro` : layout commun (menu latéral, barre mobile, pied de page, thème)
- `src/components/` : Sidebar, Footer, ThemeToggle, Icon, StatusBadge, CompletionBar, GameCover, TopList, HuntList, DiscordWidget, SectionHeader, PageHeader, VideoThumb
- `src/pages/` : `/`, `/videos`, `/streams`, `/jeux`, `/jeux/[slug]`, `/discord`, `/reseaux`, `404`

## Conventions

- Textes du site en français, tutoiement, ton décontracté.
- Couleurs : uniquement via les variables de `global.css` (`bg-bg`, `text-ink`, `text-muted`, `border-line`, `text-accent`, `text-st-*`…). Pas de couleur en dur dans les composants, sinon le mode sombre casse.
- Thème : clair par défaut, sombre selon `prefers-color-scheme`, forçable par le bouton (`data-theme` sur `<html>`, mémorisé dans `localStorage`).
- Mobile d'abord : styles de base pour mobile, puis `sm:`, `lg:` (menu latéral fixe à partir de `lg`), `xl:`.
- Statuts de jeu : `en-cours`, `termine`, `100`, `abandonne`, `wishlist`. Libellés et couleurs dans `STATUS` (`src/lib/games.ts`).
- L'URL d'un jeu vient du champ `slug` du frontmatter (`/jeux/<slug>/`).
- Aucune clé API dans le code ni dans git. Les clés vont dans `.env` (local, ignoré) et dans les secrets GitHub (CI). `.env.example` liste les variables.
- Variables d'env : déclarées dans `env.schema` d'`astro.config.mjs` (toutes facultatives), lues via `astro:env/server`. Sans clé : données provisoires. Avec clé, une erreur d'API fait échouer le build (le site en ligne garde la version précédente).
- Pas de `base` dans `astro.config.mjs` : c'est un site utilisateur servi à la racine.

## Workflow Git (règles strictes)

Détail complet dans [CONTRIBUTING.md](CONTRIBUTING.md). En résumé :

- `main` : production (déployée sur GitHub Pages). `dev` : intégration. On ne commit jamais directement sur l'une ou l'autre.
- Une fonctionnalité = une Issue = une branche temporaire `feature/<n>-nom` (`<n>` = numéro de l'Issue), créée depuis `dev`.
- PR `feature/...` → `dev` uniquement quand la fonctionnalité est totalement terminée, avec `Closes #<n>` dans la description.
- Seule FionaFauv accepte les PR, depuis GitHub. Ne jamais merger soi-même : attendre sa validation.
- PR acceptée = branche supprimée juste après (locale et distante), puis Issue fermée à la main (`Closes #n` ne ferme rien quand la PR vise `dev`, seulement `main`).
- Commits automatiques, sans demander, avec un message détaillé (quoi, où, pourquoi).

## Commandes

```sh
npm install          # installer les dépendances
npm run dev          # serveur local sur http://localhost:4321
npx astro dev --background   # serveur en arrière-plan (astro dev stop / status / logs)
npm run build        # build de production dans dist/
npm run preview      # prévisualiser le build
npx astro check      # vérification TypeScript des fichiers .astro
```

## Ajouter un jeu

Créer `src/content/games/<slug>.md` :

```md
---
name: "Hades"
slug: "hades"
status: "en-cours"        # en-cours | termine | 100 | abandonne | wishlist
rating: 9.5               # facultatif, 0 à 10, demi-points
review: "Avis court."     # facultatif
startedAt: 2026-06-06     # facultatif
finishedAt: 2026-09-20    # facultatif
lastPlayedAt: 2026-09-20  # facultatif, pour « Derniers jeux joués »
reviewedAt: 2026-09-20    # facultatif, pour « Dernières notes »
topRank: 3                # facultatif, place dans le top
steamAppId: 1145360       # facultatif, jaquette Steam + données Steam (étape 2)
achievements: { unlocked: 20, total: 49 }  # facultatif
playtimeHours: 40         # facultatif
---

Avis détaillé en Markdown.
```

## Feuille de route

- Étape 1 (faite) : squelette, pages provisoires, collection `games`, déploiement.
- Étape 2 : intégrations API au build : YouTube (vidéos, fait), Twitch (live, planning, rediffusions, fait), Steam (bibliothèque, temps de jeu, succès via `steamAppId`), Discord (widget du serveur). Décommenter le bloc `env` du workflow.

## Documentation Astro

https://docs.astro.build : routing, content collections, styling/Tailwind.
