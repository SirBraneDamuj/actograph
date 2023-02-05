import { fetchMovieCredits } from "../person/query.js";
import { Resolvers } from "../__generated__/resolvers-types.js";
import { importMovie } from "./import.js";

const resolvers: Resolvers = {
  Query: {
    fetchMovie: async (_parent: unknown, { params }, _context: unknown) => {
      const importedMovie = await importMovie(params.tmdbId);
      if (!importedMovie) {
        throw new Error(`Failed to import movie :( ${params.tmdbId}`);
      }
      return {
        tmdbId: importedMovie.tmdb_id,
        posterPath: importedMovie.poster_path,
        title: importedMovie.title,
      };
    },
  },
  Mutation: {
    importMovie: async (_parent: unknown, { params }, _context: unknown) => {
      const importedMovie = await importMovie(params.tmdbId);
      if (!importedMovie) {
        throw new Error(`Failed to import movie :( ${params.tmdbId}`);
      }
      return {
        tmdbId: importedMovie.tmdb_id,
        posterPath: importedMovie.poster_path,
        title: importedMovie.title,
      };
    },
  },
  Movie: {
    credits: async ({ tmdbId }, _args: unknown, _context: unknown) => {
      const { movieCredits, count } = await fetchMovieCredits(tmdbId);
      return {
        totalCount: count,
        edges: movieCredits.map(({ character_name, actor }) => ({
          cursor: "",
          characterName: character_name,
          node: {
            tmdbId: actor.tmdb_id,
            profilePath: actor.profile_path,
            name: actor.name,
          },
        })),
        pageInfo: {
          hasNextPage: false,
          endCursor: "",
        },
      };
    },
  },
};

export default resolvers;
