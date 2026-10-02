"use server";

import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { projectsTable, type Project } from "@/lib/db/projects-schema";
import { ProjectInput, projectSchema } from "@/lib/validations/project";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
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

export const deleteProject = async (
  projectId: number,
): Promise<MutateProjectResult> => {
  const session = await requireAuth();
  const { user } = session;
  try {
    const deleted = await db
      .delete(projectsTable)
      .where(
        and(eq(projectsTable.id, projectId), eq(projectsTable.userId, user.id)),
      )
      .returning({ deletedId: projectsTable.id });
    if (deleted.length === 0) {
      return { success: false, message: "Project was not found" };
    }
    revalidatePath("/projects");
    return { success: true, message: "Project was successfully deleted" };
  } catch (err) {
    console.error(`Error deleting project with id ${projectId}`, err);
    return { success: false, message: "Unable to delete the project" };
  }
};

export const getProject = async (projectId: number): Promise<Project> => {
  const session = await requireAuth();
  const { user } = session;
  let project: Project | undefined;
  try {
    project = await db.query.projectsTable.findFirst({
      where: (projectsTable, { and, eq }) =>
        and(eq(projectsTable.id, projectId), eq(projectsTable.userId, user.id)),
    });
    if (project) return project;
  } catch (err) {
    console.error(`Error fetching project with id ${projectId}`, err);
    throw err;
  }
  notFound();
};

export type GetProjectsResults =
  | { success: true; projects: Project[] }
  | { success: false; message: string };

export type MutateProjectResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
