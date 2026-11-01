import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Переменная DATABASE_URL не задана в .env");
  }

  // Разбираем строку подключения mysql://user:password@host:port/database
  const url = new URL(databaseUrl);

  // Получение открытого ключа разрешаем только для базы на этом же компьютере
  const isLocalDatabase = ["localhost", "127.0.0.1"].includes(url.hostname);

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    connectionLimit: 5,
    allowPublicKeyRetrieval: isLocalDatabase,
  });

  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}