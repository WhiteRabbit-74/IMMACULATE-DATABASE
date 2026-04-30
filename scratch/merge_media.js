const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Get all media to identify duplicates
  const allMedia = await prisma.media.findMany();
  
  // Mapping of detailed descriptions to titles
  const detailedData = allMedia.filter(m => m.description && m.description.length > 100);
  
  for (const detail of detailedData) {
    // Find the duplicate that has the working file path (likely has the em-dash or was indexed later)
    // We search for something with the same title but different dash or just indexed later
    const normalizedTitle = detail.title.replace(/[\-—]/g, " ").replace(/\s+/g, " ").trim();
    
    const workingAsset = allMedia.find(m => 
      m.id !== detail.id && 
      m.title.replace(/[\-—]/g, " ").replace(/\s+/g, " ").trim() === normalizedTitle &&
      (m.filePath.includes("—") || m.description.includes("Automatically indexed"))
    );

    if (workingAsset) {
      console.log(`Merging ${detail.title} -> ${workingAsset.title}`);
      
      // Update the working asset with the good data
      await prisma.media.update({
        where: { id: workingAsset.id },
        data: {
          title: detail.title, // Keep the better title
          description: detail.description,
          year: detail.year,
          source: detail.source,
          country: detail.country,
          tags: detail.tags,
          category: detail.category
        }
      });

      // Delete the old one with broken path
      await prisma.media.delete({
        where: { id: detail.id }
      });
    }
  }

  // 2. Final cleanup of any remaining "Automatically indexed" items that are duplicates
  const finalScan = await prisma.media.findMany();
  for (const item of finalScan) {
    if (item.description && item.description.includes("Automatically indexed")) {
      const betterVersion = finalScan.find(m => 
        m.id !== item.id && 
        m.title.replace(/[\-—]/g, " ").replace(/\s+/g, " ").trim() === item.title.replace(/[\-—]/g, " ").replace(/\s+/g, " ").trim() &&
        !m.description.includes("Automatically indexed")
      );
      
      if (betterVersion) {
        console.log(`Removing redundant indexed item: ${item.title}`);
        await prisma.media.delete({ where: { id: item.id } });
      }
    }
  }

  console.log("Cleanup and Merge complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
