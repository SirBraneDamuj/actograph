import db from "../db/index.js";
import { Resolvers } from "../__generated__/resolvers-types.js";
import { unwatchShow, watchShow } from "./watch.js";

const userEpisodeResolvers: Resolvers = {
  Mutation: {
    setTvShowWatchStatusForUser: async (
      _parent: unknown,
      { params },
      _context: unknown,
    ) => {
      if (!params.watched) {
        await unwatchShow(params.userId, params.tmdbId);
        return null;
      } else {
        const { title, poster_path, tmdb_id } = await watchShow(
          params.userId,
          params.tmdbId,
        );
        // TODO I don't want to have to duplicate this here
        const seasons = await db.tvSeason.findMany({
          where: {
            tv_show_id: params.tmdbId,
          },
          orderBy: {
            season_number: "asc",
          },
        });
        return {
          tmdbId: tmdb_id,
          title,
          posterPath: poster_path,
          seasons: seasons.map((season) => ({
            id: season.id,
            seasonNumber: season.season_number,
            numEpisodes: season.num_episodes,
          })),
        };
      }
    },
  },
};

export default userEpisodeResolvers;
