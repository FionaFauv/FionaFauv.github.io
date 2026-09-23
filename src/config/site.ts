/**
 * Configuration unique du site : nom, textes et liens des réseaux.
 * Remplace les URLs ci-dessous par les tiennes, tout le site les reprend.
 */

export const SITE = {
  name: 'FionaFauv',
  tagline: 'Tout ce que je fais, au même endroit.',
  description:
    'Le hub de FionaFauv : vidéos YouTube, lives Twitch, jeux Steam, chasse au 100 % et serveur Discord.',
  url: 'https://FionaFauv.github.io',
  lang: 'fr',
} as const;

export type SocialId = 'youtube' | 'twitch' | 'tiktok' | 'instagram' | 'x' | 'discord' | 'steam';

export interface Social {
  id: SocialId;
  label: string;
  /** Ce qu'on trouve sur ce réseau, affiché sur la page « Mes réseaux ». */
  description: string;
  href: string;
}

export const SOCIALS: Social[] = [
  { id: 'youtube', label: 'YouTube', description: 'Les vidéos', href: 'https://www.youtube.com/@FionaFauv' },
  { id: 'twitch', label: 'Twitch', description: 'Les lives', href: 'https://www.twitch.tv/FionaFauv' },
  { id: 'tiktok', label: 'TikTok', description: 'Les clips', href: 'https://www.tiktok.com/@FionaFauv' },
  { id: 'instagram', label: 'Instagram', description: 'Photos et DM', href: 'https://www.instagram.com/FionaFauv' },
  { id: 'x', label: 'X', description: 'Les annonces', href: 'https://x.com/FionaFauv' },
  { id: 'discord', label: 'Discord', description: 'Le serveur (sur invitation)', href: 'https://discord.gg/INVITATION' },
  { id: 'steam', label: 'Steam', description: 'Mon profil', href: 'https://steamcommunity.com/id/FionaFauv' },
];

export const NAV = [
  { href: '/', label: 'Accueil', icon: 'home' },
  { href: '/videos/', label: 'Vidéos', icon: 'video' },
  { href: '/streams/', label: 'Streams', icon: 'stream' },
  { href: '/jeux/', label: 'Jeux', icon: 'gamepad' },
  { href: '/discord/', label: 'Discord', icon: 'chat' },
  { href: '/reseaux/', label: 'Mes réseaux', icon: 'link' },
] as const;
