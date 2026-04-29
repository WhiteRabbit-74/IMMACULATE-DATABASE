import { prisma } from "@/lib/prisma";
import { TimelineClient } from "@/components/timeline/TimelineClient";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  let documents = [];
  try {
    documents = await prisma.document.findMany({
      include: { agency: true, tags: true },
      orderBy: { year: "asc" },
    });
  } catch (error) {
    console.error("CRITICAL_DATABASE_FAILURE: Timeline data inaccessible", error);
  }

  return <TimelineClient documents={documents} />;
}
