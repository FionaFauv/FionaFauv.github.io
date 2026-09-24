// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Site utilisateur GitHub Pages : servi à la racine, donc pas de `base`.
  site: 'https://FionaFauv.github.io',
  trailingSlash: 'ignore',
  // Variables lues au build (.env en local, secrets GitHub en CI). Toutes facultatives :
  // sans elles, le site se construit avec les données provisoires.
  env: {
    schema: {
      YOUTUBE_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      YOUTUBE_CHANNEL_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      STEAM_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      STEAM_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
