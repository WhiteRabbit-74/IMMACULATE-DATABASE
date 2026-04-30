import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const updates = [
    { codename: "SOLAR WARDEN", newName: "Project 4127" },
    { codename: "GATEWAY", newName: "Operation 5412" },
    { codename: "AATIP", newName: "Project 3892" },
    { codename: "BLUE BEAM", newName: "Project 8821" },
    { codename: "LOOKING GLASS", newName: "Project 1928" },
    { codename: "MKULTRA", newName: "Project 21-A" },
    { codename: "MAJESTIC 12", newName: "Control Group MJ-12" },
    { codename: "BLUE BOOK", newName: "Project 106-X" },
    { codename: "HORIZON", newName: "Operation 3321" },
  ];

  for (const u of updates) {
    await prisma.operation.updateMany({
      where: { codename: u.codename },
      data: { name: u.newName }
    });
    console.log(`Updated ${u.codename} to ${u.newName}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
