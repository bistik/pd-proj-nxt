import Link from "next/link";

export default function ProjectNotFoundPage() {
  return (
    <div>
      <h2 className="text-2xl">404</h2>
      <p>Project is not found</p>
      <Link
        href="/projects"
        className="underline text-blue-600 hover:text-blue-800 hover:cursor-pointer"
      >
        Back to projects
      </Link>
    </div>
  );
}
