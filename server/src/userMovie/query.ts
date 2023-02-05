import db from "../db/index.js";
import {
  SortDirection,
  WatchedMovieSortField,
} from "../__generated__/resolvers-types.js";

type UserMovieSortParams = {
  by: WatchedMovieSortField;
  direction: SortDirection;
};

type UserMoviePaginationParams = {
  first: number;
  after: string | null;
};

const mapSortByParamsToPrisma = (
  sortParams: UserMovieSortParams,
): ["asc" | "desc", "gte" | "lte"] =>
  sortParams.direction === SortDirection.Asc ? ["asc", "gte"] : ["desc", "lte"];

export async function userMovieQuery(
  userId: string,
  sortParams: UserMovieSortParams,
  pageParams: UserMoviePaginationParams,
) {
  const cursor = pageParams.after;
  const base = {
    take: pageParams.first,
    skip: cursor ? 1 : 0, // skips the cursor
    where: {
      user_id: userId,
    },
    include: {
      movie: true,
    },
  };
  const [orderByDirection, filterOperator] =
    mapSortByParamsToPrisma(sortParams);
  switch (sortParams.by) {
    case WatchedMovieSortField.Title:
      return db.userMovie.findMany({
        ...base,
        where: pageParams?.after
          ? {
              user_id: userId,
              movie: {
                title_cursor: {
                  [filterOperator]: pageParams.after,
                },
              },
            }
          : {
              user_id: userId,
            },
        orderBy: {
          movie: {
            title_cursor: orderByDirection,
          },
        },
      });
    case WatchedMovieSortField.WatchDate:
      return db.userMovie.findMany({
        ...base,
        cursor: pageParams?.after
          ? {
              user_id_updated_at_serial: {
                user_id: userId,
                updated_at_serial: pageParams.after,
              },
            }
          : undefined,
        orderBy: {
          updated_at_serial: orderByDirection,
        },
      });
  }
}

export type UserMovieAggregate = {
  totalCount: number;
  maxCursor: string;
  minCursor: string;
};

function getAggregateResult(userId: string, sortParams: UserMovieSortParams) {
  switch (sortParams.by) {
    case WatchedMovieSortField.Title:
      return db.$queryRaw`SELECT min(m.title_cursor) as min, max(m.title_cursor) as max, count(1) as count from user_movie um join movie m on um.movie_id=m.tmdb_id where um.user_id = ${userId}::uuid group by um.user_id`;
    case WatchedMovieSortField.WatchDate:
      return db.$queryRaw`SELECT min(updated_at_serial) as min, max(updated_at_serial) as max, count(1) as count from user_movie um where um.user_id = ${userId}::uuid group by um.user_id`;
  }
}

export async function userMovieAgg(
  userId: string,
  sortParams: UserMovieSortParams,
): Promise<UserMovieAggregate> {
  const result = (await getAggregateResult(userId, sortParams)) as {
    max: string;
    min: string;
    count: number;
  }[];
  if (result.length <= 0) {
    return {
      totalCount: 0,
      maxCursor: "",
      minCursor: "",
    };
  }
  const [{ max, min, count }] = result;
  return {
    totalCount: Number(count),
    maxCursor: max,
    minCursor: min,
  };
}

export async function singleUserMovieQuery(userId: string, movieId: string) {
  return db.userMovie.findUnique({
    where: {
      user_id_movie_id: {
        user_id: userId,
        movie_id: movieId,
      },
    },
    include: {
      movie: true,
    },
  });
}
