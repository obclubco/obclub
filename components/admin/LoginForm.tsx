"use client";

import { useActionState } from "react";
import { login } from "../../app/admin/actions";
import { btnPrimary, input, label } from "./ui";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      <label className="block">
        <span className={label}>Login</span>
        <input name="user" autoComplete="username" required autoFocus className={input} />
      </label>
      <label className="block">
        <span className={label}>Password</span>
        <input name="password" type="password" autoComplete="current-password" required className={input} />
      </label>
      {state?.error && (
        <p role="alert" className="text-[13px] text-[#e5657a]">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${btnPrimary} mt-2 w-full`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
