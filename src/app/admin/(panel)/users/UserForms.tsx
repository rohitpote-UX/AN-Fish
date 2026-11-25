"use client";

import { useActionState } from "react";
import { createUserAction, resetUserPasswordAction, toggleUserAction, type UState } from "./actions";

const inp = "h-11 w-full rounded-lg border border-[#172B3A]/15 bg-white px-3 outline-none focus:border-[#0EA5A0]";

export function NewUserForm({ branches }: { branches: { id: number; name: string }[] }) {
  const [st, action, pending] = useActionState<UState, FormData>(createUserAction, {});
  const l = "mb-1 block text-xs font-semibold text-[#7A8794]";
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <label className="block"><span className={l}>भूमिका</span>
        <select name="role" className={inp}><option value="branch_admin">मॅनेजर (स्टॉक, भाव, ऑर्डर्स, रिपोर्ट्स)</option><option value="counter">कॅशियर (फक्त बिलिंग)</option></select></label>
      <label className="block"><span className={l}>शाखा</span>
        <select name="branchId" className={inp}>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
      <label className="block"><span className={l}>नाव</span><input name="name" required className={inp} /></label>
      <label className="block"><span className={l}>लॉगिन आयडी (मोबाईल / ईमेल)</span><input name="loginId" required autoComplete="off" className={inp} /></label>
      <label className="block"><span className={l}>पासवर्ड (किमान ८)</span><input name="password" type="text" minLength={8} required autoComplete="off" className={inp} /></label>
      <div className="flex items-end gap-3">
        <button disabled={pending} className="h-11 rounded-lg bg-[#0EA5A0] px-5 text-sm font-bold text-white hover:bg-[#071D2B]">वापरकर्ता जोडा</button>
      </div>
      <div className="sm:col-span-2 lg:col-span-3">
        {st.ok && <span className="text-sm font-bold text-[#16A36A]">{st.ok}</span>}
        {st.error && <span role="alert" className="text-sm font-bold text-[#DC5252]">{st.error}</span>}
      </div>
    </form>
  );
}

export function UserActions({ id, active }: { id: number; active: boolean }) {
  const [st, action, pending] = useActionState<UState, FormData>(resetUserPasswordAction.bind(null, id), {});
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <form action={action} className="flex items-center gap-2">
        <input name="password" type="text" minLength={8} required placeholder="नवीन पासवर्ड" autoComplete="off" className="h-9 w-36 rounded-lg border border-[#172B3A]/15 px-2.5 text-sm outline-none focus:border-[#0EA5A0]" />
        <button disabled={pending} className="!min-h-0 h-9 rounded-lg bg-[#071D2B] px-3 text-sm font-bold text-white hover:bg-[#0EA5A0]">बदला</button>
      </form>
      <form action={toggleUserAction.bind(null, id)}><button className="!min-h-0 h-9 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-bold hover:bg-[#172B3A]/5">{active ? "बंद करा" : "सुरू करा"}</button></form>
      {st.ok && <span className="text-xs font-bold text-[#16A36A]">{st.ok}</span>}
      {st.error && <span className="text-xs font-bold text-[#DC5252]">{st.error}</span>}
    </div>
  );
}
