"use server";

import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { notesTable } from "@/lib/db/notes-schema";

export type NewNote = { title: string; content: string };

export const createNote = async (data: NewNote) => {
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
