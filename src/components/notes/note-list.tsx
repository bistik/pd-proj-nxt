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
import type { Note } from "@/lib/db/notes-schema";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { deleteNote } from "@/actions/notes-actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function NoteList({ noteItems }: { noteItems: Note[] }) {
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleNoteDelete = () => {
    if (!noteToDelete) return;
    const noteId = noteToDelete.id;
    startTransition(async () => {
      const result = await deleteNote(noteId);
      if (result.success) {
        toast.success(result.message);
        setNoteToDelete(null);
      } else {
        toast.error(result.message);
      }
    });
  };
  return (
    <>
      <Table>
        <TableCaption>Your notes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {noteItems.map((noteItem) => (
            <TableRow key={noteItem.id}>
              <TableCell>
                <Link
                  href={`/notes/${noteItem.id}`}
                  className="underline text-blue-600 hover:text-blue-800 hover:cursor-pointer"
                >
                  {noteItem.title}
                </Link>
              </TableCell>
              <TableCell>{noteItem.content}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      render={
                        <Link href={`/notes/${noteItem.id}/edit`}>Edit</Link>
                      }
                    ></DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setNoteToDelete(noteItem)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog
        open={noteToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isPending) setNoteToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleNoteDelete}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
