import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🛠️ Re-syncing Media Vault...");

  const mediaAssets = [
    { type: "image", category: "photo", title: "McMinville Sighting 1950", description: "Trent family farmhouse photograph of a metallic disc over Oregon.", filePath: "https://upload.wikimedia.org/wikipedia/commons/b/b3/McMinville_UFO_1.jpg", year: 1950, tags: "trent,oregon,1950,classic" },
    { type: "image", category: "satellite", title: "Black Knight Satellite — STS-88", description: "Photograph from the Space Shuttle Endeavour showing an unidentified orbital object.", filePath: "https://upload.wikimedia.org/wikipedia/commons/d/df/STS088-724-66.jpg", year: 1998, tags: "nasa,satellite,orbit,black-knight" },
    { type: "image", category: "thermal", title: "Gimbal Incident — ATFLIR Frame", description: "Thermal infrared frame from F/A-18 Super Hornet targeting pod showing an anomalous aerial object.", filePath: "https://upload.wikimedia.org/wikipedia/commons/e/e9/F-18_SH_ATFLIR_UFO.jpg", year: 2015, tags: "navy,thermal,ir,gimbal" },
    { type: "video", category: "video", title: "Nimitz 'Tic-Tac' HUD Footage", description: "Declassified HUD video from the 2004 Nimitz encounter.", filePath: "https://archive.org/download/GimbalGoFastNimitz/Gimbal.mp4", year: 2004, tags: "tic-tac,nimitz,navy,video" },
    { type: "audio", category: "audio", title: "WOW! Signal — Raw Data Transcription", description: "Audio representation of the narrowband radio signal detected by Jerry Ehman in 1977.", filePath: "https://archive.org/download/wow-signal-audio/wow.mp3", year: 1977, tags: "seti,radio,wow,signal" },
    { type: "image", category: "evidence", title: "Rendlesham Forest Trace Evidence", description: "Physical landing site analysis from the 1980 UK incident.", filePath: "https://upload.wikimedia.org/wikipedia/commons/0/07/UFO_Rendlesham_Forest_Depiction.jpg", year: 1980, tags: "uk,radiation,landing,trace" },
    { type: "image", category: "artifact", title: "Roswell Debris — Official Photo", description: "Intelligence officers examining wreckage found at the Brazel ranch in 1947.", filePath: "https://upload.wikimedia.org/wikipedia/commons/2/23/Roswell_Debris.jpg", year: 1947, tags: "roswell,debris,1947,crash" },
  ];

  for (const asset of mediaAssets) {
    const existing = await prisma.media.findFirst({ where: { filePath: asset.filePath } });
    if (existing) {
      await prisma.media.update({ where: { id: existing.id }, data: asset });
    } else {
      await prisma.media.create({ data: asset });
    }
  }

  console.log("✅ Media Vault synchronized successfully.");
}

main().finally(() => prisma.$disconnect());
