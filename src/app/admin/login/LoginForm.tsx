"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { loginAction, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="mt-7 space-y-4" noValidate>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-[#071C2C]">मोबाईल नंबर / ईमेल</span>
        <span className="relative block">
          <User className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#071C2C]/45" />
          <input
            name="loginId"
            type="text"
            inputMode="email"
            autoComplete="username"
            required
            className="h-12 w-full rounded-xl border border-[#071C2C]/15 bg-white pl-11 pr-3 text-base outline-none transition focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/15"
            placeholder="98XXXXXXXX"
          />
        </span>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-[#071C2C]">पासवर्ड</span>
        <span className="relative block">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#071C2C]/45" />
          <input
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            className="h-12 w-full rounded-xl border border-[#071C2C]/15 bg-white pl-11 pr-12 text-base outline-none transition focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/15"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "पासवर्ड लपवा" : "पासवर्ड दाखवा"}
            className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-[#071C2C]/55 hover:bg-[#071C2C]/5"
          >
            {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        </span>
      </label>

      {state.error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#071C2C] text-base font-bold text-white transition hover:bg-[#0D9488] disabled:opacity-70"
      >
        {pending ? <Loader2 className="size-5 animate-spin" /> : null}
        {pending ? "तपासत आहे…" : "लॉगिन करा"}
      </button>
    </form>
  );
}
