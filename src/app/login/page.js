import LoginForm from "./LoginForm";

export const metadata = { title: "Вход" };

export default function LoginPage() {
  return (
    <main className="container py-5" style={{ maxWidth: 420 }}>
      <LoginForm />
    </main>
  );
}