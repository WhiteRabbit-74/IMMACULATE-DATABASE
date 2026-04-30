import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📂 Injecting Extra Media Assets...");

  const extraMedia = [
    { type: "image", category: "photo", title: "Phoenix Lights 1997", description: "V-shaped formation of lights over the city of Phoenix, witnessed by thousands.", filePath: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Phoenix_Lights_1997.jpg", year: 1997, tags: "phoenix,lights,1997,mass-sighting" },
    { type: "image", category: "photo", title: "Battle of Los Angeles 1942", description: "Searchlights focusing on an unidentified object over Los Angeles during WWII.", filePath: "https://upload.wikimedia.org/wikipedia/commons/6/67/Battle_of_Los_Angeles_1942.jpg", year: 1942, tags: "la,1942,battle,searchlights" },
    { type: "image", category: "photo", title: "Petit-Rechain Triangle 1990", description: "The most famous photograph from the Belgian UFO wave showing a triangular craft.", filePath: "https://upload.wikimedia.org/wikipedia/commons/1/1a/UFO_Belgium_1990.jpg", year: 1990, tags: "belgium,triangle,1990,belgian-wave" },
    { type: "image", category: "thermal", title: "Aguadilla UFO — Thermal Tracking", description: "Infrared footage from a Homeland Security aircraft showing an object splitting into two underwater.", filePath: "https://upload.wikimedia.org/wikipedia/commons/8/87/Aguadilla_UFO.jpg", year: 2013, tags: "aguadilla,puerto-rico,thermal,uscg" },
    { type: "image", category: "artifact", title: "Betz Mystery Sphere", description: "A strange metallic sphere found in Florida in 1974 that reportedly moved on its own.", filePath: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Betz_Sphere.jpg", year: 1974, tags: "betz,sphere,artifact,florida" },
    { type: "image", category: "photo", title: "Tehran F-4 Intercept 1976", description: "Declassified depiction of the Iranian Air Force intercept of a glowing object.", filePath: "https://upload.wikimedia.org/wikipedia/commons/7/77/Tehran_UFO_1976.jpg", year: 1976, tags: "iran,tehran,1976,intercept" },
    { type: "image", category: "satellite", title: "Vela Satellite Flash 1979", description: "Satellite data indicating an unidentified double flash in the South Atlantic.", filePath: "https://upload.wikimedia.org/wikipedia/commons/3/30/Vela_Flash.jpg", year: 1979, tags: "vela,satellite,flash,nuclear" },
    { type: "image", category: "photo", title: "Valensole Landing Trace", description: "Physical traces left in a lavender field after a 1965 landing in France.", filePath: "https://upload.wikimedia.org/wikipedia/commons/4/44/Valensole_Trace.jpg", year: 1965, tags: "france,landing,trace,valensole" },
    { type: "image", category: "photo", title: "Lubbock Lights 1951", description: "Formation of V-shaped lights over Lubbock, Texas, captured by a student.", filePath: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Lubbock_Lights.jpg", year: 1951, tags: "lubbock,texas,1951,v-formation" },
    { type: "image", category: "photo", title: "Cumberland Spaceman 1964", description: "The famous 'Solway Firth Spaceman' photo showing an entity behind a young girl.", filePath: "https://upload.wikimedia.org/wikipedia/commons/5/52/Solway_Spaceman.jpg", year: 1964, tags: "spaceman,solway,1964,entity" },
  ];

  for (const asset of extraMedia) {
    const existing = await prisma.media.findFirst({ where: { filePath: asset.filePath } });
    if (!existing) {
      await prisma.media.create({ data: asset });
    }
  }

  console.log(`✅ Added ${extraMedia.length} extra media assets.`);
}

main().finally(() => prisma.$disconnect());
