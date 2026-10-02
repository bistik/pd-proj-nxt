"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createNote, updateNote } from "@/actions/notes-actions";
import type { MutateNoteResult } from "@/actions/notes-actions";
import { Loader2 } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Note } from "@/lib/db/notes-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema } from "@/lib/validations/note";
import type { NoteInput } from "@/lib/validations/note";

export default function NoteForm({ initialData }: { initialData?: Note }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm({
    defaultValues: {
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
    },
    resolver: zodResolver(noteSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: NoteInput) => {
    let result: MutateNoteResult;
    if (initialData) {
      result = await updateNote(initialData.id, data);
    } else {
      result = await createNote(data);
    }

    if (result.success) {
      toast.success(result.message);
      router.push("/notes");
    } else if (result.errors) {
      if (result.errors.title?.length) {
        setError("title", { type: "server", message: result.errors.title[0] });
      }
      if (result.errors.content?.length) {
        setError("content", {
          type: "server",
          message: result.errors.content[0],
        });
      }
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
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        {errors.title && <FieldError>{errors.title.message}</FieldError>}
      </Field>
      <Field>
        <FieldLabel htmlFor="content">Content</FieldLabel>
        <Textarea
          id="content"
          rows={10}
          aria-invalid={!!errors.content}
          {...register("content")}
        />
        {errors.content && <FieldError>{errors.content.message}</FieldError>}
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
