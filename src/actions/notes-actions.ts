"use server";

import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { notesTable } from "@/lib/db/notes-schema";
import { eq } from "drizzle-orm";
import { Note } from "@/lib/db/notes-schema";

export type NewNote = { title: string; content: string };
export type CreateNoteResult =
  | { success: true }
  | { success: false; message: string };
export type GetNotesResult =
  | { success: true; notes: Note[] }
  | { success: false; message: string };

export const createNote = async (data: NewNote): Promise<CreateNoteResult> => {
  const session = await requireAuth();
  const { user } = session;

  try {
    await db.insert(notesTable).values({ ...data, userId: user.id });
    return { success: true };
  } catch (err) {
    console.error("Create note failed", err);
    return { success: false, message: "Error creating a note" };
  }
};

export const getNotes = async (userId: string): Promise<GetNotesResult> => {
  const session = await requireAuth();
  const { user } = session;
  try {
    const result = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.userId, userId))
      .limit(50);
    return { success: true, notes: result };
  } catch (err) {
    console.error("Fetching notes failed", err);
    return { success: false, message: "Error fetching notes" };
  }
};
