"use server";

import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { Task, tasksTable } from "@/lib/db/tasks-schema";
import { timeEntriesTable } from "@/lib/db/time-entries-schema";
import { and, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { cacheLife, cacheTag, updateTag } from "next/cache";

// TODO : Should we move this to a different file? DAL?
const fetchActiveTimeEntry = async (userId: string) => {
  "use cache";
  cacheLife("minutes");
  cacheTag(`timer-${userId}`);
  try {
    const [result] = await db
      .select()
      .from(timeEntriesTable)
      .where(
        and(
          eq(timeEntriesTable.userId, userId),
          isNull(timeEntriesTable.endedAt),
        ),
      )
      .innerJoin(tasksTable, eq(timeEntriesTable.taskId, tasksTable.id))
      .orderBy(desc(timeEntriesTable.createdAt))
      .limit(1);
    return result ?? null;
  } catch (err) {
    console.error("Database error in fetching active time entry", err);
    return null;
  }
};

// DAL func
const insertTimeEntry = async (userId: string, taskId: number) => {
  try {
    const [result] = await db
      .insert(timeEntriesTable)
      .values({ userId, taskId })
      .returning();
    return result ?? null;
  } catch (err) {
    console.error("Database error in creating a time entry", err);
    return null;
  }
};

// DAL func
const updateEndOfTimeEntry = async (userId: string, entryId: number) => {
  try {
    const result = await db
      .update(timeEntriesTable)
      .set({ endedAt: sql`now()` })
      .where(
        and(
          eq(timeEntriesTable.id, entryId),
          eq(timeEntriesTable.userId, userId),
        ),
      )
      .returning({ updatedId: timeEntriesTable.id });
    return result;
  } catch (err) {
    console.error("Database error in updating time entry", err);
    return null;
  }
};

export const getLatestTimeEntry = async () => {
  const session = await requireAuth();
  const entry = await fetchActiveTimeEntry(session.user.id);

  if (!entry) {
    return { success: false, error: "No running time entry found" };
  }
  return { success: true, data: entry };
};

export const createTimeEntry = async (task: Task) => {
  const session = await requireAuth();
  const timeEntry = await insertTimeEntry(session.user.id, task.id);

  if (!timeEntry) {
    return { success: false, error: "No time entry was created" };
  }
  updateTag(`timer-${session.user.id}`);
  return { success: true, data: timeEntry };
};

export const endTimeEntry = async (entryId: number) => {
  const session = await requireAuth();
  const result = await updateEndOfTimeEntry(session.user.id, entryId);

  updateTag(`timer-${session.user.id}`);
  if (result) {
    return { success: true, result };
  }
  return { success: false, error: "No time entry was updated" };
};

export const getTimeEntriesByTask = async (taskId: number) => {
  const session = await requireAuth();
  try {
    const entries = await db
      .select()
      .from(timeEntriesTable)
      .where(
        and(
          eq(timeEntriesTable.userId, session.user.id),
          eq(timeEntriesTable.taskId, taskId),
          isNotNull(timeEntriesTable.duration),
        ),
      );
    const totalDuration = entries.reduce(
      (acc, entry) => acc + (entry.duration ?? 0),
      0,
    );
    return { success: true, entries, totalDuration };
  } catch (err) {
    console.error(`Error in fetching time entries for task ${taskId}`, err);
    return { success: false, entries: [], totalDuration: 0 };
  }
};

export type LatestTimeEntryResult = Awaited<
  ReturnType<typeof getLatestTimeEntry>
>;

export type TimeEntryWithTask = NonNullable<
  Awaited<ReturnType<typeof fetchActiveTimeEntry>>
>;
