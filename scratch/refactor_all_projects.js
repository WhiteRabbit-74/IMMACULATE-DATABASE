const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const operations = await prisma.operation.findMany();
  
  const specificMappings = {
    "SOLAR WARDEN": "Project 4127",
    "GATEWAY": "Operation 5412",
    "AATIP": "Project 3892",
    "BLUE BEAM": "Project 8821",
    "LOOKING GLASS": "Project 1928",
    "MKULTRA": "Project 21-A",
    "MAJESTIC 12": "Control Group MJ-12",
    "BLUE BOOK": "Project 106-X",
    "HORIZON": "Operation 3321",
    "AURORA": "Project 44-SR",
    "TR-3B": "Project 991-T",
    "MOON DUST": "Operation 402-M",
    "AQUARIUS": "Project 121-Q",
    "SIGMA": "Project 339-S",
    "SNOWBIRD": "Project 505-B",
    "GRILL FLAME": "Operation 77-G",
    "STARGATE": "Project 881-S",
    "PINE GAP": "Project 440-PG",
    "DULCE": "Operation 7-D",
  };

  let counter = 5000;

  for (const op of operations) {
    const codename = op.codename.toUpperCase();
    let newName = specificMappings[codename];

    if (!newName) {
      if (op.name.toUpperCase().includes(codename) || op.name === op.codename) {
        newName = `Project ${counter + Math.floor(Math.random() * 999)}`;
        counter += 1;
      }
    }

    if (newName && op.name !== newName) {
      await prisma.operation.update({
        where: { id: op.id },
        data: { name: newName }
      });
      console.log(`[REFACTORED] ${op.codename}: ${op.name} -> ${newName}`);
    }
  }
  console.log("Refactoring complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
