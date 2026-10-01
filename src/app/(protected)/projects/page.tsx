import { getProjects } from "@/actions/projects-actions";
import ProjectList from "@/components/projects/project-list";

export default async function ProjectListPage() {
  const projectResult = await getProjects();

  if (projectResult.success) {
    return (
      <>
        <h1 className="text-4xl">Projects</h1>
        <ProjectList projectItems={projectResult.projects} />
      </>
    );
  }
  return <div>{projectResult.message}</div>;
}
