"use server";

import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { notesTable } from "@/lib/db/notes-schema";
import { eq, and } from "drizzle-orm";
import { Note } from "@/lib/db/notes-schema";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { noteSchema, NoteInput } from "@/lib/validations/note";
import { z } from "zod";

export type MutateNoteResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
export type GetNotesResult =
  | { success: true; notes: Note[] }
  | { success: false; message: string };
export type ShowNoteResult =
  | { success: true; note: Note }
  | { success: false; message: string };

export const createNote = async (
  data: NoteInput,
): Promise<MutateNoteResult> => {
  const session = await requireAuth();
  const { user } = session;

  const result = noteSchema.safeParse(data);

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return {
      success: false,
      message: "there were validation errors",
      errors: fieldErrors,
    };
  }
  try {
    await db.insert(notesTable).values({ ...data, userId: user.id });
    return { success: true, message: "Note successfully created" };
  } catch (err) {
    console.error("Create note failed", err);
    return { success: false, message: "Error creating a note" };
  }
};

export const getNotes = async (): Promise<GetNotesResult> => {
  const session = await requireAuth();
  const { user } = session;
  try {
    const result = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.userId, user.id))
      .limit(50);
    return { success: true, notes: result };
  } catch (err) {
    console.error("Fetching notes failed", err);
    return { success: false, message: "Error fetching notes" };
  }
};

export const getNote = async (noteId: number): Promise<ShowNoteResult> => {
  const session = await requireAuth();
  const { user } = session;
  try {
    const result = await db.query.notesTable.findFirst({
      where: (notesTable, { and, eq }) =>
        and(eq(notesTable.id, noteId), eq(notesTable.userId, user.id)),
    });
    if (result) {
      return { success: true, note: result };
    }
  } catch (err) {
    console.error("Fetching a single note failed", err);
    return {
      success: false,
      message: `Error fetching note with id: ${noteId}`,
    };
  }
  notFound();
};

export const updateNote = async (
  noteId: number,
  data: NoteInput,
): Promise<MutateNoteResult> => {
  const session = await requireAuth();
  const { user } = session;

  const result = noteSchema.safeParse(data);

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return {
      success: false,
      message: "there were validation errors",
      errors: fieldErrors,
    };
  }

  try {
    await db
      .update(notesTable)
      .set({ title: data.title, content: data.content })
      .where(and(eq(notesTable.id, noteId), eq(notesTable.userId, user.id)));
    return { success: true, message: "Note successfully updated" };
  } catch (err) {
    console.error(`Error in updating note with id ${noteId}`, err);
    return { success: false, message: "Unable to update note" };
  }
};

export const deleteNote = async (noteId: number): Promise<MutateNoteResult> => {
  const session = await requireAuth();
  const { user } = session;
  try {
    const deleted = await db
      .delete(notesTable)
      .where(and(eq(notesTable.id, noteId), eq(notesTable.userId, user.id)))
      .returning({ deletedId: notesTable.id });

    revalidatePath("/notes");

    if (deleted.length === 0) {
      return { success: false, message: "Note not found" };
    }
    return { success: true, message: "Note successfully deleted" };
  } catch (err) {
    console.error(`Error in deleting note ${noteId}`, err);
    return { success: false, message: "Error in deleting note" };
  }
};
