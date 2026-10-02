import { getProject } from "@/actions/projects-actions";
import ProjectForm from "@/components/projects/project-form";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const id = Number(projectId);
  if (!Number.isInteger(id)) notFound();

  const project = await getProject(id);
  return (
    <>
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <ProjectForm initialData={project} />
    </>
  );
}
