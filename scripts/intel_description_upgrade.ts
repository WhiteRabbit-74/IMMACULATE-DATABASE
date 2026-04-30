import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🕵️ Upgrading Media Descriptions to 'Intelligence Forensic' Style...");

  const allMedia = await prisma.media.findMany();

  for (const m of allMedia) {
    const fileName = m.filePath.split("/").pop();
    const baseName = fileName.split(".")[0];
    
    // Check if it's one of the "God-Tier" ones we already fixed
    const godTierTitles = ["ROSWELL", "GIMBAL", "MCMINNVILLE", "RENDLESHAM", "BLACK KNIGHT"];
    if (godTierTitles.some(t => m.title.includes(t))) {
      console.log(`⏩ Skipping God-Tier asset: ${m.title}`);
      continue;
    }

    // Intelligence Jargon
    const jargon = [
      "Multi-spectral analysis indicates structural integrity inconsistent with terrestrial technology.",
      "Electronic signature suggests high-frequency emission spectrum (1.2 THz - 4.5 THz).",
      "Thermal mapping shows zero heat signature despite hypersonic trajectory.",
      "Anomalous propulsion detected via passive sonar/radar cross-section analysis.",
      "Object exhibited trans-medium capabilities (Atmosphere to Sub-oceanic).",
      "SigInt tracking confirms non-standard encryption protocol on local telemetry.",
      "Visual confirmation suggests morphing geometry under high-G maneuvers.",
      "Intelligence confirms this asset was recovered during unauthorized incursion events.",
      "Neural watermark detected on original frame. High-fidelity forensic leak."
    ];

    const randomJargon = jargon[Math.floor(Math.random() * jargon.length)];
    
    // NEW DESCRIPTION FORMAT
    const newDescription = `Classified leak asset: ${baseName.toLowerCase()}. ${randomJargon} Status: TOP SECRET / BEYOND BLACK. Analysis by Forensic Node 47.`;

    await prisma.media.update({
      where: { id: m.id },
      data: {
        description: newDescription
      }
    });
    console.log(`✅ Upgraded: ${m.title}`);
  }

  console.log("\n🚀 Intelligence Upgrade Complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
