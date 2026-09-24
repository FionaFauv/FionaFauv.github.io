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
  /** Rediffusion (supprimée par Twitch après 7 à 60 jours), temps fort ou vidéo mise en ligne. */
  kind?: 'archive' | 'highlight' | 'upload';
}

export interface LiveStatus {
  isLive: boolean;
  title?: string;
  game?: string;
  /** Prochain live du planning Twitch, s'il y en a un. */
  next?: { startAt: Date; title?: string; game?: string };
}

export interface DiscordSnapshot {
  serverName: string;
  onlineCount: number;
  memberCount?: number;
  voiceChannels: { name: string; members: string[] }[];
  onlineMembers: { name: string; status: 'online' | 'idle' | 'dnd'; activity?: string }[];
}

// Utilisé quand YOUTUBE_API_KEY est absente (voir src/lib/youtube.ts).
export const VIDEOS: Video[] = [
  { title: "Vidéo d'exemple n° 1", url: 'https://www.youtube.com/', publishedAt: new Date('2026-09-18'), duration: '18:42' },
  { title: "Vidéo d'exemple n° 2", url: 'https://www.youtube.com/', publishedAt: new Date('2026-09-09'), duration: '24:05' },
  { title: "Vidéo d'exemple n° 3", url: 'https://www.youtube.com/', publishedAt: new Date('2026-08-28'), duration: '11:30' },
];

// Utilisés quand TWITCH_CLIENT_ID ou TWITCH_CLIENT_SECRET est absent (voir src/lib/twitch.ts).
export const STREAMS: Stream[] = [
  { title: "Rediffusion d'exemple n° 1", url: 'https://www.twitch.tv/', streamedAt: new Date('2026-09-11'), duration: '3:12:40' },
  { title: "Rediffusion d'exemple n° 2", url: 'https://www.twitch.tv/', streamedAt: new Date('2026-09-04'), duration: '2:48:09' },
];

export const LIVE: LiveStatus = { isLive: false };

// Remplacé par le widget du serveur Discord (DISCORD_GUILD_ID, DISCORD_INVITE_URL).
export const DISCORD: DiscordSnapshot = {
  serverName: "Le QG (nom d'exemple)",
  onlineCount: 4,
  memberCount: 12,
  voiceChannels: [
    { name: 'Chill', members: ['Fiona', 'Lucas'] },
    { name: 'Coop', members: [] },
  ],
  onlineMembers: [
    { name: 'Fiona', status: 'online', activity: 'Hollow Knight' },
    { name: 'Lucas', status: 'online' },
    { name: 'Sam', status: 'idle' },
    { name: 'Inès', status: 'online', activity: 'Balatro' },
  ],
};
