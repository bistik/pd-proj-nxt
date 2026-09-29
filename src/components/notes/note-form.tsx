"use client";

import { useForm, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createNote } from "@/actions/notes-actions";
import { Loader2 } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function NoteForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const result = await createNote({
      title: data.title,
      content: data.content,
    });
    if (result.success) {
      toast.success("Note successfully created");
      reset();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? "Saving..." : "Save Note"}
      </Button>
    </form>
  );
}

export default NoteForm;
