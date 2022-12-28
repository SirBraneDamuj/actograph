import db from "../db/index.js";
import { Resolvers } from "../__generated__/resolvers-types.js";

const resolvers: Resolvers = {
  Query: {
    fetchPerson: async (_parent: unknown, { params }, _context: unknown) => {
      const person = await db.person.findUniqueOrThrow({
        where: {
          tmdb_id: params.tmdbId,
        },
      });
      return {
        tmdbId: person.tmdb_id,
        name: person.name,
        profilePath: person.profile_path,
      };
    },
  },
  Person: {
    movies: async ({ tmdbId, movies }, _params: unknown, _context: unknown) => {
      if (movies !== null && movies !== undefined) {
        return movies;
      }
      const movieCredits = await db.movieCredit.findMany({
        where: {
          actor_id: tmdbId,
        },
        include: {
          movie: true,
        },
      });
      const count = await db.movieCredit.count({
        where: {
          actor_id: tmdbId,
        },
      });
      return {
        totalCount: count,
        edges: movieCredits.map(({ character_name, movie }) => ({
          cursor: "",
          characterName: character_name,
          node: {
            tmdbId: movie.tmdbId,
            posterPath: movie.poster_path,
            title: movie.title,
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
