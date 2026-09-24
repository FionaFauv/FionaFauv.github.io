/**
 * Catalogue des vidéos YouTube à afficher sur le site, choisies une par une.
 *
 * Sert surtout aux vidéos « non répertoriées » : l'API ne les liste pas toute seule,
 * mais les renvoie quand on lui donne leur ID. Mettre une vidéo ici = accepter qu'elle
 * soit visible par tous les visiteurs du site (et que son lien soit dans ce repo public).
 *
 * Les vidéos privées ne s'affichent pas : passe-les en « non répertoriée » d'abord.
 * Les vidéos publiques de la chaîne (YOUTUBE_CHANNEL_ID) s'ajoutent toutes seules.
 *
 * Colle l'URL complète ou juste l'ID, l'ordre n'a pas d'importance (tri par date).
 */
export const VIDEO_CATALOG: string[] = [
  // 'https://youtu.be/XXXXXXXXXXX',
  // 'https://www.youtube.com/watch?v=XXXXXXXXXXX',
  // 'XXXXXXXXXXX',
];
