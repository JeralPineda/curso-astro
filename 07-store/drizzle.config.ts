import "dotenv/config";
import { defineConfig } from "drizzle-kit";

console.log("URL:", process.env.TURSO_DATABASE_URL);
console.log("TOKEN:", process.env.TURSO_AUTH_TOKEN?.slice(0, 10));

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
