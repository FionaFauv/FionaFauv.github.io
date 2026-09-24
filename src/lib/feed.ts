import type { Stream, Video } from '../data/placeholders';
import type { Game } from './games';

/**
 * Fil « Dernières nouvelles » de l'accueil : vidéos, lives, avis et progression des jeux,
 * mélangés et triés du plus récent au plus ancien.
 */
export type FeedItem =
  | { kind: 'video'; date: Date; video: Video }
  | { kind: 'live'; date: Date; stream: Stream }
  | { kind: 'avis'; date: Date; game: Game }
  | { kind: 'succes'; date: Date; game: Game };

export const FEED_KIND = {
  video: { label: 'Vidéo', color: 'red', icon: 'video' },
  live: { label: 'Live', color: 'yellow', icon: 'stream' },
  succes: { label: 'Succès', color: 'purple', icon: 'trophy' },
  avis: { label: 'Avis', color: 'white', icon: 'star' },
} as const;

interface Sources {
  videos: Video[];
  streams: Stream[];
  games: Game[];
}

export function buildFeed({ videos, streams, games }: Sources, limit = 10): FeedItem[] {
  const items: FeedItem[] = [
    ...videos.map((video) => ({ kind: 'video' as const, date: video.publishedAt, video })),
    ...streams.map((stream) => ({ kind: 'live' as const, date: stream.streamedAt, stream })),
  ];

  // Un seul message par jeu : l'avis s'il est plus récent que la dernière session, sinon la progression.
  for (const game of games) {
    const { rating, reviewedAt, finishedAt, achievements, lastPlayedAt, status } = game.data;
    const reviewDate = rating !== undefined ? (reviewedAt ?? finishedAt) : undefined;
    const progressDate = achievements && status !== 'wishlist' ? lastPlayedAt : undefined;
    if (reviewDate && (!progressDate || reviewDate >= progressDate)) {
      items.push({ kind: 'avis', date: reviewDate, game });
    } else if (progressDate) {
      items.push({ kind: 'succes', date: progressDate, game });
    }
  }

  return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
}
