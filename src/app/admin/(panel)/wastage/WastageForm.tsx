"use client";

import { useActionState, useRef } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { createWastageAction, deleteWastageAction, type WState } from "./actions";
import { REASONS } from "./reasons";

const inp = "h-11 w-full rounded-lg border border-[#172B3A]/15 bg-white px-3 outline-none focus:border-[#0EA5A0] focus:ring-2 focus:ring-[#0EA5A0]/20";

export function WastageForm({ fish, branches, fixedBranch, today }: {
  fish: { id: number; name: string }[]; branches: { id: number; name: string }[]; fixedBranch: boolean; today: string;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [st, action, pending] = useActionState<WState, FormData>(async (p, f) => {
    const r = await createWastageAction(p, f);
    if (r.ok) ref.current?.reset();
    return r;
  }, {});
  const label = "mb-1 block text-xs font-semibold text-[#7A8794]";
  return (
    <form ref={ref} action={action} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {!fixedBranch && (
        <label className="block lg:col-span-2"><span className={label}>शाखा</span>
          <select name="branchId" required className={inp}>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
      )}
      <label className="block lg:col-span-2"><span className={label}>मासा</span>
        <select name="fishId" required className={inp}>{fish.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></label>
      <label className="block"><span className={label}>प्रमाण (kg)</span><input name="qty" type="number" step="0.01" min="0.01" required className={inp} /></label>
      <label className="block"><span className={label}>कारण</span>
        <select name="reason" required className={inp}>{Object.entries(REASONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label className="block"><span className={label}>तारीख</span><input name="day" type="date" required defaultValue={today} max={today} className={inp} /></label>
      <label className="block"><span className={label}>खरेदी भाव ₹/kg (ऐच्छिक)</span><input name="cost" type="number" step="0.01" min="0" className={inp} /></label>
      <label className="block lg:col-span-3"><span className={label}>टीप</span><input name="note" maxLength={300} className={inp} /></label>
      <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-6">
        <button disabled={pending} className="flex h-11 items-center gap-2 rounded-lg bg-[#071D2B] px-5 text-sm font-bold text-white hover:bg-[#0EA5A0] disabled:opacity-70">
          {pending && <Loader2 className="size-4 animate-spin" />} नोंद करा
        </button>
        {st.ok && <span className="text-sm font-bold text-[#16A36A]">{st.ok}</span>}
        {st.error && <span role="alert" className="text-sm font-bold text-[#DC5252]">{st.error}</span>}
      </div>
    </form>
  );
}

export function DeleteWastage({ id }: { id: number }) {
  return (
    <form
      action={deleteWastageAction.bind(null, id)}
      onSubmit={(e) => { if (!window.confirm("ही नोंद रद्द करायची? स्टॉक परत वाढेल.")) e.preventDefault(); }}
    >
      <button aria-label="Delete" className="grid size-9 !min-h-0 place-items-center rounded-lg text-[#DC5252] hover:bg-[#DC5252]/10"><Trash2 className="size-4" /></button>
    </form>
  );
}
