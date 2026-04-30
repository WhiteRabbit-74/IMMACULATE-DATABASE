import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabase() {
  const docs = await prisma.document.findMany();
  console.log(`\n📊 DATABASE DIAGNOSTICS: Total documents found = ${docs.length}\n`);
  
  const titles = docs.map(d => d.title).sort();
  const titleCounts: Record<string, number> = {};
  
  for (const title of titles) {
    titleCounts[title] = (titleCounts[title] || 0) + 1;
  }

  for (const [title, count] of Object.entries(titleCounts)) {
    if (count > 1) {
      console.log(`⚠️ DUPLICATE DETECTED: [x${count}] "${title}"`);
    }
  }
  
  console.log("\n🔍 ALL TITLES:");
  for (let i = 0; i < titles.length; i++) {
    console.log(`${i + 1}. ${titles[i]}`);
  }
}

checkDatabase()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
