import { requireRole } from "@/lib/auth";

export const instant = false;

export default async function AdminPage() {
  const user = await requireRole("ADMIN");

  return (
    <main className="container py-5">
      <h1 className="h3">Панель администратора</h1>
      <p>
        Эта страница доступна только роли ADMIN. Вы: <strong>{user.username}</strong>
      </p>
    </main>
  );
}