"use client";

import { useActionState } from "react";
import { resetPasswordAction, toggleBranchAction, type FormState } from "../actions";

export function BranchControls({ branchId, active, canToggle }: { branchId: number; active: boolean; canToggle: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(resetPasswordAction.bind(null, branchId), {});
  return (
    <div className="flex flex-wrap items-end gap-3">
      <form action={action} className="flex flex-wrap items-end gap-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">नवीन पासवर्ड</span>
          <input name="password" type="text" minLength={8} required autoComplete="off" className="h-11 w-52 rounded-lg border border-[#071C2C]/15 px-3 outline-none focus:border-[#0D9488]" />
        </label>
        <button disabled={pending} className="h-11 rounded-lg bg-[#071C2C] px-4 text-sm font-bold text-white hover:bg-[#0D9488]">पासवर्ड बदला</button>
      </form>
      {canToggle && <form action={toggleBranchAction.bind(null, branchId)}>
        <button className={`h-11 rounded-lg border px-4 text-sm font-bold ${active ? "border-red-200 text-red-600 hover:bg-red-50" : "border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/10"}`}>
          {active ? "शाखा बंद करा" : "शाखा सुरू करा"}
        </button>
      </form>}
      {state.ok && <span className="text-sm font-bold text-[#0D9488]">{state.ok}</span>}
      {state.error && <span className="text-sm font-bold text-red-600">{state.error}</span>}
    </div>
  );
}
