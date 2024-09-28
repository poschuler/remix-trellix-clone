import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./scheme/schema.server";

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("Missing environment variable: TURSO_DATABASE_URL ");
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("Missing environment variable: TURSO_AUTH_TOKEN");
}

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso, { schema });
