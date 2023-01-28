import { PrismaClient } from "@prisma/client";

const client = new PrismaClient({
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
