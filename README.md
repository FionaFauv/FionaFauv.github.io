# FionaFauv.github.io

Mon hub perso : vidéos, lives, jeux (top, chasse au 100 %, avis) et serveur Discord.
En ligne sur **https://FionaFauv.github.io**.

Fait avec [Astro](https://astro.build), TypeScript et Tailwind CSS, hébergé gratuitement sur GitHub Pages.

## Lancer le site en local

Prérequis : [Node.js](https://nodejs.org) 22.12 ou plus récent.

```sh
git clone https://github.com/FionaFauv/FionaFauv.github.io.git
cd FionaFauv.github.io
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:4321 et se recharge à chaque modification.

Autres commandes :

| Commande          | Effet                                        |
| ----------------- | -------------------------------------------- |
| `npm run build`   | Construit le site de production dans `dist/` |
| `npm run preview` | Affiche en local le site construit           |

### Variables d'environnement

Pas encore nécessaires (les API arrivent à l'étape 2). Plus tard :

```sh
cp .env.example .env
```

puis remplis `.env`. Ce fichier est ignoré par git : les clés ne doivent jamais être commitées.

## Activer GitHub Pages (une seule fois)

1. Sur GitHub, ouvre le repo **FionaFauv.github.io**.
2. Va dans **Settings > Pages**.
3. Dans **Build and deployment > Source**, choisis **GitHub Actions**.
4. Va dans l'onglet **Actions**, ouvre le workflow **Deploy to GitHub Pages** et clique sur **Run workflow** (ou pousse un commit sur `main`).

Le site est ensuite reconstruit et publié :

- à chaque push sur `main` ;
- automatiquement toutes les 30 minutes ;
- à la main depuis l'onglet Actions (**Run workflow**).

## Modifier le contenu

- **Liens des réseaux, nom, accroche** : `src/config/site.ts`
- **Jeux** : un fichier Markdown par jeu dans `src/content/games/` (voir les deux exemples)
