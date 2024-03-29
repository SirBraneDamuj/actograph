import { ApolloServer, ApolloServerPlugin, BaseContext } from "@apollo/server";
import resolvers from "./resolvers.js";
import typeDefs from "./typeDefs.js";

export function buildServer(
  plugins: ApolloServerPlugin<BaseContext>[],
): ApolloServer<BaseContext> {
  return new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [...plugins],
  });
}
