"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { deletePaymentAction, recordPaymentAction, setFeeAction, type FormState } from "../actions";

export type Payment = { id: number; month: string; amount: number; paidOn: string; method: string | null; note: string | null };

const inp = "h-11 w-full rounded-lg border border-[#071C2C]/15 bg-white px-3 outline-none focus:border-[#0D9488]";

export function BillingPanel({ branchId, fee, payments, unpaidMonths, currentMonth, today }: {
  branchId: number; fee: number; payments: Payment[]; unpaidMonths: string[]; currentMonth: string; today: string;
}) {
  const [feeState, feeAction, feePending] = useActionState<FormState, FormData>(setFeeAction.bind(null, branchId), {});
  const [payState, payAction, payPending] = useActionState<FormState, FormData>(recordPaymentAction.bind(null, branchId), {});

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#071C2C]/10 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold">मासिक पेमेंट (फक्त Abnexa ला दिसते)</h2>
        {unpaidMonths.length > 0 ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">बाकी: {unpaidMonths.join(", ")}</span>
        ) : (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">सर्व पेमेंट जमा</span>
        )}
      </div>

      <form action={feeAction} className="mt-4 flex flex-wrap items-end gap-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">मासिक फी (₹)</span>
          <input name="fee" type="number" step="0.01" min="0" defaultValue={fee} className={inp + " w-40"} />
        </label>
        <button disabled={feePending} className="h-11 rounded-lg bg-[#071C2C] px-4 text-sm font-bold text-white hover:bg-[#0D9488]">फी सेव्ह</button>
        {feeState.ok && <span className="text-sm font-bold text-[#0D9488]">{feeState.ok}</span>}
        {feeState.error && <span className="text-sm font-bold text-red-600">{feeState.error}</span>}
      </form>

      <form action={payAction} className="mt-5 grid gap-3 border-t border-[#071C2C]/8 pt-5 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">कोणत्या महिन्याचे</span>
          <input name="month" type="month" required defaultValue={unpaidMonths[0] ?? currentMonth} className={inp} /></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">रक्कम (₹)</span>
          <input name="amount" type="number" step="0.01" min="0" required defaultValue={fee || ""} className={inp} /></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">मिळाल्याची तारीख</span>
          <input name="paidOn" type="date" required defaultValue={today} className={inp} /></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">पद्धत (UPI/रोख)</span>
          <input name="method" className={inp} /></label>
        <label className="block"><span className="mb-1 block text-xs font-semibold text-[#071C2C]/60">टीप</span>
          <input name="note" className={inp} /></label>
        <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-5">
          <button disabled={payPending} className="h-11 rounded-lg bg-[#0D9488] px-5 text-sm font-bold text-white hover:bg-[#071C2C]">पेमेंट नोंदवा</button>
          {payState.ok && <span className="text-sm font-bold text-[#0D9488]">{payState.ok}</span>}
          {payState.error && <span className="text-sm font-bold text-red-600">{payState.error}</span>}
        </div>
      </form>

      {payments.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="text-xs font-bold text-[#071C2C]/55"><th className="py-2">महिना</th><th>रक्कम</th><th>तारीख</th><th>पद्धत</th><th>टीप</th><th /></tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-[#071C2C]/8">
                  <td className="py-2 font-bold">{p.month}</td>
                  <td>₹{p.amount.toLocaleString("en-IN")}</td>
                  <td>{p.paidOn}</td>
                  <td>{p.method ?? "—"}</td>
                  <td className="max-w-[200px] truncate">{p.note ?? "—"}</td>
                  <td className="text-right">
                    <form action={deletePaymentAction.bind(null, p.id)}>
                      <button aria-label="Delete payment" className="grid size-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
