const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const agencies = [
    { name: 'FBI', slug: 'fbi', colorPrimary: '#005596', colorSecondary: '#000000' },
    { name: 'CIA', slug: 'cia', colorPrimary: '#000000', colorSecondary: '#ffffff' },
    { name: 'NSA', slug: 'nsa', colorPrimary: '#003366', colorSecondary: '#ffcc00' },
    { name: 'AARO', slug: 'aaro', colorPrimary: '#4a90e2', colorSecondary: '#1a1a1a' },
    { name: 'NASA', slug: 'nasa', colorPrimary: '#e03c31', colorSecondary: '#0032a0' },
    { name: 'DARPA', slug: 'darpa', colorPrimary: '#ff6b00', colorSecondary: '#000000' },
    { name: 'DIA', slug: 'dia', colorPrimary: '#7a2f8c', colorSecondary: '#1a1a1a' },
    { name: 'NGA', slug: 'nga', colorPrimary: '#00a88f', colorSecondary: '#000000' },
    { name: 'ONI', slug: 'oni', colorPrimary: '#c0c0c0', colorSecondary: '#000080' },
    { name: 'MI6', slug: 'mi6', colorPrimary: '#004a2d', colorSecondary: '#000000' },
    { name: 'Mossad', slug: 'mossad', colorPrimary: '#0038b8', colorSecondary: '#ffffff' },
    { name: 'FSB', slug: 'fsb', colorPrimary: '#cc0000', colorSecondary: '#ffd700' },
    { name: 'ESA', slug: 'esa', colorPrimary: '#003399', colorSecondary: '#ffffff' },
    { name: 'CNES', slug: 'cnes', colorPrimary: '#005ea8', colorSecondary: '#ffffff' },
  ];

  for (const agency of agencies) {
    await prisma.agency.upsert({
      where: { slug: agency.slug },
      update: {},
      create: agency,
    });
  }

  console.log('Database seeded with agencies.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
