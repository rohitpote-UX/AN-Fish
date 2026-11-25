"use client";

import { useActionState } from "react";
import { createHeadAction, resetHeadPasswordAction, toggleHeadAction, type AccState } from "./actions";

const inp = "h-11 w-full rounded-lg border border-[#071C2C]/15 bg-white px-3 outline-none focus:border-[#0D9488]";

export function CreateHeadForm() {
  const [st, action, pending] = useActionState<AccState, FormData>(createHeadAction, {});
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-3">
      <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">नाव</span><input name="name" required className={inp} /></label>
      <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">लॉगिन आयडी (मोबाईल / ईमेल)</span><input name="loginId" required autoComplete="off" className={inp} /></label>
      <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">पासवर्ड (किमान ८)</span><input name="password" type="text" minLength={8} required autoComplete="off" className={inp} /></label>
      <div className="flex items-center gap-3 sm:col-span-3">
        <button disabled={pending} className="h-11 rounded-lg bg-[#0D9488] px-5 text-sm font-bold text-white hover:bg-[#071C2C]">खाते तयार करा</button>
        {st.ok && <span className="text-sm font-bold text-[#0D9488]">{st.ok}</span>}
        {st.error && <span className="text-sm font-bold text-red-600">{st.error}</span>}
      </div>
    </form>
  );
}

export function HeadRow({ id, name, loginId, active }: { id: number; name: string; loginId: string; active: boolean }) {
  const [st, action, pending] = useActionState<AccState, FormData>(resetHeadPasswordAction.bind(null, id), {});
  return (
    <li className="flex flex-wrap items-end justify-between gap-3 rounded-xl border border-[#071C2C]/10 p-4">
      <div>
        <p className="font-extrabold">{name} {!active && <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">बंद</span>}</p>
        <p className="text-sm text-[#071C2C]/60">{loginId}</p>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <form action={action} className="flex items-end gap-2">
          <input name="password" type="text" minLength={8} required placeholder="नवीन पासवर्ड" autoComplete="off" className={inp + " w-44"} />
          <button disabled={pending} className="h-11 rounded-lg bg-[#071C2C] px-3 text-sm font-bold text-white hover:bg-[#0D9488]">बदला</button>
        </form>
        <form action={toggleHeadAction.bind(null, id)}>
          <button className="h-11 rounded-lg border border-[#071C2C]/20 px-3 text-sm font-bold hover:bg-[#071C2C]/5">{active ? "बंद करा" : "सुरू करा"}</button>
        </form>
        {st.ok && <span className="text-sm font-bold text-[#0D9488]">{st.ok}</span>}
        {st.error && <span className="text-sm font-bold text-red-600">{st.error}</span>}
      </div>
    </li>
  );
}
