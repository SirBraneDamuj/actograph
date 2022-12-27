import { Movie, UserMovie } from "@prisma/client";
import db from "../db/index.js";
import { Resolvers } from "../__generated__/resolvers-types.js";
import { watchMovie } from "./watch.js";

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
      // TODO do more here
      return watchMovie(params.userId, params.tmdbId);
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
        direction: "desc",
        ...params?.sorting,
      };
      const paginationParams = params?.pagination || {
        first: 15,
        after: null,
        ...params?.pagination,
      };
      const userMovies = await db.userMovie.findMany({
        take: paginationParams.first,
        skip: paginationParams?.after ? 1 : 0,
        cursor: paginationParams?.after
          ? {
              user_id_updated_at: {
                user_id: id,
                updated_at: paginationParams.after,
              },
            }
          : undefined,
        orderBy: {
          updated_at:
            sortParams.direction === "desc"
              ? ("desc" as const)
              : ("asc" as const),
        },
        where: {
          user_id: id,
        },
        include: {
          movie: true,
        },
      });
      const [{ _count, _min, _max }] = await db.userMovie.groupBy({
        by: ["user_id"],
        _min: {
          updated_at: true,
        },
        _max: {
          updated_at: true,
        },
        _count: true,
        where: {
          user_id: id,
        },
      });
      const lastUserMovieCursor =
        userMovies.length > 0
          ? userMovies[userMovies.length - 1].updated_at
          : null;
      const hasNextPage =
        lastUserMovieCursor &&
        (sortParams.direction === "desc"
          ? _min.updated_at && lastUserMovieCursor > _min.updated_at
          : _max.updated_at && lastUserMovieCursor < _max.updated_at);
      return {
        totalCount: _count,
        edges: userMovies.map((userMovie) => ({
          cursor: userMovieCursor(userMovie),
          node: {
            title: userMovie.movie.title,
            tmdbId: userMovie.movie.tmdbId,
            posterPath: userMovie.movie.poster_path,
          },
        })),
        pageInfo: {
          hasNextPage: !!hasNextPage,
          endCursor: userMovieCursor(userMovies[userMovies.length - 1]),
        },
      };
    },
  },
};

function userMovieCursor(userMovie: UserMovie & { movie: Movie }): string {
  return userMovie.updated_at.toISOString();
}

export default resolvers;
