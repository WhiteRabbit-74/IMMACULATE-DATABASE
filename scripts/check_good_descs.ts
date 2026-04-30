import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const media = await prisma.media.findMany();
  for (const m of media) {
    if (m.description && m.description.length > 50) {
      console.log(`TITLE: ${m.title}`);
      console.log(`DESC: ${m.description}`);
      console.log(`---`);
    }
  }
}

main().finally(() => prisma.$disconnect());
