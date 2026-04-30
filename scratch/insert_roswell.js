import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const roswellDesc = `This picture dates from 2003, it was saved by Wayback Machine in 2004, this rules out AI. D.S. got hold of the photo in question in 1952. We soon became friends and started talking, and it turned out that the man had experience working on debris. This site matches one from Roswell! The photos below are from the debris field nearest Roswell, designated by the city as the crash site. The shape of the craft in the photo, manta ray, matches Corso's description in his book of the day after Roswell, he said the craft is manta-ray or delta-shaped, with wings.`;

  const items = [
    {
      title: "ROSWELL DEBRIS - OFFICIAL PHOTO 1",
      description: roswellDesc,
      type: "image",
      category: "event",
      filePath: "/media/foto/UFO LEAK/ROSWELL DEBRIS - OFFICIAL PHOTO 1.webp",
      year: 1947,
      tags: "Roswell, Crash, Debris, Manta-Ray, Corso",
      source: "Wayback Machine Archive",
      country: "USA"
    },
    {
      title: "ROSWELL DEBRIS - OFFICIAL PHOTO 2",
      description: roswellDesc,
      type: "image",
      category: "event",
      filePath: "/media/foto/UFO LEAK/ROSWELL DEBRIS - OFFICIAL PHOTO 2.webp",
      year: 1947,
      tags: "Roswell, Crash, Debris, Manta-Ray, Corso",
      source: "Wayback Machine Archive",
      country: "USA"
    },
    {
      title: "RENDLESHAM FOREST TRACE EVIDENCE",
      description: "Analysis of the landing site at Rendlesham Forest, UK. Trace radiation and physical indentations correlate with witness testimony from the 1980 incident.",
      type: "image",
      category: "event",
      filePath: "/media/foto/UFO LEAK/RENDLESHAM FOREST TRACE EVIDENCE.jpg",
      year: 1980,
      tags: "Rendlesham, UK, Trace Evidence, Radiation",
      source: "MoD Archive Leak",
      country: "UK"
    },
    {
      title: "GIMBAL INCIDENT - ATFLIR FRAME",
      description: "Declassified ATFLIR frame showing the 'Gimbal' object encountered by US Navy pilots. Note the rotating orientation and lack of heat signature from traditional propulsion.",
      type: "image",
      category: "event",
      filePath: "/media/foto/UFO LEAK/GIMBAL INCIDENT - ATFLIR FRAME.webp",
      year: 2015,
      tags: "Gimbal, Nimitz, ATFLIR, UAP",
      source: "Pentagon Declassified",
      country: "USA"
    },
    {
      title: "MCMINNVILLE SIGHTING 1950",
      description: "The classic Trent family photographs from McMinnville, Oregon. Forensically analyzed multiple times; remains one of the most credible early UFO sightings.",
      type: "image",
      category: "event",
      filePath: "/media/foto/UFO LEAK/MCMINNVILLE SIGHTING 1950.webp",
      year: 1950,
      tags: "McMinnville, Trent, Disc, 1950",
      source: "Public Record",
      country: "USA"
    }
  ];

  for (const item of items) {
    await prisma.media.create({
      data: item
    });
  }

  console.log("Assets ingested successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
