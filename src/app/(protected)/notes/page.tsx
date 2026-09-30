import { getNotes } from "@/actions/notes-actions";
import NoteList from "@/components/notes/note-list";

async function NotesPage() {
  const getNotesResult = await getNotes();

  if (getNotesResult.success) {
    return <NoteList noteItems={getNotesResult.notes} />;
  }
  return <div>{getNotesResult.message}</div>;
}

export default NotesPage;
