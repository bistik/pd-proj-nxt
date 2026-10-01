import { z } from "zod";

export const noteSchema = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1, "Title should not be empty").max(300),
  content: z.string().trim().min(1, "Content should not be empty").max(10000),
});

export type NoteInput = z.infer<typeof noteSchema>;
