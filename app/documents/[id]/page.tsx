import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { DocumentViewer } from "@/components/documents/DocumentViewer";

interface Props {
  params: { id: string };
}

export default async function DocumentPage({ params }: Props) {
  let document: any = null;
  try {
    document = await prisma.document.findUnique({
      where: { id: params.id },
      include: { agency: true, tags: true },
    });
  } catch (error) {
    console.error("DOCUMENT_FETCH_ERROR", error);
  }

  if (!document) notFound();

  return <DocumentViewer document={document as any} />;
}
