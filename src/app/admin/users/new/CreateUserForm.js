"use client";

import { useActionState } from "react";
import { createSeller } from "./actions";

export default function CreateUserForm({ branches }) {
  const [state, formAction, pending] = useActionState(createSeller, null);

  return (
    <form action={formAction} className="card card-body shadow-sm">
      {state?.error && (
        <div className="alert alert-danger py-2" role="alert">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="alert alert-success py-2" role="status">
          {state.success}
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
          defaultValue={state?.username ?? ""}
          autoComplete="off"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Пароль (не короче 10 символов)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="form-control"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="branchId" className="form-label">
          Филиал
        </label>
        <select
          id="branchId"
          name="branchId"
          className="form-select"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Выберите филиал
          </option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Создание..." : "Создать продавца"}
      </button>
    </form>
  );
}