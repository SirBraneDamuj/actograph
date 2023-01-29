import db from "../db/index.js";
import { Resolvers } from "../__generated__/resolvers-types.js";
import { importTvShow } from "./import.js";

const resolvers: Resolvers = {
  Query: {
    fetchTvShow: async (_parent: unknown, { params }, _context: unknown) => {
      const importedShow = await importTvShow(params.tmdbId);
      if (!importedShow) {
        throw new Error(`Failed to import show :( ${params.tmdbId}`);
      }
      const seasons = await db.tvSeason.findMany({
        where: {
          tv_show_id: params.tmdbId,
        },
        orderBy: {
          season_number: "asc",
        },
      });
      return {
        tmdbId: importedShow.tmdb_id,
        posterPath: importedShow.poster_path,
        title: importedShow.title,
        numSeasons: importedShow.num_seasons,
        seasons: seasons.map((season) => ({
          id: season.id,
          seasonNumber: season.season_number,
          numEpisodes: season.num_episodes,
        })),
        episodes: {
          edges: [],
        },
      };
    },
  },
};

export default resolvers;
