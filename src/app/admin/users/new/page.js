import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CreateUserForm from "./CreateUserForm";

export const instant = false;

export default async function NewUserPage() {
  await requireRole("ADMIN");

  const branches = await prisma.branch.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="container py-5" style={{ maxWidth: 480 }}>
      <h1 className="h4 mb-3">Новый продавец</h1>
      {branches.length === 0 ? (
        <div className="alert alert-warning">
          Сначала нужно создать хотя бы один филиал.
        </div>
      ) : (
        <CreateUserForm branches={branches} />
      )}
    </main>
  );
}