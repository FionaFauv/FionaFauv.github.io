import { DISCORD_INVITE_URL } from 'astro:env/server';

/**
 * Configuration unique du site : nom, textes et liens des réseaux.
 * Remplace les URLs ci-dessous par les tiennes, tout le site les reprend.
 * Lu uniquement au build (importe astro:env/server) : ne pas l'importer dans un <script> client.
 */

export const SITE = {
  name: 'FionaFauv',
  tagline: 'Tout ce que je fais, au même endroit.',
  description:
    'Le hub de FionaFauv : vidéos YouTube, lives Twitch, jeux Steam, chasse au 100 % et serveur Discord.',
  url: 'https://FionaFauv.github.io',
  lang: 'fr',
} as const;

export type SocialId = 'youtube' | 'twitch' | 'tiktok' | 'instagram' | 'discord' | 'steam';

export interface Social {
  id: SocialId;
  label: string;
  /** Ce qu'on trouve sur ce réseau, affiché sur la page « Mes réseaux ». */
  description: string;
  href: string;
}

/**
 * Le lien d'invitation Discord vient de DISCORD_INVITE_URL (.env, secret GitHub) pour ne pas être
 * dans le repo. Sans lui, Discord disparaît des réseaux et le bouton « Ouvrir dans Discord » aussi.
 */
const discordInvite: Social | undefined = DISCORD_INVITE_URL
  ? { id: 'discord', label: 'Discord', description: 'Le serveur (sur invitation)', href: DISCORD_INVITE_URL }
  : undefined;

export const SOCIALS: Social[] = [
  { id: 'youtube', label: 'YouTube', description: 'Les vidéos', href: 'https://www.youtube.com/@Zelfaesque' },
  { id: 'twitch', label: 'Twitch', description: 'Les lives', href: 'https://www.twitch.tv/Zelfaesque' },
  { id: 'tiktok', label: 'TikTok', description: 'Les clips', href: 'https://www.tiktok.com/@Zelfaesque' },
  { id: 'instagram', label: 'Instagram', description: 'Photos et DM', href: 'https://www.instagram.com/Fio_Marshall' },
  ...(discordInvite ? [discordInvite] : []),
  { id: 'steam', label: 'Steam', description: 'Mon profil', href: 'https://steamcommunity.com/id/Zelfa' },
];

/**
 * Discord : afficher les pseudos, statuts et jeux en cours des membres connectés ?
 * false (par défaut) : uniquement des compteurs (en ligne, en vocal par salon).
 * Ne passe à true qu'avec l'accord des membres du serveur : le site est public.
 */
export const DISCORD_SHOW_NAMES = true;

export const NAV = [
  { href: '/', label: 'Accueil', icon: 'home' },
  { href: '/videos/', label: 'Vidéos', icon: 'video' },
  { href: '/streams/', label: 'Streams', icon: 'stream' },
  { href: '/jeux/', label: 'Jeux', icon: 'gamepad' },
  { href: '/discord/', label: 'Discord', icon: 'chat' },
  { href: '/reseaux/', label: 'Mes réseaux', icon: 'link' },
] as const;
