import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanDuplicates() {
  console.log("🧹 Starting duplicate cleanup process...");

  // Fetch all documents
  const allDocs = await prisma.document.findMany({
    orderBy: { createdAt: "asc" },
  });

  const seenTitles = new Set();
  const duplicateIds = [];

  for (const doc of allDocs) {
    if (seenTitles.has(doc.title)) {
      duplicateIds.push(doc.id);
    } else {
      seenTitles.add(doc.title);
    }
  }

  if (duplicateIds.length === 0) {
    console.log("✅ No duplicates found. System is clean.");
  } else {
    console.log(`⚠️ Found ${duplicateIds.length} duplicate documents. Eliminating...`);
    
    const result = await prisma.document.deleteMany({
      where: {
        id: { in: duplicateIds }
      }
    });

    console.log(`🗑️ Successfully deleted ${result.count} duplicate records.`);
  }

  await prisma.$disconnect();
}

cleanDuplicates().catch((e) => {
  console.error("Error during cleanup:", e);
  process.exit(1);
});
