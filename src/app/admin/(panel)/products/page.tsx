import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { requireSuper } from "@/lib/adminAuth";
import { SPECIES_LIST } from "@/data/species";
import { NewCategoryForm, NewProductForm, ProductRow } from "./ProductForms";

export default async function ProductsPage() {
  await requireSuper();
  const [fish] = await db().query<RowDataPacket[]>("SELECT id, slug, name_mr, name_en, category, image_url, is_active FROM fish_items ORDER BY is_active DESC, sort_order, id");
  const [cats] = await db().query<RowDataPacket[]>("SELECT slug, name_mr FROM categories WHERE is_active=1 ORDER BY sort_order, id");
  const categories = cats.map((c) => ({ slug: c.slug as string, nameMr: c.name_mr as string }));
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">उत्पादने (Products)</h1>
        <p className="text-sm text-[#7A8794]">सर्व शाखांसाठी मासे / सीफूडची एकच यादी. येथे जोडलेले उत्पादन सर्व शाखांच्या स्टॉक व बिलिंग स्क्रीनवर दिसते. बंद केलेले उत्पादन लपते, पण जुन्या विक्रीचा इतिहास तसाच राहतो.</p>
      </div>
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8">
        <h2 className="mb-4 text-lg font-extrabold">नवीन उत्पादन</h2>
        <NewProductForm cats={categories} />
      </section>
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#172B3A]/8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="bg-[#F5F7FA] text-xs font-bold text-[#7A8794]"><th className="px-4 py-3">उत्पादन</th><th>कॅटेगरी</th><th>स्थिती</th><th /></tr></thead>
            <tbody>
              {fish.map((f) => (
                <ProductRow key={f.id} id={f.id} nameMr={f.name_mr} nameEn={f.name_en} category={f.category ?? ""} imageUrl={f.image_url ?? ""}
                  image={f.image_url || SPECIES_LIST.find((s) => s.slug === f.slug)?.image || null} active={!!f.is_active} cats={categories} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#172B3A]/8">
        <h2 className="mb-1 text-lg font-extrabold">कॅटेगरी</h2>
        <p className="mb-4 text-sm text-[#7A8794]">सध्या: {categories.map((c) => c.nameMr).join(" · ")}</p>
        <NewCategoryForm />
      </section>
    </div>
  );
}
