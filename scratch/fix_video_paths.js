import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const videos = [
    { oldTitle: "Nimitz Tic-Tac", newPath: "/media/video/VIDEO PENTAGONO/flir1.mp4", newTitle: "NIMITZ TIC-TAC (FLIR1)" },
    { oldTitle: "Gimbal UAP", newPath: "/media/video/VIDEO PENTAGONO/2 - GIMBAL.mp4.mp4", newTitle: "GIMBAL UAP (OFFICIAL)" },
    { oldTitle: "GoFast UAP", newPath: "/media/video/VIDEO PENTAGONO/3 - GOFAST.mp4", newTitle: "GOFAST UAP (OFFICIAL)" },
    { oldTitle: "Middle East Object", newPath: "/media/video/VIDEO PENTAGONO/Middle East Object.mp4", newTitle: "MIDDLE EAST ORB (MOSUL)" },
    { oldTitle: "Al Taqaddum Object", newPath: "/media/video/VIDEO PENTAGONO/Al Taqaddum Object.mp4", newTitle: "AL TAQADDUM METALLIC SPHERE" },
  ];

  for (const v of videos) {
    // Try to find by title or just create/update
    const existing = await prisma.media.findFirst({
      where: { title: { contains: v.oldTitle } }
    });

    if (existing) {
      await prisma.media.update({
        where: { id: existing.id },
        data: { filePath: v.newPath, title: v.newTitle, category: "video", type: "video" }
      });
      console.log(`Updated: ${v.newTitle}`);
    } else {
      // If not found, create as new event/video
      await prisma.media.create({
        data: {
          title: v.newTitle,
          filePath: v.newPath,
          category: "video",
          type: "video",
          description: "Official declassified pentagon footage of UAP encounter.",
          stars: 5,
          year: 2004, // Default for Nimitz/Flir
          tags: "UAP, Pentagon, Declassified"
        }
      });
      console.log(`Created: ${v.newTitle}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
