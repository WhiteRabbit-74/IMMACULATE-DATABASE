import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function checkDatabase() {
  console.log(`\nUsing Database URL: ${process.env.DATABASE_URL}`);
  
  const docs = await prisma.document.findMany();
  console.log(`📊 Total documents found = ${docs.length}`);
  
  const titles = docs.map(d => d.title).sort();
  const titleCounts: Record<string, number> = {};
  
  for (const title of titles) {
    titleCounts[title] = (titleCounts[title] || 0) + 1;
  }

  let duplicatesFound = false;
  for (const [title, count] of Object.entries(titleCounts)) {
    if (count > 1) {
      duplicatesFound = true;
      console.log(`⚠️ DUPLICATE DETECTED: [x${count}] "${title}"`);
    }
  }
  
  if (!duplicatesFound && docs.length > 0) {
     console.log("✅ No duplicates detected among retrieved titles.");
  }
  
  if (docs.length > 0) {
    const maj12 = docs.filter(d => d.title.includes("Majestic 12"));
    console.log(`\n🛸 Majestic 12 documents found: ${maj12.length}`);
    maj12.forEach((m, i) => console.log(`   ${i+1}. [${m.id}] ${m.title}`));
  }
}

checkDatabase()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
