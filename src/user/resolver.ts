import db from '../db/index.js';
import Tmdb from '../tmdb.js';
import { Resolvers } from "../__generated__/resolvers-types.js";

const resolvers: Resolvers = {
  Query: {
    fetchUser: async (_parent: unknown,  { params }, _context: unknown) => {
      const user = await db.user.findUnique({
        where: {
          id: params.id,
        },
      });
      if (!user) {
        throw new Error(`Failed to find user ${params.id} :(`);
      }
      return user;
    },
  },
  Mutation: {
    markWatchedMovie: async (_parent: unknown, { params }, _context: unknown) => {
      let movie = await db.movie.findUnique({
        where: {
          tmdbId: params.tmdbId,
        },
      });
      if (!movie) {
        const loadedMovie = await Tmdb.movieInfo(params.tmdbId);
        if (!loadedMovie.id) {
          return null;
        }
        movie = await db.movie.create({
          data: {
            tmdbId: loadedMovie.id!.toString(),
            title: loadedMovie.title!,
            poster_path: loadedMovie.poster_path,
          }
        });
      }
      await db.userMovie.create({
        data: {
          movie_id: movie.tmdbId,
          user_id: params.userId,
        }
      });
      return movie;
    },
    createUser: async (_parent: unknown, { params }, _context: unknown) => {
      const user = await db.user.create({
        data: params,
      });
      return user;
    }
  }
};

export default resolvers;
