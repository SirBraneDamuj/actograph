import { PrismaClient } from "@prisma/client";

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
