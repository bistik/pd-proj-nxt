"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Note } from "@/lib/db/notes-schema";

export default function NoteList({ noteItems }: { noteItems: Note[] }) {
  return (
    <Table>
      <TableCaption>Your notes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Content</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {noteItems.map((noteItem) => (
          <TableRow key={noteItem.id}>
            <TableCell>{noteItem.title}</TableCell>
            <TableCell>{noteItem.content}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
