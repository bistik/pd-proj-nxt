import { getProject } from "@/actions/projects-actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ShowProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const id = Number(projectId);
  if (!Number.isInteger(id)) notFound();
  const project = await getProject(id);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl">{project.name}</h2>
      <p className="text-lg">{project.description}</p>
      <Link
        href={`/projects/${project.id}/edit`}
        className="underline text-blue-600 hover:text-blue-800"
      >
        Edit this project
      </Link>
    </div>
  );
}
