import db from "../db/index.js";
import { Resolvers } from "../__generated__/resolvers-types.js";

const resolvers: Resolvers = {
  Query: {
    fetchMovie: (_parent: unknown, _context: unknown, { params }) => {
      return db.movie.findUnique({
        where: {
          tmdbId: params.id,
        },
      });
    },
  },
};

export default resolvers;
