import db from "../db/index.js";
import { Resolvers } from "../__generated__/resolvers-types.js";
import {
  fetchMovieCreditsForActor,
  fetchPersonalizedMovieCreditsForActor,
  fetchPersonalizedTvCreditsForActor,
  fetchTvCreditsForActor,
} from "./query.js";

const resolvers: Resolvers = {
  Query: {
    fetchPerson: async (_parent: unknown, { params }, _context: unknown) => {
      const person = await db.person.findUniqueOrThrow({
        where: {
          tmdb_id: params.tmdbId,
        },
      });
      return {
        tmdbId: person.tmdb_id,
        name: person.name,
        profilePath: person.profile_path,
      };
    },
  },
  Person: {
    movies: async ({ tmdbId }, { params }, _context: unknown) => {
      const { movieCredits, count } = await (params
        ? fetchPersonalizedMovieCreditsForActor(
            tmdbId,
            params.userId,
            params.exceptMovie || undefined,
          )
        : fetchMovieCreditsForActor(tmdbId));
      return {
        totalCount: count,
        edges: movieCredits.map(({ character_name, movie }) => ({
          cursor: "",
          characterName: character_name,
          node: {
            tmdbId: movie.tmdb_id,
            posterPath: movie.poster_path,
            title: movie.title,
          },
        })),
        pageInfo: {
          hasNextPage: false,
          endCursor: "",
        },
      };
    },
    episodes: async ({ tmdbId }, { params }, _context: unknown) => {
      const { tvCredits, count } = await (params
        ? fetchPersonalizedTvCreditsForActor(
            tmdbId,
            params.userId,
            params.exceptTvShow || undefined,
          )
        : fetchTvCreditsForActor(tmdbId));
      return {
        totalCount: count,
        edges: tvCredits.map(({ character_name, episode }) => ({
          cursor: "",
          characterName: character_name,
          node: {
            tmdbId: episode.tv_show_id,
            seasonNumber: episode.season_number,
            episodeNumber: episode.episode_number,
            id: episode.id,
            title: episode.title,
          },
        })),
        pageInfo: {
          hasNextPage: false,
          endCursor: "",
        },
      };
    },
  },
};

export default resolvers;
