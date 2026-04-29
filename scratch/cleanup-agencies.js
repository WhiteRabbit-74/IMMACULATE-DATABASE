const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  const AGENCY_MAP = {
    "BLUEBOOK": "usaf",
    "GATEWAY": "cia",
    "MONARCH": "cia",
    "AQUARIUS": "nsa",
    "STARGATE": "cia",
    "MJ12": "cia",
    "SENZA PROGETTI": "dod"
  };

  console.log('🧹 Cleaning up project/agency confusion...');

  for (const [folder, slug] of Object.entries(AGENCY_MAP)) {
    const projectSlug = folder.toLowerCase();
    
    // Find documents linked to this "fake" agency
    const fakeAgency = await prisma.agency.findUnique({ where: { slug: projectSlug } });
    if (fakeAgency) {
       const realAgency = await prisma.agency.findUnique({ where: { slug: slug } });
       if (realAgency) {
          console.log(`- Re-linking docs from ${fakeAgency.name} to ${realAgency.name}`);
          await prisma.document.updateMany({
            where: { agencyId: fakeAgency.id },
            data: { agencyId: realAgency.id }
          });
          
          // Delete fake agency
          await prisma.agency.delete({ where: { id: fakeAgency.id } });
          console.log(`- Deleted fake agency: ${fakeAgency.name}`);
       }
    }
  }

  console.log('✅ Cleanup complete.');
}

cleanup();
