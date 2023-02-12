import type { PrismaClient as ImportedPrismaClient } from "@prisma/client";
import { createRequire } from "module";

const require = createRequire(import.meta.url ?? __filename);

const { PrismaClient: RequiredPrismaClient } = require("@prisma/client");

const _PrismaClient: typeof ImportedPrismaClient = RequiredPrismaClient;

export class PrismaClient extends _PrismaClient {}

const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: {
      id: "49480f48-2a51-4e74-9af6-58b8b6fda848",
    },
    update: {},
    create: {
      id: "49480f48-2a51-4e74-9af6-58b8b6fda848",
      username: "sirbranedamuj",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
