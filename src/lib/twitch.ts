import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from 'astro:env/server';
import { SOCIALS } from '../config/site';
import { LIVE, STREAMS, type LiveStatus, type Stream } from '../data/placeholders';

/**
 * Live, planning et vidéos Twitch, récupérés au build via l'API Helix (jeton d'application).
 *
 * - La chaîne vient du lien Twitch de `SOCIALS` (src/config/site.ts).
 * - Sans TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET (build local sans `.env`, CI des PR) : données provisoires.
 * - Avec les clés, une erreur d'API fait échouer le build : le site en ligne garde la version
 *   précédente. Seule exception : pas de planning (404), ce qui est normal.
 *
 * Le statut live date du dernier build (toutes les 30 min, parfois plus tard).
 */

const API = 'https://api.twitch.tv/helix';
const MAX_VIDEOS = 12;

const twitchHref = SOCIALS.find((s) => s.id === 'twitch')?.href;
export const twitchLogin = twitchHref && /twitch\.tv\/([\w]+)/i.exec(twitchHref)?.[1]?.toLowerCase();
export const hasTwitch = Boolean(TWITCH_CLIENT_ID && TWITCH_CLIENT_SECRET && twitchLogin);

export interface TwitchData {
  live: LiveStatus;
  streams: Stream[];
}

interface HelixVideo {
  title: string;
  url: string;
  created_at: string;
  duration: string;
  thumbnail_url: string;
  type: 'archive' | 'highlight' | 'upload';
}

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function appToken(): Promise<string> {
  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID!,
      client_secret: TWITCH_CLIENT_SECRET!,
      grant_type: 'client_credentials',
    }),
  });
  if (!res.ok) throw new Error(`Twitch token : HTTP ${res.status} ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

async function helix<T>(token: string, endpoint: string, params: Record<string, string>): Promise<T> {
  const res = await fetch(`${API}/${endpoint}?${new URLSearchParams(params)}`, {
    headers: { 'Client-Id': TWITCH_CLIENT_ID!, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new HttpError(res.status, `Twitch ${endpoint} : HTTP ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** Durée Twitch (`3h12m40s`, `45m3s`) vers `3:12:40` ou `45:03`. */
export function formatTwitchDuration(d: string): string {
  const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(d);
  if (!m) return '';
  const [, h, min = '0', s = '0'] = m;
  const pad = (n: string) => n.padStart(2, '0');
  return h ? `${h}:${pad(min)}:${pad(s)}` : `${Number(min)}:${pad(s)}`;
}

// Le build tourne en UTC sur GitHub : on force l'heure de Paris.
const nextFmt = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Europe/Paris',
});
/** « jeudi 26 septembre à 20:30 ». */
export const formatNextLive = (d: Date) => nextFmt.format(d);

async function fetchTwitch(): Promise<TwitchData> {
  if (!hasTwitch) return { live: LIVE, streams: STREAMS };

  const token = await appToken();
  const users = await helix<{ data: { id: string }[] }>(token, 'users', { login: twitchLogin! });
  const userId = users.data[0]?.id;
  if (!userId) throw new Error(`Twitch : chaîne « ${twitchLogin} » introuvable (lien Twitch de src/config/site.ts).`);

  const [streams, videos, schedule] = await Promise.all([
    helix<{ data: { title: string; game_name: string }[] }>(token, 'streams', { user_id: userId }),
    helix<{ data: HelixVideo[] }>(token, 'videos', { user_id: userId, first: String(MAX_VIDEOS), sort: 'time' }),
    helix<{ data: { segments: { start_time: string; title: string; category: { name: string } | null }[] | null } }>(
      token,
      'schedule',
      { broadcaster_id: userId, first: '1' },
    ).catch((err: unknown) => {
      if (err instanceof HttpError && err.status === 404) return null; // pas de planning
      throw err;
    }),
  ]);

  const current = streams.data[0];
  const segment = schedule?.data.segments?.[0];
  return {
    live: {
      isLive: Boolean(current),
      title: current?.title,
      game: current?.game_name || undefined,
      next: segment && {
        startAt: new Date(segment.start_time),
        title: segment.title || undefined,
        game: segment.category?.name,
      },
    },
    streams: videos.data.map((v) => ({
      title: v.title,
      url: v.url,
      streamedAt: new Date(v.created_at),
      duration: formatTwitchDuration(v.duration),
      // Vide tant que Twitch traite la rediffusion ; sinon gabarit %{width}x%{height}.
      thumbnail: v.thumbnail_url ? v.thumbnail_url.replace('%{width}', '640').replace('%{height}', '360') : undefined,
      kind: v.type,
    })),
  };
}

// Un seul jeu d'appels par build, partagé entre les pages et le menu latéral.
let cache: Promise<TwitchData> | undefined;
export const getTwitch = () => (cache ??= fetchTwitch());
