import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { startStandaloneServer } from "@apollo/server/standalone";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { Express } from "express";
import http from "http";
import "reflect-metadata";
import db from "./db/index.js";
import { buildServer } from "./graphql/index.js";

dotenv.config();

const app: Express = express();
const port = 3000;
const httpServer = http.createServer(app);

const server = buildServer([ApolloServerPluginDrainHttpServer({ httpServer })]);

if (process.env.ACTOGRAPH_DEV_MODE === "standalone") {
  const { url } = await startStandaloneServer(server);
  console.log(`🚀 Server ready at ${url}`);
} else {
  await server.start();

  app.use(cors(), bodyParser.json(), expressMiddleware(server));

  httpServer.listen({ port }).on("close", () => db.$disconnect());
  console.log(`🚀 Server ready at http://localhost:${port}`);
}
