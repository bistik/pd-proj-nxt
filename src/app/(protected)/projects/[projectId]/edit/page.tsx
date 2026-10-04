import { getProject } from "@/actions/projects-actions";
import ProjectForm from "@/components/projects/project-form";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <>
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <Suspense fallback={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}>
        <EditProjectForm params={params} />
      </Suspense>
    </>
  );
}

async function EditProjectForm({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const id = Number(projectId);
  if (!Number.isInteger(id)) notFound();

  const project = await getProject(id);

  return <ProjectForm initialData={project} />;
}
