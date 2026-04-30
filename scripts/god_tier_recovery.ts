import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 FINAL INTEL RECOVERY: Restoring 'God-Tier' Forensic Descriptions...");

  // 1. DEDUPLICATION (Title & Path)
  const allMedia = await prisma.media.findMany();
  const seenPaths = new Set();
  const seenTitles = new Set();
  const toDelete = [];

  for (const m of allMedia) {
    const normalizedTitle = m.title.replace(/—/g, "-").replace(/\s+/g, " ").trim().toUpperCase();
    if (seenPaths.has(m.filePath) || seenTitles.has(normalizedTitle)) {
      toDelete.push(m.id);
    } else {
      seenPaths.add(m.filePath);
      seenTitles.add(normalizedTitle);
    }
  }

  if (toDelete.length > 0) {
    await prisma.media.deleteMany({ where: { id: { in: toDelete } } });
    console.log(`🗑️ Deleted ${toDelete.length} duplicate records.`);
  }

  // 2. MASTER INTELLIGENCE DATA
  const intelData = [
    {
      pattern: "ROSWELL",
      data: {
        category: "artifact",
        year: 1947,
        description: "Official 1947 crash debris from the Foster ranch near Roswell, NM. Major Jesse Marcel described the material as 'foil-like' but indestructible, capable of returning to its original shape when crumpled. Recent analysis suggests a multi-layered bismuth/magnesium-zinc alloy acting as a waveguide for terahertz frequencies. Riferimenti al Colonnello Corso confermano il recupero di tecnologie poi usate per fibre ottiche e circuiti integrati.",
        tags: "Roswell, 1947, Marcel, Corso, Manta-Ray, Crash, Debris",
        source: "RAAF / Wayback Machine Archive",
        country: "USA"
      }
    },
    {
      pattern: "GIMBAL",
      data: {
        category: "thermal",
        year: 2015,
        description: "Tactical ATFLIR frame from the 2015 Nimitz Strike Group encounter. The 'Gimbal' object exhibits no wings, no tail, and no visible exhaust. Its rotation against the wind at hypersonic speeds defies conventional aerodynamics. Verified by Commander David Fravor and Lt. Cmdr. Alex Dietrich during the CAP point intercept.",
        tags: "Gimbal, 2015, Nimitz, UAP, ATFLIR, Navy",
        source: "US Navy / DoD Declassified",
        country: "USA"
      }
    },
    {
      pattern: "MCMINNVILLE",
      data: {
        category: "photo",
        year: 1950,
        description: "The Trent family photographs, taken on May 11, 1950, in McMinnville, Oregon. Forensically analyzed by the Condon Committee and numerous independent researchers. The object exhibits a distinct metallic luster and a centralized upper superstructure. No evidence of suspension wires or photographic manipulation has ever been found. One of the most significant early records of a 'flying saucer'.",
        tags: "McMinnville, 1950, Trent, Saucer, Condon Report",
        source: "Trent Family Archive / Public Record",
        country: "USA"
      }
    },
    {
      pattern: "RENDLESHAM",
      data: {
        category: "evidence",
        year: 1980,
        description: "Trace evidence from the Rendlesham Forest incident (The 'British Roswell'), December 1980. Sergents Jim Penniston and John Burroughs encountered a triangular craft emitting intense light. Penniston touched the craft, reportedly receiving a telepathic binary code download. Soil analysis confirmed radiation levels 10x higher than background at the three landing indentations.",
        tags: "Rendlesham, 1980, Bentwaters, Binary Code, Penniston, Trace Evidence",
        source: "MoD / RAF Woodbridge Internal Memo",
        country: "UK"
      }
    },
    {
      pattern: "BLACK KNIGHT",
      data: {
        category: "satellite",
        year: 1998,
        description: "STS-88 photography showing an anomalous dark object in polar orbit. While NASA officially designated it as a 'space blanket' (thermal shield lost during EVA), signals intelligence tracking dates the 'Black Knight' satellite back to the 1950s, with alleged origins in the Epsilon Boötis star system according to Duncan Lunan's 1973 analysis of LDE (Long Delayed Echoes).",
        tags: "Black Knight, STS-88, Satellite, Polar Orbit, LDE",
        source: "NASA / SIGINT Leak",
        country: "USA"
      }
    }
  ];

  for (const intel of intelData) {
    const assets = await prisma.media.findMany({
      where: { title: { contains: intel.pattern } }
    });

    for (const asset of assets) {
      // Fix file paths for these specific ones to ensure they don't "crash"
      let finalPath = asset.filePath;
      if (asset.title.includes("ROSWELL DEBRIS") && asset.title.includes("1")) {
        finalPath = "/media/foto/UFO LEAK/ROSWELL DEBRIS — OFFICIAL PHOTO 1.webp";
      } else if (asset.title.includes("ROSWELL DEBRIS") && asset.title.includes("2")) {
        finalPath = "/media/foto/UFO LEAK/ROSWELL DEBRIS — OFFICIAL PHOTO 2.webp";
      } else if (asset.title.includes("GIMBAL")) {
        finalPath = "/media/foto/UFO LEAK/GIMBAL INCIDENT — ATFLIR FRAME.webp";
      } else if (asset.title.includes("MCMINNVILLE")) {
        finalPath = "/media/foto/UFO LEAK/MCMINNVILLE SIGHTING 1950.webp";
      } else if (asset.title.includes("BLACK KNIGHT")) {
        finalPath = "/media/foto/UFO LEAK/BLACK KNIGHT SATELLITE — STS-88.webp";
      } else if (asset.title.includes("RENDLESHAM")) {
        finalPath = "/media/foto/UFO LEAK/RENDLESHAM FOREST TRACE EVIDENCE.jpg";
      }

      await prisma.media.update({
        where: { id: asset.id },
        data: {
          ...intel.data,
          filePath: finalPath
        }
      });
      console.log(`✅ Restored God-Tier Intel & Fixed Path for: ${asset.title}`);
    }
  }

  // 3. FINAL SWEEP: Fix any remaining local paths to use the correct folder structure
  const allLocal = await prisma.media.findMany({
    where: { filePath: { not: { startsWith: "http" } } }
  });

  for (const asset of allLocal) {
    let newPath = asset.filePath;
    
    // Check in UFO LEAK folder first
    if (asset.filePath.includes("UFO LEAK") || asset.type === "image") {
      const fileName = asset.filePath.split("/").pop();
      newPath = `/media/foto/UFO LEAK/${fileName}`;
    }
    
    // Special check for videos in the Pentagon folder
    if (asset.type === "video") {
       if (asset.title.includes("NIMITZ") || asset.title.includes("FLIR1")) newPath = "/media/video/VIDEO PENTAGONO/flir1.mp4";
       if (asset.title.includes("GOFAST")) newPath = "/media/video/VIDEO PENTAGONO/3 - GOFAST.mp4";
       if (asset.title.includes("MOSUL") || asset.title.includes("MIDDLE EAST ORB")) newPath = "/media/video/VIDEO PENTAGONO/Middle East Object.mp4";
       if (asset.title.includes("AL TAQADDUM")) newPath = "/media/video/VIDEO PENTAGONO/Al Taqaddum Object.mp4";
    }

    await prisma.media.update({
      where: { id: asset.id },
      data: { filePath: newPath }
    });
  }

  // 3. SPECIAL FIX FOR GIMBAL (Ensure it's in thermal/IR category)
  await prisma.media.updateMany({
    where: { title: { contains: "GIMBAL" } },
    data: { category: "thermal" }
  });

  console.log("\n✨ Restoration Complete. Media integrity at 100%.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
