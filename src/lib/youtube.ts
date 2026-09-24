import { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } from 'astro:env/server';
import { VIDEOS, type Video } from '../data/placeholders';
import { VIDEO_CATALOG } from '../data/videos';

/**
 * Vidéos YouTube, récupérées au build via l'API YouTube Data v3. Deux sources, fusionnées :
 * - le catalogue `VIDEO_CATALOG` (src/data/videos.ts) : vidéos choisies une par une,
 *   y compris non répertoriées (l'API les renvoie quand on donne leur ID) ;
 * - les vidéos publiques de la chaîne, si YOUTUBE_CHANNEL_ID est défini.
 *
 * Sans clé API (build local sans `.env`, CI des PR) : données provisoires.
 * Avec la clé, une erreur d'API fait échouer le build : le site en ligne garde
 * la version précédente au lieu d'afficher des vidéos d'exemple.
 *
 * Les vidéos privées ne remontent jamais. Coût : 1 à 2 unités de quota par build, sur 10 000 par jour.
 */

const API = 'https://www.googleapis.com/youtube/v3';
const MAX_CHANNEL_VIDEOS = 25;

export const hasYouTube = Boolean(YOUTUBE_API_KEY && (YOUTUBE_CHANNEL_ID || VIDEO_CATALOG.length > 0));

interface PlaylistItemsResponse {
  items: { contentDetails: { videoId: string } }[];
}

interface Thumbnail {
  url: string;
}

interface VideosResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      publishedAt: string;
      liveBroadcastContent: 'none' | 'live' | 'upcoming';
      thumbnails: Partial<Record<'default' | 'medium' | 'high' | 'standard' | 'maxres', Thumbnail>>;
    };
    contentDetails: { duration: string };
    status: { privacyStatus: 'public' | 'unlisted' | 'private' };
  }[];
}

async function call<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${API}/${endpoint}`);
  url.search = new URLSearchParams({ ...params, key: YOUTUBE_API_KEY! }).toString();
  const res = await fetch(url);
  if (!res.ok) {
    // Le corps d'erreur de Google ne contient pas la clé ; l'URL, si : on ne la logue pas.
    throw new Error(`YouTube ${endpoint} : HTTP ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

/** Durée ISO 8601 (`PT1H2M3S`) vers `1:02:03`, ou `18:42` sous l'heure. */
export function formatDuration(iso: string): string {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return '';
  const [, d = '0', h = '0', min = '0', s = '0'] = m;
  const hours = Number(d) * 24 + Number(h);
  const pad = (n: string) => n.padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(min)}:${pad(s)}` : `${Number(min)}:${pad(s)}`;
}

/** ID de 11 caractères depuis une URL YouTube (watch, youtu.be, shorts, live, embed) ou un ID brut. */
export function videoId(entry: string): string | undefined {
  const m = /(?:v=|youtu\.be\/|\/(?:shorts|live|embed)\/)([\w-]{11})|^([\w-]{11})$/.exec(entry.trim());
  return m?.[1] ?? m?.[2];
}

async function channelVideoIds(): Promise<string[]> {
  if (!YOUTUBE_CHANNEL_ID) return [];
  // La playlist « uploads » d'une chaîne a le même ID, préfixe UC remplacé par UU.
  // Avec une simple clé API, elle ne contient que les vidéos publiques.
  const playlist = await call<PlaylistItemsResponse>('playlistItems', {
    part: 'contentDetails',
    playlistId: YOUTUBE_CHANNEL_ID.replace(/^UC/, 'UU'),
    maxResults: String(MAX_CHANNEL_VIDEOS),
  });
  return playlist.items.map((i) => i.contentDetails.videoId);
}

async function fetchVideos(): Promise<Video[]> {
  if (!hasYouTube) return VIDEOS;

  const catalog = VIDEO_CATALOG.map((entry) => {
    const id = videoId(entry);
    if (!id) throw new Error(`src/data/videos.ts : « ${entry} » n'est ni une URL YouTube ni un ID de vidéo.`);
    return id;
  });
  const ids = [...new Set([...catalog, ...(await channelVideoIds())])];
  if (ids.length === 0) return [];

  // videos.list accepte 50 ID par appel.
  const items: VideosResponse['items'] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const page = await call<VideosResponse>('videos', {
      part: 'snippet,contentDetails,status',
      id: ids.slice(i, i + 50).join(','),
    });
    items.push(...page.items);
  }

  // Une vidéo du catalogue absente de la réponse est privée ou supprimée : on prévient sans casser le build.
  const found = new Set(items.map((v) => v.id));
  for (const id of catalog.filter((id) => !found.has(id))) {
    console.warn(`[youtube] Vidéo ${id} introuvable (privée ou supprimée) : ignorée.`);
  }

  return items
    .filter((v) => v.status.privacyStatus !== 'private' && v.snippet.liveBroadcastContent === 'none')
    .map((v) => {
      const t = v.snippet.thumbnails;
      return {
        title: v.snippet.title,
        url: `https://www.youtube.com/watch?v=${v.id}`,
        publishedAt: new Date(v.snippet.publishedAt),
        duration: formatDuration(v.contentDetails.duration),
        thumbnail: (t.maxres ?? t.standard ?? t.high ?? t.medium ?? t.default)?.url,
      };
    })
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

// Un seul appel par build, partagé entre les pages (accueil, /videos).
let cache: Promise<Video[]> | undefined;
export const getVideos = () => (cache ??= fetchVideos());
