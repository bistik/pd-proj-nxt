import { getNote } from "@/actions/notes-actions";
import NoteForm from "@/components/notes/note-form";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default function EditNotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  return (
    <>
      <h1 className="text-2xl font-bold">Edit Note</h1>
      <Suspense fallback={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}>
        <EditNoteForm params={params} />
      </Suspense>
    </>
  );
}

async function EditNoteForm({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;

  const id = Number(noteId);
  if (!Number.isInteger(id)) notFound();

  const note = await getNote(id);
  return <NoteForm initialData={note} />;
}
