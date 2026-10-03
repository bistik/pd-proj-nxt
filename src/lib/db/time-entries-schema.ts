import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { tasksTable } from "./tasks-schema";
import { InferSelectModel, relations, sql } from "drizzle-orm";

export const timeEntriesTable = pgTable(
  "time_entries",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    taskId: integer("task_id")
      .notNull()
      .references(() => tasksTable.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    duration: integer("duration").generatedAlwaysAs(
      sql`EXTRACT(EPOCH FROM ("ended_at" - "started_at"))::integer`,
    ),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("time_entries_userId_idx").on(table.userId),
    index("time_entries_taskId_idx").on(table.taskId),
  ],
);

export const timeEntryRelations = relations(timeEntriesTable, ({ one }) => ({
  user: one(user, {
    fields: [timeEntriesTable.userId],
    references: [user.id],
  }),
  task: one(tasksTable, {
    fields: [timeEntriesTable.taskId],
    references: [tasksTable.id],
  }),
}));

export type TimeEntry = InferSelectModel<typeof timeEntriesTable>;
