import { Movie, UserMovie } from "@prisma/client";
import {
  singleUserMovieQuery,
  userMovieAgg,
  userMovieQuery,
} from "../userMovie/query.js";
import { unwatchMovie, watchMovie } from "../userMovie/watch.js";
import {
  Resolvers,
  SortDirection,
  WatchedMoviesConnection,
  WatchedMovieSortField,
  WatchedMoviesParams,
} from "../__generated__/resolvers-types.js";

export async function watchedMoviesResolver(
  userId: string,
  params: WatchedMoviesParams,
): Promise<WatchedMoviesConnection> {
  const sortParams = {
    direction: params?.sorting?.direction || SortDirection.Desc,
    by: params?.sorting?.by || WatchedMovieSortField.WatchDate,
  };
  const pageParams = {
    first: params?.pagination?.first || 15,
    after: params?.pagination?.after || null,
  };
  const userMovies = await userMovieQuery(userId, sortParams, pageParams);
  const { totalCount, minCursor, maxCursor } = await userMovieAgg(
    userId,
    sortParams,
  );
  const firstCursor =
    userMovies.length > 0
      ? userMovieCursor(userMovies[0], sortParams.by)
      : undefined;
  const endCursor =
    userMovies.length > 0
      ? userMovieCursor(userMovies[userMovies.length - 1], sortParams.by)
      : undefined;
  return {
    totalCount,
    edges: userMovies.map((userMovie) => ({
      cursor: userMovieCursor(userMovie, sortParams.by),
      watchTimestamp: userMovie.updated_at.toISOString(),
      node: {
        title: userMovie.movie.title,
        tmdbId: userMovie.movie.tmdb_id,
        posterPath: userMovie.movie.poster_path,
      },
    })),
    pageInfo: {
      endCursor,
      firstCursor,
      hasNextPage:
        sortParams.direction === SortDirection.Desc
          ? !!(endCursor && endCursor > minCursor)
          : !!(endCursor && endCursor < maxCursor),
      hasPrevPage: !!(firstCursor && firstCursor > minCursor),
    },
  };
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

const userMovieResolvers: Resolvers = {
  Query: {
    fetchWatchedMovies: async (
      _parent: unknown,
      { userId, params },
      _context: unknown,
    ) => watchedMoviesResolver(userId, params),
    fetchWatchedMovie: async (
      _parent: unknown,
      { params },
      _context: unknown,
    ) => {
      const userMovie = await singleUserMovieQuery(
        params.userId,
        params.tmdbId,
      );
      if (!userMovie) {
        return null;
      }
      return {
        cursor: "",
        watchTimestamp: userMovie.updated_at.toISOString(),
        node: {
          title: userMovie.movie.title,
          tmdbId: userMovie.movie.tmdb_id,
          posterPath: userMovie.movie.poster_path,
        },
      };
    },
  },
  Mutation: {
    setWatchStatusForUser: async (
      _parent: unknown,
      { params },
      _context: unknown,
    ) => {
      if (!params.watched) {
        await unwatchMovie(params.userId, params.tmdbId);
        return null;
      } else {
        // TODO do more here
        const { title, poster_path, tmdb_id } = await watchMovie(
          params.userId,
          params.tmdbId,
        );
        return {
          tmdbId: tmdb_id,
          title,
          posterPath: poster_path,
        };
      }
    },
  },
  User: {
    watchedMovies: async ({ id }, { params }, _context: unknown) =>
      watchedMoviesResolver(id, params || {}),
  },
};

export default userMovieResolvers;
