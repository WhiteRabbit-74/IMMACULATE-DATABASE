const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting Media Category Alignment...");

  // Get all media with category 'event'
  const eventMedia = await prisma.media.findMany({
    where: { category: 'event' }
  });

  for (const m of eventMedia) {
    // Determine new category based on type
    const newCategory = m.type === 'video' ? 'video' : 'photo';
    
    // Ensure 'event' is in the tags if not already
    const currentTags = m.tags || "";
    const newTags = currentTags.toLowerCase().includes('event') ? currentTags : `${currentTags}, event`.replace(/^, /, "");

    await prisma.media.update({
      where: { id: m.id },
      data: {
        category: newCategory,
        tags: newTags
      }
    });
    console.log(`Updated ${m.title}: category -> ${newCategory}, tags enriched.`);
  }

  console.log("Media Category Alignment Complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
