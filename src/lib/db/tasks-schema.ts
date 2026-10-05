import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { InferSelectModel, relations } from "drizzle-orm";
import { timeEntriesTable } from "./time-entries-schema";

export const tasksTable = pgTable(
  "tasks",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    title: varchar({ length: 500 }).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    isDone: boolean("done").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("tasks_userId_idx").on(table.userId)],
);

export const taskRelations = relations(tasksTable, ({ one, many }) => ({
  user: one(user, {
    fields: [tasksTable.userId],
    references: [user.id],
  }),
  timeEntries: many(timeEntriesTable),
}));

export type Task = InferSelectModel<typeof tasksTable>;
