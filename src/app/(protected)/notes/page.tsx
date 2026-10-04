import { getNotes } from "@/actions/notes-actions";
import NoteList from "@/components/notes/note-list";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function NotesPage() {
  return (
    <>
      <h1 className="text-4xl">Notes</h1>
      <Suspense fallback={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}>
        <NoteListResult />
      </Suspense>
    </>
  );
}

async function NoteListResult() {
  const result = await getNotes();
  if (result.success) {
    return <NoteList noteItems={result.notes} />;
  }
  return <div>{result.message}</div>;
}
