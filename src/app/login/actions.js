"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { takeLoginAttempt, resetLoginAttempts } from "@/lib/rate-limit";

const loginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

// Фиктивный хеш: нужен, чтобы время проверки не зависело от того,
// существует ли пользователь. Создаётся один раз при запуске сервера
// с той же стоимостью (12), что и у настоящих паролей.
const DUMMY_HASH = bcrypt.hashSync("fixed-string-that-nobody-uses", 12);

const GENERIC_ERROR = "Неверный логин или пароль";

export async function login(prevState, formData) {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: GENERIC_ERROR };
  }

  const { username, password } = parsed.data;

  // Ограничение попыток: засчитываем попытку до проверки пароля
  const limitKey = username.toLowerCase();
  const attempt = takeLoginAttempt(limitKey);

  if (!attempt.allowed) {
    const minutes = Math.ceil(attempt.retryAfterSeconds / 60);
    return {
      error: `Слишком много попыток входа. Повторите через ${minutes} мин.`,
    };
  }

  const user = await prisma.user.findUnique({
    where: { username },
    include: { role: true },
  });

  const isValid = await bcrypt.compare(
    password,
    user ? user.passwordHash : DUMMY_HASH
  );

  if (!user || !isValid) {
    return { error: GENERIC_ERROR };
  }

  resetLoginAttempts(limitKey);
  await createSession(user.id, user.role.name);
  redirect("/");
}