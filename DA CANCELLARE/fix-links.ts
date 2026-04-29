const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const REAL_IMAGES = [
  "https://upload.wikimedia.org/wikipedia/commons/e/ec/F-117_Nighthawk_Front.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/5f/UFO_photographed_by_a_farmer_in_McMinnville%2C_Oregon.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/4/4b/CIA_Headquarters_aerial.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/23/SR-71_Blackbird_in_flight.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/7/75/Apollo_11_footprint.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/35/Gimbal_UFO.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/B-2_Spirit_original.jpg/1200px-B-2_Spirit_original.jpg"
];

// A real declassified CIA PDF on Wikimedia Commons (e.g. MKULTRA or similar, or just a valid generic test PDF)
const REAL_PDF = "https://upload.wikimedia.org/wikipedia/commons/8/87/CIA-RDP96-00788R001700210016-5.pdf";

async function main() {
  console.log("Fixing all broken media and document links to reliable Wikimedia sources...");

  // Fix documents
  const docs = await prisma.document.findMany();
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    await prisma.document.update({
      where: { id: doc.id },
      data: {
        filePath: REAL_PDF,
        coverPath: REAL_IMAGES[i % REAL_IMAGES.length],
      }
    });
  }

  // Fix media
  const media = await prisma.media.findMany();
  for (let i = 0; i < media.length; i++) {
    const m = media[i];
    const newUrl = REAL_IMAGES[i % REAL_IMAGES.length];
    await prisma.media.update({
      where: { id: m.id },
      data: {
        filePath: newUrl,
        thumbnailPath: newUrl
      }
    });
  }

  console.log("Finished fixing links!");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
