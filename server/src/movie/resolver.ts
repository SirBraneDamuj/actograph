import db from "../db/index.js";
import { Resolvers } from "../__generated__/resolvers-types.js";
import { importMovie } from "./import.js";

const resolvers: Resolvers = {
  Query: {
    fetchMovie: async (_parent: unknown, { params }, _context: unknown) => {
      const importedMovie = await importMovie(params.tmdbId);
      if (!importedMovie) {
        throw new Error(`Failed to import movie :( ${params.tmdbId}`);
      }
      return {
        tmdbId: importedMovie.tmdbId,
        posterPath: importedMovie.poster_path,
        title: importedMovie.title,
      };
    },
  },
  Mutation: {
    importMovie: async (_parent: unknown, { params }, _context: unknown) => {
      const importedMovie = await importMovie(params.tmdbId);
      if (!importedMovie) {
        throw new Error(`Failed to import movie :( ${params.tmdbId}`);
      }
      return {
        tmdbId: importedMovie.tmdbId,
        posterPath: importedMovie.poster_path,
        title: importedMovie.title,
      };
    },
  },
  Movie: {
    credits: async ({ tmdbId }, { params }, _context: unknown) => {
      const userId = params?.userId;
      if (userId) {
        const credits = await db.movieCredit.findMany({
          where: {
            movie_id: tmdbId,
            movie: {
              is: {
                credits: {
                  some: {
                    actor: {
                      is: {
                        movies: {
                          some: {
                            movie: {
                              is: {
                                AND: {
                                  NOT: {
                                    tmdbId,
                                  },
                                  watchers: {
                                    some: {
                                      user_id: userId,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          include: {
            actor: {
              include: {
                movies: {
                  where: {
                    NOT: {
                      movie_id: tmdbId,
                    },
                  },
                  include: {
                    movie: true,
                  },
                },
              },
            },
            movie: true,
          },
        });
        const count = credits.length;
        return {
          totalCount: count,
          edges: credits
            // TODO: how do I filter these at the db level
            .filter(({ actor }) => actor.movies.length !== 0)
            .map(({ character_name, actor }) => {
              const actorMovies = actor.movies.map(
                ({ character_name, movie }) => {
                  return {
                    characterName: character_name,
                    node: {
                      tmdbId: movie.tmdbId,
                      title: movie.title,
                      posterPath: movie.poster_path,
                    },
                  };
                },
              );
              return {
                cursor: "",
                characterName: character_name,
                node: {
                  tmdbId: actor.tmdb_id,
                  profilePath: actor.profile_path,
                  name: actor.name,
                  movies: {
                    totalCount: actorMovies.length,
                    edges: actorMovies,
                  },
                },
              };
            }),
          pageInfo: {
            hasNextPage: false,
            endCursor: "",
          },
        };
      } else {
        const movieCredits = await db.movieCredit.findMany({
          where: {
            movie_id: tmdbId,
          },
          include: {
            actor: true,
          },
        });
        const count = await db.movieCredit.count({
          where: {
            movie_id: tmdbId,
          },
        });
        return {
          totalCount: count,
          edges: movieCredits.map(({ character_name, actor }) => ({
            cursor: "",
            characterName: character_name,
            node: {
              tmdbId: actor.tmdb_id,
              profilePath: actor.profile_path,
              name: actor.name,
            },
          })),
          pageInfo: {
            hasNextPage: false,
            endCursor: "",
          },
        };
      }
    },
  },
};

export default resolvers;
