"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { updateBranchAction, type EState } from "../edit-actions";

const inp = "h-11 w-full rounded-lg border border-[#071C2C]/15 bg-white px-3 outline-none focus:border-[#0D9488]";

export function EditBranchPanel({ branchId, b }: { branchId: number; b: { name: string; address: string; whatsapp: string; openTime: string; lat: string; lng: string } }) {
  const [open, setOpen] = useState(false);
  const [st, action, pending] = useActionState<EState, FormData>(updateBranchAction.bind(null, branchId), {});
  return (
    <div className="mt-4 border-t border-[#071C2C]/8 pt-4">
      <button onClick={() => setOpen((v) => !v)} className="flex !min-h-0 h-10 items-center gap-2 rounded-lg border border-[#071C2C]/15 px-4 text-sm font-bold hover:bg-[#071C2C]/5"><Pencil className="size-4" /> शाखेची माहिती बदला</button>
      {open && (
        <form action={action} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">शाखेचे नाव</span><input name="name" defaultValue={b.name} required className={inp} /></label>
          <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">पत्ता</span><input name="address" defaultValue={b.address} className={inp} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">WhatsApp (देशकोडासह, फक्त आकडे)</span><input name="whatsapp" defaultValue={b.whatsapp} required inputMode="numeric" className={inp} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">वेळ</span><input name="openTime" defaultValue={b.openTime} className={inp} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">Latitude</span><input name="lat" defaultValue={b.lat} inputMode="decimal" className={inp} /></label>
          <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">Longitude</span><input name="lng" defaultValue={b.lng} inputMode="decimal" className={inp} /></label>
          <div className="flex items-center gap-3 sm:col-span-2">
            <button disabled={pending} className="h-11 rounded-lg bg-[#071C2C] px-5 text-sm font-bold text-white hover:bg-[#0D9488]">सेव्ह करा</button>
            {st.ok && <span className="text-sm font-bold text-[#0D9488]">{st.ok}</span>}
            {st.error && <span role="alert" className="text-sm font-bold text-red-600">{st.error}</span>}
          </div>
        </form>
      )}
    </div>
  );
}
