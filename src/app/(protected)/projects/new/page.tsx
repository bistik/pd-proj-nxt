import ProjectForm from "@/components/projects/project-form";

export default async function ProjectNewPage() {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">Create Project</h1>
      <ProjectForm />
    </div>
  );
}
