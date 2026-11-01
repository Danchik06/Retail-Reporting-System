"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const createSellerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Логин должен быть не короче 3 символов")
    .max(50, "Логин должен быть не длиннее 50 символов")
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      "Логин: только латинские буквы, цифры и символы _ . -"
    ),
  password: z
    .string()
    .min(10, "Пароль должен быть не короче 10 символов")
    .refine(
      (value) => new TextEncoder().encode(value).length <= 72,
      "Пароль слишком длинный"
    ),
  branchId: z.coerce.number().int().positive("Выберите филиал"),
});

export async function createSeller(prevState, formData) {
  // Проверка роли внутри действия: его можно вызвать и без страницы
  await requireRole("ADMIN");

  const rawUsername = formData.get("username");
  const username = typeof rawUsername === "string" ? rawUsername : "";

  const parsed = createSellerSchema.safeParse({
    username: rawUsername,
    password: formData.get("password"),
    branchId: formData.get("branchId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, username };
  }

  const data = parsed.data;

  const branch = await prisma.branch.findUnique({
    where: { id: data.branchId },
  });
  if (!branch) {
    return { error: "Выбранный филиал не найден", username };
  }

  const existing = await prisma.user.findUnique({
    where: { username: data.username },
  });
  if (existing) {
    return { error: "Такой логин уже занят", username };
  }

  // Роль задаётся на сервере, из формы она не принимается
  const sellerRole = await prisma.role.findUnique({
    where: { name: "SELLER" },
  });
  if (!sellerRole) {
    throw new Error("Роль SELLER не найдена. Запустите: npx prisma db seed");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  try {
    await prisma.user.create({
      data: {
        username: data.username,
        passwordHash,
        roleId: sellerRole.id,
        branchId: branch.id,
      },
    });
  } catch (error) {
    // Запасная защита: два администратора создали один логин одновременно
    if (error?.code === "P2002") {
      return { error: "Такой логин уже занят", username };
    }
    throw error;
  }

  return { success: `Продавец "${data.username}" создан` };
}