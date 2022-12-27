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
      const pageParams = params?.pagination || {
        first: params?.pagination?.first || 15,
        after: params?.pagination?.after || undefined,
      };
      const userMovies = await db.userMovie.findMany({
        ...paginationQueryParams(id, pageParams, sortParams.by),
        orderBy: userMovieOrderBy(sortParams),
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
          cursor: userMovieCursor(userMovie, sortParams.by),
          node: {
            title: userMovie.movie.title,
            tmdbId: userMovie.movie.tmdbId,
            posterPath: userMovie.movie.poster_path,
          },
        })),
        pageInfo: {
          hasNextPage: !!hasNextPage,
          endCursor: userMovieCursor(
            userMovies[userMovies.length - 1],
            sortParams.by,
          ),
        },
      };
    },
  },
};

function paginationQueryParams(
  userId: string,
  paginationParams: { after?: string | null | undefined; first: number },
  field: WatchedMovieSortField,
) {
  return {
    take: paginationParams.first,
    skip: paginationParams?.after ? 1 : 0,
    cursor: cursorQuery(userId, paginationParams, field) || undefined,
  };
}

function cursorQuery(
  userId: string,
  paginationParams: { after?: string | null | undefined; first: number },
  field: WatchedMovieSortField,
) {
  if (!paginationParams.after) {
    return null;
  }
  switch (field) {
    case WatchedMovieSortField.WatchDate:
      return {
        user_id_updated_at: {
          user_id: userId,
          updated_at: paginationParams.after,
        },
      };
    case WatchedMovieSortField.Title:
      return {
        movie: {
          title_cursor: paginationParams.after,
        },
      };
  }
}

function userMovieOrderBy(sortParams: {
  by: WatchedMovieSortField;
  direction: SortDirection;
}) {
  const actualSortDirection =
    sortParams.direction === SortDirection.Desc
      ? ("desc" as const)
      : ("asc" as const);
  switch (sortParams.by) {
    case WatchedMovieSortField.WatchDate:
      return {
        updated_at: actualSortDirection,
      };
    case WatchedMovieSortField.Title:
      return {
        movie: {
          title_cursor: actualSortDirection,
        },
      };
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
