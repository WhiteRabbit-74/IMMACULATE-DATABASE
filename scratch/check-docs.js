const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const docs = await prisma.document.findMany({
    where: { filePath: { contains: 'PDF LIBRI' } }
  });
  console.log('SYNCED_DOCS_COUNT:', docs.length);
  docs.forEach(d => console.log(`- ${d.title}: ${d.filePath}`));
}

check();
