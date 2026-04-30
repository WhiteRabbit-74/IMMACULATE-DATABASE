import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const agencies = await prisma.agency.findMany();
  console.log("AGENCIES:", agencies.map(a => ({ id: a.id, name: a.name, slug: a.slug })));

  const docs = await prisma.document.findMany({
    take: 5,
    include: { tags: true }
  });
  console.log("LATEST DOCUMENTS:", docs.map(d => ({ 
    id: d.id, 
    title: d.title, 
    tags: d.tags.map(t => t.name) 
  })));

  const projects = [
    "bluebook", "mj12", "monarch", "gateway", "aquarius", 
    "stargate", "moondust", "grudge", "sign", "serpo", "pounce"
  ];
  
  for (const p of projects) {
    const count = await prisma.document.count({
      where: { tags: { some: { name: p } } }
    });
    console.log(`PROJECT ${p}: ${count} docs`);
  }
}

main().finally(() => prisma.$disconnect());
