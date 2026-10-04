import { getProject } from "@/actions/projects-actions";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ShowProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <div className="space-y-4">
      <Suspense fallback={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}>
        <ShowProjectResult params={params} />
      </Suspense>
    </div>
  );
}

async function ShowProjectResult({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const id = Number(projectId);
  if (!Number.isInteger(id)) notFound();
  const project = await getProject(id);

  if (!project) {
    return null;
  }
  return (
    <>
      <h2 className="text-3xl">{project.name}</h2>
      <p className="text-lg">{project.description}</p>
      <Link
        href={`/projects/${project.id}/edit`}
        className="underline text-blue-600 hover:text-blue-800"
      >
        Edit this project
      </Link>
    </>
  );
}
