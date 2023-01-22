import MovieResolvers from "../movie/resolver.js";
import PersonResolvers from "../person/resolver.js";
import UserResolvers from "../user/resolver.js";
import UserMovieResolvers from "../userMovie/resolver.js";

export default {
  ...MovieResolvers,
  ...UserResolvers,
  ...PersonResolvers,
  ...UserMovieResolvers,
  Query: {
    ...MovieResolvers.Query,
    ...UserResolvers.Query,
    ...PersonResolvers.Query,
    ...UserMovieResolvers.Query,
  },
  Mutation: {
    ...MovieResolvers.Mutation,
    ...UserResolvers.Mutation,
    ...PersonResolvers.Mutation,
    ...UserMovieResolvers.Mutation,
  },
};
