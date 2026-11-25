"use client";

import { useActionState, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { createCategoryAction, createProductAction, toggleProductAction, updateProductAction, type PState } from "./actions";

const inp = "h-11 w-full rounded-lg border border-[#172B3A]/15 bg-white px-3 outline-none focus:border-[#0EA5A0] focus:ring-2 focus:ring-[#0EA5A0]/20";
export type Cat = { slug: string; nameMr: string };

function Msg({ st }: { st: PState }) {
  return <>{st.ok && <span className="text-sm font-bold text-[#16A36A]">{st.ok}</span>}{st.error && <span role="alert" className="text-sm font-bold text-[#DC5252]">{st.error}</span>}</>;
}

export function NewProductForm({ cats }: { cats: Cat[] }) {
  const [st, action, pending] = useActionState<PState, FormData>(createProductAction, {});
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="block"><span className="mb-1 block text-xs font-semibold text-[#7A8794]">मराठी नाव</span><input name="nameMr" required className={inp} /></label>
      <label className="block"><span className="mb-1 block text-xs font-semibold text-[#7A8794]">इंग्रजी नाव</span><input name="nameEn" required className={inp} /></label>
      <label className="block"><span className="mb-1 block text-xs font-semibold text-[#7A8794]">कॅटेगरी</span>
        <select name="category" className={inp}>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.nameMr}</option>)}</select></label>
      <label className="block"><span className="mb-1 block text-xs font-semibold text-[#7A8794]">फोटो लिंक (ऐच्छिक)</span><input name="imageUrl" placeholder="/media/... किंवा https://..." className={inp} /></label>
      <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-4">
        <button disabled={pending} className="flex h-11 items-center gap-2 rounded-lg bg-[#0EA5A0] px-5 text-sm font-bold text-white hover:bg-[#071D2B]"><Plus className="size-4" /> उत्पादन जोडा</button>
        <Msg st={st} />
      </div>
    </form>
  );
}

export function ProductRow({ id, nameMr, nameEn, category, imageUrl, image, active, cats }: {
  id: number; nameMr: string; nameEn: string; category: string; imageUrl: string; image: string | null; active: boolean; cats: Cat[];
}) {
  const [edit, setEdit] = useState(false);
  const [st, action, pending] = useActionState<PState, FormData>(updateProductAction.bind(null, id), {});
  const catName = cats.find((c) => c.slug === category)?.nameMr ?? category;
  return (
    <>
      <tr className={`border-t border-[#172B3A]/8 ${active ? "" : "opacity-55"}`}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {image ? <img src={image} alt="" className="size-12 rounded-lg bg-[#F5F7FA] object-contain" /> : <span className="grid size-12 place-items-center rounded-lg bg-[#F5F7FA] text-xs text-[#7A8794]">फोटो नाही</span>}
            <div><p className="font-extrabold">{nameMr}</p><p className="text-xs text-[#7A8794]">{nameEn}</p></div>
          </div>
        </td>
        <td>{catName}</td>
        <td><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{active ? "सुरू" : "बंद"}</span></td>
        <td className="px-3 text-right">
          <div className="flex justify-end gap-2">
            <button onClick={() => setEdit((v) => !v)} className="flex !min-h-0 h-9 items-center gap-1.5 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-bold hover:bg-[#172B3A]/5"><Pencil className="size-3.5" /> बदला</button>
            <form action={toggleProductAction.bind(null, id)}><button className="!min-h-0 h-9 rounded-lg border border-[#172B3A]/15 px-3 text-sm font-bold hover:bg-[#172B3A]/5">{active ? "बंद करा" : "सुरू करा"}</button></form>
          </div>
        </td>
      </tr>
      {edit && (
        <tr className="bg-[#F5F7FA]"><td colSpan={4} className="px-4 py-4">
          <form action={action} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input name="nameMr" defaultValue={nameMr} required className={inp} aria-label="मराठी नाव" />
            <input name="nameEn" defaultValue={nameEn} required className={inp} aria-label="इंग्रजी नाव" />
            <select name="category" defaultValue={category} className={inp}>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.nameMr}</option>)}</select>
            <input name="imageUrl" defaultValue={imageUrl} placeholder="फोटो लिंक" className={inp} aria-label="फोटो लिंक" />
            <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-4">
              <button disabled={pending} className="h-10 rounded-lg bg-[#071D2B] px-5 text-sm font-bold text-white hover:bg-[#0EA5A0]">सेव्ह</button><Msg st={st} />
            </div>
          </form>
        </td></tr>
      )}
    </>
  );
}

export function NewCategoryForm() {
  const [st, action, pending] = useActionState<PState, FormData>(createCategoryAction, {});
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <label className="block"><span className="mb-1 block text-xs font-semibold text-[#7A8794]">मराठी नाव</span><input name="nameMr" required className={inp} /></label>
      <label className="block"><span className="mb-1 block text-xs font-semibold text-[#7A8794]">इंग्रजी नाव</span><input name="nameEn" required className={inp} /></label>
      <button disabled={pending} className="h-11 rounded-lg bg-[#071D2B] px-5 text-sm font-bold text-white hover:bg-[#0EA5A0]">कॅटेगरी जोडा</button>
      <Msg st={st} />
    </form>
  );
}
