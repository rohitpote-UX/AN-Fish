"use client";

import { useActionState, useRef } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { createExpenseAction, deleteExpenseAction, type XState } from "./actions";
import { EXPENSE_CATEGORIES, PAY_MODES } from "./categories";

const inp = "h-11 w-full rounded-lg border border-[#172B3A]/15 bg-white px-3 outline-none focus:border-[#0EA5A0] focus:ring-2 focus:ring-[#0EA5A0]/20";

export function ExpenseForm({ branches, isHead, today }: { branches: { id: number; name: string }[]; isHead: boolean; today: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const [st, action, pending] = useActionState<XState, FormData>(async (p, f) => { const r = await createExpenseAction(p, f); if (r.ok) ref.current?.reset(); return r; }, {});
  const l = "mb-1 block text-xs font-semibold text-[#7A8794]";
  return (
    <form ref={ref} action={action} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {isHead && (
        <label className="block lg:col-span-2"><span className={l}>शाखा</span>
          <select name="branch" className={inp}><option value="all">सर्व कंपनी (सामायिक खर्च)</option>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
      )}
      <label className="block"><span className={l}>तारीख</span><input name="day" type="date" required defaultValue={today} max={today} className={inp} /></label>
      <label className="block"><span className={l}>खर्चाचा प्रकार</span>
        <select name="category" className={inp}>{Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label className="block"><span className={l}>रक्कम (₹)</span><input name="amount" type="number" step="0.01" min="0.01" required className={inp} /></label>
      <label className="block"><span className={l}>पेमेंट</span>
        <select name="mode" className={inp}>{Object.entries(PAY_MODES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label className={`block ${isHead ? "lg:col-span-4" : "lg:col-span-3"}`}><span className={l}>टीप</span><input name="note" maxLength={200} className={inp} /></label>
      <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-6">
        <button disabled={pending} className="flex h-11 items-center gap-2 rounded-lg bg-[#071D2B] px-5 text-sm font-bold text-white hover:bg-[#0EA5A0] disabled:opacity-70">{pending && <Loader2 className="size-4 animate-spin" />} खर्च नोंदवा</button>
        {st.ok && <span className="text-sm font-bold text-[#16A36A]">{st.ok}</span>}
        {st.error && <span role="alert" className="text-sm font-bold text-[#DC5252]">{st.error}</span>}
      </div>
    </form>
  );
}

export function DeleteExpense({ id }: { id: number }) {
  return (
    <form action={deleteExpenseAction.bind(null, id)} onSubmit={(e) => { if (!window.confirm("हा खर्च रद्द करायचा?")) e.preventDefault(); }}>
      <button aria-label="Delete" className="grid size-9 !min-h-0 place-items-center rounded-lg text-[#DC5252] hover:bg-[#DC5252]/10"><Trash2 className="size-4" /></button>
    </form>
  );
}
