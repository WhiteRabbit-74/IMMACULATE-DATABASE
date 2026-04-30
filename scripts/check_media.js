const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMedia() {
  const media = await prisma.media.findMany();
  media.forEach(m => {
    console.log(`---`);
    console.log(`Title: ${m.title}`);
    console.log(`Desc: ${m.description}`);
  });
  console.log(`Total Media: ${media.length}`);
}

checkMedia().catch(console.error).finally(() => prisma.$disconnect());
