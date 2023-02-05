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

export async function fetchTvEpisode(
  tmdbId: string,
  seasonNumber: number,
  episodeNumber: number,
) {
  return db.tvEpisode.findUnique({
    where: {
      tv_show_id_season_number_episode_number: {
        tv_show_id: tmdbId,
        season_number: seasonNumber,
        episode_number: episodeNumber,
      },
    },
  });
}

export async function fetchTvEpisodeCredits(id: string) {
  return db.tvEpisodeCredit.findMany({
    where: {
      episode_id: id,
    },
    include: {
      actor: true,
    },
    orderBy: {
      cast_order: "asc",
    },
  });
}

export async function fetchTvEpisodeCreditsForUser(id: string, userId: string) {
  return "foo";
}
