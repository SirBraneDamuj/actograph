import { Resolvers } from "../__generated__/resolvers-types.js";
import { importTvShow } from "./import.js";

const resolvers: Resolvers = {
  Query: {
    fetchTvShow: async (_parent: unknown, { params }, _context: unknown) => {
      const importedShow = await importTvShow(params.tmdbId);
      if (!importedShow) {
        throw new Error(`Failed to import show :( ${params.tmdbId}`);
      }
      return {
        tmdbId: importedShow.tmdb_id,
        posterPath: importedShow.poster_path,
        title: importedShow.title,
        episodes: {
          edges: [],
        },
      };
    },
  },
};

export default resolvers;
