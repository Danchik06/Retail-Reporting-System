"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="card card-body shadow-sm">
      <h1 className="h4 mb-3">Вход в систему</h1>

      {state?.error && (
        <div className="alert alert-danger py-2" role="alert">
          {state.error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Логин
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="form-control"
          autoComplete="username"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="form-control"
          autoComplete="current-password"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}