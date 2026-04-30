import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const aatip = await prisma.agency.findUnique({ where: { slug: "aatip" } });
  if (!aatip) {
    console.log("⚠️ AATIP missing. Creating...");
    await prisma.agency.create({
      data: {
        name: "Advanced Aerospace Threat Identification Program",
        slug: "aatip",
        colorPrimary: "#ff6600",
        colorSecondary: "#331100",
        country: "USA",
        description: "Pentagon's secret UAP investigation program."
      }
    });
    console.log("✅ AATIP created.");
  } else {
    console.log("✅ AATIP already exists.");
  }
}

main().finally(() => prisma.$disconnect());
