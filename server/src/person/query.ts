import db from "../db/index.js";

export async function fetchMovieCredits(tmdbId: string) {
  const movieCredits = await db.movieCredit.findMany({
    where: {
      movie_id: tmdbId,
    },
    include: {
      actor: true,
      movie: true,
    },
  });
  const count = await db.movieCredit.count({
    where: {
      movie_id: tmdbId,
    },
  });
  return {
    movieCredits,
    count,
  };
}

export async function fetchMovieCreditsForActor(tmdbId: string) {
  const movieCredits = await db.movieCredit.findMany({
    where: {
      actor_id: tmdbId,
    },
    include: {
      actor: true,
      movie: true,
    },
  });
  const count = await db.movieCredit.count({
    where: {
      actor_id: tmdbId,
    },
  });
  return {
    movieCredits,
    count,
  };
}

export async function fetchPersonalizedMovieCreditsForActor(
  tmdbId: string,
  userId: string,
  except?: string,
) {
  const movieCredits = await db.movieCredit.findMany({
    where: {
      actor_id: tmdbId,
      movie: {
        is: {
          watchers: {
            some: {
              user_id: userId,
            },
          },
        },
        isNot: except
          ? {
              tmdb_id: except,
            }
          : undefined,
      },
    },
    include: {
      actor: true,
      movie: true,
    },
  });
  const count = movieCredits.length;
  return {
    movieCredits,
    count,
  };
}

export async function fetchTvCreditsForActor(tmdbId: string) {
  const tvCredits = await db.tvEpisodeCredit.findMany({
    where: {
      actor_id: tmdbId,
    },
    include: {
      actor: true,
      episode: true,
    },
  });
  const count = await db.movieCredit.count({
    where: {
      actor_id: tmdbId,
    },
  });
  return {
    tvCredits,
    count,
  };
}

export async function fetchPersonalizedTvCreditsForActor(
  tmdbId: string,
  userId: string,
  except?: string,
) {
  const tvCredits = await db.tvEpisodeCredit.findMany({
    where: {
      actor_id: tmdbId,
      episode: {
        is: {
          watchers: {
            some: {
              user_id: userId,
            },
          },
        },
        isNot: except
          ? {
              tv_show_id: except,
            }
          : undefined,
      },
    },
    include: {
      actor: true,
      episode: true,
    },
  });
  const count = tvCredits.length;
  return {
    tvCredits,
    count,
  };
}
