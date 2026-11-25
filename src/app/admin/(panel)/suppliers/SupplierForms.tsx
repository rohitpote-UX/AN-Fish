"use client";

import { useActionState, useRef } from "react";
import { createSupplierAction, paySupplierAction, toggleSupplierAction, type SupState } from "./actions";

const inp = "h-11 w-full rounded-lg border border-[#172B3A]/15 bg-white px-3 outline-none focus:border-[#0EA5A0] focus:ring-2 focus:ring-[#0EA5A0]/20";
const l = "mb-1 block text-xs font-semibold text-[#7A8794]";
const Msg = ({ st }: { st: SupState }) => <>{st.ok && <span className="text-sm font-bold text-[#16A36A]">{st.ok}</span>}{st.error && <span role="alert" className="text-sm font-bold text-[#DC5252]">{st.error}</span>}</>;

export function NewSupplierForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [st, action, pending] = useActionState<SupState, FormData>(async (p, f) => { const r = await createSupplierAction(p, f); if (r.ok) ref.current?.reset(); return r; }, {});
  return (
    <form ref={ref} action={action} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <label className="block"><span className={l}>नाव</span><input name="name" required className={inp} /></label>
      <label className="block"><span className={l}>मोबाईल</span><input name="phone" inputMode="tel" className={inp} /></label>
      <label className="block"><span className={l}>प्रकार (बंदर / शेत / व्यापारी)</span><input name="type" className={inp} /></label>
      <label className="block sm:col-span-2"><span className={l}>पत्ता</span><input name="address" className={inp} /></label>
      <label className="block"><span className={l}>पेमेंट अटी</span><input name="terms" placeholder="उदा. ७ दिवसांत" className={inp} /></label>
      <label className="block"><span className={l}>आधीची बाकी रक्कम (₹)</span><input name="opening" type="number" min="0" step="0.01" className={inp} /></label>
      <div className="flex items-end gap-3 sm:col-span-2"><button disabled={pending} className="h-11 rounded-lg bg-[#0EA5A0] px-5 text-sm font-bold text-white hover:bg-[#071D2B]">पुरवठादार जोडा</button><Msg st={st} /></div>
    </form>
  );
}

export function PaySupplierForm({ supplierId }: { supplierId: number }) {
  const ref = useRef<HTMLFormElement>(null);
  const [st, action, pending] = useActionState<SupState, FormData>(async (p, f) => { const r = await paySupplierAction(supplierId, p, f); if (r.ok) ref.current?.reset(); return r; }, {});
  return (
    <form ref={ref} action={action} className="flex flex-wrap items-end gap-3">
      <label className="block"><span className={l}>रक्कम (₹)</span><input name="amount" type="number" step="0.01" min="0.01" required className={inp + " w-40"} /></label>
      <label className="block"><span className={l}>पद्धत</span><select name="mode" className={inp + " w-32"}><option value="cash">रोख</option><option value="upi">UPI</option><option value="bank">बँक</option><option value="other">इतर</option></select></label>
      <label className="block"><span className={l}>टीप</span><input name="note" maxLength={200} className={inp + " w-56"} /></label>
      <button disabled={pending} className="h-11 rounded-lg bg-[#071D2B] px-5 text-sm font-bold text-white hover:bg-[#0EA5A0]">पेमेंट नोंदवा</button>
      <Msg st={st} />
    </form>
  );
}

export function ToggleSupplier({ id, active }: { id: number; active: boolean }) {
  return <form action={toggleSupplierAction.bind(null, id)}><button className="!min-h-0 h-9 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-bold hover:bg-[#172B3A]/5">{active ? "बंद करा" : "सुरू करा"}</button></form>;
}
