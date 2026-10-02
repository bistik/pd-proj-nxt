"use client";

import type { Project } from "@/lib/db/projects-schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { deleteProject } from "@/actions/projects-actions";
import { toast } from "sonner";
import Link from "next/link";

export default function ProjectList({
  projectItems,
}: {
  projectItems: Project[];
}) {
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleProjectDelete = () => {
    if (!projectToDelete) return;
    startTransition(async () => {
      const result = await deleteProject(projectToDelete.id);
      if (result.success) {
        toast.success(result.message);
        setProjectToDelete(null);
      } else {
        toast.error(result.message);
      }
    });
  };
  return (
    <>
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
              <TableCell>
                <Link
                  href={`/projects/${project.id}`}
                  className="underline text-blue-600 hover:text-blue-800 hover:cursor-pointer"
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      render={
                        <Link href={`/projects/${project.id}/edit`}>Edit</Link>
                      }
                    ></DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setProjectToDelete(project)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog
        open={projectToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isPending) setProjectToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleProjectDelete}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
