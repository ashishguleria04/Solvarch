import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * Prisma config (replaces the deprecated `package.json#prisma` key).
 *
 * `dotenv/config` is imported first so that `DATABASE_URL` from `.env` is
 * always loaded for every Prisma CLI command (validate, db push, migrate,
 * db seed, studio) regardless of the working directory or shell — Prisma
 * stops auto-loading `.env` once this config file exists.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed/seed.ts",
  },
});
