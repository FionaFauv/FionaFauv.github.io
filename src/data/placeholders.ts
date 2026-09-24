/**
 * Données provisoires, en attendant les intégrations API (étape 2).
 * Chaque bloc sera remplacé par une fonction qui interroge l'API correspondante
 * pendant le build, en gardant les mêmes types pour ne pas toucher aux pages.
 */

export interface Video {
  title: string;
  url: string;
  publishedAt: Date;
  duration: string;
  thumbnail?: string;
}

export interface Stream {
  title: string;
  url: string;
  streamedAt: Date;
  duration: string;
  thumbnail?: string;
}

export interface LiveStatus {
  isLive: boolean;
  title?: string;
  game?: string;
}

export interface DiscordSnapshot {
  serverName: string;
  onlineCount: number;
  memberCount?: number;
  /** `members` est vide quand les pseudos sont masqués (DISCORD_SHOW_NAMES) : seul `count` s'affiche. */
  voiceChannels: { name: string; count: number; members: string[] }[];
  /** Vide quand les pseudos sont masqués. */
  onlineMembers: { name: string; status: 'online' | 'idle' | 'dnd'; activity?: string }[];
  /** Données d'exemple (pas de DISCORD_GUILD_ID). */
  sample?: boolean;
}

// Utilisé quand YOUTUBE_API_KEY est absente (voir src/lib/youtube.ts).
export const VIDEOS: Video[] = [
  { title: "Vidéo d'exemple n° 1", url: 'https://www.youtube.com/', publishedAt: new Date('2026-09-18'), duration: '18:42' },
  { title: "Vidéo d'exemple n° 2", url: 'https://www.youtube.com/', publishedAt: new Date('2026-09-09'), duration: '24:05' },
  { title: "Vidéo d'exemple n° 3", url: 'https://www.youtube.com/', publishedAt: new Date('2026-08-28'), duration: '11:30' },
];

// Remplacé par l'API Twitch Helix (TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET).
export const STREAMS: Stream[] = [
  { title: "Rediffusion d'exemple n° 1", url: 'https://www.twitch.tv/', streamedAt: new Date('2026-09-11'), duration: '3:12:40' },
  { title: "Rediffusion d'exemple n° 2", url: 'https://www.twitch.tv/', streamedAt: new Date('2026-09-04'), duration: '2:48:09' },
];

export const LIVE: LiveStatus = { isLive: false };

// Utilisé quand DISCORD_GUILD_ID est absent (voir src/lib/discord.ts).
export const DISCORD: DiscordSnapshot = {
  serverName: "Le QG (nom d'exemple)",
  onlineCount: 4,
  memberCount: 12,
  voiceChannels: [
    { name: 'Chill', count: 2, members: ['Fiona', 'Lucas'] },
    { name: 'Coop', count: 0, members: [] },
  ],
  onlineMembers: [
    { name: 'Fiona', status: 'online', activity: 'Hollow Knight' },
    { name: 'Lucas', status: 'online' },
    { name: 'Sam', status: 'idle' },
    { name: 'Inès', status: 'online', activity: 'Balatro' },
  ],
  sample: true,
};
