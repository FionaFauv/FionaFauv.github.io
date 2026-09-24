/** Pousses façon Pikmin (src/components/Sprout.astro) : stade et couleur. */

export type SproutStage = 'leaf' | 'bud' | 'flower';
export type SproutColor = 'red' | 'yellow' | 'blue' | 'purple' | 'white';

/** Couleurs dans l'ordre, pour varier une rangée de pousses. */
export const SPROUT_COLORS: SproutColor[] = ['red', 'yellow', 'blue', 'purple', 'white'];

/** Avancement vers le 100 % : feuille sous 50 %, bourgeon ensuite, fleur à 100 %. */
export function sproutStage(pct: number): SproutStage {
  if (pct >= 100) return 'flower';
  return pct >= 50 ? 'bud' : 'leaf';
}
