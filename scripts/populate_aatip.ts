import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const aatip = await prisma.agency.findUnique({ where: { slug: "aatip" } });
  if (!aatip) return;

  console.log("📂 Adding specific AATIP records...");

  const docs = [
    {
      title: "AATIP — 38 Defense Intelligence Reference Documents (DIRDs)",
      description: "Complete list of the 38 scientific papers commissioned by AATIP, covering topics like warp drives, wormholes, and invisibility cloaking.",
      year: 2012,
      agencyId: aatip.id,
      status: "declassified",
      tags: ["aatip", "dird", "warp-drive", "pentagon"],
      filePath: "https://www.dia.mil/FOIA/FOIA-Electronic-Reading-Room/FileId/170026/",
      country: "USA"
    },
    {
      title: "Luis Elizondo AATIP Resignation Letter — SECDEF Mattis",
      description: "Official resignation letter of Luis Elizondo, director of AATIP, citing lack of attention to UAP threat and excessive secrecy as reasons for leaving.",
      year: 2017,
      agencyId: aatip.id,
      status: "declassified",
      tags: ["aatip", "elizondo", "mattis", "whistleblower"],
      filePath: "https://www.nytimes.com/2017/12/16/us/politics/pentagon-program-ufo-harry-reid.html",
      country: "USA"
    },
    {
      title: "AATIP Analysis of the 2004 Nimitz Encounter",
      description: "Technical report produced by AATIP analysts regarding the 'Tic-Tac' UAP seen by Commander David Fravor and Lt. Cmdr. Alex Dietrich.",
      year: 2009,
      agencyId: aatip.id,
      status: "classified",
      tags: ["aatip", "nimitz", "tic-tac", "analysis"],
      filePath: "https://www.defense.gov/",
      country: "USA"
    }
  ];

  for (const doc of docs) {
    const { tags, ...rest } = doc;
    await prisma.document.create({
      data: {
        ...rest,
        tags: {
          connectOrCreate: tags.map(name => ({
            where: { name },
            create: { name }
          }))
        }
      }
    });
  }

  console.log("✅ AATIP records added.");
}

main().finally(() => prisma.$disconnect());
