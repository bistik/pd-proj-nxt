"use server";

import { getCurrentUser } from "@/lib/auth-guard";
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
  const user = await getCurrentUser();
  const entry = await fetchActiveTimeEntry(user.id);

  if (!entry) {
    return { success: false, error: "No running time entry found" };
  }
  return { success: true, data: entry };
};

export const createTimeEntry = async (task: Task) => {
  const user = await getCurrentUser();
  const timeEntry = await insertTimeEntry(user.id, task.id);

  if (!timeEntry) {
    return { success: false, error: "No time entry was created" };
  }
  updateTag(`timer-${user.id}`);
  return { success: true, data: timeEntry };
};

export const endTimeEntry = async (entryId: number) => {
  const user = await getCurrentUser();
  const result = await updateEndOfTimeEntry(user.id, entryId);

  updateTag(`timer-${user.id}`);
  if (result) {
    return { success: true, result };
  }
  return { success: false, error: "No time entry was updated" };
};

export const getTimeEntriesByTask = async (taskId: number) => {
  const user = await getCurrentUser();
  try {
    const entries = await db
      .select()
      .from(timeEntriesTable)
      .where(
        and(
          eq(timeEntriesTable.userId, user.id),
          eq(timeEntriesTable.taskId, taskId),
          isNotNull(timeEntriesTable.duration),
        ),
      )
      .orderBy(desc(timeEntriesTable.createdAt));
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

export const hasActiveTimeEntry = async (taskId: number): Promise<boolean> => {
  const user = await getCurrentUser();
  try {
    const entry = await db.query.timeEntriesTable.findFirst({
      where: (timeEntriesTable, { and, eq }) =>
        and(
          eq(timeEntriesTable.taskId, taskId),
          eq(timeEntriesTable.userId, user.id),
          isNull(timeEntriesTable.endedAt),
        ),
    });
    if (entry) return true;
  } catch (err) {
    console.error("Error in checking if task has a running entry", err);
  }
  return false;
};

export type LatestTimeEntryResult = Awaited<
  ReturnType<typeof getLatestTimeEntry>
>;

export type TimeEntryWithTask = NonNullable<
  Awaited<ReturnType<typeof fetchActiveTimeEntry>>
>;
