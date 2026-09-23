// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Site utilisateur GitHub Pages : servi à la racine, donc pas de `base`.
  site: 'https://FionaFauv.github.io',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
});
