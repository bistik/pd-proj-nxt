import { getNote } from "@/actions/notes-actions";
import NoteForm from "@/components/notes/note-form";
import { notFound } from "next/navigation";

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;

  const id = Number(noteId);
  if (!Number.isInteger(id)) notFound();

  const noteResult = await getNote(id);
  if (noteResult.success) {
    return (
      <>
        <h1 className="text-2xl font-bold">Edit Note</h1>
        <NoteForm initialData={noteResult.note} />
      </>
    );
  }
  return <div>{noteResult.message}</div>;
}
