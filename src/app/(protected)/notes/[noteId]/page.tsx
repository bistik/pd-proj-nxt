import { getNote } from "@/actions/notes-actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ShowNotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  const id = Number(noteId);
  if (!Number.isInteger(id)) notFound();

  const note = await getNote(id);
  return (
    <div className="space-y-4">
      <h2 className="text-3xl">{note.title}</h2>
      <p className="text-lg">{note.content}</p>
      <Link
        href={`/notes/${note.id}/edit`}
        className="underline text-blue-600 hover:text-blue-800"
      >
        Edit this note
      </Link>
    </div>
  );
}
