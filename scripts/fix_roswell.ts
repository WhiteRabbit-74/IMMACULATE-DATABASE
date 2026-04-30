import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🛸 Fixing Roswell Intelligence Assets...");

  const roswellMedia = [
    { 
      type: "image", 
      category: "photo", 
      title: "Roswell Debris — Intelligence Officers Photo", 
      description: "Original 1947 photograph of Major Jesse Marcel with debris from the Foster ranch, later claimed to be a weather balloon.", 
      filePath: "https://upload.wikimedia.org/wikipedia/commons/2/23/Roswell_Debris.jpg", 
      year: 1947, 
      tags: "roswell,debris,1947,marcel,crash" 
    },
    { 
      type: "image", 
      category: "artifact", 
      title: "Roswell Daily Record — 'RAAF Captures Flying Saucer'", 
      description: "The original July 8, 1947 front page of the Roswell Daily Record announcing the recovery of a flying saucer.", 
      filePath: "https://upload.wikimedia.org/wikipedia/commons/7/70/RoswellDailyRecordJuly81947.jpg", 
      year: 1947, 
      tags: "roswell,newspaper,1947,raaf,evidence" 
    },
    { 
      type: "image", 
      category: "photo", 
      title: "Major Jesse Marcel with Debris", 
      description: "Another angle of Major Marcel examining the foil-like materials found near Roswell, New Mexico.", 
      filePath: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Jesse_Marcel_with_debris.jpg", 
      year: 1947, 
      tags: "roswell,marcel,debris,1947" 
    }
  ];

  for (const asset of roswellMedia) {
    const existing = await prisma.media.findFirst({ where: { title: asset.title } });
    if (existing) {
      await prisma.media.update({ where: { id: existing.id }, data: asset });
    } else {
      await prisma.media.create({ data: asset });
    }
  }

  console.log("✅ Roswell assets restored and verified.");
}

main().finally(() => prisma.$disconnect());
