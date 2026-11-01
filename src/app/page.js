import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/actions/auth";

export const instant = false;

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="container py-5">
      <h1 className="h3">Главная</h1>
      <p>
        Вы вошли как <strong>{user.username}</strong> (роль: {user.role})
      </p>
      <form action={logout}>
        <button type="submit" className="btn btn-outline-secondary">
          Выйти
        </button>
      </form>
    </main>
  );
}