const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function cleanup() {
  console.log("🔐 Inizializzazione protocollo di sanificazione database...");
  
  // Trova tutti i documenti
  const allDocs = await prisma.document.findMany();
  const seen = new Set();
  const duplicates = [];

  for (const doc of allDocs) {
    const key = `${doc.title}-${doc.year}-${doc.agencyId}`;
    if (seen.has(key)) {
      duplicates.push(doc.id);
    } else {
      seen.add(key);
    }
  }

  if (duplicates.length > 0) {
    console.log(`⚠️ Rilevati ${duplicates.length} documenti ridondanti. Procedo alla rimozione...`);
    await prisma.document.deleteMany({
      where: {
        id: { in: duplicates }
      }
    });
    console.log("✅ Sanificazione completata. Archivio ora coerente.");
  } else {
    console.log("✅ Nessun duplicato rilevato. Il database è integro.");
  }
}

cleanup()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
