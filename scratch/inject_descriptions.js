const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const roswellDesc = `This picture dates from 2003, it was saved by Wayback Machine in 2004, this rules out AI. D.S. got hold of the photo in question in 1952. We soon became friends and started talking, and it turned out that the man had experience working on debris. This site matches one from Roswell! The photos below are from the debris field nearest Roswell, designated by the city as the crash site. The shape of the craft in the photo, manta ray, matches Corso's description in his book of the day after Roswell, he said the craft is manta-ray or delta-shaped, with wings.`;

  const mappings = [
    { 
      pattern: "ROSWELL DEBRIS", 
      data: { 
        description: roswellDesc, 
        year: 1947, 
        source: "Wayback Machine Archive", 
        country: "USA",
        tags: "Roswell, Crash, Debris, Manta-Ray, Corso"
      } 
    },
    { 
      pattern: "RENDLESHAM", 
      data: { 
        description: "Analysis of the landing site at Rendlesham Forest, UK. Trace radiation and physical indentations correlate with witness testimony from the 1980 incident.", 
        year: 1980, 
        source: "MoD Archive Leak", 
        country: "UK",
        tags: "Rendlesham, UK, Trace Evidence, Radiation"
      } 
    },
    { 
      pattern: "GIMBAL", 
      data: { 
        description: "Declassified ATFLIR frame showing the 'Gimbal' object encountered by US Navy pilots. Note the rotating orientation and lack of heat signature from traditional propulsion.", 
        year: 2015, 
        source: "Pentagon Declassified", 
        country: "USA",
        tags: "Gimbal, Nimitz, ATFLIR, UAP"
      } 
    },
    { 
      pattern: "MCMINNVILLE", 
      data: { 
        description: "The classic Trent family photographs from McMinnville, Oregon. Forensically analyzed multiple times; remains one of the most credible early UFO sightings.", 
        year: 1950, 
        source: "Public Record", 
        country: "USA",
        tags: "McMinnville, Trent, Disc, 1950"
      } 
    }
  ];

  for (const m of mappings) {
    const assets = await prisma.media.findMany({
      where: { title: { contains: m.pattern } }
    });

    for (const asset of assets) {
      await prisma.media.update({
        where: { id: asset.id },
        data: m.data
      });
      console.log(`Injected data into: ${asset.title}`);
    }
  }

  // Cleanup: Delete any duplicate that has a hyphen but NO description (the broken ones)
  const all = await prisma.media.findMany();
  for (const item of all) {
     if (item.title.includes("-") && (!item.description || item.description.length < 50)) {
        // Find if there is a better version with em-dash
        const better = all.find(b => b.title.includes("—") && b.title.replace("—", "").trim() === item.title.replace("-", "").trim());
        if (better) {
           console.log(`Removing broken hyphen duplicate: ${item.title}`);
           await prisma.media.delete({ where: { id: item.id } });
        }
     }
  }

  console.log("Injection and Cleanup complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
