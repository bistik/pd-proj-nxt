"use client";

import { type Task } from "@/lib/db/tasks-schema";
import { TaskInput, taskSchema } from "@/lib/validations/task";
import { useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createTask } from "@/actions/tasks-actions";
import { toast } from "sonner";

export default function TaskForm({ initialData }: { initialData?: Task }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm({
    defaultValues: {
      title: initialData?.title ?? "",
    },
    resolver: zodResolver(taskSchema),
  });
  const router = useRouter();
  const onSubmit = async (data: TaskInput) => {
    const result = await createTask(data);
    if (result.success) {
      toast.success(result.message);
      router.push("/tasks");
    } else if (result.errors) {
      if (result.errors.title?.length) {
        setError("title", { type: "server", message: result.errors.title[0] });
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
      <Field>
        <FieldLabel htmlFor="title">Task title</FieldLabel>
        <Input type="text" {...register("title")} />
        {errors.title && <FieldError>{errors.title.message}</FieldError>}
      </Field>
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : "Save Task"}
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
