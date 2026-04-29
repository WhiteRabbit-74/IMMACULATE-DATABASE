import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const BASE_DIR = join(process.cwd(), "public", "media", "PDF LIBRI");

export async function POST(req: NextRequest) {
  try {
    if (!existsSync(BASE_DIR)) {
      return NextResponse.json({ error: "PDF LIBRI directory not found" }, { status: 404 });
    }

    const AGENCY_MAP: Record<string, string> = {
      "BLUEBOOK": "usaf",
      "GATEWAY": "cia",
      "MONARCH": "cia",
      "AQUARIUS": "nsa",
      "STARGATE": "cia",
      "MJ12": "cia",
      "SENZA PROGETTI": "dod"
    };

    const SYNOPSIS_MAP: Record<string, string> = {
      "BLUEBOOK": "Official USAF investigation into UFO sightings (1947-1969). Historical archive of unexplained aerial phenomena.",
      "GATEWAY": "CIA assessment of altered states, brainwave synchronization, and non-linear consciousness exploration.",
      "MONARCH": "Documentation regarding trauma-based psychological conditioning and behavioral modification projects.",
      "AQUARIUS": "Classified intelligence gathering on non-terrestrial biological entities (EBEs) and their environmental impact.",
      "STARGATE": "Remote viewing operational records and psychic intelligence gathering methodologies.",
      "MJ12": "Top Secret briefing documents regarding the management of extraterrestrial technology and personnel.",
      "SENZA PROGETTI": "Declassified intelligence reports and evidence from unassigned investigative cases."
    };

    const folders = await readdir(BASE_DIR);
    let syncedCount = 0;

    for (const folder of folders) {
      const folderPath = join(BASE_DIR, folder);
      const s = await stat(folderPath);
      if (!s.isDirectory()) continue;

      const agencySlug = AGENCY_MAP[folder] || "cia";
      const agency = await prisma.agency.findUnique({ where: { slug: agencySlug } });
      if (!agency) continue;

      let operation = null;
      if (folder !== "SENZA PROGETTI") {
        operation = await prisma.operation.upsert({
          where: { name: folder },
          update: {},
          create: {
            name: folder,
            codename: folder,
            description: SYNOPSIS_MAP[folder] || `Auto-indexed intelligence project from ${folder}`,
            agency: agency.name
          }
        });
      }

      const files = await readdir(folderPath);
      const pdfFiles = files.filter(f => f.toLowerCase().endsWith(".pdf"));
      
      for (let i = 0; i < pdfFiles.length; i++) {
        const file = pdfFiles[i];
        const filePath = `/media/PDF LIBRI/${folder}/${file}`;
        
        let title = file.replace(".pdf", "").replace(/_/g, " ");
        if (pdfFiles.length > 1) {
          title = `${folder} — ${title} ${i === 0 ? "(Main)" : `(Vol. ${i + 1})`}`;
        }
        
        const existing = await prisma.document.findFirst({ where: { filePath } });

        if (!existing) {
          await prisma.document.create({
            data: {
              title,
              description: SYNOPSIS_MAP[folder] || `Imported record from ${folder} archive`,
              year: 2024,
              agencyId: agency.id,
              operationId: operation?.id,
              filePath,
              status: "classified",
              tags: {
                connectOrCreate: [
                   { where: { name: folder.toLowerCase() }, create: { name: folder.toLowerCase() } },
                   { where: { name: "pdf-libri" }, create: { name: "pdf-libri" } }
                ]
              }
            }
          });
          syncedCount++;
        }
      }
    }

    return NextResponse.json({ success: true, syncedCount });
  } catch (error) {
    console.error("[SYNC_PDF_LIBRI]", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
