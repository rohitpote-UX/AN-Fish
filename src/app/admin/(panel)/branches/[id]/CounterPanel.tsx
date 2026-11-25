"use client";

import { useActionState } from "react";
import { createCounterAction, resetCounterPasswordAction, toggleCounterAction, type CState } from "../counter-actions";

const inp = "h-11 w-full rounded-lg border border-[#071C2C]/15 bg-white px-3 outline-none focus:border-[#0D9488]";

function Row({ id, branchId, login, active }: { id: number; branchId: number; login: string; active: boolean }) {
  const [st, action, pending] = useActionState<CState, FormData>(resetCounterPasswordAction.bind(null, id, branchId), {});
  return (
    <li className="flex flex-wrap items-end justify-between gap-3 rounded-xl border border-[#071C2C]/10 p-3">
      <p className="font-bold">{login} {!active && <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">बंद</span>}</p>
      <div className="flex flex-wrap items-end gap-2">
        <form action={action} className="flex items-end gap-2">
          <input name="password" type="text" minLength={8} required placeholder="नवीन पासवर्ड" autoComplete="off" className={inp + " w-44"} />
          <button disabled={pending} className="h-11 rounded-lg bg-[#071C2C] px-3 text-sm font-bold text-white hover:bg-[#0D9488]">बदला</button>
        </form>
        <form action={toggleCounterAction.bind(null, id, branchId)}>
          <button className="h-11 rounded-lg border border-[#071C2C]/20 px-3 text-sm font-bold hover:bg-[#071C2C]/5">{active ? "बंद करा" : "सुरू करा"}</button>
        </form>
        {st.ok && <span className="text-sm font-bold text-[#0D9488]">{st.ok}</span>}
        {st.error && <span className="text-sm font-bold text-red-600">{st.error}</span>}
      </div>
    </li>
  );
}

export function CounterPanel({ branchId, counters }: { branchId: number; counters: { id: number; login: string; active: boolean }[] }) {
  const [st, action, pending] = useActionState<CState, FormData>(createCounterAction.bind(null, branchId), {});
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#071C2C]/10 sm:p-6">
      <h2 className="text-lg font-extrabold">काउंटर (बिलिंग) लॉगिन</h2>
      <p className="mb-4 text-sm text-[#071C2C]/60">या शाखेच्या काउंटरवरचा माणूस फक्त बिलिंग आणि आजची बिले पाहू शकतो. स्टॉक, भाव किंवा रिपोर्ट्स नाही.</p>
      {counters.length > 0 && <ul className="mb-5 space-y-2">{counters.map((c) => <Row key={c.id} id={c.id} branchId={branchId} login={c.login} active={c.active} />)}</ul>}
      <form action={action} className="grid gap-3 sm:grid-cols-3">
        <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">लॉगिन आयडी (मोबाईल / ईमेल)</span><input name="loginId" required autoComplete="off" className={inp} /></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">नाव (ऐच्छिक)</span><input name="name" className={inp} placeholder="Counter" /></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">पासवर्ड (किमान ८)</span><input name="password" type="text" minLength={8} required autoComplete="off" className={inp} /></label>
        <div className="flex items-center gap-3 sm:col-span-3">
          <button disabled={pending} className="h-11 rounded-lg bg-[#0D9488] px-5 text-sm font-bold text-white hover:bg-[#071C2C]">काउंटर लॉगिन तयार करा</button>
          {st.ok && <span className="text-sm font-bold text-[#0D9488]">{st.ok}</span>}
          {st.error && <span className="text-sm font-bold text-red-600">{st.error}</span>}
        </div>
      </form>
    </section>
  );
}
