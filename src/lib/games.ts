import { getCollection, type CollectionEntry } from 'astro:content';

export type Game = CollectionEntry<'games'>;
export type GameStatus = Game['data']['status'];

export const STATUS: Record<GameStatus, { label: string; color: string }> = {
  'en-cours': { label: 'En cours', color: 'text-st-cours' },
  termine: { label: 'Terminé', color: 'text-st-fini' },
  '100': { label: '100 %', color: 'text-st-cent' },
  abandonne: { label: 'Abandonné', color: 'text-st-aband' },
  wishlist: { label: 'Wishlist', color: 'text-st-wish' },
};

export async function getGames(): Promise<Game[]> {
  const games = await getCollection('games');
  return games.sort((a, b) => a.data.name.localeCompare(b.data.name, 'fr'));
}

const time = (d?: Date) => d?.getTime() ?? 0;

/** Jeux classés dans mon top, du 1er au dernier. */
export const topGames = (games: Game[]) =>
  games
    .filter((g) => g.data.topRank !== undefined)
    .sort((a, b) => (a.data.topRank ?? 0) - (b.data.topRank ?? 0));

/** Jeux joués le plus récemment. */
export const recentlyPlayed = (games: Game[]) =>
  games.filter((g) => g.data.lastPlayedAt).sort((a, b) => time(b.data.lastPlayedAt) - time(a.data.lastPlayedAt));

/** Dernières notes données. */
export const latestRatings = (games: Game[]) =>
  games
    .filter((g) => g.data.rating !== undefined)
    .sort((a, b) => time(b.data.reviewedAt ?? b.data.finishedAt) - time(a.data.reviewedAt ?? a.data.finishedAt));

/** Pourcentage de succès débloqués, ou null si inconnu. */
export function completion(game: Game): number | null {
  const a = game.data.achievements;
  return a ? Math.round((a.unlocked / a.total) * 100) : null;
}

/** Jeux suivis pour le 100 %, du plus avancé au moins avancé (hors abandons). */
export const completionHunt = (games: Game[]) =>
  games
    .filter((g) => g.data.achievements && g.data.status !== 'abandonne')
    .sort((a, b) => (completion(b) ?? 0) - (completion(a) ?? 0));

/** Jaquette : image personnalisée, sinon jaquette Steam, sinon rien. */
export function coverUrl(game: Game): string | undefined {
  if (game.data.cover) return game.data.cover;
  if (game.data.steamAppId)
    return `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.data.steamAppId}/library_600x900.jpg`;
  return undefined;
}

export const formatRating = (r?: number) => (r === undefined ? '—' : String(r).replace('.', ','));

const dateFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
export const formatDate = (d?: Date) => (d ? dateFmt.format(d) : '—');

const rtf = new Intl.RelativeTimeFormat('fr-FR', { numeric: 'auto' });
/** « aujourd'hui », « il y a 3 jours »… calculé au moment du build (toutes les 30 min). */
export function timeAgo(d: Date, now = new Date()): string {
  const days = Math.round((d.getTime() - now.getTime()) / 86_400_000);
  if (Math.abs(days) < 7) return rtf.format(days, 'day');
  if (Math.abs(days) < 30) return rtf.format(Math.round(days / 7), 'week');
  if (Math.abs(days) < 365) return rtf.format(Math.round(days / 30), 'month');
  return rtf.format(Math.round(days / 365), 'year');
}

const dayFmt =new Intl.DateTimeFormat('fr-FR', { day: '2-digit' });
const monthFmt = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
export const dayMonth = (d: Date) => ({ day: dayFmt.format(d), month: monthFmt.format(d) });
