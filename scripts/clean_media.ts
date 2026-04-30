import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning up non-local media...");
  const deleted = await prisma.media.deleteMany({
    where: {
      NOT: {
        filePath: {
          startsWith: "/media"
        }
      }
    }
  });
  console.log(`✅ Deleted ${deleted.count} remote assets. Only local "UFO LEAK" files remain.`);
}

main().finally(() => prisma.$disconnect());
