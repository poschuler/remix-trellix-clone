import type { Config } from "drizzle-kit";

export default {
  schema: "./app/db/scheme/schema.server.ts",
  out: "./app/db/migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
