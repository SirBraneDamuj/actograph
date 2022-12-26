import MovieResolvers from "../movie/resolver.js";
import PersonResolvers from "../person/resolver.js";
import UserResolvers from "../user/resolver.js";

export default {
  ...MovieResolvers,
  ...UserResolvers,
  ...PersonResolvers,
  Query: {
    ...MovieResolvers.Query,
    ...UserResolvers.Query,
    ...PersonResolvers.Query,
  },
  Mutation: {
    ...MovieResolvers.Mutation,
    ...UserResolvers.Mutation,
    ...PersonResolvers.Mutation,
  },
};
