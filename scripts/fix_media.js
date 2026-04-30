const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixMedia() {
  const media = await prisma.media.findMany();
  
  const titleMap = new Map();
  const toDelete = [];

  for (const m of media) {
    if (!titleMap.has(m.title)) {
      titleMap.set(m.title, m);
    } else {
      // If we already have this title, mark for deletion.
      toDelete.push(m.id);
    }
  }

  if (toDelete.length > 0) {
    await prisma.media.deleteMany({
      where: {
        id: { in: toDelete }
      }
    });
    console.log(`Deleted ${toDelete.length} duplicate media assets.`);
  } else {
    console.log("No duplicates found.");
  }
}

fixMedia().catch(console.error).finally(() => prisma.$disconnect());
