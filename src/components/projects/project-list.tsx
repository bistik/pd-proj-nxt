import { Project } from "@/lib/db/projects-schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProjectList({
  projectItems,
}: {
  projectItems: Project[];
}) {
  return (
    <Table>
      <TableCaption>Table listing of Projects</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projectItems.map((project) => (
          <TableRow key={project.id}>
            <TableCell>{project.name}</TableCell>
            <TableCell>{project.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
