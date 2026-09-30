"use client";

import { useForm, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createNote,
  MutateNoteResult,
  updateNote,
} from "@/actions/notes-actions";
import { Loader2 } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Note } from "@/lib/db/notes-schema";

export default function NoteForm({ initialData }: { initialData?: Note }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: FieldValues) => {
    let result: MutateNoteResult;
    if (initialData?.id != null) {
      result = await updateNote(initialData.id, {
        title: data.title,
        content: data.content,
      });
    } else {
      result = await createNote({
        title: data.title,
        content: data.content,
      });
    }
    if (result.success) {
      toast.success(result.message);
      router.push("/notes");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input
          type="text"
          id="title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <FieldError>{String(errors.title?.message)}</FieldError>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="content">Content</FieldLabel>
        <Textarea
          id="content"
          rows={10}
          {...register("content", { required: "Content is required" })}
        />
        {errors.content && (
          <FieldError>{String(errors.content?.message)}</FieldError>
        )}
      </Field>
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : "Save Note"}
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
