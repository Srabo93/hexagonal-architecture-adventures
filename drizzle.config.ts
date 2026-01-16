import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./DB/Postgres/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASEURL!,
  },
});
