import db from "../db/index.js";
import {
  Resolvers,
  WatchedTvEpisodeEdge,
} from "../__generated__/resolvers-types.js";
import {
  unwatchEpisode,
  unwatchShow,
  watchEpisode,
  watchShow,
} from "./watch.js";

const userEpisodeResolvers: Resolvers = {
  Query: {
    fetchWatchedEpisode: async (
      _parent: unknown,
      { params },
      _context: unknown,
    ) => {
      const watch = await db.userEpisode.findUnique({
        where: {
          user_id_tv_episode_id: {
            user_id: params.userId,
            tv_episode_id: params.id,
          },
        },
        include: {
          tv_episode: true,
        },
      });
      if (!watch) {
        return null;
      }
      return {
        cursor: watch.updated_at_serial,
        watchTimestamp: watch.updated_at.toISOString(),
        node: {
          id: watch.tv_episode.id,
          title: watch.tv_episode.title,
          tmdbId: watch.tv_episode.tv_show_id,
          seasonNumber: watch.tv_episode.season_number,
          episodeNumber: watch.tv_episode.episode_number,
          tvShow: null,
        },
      };
    },
  },
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
    setTvEpisodeWatchStatusForUser: async (
      _parent: unknown,
      { params },
      _context: unknown,
    ): Promise<WatchedTvEpisodeEdge | null> => {
      if (!params.watched) {
        await unwatchEpisode(params.userId, params.id);
        return null;
      } else {
        const watch = await watchEpisode(params.userId, params.id);
        if (!watch) {
          throw new Error("something went wrong :(");
        }
        return {
          cursor: watch.updated_at_serial,
          watchTimestamp: watch.updated_at.toISOString(),
          node: {
            id: watch.tv_episode.id,
            title: watch.tv_episode.title,
            tmdbId: watch.tv_episode.tv_show_id,
            seasonNumber: watch.tv_episode.season_number,
            episodeNumber: watch.tv_episode.episode_number,
            tvShow: null,
          },
        };
      }
    },
  },
};

export default userEpisodeResolvers;
