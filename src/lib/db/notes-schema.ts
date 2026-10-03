import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, index } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const notesTable = pgTable(
  "notes",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    title: text("title").notNull(),
    content: text("content").notNull(),
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
  (table) => [index("notes_userId_idx").on(table.userId)],
);

export const noteRelations = relations(notesTable, ({ one }) => ({
  user: one(user, {
    fields: [notesTable.userId],
    references: [user.id],
  }),
}));

export type Note = InferSelectModel<typeof notesTable>;
