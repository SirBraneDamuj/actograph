import MovieResolvers from "../movie/resolver.js";
import UserResolvers from "../user/resolver.js";

export default {
  ...MovieResolvers,
  ...UserResolvers,
};
