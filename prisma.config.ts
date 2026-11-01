import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node --env-file=.env prisma/seed.mjs",
  },
  datasource: {
    // Для команд Prisma CLI (миграции, Studio) нужны расширенные права.
    // Если отдельный адрес не задан, используется обычный.
    url: process.env["MIGRATION_DATABASE_URL"] ?? process.env["DATABASE_URL"],
  },
});