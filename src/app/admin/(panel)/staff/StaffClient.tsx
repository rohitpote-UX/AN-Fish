"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Wallet } from "lucide-react";
import { createStaffAction, deleteStaffPaymentAction, markAttendanceAction, payStaffAction, toggleStaffAction, updateStaffAction, type StState } from "./actions";

const inp = "h-11 w-full rounded-lg border border-[#172B3A]/15 bg-white px-3 outline-none focus:border-[#0EA5A0] focus:ring-2 focus:ring-[#0EA5A0]/20";
const l = "mb-1 block text-xs font-semibold text-[#7A8794]";
const Msg = ({ st }: { st: StState }) => <>{st.ok && <span className="text-sm font-bold text-[#16A36A]">{st.ok}</span>}{st.error && <span role="alert" className="text-sm font-bold text-[#DC5252]">{st.error}</span>}</>;

export function NewStaffForm({ branchId, branches }: { branchId: number; branches?: { id: number; name: string }[] }) {
  const ref = useRef<HTMLFormElement>(null);
  const [st, action, pending] = useActionState<StState, FormData>(async (p, f) => { const r = await createStaffAction(p, f); if (r.ok) ref.current?.reset(); return r; }, {});
  return (
    <form ref={ref} action={action} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {branches ? <label className="block"><span className={l}>शाखा</span><select name="branchId" defaultValue={branchId} className={inp}>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label> : <input type="hidden" name="branchId" value={branchId} />}
      <label className="block"><span className={l}>नाव</span><input name="name" required className={inp} /></label>
      <label className="block"><span className={l}>मोबाईल</span><input name="phone" inputMode="tel" className={inp} /></label>
      <label className="block"><span className={l}>काम (कटर / विक्रेता / मदतनीस)</span><input name="title" className={inp} /></label>
      <label className="block"><span className={l}>मासिक पगार (₹)</span><input name="salary" type="number" min="0" step="0.01" className={inp} /></label>
      <label className="block"><span className={l}>रुजू झाल्याची तारीख</span><input name="joined" type="date" className={inp} /></label>
      <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-4"><button disabled={pending} className="h-11 rounded-lg bg-[#0EA5A0] px-5 text-sm font-bold text-white hover:bg-[#071D2B]">कर्मचारी जोडा</button><Msg st={st} /></div>
    </form>
  );
}

const OPTS = [["present", "हजर", "bg-[#16A36A] text-white"], ["half", "अर्धा", "bg-amber-400 text-[#071D2B]"], ["absent", "गैरहजर", "bg-[#DC5252] text-white"], ["leave", "रजा", "bg-sky-500 text-white"]] as const;

export function AttendanceButtons({ staffId, day, current }: { staffId: number; day: string; current: string | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap gap-1.5">
      {OPTS.map(([k, label, on]) => (
        <button key={k} disabled={pending} onClick={() => start(async () => { await markAttendanceAction(staffId, day, k); router.refresh(); })}
          className={`!min-h-0 h-10 rounded-lg px-3.5 text-sm font-bold transition ${current === k ? on : "bg-[#172B3A]/6 text-[#172B3A]/70 hover:bg-[#172B3A]/12"}`}>{label}</button>
      ))}
    </div>
  );
}

export function EditStaff({ id, name, phone, title, salary, joined, active }: { id: number; name: string; phone: string; title: string; salary: number; joined: string; active: boolean }) {
  const [open, setOpen] = useState(false);
  const [st, action, pending] = useActionState<StState, FormData>(updateStaffAction.bind(null, id), {});
  return (
    <div>
      <div className="flex gap-2">
        <button onClick={() => setOpen((v) => !v)} className="flex !min-h-0 h-9 items-center gap-1.5 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-bold hover:bg-[#172B3A]/5"><Pencil className="size-3.5" /> बदला</button>
        <form action={toggleStaffAction.bind(null, id)}><button className="!min-h-0 h-9 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-bold hover:bg-[#172B3A]/5">{active ? "कामावरून काढा" : "पुन्हा सुरू"}</button></form>
      </div>
      {open && (
        <form action={action} className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <input name="name" defaultValue={name} required className={inp} aria-label="नाव" /><input name="phone" defaultValue={phone} className={inp} aria-label="मोबाईल" placeholder="मोबाईल" />
          <input name="title" defaultValue={title} className={inp} aria-label="काम" placeholder="काम" /><input name="salary" type="number" min="0" step="0.01" defaultValue={salary} className={inp} aria-label="पगार" />
          <input name="joined" type="date" defaultValue={joined} className={inp} aria-label="रुजू तारीख" />
          <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-5"><button disabled={pending} className="h-10 rounded-lg bg-[#071D2B] px-5 text-sm font-bold text-white hover:bg-[#0EA5A0]">सेव्ह</button><Msg st={st} /></div>
        </form>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Advance (उचल) / salary payments
// ---------------------------------------------------------------------------------------------
export function PayStaff({ staffId, name, month, today, dueThisMonth, advanceOut }: { staffId: number; name: string; month: string; today: string; dueThisMonth: number; advanceOut: number }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<"advance" | "salary" | "bonus">("advance");
  const [recover, setRecover] = useState(String(Math.min(advanceOut, dueThisMonth) || ""));
  const [amount, setAmount] = useState(String(Math.max(0, Math.round(dueThisMonth - Math.min(advanceOut, dueThisMonth))) || ""));
  const ref = useRef<HTMLFormElement>(null);
  const [st, action, pending] = useActionState<StState, FormData>(async (p, f) => { const r = await payStaffAction(staffId, p, f); if (r.ok) { ref.current?.reset(); setOpen(false); } return r; }, {});
  const seg = (on: boolean) => `!min-h-0 h-10 flex-1 rounded-lg text-sm font-bold ${on ? "bg-[#071D2B] text-white" : "bg-[#172B3A]/6 text-[#172B3A]/70"}`;
  return (
    <div>
      <button onClick={() => setOpen((v) => !v)} className="flex !min-h-0 h-9 items-center gap-1.5 rounded-lg bg-[#0EA5A0] px-3 text-sm font-bold text-white hover:bg-[#071D2B]"><Wallet className="size-3.5" /> पगार / उचल</button>
      {open && (
        <form ref={ref} action={action} className="mt-3 w-[min(92vw,420px)] space-y-3 rounded-xl border border-[#172B3A]/10 bg-[#F5F7FA] p-4 text-left">
          <p className="font-extrabold">{name}</p>
          <input type="hidden" name="kind" value={kind} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setKind("advance")} className={seg(kind === "advance")}>उचल द्या</button>
            <button type="button" onClick={() => setKind("salary")} className={seg(kind === "salary")}>पगार द्या</button>
            <button type="button" onClick={() => setKind("bonus")} className={seg(kind === "bonus")}>बोनस</button>
          </div>
          {kind === "salary" && (
            <>
              <label className="block"><span className={l}>कोणत्या महिन्याचा पगार</span><input name="forMonth" type="month" defaultValue={month} className={inp} /></label>
              <p className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#172B3A]/75">या महिन्याचा अंदाजे बाकी पगार: <b>₹{Math.round(dueThisMonth).toLocaleString("en-IN")}</b> · बाकी उचल: <b className={advanceOut > 0 ? "text-[#DC5252]" : ""}>₹{Math.round(advanceOut).toLocaleString("en-IN")}</b></p>
              <label className="block"><span className={l}>उचल कपात (₹)</span><input name="recovered" type="number" min="0" step="0.01" value={recover} onChange={(e) => { setRecover(e.target.value); setAmount(String(Math.max(0, Math.round(dueThisMonth - (Number(e.target.value) || 0))))); }} className={inp} /></label>
            </>
          )}
          <label className="block"><span className={l}>{kind === "salary" ? "प्रत्यक्ष हातात दिलेली रक्कम (₹)" : "रक्कम (₹)"}</span><input name="amount" type="number" min="0" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} className={inp} /></label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block"><span className={l}>तारीख</span><input name="day" type="date" defaultValue={today} max={today} required className={inp} /></label>
            <label className="block"><span className={l}>पद्धत</span><select name="mode" className={inp}><option value="cash">रोख</option><option value="upi">UPI</option><option value="bank">बँक</option></select></label>
          </div>
          <label className="block"><span className={l}>टीप</span><input name="note" maxLength={200} className={inp} /></label>
          <div className="flex flex-wrap items-center gap-3"><button disabled={pending} className="h-10 rounded-lg bg-[#071D2B] px-5 text-sm font-bold text-white hover:bg-[#0EA5A0]">नोंदवा</button><Msg st={st} /></div>
        </form>
      )}
    </div>
  );
}

export function DeletePayment({ id }: { id: number }) {
  return (
    <form action={deleteStaffPaymentAction.bind(null, id)} onSubmit={(e) => { if (!window.confirm("ही नोंद रद्द करायची? जोडलेला खर्चही रद्द होईल.")) e.preventDefault(); }}>
      <button aria-label="Delete" className="grid size-9 !min-h-0 place-items-center rounded-lg text-[#DC5252] hover:bg-[#DC5252]/10"><Trash2 className="size-4" /></button>
    </form>
  );
}
