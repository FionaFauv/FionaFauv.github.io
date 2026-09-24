import { STEAM_API_KEY, STEAM_ID } from 'astro:env/server';

/**
 * Temps de jeu, dernière session et succès Steam, récupérés au build via la Steam Web API.
 * Seuls les jeux qui ont un `steamAppId` dans leur fiche sont concernés.
 *
 * - Sans STEAM_API_KEY / STEAM_ID (build local sans `.env`, CI des PR) : rien, les fiches
 *   gardent leurs valeurs du frontmatter.
 * - Avec les clés, une erreur d'API fait échouer le build : le site en ligne garde la version
 *   précédente. Exceptions normales, sans erreur : jeu sans succès, jeu absent de la bibliothèque.
 * - Le profil Steam doit avoir « Détails des jeux » en public, sinon Steam ne renvoie rien.
 *
 * Coût : 1 appel pour la bibliothèque + 1 par jeu avec steamAppId.
 */

const API = 'https://api.steampowered.com';

export const hasSteam = Boolean(STEAM_API_KEY && STEAM_ID);

export interface SteamStats {
  playtimeHours?: number;
  lastPlayedAt?: Date;
  achievements?: { unlocked: number; total: number };
}

// L'URL contient la clé : les erreurs ne loguent que le statut HTTP.
const call = (path: string, params: Record<string, string>) =>
  fetch(`${API}/${path}?${new URLSearchParams({ ...params, key: STEAM_API_KEY!, steamid: STEAM_ID!, format: 'json' })}`);

interface OwnedGame {
  appid: number;
  /** En minutes. */
  playtime_forever: number;
  /** Timestamp Unix, 0 si jamais lancé. */
  rtime_last_played: number;
}

async function ownedGames(): Promise<Map<number, OwnedGame>> {
  const res = await call('IPlayerService/GetOwnedGames/v1/', { include_played_free_games: '1' });
  if (!res.ok) throw new Error(`Steam GetOwnedGames : HTTP ${res.status}`);
  const { games } = ((await res.json()) as { response: { games?: OwnedGame[] } }).response;
  if (!games) console.warn('[steam] Bibliothèque vide ou privée : passe « Détails des jeux » en public sur ton profil Steam.');
  return new Map((games ?? []).map((g) => [g.appid, g]));
}

async function achievements(appId: number): Promise<SteamStats['achievements']> {
  const res = await call('ISteamUserStats/GetPlayerAchievements/v1/', { appid: String(appId) });
  // 400 = jeu sans succès ou pas possédé ; 403 = profil privé. Pas une erreur de build.
  if (res.status === 400) return undefined;
  if (res.status === 403) {
    console.warn(`[steam] Succès de ${appId} inaccessibles : profil ou « Détails des jeux » privé.`);
    return undefined;
  }
  if (!res.ok) throw new Error(`Steam GetPlayerAchievements (${appId}) : HTTP ${res.status}`);
  const list = ((await res.json()) as { playerstats: { achievements?: { achieved: 0 | 1 }[] } }).playerstats.achievements;
  if (!list?.length) return undefined;
  return { unlocked: list.filter((a) => a.achieved === 1).length, total: list.length };
}

async function fetchStats(appIds: number[]): Promise<Map<number, SteamStats>> {
  const stats = new Map<number, SteamStats>();
  if (!hasSteam || appIds.length === 0) return stats;

  const library = await ownedGames();
  const results = await Promise.all(appIds.map(async (id) => [id, await achievements(id)] as const));

  for (const [id, ach] of results) {
    const owned = library.get(id);
    if (!owned && !ach) {
      console.warn(`[steam] Jeu ${id} absent de la bibliothèque : valeurs du frontmatter conservées.`);
      continue;
    }
    stats.set(id, {
      // Steam compte en minutes ; arrondi à l'heure (demi-heure sous 10 h).
      playtimeHours: owned ? roundHours(owned.playtime_forever / 60) : undefined,
      lastPlayedAt: owned?.rtime_last_played ? new Date(owned.rtime_last_played * 1000) : undefined,
      achievements: ach,
    });
  }
  return stats;
}

export const roundHours = (h: number) => (h < 10 ? Math.round(h * 2) / 2 : Math.round(h));

// Un seul jeu d'appels par build, partagé entre toutes les pages.
let cache: Promise<Map<number, SteamStats>> | undefined;
export const getSteamStats = (appIds: number[]) => (cache ??= fetchStats(appIds));
