import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Adding AATIP to Agencies...");

  const aatip = await prisma.agency.upsert({
    where: { slug: "aatip" },
    update: {},
    create: {
      name: "Advanced Aerospace Threat Identification Program",
      slug: "aatip",
      colorPrimary: "#00f2ff",
      colorSecondary: "#006066",
      country: "USA",
      description: "Secret Pentagon program (2007-2012) investigating UAPs and advanced aerospace threats.",
    },
  });

  console.log(`✅ Agency created: ${aatip.name}`);

  // Update documents that mention AATIP in title or tags
  const updated = await prisma.document.updateMany({
    where: {
      OR: [
        { title: { contains: "AATIP" } },
        { tags: { some: { name: "aatip" } } }
      ]
    },
    data: {
      agencyId: aatip.id
    }
  });

  console.log(`📊 Updated ${updated.count} documents to AATIP agency.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
