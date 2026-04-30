import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const MEDIA_DIR = "D:/APP DOCUMENTI UFO ANTIGRAVITY CLAUDE OPUS/public/media/foto/UFO LEAK";

async function main() {
  const files = fs.readdirSync(MEDIA_DIR);
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if ([".webp", ".jpg", ".jpeg", ".png", ".avif"].includes(ext)) {
      const filePath = `/media/foto/UFO LEAK/${file}`;
      
      // Check if already exists
      const existing = await prisma.media.findFirst({
        where: { filePath }
      });

      if (!existing) {
        let category = "photo";
        let tags = "Leak, Unverified";
        
        // Auto-tagging based on filename
        if (file.toLowerCase().includes("roswell")) {
          category = "event";
          tags += ", Roswell, Crash";
        } else if (file.toLowerCase().includes("nimitz") || file.toLowerCase().includes("tictac")) {
          category = "event";
          tags += ", Nimitz, Tic-Tac";
        } else if (file.toLowerCase().includes("rendlesham")) {
          category = "event";
          tags += ", Rendlesham, UK";
        } else if (file.toLowerCase().includes("mcminnville")) {
          category = "event";
          tags += ", McMinnville";
        }

        await prisma.media.create({
          data: {
            title: file.replace(ext, "").toUpperCase(),
            filePath,
            category,
            type: "image",
            description: "Automatically indexed asset from secure leak folder.",
            year: 2024,
            tags
          }
        });
        console.log(`Indexed new file: ${file}`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
