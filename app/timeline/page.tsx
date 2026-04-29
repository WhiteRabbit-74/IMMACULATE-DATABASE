import { prisma } from "@/lib/prisma";
import { TimelineClient } from "@/components/timeline/TimelineClient";

export default async function TimelinePage() {
  const documents = await prisma.document.findMany({
    include: { agency: true, tags: true },
    orderBy: { year: "asc" },
  });

  return <TimelineClient documents={documents} />;
}
