import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/session";

// Возвращает актуального пользователя из БД или null, если не авторизован.
// Роль берём из БД, а не из токена.
export const getCurrentUser = cache(async () => {
  const session = await readSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      branchId: true,
      role: { select: { name: true } },
    },
  });

  if (!user) return null; // пользователя удалили

  return {
    id: user.id,
    username: user.username,
    branchId: user.branchId,
    role: user.role.name,
  };
});

// Нужно быть вошедшим. Иначе отправляем на страницу входа.
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

// Нужна одна из перечисленных ролей. Пример: requireRole("ADMIN").
// Если вошёл, но роль не подходит, отправляем на главную.
export async function requireRole(...allowedRoles) {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    redirect("/");
  }
  return user;
}