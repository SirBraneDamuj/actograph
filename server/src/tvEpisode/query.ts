import db from "../db/index.js";

export async function fetchTvEpisodes(tmdbId: string) {
  return db.tvEpisode.findMany({
    where: {
      tv_show_id: tmdbId,
    },
    orderBy: [
      {
        season_number: "asc",
      },
      {
        episode_number: "asc",
      },
    ],
  });
}
