import MovieResolvers from "../movie/resolver.js";
import PersonResolvers from "../person/resolver.js";
import TvEpisodeResolvers from "../tvEpisode/resolver.js";
import UserResolvers from "../user/resolver.js";
import UserEpisodeResolvers from "../userEpisode/resolver.js";
import UserMovieResolvers from "../userMovie/resolver.js";

export default {
  ...MovieResolvers,
  ...UserResolvers,
  ...PersonResolvers,
  ...UserMovieResolvers,
  ...TvEpisodeResolvers,
  ...UserEpisodeResolvers,
  Query: {
    ...MovieResolvers.Query,
    ...UserResolvers.Query,
    ...PersonResolvers.Query,
    ...UserMovieResolvers.Query,
    ...TvEpisodeResolvers.Query,
    ...UserEpisodeResolvers.Query,
  },
  Mutation: {
    ...MovieResolvers.Mutation,
    ...UserResolvers.Mutation,
    ...PersonResolvers.Mutation,
    ...UserMovieResolvers.Mutation,
    ...TvEpisodeResolvers.Mutation,
    ...UserEpisodeResolvers.Mutation,
  },
};
