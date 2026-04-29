
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Delete media records that point to intelligence folders
  const result = await prisma.media.deleteMany({
    where: {
      OR: [
        { filePath: { contains: '/media/foto/EXTRATERRESTRI/' } },
        { filePath: { contains: '/media/foto/UFO UAP/' } },
        { filePath: { contains: '/media/foto/whistblower/' } }
      ]
    }
  });
  console.log(`Deleted ${result.count} intelligence assets from general Media table.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
