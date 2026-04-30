import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const operations = await prisma.operation.findMany();
  console.log(JSON.stringify(operations, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
