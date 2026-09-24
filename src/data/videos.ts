/**
 * Vidéos YouTube à afficher sur le site, en plus des vidéos publiques de la chaîne
 * (YOUTUBE_CHANNEL_ID). Sert surtout aux vidéos « non répertoriées » : l'API ne les liste
 * pas toute seule, mais les renvoie via une playlist ou quand on lui donne leur ID.
 *
 * Mettre une playlist ou une vidéo ici = accepter que ses vidéos soient visibles par tous
 * les visiteurs du site (et que son lien soit dans ce repo public).
 *
 * Les vidéos privées ne s'affichent jamais : passe-les en « non répertoriée » d'abord.
 * Colle l'URL complète ou juste l'ID. L'ordre n'a pas d'importance (tri par date).
 */

/**
 * Playlists (non répertoriées ou publiques, pas privées) : toutes leurs vidéos s'affichent.
 * Ajouter une vidéo à la playlist sur YouTube suffit, elle apparaît au build suivant.
 */
export const VIDEO_PLAYLISTS: string[] = [
  'https://www.youtube.com/playlist?list=PLnUdeLz-Xacj-732A3UPyJ6tgLs09wbPb',
];

/** Vidéos à l'unité, hors playlist. */
export const VIDEO_CATALOG: string[] = [
  // 'https://youtu.be/XXXXXXXXXXX',
  // 'XXXXXXXXXXX',
];
