import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { InferSelectModel, relations } from "drizzle-orm";

export const tasksTable = pgTable(
  "tasks",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    title: varchar({ length: 500 }).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
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

export const taskRelations = relations(tasksTable, ({ one }) => ({
  user: one(user, {
    fields: [tasksTable.userId],
    references: [user.id],
  }),
}));

export type Task = InferSelectModel<typeof tasksTable>;
