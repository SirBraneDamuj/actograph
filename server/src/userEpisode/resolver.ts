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
        return {
          tmdbId: tmdb_id,
          title,
          posterPath: poster_path,
          seasons: [],
        };
      }
    },
  },
};

export default userEpisodeResolvers;
