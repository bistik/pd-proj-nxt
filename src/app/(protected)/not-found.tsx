import Link from "next/link";

export default function NoteNotFoundPage() {
  return (
    <div>
      <h2 className="text-2xl">404</h2>
      <p>Note is not found</p>
      <Link
        href="/notes"
        className="underline text-blue-600 hover:text-blue-800 hover:cursor-pointer"
      >
        Back to notes
      </Link>
    </div>
  );
}
