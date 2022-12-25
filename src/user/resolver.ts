import db from "../db/index.js";
import Tmdb from "../tmdb.js";
import { Resolvers } from "../__generated__/resolvers-types.js";

const defaultPage = {
  first: 15,
  after: null,
};

const resolvers: Resolvers = {
  Query: {
    fetchUser: async (_parent: unknown, { params }, _context: unknown) => {
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
    listWatchedMovies: async (
      _parent: unknown,
      { params },
      _context: unknown,
    ) => {
      const user = await db.user.findUnique({
        where: {
          id: params.userId,
        },
      });
      if (!user) {
        throw new Error(`Failed to find user ${params.userId} :(`);
      }
      const pagination = params.pagination || defaultPage;
      const userMovies = await db.userMovie.findMany({
        include: {
          movie: true,
        },
        where: {
          user_id: params.userId,
          updated_at: pagination.after
            ? {
                gt: pagination.after,
              }
            : undefined,
        },
        orderBy: {
          updated_at: "desc",
        },
      });
      const total = await db.userMovie.count({
        where: {
          user_id: params.userId,
        },
      });
      return {
        totalCount: total,
        edges: userMovies.map((userMovie) => ({
          node: {
            title: userMovie.movie.title,
            tmdbId: userMovie.movie.tmdbId,
            posterPath: userMovie.movie.poster_path,
          },
          cursor: userMovie.updated_at.toISOString(),
        })),
        pageInfo: {
          firstCursor: userMovies[0].updated_at.toISOString(),
          endCursor: userMovies[userMovies.length - 1].updated_at.toISOString(),
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    },
  },
  Mutation: {
    markWatchedMovie: async (
      _parent: unknown,
      { params },
      _context: unknown,
    ) => {
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
            tmdbId: loadedMovie.id.toString(),
            title: loadedMovie.title || "Somehow this doesn't have a title", // TODO: how can I more safely handle these responses
            poster_path: loadedMovie.poster_path,
          },
        });
      }
      await db.userMovie.create({
        data: {
          movie_id: movie.tmdbId,
          user_id: params.userId,
        },
      });
      return movie;
    },
    createUser: async (_parent: unknown, { params }, _context: unknown) => {
      const user = await db.user.create({
        data: params,
      });
      return user;
    },
  },
};

export default resolvers;
