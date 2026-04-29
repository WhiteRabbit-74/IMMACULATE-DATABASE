import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DocumentViewer } from "@/components/documents/DocumentViewer";

interface Props {
  params: { id: string };
}

export default async function DocumentPage({ params }: Props) {
  const document = await prisma.document.findUnique({
    where: { id: params.id },
    include: { agency: true, tags: true },
  });

  if (!document) notFound();

  return <DocumentViewer document={document as any} />;
}
