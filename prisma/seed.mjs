import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const url = new URL(process.env.DATABASE_URL);

const isLocalDatabase = ["localhost", "127.0.0.1"].includes(url.hostname);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  connectionLimit: 2,
  allowPublicKeyRetrieval: isLocalDatabase,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Роли
  for (const name of ["ADMIN", "SELLER"]) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Роли созданы: ADMIN, SELLER");

  // 2. Первый администратор
  const username = process.env.SEED_ADMIN_USERNAME;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error("Задайте SEED_ADMIN_USERNAME и SEED_ADMIN_PASSWORD в .env");
  }
  if (password.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD должен быть не короче 12 символов");
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log(`Пользователь "${username}" уже существует, пропускаем`);
    return;
  }

  const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      username,
      passwordHash,
      roleId: adminRole.id,
      branchId: null, // у администратора нет филиала
    },
  });

  console.log(`Администратор "${username}" создан`);
}

main()
  .catch((error) => {
    console.error("Ошибка seed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());