import { z } from "zod";

export const projectSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1, "Project name should not be empty").max(300),
  description: z.string().trim().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
