import db from "../db/index.js";
import { Resolvers } from "../__generated__/resolvers-types.js";
import { importTvShow } from "./import.js";
import { fetchTvEpisode, fetchTvEpisodes } from "./query.js";

const tvShowResolver = async (tmdbId: string) => {
  const importedShow = await importTvShow(tmdbId);
  if (!importedShow) {
    throw new Error(`Failed to import show :( ${tmdbId}`);
  }
  return {
    tmdbId: importedShow.tmdb_id,
    posterPath: importedShow.poster_path,
    title: importedShow.title,
    numSeasons: importedShow.num_seasons,
    seasons: [],
  };
};

const resolvers: Resolvers = {
  Query: {
    fetchTvShow: async (_parent: unknown, { params }, _context: unknown) =>
      tvShowResolver(params.tmdbId),
    fetchTvEpisode: async (_parent: unknown, { params }, _context: unknown) => {
      const episode = await fetchTvEpisode(
        params.tmdbId,
        params.seasonNumber,
        params.episodeNumber,
      );
      if (!episode) {
        return null;
      }
      return {
        id: episode.id,
        title: episode.title,
        tmdbId: episode.tv_show_id,
        seasonNumber: episode.season_number,
        episodeNumber: episode.episode_number,
      };
    },
  },
  TvEpisode: {
    tvShow: async ({ tmdbId }, _args: unknown, _context: unknown) =>
      tvShowResolver(tmdbId),
  },
  TvShow: {
    episodes: async ({ tmdbId }, _args: unknown, _context: unknown) => {
      const episodes = await fetchTvEpisodes(tmdbId);
      return {
        totalCount: episodes.length,
        edges: episodes.map((episode) => {
          return {
            cursor: episode.title_cursor,
            node: {
              id: episode.id,
              title: episode.title,
              tmdbId: episode.tv_show_id,
              seasonNumber: episode.season_number,
              episodeNumber: episode.episode_number,
            },
          };
        }),
      };
    },
    seasons: async ({ tmdbId }, _args: unknown, _context: unknown) => {
      const seasons = await db.tvSeason.findMany({
        where: {
          tv_show_id: tmdbId,
        },
        orderBy: {
          season_number: "asc",
        },
      });
      return seasons.map((season) => ({
        id: season.id,
        seasonNumber: season.season_number,
        numEpisodes: season.num_episodes,
      }));
    },
  },
};

export default resolvers;
