import { Movie, UserMovie } from "@prisma/client";
import db from "../db/index.js";
import {
  Resolvers,
  SortDirection,
  WatchedMovieSortField,
} from "../__generated__/resolvers-types.js";
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
        direction: params?.sorting?.direction || SortDirection.Desc,
        by: params?.sorting?.by || WatchedMovieSortField.WatchDate,
      };
      const pageParams = {
        first: params?.pagination?.first || 15,
        after: params?.pagination?.after || null,
      };
      const userMovies = await userMovieQuery(id, pageParams, sortParams);
      const count = await db.userMovie.count({
        where: {
          user_id: id,
        },
      });
      return {
        totalCount: count,
        edges: userMovies.map((userMovie) => ({
          cursor: userMovieCursor(userMovie, sortParams.by),
          node: {
            title: userMovie.movie.title,
            tmdbId: userMovie.movie.tmdbId,
            posterPath: userMovie.movie.poster_path,
          },
        })),
        pageInfo: {
          endCursor: userMovieCursor(
            userMovies[userMovies.length - 1],
            sortParams.by,
          ),
        },
      };
    },
  },
};

async function userMovieQuery(
  userId: string,
  pageParams: { after: string | null | undefined; first: number },
  sortParams: {
    by: WatchedMovieSortField;
    direction: SortDirection;
  },
) {
  const base = {
    take: pageParams.first,
    skip: pageParams?.after ? 1 : 0, // skips the cursor
    where: {
      user_id: userId,
    },
    include: {
      movie: true,
    },
  };
  const actualSortDirection =
    sortParams.direction === SortDirection.Desc
      ? ("desc" as const)
      : ("asc" as const);
  const operator = sortParams.direction === SortDirection.Desc ? "lte" : "gte";
  switch (sortParams.by) {
    case WatchedMovieSortField.Title:
      return db.userMovie.findMany({
        ...base,
        where: pageParams?.after
          ? {
              movie: {
                title_cursor: {
                  [operator]: pageParams.after,
                },
              },
            }
          : undefined,
        orderBy: {
          movie: {
            title_cursor: actualSortDirection,
          },
        },
      });
    case WatchedMovieSortField.WatchDate:
      return db.userMovie.findMany({
        ...base,
        cursor: pageParams?.after
          ? {
              user_id_updated_at: {
                user_id: userId,
                updated_at: pageParams.after,
              },
            }
          : undefined,
        orderBy: {
          updated_at: actualSortDirection,
        },
      });
  }
}

function userMovieCursor(
  userMovie: UserMovie & { movie: Movie },
  field: WatchedMovieSortField,
): string {
  switch (field) {
    case WatchedMovieSortField.Title:
      return userMovie.movie.title_cursor;
    case WatchedMovieSortField.WatchDate:
      return userMovie.updated_at.toISOString();
  }
}

export default resolvers;
