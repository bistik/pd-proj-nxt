"use server";

import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { projectsTable, type Project } from "@/lib/db/projects-schema";
import { ProjectInput, projectSchema } from "@/lib/validations/project";
import { eq } from "drizzle-orm";
import z from "zod";

export const getProjects = async (): Promise<GetProjectsResults> => {
  const session = await requireAuth();
  const { user } = session;

  try {
    const result = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.userId, user.id))
      .limit(50);
    return { success: true, projects: result };
  } catch (err) {
    console.error("Error in fetching projects", err);
    return { success: false, message: "Unable to fetch projects" };
  }
};

export const createProject = async (
  data: ProjectInput,
): Promise<MutateProjectResult> => {
  const session = await requireAuth();
  const { user } = session;
  const result = projectSchema.safeParse(data);

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return {
      success: false,
      message: "Input validation errors in creating project",
      errors: fieldErrors,
    };
  }
  try {
    await db.insert(projectsTable).values({ ...data, userId: user.id });
    return { success: true, message: "Project successfully created" };
  } catch (err) {
    console.error("Error in creating project", err);
    return { success: false, message: "Unable to create project" };
  }
};

export type GetProjectsResults =
  | { success: true; projects: Project[] }
  | { success: false; message: string };

export type MutateProjectResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
