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
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NoteList({ noteItems }: { noteItems: Note[] }) {
  return (
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
                  <DropdownMenuItem variant="destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
