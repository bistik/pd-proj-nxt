import { z } from "zod";

export const timeEntrySchema = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1, "Task title should not be empty").max(500),
});

export type TaskInput = z.infer<typeof timeEntrySchema>;
