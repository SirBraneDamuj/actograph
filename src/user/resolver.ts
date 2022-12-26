import db from "../db/index.js";
import { importMovie } from "../movie/import.js";
import { Resolvers } from "../__generated__/resolvers-types.js";

const resolvers: Resolvers = {
  Query: {
    fetchUser: async (_parent: unknown, { params }, _context: unknown) => {
      const user = await db.user.findUnique({
        where: {
          id: params.userId,
        },
      });
      if (!user) {
        throw new Error(`Failed to find user ${params.userId} :(`);
      }
      return user;
    },
  },
  Mutation: {
    markWatchedMovie: async (
      _parent: unknown,
      { params },
      _context: unknown,
    ) => {
      const movie = await importMovie(params.tmdbId);
      if (!movie) {
        throw new Error(`Could not import movie with ID ${params.tmdbId}`);
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
  User: {
    watchedMovies: async ({ id }, { params }, _context: unknown) => {
      const sortParams = {
        sortBy: "updated_at",
        sortDirection: "desc",
        ...params?.sorting,
      };
      const paginationParams = params?.pagination || {
        first: 15,
        after: null,
        ...params?.pagination,
      };
      const userMovies = await db.userMovie.findMany({
        take: paginationParams.first,
        cursor: paginationParams?.after
          ? { [sortParams.sortBy]: paginationParams.after }
          : undefined,
        orderBy: {
          [sortParams.sortBy]: sortParams.sortDirection,
        },
        where: {
          user_id: id,
        },
        include: {
          movie: true,
        },
      });
      const count = await db.userMovie.count({
        where: {
          user_id: id,
        },
      });
      return {
        totalCount: count,
        edges: userMovies.map((userMovie) => ({
          cursor: "",
          node: {
            title: userMovie.movie.title,
            tmdbId: userMovie.movie.tmdbId,
            posterPath: userMovie.movie.poster_path,
          },
        })),
        pageInfo: {
          hasNextPage: false,
          hasPrevPage: false,
          endCursor: "",
          firstCursor: "",
        },
      };
    },
  },
};

export default resolvers;
