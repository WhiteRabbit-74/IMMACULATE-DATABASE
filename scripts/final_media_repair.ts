import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🛠️ Repairing Intelligence Media: Deduplicating and Restoring Master Descriptions...");

  // 1. Remove obvious duplicates (same filePath)
  const allMedia = await prisma.media.findMany();
  const seenPaths = new Set();
  const toDelete = [];

  for (const m of allMedia) {
    if (seenPaths.has(m.filePath)) {
      toDelete.push(m.id);
    } else {
      seenPaths.add(m.filePath);
    }
  }

  // Also remove title-based duplicates if they have the same content
  const seenTitles = new Map();
  for (const m of allMedia) {
    if (toDelete.includes(m.id)) continue;
    const normalizedTitle = m.title.replace(/—/g, "-").replace(/\s+/g, " ").trim().toUpperCase();
    if (seenTitles.has(normalizedTitle)) {
      toDelete.push(m.id);
    } else {
      seenTitles.set(normalizedTitle, m.id);
    }
  }

  if (toDelete.length > 0) {
    await prisma.media.deleteMany({ where: { id: { in: toDelete } } });
    console.log(`🗑️ Deleted ${toDelete.length} duplicate assets.`);
  }

  // 2. Master Descriptions Dictionary
  const masterIntel = [
    {
      pattern: "ROSWELL",
      update: {
        year: 1947,
        category: "artifact",
        description: "Official 1947 crash debris from the Foster ranch near Roswell, NM. Major Jesse Marcel described the material as 'foil-like' but indestructible, capable of returning to its original shape when crumpled. Recent analysis suggests a multi-layered bismuth/magnesium-zinc alloy acting as a waveguide for terahertz frequencies. Riferimenti al Colonnello Corso confermano il recupero di tecnologie poi usate per fibre ottiche e circuiti integrati.",
        tags: "Roswell, 1947, Marcel, Corso, Manta-Ray, Crash, Debris",
        source: "RAAF / Wayback Machine Archive"
      }
    },
    {
      pattern: "MCMINNVILLE",
      update: {
        year: 1950,
        category: "photo",
        description: "The Trent family photographs, taken on May 11, 1950, in McMinnville, Oregon. Forensically analyzed by the Condon Committee and numerous independent researchers. The object exhibits a distinct metallic luster and a centralized upper superstructure. No evidence of suspension wires or photographic manipulation has ever been found. One of the most significant early records of a 'flying saucer'.",
        tags: "McMinnville, 1950, Trent, Saucer, Condon Report",
        source: "Trent Family Archive / Public Record"
      }
    },
    {
      pattern: "RENDLESHAM",
      update: {
        year: 1980,
        category: "evidence",
        description: "Trace evidence from the Rendlesham Forest incident (The 'British Roswell'), December 1980. Sergents Jim Penniston and John Burroughs encountered a triangular craft emitting intense light. Penniston touched the craft, reportedly receiving a telepathic binary code download. Soil analysis confirmed radiation levels 10x higher than background at the three landing indentations.",
        tags: "Rendlesham, 1980, Bentwaters, Binary Code, Penniston, Trace Evidence",
        source: "MoD / RAF Woodbridge Internal Memo"
      }
    },
    {
      pattern: "GIMBAL",
      update: {
        year: 2015,
        category: "thermal",
        description: "Tactical ATFLIR frame from the 2015 Nimitz Strike Group encounter. The 'Gimbal' object exhibits no wings, no tail, and no visible exhaust. Its rotation against the wind at hypersonic speeds defies conventional aerodynamics. Verified by Commander David Fravor and Lt. Cmdr. Alex Dietrich during the CAP point intercept.",
        tags: "Gimbal, 2015, Nimitz, UAP, ATFLIR, Navy",
        source: "US Navy / DoD Declassified"
      }
    },
    {
       pattern: "BLACK KNIGHT",
       update: {
         year: 1998,
         category: "satellite",
         description: "STS-88 photography showing an anomalous dark object in polar orbit. While NASA officially designated it as a 'space blanket' (thermal shield lost during EVA), signals intelligence tracking dates the 'Black Knight' satellite back to the 1950s, with alleged origins in the Epsilon Boötis star system according to Duncan Lunan's 1973 analysis of LDE (Long Delayed Echoes).",
         tags: "Black Knight, STS-88, Satellite, Polar Orbit, LDE",
         source: "NASA / SIGINT Leak"
       }
    },
    {
      pattern: "PHOENIX",
      update: {
        year: 1997,
        category: "event",
        description: "V-shaped formation of lights over Phoenix, AZ, March 13, 1997. Witnessed by thousands including Governor Fife Symington. The objects were reported to be massive, blocking out the stars as they passed silently overhead. The official explanation of flares from Luke AFB remains highly disputed.",
        tags: "Phoenix Lights, 1997, Arizona, Mass Sighting, V-Shape",
        source: "Witness Reports / MUFON"
      }
    }
  ];

  for (const item of masterIntel) {
    const assets = await prisma.media.findMany({
      where: { title: { contains: item.pattern } }
    });

    for (const asset of assets) {
      await prisma.media.update({
        where: { id: asset.id },
        data: item.update
      });
      console.log(`✨ Restored high-intel description for: ${asset.title}`);
    }
  }

  console.log("✅ Final Cleanup and Restoration Complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
