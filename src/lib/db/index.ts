import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as authSchema from "./auth-schema";
import * as notesSchema from "./notes-schema";
import * as projectSchema from "./projects-schema";
import * as taskSchema from "./tasks-schema";
import * as timeEntrySchema from "./time-entries-schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export const db = drizzle({
  client: pool,
  schema: {
    ...authSchema,
    ...notesSchema,
    ...projectSchema,
    ...taskSchema,
    ...timeEntrySchema,
  },
});
