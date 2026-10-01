import { pgTable, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { InferSelectModel, relations } from "drizzle-orm";

export const projectsTable = pgTable(
  "projects",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("projects_userId_idx").on(table.userId)],
);

export const projectRelations = relations(projectsTable, ({ one }) => ({
  user: one(user, {
    fields: [projectsTable.userId],
    references: [user.id],
  }),
}));

export type Project = InferSelectModel<typeof projectsTable>;
