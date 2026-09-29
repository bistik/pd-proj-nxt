import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/*schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // replace with "mysql" or "sqlite" if needed
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
