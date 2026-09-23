import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const GAME_STATUSES = ['en-cours', 'termine', '100', 'abandonne', 'wishlist'] as const;

/**
 * Une fiche par jeu dans src/content/games/<slug>.md.
 * Le frontmatter décrit le jeu, le corps Markdown contient l'avis détaillé.
 * Les champs Steam (succès, temps de jeu) sont remplis à la main pour l'instant ;
 * à l'étape 2 ils viendront de l'API Steam grâce à `steamAppId`.
 */
const games = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/games',
    // L'URL /jeux/<slug> utilise le champ `slug` du frontmatter.
    generateId: ({ entry, data }) =>
      typeof data.slug === 'string' ? data.slug : entry.replace(/\.md$/, ''),
  }),
  schema: z
    .object({
      name: z.string().min(1),
      slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Le slug doit être en minuscules avec des tirets (ex. hollow-knight).'),
      status: z.enum(GAME_STATUSES),
      /** Note sur 10, demi-points autorisés. */
      rating: z.number().min(0).max(10).multipleOf(0.5).optional(),
      /** Avis court, affiché dans les listes. L'avis long va dans le corps Markdown. */
      review: z.string().optional(),
      startedAt: z.coerce.date().optional(),
      finishedAt: z.coerce.date().optional(),
      lastPlayedAt: z.coerce.date().optional(),
      /** Date à laquelle la note a été donnée, pour « Dernières notes ». */
      reviewedAt: z.coerce.date().optional(),
      /** Place dans mon top (1 = préféré). */
      topRank: z.number().int().positive().optional(),
      steamAppId: z.number().int().positive().optional(),
      achievements: z
        .object({
          unlocked: z.number().int().min(0),
          total: z.number().int().positive(),
        })
        .refine((a) => a.unlocked <= a.total, 'unlocked ne peut pas dépasser total.')
        .optional(),
      playtimeHours: z.number().min(0).optional(),
      /** Jaquette personnalisée. Sans elle, on prend celle de Steam si steamAppId est renseigné. */
      cover: z.url().optional(),
    })
    .refine((g) => !g.startedAt || !g.finishedAt || g.startedAt <= g.finishedAt, {
      message: 'finishedAt doit être postérieure à startedAt.',
      path: ['finishedAt'],
    }),
});

export const collections = { games };
