import { getNotes } from "@/actions/notes-actions";
import NoteList from "@/components/notes/note-list";
import { requireAuth } from "@/lib/auth-guard";

async function NotesPage() {
  const session = await requireAuth();
  const { user } = session;
  const getNotesResult = await getNotes(user.id);

  if (getNotesResult.success) {
    return <NoteList noteItems={getNotesResult.notes} />;
  }
  return <div>{getNotesResult.message}</div>;
}

export default NotesPage;
