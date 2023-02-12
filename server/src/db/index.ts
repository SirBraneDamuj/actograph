import type { PrismaClient as ImportedPrismaClient } from "@prisma/client";
import { createRequire } from "module";

const require = createRequire(import.meta.url ?? __filename);

const { PrismaClient: RequiredPrismaClient } = require("@prisma/client");

const _PrismaClient: typeof ImportedPrismaClient = RequiredPrismaClient;

export class PrismaClient extends _PrismaClient {}

const client = new _PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

client.$on("query", async (e) => {
  console.log(`${e.query} | ${e.params}`);
});

export default client;
