import { getNote } from "@/actions/notes-actions";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default function ShowNotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  return (
    <div className="space-y-4">
      <Suspense fallback={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}>
        <ShowNoteResult params={params} />
      </Suspense>
    </div>
  );
}

async function ShowNoteResult({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  const id = Number(noteId);
  if (!Number.isInteger(id)) notFound();

  const note = await getNote(id);
  if (note) {
    return (
      <>
        <h2 className="text-3xl">{note.title}</h2>
        <p className="text-lg">{note.content}</p>
        <Link
          href={`/notes/${note.id}/edit`}
          className="underline text-blue-600 hover:text-blue-800"
        >
          Edit this note
        </Link>
      </>
    );
  }
  notFound();
}
