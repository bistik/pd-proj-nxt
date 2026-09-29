import NoteForm from "@/components/notes/note-form";

function NotesPageNew() {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">Create Note</h1>
      <NoteForm />
    </div>
  );
}

export default NotesPageNew;
