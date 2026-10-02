"use client";

import type { Project } from "@/lib/db/projects-schema";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { projectSchema, type ProjectInput } from "@/lib/validations/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  createProject,
  MutateProjectResult,
  updateProject,
} from "@/actions/projects-actions";
import { toast } from "sonner";

export default function ProjectForm({
  initialData,
}: {
  initialData?: Project;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
    },
    resolver: zodResolver(projectSchema),
  });

  const router = useRouter();
  const onSubmit = async (data: ProjectInput) => {
    let result: MutateProjectResult;
    if (initialData) {
      result = await updateProject(initialData.id, data);
    } else {
      result = await createProject(data);
    }
    if (result.success) {
      toast.success(result.message);
      router.push("/projects");
    } else if (result.errors) {
      if (result.errors.name?.length) {
        setError("name", { type: "server", message: result.errors.name[0] });
      }
      if (result.errors.description?.length) {
        setError("description", {
          type: "server",
          message: result.errors.description[0],
        });
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input
          type="text"
          id="name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </Field>
      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          rows={10}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <FieldError>{errors.description.message}</FieldError>
        )}
      </Field>
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : "Save Project"}
        </Button>
        <Button
          type="button"
          variant={"secondary"}
          disabled={isSubmitting}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
