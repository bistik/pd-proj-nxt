"use server";

import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { Task, tasksTable } from "@/lib/db/tasks-schema";
import { TaskInput, taskSchema } from "@/lib/validations/task";
import { eq } from "drizzle-orm";
import z from "zod";

export const createTask = async (
  data: TaskInput,
): Promise<MutateTaskResult> => {
  const session = await requireAuth();
  const { user } = session;
  const result = taskSchema.safeParse(data);
  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return {
      success: false,
      message: "Input validation errors in creating task",
      errors: fieldErrors,
    };
  }
  try {
    await db.insert(tasksTable).values({ ...data, userId: user.id });
    return { success: true, message: "Task successfully created" };
  } catch (err) {
    console.error("Error in creating task", err);
    return { success: false, message: "Unable to create task" };
  }
};

export const getTasks = async (): Promise<GetTasksResults> => {
  const session = await requireAuth();
  const { user } = session;

  try {
    const tasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.userId, user.id))
      .limit(50);
    return { success: true, tasks };
  } catch (err) {
    console.error("Error in fetching tasks", err);
    return { success: false, message: "Error in fetching tasks" };
  }
};

export type MutateTaskResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export type GetTasksResults =
  | { success: true; tasks: Task[] }
  | { success: false; message: string };
