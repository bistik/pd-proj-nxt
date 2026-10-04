import { getProjects } from "@/actions/projects-actions";
import ProjectList from "@/components/projects/project-list";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function ProjectListPage() {
  return (
    <>
      <h1 className="text-4xl">Projects</h1>
      <Suspense fallback={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}>
        <ProjectListResult />
      </Suspense>
    </>
  );
}

async function ProjectListResult() {
  const projectResult = await getProjects();
  if (projectResult.success) {
    return <ProjectList projectItems={projectResult.projects} />;
  }
  return <div>{projectResult.message}</div>;
}
