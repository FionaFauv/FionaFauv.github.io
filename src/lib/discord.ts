import { DISCORD_GUILD_ID } from 'astro:env/server';
import { DISCORD_SHOW_NAMES } from '../config/site';
import { DISCORD, type DiscordSnapshot } from '../data/placeholders';

/**
 * État du serveur Discord, récupéré au build via son widget public (`widget.json`, sans clé).
 *
 * - Le widget doit être activé : Paramètres du serveur → Widget → « Activer le widget du serveur ».
 * - Sans DISCORD_GUILD_ID (build local sans `.env`, CI des PR) : données d'exemple.
 * - Avec l'ID, une erreur (widget désactivé, ID faux) fait échouer le build : le site en ligne
 *   garde la version précédente.
 * - Les pseudos ne sortent de cette fonction que si DISCORD_SHOW_NAMES (src/config/site.ts) vaut true.
 *
 * Le widget ne donne que les membres connectés (100 max) et les salons vocaux visibles par
 * @everyone ; pas le nombre total de membres. Les données datent du dernier build.
 */

interface Widget {
  name: string;
  presence_count: number;
  channels: { id: string; name: string; position: number }[];
  members: {
    username: string;
    status: 'online' | 'idle' | 'dnd';
    channel_id?: string;
    activity?: { name: string };
  }[];
}

async function fetchDiscord(): Promise<DiscordSnapshot> {
  if (!DISCORD_GUILD_ID) return DISCORD;

  const res = await fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`);
  if (res.status === 403) {
    throw new Error('Discord : widget désactivé. Paramètres du serveur → Widget → « Activer le widget du serveur ».');
  }
  if (!res.ok) throw new Error(`Discord widget.json : HTTP ${res.status} ${await res.text()}`);
  const w = (await res.json()) as Widget;

  return {
    serverName: w.name,
    onlineCount: w.presence_count,
    voiceChannels: w.channels
      .sort((a, b) => a.position - b.position)
      .map((c) => {
        const inside = w.members.filter((m) => m.channel_id === c.id);
        return { name: c.name, count: inside.length, members: DISCORD_SHOW_NAMES ? inside.map((m) => m.username) : [] };
      }),
    onlineMembers: DISCORD_SHOW_NAMES
      ? w.members.map((m) => ({ name: m.username, status: m.status, activity: m.activity?.name }))
      : [],
  };
}

// Un seul appel par build, partagé entre les pages et le menu latéral.
let cache: Promise<DiscordSnapshot> | undefined;
export const getDiscord = () => (cache ??= fetchDiscord());
